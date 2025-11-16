#!/bin/bash

# 🎯 Super Simple Diawi Export
# The "just make it work" version

echo "📱 Quick Export for Diawi"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Step 1: Open Xcode
echo -e "${BLUE}Step 1: Opening Xcode...${NC}"
cd "$(dirname "$0")/.."
open ios/App/App.xcworkspace

echo ""
echo -e "${YELLOW}📋 MANUAL STEPS IN XCODE:${NC}"
echo ""
echo "1. Top bar: Select ${GREEN}'Any iOS Device (arm64)'${NC}"
echo ""
echo "2. Menu: ${GREEN}Product → Archive${NC}"
echo "   (Wait 2-3 minutes for build)"
echo ""
echo "3. In Organizer window:"
echo "   - Click ${GREEN}'Distribute App'${NC}"
echo "   - Choose ${GREEN}'Development'${NC}"
echo "   - Choose ${GREEN}'Export'${NC}"
echo "   - Keep clicking ${GREEN}'Next'${NC}"
echo "   - Save to ${GREEN}Desktop${NC}"
echo ""
echo "4. You'll get a folder with the .ipa file inside"
echo ""
echo -e "${BLUE}Press Enter when you have the IPA file...${NC}"
read

# Step 2: Help find the IPA
echo -e "${BLUE}Looking for your IPA file...${NC}"

# Check common locations
DESKTOP_IPA=$(find ~/Desktop -name "*.ipa" -mtime -1 2>/dev/null | head -1)
DOWNLOADS_IPA=$(find ~/Downloads -name "*.ipa" -mtime -1 2>/dev/null | head -1)

if [ -n "$DESKTOP_IPA" ]; then
    echo -e "${GREEN}✅ Found IPA: $DESKTOP_IPA${NC}"
    IPA_PATH="$DESKTOP_IPA"
elif [ -n "$DOWNLOADS_IPA" ]; then
    echo -e "${GREEN}✅ Found IPA: $DOWNLOADS_IPA${NC}"
    IPA_PATH="$DOWNLOADS_IPA"
else
    echo -e "${YELLOW}Couldn't find the IPA automatically${NC}"
    echo "Drag the IPA file here and press Enter:"
    read IPA_PATH
fi

# Step 3: Open Diawi
echo ""
echo -e "${GREEN}✅ Ready for Diawi!${NC}"
echo ""
echo -e "${BLUE}Opening Diawi.com...${NC}"
open "https://www.diawi.com"

echo ""
echo -e "${YELLOW}📤 FINAL STEPS:${NC}"
echo "1. Drag this file to Diawi: ${GREEN}$IPA_PATH${NC}"
echo "2. Leave all settings as default"
echo "3. Click Upload"
echo "4. Wait 30 seconds for your link!"
echo ""
echo -e "${YELLOW}📱 SHARE WITH TESTERS:${NC}"
echo "\"Install my app in 60 seconds:"
echo "1. Open [diawi-link] on your iPhone"
echo "2. Tap Install"
echo "3. Go to Settings → General → Device Management → Trust"
echo "4. Open Stacks!\""
echo ""
echo -e "${GREEN}That's it! Your testers will have the app in 1 minute.${NC}"