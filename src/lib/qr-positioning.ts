/**
 * QR Code Positioning System for AR Indoor Navigation
 * Uses QR codes as anchor points for accurate positioning
 */

import QrScanner from 'qr-scanner';
import floorPlansData from '@/data/library-floorplans.json';

export interface QRPosition {
  code: string;
  position: { x: number; y: number };
  floor: number;
  libraryId: string;
  timestamp: number;
}

export interface UserPosition {
  x: number;
  y: number;
  floor: number;
  confidence: number;
  source: 'qr' | 'visual' | 'estimated';
  timestamp: number;
}

class QRPositioningSystem {
  private currentPosition: UserPosition | null = null;
  private lastQRScan: QRPosition | null = null;
  private positionHistory: UserPosition[] = [];
  private qrScanner: QrScanner | null = null;

  /**
   * Initialize QR scanner for positioning
   */
  async initializeScanner(videoElement: HTMLVideoElement): Promise<void> {
    try {
      this.qrScanner = new QrScanner(
        videoElement,
        (result) => this.handleQRDetection(result),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        }
      );

      await this.qrScanner.start();
      console.log('QR Scanner initialized for positioning');
    } catch (error) {
      console.error('Failed to initialize QR scanner:', error);
      throw error;
    }
  }

  /**
   * Stop QR scanner
   */
  async stopScanner(): Promise<void> {
    if (this.qrScanner) {
      this.qrScanner.stop();
      this.qrScanner.destroy();
      this.qrScanner = null;
    }
  }

  /**
   * Handle QR code detection
   */
  private handleQRDetection(result: QrScanner.ScanResult): void {
    const qrData = result.data;
    console.log('QR Code detected:', qrData);

    // Find the QR anchor in our floor plans
    const position = this.findQRPosition(qrData);
    
    if (position) {
      this.updateUserPosition(position);
    }
  }

  /**
   * Find QR position from floor plans data
   */
  private findQRPosition(qrCode: string): QRPosition | null {
    for (const library of (floorPlansData as any).libraries) {
      for (const floor of library.floors) {
        const qrAnchor = floor.qrAnchors?.find(
          (anchor: any) => anchor.code === qrCode
        );
        
        if (qrAnchor) {
          return {
            code: qrCode,
            position: qrAnchor.position,
            floor: floor.level,
            libraryId: library.id,
            timestamp: Date.now(),
          };
        }
      }
    }
    
    console.warn('QR code not found in floor plans:', qrCode);
    return null;
  }

  /**
   * Update user position based on QR scan
   */
  private updateUserPosition(qrPosition: QRPosition): void {
    this.lastQRScan = qrPosition;
    
    const newPosition: UserPosition = {
      x: qrPosition.position.x,
      y: qrPosition.position.y,
      floor: qrPosition.floor,
      confidence: 1.0, // QR scans have high confidence
      source: 'qr',
      timestamp: qrPosition.timestamp,
    };

    this.currentPosition = newPosition;
    this.positionHistory.push(newPosition);
    
    // Keep only last 10 positions for history
    if (this.positionHistory.length > 10) {
      this.positionHistory.shift();
    }

    console.log('User position updated:', newPosition);
    
    // Trigger position update event
    this.onPositionUpdate(newPosition);
  }

  /**
   * Get current user position
   */
  getCurrentPosition(): UserPosition | null {
    if (!this.currentPosition) {
      return null;
    }

    // If position is older than 30 seconds, reduce confidence
    const age = Date.now() - this.currentPosition.timestamp;
    if (age > 30000) {
      this.currentPosition.confidence = Math.max(0.3, this.currentPosition.confidence - (age / 60000) * 0.5);
      this.currentPosition.source = 'estimated';
    }

    return this.currentPosition;
  }

  /**
   * Estimate position based on movement since last QR scan
   */
  estimatePosition(movementVector: { x: number; y: number }): UserPosition | null {
    if (!this.currentPosition) {
      return null;
    }

    const estimatedPosition: UserPosition = {
      x: this.currentPosition.x + movementVector.x,
      y: this.currentPosition.y + movementVector.y,
      floor: this.currentPosition.floor,
      confidence: Math.max(0.3, this.currentPosition.confidence - 0.1),
      source: 'estimated',
      timestamp: Date.now(),
    };

    this.currentPosition = estimatedPosition;
    return estimatedPosition;
  }

  /**
   * Generate QR codes for printing
   */
  static generateQRCodesForLibrary(libraryId: string): Array<{
    code: string;
    label: string;
    position: string;
  }> {
    const library = (floorPlansData as any).libraries.find(
      (lib: any) => lib.id === libraryId
    );
    
    if (!library) {
      return [];
    }

    const qrCodes: Array<{ code: string; label: string; position: string }> = [];
    
    for (const floor of library.floors) {
      if (floor.qrAnchors) {
        for (const anchor of floor.qrAnchors) {
          qrCodes.push({
            code: anchor.code,
            label: `${library.name} - ${floor.name} - ${anchor.description}`,
            position: `Position: (${anchor.position.x}, ${anchor.position.y})`,
          });
        }
      }
    }
    
    return qrCodes;
  }

  /**
   * Scan QR code from image
   */
  static async scanFromImage(imageDataUrl: string): Promise<string | null> {
    try {
      const result = await QrScanner.scanImage(imageDataUrl);
      return result;
    } catch (error) {
      console.error('Failed to scan QR from image:', error);
      return null;
    }
  }

  /**
   * Check if camera has QR scanning capability
   */
  static async hasCamera(): Promise<boolean> {
    return QrScanner.hasCamera();
  }

  /**
   * Position update callback
   */
  private onPositionUpdate(position: UserPosition): void {
    // Dispatch custom event for position updates
    const event = new CustomEvent('ar-position-update', {
      detail: position,
    });
    window.dispatchEvent(event);
  }

  /**
   * Get position confidence level description
   */
  static getConfidenceDescription(confidence: number): string {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.7) return 'Good';
    if (confidence >= 0.5) return 'Fair';
    if (confidence >= 0.3) return 'Poor';
    return 'Lost';
  }

  /**
   * Calculate distance between two positions
   */
  static calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
  }
}

// Export singleton instance
export const qrPositioning = new QRPositioningSystem();

// Export class and types
export { QRPositioningSystem };