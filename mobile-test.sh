#!/bin/bash

# Mobile Testing Script for Stacks App
# This script helps you test the app on mobile devices

echo "🚀 Stacks Mobile Testing Setup"
echo "================================="

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 Your local IP address: $LOCAL_IP"

echo ""
echo "🔧 Testing Options:"
echo "1. Web Browser on Mobile Device"
echo "2. iOS Simulator (if available)"
echo "3. Android Emulator"
echo "4. PWA Install Test"
echo ""

# Option 1: Web Browser Testing
echo "📱 Option 1: Mobile Browser Testing"
echo "   1. Start the dev server: npm run dev"
echo "   2. On your mobile device, open browser and go to:"
echo "      http://$LOCAL_IP:3000"
echo "   3. The app should load like a website"
echo ""

# Option 2: PWA Testing
echo "🌐 Option 2: PWA (Add to Home Screen) Testing"
echo "   1. Start the dev server: npm run dev"
echo "   2. On your mobile device, go to: http://$LOCAL_IP:3000"
echo "   3. In Safari (iOS) or Chrome (Android):"
echo "      - iOS: Share button → Add to Home Screen"
echo "      - Android: Menu → Add to Home Screen"
echo "   4. The app will appear as an icon on your home screen"
echo ""

# Option 3: Capacitor Mobile App
echo "📱 Option 3: Native Mobile App (Capacitor)"
echo "   1. Build the app: npm run build"
echo "   2. Go to mobile directory: cd mobile"
echo "   3. Sync to mobile platforms: npx cap sync"
echo "   4. Open in iOS: npx cap open ios"
echo "   5. Open in Android: npx cap open android"
echo ""

# Option 4: Live Development with Capacitor
echo "🔄 Option 4: Live Development (Capacitor + Dev Server)"
echo "   1. Update mobile/capacitor.config.ts:"
echo "      - Uncomment url line and set to: 'http://$LOCAL_IP:3000'"
echo "      - Uncomment cleartext: true line"
echo "   2. Start dev server: npm run dev"
echo "   3. Sync capacitor: cd mobile && npx cap sync"
echo "   4. Open mobile app: npx cap open ios (or android)"
echo "   5. App will connect to your live dev server"
echo ""

echo "💡 Tips:"
echo "   - Make sure your mobile device is on the same WiFi network"
echo "   - If you can't connect, check your firewall settings"
echo "   - For Capacitor native apps, you'll need Xcode (iOS) or Android Studio"
echo ""

read -p "Would you like to start the dev server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Starting development server..."
    npm run dev
fi