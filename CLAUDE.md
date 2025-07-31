# CLAUDE.md - Essential Development Guide for Stacks

This file contains essential information for Claude instances working on the Stacks project.

## Project Overview

Stacks is a modern, AI-powered library discovery platform built with Next.js 15, TypeScript, and Supabase. It transforms how users find and engage with books through mood-based recommendations, AR shelf scanning, and integrated library services.

## Essential Development Commands

### Development

```bash
npm run dev              # Start Next.js dev server (port 3000) with Turbopack
npm run backend:dev      # Start Fastify API server (port 3001) - run in separate terminal
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

### Testing

```bash
npm run test             # Run all Playwright tests
npm run test:headed      # Run tests with browser UI
npm run test:ui          # Open Playwright test UI

# Run a single test file
npx playwright test tests/home.spec.ts

# Run tests matching a pattern
npx playwright test -g "should load successfully"
```

### Build & Production

```bash
npm run build            # Build for production
npm run start            # Start production server
```

## Environment Variables

Create `.env.local` from `.env.example` with these required variables:

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI APIs
OPENAI_API_KEY=          # GPT-4o for mood recommendations
ANTHROPIC_API_KEY=       # Claude for summaries
GOOGLE_VERTEX_KEY=       # Gemini for topic bundles

# External Services
WORLDCAT_KEY=            # Library catalog integration
LISTEN_NOTES_KEY=        # Podcast recommendations
MAPBOX_TOKEN=            # Map visualizations
ILS_BASE_URL=            # Integrated Library System
```

## Architecture Overview

### Frontend Structure

- **App Router Pages** (`src/app/`): Next.js 15 app directory structure
  - `/home` - Mood-based recommendations with AI prompt input
  - `/explore` - Topic bundles and learning paths
  - `/discovery` - AR shelf scanning and branch explorer
- **Feature Components** (`src/features/`): Page-specific features organized by route
- **Shared Components** (`src/components/`): Reusable UI components
- **Library Code** (`src/lib/`): API clients, utilities, Supabase integration

### Backend Structure

- **Fastify Server** (`api/server.js`): API gateway with health checks
- Currently provides placeholders for future implementation

### Database

- **Supabase PostgreSQL** with pgvector extension for semantic search
- Key tables: books, book_embeddings, user_queue, reading_streaks, learning_paths

## Development Conventions

### TypeScript Configuration

- **Strict Mode**: Enabled with `noUncheckedIndexedAccess: true`
- **Path Alias**: Use `@/*` for imports from `src/`
- **Target**: ES2017 for compatibility

### Code Style

- **Prettier**: 120-char line width, single quotes
- **ESLint**: Next.js + TypeScript recommended rules
- **Tailwind**: Custom design tokens in `tailwind.config.js`
- **Components**: Must accept `className` prop for styling

### Git Workflow

- **Branching**: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- **Commits**: Conventional Commits enforced by Husky
- **Pre-commit Hooks**: Type checking, linting, formatting

### Testing Strategy

- **E2E Tests**: Playwright for smoke tests and user flows
- **Accessibility**: Basic WCAG compliance checks
- **Cross-browser**: Chrome, Firefox, Safari, Mobile viewports

## Special Setup Requirements

1. **Node.js**: Version 18.17.0 or higher required
2. **Supabase Setup**:
   - Create project and run migration from `supabase/migrations/001_initial_schema.sql`
   - Enable pgvector extension for semantic search
3. **Git Hooks**: Run `npx husky install` after clone
4. **Environment**: Copy `.env.example` to `.env.local` and fill in API keys

## AI Model Usage Strategy

| Use Case             | Model             | Context Window | Notes                        |
| -------------------- | ----------------- | -------------- | ---------------------------- |
| Mood recommendations | GPT-4o            | 3k             | Fallback to Gemini 2.5 Flash |
| Topic bundles        | Gemini 2.5 Pro    | 32k            | For complex learning paths   |
| Summaries/tooltips   | Claude 3.7 Sonnet | -              | Best for nuanced text        |
| Future upgrade       | GPT-5             | -              | When stable                  |

Rate limiting: 1 request/user/second via Supabase queue

## Important Implementation Notes

1. **Never commit real API keys** - Use environment variables
2. **Progressive Web App** - Designed for offline support and mobile installation
3. **Performance Target** - First Meaningful Paint ≤ 1.8s on 3G
4. **Accessibility** - All interactive elements must be keyboard navigable
5. **Component Design** - Cards use `rounded-3xl shadow-card p-6` styling
6. **Error Handling** - Always provide user-friendly error messages
7. **State Management** - Use React Query for server state caching

## Deployment

- **Frontend**: Vercel (automatic deploys from main branch)
- **Database**: Supabase US-East with nightly S3 backups
- **Edge Functions**: Vercel Edge Runtime for API routes

## Key Files to Review

- `src/lib/supabase.ts` - Database client and type definitions
- `src/app/layout.tsx` - Root layout with navigation
- `stacks_cursorrules` - Additional development conventions
- `package.json` - All available scripts and dependencies
