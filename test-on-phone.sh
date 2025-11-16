#!/bin/bash

# The "Get Grandma Testing in 30 Seconds" Script
# This starts a web server that anyone on your WiFi can access

echo "📱 Stacks Library - Phone Testing Made Easy!"
echo "=========================================="
echo ""

# Get local IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
else
    # Linux
    LOCAL_IP=$(hostname -I | cut -d' ' -f1)
fi

# Start the development server
echo "Starting your app..."
echo ""
echo "📲 TO TEST ON ANY PHONE:"
echo ""
echo "1. Make sure the phone is on the same WiFi as this computer"
echo ""
echo "2. Open this link on the phone:"
echo "   👉 http://$LOCAL_IP:3000"
echo ""
echo "3. For iPhone: Add to Home Screen to make it feel like an app!"
echo "   (Share button → Add to Home Screen)"
echo ""
echo "4. For Android: Menu → Add to Home Screen"
echo ""
echo "🎯 Share this link with testers: http://$LOCAL_IP:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Next.js with host binding
npm run dev -- -H 0.0.0.0