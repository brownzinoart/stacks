/**
 * Emergency fallback book recommendations based on user input
 */

interface FallbackBook {
  title: string;
  author: string;
  why: string;
  cover?: string;
}

// Keyword-based book mappings for common searches
const bookMappings: Record<string, FallbackBook[]> = {
  'x-files|x files|aliens|ufo|paranormal|conspiracy': [
    { title: 'The Illuminatus! Trilogy', author: 'Robert Shea & Robert Anton Wilson', why: 'Conspiracy theories and paranormal mysteries like X-Files' },
    { title: 'Area 51', author: 'Annie Jacobsen', why: 'Government secrets and alien conspiracy investigations' },
    { title: 'Communion', author: 'Whitley Strieber', why: 'Classic alien encounter narrative with mystery elements' },
  ],
  'walking dead|zombies|apocalypse|survival': [
    { title: 'The Stand', author: 'Stephen King', why: 'Post-apocalyptic survival like The Walking Dead' },
    { title: 'World War Z', author: 'Max Brooks', why: 'Zombie apocalypse survival guide' },
    { title: 'The Road', author: 'Cormac McCarthy', why: 'Father-son survival in post-apocalyptic world' },
  ],
  'harry potter|magic|wizards|fantasy school': [
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', why: 'Magic school and coming-of-age like Harry Potter' },
    { title: 'The Magicians', author: 'Lev Grossman', why: 'Dark magic school for adults' },
    { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', why: 'Classic wizard school tale' },
  ],
  'game of thrones|got|medieval|dragons|political': [
    { title: 'The Way of Kings', author: 'Brandon Sanderson', why: 'Epic fantasy with political intrigue' },
    { title: 'The First Law Trilogy', author: 'Joe Abercrombie', why: 'Dark medieval fantasy with complex characters' },
    { title: 'The Lies of Locke Lamora', author: 'Scott Lynch', why: 'Political scheming and betrayal' },
  ],
  'breaking bad|crime|drugs|chemistry': [
    { title: 'The Power of the Dog', author: 'Don Winslow', why: 'Drug cartel empire building like Breaking Bad' },
    { title: 'American Gangster', author: 'Mark Jacobson', why: 'True crime drug empire story' },
    { title: 'The Godfather', author: 'Mario Puzo', why: 'Criminal empire and family dynamics' },
  ],
  'stranger things|80s|kids|supernatural|mystery': [
    { title: 'IT', author: 'Stephen King', why: 'Kids facing supernatural horror in the 80s' },
    { title: 'The Institute', author: 'Stephen King', why: 'Children with powers in secret facility' },
    { title: 'Paper Girls', author: 'Brian K. Vaughan', why: '80s kids on supernatural adventure' },
  ],
  'star wars|space|sci-fi|space opera': [
    { title: 'Dune', author: 'Frank Herbert', why: 'Epic space opera with mystical powers' },
    { title: 'The Expanse Series', author: 'James S.A. Corey', why: 'Space politics and adventure' },
    { title: 'Foundation', author: 'Isaac Asimov', why: 'Galactic empire and rebellion' },
  ],
  'funny|comedy|humor|laugh': [
    { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', why: 'Hilarious sci-fi comedy adventure' },
    { title: 'Good Omens', author: 'Terry Pratchett & Neil Gaiman', why: 'Witty supernatural comedy' },
    { title: 'Bossypants', author: 'Tina Fey', why: 'Laugh-out-loud memoir' },
  ],
  'romance|love|relationship': [
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', why: 'Epic romance spanning decades' },
    { title: 'Beach Read', author: 'Emily Henry', why: 'Witty contemporary romance' },
    { title: 'Me Before You', author: 'Jojo Moyes', why: 'Emotional love story' },
  ],
  'mystery|detective|crime|thriller': [
    { title: 'Gone Girl', author: 'Gillian Flynn', why: 'Psychological thriller with twists' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', why: 'Dark mystery investigation' },
    { title: 'Big Little Lies', author: 'Liane Moriarty', why: 'Mystery with complex characters' },
  ],
  'die hard|action|explosion|hostage|heist': [
    { title: 'The Bourne Identity', author: 'Robert Ludlum', why: 'Non-stop action thriller like Die Hard' },
    { title: 'Without Remorse', author: 'Tom Clancy', why: 'Military action with high stakes' },
    { title: 'The Gray Man', author: 'Mark Greaney', why: 'Elite operative against impossible odds' },
  ],
  'terminator|robot|ai|skynet|cyborg': [
    { title: 'Robopocalypse', author: 'Daniel H. Wilson', why: 'AI uprising like Terminator' },
    { title: 'Do Androids Dream of Electric Sheep?', author: 'Philip K. Dick', why: 'Classic android hunter story' },
    { title: 'The Machine Stops', author: 'E.M. Forster', why: 'Humanity dependent on machines' },
  ],
  'matrix|simulation|virtual reality|red pill': [
    { title: 'Neuromancer', author: 'William Gibson', why: 'Cyberpunk reality-bending like The Matrix' },
    { title: 'Snow Crash', author: 'Neal Stephenson', why: 'Virtual reality metaverse adventure' },
    { title: 'Ready Player One', author: 'Ernest Cline', why: 'Virtual world becomes reality' },
  ],
  'john wick|assassin|hitman|revenge': [
    { title: 'The Killer', author: 'Luc Jacamon', why: 'Professional assassin like John Wick' },
    { title: 'The Day of the Jackal', author: 'Frederick Forsyth', why: 'Master assassin thriller' },
    { title: 'Point of Impact', author: 'Stephen Hunter', why: 'Sniper seeking revenge' },
  ],
  'mission impossible|spy|espionage|covert': [
    { title: 'The Spy Who Came in from the Cold', author: 'John le Carré', why: 'Classic espionage thriller' },
    { title: 'Red Sparrow', author: 'Jason Matthews', why: 'Modern spy thriller with double agents' },
    { title: 'I Am Pilgrim', author: 'Terry Hayes', why: 'Epic spy thriller across continents' },
  ],
};

// Default fallback for unmatched queries
const defaultBooks: FallbackBook[] = [
  { title: 'The Midnight Library', author: 'Matt Haig', why: 'Explores infinite possibilities and choices' },
  { title: 'Project Hail Mary', author: 'Andy Weir', why: 'Science adventure with humor and heart' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', why: 'Beautiful story about connection and humanity' },
];

/**
 * Get emergency fallback books based on user input
 */
export function getEmergencyFallbackBooks(userInput: string): FallbackBook[] {
  const lowerInput = userInput.toLowerCase();
  
  // Check each mapping pattern
  for (const [pattern, books] of Object.entries(bookMappings)) {
    const patterns = pattern.split('|');
    for (const p of patterns) {
      if (lowerInput.includes(p)) {
        console.log(`[Emergency Fallback] Matched pattern "${p}" for input "${userInput}"`);
        return books;
      }
    }
  }
  
  // No match found, return default books
  console.log(`[Emergency Fallback] No pattern match for "${userInput}", using defaults`);
  return defaultBooks;
}

/**
 * Format fallback books for display with cover fetching - FIXED TO USE 3-CATEGORY STRUCTURE
 */
export async function formatFallbackRecommendations(userInput: string) {
  const books = getEmergencyFallbackBooks(userInput);
  
  console.log(`🚨 [EMERGENCY FALLBACK] Processing "${userInput}" with ${books.length} books`);
  
  // CRITICAL FIX: Attempt to fetch real covers for fallback books
  try {
    console.log('🎯 [FALLBACK SERVICE] Attempting to fetch real covers for fallback books');
    const { bookCoverService } = await import('./book-cover-service');
    
    const coverResults = await Promise.race([
      bookCoverService.getBatchCovers(books),
      new Promise<Map<number, any>>((_, reject) => 
        setTimeout(() => reject(new Error('Fallback service cover timeout')), 5000)
      )
    ]);

    // Apply covers
    books.forEach((book, index) => {
      const coverResult = coverResults.get(index);
      if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
        book.cover = coverResult.url;
        console.log(`✅ [FALLBACK SERVICE] Real cover found for "${book.title}"`);
      } else {
        // Generate gradient as last resort
        const hash = (book.title + book.author).split('').reduce((acc, char) => {
          return (acc << 5) - acc + char.charCodeAt(0);
        }, 0);
        const colors = [
          ['#FF6B6B', '#4ECDC4'],
          ['#45B7D1', '#F39C12'], 
          ['#96CEB4', '#FECA57'],
          ['#6C5CE7', '#FD79A8']
        ];
        const colorPair = colors[Math.abs(hash) % colors.length];
        book.cover = `gradient:${colorPair![0]}:${colorPair![1]}:${encodeURIComponent(book.title)}:${encodeURIComponent(book.author)}`;
        console.log(`🎨 [FALLBACK SERVICE] Using gradient for "${book.title}"`);
      }
    });
  } catch (coverError) {
    console.error('❌ [FALLBACK SERVICE] Cover fetching failed:', coverError);
    // Apply gradients to all books without covers
    books.forEach((book) => {
      if (!book.cover) {
        const hash = (book.title + book.author).split('').reduce((acc, char) => {
          return (acc << 5) - acc + char.charCodeAt(0);
        }, 0);
        const colors = [
          ['#FF6B6B', '#4ECDC4'],
          ['#45B7D1', '#F39C12'], 
          ['#96CEB4', '#FECA57'],
          ['#6C5CE7', '#FD79A8']
        ];
        const colorPair = colors[Math.abs(hash) % colors.length];
        book.cover = `gradient:${colorPair![0]}:${colorPair![1]}:${encodeURIComponent(book.title)}:${encodeURIComponent(book.author)}`;
      }
    });
  }
  
  // CRITICAL FIX: Return proper 3-category structure instead of flat books array
  const enhancedBooks = books.map(book => ({
    title: book.title,
    author: book.author,
    whyYoullLikeIt: book.why,
    summary: book.why, // Use the 'why' as summary for fallback
    cover: book.cover
  }));
  
  // Distribute books across the 3 core categories
  const categories = [
    {
      name: "The Plot",
      description: "Books with similar storylines and narrative structure",
      books: enhancedBooks.slice(0, Math.ceil(enhancedBooks.length / 3)) || enhancedBooks.slice(0, 1)
    },
    {
      name: "The Characters", 
      description: "Books with compelling character development and relationships",
      books: enhancedBooks.slice(Math.ceil(enhancedBooks.length / 3), Math.ceil(enhancedBooks.length * 2 / 3)) || enhancedBooks.slice(0, 1)
    },
    {
      name: "The Atmosphere",
      description: "Books with similar mood, setting, and emotional tone", 
      books: enhancedBooks.slice(Math.ceil(enhancedBooks.length * 2 / 3)) || enhancedBooks.slice(0, 1)
    }
  ];
  
  // Ensure each category has at least one book
  categories.forEach((category, index) => {
    if (category.books.length === 0) {
      category.books = [enhancedBooks[index] || enhancedBooks[0]];
    }
  });
  
  console.log(`🎯 [EMERGENCY FALLBACK] Generated categories:`, categories.map(c => `${c.name} (${c.books.length} books)`));
  
  return {
    overallTheme: `Emergency recommendations for "${userInput}"`,
    categories,
    userInput,
    timestamp: new Date().toISOString(),
    cost: 0,
    models: ['emergency_fallback'],
  };
}