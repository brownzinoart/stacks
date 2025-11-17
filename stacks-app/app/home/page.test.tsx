import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';

describe('HomePage Hashtag Filtering', () => {
  it('should display all stacks by default', () => {
    render(<HomePage />);

    // Should show all 9 stacks
    const stackCards = screen.getAllByRole('article');
    expect(stackCards).toHaveLength(9);
  });

  it('should filter stacks when hashtag is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Click the #blues hashtag
    const bluesHashtag = screen.getAllByText('#blues')[0];
    await user.click(bluesHashtag);

    // Should only show 3 stacks with #blues hashtag
    const stackCards = screen.getAllByRole('article');
    expect(stackCards).toHaveLength(3);

    // All visible stacks should have #blues in caption
    stackCards.forEach((card) => {
      const caption = within(card).getByText(/#blues/);
      expect(caption).toBeInTheDocument();
    });
  });

  it('should show filter banner when hashtag is active', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Click hashtag
    const bluesHashtag = screen.getAllByText('#blues')[0];
    await user.click(bluesHashtag);

    // Should show "Showing #blues" banner
    const filterBanner = screen.getByText(/showing #blues/i);
    expect(filterBanner).toBeInTheDocument();
  });

  it('should clear filter when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Click hashtag to filter
    const bluesHashtag = screen.getAllByText('#blues')[0];
    await user.click(bluesHashtag);

    // Verify filtered
    expect(screen.getAllByRole('article')).toHaveLength(3);

    // Click close button
    const closeButton = screen.getByRole('button', { name: /clear filter/i });
    await user.click(closeButton);

    // Should show all stacks again
    const stackCards = screen.getAllByRole('article');
    expect(stackCards).toHaveLength(9);
  });

  it('should hide filter banner when filter is cleared', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Click hashtag
    const bluesHashtag = screen.getAllByText('#blues')[0];
    await user.click(bluesHashtag);

    // Click close
    const closeButton = screen.getByRole('button', { name: /clear filter/i });
    await user.click(closeButton);

    // Banner should be gone
    const filterBanner = screen.queryByText(/showing #blues/i);
    expect(filterBanner).not.toBeInTheDocument();
  });
});
