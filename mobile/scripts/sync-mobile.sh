#!/bin/bash

# Sync script for Stacks mobile app
# This script syncs the web assets with native projects without rebuilding

set -e

echo "🔄 Syncing Stacks mobile..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to mobile directory
cd "$(dirname "$0")/.."

# Step 1: Copy web assets
echo -e "${BLUE}Copying web assets...${NC}"
npx cap copy

# Step 2: Update native projects
echo -e "${BLUE}Updating native projects...${NC}"
npx cap update

# Step 3: Sync plugins
echo -e "${BLUE}Syncing Capacitor plugins...${NC}"
npx cap sync --inline

echo -e "${GREEN}✅ Sync complete!${NC}"