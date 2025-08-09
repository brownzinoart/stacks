#!/usr/bin/env node

/**
 * iOS Deployment Readiness Test
 * Validates that all critical iOS deployment requirements are met
 */

const fs = require('fs');
const path = require('path');

console.log('🍎 Testing iOS Deployment Readiness...\n');

const tests = [];

// Test 1: Service Worker exists
tests.push({
  name: 'Service Worker',
  check: () => fs.existsSync('public/sw.js'),
  description: 'Service worker file exists for offline functionality',
});

// Test 2: App icons exist
tests.push({
  name: 'App Icons',
  check: () => fs.existsSync('public/icon-192.png') && fs.existsSync('public/icon-512.png'),
  description: 'Required app icons (192px, 512px) exist',
});

// Test 3: Manifest exists
tests.push({
  name: 'PWA Manifest',
  check: () => fs.existsSync('public/manifest.json'),
  description: 'PWA manifest file exists',
});

// Test 4: Capacitor config exists
tests.push({
  name: 'Capacitor Config',
  check: () => fs.existsSync('capacitor.config.json'),
  description: 'Capacitor configuration file exists',
});

// Test 5: Build output exists
tests.push({
  name: 'Build Output',
  check: () => fs.existsSync('out') && fs.existsSync('out/index.html'),
  description: 'Static build output exists',
});

// Test 6: Check manifest content
tests.push({
  name: 'Manifest Configuration',
  check: () => {
    try {
      const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
      return manifest.display === 'standalone' && manifest.name && manifest.icons && manifest.icons.length > 0;
    } catch {
      return false;
    }
  },
  description: 'Manifest has proper PWA configuration',
});

// Test 7: Check Capacitor iOS config
tests.push({
  name: 'Capacitor iOS Config',
  check: () => {
    try {
      const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
      return config.ios && config.ios.preferredContentMode === 'mobile' && config.webDir === 'out';
    } catch {
      return false;
    }
  },
  description: 'Capacitor has proper iOS configuration',
});

// Test 8: Next.js config for static export
tests.push({
  name: 'Next.js Export Config',
  check: () => {
    try {
      const configContent = fs.readFileSync('next.config.js', 'utf8');
      return configContent.includes("output: 'export'") && configContent.includes('unoptimized: true');
    } catch {
      return false;
    }
  },
  description: 'Next.js configured for static export with proper image settings',
});

// Test 9: iOS-specific meta tags in layout
tests.push({
  name: 'iOS Meta Tags',
  check: () => {
    try {
      const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
      return (
        layoutContent.includes('apple-mobile-web-app-capable') &&
        layoutContent.includes('apple-touch-icon') &&
        layoutContent.includes('viewport')
      );
    } catch {
      return false;
    }
  },
  description: 'Layout includes required iOS meta tags',
});

// Test 10: Service worker registration
tests.push({
  name: 'Service Worker Registration',
  check: () => {
    try {
      const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
      return layoutContent.includes('serviceWorker.register') && layoutContent.includes('/sw.js');
    } catch {
      return false;
    }
  },
  description: 'Service worker is registered in layout',
});

// Run tests
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const result = test.check();
  const status = result ? '✅ PASS' : '❌ FAIL';
  const number = (index + 1).toString().padStart(2, '0');

  console.log(`${number}. ${status} ${test.name}`);
  console.log(`    ${test.description}`);

  if (!result) {
    failed++;
  } else {
    passed++;
  }
  console.log('');
});

// Summary
console.log('📊 Test Summary');
console.log('================');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total:  ${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your app is ready for iOS deployment.');
  console.log('\nNext steps:');
  console.log('1. Run: npx cap run ios');
  console.log('2. Test on iOS Simulator');
  console.log('3. Test on physical device');
  console.log('4. Deploy to TestFlight');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before deploying.');
  process.exit(1);
}
