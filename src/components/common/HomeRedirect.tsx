/**
 * HOMEREDIRECT.TSX - AUTOMATIC HOMEPAGE REDIRECT
 * ==============================================
 * 
 * Component ya ku-redirect user to homepage automatically
 * Ensures user always sees homepage when opening app
 * 
 * USE CASES / MATUMIZI:
 * - PWA opens at homepage instead of cached page
 * - 404 pages redirect to homepage
 * - Invalid routes redirect to homepage
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HomeRedirectProps {
  enabled?: boolean;
  delay?: number;
}

/**
 * HOME REDIRECT COMPONENT
 * ======================
 * 
 * Monitors app opening and redirects to homepage if needed.
 * Works with PWA and regular web app.
 */
const HomeRedirect = ({ enabled = true, delay = 0 }: HomeRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    // Check if this is a PWA launch
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');

    // Check if URL has PWA source param
    const urlParams = new URLSearchParams(window.location.search);
    const isPWASource = urlParams.get('source') === 'pwa';

    // Check if we're on homepage already
    const isHomepage = location.pathname === '/' || location.pathname === '/index.html';

    // If PWA launch and not on homepage, redirect to homepage
    if ((isPWA || isPWASource) && !isHomepage) {
      console.log('[HomeRedirect] PWA launch detected, redirecting to homepage');
      
      if (delay > 0) {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, delay);
      } else {
        navigate('/', { replace: true });
      }
    }

    // If on /index.html, redirect to /
    if (location.pathname === '/index.html') {
      console.log('[HomeRedirect] /index.html detected, redirecting to /');
      navigate('/', { replace: true });
    }
  }, [location, navigate, enabled, delay]);

  return null; // This component doesn't render anything
};

export default HomeRedirect;
