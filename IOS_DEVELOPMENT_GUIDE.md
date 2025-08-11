# 📱 iOS Development Guide for Stacks

Complete guide for developing, testing, and debugging the Stacks library app on iOS devices with live reload and AR features.

## 🚀 Quick Start

### One-Command Setup
```bash
npm run ios:setup
```
This command will:
- Configure your network IP
- Update all Capacitor configs
- Set up AR permissions
- Build and sync the iOS project
- Start development servers

## 📋 Prerequisites

- **macOS** with Xcode 15+ installed
- **iPhone** on same Wi-Fi network as your Mac
- **Apple Developer Account** (free tier works for device testing)
- **Node.js 18+** and npm installed

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run ios:setup` | Complete iOS development setup |
| `npm run ios:dev` | Start dev servers with correct IP binding |
| `npm run ios:build` | Build and sync iOS project |
| `npm run ios:open` | Open project in Xcode |
| `npm run ios:run` | Run on connected device/simulator |
| `npm run ios:sync` | Sync web assets to iOS project |
| `npm run ios:clean` | Clean iOS build and derived data |
| `npm run ios:logs` | Monitor device logs |
| `npm run ios:fix` | Fix common issues |
| `npm run ios:monitor` | Monitor development status |
| `npm run ios:ip` | Update IP configuration |

## 📱 Testing on Physical iPhone

### Step 1: Network Setup
```bash
# Automatically configure your IP
npm run ios:ip
```
Your iPhone must be on the same Wi-Fi network as your Mac.

### Step 2: Build and Sync
```bash
npm run ios:build
```

### Step 3: Open in Xcode
```bash
npm run ios:open
```

### Step 4: Configure Xcode
1. Select your iPhone from the device dropdown
2. If first time:
   - Sign in with Apple ID in Xcode → Settings → Accounts
   - Select your team in project settings

### Step 5: Trust Developer Certificate
On your iPhone:
1. Go to Settings → General → Device Management
2. Select Developer App
3. Trust the certificate

### Step 6: Run the App
Click the Play button in Xcode or:
```bash
npm run ios:run
```

## 🔄 Live Reload Setup

Live reload works automatically when properly configured:

1. **Ensure servers are running:**
   ```bash
   npm run ios:dev
   ```

2. **Verify configuration:**
   - Check `capacitor.config.json` has your IP
   - Confirm `.env.local` has `NEXT_PUBLIC_DEV_SERVER_IP`

3. **Test connection:**
   - Open Safari on iPhone
   - Navigate to `http://[YOUR_IP]:3000`
   - Should see your app

## 🎯 AR Features Setup

### Current Status
- ✅ Camera permissions configured
- ✅ QR code scanning ready
- ⚠️ WebXR not supported on iOS Safari
- ✅ Alternative: AR Quick Look for 3D models

### Implementation Strategy
Since WebXR isn't available on iOS Safari, we use:
1. **Capacitor Camera Plugin** for camera access
2. **QR Scanner** for book identification
3. **AR Quick Look** for 3D book previews
4. **Core ML** for on-device book recognition (future)

### Testing AR Features
1. Grant camera permissions when prompted
2. Navigate to Discovery → AR Shelf Scanner
3. Point at books/QR codes
4. View AR overlays

## 🐛 Troubleshooting

### Blank Screen on Device
```bash
npm run ios:fix blank_screen
```
Or manually:
1. Check Wi-Fi connection
2. Verify IP in `capacitor.config.json`
3. Run `npm run ios:sync`

### Build Errors
```bash
npm run ios:fix build_error
```
Or manually:
1. Clean build: `npm run ios:clean`
2. Update pods: `cd ios/App && pod install`
3. Delete DerivedData

### AR Not Working
```bash
npm run ios:fix ar_not_working
```
Check:
1. Camera permissions in Settings
2. Info.plist has required keys
3. Using Capacitor Camera plugin

### Live Reload Not Working
```bash
npm run ios:fix live_reload_broken
```
Verify:
1. Both devices on same network
2. Dev server accessible from phone
3. `cleartext: true` in config

## 📊 Monitoring & Debugging

### Real-time Monitoring
```bash
npm run ios:monitor
```
Shows:
- Server status
- Connected devices
- Build status
- Network info

### Device Logs
```bash
npm run ios:logs
```

### Safari Developer Tools
1. On iPhone: Settings → Safari → Advanced → Web Inspector ON
2. On Mac: Safari → Develop → [Your iPhone] → [App Name]
3. Use console, network inspector, element inspector

## 🏗️ Architecture

### File Structure
```
stacks/
├── ios/                    # Native iOS project
│   └── App/
│       ├── App.xcodeproj   # Xcode project
│       ├── App/            # Swift code & assets
│       └── Podfile         # CocoaPods dependencies
├── capacitor.config.json   # Root Capacitor config
├── mobile/
│   └── capacitor.config.ts # Mobile-specific config
├── agents/
│   └── ios-dev-agent.py    # iOS development automation
└── scripts/
    └── ios-dev.sh          # Shell scripts for iOS tasks
```

### Key Configurations

#### capacitor.config.json
```json
{
  "server": {
    "url": "http://YOUR_IP:3000",
    "cleartext": true,
    "allowNavigation": ["http://192.168.*.*:*"]
  }
}
```

#### Info.plist Permissions
```xml
<key>NSCameraUsageDescription</key>
<string>For AR book scanning</string>
<key>NSMotionUsageDescription</key>
<string>For AR tracking</string>
```

## 🚨 Important Notes

1. **Security**: Live reload uses HTTP (not HTTPS) for local development
2. **Performance**: Disable live reload for performance testing
3. **App Store**: Remove development server config before submission
4. **AR Limitations**: WebXR not available; use native plugins
5. **Network**: Both devices must be on same network

## 📚 Using the iOS Development Agent

The iOS Development Agent (`agents/ios-dev-agent.py`) provides intelligent automation:

### Setup Everything
```python
python3 agents/ios-dev-agent.py setup
```

### Fix Specific Issues
```python
python3 agents/ios-dev-agent.py fix blank_screen
python3 agents/ios-dev-agent.py fix build_error
python3 agents/ios-dev-agent.py fix ar_not_working
```

### Monitor Development
```python
python3 agents/ios-dev-agent.py monitor
```

## 🎉 Ready to Test!

After setup, you should be able to:
1. ✅ See live updates on your iPhone as you code
2. ✅ Test AR features with camera
3. ✅ Debug with Safari Developer Tools
4. ✅ Monitor performance and logs
5. ✅ Fix issues quickly with automated tools

## Need Help?

Run the fix command for common issues:
```bash
npm run ios:fix
```

Or check the agent for guidance:
```bash
python3 agents/ios-dev-agent.py help
```