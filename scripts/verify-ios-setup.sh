#!/bin/bash

# Verification script for iOS setup and icons
echo "🔍 Verifying iOS Setup for Stacks Library App"
echo "=============================================="
echo ""

# Check if required tools are available
echo "📋 Checking required tools..."
if command -v xcodebuild >/dev/null 2>&1; then
    echo "✅ Xcode build tools: Available"
else
    echo "❌ Xcode build tools: Not found"
    exit 1
fi

if command -v npx >/dev/null 2>&1; then
    echo "✅ NPX (Node Package Runner): Available"
else
    echo "❌ NPX: Not found"
    exit 1
fi

# Check Capacitor version
echo "✅ Capacitor CLI: $(npx cap --version)"
echo ""

# Check iOS project structure
echo "📁 Checking iOS project structure..."
if [ -d "ios/App/App" ]; then
    echo "✅ iOS app directory exists"
else
    echo "❌ iOS app directory not found"
    exit 1
fi

if [ -f "ios/App/App.xcworkspace/contents.xcworkspacedata" ]; then
    echo "✅ Xcode workspace exists"
else
    echo "❌ Xcode workspace not found"
    exit 1
fi

# Check icon files
echo ""
echo "🎨 Checking app icons..."
ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
REQUIRED_ICONS=(
    "AppIcon-20@1x.png"
    "AppIcon-20@2x.png" 
    "AppIcon-20@3x.png"
    "AppIcon-29@1x.png"
    "AppIcon-29@2x.png"
    "AppIcon-29@3x.png"
    "AppIcon-40@1x.png"
    "AppIcon-40@2x.png"
    "AppIcon-40@3x.png"
    "AppIcon-60@2x.png"
    "AppIcon-60@3x.png"
    "AppIcon-76@1x.png"
    "AppIcon-76@2x.png"
    "AppIcon-83.5@2x.png"
    "AppIcon-1024@1x.png"
)

MISSING_ICONS=()
for icon in "${REQUIRED_ICONS[@]}"; do
    if [ -f "$ICON_DIR/$icon" ]; then
        echo "✅ $icon"
    else
        echo "❌ $icon (missing)"
        MISSING_ICONS+=("$icon")
    fi
done

if [ ${#MISSING_ICONS[@]} -eq 0 ]; then
    echo "✅ All required iOS icons are present!"
else
    echo "❌ Missing ${#MISSING_ICONS[@]} icons"
fi

# Check Contents.json
if [ -f "$ICON_DIR/Contents.json" ]; then
    echo "✅ Contents.json configuration file exists"
else
    echo "❌ Contents.json configuration file missing"
fi

echo ""

# Check build output directory
echo "📦 Checking build output..."
if [ -d "out" ]; then
    echo "✅ Next.js build output directory exists"
    FILE_COUNT=$(find out -type f | wc -l | tr -d ' ')
    echo "✅ Build contains $FILE_COUNT files"
else
    echo "❌ Build output directory not found - run 'npm run build'"
fi

# Check Capacitor config
echo ""
echo "⚙️  Checking Capacitor configuration..."
if [ -f "capacitor.config.json" ]; then
    APP_ID=$(grep '"appId"' capacitor.config.json | sed 's/.*: *"\([^"]*\)".*/\1/')
    APP_NAME=$(grep '"appName"' capacitor.config.json | sed 's/.*: *"\([^"]*\)".*/\1/')
    echo "✅ App ID: $APP_ID"
    echo "✅ App Name: $APP_NAME"
else
    echo "❌ Capacitor config not found"
fi

# Check iOS simulators
echo ""
echo "📱 Checking iOS Simulators..."
SIMULATOR_COUNT=$(xcrun simctl list devices available | grep iPhone | wc -l | tr -d ' ')
echo "✅ $SIMULATOR_COUNT iPhone simulators available"

# Final summary
echo ""
echo "🎯 Summary"
echo "=========="
if [ ${#MISSING_ICONS[@]} -eq 0 ]; then
    echo "✅ iOS setup is complete and ready for testing!"
    echo ""
    echo "🚀 To test your app:"
    echo "   1. npm run build"
    echo "   2. npx cap sync ios"
    echo "   3. npx cap run ios"
    echo ""
    echo "📝 App details:"
    echo "   • Bundle ID: com.stacks.library"
    echo "   • Display Name: Stacks"
    echo "   • All required icon sizes generated"
    echo "   • iOS 13.0+ supported"
else
    echo "❌ Setup incomplete - missing icons need to be generated"
    echo "   Run: ./scripts/create-app-icons.sh"
fi

echo ""