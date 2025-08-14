# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# RECOMMENDED: Start both servers with consistent ports (SINGLE COMMAND)
npm run dev:all          # Starts frontend (4000) + backend (4001) with clean cache

# OR start individually:
# Frontend development (Next.js with Turbopack) - PORT 4000
npm run dev              # Start at http://localhost:4000 with Turbopack, binds to 0.0.0.0

# Backend development (Fastify API server) - PORT 4001
npm run backend:dev      # Start API server at 0.0.0.0:4001

# Build for production
npm run build            # Production build with Next.js

# Code quality
npm run lint             # ESLint checking
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Prettier formatting (120 char lines, single quotes)
npm run type-check       # TypeScript validation

# Testing
npm run test             # Run all Playwright tests
npm run test:headed      # Run tests with browser UI
npm run test:ui          # Open Playwright test UI

# Run a single test file
npx playwright test tests/specific-test.spec.ts

# Production
npm run start            # Start production server

# Performance
npm run analyze          # Analyze bundle size
npm run audit:performance # Run performance audit
```

## Architecture Overview

This is a Next.js 15 progressive web app for AI-powered library book discovery with iOS/Android mobile app capabilities via Capacitor.

### Frontend Structure

- **App Router**: Uses Next.js 15 App Router (not Pages Router) in `src/app/`
- **Feature Organization**: Components organized by feature in `src/features/` matching page structure:
  - `home/` - AI prompt input, reading queue, streak tracking
  - `explore/` - Topic search, learning paths, branch availability
  - `ar/` - AR shelf scanning, branch explorer
- **State Management**: TanStack Query v5 for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens in `tailwind.config.js`

### Backend Architecture

- **API Server**: Separate Fastify server in `/api/server.js` running on port 3001
- **Database**: Supabase with pgvector extension for semantic search
- **AI Integration**: Proxy pattern through Next.js API routes (`/api/*-proxy/`) to manage API keys securely

### Mobile Architecture

- **Framework**: Capacitor 7 for iOS/Android native builds
- **iOS**: Xcode project in `/ios/App/` and `/mobile/ios/App/`
- **Config**: Live reload dev server configured in `mobile/capacitor.config.ts`
- **Build**: Static export (`output: 'export'`) for mobile app packaging

### AI Model Strategy

Different models optimized for specific tasks:

- **GPT-4o**: Mood-based book recommendations (3k context, fallback to Gemini 2.5 Flash)
- **Gemini 2.5 Pro**: Topic bundles and learning paths (32k context)
- **Claude 3.7 Sonnet**: Book summaries and insights
- Rate limiting: 1 req/user/s via Supabase queue

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI Services (server-side only)
OPENAI_API_KEY=          # GPT-4o for recommendations
ANTHROPIC_API_KEY=       # Claude for summaries
GOOGLE_VERTEX_PROJECT_ID= # Gemini Pro
GOOGLE_VERTEX_LOCATION=us-central1

# External Services (optional)
OMDB_API_KEY=            # Movie/show enrichment
WORLDCAT_API_KEY=        # Library catalog
LISTEN_NOTES_API_KEY=    # Podcast recommendations
NEXT_PUBLIC_MAPBOX_TOKEN= # Map visualizations
ILS_CLIENT_ID=           # Library system integration
ILS_CLIENT_SECRET=

# Development
NEXT_PUBLIC_DEV_SERVER_IP=192.168.86.174  # Your local IP for mobile testing
```

## Development Conventions

### TypeScript

- Strict mode with `noUncheckedIndexedAccess: true`
- Always use type-safe imports
- Prefer interfaces over types for object shapes

### Code Style

- Prettier: 120 character lines, single quotes, no semicolons
- ESLint: Next.js recommended + TypeScript rules
- Tailwind: Use design tokens from config, avoid arbitrary values
- Components must accept `className` prop

### Git Workflow

- Conventional commits enforced by commitlint and Husky
- Feature branches: `feature/description`
- Bugfix branches: `bugfix/description`
- Main branch is protected, use PRs

### Component Patterns

- Server Components by default in App Router
- Client Components only when needed (`'use client'` directive)
- Feature-based organization matching route structure
- Shared components in `src/components/`

### Planning & Execution Protocol

- **ALWAYS** consult with `/mydawgs` team when planning new features or major changes
- Use Task tool with appropriate specialized agents (ux-ui, dev, etc.) before implementation
- Get team consensus on approach before execution
- Collaborate with mydawgs for design, architecture, and implementation decisions

## Testing Strategy

Playwright E2E testing with comprehensive coverage:

- Tests in `tests/` directory organized by feature
- Mobile viewport testing included
- Accessibility checks integrated
- Smoke tests for critical paths (`tests/smoke-test.spec.ts`)

## Database Schema

Key Supabase tables with pgvector for semantic search:

- `books`: Core book data with vector embeddings
- `users`: User profiles and preferences
- `reading_history`: User reading activity
- `recommendations`: AI-generated recommendations
- `queues`: User book queues

Migration files in `supabase/migrations/`

## Performance Optimizations

- **Service Workers**: Advanced caching in `public/sw-advanced.js`
- **Component Loading**: Dynamic imports via `src/lib/component-loader.ts`
- **API Caching**: SQLite-based caching in `cache/` directory
- **Image Optimization**: Book covers cached and optimized via service
- **Memory Management**: Proactive cleanup in `src/lib/memory-manager.ts`

## Mobile Development

### iOS Development

```bash
# From mobile/ directory
npx cap sync             # Sync web assets to native
npx cap open ios         # Open in Xcode
npx cap run ios          # Run on simulator

# Build for device testing
cd ios/App && pod install
# Then build in Xcode
```

### Testing on Physical Device

1. Update `NEXT_PUBLIC_DEV_SERVER_IP` in `.env.local` with your machine's IP
2. Update `url` in `mobile/capacitor.config.ts` to match
3. Ensure device is on same network
4. Run `npm run dev` and connect from device

## Important Notes

1. **PWA Requirements**: Maintain offline functionality and service worker compatibility
2. **Rate Limiting**: AI APIs have rate limits - respect them via Supabase queue
3. **Design Tokens**: Use Tailwind tokens from config, not arbitrary values
4. **Turbopack**: Development uses Turbopack for faster builds
5. **Mobile-First**: Always test on mobile viewports first
6. **Accessibility**: Maintain WCAG 2.1 AA compliance
7. **Cost Optimization**: AI model selection optimized for cost/performance balance

## iOS Development - CRITICAL WORKFLOW

**IMPORTANT**: When making ANY changes that could affect the iOS app, ALWAYS follow this sequence:

### After Every Code Change:

1. **Build the app**:

   ```bash
   npm run build
   ```

2. **Copy to iOS project** (handles RSC issue):

   ```bash
   cp out/home.html ios/App/App/public/index.html
   npx cap sync ios
   ```

3. **For API features**, ensure dev server is running:

   ```bash
   HOST=0.0.0.0 npm run dev  # Run in background/new terminal
   ```

4. **Tell user to rebuild in Xcode**:
   - Clean Build Folder: Product → Clean Build Folder (⇧⌘K)
   - Run the app: Press ▶ or ⌘R

### Known iOS Issues & Solutions:

- **React Server Components**: .txt files don't work with Capacitor - always use home.html as index.html
- **API Connectivity**: Dev server must run on 0.0.0.0 for network access from phone
- **Current Mac IP**: 192.168.86.190 (hardcoded in src/lib/api-config.ts - update if network changes)
- **Blank Screen**: Usually means RSC files are being loaded - rebuild with home.html copy
- **"Something went wrong"**: API server not accessible - ensure dev server is running on 0.0.0.0

## iOS Development Agent

A specialized agent (`agents/ios-dev-agent.py`) handles iOS development with live reload:

### Quick Commands

```bash
npm run ios:setup    # Complete iOS setup with live reload
npm run ios:dev      # Start servers with correct IP binding
npm run ios:fix      # Fix common issues automatically
npm run ios:monitor  # Monitor development status
```

### Agent Capabilities

- Automatic IP configuration for live reload
- AR permissions setup
- Build error resolution
- Network troubleshooting
- Real-time development monitoring

### Testing Workflow

1. Run `npm run ios:setup` for initial configuration
2. Use `npm run ios:open` to launch Xcode
3. Select your physical device and run
4. Changes auto-reload on device via Wi-Fi

See `IOS_DEVELOPMENT_GUIDE.md` for complete documentation.

## mydawgs Team Integration

When using `/dawgs` command:

- Goal: Move fast with clarity, return smallest artifact that unblocks progress
- Approve plans with `/approve` or "run all"/"run selected"
- Auto-handoff threshold: `MYDAWGS_CONF_THRESHOLD=0.75`

- start a document for my investment presentation, add notes to it when you mention them
- all testing moving forward needs to be done via phone application