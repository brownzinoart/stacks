# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 CRITICAL: Product Strategy Pivot

**READ FIRST**: The application is undergoing a major strategic pivot from library-focused discovery to social/community book discovery. 

📋 **Review**: [`docs/CONTENT_STRATEGY.md`](docs/CONTENT_STRATEGY.md) - Complete product strategy and feature roadmap

**Key Changes**:
- **Core Feature**: StackSnap (OCR-based book recognition) → Camera + OCR + Interactive Overlay
- **Audience**: Gen Z/BookTok community → social sharing and viral discovery  
- **Features**: Community discovery, pace tracking, social integration
- **Simplified Launch**: **NO AR STACK** - Focus on camera → OCR → overlay workflow

**Preserve**: Gorgeous design system, mobile architecture, AI infrastructure, camera capabilities
**Evolve**: Library features → Social/community features
**Removed**: Full AR implementation (too complex for launch)

## Project Overview

**Stacks** is a Gen Z-focused reading social app that lets users share book "stacks" (collections), discover books through vibe-based search, and track reading progress. The app uses a **maximal brutalist design system** with bold borders, strong shadows, and vibrant gradients.

This is a mobile-first Next.js application built with TypeScript, React 19, and Tailwind CSS.

## Development Commands

### Essential Commands

```bash
# RECOMMENDED: Start both servers with consistent ports (SINGLE COMMAND)
npm run dev:all          # Starts frontend (4000) + backend (4001) with clean cache

# OR start individually:
# Frontend development (Next.js with Turbopack) - PORT 4000
npm run dev              # Start at http://localhost:4000 with Turbopack, binds to 0.0.0.0

# Backend development (Fastify API server) - PORT 4001
npm run backend:dev      # Start API server at 0.0.0.0:4001

# Build for production
npm run build            # Production build with Next.js

# Code quality
npm run lint             # ESLint checking
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Prettier formatting (120 char lines, single quotes)
npm run type-check       # TypeScript validation

# Testing
npm run test             # Run all Playwright tests
npm run test:headed      # Run tests with browser UI
npm run test:ui          # Open Playwright test UI

# Run a single test file
npx playwright test tests/specific-test.spec.ts

# Production
npm run start            # Start production server

# Performance
npm run analyze          # Analyze bundle size
npm run audit:performance # Run performance audit
```

## Architecture Overview

This is a Next.js 15 progressive web app for AI-powered library book discovery with iOS/Android mobile app capabilities via Capacitor.

### Frontend Structure

- **App Router**: Uses Next.js 15 App Router (not Pages Router) in `src/app/`
- **Feature Organization**: Components organized by feature in `src/features/` matching page structure:
  - `home/` - AI prompt input, reading queue, streak tracking
  - `explore/` - Topic search, learning paths, branch availability
  - `ar/` - AR shelf scanning, branch explorer
- **State Management**: TanStack Query v5 for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens in `tailwind.config.js`

### Backend Architecture

- **API Server**: Separate Fastify server in `/api/server.js` running on port 3001
- **Database**: Supabase with pgvector extension for semantic search
- **AI Integration**: Proxy pattern through Next.js API routes (`/api/*-proxy/`) to manage API keys securely

### Mobile Architecture

- **Framework**: Capacitor 7 for iOS/Android native builds
- **iOS**: Xcode project in `/ios/App/` and `/mobile/ios/App/`
- **Config**: Live reload dev server configured in `mobile/capacitor.config.ts`
- **Build**: Static export (`output: 'export'`) for mobile app packaging
- **Camera**: Capacitor Camera API for StackSnap photo capture
- **OCR**: Tesseract.js for client-side book title/author recognition

### AI Model Strategy

Different models optimized for specific tasks:

- **GPT-4o**: Mood-based book recommendations (3k context, fallback to Gemini 2.5 Flash)
- **Gemini 2.5 Pro**: Topic bundles and learning paths (32k context)
- **Claude 3.7 Sonnet**: Book summaries and insights
- Rate limiting: 1 req/user/s via Supabase queue

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI Services (server-side only)
OPENAI_API_KEY=          # GPT-4o for recommendations
ANTHROPIC_API_KEY=       # Claude for summaries
GOOGLE_VERTEX_PROJECT_ID= # Gemini Pro
GOOGLE_VERTEX_LOCATION=us-central1

# External Services (optional)
OMDB_API_KEY=            # Movie/show enrichment
WORLDCAT_API_KEY=        # Library catalog
LISTEN_NOTES_API_KEY=    # Podcast recommendations
NEXT_PUBLIC_MAPBOX_TOKEN= # Map visualizations
ILS_CLIENT_ID=           # Library system integration
ILS_CLIENT_SECRET=

# Development
NEXT_PUBLIC_DEV_SERVER_IP=192.168.86.174  # Your local IP for mobile testing
```

## Development Conventions

### TypeScript

- Strict mode with `noUncheckedIndexedAccess: true`
- Always use type-safe imports
- Prefer interfaces over types for object shapes

### Code Style

- Prettier: 120 character lines, single quotes, no semicolons
- ESLint: Next.js recommended + TypeScript rules
- Tailwind: Use design tokens from config, avoid arbitrary values
- Components must accept `className` prop

### Git Workflow

- Conventional commits enforced by commitlint and Husky
- Feature branches: `feature/description`
- Bugfix branches: `bugfix/description`
- Main branch is protected, use PRs

### Component Patterns

- Server Components by default in App Router
- Client Components only when needed (`'use client'` directive)
- Feature-based organization matching route structure
- Shared components in `src/components/`

### Planning & Execution Protocol

- **ALWAYS** consult with `/mydawgs` team when planning new features or major changes
- Use Task tool with appropriate specialized agents (ux-ui, dev, etc.) before implementation
- Get team consensus on approach before execution
- Collaborate with mydawgs for design, architecture, and implementation decisions

## Testing Strategy

Playwright E2E testing with comprehensive coverage:

- Tests in `tests/` directory organized by feature
- Mobile viewport testing included
- Accessibility checks integrated
- Smoke tests for critical paths (`tests/smoke-test.spec.ts`)

## Database Schema

Key Supabase tables with pgvector for semantic search:

- `books`: Core book data with vector embeddings
- `users`: User profiles and preferences
- `reading_history`: User reading activity
- `recommendations`: AI-generated recommendations
- `queues`: User book queues

Migration files in `supabase/migrations/`

## Performance Optimizations

- **Service Workers**: Advanced caching in `public/sw-advanced.js`
- **Component Loading**: Dynamic imports via `src/lib/component-loader.ts`
- **API Caching**: SQLite-based caching in `cache/` directory
- **Image Optimization**: Book covers cached and optimized via service
- **Memory Management**: Proactive cleanup in `src/lib/memory-manager.ts`

## Mobile Development

### iOS Development

```bash
# From mobile/ directory
npx cap sync             # Sync web assets to native
npx cap open ios         # Open in Xcode
npx cap run ios          # Run on simulator

# Build for device testing
cd ios/App && pod install
# Then build in Xcode
```

### Testing on Physical Device

1. Update `NEXT_PUBLIC_DEV_SERVER_IP` in `.env.local` with your machine's IP
2. Update `url` in `mobile/capacitor.config.ts` to match
3. Ensure device is on same network
4. Run `npm run dev` and connect from device

## Important Notes

1. **PWA Requirements**: Maintain offline functionality and service worker compatibility
2. **Rate Limiting**: AI APIs have rate limits - respect them via Supabase queue
3. **Design Tokens**: Use Tailwind tokens from config, not arbitrary values
4. **Turbopack**: Development uses Turbopack for faster builds
5. **Mobile-First**: Always test on mobile viewports first
6. **Accessibility**: Maintain WCAG 2.1 AA compliance
7. **Cost Optimization**: AI model selection optimized for cost/performance balance

## iOS Development - CRITICAL WORKFLOW

**IMPORTANT**: When making ANY changes that could affect the iOS app, ALWAYS follow this sequence:

### After Every Code Change:

1. **Build the app**:

   ```bash
   npm run build
   ```

2. **Copy to iOS project** (handles RSC issue):

   ```bash
   cp out/home.html ios/App/App/public/index.html
   npx cap sync ios
   ```

3. **For API features**, ensure dev server is running:

   ```bash
   HOST=0.0.0.0 npm run dev  # Run in background/new terminal
   ```

4. **Tell user to rebuild in Xcode**:
   - Clean Build Folder: Product → Clean Build Folder (⇧⌘K)
   - Run the app: Press ▶ or ⌘R

### Known iOS Issues & Solutions:

- **React Server Components**: .txt files don't work with Capacitor - always use home.html as index.html
- **API Connectivity**: Dev server must run on 0.0.0.0 for network access from phone
- **Current Mac IP**: 192.168.86.190 (hardcoded in src/lib/api-config.ts - update if network changes)
- **Blank Screen**: Usually means RSC files are being loaded - rebuild with home.html copy
- **"Something went wrong"**: API server not accessible - ensure dev server is running on 0.0.0.0

## iOS Development Agent

A specialized agent (`agents/ios-dev-agent.py`) handles iOS development with live reload:

### Quick Commands

```bash
npm run ios:setup    # Complete iOS setup with live reload
npm run ios:dev      # Start servers with correct IP binding
npm run ios:fix      # Fix common issues automatically
npm run ios:monitor  # Monitor development status
```

### Agent Capabilities

- Automatic IP configuration for live reload
- AR permissions setup
- Build error resolution
- Network troubleshooting
- Real-time development monitoring

### Testing Workflow

1. Run `npm run ios:setup` for initial configuration
2. Use `npm run ios:open` to launch Xcode
3. Select your physical device and run
4. Changes auto-reload on device via Wi-Fi

See `IOS_DEVELOPMENT_GUIDE.md` for complete documentation.

## mydawgs Team Integration

When using `/dawgs` command:

- Goal: Move fast with clarity, return smallest artifact that unblocks progress
- Approve plans with `/approve` or "run all"/"run selected"
- Auto-handoff threshold: `MYDAWGS_CONF_THRESHOLD=0.75`

- start a document for my investment presentation, add notes to it when you mention them
- all testing moving forward needs to be done via phone application

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

### Design System Exact Specifications

**Critical: ALL components MUST match `design_system/atomic_design_system_with_mobile.html` exactly.**

#### Border Radius
- Cards (desktop): `border-radius: 20px` → use `rounded-[20px]`
- Cards (mobile): `border-radius: 20px` → use `rounded-[20px]`
- Inputs/Buttons: `border-radius: 12px` → use `rounded-xl`
- Badges: `border-radius: 12px` → use `rounded-xl`
- Pill badges: `border-radius: 50px` → use `rounded-[50px]`
- Avatars/FAB: `border-radius: 50%` → use `rounded-full`

#### Shadows
- Cards: `box-shadow: 6px 6px 0px` → use `shadow-brutal`
- Buttons: `box-shadow: 4px 4px 0px` → use `shadow-brutal-sm`
- Badges: `box-shadow: 3px 3px 0px` → use `shadow-brutal-badge`
- Input focus: `box-shadow: 5px 5px 0px` → use `shadow-brutal-focus`
- Dark mode: Shadows automatically switch to white

#### Border Thickness
- Cards (desktop): `border: 5px solid` → use `border-[5px]`
- Cards (mobile): `border: 4px solid` → use `border-4`
- Inputs/Buttons: `border: 4px solid` → use `border-4`
- Badges: `border: 3px solid` → use `border-[3px]`
- Bottom nav: `border-top: 5px solid` → use `border-t-[5px]`
- FAB: `border: 5px solid` → use `border-[5px]`

#### Button Padding
- Standard: `padding: 18px 36px` → use `px-9 py-[18px]`
- Touch (mobile): `padding: 20px 40px; min-height: 56px` → use `px-10 py-5 min-h-[56px]`

#### Input Padding
- All inputs: `padding: 18px 20px` → use `px-5 py-[18px]`

#### Typography Sizes
- H1 Desktop: `64px` / `font-weight: 900` / `letter-spacing: -2px`
- H1 Mobile: `40px` / `font-weight: 900` / `letter-spacing: -1.5px`
- H2 Desktop: `48px` / `font-weight: 900` / `letter-spacing: -1px`
- H2 Mobile: `32px` / `font-weight: 900` / `letter-spacing: -1px`
- H3: `32px` / `font-weight: 800` / uppercase
- Body: `18px` / `font-weight: 500` → use `text-lg font-medium`
- Label: `14px` / `font-weight: 900` / uppercase → use `text-sm font-black uppercase`
- Stat value: `36px` / `font-weight: 900` → use `text-4xl font-black`

#### Interactive States
- Button hover: `transform: translate(-2px, -2px); box-shadow: 6px 6px 0px`
- Button active: `transform: translate(2px, 2px); box-shadow: 2px 2px 0px`
- Input focus: `transform: translate(-1px, -1px); box-shadow: 5px 5px 0px`

#### Spacing
- Card padding: `36px` (desktop) / `24px` (mobile)
- Section gaps: `24px` → use `mb-6` or `gap-6`
- Bottom nav clearance: `100px` → use `pb-24`

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
