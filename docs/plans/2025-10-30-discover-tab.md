# Discover Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a vibe-based book discovery interface with natural language search and curated recommendation sections using horizontal scroll browsing.

**Architecture:** Search bar at top for natural language queries ("Taylor Swift vibes", "books like Severance"), followed by horizontal scroll sections for different discovery categories (Trending, For You, By Genre, etc.). Each section displays book cards with metadata overlays. Uses mock data initially, designed for future API integration.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, lucide-react icons, React useState

---

## Task 1: Create Search Bar Component

**Files:**
- Create: `stacks-app/components/SearchBar.tsx`

**Step 1: Create the SearchBar component file**

Create `stacks-app/components/SearchBar.tsx`:

```typescript
"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search books, vibes, authors..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 font-semibold text-base bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal-sm focus:outline-none focus:shadow-brutal transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5]" />
      </div>
    </form>
  );
}
```

**Step 2: Verify TypeScript compilation**

Run: `cd stacks-app && npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Commit**

```bash
git add stacks-app/components/SearchBar.tsx
git commit -m "feat(discover): add SearchBar component with brutalist styling"
```

---

## Task 2: Create Book Card Component

**Files:**
- Create: `stacks-app/components/BookCard.tsx`

**Step 1: Create the BookCard component**

Create `stacks-app/components/BookCard.tsx`:

```typescript
import { Book } from "@/lib/mockData";

interface BookCardProps {
  book: Book;
  size?: "small" | "medium" | "large";
}

export default function BookCard({ book, size = "medium" }: BookCardProps) {
  const sizeClasses = {
    small: "w-32",
    medium: "w-40",
    large: "w-48",
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      {/* Book Cover */}
      <div className="relative w-full aspect-[2/3] bg-gradient-secondary flex items-center justify-center border-4 border-black dark:border-white shadow-brutal mb-3">
        <p className="text-white font-black text-sm">BOOK</p>

        {/* Genre Badge Overlay */}
        {book.genres[0] && (
          <div className="absolute top-2 right-2 bg-black/80 border-2 border-white px-2 py-1">
            <p className="text-white font-black text-xs uppercase">
              {book.genres[0]}
            </p>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div>
        <h3 className="font-black text-sm uppercase tracking-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 line-clamp-1">
          {book.author}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

Run: `cd stacks-app && npm run build`
Expected: Build succeeds, Book type imported correctly from mockData

**Step 3: Commit**

```bash
git add stacks-app/components/BookCard.tsx
git commit -m "feat(discover): add BookCard component with genre badge overlay"
```

---

## Task 3: Create Horizontal Book Section Component

**Files:**
- Create: `stacks-app/components/BookSection.tsx`

**Step 1: Create the BookSection component**

Create `stacks-app/components/BookSection.tsx`:

```typescript
import { Book } from "@/lib/mockData";
import BookCard from "./BookCard";

interface BookSectionProps {
  title: string;
  books: Book[];
  size?: "small" | "medium" | "large";
}

export default function BookSection({ title, books, size = "medium" }: BookSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-black text-xl uppercase tracking-tight px-4 mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

Run: `cd stacks-app && npm run build`
Expected: Build succeeds, components render without errors

**Step 3: Commit**

```bash
git add stacks-app/components/BookSection.tsx
git commit -m "feat(discover): add BookSection for horizontal scrolling book lists"
```

---

## Task 4: Build Discover Page Layout

**Files:**
- Modify: `stacks-app/app/discover/page.tsx`

**Step 1: Import dependencies and add state**

Replace the entire contents of `stacks-app/app/discover/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookSection from "@/components/BookSection";
import { mockBooks } from "@/lib/mockData";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic with API
    console.log("Searching for:", query);
  };

  // Filter books by genre for different sections
  const fantasyBooks = mockBooks.filter(b => b.genres.includes("Fantasy"));
  const romanceBooks = mockBooks.filter(b => b.genres.includes("Romance"));
  const literaryBooks = mockBooks.filter(b => b.genres.includes("Literary Fiction"));

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-black text-2xl uppercase tracking-tight mb-4">
            Discover
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Taylor Swift vibes, books like Severance..."
          />
        </div>
      </div>

      {/* Search Results or Discovery Sections */}
      <div className="py-6">
        {searchQuery ? (
          <div className="px-4">
            <div className="bg-gradient-info border-4 border-black dark:border-white shadow-brutal p-6 text-center">
              <p className="font-black text-white text-lg uppercase">
                Search results for "{searchQuery}"
              </p>
              <p className="text-white text-sm mt-2">
                (Search functionality coming soon)
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Trending Now */}
            <BookSection title="Trending Now" books={mockBooks.slice(0, 5)} size="large" />

            {/* Fantasy Picks */}
            {fantasyBooks.length > 0 && (
              <BookSection title="Fantasy Picks" books={fantasyBooks} size="medium" />
            )}

            {/* Romance Reads */}
            {romanceBooks.length > 0 && (
              <BookSection title="Romance Reads" books={romanceBooks} size="medium" />
            )}

            {/* Literary Fiction */}
            {literaryBooks.length > 0 && (
              <BookSection title="Literary Fiction" books={literaryBooks} size="medium" />
            )}

            {/* All Books */}
            <BookSection title="Explore All" books={mockBooks} size="small" />
          </>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Test the page in browser**

1. Navigate to http://localhost:3000/discover
2. Verify search bar appears with correct styling
3. Verify horizontal scroll sections render
4. Test horizontal scrolling works on each section
5. Test search input (should show placeholder UI)

Expected: All components render with brutalist styling, scrolling works smoothly

**Step 3: Commit**

```bash
git add stacks-app/app/discover/page.tsx
git commit -m "feat(discover): implement discover page with search and book sections"
```

---

## Task 5: Add Vibe Tag Chips

**Files:**
- Create: `stacks-app/components/VibeChips.tsx`
- Modify: `stacks-app/app/discover/page.tsx`

**Step 1: Create VibeChips component**

Create `stacks-app/components/VibeChips.tsx`:

```typescript
"use client";

interface VibeChipsProps {
  onVibeClick: (vibe: string) => void;
}

const VIBE_TAGS = [
  "Dark Academia",
  "Cozy Fantasy",
  "Romantasy",
  "Enemies to Lovers",
  "Found Family",
  "Slow Burn",
  "Sapphic",
  "Spicy 🌶️",
];

export default function VibeChips({ onVibeClick }: VibeChipsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 px-4 py-2" style={{ width: "max-content" }}>
        {VIBE_TAGS.map((vibe) => (
          <button
            key={vibe}
            onClick={() => onVibeClick(vibe)}
            className="px-4 py-2 bg-white dark:bg-dark-secondary border-3 border-black dark:border-white shadow-brutal-sm font-black text-sm uppercase tracking-tight hover:shadow-brutal transition-all whitespace-nowrap"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Add VibeChips to Discover page**

Modify `stacks-app/app/discover/page.tsx`, add import at top:

```typescript
import VibeChips from "@/components/VibeChips";
```

Add VibeChips below the search bar, inside the sticky header div:

```typescript
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-black text-2xl uppercase tracking-tight mb-4">
            Discover
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Taylor Swift vibes, books like Severance..."
          />
        </div>
        <VibeChips onVibeClick={handleSearch} />
      </div>
```

**Step 3: Test vibe chips**

1. Navigate to http://localhost:3000/discover
2. Verify vibe chips render below search bar
3. Click a vibe chip, verify search activates
4. Test horizontal scrolling of chips

Expected: Chips render with brutalist styling, clicking triggers search

**Step 4: Commit**

```bash
git add stacks-app/components/VibeChips.tsx stacks-app/app/discover/page.tsx
git commit -m "feat(discover): add vibe tag chips for quick search"
```

---

## Task 6: Add Empty State

**Files:**
- Modify: `stacks-app/app/discover/page.tsx`

**Step 1: Add empty state for no results**

In `stacks-app/app/discover/page.tsx`, update the search results section:

```typescript
        {searchQuery ? (
          <div className="px-4">
            <div className="bg-gradient-accent border-4 border-black dark:border-white shadow-brutal p-8 text-center">
              <p className="font-black text-white text-2xl uppercase mb-2">
                "{searchQuery}"
              </p>
              <p className="text-white text-base font-semibold mb-6">
                Natural language search coming soon! We'll find books that match this vibe.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-white text-black border-3 border-black font-black uppercase text-sm shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                Back to Discover
              </button>
            </div>
          </div>
        ) : (
```

**Step 2: Test empty state**

1. Search for any query
2. Verify styled empty state appears
3. Click "Back to Discover" button
4. Verify sections reappear

Expected: Empty state looks polished with brutalist styling

**Step 3: Commit**

```bash
git add stacks-app/app/discover/page.tsx
git commit -m "feat(discover): add styled empty state for search results"
```

---

## Task 7: Polish and Responsive Testing

**Files:**
- Modify: `stacks-app/components/BookCard.tsx`
- Modify: `stacks-app/app/discover/page.tsx`

**Step 1: Add hover states to BookCard**

In `stacks-app/components/BookCard.tsx`, update the wrapper div:

```typescript
  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 cursor-pointer`}>
      {/* Book Cover */}
      <div className="relative w-full aspect-[2/3] bg-gradient-secondary flex items-center justify-center border-4 border-black dark:border-white shadow-brutal mb-3 hover:shadow-brutal-hover transition-all transform hover:-translate-y-1">
```

**Step 2: Add spacing adjustments**

In `stacks-app/app/discover/page.tsx`, update the main container:

```typescript
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-24">
```

**Step 3: Test on mobile viewport**

1. Open DevTools, set viewport to iPhone 12 Pro (390px)
2. Test horizontal scrolling on all sections
3. Test search bar on mobile
4. Test vibe chips scrolling
5. Verify bottom nav doesn't overlap content

Expected: Everything works smoothly on mobile, no layout breaks

**Step 4: Test on desktop**

1. Expand viewport to 1440px
2. Verify max-w-lg keeps content centered
3. Test all interactions

Expected: Content stays centered, all features work

**Step 5: Commit**

```bash
git add stacks-app/components/BookCard.tsx stacks-app/app/discover/page.tsx
git commit -m "feat(discover): add hover states and responsive polish"
```

---

## Task 8: Final Design System Check

**Files:**
- Review: All Discover tab files

**Step 1: Design system checklist**

Review all components against design system (`design_system/v1.0_complete_design_system.html`):

- ✓ Borders: 4px thickness on all cards/inputs
- ✓ Shadows: shadow-brutal and shadow-brutal-sm used correctly
- ✓ Typography: font-black for headings, uppercase where appropriate
- ✓ Gradients: Using design system gradients (not Instagram colors)
- ✓ Spacing: Consistent px-4, py-4, gap-4 throughout
- ✓ Icons: stroke-[2.5] or stroke-[3] for bold appearance
- ✓ Colors: No pink/purple Instagram gradients

**Step 2: Cross-browser test**

Test in:
1. Chrome
2. Safari (if on Mac)
3. Firefox

Expected: Consistent appearance across browsers

**Step 3: Accessibility check**

1. Tab through page with keyboard
2. Verify search input is focusable
3. Verify vibe chips are keyboard accessible
4. Check color contrast (should pass WCAG AA)

Expected: Keyboard navigation works, contrast is sufficient

**Step 4: Final commit**

```bash
git add .
git commit -m "feat(discover): finalize discover tab implementation

Complete implementation includes:
- Natural language search bar with brutalist styling
- Vibe tag chips for quick discovery
- Horizontal scroll book sections (Trending, Fantasy, Romance, etc.)
- BookCard component with genre badges and hover states
- Empty state for search results
- Full design system compliance
- Mobile responsive with smooth scrolling

Ready for API integration."
```

---

## Future Enhancements (Not in This Plan)

1. **Natural Language Search API**
   - Integrate with OpenAI or similar for vibe-based search
   - Parse queries like "Taylor Swift vibes" → books with similar themes

2. **Personalized Recommendations**
   - "For You" section based on reading history
   - Use mock data initially, real recommendations later

3. **Filter UI**
   - Genre filters
   - Page count range
   - Publication year
   - Rating threshold

4. **Book Detail Modal**
   - Tap book card to see full details
   - Add to library button
   - See who's reading it

5. **Infinite Scroll**
   - Load more books as user scrolls sections
   - Virtual scrolling for performance

---

## Testing Notes

**Manual Testing Required:**
- Search input behavior
- Vibe chip interactions
- Horizontal scrolling performance
- Mobile touch gestures
- Hover states on desktop

**No automated tests in this plan** - focus is on rapid prototyping with mock data. Add tests when integrating real API.

---

## Dependencies

**Required:**
- Next.js 14+ (already installed)
- TypeScript (already configured)
- Tailwind CSS (already configured)
- lucide-react (already installed)
- Mock data in `lib/mockData.ts` (already created)

**None needed** - all dependencies already in place.

---

## Estimated Time

- Task 1-3: 15 minutes (components)
- Task 4-5: 20 minutes (page layout + vibe chips)
- Task 6-7: 15 minutes (empty state + polish)
- Task 8: 10 minutes (design system check)

**Total: ~60 minutes** for complete Discover tab implementation
