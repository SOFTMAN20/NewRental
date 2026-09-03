/**
 * Performance Monitoring Utilities
 * ===============================
 * 
 * Utilities to monitor and report performance metrics
 */

export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Use requestIdleCallback for better performance
    const measureWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          measureMetrics();
        });
      } else {
        setTimeout(measureMetrics, 100);
      }
    };

    const measureMetrics = () => {
      try {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (!perfData) return;
        
        const metrics = {
          // Core Web Vitals
          loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
          firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
          firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
          
          // Network timing
          dnsLookup: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
          serverResponse: Math.round(perfData.responseEnd - perfData.requestStart),
        };
        
        // Only log in development and if metrics are valid
        if (process.env.NODE_ENV === 'development' && metrics.loadTime > 0) {
          console.group('🚀 WanaChuo.com Performance');
          console.log(`📊 Load Time: ${metrics.loadTime}ms ${metrics.loadTime < 3000 ? '✅' : '❌'}`);
          console.log(`🎨 First Paint: ${metrics.firstPaint}ms`);
          console.log(`📱 3G Target: ${metrics.loadTime < 3000 ? 'ACHIEVED' : 'NEEDS WORK'}`);
          console.groupEnd();
        }
        
        return metrics;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    };

    if (document.readyState === 'complete') {
      measureWhenIdle();
    } else {
      window.addEventListener('load', measureWhenIdle);
    }
  }
};

export const measureLCP = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      let lcpValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.startTime;
        
        // Only log final LCP value
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            console.log(`🎯 LCP: ${Math.round(lcpValue)}ms ${lcpValue < 2500 ? '✅' : '❌'}`);
          }, 100);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Disconnect after 10 seconds to avoid memory leaks
      setTimeout(() => observer.disconnect(), 10000);
    } catch (error) {
      // Silently fail in production
      if (process.env.NODE_ENV === 'development') {
        console.warn('LCP measurement not supported');
      }
    }
  }
};

export const measureCLS = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Report final CLS after page is stable
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development' && clsValue > 0) {
          console.log(`📐 CLS: ${clsValue.toFixed(3)} ${clsValue < 0.1 ? '✅' : '❌'}`);
        }
        observer.disconnect();
      }, 5000);
    } catch (error) {
      // Silently fail
    }
  }
};

// API Performance monitoring
export const measureAPIPerformance = (endpoint: string, startTime: number) => {
  const endTime = performance.now();
  const responseTime = endTime - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 API ${endpoint}: ${responseTime.toFixed(0)}ms ${responseTime < 500 ? '✅' : '❌'}`);
  }
  
  return responseTime;
};

// Image loading performance
export const measureImageLoad = (src: string, startTime: number) => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🖼️ Image Load: ${loadTime.toFixed(0)}ms`);
  }
  
  return loadTime;
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  measurePageLoad();
  measureLCP();
  measureCLS();
  
  // Monitor resource loading
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            if (resource.name.includes('api') || resource.name.includes('supabase')) {
              const responseTime = resource.responseEnd - resource.requestStart;
              if (process.env.NODE_ENV === 'development') {
                console.log(`🔗 Resource: ${responseTime.toFixed(0)}ms ${responseTime < 500 ? '✅' : '❌'}`);
              }
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      // Silently fail
    }
  }
};