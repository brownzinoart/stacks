/**
 * API Caching Layer with IndexedDB
 * Optimizes API calls and provides offline functionality
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  version?: number; // Cache version for invalidation
}

class APICache {
  private dbName = 'stacks-api-cache';
  private version = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize IndexedDB
   */
  private async init(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('API Cache IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('books')) {
          const booksStore = db.createObjectStore('books', { keyPath: 'key' });
          booksStore.createIndex('timestamp', 'timestamp', { unique: false });
          booksStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('floor-plans')) {
          const floorPlansStore = db.createObjectStore('floor-plans', { keyPath: 'key' });
          floorPlansStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('ocr-results')) {
          const ocrStore = db.createObjectStore('ocr-results', { keyPath: 'key' });
          ocrStore.createIndex('timestamp', 'timestamp', { unique: false });
          ocrStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * Generate cache key from parameters
   */
  private generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `${prefix}:${btoa(sortedParams)}`;
  }

  /**
   * Get cached data
   */
  async get<T>(
    storeName: string, 
    key: string
  ): Promise<T | null> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;
        
        if (!entry) {
          resolve(null);
          return;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
          // Delete expired entry
          this.delete(storeName, key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };
    });
  }

  /**
   * Set cached data
   */
  async set<T>(
    storeName: string,
    key: string,
    data: T,
    options: CacheOptions = {}
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.db) return;

    const now = Date.now();
    const ttl = options.ttl || 24 * 60 * 60 * 1000; // Default 24 hours
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve();
        // Clean up old entries if needed
        this.cleanupExpired(storeName);
      };
    });
  }

  /**
   * Delete cached entry
   */
  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear all cache for a store
   */
  async clear(storeName: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clean up expired entries
   */
  private async cleanupExpired(storeName: string): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('expiresAt');
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Failed to cleanup expired cache entries:', error);
    }
  }

  /**
   * Cache Google Books API responses
   */
  async cacheBookInfo(title: string, author: string | undefined, data: unknown): Promise<void> {
    const key = this.generateKey('google-books', { title, author: author || '' });
    await this.set('books', key, data, { ttl: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }

  async getCachedBookInfo(title: string, author?: string): Promise<unknown | null> {
    const key = this.generateKey('google-books', { title, author: author || '' });
    return await this.get('books', key);
  }

  /**
   * Cache OCR results
   */
  async cacheOCRResult(imageHash: string, result: unknown): Promise<void> {
    const key = this.generateKey('ocr', { hash: imageHash });
    await this.set('ocr-results', key, result, { ttl: 60 * 60 * 1000 }); // 1 hour
  }

  async getCachedOCRResult(imageHash: string): Promise<unknown | null> {
    const key = this.generateKey('ocr', { hash: imageHash });
    return await this.get('ocr-results', key);
  }

  /**
   * Cache floor plans
   */
  async cacheFloorPlan(libraryId: string, data: unknown): Promise<void> {
    const key = this.generateKey('floor-plan', { libraryId });
    await this.set('floor-plans', key, data, { ttl: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  async getCachedFloorPlan(libraryId: string): Promise<unknown | null> {
    const key = this.generateKey('floor-plan', { libraryId });
    return await this.get('floor-plans', key);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    books: number;
    floorPlans: number;
    ocrResults: number;
    totalSize: number;
  }> {
    if (!this.db) {
      return { books: 0, floorPlans: 0, ocrResults: 0, totalSize: 0 };
    }

    const stats = { books: 0, floorPlans: 0, ocrResults: 0, totalSize: 0 };

    const stores = ['books', 'floor-plans', 'ocr-results'];
    const promises = stores.map(storeName => 
      new Promise<number>((resolve) => {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      })
    );

    const counts = await Promise.all(promises);
    stats.books = counts[0] || 0;
    stats.floorPlans = counts[1] || 0;
    stats.ocrResults = counts[2] || 0;
    stats.totalSize = counts.reduce((sum, count) => sum + count, 0);

    return stats;
  }

  /**
   * Preload common data
   */
  async warmCache(): Promise<void> {
    // Pre-cache popular books for faster lookup
    const popularBooks = [
      'The Great Gatsby',
      '1984',
      'Harry Potter and the Sorcerer\'s Stone',
      'To Kill a Mockingbird',
      'Pride and Prejudice',
    ];

    console.log('Warming API cache with popular books...');
    
    // Note: Actual warming would happen when these books are first requested
    // This just logs the intention
  }
}

// Export singleton instance
export const apiCache = new APICache();