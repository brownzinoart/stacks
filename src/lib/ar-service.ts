/**
 * AR Service for book shelf scanning and library navigation
 * Integrates OCR, camera access, and AR overlays
 */

import { ocrWorkerPool, OCRResult, ImagePreprocessOptions } from './ocr-worker-pool';
import { googleBooksAPI } from './google-books-api';
import { apiCache } from './api-cache';
import floorPlansData from '@/data/library-floorplans.json';
import type {
  FloorPlanData,
  UserPreferences,
  LibraryInventory,
  RecognizedBook,
  NavigationPath,
  LibraryFloorPlan,
  CameraPhoto,
  PermissionStatus,
  Waypoint,
} from '@/types/ar-types';

// Camera implementation for web - uses getUserMedia

// Camera implementation for web - uses getUserMedia
const Camera = {
  getPhoto: async (): Promise<CameraPhoto> => {
    // For web, we'll capture from video stream instead
    return { base64String: '' };
  },
  requestPermissions: async (): Promise<PermissionStatus> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return { camera: 'granted' };
    } catch {
      return { camera: 'denied' };
    }
  },
};

// Re-export types from centralized type definitions
export type {
  RecognizedBook,
  LibraryFloorPlan,
  NavigationPath,
} from '@/types/ar-types';

class ARService {
  private currentFloorPlan: LibraryFloorPlan | null = null;
  private lastImageHash: string | null = null;
  private cachedResults = new Map<string, RecognizedBook[]>();

  /**
   * Initialize OCR worker pool
   */
  async initializeOCR(): Promise<void> {
    try {
      await ocrWorkerPool.warmUp();
      console.log('OCR Worker Pool initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
      throw new Error('OCR initialization failed');
    }
  }

  /**
   * Cleanup OCR resources
   */
  async terminateOCR(): Promise<void> {
    await ocrWorkerPool.shutdown();
    this.cachedResults.clear();
  }

  /**
   * Request camera permissions
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Camera permission request failed:', error);
      return false;
    }
  }

  /**
   * Capture image from camera for AR processing
   */
  async captureShelfImage(): Promise<string> {
    try {
      const image = await Camera.getPhoto();
      return image.base64String || '';
    } catch (error) {
      console.error('Failed to capture image:', error);
      throw new Error('Camera capture failed');
    }
  }

  /**
   * Generate hash for image caching
   */
  private generateImageHash(imageDataUrl: string): string {
    // Simple hash based on image data length and first/last chars
    const data = imageDataUrl.split(',')[1] || imageDataUrl;
    return `${data.length}_${data.substring(0, 10)}_${data.substring(-10)}`;
  }

  /**
   * Process captured image to recognize book spines with optimization
   */
  async recognizeBooksFromImage(base64Image: string): Promise<RecognizedBook[]> {
    try {
      // Convert base64 to image data URL if needed
      const imageDataUrl = base64Image.startsWith('data:') 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`;

      // Check cache first
      const imageHash = this.generateImageHash(imageDataUrl);
      if (this.cachedResults.has(imageHash)) {
        console.log('Using cached OCR results');
        return this.cachedResults.get(imageHash)!;
      }

      // Optimize image for better OCR results
      const preprocessOptions: ImagePreprocessOptions = {
        resize: { width: 800, height: 600 }, // Reduce resolution for faster processing
        contrast: 1.3, // Increase contrast for better text recognition
        grayscale: true, // Convert to grayscale for better OCR
      };

      // Use optimized worker pool
      const ocrResult = await ocrWorkerPool.recognizeText(imageDataUrl, preprocessOptions);

      // Process OCR results into book objects
      const books: RecognizedBook[] = [];
      const processedTitles = new Set<string>();

      // Process lines first (better for book spines)
      if (ocrResult.lines) {
        for (const line of ocrResult.lines) {
          if (line.text.length > 3 && line.confidence > 40) {
            const bookInfo = this.parseBookInfo(line.text);
            if (bookInfo && !processedTitles.has(bookInfo.title)) {
              processedTitles.add(bookInfo.title);
              books.push({
                title: bookInfo.title,
                author: bookInfo.author,
                confidence: line.confidence,
                boundingBox: {
                  x: line.bbox.x0,
                  y: line.bbox.y0,
                  width: line.bbox.x1 - line.bbox.x0,
                  height: line.bbox.y1 - line.bbox.y0,
                },
              });
            }
          }
        }
      }

      // Process words for vertical text detection if no lines found
      if (ocrResult.words && books.length === 0) {
        const verticalGroups = this.groupVerticalWords(ocrResult.words);
        for (const group of verticalGroups) {
          if (group.length > 3) {
            const bookInfo = this.parseBookInfo(group);
            if (bookInfo && !processedTitles.has(bookInfo.title)) {
              processedTitles.add(bookInfo.title);
              books.push({
                title: bookInfo.title,
                author: bookInfo.author,
                confidence: 65,
                boundingBox: { x: 0, y: 0, width: 100, height: 50 },
              });
            }
          }
        }
      }

      // Cache results for future use
      this.cachedResults.set(imageHash, books);
      
      // Limit cache size to prevent memory issues
      if (this.cachedResults.size > 10) {
        const firstKey = this.cachedResults.keys().next().value;
        if (firstKey !== undefined) {
          this.cachedResults.delete(firstKey);
        }
      }

      console.log(`Recognized ${books.length} books from image (confidence avg: ${this.calculateAverageConfidence(books)}%)`);
      return books;
    } catch (error) {
      console.error('Book recognition failed:', error);
      return [];
    }
  }

  /**
   * Group words that are vertically aligned (for book spines)
   */
  private groupVerticalWords(words: OCRResult['words']): string[] {
    const groups: string[] = [];
    const sortedWords = words.sort((a, b) => a.bbox.y0 - b.bbox.y0);
    
    let currentGroup = '';
    let lastY = 0;
    const yThreshold = 25; // Pixels
    
    for (const word of sortedWords) {
      if (Math.abs(word.bbox.y0 - lastY) < yThreshold && currentGroup) {
        currentGroup += ' ' + word.text;
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup.trim());
        }
        currentGroup = word.text;
        lastY = word.bbox.y0;
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup.trim());
    }
    
    return groups;
  }

  /**
   * Calculate average confidence of recognized books
   */
  private calculateAverageConfidence(books: RecognizedBook[]): number {
    if (books.length === 0) return 0;
    const total = books.reduce((sum, book) => sum + book.confidence, 0);
    return Math.round(total / books.length);
  }

  /**
   * Parse text to extract book title and author
   */
  private parseBookInfo(text: string): { title: string; author?: string } | null {
    // Clean up the text
    const cleanedText = text.trim().replace(/\s+/g, ' ');

    // Simple heuristic: if text contains common separators, split into title/author
    const separators = [' by ', ' - ', ' : ', ' / '];
    for (const separator of separators) {
      if (cleanedText.includes(separator)) {
        const parts = cleanedText.split(separator);
        return {
          title: parts[0]?.trim() || cleanedText,
          author: parts[1]?.trim(),
        };
      }
    }

    // If no separator found, treat entire text as title
    return {
      title: cleanedText,
    };
  }

  /**
   * Match recognized books with user preferences and availability
   */
  async enrichBookData(
    books: RecognizedBook[],
    userPreferences: UserPreferences | null,
    libraryInventory: LibraryInventory | null
  ): Promise<RecognizedBook[]> {
    // Verify books with Google Books API
    const enrichedBooks = await Promise.all(
      books.map(async (book) => {
        // Verify the book title with Google Books
        const verifiedBook = await googleBooksAPI.verifyBook(book.title, book.author);
        
        if (verifiedBook) {
          // Use verified data if available
          const enriched: RecognizedBook = {
            ...book,
            title: verifiedBook.title || book.title,
            author: verifiedBook.authors?.join(', ') || book.author,
            confidence: Math.min(100, book.confidence + 20), // Boost confidence if verified
          };

          // Check if this book is in our floor plans data
          const floorData = floorPlansData as FloorPlanData;
          const bookLocation = floorData.bookLocations[enriched.title];
          enriched.isAvailable = bookLocation ? true : Math.random() > 0.3;
          
          // Simple recommendation logic based on user preferences
          enriched.isRecommended = this.checkIfRecommended(enriched, userPreferences);
          
          return enriched;
        }
        
        // Return original with random availability if not verified
        return {
          ...book,
          isAvailable: Math.random() > 0.3,
          isRecommended: Math.random() > 0.5,
        };
      })
    );

    return enrichedBooks;
  }

  /**
   * Check if a book should be recommended based on user preferences
   */
  private checkIfRecommended(book: RecognizedBook, preferences: UserPreferences | null): boolean {
    if (!preferences) {
      // Default recommendation logic
      const popularTitles = [
        'The Great Gatsby',
        '1984',
        'Harry Potter',
        'To Kill a Mockingbird',
        'Pride and Prejudice',
      ];
      
      return popularTitles.some(title => 
        book.title.toLowerCase().includes(title.toLowerCase())
      ) || Math.random() > 0.6;
    }

    // Enhanced recommendation based on user preferences
    let score = 0;

    // Check favorite genres
    if (preferences.favoriteGenres && book.genre) {
      if (preferences.favoriteGenres.includes(book.genre)) {
        score += 0.4;
      }
    }

    // Check preferred authors
    if (preferences.preferredAuthors && book.author) {
      if (preferences.preferredAuthors.some(author => 
        book.author?.toLowerCase().includes(author.toLowerCase())
      )) {
        score += 0.3;
      }
    }

    // Exclude genres user doesn't want
    if (preferences.excludeGenres && book.genre) {
      if (preferences.excludeGenres.includes(book.genre)) {
        return false;
      }
    }

    return score > 0.5 || Math.random() > 0.7;
  }

  /**
   * Load library floor plan for navigation
   */
  async loadLibraryFloorPlan(libraryId: string): Promise<LibraryFloorPlan> {
    // Load from our floor plans data
    const floorData = floorPlansData as FloorPlanData;
    const libraryData = floorData.libraries.find(
      lib => lib.id === libraryId
    );
    
    if (libraryData) {
      this.currentFloorPlan = libraryData;
      return this.currentFloorPlan;
    }
    
    // Fallback to built-in layouts
    switch (libraryId) {
      case 'cary-regional':
        this.currentFloorPlan = this.getCaryRegionalLibraryLayout();
        break;
      case 'eva-perry-apex':
        this.currentFloorPlan = this.getEvaPerryLibraryLayout();
        break;
      case 'apartment-test':
        // Load apartment test layout from JSON
        const floorData = floorPlansData as FloorPlanData;
        const apartmentData = floorData.libraries.find(
          lib => lib.id === 'apartment-test'
        );
        this.currentFloorPlan = apartmentData || this.getSampleTriangleLibraryLayout();
        break;
      default:
        this.currentFloorPlan = this.getSampleTriangleLibraryLayout();
    }
    return this.currentFloorPlan;
  }

  /**
   * Calculate navigation path to a book location
   */
  calculatePathToBook(
    currentLocation: { x: number; y: number; floor: number },
    bookLocation: { sectionId: string; floor: number }
  ): NavigationPath | null {
    if (!this.currentFloorPlan) return null;

    const floor = this.currentFloorPlan.floors.find((f) => f.level === bookLocation.floor);
    if (!floor) return null;

    const targetSection = floor.sections.find((s) => s.id === bookLocation.sectionId);
    if (!targetSection) return null;

    // Simple pathfinding - in production, use A* or Dijkstra's algorithm
    const path: Waypoint[] = [];
    const startWaypoint = this.findNearestWaypoint(floor.waypoints, currentLocation);
    const endWaypoint = this.findNearestWaypoint(floor.waypoints, {
      x: targetSection.bounds.x + targetSection.bounds.width / 2,
      y: targetSection.bounds.y + targetSection.bounds.height / 2,
    });

    if (startWaypoint && endWaypoint) {
      // Placeholder path - would implement real pathfinding
      path.push(startWaypoint, endWaypoint);
    }

    return {
      waypoints: path,
      distance: this.calculateDistance(path),
      estimatedTime: Math.ceil(this.calculateDistance(path) / 50), // 50 units per minute
    };
  }

  /**
   * Find nearest waypoint to a position
   */
  private findNearestWaypoint(waypoints: Waypoint[], position: { x: number; y: number }): Waypoint | null {
    let nearest: Waypoint | null = null;
    let minDistance = Infinity;

    for (const waypoint of waypoints) {
      const distance = Math.sqrt(Math.pow(waypoint.x - position.x, 2) + Math.pow(waypoint.y - position.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        nearest = waypoint;
      }
    }

    return nearest;
  }

  /**
   * Calculate total path distance
   */
  private calculateDistance(waypoints: Waypoint[]): number {
    let distance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const current = waypoints[i - 1];
      const next = waypoints[i];
      if (current && next) {
        distance += Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
      }
    }
    return distance;
  }

  /**
   * Get sample Triangle area library layout
   */
  private getSampleTriangleLibraryLayout(): LibraryFloorPlan {
    return {
      id: 'durham-main',
      name: 'Durham County Main Library',
      floors: [
        {
          level: 1,
          name: 'Main Floor',
          sections: [
            {
              id: 'fiction-a-m',
              name: 'Fiction A-M',
              category: 'fiction',
              bounds: { x: 100, y: 100, width: 200, height: 300 },
            },
            {
              id: 'fiction-n-z',
              name: 'Fiction N-Z',
              category: 'fiction',
              bounds: { x: 350, y: 100, width: 200, height: 300 },
            },
            {
              id: 'non-fiction-100-500',
              name: 'Non-Fiction 100-500',
              category: 'non-fiction',
              bounds: { x: 100, y: 450, width: 200, height: 300 },
            },
            {
              id: 'non-fiction-500-900',
              name: 'Non-Fiction 500-900',
              category: 'non-fiction',
              bounds: { x: 350, y: 450, width: 200, height: 300 },
            },
          ],
          waypoints: [
            { id: 'entrance', x: 300, y: 50, connectedTo: ['central-1'] },
            {
              id: 'central-1',
              x: 300,
              y: 250,
              connectedTo: ['entrance', 'fiction-left', 'fiction-right', 'central-2'],
            },
            { id: 'fiction-left', x: 150, y: 250, connectedTo: ['central-1'] },
            { id: 'fiction-right', x: 450, y: 250, connectedTo: ['central-1'] },
            { id: 'central-2', x: 300, y: 600, connectedTo: ['central-1', 'nonfiction-left', 'nonfiction-right'] },
            { id: 'nonfiction-left', x: 150, y: 600, connectedTo: ['central-2'] },
            { id: 'nonfiction-right', x: 450, y: 600, connectedTo: ['central-2'] },
          ],
        },
      ],
    };
  }

  /**
   * Get Cary Regional Library layout
   * 26,000 sq ft, 2 floors
   */
  private getCaryRegionalLibraryLayout(): LibraryFloorPlan {
    return {
      id: 'cary-regional',
      name: 'Cary Regional Library',
      floors: [
        {
          level: 1,
          sections: [
            {
              id: 'childrens',
              name: "Children's Section",
              category: 'childrens',
              bounds: { x: 50, y: 50, width: 250, height: 200 },
            },
            {
              id: 'teen',
              name: 'Teen Area',
              category: 'teen',
              bounds: { x: 350, y: 50, width: 200, height: 200 },
            },
            {
              id: 'new-books',
              name: 'New Books & DVDs',
              category: 'new',
              bounds: { x: 200, y: 300, width: 150, height: 150 },
            },
            {
              id: 'computers',
              name: 'Computer Lab',
              category: 'technology',
              bounds: { x: 400, y: 300, width: 150, height: 150 },
            },
          ],
          waypoints: [
            { id: 'entrance', x: 300, y: 500, connectedTo: ['lobby'] },
            { id: 'lobby', x: 300, y: 400, connectedTo: ['entrance', 'childrens-entry', 'teen-entry', 'stairs'] },
            { id: 'childrens-entry', x: 150, y: 150, connectedTo: ['lobby'] },
            { id: 'teen-entry', x: 450, y: 150, connectedTo: ['lobby'] },
            { id: 'new-books-entry', x: 275, y: 375, connectedTo: ['lobby'] },
            { id: 'computers-entry', x: 475, y: 375, connectedTo: ['lobby'] },
            { id: 'stairs', x: 300, y: 250, connectedTo: ['lobby'] },
          ],
        },
        {
          level: 2,
          sections: [
            {
              id: 'adult-fiction',
              name: 'Adult Fiction',
              category: 'fiction',
              bounds: { x: 50, y: 50, width: 250, height: 200 },
            },
            {
              id: 'non-fiction',
              name: 'Non-Fiction',
              category: 'non-fiction',
              bounds: { x: 350, y: 50, width: 200, height: 200 },
            },
            {
              id: 'quiet-study',
              name: 'Quiet Study Room',
              category: 'study',
              bounds: { x: 200, y: 300, width: 200, height: 100 },
            },
          ],
          waypoints: [
            {
              id: 'stairs-2',
              x: 300,
              y: 250,
              connectedTo: ['adult-fiction-entry', 'non-fiction-entry', 'study-entry'],
            },
            { id: 'adult-fiction-entry', x: 150, y: 150, connectedTo: ['stairs-2'] },
            { id: 'non-fiction-entry', x: 450, y: 150, connectedTo: ['stairs-2'] },
            { id: 'study-entry', x: 300, y: 350, connectedTo: ['stairs-2'] },
          ],
        },
      ],
    };
  }

  /**
   * Get Eva Perry Regional Library (Apex) layout
   * 22,500 sq ft, single floor
   */
  private getEvaPerryLibraryLayout(): LibraryFloorPlan {
    return {
      id: 'eva-perry-apex',
      name: 'Eva Perry Regional Library',
      floors: [
        {
          level: 1,
          sections: [
            {
              id: 'tree-house',
              name: "Tree House (Children's Story Room)",
              category: 'childrens',
              bounds: { x: 50, y: 50, width: 150, height: 150 },
            },
            {
              id: 'childrens',
              name: "Children's Collection",
              category: 'childrens',
              bounds: { x: 50, y: 250, width: 200, height: 250 },
            },
            {
              id: 'teen',
              name: 'Teen Section',
              category: 'teen',
              bounds: { x: 300, y: 50, width: 150, height: 150 },
            },
            {
              id: 'adult-fiction',
              name: 'Adult Fiction',
              category: 'fiction',
              bounds: { x: 500, y: 50, width: 200, height: 200 },
            },
            {
              id: 'non-fiction',
              name: 'Non-Fiction',
              category: 'non-fiction',
              bounds: { x: 500, y: 300, width: 200, height: 200 },
            },
            {
              id: 'new-arrivals',
              name: 'New Arrivals',
              category: 'new',
              bounds: { x: 300, y: 350, width: 150, height: 150 },
            },
          ],
          waypoints: [
            { id: 'entrance', x: 375, y: 550, connectedTo: ['central'] },
            {
              id: 'central',
              x: 375,
              y: 275,
              connectedTo: [
                'entrance',
                'tree-house-entry',
                'childrens-entry',
                'teen-entry',
                'fiction-entry',
                'non-fiction-entry',
              ],
            },
            { id: 'tree-house-entry', x: 125, y: 125, connectedTo: ['central'] },
            { id: 'childrens-entry', x: 150, y: 375, connectedTo: ['central'] },
            { id: 'teen-entry', x: 375, y: 125, connectedTo: ['central'] },
            { id: 'fiction-entry', x: 600, y: 150, connectedTo: ['central'] },
            { id: 'non-fiction-entry', x: 600, y: 400, connectedTo: ['central'] },
            { id: 'new-arrivals-entry', x: 375, y: 425, connectedTo: ['central'] },
          ],
        },
      ],
    };
  }
}

// Export singleton instance
export const arService = new ARService();
