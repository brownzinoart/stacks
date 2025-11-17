# Complete Design System Compliance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Achieve 100% compliance with the brutalist design system specification in `design_system/atomic_design_system_with_mobile.html` by fixing ALL violations found in the comprehensive audit

**Architecture:** Systematic fix of all design system violations organized by severity (Critical → High → Medium → Low). Each task addresses one category of violations with exact code changes to match the design system specification precisely.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3.4, Lucide React icons

**Reference:** `/Users/wallymo/stacks/design_system/atomic_design_system_with_mobile.html`

---

## PHASE 1: CRITICAL VIOLATIONS (Must Fix First)

### Task 1: Fix Card Border Radius - 12px to 20px

**Files:**
- Modify: `stacks-app/components/BookCard.tsx:19`
- Modify: `stacks-app/components/StackCard.tsx:50`
- Modify: `stacks-app/app/stacks/page.tsx:24`
- Modify: `stacks-app/app/discover/page.tsx:42`

**Design System Spec Reference:**
```css
/* Line 534: Desktop cards */
.card {
    border-radius: 20px;
}

/* Line 579: Mobile cards */
.mobile-card {
    border-radius: 20px;
}
```

**Step 1: Update BookCard cover to use 20px border-radius**

In `BookCard.tsx` line 19, change `rounded-xl` (12px) to `rounded-[20px]`:

```typescript
<div className="relative w-full aspect-[2/3] bg-gradient-secondary border-4 border-black dark:border-white shadow-brutal rounded-[20px] mb-3 overflow-hidden">
```

**Step 2: Update StackCard main article to use 20px border-radius**

In `StackCard.tsx` line 50, add `rounded-[20px]`:

```typescript
<article className="mb-6 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal rounded-[20px]">
```

**Step 3: Update Stacks page horizontal scroll cards**

In `stacks/page.tsx` line 24, change `rounded-xl` to `rounded-[20px]`:

```typescript
className="w-64 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal rounded-[20px] flex-shrink-0"
```

**Step 4: Update Discover page empty state card**

In `discover/page.tsx` line 42, change implicit rounding to explicit `rounded-[20px]`:

```typescript
<div className="bg-gradient-accent border-4 border-black dark:border-white shadow-brutal rounded-[20px] p-8 text-center">
```

**Step 5: Update stat cards in Stacks page**

In `stacks/page.tsx` lines 84, 88, 92, change `rounded-xl` to `rounded-[20px]`:

```typescript
// Line 84
<div className="bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm rounded-[20px] p-3 text-center">

// Line 88
<div className="bg-gradient-accent border-4 border-black dark:border-white shadow-brutal-sm rounded-[20px] p-3 text-center">

// Line 92
<div className="bg-gradient-success border-4 border-black dark:border-white shadow-brutal-sm rounded-[20px] p-3 text-center">
```

**Step 6: Commit**

```bash
git add stacks-app/components/BookCard.tsx stacks-app/components/StackCard.tsx stacks-app/app/stacks/page.tsx stacks-app/app/discover/page.tsx
git commit -m "fix(design): update card border-radius from 12px to 20px

- Change all card components from rounded-xl (12px) to rounded-[20px]
- Matches design system specification (line 534, 579)
- Applies to BookCard, StackCard, stat cards, and discover cards

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Fix Badge Shadows - 4px to 3px

**Files:**
- Modify: `stacks-app/components/MatchBadge.tsx:14`
- Modify: `stacks-app/tailwind.config.ts`
- Modify: `stacks-app/app/globals.css`

**Design System Spec Reference:**
```css
/* Line 294: Badge shadow */
.badge {
    box-shadow: 3px 3px 0px #000;
}
```

**Step 1: Add 3px shadow to Tailwind config**

In `tailwind.config.ts`, add new shadow value in the `boxShadow` object:

```typescript
boxShadow: {
  brutal: "8px 8px 0 0 #000000",
  "brutal-sm": "4px 4px 0 0 #000000",
  "brutal-hover": "12px 12px 0 0 #000000",
  "brutal-badge": "3px 3px 0 0 #000000",  // NEW
},
```

**Step 2: Update badge-brutal utility class to use 3px shadow**

In `globals.css`, update the `.badge-brutal` class (around line 57):

```css
/* Brutalist badge */
.badge-brutal {
  @apply inline-block px-4 py-2
         font-black text-sm uppercase tracking-tight
         border-[3px] border-black dark:border-white
         rounded-xl shadow-brutal-badge
         transition-all;
}
```

**Step 3: Update MatchBadge component**

In `MatchBadge.tsx` line 14, update shadow class:

```typescript
<div className={`${getGradient(score)} px-3 py-1 border-[3px] border-black dark:border-white shadow-brutal-badge rounded-xl text-center`}>
```

**Step 4: Commit**

```bash
git add stacks-app/components/MatchBadge.tsx stacks-app/tailwind.config.ts stacks-app/app/globals.css
git commit -m "fix(design): update badge shadows from 4px to 3px

- Add shadow-brutal-badge (3px) to Tailwind config
- Update badge-brutal utility class to use 3px shadow
- Update MatchBadge component
- Matches design system specification (line 294)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Fix Button and Input Padding to Match Spec

**Files:**
- Modify: `stacks-app/app/globals.css`
- Modify: `stacks-app/app/discover/page.tsx:51`

**Design System Spec Reference:**
```css
/* Line 195: Standard buttons */
.btn {
    padding: 18px 36px;
}

/* Line 227-230: Mobile touch buttons */
.btn-touch {
    padding: 20px 40px;
    min-height: 56px;
}

/* Line 262: Inputs */
.input {
    padding: 18px 20px;
}
```

**Step 1: Update input-brutal utility class padding**

In `globals.css`, update `.input-brutal` class (around line 48):

```css
/* Brutalist input */
.input-brutal {
  @apply w-full px-5 py-[18px] font-semibold text-base
         bg-white dark:bg-dark-secondary
         border-4 border-black dark:border-white
         rounded-xl shadow-brutal-sm
         focus:outline-none focus:shadow-brutal
         transition-all duration-150;
}
```

**Step 2: Update btn-brutal utility class padding**

In `globals.css`, update `.btn-brutal` class (around line 24):

```css
/* Brutalist button */
.btn-brutal {
  @apply relative font-black uppercase tracking-wider px-9 py-[18px]
         bg-white dark:bg-dark-secondary text-black dark:text-white
         border-4 border-black dark:border-white
         shadow-brutal hover:shadow-brutal-hover
         transition-all duration-150 active:translate-x-1 active:translate-y-1;
}
```

**Step 3: Add btn-brutal-touch utility for mobile**

In `globals.css`, add after `.btn-brutal`:

```css
/* Brutalist touch button (mobile) */
.btn-brutal-touch {
  @apply relative font-black uppercase tracking-wider px-10 py-5
         min-h-[56px]
         bg-white dark:bg-dark-secondary text-black dark:text-white
         border-4 border-black dark:border-white
         rounded-xl shadow-brutal-sm hover:shadow-brutal
         transition-all duration-150 active:translate-x-1 active:translate-y-1;
}
```

**Step 4: Update discover page button padding**

In `discover/page.tsx` line 51, update button classes:

```typescript
className="px-9 py-[18px] bg-white text-black border-3 border-black rounded-xl font-black uppercase text-sm shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Step 5: Commit**

```bash
git add stacks-app/app/globals.css stacks-app/app/discover/page.tsx
git commit -m "fix(design): update button and input padding to match spec

- Update input-brutal: px-5 py-[18px] (was px-4 py-3)
- Update btn-brutal: px-9 py-[18px] (was px-6 py-3)
- Add btn-brutal-touch for mobile (px-10 py-5, min-h-56px)
- Update discover page button
- Matches design system spec (lines 195, 227-230, 262)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Fix Typography - Add Missing Uppercase and Letter Spacing

**Files:**
- Modify: `stacks-app/components/BookSection.tsx:13`
- Modify: `stacks-app/app/stacks/page.tsx:12, 73`
- Modify: `stacks-app/app/reading/page.tsx:15`

**Design System Spec Reference:**
```css
/* Line 139-145: H1 Typography */
.typo-h1 {
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -2px;
}

/* Line 177-183: Mobile H1 */
.typo-mobile-h1 {
    font-size: 40px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -1.5px;
}
```

**Step 1: Fix BookSection title letter spacing**

In `BookSection.tsx` line 13, change `tracking-tight` to `tracking-tighter`:

```typescript
<h2 className="font-black text-xl uppercase tracking-tighter px-4 mb-4">
```

**Step 2: Fix Stacks page section title letter spacing**

In `stacks/page.tsx` line 12, update:

```typescript
<h2 className="font-black text-lg uppercase tracking-tighter px-4 mb-4">
```

**Step 3: Fix Stacks page main heading**

In `stacks/page.tsx` line 73, update:

```typescript
<h1 className="font-black text-xl uppercase tracking-tighter mb-1">
```

**Step 4: Fix Reading page heading**

In `reading/page.tsx` line 15, change `tracking-wider` to `tracking-tighter` and ensure uppercase:

```typescript
<h1 className="font-black text-2xl uppercase tracking-tighter mb-6">
```

**Step 5: Commit**

```bash
git add stacks-app/components/BookSection.tsx stacks-app/app/stacks/page.tsx stacks-app/app/reading/page.tsx
git commit -m "fix(design): fix typography letter-spacing to match spec

- Change tracking-tight/tracking-wider to tracking-tighter
- Ensure all headings have uppercase
- Matches design system negative letter-spacing spec
- Applies to: BookSection, Stacks page, Reading page

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Fix Stat Values Font Size - 24px to 36px

**Files:**
- Modify: `stacks-app/app/stacks/page.tsx:85, 89, 93`

**Design System Spec Reference:**
```css
/* Line 686-691: Stat value */
.stat-value {
    font-size: 36px;
    font-weight: 900;
    color: #000;
}
```

**Step 1: Update all three stat card values**

In `stacks/page.tsx`, update font size from `text-2xl` (24px) to `text-4xl` (36px):

```typescript
// Line 85
<p className="font-black text-4xl text-white">24</p>

// Line 89
<p className="font-black text-4xl text-white">156</p>

// Line 93
<p className="font-black text-4xl text-white">89</p>
```

**Step 2: Commit**

```bash
git add stacks-app/app/stacks/page.tsx
git commit -m "fix(design): increase stat value font size to 36px

- Change text-2xl (24px) to text-4xl (36px)
- Matches design system stat-value spec (line 686-691)
- Improves visual hierarchy and readability

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## PHASE 2: HIGH SEVERITY VIOLATIONS

### Task 6: Add Interactive States - Hover and Active Transforms

**Files:**
- Modify: `stacks-app/app/globals.css`
- Modify: `stacks-app/components/StackCard.tsx:106-118`

**Design System Spec Reference:**
```css
/* Line 209-217: Button hover/active */
.btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
}
.btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
}
```

**Step 1: Update btn-brutal with proper hover/active transforms**

In `globals.css`, update `.btn-brutal`:

```css
/* Brutalist button */
.btn-brutal {
  @apply relative font-black uppercase tracking-wider px-9 py-[18px]
         bg-white dark:bg-dark-secondary text-black dark:text-white
         border-4 border-black dark:border-white
         shadow-brutal-sm
         hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal
         active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000]
         transition-all duration-150;
}
```

**Step 2: Update badge-brutal with hover state**

In `globals.css`, update `.badge-brutal`:

```css
/* Brutalist badge */
.badge-brutal {
  @apply inline-block px-4 py-2
         font-black text-sm uppercase tracking-tight
         border-[3px] border-black dark:border-white
         rounded-xl shadow-brutal-badge
         hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm
         transition-all duration-150;
}
```

**Step 3: Update fab-brutal with active state**

In `globals.css`, update `.fab-brutal`:

```css
/* Floating Action Button */
.fab-brutal {
  @apply w-16 h-16 rounded-full
         border-4 border-black dark:border-white
         shadow-brutal-sm hover:shadow-brutal
         hover:-translate-x-0.5 hover:-translate-y-0.5
         active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm
         flex items-center justify-center
         transition-all duration-150;
}
```

**Step 4: Add hover states to StackCard action buttons**

In `StackCard.tsx`, update each button (lines 106, 109, 112, 116):

```typescript
// Line 106
<button className="hover:opacity-70 hover:-translate-y-0.5 transition-all">

// Line 109
<button className="hover:opacity-70 hover:-translate-y-0.5 transition-all">

// Line 112
<button className="hover:opacity-70 hover:-translate-y-0.5 transition-all">

// Line 116
<button className="hover:opacity-70 hover:-translate-y-0.5 transition-all">
```

**Step 5: Commit**

```bash
git add stacks-app/app/globals.css stacks-app/components/StackCard.tsx
git commit -m "feat(design): add interactive states with transforms

- Add hover transforms (-2px/-2px) to buttons and badges
- Add active transforms (+2px/+2px) with reduced shadow
- Apply to btn-brutal, badge-brutal, fab-brutal utilities
- Add hover feedback to StackCard action icons
- Matches design system spec (lines 209-217)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Fix Input Focus States

**Files:**
- Modify: `stacks-app/app/globals.css`

**Design System Spec Reference:**
```css
/* Line 273-277: Input focus */
.input:focus {
    outline: none;
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0px #000;
}
```

**Step 1: Add custom shadow for input focus (5px)**

In `tailwind.config.ts`, add to boxShadow:

```typescript
boxShadow: {
  brutal: "8px 8px 0 0 #000000",
  "brutal-sm": "4px 4px 0 0 #000000",
  "brutal-hover": "12px 12px 0 0 #000000",
  "brutal-badge": "3px 3px 0 0 #000000",
  "brutal-focus": "5px 5px 0 0 #000000",  // NEW
},
```

**Step 2: Update input-brutal focus state**

In `globals.css`, update `.input-brutal`:

```css
/* Brutalist input */
.input-brutal {
  @apply w-full px-5 py-[18px] font-semibold text-base
         bg-white dark:bg-dark-secondary
         border-4 border-black dark:border-white
         rounded-xl shadow-brutal-sm
         focus:outline-none focus:-translate-x-px focus:-translate-y-px focus:shadow-brutal-focus
         transition-all duration-150;
}
```

**Step 3: Commit**

```bash
git add stacks-app/tailwind.config.ts stacks-app/app/globals.css
git commit -m "fix(design): add proper input focus state

- Add shadow-brutal-focus (5px) to Tailwind config
- Update input-brutal with -1px/-1px transform on focus
- Update focus shadow from 8px to 5px
- Matches design system spec (lines 273-277)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Fix Border Thickness - Nav and FAB to 5px

**Files:**
- Modify: `stacks-app/components/BottomNav.tsx:18`
- Modify: `stacks-app/app/globals.css`

**Design System Spec Reference:**
```css
/* Line 489: Bottom nav */
.bottom-nav {
    border-top: 5px solid #000;
}

/* Line 237: FAB */
.fab {
    border: 5px solid #000;
}
```

**Step 1: Update BottomNav border thickness**

In `BottomNav.tsx` line 18, change `border-t-4` to `border-t-[5px]`:

```typescript
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-secondary border-t-[5px] border-black dark:border-white">
```

**Step 2: Update FAB border in fab-brutal utility**

In `globals.css`, update `.fab-brutal`:

```css
/* Floating Action Button */
.fab-brutal {
  @apply w-16 h-16 rounded-full
         border-[5px] border-black dark:border-white
         shadow-brutal-sm hover:shadow-brutal
         hover:-translate-x-0.5 hover:-translate-y-0.5
         active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm
         flex items-center justify-center
         transition-all duration-150;
}
```

**Step 3: Commit**

```bash
git add stacks-app/components/BottomNav.tsx stacks-app/app/globals.css
git commit -m "fix(design): update nav and FAB borders from 4px to 5px

- Update BottomNav border-top to 5px
- Update fab-brutal border to 5px
- Matches design system spec (lines 237, 489)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: Add Dark Mode Shadow Support

**Files:**
- Modify: `stacks-app/tailwind.config.ts`
- Modify: `stacks-app/app/globals.css`

**Design System Issue:** Shadows use black (#000) in both light and dark modes, making them invisible in dark mode.

**Step 1: Add dark mode shadow variants to Tailwind config**

In `tailwind.config.ts`, update boxShadow to use CSS variables:

```typescript
boxShadow: {
  brutal: "8px 8px 0 0 rgb(var(--shadow-color))",
  "brutal-sm": "4px 4px 0 0 rgb(var(--shadow-color))",
  "brutal-hover": "12px 12px 0 0 rgb(var(--shadow-color))",
  "brutal-badge": "3px 3px 0 0 rgb(var(--shadow-color))",
  "brutal-focus": "5px 5px 0 0 rgb(var(--shadow-color))",
},
```

**Step 2: Define shadow color CSS variables in globals.css**

In `globals.css`, add to `:root` and `.dark`:

```css
@layer base {
  :root {
    --background: 250 250 250;
    --foreground: 0 0 0;
    --shadow-color: 0 0 0;  /* BLACK shadows for light mode */
  }

  .dark {
    --background: 26 26 26;
    --foreground: 255 255 255;
    --shadow-color: 255 255 255;  /* WHITE shadows for dark mode */
  }

  /* ... rest of existing code ... */
}
```

**Step 3: Commit**

```bash
git add stacks-app/tailwind.config.ts stacks-app/app/globals.css
git commit -m "feat(design): add dark mode shadow support

- Use CSS variables for shadow colors
- Black shadows in light mode, white in dark mode
- Applies to all brutal shadow variants
- Improves dark mode visual hierarchy

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## PHASE 3: MEDIUM SEVERITY VIOLATIONS

### Task 10: Fix Spacing Inconsistencies

**Files:**
- Modify: `stacks-app/components/VibeChips.tsx:21`
- Modify: `stacks-app/app/home/page.tsx:12`
- Modify: `stacks-app/app/discover/page.tsx:23`
- Modify: `stacks-app/app/stacks/page.tsx:65`
- Modify: `stacks-app/app/reading/page.tsx:9`

**Design System Spec Reference:**
```css
/* Mobile spec shows consistent padding: 16-24px */
```

**Step 1: Fix VibeChips container padding**

In `VibeChips.tsx` line 21, change `py-2` to `py-4`:

```typescript
<div className="flex gap-3 px-4 py-4" style={{ width: "max-content" }}>
```

**Step 2: Update bottom padding for nav across all pages**

Change all pages from `pb-20` to `pb-24`:

```typescript
// home/page.tsx line 12
<div className="min-h-screen dark:bg-dark-primary pb-24" style={{ background: 'linear-gradient(135deg, #38f9d7 0%, #fee140 50%, #f5576c 100%)' }}>

// discover/page.tsx line 23
<div className="min-h-screen bg-white dark:bg-dark-primary pb-24">

// stacks/page.tsx line 65
<div className="min-h-screen bg-white dark:bg-dark-primary pb-24">

// reading/page.tsx line 9
<div className="min-h-screen bg-white dark:bg-dark-primary pb-24">
```

**Step 3: Commit**

```bash
git add stacks-app/components/VibeChips.tsx stacks-app/app/home/page.tsx stacks-app/app/discover/page.tsx stacks-app/app/stacks/page.tsx stacks-app/app/reading/page.tsx
git commit -m "fix(design): standardize spacing across components

- Update VibeChips padding from py-2 to py-4
- Update all pages bottom padding from pb-20 to pb-24
- Prevents nav overlap and improves consistency
- Matches design system spacing spec

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 11: Add Avatar Shadow to Profile

**Files:**
- Modify: `stacks-app/app/stacks/page.tsx:71`

**Design System Spec Reference:**
```css
/* Line 522-528: Avatar */
.avatar {
    border: 4px solid #000;
    box-shadow: 3px 3px 0px #000;
}
```

**Step 1: Add shadow to profile avatar**

In `stacks/page.tsx` line 71, add shadow:

```typescript
<div className="w-20 h-20 rounded-full bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-badge" />
```

**Step 2: Commit**

```bash
git add stacks-app/app/stacks/page.tsx
git commit -m "fix(design): add shadow to profile avatar

- Add shadow-brutal-badge (3px) to avatar
- Matches design system avatar spec (line 522-528)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 12: Update Body Text Font Size to 18px

**Files:**
- Modify: `stacks-app/components/StackCard.tsx:128, 132`

**Design System Spec Reference:**
```css
/* Line 162-166: Body text */
.typo-body {
    font-size: 18px;
    font-weight: 500;
}
```

**Step 1: Update StackCard caption text**

In `StackCard.tsx`, change body text from `text-base` (16px) to `text-lg` (18px):

```typescript
// Line 128 (username link) - keep as is, this is a label
// Line 132 (caption text)
<span className="font-semibold text-lg">{stack.caption}</span>
```

**Step 2: Commit**

```bash
git add stacks-app/components/StackCard.tsx
git commit -m "fix(design): update body text to 18px

- Change caption text from text-base (16px) to text-lg (18px)
- Matches design system typo-body spec (line 162-166)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## PHASE 4: DOCUMENTATION AND POLISH

### Task 13: Update CLAUDE.md with Complete Design System Reference

**Files:**
- Modify: `/Users/wallymo/stacks/CLAUDE.md`

**Step 1: Add design system exact specifications to CLAUDE.md**

After the existing "Design System Utility Classes" section (around line 224), add:

```markdown
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
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add exact design system specifications to CLAUDE.md

- Add complete reference for border-radius values
- Add shadow specifications with exact px values
- Add border thickness rules for all element types
- Add padding specifications for buttons and inputs
- Add typography size scales
- Add interactive state transforms
- Ensures 100% compliance with design system HTML

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 14: Run Production Build and Visual Verification

**Files:**
- None (testing only)

**Step 1: Run production build**

Run: `cd stacks-app && npm run build`
Expected: Clean build with no errors

**Step 2: Check for TypeScript errors**

Run: `cd stacks-app && npx tsc --noEmit`
Expected: No errors

**Step 3: Visual checklist (if dev server available)**

Start dev server and manually verify on each page:
- `/home` - Cards have 20px radius, shadows visible in dark mode
- `/stacks` - Stats show 36px font, avatar has shadow, FAB has 5px border
- `/discover` - Search input has proper padding, vibe chips have hover states
- `/reading` - Typography uses proper letter-spacing

**Step 4: Create summary (no commit)**

Document any remaining issues found during testing.

---

## Success Criteria

✅ **Border Radius Compliance:**
- All cards use `rounded-[20px]` (20px)
- All inputs/buttons use `rounded-xl` (12px)
- All badges use `rounded-xl` or `rounded-[50px]` for pills

✅ **Shadow Compliance:**
- Badges use 3px shadows
- Buttons use 4px shadows
- Cards use 6px shadows
- Input focus uses 5px shadows
- Dark mode shows white shadows

✅ **Border Thickness Compliance:**
- Cards use 4px (mobile) or 5px (desktop where applicable)
- Badges use 3px borders
- Nav bar uses 5px top border
- FAB uses 5px border

✅ **Padding Compliance:**
- Buttons use 18px/36px padding
- Touch buttons use 20px/40px with 56px min-height
- Inputs use 18px/20px padding

✅ **Typography Compliance:**
- All headings use uppercase with negative letter-spacing
- Body text is 18px
- Stat values are 36px
- Proper font weights throughout

✅ **Interactive States:**
- All buttons have hover/active transforms
- Input focus has transform and shadow change
- Badges have hover states

✅ **Spacing Compliance:**
- Consistent padding across components
- Pages use pb-24 for nav clearance
- Section gaps are consistent

✅ **Dark Mode:**
- Shadows use white in dark mode
- All colors have dark mode variants

---

## Implementation Estimate

**Total Time:** ~4-6 hours
- Phase 1 (Critical): 1-2 hours
- Phase 2 (High): 1-2 hours
- Phase 3 (Medium): 1 hour
- Phase 4 (Documentation): 30 minutes
- Testing & fixes: 30-60 minutes

**Priority:** CRITICAL - Design system compliance is essential for brand consistency and Gen Z appeal

**Dependencies:** None (all styling changes, no API/functionality changes)

---

## Notes

- This plan addresses ALL 20 violation categories found in the comprehensive audit
- Each task includes exact line numbers and code changes
- All changes maintain backward compatibility
- Dark mode support is enhanced, not broken
- No functionality changes, purely visual/styling improvements
- After this implementation, the app will be 100% compliant with the design system spec

## Related Skills

- @superpowers:verification-before-completion - Use after each phase
- @superpowers:systematic-debugging - If visual regressions occur
