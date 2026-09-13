/**
 * SCROLL TO TOP - ROUTE CHANGE HANDLER
 * =====================================
 * 
 * Automatically scrolls page to top when route changes
 * Ensures users always start at the top of new pages
 * 
 * FIXES:
 * - Prevents browser's scroll restoration
 * - Works on page refresh
 * - Slight delay to ensure DOM is ready
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top with slight delay to ensure DOM is ready
    // This fixes the issue where page loads at bottom on refresh
    const scrollTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate scroll
      });
    }, 0);

    return () => clearTimeout(scrollTimer);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
