/**
 * Smart Page Preloading System for iOS App
 * Preloads adjacent pages for instant navigation
 */

interface PreloadedPage {
  href: string
  html: string | null
  timestamp: number
  priority: 'high' | 'medium' | 'low'
}

interface PreloadConfig {
  maxCacheSize: number
  cacheExpiryMs: number
  preloadDelayMs: number
}

class IOSPreloader {
  private cache = new Map<string, PreloadedPage>()
  private preloadQueue = new Set<string>()
  private isPreloading = false
  
  private config: PreloadConfig = {
    maxCacheSize: 5, // Keep 5 pages in cache
    cacheExpiryMs: 5 * 60 * 1000, // 5 minutes
    preloadDelayMs: 1000 // Wait 1s after initial load
  }

  // Tab navigation order for intelligent preloading
  private readonly tabOrder = [
    '/',
    '/home',
    '/learn',
    '/discover', 
    '/mystacks',
    '/stackstalk'
  ]

  constructor() {
    this.init()
  }

  private init() {
    if (typeof window === 'undefined') return

    // Start preloading after initial page load
    setTimeout(() => {
      this.preloadAdjacentPages()
    }, this.config.preloadDelayMs)

    // Clean up cache periodically
    setInterval(() => {
      this.cleanExpiredCache()
    }, 60000) // Every minute
  }

  /**
   * Check if running in Capacitor environment
   */
  private isCapacitor(): boolean {
    if (typeof window === 'undefined') return false
    return !!(
      window.Capacitor ||
      (window as any).Capacitor ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:'
    )
  }

  /**
   * Get current page path
   */
  private getCurrentPath(): string {
    if (typeof window === 'undefined') return '/'
    
    const path = window.location.pathname
    // Handle Capacitor paths like /home/index.html
    return path.replace('/index.html', '') || '/'
  }

  /**
   * Convert path to Capacitor HTML file path
   */
  private pathToHtmlFile(path: string): string {
    if (!this.isCapacitor()) return path
    
    // Convert /path to /path/index.html for Capacitor
    if (path === '/') return '/index.html'
    return `${path}/index.html`
  }

  /**
   * Get adjacent pages based on current page
   */
  private getAdjacentPages(currentPath: string): string[] {
    const currentIndex = this.tabOrder.findIndex(path => 
      currentPath === path || currentPath.includes(path.slice(1))
    )
    
    if (currentIndex === -1) return this.tabOrder.slice(0, 3)
    
    const adjacent: string[] = []
    
    // Add previous page
    if (currentIndex > 0) {
      const prevPage = this.tabOrder[currentIndex - 1]
      if (prevPage) adjacent.push(prevPage)
    }
    
    // Add next page  
    if (currentIndex < this.tabOrder.length - 1) {
      const nextPage = this.tabOrder[currentIndex + 1]
      if (nextPage) adjacent.push(nextPage)
    }
    
    // Add one more page in each direction for better UX
    if (currentIndex > 1) {
      const prevPage2 = this.tabOrder[currentIndex - 2]
      if (prevPage2) adjacent.push(prevPage2)
    }
    if (currentIndex < this.tabOrder.length - 2) {
      const nextPage2 = this.tabOrder[currentIndex + 2]
      if (nextPage2) adjacent.push(nextPage2)
    }
    
    return adjacent.filter(path => path !== currentPath)
  }

  /**
   * Preload a single page
   */
  private async preloadPage(path: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
    const htmlPath = this.pathToHtmlFile(path)
    
    // Skip if already cached or in queue
    if (this.cache.has(htmlPath) || this.preloadQueue.has(htmlPath)) {
      return
    }

    this.preloadQueue.add(htmlPath)

    try {
      // Use different strategies based on environment
      if (this.isCapacitor()) {
        await this.preloadCapacitorPage(htmlPath, priority)
      } else {
        await this.preloadWebPage(htmlPath, priority)
      }
    } catch (error) {
      console.warn(`Failed to preload ${htmlPath}:`, error)
    } finally {
      this.preloadQueue.delete(htmlPath)
    }
  }

  /**
   * Preload for Capacitor environment
   */
  private async preloadCapacitorPage(htmlPath: string, priority: 'high' | 'medium' | 'low'): Promise<void> {
    try {
      const response = await fetch(htmlPath, {
        method: 'GET',
        cache: 'force-cache'
      })
      
      if (response.ok) {
        const html = await response.text()
        this.cache.set(htmlPath, {
          href: htmlPath,
          html,
          timestamp: Date.now(),
          priority
        })
      }
    } catch (error) {
      // Fallback to link prefetch
      this.addPrefetchLink(htmlPath)
    }
  }

  /**
   * Preload for web environment
   */
  private async preloadWebPage(path: string, priority: 'high' | 'medium' | 'low'): Promise<void> {
    // Use link prefetch for web
    this.addPrefetchLink(path)
    
    // Cache entry for consistency
    this.cache.set(path, {
      href: path,
      html: null, // Will be loaded by browser
      timestamp: Date.now(),
      priority
    })
  }

  /**
   * Add prefetch link to document head
   */
  private addPrefetchLink(href: string): void {
    if (typeof document === 'undefined') return

    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    link.crossOrigin = 'anonymous'
    
    // Add to head
    document.head.appendChild(link)
    
    // Remove after cache period to keep DOM clean
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, this.config.cacheExpiryMs)
  }

  /**
   * Preload adjacent pages based on current location
   */
  public async preloadAdjacentPages(): Promise<void> {
    if (this.isPreloading) return
    
    this.isPreloading = true
    
    try {
      const currentPath = this.getCurrentPath()
      const adjacentPages = this.getAdjacentPages(currentPath)
      
      // Preload with priority: closest pages first
      for (let i = 0; i < adjacentPages.length; i++) {
        const page = adjacentPages[i]
        if (page) {
          const priority = i < 2 ? 'high' : 'medium'
          await this.preloadPage(page, priority)
          
          // Small delay between preloads to avoid overwhelming
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    } finally {
      this.isPreloading = false
    }
  }

  /**
   * Preload specific page (called when user hovers/focuses on tab)
   */
  public async preloadSpecificPage(path: string): Promise<void> {
    await this.preloadPage(path, 'high')
  }

  /**
   * Get cached page data
   */
  public getCachedPage(path: string): PreloadedPage | null {
    const htmlPath = this.pathToHtmlFile(path)
    return this.cache.get(htmlPath) || null
  }

  /**
   * Check if page is cached
   */
  public isPageCached(path: string): boolean {
    const htmlPath = this.pathToHtmlFile(path)
    return this.cache.has(htmlPath)
  }

  /**
   * Clean expired cache entries
   */
  private cleanExpiredCache(): void {
    const now = Date.now()
    const expired: string[] = []
    
    for (const [key, page] of this.cache.entries()) {
      if (now - page.timestamp > this.config.cacheExpiryMs) {
        expired.push(key)
      }
    }
    
    expired.forEach(key => this.cache.delete(key))
    
    // Also enforce max cache size
    if (this.cache.size > this.config.maxCacheSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = sortedEntries.slice(0, this.cache.size - this.config.maxCacheSize)
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.clear()
    this.preloadQueue.clear()
  }

  /**
   * Get cache stats for debugging
   */
  public getCacheStats() {
    return {
      cacheSize: this.cache.size,
      queueSize: this.preloadQueue.size,
      cachedPages: Array.from(this.cache.keys()),
      isPreloading: this.isPreloading
    }
  }
}

// Singleton instance
export const iosPreloader = new IOSPreloader()

/**
 * Hook for using the preloader in React components
 */
export const useIOSPreloader = () => {
  return {
    preloadPage: (path: string) => iosPreloader.preloadSpecificPage(path),
    isPageCached: (path: string) => iosPreloader.isPageCached(path),
    getCacheStats: () => iosPreloader.getCacheStats(),
    clearCache: () => iosPreloader.clearCache()
  }
}