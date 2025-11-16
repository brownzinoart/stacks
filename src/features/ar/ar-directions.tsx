/**
 * AR Directions component - Visual navigation to book locations
 * Shows AR overlays on the floor to guide users to specific books
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { arService, NavigationPath } from '@/lib/ar-service';
import { qrPositioning, UserPosition, QRPositioningSystem } from '@/lib/qr-positioning';
import floorPlansData from '@/data/library-floorplans.json';

interface ARDirectionsProps {
  targetBookLocation?: {
    sectionId: string;
    floor: number;
    shelfNumber?: string;
  };
  libraryId?: string;
}

export const ARDirections = ({ targetBookLocation, libraryId = 'apartment-test' }: ARDirectionsProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPath, setCurrentPath] = useState<NavigationPath | null>(null);
  const [userLocation, setUserLocation] = useState({ x: 300, y: 50, floor: 1 });
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [isARSupported, setIsARSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQRScanning, setIsQRScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Check for AR support
    if (!navigator.mediaDevices?.getUserMedia) {
      setIsARSupported(false);
    }

    // Listen for position updates from QR scanning
    const handlePositionUpdate = (event: CustomEvent) => {
      const position = event.detail as UserPosition;
      setUserPosition(position);
      setUserLocation({ x: position.x, y: position.y, floor: position.floor });
    };

    window.addEventListener('ar-position-update', handlePositionUpdate as EventListener);

    return () => {
      window.removeEventListener('ar-position-update', handlePositionUpdate as EventListener);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      qrPositioning.stopScanner().catch(console.error);
    };
  }, []);

  const startNavigation = async () => {
    if (!targetBookLocation) {
      setError('No destination selected');
      return;
    }

    try {
      setError(null);

      // Load library floor plan
      await arService.loadLibraryFloorPlan(libraryId);

      // Get current position or use entrance as default
      const currentPos = userPosition || { x: 350, y: 525, floor: 1 };
      
      // Calculate path to book
      const path = arService.calculatePathToBook(
        currentPos,
        targetBookLocation
      );

      if (!path) {
        throw new Error('Could not calculate path to book');
      }

      setCurrentPath(path);

      // Start camera for AR view
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

      setIsNavigating(true);

      // Initialize QR scanner for positioning
      if (videoRef.current) {
        try {
          await qrPositioning.initializeScanner(videoRef.current);
          setIsQRScanning(true);
        } catch (qrError) {
          console.warn('QR scanning not available, using estimated positioning');
        }
      }

      // Start AR rendering
      renderARPath();
    } catch (error) {
      console.error('Navigation error:', error);
      setError(error instanceof Error ? error.message : 'Navigation failed');
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setCurrentPath(null);
  };

  const renderARPath = () => {
    if (!isNavigating || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    context.drawImage(videoRef.current, 0, 0);

    // Draw AR path overlay
    if (currentPath) {
      drawPathOverlay(context);
    }

    // Continue rendering
    animationFrameRef.current = requestAnimationFrame(renderARPath);
  };

  const drawPathOverlay = (context: CanvasRenderingContext2D) => {
    if (!currentPath) return;

    // Configure path style
    context.strokeStyle = '#4ADE80';
    context.lineWidth = 8;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.setLineDash([20, 10]);

    // Draw path
    context.beginPath();
    currentPath.waypoints.forEach((waypoint, index) => {
      // Transform waypoint coordinates to screen coordinates
      // This is simplified - in production, would use proper AR tracking
      const screenX = (waypoint.x / 600) * context.canvas.width;
      const screenY = (waypoint.y / 800) * context.canvas.height;

      if (index === 0) {
        context.moveTo(screenX, screenY);
      } else {
        context.lineTo(screenX, screenY);
      }

      // Draw waypoint markers
      context.fillStyle = index === 0 ? '#60A5FA' : '#4ADE80';
      context.beginPath();
      context.arc(screenX, screenY, 12, 0, Math.PI * 2);
      context.fill();
    });
    context.stroke();

    // Draw destination marker
    const lastWaypoint = currentPath.waypoints[currentPath.waypoints.length - 1];
    if (lastWaypoint) {
      const destX = (lastWaypoint.x / 600) * context.canvas.width;
      const destY = (lastWaypoint.y / 800) * context.canvas.height;

      // Pulsing animation
      const pulse = Math.sin(Date.now() * 0.003) * 10 + 30;

      context.fillStyle = '#F59E0B';
      context.beginPath();
      context.arc(destX, destY, pulse, 0, Math.PI * 2);
      context.fill();

      // Book icon
      context.font = 'bold 24px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('📚', destX, destY);
    }

    // Draw distance and time info
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(20, 20, 300, 80);

    context.fillStyle = '#FFFFFF';
    context.font = 'bold 18px sans-serif';
    context.textAlign = 'left';
    context.fillText(`Distance: ${Math.round(currentPath.distance)}m`, 30, 45);
    context.fillText(`Est. Time: ${currentPath.estimatedTime} min`, 30, 75);
  };

  // Simulate user movement (for testing)
  const simulateMovement = () => {
    if (currentPath && currentPath.waypoints.length > 1) {
      const progress = (Date.now() % 10000) / 10000; // 10 second loop
      const waypointIndex = Math.floor(progress * (currentPath.waypoints.length - 1));
      const nextIndex = Math.min(waypointIndex + 1, currentPath.waypoints.length - 1);

      const current = currentPath.waypoints[waypointIndex];
      const next = currentPath.waypoints[nextIndex];
      const segmentProgress = (progress * (currentPath.waypoints.length - 1)) % 1;

      if (current && next) {
        setUserLocation({
          x: current.x + (next.x - current.x) * segmentProgress,
          y: current.y + (next.y - current.y) * segmentProgress,
          floor: 1,
        });
      }
    }
  };

  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(simulateMovement, 100);
      return () => clearInterval(interval);
    }
  }, [isNavigating, currentPath]);

  if (!isARSupported) {
    return (
      <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
        <div className="relative z-10 space-y-6 text-center">
          <div className="text-6xl sm:text-8xl">📱</div>
          <h2 className="text-huge font-black leading-extra-tight text-text-primary">
            <span className="text-primary-yellow">AR NOT</span>
            <br />
            <span className="text-mega">SUPPORTED</span>
          </h2>
          <p className="text-lg font-bold text-text-primary">Your device doesn&apos;t support AR navigation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-yellow">AR BOOK</span>
            <br />
            <span className="text-mega">NAVIGATOR</span>
          </h2>
        </div>

        {error && (
          <div className="outline-bold-thin rounded-2xl bg-primary-orange/20 p-4 backdrop-blur-sm">
            <p className="text-center font-bold text-text-primary">{error}</p>
          </div>
        )}

        {!isNavigating ? (
          <div className="space-y-6">
            <div className="space-y-6 text-center">
              <div className="text-6xl sm:text-8xl">🧭</div>
              <p className="text-lg font-bold text-text-primary sm:text-xl">
                Get AR directions to any book in the library
              </p>
            </div>

            {targetBookLocation && (
              <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-black text-text-primary">DESTINATION:</h3>
                <p className="font-bold text-text-primary">
                  Section: {targetBookLocation.sectionId}
                  {targetBookLocation.shelfNumber && ` • Shelf ${targetBookLocation.shelfNumber}`}
                </p>
                <p className="font-bold text-text-secondary">Floor {targetBookLocation.floor}</p>
                
                {/* Show book info if available */}
                {(() => {
                  const bookInfo = Object.entries((floorPlansData as any).bookLocations).find(
                    ([_, location]: [string, any]) => 
                      location.sectionId === targetBookLocation.sectionId &&
                      location.shelfNumber === targetBookLocation.shelfNumber
                  );
                  return bookInfo ? (
                    <p className="mt-2 font-bold text-primary-green">📚 {bookInfo[0]}</p>
                  ) : null;
                })()}
              </div>
            )}

            <button
              onClick={startNavigation}
              disabled={!targetBookLocation}
              className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-green px-8 py-4 text-lg font-black text-text-primary transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🚀 START AR NAVIGATION
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '16/9' }}>
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            </div>

            <div className="outline-bold-thin rounded-2xl bg-primary-green/20 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-black text-text-primary">FOLLOW THE GREEN PATH</h3>
              <div className="space-y-2 text-base font-bold text-text-primary">
                <p>📍 Keep your phone pointed at the floor</p>
                <p>➡️ Follow the green dotted line</p>
                <p>📚 Look for the orange marker at your destination</p>
                {isQRScanning && (
                  <p>🔍 Scanning for QR codes to improve accuracy</p>
                )}
                {userPosition && (
                  <p className="text-sm">
                    Position confidence: {QRPositioningSystem.getConfidenceDescription(userPosition.confidence)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={stopNavigation}
              className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-orange px-8 py-4 text-lg font-black text-white transition-transform hover:scale-105"
            >
              ⏹️ STOP NAVIGATION
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
