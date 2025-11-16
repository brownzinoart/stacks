#!/bin/bash

# iOS-specific build script for Stacks
# Builds static export and optimizes for iOS Capacitor deployment

set -e

echo "🚀 Building iOS-optimized static export..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -rf ios/App/App/public/

# Step 2: Build static export
echo "📦 Building Next.js static export..."
npm run build

# Step 3: iOS-specific optimizations
echo "📱 Applying iOS-specific optimizations..."

# Copy home page as root index to bypass RSC navigation
echo "   📋 Copying home page as root index.html..."
cp out/home/index.html out/index.html

# Ensure all pages have proper HTML fallbacks
echo "   🔧 Ensuring HTML fallbacks for all routes..."
for dir in out/*/; do
    if [ -d "$dir" ] && [ -f "$dir/index.html" ]; then
        # Copy index.html as a fallback for RSC-free navigation
        cp "$dir/index.html" "$dir/index.htm" 2>/dev/null || true
    fi
done

# Step 4: CRITICAL - Remove ALL .txt files (RSC payloads) to prevent iOS errors
echo "   🗑️  Removing RSC .txt files to prevent iOS navigation errors..."
find out/ -name "*.txt" -type f -delete
echo "   ✅ RSC .txt files removed from build output"

# Step 5: Sync to iOS Capacitor project
echo "📱 Syncing to iOS Capacitor project..."
npx cap sync ios

# Step 6: Apply iOS-specific fixes
echo "🍎 Applying iOS-specific fixes..."

# Ensure proper index.html in iOS public directory
cp out/home/index.html ios/App/App/public/index.html

# CRITICAL: Remove any .txt files that got synced to iOS
echo "   🗑️  Final cleanup - removing any .txt files from iOS build..."
find ios/App/App/public/ -name "*.txt" -type f -delete
echo "   ✅ iOS build completely .txt-free"

# Verify critical files exist and NO .txt files remain
echo "✅ Verifying iOS build..."
if [ ! -f "ios/App/App/public/index.html" ]; then
    echo "❌ Error: iOS index.html not found!"
    exit 1
fi

if [ ! -d "ios/App/App/public/_next" ]; then
    echo "❌ Error: Next.js assets not synced!"
    exit 1
fi

# CRITICAL: Verify NO .txt files exist in iOS build
TXT_COUNT=$(find ios/App/App/public/ -name "*.txt" -type f | wc -l | tr -d ' ')
if [ "$TXT_COUNT" -gt 0 ]; then
    echo "❌ Error: $TXT_COUNT .txt files still exist in iOS build!"
    find ios/App/App/public/ -name "*.txt" -type f
    exit 1
fi
echo "   ✅ Confirmed: ZERO .txt files in iOS build"

echo "✅ iOS build complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Open Xcode: npx cap open ios"
echo "   2. Clean Build Folder: Product → Clean Build Folder (⇧⌘K)"
echo "   3. Run on device: Press ▶ or ⌘R"
echo ""
echo "🎯 Expected result: ZERO RSC errors, NO .txt file attempts, direct home page load"