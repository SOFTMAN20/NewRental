import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './data/i18n/config'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA with instant updates
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration.scope);
        
        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60 * 1000);
        
        // Auto-update on new version found
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Auto-reload on new version (instant update)
                console.log('🔄 New version found! Auto-updating...');
                
                // Tell service worker to skip waiting
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                
                // Reload page after 1 second
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            });
          }
        });
        
        // Listen for controller change (new SW activated)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.log('❌ SW registration failed:', error);
      });
  });
}

