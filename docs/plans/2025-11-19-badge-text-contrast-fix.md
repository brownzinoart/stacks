# Badge Text Contrast Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix text visibility on teal and yellow badge/button elements by adding explicit text color classes per design system specification.

**Architecture:** Add `text-light-text dark:text-dark-text` classes to 4 inline badge/button implementations that currently bypass the Badge/Button component system. This ensures WCAG AA contrast compliance and matches existing component patterns.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Next.js 15

**Design Document:** `docs/plans/2025-11-19-badge-text-contrast-fix-design.md`

---

## Task 1: Fix Book Detail Page Badges

**Files:**
- Modify: `app/discover/book/[id]/page.tsx:134,154,244`

**Context:** The book detail overlay has three elements with teal/yellow backgrounds missing text color declarations. These are inline implementations that bypass the Badge/Button components.

### Step 1: Fix NYT Bestseller badge (line 134)

**Current code (line 134):**
```tsx
<div className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
```

**Updated code:**
```tsx
<div className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow text-light-text dark:text-dark-text border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
```

**Action:**
1. Open `app/discover/book/[id]/page.tsx`
2. Navigate to line 134
3. Add `text-light-text dark:text-dark-text` after `bg-accent-yellow`
4. Save file

### Step 2: Fix reader tags (line 154)

**Current code (line 154):**
```tsx
className="px-3.5 py-1.5 bg-accent-teal border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
```

**Updated code:**
```tsx
className="px-3.5 py-1.5 bg-accent-teal text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
```

**Action:**
1. Navigate to line 154 in same file
2. Add `text-light-text dark:text-dark-text` after `bg-accent-teal`
3. Save file

### Step 3: Fix Bookshop.org button (line 244)

**Current code (line 244):**
```tsx
className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Updated code:**
```tsx
className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal text-light-text dark:text-dark-text border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Action:**
1. Navigate to line 244 in same file
2. Add `text-light-text dark:text-dark-text` after `bg-accent-teal`
3. Save file

### Step 4: Commit book detail page fixes

```bash
git add app/discover/book/[id]/page.tsx
git commit -m "fix: add text colors to teal/yellow badges on book detail page

- NYT Bestseller badge now uses dark text on yellow background
- Reader tags now use dark text on teal background
- Bookshop button now uses dark text on teal background
- Ensures WCAG AA contrast compliance per design system spec"
```

---

## Task 2: Fix Discover Results Page Randomize Button

**Files:**
- Modify: `app/discover/results/page.tsx:165`

**Context:** The randomize button (🎲 emoji) uses yellow background without text color declaration.

### Step 1: Fix randomize button (line 165)

**Current code (line 165):**
```tsx
className="px-4 py-3 bg-accent-yellow border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Updated code:**
```tsx
className="px-4 py-3 bg-accent-yellow text-light-text dark:text-dark-text border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
```

**Action:**
1. Open `app/discover/results/page.tsx`
2. Navigate to line 165
3. Add `text-light-text dark:text-dark-text` after `bg-accent-yellow`
4. Save file

### Step 2: Commit discover results page fix

```bash
git add app/discover/results/page.tsx
git commit -m "fix: add text color to randomize button on discover results

- Randomize button now uses dark text on yellow background
- Ensures WCAG AA contrast compliance per design system spec"
```

---

## Task 3: Visual Verification Testing

**Files:**
- Test manually in browser (no automated test file for this visual fix)

**Context:** This is a visual fix requiring manual verification in both light and dark modes. The app uses iPhone 12 Pro viewport (390px) as primary mobile target.

### Step 1: Start development server

```bash
npm run dev
```

Expected: Server starts on `http://localhost:4000`

### Step 2: Test book detail overlay (light mode)

**Actions:**
1. Navigate to `http://localhost:4000/discover`
2. Search for any book or click a book from results
3. Book detail overlay should appear
4. Verify NYT Bestseller badge (yellow) has dark, readable text
5. Scroll to "Readers loved:" section
6. Verify reader tags (teal) have dark, readable text
7. Scroll to "Get This Book" section
8. Verify "Buy on Bookshop.org" button (teal) has dark, readable text

**Expected:** All three elements have clearly visible dark text with good contrast

### Step 3: Test book detail overlay (dark mode)

**Actions:**
1. Toggle dark mode (if app has dark mode toggle, or use browser DevTools)
2. Verify same three elements now have white text on teal/yellow backgrounds
3. Confirm text is clearly visible

**Expected:** All three elements have white text in dark mode

### Step 4: Test discover results randomize button (light mode)

**Actions:**
1. Navigate to `http://localhost:4000/discover/results` (or perform a search)
2. Locate the 🎲 randomize button (yellow background)
3. Verify button has dark, readable text/emoji

**Expected:** Button content is clearly visible

### Step 5: Test discover results randomize button (dark mode)

**Actions:**
1. Toggle dark mode
2. Verify randomize button now has white text/emoji

**Expected:** Button content is white and clearly visible

### Step 6: Mobile viewport testing

**Actions:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (responsive design mode)
3. Set viewport to 390px width (iPhone 12 Pro)
4. Repeat all visual tests from Steps 2-5
5. Verify text is readable at mobile viewport size

**Expected:** All elements remain readable at 390px viewport

### Step 7: Document verification completion

Create a simple verification checklist in the commit message:

```bash
git add .
git commit -m "test: verify badge text contrast fixes across viewports

Verified fixes on:
✓ Book detail - NYT Bestseller badge (light + dark mode)
✓ Book detail - Reader tags (light + dark mode)
✓ Book detail - Bookshop button (light + dark mode)
✓ Discover results - Randomize button (light + dark mode)
✓ Mobile viewport (390px iPhone 12 Pro)
✓ Desktop viewport (max-w-lg container)

All text now meets WCAG AA contrast requirements."
```

---

## Verification Checklist

Before considering this complete, verify:

- [ ] NYT Bestseller badge readable in light mode
- [ ] NYT Bestseller badge readable in dark mode
- [ ] Reader tags readable in light mode
- [ ] Reader tags readable in dark mode
- [ ] Bookshop button readable in light mode
- [ ] Bookshop button readable in dark mode
- [ ] Randomize button readable in light mode
- [ ] Randomize button readable in dark mode
- [ ] All elements tested at 390px mobile viewport
- [ ] All elements tested at desktop max-w-lg container
- [ ] No visual regressions on other pages

---

## Design System Compliance

**Colors Used:**
- `text-light-text` = `#383838` (from `tailwind.config.ts:18`)
- `text-dark-text` = `#ffffff` (from `tailwind.config.ts:29`)

**Matches Existing Components:**
- `Badge.tsx:24,26` - Same text color pattern for teal/yellow
- `Button.tsx:28,30` - Same text color pattern for teal/yellow

**Design System Reference:**
- `design_system/v2.0_refined_design_system.html:440,442`
- `.badge-secondary` and `.badge-success` use `color: var(--text-primary)`

---

## Notes for Engineer

**Why this matters:**
- Teal (#53DBC9) and yellow (#EAC435) are light backgrounds
- Without explicit text color, they inherit parent text (often black on white)
- This creates ~2:1 contrast ratio (fails WCAG AA requirement of 4.5:1)
- Adding dark text (#383838) achieves 4.5:1+ contrast

**Why not use Badge/Button components:**
- These are legacy inline implementations
- Refactoring to components would be a larger change
- This fix is minimal, safe, and design-system-compliant
- Future work: Consider refactoring to use Badge/Button components

**Testing approach:**
- No automated visual regression tests exist yet
- Manual verification is appropriate for this visual fix
- Focus on light/dark mode + mobile/desktop viewports
- Future: Consider adding Playwright visual tests

**DRY principle:**
- Same text color pattern used 4 times
- Consider creating utility class `.badge-light-bg` if pattern repeats more
- For now, inline is acceptable (only 4 instances)

**YAGNI principle:**
- Don't refactor to components unless explicitly requested
- Don't create automated tests unless explicitly requested
- Just fix the immediate visibility issue
