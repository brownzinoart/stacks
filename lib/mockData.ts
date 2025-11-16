export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
}

export interface BookMetadata {
  synopsis: string;
  themes: string[];          // ["family drama", "corporate intrigue", "betrayal"]
  tropes: string[];          // ["enemies to lovers", "found family", "morally grey protagonist"]
  mood: string[];            // ["dark", "intense", "fast-paced", "character-driven"]
  similarMovies?: string[];  // ["Succession", "The Godfather"] - for reference
  pageCount: number;
  publishYear: number;
  amazonRating?: number;
  goodreadsRating?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string; // Open Library URL (primary)
  googleBooksCoverUrl?: string; // Google Books URL (fallback)
  genres: string[];
  tropes: string[];          // Keep for backward compatibility
  pageCount: number;
  publishYear: number;
  metadata?: BookMetadata;   // Extended metadata for search
}

export type MatchLevel = "high" | "medium" | "low" | "read";

export interface BookMatch {
  book: Book;
  matchLevel: MatchLevel;
}

export interface Stack {
  id: string;
  userId: string;
  photo: string;
  caption: string;
  books: BookMatch[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  matchScore?: number; // For current user
  hashtags?: string[]; // Optional hashtags for categorization
}

export interface Comment {
  id: string;
  userId: string;
  stackId: string;
  text: string;
  createdAt: string;
}

export interface ReadingProgress {
  id: string;
  bookId: string;
  startDate: string;
  endDate: string;
  currentPage: number;
  totalPages: number;
  status: "reading" | "finished" | "abandoned";
}

export interface UserReadingProfile {
  userId: string;
  favoriteGenres: string[];
  favoriteAuthors: string[];
  favoriteTropes: string[];
  dislikedTropes: string[];
  preferredMood: string[];
  readingHistory: {
    bookId: string;
    rating?: number;          // 1-5 stars
    finishedDate?: string;
    didNotFinish?: boolean;
  }[];
  engagementHistory: {
    likedStackIds: string[];
    savedStackIds: string[];
    commentedStackIds: string[];
  };
}

export interface SearchQuery {
  raw: string;                    // Original user query
  enriched?: {
    movieReferences?: {
      title: string;
      tmdbId: number;
      themes: string[];
      tropes: string[];
    }[];
    extractedThemes: string[];
    extractedMoods: string[];
    extractedTropes: string[];
  };
  userContext?: {
    profile: UserReadingProfile;
    recentReads: Book[];
    preferredGenres: string[];
  };
}

export interface NaturalLanguageSearchResult {
  book: Book;
  matchScore: number;           // 0-100
  matchReasons: string[];       // ["Matches your love of dark academia", "Similar to Gone Girl"]
  relevanceToQuery: number;     // 0-100
}

// ============================================
// READING ANALYTICS TYPES
// ============================================

export interface DailyCheckIn {
  date: Date;
  pagesRead: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export interface ReadingProgressEnhanced extends Omit<ReadingProgress, 'startDate' | 'endDate'> {
  startDate: Date;
  finishedDate: Date | null;
  userRating?: number; // 1-5 stars
  dailyCheckIns: DailyCheckIn[];
  userId: string;
}

export interface ReadingStats {
  userId: string;
  period: "all" | "year" | "month";
  booksRead: number;
  pagesRead: number;
  avgRating: number;
  currentStreak: number;
  longestStreak: number;
  fastestBook: { bookId: string; title: string; days: number; pagesPerDay: number };
  slowestBook: { bookId: string; title: string; days: number; pagesPerDay: number };
  topGenres: { genre: string; count: number; percentage: number }[];
  topAuthors: { author: string; count: number }[];
  monthlyReading: { month: string; books: number; pages: number }[];
  ratingDistribution: { rating: number; count: number }[];
  readingPace: number; // avg pages per day
  timeOfDayPreference: { morning: number; afternoon: number; evening: number; night: number };
}

export interface MonthlyReadingData {
  month: string;
  books: number;
  pages: number;
}

export interface GenreData {
  genre: string;
  count: number;
  percentage: number;
}

export interface AuthorData {
  author: string;
  count: number;
}

// ============================================
// SEARCH RESULTS & BOOK DETAIL TYPES
// ============================================

export interface SearchResult {
  query: string;
  atmosphere: {
    tags: string[];
    books: BookSearchMatch[];
  };
  characters: {
    tags: string[];
    books: BookSearchMatch[];
  };
  plot: {
    tags: string[];
    books: BookSearchMatch[];
  };
}

export interface BookSearchMatch {
  book: Book;
  matchPercentage: number;
  matchReasons: {
    atmosphere?: string[];
    characters?: string[];
    plot?: string[];
  };
}

export interface BookDetail extends Book {
  isbn?: string;
  description: string;
  socialProof: {
    isBestseller: boolean;
    bestsellerInfo?: string;
    rating: number;
    ratingsCount: number;
    readerTags: string[];
    reviews: BookReview[];
  };
}

export interface BookReview {
  id: string;
  username: string;
  stars: number;
  text: string;
  source: 'google' | 'mock';
}

export interface UserLibrary {
  name: string;
  catalogUrl: string;
  type: 'bibliocommons' | 'overdrive' | 'other';
}

// Current user (the person demoing the app)
export const currentUser: User = {
  id: "user-1",
  username: "bookishdreamer",
  displayName: "Bookish Dreamer",
  avatar: "/avatars/current-user.jpg",
  bio: "Romantasy obsessed 📚 Dark academia enthusiast 🖤",
  followerCount: 1247,
  followingCount: 342,
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-2",
    username: "darkacademiaqueen",
    displayName: "Dark Academia Queen",
    avatar: "/avatars/user-2.jpg",
    bio: "If it's dark and twisty, I'm reading it",
    followerCount: 5621,
    followingCount: 189,
  },
  {
    id: "user-3",
    username: "fantasyfiend",
    displayName: "Fantasy Fiend",
    avatar: "/avatars/user-3.jpg",
    bio: "Dragons > People. Sarah J. Maas stan 🐉",
    followerCount: 3892,
    followingCount: 567,
  },
  {
    id: "user-4",
    username: "bookishemma",
    displayName: "Bookish Emma",
    avatar: "/avatars/user-4.jpg",
    bio: "Romance with a side of tears 💕",
    followerCount: 8234,
    followingCount: 423,
  },
];

// Mock books
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

// Mock stacks
export const mockStacks: Stack[] = [
  {
    id: "stack-1",
    userId: "user-2",
    photo: "/images/bookstacks.jpg",
    caption: "My current dark academia TBR 🖤📚",
    books: [
      { book: mockBooks[2], matchLevel: "high" }, // The Secret History
      { book: mockBooks[3], matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[7], matchLevel: "medium" }, // Normal People
    ],
    likeCount: 342,
    commentCount: 28,
    createdAt: "2024-10-27T14:30:00Z",
    matchScore: 92,
  },
  {
    id: "stack-2",
    userId: "user-3",
    photo: "/images/bookstacks2.jpg",
    caption: "Romantasy recs that made me CRY 😭💜",
    books: [
      { book: mockBooks[0], matchLevel: "high" }, // Fourth Wing
      { book: mockBooks[1], matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6], matchLevel: "medium" }, // The Cruel Prince
      { book: mockBooks[3], matchLevel: "high" }, // The Song of Achilles
      { book: mockBooks[5], matchLevel: "medium" }, // Six of Crows
    ],
    likeCount: 1203,
    commentCount: 156,
    createdAt: "2024-10-26T10:15:00Z",
    matchScore: 87,
  },
  {
    id: "stack-3",
    userId: "user-4",
    photo: "/images/bookstacks7_blues.jpg",
    caption: "Feeling all the #blues with these melancholy reads 💙📖",
    books: [
      { book: mockBooks[3], matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[7], matchLevel: "low" }, // Normal People
    ],
    likeCount: 892,
    commentCount: 94,
    createdAt: "2024-10-25T16:45:00Z",
    matchScore: 78,
    hashtags: ["blues"],
  },
  {
    id: "stack-4",
    userId: "user-3",
    photo: "/images/bookstacks3.jpg",
    caption: "Found family trope supremacy 💙",
    books: [
      { book: mockBooks[5], matchLevel: "high" }, // Six of Crows
      { book: mockBooks[0], matchLevel: "medium" }, // Fourth Wing
      { book: mockBooks[2], matchLevel: "low" }, // The Secret History
      { book: mockBooks[1], matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6], matchLevel: "medium" }, // The Cruel Prince
      { book: mockBooks[4], matchLevel: "read" }, // It Ends With Us
    ],
    likeCount: 567,
    commentCount: 43,
    createdAt: "2024-10-24T09:20:00Z",
    matchScore: 65,
  },
  {
    id: "stack-5",
    userId: "user-2",
    photo: "/images/bookstacks4.jpg",
    caption: "Cozy fall reading vibes 🍂✨",
    books: [
      { book: mockBooks[1], matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6], matchLevel: "high" }, // The Cruel Prince
      { book: mockBooks[5], matchLevel: "medium" }, // Six of Crows
    ],
    likeCount: 723,
    commentCount: 67,
    createdAt: "2024-10-23T12:00:00Z",
    matchScore: 88,
  },
  {
    id: "stack-6",
    userId: "user-2",
    photo: "/images/bookstacks8_blues.jpg",
    caption: "When you need a good cry and some #blues 😢💙",
    books: [
      { book: mockBooks[3], matchLevel: "high" }, // The Song of Achilles
      { book: mockBooks[7], matchLevel: "read" }, // Normal People
      { book: mockBooks[4], matchLevel: "medium" }, // It Ends With Us
      { book: mockBooks[2], matchLevel: "high" }, // The Secret History
      { book: mockBooks[0], matchLevel: "low" }, // Fourth Wing
      { book: mockBooks[1], matchLevel: "medium" }, // ACOTAR
      { book: mockBooks[5], matchLevel: "high" }, // Six of Crows
      { book: mockBooks[6], matchLevel: "read" }, // The Cruel Prince
    ],
    likeCount: 1089,
    commentCount: 145,
    createdAt: "2024-10-20T14:20:00Z",
    matchScore: 90,
    hashtags: ["blues"],
  },
  {
    id: "stack-7",
    userId: "user-4",
    photo: "/images/bookstacks5.jpg",
    caption: "These deserve all the hype 🔥",
    books: [
      { book: mockBooks[0], matchLevel: "high" }, // Fourth Wing
      { book: mockBooks[2], matchLevel: "medium" }, // The Secret History
      { book: mockBooks[4], matchLevel: "low" }, // It Ends With Us
      { book: mockBooks[6], matchLevel: "high" }, // The Cruel Prince
    ],
    likeCount: 1456,
    commentCount: 203,
    createdAt: "2024-10-22T18:30:00Z",
    matchScore: 81,
  },
  {
    id: "stack-8",
    userId: "user-3",
    photo: "/images/bookstacks6.jpg",
    caption: "Books I stayed up all night reading 🌙",
    books: [
      { book: mockBooks[5], matchLevel: "high" }, // Six of Crows
      { book: mockBooks[1], matchLevel: "read" }, // ACOTAR
      { book: mockBooks[3], matchLevel: "medium" }, // The Song of Achilles
    ],
    likeCount: 934,
    commentCount: 112,
    createdAt: "2024-10-21T21:45:00Z",
    matchScore: 75,
  },
  {
    id: "stack-9",
    userId: "user-4",
    photo: "/images/bookstacks9_blues.webp",
    caption: "Sad girl autumn #blues reading list 🍁💔",
    books: [
      { book: mockBooks[7], matchLevel: "high" }, // Normal People
      { book: mockBooks[2], matchLevel: "medium" }, // The Secret History
      { book: mockBooks[3], matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[4], matchLevel: "high" }, // It Ends With Us
      { book: mockBooks[1], matchLevel: "low" }, // ACOTAR
      { book: mockBooks[5], matchLevel: "medium" }, // Six of Crows
      { book: mockBooks[0], matchLevel: "high" }, // Fourth Wing
    ],
    likeCount: 1267,
    commentCount: 178,
    createdAt: "2024-10-19T11:00:00Z",
    matchScore: 84,
    hashtags: ["blues"],
  },
];

// Mock comments
export const mockComments: Record<string, Comment[]> = {
  "stack-1": [
    {
      id: "comment-1",
      userId: "user-4",
      stackId: "stack-1",
      text: "The Secret History is one of my all-time favs!!",
      createdAt: "2024-10-27T15:00:00Z",
    },
    {
      id: "comment-2",
      userId: "user-3",
      stackId: "stack-1",
      text: "Adding all of these to my TBR immediately 😍",
      createdAt: "2024-10-27T16:30:00Z",
    },
  ],
  "stack-2": [
    {
      id: "comment-3",
      userId: "user-2",
      stackId: "stack-2",
      text: "Fourth Wing had me sobbing at 2am",
      createdAt: "2024-10-26T11:00:00Z",
    },
  ],
};

// Current user's reading progress
export const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    bookId: "book-2",
    startDate: "2024-10-20",
    endDate: "2024-11-10",
    currentPage: 156,
    totalPages: 419,
    status: "reading",
  },
];

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  if (id === currentUser.id) return currentUser;
  return mockUsers.find((u) => u.id === id);
}

// Helper function to get book by ID
export function getBookById(id: string): Book | undefined {
  return mockBooks.find((b) => b.id === id);
}

// Mock Reading Progress with patterns
export const mockReadingProgressEnhanced: ReadingProgressEnhanced[] = [
  // The Cruel Prince - Lightning fast binge read! (finished in 2 days)
  {
    id: "rp-1",
    bookId: "book-7",
    userId: "user-1",
    startDate: new Date("2024-03-15"),
    finishedDate: new Date("2024-03-17"),
    currentPage: 370,
    totalPages: 370,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-03-15"), pagesRead: 185, timeOfDay: "night" },
      { date: new Date("2024-03-16"), pagesRead: 140, timeOfDay: "evening" },
      { date: new Date("2024-03-17"), pagesRead: 45, timeOfDay: "morning" },
    ]
  },
  // Fourth Wing - Currently reading (52%)
  {
    id: "rp-2",
    bookId: "book-1",
    userId: "user-1",
    startDate: new Date("2024-10-20"),
    finishedDate: null,
    currentPage: 258,
    totalPages: 498,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2024-10-20"), pagesRead: 42, timeOfDay: "night" },
      { date: new Date("2024-10-21"), pagesRead: 35, timeOfDay: "evening" },
      { date: new Date("2024-10-22"), pagesRead: 38, timeOfDay: "night" },
      { date: new Date("2024-10-23"), pagesRead: 31, timeOfDay: "night" },
      { date: new Date("2024-10-25"), pagesRead: 28, timeOfDay: "afternoon" },
      { date: new Date("2024-10-27"), pagesRead: 33, timeOfDay: "night" },
      { date: new Date("2024-10-29"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-10-31"), pagesRead: 22, timeOfDay: "afternoon" },
    ]
  },
  // It Ends With Us - Daily reader! (31%)
  {
    id: "rp-8",
    bookId: "book-5",
    userId: "user-1",
    startDate: new Date("2024-10-25"),
    finishedDate: null,
    currentPage: 120,
    totalPages: 384,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2024-10-25"), pagesRead: 25, timeOfDay: "morning" },
      { date: new Date("2024-10-26"), pagesRead: 22, timeOfDay: "afternoon" },
      { date: new Date("2024-10-27"), pagesRead: 18, timeOfDay: "morning" },
      { date: new Date("2024-10-28"), pagesRead: 20, timeOfDay: "night" },
      { date: new Date("2024-10-29"), pagesRead: 15, timeOfDay: "afternoon" },
      { date: new Date("2024-10-30"), pagesRead: 20, timeOfDay: "evening" },
    ]
  },
  // Six of Crows - Solid 5-star read (finished early June)
  {
    id: "rp-3",
    bookId: "book-6",
    userId: "user-1",
    startDate: new Date("2024-06-01"),
    finishedDate: new Date("2024-06-12"),
    currentPage: 465,
    totalPages: 465,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-06-01"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-06-02"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-06-03"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-06-05"), pagesRead: 52, timeOfDay: "afternoon" },
      { date: new Date("2024-06-07"), pagesRead: 46, timeOfDay: "night" },
      { date: new Date("2024-06-08"), pagesRead: 49, timeOfDay: "night" },
      { date: new Date("2024-06-09"), pagesRead: 51, timeOfDay: "evening" },
      { date: new Date("2024-06-10"), pagesRead: 42, timeOfDay: "night" },
      { date: new Date("2024-06-11"), pagesRead: 40, timeOfDay: "night" },
      { date: new Date("2024-06-12"), pagesRead: 42, timeOfDay: "afternoon" },
    ]
  },
  // A Court of Thorns and Roses - On a reading streak! (92%)
  {
    id: "rp-4",
    bookId: "book-2",
    userId: "user-1",
    startDate: new Date("2024-10-22"),
    finishedDate: null,
    currentPage: 385,
    totalPages: 419,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2024-10-22"), pagesRead: 35, timeOfDay: "night" },
      { date: new Date("2024-10-23"), pagesRead: 32, timeOfDay: "evening" },
      { date: new Date("2024-10-24"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-10-25"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-26"), pagesRead: 26, timeOfDay: "evening" },
      { date: new Date("2024-10-27"), pagesRead: 24, timeOfDay: "night" },
      { date: new Date("2024-10-28"), pagesRead: 22, timeOfDay: "night" },
      { date: new Date("2024-10-29"), pagesRead: 25, timeOfDay: "evening" },
      { date: new Date("2024-10-30"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-10-31"), pagesRead: 30, timeOfDay: "afternoon" },
      { date: new Date("2024-11-01"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-11-02"), pagesRead: 24, timeOfDay: "evening" },
      { date: new Date("2024-11-03"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-11-04"), pagesRead: 22, timeOfDay: "afternoon" },
      { date: new Date("2024-11-05"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-11-06"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-11-07"), pagesRead: 19, timeOfDay: "morning" },
    ]
  },
  // The Song of Achilles - Beautiful but heartbreaking (finished in January)
  {
    id: "rp-5",
    bookId: "book-4",
    userId: "user-1",
    startDate: new Date("2024-01-05"),
    finishedDate: new Date("2024-01-12"),
    currentPage: 352,
    totalPages: 352,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-01-05"), pagesRead: 52, timeOfDay: "night" },
      { date: new Date("2024-01-06"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-01-07"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-01-08"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-01-10"), pagesRead: 43, timeOfDay: "afternoon" },
      { date: new Date("2024-01-11"), pagesRead: 47, timeOfDay: "night" },
      { date: new Date("2024-01-12"), pagesRead: 67, timeOfDay: "night" },
    ]
  },
  // The Secret History - Slow burn (took 3 weeks, meh ending)
  {
    id: "rp-6",
    bookId: "book-3",
    userId: "user-1",
    startDate: new Date("2024-08-15"),
    finishedDate: new Date("2024-09-05"),
    currentPage: 559,
    totalPages: 559,
    status: "finished",
    userRating: 3,
    dailyCheckIns: [
      { date: new Date("2024-08-15"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-08-16"), pagesRead: 25, timeOfDay: "evening" },
      { date: new Date("2024-08-18"), pagesRead: 30, timeOfDay: "afternoon" },
      { date: new Date("2024-08-20"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-08-22"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-08-24"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-08-26"), pagesRead: 25, timeOfDay: "night" },
      { date: new Date("2024-08-28"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-08-30"), pagesRead: 24, timeOfDay: "afternoon" },
      { date: new Date("2024-09-01"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-09-02"), pagesRead: 27, timeOfDay: "evening" },
      { date: new Date("2024-09-03"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-09-04"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-09-05"), pagesRead: 202, timeOfDay: "night" }, // Marathon finish to just get it done
    ]
  },
  // Normal People - Gave up after 150 pages (not my vibe)
  {
    id: "rp-7",
    bookId: "book-8",
    userId: "user-1",
    startDate: new Date("2024-04-12"),
    finishedDate: null,
    currentPage: 152,
    totalPages: 266,
    status: "abandoned",
    dailyCheckIns: [
      { date: new Date("2024-04-12"), pagesRead: 38, timeOfDay: "night" },
      { date: new Date("2024-04-13"), pagesRead: 35, timeOfDay: "evening" },
      { date: new Date("2024-04-15"), pagesRead: 29, timeOfDay: "afternoon" },
      { date: new Date("2024-04-18"), pagesRead: 22, timeOfDay: "night" },
      { date: new Date("2024-04-21"), pagesRead: 28, timeOfDay: "night" },
    ]
  },
  // Iron Flame - Devoured it! (Feb 2024)
  {
    id: "rp-9",
    bookId: "book-9",
    userId: "user-1",
    startDate: new Date("2024-02-10"),
    finishedDate: new Date("2024-02-22"),
    currentPage: 623,
    totalPages: 623,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-02-10"), pagesRead: 62, timeOfDay: "night" },
      { date: new Date("2024-02-11"), pagesRead: 58, timeOfDay: "morning" },
      { date: new Date("2024-02-12"), pagesRead: 55, timeOfDay: "night" },
      { date: new Date("2024-02-13"), pagesRead: 48, timeOfDay: "evening" },
      { date: new Date("2024-02-15"), pagesRead: 52, timeOfDay: "afternoon" },
      { date: new Date("2024-02-16"), pagesRead: 60, timeOfDay: "night" },
      { date: new Date("2024-02-17"), pagesRead: 54, timeOfDay: "night" },
      { date: new Date("2024-02-19"), pagesRead: 50, timeOfDay: "morning" },
      { date: new Date("2024-02-20"), pagesRead: 56, timeOfDay: "evening" },
      { date: new Date("2024-02-21"), pagesRead: 63, timeOfDay: "night" },
      { date: new Date("2024-02-22"), pagesRead: 65, timeOfDay: "afternoon" },
    ]
  },
  // House of Earth and Blood - Epic but exhausting (May 2024)
  {
    id: "rp-10",
    bookId: "book-10",
    userId: "user-1",
    startDate: new Date("2024-05-01"),
    finishedDate: new Date("2024-05-28"),
    currentPage: 803,
    totalPages: 803,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-05-01"), pagesRead: 35, timeOfDay: "night" },
      { date: new Date("2024-05-02"), pagesRead: 32, timeOfDay: "evening" },
      { date: new Date("2024-05-04"), pagesRead: 28, timeOfDay: "afternoon" },
      { date: new Date("2024-05-06"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-05-08"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-05-10"), pagesRead: 33, timeOfDay: "morning" },
      { date: new Date("2024-05-12"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-05-14"), pagesRead: 31, timeOfDay: "afternoon" },
      { date: new Date("2024-05-16"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-05-18"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-05-20"), pagesRead: 30, timeOfDay: "morning" },
      { date: new Date("2024-05-22"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-05-24"), pagesRead: 32, timeOfDay: "afternoon" },
      { date: new Date("2024-05-26"), pagesRead: 148, timeOfDay: "night" },
      { date: new Date("2024-05-27"), pagesRead: 160, timeOfDay: "afternoon" },
      { date: new Date("2024-05-28"), pagesRead: 140, timeOfDay: "night" },
    ]
  },
  // The Atlas Six - Interesting concept, slow execution (July 2024)
  {
    id: "rp-11",
    bookId: "book-11",
    userId: "user-1",
    startDate: new Date("2024-07-08"),
    finishedDate: new Date("2024-07-15"),
    currentPage: 373,
    totalPages: 373,
    status: "finished",
    userRating: 3,
    dailyCheckIns: [
      { date: new Date("2024-07-08"), pagesRead: 55, timeOfDay: "morning" },
      { date: new Date("2024-07-09"), pagesRead: 52, timeOfDay: "afternoon" },
      { date: new Date("2024-07-10"), pagesRead: 48, timeOfDay: "evening" },
      { date: new Date("2024-07-12"), pagesRead: 50, timeOfDay: "morning" },
      { date: new Date("2024-07-13"), pagesRead: 54, timeOfDay: "afternoon" },
      { date: new Date("2024-07-14"), pagesRead: 58, timeOfDay: "morning" },
      { date: new Date("2024-07-15"), pagesRead: 56, timeOfDay: "afternoon" },
    ]
  },
  // Circe - Madeline Miller does it again! (Oct 2024)
  {
    id: "rp-12",
    bookId: "book-12",
    userId: "user-1",
    startDate: new Date("2024-10-08"),
    finishedDate: new Date("2024-10-20"),
    currentPage: 400,
    totalPages: 400,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-10-08"), pagesRead: 35, timeOfDay: "night" },
      { date: new Date("2024-10-09"), pagesRead: 32, timeOfDay: "evening" },
      { date: new Date("2024-10-10"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-11"), pagesRead: 28, timeOfDay: "afternoon" },
      { date: new Date("2024-10-12"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-10-13"), pagesRead: 36, timeOfDay: "evening" },
      { date: new Date("2024-10-14"), pagesRead: 31, timeOfDay: "night" },
      { date: new Date("2024-10-15"), pagesRead: 33, timeOfDay: "afternoon" },
      { date: new Date("2024-10-16"), pagesRead: 29, timeOfDay: "night" },
      { date: new Date("2024-10-17"), pagesRead: 35, timeOfDay: "evening" },
      { date: new Date("2024-10-18"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-10-19"), pagesRead: 30, timeOfDay: "afternoon" },
      { date: new Date("2024-10-20"), pagesRead: 55, timeOfDay: "night" },
    ]
  },
];
// ============================================
// MOCK SEARCH RESULTS
// ============================================

export function getMockSearchResults(query: string): SearchResult {
  // For MVP, return hardcoded results for "cozy mystery small town"
  // TODO: Replace with actual search API call

  return {
    query: query,
    atmosphere: {
      tags: ["Cozy", "Small-town", "Intimate"],
      books: [
        {
          book: {
            id: "search-book-1",
            title: "A Cozy Murder in Maple Grove",
            author: "Sarah Bennett",
            cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
            pageCount: 320,
            publishYear: 2023,
          },
          matchPercentage: 92,
          matchReasons: {
            atmosphere: ["Cozy setting", "Small town vibe", "Intimate feel"],
          },
        },
        {
          book: {
            id: "search-book-2",
            title: "The Bookshop Mystery",
            author: "Emma Collins",
            cover: "https://covers.openlibrary.org/b/isbn/9780593548219-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Bookshop", "Coastal Town"],
            pageCount: 285,
            publishYear: 2024,
          },
          matchPercentage: 88,
          matchReasons: {
            atmosphere: ["Sleepy coastal village", "Dusty bookshop"],
          },
        },
      ],
    },
    characters: {
      tags: ["Amateur Sleuth", "Quirky Cast", "Found Family"],
      books: [
        {
          book: {
            id: "search-book-3",
            title: "Death by Scone",
            author: "Margaret Hastings",
            cover: "https://covers.openlibrary.org/b/isbn/9780062843098-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Quirky Characters"],
            pageCount: 298,
            publishYear: 2023,
          },
          matchPercentage: 85,
          matchReasons: {
            characters: ["Witty baker protagonist", "Eccentric locals"],
          },
        },
        {
          book: {
            id: "search-book-4",
            title: "The Garden Club Murders",
            author: "Helen Carter",
            cover: "https://covers.openlibrary.org/b/isbn/9780593359426-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Found Family"],
            pageCount: 342,
            publishYear: 2024,
          },
          matchPercentage: 83,
          matchReasons: {
            characters: ["Retired teacher sleuth", "Unlikely allies"],
          },
        },
      ],
    },
    plot: {
      tags: ["Mystery", "Slow-burn", "Twisty"],
      books: [
        {
          book: {
            id: "search-book-5",
            title: "Murder at the Village Fair",
            author: "Patricia Reed",
            cover: "https://covers.openlibrary.org/b/isbn/9780593156537-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Mystery", "Slow Burn"],
            pageCount: 315,
            publishYear: 2023,
          },
          matchPercentage: 90,
          matchReasons: {
            plot: ["Festive fair setting", "Layers of secrets"],
          },
        },
        {
          book: {
            id: "search-book-6",
            title: "The Secret Society",
            author: "Diana Woods",
            cover: "https://covers.openlibrary.org/b/isbn/9780593465912-L.jpg",
            genres: ["Mystery", "Thriller"],
            tropes: ["Twisty", "Hidden Societies"],
            pageCount: 365,
            publishYear: 2024,
          },
          matchPercentage: 87,
          matchReasons: {
            plot: ["Twisty reveals", "Hidden societies"],
          },
        },
      ],
    },
  };
}

export function getMockBookDetail(bookId: string): BookDetail | null {
  // For MVP, return hardcoded detail for search-book-1
  // TODO: Replace with actual search API (currently mock data)

  if (bookId === "search-book-1") {
    return {
      id: "search-book-1",
      title: "A Cozy Murder in Maple Grove",
      author: "Sarah Bennett",
      cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
      isbn: "9780593356890",
      genres: ["Mystery", "Cozy Mystery"],
      tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
      pageCount: 320,
      publishYear: 2023,
      description: "When the town librarian is found dead among the dusty stacks, amateur sleuth Eleanor Thompson must navigate a cast of quirky suspects and long-buried secrets in her small New England town. With its cozy atmosphere, clever twists, and a protagonist you'll root for, this charming mystery is perfect for fans of slow-burn whodunits.",
      socialProof: {
        isBestseller: false,
        rating: 4.2,
        ratingsCount: 1847,
        readerTags: ["Cozy", "Character-driven", "Twisty", "Atmospheric"],
        reviews: [
          {
            id: "review-1",
            username: "booklover23",
            stars: 5,
            text: "Perfect cozy mystery! The small-town setting felt so real and the characters were absolutely charming. Couldn't put it down.",
            source: "mock",
          },
          {
            id: "review-2",
            username: "mystery_fan",
            stars: 4,
            text: "Great plot twists and a protagonist you can't help but root for. Exactly what I was looking for in a cozy mystery.",
            source: "mock",
          },
        ],
      },
    };
  }

  return null;
}

export async function getBookDetailWithAPIs(bookId: string, isbn?: string): Promise<BookDetail | null> {
  // For MVP: Start with mock data, gradually replace with API calls
  const mockDetail = getMockBookDetail(bookId);

  if (!mockDetail || !isbn) {
    return mockDetail;
  }

  try {
    // Import API functions dynamically to avoid circular dependencies
    const { getGoogleBooksData } = await import('./api/googleBooksApi');
    const { checkBestseller } = await import('./api/nytBestsellerApi');
    const { getBookReviews } = await import('./services/reviewsService');

    // Fetch from APIs in parallel
    const [googleData, bestsellerInfo, reviewsData] = await Promise.all([
      getGoogleBooksData(isbn),
      checkBestseller(isbn),
      getBookReviews(isbn, bookId, 3), // Fetch 3 reviews for book detail page
    ]);

    // Merge API data with mock data
    return {
      ...mockDetail,
      isbn,
      googleBooksCoverUrl: googleData?.coverUrl, // For cascade fallback
      socialProof: {
        isBestseller: bestsellerInfo.isBestseller,
        bestsellerInfo: bestsellerInfo.isBestseller
          ? `${bestsellerInfo.listName} • ${bestsellerInfo.weeksOnList} weeks`
          : undefined,
        rating: googleData?.averageRating || mockDetail.socialProof.rating,
        ratingsCount: googleData?.ratingsCount || mockDetail.socialProof.ratingsCount,
        readerTags: mockDetail.socialProof.readerTags,
        // Use reviews service (currently mock, but abstracted for future real data)
        reviews: reviewsData.reviews.map(r => ({
          id: r.id,
          username: r.username,
          stars: r.rating,
          text: r.text,
          source: 'google',
        })),
      },
      description: googleData?.description || mockDetail.description,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    // Fall back to mock data on error
    return mockDetail;
  }
}

// ============================================
// NATURAL LANGUAGE SEARCH MOCK DATA
// ============================================

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

export const mockCurrentUserProfile: UserReadingProfile = {
  userId: "user-1",
  favoriteGenres: ["Thriller", "Dark Fantasy", "Science Fiction"],
  favoriteAuthors: ["Andy Weir", "Leigh Bardugo", "Alex Michaelides"],
  favoriteTropes: ["unreliable narrator", "plot twist", "dark academia", "found family"],
  dislikedTropes: ["love triangle", "instalove"],
  preferredMood: ["dark", "suspenseful", "character-driven"],
  readingHistory: [
    { bookId: "book-1", rating: 5, finishedDate: "2024-10-15" },
    { bookId: "book-3", rating: 5, finishedDate: "2024-09-22" },
    { bookId: "book-4", rating: 4, finishedDate: "2024-08-10" },
    // Removed book-5 (The House in the Cerulean Sea) so it can appear in cozy fantasy searches
  ],
  engagementHistory: {
    likedStackIds: ["stack-1", "stack-3"],
    savedStackIds: ["stack-2"],
    commentedStackIds: ["stack-1"]
  }
};

// Get books user has already read
export function getBooksReadByUser(userId: string): string[] {
  if (userId === "user-1") {
    return mockCurrentUserProfile.readingHistory.map(h => h.bookId);
  }
  return [];
}

// Get user's favorite books (rating >= 4)
export function getUserFavoriteBooks(userId: string): Book[] {
  if (userId === "user-1") {
    const favoriteIds = mockCurrentUserProfile.readingHistory
      .filter(h => h.rating && h.rating >= 4)
      .map(h => h.bookId);
    return mockBooksWithMetadata.filter(b => favoriteIds.includes(b.id));
  }
  return [];
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
