
/**
 * INDEX.TSX - HOMEPAGE COMPONENT
 * ==============================
 * 
 * Ukurasa wa kwanza wa Nyumba Link - Homepage for Nyumba Link
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays the main landing page (Inaonyesha ukurasa wa kwanza)
 * - Contains search functionality (Ina utafutaji wa nyumba)
 * - Shows popular destinations (Inaonyesha miji maarufu)
 * - Features highlighted properties (Inaonyesha nyumba maalum)
 * - Displays platform benefits (Inaonyesha faida za mfumo)
 * 
 * COMPONENT STRUCTURE / MUUNDO WA VIPENGELE:
 * 1. Navigation - Top navigation bar (Mstari wa uongozaji juu)
 * 2. HeroSection - Main search and intro (Sehemu ya utafutaji mkuu)
 * 3. PopularDestinations - Featured cities (Miji maarufu)
 * 4. FeaturedProperties - Highlighted properties (Nyumba maalum)
 * 5. FeaturesSection - Platform benefits (Faida za mfumo)
 * 6. Footer - Bottom information (Maelezo ya chini)
 * 
 * USER FLOW / MTIRIRIKO WA MTUMIAJI:
 * Landing → Search → Browse/Details → Authentication/Favorites
 */

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PopularDestinations from "@/components/PopularDestinations";
import FeaturedProperties from "@/components/FeaturedProperties";
import { Link } from 'react-router-dom';
import Footer from "@/components/Footer";

/**
 * Homepage Component
 * Kipengele cha ukurasa wa kwanza
 * 
 * This is the main landing page that users see when they visit the site.
 * It combines multiple sections to create a comprehensive overview of the platform.
 * 
 * Huu ni ukurasa wa kwanza ambao watumiaji wanaona wanapovisimu tovuti.
 * Unaunganisha sehemu nyingi kuunda muhtasari mkamilifu wa jukwaa.
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Global navigation - Uongozaji wa kimataifa */}
      <Navigation />
      
      {/* Main hero section with search - Sehemu ya utafutaji mkuu */}
      <HeroSection />
      
      {/* Popular cities and destinations - Miji na maeneo maarufu */}
      <PopularDestinations />
      
      {/* Highlighted property listings - Nyumba zilizoangaziwa */}
      <FeaturedProperties />
      
      {/* Call to Action Section - Sehemu ya Wito wa Kitendo */}
      <section className="py-20 bg-gradient-to-b from-white to-safari-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-serengeti-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Tayari Kuanza? Jisajili Sasa!
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Jiunge na elfu za Watanzania wanaotumia Nyumba Link kupata nyumba zao za ndoto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup?type=landlord"
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block text-center"
                >
                  Jisajili Kama Mwenye Nyumba
                </Link>
                <Link 
                  to="/browse" 
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors inline-block text-center"
                >
                  Tafuta Nyumba
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer with additional information - Kichapo na maelezo ya ziada */}
      <Footer />
    </div>
  );
};

export default Index;
