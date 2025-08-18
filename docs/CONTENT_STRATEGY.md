# 📘 Stacks Content Strategy (Updated)

This document outlines the **content and product strategy** for Stacks, merging all recent updates into one cohesive brief. This is written to serve as a **living playbook** for developers, designers, content strategists, and the wider team.

---

## 🌐 Site Map & Core Sections

### 1. **Home**
- **Vibe Search** → Natural language book search (e.g., *"I want books like Succession"*).
- **Pace Yo'self** → Reading pace tracker (set goals like "10 pages a day," track streaks, and stay motivated).
- **New Releases** → Highlighted books based on user vibes and trends.
- **Recent Searches & Queued Books** → Personal shortcuts.
- **Podcasts** → Curated audio content while browsing.

---

### 2. **Discover**
- **What People Are Reading in Your Area** → Geo-based trending stacks.
- **Community Highlights** → Shared stacks from local users.
- **Popular Stacks** → Book bundles trending on Stacks.
- **Editorial Picks** → Curated recommendations by experts.

---

### 3. **Learn**
- **Topic-Based Learning Stacks** → Users input a subject ("quantum physics," "modern art," "climate change").
- Returns a **curated stack of books** covering the subject from multiple angles.
- **Library Map Integration (Future)** → Shows where those books are located in local libraries.

---

### 4. **MyStacks**
- **StackSnap** (Core Feature - **SIMPLIFIED LAUNCH VERSION**):
  - Snap a **library shelf, bookstore shelf, or friend's stack**.
  - **OCR Technology** identifies book titles/authors in the image
  - Creates an **interactive overlay** on the captured image showing:
    - Book recommendations based on identified titles
    - "Add to Stack" buttons overlaid on each book
    - Similarity scores and genre connections
  - Users can:
    - Save books to "Want to Read" / "Currently Reading" / "Finished."
    - Get AI recommendations from the identified shelf
    - Share the interactive image with friends
- **Stats Dashboard** → Tracks books read, pages, genres, time spent.
- **Personal Progress** → Reading streaks, pace tracker, milestones.

**Technical Implementation**:
- Camera capture → OCR processing → Google Books API lookup → AI recommendations → Interactive overlay UI

---

### 5. **StacksTalk** (Community / Social)
- **Integration with #BookTok** → Direct TikTok feed integration.
- **In-app Sharing** → Users post mini stack reviews, shelf snaps, or book notes.
- **Influencer Collabs** → Highlight creators shaping Gen Z and Gen Alpha reading trends.
- **Future Expansion** → Syncs with other social platforms (IG, YouTube Shorts).

---

## 🎯 Audience Strategy

- **Primary:** Gen Z → Focus on TikTok culture, viral discovery, gamification.
- **Secondary:** Gen Alpha & Parents → Collaborative reading, educational support.
- **Tertiary:** Librarians, educators, community groups → Encourage usage in schools and libraries.

---

## 📂 Project Structure (Living)

```
stacks/
├── app/                      
├── server/                   
├── ml/                       
│   ├── prompts/              
│   ├── evals/                # eval_vibe_search.jsonl here
│   │   └── eval_vibe_search.jsonl
│   ├── scripts/              
│   └── feedback/             # feedback_events.schema.sample.jsonl here
│       └── feedback_events.schema.sample.jsonl
├── qa/                      
├── docs/                    
│   ├── STACKS_AGENT.md       
│   └── tickets/              # tickets.vibe_search.yaml here
│       └── tickets.vibe_search.yaml
├── config/                  
└── package.json
```

---

## 🚀 Next Steps

1. **Refine UX Flows**:
   - Snap → Stack → Save/Share → Recommend loop.
   - Pace Yo'self gamification.

2. **Design System**:
   - Pull shared components from other repos.
   - Create unified typography, colors, and UI patterns.

3. **MCP Setup**:
   - Continue building evaluators and feedback loops.
   - Thumbs up/down integration for ML fine-tuning.

4. **Community Content**:
   - Identify BookTok creators for early integration.
   - Plan launch campaign highlighting Snap → Share feature.

---

👉 This document is **living** — update it continuously as new features, design choices, and community insights emerge.