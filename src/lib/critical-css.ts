/**
 * Critical CSS and Resource Preloading - Phase 3 Optimization
 * Extracts critical CSS and implements intelligent preloading strategies
 */

interface CriticalResource {
  href: string;
  as: string;
  type?: string;
  importance?: 'high' | 'low';
  crossorigin?: boolean;
}

interface PreloadConfig {
  fonts: string[];
  images: string[];
  scripts: string[];
  stylesheets: string[];
  routes: string[];
}

class CriticalResourceManager {
  private preloadedResources = new Set<string>();
  private intersectionObserver?: IntersectionObserver;
  private prefetchObserver?: IntersectionObserver;

  /**
   * Critical CSS for above-the-fold content
   */
  private criticalCSS = `
    /* Critical styles for immediate rendering */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #fff;
    }
    
    /* Navigation skeleton */
    nav {
      height: 64px;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    /* Loading states */
    .loading {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Above-the-fold layout */
    .hero-section {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    
    /* Mobile-first responsive */
    @media (max-width: 768px) {
      .hero-section {
        min-height: 50vh;
        padding: 1rem;
      }
    }
    
    /* Prevent layout shift */
    img, video, iframe {
      max-width: 100%;
      height: auto;
    }
    
    /* Focus states for accessibility */
    button:focus,
    a:focus,
    input:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `;

  /**
   * Initialize critical resource loading
   */
  init(): void {
    if (typeof window === 'undefined') return;

    // Inject critical CSS immediately
    this.injectCriticalCSS();
    
    // Set up resource preloading
    this.setupResourcePreloading();
    
    // Set up intersection observers for lazy loading
    this.setupIntersectionObservers();
    
    // Preload critical resources based on current route
    this.preloadCriticalResources();
  }

  /**
   * Inject critical CSS inline to prevent render blocking
   */
  private injectCriticalCSS(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = this.criticalCSS;
    styleElement.setAttribute('data-critical', 'true');
    
    // Insert before any existing stylesheets
    const firstStylesheet = document.querySelector('link[rel="stylesheet"]');
    if (firstStylesheet) {
      document.head.insertBefore(styleElement, firstStylesheet);
    } else {
      document.head.appendChild(styleElement);
    }
  }

  /**
   * Preload critical resources based on current page
   */
  private preloadCriticalResources(): void {
    const currentPath = window.location.pathname;
    const config = this.getPreloadConfig(currentPath);

    // Preload fonts first (highest priority)
    config.fonts.forEach(font => this.preloadResource({
      href: font,
      as: 'font',
      type: 'font/woff2',
      importance: 'high',
      crossorigin: true
    }));

    // Preload critical images
    config.images.forEach(image => this.preloadResource({
      href: image,
      as: 'image',
      importance: 'high'
    }));

    // Preload route-specific resources
    setTimeout(() => {
      config.routes.forEach(route => this.prefetchRoute(route));
    }, 1000); // Delay to avoid blocking initial load
  }

  /**
   * Get preload configuration for specific routes
   */
  private getPreloadConfig(path: string): PreloadConfig {
    const baseConfig: PreloadConfig = {
      fonts: [
        // Note: Next.js font optimization handles Inter fonts automatically
        // Removing manual font preloading to avoid 404s
      ],
      images: [
        '/icon-192.png',
        '/icon-512.png'
      ],
      scripts: [],
      stylesheets: [],
      routes: []
    };

    // Route-specific configurations
    const routeConfigs: Record<string, Partial<PreloadConfig>> = {
      '/home': {
        images: ['/avatar.png', '/hero-bg.jpg'],
        routes: ['/explore', '/stacks-recommendations']
      },
      '/explore': {
        routes: ['/community', '/discover'],
        scripts: ['/_next/static/chunks/pages/explore.js']
      },
      '/discover': {
        scripts: [
          '/_next/static/chunks/ar-service.js',
          '/_next/static/chunks/tesseract.js'
        ]
      },
      '/community': {
        routes: ['/profile', '/home']
      }
    };

    const routeConfig = routeConfigs[path] || {};
    
    return {
      fonts: [...baseConfig.fonts, ...(routeConfig.fonts || [])],
      images: [...baseConfig.images, ...(routeConfig.images || [])],
      scripts: [...baseConfig.scripts, ...(routeConfig.scripts || [])],
      stylesheets: [...baseConfig.stylesheets, ...(routeConfig.stylesheets || [])],
      routes: [...baseConfig.routes, ...(routeConfig.routes || [])]
    };
  }

  /**
   * Preload a specific resource
   */
  private preloadResource(resource: CriticalResource): void {
    if (this.preloadedResources.has(resource.href)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) {
      link.type = resource.type;
    }
    
    if (resource.importance) {
      link.setAttribute('importance', resource.importance);
    }
    
    if (resource.crossorigin) {
      link.crossOrigin = 'anonymous';
    }

    // Add error handling
    link.onerror = () => {
      console.warn('[Critical CSS] Failed to preload:', resource.href);
    };

    document.head.appendChild(link);
    this.preloadedResources.add(resource.href);
  }

  /**
   * Prefetch a route for faster navigation
   */
  private prefetchRoute(route: string): void {
    if (this.preloadedResources.has(route)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    
    link.onerror = () => {
      console.warn('[Critical CSS] Failed to prefetch route:', route);
    };

    document.head.appendChild(link);
    this.preloadedResources.add(route);
  }

  /**
   * Set up resource preloading based on user interaction
   */
  private setupResourcePreloading(): void {
    // Preload on hover for better perceived performance
    document.addEventListener('mouseover', (event) => {
      const target = event.target as Element;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && link.origin === window.location.origin) {
        this.prefetchRoute(link.pathname);
      }
    }, { passive: true });

    // Preload on focus for keyboard navigation
    document.addEventListener('focusin', (event) => {
      const target = event.target as Element;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && link.origin === window.location.origin) {
        this.prefetchRoute(link.pathname);
      }
    }, { passive: true });

    // Intelligent preloading based on viewport
    this.setupViewportBasedPreloading();
  }

  /**
   * Set up intersection observers for lazy loading and prefetching
   */
  private setupIntersectionObservers(): void {
    // Lazy loading observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadLazyResource(element);
            this.intersectionObserver?.unobserve(element);
          }
        });
      },
      { rootMargin: '50px 0px' } // Load 50px before element enters viewport
    );

    // Prefetch observer for links
    this.prefetchObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            if (link.href && link.origin === window.location.origin) {
              this.prefetchRoute(link.pathname);
            }
          }
        });
      },
      { rootMargin: '200px 0px' } // Prefetch when link is 200px away
    );

    // Observe all lazy images and links
    this.observeLazyElements();
  }

  /**
   * Observe elements for lazy loading
   */
  private observeLazyElements(): void {
    // Observe lazy images
    document.querySelectorAll('img[data-src], iframe[data-src]').forEach(element => {
      this.intersectionObserver?.observe(element);
    });

    // Observe links for prefetching
    document.querySelectorAll('a[href]').forEach(element => {
      this.prefetchObserver?.observe(element);
    });
  }

  /**
   * Load a lazy resource when it enters viewport
   */
  private loadLazyResource(element: HTMLElement): void {
    const dataSrc = element.getAttribute('data-src');
    
    if (dataSrc) {
      if (element.tagName === 'IMG') {
        const img = element as HTMLImageElement;
        img.src = dataSrc;
        img.removeAttribute('data-src');
      } else if (element.tagName === 'IFRAME') {
        const iframe = element as HTMLIFrameElement;
        iframe.src = dataSrc;
        iframe.removeAttribute('data-src');
      }
    }
  }

  /**
   * Set up viewport-based intelligent preloading
   */
  private setupViewportBasedPreloading(): void {
    // Preload resources when user is idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.preloadNonCriticalResources();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preloadNonCriticalResources();
      }, 2000);
    }
  }

  /**
   * Preload non-critical resources during idle time
   */
  private preloadNonCriticalResources(): void {
    const nonCriticalResources = [
      // Note: Specific chunk names vary in development, so we'll skip preloading JS chunks
      // { href: '/_next/static/chunks/commons.js', as: 'script' }, // Removed - chunk doesn't exist
      { href: '/api/books/trending', as: 'fetch' },
      { href: '/manifest.json', as: 'manifest' }
    ];

    nonCriticalResources.forEach(resource => {
      this.preloadResource(resource as CriticalResource);
    });
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.intersectionObserver?.disconnect();
    this.prefetchObserver?.disconnect();
  }

  /**
   * Get preloading statistics
   */
  getStats(): { preloadedCount: number; preloadedResources: string[] } {
    return {
      preloadedCount: this.preloadedResources.size,
      preloadedResources: Array.from(this.preloadedResources)
    };
  }
}

// Export singleton instance
export const criticalResourceManager = new CriticalResourceManager();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      criticalResourceManager.init();
    });
  } else {
    criticalResourceManager.init();
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    criticalResourceManager.cleanup();
  });
}