#!/bin/bash

# One-command script to build and prepare apps for testing
# Perfect for founders who need to ship fast

set -e

echo "🚀 Stacks Mobile - Deploy to Testers"
echo "===================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Change to project root
cd "$(dirname "$0")/../.."

# Step 1: Build the web app
echo -e "${BLUE}Building web app...${NC}"
npm run build

# Step 2: Sync with mobile
echo -e "${BLUE}Syncing with Capacitor...${NC}"
cd mobile
npx cap sync

# Step 3: Build Android APK
echo -e "${BLUE}Building Android APK...${NC}"
cd android

# Build debug APK (no signing required)
./gradlew assembleDebug

# Copy APK to easy location
cp app/build/outputs/apk/debug/app-debug.apk ../../stacks-android.apk
echo -e "${GREEN}✅ Android APK ready at: stacks-android.apk${NC}"

cd ..

# Step 4: Build iOS (if on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}Building iOS app...${NC}"
    
    # Create archive directory
    mkdir -p ../build
    
    # Build iOS archive
    cd ios/App
    xcodebuild -workspace App.xcworkspace \
               -scheme App \
               -sdk iphoneos \
               -configuration Debug \
               -archivePath ../../../build/Stacks.xcarchive \
               archive \
               CODE_SIGN_IDENTITY="" \
               CODE_SIGNING_REQUIRED=NO \
               CODE_SIGNING_ALLOWED=NO
    
    # Create IPA from archive
    cd ../../..
    mkdir -p build/Payload
    cp -R build/Stacks.xcarchive/Products/Applications/App.app build/Payload/
    cd build
    zip -r ../stacks-ios.ipa Payload
    cd ..
    rm -rf build
    
    echo -e "${GREEN}✅ iOS IPA ready at: stacks-ios.ipa${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping iOS build (not on macOS)${NC}"
fi

# Step 5: Show next steps
echo ""
echo -e "${GREEN}🎉 Build complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Go to https://www.diawi.com"
echo "2. Upload the files:"
echo "   - Android: stacks-android.apk"
echo "   - iOS: stacks-ios.ipa"
echo "3. Diawi will give you a link to share with testers"
echo "4. Links expire in 72 hours"
echo ""
echo -e "${YELLOW}Pro tip: Save the Diawi links in your team Slack/Discord${NC}"