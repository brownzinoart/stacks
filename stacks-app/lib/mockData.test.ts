import { describe, it, expect } from 'vitest';
import type { Stack } from './mockData';
import { mockStacks } from './mockData';

describe('Stack Interface', () => {
  it('should allow hashtags field on Stack objects', () => {
    // Arrange: Create a stack with hashtags
    const stackWithHashtags: Stack = {
      id: 'test-stack-1',
      userId: 'user-1',
      photo: '/test-image.jpg',
      caption: 'Test stack with #blues',
      books: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-11-05T00:00:00Z',
      hashtags: ['blues'], // This should be valid
    };

    // Assert: Hashtags field exists and is correct type
    expect(stackWithHashtags.hashtags).toBeDefined();
    expect(Array.isArray(stackWithHashtags.hashtags)).toBe(true);
    expect(stackWithHashtags.hashtags).toEqual(['blues']);
  });

  it('should allow Stack without hashtags field', () => {
    // Arrange: Create a stack without hashtags
    const stackWithoutHashtags: Stack = {
      id: 'test-stack-2',
      userId: 'user-1',
      photo: '/test-image.jpg',
      caption: 'Test stack',
      books: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: '2024-11-05T00:00:00Z',
      // No hashtags field - should be optional
    };

    // Assert: Stack is valid without hashtags
    expect(stackWithoutHashtags.hashtags).toBeUndefined();
  });
});

describe('Mock Stacks Data', () => {
  it('should use real image paths from /images/ directory', () => {
    // Verify all stacks use images from /images/bookstacks*.jpg (number optional)
    mockStacks.forEach((stack) => {
      expect(stack.photo).toMatch(/^\/images\/bookstacks\d*/);
    });
  });

  it('should have exactly 3 stacks with #blues hashtag', () => {
    const bluesStacks = mockStacks.filter((stack) =>
      stack.hashtags?.includes('blues')
    );

    expect(bluesStacks).toHaveLength(3);
  });

  it('should use #blues images (7, 8, 9) for stacks with #blues hashtag', () => {
    const bluesStacks = mockStacks.filter((stack) =>
      stack.hashtags?.includes('blues')
    );

    bluesStacks.forEach((stack) => {
      expect(stack.photo).toMatch(/bookstacks[789].*blues/);
    });
  });

  it('should space #blues stacks with at least 2 regular stacks between them', () => {
    // Find indices of stacks with #blues hashtag
    const bluesIndices = mockStacks
      .map((stack, index) => stack.hashtags?.includes('blues') ? index : -1)
      .filter(index => index !== -1);

    // Check spacing between consecutive #blues stacks
    for (let i = 1; i < bluesIndices.length; i++) {
      const spacing = bluesIndices[i] - bluesIndices[i - 1];
      expect(spacing).toBeGreaterThanOrEqual(3); // At least 2 stacks between (spacing of 3+)
    }
  });

  it('should have #blues in captions of stacks with blues hashtag', () => {
    const bluesStacks = mockStacks.filter((stack) =>
      stack.hashtags?.includes('blues')
    );

    bluesStacks.forEach((stack) => {
      expect(stack.caption).toMatch(/#blues/i);
    });
  });
});
