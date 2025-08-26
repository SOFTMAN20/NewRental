
/**
 * HEROSECTION.TSX - MAIN SEARCH AND HERO COMPONENT
 * ================================================
 * 
 * Sehemu ya utafutaji mkuu wa Nyumba Link - Main search section for Nyumba Link
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
import heroBackground from '@/assets/hero-background.jpg';
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
  const [searchLocation, setSearchLocation] = useState(''); // Location search input
  const [minPrice, setMinPrice] = useState('');           // Minimum price filter
  const [maxPrice, setMaxPrice] = useState('');           // Maximum price filter

  return (
    <div className="relative min-h-[80vh] sm:min-h-[90vh] lg:min-h-[100vh] flex items-center overflow-hidden">
      {/* Hero Background Image - Picha ya nyuma ya kishujaa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Dark overlay for text readability - Uwazi wa giza kwa kusoma vizuri */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated background elements for visual interest */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-serengeti-400/30 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-primary/15 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Hero Content - Maudhui makuu ya kishujaa */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          {/* Primary headline - Kichwa kikuu */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            {t('homepage.heroTitle')}
            <span className="block text-primary drop-shadow-lg">{t('homepage.heroTitleHighlight')}</span>
          </h1>
          
          {/* Supporting message - Ujumbe wa kusaidia */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 drop-shadow-md">
            {t('homepage.heroSubtitle')}
          </p>
        </div>

        {/* Enhanced Search Interface Card - Kadi ya kiolesura cha utafutaji */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-md 
                           transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                
                {/* Location Search Input - Ingizo la utafutaji wa eneo */}
                <div className="sm:col-span-2 lg:col-span-1 group">
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 
                                   group-hover:text-primary transition-colors duration-300">
                    {t('homepage.searchLocation')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground 
                                       group-hover:text-primary transition-colors duration-300" />
                    <Input
                      placeholder={t('homepage.locationPlaceholder')}
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-lg border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus:ring-4 focus:ring-primary/20 
                                 focus:ring-offset-2"
                    />
                  </div>
                </div>

                {/* Price Range Inputs - Maingizo ya kiwango cha bei */}
                <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
                  {/* Minimum Price - Bei ya chini */}
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 
                                     group-hover:text-primary transition-colors duration-300">
                      {t('homepage.minPrice')}
                    </label>
                    <Input
                      type="number"
                      placeholder="30,000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-12 sm:h-14 text-sm sm:text-lg border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus:ring-4 focus:ring-primary/20 
                                 focus:ring-offset-2"
                    />
                  </div>
                  {/* Maximum Price - Bei ya juu */}
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 
                                     group-hover:text-primary transition-colors duration-300">
                      {t('homepage.maxPrice')}
                    </label>
                    <Input
                      type="number"
                      placeholder="1,000,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-12 sm:h-14 text-sm sm:text-lg border-2 border-border focus:border-primary 
                                 hover:border-primary/50 transition-all duration-300 focus:ring-4 focus:ring-primary/20 
                                 focus:ring-offset-2"
                    />
                  </div>
                </div>

                {/* Enhanced Search Button with Navigation - Kitufe cha utafutaji na uongozaji */}
                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <Link 
                    to={`/browse${searchLocation || minPrice || maxPrice ? '?' : ''}${searchLocation ? `location=${encodeURIComponent(searchLocation)}` : ''}${searchLocation && (minPrice || maxPrice) ? '&' : ''}${minPrice ? `minPrice=${minPrice}` : ''}${minPrice && maxPrice ? '&' : ''}${maxPrice ? `maxPrice=${maxPrice}` : ''}`}
                    className="w-full"
                  >
                    <Button size="lg" 
                            className="w-full h-12 sm:h-14 text-sm sm:text-lg bg-gradient-to-r from-primary to-serengeti-500 
                                       hover:from-primary/90 hover:to-serengeti-400 shadow-lg hover:shadow-xl 
                                       transform hover:-translate-y-1 transition-all duration-300 
                                       focus:ring-4 focus:ring-primary/20 focus:ring-offset-2">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3" />
                      {t('homepage.searchButton')}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Platform Statistics - Takwimu za jukwaa */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Available Properties - Nyumba zinazopatikana */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-white/80">{t('homepage.availableProperties')}</div>
          </div>
          
          {/* Major Cities Coverage - Miji mikuu */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 
                            bg-gradient-to-r from-white to-serengeti-400 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-white/80">{t('homepage.majorCities')}</div>
          </div>
          
          {/* Happy Customers - Wateja wenye furaha */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 
                            bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              1000+
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-white/80">{t('homepage.happyCustomers')}</div>
          </div>
          
          {/* Customer Support - Msaada wa wateja */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 
                          hover:bg-white/20 hover:scale-105 transition-all duration-300 
                          border border-white/20 hover:border-white/40">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 
                            bg-gradient-to-r from-white to-serengeti-400 bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-white/80">{t('homepage.quickSupport')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;