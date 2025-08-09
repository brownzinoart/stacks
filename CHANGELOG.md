# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### iOS Deployment Readiness

- Complete iOS app icon set implemented (20px to 1024px for all iOS devices)
- iOS-specific Capacitor configuration optimized
- Camera usage permissions configured for AR book spine scanning
- Service worker implementation for iOS PWA functionality
- iOS meta tags and viewport configuration added
- Security headers configured for iOS compatibility
- Successfully tested on iOS simulator and physical devices
- PWA manifest optimized for iOS installation

### Performance Optimizations

- Enabled Next.js built-in image optimization for faster image loading
- Added React.memo to BookCover component to prevent unnecessary re-renders
- Replaced axios with native fetch API to reduce bundle size
- Implemented useMemo for expensive similarity calculations
- Added dynamic imports for heavy components to improve initial page load
- Fixed event listener cleanup to prevent memory leaks

### iOS Deployment Status

✅ **Production Ready** - All requirements met for TestFlight/App Store submission:

- App ID configured: `com.stacks.library`
- Complete icon set and launch screens
- Native iOS features integrated via Capacitor
- PWA functionality verified on iOS devices
- Camera permissions for future AR features

### Expected Benefits

- Reduced initial bundle size by removing axios dependency
- Faster image loading with Next.js optimization
- Improved runtime performance with memoization
- Better memory management and reduced memory leaks
- Faster initial page loads through code splitting
- Native iOS app ready for App Store distribution

### Developer Notes

- All HTTP requests now use native fetch API
- BookCover component is memoized - ensure props are stable
- Event listeners properly cleaned up in useEffect hooks
- Dynamic imports used for components not needed immediately
- iOS builds use static files (server config commented out for production)
