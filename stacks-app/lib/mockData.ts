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
    photo: "/stacks/stack-1.jpg",
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
    photo: "/stacks/stack-2.jpg",
    caption: "Romantasy recs that made me CRY 😭💜",
    books: [
      { book: mockBooks[0], matchLevel: "high" }, // Fourth Wing
      { book: mockBooks[1], matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6], matchLevel: "medium" }, // The Cruel Prince
    ],
    likeCount: 1203,
    commentCount: 156,
    createdAt: "2024-10-26T10:15:00Z",
    matchScore: 87,
  },
  {
    id: "stack-3",
    userId: "user-4",
    photo: "/stacks/stack-3.jpg",
    caption: "Books that destroyed me emotionally (worth it)",
    books: [
      { book: mockBooks[3], matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[4], matchLevel: "medium" }, // It Ends With Us
      { book: mockBooks[7], matchLevel: "low" }, // Normal People
    ],
    likeCount: 892,
    commentCount: 94,
    createdAt: "2024-10-25T16:45:00Z",
    matchScore: 78,
  },
  {
    id: "stack-4",
    userId: "user-3",
    photo: "/stacks/stack-4.jpg",
    caption: "Found family trope supremacy 💙",
    books: [
      { book: mockBooks[5], matchLevel: "high" }, // Six of Crows
      { book: mockBooks[0], matchLevel: "medium" }, // Fourth Wing
      { book: mockBooks[2], matchLevel: "low" }, // The Secret History
    ],
    likeCount: 567,
    commentCount: 43,
    createdAt: "2024-10-24T09:20:00Z",
    matchScore: 65,
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
