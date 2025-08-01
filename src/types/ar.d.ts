/**
 * Type declarations for AR-related libraries
 */

declare module '@capacitor/camera' {
  export interface CameraPhoto {
    base64String?: string;
    dataUrl?: string;
    path?: string;
    webPath?: string;
    exif?: any;
    format: string;
  }

  export enum CameraResultType {
    Uri = 'uri',
    Base64 = 'base64',
    DataUrl = 'dataUrl',
  }

  export enum CameraSource {
    Camera = 'camera',
    Photos = 'photos',
    Prompt = 'prompt',
  }

  export interface CameraOptions {
    quality?: number;
    allowEditing?: boolean;
    resultType: CameraResultType;
    source: CameraSource;
    width?: number;
    height?: number;
    preserveAspectRatio?: boolean;
    correctOrientation?: boolean;
    webUseInput?: boolean;
  }

  export interface PermissionStatus {
    camera: 'granted' | 'denied' | 'prompt';
    photos: 'granted' | 'denied' | 'prompt';
  }

  export const Camera: {
    getPhoto(options: CameraOptions): Promise<CameraPhoto>;
    requestPermissions(): Promise<PermissionStatus>;
    checkPermissions(): Promise<PermissionStatus>;
  };
}

declare module 'tesseract.js' {
  export interface Worker {
    recognize(image: string | File | Blob | ImageData): Promise<RecognizeResult>;
    terminate(): Promise<void>;
  }

  export interface RecognizeResult {
    data: Page;
  }

  export interface Page {
    lines: Line[];
    text: string;
    confidence: number;
  }

  export interface Line {
    text: string;
    confidence: number;
    bbox?: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }

  export function createWorker(lang?: string): Promise<Worker>;
}
