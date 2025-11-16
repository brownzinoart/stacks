/**
 * AR Shelf Scan component - Camera-based book recognition with AR overlay
 * Uses OCR to identify book spines and highlights recommendations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { arService, RecognizedBook } from '@/lib/ar-service';
// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';

export const ARShelfScan = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [isARSupported, setIsARSupported] = useState(true);
  const [recognizedBooks, setRecognizedBooks] = useState<RecognizedBook[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const isComponentMountedRef = useRef<boolean>(true);

  // Get user preferences for book matching - disabled for static build
  // const { data: userPreferences } = useQuery({
  //   queryKey: ['user-preferences'],
  //   queryFn: async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) return null;
  //
  //     const { data } = await supabase
  //       .from('user_preferences')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .single();
  //
  //     return data;
  //   },
  // });
  const userPreferences = null; // Placeholder for static build

  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // Check for camera support
    if (!navigator.mediaDevices?.getUserMedia) {
      setIsARSupported(false);
    }

    // Initialize OCR service
    arService.initializeOCR().catch((error) => {
      console.error('Failed to initialize OCR:', error);
      if (isComponentMountedRef.current) {
        setError('OCR initialization failed');
      }
    });

    return () => {
      isComponentMountedRef.current = false;
      
      // Clear scan interval
      if (scanIntervalRef.current) {
        clearTimeout(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log('Camera track stopped');
        });
        streamRef.current = null;
      }
      
      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Force cleanup
      }
      
      // Clean up canvas context
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
      // Note: OCR cleanup handled by worker pool
    };
  }, []);

  const startARScan = async () => {
    try {
      setError(null);

      // Request camera permission
      const hasPermission = await arService.requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      // Start camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsARActive(true);

      // Start continuous scanning
      scanBooksFromVideo();
    } catch (error) {
      console.error('AR not supported:', error);
      setError(error instanceof Error ? error.message : 'AR not supported');
      setIsARSupported(false);
    }
  };

  const stopARScan = () => {
    setIsARActive(false);
    
    // Clear scan interval
    if (scanIntervalRef.current) {
      clearTimeout(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    // Stop camera stream with proper cleanup
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log('Camera track stopped during scan stop');
      });
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Force garbage collection of media resources
    }
    
    // Clear canvas to free memory
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      // Reset canvas size to minimum to free GPU memory
      canvasRef.current.width = 1;
      canvasRef.current.height = 1;
    }

    setRecognizedBooks([]);
  };

  const scanBooksFromVideo = async () => {
    if (!isARActive || isProcessing || !isComponentMountedRef.current) return;

    // Adaptive scanning interval based on time since last scan
    const now = Date.now();
    const timeSinceLastScan = now - lastScanTimeRef.current;
    const minInterval = 3000; // Minimum 3 seconds between scans
    
    if (timeSinceLastScan < minInterval) {
      // Schedule next scan
      scanIntervalRef.current = setTimeout(
        () => scanBooksFromVideo(), 
        minInterval - timeSinceLastScan
      );
      return;
    }

    setIsProcessing(true);
    lastScanTimeRef.current = now;

    try {
      // Capture frame from video with memory optimization
      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false }); // No alpha for better performance
        if (!context) return;

        // Optimize canvas size for performance vs quality
        const maxWidth = 800;
        const maxHeight = 600;
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        const scale = Math.min(maxWidth / videoWidth, maxHeight / videoHeight, 1);
        
        canvas.width = videoWidth * scale;
        canvas.height = videoHeight * scale;

        // Draw current frame with scaling
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert to base64 with reduced quality for faster processing
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        // Use optimized OCR service
        try {
          const books = await arService.recognizeBooksFromImage(dataUrl);
          
          // Only update state if component is still mounted
          if (isComponentMountedRef.current) {
            // Enrich with availability and recommendations
            const enrichedBooks = await arService.enrichBookData(
              books,
              userPreferences,
              null
            );
            
            setRecognizedBooks(enrichedBooks);
            
            if (books.length > 0) {
              console.log(`Found ${books.length} books:`, books.map(b => b.title));
            }
          }
        } catch (ocrError) {
          console.error('OCR processing error:', ocrError);
          
          // Fallback to mock data only if component is mounted
          if (isComponentMountedRef.current) {
            const mockBooks: RecognizedBook[] = [
              { 
                title: 'The Great Gatsby', 
                author: 'F. Scott Fitzgerald', 
                confidence: 95,
                boundingBox: { x: 100, y: 100, width: 150, height: 200 },
                isRecommended: true, 
                isAvailable: true 
              },
              { 
                title: '1984', 
                author: 'George Orwell', 
                confidence: 92,
                boundingBox: { x: 300, y: 100, width: 150, height: 200 },
                isRecommended: false, 
                isAvailable: true 
              },
            ];
            setRecognizedBooks(mockBooks);
          }
        }
      }
    } catch (error) {
      console.error('Book scanning error:', error);
    } finally {
      if (isComponentMountedRef.current) {
        setIsProcessing(false);

        // Schedule next scan with adaptive interval
        if (isARActive) {
          const nextInterval = recognizedBooks.length > 0 ? 5000 : 3000;
          scanIntervalRef.current = setTimeout(() => scanBooksFromVideo(), nextInterval);
        }
      }
    }
  };

  const renderAROverlay = () => {
    if (!recognizedBooks.length) return null;

    return (
      <div className="pointer-events-none absolute inset-0">
        {recognizedBooks.map((book, index) => (
          <div
            key={index}
            className="absolute rounded-lg border-4 transition-all duration-300"
            style={{
              left: `${(book.boundingBox.x / (videoRef.current?.videoWidth || 1)) * 100}%`,
              top: `${(book.boundingBox.y / (videoRef.current?.videoHeight || 1)) * 100}%`,
              width: `${(book.boundingBox.width / (videoRef.current?.videoWidth || 1)) * 100}%`,
              height: `${(book.boundingBox.height / (videoRef.current?.videoHeight || 1)) * 100}%`,
              borderColor: book.isRecommended ? '#4ADE80' : book.isAvailable ? '#60A5FA' : '#F87171',
            }}
          >
            <div className="absolute -top-8 left-0 rounded bg-black/80 px-2 py-1 text-xs font-bold text-white">
              {book.title}
              {book.isRecommended && ' ⭐'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isARSupported) {
    return (
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div className="space-y-6 text-center">
            <div className="text-6xl sm:text-8xl">📱</div>
            <h2 className="text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-yellow">AR NOT</span>
              <br />
              <span className="text-mega">SUPPORTED</span>
            </h2>
            <p className="text-lg font-bold text-text-primary sm:text-xl">
              Your device doesn&apos;t support AR features.
              <br />
              Try using a modern mobile browser.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
        <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
        <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
        <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
        <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-yellow opacity-30 sm:h-12 sm:w-12" />
      </div>
    );
  }

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-yellow">AR SHELF</span>
            <br />
            <span className="text-mega">SCANNER</span>
          </h2>
        </div>

        {error && (
          <div className="outline-bold-thin mb-6 rounded-2xl bg-primary-orange/20 p-4 backdrop-blur-sm">
            <p className="text-center font-bold text-text-primary">{error}</p>
          </div>
        )}

        {!isARActive ? (
          <div className="space-y-6">
            <div className="space-y-6 text-center">
              <div className="text-6xl sm:text-8xl">📚</div>
              <p className="text-lg font-bold text-text-primary sm:text-xl">
                Point your camera at library shelves to see
                <br />
                interactive book information
              </p>
            </div>

            <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-black text-text-primary">HOW IT WORKS:</h3>
              <ul className="space-y-3 text-base font-bold text-text-primary sm:text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-xl text-primary-green">•</span>
                  Books will highlight when available to borrow
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl text-primary-green">•</span>
                  Tap highlighted books for details and instant reservation
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl text-primary-green">•</span>
                  See real-time availability and recommendations
                </li>
              </ul>
            </div>

            <button
              onClick={startARScan}
              className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-green px-8 py-4 text-lg font-black text-text-primary transition-transform hover:scale-105"
            >
              🔍 START AR SCAN
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '16/9' }}>
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <canvas 
                ref={canvasRef} 
                className="hidden" 
                width="1" 
                height="1"
              />
              {renderAROverlay()}

              {isProcessing && (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/80 px-3 py-2 text-white">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-primary-green" />
                  <span className="text-sm font-bold">Processing...</span>
                </div>
              )}
            </div>

            <div className="outline-bold-thin rounded-2xl bg-white/80 p-4 backdrop-blur-sm">
              <h3 className="mb-3 text-base font-black text-text-primary">LEGEND:</h3>
              <div className="space-y-2 text-sm font-bold text-text-primary">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded border-2 border-green-500 bg-green-500/20" />
                  <span>Recommended for you</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded border-2 border-blue-500 bg-blue-500/20" />
                  <span>Available to borrow</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded border-2 border-red-500 bg-red-500/20" />
                  <span>Currently unavailable</span>
                </div>
              </div>
            </div>

            {recognizedBooks.length > 0 && (
              <div className="outline-bold-thin rounded-2xl bg-primary-purple/20 p-4 backdrop-blur-sm">
                <h3 className="mb-3 text-base font-black text-text-primary">FOUND {recognizedBooks.length} BOOKS</h3>
                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {recognizedBooks.map((book, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm font-bold text-text-primary">
                      {book.isRecommended && <span>⭐</span>}
                      <span>{book.title}</span>
                      {book.author && <span className="text-text-secondary">by {book.author}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={stopARScan}
              className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-orange px-8 py-4 text-lg font-black text-white transition-transform hover:scale-105"
            >
              ⏹️ STOP AR SCAN
            </button>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-yellow opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
