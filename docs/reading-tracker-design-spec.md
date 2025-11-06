# Reading Tracker - Design Specification

**Date:** 2025-11-06
**Status:** Design Complete - Ready for Implementation
**Prototype:** `stacks-app/design_system/reading-tracker-prototype.html`

---

## Overview

The Reading Tracker is a daily progress tracker for books currently being read. It gamifies reading through goal-setting, streak tracking, and relatable time comparisons (e.g., "reading X pages = watching 1 episode of Stranger Things").

**Key Goals:**
- Make reading progress tangible and motivating
- Provide daily check-in ritual with low friction
- Compare reading time to other activities (TV, social media)
- Celebrate completions and improve match recommendations
- Maintain brutalist design aesthetic

---

## Page Structure: `/reading`

### Layout Sections

1. **Currently Reading** (top)
   - Full-width progress cards
   - One card per in-progress book
   - Interactive check-in widgets

2. **Finished This Month** (below)
   - Compact list view
   - Shows completion stats and ratings
   - Tap to expand for details

---

## Reading Progress Card - Full Specification

### Visual Hierarchy

```
┌────────────────────────────────────────────┐
│ [64×96px]  THE CRUEL PRINCE                │
│  Book      Holly Black                      │
│  Cover                                      │
│            ━━━━━━━━━━░░░░░░░░░░ 52%       │
│            194 / 370 pages                  │
│                                             │
│  ┌────────────────────────────────┐        │
│  │ 🔥 AHEAD BY 3 DAYS             │        │
│  └────────────────────────────────┘        │
│                                             │
│  🎯 Target: Nov 30, 2024                   │
│  📊 Daily Goal: 12 pages/day               │
│  ⚡ Current Streak: 7 days                 │
│                                             │
│  💡 TODAY'S VIBE CHECK:                     │
│  That's like watching 1 episode of          │
│  Stranger Things instead of scrolling       │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Today: [20] pages  +10  +25  +50    │  │
│  │ [LOG IT] button                      │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Book Header
- **Book Cover:** 64×96px (mobile), gradient fallback if no image
- **Title:** font-black, uppercase, 18px (mobile)
- **Author:** font-semibold, gray-600, 14px

#### 2. Progress Bar
- **Container:** 20px height, 4px black border, rounded-xl
- **Fill:** Linear gradient (green-cyan for ahead, orange for behind)
- **Percentage:** Positioned absolute right, font-black
- **Text Below:** "X / Y pages" in gray

#### 3. Pace Badge (Brutalist Style)
- **Border:** 4px black, rounded-xl
- **Shadow:** 4px 4px 0 0 black
- **Padding:** 12px 20px
- **Font:** font-black, uppercase, 14px, white text

**Badge States:**
- `AHEAD BY X DAYS` - bg-[#10b981] (green)
- `ON TRACK ✓` - bg-[#f59e0b] (orange)
- `BEHIND: +X PAGES` - bg-[#ef4444] (red)
- `CRUSHING IT 🔥` - gradient-primary (7+ days ahead)

#### 4. Goal Stats Section
- **Container:** bg-gray-50, 3px border, rounded-xl, padding 16px
- **Layout:** Vertical stack with 8px gap
- **Each Stat:** Icon (16px) + Label + Bold Value

**Stats Displayed:**
1. 🎯 Target finish date (editable on tap)
2. 📊 Daily pages needed to hit goal
3. ⚡ Current check-in streak

#### 5. Time Comparison Box
- **Container:** bg-yellow-100, 3px border-yellow-500, rounded-xl
- **Title:** "💡 TODAY'S VIBE CHECK:" (12px, uppercase, brown-700)
- **Text:** 14px, font-semibold, 1.4 line-height

**Comparison Types** (rotate daily based on day % 4):
- **Day 0:** TV episodes - "watching X episodes of The Office"
- **Day 1:** Social media - "X mins less TikTok scrolling"
- **Day 2:** Music - "listening to X albums"
- **Day 3:** Activities - "your morning commute" / "one coffee run"

**Calculation:**
```typescript
const dailyReadingMinutes = (pagesPerDay * 250 words/page) / (250 words/min);
// Then map to comparison based on minutes
```

#### 6. Check-In Widget
- **Container:** bg-blue-100, 4px border-blue-600, rounded-xl, shadow
- **Title:** "TODAY'S CHECK-IN:" (14px, uppercase, font-black)
- **Input:** Number input, 4px border, rounded-lg, text-center
- **Quick Buttons:** +10, +25, +50 (brutalist button style)
- **Log Button:** Full-width, blue-600, 4px border, font-black

---

## Finished Books Section

### Compact Card Design

```
┌────────────────────────────────────┐
│ FINISHED THIS MONTH (3)            │
│                                    │
│ ✓ Six of Crows                     │
│   Finished 11/15 • 465 pages       │
│   ⭐ ❤️ • 10-day streak            │
└────────────────────────────────────┘
```

**Card Structure:**
- **Checkmark Icon:** 40×40px circle, green bg, 3px border
- **Title:** 16px, font-black, uppercase
- **Meta:** 12px, font-semibold, gray-600
  - Format: "Finished MM/DD • XXX pages • X-day streak"
- **Rating Emoji:** 16px (❤️/😊/😐)

---

## Celebration Modal (Book Completion)

### Modal Trigger
When user's progress reaches 100% and they log their final pages.

### Modal Content

```
┌────────────────────────────────┐
│         🎉 BOOK DONE! 🎉        │
│                                 │
│  You finished THE CRUEL PRINCE  │
│  in 12 days!                    │
│                                 │
│  Quick Stats:                   │
│  • 370 pages read               │
│  • 8-day streak                 │
│  • Finished 3 days early!       │
│                                 │
│  ⭐ Rate it (for better recs):  │
│  ❤️ LOVED  😊 LIKED  😐 MEH    │
│                                 │
│  [SHARE TO FEED]                │
│  [ADD TO STACK]                 │
│  [SKIP]                         │
└────────────────────────────────┘
```

**Elements:**
- **Title:** 32px, font-black, uppercase
- **Emoji:** 48px confetti
- **Book Title:** 20px, font-black
- **Days:** 16px, gray-600
- **Stats Box:** bg-gray-50, 3px border, left-aligned list
- **Rating Buttons:** 24px emoji, 3px border, selectable
- **Action Buttons:** Full-width, stacked, brutalist style

**Rating Impact:**
- ❤️ LOVED → Boost similar books in discovery feed
- 😊 LIKED → Minor boost to genre preferences
- 😐 MEH → Reduce similar recommendations

**Button Actions:**
1. **Share to Feed:** Pre-fills post caption, adds book to new/existing stack
2. **Add to Stack:** Opens stack selector/creator
3. **Skip:** Closes modal, moves book to finished section

---

## Data Model

### Extended ReadingProgress Interface

```typescript
interface ReadingProgress {
  id: string;
  bookId: string;
  startDate: string;
  targetDate: string;           // NEW: User-set finish date
  endDate?: string;             // Set when completed
  currentPage: number;
  totalPages: number;
  status: "reading" | "finished" | "abandoned";
  dailyCheckIns: CheckIn[];     // NEW: Track daily logs
  streak: number;               // NEW: Consecutive days checked in
  rating?: "loved" | "liked" | "meh";  // NEW: Post-completion rating
}

interface CheckIn {
  date: string;                 // ISO date string
  pagesRead: number;
  timestamp: string;            // Full timestamp for ordering
}
```

### Calculations

**Daily Pages Needed:**
```typescript
const daysRemaining = Math.ceil(
  (new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)
);
const pagesRemaining = totalPages - currentPage;
const dailyGoal = Math.ceil(pagesRemaining / daysRemaining);
```

**Pace Status:**
```typescript
const expectedProgress = (daysSinceStart / totalDays) * totalPages;
const actualProgress = currentPage;
const daysDifference = (actualProgress - expectedProgress) / dailyGoal;

if (daysDifference >= 7) return "crushing";
else if (daysDifference >= 1) return "ahead";
else if (daysDifference >= -1) return "on-track";
else return "behind";
```

**Streak Calculation:**
```typescript
// Count consecutive days with check-ins (most recent first)
let streak = 0;
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Check if user checked in today or yesterday (forgiveness window)
const lastCheckIn = dailyCheckIns[dailyCheckIns.length - 1]?.date;
if (lastCheckIn === today || lastCheckIn === yesterday) {
  // Count consecutive days backwards
  for (let i = dailyCheckIns.length - 1; i >= 0; i--) {
    // Logic to count consecutive days
  }
}
```

---

## User Flows

### Flow 1: Daily Check-In

1. User opens `/reading` page
2. Sees current reading cards with today's comparison
3. Enters pages read in input OR taps quick buttons
4. Taps "LOG IT" button
5. **Result:**
   - Progress bar updates
   - Pace badge recalculates
   - Streak increments (if applicable)
   - Toast notification: "Progress logged! 🎉"
   - If 100% reached → Trigger celebration modal

### Flow 2: Edit Target Date

1. User taps on "Target: Nov 30" text
2. Calendar picker appears
3. User selects new date
4. **Result:**
   - Daily goal recalculates
   - Pace badge updates
   - Comparison refreshes

### Flow 3: Book Completion

1. User logs final pages (reaches 100%)
2. Celebration modal appears with stats
3. User selects rating (optional)
4. User chooses action:
   - **Share to Feed:** Opens post composer with pre-filled content
   - **Add to Stack:** Opens stack selection/creation
   - **Skip:** Closes modal
5. **Result:**
   - Book moves to "Finished This Month" section
   - Rating saved for match algorithm
   - If shared: New post created in feed

---

## Implementation Notes

### Component Structure

```
pages/
  reading/
    page.tsx              # Main page component

components/
  ReadingProgressCard.tsx # Individual book progress card
  CheckInWidget.tsx       # Daily check-in input + buttons
  PaceBadge.tsx          # Colored status badge
  TimeComparison.tsx     # Daily rotating comparison
  CelebrationModal.tsx   # Book completion modal
  FinishedBookCard.tsx   # Compact finished book display
```

### State Management

**Page-level state:**
- `currentlyReading: ReadingProgress[]`
- `finishedThisMonth: ReadingProgress[]`
- `showCelebrationModal: boolean`
- `completedBook: ReadingProgress | null`

**Card-level state:**
- `todayPages: number` (input value)
- `isLoggingProgress: boolean` (loading state)

### API Endpoints (Future)

```typescript
// Get user's reading progress
GET /api/reading-progress?userId={id}&status=reading

// Log daily check-in
POST /api/reading-progress/{id}/check-in
Body: { pagesRead: number, date: string }

// Update target date
PATCH /api/reading-progress/{id}
Body: { targetDate: string }

// Complete book
POST /api/reading-progress/{id}/complete
Body: { rating: "loved" | "liked" | "meh" }

// Get finished books for month
GET /api/reading-progress?userId={id}&status=finished&month=11
```

### Mock Data Requirements

**Add to `lib/mockData.ts`:**

```typescript
export const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    bookId: "book-7", // The Cruel Prince
    startDate: "2024-11-01",
    targetDate: "2024-11-30",
    currentPage: 194,
    totalPages: 370,
    status: "reading",
    dailyCheckIns: [
      { date: "2024-11-01", pagesRead: 25, timestamp: "..." },
      { date: "2024-11-02", pagesRead: 30, timestamp: "..." },
      // ... more check-ins
    ],
    streak: 7
  },
  // ... more progress entries
];
```

---

## Design System Compliance

### Colors
- **Ahead/Success:** bg-[#10b981] (green)
- **On Track:** bg-[#f59e0b] (orange)
- **Behind/Warning:** bg-[#ef4444] (red)
- **Crushing:** bg-gradient-primary (purple-pink)
- **Info Box:** bg-blue-100, border-blue-600
- **Comparison Box:** bg-yellow-100, border-yellow-500

### Typography
- **Headings:** font-black, uppercase, tracking-tight
- **Labels:** font-bold, uppercase, text-xs
- **Body:** font-semibold, text-sm or text-base
- **Stats:** font-black for values, font-semibold for labels

### Brutalist Elements
- **Borders:** 3-5px solid black
- **Shadows:** 4px 4px 0 0 black (brutal-sm) or 6px 6px 0 0 black (brutal)
- **Border Radius:** rounded-xl (12px) for cards, rounded-lg (8px) for buttons
- **Hover States:** translate(-2px, -2px) + increased shadow
- **Active States:** translate(2px, 2px) + decreased shadow

---

## Time Comparison Library

### Gen Z Media Consumption Data

**Average daily usage (Gen Z):**
- TikTok: 52 minutes/day
- Instagram: 33 minutes/day
- YouTube: 74 minutes/day
- TV streaming: 90-120 minutes/day

**Reading equivalents:**
- 1 page ≈ 1 minute (250 words @ 250 wpm)
- TV episode (sitcom): 22 minutes
- TV episode (drama): 45-60 minutes
- Album: 35-45 minutes
- Movie: 90-120 minutes

### Comparison Examples

**For 12 pages/day (12 minutes):**
- "That's like watching half an episode of The Office"
- "That's 12 minutes less TikTok scrolling"
- "That's like listening to 3-4 songs"

**For 25 pages/day (25 minutes):**
- "That's like one episode of The Office"
- "That's half your daily TikTok time"
- "That's like listening to half an album"

**For 50 pages/day (50 minutes):**
- "That's like one episode of Stranger Things"
- "That's your full TikTok daily average"
- "That's like listening to a full album"

---

## Future Enhancements

### Phase 2 Features
- **Reading Stats Dashboard:** Weekly/monthly totals, avg pages/day
- **Friends' Progress:** See what friends are reading, compare stats
- **Book Clubs:** Shared reading goals with deadline syncing
- **Reading Challenges:** "Read 12 books in 2024" progress tracker
- **Integration with Stacks:** Auto-suggest adding finished books to stacks

### Phase 3 Features
- **Smart Reminders:** "Haven't checked in today!" notification
- **Reading Insights:** "You read most on Sundays" analytics
- **Milestone Badges:** "100 books read" achievements
- **Reading Speed Calculator:** Track and improve WPM
- **Audio Integration:** Track audiobook progress alongside physical

---

## Testing Checklist

### Functional Tests
- [ ] Daily check-in updates progress correctly
- [ ] Quick-add buttons (+10, +25, +50) work
- [ ] Progress bar fills accurately based on pages
- [ ] Pace badge updates correctly (ahead/on-track/behind)
- [ ] Streak increments on consecutive daily check-ins
- [ ] Streak resets if day is missed
- [ ] Target date edit updates daily goal
- [ ] Celebration modal appears at 100% completion
- [ ] Rating selection works in modal
- [ ] Book moves to finished section after completion

### UI/UX Tests
- [ ] Brutalist styling matches design system
- [ ] Cards are responsive (mobile → desktop)
- [ ] Touch targets are 44px+ for mobile
- [ ] Hover/active states work on interactive elements
- [ ] Time comparisons rotate daily
- [ ] Modal is accessible (keyboard nav, focus management)
- [ ] Progress bar is smooth and animated

### Edge Cases
- [ ] Book with 0 pages logged (just started)
- [ ] Book at 99% (doesn't trigger modal early)
- [ ] Target date in the past (shows overdue status)
- [ ] Very long book titles (truncation)
- [ ] Multiple books finished same day
- [ ] No currently reading books (empty state)

---

## References

- **Interactive Prototype:** `stacks-app/design_system/reading-tracker-prototype.html`
- **Design System:** `stacks-app/design_system/v2.0_refined_design_system.html`
- **Mock Data:** `stacks-app/lib/mockData.ts`
- **Related Pages:**
  - Home feed: `stacks-app/app/home/page.tsx`
  - Stacks profile: `stacks-app/app/stacks/page.tsx`

---

## Questions for Implementation

1. **Backend:** What database schema for storing daily check-ins efficiently?
2. **Notifications:** Push notifications for daily check-in reminders?
3. **Analytics:** Track aggregate reading stats for community features?
4. **Social:** Should reading progress be shareable in real-time (stories)?
5. **Gamification:** Leaderboards comparing reading speeds with friends?

---

**Document Status:** Design Complete
**Next Step:** Implementation plan or begin development
**Estimated Effort:** 3-5 days for MVP (with mock data)
