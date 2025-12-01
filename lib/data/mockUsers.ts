/**
 * Mock user data
 */

import type { User } from '../types';

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

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  if (id === currentUser.id) return currentUser;
  return mockUsers.find((u) => u.id === id);
}

