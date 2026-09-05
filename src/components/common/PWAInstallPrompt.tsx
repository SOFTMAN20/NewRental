/**
 * PWA INSTALL PROMPT
 * ==================
 * Shows "Install App" prompt for PWA installation
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
      return; // Already installed
    }

    // Check if user dismissed prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return; // Don't show again for 7 days
      }
    }

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
    } else {
      console.log('❌ User dismissed PWA install');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-24 z-40 animate-in slide-in-from-bottom">
      <div className="bg-gradient-to-r from-primary to-serengeti-600 text-white rounded-xl shadow-2xl p-3 max-w-sm relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-1.5 right-1.5 text-white/80 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
            <Download className="h-5 w-5" />
          </div>
          
          <div className="flex-1 pr-6">
            <p className="text-sm font-medium mb-2">
              Install app
            </p>
            
            {!isIOS && deferredPrompt && (
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 h-7 text-xs px-4"
              >
                Install
              </Button>
            )}

            {isIOS && (
              <p className="text-xs text-white/80">
                Tap (⬆️) → Add to Home Screen
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
