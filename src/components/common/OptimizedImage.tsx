/**
 * OPTIMIZED IMAGE COMPONENT
 * ========================
 * 
 * Progressive loading image component with WebP support
 * Implements modern image optimization techniques
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized URLs (simplified)
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'original' = 'original') => {
    if (!originalSrc) return '';
    
    // For now, just return the original src to avoid transformation issues
    // Supabase storage transformations might not be available or configured
    return originalSrc;
  };

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      setCurrentSrc(getOptimizedSrc(src, 'original')); // Use original format for reliability
      return;
    }

    // For non-priority images, load immediately but use original format
    // The lazy loading was causing issues, so let's load images directly
    setCurrentSrc(getOptimizedSrc(src, 'original'));
  }, [src, priority, width, height]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.log('Image failed to load:', currentSrc);
    // Just use the original src directly if optimization fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setIsError(false);
    } else {
      setIsError(true);
      onError?.();
    }
  };

  const placeholderStyle = placeholder === 'blur' ? {
    filter: 'blur(5px)',
    transform: 'scale(1.1)',
  } : {};

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={placeholderStyle}
        >
          {placeholder === 'blur' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-8 h-8 mx-auto mb-2">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;