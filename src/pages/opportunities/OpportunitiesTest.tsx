/**
 * OPPORTUNITIES TEST PAGE - Simple version to test routing
 */

import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const OpportunitiesTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            🎯 Opportunities Platform
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            Test page - If you see this, routing works! ✅
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-xl mb-2">Opportunity {i}</h3>
                <p className="text-gray-600">This is a test opportunity card</p>
                <Button className="mt-4">View Details</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunitiesTest;
