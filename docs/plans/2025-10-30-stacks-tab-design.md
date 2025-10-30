# Stacks Tab Design

**Date:** 2025-10-30
**Status:** Implemented
**Location:** `/app/stacks/page.tsx`

## Overview

The Stacks tab is the user's personal Stack Profile Hub - a centralized space for managing and browsing all stack-related activity. It follows a curated browsing pattern with horizontal scrolling sections, inspired by Netflix/Spotify UX but with STACKS brutalist aesthetic.

## Design Principles

1. **Familiar UX, Unique UI** - Use recognizable patterns (horizontal scrolls, tabs) but apply brutalist design system
2. **Curated Browsing** - Present stacks in thematic horizontal rows, not endless vertical grids
3. **Always Accessible Creation** - Floating action button available from any view
4. **Visual Hierarchy** - Profile stats at top, tabs for organization, content sections below

## Layout Structure

### 1. Profile Header
**Purpose:** Identity and stats overview
**Components:**
- Large circular profile pic (80px) with gradient background + 4px brutalist border
- Username in bold uppercase (font-black, text-xl)
- Bio text below username (text-sm, font-semibold)
- 3 stat blocks in grid:
  - Stacks count (gradient-primary)
  - Likes count (gradient-accent)
  - Books count (gradient-success)
  - Each block: 4px border, shadow-brutal-sm, white text on gradient

**Visual Style:**
- All stat blocks use brutalist borders and shadows
- Gradients from design system (no Instagram colors)
- Stats are uppercase, font-black, tracking-wider

### 2. Tab Bar
**Purpose:** Switch between content views
**Tabs:**
- My Stacks (your posted stacks)
- Liked (stacks you've liked)
- Saved (bookmarked stacks)

**Interaction:**
- Active tab: gradient-primary background, white text
- Inactive tabs: white background, black text
- 4px borders between tabs
- Instant switch (no animation)
- Full-width, equal distribution

### 3. Horizontal Scroll Sections
**Purpose:** Curated browsing of stacks in thematic groups
**Sections:**
- Recent Stacks
- Most Liked
- This Month
- Earlier This Year

**Card Design:**
- Width: 256px (w-64)
- Brutalist borders (4px) and shadow-brutal
- Square aspect ratio image with gradient-accent placeholder
- Overlay badges (bottom corners):
  - Left: Book count badge
  - Right: Like count badge
  - Both: black/80 background, 2px white border, font-black uppercase text
- Caption below image (p-3 padding, line-clamp-2)

**Scroll Behavior:**
- Horizontal overflow scroll per section
- Snap to cards (optional enhancement)
- 16px gap between cards
- Cards maintain brutalist aesthetic while scrolling

### 4. Floating Action Button (FAB)
**Purpose:** Create new stack from anywhere
**Position:** Fixed bottom-right (24px from edges)
**Style:**
- 64px circle (w-16 h-16)
- gradient-primary background
- 4px black border
- shadow-brutal-sm
- Plus icon (32px, white, stroke-[3])
- Sits above bottom nav (z-50)
- Hover: increases shadow to shadow-brutal

## Technical Implementation

### Component Structure
```
StacksPage (main component)
├── Profile Header
├── Tab Bar (TabButton × 3)
├── Horizontal Scroll Sections (StackSection × 4)
└── Floating Action Button

StackSection (reusable)
├── Section Title
└── Horizontal Scroll Container
    └── Stack Cards (map over data)
```

### State Management
- `activeTab`: tracks which tab is selected ("my-stacks" | "liked" | "saved")
- `displayStacks`: filtered stack data based on active tab
- Future: fetch different data per tab from API

### Data Flow
1. Import mockStacks from lib/mockData
2. Filter based on activeTab
3. Pass filtered data to StackSection components
4. Each section can further filter/sort (e.g., slice for "This Month")

## Design System Compliance

✓ Brutalist borders (4px throughout)
✓ Bold typography (font-black, uppercase)
✓ Design system gradients (primary, accent, success)
✓ Shadow-brutal on cards
✓ No Instagram pink/purple colors
✓ Thick icon strokes (stroke-[3])
✓ White on gradient for high contrast

## Responsive Considerations

- max-w-lg container keeps content centered on desktop
- Horizontal scroll works naturally on mobile with touch
- Profile header scales appropriately
- Tab bar remains full-width and touch-friendly

## Future Enhancements

1. **Tab Content Differentiation**
   - Fetch different data per tab (My Stacks vs Liked vs Saved)
   - Add empty states for each tab

2. **Section Customization**
   - User can reorder sections
   - Hide/show sections based on preference
   - Add more auto-generated sections (by genre, by date range)

3. **Card Interactions**
   - Tap to view full stack post
   - Long-press for quick actions (delete, share, edit)
   - Swipe gestures for archive/delete

4. **FAB Actions**
   - Tap opens camera/upload flow
   - Consider multi-action (camera vs library)

5. **Loading States**
   - Skeleton screens for sections while loading
   - Lazy load sections as user scrolls

6. **Performance**
   - Virtualize long horizontal lists
   - Image lazy loading for off-screen cards
   - Preload images for smoother scrolling

## Success Metrics

- Time to browse stacks (should be faster than vertical grid)
- Creation rate (FAB accessibility)
- Tab engagement (which tab is used most)
- Scroll depth per section (which sections are engaging)
