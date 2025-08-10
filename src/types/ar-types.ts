/**
 * Type definitions for AR functionality
 * Replaces 'any' types with proper TypeScript interfaces
 */

export interface FloorPlanData {
  libraries: Library[];
  bookLocations: Record<string, BookLocation>;
}

export interface Library {
  id: string;
  name: string;
  description: string;
  floors: Floor[];
}

export interface Floor {
  level: number;
  name: string;
  sections: Section[];
  waypoints: Waypoint[];
  qrAnchors?: QRAnchor[];
}

export interface Section {
  id: string;
  name: string;
  category: string;
  bounds: BoundingBox;
  shelfNumbers?: string[];
}

export interface Waypoint {
  id: string;
  x: number;
  y: number;
  connectedTo: string[];
}

export interface QRAnchor {
  id: string;
  code: string;
  position: Position2D;
  description: string;
}

export interface BookLocation {
  libraryId: string;
  floor: number;
  sectionId: string;
  shelfNumber: string;
  callNumber: string;
}

export interface Position2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UserPreferences {
  favoriteGenres?: string[];
  readingLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredAuthors?: string[];
  excludeGenres?: string[];
  language?: string;
  maxPageCount?: number;
}

export interface LibraryInventory {
  books: InventoryBook[];
  lastUpdated: string;
  libraryId: string;
}

export interface InventoryBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  location: BookLocation;
  holdCount?: number;
  dueDate?: string;
}

// Re-export existing AR types with enhancements
export interface RecognizedBook {
  title: string;
  author?: string;
  confidence: number;
  boundingBox: BoundingBox;
  isAvailable?: boolean;
  isRecommended?: boolean;
  isbn?: string;
  genre?: string;
}

export interface NavigationPath {
  waypoints: Waypoint[];
  distance: number;
  estimatedTime: number;
}

export interface LibraryFloorPlan {
  id: string;
  name: string;
  floors: Floor[];
}

// Camera and media types
export interface CameraPhoto {
  base64String?: string;
  webPath?: string;
  format?: string;
  saved?: boolean;
}

export interface PermissionStatus {
  camera: 'granted' | 'denied' | 'prompt';
}

// OCR specific types
export interface OCRWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OCRLine {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  words?: OCRWord[];
}

// Performance and analytics types
export interface ARPerformanceMetrics {
  ocrProcessingTime: number;
  recognitionAccuracy: number;
  memoryUsage: number;
  batteryImpact: 'low' | 'medium' | 'high';
  userSatisfaction: number;
}

export interface ARAnalytics {
  booksScanned: number;
  successfulRecognitions: number;
  navigationSessionsStarted: number;
  navigationSessionsCompleted: number;
  averageSessionDuration: number;
  mostScannedGenres: string[];
}

// Error types
export interface ARError {
  code: 'CAMERA_ACCESS_DENIED' | 'OCR_INITIALIZATION_FAILED' | 'API_RATE_LIMIT' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: unknown;
  timestamp: number;
}

// Event types for AR system
export type AREvent = 
  | { type: 'OCR_STARTED'; payload: { imageHash: string } }
  | { type: 'OCR_COMPLETED'; payload: { books: RecognizedBook[]; processingTime: number } }
  | { type: 'NAVIGATION_STARTED'; payload: { destination: BookLocation } }
  | { type: 'NAVIGATION_COMPLETED'; payload: { success: boolean; duration: number } }
  | { type: 'QR_CODE_SCANNED'; payload: { code: string; position: Position2D } }
  | { type: 'ERROR_OCCURRED'; payload: ARError };