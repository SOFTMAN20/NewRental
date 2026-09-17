/**
 * SECURITY MONITOR COMPONENT
 * ==========================
 * 
 * Monitors and prevents common security threats in real-time
 * Inafuatilia na kuzuia vitisho vya usalama wakati halisi
 * 
 * Features:
 * - XSS Detection
 * - Rate Limiting
 * - Suspicious Activity Detection
 * - Security Event Logging
 */

import { useEffect } from 'react';
import { detectXSS, logSecurityEvent, checkRateLimit } from '@/utils/security';

const SecurityMonitor = () => {
  useEffect(() => {
    // Monitor for suspicious DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for dangerous scripts
            if (element.tagName === 'SCRIPT') {
              const src = element.getAttribute('src');
              if (src && !src.includes('wanachuo.com') && !src.includes('supabase.co')) {
                logSecurityEvent('suspicious_script', { src }, 'high');
                console.warn('🚨 Suspicious script detected:', src);
              }
            }
            
            // Check for iframes
            if (element.tagName === 'IFRAME') {
              const src = element.getAttribute('src');
              logSecurityEvent('suspicious_iframe', { src }, 'high');
              console.warn('🚨 Suspicious iframe detected:', src);
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Monitor console for suspicious activity
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Check for known attack patterns
      if (message.includes('eval') || message.includes('Function')) {
        logSecurityEvent('suspicious_eval', { message }, 'critical');
      }
      
      originalConsoleError(...args);
    };

    // Monitor for rapid form submissions (potential bot)
    let formSubmissionCount = 0;
    let lastSubmissionTime = Date.now();
    
    const handleFormSubmit = (e: Event) => {
      const now = Date.now();
      const timeDiff = now - lastSubmissionTime;
      
      // If more than 3 submissions in 5 seconds
      if (timeDiff < 5000) {
        formSubmissionCount++;
        
        if (formSubmissionCount > 3) {
          e.preventDefault();
          logSecurityEvent('rapid_form_submission', {
            count: formSubmissionCount,
            timeDiff,
          }, 'high');
          alert('Msaada wa usalama: Form submissions zimezuiwa kwa muda. / Security: Form submissions temporarily blocked.');
        }
      } else {
        formSubmissionCount = 1;
      }
      
      lastSubmissionTime = now;
    };
    
    document.addEventListener('submit', handleFormSubmit);

    // Check for devtools (potential debugging/tampering)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools might be open
        // Don't block, just log
        if (process.env.NODE_ENV === 'production') {
          logSecurityEvent('devtools_detected', {}, 'low');
        }
      }
    };

    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      observer.disconnect();
      console.error = originalConsoleError;
      document.removeEventListener('submit', handleFormSubmit);
      clearInterval(devToolsInterval);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default SecurityMonitor;
