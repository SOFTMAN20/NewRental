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
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    console.log('🔍 PWA Install Prompt - Starting...');
    
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
    console.log('📱 Device type:', iOS ? 'iOS' : 'Android/Desktop');

    // Check if already installed (running in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    console.log('🖥️ Display mode:', isStandalone ? 'standalone (APP INSTALLED)' : 'browser (NOT INSTALLED)');
    
    if (isStandalone) {
      // App is installed - don't show prompt
      localStorage.setItem('pwa-installed', 'true');
      console.log('✅ App is installed - not showing prompt');
      return;
    }

    // Check localStorage (but this is just a backup check)
    const hasInstalled = localStorage.getItem('pwa-installed') === 'true';
    console.log('💾 localStorage pwa-installed:', hasInstalled ? 'true' : 'false/null');
    
    if (hasInstalled) {
      console.log('✅ User has installed before - not showing prompt');
      return;
    }

    // APP NOT INSTALLED - SHOW PROMPT AUTOMATICALLY
    console.log('📱 PWA NOT INSTALLED - Will show install prompt in 3 seconds');

    // Listen for beforeinstallprompt event (Android/Desktop Chrome/Edge)
    const handler = (e: Event) => {
      console.log('🎉 beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    console.log('👂 Listening for beforeinstallprompt event...');

    // SHOW PROMPT AFTER 3 SECONDS - REGARDLESS OF BROWSER
    // This ensures prompt shows on ALL devices that don't have app installed
    setTimeout(() => {
      console.log('✅ Showing PWA install prompt NOW (app not installed)');
      setShowPrompt(true);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    // For iOS - show instructions
    if (isIOS) {
      alert('📱 Jinsi ya kuinstall:\n\n1. Bonyeza icon ya "Share" ⬆️ chini ya browser\n2. Scroll chini\n3. Chagua "Add to Home Screen"\n4. Bonyeza "Add"');
      return;
    }

    if (!deferredPrompt) {
      console.log('ℹ️ No deferred prompt - showing generic instructions');
      alert('📱 Jinsi ya kuinstall:\n\nBofya menu ya browser (⋮) kisha chagua "Install app" au "Add to Home screen"');
      return;
    }

    // Show install prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted PWA install - hiding prompt permanently');
      // Mark as installed - won't show again
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
    } else {
      console.log('❌ User dismissed PWA install - will show again on next visit');
      // Don't save anything - will show again on next visit
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    console.log('❌ PWA install dismissed for this session - will show again on next visit');
    // Only hide for current session - will show again on next visit
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-40 animate-in slide-in-from-bottom">
      <div className="bg-white rounded-lg shadow-xl border-2 border-primary/20 p-4 max-w-sm relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-center gap-3 pr-6">
          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
            <Download className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Install Wanachuo App
            </h3>
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 h-9 text-sm font-medium"
            >
              Install
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
