# "What's Next" Loading Overlay - Wireframes & Specifications

## Screen Flow Overview

```
[Home Screen] → [Tap Search] → [Loading Overlay] → [Results Screen]
                                     ↓
                              [Cancel Option]
```

## Full-Screen Loading Overlay Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                     FULLSCREEN OVERLAY                         │
│                    [Black/95% + Blur]                          │
│                                                                 │
│                      ┌─────────┐                               │
│                      │   🧠    │  ← Stage Icon (7xl size)      │
│                      │ (glow)  │    with glow effect          │
│                      └─────────┘                               │
│                                                                 │
│               ANALYZING REQUEST                                 │
│         Understanding your mood and preferences...             │
│                                                                 │
│          ┌────────────────────────────────────────┐           │
│          │     "sci-fi books like Dune"          │           │
│          │          Searching for:                │           │
│          └────────────────────────────────────────┘           │
│                                                                 │
│    ████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 65%                │
│    ↑ Progress bar with shimmer + glow effects                  │
│                                                                 │
│         65% Complete    ~5s remaining                          │
│                                                                 │
│    ┌───┐────┌───┐────┌───┐────┌───┐                          │
│    │ ✓ │════│ 2 │    │ 3 │    │ 4 │                          │
│    └───┘    └───┘    └───┘    └───┘                          │
│   Complete  Active   Pending Pending                          │
│                                                                 │
│          💰 Optimized routing saved ~65%                       │
│             vs single model                                    │
│                                                                 │
│                 ┌─────────────────┐                           │
│                 │  ✕ Cancel Request │                         │
│                 └─────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Stage Progress Visual States

### Stage Indicators (48px circles)

```
COMPLETED:           ACTIVE:              PENDING:
┌────────────┐      ┌────────────┐       ┌────────────┐
│     ✓      │      │     2      │       │     3      │
│ [GREEN]    │      │ [GRADIENT] │       │ [WHITE/10] │
│ Scale:110% │      │ Scale:125% │       │ Scale:100% │
│            │      │ + PING     │       │            │
└────────────┘      └────────────┘       └────────────┘
    Bounce           Pulsing Ring         Static
```

### Connector States

```
COMPLETE: ════════ (Green, solid)
ACTIVE:   ████▒▒▒▒ (Gradient with flow animation)
PENDING:  ▒▒▒▒▒▒▒▒ (White/20, subtle)
```

## Progress Bar Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Container: bg-white/20, border-white/30, h-4, rounded-full │
├─────────────────────────────────────────────────────────────┤
│ Background Glow: Same gradient as progress, blur-sm, opacity-50 │
├─────────────────────────────────────────────────────────────┤
│ Progress Fill: Dynamic gradient based on stage color       │
│ - Base gradient (blue → teal, etc.)                        │
│ - Shimmer overlay (white/40, animate-pulse)                │
│ - Moving highlight (white/50, progressShine animation)     │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
FullTakeoverLoader
├── Portal Container (document.body level)
├── Backdrop (fixed inset-0, black/95, blur-md)
└── Main Container (max-w-md, centered)
    ├── Stage Icon & Title
    │   ├── Icon (7xl, with glow effect)
    │   ├── Title (font-black, animate-fade-in-up)
    │   ├── Description (font-medium, stagger delay)
    │   └── User Query (conditional, backdrop-blur)
    ├── Progress Bar
    │   ├── Container (border, rounded-full)
    │   ├── Background Glow
    │   ├── Progress Fill (gradient + animations)
    │   └── Status Text (percentage + time)
    ├── Stage Indicators
    │   ├── 4 Circles (different states)
    │   ├── Connectors (flow animations)
    │   └── Accessibility labels
    ├── Cost Savings Message
    │   └── Green accent panel
    └── Cancel Button
        ├── Background (white/10)
        ├── Icon (✕)
        └── Text ("Cancel Request")
```

## Accessibility Structure

### ARIA Roles & Labels

```html
<div role="dialog" aria-modal="true"
     aria-labelledby="loading-title"
     aria-describedby="loading-description">

  <h2 id="loading-title">ANALYZING REQUEST</h2>

  <p id="loading-description">Understanding your mood...</p>

  <div role="progressbar"
       aria-valuenow="65"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="Loading progress: 65% complete">

  <div aria-label="Stage 1: ANALYZING REQUEST completed">
  <div aria-label="Stage 2: ENRICHING CONTEXT in progress">

  <button aria-label="Cancel book recommendation request">
</div>
```

### Keyboard Navigation

- **ESC Key**: Cancel request
- **Tab**: Navigate to cancel button
- **Enter/Space**: Activate cancel

## Mobile Optimizations

### Touch Targets

```
Cancel Button: 44px minimum (px-4 py-3)
Stage Indicators: 48px (w-12 h-12)
Progress Bar: 16px height for easy visibility
Icon Area: Large, centered, high contrast
```

### Safe Area Handling

```css
padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
```

## Animation Timeline

### Entry (0-500ms)

- Backdrop fade-in with blur
- Container scale up from 95%
- Icon and title staggered fade-in

### Progress (500ms-15s)

- Progress bar smooth width transitions
- Stage indicator state changes
- Shimmer and glow effects
- Flow animations between stages

### Completion (15s+)

- Final stage animation
- Success state (100% progress)
- Transition preparation

### Error State

- Red accent coloring
- Error message display
- Retry/cancel options
- Graceful fallback

## Performance Considerations

### Hardware Acceleration

```css
transform: translateZ(0);
will-change: transform;
```

### Efficient Animations

- Use `transform` and `opacity` only
- Minimize repaints and reflows
- Remove `will-change` when complete
- Optimize blur and glow effects

## Color Themes by Stage

### Stage 1: Analyzing (Blue → Teal)

- Primary: `from-blue-500 to-teal-500`
- Glow: Blue tinted background

### Stage 2: Enriching (Purple → Pink)

- Primary: `from-purple-500 to-pink-500`
- Glow: Purple tinted background

### Stage 3: Finding Matches (Green → Yellow)

- Primary: `from-green-500 to-yellow-500`
- Glow: Green tinted background

### Stage 4: Fetching Covers (Orange → Red)

- Primary: `from-orange-500 to-red-500`
- Glow: Orange tinted background

## Error States & Edge Cases

### Network Timeout

```
┌─────────────────────────────────────┐
│            ⚠️
│     Request Taking Longer          │
│   This might be due to slow        │
│        internet connection.        │
│                                     │
│   [Try Again]    [Cancel]          │
└─────────────────────────────────────┘
```

### User Cancellation

```
┌─────────────────────────────────────┐
│            ✋
│        Request Cancelled            │
│   Returning to search screen...     │
│                                     │
│              [OK]                   │
└─────────────────────────────────────┘
```

### API Error

```
┌─────────────────────────────────────┐
│            ❌
│       Something went wrong          │
│    Please try a different search    │
│          or try again later.        │
│                                     │
│   [Try Again]    [Go Back]         │
└─────────────────────────────────────┘
```

## Component States Summary

### Props Interface

```typescript
interface FullTakeoverLoaderProps {
  isVisible: boolean; // Show/hide overlay
  currentStage: number; // 0-3 active stage
  stages: LoadingStage[]; // Stage definitions
  progress: number; // 0-100 completion
  costSavings?: string; // Optional savings info
  onCancel: () => void; // Cancel callback
  userQuery?: string; // User's search query
}
```

### Visual States

- **Hidden**: `isVisible: false` - Portal unmounted
- **Stage 0-3**: Different icons, colors, descriptions
- **Progress**: Smooth 0-100% with animations
- **Error**: Red accents, error messaging
- **Success**: 100% complete, transition ready

## Implementation Status ✅

All wireframes and specifications have been implemented in:

- `/src/components/full-takeover-loader.tsx`
- `/src/app/globals.css` (animations)
- Full accessibility compliance
- Mobile optimization complete
- Error state handling active

---

**DESIGN NOTES:**

- Maintains ultra-bold Gen Z aesthetic
- High contrast for readability
- Engaging without being distracting
- Clear escape paths (cancel button)
- Informative progress feedback
- Smooth, polished animations
