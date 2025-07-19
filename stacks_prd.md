# Stacks – Modern Library Web App

Version 0.9 – 18 Jul 2025  
Authors: Brownzino Art (Product Owner), ChatGPT o3 (AI Co‑pilot)

---

## 1. Purpose & Vision
Stacks turns a public‑library catalogue into a playful, AI‑powered discovery playground—helping modern readers *match their mood*, crush reading goals, and deep‑dive research topics, all in a bright, welcoming interface inspired by the attached mock‑up. We aim to reconnect digital‑first users with their physical branches and drive higher circulation per patron.

## 2. Success Metrics
Metric | Target @ 6 mo
------ | -------------
Weekly active users (WAU) | 5 k
Avg. sessions/patron/week | ≥ 3
Books reserved per WAU | ≥ 1.5
Research‑bundle check‑outs | 300/mo
NPS (digital experience) | ≥ 60

## 3. Primary Personas
1. “Binge Reader Becca” – 26 y/o, devours fiction series, wants personalised recs fast.  
2. “Side‑Hustle Sam” – 34 y/o, learns new skills nights & weekends; needs curated topic bundles.  
3. “Teen Explorer Tia” – 16 y/o, mobile‑first, loves streaks & badges, short attention span.

## 4. Experience Architecture
### 4.1 Navigation
Tab | Job‑to‑be‑Done
--- | -------------
Home | “Show me a snackable dashboard: mood‑based AI recs, my queue & streak.”
Explore & Learn | “Give me a 360° stack of books to master any topic, available today.”
Discovery (AR) | “Let me wander the stacks IRL/AR and uncover surprises.”

### 4.2 Feature Breakdown
**Home**
- AI Prompt Input – free‑text box powered by OpenAI GPT‑4o (or 5) for natural‑language rec queries.  
- Recent Searches – horizontal chips.  
- My Queue – carousel of holds/on‑deck.  
- New Releases for Me – ML shelf (embeddings + behaviour).  
- Listen While You Browse – podcast widget (Listen Notes API).  
- Reading Streak Widget – CTA; logs ≥ 10 pages/day.

**Explore & Learn**
- Topic Search → assembles 5‑10 book “learning path.”  
- Branch Aggregation – WorldCat + ILS for availability.  
- Blueprint Overlay – Mapbox Indoor/WRLD coordinates.  
- One‑Click Reserve – batch holds/transfers.

**Discovery (AR)**
- Standard Search (text, ISBN scan, voice).  
- AR Shelf Scan – WebXR overlay “borrow me.”  
- Branch Explorer – mini‑map floorplans highlighting zones.

## 5. Functional Requirements
R‑1 AI prompt ≤ 10 recs in ≤ 2 s P95.  
R‑2 Queue syncs every 5 min.  
R‑3 Streak counts pages via manual or e‑reader API.  
R‑4 Topic bundles expire after 24 h if unavailable.  
R‑5 AR overlay 95 % accuracy on mobile Safari/Chrome.

## 6. Non‑Functional
• PWA offline UI chrome  
• WCAG 2.2 AA compliance  
• FMP ≤ 1.8 s on 3G  
• 99.5 % API uptime

## 7. Tech Stack & Integrations
Layer | Choice | Notes
----- | ------ | -----
Frontend | Next.js 15 + RSC | Tailwind design tokens
State | TanStack Query v6 | cache ILS
Auth | Clerk.dev | card barcode + SSO
Backend | Fastify v5 | SSR gateway
Vector DB | Supabase pgvector | book embeddings
AI Models | GPT‑4o/mini, Gemini 2.5 Pro, Claude 3.7; GPT‑5 future
Book meta | Open Library, Google Books |
ILS | OCLC WorldCat, Koha REST fallback |
Podcasts | Listen Notes API |
Maps/AR | Mapbox Indoor, WebXR, AR.js |

Env keys required: OPENAI_API_KEY, GOOGLE_VERTEX_KEY, ANTHROPIC_API_KEY, LISTEN_NOTES_KEY, WORLDCAT_KEY, MAPBOX_TOKEN, ILS_BASE_URL

## 8. Design Tokens (excerpt)
--color-bg-primary #FBF7F4  
--color-card-yellow #FFE15A  
--radius-card 24px … (see full spec)

## 9. Milestones
• 12 Aug ’25  Hi‑fi Figma  
• 02 Sep ’25  API gateway PoC  
• 14 Oct ’25  Home beta  
• 30 Nov ’25  Explore & Learn MVP  
• 15 Jan ’26  AR pilot  
• 28 Feb ’26  GA launch

## 10. Risks & Mitigations
ILS variability → adapter layer  
AI latency → cache/stream  
AR accuracy → staff calibration  
Privacy → hashed card IDs

— End of document —
