/**
 * UPDATE NOTIFIER
 * ===============
 * Detects new app updates and auto-refreshes instantly
 * No user interaction needed - seamless updates
 */

import { useEffect } from 'react';

const UpdateNotifier: React.FC = () => {
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const checkForUpdates = async () => {
      try {
        // Check service worker for updates
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (registration) {
            // Check for updates
            await registration.update();
            
            // Listen for new service worker
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Auto-update instantly
                    console.log('✅ New update found! Auto-updating...');
                    
                    // Skip waiting
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    
                    // Clear caches
                    if ('caches' in window) {
                      caches.keys().then((names) => {
                        names.forEach((name) => {
                          caches.delete(name);
                        });
                      });
                    }
                    
                    // Auto-reload after 500ms
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  }
                });
              }
            });
          }
        }

        // Also check build version via meta tag or API
        const response = await fetch('/manifest.json', { 
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          const manifest = await response.json();
          const currentVersion = localStorage.getItem('app-version');
          const newVersion = manifest.name || 'v1';
          
          if (currentVersion && currentVersion !== newVersion) {
            console.log('✅ New version detected:', newVersion, '- Auto-updating...');
            localStorage.setItem('app-version', newVersion);
            
            // Auto-reload instantly
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            localStorage.setItem('app-version', newVersion);
          }
        }
      } catch (error) {
        console.log('Update check failed:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Check every 30 seconds (more frequent for instant updates)
    checkInterval = setInterval(checkForUpdates, 30 * 1000);

    // Check when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // No UI - auto-updates happen in background
  return null;
};

export default UpdateNotifier;
