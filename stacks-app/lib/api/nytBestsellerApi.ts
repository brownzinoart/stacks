/**
 * New York Times Bestseller API
 * Free API - requires API key
 * Get key: https://developer.nytimes.com/
 * Rate limit: 500 requests per day, 5 per minute
 */

interface BestsellerInfo {
  isBestseller: boolean;
  listName?: string;
  weeksOnList?: number;
  rank?: number;
}

export async function checkBestseller(isbn: string): Promise<BestsellerInfo> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NYT_API_KEY;
    if (!apiKey) {
      return { isBestseller: false };
    }

    // Check current combined print and ebook list
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return { isBestseller: false };
    }

    const book = data.results.books.find((b: any) =>
      b.primary_isbn13 === isbn || b.primary_isbn10 === isbn
    );

    if (book) {
      return {
        isBestseller: true,
        listName: data.results.list_name,
        weeksOnList: book.weeks_on_list,
        rank: book.rank,
      };
    }

    return { isBestseller: false };
  } catch (error) {
    console.error('NYT API error:', error);
    return { isBestseller: false };
  }
}
