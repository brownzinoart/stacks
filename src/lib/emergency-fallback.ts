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
 * Format fallback books for display
 */
export function formatFallbackRecommendations(userInput: string) {
  const books = getEmergencyFallbackBooks(userInput);
  
  return {
    books,
    userInput,
    emergency: true,
    timestamp: new Date().toISOString(),
    message: 'Network issues detected. Showing offline recommendations.',
  };
}