/**
 * ExpandableText Component
 * Provides smooth height animation for expanding/collapsing text with fade gradient overlay
 */

import { useState, useRef, useEffect } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLines: number;
  variant?: 'description' | 'reason';
  className?: string;
}

export function ExpandableText({ 
  text, 
  maxLines, 
  variant = 'description',
  className = '' 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const textRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && fullTextRef.current) {
        const clampedHeight = textRef.current.scrollHeight;
        const fullHeight = fullTextRef.current.scrollHeight;
        setIsOverflowing(fullHeight > clampedHeight);
        
        if (!isExpanded) {
          setHeight(clampedHeight);
        } else {
          setHeight(fullHeight);
        }
      }
    };

    checkOverflow();
    
    // Recheck on resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isExpanded, text]);

  const handleToggle = () => {
    if (fullTextRef.current) {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      
      if (newExpanded) {
        setHeight(fullTextRef.current.scrollHeight);
      } else {
        setHeight(textRef.current?.scrollHeight);
      }
    }
  };

  const getLineClampClass = () => {
    switch (maxLines) {
      case 2: return 'line-clamp-2';
      case 3: return 'line-clamp-3';
      case 4: return 'line-clamp-4';
      case 5: return 'line-clamp-5';
      default: return `line-clamp-${maxLines}`;
    }
  };

  const textStyle = variant === 'reason' 
    ? 'text-sm font-bold text-text-primary leading-relaxed'
    : 'text-sm text-text-primary leading-relaxed';

  return (
    <div className={className}>
      <div className="relative">
        {/* Hidden full text for measurement */}
        <div
          ref={fullTextRef}
          className={`absolute top-0 left-0 w-full invisible ${textStyle}`}
          aria-hidden="true"
        >
          {variant === 'reason' ? `Why it matches: ${text}` : text}
        </div>

        {/* Visible text with optional clamping */}
        <div
          ref={textRef}
          className={`${textStyle} ${!isExpanded ? getLineClampClass() : ''}`}
          style={{
            height: height ? `${height}px` : undefined,
            transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
          }}
        >
          {variant === 'reason' ? `Why it matches: ${text}` : text}
        </div>

        {/* Fade gradient overlay when collapsed */}
        {!isExpanded && isOverflowing && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"
            style={{
              // Respect prefers-reduced-motion
              transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches 
                ? 'none' 
                : 'opacity 300ms ease-in-out'
            }}
          />
        )}
      </div>

      {/* Toggle button */}
      {isOverflowing && (
        <button
          onClick={handleToggle}
          className="mt-2 text-primary-pink hover:text-primary-pink/80 text-sm font-bold transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-start"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less text' : 'Show more text'}
        >
          {isExpanded ? '- less' : '+ more'}
        </button>
      )}
    </div>
  );
}