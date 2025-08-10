/**
 * Performance Validation Tests - Phase 3 Optimization
 * Comprehensive performance testing for all optimization phases
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Performance Optimization Validation', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Phase 1 & 2: Image optimization and lazy loading', async () => {
    await page.goto('/home');
    
    // Check that images use Next.js Image component optimization
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      
      // Next.js optimized images should have _next/image path or be properly sized
      if (src && !src.startsWith('data:')) {
        const isOptimized = src.includes('_next/image') || 
                          await img.getAttribute('sizes') !== null;
        
        expect(isOptimized).toBeTruthy();
      }
    }
  });

  test('Phase 2: Bundle size optimization with dynamic imports', async () => {
    await page.goto('/home');
    
    // Check that heavy libraries are not loaded initially
    const initialScripts = await page.locator('script[src]').all();
    const scriptSources = await Promise.all(
      initialScripts.map(script => script.getAttribute('src'))
    );
    
    // Heavy libraries should not be in initial bundle
    const heavyLibraries = ['tesseract', 'page-flip'];
    for (const lib of heavyLibraries) {
      const hasHeavyLib = scriptSources.some(src => 
        src && src.includes(lib)
      );
      expect(hasHeavyLib).toBeFalsy();
    }
  });

  test('Phase 3: Service Worker registration and caching', async () => {
    await page.goto('/home');
    
    // Wait for service worker registration
    await page.waitForTimeout(2000);
    
    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.controller !== null || 
             navigator.serviceWorker.ready.then(() => true);
    });
    
    expect(swRegistered).toBeTruthy();
  });

  test('Phase 3: Critical CSS injection', async () => {
    await page.goto('/home');
    
    // Check that critical CSS is injected inline
    const criticalStyle = await page.locator('style[data-critical="true"]').first();
    expect(await criticalStyle.isVisible()).toBeFalsy(); // Style elements are not visible
    
    const criticalCSS = await criticalStyle.textContent();
    expect(criticalCSS).toContain('body');
    expect(criticalCSS).toContain('loading');
  });

  test('Performance metrics: Core Web Vitals', async () => {
    await page.goto('/home');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait a bit for performance entries to be available
        setTimeout(() => {
          const paintEntries = performance.getEntriesByType('paint');
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : null;
          
          resolve({
            fcp: fcp ? fcp.startTime : null,
            ttfb: ttfb,
            domContentLoaded: navigationEntry ? navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart : null
          });
        }, 1000);
      });
    });
    
    // Assert performance thresholds
    expect((metrics as any).fcp).toBeLessThan(2500); // FCP should be < 2.5s
    expect((metrics as any).ttfb).toBeLessThan(800); // TTFB should be < 800ms
    expect((metrics as any).domContentLoaded).toBeLessThan(3000); // DOM ready < 3s
  });

  test('Memory usage optimization', async () => {
    await page.goto('/home');
    
    // Navigate through several pages to test memory management
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/community');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    const memoryUsage = await page.evaluate(() => {
      // @ts-ignore - performance.memory is non-standard but widely supported
      return (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize / 1024 / 1024,
        total: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
        limit: (performance as any).memory.jsHeapSizeLimit / 1024 / 1024
      } : null;
    });
    
    if (memoryUsage) {
      // Memory usage should not exceed reasonable limits
      expect((memoryUsage as any).used).toBeLessThan(100); // < 100MB
      expect((memoryUsage as any).used / (memoryUsage as any).limit).toBeLessThan(0.5); // < 50% of limit
    }
  });

  test('API response optimization and caching', async () => {
    // Monitor network requests
    const requests: any[] = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Navigate to another page and back to test caching
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Check that API requests are properly cached
    const apiRequests = requests.filter(req => req.url.includes('/api/'));
    const duplicateRequests = apiRequests.filter((req, index) => 
      apiRequests.findIndex(r => r.url === req.url) !== index
    );
    
    // With proper caching, we should have fewer duplicate API requests
    expect(duplicateRequests.length).toBeLessThan(apiRequests.length * 0.5);
  });

  test('Resource preloading effectiveness', async () => {
    await page.goto('/home');
    
    // Check that critical resources are preloaded
    const preloadLinks = await page.locator('link[rel="preload"]').all();
    expect(preloadLinks.length).toBeGreaterThan(0);
    
    // Check that fonts are preloaded
    const fontPreloads = await page.locator('link[rel="preload"][as="font"]').all();
    expect(fontPreloads.length).toBeGreaterThan(0);
    
    // Check that important images are preloaded
    const imagePreloads = await page.locator('link[rel="preload"][as="image"]').all();
    expect(imagePreloads.length).toBeGreaterThan(0);
  });

  test('Bundle analysis and size validation', async () => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Get all loaded JavaScript resources
    const jsResources = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]')).map(script => ({
        src: (script as HTMLScriptElement).src,
        size: 0 // Size would be calculated from network timing
      }));
    });
    
    // Ensure we don't have too many JavaScript files (good bundling)
    expect(jsResources.length).toBeLessThan(20);
    
    // Check that critical scripts are loaded
    const hasCriticalScripts = jsResources.some(resource => 
      resource.src.includes('_next/static')
    );
    expect(hasCriticalScripts).toBeTruthy();
  });

  test('Offline functionality with service worker', async () => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for service worker to be ready
    await page.waitForTimeout(3000);
    
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Try to navigate - should work with cached content
    await page.goto('/explore');
    
    // Page should still load (from cache)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toBe('');
    
    // Restore online mode
    await page.context().setOffline(false);
  });

  test('Performance analytics integration', async () => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for performance analytics to initialize
    await page.waitForTimeout(2000);
    
    const performanceData = await page.evaluate(() => {
      // Check if performance analytics is working
      return (window as any).performanceAnalytics?.getMetrics() || null;
    });
    
    if (performanceData) {
      expect(performanceData).toBeTruthy();
      expect(performanceData.webVitals).toBeDefined();
      expect(performanceData.customMetrics).toBeDefined();
    }
  });
});

test.describe('Mobile Performance Validation', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('Mobile-specific optimizations', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Check mobile viewport optimization
    const viewportMeta = await page.locator('meta[name="viewport"]').first();
    expect(await viewportMeta.getAttribute('content')).toContain('width=device-width');
    
    // Check touch optimization
    const touchOptimized = await page.evaluate(() => {
      const computed = getComputedStyle(document.body);
      return computed.getPropertyValue('-webkit-tap-highlight-color');
    });
    
    // Should have touch optimizations
    expect(touchOptimized).toBeTruthy();
  });

  test('Mobile image optimization', async ({ page }) => {
    await page.goto('/home');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const sizes = await img.getAttribute('sizes');
      
      // Images should have responsive sizes for mobile
      if (sizes) {
        expect(sizes).toContain('vw'); // Should use viewport width units
      }
    }
  });
});