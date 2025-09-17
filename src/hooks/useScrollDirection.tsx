/**
 * USE SCROLL DIRECTION HOOK
 * ========================
 * 
 * Custom React hook that detects scroll direction and provides
 * visibility state for UI elements that should hide on scroll down
 * and show on scroll up (like mobile bottom navigation).
 * 
 * FEATURES:
 * - Debounced scroll detection to prevent jittery behavior
 * - Configurable scroll threshold
 * - Automatic cleanup of event listeners
 * - TypeScript support
 */

import { useState, useEffect } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number; // Minimum scroll distance before hiding/showing
  minScrollY?: number; // Minimum scroll position before hiding
}

interface ScrollDirectionState {
  isVisible: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollY: number;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}): ScrollDirectionState => {
  const { threshold = 10, minScrollY = 100 } = options;
  
  const [isVisible, setIsVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Only update if scrolled more than threshold to avoid jittery behavior
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }
      
      // Determine scroll direction
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      
      // Update visibility based on scroll direction and position
      if (direction === 'down' && currentScrollY > minScrollY) {
        // Scrolling down and past minimum scroll position - hide immediately
        setIsVisible(false);
      } else if (direction === 'up' || currentScrollY <= minScrollY) {
        // Scrolling up or at top - show with slight delay for better UX
        setTimeout(() => setIsVisible(true), 50);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, threshold, minScrollY]);

  return {
    isVisible,
    scrollDirection,
    scrollY
  };
};

export default useScrollDirection;
