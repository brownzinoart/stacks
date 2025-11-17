# Design System Compliance Audit & Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Audit and fix all design system violations to ensure 100% compliance with the brutalist design system defined in `design_system/atomic_design_system_with_mobile.html`

**Architecture:** Systematic audit of all components against design system specifications, fixing violations in order of severity: structural issues (borders/shadows/spacing) → typography → interactive states → accessibility

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3.4, Lucide React icons

---

## Critical Design System Violations Found

### 1. **ROUNDED CORNERS** (Most Critical)
- **Design System Rule:** `border-radius: 12px` for buttons/inputs/badges, `20px` for cards, `50%` for circular elements
- **Current State:** Multiple components have **NO border-radius** at all
- **Violations:**
  - `BookCard.tsx:19` - Book cover has NO border-radius (should be `rounded-xl` = 12px)
  - `StackCard.tsx:77` - Stack viz overlay uses `rounded` (4px) instead of `rounded-xl` (12px)
  - `StackCard.tsx:91` - Stack viz toggle button uses `rounded-full` ✓ (correct)
  - `VibeChips.tsx:26` - Vibe chips have NO border-radius (should be `rounded-xl`)
  - `SearchBar.tsx:31` - Search input has NO border-radius (should be `rounded-xl`)
  - `StackCard.tsx:54` - Avatar uses `rounded-full` ✓ (correct)

### 2. **BORDER THICKNESS**
- **Design System Rule:** 4px borders for cards/inputs (mobile), 5px for desktop cards, 3px for badges
- **Violations:**
  - `BookCard.tsx:30` - Genre badge uses `border-2` (should be `border-3`)
  - `StackCard.tsx:31,36` - Stack overlay badges use `border-2` (should be `border-3`)
  - `StackCard.tsx:54` - Avatar uses `border-3` (should be `border-4` per design system line 527)
  - `VibeChips.tsx:26` - Uses `border-3` ✓ (correct for badge-like elements)

### 3. **MISSING SHADOWS**
- **Design System Rule:** All cards, buttons, inputs should have `shadow-brutal` or `shadow-brutal-sm`
- **Violations:**
  - `BookCard.tsx:30` - Genre badge overlay has NO shadow (should add `shadow-brutal-sm` equivalent or omit since it's overlay)
  - `StackCard.tsx:31,36` - Stack badges have NO shadow
  - `discover/page.tsx:42` - Empty state card has shadow ✓

### 4. **BUTTON INCONSISTENCIES**
- **Design System Rule:** Buttons should use `rounded-xl` (12px), 4px borders, shadow-brutal-sm, hover states
- **Violations:**
  - `discover/page.tsx:51` - Button uses `border-3` ✓ but has NO `rounded-xl`
  - `StackCard.tsx:137` - FAB uses `rounded-full` ✓ (correct for FAB)
  - All buttons missing explicit `rounded-xl` class

### 5. **TYPOGRAPHY COMPLIANCE**
- **Design System Rule:** font-black for headings, font-bold for labels, font-semibold for body
- **Current State:** Generally correct, but some inconsistencies:
  - `StackCard.tsx:147` - Timestamp uses `font-black` ✓
  - Most components correctly use `font-black` for headings

### 6. **TOUCH TARGET SIZES**
- **Design System Rule:** Minimum 48px, recommended 56px for buttons, 64px for FAB
- **Status:** Need to verify all interactive elements meet minimum sizes
  - `BottomNav.tsx:19` - Nav height is `h-16` (64px) ✓
  - `StackCard.tsx:137` - FAB is `w-16 h-16` (64px) ✓
  - Action buttons may need audit

---

## Task 1: Fix BookCard Component Border Radius & Borders

**Files:**
- Modify: `stacks-app/components/BookCard.tsx:19-35`

**Step 1: Add border-radius to book cover**

In `BookCard.tsx`, update line 19 to add `rounded-xl`:

```typescript
<div className="relative w-full aspect-[2/3] bg-gradient-secondary border-4 border-black dark:border-white shadow-brutal rounded-xl mb-3 overflow-hidden">
```

**Step 2: Fix genre badge border thickness**

Update line 30 to use `border-3`:

```typescript
<div className="absolute top-2 right-2 bg-black/80 border-3 border-white px-2 py-1 z-10 rounded">
```

**Step 3: Add border-radius to genre badge**

Update the same line to include `rounded-lg` (8px for small badge):

```typescript
<div className="absolute top-2 right-2 bg-black/80 border-3 border-white px-2 py-1 z-10 rounded-lg">
```

**Step 4: Verify changes in browser**

Run: `cd stacks-app && npm run dev`
Navigate to: `http://localhost:3000/discover`
Expected: Book cards have rounded corners on covers and genre badges have thicker borders with rounded corners

**Step 5: Commit**

```bash
git add stacks-app/components/BookCard.tsx
git commit -m "fix(design): add border-radius to BookCard and fix border thickness

- Add rounded-xl to book cover container
- Fix genre badge border from 2px to 3px
- Add rounded-lg to genre badge
- Ensures compliance with brutalist design system

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Fix StackCard Component Rounded Corners & Borders

**Files:**
- Modify: `stacks-app/components/StackCard.tsx:31-100`

**Step 1: Fix stack viz overlay badge border-radius**

Update line 77 to use `rounded-xl` instead of `rounded`:

```typescript
className="relative flex-shrink-0 w-12 h-16 bg-white/90 rounded-xl flex items-center justify-center"
```

**Step 2: Fix stack overlay badge borders (bottom badges)**

Update lines 31 and 36 to use `border-3`:

```typescript
// Line 31
<div className="bg-black/80 border-3 border-white px-2 py-1">

// Line 36
<div className="bg-black/80 border-3 border-white px-2 py-1">
```

**Step 3: Add border-radius to stack overlay badges**

Update both badge divs (lines 31, 36) to include `rounded-lg`:

```typescript
// Line 31
<div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">

// Line 36
<div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">
```

**Step 4: Fix avatar border thickness**

Update line 54 to use `border-4`:

```typescript
<div className="w-10 h-10 rounded-full bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm" />
```

**Step 5: Verify in browser**

Run: Browser should still be running from Task 1
Navigate to: `http://localhost:3000/home`
Expected: Stack cards have properly rounded overlays and thicker borders on badges

**Step 6: Commit**

```bash
git add stacks-app/components/StackCard.tsx
git commit -m "fix(design): fix StackCard border-radius and border thickness

- Change stack viz overlay from rounded to rounded-xl
- Fix stack badge borders from 2px to 3px
- Add rounded-lg to all badge overlays
- Fix avatar border from 3px to 4px
- Ensures brutalist design system compliance

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Fix SearchBar Component Border Radius

**Files:**
- Modify: `stacks-app/components/SearchBar.tsx:31`

**Step 1: Add border-radius to search input**

Update line 31 to add `rounded-xl`:

```typescript
className="w-full px-4 py-3 pl-12 font-semibold text-base bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal-sm rounded-xl focus:outline-none focus:shadow-brutal transition-all"
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/discover`
Expected: Search bar has rounded corners matching design system

**Step 3: Commit**

```bash
git add stacks-app/components/SearchBar.tsx
git commit -m "fix(design): add border-radius to SearchBar input

- Add rounded-xl to search input
- Matches design system 12px border-radius for inputs

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Fix VibeChips Component Border Radius

**Files:**
- Modify: `stacks-app/components/VibeChips.tsx:26`

**Step 1: Add border-radius to vibe chip buttons**

Update line 26 to add `rounded-xl`:

```typescript
className="px-4 py-2 bg-white dark:bg-dark-secondary border-3 border-black dark:border-white shadow-brutal-sm rounded-xl font-black text-sm uppercase tracking-tight hover:shadow-brutal transition-all whitespace-nowrap"
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/discover`
Expected: Vibe chips have rounded corners

**Step 3: Commit**

```bash
git add stacks-app/components/VibeChips.tsx
git commit -m "fix(design): add border-radius to VibeChips

- Add rounded-xl to vibe chip buttons
- Matches design system badge styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Fix Discover Page Empty State Button

**Files:**
- Modify: `stacks-app/app/discover/page.tsx:51`

**Step 1: Add border-radius to back button**

Update line 51 to add `rounded-xl`:

```typescript
className="px-6 py-3 bg-white text-black border-3 border-black rounded-xl font-black uppercase text-sm shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:3000/discover`
Click any vibe chip to trigger empty state
Expected: "Back to Discover" button has rounded corners

**Step 3: Commit**

```bash
git add stacks-app/app/discover/page.tsx
git commit -m "fix(design): add border-radius to Discover page button

- Add rounded-xl to empty state button
- Ensures all buttons follow design system

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Audit and Fix Stacks Page Border Radius

**Files:**
- Modify: `stacks-app/app/stacks/page.tsx:24,31,36,71,84,88,92,137`

**Step 1: Add border-radius to stack cards in sections**

Update line 24 to add `rounded-xl`:

```typescript
className="w-64 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal rounded-xl flex-shrink-0"
```

**Step 2: Fix stack overlay badge borders**

Update lines 31 and 36 to use `border-3` and add `rounded-lg`:

```typescript
// Line 31
<div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">

// Line 36
<div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">
```

**Step 3: Add border-radius to profile avatar**

Update line 71 to verify it has `rounded-full` (it does) ✓

**Step 4: Add border-radius to stat cards**

Update lines 84, 88, 92 to add `rounded-xl`:

```typescript
// Line 84
<div className="bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">

// Line 88
<div className="bg-gradient-accent border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">

// Line 92
<div className="bg-gradient-success border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">
```

**Step 5: Verify FAB is using rounded-full** (line 137)

Line 137 already has `rounded-full` ✓ (correct per design system)

**Step 6: Verify in browser**

Navigate to: `http://localhost:3000/stacks`
Expected: All cards, badges, and stats have proper rounded corners

**Step 7: Commit**

```bash
git add stacks-app/app/stacks/page.tsx
git commit -m "fix(design): add border-radius to Stacks page elements

- Add rounded-xl to stack cards in horizontal scroll sections
- Add rounded-lg to stack overlay badges
- Fix badge borders from 2px to 3px
- Add rounded-xl to stat cards
- Ensures complete design system compliance on Stacks page

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: Create Design System Utilities in globals.css

**Files:**
- Modify: `stacks-app/app/globals.css:23-43`

**Step 1: Add brutalist input utility class**

Add new utility class after `.btn-brutal` (around line 31):

```css
/* Brutalist input */
.input-brutal {
  @apply w-full px-4 py-3 font-semibold text-base
         bg-white dark:bg-dark-secondary
         border-4 border-black dark:border-white
         rounded-xl shadow-brutal-sm
         focus:outline-none focus:shadow-brutal
         transition-all duration-150;
}
```

**Step 2: Add brutalist badge utility class**

Add after `.input-brutal`:

```css
/* Brutalist badge */
.badge-brutal {
  @apply inline-block px-4 py-2
         font-black text-sm uppercase tracking-tight
         border-3 border-black dark:border-white
         rounded-xl shadow-brutal-sm
         transition-all;
}
```

**Step 3: Add brutalist FAB utility class**

Add after `.badge-brutal`:

```css
/* Floating Action Button */
.fab-brutal {
  @apply w-16 h-16 rounded-full
         border-4 border-black dark:border-white
         shadow-brutal-sm hover:shadow-brutal
         flex items-center justify-center
         transition-all duration-150
         active:translate-x-1 active:translate-y-1;
}
```

**Step 4: Document utilities in comment**

Add comment before new utilities:

```css
/* ===== Brutalist Component Utilities ===== */
/* Use these classes to ensure design system compliance */
```

**Step 5: Verify CSS compiles**

Run: `cd stacks-app && npm run build`
Expected: No CSS compilation errors

**Step 6: Commit**

```bash
git add stacks-app/app/globals.css
git commit -m "feat(design): add brutalist utility classes to globals.css

- Add .input-brutal for standardized input styling
- Add .badge-brutal for badge components
- Add .fab-brutal for floating action buttons
- Ensures consistent design system application

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: Refactor Components to Use New Utility Classes (Optional Enhancement)

**Files:**
- Modify: `stacks-app/components/SearchBar.tsx:31`
- Modify: `stacks-app/components/VibeChips.tsx:26`
- Modify: `stacks-app/app/stacks/page.tsx:137`

**Step 1: Refactor SearchBar to use .input-brutal**

Update line 31:

```typescript
className="input-brutal pl-12"
```

**Step 2: Refactor VibeChips to use .badge-brutal**

Update line 26:

```typescript
className="badge-brutal hover:shadow-brutal whitespace-nowrap"
```

**Step 3: Refactor FAB in Stacks page to use .fab-brutal**

Update line 137:

```typescript
className="fixed bottom-24 right-6 fab-brutal bg-gradient-primary z-50"
```

**Step 4: Verify all pages still render correctly**

Navigate through all pages:
- `/home` ✓
- `/stacks` ✓
- `/discover` ✓
- `/reading` ✓

**Step 5: Commit**

```bash
git add stacks-app/components/SearchBar.tsx stacks-app/components/VibeChips.tsx stacks-app/app/stacks/page.tsx
git commit -m "refactor(design): use utility classes for consistent styling

- Refactor SearchBar to use .input-brutal
- Refactor VibeChips to use .badge-brutal
- Refactor FAB to use .fab-brutal
- Reduces code duplication and ensures consistency

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: Comprehensive Visual Test Across All Pages

**Files:**
- None (testing only)

**Step 1: Test HomePage**

Navigate to: `http://localhost:3000/home`
Verify:
- [ ] Stack cards have 4px borders with shadow
- [ ] All rounded elements use proper border-radius
- [ ] Avatar is circular with 4px border
- [ ] Action buttons are properly sized
- [ ] Bottom nav has gradient active states

**Step 2: Test Stacks Page**

Navigate to: `http://localhost:3000/stacks`
Verify:
- [ ] Profile avatar is circular with 4px border
- [ ] Stat cards have rounded-xl corners
- [ ] Stack cards in horizontal scroll have rounded-xl
- [ ] All badges have 3px borders with rounded-lg
- [ ] FAB is 64px circular with shadow
- [ ] Tab buttons have proper borders

**Step 3: Test Discover Page**

Navigate to: `http://localhost:3000/discover`
Verify:
- [ ] Search bar has rounded-xl corners
- [ ] Vibe chips have rounded-xl corners with 3px borders
- [ ] Book cards have rounded-xl covers
- [ ] Genre badges have rounded-lg with 3px borders
- [ ] Empty state button has rounded-xl

**Step 4: Test Dark Mode**

Toggle dark mode and verify all pages maintain:
- [ ] Border colors invert properly
- [ ] Shadows remain visible
- [ ] Gradients display correctly
- [ ] Text contrast is sufficient

**Step 5: Test Mobile Viewport (390px)**

Use DevTools to test iPhone 12 Pro viewport:
- [ ] All touch targets are minimum 48px
- [ ] Horizontal scrolling works smoothly
- [ ] Bottom nav doesn't overlap content
- [ ] All borders and corners visible

**Step 6: Document any remaining issues**

If issues found, create follow-up tasks in GitHub issues or document in `CLAUDE.md`

**Step 7: Verify build succeeds**

Run: `cd stacks-app && npm run build`
Expected: Clean build with no TypeScript or build errors

**Step 8: Create summary comment (no commit)**

Document testing results for project records.

---

## Task 10: Update Design System Compliance Checklist in CLAUDE.md

**Files:**
- Modify: `/Users/wallymo/stacks/CLAUDE.md:84-98`

**Step 1: Update checklist with explicit border-radius requirements**

Add to the "Design System Compliance Checklist" section:

```markdown
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
```

**Step 2: Add note about utility classes**

Add new section after checklist:

```markdown
### Design System Utility Classes

Use these classes from `app/globals.css` for consistency:
- `.btn-brutal` - Standard buttons with shadow and borders
- `.input-brutal` - Input fields with proper styling
- `.badge-brutal` - Badge/chip components
- `.fab-brutal` - Floating action buttons
- `.card-brutal` - Card containers with borders and shadows
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update design system compliance checklist

- Add explicit border-radius requirements for all element types
- Add utility class reference section
- Ensures future development maintains design system compliance

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Success Criteria

✅ All components use proper border-radius:
- Cards: `rounded-xl` or `rounded-2xl`
- Inputs/Buttons: `rounded-xl`
- Badges: `rounded-xl` or `rounded-lg`
- Circular elements: `rounded-full`

✅ All borders use correct thickness:
- Cards/Inputs: `border-4`
- Badges: `border-3`

✅ All interactive elements have:
- Proper shadows (`shadow-brutal-sm` or `shadow-brutal`)
- Hover states with increased shadow
- Minimum 48px touch targets

✅ Design system matches reference HTML:
- Components visually match `design_system/atomic_design_system_with_mobile.html`
- No regressions in existing functionality

✅ Documentation updated:
- `CLAUDE.md` has complete compliance checklist
- Utility classes documented

✅ Production build succeeds:
- No TypeScript errors
- No CSS compilation errors
- All pages render correctly

---

## Notes

- **Rounded corners were the primary violation** - most components were completely missing `border-radius` classes
- **Border thickness** was inconsistent (mixing `border-2` and `border-3` for badges)
- The design system uses **12px (rounded-xl)** as the standard for most interactive elements
- **Circular elements** (avatars, FAB) correctly use `rounded-full`
- All fixes maintain backward compatibility with dark mode
- Utility classes created to prevent future violations and reduce code duplication

## Related Skills

- @superpowers:verification-before-completion - Use before marking tasks complete
- @superpowers:test-driven-development - If adding new components
- @superpowers:systematic-debugging - If visual regressions occur

---

**Implementation Estimate:** ~2-3 hours
**Priority:** HIGH (visual consistency is critical for Gen Z audience)
**Dependencies:** None (all changes are CSS/styling only)
