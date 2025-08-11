/**
 * OCR Worker Pool Manager - Optimized Tesseract.js worker management
 * Prevents memory leaks and improves performance through worker pooling
 */

import Tesseract, { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
  lines: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export interface ImagePreprocessOptions {
  resize?: { width: number; height: number };
  contrast?: number; // 1.0 = normal, 1.5 = higher contrast
  brightness?: number; // 0 = normal, 0.2 = brighter
  rotation?: number; // degrees to rotate
  grayscale?: boolean;
}

class OCRWorkerPool {
  private workers: Tesseract.Worker[] = [];
  private busyWorkers = new Set<Tesseract.Worker>();
  private availableWorkers: Tesseract.Worker[] = [];
  private maxWorkers: number = 2; // Mobile optimized
  private initializationPromises = new Map<Tesseract.Worker, Promise<void>>();
  private isShuttingDown = false;

  constructor() {
    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.shutdown());
      window.addEventListener('pagehide', () => this.shutdown());
    }
  }

  /**
   * Get an available worker or create a new one
   */
  private async getWorker(): Promise<Tesseract.Worker> {
    // Return available worker if exists
    if (this.availableWorkers.length > 0) {
      const worker = this.availableWorkers.pop()!;
      this.busyWorkers.add(worker);
      return worker;
    }

    // Create new worker if under limit
    if (this.workers.length < this.maxWorkers) {
      const worker = await this.createNewWorker();
      this.busyWorkers.add(worker);
      return worker;
    }

    // Wait for a worker to become available
    return new Promise((resolve) => {
      const checkForWorker = () => {
        if (this.availableWorkers.length > 0) {
          const worker = this.availableWorkers.pop()!;
          this.busyWorkers.add(worker);
          resolve(worker);
        } else {
          setTimeout(checkForWorker, 100);
        }
      };
      checkForWorker();
    });
  }

  /**
   * Create and initialize a new worker
   */
  private async createNewWorker(): Promise<Tesseract.Worker> {
    const worker = await createWorker();
    
    await (worker as any).loadLanguage('eng');
    await (worker as any).initialize('eng');

    this.workers.push(worker as any);
    return worker as any;
  }

  /**
   * Return worker to available pool
   */
  private releaseWorker(worker: Tesseract.Worker): void {
    this.busyWorkers.delete(worker);
    if (!this.isShuttingDown) {
      this.availableWorkers.push(worker);
    }
  }

  /**
   * Preprocess image for better OCR results
   */
  private preprocessImage(imageDataUrl: string, options: ImagePreprocessOptions = {}): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<string>((resolve) => {
      img.onload = () => {
        // Set canvas size
        canvas.width = options.resize?.width || img.width;
        canvas.height = options.resize?.height || img.height;
        
        // Apply image filters
        ctx.filter = this.buildFilterString(options);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply rotation if specified
        if (options.rotation) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((options.rotation * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageDataUrl;
    }) as any;
  }

  /**
   * Build CSS filter string from options
   */
  private buildFilterString(options: ImagePreprocessOptions): string {
    const filters: string[] = [];
    
    if (options.contrast) {
      filters.push(`contrast(${options.contrast})`);
    }
    
    if (options.brightness) {
      filters.push(`brightness(${1 + options.brightness})`);
    }
    
    if (options.grayscale) {
      filters.push('grayscale(100%)');
    }
    
    return filters.join(' ');
  }

  /**
   * Process image with OCR
   */
  async recognizeText(
    imageDataUrl: string, 
    preprocessOptions: ImagePreprocessOptions = {}
  ): Promise<OCRResult> {
    if (this.isShuttingDown) {
      throw new Error('OCR Worker Pool is shutting down');
    }

    let processedImage = imageDataUrl;
    
    // Apply preprocessing if options provided
    if (Object.keys(preprocessOptions).length > 0) {
      try {
        processedImage = await this.preprocessImage(imageDataUrl, preprocessOptions);
      } catch (error) {
        console.warn('Image preprocessing failed, using original:', error);
      }
    }

    const worker = await this.getWorker();
    
    try {
      const { data } = await worker.recognize(processedImage);

      return {
        text: data.text,
        confidence: data.confidence,
        words: (data as any).words?.filter((w: any) => w.bbox) || [],
        lines: (data as any).lines?.filter((l: any) => l.bbox) || [],
      };
    } finally {
      this.releaseWorker(worker);
    }
  }

  /**
   * Process multiple images in parallel (with concurrency limit)
   */
  async recognizeTextBatch(
    images: Array<{ imageDataUrl: string; options?: ImagePreprocessOptions }>,
    concurrency: number = 2
  ): Promise<OCRResult[]> {
    const results: OCRResult[] = [];
    const batches: Array<typeof images> = [];
    
    // Split into batches
    for (let i = 0; i < images.length; i += concurrency) {
      batches.push(images.slice(i, i + concurrency));
    }
    
    // Process each batch
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(({ imageDataUrl, options }) => 
          this.recognizeText(imageDataUrl, options)
        )
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    totalWorkers: number;
    busyWorkers: number;
    availableWorkers: number;
    queuedJobs: number;
  } {
    return {
      totalWorkers: this.workers.length,
      busyWorkers: this.busyWorkers.size,
      availableWorkers: this.availableWorkers.length,
      queuedJobs: 0, // Would need job queue implementation
    };
  }

  /**
   * Gracefully shutdown all workers
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    
    // Wait for busy workers to finish (with timeout)
    const timeout = 5000; // 5 seconds
    const startTime = Date.now();
    
    while (this.busyWorkers.size > 0 && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Terminate all workers
    await Promise.all(
      this.workers.map(worker => 
        worker.terminate().catch(error => 
          console.warn('Error terminating OCR worker:', error)
        )
      )
    );
    
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers.clear();
    
    console.log('OCR Worker Pool shut down');
  }

  /**
   * Warm up the worker pool by pre-creating workers
   */
  async warmUp(): Promise<void> {
    const promises = [];
    for (let i = 0; i < this.maxWorkers; i++) {
      promises.push(this.createNewWorker().then(worker => {
        this.availableWorkers.push(worker);
      }));
    }
    await Promise.all(promises);
    console.log(`OCR Worker Pool warmed up with ${this.maxWorkers} workers`);
  }
}

// Export singleton instance
export const ocrWorkerPool = new OCRWorkerPool();