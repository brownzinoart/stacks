#!/bin/bash

# 🚀 One-Click Diawi Export Script
# This automates the iOS export process for testing

set -e

echo "📱 Stacks - Export for Diawi"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Change to mobile directory
cd "$(dirname "$0")/.."

# Step 1: Ensure we have a build
echo -e "${BLUE}Preparing build...${NC}"
cd ..
npm run build
cd mobile
npx cap sync ios

# Step 2: Create export options plist
echo -e "${BLUE}Creating export configuration...${NC}"
cat > ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>XXXXXXXXXX</string>
    <key>compileBitcode</key>
    <false/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

# Step 3: Build archive
echo -e "${BLUE}Building iOS archive (this takes 2-3 minutes)...${NC}"
cd ios/App

# Create archive
xcodebuild -workspace App.xcworkspace \
           -scheme App \
           -sdk iphoneos \
           -configuration Release \
           -archivePath ../../build/Stacks.xcarchive \
           archive \
           CODE_SIGN_STYLE=Automatic \
           DEVELOPMENT_TEAM="" \
           CODE_SIGN_IDENTITY="Apple Development" \
           -allowProvisioningUpdates

# Step 4: Export IPA
echo -e "${BLUE}Exporting IPA...${NC}"
cd ../..
xcodebuild -exportArchive \
           -archivePath build/Stacks.xcarchive \
           -exportPath build/DiawiExport \
           -exportOptionsPlist ExportOptions.plist \
           -allowProvisioningUpdates

# Step 5: Find the IPA
IPA_PATH=$(find build/DiawiExport -name "*.ipa" | head -1)

if [ -f "$IPA_PATH" ]; then
    # Copy to easy location
    cp "$IPA_PATH" ../Stacks-Test.ipa
    
    echo ""
    echo -e "${GREEN}✅ Success! IPA ready for Diawi${NC}"
    echo ""
    echo -e "${YELLOW}📤 Next Steps:${NC}"
    echo "1. Go to ${BLUE}www.diawi.com${NC}"
    echo "2. Drag this file: ${GREEN}Stacks-Test.ipa${NC}"
    echo "3. Click Upload"
    echo "4. Share the link with testers!"
    echo ""
    echo -e "${YELLOW}📱 Tester Instructions:${NC}"
    echo "- Open Diawi link on iPhone"
    echo "- Tap Install"
    echo "- Trust in Settings → General → Device Management"
    echo ""
    
    # Offer to open Diawi
    echo -e "${BLUE}Open Diawi.com now? (y/n)${NC}"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://www.diawi.com"
    fi
else
    echo -e "${RED}❌ Error: IPA export failed${NC}"
    echo "Try opening Xcode and doing it manually"
fi

# Cleanup
rm -f ExportOptions.plist
rm -rf build