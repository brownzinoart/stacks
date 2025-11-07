# API Setup Guide

## Required API Keys

### 1. Anthropic Claude API
- Sign up: https://console.anthropic.com/
- Navigate to: API Keys
- Create new key
- Cost: ~$0.001-0.003 per search with Haiku
- Add to `.env.local` as `ANTHROPIC_API_KEY`

### 2. TMDB API (The Movie Database)
- Sign up: https://www.themoviedb.org/signup
- Navigate to: Settings > API
- Request API key (free tier)
- Add to `.env.local` as `TMDB_API_KEY`

### 3. Google Books API
- Enable at: https://console.cloud.google.com/apis/library/books.googleapis.com
- Create credentials (API key)
- Optional for MVP (has generous unauthenticated rate limit)
- Add to `.env.local` as `GOOGLE_BOOKS_API_KEY`

## Rate Limits (Free Tier)
- TMDB: 40 requests/10 seconds
- Google Books: 1000 requests/day (without key), 100,000/day (with key)
- Claude: Pay-as-you-go, ~$0.001-0.003/search
