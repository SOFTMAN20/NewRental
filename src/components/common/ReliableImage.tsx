/**
 * RELIABLE IMAGE COMPONENT
 * =======================
 * 
 * Ultra-simple image component that just works
 */

import React from 'react';
import { cn } from '@/utils/utils';

interface ReliableImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  onLoad,
  onError,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={onError}
      className={cn('w-full h-full object-cover', className)}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ReliableImage;