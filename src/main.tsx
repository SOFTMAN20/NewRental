import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './data/i18n/config'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update prompt
                console.log('🔄 New content available! Please refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('❌ SW registration failed:', error);
      });
  });
}

