/**
 * UPDATE NOTIFIER
 * ===============
 * Detects new app updates and prompts user to refresh
 * Checks for updates every 30 minutes
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpdateNotifier: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
                    // New service worker installed, show update prompt
                    console.log('✅ New update available!');
                    setShowUpdate(true);
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
            console.log('✅ New version detected:', newVersion);
            setShowUpdate(true);
          }
          
          localStorage.setItem('app-version', newVersion);
        }
      } catch (error) {
        console.log('Update check failed:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Check every 30 minutes
    checkInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Clear service worker cache and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }

    // Clear caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Force reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again in 1 hour if they dismiss
    setTimeout(() => {
      setShowUpdate(true);
    }, 60 * 60 * 1000);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top">
      <div className="bg-white rounded-lg shadow-xl border-2 border-primary/20 p-3 max-w-sm relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-center gap-3 pr-6">
          <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
            <RefreshCw className={`h-5 w-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              New Update Available!
            </p>
            <p className="text-xs text-gray-600 mb-2">
              Refresh to get the latest features
            </p>
            
            <Button
              onClick={handleRefresh}
              size="sm"
              disabled={isRefreshing}
              className="bg-primary hover:bg-primary/90 h-7 text-xs px-3"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotifier;
