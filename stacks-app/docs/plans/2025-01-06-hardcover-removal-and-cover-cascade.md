# Hardcover Removal & Cover Image Cascade

**Date:** 2025-01-06
**Status:** Approved for implementation
**Goal:** Simplify API integrations and improve book cover reliability

## Decision

**Remove Hardcover API integration entirely** and implement a **cascading cover image system** for ~95% success rate.

## Context

### Why Remove Hardcover?
- GraphQL schema documentation is limited/unclear
- Multiple query attempts failed (ISBN field names don't match expected schema)
- Currently returning null (no value provided)
- Mock data is sufficient for MVP
- Adds unnecessary complexity for zero benefit

### What Stays?
- ✅ Google Books API (working - descriptions, ratings)
- ✅ NYT API (working - bestseller status)
- ✅ Reviews service abstraction (ready for future real data source)
- ✅ Open Library covers (free, fast, ~85% coverage)

## Design

### Part 1: Hardcover Removal

**Files to delete:**
1. `/app/api/hardcover/route.ts` - Server-side API proxy
2. `/lib/api/hardcoverApi.ts` - Client-side wrapper

**Files to modify:**
1. `/lib/mockData.ts` - Remove Hardcover from `getBookDetailWithAPIs()`
   ```typescript
   // BEFORE: 4 parallel API calls
   const [hardcoverData, googleData, bestsellerInfo, reviewsData] = await Promise.all([...]);

   // AFTER: 3 parallel API calls
   const [googleData, bestsellerInfo, reviewsData] = await Promise.all([
     getGoogleBooksData(isbn),
     checkBestseller(isbn),
     getBookReviews(isbn, bookId, 3), // Mock data via reviews service
   ]);
   ```

2. `/.env.local` - Remove `HARDCOVER_API_KEY=...` line
3. `/.env.example` - Remove Hardcover section

### Part 2: Cover Image Cascade

**Goal:** ~95% cover success rate using multiple free sources

**Source Priority:**
1. **Open Library** (default, fast, free)
   - URL: `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`
   - Coverage: ~85%

2. **Google Books API** (fallback, already integrated)
   - Extract from existing API call: `volumeInfo.imageLinks?.thumbnail`
   - Coverage: ~90%
   - No additional API quota cost

3. **Styled Placeholder** (final fallback)
   - Brutalist design with gradient and book emoji
   - Always works

**Implementation:**

```typescript
// Update Book interface
interface Book {
  // ... existing fields
  googleBooksCoverUrl?: string; // Add this
}

// In getGoogleBooksData()
return {
  // ... existing data
  coverUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail,
};

// In BookCard component
<img
  src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
  onError={(e) => {
    const googleCover = book.googleBooksCoverUrl;
    if (googleCover) {
      e.currentTarget.src = googleCover;
    } else {
      e.currentTarget.style.display = 'none';
      // Show styled placeholder div
    }
  }}
/>
```

**Behavior:**
- Each book independently cascades through sources
- Fast books don't wait for slow books
- Happens on-demand in browser (no batch processing)

## Implementation Order

1. Remove Hardcover integration
2. Resolve merge conflicts in `mockData.ts`
3. Add cover cascade system
4. Test with real ISBNs
5. Verify build succeeds
6. Commit and merge to main

## Success Criteria

- ✅ No Hardcover references in code
- ✅ Book detail pages load with reviews (mock service)
- ✅ ~95% of books show covers
- ✅ No console errors or TypeScript errors
- ✅ Build succeeds (`npm run build`)
- ✅ Merged to main branch
- ✅ Product ready for review/deployment

## Benefits

1. **Simpler codebase** - 2 fewer files, cleaner integrations
2. **Faster page loads** - One less API call
3. **No failed requests** - Eliminates GraphQL errors
4. **Better cover reliability** - 85% → 95% success rate
5. **Clearer architecture** - Reviews abstraction is single source of truth

## Future Considerations

When real review data is needed:
- Reviews service abstraction is already in place
- Swap mock implementation for real API (Goodreads alternative, LibraryThing, or own system)
- No changes needed to UI components
