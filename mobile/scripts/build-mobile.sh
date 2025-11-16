#!/bin/bash

# Build script for Stacks mobile app
# This script builds the Next.js app for mobile deployment

set -e

echo "🚀 Building Stacks for mobile..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Change to project root
cd "$(dirname "$0")/../.."

# Step 1: Clean previous builds
echo -e "${BLUE}Cleaning previous builds...${NC}"
rm -rf out
rm -rf mobile/ios/App/App/public
rm -rf mobile/android/app/src/main/assets/public

# Step 2: Build Next.js for production with static export
echo -e "${BLUE}Building Next.js app...${NC}"
npm run build

# Step 3: Sync with Capacitor
echo -e "${BLUE}Syncing with Capacitor...${NC}"
cd mobile
npx cap sync

# Step 4: Copy additional mobile-specific files if needed
echo -e "${BLUE}Finalizing mobile build...${NC}"

echo -e "${GREEN}✅ Mobile build complete!${NC}"
echo -e "${GREEN}Run 'npm run ios' or 'npm run android' from the mobile directory to test${NC}"