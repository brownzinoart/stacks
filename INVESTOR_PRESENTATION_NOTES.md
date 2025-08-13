# Stacks - Investor Presentation Notes

## Executive Summary
AI-powered library book discovery platform that transforms how people find and access books

## Key Metrics & Achievements
- ✅ Google Books API integrated - 100,000 covers/day capacity
- ✅ 90%+ book cover success rate
- ✅ 60-70% cost reduction through AI model routing
- ✅ Progressive Web App with iOS/Android support
- ✅ Semantic search with Wake County library integration

## Technical Infrastructure

### Current Stack
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Fastify API server
- **Database**: Supabase with pgvector for semantic search
- **AI Models**: 
  - GPT-4o for mood recommendations
  - Gemini 2.5 Pro for topic bundles
  - Claude 3.7 Sonnet for summaries
- **Mobile**: Capacitor for iOS/Android apps

### API Integrations
- ✅ Google Books API (with key: 100k requests/day)
- ✅ Open Library (fallback coverage)
- ✅ Wake County Library System
- 🔄 Goodreads API (pending approval)
- 🔄 OMDB for movie/show comparisons

## Post-Funding Optimizations

### Phase 1: Performance & Scale (Month 1-2)
1. **Cloudinary CDN Integration**
   - Permanent book cover caching
   - 10x faster image delivery
   - 95% reduction in API costs
   - Auto-optimization (WebP, resizing)

2. **Enhanced AI Pipeline**
   - Fine-tuned models for book recommendations
   - Batch processing for efficiency
   - Response caching layer

### Phase 2: Feature Expansion (Month 3-4)
1. **Premium Cover Sources**
   - ISBNdb integration ($30/month)
   - Syndetics/Bowker for library-grade covers
   - 100% cover guarantee

2. **Advanced Features**
   - AR shelf scanning improvements
   - Reading history analytics
   - Social features (book clubs, sharing)

### Phase 3: Market Expansion (Month 5-6)
1. **Multi-Library Support**
   - Integration with major library systems
   - National coverage roadmap
   - API standardization

2. **Revenue Streams**
   - Library partnership licenses
   - Premium user features
   - Book retailer affiliate programs

## Cost Optimization Strategy

### Current Costs (per 1000 users/day)
- AI API calls: ~$3-5
- Cover fetching: $0 (free tier)
- Database: $25/month
- Total: <$200/month

### Post-Optimization (with CDN)
- AI API calls: ~$1-2 (cached responses)
- Cover CDN: $10/month
- Database: $25/month
- Total: <$100/month

### Scale Economics (10k users/day)
- Without optimization: ~$2000/month
- With optimization: ~$300/month
- **85% cost reduction at scale**

## Technical Debt & Solutions

### Current Limitations
1. API rate limits during peak usage
2. Cover fetching delays on first load
3. Emergency fallbacks showing generic books

### Planned Solutions
1. **Request queuing system** - Prevents rate limit hits
2. **Pre-caching pipeline** - Covers ready before display
3. **Smart fallback system** - Context-aware emergency books

## Competitive Advantages

1. **Multi-Model AI Routing**
   - 60-70% cost savings vs single model
   - Optimized for different query types
   - Fallback redundancy

2. **Library Integration**
   - Direct availability checking
   - Hold placement capability
   - Branch-specific inventory

3. **Mobile-First PWA**
   - Works offline
   - App store ready
   - No installation required

## Risk Mitigation

### Technical Risks
- **API Dependency**: Multiple fallback sources implemented
- **Scale Issues**: CDN and caching strategy ready
- **Model Changes**: Abstraction layer for easy swapping

### Business Risks
- **Library Partnerships**: Multiple system integrations planned
- **User Acquisition**: SEO and library marketing channels
- **Competition**: First-mover advantage in AI + library space

## Investment Ask & Use of Funds

### Funding Requirements
- Seed Round: $500K - $1M
- Timeline: 12-18 months runway

### Allocation
- 40% Engineering (2-3 developers)
- 20% AI/API costs & infrastructure
- 20% Business development (library partnerships)
- 10% Marketing & user acquisition
- 10% Operations & contingency

## Milestones & KPIs

### 3 Months
- 10 library system integrations
- 10,000 monthly active users
- 95% cover display success rate

### 6 Months
- 50 library systems
- 50,000 MAU
- Mobile app store launch

### 12 Months
- 200+ library systems
- 250,000 MAU
- Revenue positive

## Demo Highlights

1. **"What's Next" Search**
   - Show any query (movies, moods, topics)
   - Demonstrate 3 category results
   - Highlight real book covers loading

2. **Library Integration**
   - Real-time availability
   - Branch locations
   - Direct hold placement

3. **Mobile Experience**
   - PWA on phone
   - Offline capability
   - Native app preview

## Questions to Address

1. **Why now?** AI capabilities + library digital transformation
2. **Market size?** 170M US library cardholders
3. **Revenue model?** B2B2C through library partnerships
4. **Competition?** No direct AI + library competitors
5. **Team?** Technical founder + AI expertise needed

## Technical Demo Script

1. Search "books like Die Hard" → Show action thriller results
2. Demonstrate 3 categories with real covers
3. Click book → Show details and library availability
4. Add to queue → Show offline capability
5. Open on mobile → Show PWA experience

## Post-Demo Discussion Points

- Expansion to academic libraries
- International market opportunity
- Publisher partnership potential
- Reading analytics for libraries
- Educational institution integration

---

*Last Updated: August 13, 2025*
*Status: MVP Complete, Ready for Investment*