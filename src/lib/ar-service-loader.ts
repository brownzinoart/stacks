/**
 * Dynamic AR Service Loader - Phase 2 Optimization
 * Lazy loads heavy AR dependencies only when needed
 */

import { RecognizedBook } from '@/types/ar-types';

let arServiceInstance: any = null;

/**
 * Dynamically import AR service to reduce initial bundle size
 */
export const loadARService = async () => {
  if (arServiceInstance) {
    return arServiceInstance;
  }

  // Dynamic import reduces initial bundle size by ~2MB
  const { arService } = await import('@/lib/ar-service');
  arServiceInstance = arService;
  
  return arServiceInstance;
};

/**
 * Lazy load OCR worker pool
 */
export const loadOCRWorker = async () => {
  const { ocrWorkerPool } = await import('@/lib/ocr-worker-pool');
  return ocrWorkerPool;
};

/**
 * Lazy load Tesseract.js for OCR processing
 */
export const loadTesseract = async () => {
  const Tesseract = await import('tesseract.js');
  return Tesseract.default;
};

/**
 * Preload AR service on user interaction (hover/touch)
 */
export const preloadARService = () => {
  if (typeof window !== 'undefined' && !arServiceInstance) {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadARService().catch(console.error);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        loadARService().catch(console.error);
      }, 1000);
    }
  }
};

/**
 * Check if AR features are supported
 */
export const isARSupported = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    'ImageData' in window
  );
};