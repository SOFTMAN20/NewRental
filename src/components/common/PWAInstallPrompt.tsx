/**
 * PWA INSTALL PROMPT
 * ==================
 * Shows "Install App" prompt for PWA installation
 * 
 * BEHAVIOR:
 * - Shows prompt 5 seconds after page load
 * - Shows EVERY TIME user visits if app is not installed
 * - Only hides if user actually installs the app
 * - User can dismiss temporarily per session, but will show again on next visit
 * 
 * STORAGE:
 * - localStorage key: 'pwa-installed'
 * - Value: 'true' only if app was successfully installed
 * - Prompt shows on every new visit until installation
 */

import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      // Mark as installed
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Check if user has installed before
    const hasInstalled = localStorage.getItem('pwa-installed') === 'true';
    if (hasInstalled) {
      return; // Already installed, don't show
    }

    // Show prompt to everyone who hasn't installed, every visit
    console.log('📱 PWA not installed - showing install prompt');

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS instructions after 5 seconds
    if (iOS && !isStandalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted PWA install');
      // Mark as installed - won't show again
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('❌ User dismissed PWA install - will show again on next visit');
      // Don't save anything - will show again on next visit
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    console.log('❌ PWA install dismissed for this session - will show again on next visit');
    // Only hide for current session - will show again on next visit
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-40 animate-in slide-in-from-bottom">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs relative">
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
          <Download className="h-5 w-5 text-primary flex-shrink-0" />
          
          <div className="flex-1">
            {!isIOS && deferredPrompt ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Install Wanachuo</span>
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 h-7 text-xs px-3"
                >
                  Install
                </Button>
              </div>
            ) : isIOS ? (
              <div className="text-sm text-gray-700">
                Install Wanachuo: Tap ⬆️ then "Add to Home Screen"
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
