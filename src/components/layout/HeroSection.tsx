
/**
 * HEROSECTION.TSX - MAIN SEARCH AND HERO COMPONENT
 * ================================================
 * 
 * Sehemu ya utafutaji mkuu wa WanaChuo.com - Main search section for WanaChuo.com
 * 
 * FUNCTIONALITY / KAZI:
 * - Primary landing section with search capabilities (Sehemu ya kwanza na utafutaji)
 * - Location-based property search (Utafutaji wa nyumba kulingana na eneo)
 * - Price range filtering (Kichujio cha bei)
 * - Hero banner with motivational messaging (Ujumbe wa kuhamasisha)
 * - Platform statistics display (Onyesho la takwimu za jukwaa)
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - searchLocation: User's location input (Ingizo la eneo la mtumiaji)
 * - minPrice: Minimu=m price filter (Kichujio cha bei ya chini)
 * - maxPrice: Maximum price filter (Kichujio cha bei ya juu)
 * 
 * USER JOURNEY / SAFARI YA MTUMIAJI:
 * 1. User lands on homepage (Mtumiaji anafika ukurasa wa kwanza)
 * 2. Enters search criteria (Anaingiza vigezo vya utafutaji)
 * 3. Clicks search button (Anabonyeza kitufe cha utafutaji)
 * 4. Navigates to Browse page with filters (Anaenda ukurasa wa Browse na vichujio)
 * 
 * DESIGN FEATURES / VIPENGELE VYA MUUNDO:
 * - Background hero image (Picha ya nyuma ya kishujaa)
 * - Glassmorphism search card (Kadi ya utafutaji ya miwani)
 * - Responsive grid layout (Muundo wa gridi unaojibu)
 * - Animated statistics (Takwimu zenye mchoro)
 * - Enhanced visual hierarchy and animations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Hero Section Component
 * Kipengele cha sehemu ya kishujaa
 * 
 * This is the primary component that users see when they land on the homepage.
 * It combines search functionality with inspirational messaging and platform statistics.
 * 
 * Hiki ni kipengele kikuu ambacho watumiaji wanaona wanapofikia ukurasa wa kwanza.
 * Kinaunganisha utendakazi wa utafutaji na ujumbe wa kuhamasisha na takwimu za jukwaa.
 */
const HeroSection = () => {
  // Search form state management
  // Usimamizi wa hali ya fomu ya utafutaji
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(''); // Single search input
  
  // Detect screen size for responsive image
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const heroImage = isMobile ? '/hero3.webp' : '/heroimage.png';

  return (
    <div className="relative min-h-[40vh] sm:min-h-[50vh] lg:min-h-[55vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background Image - Picha ya nyuma ya kishujaa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center center',
          backgroundAttachment: 'scroll'
        }}
      />
      
      {/* Dark overlay for text readability - Uwazi wa giza kwa kusoma vizuri */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full py-8 sm:py-12 pt-20 sm:pt-24 lg:pt-28">
        {/* Main Hero Content - Maudhui makuu ya kishujaa */}
        <div className="text-left mb-6 sm:mb-8 lg:mb-10">
          {/* Primary headline - Kichwa kikuu */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-1 sm:mb-2 lg:mb-3 leading-tight">
            Search, explore and
            <span className="block">
              book your{' '}
              <span className="relative inline-block text-yellow-300">
                room!
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,7 Q50,3 100,7 T200,7" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </span>
          </h1>
        </div>

        {/* Simple Single Search Bar - Airbnb Style - Search bar moja rahisi */}
        <div className="max-w-2xl mb-6 sm:mb-8 px-0">
          {/* Single Search Bar with Airbnb-style design */}
          <div className="relative border-2 border-gray-300 rounded-full hover:border-primary/50 transition-colors duration-200 focus-within:border-primary shadow-2xl bg-white">
            <Input
              placeholder="Search for housing near your university (UDSM, UDOM, DIT...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-5 sm:pl-6 lg:pl-7 pr-16 sm:pr-20 lg:pr-24 h-12 sm:h-14 lg:h-16 text-sm sm:text-base lg:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/browse${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`;
                }
              }}
            />
            <Link 
              to={`/browse${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`}
            >
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-full p-3 sm:p-3.5 lg:p-4 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              </button>
            </Link>
          </div>
        </div>

        {/* Property Types Tabs - Tabs za aina za nyumba */}
        <div className="max-w-2xl px-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <Link 
              to="/browse?room_type=single_room"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Single Room
            </Link>
            <Link 
              to="/browse?room_type=shared_room"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Shared Room
            </Link>
            <Link 
              to="/browse?room_type=self_contained"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Self Contained
            </Link>
            <Link 
              to="/browse?room_type=master_room"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Master Room
            </Link>
            <Link 
              to="/browse?room_type=apartment"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Apartment
            </Link>
            <Link 
              to="/browse?room_type=studio"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Studio
            </Link>
            <Link 
              to="/browse?room_type=dormitory"
              className="flex-shrink-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 
                         hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-white text-sm font-medium
                         whitespace-nowrap"
            >
              Dormitory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;