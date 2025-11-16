# Natural Language Search Feature

## Overview

AI-powered book discovery that understands natural language queries like "cozy mystery in a bookshop" or "like Succession but a book" and returns personalized recommendations.

## Architecture

### Two-Tier Claude Haiku System

**Secondary Model (Context Enrichment):**
- Detects movie/TV references in query
- Fetches themes from TMDB API
- Analyzes user's reading profile
- Expands query with relevant context

**Primary Model (Book Matching):**
- Receives enriched query + user context
- Semantically matches against book catalog
- Returns ranked results with explanations
- Filters out already-read books

### Data Flow

```
User Query
    ↓
TMDB API (movie references)
    ↓
Claude Secondary (enrich context)
    ↓
User Profile (reading history)
    ↓
Claude Primary (semantic matching)
    ↓
Ranked Results
```

## API Endpoints

### POST /api/search/natural

**Request:**
```json
{
  "query": "dark psychological thriller with a twist",
  "userId": "user-1"
}
```

**Response:**
```json
{
  "success": true,
  "query": "dark psychological thriller with a twist",
  "results": [
    {
      "book": { ... },
      "matchScore": 95,
      "matchReasons": [
        "Matches your love of psychological thrillers",
        "Features unreliable narrator you enjoy",
        "Dark and suspenseful mood"
      ],
      "relevanceToQuery": 95
    }
  ],
  "totalResults": 8,
  "enrichedContext": {
    "excludedReadBooks": 4,
    "userProfileUsed": true
  }
}
```

## Cost Analysis (MVP)

**Per Search:**
- Claude Haiku (2 calls): ~$0.002-0.003
- TMDB API: Free (40 req/10s limit)
- Google Books: Free (1000 req/day)

**Monthly (1000 searches):**
- Total: ~$2-3
- Caching reduces repeat queries

## User Profile (Mock Data for MVP)

Current implementation uses mock data in `lib/mockData.ts`:

```typescript
export const mockCurrentUserProfile: UserReadingProfile = {
  favoriteGenres: ["Thriller", "Dark Fantasy", "Science Fiction"],
  favoriteAuthors: ["Andy Weir", "Leigh Bardugo"],
  favoriteTropes: ["unreliable narrator", "dark academia", "found family"],
  dislikedTropes: ["love triangle", "instalove"],
  preferredMood: ["dark", "suspenseful", "character-driven"],
  readingHistory: [
    { bookId: "book-1", rating: 5, finishedDate: "2024-10-15" },
    ...
  ],
  engagementHistory: {
    likedStackIds: ["stack-1", "stack-3"],
    savedStackIds: ["stack-2"],
    commentedStackIds: ["stack-1"]
  }
}
```

**Future Implementation:**
- Track actual user reading history from `/reading` page
- Analyze books in user's created stacks
- Track engagement (likes, saves, comments) on other users' stacks
- Use Claude to periodically analyze patterns and update profile

## Search Examples

### Movie References
**Query:** "like Succession but a book"
**Detected:** Movie reference → TMDB themes → family drama, corporate intrigue, morally grey characters
**Results:** "Babel", "Ninth House" (complex power dynamics, morally ambiguous)

### Vibe-Based
**Query:** "cozy mystery in a bookshop"
**Themes:** cozy, mystery, bookish setting, low stakes
**Results:** Books with cozy mood + mystery genre + bookish themes

### Trope-Based
**Query:** "dark academia with secret societies"
**Themes:** dark academia, secret societies, academic setting
**Results:** "Ninth House", "Babel"

### Mood-Based
**Query:** "something uplifting after a hard week"
**User Context:** Prefers dark themes usually → suggest lighter books
**Results:** "The House in the Cerulean Sea", "Beach Read"

## Testing

### Unit Tests
```bash
npm test -- lib/services/__tests__/tmdb.test.ts
npm test -- lib/services/__tests__/claude.test.ts
npm test -- app/api/search/__tests__/natural.test.ts
```

### Integration Tests
```bash
npm test -- app/discover/__tests__/integration.test.tsx
```

### Manual Testing
1. Start dev server: `npm run dev`
2. Navigate to: http://localhost:3000/discover
3. Test queries:
   - "dark psychological thriller"
   - "like Gone Girl"
   - "cozy fantasy with found family"
   - "Succession vibes but a book"

## Future Enhancements

### Phase 2 (Post-MVP)
- [ ] Real user authentication and profiles
- [ ] Database storage for user reading history
- [ ] Analytics on search patterns
- [ ] A/B testing different prompts
- [ ] Feedback loop: "Was this helpful?" → improve results

### Phase 3 (Scale)
- [ ] Vector embeddings for faster initial matching
- [ ] Hybrid search: embeddings + Claude refinement
- [ ] Expand book catalog beyond mock data
- [ ] Multi-language support
- [ ] Social features: see what friends are searching for

## Troubleshooting

### Claude API Errors
- Check `ANTHROPIC_API_KEY` in `.env.local`
- Verify API key has credits
- Check rate limits (Haiku: very high, unlikely to hit)

### TMDB API Errors
- Check `TMDB_API_KEY` in `.env.local`
- Verify rate limit: 40 requests/10 seconds
- Movie not found: fallback to themes from query

### Google Books API
- API key optional for MVP
- Rate limit: 1000 requests/day without key
- Use caching to reduce requests

### Search Returns No Results
- Check if all books in catalog match `readBookIds` (all read)
- Verify book metadata has themes/tropes populated
- Check Claude prompt formatting in `lib/services/claude.ts`

## Performance

### Caching Strategy
- 5-minute TTL for search results
- LRU cache with 100-entry limit
- Cache key: `userId:query`

### Response Times
- With cache hit: ~50-100ms
- Without cache: ~2-4 seconds (Claude API)
- TMDB lookup adds ~500ms if movie reference detected

### Optimization Opportunities
- Pre-compute user profile summaries
- Cache TMDB movie themes
- Use streaming for real-time results
- Add loading states and skeleton screens
