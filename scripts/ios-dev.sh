#!/bin/bash

# iOS Development Helper Script for Stacks
# Simplifies common iOS development tasks with Capacitor

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get local IP address
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "127.0.0.1"
    else
        # Linux
        hostname -I | awk '{print $1}' || echo "127.0.0.1"
    fi
}

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Update IP configuration
update_ip_config() {
    local ip=$(get_local_ip)
    print_message "$BLUE" "📍 Detected IP: $ip"
    
    # Update .env.local
    if [ -f .env.local ]; then
        sed -i.bak "s/NEXT_PUBLIC_DEV_SERVER_IP=.*/NEXT_PUBLIC_DEV_SERVER_IP=$ip/" .env.local
    else
        echo "NEXT_PUBLIC_DEV_SERVER_IP=$ip" > .env.local
    fi
    
    # Update capacitor.config.json
    if [ -f capacitor.config.json ]; then
        # Use a temporary file for the update
        jq --arg ip "$ip" '.server.url = "http://\($ip):3000"' capacitor.config.json > capacitor.config.json.tmp
        mv capacitor.config.json.tmp capacitor.config.json
    fi
    
    # Update mobile/capacitor.config.ts
    if [ -f mobile/capacitor.config.ts ]; then
        sed -i.bak "s|url: 'http://[0-9.]*:3000'|url: 'http://$ip:3000'|" mobile/capacitor.config.ts
    fi
    
    print_message "$GREEN" "✅ IP configuration updated to $ip"
}

# Start development servers
start_servers() {
    print_message "$BLUE" "🚀 Starting development servers..."
    
    # Check if servers are already running
    if lsof -i:3000 > /dev/null 2>&1; then
        print_message "$YELLOW" "⚠️ Next.js server already running on port 3000"
    else
        print_message "$GREEN" "Starting Next.js dev server..."
        npm run dev &
        sleep 5
    fi
    
    if lsof -i:3001 > /dev/null 2>&1; then
        print_message "$YELLOW" "⚠️ API server already running on port 3001"
    else
        print_message "$GREEN" "Starting API server..."
        npm run backend:dev &
        sleep 3
    fi
    
    print_message "$GREEN" "✅ Servers started"
}

# Build and sync iOS project
build_and_sync() {
    print_message "$BLUE" "📦 Building and syncing iOS project..."
    
    # Build Next.js
    print_message "$GREEN" "Building Next.js..."
    npm run build
    
    # Sync with Capacitor
    print_message "$GREEN" "Syncing with Capacitor..."
    npx cap sync ios
    
    print_message "$GREEN" "✅ Build and sync complete"
}

# Open in Xcode
open_xcode() {
    print_message "$BLUE" "📱 Opening in Xcode..."
    npx cap open ios
}

# Run on device/simulator
run_ios() {
    local target=${1:-""}
    
    if [ -z "$target" ]; then
        print_message "$BLUE" "📱 Running on default iOS device..."
        npx cap run ios
    else
        print_message "$BLUE" "📱 Running on iOS device: $target"
        npx cap run ios --target "$target"
    fi
}

# List available devices
list_devices() {
    print_message "$BLUE" "📱 Available iOS devices:"
    xcrun simctl list devices available | grep -E "iPhone|iPad"
}

# Setup AR permissions
setup_ar_permissions() {
    print_message "$BLUE" "🎯 Setting up AR permissions..."
    
    local plist_path="ios/App/App/Info.plist"
    
    if [ -f "$plist_path" ]; then
        # Check if camera permission exists
        if ! grep -q "NSCameraUsageDescription" "$plist_path"; then
            print_message "$YELLOW" "Adding camera permission..."
            # This is simplified - in production use PlistBuddy
            /usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'This app needs camera access for AR book scanning features'" "$plist_path" 2>/dev/null || true
        fi
        
        # Check if motion permission exists
        if ! grep -q "NSMotionUsageDescription" "$plist_path"; then
            print_message "$YELLOW" "Adding motion permission..."
            /usr/libexec/PlistBuddy -c "Add :NSMotionUsageDescription string 'This app needs motion tracking for AR features'" "$plist_path" 2>/dev/null || true
        fi
        
        print_message "$GREEN" "✅ AR permissions configured"
    else
        print_message "$RED" "❌ Info.plist not found at $plist_path"
    fi
}

# Clean and reset
clean_ios() {
    print_message "$BLUE" "🧹 Cleaning iOS build..."
    
    # Clean Xcode build
    if [ -d "ios/App" ]; then
        cd ios/App
        xcodebuild clean 2>/dev/null || true
        cd ../..
    fi
    
    # Remove derived data
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    
    # Clean Capacitor
    rm -rf ios/App/App/public
    rm -rf ios/App/Pods
    
    print_message "$GREEN" "✅ iOS build cleaned"
}

# Install/update pods
update_pods() {
    print_message "$BLUE" "📦 Updating CocoaPods..."
    
    if [ -d "ios/App" ]; then
        cd ios/App
        pod install --repo-update
        cd ../..
        print_message "$GREEN" "✅ Pods updated"
    else
        print_message "$RED" "❌ iOS project not found"
    fi
}

# Full setup
full_setup() {
    print_message "$BLUE" "🚀 Running full iOS development setup..."
    
    update_ip_config
    setup_ar_permissions
    build_and_sync
    update_pods
    start_servers
    
    print_message "$GREEN" "✅ Full setup complete!"
    print_message "$YELLOW" "\n📱 Next steps:"
    print_message "$NC" "1. Run: npm run ios:open"
    print_message "$NC" "2. Select your device in Xcode"
    print_message "$NC" "3. Click Play to run on device"
}

# Monitor logs
monitor_logs() {
    print_message "$BLUE" "📊 Monitoring iOS logs..."
    
    # Check if device is connected
    local device_id=$(xcrun simctl list devices | grep Booted | head -1 | grep -o '[A-F0-9-]*' | head -1)
    
    if [ -n "$device_id" ]; then
        print_message "$GREEN" "Monitoring device: $device_id"
        xcrun simctl spawn "$device_id" log stream --level debug --style compact
    else
        print_message "$YELLOW" "No booted simulator found. Showing system logs..."
        log stream --predicate 'processImagePath contains "Stacks"'
    fi
}

# Main command handler
case "${1:-help}" in
    setup)
        full_setup
        ;;
    start)
        update_ip_config
        start_servers
        ;;
    build)
        build_and_sync
        ;;
    open)
        open_xcode
        ;;
    run)
        run_ios "${2:-}"
        ;;
    devices)
        list_devices
        ;;
    clean)
        clean_ios
        ;;
    pods)
        update_pods
        ;;
    ar)
        setup_ar_permissions
        ;;
    ip)
        update_ip_config
        ;;
    logs)
        monitor_logs
        ;;
    monitor)
        python3 agents/ios-dev-agent.py monitor
        ;;
    fix)
        python3 agents/ios-dev-agent.py fix "${2:-}"
        ;;
    help|*)
        print_message "$BLUE" "📱 iOS Development Helper for Stacks\n"
        print_message "$NC" "Usage: ./scripts/ios-dev.sh [command] [options]\n"
        print_message "$NC" "Commands:"
        print_message "$GREEN" "  setup    " "$NC" "- Full iOS development setup"
        print_message "$GREEN" "  start    " "$NC" "- Start dev servers with correct IP"
        print_message "$GREEN" "  build    " "$NC" "- Build and sync iOS project"
        print_message "$GREEN" "  open     " "$NC" "- Open project in Xcode"
        print_message "$GREEN" "  run      " "$NC" "- Run on device/simulator"
        print_message "$GREEN" "  devices  " "$NC" "- List available devices"
        print_message "$GREEN" "  clean    " "$NC" "- Clean iOS build"
        print_message "$GREEN" "  pods     " "$NC" "- Update CocoaPods"
        print_message "$GREEN" "  ar       " "$NC" "- Setup AR permissions"
        print_message "$GREEN" "  ip       " "$NC" "- Update IP configuration"
        print_message "$GREEN" "  logs     " "$NC" "- Monitor device logs"
        print_message "$GREEN" "  monitor  " "$NC" "- Monitor development status"
        print_message "$GREEN" "  fix      " "$NC" "- Fix common issues"
        print_message "$GREEN" "  help     " "$NC" "- Show this help"
        ;;
esac