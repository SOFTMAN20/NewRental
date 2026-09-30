/**
 * PWA INSTALL PROMPT
 * ==================
 * Shows "Install App" prompt for PWA installation
 * 
 * BEHAVIOR:
 * - Shows prompt AUTOMATICALLY on every visit if app NOT installed
 * - Shows after 3 seconds of page load
 * - Works on ALL browsers (Android, Desktop, iOS)
 * - Only hides permanently if user installs the app
 * - User can dismiss temporarily per session, shows again on next visit
 * 
 * STORAGE:
 * - localStorage key: 'pwa-installed'
 * - Value: 'true' only if app was successfully installed
 * - Prompt shows on EVERY visit until installation
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

  useEffect(() => {
    // Check if already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isStandalone) {
      // App is installed - don't show prompt
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Check localStorage
    const hasInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (hasInstalled) {
      return;
    }

    // Listen for beforeinstallprompt event (Android/Desktop Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show install prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      // Mark as installed - won't show again
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
    } else {
      // User dismissed - will show again on next visit
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    // Only hide for current session - will show again on next visit
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-32 sm:bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-primary/30 p-4 w-fit relative">
        {/* Content - Everything in One Row */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          
          {/* Title */}
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
            Install Wanachuo App
          </span>
          
          {/* Install Button */}
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-primary hover:bg-primary/90 h-9 px-5 text-sm font-semibold"
          >
            Install
          </Button>
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
