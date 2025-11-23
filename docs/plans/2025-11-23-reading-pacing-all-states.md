# Reading Pacing All States Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update mock reading data to showcase all 4 pacing states (AHEAD, ON TRACK, SLIGHTLY BEHIND, BEHIND) in the reading pacing UI at http://0.0.0.0:4000/reading

**Architecture:** Modify existing mock data dates in `lib/mockData.ts` to create realistic reading scenarios that trigger each of the 4 pacing states based on the current date (Nov 23, 2025)

**Tech Stack:** TypeScript, Next.js 15, Mock Data

---

## Background: Pacing State Logic

The pacing state is calculated based on `deltaPct = actualProgress% - idealProgress%`:

| State | Condition | Badge Text | Badge Color | Bar Color |
|-------|-----------|-----------|-------------|-----------|
| **AHEAD** | `deltaPct > 5%` | `🔥 AHEAD BY X PAGES` | Green | `bg-emerald-600` |
| **ON TRACK** | `-2% ≤ deltaPct ≤ 5%` | `✓ ON TRACK` | Sky Blue | `bg-sky-600` |
| **SLIGHTLY BEHIND** | `-5% < deltaPct < -2%` | `⚠️ SLIGHTLY BEHIND` | Yellow | `bg-yellow-500` |
| **BEHIND** | `deltaPct < -5%` | `BEHIND: +X PAGES` | Amber | `bg-amber-600` |

**Current Date:** November 23, 2025

**Ideal Progress Formula:**
```
elapsed_days = today - start_date
total_days = target_date - start_date
ideal_pct = (elapsed_days / total_days) * 100
actual_pct = (current_page / total_pages) * 100
delta_pct = actual_pct - ideal_pct
```

---

## Task 1: Update Fourth Wing (rp-2) to Show SLIGHTLY BEHIND

**Goal:** Make Fourth Wing show "⚠️ SLIGHTLY BEHIND" status

**Files:**
- Modify: `lib/mockData.ts` (lines 625-646, rp-2)

**Current State:**
- Book: Fourth Wing (498 pages)
- Start: 2024-10-20 (OLD - causes massive behind)
- Current: 194 pages (39%)
- Target: 2025-12-01

**Step 1: Calculate dates for SLIGHTLY BEHIND (-3% delta)**

Target delta: `-3%` (between -5% and -2%)

Scenario:
- Start: Nov 1, 2025 (22 days ago)
- Target: Dec 15, 2025 (44 total days, 22 remaining)
- Ideal at day 22: 50% (249 pages)
- Actual: 47% (234 pages)
- Delta: -3% → SLIGHTLY BEHIND ✓

**Step 2: Update rp-2 dates and progress**

In `lib/mockData.ts`, find the Fourth Wing entry (id: "rp-2") and replace:

```typescript
// Fourth Wing - Currently reading - SLIGHTLY BEHIND (-3% delta)
{
  id: "rp-2",
  bookId: "book-1",
  userId: "user-1",
  startDate: new Date("2025-11-01"),
  finishedDate: null,
  currentPage: 234, // 47% - slightly behind ideal of 50%
  totalPages: 498,
  status: "reading",
  dailyCheckIns: [
    { date: new Date("2025-11-01"), pagesRead: 25, timeOfDay: "night" },
    { date: new Date("2025-11-02"), pagesRead: 22, timeOfDay: "evening" },
    { date: new Date("2025-11-03"), pagesRead: 20, timeOfDay: "night" },
    { date: new Date("2025-11-05"), pagesRead: 18, timeOfDay: "afternoon" },
    { date: new Date("2025-11-07"), pagesRead: 23, timeOfDay: "night" },
    { date: new Date("2025-11-09"), pagesRead: 21, timeOfDay: "evening" },
    { date: new Date("2025-11-11"), pagesRead: 19, timeOfDay: "night" },
    { date: new Date("2025-11-13"), pagesRead: 17, timeOfDay: "afternoon" },
    { date: new Date("2025-11-15"), pagesRead: 20, timeOfDay: "night" },
    { date: new Date("2025-11-17"), pagesRead: 16, timeOfDay: "evening" },
    { date: new Date("2025-11-19"), pagesRead: 18, timeOfDay: "night" },
    { date: new Date("2025-11-21"), pagesRead: 15, timeOfDay: "afternoon" },
  ],
  _targetDate: new Date("2025-12-15"),
} as any,
```

**Step 3: Verify calculation**

Run in browser console or Node:
```javascript
const start = new Date("2025-11-01");
const today = new Date("2025-11-23");
const target = new Date("2025-12-15");
const elapsed = Math.ceil((today - start) / (1000*60*60*24)); // 22 days
const total = Math.ceil((target - start) / (1000*60*60*24)); // 44 days
const ideal = (elapsed / total) * 100; // 50%
const actual = (234 / 498) * 100; // 47%
const delta = actual - ideal; // -3%
console.log({ elapsed, total, ideal, actual, delta }); // Should show ~-3%
```

Expected: `delta: -3.0` (SLIGHTLY BEHIND range)

---

## Task 2: Update It Ends With Us (rp-8) to Show BEHIND

**Goal:** Make It Ends With Us show "BEHIND: +X PAGES" status

**Files:**
- Modify: `lib/mockData.ts` (lines 647-667, rp-8)

**Step 1: Calculate dates for BEHIND (-8% delta)**

Target delta: `-8%` (less than -5%)

Scenario:
- Start: Nov 5, 2025 (18 days ago)
- Target: Dec 20, 2025 (45 total days, 27 remaining)
- Ideal at day 18: 40% (154 pages)
- Actual: 32% (123 pages)
- Delta: -8% → BEHIND ✓

**Step 2: Update rp-8 dates and progress**

```typescript
// It Ends With Us - BEHIND (-8% delta)
{
  id: "rp-8",
  bookId: "book-5",
  userId: "user-1",
  startDate: new Date("2025-11-05"),
  finishedDate: null,
  currentPage: 123, // 32% - behind ideal of 40%
  totalPages: 384,
  status: "reading",
  dailyCheckIns: [
    { date: new Date("2025-11-05"), pagesRead: 15, timeOfDay: "morning" },
    { date: new Date("2025-11-06"), pagesRead: 12, timeOfDay: "afternoon" },
    { date: new Date("2025-11-08"), pagesRead: 14, timeOfDay: "night" },
    { date: new Date("2025-11-10"), pagesRead: 11, timeOfDay: "evening" },
    { date: new Date("2025-11-12"), pagesRead: 13, timeOfDay: "afternoon" },
    { date: new Date("2025-11-14"), pagesRead: 10, timeOfDay: "night" },
    { date: new Date("2025-11-16"), pagesRead: 12, timeOfDay: "morning" },
    { date: new Date("2025-11-18"), pagesRead: 9, timeOfDay: "evening" },
    { date: new Date("2025-11-20"), pagesRead: 14, timeOfDay: "night" },
    { date: new Date("2025-11-22"), pagesRead: 13, timeOfDay: "afternoon" },
  ],
  _targetDate: new Date("2025-12-20"),
} as any,
```

**Step 3: Verify calculation**

```javascript
const start = new Date("2025-11-05");
const today = new Date("2025-11-23");
const target = new Date("2025-12-20");
const elapsed = 18;
const total = 45;
const ideal = (elapsed / total) * 100; // 40%
const actual = (123 / 384) * 100; // 32%
const delta = actual - ideal; // -8%
console.log({ ideal, actual, delta }); // Should show ~-8%
```

Expected: `delta: -8.0` (BEHIND range)

---

## Task 3: Update A Court of Thorns and Roses (rp-4) to Show ON TRACK

**Goal:** Make ACOTAR show "✓ ON TRACK" status

**Files:**
- Modify: `lib/mockData.ts` (lines 691-721, rp-4)

**Step 1: Calculate dates for ON TRACK (+1% delta)**

Target delta: `+1%` (between -2% and +5%)

Scenario:
- Start: Nov 8, 2025 (15 days ago)
- Target: Dec 8, 2025 (30 total days, 15 remaining)
- Ideal at day 15: 50% (210 pages)
- Actual: 51% (214 pages)
- Delta: +1% → ON TRACK ✓

**Step 2: Update rp-4 dates and progress**

```typescript
// A Court of Thorns and Roses - ON TRACK (+1% delta)
{
  id: "rp-4",
  bookId: "book-2",
  userId: "user-1",
  startDate: new Date("2025-11-08"),
  finishedDate: null,
  currentPage: 214, // 51% - on track with ideal of 50%
  totalPages: 419,
  status: "reading",
  dailyCheckIns: [
    { date: new Date("2025-11-08"), pagesRead: 18, timeOfDay: "night" },
    { date: new Date("2025-11-09"), pagesRead: 16, timeOfDay: "evening" },
    { date: new Date("2025-11-10"), pagesRead: 14, timeOfDay: "night" },
    { date: new Date("2025-11-11"), pagesRead: 15, timeOfDay: "afternoon" },
    { date: new Date("2025-11-12"), pagesRead: 13, timeOfDay: "night" },
    { date: new Date("2025-11-13"), pagesRead: 17, timeOfDay: "evening" },
    { date: new Date("2025-11-14"), pagesRead: 12, timeOfDay: "night" },
    { date: new Date("2025-11-15"), pagesRead: 16, timeOfDay: "afternoon" },
    { date: new Date("2025-11-16"), pagesRead: 14, timeOfDay: "night" },
    { date: new Date("2025-11-18"), pagesRead: 15, timeOfDay: "evening" },
    { date: new Date("2025-11-19"), pagesRead: 13, timeOfDay: "night" },
    { date: new Date("2025-11-20"), pagesRead: 17, timeOfDay: "afternoon" },
    { date: new Date("2025-11-21"), pagesRead: 16, timeOfDay: "night" },
    { date: new Date("2025-11-22"), pagesRead: 14, timeOfDay: "evening" },
    { date: new Date("2025-11-23"), pagesRead: 14, timeOfDay: "morning" },
  ],
  _targetDate: new Date("2025-12-08"),
} as any,
```

**Step 3: Verify calculation**

```javascript
const start = new Date("2025-11-08");
const today = new Date("2025-11-23");
const target = new Date("2025-12-08");
const elapsed = 15;
const total = 30;
const ideal = (elapsed / total) * 100; // 50%
const actual = (214 / 419) * 100; // 51%
const delta = actual - ideal; // +1%
console.log({ ideal, actual, delta }); // Should show ~+1%
```

Expected: `delta: +1.0` (ON TRACK range)

---

## Task 4: Update The Atlas Six (rp-11) to Show AHEAD

**Goal:** Make The Atlas Six show "🔥 AHEAD BY X PAGES" status

**Files:**
- Modify: `lib/mockData.ts` (lines 844-862, rp-11)

**Step 1: Calculate dates for AHEAD (+10% delta)**

Target delta: `+10%` (greater than +5%)

Scenario:
- Start: Nov 18, 2025 (5 days ago)
- Target: Dec 31, 2025 (43 total days, 38 remaining)
- Ideal at day 5: 12% (45 pages)
- Actual: 22% (82 pages)
- Delta: +10% → AHEAD ✓

**Step 2: Update rp-11 dates and progress**

```typescript
// The Atlas Six - Reading ahead of schedule! (+10% delta)
{
  id: "rp-11",
  bookId: "book-11",
  userId: "user-1",
  startDate: new Date("2025-11-18"),
  finishedDate: null,
  currentPage: 82, // 22% - ahead of ideal 12%
  totalPages: 373,
  status: "reading",
  dailyCheckIns: [
    { date: new Date("2025-11-18"), pagesRead: 20, timeOfDay: "night" },
    { date: new Date("2025-11-19"), pagesRead: 18, timeOfDay: "evening" },
    { date: new Date("2025-11-20"), pagesRead: 16, timeOfDay: "night" },
    { date: new Date("2025-11-21"), pagesRead: 15, timeOfDay: "afternoon" },
    { date: new Date("2025-11-22"), pagesRead: 13, timeOfDay: "night" },
  ],
  _targetDate: new Date("2025-12-31"), // Long target for ahead status
} as any,
```

**Step 3: Verify calculation**

```javascript
const start = new Date("2025-11-18");
const today = new Date("2025-11-23");
const target = new Date("2025-12-31");
const elapsed = 5;
const total = 43;
const ideal = (elapsed / total) * 100; // 12%
const actual = (82 / 373) * 100; // 22%
const delta = actual - ideal; // +10%
console.log({ ideal, actual, delta }); // Should show ~+10%
```

Expected: `delta: +10.0` (AHEAD range)

---

## Task 5: Remove Debug Logging

**Goal:** Clean up debug console.log statements added during development

**Files:**
- Modify: `app/reading/components/ReadingPacingSection.tsx` (lines 12-13)

**Step 1: Remove debug logging**

Find and remove these lines:

```typescript
// REMOVE THESE LINES:
console.log('[DEBUG] Reading books found:', base.length);
base.forEach(b => console.log(`- ${b.id}: book-${b.bookId}`));
```

**Step 2: Verify file compiles**

Run: `npx tsc --noEmit lib/mockData.ts app/reading/components/ReadingPacingSection.tsx`

Expected: No TypeScript errors

---

## Task 6: Test All 4 States in Browser

**Goal:** Manually verify all 4 pacing states are visible

**Step 1: Start dev server**

Run: `npm run dev`

Expected: Server starts on http://0.0.0.0:4000

**Step 2: Navigate to reading page**

Open: http://0.0.0.0:4000/reading

**Step 3: Verify all 4 states visible**

Check for these badges in the Pacing section:

✓ **Fourth Wing**: "⚠️ SLIGHTLY BEHIND" with yellow badge
✓ **It Ends With Us**: "BEHIND: +X PAGES" with amber/orange badge
✓ **A Court of Thorns and Roses**: "✓ ON TRACK" with sky blue badge
✓ **The Atlas Six**: "🔥 AHEAD BY X PAGES" with green/emerald badge

**Step 4: Verify progress bar colors match**

Each book's progress bar should match its badge:
- Fourth Wing: Yellow bar
- It Ends With Us: Amber bar
- ACOTAR: Sky blue bar
- The Atlas Six: Emerald green bar

**Step 5: Check daily goals display**

Each card should show:
- Target date (formatted)
- Daily goal in pages (when target is set)

---

## Task 7: Write Playwright Test for All States

**Goal:** Create automated test to verify all 4 states appear

**Files:**
- Create: `tests/reading-pacing-all-states.spec.ts`

**Step 1: Write test file**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Reading Pacing - All 4 States', () => {
  test('should display all 4 pacing states', async ({ page }) => {
    await page.goto('/reading');
    await page.waitForLoadState('networkidle');

    // Get all status badges
    const badges = await page.locator('.card-brutal .inline-block').filter({
      hasText: /TRACK|BEHIND|AHEAD/
    }).allTextContents();

    console.log('Status badges found:', badges);

    // Verify we have 4 badges
    expect(badges).toHaveLength(4);

    // Verify each state type appears
    const hasAhead = badges.some(text => text.includes('AHEAD'));
    const hasOnTrack = badges.some(text => text.includes('ON TRACK'));
    const hasSlightlyBehind = badges.some(text => text.includes('SLIGHTLY BEHIND'));
    const hasBehind = badges.some(text =>
      text.includes('BEHIND') && !text.includes('SLIGHTLY')
    );

    expect(hasAhead).toBeTruthy();
    expect(hasOnTrack).toBeTruthy();
    expect(hasSlightlyBehind).toBeTruthy();
    expect(hasBehind).toBeTruthy();
  });

  test('should show correct badge colors for each state', async ({ page }) => {
    await page.goto('/reading');
    await page.waitForLoadState('networkidle');

    // The Atlas Six - AHEAD (green/emerald)
    const atlasCard = page.locator('.card-brutal').filter({
      hasText: 'The Atlas Six'
    });
    const atlasBadge = atlasCard.locator('.inline-block').first();
    await expect(atlasBadge).toHaveClass(/bg-emerald/);

    // It Ends With Us - BEHIND (amber)
    const itEndsCard = page.locator('.card-brutal').filter({
      hasText: 'It Ends With Us'
    });
    const itEndsBadge = itEndsCard.locator('.inline-block').first();
    await expect(itEndsBadge).toHaveClass(/bg-amber/);

    // Fourth Wing - SLIGHTLY BEHIND (yellow)
    const fourthCard = page.locator('.card-brutal').filter({
      hasText: 'Fourth Wing'
    });
    const fourthBadge = fourthCard.locator('.inline-block').first();
    await expect(fourthBadge).toHaveClass(/bg-yellow/);

    // ACOTAR - ON TRACK (sky blue)
    const acotarCard = page.locator('.card-brutal').filter({
      hasText: 'A Court of Thorns and Roses'
    });
    const acotarBadge = acotarCard.locator('.inline-block').first();
    await expect(acotarBadge).toHaveClass(/bg-sky/);
  });
});
```

**Step 2: Run Playwright test**

Run: `npx playwright test tests/reading-pacing-all-states.spec.ts --project=chromium --reporter=list`

Expected: All tests pass

---

## Task 8: Commit Changes

**Goal:** Commit the completed implementation

**Step 1: Stage files**

```bash
git add lib/mockData.ts
git add app/reading/components/ReadingPacingSection.tsx
git add tests/reading-pacing-all-states.spec.ts
```

**Step 2: Commit with descriptive message**

```bash
git commit -m "feat: add all 4 pacing states to reading tracker

- Update mock data dates to 2025 for realistic scenarios
- Fourth Wing: SLIGHTLY BEHIND (-3% delta)
- It Ends With Us: BEHIND (-8% delta)
- ACOTAR: ON TRACK (+1% delta)
- The Atlas Six: AHEAD (+10% delta)
- Remove debug logging from ReadingPacingSection
- Add Playwright tests for all 4 states

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Acceptance Criteria

✅ All 4 books appear in /reading pacing section
✅ Each book shows a different pacing state:
  - 🔥 AHEAD (green badge, emerald progress bar)
  - ✓ ON TRACK (sky blue badge, sky blue progress bar)
  - ⚠️ SLIGHTLY BEHIND (yellow badge, yellow progress bar)
  - BEHIND: +X PAGES (amber badge, amber progress bar)
✅ Target dates and daily goals display correctly
✅ Progress bars match badge colors
✅ Playwright tests pass
✅ No TypeScript errors
✅ No console errors in browser
✅ Debug logging removed from production code

---

## Testing Checklist

- [ ] Dev server starts without errors
- [ ] Navigate to http://0.0.0.0:4000/reading
- [ ] See 4 books in pacing section
- [ ] Fourth Wing shows yellow "SLIGHTLY BEHIND" badge
- [ ] It Ends With Us shows amber "BEHIND: +X PAGES" badge
- [ ] ACOTAR shows sky blue "ON TRACK" badge
- [ ] The Atlas Six shows green "AHEAD BY X PAGES" badge
- [ ] Progress bars have matching colors
- [ ] Target dates display correctly
- [ ] Daily goals show when target is set
- [ ] Playwright tests pass
- [ ] No console errors

---

## Notes

- All dates are set relative to Nov 23, 2025
- Delta percentages are carefully calculated to fall within each state's range
- Check-ins are distributed realistically across the reading period
- Target dates are chosen to create the desired delta while being realistic
- If today's date changes significantly, dates may need adjustment
