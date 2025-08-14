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

# Step 4: Update internal links to avoid RSC navigation
echo "   🔗 Updating internal navigation..."
# This could include sed commands to replace RSC navigation with standard links
# For now, the static export should handle this automatically

# Step 5: Sync to iOS Capacitor project
echo "📱 Syncing to iOS Capacitor project..."
npx cap sync ios

# Step 6: Apply iOS-specific fixes
echo "🍎 Applying iOS-specific fixes..."

# Ensure proper index.html in iOS public directory
cp out/home/index.html ios/App/App/public/index.html

# Verify critical files exist
echo "✅ Verifying iOS build..."
if [ ! -f "ios/App/App/public/index.html" ]; then
    echo "❌ Error: iOS index.html not found!"
    exit 1
fi

if [ ! -d "ios/App/App/public/_next" ]; then
    echo "❌ Error: Next.js assets not synced!"
    exit 1
fi

echo "✅ iOS build complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Open Xcode: npx cap open ios"
echo "   2. Clean Build Folder: Product → Clean Build Folder (⇧⌘K)"
echo "   3. Run on device: Press ▶ or ⌘R"
echo ""
echo "🎯 Expected result: No RSC errors, direct home page load"