#!/bin/bash

# 🚀 iOS Setup Script for Stacks Library App
# Automated deployment script for real-device testing

set -e

echo "📱 STACKS iOS SETUP - Let's get your app on your iPhone!"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npx &> /dev/null; then
    print_error "npx is not installed. Please update Node.js."
    exit 1
fi

if ! command -v xcodebuild &> /dev/null; then
    print_error "Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

print_success "All prerequisites are installed!"

# Step 2: Get current IP address
print_status "Detecting network IP address..."
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n1 | awk '{print $2}')

if [ -z "$CURRENT_IP" ]; then
    print_error "Could not detect IP address. Please check your network connection."
    exit 1
fi

print_success "Current IP address: $CURRENT_IP"

# Step 3: Update configuration files
print_status "Updating configuration files with current IP..."

# Update Capacitor config
if [ -f "mobile/capacitor.config.ts" ]; then
    sed -i.bak "s|url: 'http://.*:3000'|url: 'http://$CURRENT_IP:3000'|" mobile/capacitor.config.ts
    print_success "Updated Capacitor config with IP: $CURRENT_IP"
else
    print_warning "Capacitor config not found at mobile/capacitor.config.ts"
fi

# Update API config
if [ -f "src/lib/api-config.ts" ]; then
    sed -i.bak "s|const devServerIp = '.*';|const devServerIp = '$CURRENT_IP';|" src/lib/api-config.ts
    print_success "Updated API config with IP: $CURRENT_IP"
else
    print_warning "API config not found at src/lib/api-config.ts"
fi

# Step 4: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 5: Build the Next.js app
print_status "Building Next.js app for iOS..."
npm run build

# Step 6: Fix iOS compatibility (RSC issue)
print_status "Fixing iOS compatibility..."
if [ -f "out/home.html" ]; then
    cp out/home.html ios/App/App/public/index.html
    print_success "Fixed RSC compatibility by copying home.html"
else
    print_warning "home.html not found in out/ directory"
fi

# Step 7: Sync with Capacitor
print_status "Syncing with Capacitor iOS project..."
cd mobile && npx cap sync ios
cd ..

print_success "Capacitor sync completed!"

# Step 8: Provide next steps
echo ""
echo "🎉 iOS SETUP COMPLETE!"
echo "=================================================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Open Xcode project:"
echo "   ${BLUE}npx cap open ios${NC}"
echo ""
echo "2. In Xcode:"
echo "   • Select your iPhone as target device"
echo "   • Go to Signing & Capabilities tab"
echo "   • Select your Apple Developer Team"
echo "   • Ensure Bundle Identifier is: com.stacks.library"
echo ""
echo "3. Start development servers in separate terminals:"
echo "   Terminal 1: ${BLUE}HOST=0.0.0.0 npm run dev${NC}"
echo "   Terminal 2: ${BLUE}HOST=0.0.0.0 npm run backend:dev${NC}"
echo ""
echo "4. Build and run in Xcode:"
echo "   • Product → Clean Build Folder (⇧⌘K)"
echo "   • Product → Run (⌘R)"
echo ""
echo "5. First time on device:"
echo "   • Settings → General → VPN & Device Management"
echo "   • Trust your developer certificate"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "• If build fails: Clean build folder and try again"
echo "• If network issues: Ensure iPhone and Mac on same WiFi"
echo "• If certificate issues: Check Apple Developer Portal"
echo ""
echo "📱 Current network IP: ${GREEN}$CURRENT_IP${NC}"
echo "🌐 Live reload URL: ${GREEN}http://$CURRENT_IP:3000${NC}"
echo ""
echo "Ready to deploy to your iPhone! 🚀"