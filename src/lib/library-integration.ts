/**
 * Library Integration Utilities
 * Handles library availability checks and reservations
 */

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverUrl?: string;
  available: boolean;
  libraryName: string;
  location: string;
  dueDate?: string;
  waitlistCount?: number;
}

export interface LibrarySearchResult {
  book: LibraryBook;
  reason: string;
  matchScore: number;
}

export class LibraryService {
  private static instance: LibraryService;
  private mockLibraries = [
    {
      name: "Central Library",
      location: "123 Main St",
      books: [
        {
          id: "1",
          title: "The Road",
          author: "Cormac McCarthy",
          isbn: "9780307265432",
          coverUrl: "https://covers.openlibrary.org/b/id/8576271-L.jpg",
          available: true,
          libraryName: "Central Library",
          location: "Fiction Section"
        },
        {
          id: "2",
          title: "Station Eleven",
          author: "Emily St. John Mandel",
          isbn: "9780385353304",
          coverUrl: "https://covers.openlibrary.org/b/id/8576272-L.jpg",
          available: true,
          libraryName: "Central Library",
          location: "Science Fiction"
        }
      ]
    },
    {
      name: "Downtown Branch",
      location: "456 Oak Ave",
      books: [
        {
          id: "3",
          title: "World War Z",
          author: "Max Brooks",
          isbn: "9780307346605",
          coverUrl: "https://covers.openlibrary.org/b/id/8576273-L.jpg",
          available: false,
          libraryName: "Downtown Branch",
          location: "Horror Section",
          dueDate: "2024-01-15",
          waitlistCount: 3
        }
      ]
    }
  ];

  static getInstance(): LibraryService {
    if (!LibraryService.instance) {
      LibraryService.instance = new LibraryService();
    }
    return LibraryService.instance;
  }

  async searchBooks(query: string): Promise<LibrarySearchResult[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: LibrarySearchResult[] = [];
    
    // Search through all libraries
    this.mockLibraries.forEach(library => {
      library.books.forEach(book => {
        const searchText = `${book.title} ${book.author}`.toLowerCase();
        const queryLower = query.toLowerCase();
        
        if (searchText.includes(queryLower)) {
          results.push({
            book: book as LibraryBook,
            reason: `Found in ${library.name}`,
            matchScore: 0.9
          });
        }
      });
    });
    
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  async checkAvailability(isbn: string): Promise<LibraryBook[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: LibraryBook[] = [];
    
    this.mockLibraries.forEach(library => {
      const book = library.books.find(b => b.isbn === isbn);
      if (book) {
        results.push(book as LibraryBook);
      }
    });
    
    return results;
  }

  async reserveBook(bookId: string, libraryName: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the book and mark it as reserved
    const library = this.mockLibraries.find(lib => lib.name === libraryName);
    const book = library?.books.find(b => b.id === bookId) as LibraryBook | undefined;
    
    if (book && book.available) {
      book.available = false;
      book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return true;
    }
    
    return false;
  }

  async getNearbyLibraries(lat: number, lng: number): Promise<Array<{name: string, distance: number}>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { name: "Central Library", distance: 0.5 },
      { name: "Downtown Branch", distance: 1.2 },
      { name: "Westside Library", distance: 2.1 },
      { name: "Eastside Branch", distance: 2.8 }
    ].sort((a, b) => a.distance - b.distance);
  }
}

export const libraryService = LibraryService.getInstance(); 