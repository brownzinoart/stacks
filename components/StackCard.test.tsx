import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StackCard from './StackCard';
import type { Stack, User } from '../lib/mockData';

describe('StackCard Hashtag Rendering', () => {
  const mockUser: User = {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    avatar: '/avatar.jpg',
    bio: 'Test bio',
    followerCount: 100,
    followingCount: 50,
  };

  const mockStackWithHashtags: Stack = {
    id: 'stack-1',
    userId: 'user-1',
    photo: '/images/bookstacks7_#blues.jpg',
    caption: 'Feeling all the #blues with these melancholy reads 💙📖',
    books: [],
    likeCount: 100,
    commentCount: 5,
    createdAt: '2024-11-05T00:00:00Z',
    matchScore: 85,
    hashtags: ['blues'],
  };

  const mockStackWithoutHashtags: Stack = {
    id: 'stack-2',
    userId: 'user-1',
    photo: '/images/bookstacks.jpg',
    caption: 'My reading list',
    books: [],
    likeCount: 50,
    commentCount: 2,
    createdAt: '2024-11-05T00:00:00Z',
    matchScore: 70,
  };

  it('should render hashtags as clickable elements in caption', () => {
    render(<StackCard stack={mockStackWithHashtags} user={mockUser} />);

    // Find the hashtag in the caption
    const hashtagElement = screen.getByText('#blues');
    expect(hashtagElement).toBeInTheDocument();
    expect(hashtagElement.tagName).toBe('BUTTON');
  });

  it('should call onHashtagClick when hashtag is clicked', async () => {
    const onHashtagClick = vi.fn();
    const user = userEvent.setup();

    render(
      <StackCard
        stack={mockStackWithHashtags}
        user={mockUser}
        onHashtagClick={onHashtagClick}
      />
    );

    const hashtagElement = screen.getByText('#blues');
    await user.click(hashtagElement);

    expect(onHashtagClick).toHaveBeenCalledWith('blues');
  });

  it('should render caption normally when no hashtags are present', () => {
    render(<StackCard stack={mockStackWithoutHashtags} user={mockUser} />);

    const caption = screen.getByText('My reading list');
    expect(caption).toBeInTheDocument();
  });

  it('should style hashtags with blue gradient', () => {
    render(<StackCard stack={mockStackWithHashtags} user={mockUser} />);

    const hashtagElement = screen.getByText('#blues');
    expect(hashtagElement).toHaveClass('bg-gradient-to-br');
    expect(hashtagElement).toHaveClass('from-[#2563eb]');
    expect(hashtagElement).toHaveClass('to-[#0891b2]');
  });
});
