
/**
 * INDEX.TSX - HOMEPAGE COMPONENT
 * ==============================
 * 
 * Ukurasa wa kwanza wa Nyumba Link - Homepage for Nyumba Link
 * 
 * MOBILE APP-LIKE DESIGN - Muundo kama programu ya simu
 * - Compact hero section (Sehemu ya utafutaji fupi)
 * - Simplified content structure (Muundo rahisi wa maudhui)
 * - Focus on essential features (Mkazo wa vipengele muhimu)
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays the main landing page (Inaonyesha ukurasa wa kwanza)
 * - Contains search functionality (Ina utafutaji wa nyumba)
 * - Shows featured properties (Inaonyesha nyumba maalum)
 * - Displays platform benefits (Inaonyesha faida za mfumo)
 */

import { lazy, Suspense } from 'react';
import Navigation from "@/components/layout/Navigation";
import HeroSection from "@/components/layout/HeroSection";
import { Link } from 'react-router-dom';

// Lazy load below-the-fold components
const FeaturedProperties = lazy(() => import("@/components/common/FeaturedProperties"));
const Footer = lazy(() => import("@/components/layout/Footer"));

/**
 * Homepage Component - Mobile App-like Design
 * Kipengele cha ukurasa wa kwanza - Muundo kama programu ya simu
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Global navigation - Uongozaji wa kimataifa */}
      <Navigation />
      
      {/* Hero section wrapper with rounded bottom */}
      <div className="rounded-b-[2rem] sm:rounded-b-[3rem] overflow-hidden">
        {/* Compact hero section with search - Sehemu ya utafutaji fupi */}
        <HeroSection />
      </div>
      
      {/* Featured Properties - Only essential content - Nyumba maalum tu */}
      <Suspense fallback={
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <FeaturedProperties />
      </Suspense>
      
      {/* Simplified Call to Action Section - Wito rahisi wa kitendo */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
              {/* Background pattern for visual interest */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg">
                  Tayari Kuanza? Jisajili Sasa!
                </h3>
                <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/95 font-medium leading-relaxed max-w-2xl mx-auto">
                  Jiunge na elfu za Watanzania wanaotumia WanaChuo.com kupata nyumba zao za ndoto.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                  <Link
                    to="/signup?type=landlord"
                    className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform"
                  >
                    Jisajili Kama Mwenye Nyumba
                  </Link>
                  <Link 
                    to="/browse" 
                    className="w-full sm:w-auto border-2 sm:border-3 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Tafuta Nyumba
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Minimal footer for mobile app feel */}
      <Suspense fallback={
        <div className="py-4 flex justify-center bg-gray-50">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
