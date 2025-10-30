# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stacks** is a Gen Z-focused reading social app that lets users share book "stacks" (collections), discover books through vibe-based search, and track reading progress. The app uses a **maximal brutalist design system** with bold borders, strong shadows, and vibrant gradients.

This is a mobile-first Next.js application built with TypeScript, React 19, and Tailwind CSS.

## Development Commands

### Core Commands
```bash
# Development server (runs on http://localhost:3000)
cd stacks-app && npm run dev

# Production build
cd stacks-app && npm run build

# Start production server
cd stacks-app && npm start

# Lint code
cd stacks-app && npm run lint
```

### Working Directory
All development commands must be run from the `stacks-app/` directory, not the repository root.

## Architecture

### Tech Stack
- **Framework:** Next.js 15 (App Router with React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4 with custom brutalist design system
- **Icons:** lucide-react (stroke-[2.5] or stroke-[3] for bold appearance)
- **State Management:** React useState (local state only, no global state library yet)

### Project Structure
```
stacks-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with BottomNav
│   ├── page.tsx            # Root redirect to /home
│   ├── home/               # Feed page (stacks from followed users)
│   ├── stacks/             # User's personal stack profile hub
│   ├── discover/           # Vibe-based book discovery
│   └── reading/            # Reading progress tracker
├── components/             # Reusable React components
│   ├── BottomNav.tsx       # Fixed bottom navigation (4 tabs)
│   ├── StackCard.tsx       # Stack post card with books & match badges
│   ├── BookCard.tsx        # Book display in discovery
│   ├── BookSection.tsx     # Horizontal scroll book section
│   ├── SearchBar.tsx       # Search input with brutalist styling
│   ├── VibeChips.tsx       # Quick search chips
│   └── MatchBadge.tsx      # Color-coded match level indicator
├── lib/
│   └── mockData.ts         # Mock data (users, books, stacks, comments)
├── design_system/          # Design system documentation (HTML files)
└── docs/plans/             # Implementation plans for features
```

### Key Files
- **`lib/mockData.ts`**: Contains all TypeScript interfaces (User, Book, Stack, BookMatch, ReadingProgress) and mock data. All components import from here.
- **`app/globals.css`**: Brutalist design system CSS with custom shadow and border utilities
- **`tailwind.config.ts`**: Extended Tailwind config with design system gradients, shadows, and colors
- **`components/BottomNav.tsx`**: Navigation routes to `/home`, `/stacks`, `/discover`, `/reading`

### Design System

The app follows a **maximal brutalist** aesthetic targeting Gen Z users:

**Core Principles:**
- 4px thick borders on all cards, inputs, buttons
- Bold box shadows (`shadow-brutal`, `shadow-brutal-sm`, `shadow-brutal-hover`)
- Font-black typography with uppercase headings
- Design system gradients (NOT Instagram pink/purple unless explicitly for active nav state)
- Mobile-first with max-w-lg containers for desktop centering

**Tailwind Custom Classes:**
```css
/* Shadows */
shadow-brutal         /* 8px 8px 0 0 #000 */
shadow-brutal-sm      /* 4px 4px 0 0 #000 */
shadow-brutal-hover   /* 12px 12px 0 0 #000 */

/* Gradients */
bg-gradient-primary    /* Purple gradient (buttons, badges) */
bg-gradient-secondary  /* Pink-yellow gradient */
bg-gradient-accent     /* Pink-red gradient */
bg-gradient-success    /* Green-cyan gradient (stats) */
bg-gradient-info       /* Blue gradient */
bg-gradient-hero       /* Cyan-yellow-red (home feed background) */

/* Utility Classes */
.btn-brutal           /* Brutalist button base styles */
.card-brutal          /* Brutalist card with border & shadow */
.pb-nav               /* Padding-bottom for fixed nav (80px) */
```

**Typography Scale:**
- Headings: `font-black uppercase tracking-tight`
- Body: `font-semibold`
- Labels: `font-bold uppercase text-xs`

**Colors:**
- Light mode: `bg-white`, `border-black`, `text-black`
- Dark mode: `bg-dark-secondary`, `border-white`, `text-white`
- Use semantic colors from Tailwind config (`light.primary`, `dark.secondary`, etc.)

### Data Model

**Core Types** (in `lib/mockData.ts`):
```typescript
User {
  id, username, displayName, avatar, bio
  followerCount, followingCount
}

Book {
  id, title, author, cover
  genres[], tropes[], pageCount, publishYear
}

BookMatch {
  book: Book
  matchLevel: "high" | "medium" | "low" | "read"
}

Stack {
  id, userId, photo, caption
  books: BookMatch[]  // Array of books with match levels
  likeCount, commentCount, createdAt
  matchScore?: number // 0-100 for current user
}

ReadingProgress {
  bookId, startDate, endDate
  currentPage, totalPages
  status: "reading" | "finished" | "abandoned"
}
```

**Key Concepts:**
- **Match Level:** Each book in a stack has a match level indicating how well it matches the current user's reading preferences (high/medium/low) or if they've already read it
- **Match Score:** Overall percentage match between a stack's books and current user's taste (displayed as "92% MATCH")
- **Mock Data:** All data is currently mock data in `mockData.ts`. Future API integration points are marked with `// TODO: Implement with API`

### Page Architecture

**Navigation Flow:**
- Root (`/`) → redirects to `/home`
- `/home` → Feed of stacks from followed users (gradient background)
- `/stacks` → User's personal stack profile with tabs (My Stacks / Liked / Saved)
- `/discover` → Vibe-based book search with horizontal scroll sections
- `/reading` → Reading progress tracker (implementation pending)

**Component Patterns:**
1. **Horizontal Scroll Sections:** Used in `/stacks` and `/discover` for browsing content
   - Container: `overflow-x-auto px-4`
   - Inner: `flex gap-4` with `style={{ width: "max-content" }}`
   - Cards: `flex-shrink-0` to prevent squashing

2. **Stack Cards:** Display book collections with:
   - User profile info (avatar, username)
   - Stack photo/caption
   - Book match badges (color-coded by match level)
   - Like/comment counts

3. **Sticky Headers:** Search bars and tabs use `sticky top-0 z-40` positioning

4. **Bottom Navigation:** Fixed at bottom with gradient stroke for active state

## Implementation Guidelines

### When Adding New Features

1. **Check Design System First:** Ensure new components follow brutalist design principles
   - 4px borders, bold shadows, font-black headings
   - Use existing gradients from `tailwind.config.ts`
   - Mobile-first with touch-friendly sizes (min 44px tap targets)

2. **Reference Existing Patterns:** Look at similar pages for structure
   - Horizontal scrolling: See `/stacks` or `/discover`
   - Cards: See `StackCard.tsx` or `BookCard.tsx`
   - Forms: Check existing input styling in `SearchBar.tsx`

3. **Mock Data First:** Add mock data to `lib/mockData.ts` before building UI
   - Add TypeScript interfaces if needed
   - Export mock data arrays and helper functions
   - Mark API integration points with `// TODO:`

4. **Client Components:** Most components need `"use client"` directive for interactivity
   - Any component using useState, useEffect, onClick, etc.
   - Server components only for static content

### Design System Compliance Checklist

Before considering a feature complete, verify:
- ✓ Borders: 4px thickness on cards/inputs (`border-4`)
- ✓ Border Radius:
  - Cards: `rounded-xl` (12px) for mobile cards, `rounded-2xl` (20px) for desktop cards
  - Inputs/Buttons: `rounded-xl` (12px)
  - Badges: `rounded-xl` (12px) or `rounded-lg` (8px) for small badges
  - Avatars/FAB: `rounded-full` (50%)
  - Overlays: `rounded-lg` (8px)
- ✓ Shadows: Using `shadow-brutal` or `shadow-brutal-sm`
- ✓ Typography: `font-black` for headings, uppercase where appropriate
- ✓ Gradients: Using design system gradients (not Instagram colors except nav)
- ✓ Spacing: Consistent padding (`px-4`, `py-4`, `gap-4`)
- ✓ Icons: Stroke width 2.5 or 3 for bold appearance
- ✓ Mobile-first: Works on 390px viewport, centered with `max-w-lg` on desktop
- ✓ Dark mode: All colors have dark mode equivalents
- ✓ Touch targets: Minimum 48px, recommended 56px for buttons

### Design System Utility Classes

Use these classes from `app/globals.css` for consistency:
- `.btn-brutal` - Standard buttons with shadow and borders
- `.input-brutal` - Input fields with proper styling
- `.badge-brutal` - Badge/chip components
- `.fab-brutal` - Floating action buttons
- `.card-brutal` - Card containers with borders and shadows

### Common Patterns

**Creating a New Page:**
```typescript
"use client";

import { useState } from "react";
// Import components and data

export default function NewPage() {
  // State management

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-24">
      {/* Sticky header if needed */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
        {/* Header content */}
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Content here */}
      </div>
    </div>
  );
}
```

**Horizontal Scroll Section:**
```typescript
<div className="mb-8">
  <h2 className="font-black text-xl uppercase tracking-tight px-4 mb-4">
    Section Title
  </h2>
  <div className="overflow-x-auto px-4">
    <div className="flex gap-4" style={{ width: "max-content" }}>
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  </div>
</div>
```

**Brutalist Button:**
```typescript
<button className="px-6 py-3 bg-gradient-primary text-white border-4 border-black dark:border-white shadow-brutal-sm hover:shadow-brutal transition-all font-black uppercase text-sm">
  Click Me
</button>
```

### Testing

- Always test in browser at `http://localhost:3000` after changes
- Test on mobile viewport (390px - iPhone 12 Pro) using DevTools
- Verify dark mode styling works (`html.dark` class in layout)
- Check horizontal scroll sections work on mobile
- Ensure bottom nav doesn't overlap content (use `pb-24` on page containers)

## Known Issues & TODOs

- Search functionality is placeholder only (shows empty state)
- Reading page not yet implemented
- All data is mock data - API integration pending
- No authentication system yet
- Bottom nav uses Instagram gradient for active state (intentional design choice)

## Resources

- Design system reference: `design_system/atomic_design_cross_check.md`
- Feature plans: `docs/plans/*.md`
- Atomic design methodology reference for understanding component hierarchy
