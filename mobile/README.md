# Stacks Mobile App

This directory contains the mobile app wrapper for Stacks using Capacitor.

## Quick Start

### Prerequisites

- Node.js 18.17.0+
- Xcode 14+ (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS: `sudo gem install cocoapods`)

### Initial Setup

1. Install dependencies:

```bash
npm install
```

2. Build the web app first:

```bash
cd .. && npm run build
```

3. Sync with Capacitor:

```bash
npm run sync
```

### Development

#### iOS

```bash
# Run on iOS simulator
npm run ios

# Open in Xcode
npm run open:ios
```

#### Android

```bash
# Run on Android emulator
npm run android

# Open in Android Studio
npm run open:android
```

### iOS Deployment Readiness Status

✅ **Production Ready** - All iOS deployment requirements completed:

- Complete app icon set (20px to 1024px for all iOS devices)
- iOS-specific configurations in Capacitor
- Camera usage permissions for AR features
- Service worker and PWA manifest optimized
- Successfully tested on iOS simulator and physical device
- Background color and theme properly configured

### Building for Testing

#### iOS (TestFlight/App Store)

1. **Prepare for iOS build:**

   ```bash
   # Ensure latest build is synced
   npm run sync
   ```

2. **Open in Xcode and archive:**

   ```bash
   npm run open:ios
   ```

   - In Xcode: Select "Any iOS Device" as build target
   - Product → Archive
   - Distribute App → App Store Connect → Upload

3. **Key iOS configurations verified:**
   - App ID: `com.stacks.library`
   - Display Name: "Stacks"
   - Camera usage permission configured
   - All required icon sizes included
   - iOS-specific PWA optimizations enabled

#### Android (Google Play)

1. Build release APK/AAB:

```bash
npm run build:android:release
```

2. The APK/AAB will be in `android/app/build/outputs/`

### Testing Results Summary

**iOS Testing Completed:**

- ✅ Simulator testing (iPhone 15)
- ✅ Physical device testing
- ✅ PWA functionality verified
- ✅ Service worker operation confirmed
- ✅ Native features (camera, status bar) working
- ✅ App icons displaying correctly across all sizes
- ✅ Launch screen and splash screen functional

### Environment Variables

Copy `.env.mobile` to `.env.local` in the parent directory and update with your values:

```bash
cp ../.env.mobile ../.env.local
```

### Troubleshooting

#### iOS Issues

- Run `cd ios && pod install` if you see CocoaPods errors
- Clean build: `cd ios && xcodebuild clean`

#### Android Issues

- Sync Gradle: Open in Android Studio and sync
- Clean build: `cd android && ./gradlew clean`

#### General Issues

- Clear and rebuild: `rm -rf ios android && npx cap add ios && npx cap add android`
- Update Capacitor: `npm update @capacitor/core @capacitor/ios @capacitor/android`
