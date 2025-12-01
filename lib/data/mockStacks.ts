/**
 * Mock stack and comment data
 */

import type { Stack, Comment } from '../types';
import { mockBooks } from './mockBooks';

// Mock stacks
export const mockStacks: Stack[] = [
  {
    id: "stack-1",
    userId: "user-2",
    photo: "/images/bookstacks.jpg",
    caption: "My current dark academia TBR 🖤📚",
    books: [
      { book: mockBooks[2]!, matchLevel: "high" }, // The Secret History
      { book: mockBooks[3]!, matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[7]!, matchLevel: "medium" }, // Normal People
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
      { book: mockBooks[0]!, matchLevel: "high" }, // Fourth Wing
      { book: mockBooks[1]!, matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6]!, matchLevel: "medium" }, // The Cruel Prince
      { book: mockBooks[3]!, matchLevel: "high" }, // The Song of Achilles
      { book: mockBooks[5]!, matchLevel: "medium" }, // Six of Crows
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
      { book: mockBooks[3]!, matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[7]!, matchLevel: "low" }, // Normal People
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
      { book: mockBooks[5]!, matchLevel: "high" }, // Six of Crows
      { book: mockBooks[0]!, matchLevel: "medium" }, // Fourth Wing
      { book: mockBooks[2]!, matchLevel: "low" }, // The Secret History
      { book: mockBooks[1]!, matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6]!, matchLevel: "medium" }, // The Cruel Prince
      { book: mockBooks[4]!, matchLevel: "read" }, // It Ends With Us
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
      { book: mockBooks[1]!, matchLevel: "high" }, // ACOTAR
      { book: mockBooks[6]!, matchLevel: "high" }, // The Cruel Prince
      { book: mockBooks[5]!, matchLevel: "medium" }, // Six of Crows
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
      { book: mockBooks[3]!, matchLevel: "high" }, // The Song of Achilles
      { book: mockBooks[7]!, matchLevel: "read" }, // Normal People
      { book: mockBooks[4]!, matchLevel: "medium" }, // It Ends With Us
      { book: mockBooks[2]!, matchLevel: "high" }, // The Secret History
      { book: mockBooks[0]!, matchLevel: "low" }, // Fourth Wing
      { book: mockBooks[1]!, matchLevel: "medium" }, // ACOTAR
      { book: mockBooks[5]!, matchLevel: "high" }, // Six of Crows
      { book: mockBooks[6]!, matchLevel: "read" }, // The Cruel Prince
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
      { book: mockBooks[0]!, matchLevel: "high" }, // Fourth Wing
      { book: mockBooks[2]!, matchLevel: "medium" }, // The Secret History
      { book: mockBooks[4]!, matchLevel: "low" }, // It Ends With Us
      { book: mockBooks[6]!, matchLevel: "high" }, // The Cruel Prince
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
      { book: mockBooks[5]!, matchLevel: "high" }, // Six of Crows
      { book: mockBooks[1]!, matchLevel: "read" }, // ACOTAR
      { book: mockBooks[3]!, matchLevel: "medium" }, // The Song of Achilles
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
      { book: mockBooks[7]!, matchLevel: "high" }, // Normal People
      { book: mockBooks[2]!, matchLevel: "medium" }, // The Secret History
      { book: mockBooks[3]!, matchLevel: "read" }, // The Song of Achilles
      { book: mockBooks[4]!, matchLevel: "high" }, // It Ends With Us
      { book: mockBooks[1]!, matchLevel: "low" }, // ACOTAR
      { book: mockBooks[5]!, matchLevel: "medium" }, // Six of Crows
      { book: mockBooks[0]!, matchLevel: "high" }, // Fourth Wing
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

