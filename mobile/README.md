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

### Building for Testing

#### iOS (TestFlight)

1. Open Xcode: `npm run open:ios`
2. Select "Any iOS Device" as build target
3. Product → Archive
4. Distribute App → App Store Connect → Upload

#### Android (Google Play)

1. Build release APK/AAB:

```bash
npm run build:android:release
```

2. The APK/AAB will be in `android/app/build/outputs/`

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
