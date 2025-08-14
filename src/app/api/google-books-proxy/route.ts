import { NextRequest, NextResponse } from 'next/server';

// Use force-static for export, but runtime will be ignored since Capacitor uses live server
export const dynamic = 'force-static';
export const revalidate = false;

interface GoogleBooksRequest {
  query: string;
  maxResults?: number;
}

export async function POST(request: NextRequest) {
  console.log('Google Books Proxy called');
  
  try {
    const body: GoogleBooksRequest = await request.json();
    const { query, maxResults = 5 } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      console.error('Google Books API key not found');
      return NextResponse.json(
        { error: 'Google Books API key not configured' },
        { status: 500 }
      );
    }
    
    console.log(`Making request to Google Books for query: "${query}"`);
    
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=${maxResults}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Stacks-BookApp/1.0',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Books API returned ${response.status}: ${errorText}`);
      return NextResponse.json(
        { error: `Google Books API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`Google Books returned ${data.items?.length || 0} results`);
    
    // Transform the response to include the cover URLs
    const books = data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo?.title,
      authors: item.volumeInfo?.authors,
      publishedDate: item.volumeInfo?.publishedDate,
      description: item.volumeInfo?.description,
      isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier,
      pageCount: item.volumeInfo?.pageCount,
      categories: item.volumeInfo?.categories,
      averageRating: item.volumeInfo?.averageRating,
      imageLinks: item.volumeInfo?.imageLinks,
      coverUrl: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:'),
    })) || [];
    
    return NextResponse.json({
      success: true,
      totalItems: data.totalItems,
      books: books
    });
    
  } catch (error: any) {
    console.error('Google Books Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}