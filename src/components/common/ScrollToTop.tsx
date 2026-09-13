/**
 * SCROLL TO TOP - ROUTE CHANGE HANDLER
 * =====================================
 * 
 * Automatically scrolls page to top when route changes
 * Ensures users always start at the top of new pages
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
