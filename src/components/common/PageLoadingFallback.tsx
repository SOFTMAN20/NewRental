/**
 * PAGE LOADING FALLBACK
 * ======================
 * Shows when pages are lazy loading
 * Better UX than blank screen
 */

import React from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Inapakia...</p>
    </div>
  );
};

export default PageLoadingFallback;
