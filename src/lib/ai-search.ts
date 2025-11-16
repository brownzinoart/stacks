/**
 * Client-side AI Search Implementation
 * Simplified version for MVP - takes user input, processes with GPT, returns categorized results
 */

interface BookRecommendation {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  // Short form for mobile cards
  description?: string;
  reason?: string;
  // Long form for detail modal
  descriptionLong?: string;
  reasonLong?: string;
  // Enhanced Google Books data
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  googleBooksId?: string;
}

interface SearchResults {
  query: string;
  plot: BookRecommendation[];
  characters: BookRecommendation[];
  atmosphere: BookRecommendation[];
  totalBooks: number;
}

export class AISearchService {
  private openaiApiKey: string;
  private googleBooksApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.googleBooksApiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || '';
    
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. Natural language search will not work.');
    }
  }

  /**
   * Main search function - takes user input and returns categorized book recommendations
   */
  async searchBooks(userQuery: string): Promise<SearchResults> {
    // Demo mode - return mock data for "demo" search term
    if (userQuery.toLowerCase().includes('demo')) {
      return this.getDemoResults(userQuery);
    }

    try {
      // Step 1: Process query with GPT-4 to get book recommendations
      const gptRecommendations = await this.processWithGPT(userQuery);
      
      // Step 2: Fetch cover images in parallel
      const booksWithCovers = await this.fetchCoversInParallel(gptRecommendations);
      
      // Step 3: Categorize into 3 groups with 2 books each
      const categorized = this.categorizeResults(booksWithCovers);
      
      return {
        query: userQuery,
        plot: categorized.plot,
        characters: categorized.characters,
        atmosphere: categorized.atmosphere,
        totalBooks: 6
      };
    } catch (error) {
      console.error('Search failed:', error);
      return this.getFallbackResults(userQuery);
    }
  }

  /**
   * Process user query with GPT-4 to get book recommendations
   */
  private async processWithGPT(userQuery: string): Promise<BookRecommendation[]> {
    const prompt = `You are a book recommendation expert for a mobile BookTok-style app. Based on the user's request: "${userQuery}"

Please recommend exactly 6 books that match this request. For each book, provide BOTH short (mobile card) and long (detail modal) versions:

1. Title
2. Author  
3. Short description (MAX 150 characters - mobile card, hook them fast)
4. Long description (2-3 sentences - detail modal, full context)
5. Short reason (MAX 80 characters - mobile card, punchy)
6. Long reason (2-3 sentences - detail modal, detailed explanation)

SHORT formats (mobile cards):
- Description: "Magic is banned, but Aria's powers are awakening. Choose love or save the world?"
- Reason: "Perfect for late nights - witchy vibes meet murder mystery"

LONG formats (detail modal):
- Description: Full plot summary with context and stakes
- Reason: Detailed explanation of why it matches the request

Format your response as JSON array:
[
  {
    "title": "Book Title",
    "author": "Author Name", 
    "description": "Short mobile description under 150 chars",
    "descriptionLong": "Longer detailed description for modal with full context and plot details",
    "reason": "Perfect for [context] - [hook] (mention plot/characters/atmosphere)",
    "reasonLong": "Detailed explanation of why this book matches the request, including specific elements about plot, characters, or atmosphere that align with what the user is looking for"
  }
]

Focus on popular, well-known books that users can easily find. Mix classic and contemporary titles.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using mini for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'You are a helpful book recommendation assistant. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      const books = JSON.parse(cleanContent);
      return Array.isArray(books) ? books.slice(0, 6) : []; // Ensure exactly 6 books
    } catch (parseError) {
      console.error('Failed to parse GPT response:', content);
      console.error('Parse error:', parseError.message);
      
      // Return fallback if parsing fails
      return this.getFallbackBooks();
    }
  }

  /**
   * Fetch detailed book data for all books in parallel
   */
  private async fetchCoversInParallel(books: BookRecommendation[]): Promise<BookRecommendation[]> {
    const dataPromises = books.map(async (book) => {
      try {
        const detailedData = await this.fetchDetailedBookInfo(book.title, book.author);
        return { 
          ...book, 
          ...detailedData,
          // Keep original description if Google's is too long or missing
          description: detailedData?.description && detailedData.description.length < 200 
            ? detailedData.description 
            : book.description
        };
      } catch (error) {
        console.warn(`Failed to fetch data for ${book.title}:`, error);
        return book; // Return without enhanced data
      }
    });

    return Promise.all(dataPromises);
  }

  /**
   * Fetch detailed book information from Google Books API
   */
  private async fetchBookCover(title: string, author: string): Promise<string | undefined> {
    const bookData = await this.fetchDetailedBookInfo(title, author);
    return bookData?.coverUrl;
  }

  /**
   * Fetch comprehensive book details from Google Books API
   */
  private async fetchDetailedBookInfo(title: string, author: string): Promise<Partial<BookRecommendation> | undefined> {
    if (!this.googleBooksApiKey) {
      return undefined;
    }

    const query = encodeURIComponent(`${title} ${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${this.googleBooksApiKey}&maxResults=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const book = data.items[0];
        const volumeInfo = book.volumeInfo || {};
        const imageLinks = volumeInfo.imageLinks || {};
        
        return {
          coverUrl: imageLinks.large || imageLinks.medium || imageLinks.thumbnail,
          publishedDate: volumeInfo.publishedDate,
          publisher: volumeInfo.publisher,
          pageCount: volumeInfo.pageCount,
          categories: volumeInfo.categories,
          averageRating: volumeInfo.averageRating,
          ratingsCount: volumeInfo.ratingsCount,
          language: volumeInfo.language,
          previewLink: volumeInfo.previewLink,
          infoLink: volumeInfo.infoLink,
          googleBooksId: book.id,
          description: volumeInfo.description || undefined // Use Google's description if available
        };
      }
    } catch (error) {
      console.warn('Google Books API error:', error);
    }
    
    return undefined;
  }

  /**
   * Categorize books into plot, characters, and atmosphere (2 each)
   */
  private categorizeResults(books: BookRecommendation[]): {
    plot: BookRecommendation[];
    characters: BookRecommendation[];
    atmosphere: BookRecommendation[];
  } {
    const plot: BookRecommendation[] = [];
    const characters: BookRecommendation[] = [];
    const atmosphere: BookRecommendation[] = [];

    // Simple categorization based on reason field
    books.forEach((book) => {
      const reason = book.reason?.toLowerCase() || '';
      
      if (reason.includes('plot') && plot.length < 2) {
        plot.push(book);
      } else if (reason.includes('character') && characters.length < 2) {
        characters.push(book);
      } else if (reason.includes('atmosphere') && atmosphere.length < 2) {
        atmosphere.push(book);
      } else {
        // Distribute remaining books evenly
        if (plot.length < 2) {
          plot.push(book);
        } else if (characters.length < 2) {
          characters.push(book);
        } else if (atmosphere.length < 2) {
          atmosphere.push(book);
        }
      }
    });

    return { plot, characters, atmosphere };
  }

  /**
   * Fallback books when AI parsing fails
   */
  private getFallbackBooks(): BookRecommendation[] {
    return [
      {
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "A reclusive Hollywood icon reveals her scandalous life story.",
        reason: "Rich character development and emotional depth"
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "A lone astronaut must save humanity from extinction.",
        reason: "Thrilling plot with scientific mystery"
      },
      {
        title: "The Song of Achilles",
        author: "Madeline Miller",
        description: "A retelling of the Iliad focused on Achilles and Patroclus.",
        reason: "Beautiful atmospheric writing and mythology"
      },
      {
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        description: "An artificial friend observes the world around her.",
        reason: "Unique perspective and compelling characters"
      },
      {
        title: "Mexican Gothic",
        author: "Silvia Moreno-Garcia",
        description: "A young woman investigates her cousin's mysterious illness.",
        reason: "Dark, atmospheric gothic horror"
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "A library between life and death offers infinite possibilities.",
        reason: "Intriguing plot about parallel lives"
      }
    ];
  }

  /**
   * Demo results with rich mock data for design testing
   */
  private getDemoResults(query: string): SearchResults {
    const plotBook: BookRecommendation = {
      title: "The Adventures of Huckleberry Finn",
      author: "Mark Twain",
      description: "Huck and Jim escape down the Mississippi - friendship, freedom, and wild adventures await.",
      descriptionLong: "Huckleberry Finn, an abused outcast, rafts with Jim, a runaway slave, down the Mississippi River where they encounter con artists, feuding families, and moral dilemmas that challenge everything Huck believes about society and friendship.",
      reason: "Perfect for adventure lovers - friendship and freedom on the river",
      reasonLong: "This classic matches your search because its plot is rich with adventure and the themes of freedom and exploration resonate with readers seeking stories about personal growth, unlikely friendships, and characters who challenge societal norms through their journey.",
      coverUrl: "https://covers.openlibrary.org/b/id/8422599-L.jpg",
      publishedDate: "2010",
      publisher: "Collector's Library",
      pageCount: 372,
      categories: ["Fiction", "Adventure", "Classic Literature"],
      averageRating: 4.1,
      ratingsCount: 2847,
      language: "en",
      previewLink: "https://books.google.com/books/preview",
      infoLink: "https://books.google.com/books/about",
      googleBooksId: "demo-huck-finn"
    };

    const charactersBook: BookRecommendation = {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "Elizabeth meets brooding Mr. Darcy - witty banter, misunderstandings, and swoony romance.",
      descriptionLong: "Elizabeth Bennet navigates love, family, and social expectations in Regency England, encountering the proud Mr. Darcy whose initial arrogance masks a complex character worthy of her wit and independence.",
      reason: "Perfect for character lovers - witty heroine meets mysterious hero",
      reasonLong: "This romance excels in character development, featuring Elizabeth Bennet's sharp wit and independence alongside Mr. Darcy's transformation from apparent arrogance to revealed depth, creating unforgettable personalities that drive every plot point through their compelling interactions.",
      coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
      publishedDate: "2003",
      publisher: "Penguin Classics",
      pageCount: 432,
      categories: ["Fiction", "Romance", "Classic Literature"],
      averageRating: 4.3,
      ratingsCount: 1523,
      language: "en",
      previewLink: "https://books.google.com/books/preview",
      infoLink: "https://books.google.com/books/about",
      googleBooksId: "demo-pride-prejudice"
    };

    const atmosphereBook: BookRecommendation = {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "Jazz Age glamour hides dark secrets - parties, obsession, and the American Dream gone wrong.",
      descriptionLong: "Nick Carraway observes the mysterious Jay Gatsby's pursuit of the elusive Daisy Buchanan in the Jazz Age, where lavish parties and glittering wealth mask the corruption and moral decay beneath the surface of the American Dream.",
      reason: "Perfect for mood readers - glittering 1920s atmosphere with dark vibes",
      reasonLong: "This novel creates a haunting atmosphere of the Roaring Twenties through Fitzgerald's masterful portrayal of excess and disillusionment, where the glittering surface of wealth and parties contrasts with themes of moral decay, making it perfect for readers who appreciate mood-driven storytelling.",
      coverUrl: "https://covers.openlibrary.org/b/id/8225899-L.jpg",
      publishedDate: "2004",
      publisher: "Scribner",
      pageCount: 180,
      categories: ["Fiction", "Classic Literature", "American Literature"],
      averageRating: 3.9,
      ratingsCount: 4521,
      language: "en",
      previewLink: "https://books.google.com/books/preview",
      infoLink: "https://books.google.com/books/about",
      googleBooksId: "demo-great-gatsby"
    };

    return {
      query,
      plot: [plotBook],
      characters: [charactersBook],
      atmosphere: [atmosphereBook],
      totalBooks: 3
    };
  }

  /**
   * Fallback results when AI search fails
   */
  private getFallbackResults(query: string): SearchResults {
    const fallbackBooks = this.getFallbackBooks();

    return {
      query,
      plot: fallbackBooks.slice(0, 2),
      characters: fallbackBooks.slice(2, 4), 
      atmosphere: fallbackBooks.slice(4, 6),
      totalBooks: 6
    };
  }
}

// Export singleton instance
export const aiSearchService = new AISearchService();