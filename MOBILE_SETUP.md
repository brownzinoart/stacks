# Mobile Development Setup Guide

## Important: Before Running on Mobile

### 1. Start the Development Server

Make sure your Next.js development server is running on all network interfaces:

```bash
npm run dev
```

The server should be accessible at `http://192.168.86.174:3000` (your computer's IP address).

### 2. Verify API Access

1. On your computer, visit: http://localhost:3000/test-search
2. Click "Test API" to ensure the OpenAI proxy is working

### 3. Configure Your Phone

Make sure your phone is on the same WiFi network as your computer.

### 4. Build and Run in Xcode

1. In Xcode, select your physical device (not simulator)
2. Click the Run button (▶️)
3. Trust the developer certificate on your iPhone if prompted:
   - Go to Settings > General > VPN & Device Management
   - Trust your developer certificate

### 5. Debugging Mobile Issues

The app now includes extensive logging. To view logs:

1. In Xcode, open the Debug Console (View > Debug Area > Show Debug Area)
2. Look for messages starting with `[Mobile Debug]`

### Common Issues and Solutions

#### "Cannot connect to server" Error

- Ensure your dev server is running (`npm run dev`)
- Check that your phone is on the same WiFi network
- Verify the IP address in `.env.local` matches your computer's current IP

#### "Network request failed" Error

- This usually means CORS or network connectivity issues
- Make sure the API URL includes your computer's IP, not localhost

#### Finding Your Computer's IP

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Testing the Fix

1. Open the app on your phone
2. Go to the Home page
3. Try searching by:
   - Selecting a mood button (FUNNY, MIND-BLOWING, etc.)
   - Or typing in the search box
4. Tap "Find Next Read"

The search should now work properly with clear error messages if something goes wrong.
