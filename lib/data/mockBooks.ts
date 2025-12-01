/**
 * Mock book data
 */

import type { Book } from '../types';

// Mock books (basic collection)
export const mockBooks: Book[] = [
  {
    id: "book-1",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    cover: "https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg",
    genres: ["Fantasy", "Romance", "New Adult"],
    tropes: ["Enemies to Lovers", "Chosen One", "Dragon Riders"],
    pageCount: 498,
    publishYear: 2023,
  },
  {
    id: "book-2",
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    cover: "https://covers.openlibrary.org/b/isbn/9781635575569-L.jpg",
    genres: ["Fantasy", "Romance", "Fae"],
    tropes: ["Beauty and the Beast Retelling", "Fated Mates"],
    pageCount: 419,
    publishYear: 2015,
  },
  {
    id: "book-3",
    title: "The Secret History",
    author: "Donna Tartt",
    cover: "https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg",
    genres: ["Literary Fiction", "Mystery", "Thriller"],
    tropes: ["Dark Academia", "Murder Mystery", "Morally Grey Characters"],
    pageCount: 559,
    publishYear: 1992,
  },
  {
    id: "book-4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    cover: "https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg",
    genres: ["Historical Fiction", "Romance", "Greek Mythology"],
    tropes: ["Tragic Romance", "LGBTQ+", "Friends to Lovers"],
    pageCount: 352,
    publishYear: 2012,
  },
  {
    id: "book-5",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    cover: "https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg",
    genres: ["Contemporary Romance", "Women's Fiction"],
    tropes: ["Love Triangle", "Second Chance Romance", "Emotional"],
    pageCount: 384,
    publishYear: 2016,
  },
  {
    id: "book-6",
    title: "Six of Crows",
    author: "Leigh Bardugo",
    cover: "https://covers.openlibrary.org/b/isbn/9781627792127-L.jpg",
    genres: ["Fantasy", "Heist", "Young Adult"],
    tropes: ["Found Family", "Heist", "Multiple POV"],
    pageCount: 465,
    publishYear: 2015,
  },
  {
    id: "book-7",
    title: "The Cruel Prince",
    author: "Holly Black",
    cover: "https://covers.openlibrary.org/b/isbn/9780316310277-L.jpg",
    genres: ["Fantasy", "Romance", "Fae", "Young Adult"],
    tropes: ["Enemies to Lovers", "Mortal in Faerie World", "Political Intrigue"],
    pageCount: 370,
    publishYear: 2018,
  },
  {
    id: "book-8",
    title: "Normal People",
    author: "Sally Rooney",
    cover: "https://covers.openlibrary.org/b/isbn/9781984822178-L.jpg",
    genres: ["Literary Fiction", "Contemporary", "Romance"],
    tropes: ["On-Again-Off-Again", "Class Divide", "Coming of Age"],
    pageCount: 266,
    publishYear: 2018,
  },
  {
    id: "book-9",
    title: "Iron Flame",
    author: "Rebecca Yarros",
    cover: "https://covers.openlibrary.org/b/isbn/9781649374172-L.jpg",
    genres: ["Fantasy", "Romance", "New Adult"],
    tropes: ["Dragon Riders", "War", "Power Struggles"],
    pageCount: 623,
    publishYear: 2023,
  },
  {
    id: "book-10",
    title: "House of Earth and Blood",
    author: "Sarah J. Maas",
    cover: "https://covers.openlibrary.org/b/isbn/9781635574043-L.jpg",
    genres: ["Fantasy", "Romance", "Urban Fantasy"],
    tropes: ["Fated Mates", "Found Family", "Murder Mystery"],
    pageCount: 803,
    publishYear: 2020,
  },
  {
    id: "book-11",
    title: "The Atlas Six",
    author: "Olivie Blake",
    cover: "https://covers.openlibrary.org/b/isbn/9781250854520-L.jpg",
    genres: ["Fantasy", "Dark Academia", "Mystery"],
    tropes: ["Secret Society", "Morally Grey Characters", "Magic"],
    pageCount: 373,
    publishYear: 2020,
  },
  {
    id: "book-12",
    title: "Circe",
    author: "Madeline Miller",
    cover: "https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg",
    genres: ["Historical Fiction", "Fantasy", "Greek Mythology"],
    tropes: ["Female Empowerment", "Outcasts", "Gods and Mortals"],
    pageCount: 400,
    publishYear: 2018,
  },
];

// Mock books with extended metadata for natural language search
export const mockBooksWithMetadata: Book[] = [
  {
    id: "book-1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    genres: ["Thriller", "Mystery", "Psychological"],
    tropes: ["unreliable narrator", "plot twist", "psychological manipulation"],
    pageCount: 336,
    publishYear: 2019,
    metadata: {
      synopsis: "A famous painter murders her husband and then stops speaking. A psychotherapist becomes obsessed with uncovering her motive.",
      themes: ["obsession", "trauma", "betrayal", "mental health", "secrets"],
      tropes: ["unreliable narrator", "shocking twist ending", "psychological thriller", "mystery within mystery"],
      mood: ["dark", "suspenseful", "twisted", "atmospheric"],
      similarMovies: ["Gone Girl", "Shutter Island"],
      pageCount: 336,
      publishYear: 2019,
      amazonRating: 4.5,
      goodreadsRating: 4.07
    }
  },
  {
    id: "book-2",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    genres: ["Historical Fiction", "LGBTQ+", "Romance"],
    tropes: ["fake relationship", "forbidden love", "bisexual protagonist"],
    pageCount: 400,
    publishYear: 2017,
    metadata: {
      synopsis: "Aging Hollywood icon Evelyn Hugo finally tells the story of her scandalous life and seven marriages to an unknown magazine reporter.",
      themes: ["identity", "ambition", "love", "sacrifice", "Hollywood golden age", "LGBTQ+ representation"],
      tropes: ["fake relationship becomes real", "forbidden love", "unreliable narrator", "dual timeline"],
      mood: ["emotional", "glamorous", "heartbreaking", "character-driven"],
      similarMovies: ["La La Land", "The Great Gatsby", "Carol"],
      pageCount: 400,
      publishYear: 2017,
      amazonRating: 4.7,
      goodreadsRating: 4.45
    }
  },
  {
    id: "book-3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400",
    genres: ["Science Fiction", "Space Opera", "Adventure"],
    tropes: ["lone survivor", "science saves the day", "found family"],
    pageCount: 496,
    publishYear: 2021,
    metadata: {
      synopsis: "A lone astronaut must save Earth from disaster using science and an unlikely alien friendship.",
      themes: ["survival", "friendship", "sacrifice", "problem-solving", "humanity's future"],
      tropes: ["lone survivor", "science as magic", "unlikely friendship", "race against time"],
      mood: ["uplifting", "humorous", "thrilling", "sciencey"],
      similarMovies: ["The Martian", "Interstellar", "Arrival"],
      pageCount: 496,
      publishYear: 2021,
      amazonRating: 4.8,
      goodreadsRating: 4.52
    }
  },
  {
    id: "book-4",
    title: "Ninth House",
    author: "Leigh Bardugo",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    genres: ["Dark Fantasy", "Mystery", "Urban Fantasy"],
    tropes: ["chosen one", "dark academia", "secret society"],
    pageCount: 461,
    publishYear: 2019,
    metadata: {
      synopsis: "A survivor of multiple tragedies is given a scholarship to Yale to monitor the university's secret magical societies.",
      themes: ["class inequality", "trauma", "power", "privilege", "the occult"],
      tropes: ["chosen one", "dark academia", "secret societies", "magic has a price", "morally grey protagonist"],
      mood: ["dark", "atmospheric", "gritty", "mysterious"],
      similarMovies: ["The Magicians", "Harry Potter (darker)", "The Secret History"],
      pageCount: 461,
      publishYear: 2019,
      amazonRating: 4.3,
      goodreadsRating: 3.98
    }
  },
  {
    id: "book-5",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    cover: "https://images.unsplash.com/photo-1566443280617-35db331c54fb?w=400",
    genres: ["Fantasy", "LGBTQ+", "Romance"],
    tropes: ["found family", "grumpy/sunshine", "magical children"],
    pageCount: 398,
    publishYear: 2020,
    metadata: {
      synopsis: "A case worker investigates an orphanage of magical children and their mysterious caretaker on a remote island.",
      themes: ["found family", "acceptance", "belonging", "bureaucracy vs humanity", "love conquers all"],
      tropes: ["found family", "grumpy meets sunshine", "opposites attract", "magical children", "cozy fantasy"],
      mood: ["cozy", "heartwarming", "whimsical", "uplifting"],
      similarMovies: ["Paddington", "Big Hero 6", "Lilo & Stitch"],
      pageCount: 398,
      publishYear: 2020,
      amazonRating: 4.7,
      goodreadsRating: 4.36
    }
  },
  {
    id: "book-6",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    genres: ["Literary Fiction", "Contemporary", "Friendship"],
    tropes: ["will they won't they", "creative partnership", "nonromantic soulmates"],
    pageCount: 416,
    publishYear: 2022,
    metadata: {
      synopsis: "Two friends build a video game empire over decades, exploring love, art, identity, and the cost of creativity.",
      themes: ["friendship", "creativity", "identity", "disability", "ambition", "game design"],
      tropes: ["will they won't they (but not romance)", "creative partnership", "decades-spanning story", "art as life"],
      mood: ["thoughtful", "bittersweet", "emotional", "character-driven"],
      similarMovies: ["The Social Network", "La La Land", "Halt and Catch Fire"],
      pageCount: 416,
      publishYear: 2022,
      amazonRating: 4.4,
      goodreadsRating: 4.19
    }
  },
  {
    id: "book-7",
    title: "Babel",
    author: "R.F. Kuang",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    genres: ["Dark Academia", "Historical Fantasy", "Literary Fiction"],
    tropes: ["dark academia", "magic system based on language", "colonialism critique"],
    pageCount: 560,
    publishYear: 2022,
    metadata: {
      synopsis: "A Chinese boy is brought to Oxford to study translation magic, but discovers the empire's dark foundations.",
      themes: ["colonialism", "language and power", "betrayal", "revolution", "academic elitism", "identity"],
      tropes: ["dark academia", "magic system", "betrayal by mentor", "revolution", "morally complex choices"],
      mood: ["dark", "academic", "intense", "thought-provoking"],
      similarMovies: ["The Imitation Game", "Dead Poets Society (darker)", "Succession"],
      pageCount: 560,
      publishYear: 2022,
      amazonRating: 4.5,
      goodreadsRating: 4.27
    }
  },
  {
    id: "book-8",
    title: "Beach Read",
    author: "Emily Henry",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    genres: ["Romance", "Contemporary", "Comedy"],
    tropes: ["enemies to lovers", "writer protagonist", "neighbor romance"],
    pageCount: 368,
    publishYear: 2020,
    metadata: {
      synopsis: "Two writers challenge each other to write in opposite genres while navigating grief and growing attraction.",
      themes: ["grief", "creativity", "vulnerability", "second chances", "facing fears"],
      tropes: ["enemies to lovers", "forced proximity", "grumpy/sunshine", "writer protagonist", "summer romance"],
      mood: ["romantic", "funny", "emotional", "cozy"],
      similarMovies: ["When Harry Met Sally", "The Proposal", "You've Got Mail"],
      pageCount: 368,
      publishYear: 2020,
      amazonRating: 4.5,
      goodreadsRating: 4.05
    }
  },
  {
    id: "book-9",
    title: "Legends & Lattes",
    author: "Travis Baldree",
    cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    genres: ["Fantasy", "Cozy Fantasy", "Romance"],
    tropes: ["found family", "slice of life", "coffee shop", "second career"],
    pageCount: 304,
    publishYear: 2022,
    metadata: {
      synopsis: "After decades as a battle-hardened mercenary, Viv decides to hang up her sword and open the first coffee shop in the fantasy city of Thune.",
      themes: ["new beginnings", "found family", "pursuing dreams", "community", "leaving violence behind"],
      tropes: ["retired adventurer", "cozy fantasy", "slice of life", "found family", "slow burn romance"],
      mood: ["cozy", "heartwarming", "uplifting", "wholesome"],
      similarMovies: ["The Hundred-Foot Journey", "Chef", "Kiki's Delivery Service"],
      pageCount: 304,
      publishYear: 2022,
      amazonRating: 4.6,
      goodreadsRating: 4.23
    }
  },
  {
    id: "book-10",
    title: "A Psalm for the Wild-Built",
    author: "Becky Chambers",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
    genres: ["Science Fiction", "Cozy Fantasy", "Solarpunk"],
    tropes: ["found family", "self-discovery", "human-robot friendship"],
    pageCount: 160,
    publishYear: 2021,
    metadata: {
      synopsis: "A tea monk seeking meaning encounters a robot from the wilderness, sparking a journey of self-discovery in a hopeful future.",
      themes: ["purpose", "contentment", "nature", "self-discovery", "gentle philosophy"],
      tropes: ["cozy sci-fi", "slice of life", "philosophical journey", "unlikely friendship"],
      mood: ["cozy", "contemplative", "hopeful", "peaceful"],
      similarMovies: ["WALL-E", "My Neighbor Totoro", "The Secret Life of Walter Mitty"],
      pageCount: 160,
      publishYear: 2021,
      amazonRating: 4.4,
      goodreadsRating: 4.11
    }
  },
  {
    id: "book-11",
    title: "Howl's Moving Castle",
    author: "Diana Wynne Jones",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
    genres: ["Fantasy", "Young Adult", "Cozy Fantasy"],
    tropes: ["enemies to lovers", "magic", "curses", "found family"],
    pageCount: 329,
    publishYear: 1986,
    metadata: {
      synopsis: "Sophie is cursed by a witch and transformed into an old woman. She seeks refuge in the moving castle of the mysterious wizard Howl.",
      themes: ["self-acceptance", "transformation", "love", "magic", "adventure"],
      tropes: ["curse breaking", "magical castle", "reluctant hero", "enemies to lovers", "found family"],
      mood: ["cozy", "whimsical", "adventurous", "heartwarming"],
      similarMovies: ["Howl's Moving Castle (Studio Ghibli)", "Kiki's Delivery Service", "Spirited Away"],
      pageCount: 329,
      publishYear: 1986,
      amazonRating: 4.5,
      goodreadsRating: 4.09
    }
  },
  {
    id: "book-12",
    title: "The Very Secret Society of Irregular Witches",
    author: "Sangu Mandanna",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    genres: ["Fantasy", "Romance", "Cozy Fantasy"],
    tropes: ["found family", "grumpy/sunshine", "magical children", "isolated setting"],
    pageCount: 336,
    publishYear: 2022,
    metadata: {
      synopsis: "A lonely witch is hired to teach three young witches at a mysterious manor, finding family and love in unexpected places.",
      themes: ["belonging", "found family", "love", "magic", "community"],
      tropes: ["found family", "grumpy meets sunshine", "magical children", "isolated manor", "slow burn romance"],
      mood: ["cozy", "heartwarming", "romantic", "whimsical"],
      similarMovies: ["Practical Magic", "The House in the Cerulean Sea", "Encanto"],
      pageCount: 336,
      publishYear: 2022,
      amazonRating: 4.5,
      goodreadsRating: 4.18
    }
  },
  {
    id: "book-13",
    title: "Emily Wilde's Encyclopaedia of Faeries",
    author: "Heather Fawcett",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    genres: ["Fantasy", "Romance", "Cozy Fantasy"],
    tropes: ["grumpy/sunshine", "academia", "faeries", "slow burn"],
    pageCount: 336,
    publishYear: 2023,
    metadata: {
      synopsis: "A curmudgeonly professor travels to a remote village to study faeries, accompanied by her charming academic rival.",
      themes: ["academic research", "faerie lore", "friendship", "romance", "discovery"],
      tropes: ["grumpy meets sunshine", "academic rivals", "faerie world", "slow burn romance", "found family"],
      mood: ["cozy", "whimsical", "romantic", "adventurous"],
      similarMovies: ["Stardust", "The Secret of Roan Inish", "Amélie"],
      pageCount: 336,
      publishYear: 2023,
      amazonRating: 4.4,
      goodreadsRating: 4.14
    }
  },
  {
    id: "book-14",
    title: "The Goblin Emperor",
    author: "Katherine Addison",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    genres: ["Fantasy", "Political Fantasy", "Cozy Fantasy"],
    tropes: ["fish out of water", "found family", "political intrigue", "kind protagonist"],
    pageCount: 446,
    publishYear: 2014,
    metadata: {
      synopsis: "An outcast half-goblin unexpectedly becomes emperor and must navigate court politics with kindness and determination.",
      themes: ["kindness", "belonging", "political intrigue", "found family", "overcoming prejudice"],
      tropes: ["fish out of water", "reluctant ruler", "found family", "political intrigue", "kind protagonist"],
      mood: ["cozy", "heartwarming", "thoughtful", "hopeful"],
      similarMovies: ["The Princess Diaries", "A Knight's Tale", "The King's Speech"],
      pageCount: 446,
      publishYear: 2014,
      amazonRating: 4.3,
      goodreadsRating: 4.08
    }
  }
];

// Helper function to get book by ID
export function getBookById(id: string): Book | undefined {
  return mockBooks.find((b) => b.id === id);
}

// Get books similar to user's favorites
export function getSimilarBooks(bookId: string, limit: number = 5): Book[] {
  const sourceBook = mockBooksWithMetadata.find(b => b.id === bookId);
  if (!sourceBook) return [];

  // Simple similarity: match genres or tropes
  return mockBooksWithMetadata
    .filter(b => b.id !== bookId)
    .filter(b =>
      b.genres.some(g => sourceBook.genres.includes(g)) ||
      b.tropes.some(t => sourceBook.tropes.includes(t))
    )
    .slice(0, limit);
}

