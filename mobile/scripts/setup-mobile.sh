#!/bin/bash

# Quick setup script for mobile development
# This helps testers get started quickly

set -e

echo "📱 Setting up Stacks Mobile..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    fi
}

echo -e "${BLUE}Checking prerequisites...${NC}"
check_command node
check_command npm

# Platform-specific checks
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}Checking iOS development tools...${NC}"
    if check_command xcodebuild; then
        echo -e "${GREEN}✓ Xcode is installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Xcode not found - iOS development won't be available${NC}"
    fi
    
    if check_command pod; then
        echo -e "${GREEN}✓ CocoaPods is installed${NC}"
    else
        echo -e "${YELLOW}⚠️  CocoaPods not found - installing...${NC}"
        sudo gem install cocoapods
    fi
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
cd "$(dirname "$0")/../.."
npm install

cd mobile
npm install

# iOS-specific setup
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
    echo -e "${BLUE}Setting up iOS project...${NC}"
    cd ios
    pod install
    cd ..
fi

# Build the web app
echo -e "${BLUE}Building web app for mobile...${NC}"
cd ..
npm run build

# Sync with Capacitor
echo -e "${BLUE}Syncing with Capacitor...${NC}"
cd mobile
npx cap sync

echo -e "${GREEN}✅ Mobile setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Copy .env.mobile to .env.local and update with your API keys"
echo "2. For iOS: Run 'npm run ios' from the mobile directory"
echo "3. For Android: Run 'npm run android' from the mobile directory"
echo ""
echo -e "${YELLOW}Note: Make sure you have an iOS simulator or Android emulator running${NC}"