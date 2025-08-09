# Content Strategy Wireframes

## Three Home Tab Approaches for Stacks App

Based on content strategy analysis, here are three wireframe concepts for restructuring the first touchpoint experience.

---

## Option A: Learning-First Hub

**Tab Name: "Learn" (Home Tab)**
**Goal:** Structured, topic-driven learning with community integration

### Wireframe Layout:

```
┌─────────────────────────────────────────┐
│  🧠 LEARN & GROW                        │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🎯 TOPIC INPUT                     │ │
│  │ "What do you want to learn?"       │ │
│  │ [                              ] ➤ │ │
│  │                                    │ │
│  │ Trending: AI • History • Cooking   │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  📚 CURRENT LEARNING PATHS             │
│  ┌─────────┬─────────┬─────────┐        │
│  │ Python  │ History │ Cooking │        │
│  │ 3/7     │ 5/6     │ 2/5     │        │
│  │ books   │ books   │ books   │        │
│  └─────────┴─────────┴─────────┘        │
│                                         │
│  🏘️ COMMUNITY LEARNING                 │
│  ┌─────────────────────────────────────┐ │
│  │ • History Book Club (Tonight 7PM)   │ │
│  │ • Python Study Group (Sat 2PM)     │ │
│  │ • Cooking Workshop (Next Week)     │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  📍 LEARNING NEAR YOU                  │
│  ┌─────────────────────────────────────┐ │
│  │ 2 learning groups within 5 miles    │ │
│  │ 3 library workshops this week       │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Features:**

- Topic input as primary CTA
- Progress visualization for ongoing learning paths
- Community integration from first screen
- Local learning opportunities highlighted
- Clear learning-focused mental model

---

## Option B: Discovery-First Hub

**Tab Name: "Discover" (Home Tab)**
**Goal:** Personalized recommendations with quick entry points

### Wireframe Layout:

```
┌─────────────────────────────────────────┐
│  ✨ DISCOVER YOUR NEXT READ             │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🎯 QUICK DISCOVERY                  │ │
│  │ ┌─────────┬─────────┬─────────┐     │ │
│  │ │ By Mood │ By Topic│ Surprise│     │ │
│  │ │    😊    │   🧠    │   🎲    │     │ │
│  │ └─────────┴─────────┴─────────┘     │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  📖 RECOMMENDED FOR YOU                 │
│  ┌─────────────────────────────────────┐ │
│  │ [Book Cover] [Book Cover] [Book Cover]│ │
│  │ Based on your reading history       │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  🔥 TRENDING NOW                       │
│  ┌─────────────────────────────────────┐ │
│  │ • "Project Hail Mary" - Sci-Fi      │ │
│  │ • "Educated" - Memoir              │ │
│  │ • "Atomic Habits" - Self-Help      │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  🎪 HAPPENING NEARBY                   │
│  ┌─────────────────────────────────────┐ │
│  │ Author reading tonight • Book club  │ │
│  │ tomorrow • Workshop this weekend    │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Features:**

- Three quick discovery paths (mood, topic, surprise)
- Algorithm-driven personalized recommendations
- Social proof with trending books
- Event integration for serendipitous discovery
- Lower cognitive load for casual users

---

## Option C: Hybrid Learning Hub (Recommended)

**Tab Name: "Home" (Dashboard)**  
**Goal:** Unified hub balancing structure and serendipity

### Wireframe Layout:

```
┌─────────────────────────────────────────┐
│  🏠 WELCOME BACK, [NAME]                │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🎯 TODAY'S LEARNING                 │ │
│  │ ┌─────────┬─────────┬─────────┐     │ │
│  │ │ Continue│ New     │ Near    │     │ │
│  │ │ Python  │ Topic   │ You     │     │ │
│  │ │ Path    │   ?     │  📍     │     │ │
│  │ └─────────┴─────────┴─────────┘     │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  📊 YOUR PROGRESS                       │
│  ┌─────────────────────────────────────┐ │
│  │ 🔥 7-day streak • 📚 3 books queued │ │
│  │ 📖 Currently: "Atomic Habits" p.124 │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  🌟 QUICK ACTIONS                      │
│  ┌─────────────────────────────────────┐ │
│  │ ┌─────────┬─────────┬─────────┐     │ │
│  │ │ AI Rec  │ Scan    │ Events  │     │ │
│  │ │   🤖    │ Shelf   │   🎪    │     │ │
│  │ │         │  📱     │         │     │ │
│  │ └─────────┴─────────┴─────────┘     │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  📍 THIS WEEK                          │
│  ┌─────────────────────────────────────┐ │
│  │ • Mystery Book Club (Thu 7PM)       │ │
│  │ • New releases at library           │ │
│  │ • Python meetup forming             │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Features:**

- Personal dashboard approach with contextual greeting
- Balance of structure (learning paths) and flexibility (new topics)
- Progress visibility builds engagement
- Quick action buttons for different user intents
- Weekly view creates sense of timeliness
- Integrates all app features without overwhelming

---

## Navigation Structure Comparison

### Current Structure:

`AR | Explore | Stacks | Events | Profile`

### Option A - Learning-First:

`Learn | Explore | Community | Progress | Kids`

### Option B - Discovery-First:

`Discover | Learn | Explore | Community | Kids`

### Option C - Hybrid Hub:

`Home | Learn | Explore | Community | Kids`

---

## User Flow Analysis

### New User Onboarding:

**Option A (Learning-First):**

1. Lands on topic input → Enters interest → Gets curated stack → Sees community options

**Option B (Discovery-First):**

1. Lands on mood/topic buttons → Quick selection → Gets recommendations → Discovers features

**Option C (Hybrid Hub):**

1. Lands on personalized dashboard → Multiple entry points → Chooses path based on current intent

### Returning User Experience:

**Option A:** Focused on learning progress and community engagement
**Option B:** Emphasizes discovery and serendipitous recommendations  
**Option C:** Balances progress tracking with new opportunities

---

## Recommendation: Option C - Hybrid Learning Hub

**Why this approach wins:**

1. **Solves Entry Point Problem:** Clear dashboard metaphor users understand
2. **Balances User Intents:** Serves both goal-oriented learners and casual discoverers
3. **Progressive Disclosure:** Shows what's relevant today without overwhelming
4. **Community Integration:** Weaves social features throughout experience
5. **Personalization:** Adapts to user behavior and preferences
6. **Clear Mental Model:** "Home" tab expectations align with dashboard functionality

**Implementation Priority:**

1. Personal dashboard with progress tracking
2. Quick action buttons for different use cases
3. Weekly/contextual content surfacing
4. Community integration in main feed
5. AI-driven personalization over time
