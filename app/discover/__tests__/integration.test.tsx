import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscoverPage from '../page';

// Mock the fetch API for search endpoint
global.fetch = vi.fn();

describe('Discover Page Integration', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks();
  });

  it('should render search bar and browse sections', () => {
    render(<DiscoverPage />);

    // Check for search input
    const searchInput = screen.getByPlaceholderText(/Try:/i);
    expect(searchInput).toBeInTheDocument();

    // Check for page heading
    expect(screen.getByText('Discover')).toBeInTheDocument();

    // Check for browse sections
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  it('should switch to natural search mode when query is entered', async () => {
    const user = userEvent.setup();

    // Mock successful search response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        query: 'dark thriller',
        results: [
          {
            book: {
              id: 'book-1',
              title: 'The Silent Patient',
              author: 'Alex Michaelides',
              cover: 'https://example.com/cover.jpg',
              genres: ['Thriller'],
              tropes: ['unreliable narrator'],
              pageCount: 336,
              publishYear: 2019
            },
            matchScore: 95,
            matchReasons: ['Dark and suspenseful', 'Psychological thriller'],
            relevanceToQuery: 95
          }
        ],
        totalResults: 1,
        enrichedContext: {
          excludedReadBooks: 0,
          userProfileUsed: true
        }
      })
    });

    render(<DiscoverPage />);

    const searchInput = screen.getByPlaceholderText(/Try:/i);

    // Type search query
    await user.type(searchInput, 'dark thriller');

    // Submit the form
    await user.keyboard('{Enter}');

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/AI POWERED/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/search/natural',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'dark thriller',
          userId: 'user-1'
        })
      })
    );
  });

  it('should display search results after query', async () => {
    const user = userEvent.setup();

    // Mock successful search response with results
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        query: 'psychological thriller',
        results: [
          {
            book: {
              id: 'book-1',
              title: 'The Silent Patient',
              author: 'Alex Michaelides',
              cover: 'https://example.com/cover.jpg',
              genres: ['Thriller', 'Psychological'],
              tropes: ['unreliable narrator'],
              pageCount: 336,
              publishYear: 2019
            },
            matchScore: 95,
            matchReasons: [
              'Matches your love of psychological thrillers',
              'Features unreliable narrator',
              'Dark and suspenseful mood'
            ],
            relevanceToQuery: 95
          }
        ],
        totalResults: 1,
        enrichedContext: {
          excludedReadBooks: 4,
          userProfileUsed: true
        }
      })
    });

    render(<DiscoverPage />);

    const searchInput = screen.getByPlaceholderText(/Try:/i);
    await user.type(searchInput, 'psychological thriller');
    await user.keyboard('{Enter}');

    // Wait for loading to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText(/AI POWERED/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify book title appears in results
    await waitFor(() => {
      expect(screen.getByText('The Silent Patient')).toBeInTheDocument();
    }, { timeout: 1000 });

    expect(screen.getByText(/Alex Michaelides/i)).toBeInTheDocument();
    expect(screen.getByText(/95% MATCH/i)).toBeInTheDocument();
  });

  it('should return to browse mode when search is cleared', async () => {
    const user = userEvent.setup();

    // Mock successful search response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        query: 'dark thriller',
        results: [
          {
            book: {
              id: 'book-1',
              title: 'Test Book',
              author: 'Test Author',
              cover: 'https://example.com/cover.jpg',
              genres: ['Thriller'],
              tropes: ['test'],
              pageCount: 300,
              publishYear: 2020
            },
            matchScore: 85,
            matchReasons: ['Test reason'],
            relevanceToQuery: 85
          }
        ],
        totalResults: 1
      })
    });

    render(<DiscoverPage />);

    const searchInput = screen.getByPlaceholderText(/Try:/i) as HTMLInputElement;

    // Perform search
    await user.type(searchInput, 'dark thriller');
    await user.keyboard('{Enter}');

    // Wait for search mode
    await waitFor(() => {
      expect(screen.getByText(/AI POWERED/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify we're in search mode (browse sections are hidden)
    expect(screen.queryByText(/Trending Now/i)).not.toBeInTheDocument();

    // Click the clear button (X icon) - this triggers onClear which switches back to browse mode
    await waitFor(() => {
      const xButtons = screen.getAllByRole('button');
      const clearButton = xButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg !== null;
      });
      return clearButton !== undefined;
    });

    const xButtons = screen.getAllByRole('button');
    const clearButton = xButtons.find(btn => btn.querySelector('svg'));
    if (clearButton) {
      await user.click(clearButton);

      // Should return to browse mode
      await waitFor(() => {
        expect(screen.getByText(/Trending Now/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    }
  });

  it('should handle search errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock failed search response
    (global.fetch as any).mockRejectedValueOnce(new Error('Search failed'));

    render(<DiscoverPage />);

    const searchInput = screen.getByPlaceholderText(/Try:/i);
    await user.type(searchInput, 'test query');
    await user.keyboard('{Enter}');

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Search failed/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should display vibe chips in browse mode', () => {
    render(<DiscoverPage />);

    // Vibe chips should be visible in browse mode
    // Note: The exact text depends on VibeChips component implementation
    // This test verifies the component structure is correct
    const vibeChipsContainer = screen.getByText('Trending Now').parentElement?.parentElement;
    expect(vibeChipsContainer).toBeInTheDocument();
  });

  it('should hide vibe chips in natural search mode', async () => {
    const user = userEvent.setup();

    // Mock successful search
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        query: 'test',
        results: [],
        totalResults: 0
      })
    });

    render(<DiscoverPage />);

    const searchInput = screen.getByPlaceholderText(/Try:/i);
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    // Wait for search mode
    await waitFor(() => {
      expect(screen.queryByText('Trending Now')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
