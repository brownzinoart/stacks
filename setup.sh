#!/bin/bash

# Stacks - Modern Library Web App Setup Script
# This script installs dependencies and starts the development environment

set -e  # Exit on any error

echo "🚀 Setting up Stacks - Modern Library Web App"
echo "=============================================="

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize Husky git hooks
echo "🔧 Setting up git hooks..."
npx husky install
chmod +x .husky/pre-commit 2>/dev/null || true
chmod +x .husky/commit-msg 2>/dev/null || true

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your actual API keys and configuration"
else
    echo "✅ .env.local already exists"
fi

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Check if we should start the dev server
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev              # Start Next.js frontend"
echo "  npm run backend:dev      # Start Fastify backend (separate terminal)"
echo ""
echo "To run tests:"
echo "  npm run test             # Run Playwright tests"
echo ""
echo "🌟 Visit http://localhost:3000 when servers are running"
echo ""

# Optionally start the development server
read -p "Start the development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    echo "📖 Frontend will be available at http://localhost:3000"
    echo "🔧 Backend will be available at http://localhost:3001"
    echo ""
    echo "Press Ctrl+C to stop the server"
    npm run dev
else
    echo "👍 Setup complete! Run 'npm run dev' when you're ready to start developing."
fi 