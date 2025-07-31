# Mobile App Troubleshooting Guide

## Common iOS Issues and Solutions

### 1. White/Blank Screen on Launch

**Issue**: App launches but shows a white screen
**Solutions**:

- Check the browser console in Safari Web Inspector
- Ensure all static assets are properly built: `cd .. && npm run build`
- Verify the `webDir` in `capacitor.config.ts` points to `../out`
- Re-sync: `npx cap sync ios`

### 2. Navigation Not Working

**Issue**: Clicking links doesn't navigate
**Solutions**:

- The app uses client-side routing, ensure all links use Next.js `Link` component
- Check for JavaScript errors in Safari Web Inspector
- Verify static export includes all routes

### 3. Images Not Loading

**Issue**: Images show broken links
**Solutions**:

- Images need to be in the `public` directory
- Use absolute paths starting with `/` (e.g., `/avatar.png`)
- For remote images, ensure domains are whitelisted in Next.js config

### 4. API Calls Failing

**Issue**: Network requests fail with CORS or connection errors
**Solutions**:

- Mobile apps need absolute URLs for API calls
- Update `.env.local` with production API URLs
- Backend server must allow the Capacitor origin
- Consider using Capacitor HTTP plugin for native requests

### 5. Build Errors

#### Pod Install Failures

```bash
cd ios/App
pod deintegrate
pod install
```

#### Xcode Build Failures

- Open in Xcode: `npx cap open ios`
- Clean build folder: Product → Clean Build Folder
- Update deployment target to iOS 13.0 or higher

### 6. Simulator Issues

#### Simulator Not Starting

```bash
# Reset simulator
xcrun simctl erase all

# Boot specific simulator
xcrun simctl boot "E64714C8-B934-406D-971D-942621C17379"
```

#### App Not Installing

```bash
# Clean and rebuild
rm -rf ios/App/build
npx cap sync ios
npx cap run ios
```

## Android-Specific Issues

### 1. Gradle Build Failures

```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### 2. Emulator Not Found

- Ensure Android Studio and emulator are installed
- Create AVD in Android Studio
- Start emulator before running: `npx cap run android`

### 3. API Level Issues

- Update `minSdkVersion` in `android/variables.gradle`
- Recommended: API 24 (Android 7.0) or higher

## Debugging Tools

### iOS Safari Web Inspector

1. On simulator: Settings → Safari → Advanced → Web Inspector ON
2. On Mac: Safari → Develop → Simulator → App
3. Use console and network tabs to debug

### Android Chrome DevTools

1. Run app on device/emulator
2. Chrome → chrome://inspect
3. Click "inspect" next to your app

## Performance Tips

1. **Reduce Bundle Size**
   - Use dynamic imports for heavy components
   - Optimize images before building
   - Remove unused dependencies

2. **Improve Load Time**
   - Implement proper loading states
   - Use React.lazy() for code splitting
   - Cache API responses

3. **Native Feel**
   - Add haptic feedback for interactions
   - Use native transitions
   - Implement pull-to-refresh

## Getting Help

If issues persist:

1. Check Capacitor logs: `npx cap doctor`
2. Review iOS logs in Xcode console
3. Check Android logs: `adb logcat`
4. Visit Capacitor docs: https://capacitorjs.com/docs
