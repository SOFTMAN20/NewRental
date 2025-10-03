import React from 'react';

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Inapakia...</p>
    </div>
  </div>
);

export default PageLoader;