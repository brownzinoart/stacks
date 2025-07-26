/**
 * AR Shelf Scan component - WebXR overlay for "borrow me" book discovery
 * Provides augmented reality scanning of library shelves
 */

'use client';

import { useState } from 'react';

export const ARShelfScan = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [isARSupported, setIsARSupported] = useState(true); // TODO: Check actual WebXR support

  const startARScan = async () => {
    try {
      // TODO: Implement WebXR initialization
      console.log('Starting AR shelf scan...');
      setIsARActive(true);

      // Simulate AR session
      setTimeout(() => {
        setIsARActive(false);
      }, 5000);
    } catch (error) {
      console.error('AR not supported:', error);
      setIsARSupported(false);
    }
  };

  const stopARScan = () => {
    setIsARActive(false);
    // TODO: Stop WebXR session
    console.log('Stopping AR shelf scan...');
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
            <div className="space-y-6 text-center">
              <div className="animate-pulse text-6xl sm:text-8xl">📹</div>
              <p className="text-xl font-black text-text-primary">AR SCANNER ACTIVE</p>
              <p className="text-lg font-bold text-text-primary sm:text-xl">
                Move your camera around to scan book spines
              </p>
            </div>

            <div className="outline-bold-thin rounded-2xl bg-primary-green/20 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="h-4 w-4 animate-pulse rounded-full bg-primary-green" />
                <span className="text-lg font-black text-text-primary">SCANNING FOR BOOKS...</span>
              </div>
            </div>

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
