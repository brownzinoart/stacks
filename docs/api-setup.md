# API Setup Guide

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Fill in your API keys (see sections below)
3. Restart your development server

## Required API Keys

### 1. Anthropic Claude API (REQUIRED)
- **Purpose**: Natural language book search and query enrichment
- **Sign up**: https://console.anthropic.com/
- **Navigate to**: API Keys → Create new key
- **Cost**: ~$0.001-0.003 per search with Haiku model
- **Rate limit**: Pay-as-you-go
- **Environment variable**: `ANTHROPIC_API_KEY`
- **Status**: Required - app will fail without this key

## Optional API Keys

### 2. TMDB API (The Movie Database) - Recommended
- **Purpose**: Extracting themes from movie references in search queries (e.g., "like Succession but a book")
- **Sign up**: https://www.themoviedb.org/signup
- **Navigate to**: Settings > API → Request API key
- **Cost**: Free tier available
- **Rate limit**: 40 requests/10 seconds
- **Environment variable**: `TMDB_API_KEY`
- **Status**: Optional - app gracefully degrades without this key

### 3. Google Books API (Server-side) - Optional
- **Purpose**: Book metadata enrichment on the server
- **Enable at**: https://console.cloud.google.com/apis/library/books.googleapis.com
- **Create credentials**: API key
- **Rate limit**: 1,000 requests/day (without key), 100,000/day (with key)
- **Environment variable**: `GOOGLE_BOOKS_API_KEY`
- **Status**: Optional - app works without this key but with lower rate limits

### 4. Google Books API (Client-side) - Optional
- **Purpose**: Book cover images and ratings in the browser
- **Enable at**: https://console.cloud.google.com/apis/library/books.googleapis.com
- **Create credentials**: API key (can use same key as server-side)
- **Rate limit**: 1,000 requests/day (without key), 100,000/day (with key)
- **Environment variable**: `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`
- **Status**: Optional - app works without this key but with lower rate limits
- **⚠️ Warning**: `NEXT_PUBLIC_` variables are exposed to the browser

### 5. New York Times Bestseller API - Optional
- **Purpose**: Checking if books are on NYT bestseller lists
- **Sign up**: https://developer.nytimes.com/
- **Get API key**: After signup, navigate to your apps → Create new app → Get API key
- **Cost**: Free tier available
- **Rate limit**: 500 requests/day, 5 per minute
- **Environment variable**: `NEXT_PUBLIC_NYT_API_KEY`
- **Status**: Optional - app gracefully degrades without this key
- **⚠️ Warning**: `NEXT_PUBLIC_` variables are exposed to the browser

## Environment Variable Summary

| Variable | Required | Server/Client | Purpose |
|----------|----------|--------------|---------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Server | Natural language search |
| `TMDB_API_KEY` | ❌ No | Server | Movie theme extraction |
| `GOOGLE_BOOKS_API_KEY` | ❌ No | Server | Book metadata enrichment |
| `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY` | ❌ No | Client | Book covers & ratings |
| `NEXT_PUBLIC_NYT_API_KEY` | ❌ No | Client | Bestseller status |

## Rate Limits (Free Tier)

- **TMDB**: 40 requests/10 seconds
- **Google Books**: 1,000 requests/day (without key), 100,000/day (with key)
- **Claude**: Pay-as-you-go, ~$0.001-0.003/search
- **NYT**: 500 requests/day, 5 per minute

## Testing Your Setup

After setting up your API keys, test them:

1. **Claude API**: Try a natural language search in the app
2. **TMDB API**: Visit `/api/test/tmdb?movie=Succession` in your browser
3. **Google Books**: Book covers and ratings should appear automatically
4. **NYT API**: Bestseller badges should appear on qualifying books

## Troubleshooting

- **"ANTHROPIC_API_KEY not set"**: Make sure you've added the key to `.env.local` and restarted your dev server
- **TMDB not working**: Check that `TMDB_API_KEY` is set correctly (app will work without it, just won't extract movie themes)
- **Google Books rate limits**: Add `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY` to increase rate limits
- **Environment variables not loading**: Ensure file is named `.env.local` (not `.env`) and restart your dev server
