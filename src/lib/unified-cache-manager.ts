/**
 * Unified Cache Manager
 * Centralized caching strategy for the recommendation system
 * Implements 3-tier caching: Memory → IndexedDB → Server-side
 */

import { createHash } from 'crypto';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  source: 'memory' | 'indexeddb' | 'server';
}

export interface CacheConfig {
  memoryTTL: number;        // Memory cache TTL (ms)
  persistentTTL: number;    // IndexedDB cache TTL (ms)
  maxMemorySize: number;    // Maximum memory cache entries
  maxPersistentSize: number; // Maximum IndexedDB cache entries
}

const DEFAULT_CONFIG: CacheConfig = {
  memoryTTL: 5 * 60 * 1000,      // 5 minutes
  persistentTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxMemorySize: 100,
  maxPersistentSize: 1000,
};

export class UnifiedCacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private dbName = 'stacks_cache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeIndexedDB();
    this.setupCleanupInterval();
  }

  /**
   * Generate deterministic cache key
   */
  generateKey(input: string, context?: string): string {
    const combined = context ? `${input}:${context}` : input;
    return createHash('sha256').update(combined.toLowerCase().trim()).digest('hex').slice(0, 16);
  }

  /**
   * Get cached data with 3-tier fallback
   */
  async get<T>(key: string): Promise<T | null> {
    console.log(`[Cache] Checking for key: ${key}`);

    // Tier 1: Memory cache (fastest)
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      console.log(`[Cache] ✅ Memory hit for ${key}`);
      return memoryEntry.data as T;
    }

    // Tier 2: IndexedDB cache
    const persistentEntry = await this.getFromIndexedDB<T>(key);
    if (persistentEntry && persistentEntry.expiresAt > Date.now()) {
      console.log(`[Cache] ✅ IndexedDB hit for ${key}`);
      // Promote to memory cache
      this.setMemoryCache(key, persistentEntry.data, this.config.memoryTTL);
      return persistentEntry.data;
    }

    // Tier 3: Server-side cache (if implemented)
    // For now, return null to indicate cache miss
    console.log(`[Cache] ❌ Cache miss for ${key}`);
    return null;
  }

  /**
   * Set data in all appropriate cache tiers
   */
  async set<T>(key: string, data: T, options: { 
    memoryOnly?: boolean;
    customTTL?: number;
  } = {}): Promise<void> {
    const { memoryOnly = false, customTTL } = options;
    const memoryTTL = customTTL || this.config.memoryTTL;
    const persistentTTL = customTTL || this.config.persistentTTL;

    console.log(`[Cache] Setting ${key} (memoryOnly: ${memoryOnly})`);

    // Always set in memory cache
    this.setMemoryCache(key, data, memoryTTL);

    // Set in IndexedDB unless memory-only
    if (!memoryOnly) {
      await this.setInIndexedDB(key, data, persistentTTL);
    }
  }

  /**
   * Clear specific cache entry
   */
  async clear(key: string): Promise<void> {
    console.log(`[Cache] Clearing ${key}`);
    this.memoryCache.delete(key);
    await this.deleteFromIndexedDB(key);
  }

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    console.log('[Cache] Clearing all caches');
    this.memoryCache.clear();
    await this.clearIndexedDB();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memorySize: number;
    memoryHitRate?: number;
    estimatedIndexedDBSize?: number;
  } {
    return {
      memorySize: this.memoryCache.size,
      // Additional stats can be added as needed
    };
  }

  // PRIVATE METHODS

  private setMemoryCache<T>(key: string, data: T, ttl: number): void {
    // Implement LRU eviction if at capacity
    if (this.memoryCache.size >= this.config.maxMemorySize) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      source: 'memory'
    };

    this.memoryCache.set(key, entry);
  }

  private async initializeIndexedDB(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.warn('[Cache] IndexedDB initialization failed');
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[Cache] IndexedDB initialized');
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    } catch (error) {
      console.warn('[Cache] IndexedDB not available:', error);
    }
  }

  private async getFromIndexedDB<T>(key: string): Promise<CacheEntry<T> | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? { ...result, source: 'indexeddb' } : null);
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.warn('[Cache] IndexedDB read error:', error);
      return null;
    }
  }

  private async setInIndexedDB<T>(key: string, data: T, ttl: number): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const entry = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        source: 'indexeddb'
      };

      store.put(entry);
    } catch (error) {
      console.warn('[Cache] IndexedDB write error:', error);
    }
  }

  private async deleteFromIndexedDB(key: string): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.delete(key);
    } catch (error) {
      console.warn('[Cache] IndexedDB delete error:', error);
    }
  }

  private async clearIndexedDB(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.clear();
    } catch (error) {
      console.warn('[Cache] IndexedDB clear error:', error);
    }
  }

  private setupCleanupInterval(): void {
    // Clean expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[Cache] Cleaned ${cleanedCount} expired memory entries`);
    }

    // IndexedDB cleanup would require more complex logic
    // Can be implemented as needed
  }
}

// Export singleton instance
export const cacheManager = new UnifiedCacheManager();