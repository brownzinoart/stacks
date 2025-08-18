#!/bin/bash

# Cache clearing script for Stacks development
# Performs nuclear cache clear and restarts dev server

echo "🧹 Starting cache clear process..."

# Kill any running dev server
echo "🔴 Stopping dev server..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

# Remove all cache directories
echo "🗑️  Removing build cache..."
rm -rf .next

echo "🗑️  Removing npm cache..."
npm cache clean --force

echo "🗑️  Removing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

echo "🗑️  Removing Turbopack cache..."
rm -rf .turbo 2>/dev/null || true

# Optional: Clear browser storage via script (for automation)
if command -v osascript &> /dev/null; then
    echo "🌐 Clearing browser cache (Safari)..."
    osascript -e 'tell application "Safari" to activate' 2>/dev/null || true
    osascript -e 'tell application "System Events" to keystroke "e" using {command down, option down}' 2>/dev/null || true
fi

echo "✅ Cache cleared successfully!"
echo "🚀 Start development with: npm run dev"
echo "🔄 Auto-clear development: npm run dev:auto"

# Auto-restart if requested
if [ "$1" = "--restart" ]; then
    echo "🚀 Restarting dev server..."
    npm run dev
fi