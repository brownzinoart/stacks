declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    drawShadow?: boolean;
    flippingMode?: 'hard' | 'soft';
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);

    loadFromHTML(element: NodeListOf<Element> | HTMLElement[]): void;
    destroy(): void;

    on(event: 'flip', callback: (e: { data: number }) => void): void;
    on(event: 'changeOrientation', callback: () => void): void;

    flipNext(): void;
    flipPrev(): void;
    flip(pageNum: number): void;

    updateFromImages(): void;
  }
}
