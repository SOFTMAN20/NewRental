/**
 * PERFORMANCE DASHBOARD
 * ====================
 * 
 * Development-only component to monitor performance metrics
 */

import React, { useState, useEffect } from 'react';
import { cacheManager } from '@/utils/cache';

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(cacheManager.getMetrics());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(cacheManager.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Dashboard"
      >
        📊
      </button>

      {/* Dashboard */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Cache Hit Rate */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cache Hit Rate:</span>
              <span className={`font-medium ${metrics.hitRate > 80 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.hitRate.toFixed(1)}% {metrics.hitRate > 80 ? '✅' : '❌'}
              </span>
            </div>

            {/* Total Requests */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Requests:</span>
              <span className="font-medium text-gray-900">{metrics.totalRequests}</span>
            </div>

            {/* Cache Hits */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cache Hits:</span>
              <span className="font-medium text-green-600">{metrics.hits}</span>
            </div>

            {/* Cache Misses */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cache Misses:</span>
              <span className="font-medium text-red-600">{metrics.misses}</span>
            </div>

            {/* Performance Targets */}
            <div className="border-t pt-3 mt-3">
              <div className="text-xs text-gray-500 mb-2">Performance Targets:</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>API Response:</span>
                  <span>&lt; 500ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit Rate:</span>
                  <span>&gt; 80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Load Time:</span>
                  <span>&lt; 3s (3G)</span>
                </div>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                cacheManager.resetMetrics();
                setMetrics(cacheManager.getMetrics());
              }}
              className="w-full mt-3 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
            >
              Reset Metrics
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceDashboard;