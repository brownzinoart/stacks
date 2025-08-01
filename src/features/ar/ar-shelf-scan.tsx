/**
 * AR Shelf Scan component - Camera-based book recognition with AR overlay
 * Uses OCR to identify book spines and highlights recommendations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
// import { arService, RecognizedBook } from '@/lib/ar-service';
// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';

export const ARShelfScan = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [isARSupported, setIsARSupported] = useState(true);
  const [recognizedBooks, setRecognizedBooks] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    // Check for camera support
    if (!navigator.mediaDevices?.getUserMedia) {
      setIsARSupported(false);
    }

    // AR features disabled for web version
    // arService.initializeOCR().catch(console.error);

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // arService.terminateOCR().catch(console.error);
    };
  }, []);

  const startARScan = async () => {
    try {
      setError(null);
      
      // AR features disabled for web version
      // const hasPermission = await arService.requestCameraPermission();
      // if (!hasPermission) {
      //   throw new Error('Camera permission denied');
      // }

      // Start camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
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
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setRecognizedBooks([]);
  };

  const scanBooksFromVideo = async () => {
    if (!isARActive || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Capture frame from video
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Set canvas size to match video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        // Draw current frame
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Image = dataUrl.split(',')[1] || '';
        
        // AR features disabled for web version - simulate some books for demo
        const mockBooks = [
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isRecommended: true, isAvailable: true },
          { title: '1984', author: 'George Orwell', isRecommended: false, isAvailable: true },
        ];
        
        setRecognizedBooks(mockBooks);
      }
    } catch (error) {
      console.error('Book scanning error:', error);
    } finally {
      setIsProcessing(false);
      
      // Continue scanning if still active
      if (isARActive) {
        setTimeout(() => scanBooksFromVideo(), 2000); // Scan every 2 seconds
      }
    }
  };

  const renderAROverlay = () => {
    if (!recognizedBooks.length) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {recognizedBooks.map((book, index) => (
          <div
            key={index}
            className="absolute border-4 rounded-lg transition-all duration-300"
            style={{
              left: `${(book.boundingBox.x / (videoRef.current?.videoWidth || 1)) * 100}%`,
              top: `${(book.boundingBox.y / (videoRef.current?.videoHeight || 1)) * 100}%`,
              width: `${(book.boundingBox.width / (videoRef.current?.videoWidth || 1)) * 100}%`,
              height: `${(book.boundingBox.height / (videoRef.current?.videoHeight || 1)) * 100}%`,
              borderColor: book.isRecommended ? '#4ADE80' : book.isAvailable ? '#60A5FA' : '#F87171',
            }}
          >
            <div className="absolute -top-8 left-0 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
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
          <div className="mb-6 outline-bold-thin rounded-2xl bg-primary-orange/20 p-4 backdrop-blur-sm">
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
            <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              {renderAROverlay()}
              
              {isProcessing && (
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-full flex items-center gap-2">
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
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {recognizedBooks.map((book, index) => (
                    <div key={index} className="text-sm font-bold text-text-primary flex items-center gap-2">
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
