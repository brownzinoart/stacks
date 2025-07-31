# Stacks - Modern Library Web App

A modern, AI-powered library discovery platform that transforms how users find and engage with books. Built with Next.js 15, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm
- Supabase account (for database and auth)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd stacks_app
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys and configuration
   ```

3. **Set up the database:**
   - Create a new Supabase project
   - Run the migration file `supabase/migrations/001_initial_schema.sql`
   - Enable the pgvector extension in your Supabase dashboard

4. **Initialize git hooks:**
   ```bash
   npx husky install
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```

### Development

Start the development server:

```bash
npm run dev
```

Start the backend API server (in a separate terminal):

```bash
npm run backend:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Frontend Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── home/              # Mood-based recommendations
│   ├── explore/           # Topic bundles and learning paths
│   └── discovery/         # AR shelf scanning
├── components/            # Shared UI components
├── features/              # Feature-specific components
│   ├── home/             # Home page features
│   ├── explore/          # Explore page features
│   └── ar/               # AR/Discovery features
├── lib/                  # Utilities and API clients
└── styles/               # Global styles and Tailwind config
```

### Backend Structure

```
api/
└── server.js             # Fastify API server with health checks
```

## 🎯 Features

### Current (v0.1)

- ✅ **Responsive Navigation** - Tab-based navigation between main sections
- ✅ **Home Dashboard** - AI prompt input, recent searches, reading queue, streak tracking
- ✅ **Explore & Learn** - Topic search, learning paths, branch availability
- ✅ **Discovery Hub** - Standard search, AR placeholder, branch explorer
- ✅ **Design System** - Tailwind CSS with custom design tokens
- ✅ **Database Schema** - Supabase with pgvector for AI embeddings
- ✅ **API Gateway** - Fastify backend with health checks

### Planned Features

- 🔄 **AI Recommendations** - GPT-4o powered mood-based book suggestions
- 🔄 **Vector Search** - Semantic book discovery using embeddings
- 🔄 **AR Shelf Scanning** - WebXR book identification and "borrow me" overlays
- 🔄 **Learning Paths** - Curated book sequences for topic mastery
- 🔄 **Reading Streaks** - Gamified reading progress tracking
- 🔄 **Branch Integration** - Real-time availability via WorldCat/ILS APIs

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run backend:dev      # Start Fastify API server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run Playwright tests
npm run test:headed      # Run tests with browser UI
npm run test:ui          # Open Playwright test UI

# Build
npm run build            # Build for production
npm run start            # Start production server
```

## 🎨 Design System

### Colors

- **Background Primary**: `#FBF7F4` - Warm, library-inspired base
- **Card Yellow**: `#FFE15A` - Highlight color for important elements
- **Accent Blue**: `#3B82F6` - Interactive elements and CTAs

### Typography

- **Font**: Inter with OpenType features
- **Scale**: Tailwind's default type scale
- **Line Height**: Optimized for reading

### Components

- **Cards**: `rounded-card` (24px) with subtle shadows
- **Buttons**: Consistent padding, hover states, disabled states
- **Forms**: Focus rings, proper labeling, error states

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required environment variables including:

- Supabase database and auth configuration
- AI API keys (OpenAI, Anthropic, Google)
- External service keys (WorldCat, Listen Notes, Mapbox)

### Database Schema

The Supabase schema includes:

- **Books & Embeddings** - Book catalog with vector search capability
- **User Management** - Profiles, queues, reading streaks
- **Learning Paths** - Curated book collections
- **Library Integration** - Branch locations and availability

## 🧪 Testing

### Playwright E2E Tests

- **Smoke Tests** - Basic page loading and navigation
- **Accessibility** - WCAG compliance checks
- **User Flows** - Critical path testing
- **Cross-browser** - Chrome, Firefox, Safari, Mobile

Run tests:

```bash
npm run test                    # Headless mode
npm run test:headed            # With browser UI
npm run test:ui                # Interactive test runner
```

## 📱 Progressive Web App

Stacks is designed as a PWA with:

- **Offline Support** - Cached pages and offline UI
- **App-like Experience** - Can be installed on mobile devices
- **Fast Loading** - Optimized for 3G networks (FMP ≤ 1.8s)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: add voice search to discovery page
fix: resolve navigation highlight issue
docs: update API documentation
style: format code with prettier
refactor: extract search logic to custom hook
test: add integration tests for queue management
chore: update dependencies
```

### Code Quality

- **TypeScript** - Strict mode enabled
- **ESLint** - Next.js + TypeScript rules
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks for quality gates

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or issues:

1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include browser/device information for bugs

---

Built with ❤️ for modern library users everywhere.
