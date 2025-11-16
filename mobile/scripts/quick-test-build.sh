#!/bin/bash

# Quick build script for testing - Founder Edition™
# This is the "just make it work" approach

set -e

echo "🚀 Quick Test Build for Stacks"
echo "=============================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Change to mobile directory
cd "$(dirname "$0")/.."

# Build Android APK (Always works, no certificates needed)
echo -e "${BLUE}Building Android APK...${NC}"
npx cap build android --androidreleasetype=APK

# Find and copy the APK
APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" | head -1)
if [ -f "$APK_PATH" ]; then
    cp "$APK_PATH" ../stacks-test.apk
    echo -e "${GREEN}✅ Android APK ready: stacks-test.apk${NC}"
else
    echo -e "${RED}❌ Android APK build failed${NC}"
fi

# For iOS, we'll use a different approach
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}For iOS testing:${NC}"
    echo "1. Run: npx cap open ios"
    echo "2. In Xcode: Product → Archive"
    echo "3. In Organizer: Distribute App → Development → Export"
    echo "4. This creates an IPA without needing certificates"
fi

echo ""
echo -e "${GREEN}📱 Ready to share!${NC}"
echo ""
echo "Upload your APK to:"
echo "• Diawi.com (no account needed)"
echo "• Google Drive (set to 'anyone with link')"
echo "• Dropbox (create shareable link)"
echo ""
echo "Testers just click the link and install!"