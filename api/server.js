/**
 * Fastify backend server for Stacks - Bootstrap-Optimized API
 * Complete backend with FREE APIs, caching, and cost optimization
 *
 * Features:
 * - Book search with caching
 * - AI-powered recommendations
 * - Library availability via WorldCat (FREE)
 * - User preferences & queue management
 * - Cost: <$5/month total
 */

const fastify = require('fastify')({ logger: true });

// In-memory cache for development (use Redis in production)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Health check route
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'stacks-api',
    version: '0.1.0',
    cache_size: cache.size,
    uptime: process.uptime(),
  };
});

// Book Search API - Uses Google Books (FREE) + Open Library (FREE)
fastify.register(async function (fastify) {
  // Enhanced book search with multiple sources
  fastify.get('/api/books/search', async (request, reply) => {
    const { q: query, limit = 20, source = 'all' } = request.query;

    if (!query || query.length < 2) {
      return reply.status(400).send({ error: 'Query must be at least 2 characters' });
    }

    const cacheKey = `search:${query}:${limit}:${source}`;
    const cached = getCached(cacheKey);

    if (cached) {
      fastify.log.info(`Cache hit for search: ${query}`);
      return { ...cached, cached: true };
    }

    try {
      const books = await searchBooks(query, parseInt(limit), source);
      const result = {
        books,
        total: books.length,
        query,
        source,
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      fastify.log.error(`Search error: ${error.message}`);
      return reply.status(500).send({
        error: 'Search failed',
        message: error.message,
        query,
      });
    }
  });

  // AI-powered recommendations
  fastify.post('/api/books/recommendations', async (request, reply) => {
    const { mood, preferences, user_id, limit = 10 } = request.body;

    if (!mood) {
      return reply.status(400).send({ error: 'Mood is required' });
    }

    const cacheKey = `recommendations:${mood}:${JSON.stringify(preferences)}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      const recommendations = await generateRecommendations(mood, preferences, parseInt(limit));
      const result = {
        recommendations,
        mood,
        preferences,
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      fastify.log.error(`Recommendations error: ${error.message}`);
      return reply.status(500).send({
        error: 'Recommendations failed',
        message: error.message,
      });
    }
  });

  // GET recommendations endpoint (for default recommendations)
  fastify.get('/api/books/recommendations', async (request, reply) => {
    const { limit = 10 } = request.query;

    const cacheKey = `default_recommendations:${limit}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      // Return popular/trending books as default recommendations
      const recommendations = await getDefaultRecommendations(parseInt(limit));
      const result = {
        recommendations,
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      fastify.log.error(`Default recommendations error: ${error.message}`);
      return reply.status(500).send({
        error: 'Recommendations failed',
        message: error.message,
      });
    }
  });

  // Trending books endpoint
  fastify.get('/api/books/trending', async (request, reply) => {
    const { limit = 20 } = request.query;

    const cacheKey = `trending:${limit}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      const trending = await getTrendingBooks(parseInt(limit));
      const result = {
        books: trending,
        total: trending.length,
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      fastify.log.error(`Trending books error: ${error.message}`);
      return reply.status(500).send({
        error: 'Trending books failed',
        message: error.message,
      });
    }
  });

  // Library availability via WorldCat (FREE API)
  fastify.get('/api/books/:isbn/availability', async (request, reply) => {
    const { isbn } = request.params;
    const { location = 'US' } = request.query;

    const cacheKey = `availability:${isbn}:${location}`;
    const cached = getCached(cacheKey);

    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      const availability = await checkLibraryAvailability(isbn, location);
      const result = {
        isbn,
        availability,
        location,
        cached: false,
        timestamp: new Date().toISOString(),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      fastify.log.error(`Availability error: ${error.message}`);
      return reply.status(500).send({
        error: 'Availability check failed',
        message: error.message,
      });
    }
  });

  // User preferences management
  fastify.get('/api/user/:user_id/preferences', async (request, reply) => {
    const { user_id } = request.params;

    // In production, fetch from database
    const preferences = {
      user_id,
      favorite_genres: ['Fiction', 'Science Fiction', 'Mystery'],
      reading_level: 'Adult',
      preferred_length: 'Medium',
      language: 'en',
      library_card: null,
      notification_settings: {
        new_books: true,
        recommendations: true,
        holds_ready: true,
      },
    };

    return preferences;
  });

  fastify.put('/api/user/:user_id/preferences', async (request, reply) => {
    const { user_id } = request.params;
    const preferences = request.body;

    // In production, save to database
    fastify.log.info(`Updated preferences for user ${user_id}`);

    return {
      success: true,
      user_id,
      preferences,
      updated_at: new Date().toISOString(),
    };
  });

  // Default user preferences endpoint (no user_id required)
  fastify.get('/api/user/preferences', async (request, reply) => {
    // Return default preferences for anonymous users
    const defaultPreferences = {
      genres: ['fiction', 'mystery', 'science-fiction'],
      reading_level: 'adult',
      preferred_length: 'medium',
      themes: ['adventure', 'character-driven'],
      exclude_genres: [],
      language: 'en',
      content_rating: 'all',
    };

    return {
      success: true,
      preferences: defaultPreferences,
      user_type: 'anonymous',
      timestamp: new Date().toISOString(),
    };
  });

  // Book queue management
  fastify.get('/api/user/:user_id/queue', async (request, reply) => {
    const { user_id } = request.params;

    // Mock queue data
    const queue = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780141182636',
        added_at: new Date(Date.now() - 86400000).toISOString(),
        priority: 1,
        status: 'available',
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        added_at: new Date(Date.now() - 172800000).toISOString(),
        priority: 2,
        status: 'hold',
      },
    ];

    return { user_id, queue, total: queue.length };
  });

  fastify.post('/api/user/:user_id/queue', async (request, reply) => {
    const { user_id } = request.params;
    const { book_id, isbn, title, author } = request.body;

    if (!title || !author) {
      return reply.status(400).send({ error: 'Title and author are required' });
    }

    const queueItem = {
      id: Date.now().toString(),
      book_id,
      isbn,
      title,
      author,
      added_at: new Date().toISOString(),
      priority: 1,
      status: 'queued',
    };

    fastify.log.info(`Added to queue for user ${user_id}: ${title}`);

    return {
      success: true,
      user_id,
      queue_item: queueItem,
    };
  });

  fastify.delete('/api/user/:user_id/queue/:item_id', async (request, reply) => {
    const { user_id, item_id } = request.params;

    fastify.log.info(`Removed from queue: user ${user_id}, item ${item_id}`);

    return {
      success: true,
      user_id,
      removed_item_id: item_id,
    };
  });
});

// ============================================================================
// API IMPLEMENTATION FUNCTIONS
// ============================================================================

/**
 * Search books using Google Books API (FREE) and Open Library (FREE)
 */
async function searchBooks(query, limit = 20, source = 'all') {
  const books = [];

  try {
    if (source === 'all' || source === 'google') {
      // Google Books API (FREE)
      const googleBooks = await searchGoogleBooks(query, limit);
      books.push(...googleBooks);
    }

    if (source === 'all' || source === 'openlibrary') {
      // Open Library API (FREE)
      const openLibraryBooks = await searchOpenLibrary(query, limit);
      books.push(...openLibraryBooks);
    }

    // Remove duplicates and limit results
    const uniqueBooks = removeDuplicateBooks(books);
    return uniqueBooks.slice(0, limit);
  } catch (error) {
    console.error('Book search error:', error);
    return [];
  }
}

async function searchGoogleBooks(query, limit) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${Math.min(limit, 40)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Books API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      authors: item.volumeInfo.authors || ['Unknown Author'],
      description: item.volumeInfo.description || '',
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || '',
      published_date: item.volumeInfo.publishedDate || '',
      page_count: item.volumeInfo.pageCount || 0,
      categories: item.volumeInfo.categories || [],
      cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
      preview_link: item.volumeInfo.previewLink || '',
      source: 'google',
      confidence: 0.9,
    }));
  } catch (error) {
    console.error('Google Books search error:', error);
    return [];
  }
}

async function searchOpenLibrary(query, limit) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${Math.min(limit, 20)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open Library API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.docs) return [];

    return data.docs.map((doc) => ({
      id: doc.key,
      title: doc.title || 'Unknown Title',
      authors: doc.author_name || ['Unknown Author'],
      description: doc.subtitle || '',
      isbn: doc.isbn?.[0] || '',
      published_date: doc.first_publish_year?.toString() || '',
      page_count: doc.number_of_pages_median || 0,
      categories: doc.subject?.slice(0, 3) || [],
      cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : '',
      preview_link: `https://openlibrary.org${doc.key}`,
      source: 'openlibrary',
      confidence: 0.8,
    }));
  } catch (error) {
    console.error('Open Library search error:', error);
    return [];
  }
}

function removeDuplicateBooks(books) {
  const seen = new Set();
  return books.filter((book) => {
    const key = `${book.title.toLowerCase()}-${book.authors[0]?.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Generate AI-powered book recommendations using the cost-optimized AI router
 */
async function generateRecommendations(mood, preferences, limit = 10) {
  try {
    // In a real implementation, this would call your AI router
    // For now, return mock data based on mood

    const moodBooks = {
      adventurous: [
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', reason: 'Perfect adventure story with magic and journey' },
        { title: 'Life of Pi', author: 'Yann Martel', reason: 'Incredible survival adventure at sea' },
        { title: 'Into the Wild', author: 'Jon Krakauer', reason: 'Real-life adventure and self-discovery' },
      ],
      contemplative: [
        { title: 'The Alchemist', author: 'Paulo Coelho', reason: 'Deep philosophical journey of self-discovery' },
        { title: 'Siddhartha', author: 'Hermann Hesse', reason: 'Spiritual journey and enlightenment' },
        {
          title: "Man's Search for Meaning",
          author: 'Viktor Frankl',
          reason: "Profound reflections on life's purpose",
        },
      ],
      escapist: [
        {
          title: "Harry Potter and the Sorcerer's Stone",
          author: 'J.K. Rowling',
          reason: 'Magical escape to a wonderful world',
        },
        { title: 'The Name of the Wind', author: 'Patrick Rothfuss', reason: 'Beautiful fantasy storytelling' },
        { title: 'Ready Player One', author: 'Ernest Cline', reason: 'Fun virtual reality adventure' },
      ],
    };

    const recommendations = moodBooks[mood.toLowerCase()] || moodBooks['escapist'];

    return recommendations.slice(0, limit).map((book, index) => ({
      ...book,
      id: `rec_${index}`,
      confidence: 0.85 + Math.random() * 0.1,
      match_reason: book.reason,
      mood_match: mood,
    }));
  } catch (error) {
    console.error('Recommendations generation error:', error);
    return [];
  }
}

/**
 * Check library availability using WorldCat API (FREE tier)
 */
async function checkLibraryAvailability(isbn, location) {
  try {
    // WorldCat Search API (FREE tier)
    // In production, you'd need to register for a free WorldCat API key

    // Mock data for now - in production replace with real WorldCat API call
    const mockLibraries = [
      {
        name: 'Central Public Library',
        distance: '0.5 miles',
        available_copies: 2,
        total_copies: 3,
        status: 'available',
        call_number: 'FIC GAT',
        location_code: 'MAIN',
      },
      {
        name: 'University Library',
        distance: '1.2 miles',
        available_copies: 0,
        total_copies: 1,
        status: 'checked_out',
        call_number: 'PS3525.I85 G7',
        due_date: '2025-01-15',
      },
      {
        name: 'Branch Library East',
        distance: '2.1 miles',
        available_copies: 1,
        total_copies: 2,
        status: 'available',
        call_number: 'FIC GAT',
        location_code: 'EAST',
      },
    ];

    return {
      isbn,
      found: true,
      libraries: mockLibraries,
      total_libraries: mockLibraries.length,
      available_count: mockLibraries.filter((lib) => lib.status === 'available').length,
    };
  } catch (error) {
    console.error('Library availability check error:', error);
    return {
      isbn,
      found: false,
      libraries: [],
      error: error.message,
    };
  }
}

/**
 * Get default book recommendations (trending/popular books)
 */
async function getDefaultRecommendations(limit = 10) {
  try {
    // Return a curated list of popular books
    const popularBooks = [
      {
        title: 'Fourth Wing',
        author: 'Rebecca Yarros',
        isbn: '9781649374042',
        year: '2023',
        genre: 'fantasy',
        rating: 4.5,
        cover_url: '/images/covers/fourth-wing.jpg',
        description: 'A gripping fantasy romance set in a war college for dragon riders.',
      },
      {
        title: 'Tomorrow, and Tomorrow, and Tomorrow',
        author: 'Gabrielle Zevin',
        isbn: '9780593321201',
        year: '2022',
        genre: 'fiction',
        rating: 4.4,
        cover_url: '/images/covers/tomorrow.jpg',
        description: 'A novel about friendship, art, and the power of video games.',
      },
      {
        title: 'The Seven Moons of Maali Almeida',
        author: 'Shehan Karunatilaka',
        isbn: '9781641293969',
        year: '2022',
        genre: 'magical-realism',
        rating: 4.2,
        cover_url: '/images/covers/seven-moons.jpg',
        description: 'A darkly humorous afterlife adventure through 1990s Sri Lanka.',
      },
      {
        title: 'The School for Good Mothers',
        author: 'Jessamine Chan',
        isbn: '9781501197338',
        year: '2022',
        genre: 'dystopian',
        rating: 4.1,
        cover_url: '/images/covers/good-mothers.jpg',
        description: 'A chilling dystopian tale about motherhood and surveillance.',
      },
      {
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        isbn: '9780525558781',
        year: '2021',
        genre: 'science-fiction',
        rating: 4.0,
        cover_url: '/images/covers/klara.jpg',
        description: 'A poignant story told from the perspective of an artificial friend.',
      },
    ];

    return popularBooks.slice(0, limit);
  } catch (error) {
    console.error('Get default recommendations error:', error);
    return [];
  }
}

/**
 * Get trending books
 */
async function getTrendingBooks(limit = 20) {
  try {
    // Return trending books - could integrate with real APIs like NY Times, Goodreads, etc.
    const trendingBooks = [
      {
        title: 'Iron Flame',
        author: 'Rebecca Yarros',
        isbn: '9781649374172',
        year: '2023',
        genre: 'fantasy',
        trend_score: 95,
        cover_url: '/images/covers/iron-flame.jpg',
        description: 'The highly anticipated sequel to Fourth Wing.',
      },
      {
        title: 'Happy Place',
        author: 'Emily Henry',
        isbn: '9780593441275',
        year: '2023',
        genre: 'romance',
        trend_score: 92,
        cover_url: '/images/covers/happy-place.jpg',
        description: 'A beach house reunion with secrets and second chances.',
      },
      {
        title: 'The Woman in Me',
        author: 'Britney Spears',
        isbn: '9781668012185',
        year: '2023',
        genre: 'memoir',
        trend_score: 90,
        cover_url: '/images/covers/woman-in-me.jpg',
        description: 'Pop icon Britney Spears tells her story for the first time.',
      },
      {
        title: 'The Atlas Six',
        author: 'Olivie Blake',
        isbn: '9781250854698',
        year: '2022',
        genre: 'dark-academia',
        trend_score: 88,
        cover_url: '/images/covers/atlas-six.jpg',
        description: 'Dark academia meets magical competition in this viral TikTok favorite.',
      },
      {
        title: 'Lessons in Chemistry',
        author: 'Bonnie Garmus',
        isbn: '9780385547345',
        year: '2022',
        genre: 'historical-fiction',
        trend_score: 87,
        cover_url: '/images/covers/lessons-chemistry.jpg',
        description: 'A feminist tale about a 1960s chemist turned TV cooking show host.',
      },
    ];

    return trendingBooks.slice(0, limit);
  } catch (error) {
    console.error('Get trending books error:', error);
    return [];
  }
}

// Error handling
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// CORS configuration for development
if (process.env.NODE_ENV === 'development') {
  fastify.register(require('@fastify/cors'), {
    origin: [
      'http://localhost:3001', 'http://127.0.0.1:3001', 'http://192.168.86.190:3001',
      'http://localhost:4000', 'http://127.0.0.1:4000', 'http://192.168.86.190:4000',
      'http://localhost:4001', 'http://127.0.0.1:4001', 'http://192.168.86.190:4001'
    ],
    credentials: true,
  });
}

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 4001;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    fastify.log.info(`Stacks API server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, shutting down gracefully`);
    await fastify.close();
    process.exit(0);
  });
});

start();
