export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genres: string[];
  tropes: string[];
  pageCount: number;
  publishYear: number;
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

<<<<<<< Updated upstream
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
=======
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
  source: 'hardcover' | 'google';
}

export interface UserLibrary {
  name: string;
  catalogUrl: string;
  type: 'bibliocommons' | 'overdrive' | 'other';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Mock Reading Progress with patterns
export const mockReadingProgressEnhanced: ReadingProgressEnhanced[] = [
  // The Cruel Prince - Speed read (3 days)
  {
    id: "rp-1",
    bookId: "book-7",
    userId: "user-1",
    startDate: new Date("2024-03-15"),
    finishedDate: new Date("2024-03-18"),
    currentPage: 370,
    totalPages: 370,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-03-15"), pagesRead: 120, timeOfDay: "night" },
      { date: new Date("2024-03-16"), pagesRead: 125, timeOfDay: "night" },
      { date: new Date("2024-03-17"), pagesRead: 125, timeOfDay: "evening" },
    ]
  },
  // Fourth Wing - Currently reading
  {
    id: "rp-2",
    bookId: "book-1",
    userId: "user-1",
    startDate: new Date("2024-10-25"),
    finishedDate: null,
    currentPage: 139,
    totalPages: 498,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2024-10-25"), pagesRead: 45, timeOfDay: "night" },
      { date: new Date("2024-10-26"), pagesRead: 38, timeOfDay: "evening" },
      { date: new Date("2024-10-28"), pagesRead: 56, timeOfDay: "night" },
    ]
  },
  // Six of Crows - Recent finish
  {
    id: "rp-3",
    bookId: "book-6",
    userId: "user-1",
    startDate: new Date("2024-11-05"),
    finishedDate: new Date("2024-11-15"),
    currentPage: 465,
    totalPages: 465,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-11-05"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-11-06"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-11-07"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-11-08"), pagesRead: 52, timeOfDay: "night" },
      { date: new Date("2024-11-09"), pagesRead: 46, timeOfDay: "night" },
      { date: new Date("2024-11-10"), pagesRead: 49, timeOfDay: "night" },
      { date: new Date("2024-11-11"), pagesRead: 51, timeOfDay: "evening" },
      { date: new Date("2024-11-12"), pagesRead: 42, timeOfDay: "night" },
      { date: new Date("2024-11-13"), pagesRead: 40, timeOfDay: "night" },
      { date: new Date("2024-11-15"), pagesRead: 42, timeOfDay: "afternoon" },
    ]
  },
  // A Court of Thorns and Roses
  {
    id: "rp-4",
    bookId: "book-2",
    userId: "user-1",
    startDate: new Date("2024-11-01"),
    finishedDate: new Date("2024-11-08"),
    currentPage: 419,
    totalPages: 419,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-11-01"), pagesRead: 60, timeOfDay: "night" },
      { date: new Date("2024-11-02"), pagesRead: 58, timeOfDay: "night" },
      { date: new Date("2024-11-03"), pagesRead: 62, timeOfDay: "evening" },
      { date: new Date("2024-11-04"), pagesRead: 55, timeOfDay: "night" },
      { date: new Date("2024-11-06"), pagesRead: 65, timeOfDay: "night" },
      { date: new Date("2024-11-07"), pagesRead: 59, timeOfDay: "night" },
      { date: new Date("2024-11-08"), pagesRead: 60, timeOfDay: "afternoon" },
    ]
  },
  // The Song of Achilles
  {
    id: "rp-5",
    bookId: "book-4",
    userId: "user-1",
    startDate: new Date("2024-10-20"),
    finishedDate: new Date("2024-11-02"),
    currentPage: 352,
    totalPages: 352,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-10-20"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-21"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-10-22"), pagesRead: 25, timeOfDay: "night" },
      { date: new Date("2024-10-23"), pagesRead: 32, timeOfDay: "afternoon" },
      { date: new Date("2024-10-25"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-10-26"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-28"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-10-29"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-10-31"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-11-01"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-11-02"), pagesRead: 60, timeOfDay: "afternoon" },
    ]
  },
  // The Secret History - Slow read
  {
    id: "rp-6",
    bookId: "book-3",
    userId: "user-1",
    startDate: new Date("2024-08-15"),
    finishedDate: new Date("2024-09-05"),
    currentPage: 559,
    totalPages: 559,
    status: "finished",
    userRating: 4,
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
      { date: new Date("2024-09-05"), pagesRead: 202, timeOfDay: "night" }, // Marathon finish
    ]
  },
];
=======
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
  // TODO: Replace with actual API calls (Hardcover, Google Books, NYT)

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
            source: "hardcover",
          },
          {
            id: "review-2",
            username: "mystery_fan",
            stars: 4,
            text: "Great plot twists and a protagonist you can't help but root for. Exactly what I was looking for in a cozy mystery.",
            source: "hardcover",
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
    const { getHardcoverBookData } = await import('./api/hardcoverApi');
    const { getGoogleBooksData } = await import('./api/googleBooksApi');
    const { checkBestseller } = await import('./api/nytBestsellerApi');
    const { getBookReviews } = await import('./services/reviewsService');

    // Fetch from APIs in parallel
    const [hardcoverData, googleData, bestsellerInfo, reviewsData] = await Promise.all([
      getHardcoverBookData(isbn),
      getGoogleBooksData(isbn),
      checkBestseller(isbn),
      getBookReviews(isbn, bookId, 3), // Fetch 3 reviews for book detail page
    ]);

    // Merge API data with mock data
    return {
      ...mockDetail,
      isbn,
      socialProof: {
        isBestseller: bestsellerInfo.isBestseller,
        bestsellerInfo: bestsellerInfo.isBestseller
          ? `${bestsellerInfo.listName} • ${bestsellerInfo.weeksOnList} weeks`
          : undefined,
        rating: hardcoverData?.rating || googleData?.averageRating || mockDetail.socialProof.rating,
        ratingsCount: hardcoverData?.ratingsCount || googleData?.ratingsCount || mockDetail.socialProof.ratingsCount,
        readerTags: hardcoverData?.tags || mockDetail.socialProof.readerTags,
        // Use reviews service (currently mock, but abstracted for future real data)
        reviews: reviewsData.reviews.map(r => ({
          id: r.id,
          username: r.username,
          stars: r.rating,
          text: r.text,
          source: reviewsData.source.name.toLowerCase() as 'hardcover',
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
>>>>>>> Stashed changes
