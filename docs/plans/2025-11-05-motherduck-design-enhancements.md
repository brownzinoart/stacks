# MotherDuck Design Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Incorporate MotherDuck's sophisticated design patterns into Stacks, including button micro-interactions, responsive spacing, typography scale, and interactive card behaviors.

**Architecture:** Update Tailwind config with MotherDuck-inspired design tokens, create reusable component utilities in globals.css, and enhance existing components with micro-interactions and responsive behaviors.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3.4, TypeScript 5

---

## Task 1: Update Typography System with MotherDuck Scale

**Files:**
- Modify: `stacks-app/tailwind.config.ts:53-55`
- Modify: `stacks-app/app/globals.css:1-23`
- Test: Manual visual inspection at http://localhost:3000

**Step 1: Add responsive typography scale to Tailwind config**

Update the `theme.extend` section with MotherDuck's responsive typography:

```typescript
// In tailwind.config.ts, add to theme.extend:
fontSize: {
  // MotherDuck-inspired responsive typography
  'h1-mobile': ['30px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
  'h1-tablet': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
  'h1-desktop': ['80px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
  'h2-mobile': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
  'h2-tablet': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
  'h2-desktop': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
  'body-md': ['16px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
},
```

**Step 2: Test typography compilation**

```bash
cd stacks-app
# Watch for compilation success in dev server output
```

Expected: No TypeScript or Tailwind errors, dev server recompiles successfully

**Step 3: Commit typography config**

```bash
git add stacks-app/tailwind.config.ts
git commit -m "feat: add MotherDuck-inspired responsive typography scale"
```

---

## Task 2: Implement MotherDuck Button Micro-interactions

**Files:**
- Modify: `stacks-app/app/globals.css:25-99`
- Test: Visual inspection of buttons in browser

**Step 1: Create MotherDuck-style primary button class**

Add to globals.css `@layer components`:

```css
/* MotherDuck Primary CTA Button */
.btn-motherduck-primary {
  @apply inline-block px-[22px] py-[16.5px]
         font-black uppercase text-base
         bg-accent-cyan text-light-text dark:text-dark-text
         border-2 border-light-border dark:border-dark-border
         rounded-xl
         transition-all duration-[120ms] ease-in-out
         hover:translate-x-[7px] hover:-translate-y-[7px]
         active:bg-accent-cyanHover
         shadow-[-5px_5px_0_0_rgb(var(--shadow-color))]
         hover:shadow-[-12px_12px_0_0_rgb(var(--shadow-color))];
}

/* MotherDuck Secondary Button */
.btn-motherduck-secondary {
  @apply inline-block px-[22px] py-[16.5px]
         font-black uppercase text-base
         bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text
         border-2 border-light-border dark:border-dark-border
         rounded-xl
         transition-all duration-[120ms] ease-in-out
         hover:translate-x-[7px] hover:-translate-y-[7px]
         active:bg-[#E1D6CB] dark:active:bg-dark-secondary
         shadow-[-5px_5px_0_0_rgb(var(--shadow-color))]
         hover:shadow-[-12px_12px_0_0_rgb(var(--shadow-color))];
}
```

**Step 2: Verify CSS compiles without errors**

Check dev server output for CSS compilation success.

Expected: No CSS errors, classes available in browser DevTools

**Step 3: Commit button styles**

```bash
git add stacks-app/app/globals.css
git commit -m "feat: add MotherDuck button micro-interactions (7px diagonal hover)"
```

---

## Task 3: Add MotherDuck Card Hover Effects

**Files:**
- Modify: `stacks-app/app/globals.css:50-57`

**Step 1: Update card-brutal with MotherDuck hover behavior**

Replace existing `.card-brutal` class:

```css
/* MotherDuck-style Card with Scale + Shadow Expansion */
.card-brutal {
  @apply bg-light-secondary dark:bg-dark-secondary
         border-[5px] border-light-border dark:border-dark-border
         rounded-[20px] shadow-brutal-card
         transition-all duration-200 ease-in-out
         hover:scale-[1.02] hover:shadow-[-10px_10px_0_0_rgb(var(--shadow-color))]
         active:scale-[0.98];
}
```

**Step 2: Test card hover in browser**

Navigate to http://localhost:3000/home and hover over stack cards.

Expected: Cards scale up slightly and shadow expands on hover

**Step 3: Commit card enhancements**

```bash
git add stacks-app/app/globals.css
git commit -m "feat: add MotherDuck scale + shadow expansion to cards"
```

---

## Task 4: Implement MotherDuck Spacing System

**Files:**
- Modify: `stacks-app/tailwind.config.ts:65-70`

**Step 1: Add MotherDuck spacing tokens**

Expand the `spacing` section in tailwind.config.ts:

```typescript
spacing: {
  '18': '4.5rem',   // 72px (existing)
  '22': '5.5rem',   // 88px (existing)
  '26': '6.5rem',   // 104px (existing)
  // MotherDuck spacing additions
  '14': '3.5rem',   // 56px - section spacing
  '20': '5rem',     // 80px - large gaps
  '28': '7rem',     // 112px - major section breaks
  '32': '8rem',     // 128px - hero spacing
  '35': '8.75rem',  // 140px - bottom padding mobile
  '40': '10rem',    // 160px - major vertical rhythm
},
```

**Step 2: Verify spacing compiles**

Check dev server for successful compilation.

Expected: No errors, new spacing utilities available

**Step 3: Commit spacing tokens**

```bash
git add stacks-app/tailwind.config.ts
git commit -m "feat: add MotherDuck spacing system (56-160px scale)"
```

---

## Task 5: Add Interactive Link Underline Animation

**Files:**
- Modify: `stacks-app/app/globals.css:99` (append)

**Step 1: Create MotherDuck link animation class**

Add after existing component utilities:

```css
/* MotherDuck Animated Link Underline */
.link-motherduck {
  @apply relative inline-block
         border-b-[0.09em] border-light-border dark:border-dark-border
         mb-px
         transition-all duration-150
         hover:border-b-[0.18em] hover:mb-0;
}
```

**Step 2: Test link animation**

Create a test link in any component to verify animation works.

Expected: Underline thickens and element shifts up 1px on hover

**Step 3: Commit link animation**

```bash
git add stacks-app/app/globals.css
git commit -m "feat: add MotherDuck link underline animation"
```

---

## Task 6: Implement Scroll-Triggered Animations

**Files:**
- Modify: `stacks-app/app/globals.css:99` (append)
- Create: `stacks-app/lib/useScrollAnimation.ts`

**Step 1: Add scroll animation utility classes**

Add to globals.css:

```css
/* MotherDuck Scroll Animations */
@keyframes scrollFadeUp {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollFadeDown {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-animate-up {
  animation: scrollFadeUp 0.6s ease-out forwards;
}

.scroll-animate-down {
  animation: scrollFadeDown 0.6s ease-out forwards;
}

/* Initial state before animation triggers */
.scroll-animate-initial {
  @apply opacity-0;
}
```

**Step 2: Create scroll observation hook**

Create `stacks-app/lib/useScrollAnimation.ts`:

```typescript
"use client";

import { useEffect, useRef } from "react";

export function useScrollAnimation(direction: "up" | "down" = "up") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.remove("scroll-animate-initial");
            element.classList.add(`scroll-animate-${direction}`);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    element.classList.add("scroll-animate-initial");
    observer.observe(element);

    return () => observer.disconnect();
  }, [direction]);

  return ref;
}
```

**Step 3: Test scroll animations**

Import and use in a component:

```typescript
const ref = useScrollAnimation("up");
return <div ref={ref}>Content that animates on scroll</div>;
```

Expected: Element fades in and slides up when scrolled into view

**Step 4: Commit scroll animations**

```bash
git add stacks-app/app/globals.css stacks-app/lib/useScrollAnimation.ts
git commit -m "feat: add MotherDuck scroll-triggered fade animations"
```

---

## Task 7: Add Responsive Grid System

**Files:**
- Modify: `stacks-app/tailwind.config.ts:44-52`

**Step 1: Add MotherDuck grid configuration**

Add to `theme.extend` in tailwind.config.ts:

```typescript
gridTemplateColumns: {
  // MotherDuck responsive grids
  'motherduck-mobile': '1fr',
  'motherduck-tablet': 'repeat(2, 1fr)',
  'motherduck-desktop': 'repeat(4, 1fr)',
  'motherduck-6col': 'repeat(6, 1fr)',
},
gap: {
  // MotherDuck gap scale
  '2': '8px',
  '4': '16px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
},
```

**Step 2: Create responsive grid utility**

Add to globals.css:

```css
/* MotherDuck Responsive Content Grid */
.grid-motherduck-content {
  @apply grid gap-6
         grid-cols-1
         md:grid-cols-2
         lg:grid-cols-4;
}

/* MotherDuck Featured Grid (2-col on tablet+) */
.grid-motherduck-featured {
  @apply grid gap-8
         grid-cols-1
         md:grid-cols-2;
}
```

**Step 3: Verify grid utilities compile**

Check dev server output.

Expected: Grid utilities available, no compilation errors

**Step 4: Commit grid system**

```bash
git add stacks-app/tailwind.config.ts stacks-app/app/globals.css
git commit -m "feat: add MotherDuck responsive grid system"
```

---

## Task 8: Update Existing Components with MotherDuck Patterns

**Files:**
- Modify: `stacks-app/components/StackCard.tsx:1-100`
- Test: Visual inspection at http://localhost:3000/home

**Step 1: Read existing StackCard component**

Review current implementation to understand structure.

**Step 2: Apply MotherDuck card styles**

Update the card wrapper to use new MotherDuck hover behavior:

```typescript
// Replace existing card wrapper className:
<div className="card-brutal p-6 mb-4">
  {/* existing content */}
</div>
```

**Step 3: Test StackCard in browser**

Navigate to /home and verify cards have scale + shadow expansion on hover.

Expected: Cards scale 1.02 and shadow extends on hover

**Step 4: Commit StackCard updates**

```bash
git add stacks-app/components/StackCard.tsx
git commit -m "feat: apply MotherDuck hover effects to StackCard"
```

---

## Task 9: Enhance Button Components

**Files:**
- Modify: `stacks-app/components/BottomNav.tsx:1-50`
- Test: Visual inspection at http://localhost:3000

**Step 1: Read BottomNav component**

Review existing button implementation.

**Step 2: Apply MotherDuck button micro-interactions**

Update any CTA buttons to use MotherDuck classes:

```typescript
// Example: If there's a "Create Stack" button
<button className="btn-motherduck-primary">
  Create Stack
</button>
```

**Step 3: Test button interactions**

Click and hover buttons to verify 7px diagonal offset.

Expected: Buttons translate 7px right and 7px up on hover, shadow expands

**Step 4: Commit button enhancements**

```bash
git add stacks-app/components/BottomNav.tsx
git commit -m "feat: apply MotherDuck button animations to BottomNav"
```

---

## Task 10: Add Responsive Typography to Pages

**Files:**
- Modify: `stacks-app/app/home/page.tsx:1-100`
- Modify: `stacks-app/app/stacks/page.tsx:1-100`

**Step 1: Update home page heading with responsive typography**

Replace existing h1 classes:

```typescript
// In app/home/page.tsx
<h1 className="text-h1-mobile md:text-h1-tablet lg:text-h1-desktop font-black uppercase mb-8">
  STACKS
</h1>
```

**Step 2: Update stacks page heading**

Apply same pattern to stacks page:

```typescript
// In app/stacks/page.tsx
<h2 className="text-h2-mobile md:text-h2-tablet lg:text-h2-desktop font-black uppercase mb-6">
  My Stacks
</h2>
```

**Step 3: Test responsive typography**

Resize browser from mobile (390px) to desktop (1440px).

Expected: Headings scale smoothly from 30px → 56px → 80px

**Step 4: Commit typography updates**

```bash
git add stacks-app/app/home/page.tsx stacks-app/app/stacks/page.tsx
git commit -m "feat: add responsive typography to home and stacks pages"
```

---

## Task 11: Implement MotherDuck Spacing on Pages

**Files:**
- Modify: `stacks-app/app/home/page.tsx:1-100`

**Step 1: Update page container spacing**

Replace existing padding with MotherDuck spacing:

```typescript
// Update main container
<main className="min-h-screen bg-gradient-hero px-4 py-14 md:py-20 lg:py-28 pb-nav">
  {/* content */}
</main>
```

**Step 2: Add section spacing between elements**

Add generous gaps between major sections:

```typescript
<div className="space-y-8 md:space-y-14 lg:space-y-20">
  {/* Stack cards */}
</div>
```

**Step 3: Test spacing at different viewports**

Resize browser and verify spacing feels generous but not excessive.

Expected: 56px → 80px → 112px vertical rhythm between sections

**Step 4: Commit spacing updates**

```bash
git add stacks-app/app/home/page.tsx
git commit -m "feat: apply MotherDuck spacing system to home page"
```

---

## Task 12: Add Scroll Animations to Feed

**Files:**
- Modify: `stacks-app/app/home/page.tsx:1-100`
- Modify: `stacks-app/components/StackCard.tsx:1-100`

**Step 1: Import scroll animation hook in StackCard**

```typescript
import { useScrollAnimation } from "@/lib/useScrollAnimation";
```

**Step 2: Apply scroll animation to each card**

```typescript
export function StackCard({ stack }: { stack: Stack }) {
  const ref = useScrollAnimation("up");

  return (
    <div ref={ref} className="card-brutal p-6 mb-4">
      {/* existing content */}
    </div>
  );
}
```

**Step 3: Test scroll animations**

Scroll down the /home feed slowly.

Expected: Cards fade in and slide up as they enter viewport

**Step 4: Commit scroll animations**

```bash
git add stacks-app/components/StackCard.tsx
git commit -m "feat: add scroll-triggered animations to stack cards"
```

---

## Task 13: Update Discovery Page Grid

**Files:**
- Modify: `stacks-app/app/discover/page.tsx:1-150`

**Step 1: Read discover page structure**

Review current book grid layout.

**Step 2: Apply MotherDuck responsive grid**

Replace existing grid classes:

```typescript
<div className="grid-motherduck-content">
  {books.map((book) => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
```

**Step 3: Test responsive grid**

Resize browser: mobile (1 col) → tablet (2 cols) → desktop (4 cols).

Expected: Grid responds at 728px and 960px breakpoints

**Step 4: Commit grid updates**

```bash
git add stacks-app/app/discover/page.tsx
git commit -m "feat: apply MotherDuck responsive grid to discovery page"
```

---

## Task 14: Add Link Underline Animation

**Files:**
- Modify: `stacks-app/components/StackCard.tsx:1-100`

**Step 1: Apply link animation to usernames**

```typescript
<a href={`/user/${stack.userId}`} className="link-motherduck font-black text-base">
  @{stack.username}
</a>
```

**Step 2: Test link hover**

Hover over username links.

Expected: Underline thickens from 0.09em to 0.18em, element shifts up 1px

**Step 3: Commit link animations**

```bash
git add stacks-app/components/StackCard.tsx
git commit -m "feat: add animated underlines to username links"
```

---

## Task 15: Final Visual QA and Documentation

**Files:**
- Create: `stacks-app/MOTHERDUCK_ENHANCEMENTS.md`
- Test: Full app walkthrough

**Step 1: Create enhancement documentation**

Document all MotherDuck patterns implemented:

```markdown
# MotherDuck Design Enhancements

## Implemented Patterns

### Button Micro-interactions
- 7px diagonal hover offset (translate-x-[7px] -translate-y-[7px])
- 120ms transition timing
- Shadow expansion on hover (-5px → -12px)
- Active state color shift

### Card Behaviors
- 1.02 scale on hover
- Shadow expansion (card-brutal utility)
- Smooth 200ms transitions

### Typography System
- Responsive scale: 30px mobile → 80px desktop
- MotherDuck letter-spacing (-0.02em headings, 0.02em body)
- Font weights: 900 (headings), 500 (body)

### Spacing
- 56-160px vertical rhythm scale
- Generous section gaps (py-14 md:py-20 lg:py-28)
- Consistent 24-32px internal padding

### Animations
- Scroll-triggered fade-up effects
- Link underline expansion
- Button hover offset

## Usage Examples

### Buttons
\`\`\`tsx
<button className="btn-motherduck-primary">Primary CTA</button>
<button className="btn-motherduck-secondary">Secondary</button>
\`\`\`

### Cards
\`\`\`tsx
<div className="card-brutal p-6">
  {/* Includes hover scale + shadow */}
</div>
\`\`\`

### Responsive Typography
\`\`\`tsx
<h1 className="text-h1-mobile md:text-h1-tablet lg:text-h1-desktop">
  Heading
</h1>
\`\`\`

### Scroll Animations
\`\`\`tsx
const ref = useScrollAnimation("up");
<div ref={ref}>Animates on scroll</div>
\`\`\`
```

**Step 2: Full app walkthrough**

Test all pages:
1. /home - Check scroll animations, card hovers, spacing
2. /stacks - Verify responsive typography, grid layout
3. /discover - Test book grid responsiveness
4. Resize from 390px → 1440px to verify all breakpoints

**Step 3: Commit documentation**

```bash
git add stacks-app/MOTHERDUCK_ENHANCEMENTS.md
git commit -m "docs: add MotherDuck enhancement documentation"
```

---

## Testing Checklist

After completing all tasks, verify:

- [ ] Buttons have 7px diagonal hover offset
- [ ] Button shadows expand on hover (-5px → -12px)
- [ ] Cards scale to 1.02 on hover
- [ ] Typography scales responsively at 728px and 960px breakpoints
- [ ] Scroll animations trigger when elements enter viewport
- [ ] Link underlines thicken on hover
- [ ] Spacing feels generous at all viewports (56-160px rhythm)
- [ ] Grid layouts respond correctly (1 → 2 → 4 columns)
- [ ] All animations use 120-200ms timing
- [ ] Dark mode works with all new components
- [ ] Dev server runs without errors

## References

- MotherDuck design system: https://motherduck.com/
- Tailwind transition docs: https://tailwindcss.com/docs/transition-property
- React Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

---

**Implementation Note:** This plan assumes the engineer will work in the main worktree with the dev server running. Each commit should be small and focused on a single enhancement. Test visual changes immediately in the browser at http://localhost:3000.
