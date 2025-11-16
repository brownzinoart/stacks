# Discovery Enhancement - Wireframes & Component Specs

## Screen Flow Overview

```
HERO SECTION ("What's Next?")
    ↓ [PRESERVED EXACTLY]
MORE WAYS TO DISCOVER
    ↓ [NEW]
NEW RELEASES
    ↓ [EXISTING]
BORROWED BOOKS
    ↓ [EXISTING]
READY FOR PICKUP
    ↓ [NEW - Only shows if books available]
QUEUE & READING STREAK (Grid)
    ↓ [EXISTING]
COMMUNITY DISCOVERIES
    ↓ [NEW]
```

## Component Specifications

### 1. MoreWaysToDiscover Component

**File:** `/src/features/home/more-ways-to-discover.tsx`

**Visual Design:**

- Container: `bg-primary-blue` with `pop-element-lg` shadow
- Title: "MORE WAYS" (orange) / "TO DISCOVER" (mega size)
- Layout: 3-column grid on larger screens, stacked on mobile
- Cards: Semi-transparent white overlays with backdrop blur

**Interactive Elements:**

- Surprise Me Button: 🎲 Random book magic
- Browse Topics Button: 📚 Explore by category
- Trending Now Button: 🔥 What's hot right now

**Props:** None (self-contained)
**States:** Button hover/press feedback

### 2. ReadyForPickup Component

**File:** `/src/features/home/ready-for-pickup.tsx`

**Visual Design:**

- Container: `bg-primary-orange` with `pop-element-lg` shadow
- Title: "READY FOR" (blue) / "PICKUP" (mega size)
- Badge: Green "X READY" counter
- Cards: Book covers + shelf location + days remaining

**Interactive Elements:**

- Individual book cards (clickable)
- AR Directions CTA button (prominent)
- Book covers with real titles/authors

**Props:** None (uses mock data)
**States:**

- Hidden if no pickup books available
- Hover states for book cards

### 3. CommunityDiscoveries Component

**File:** `/src/features/home/community-discoveries.tsx`

**Visual Design:**

- Container: `bg-primary-pink` with `pop-element-lg` shadow
- Title: "COMMUNITY" (blue) / "DISCOVERIES" (mega size)
- Badge: "LOCAL PICKS"
- Cards: Ranked list with position numbers

**Interactive Elements:**

- Individual book discovery cards
- Reader count badges
- Location tags (📍 Campus Library, etc.)
- "Explore More" CTA button

**Props:** None (uses mock data)
**States:** Book card hover feedback, ranking positions

## Design Tokens Used

### Colors (Matching Existing System)

- `primary-green` - Success states, ready indicators
- `primary-blue` - Main brand actions, primary text
- `primary-orange` - Attention, pickup notifications
- `primary-pink` - Community, social features
- `primary-yellow` - Highlights, badges
- `primary-teal` - Secondary accents
- `primary-purple` - Decorative elements

### Typography Classes

- `text-huge` - Section titles first line
- `text-mega` - Section titles second line (larger)
- `font-black` - All headings and key text
- `font-bold` - Secondary text and descriptions

### Interactive Classes

- `pop-element-lg` - Main container shadows
- `touch-feedback` - Button press animations
- `mobile-touch` - Mobile-optimized touch targets
- `outline-bold-thin` - Focus states
- `shadow-backdrop` - Elevated elements

## Animation & Spacing

### Staggered Animations

- More Ways to Discover: `animation-delay-200`
- New Releases: `animation-delay-300`
- Borrowed Books: `animation-delay-400`
- Ready for Pickup: `animation-delay-500`
- Queue Grid: `animation-delay-600` & `animation-delay-700`
- Community Discoveries: `animation-delay-800`

### Decorative Elements

Each component includes 5-6 floating colored circles with:

- `animate-float` - Base floating animation
- `animate-float-delayed` - Offset timing
- `animate-float-slow` - Slower movement
- Varying opacity (20-45%) and sizes (6-18 units)

## Accessibility Considerations

### Screen Reader Support

- Semantic headings hierarchy maintained
- Button labels descriptive ("SURPRISE ME", not just icons)
- Status information clearly labeled (X BOOKS, X READY)

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order maintained
- Clear focus indicators with `outline-bold-thin`

### Mobile Optimization

- Touch targets minimum 44px (handled by `mobile-touch`)
- Text sizes scale appropriately with `sm:` variants
- Cards stack vertically on narrow screens
- No horizontal scrolling required

## Critical Microcopy & Tone

### Voice Characteristics

- **BOLD ALL-CAPS** for primary actions and titles
- Exclamatory and enthusiastic ("Random book magic!")
- Direct and actionable ("Get AR directions")
- Community-focused ("See what readers near you...")

### Key Messages

- Discovery focus: "More ways to discover", "Surprise me"
- Urgency for pickups: "X days left", "Ready for pickup"
- Social proof: "X readers", "Local picks"
- Clear actions: "View all", "Explore more", "Get directions"

## Integration Notes

- **Hero Section Preserved:** Lines 28-76 of home page kept identical
- **Responsive Behavior:** All components use existing grid/spacing patterns
- **Mock Data:** Components use static data for now, ready for API integration
- **Conditional Rendering:** ReadyForPickup only shows when books available
- **Navigation Hooks:** Console logs placeholder for routing integration
