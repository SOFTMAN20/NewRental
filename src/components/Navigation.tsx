
/**
 * NAVIGATION.TSX - GLOBAL NAVIGATION COMPONENT
 * ===========================================
 * 
 * Kipengele cha uongozaji wa kimataifa - Global navigation component
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - Global navigation across all pages (Uongozaji wa kimataifa kwa kurasa zote)
 * - Multi-language support (English/Swahili) (Msaada wa lugha nyingi)
 * - Responsive design for mobile and desktop (Muundo unaojibu kwa simu na kompyuta)
 * - User authentication state display (Onyesho la hali ya uthibitisho wa mtumiaji)
 * - Active page highlighting (Kuangazia ukurasa unaotumika)
 * 
 * KEY FEATURES / VIPENGELE VIKUU:
 * - Brand logo with home link (Nembo ya chapa na kiungo cha nyumbani)
 * - Primary navigation menu (Menyu ya uongozaji wa msingi)
 * - Language toggle (Kubadili lugha)
 * - Mobile hamburger menu (Menyu ya simu)
 * - User account access (Ufikiaji wa akaunti ya mtumiaji)
 * 
 * NAVIGATION STRUCTURE / MUUNDO WA UONGOZAJI:
 * - Home: Landing page (Ukurasa wa kwanza)
 * - Browse: Property listings (Orodha ya nyumba)
 * - Dashboard: Host/Landlord panel (Dashibodi ya mwenye nyumba)
 * - Authentication: Sign in/up (Kuingia/Kujisajili)
 * 
 * RESPONSIVE BEHAVIOR / TABIA YA KUJIBU:
 * - Desktop: Horizontal navigation bar
 * - Mobile: Collapsible hamburger menu
 * - Tablet: Adaptive layout
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, User, Menu, X, Globe, Building2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

/**
 * Global Navigation Component
 * Kipengele cha uongozaji wa kimataifa
 * 
 * This component appears on every page and provides the main navigation
 * structure for the entire application with multi-language support.
 * 
 * Kipengele hiki kinaonekana kila ukurasa na kinatoa muundo wa uongozaji
 * wa msingi kwa programu nzima na msaada wa lugha nyingi.
 */
const Navigation = () => {
  // Component state management
  // Usimamizi wa hali ya kipengee
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu visibility
  const location = useLocation(); // Current page location for active states
  const { user, signOut } = useAuth(); // Authentication state
  const { t, i18n } = useTranslation();

  /**
   * Language Toggle Function
   * Utendakazi wa kubadilisha lugha
   * 
   * Switches between English and Swahili interface languages
   * Inabadilisha kati ya lugha za Kiingereza na Kiswahili
   */
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Brand Logo Section - Sehemu ya nembo ya chapa */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg sm:rounded-xl">
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold text-primary">Nyumba</span>
              <span className="text-lg sm:text-2xl font-bold text-serengeti-600">Link</span>
            </div>
          </Link>

          {/* Desktop Navigation Menu - Menyu ya uongozaji wa kompyuta */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link - Kiungo cha nyumbani */}
            <Link to="/">
              <Button
                variant="ghost"
                className={`px-3 sm:px-4 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base ${
                  location.pathname === '/' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {t('navigation.home')}
              </Button>
            </Link>
            
            {/* Browse Properties Link - Kiungo cha kutazama nyumba */}
            <Link to="/browse">
              <Button
                variant="ghost"
                className={`px-3 sm:px-4 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base ${
                  location.pathname === '/browse' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {t('navigation.browse')}
              </Button>
            </Link>
            
            {/* About Us Link - Kiungo cha kuhusu */}
            <Link to="/about">
              <Button
                variant="ghost"
                className={`px-3 sm:px-4 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base ${
                  location.pathname === '/about' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {t('navigation.about')}
              </Button>
            </Link>
            
            {/* Host Dashboard Link - Kiungo cha dashibodi ya mwenye nyumba */}
            <Link to={user ? "/dashboard" : "/signup?type=landlord"}>
              <Button
                variant="ghost"
                className={`px-3 sm:px-4 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base ${
                  location.pathname === '/dashboard' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {t('navigation.becomeHost')}
              </Button>
            </Link>
          </div>

          {/* Desktop Right Side Controls - Vidhibiti vya upande wa kulia vya kompyuta */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle Button - Kitufe cha kubadilisha lugha */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-100"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">{i18n.language.toUpperCase()}</span>
            </Button>

            {/* User Account Menu - Menyu ya akaunti ya mtumiaji */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('navigation.dashboard')}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-100 text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.signOut')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="text-sm sm:text-base px-2 sm:px-3">
                    {t('navigation.signIn')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-2 sm:px-3">
                    {t('navigation.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button - Kitufe cha menyu ya simu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 sm:p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Menyu ya uongozaji wa simu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-screen overflow-y-auto">
              {/* Mobile Home Link - Kiungo cha nyumbani kwa simu */}
              <Link
                to="/"
                className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.home')}
                </div>
              </Link>
              
              {/* Mobile Browse Link - Kiungo cha kutazama kwa simu */}
              <Link
                to="/browse"
                className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.browse')}
                </div>
              </Link>
              
              {/* Mobile About Link - Kiungo cha kuhusu kwa simu */}
              <Link
                to="/about"
                className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.about')}
                </div>
              </Link>
              
              {/* Mobile Dashboard Link - Kiungo cha dashibodi kwa simu */}
              {user && (
                <Link
                  to="/dashboard"
                  className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                    {t('navigation.dashboard')}
                  </div>
                </Link>
              )}
              
              <Link
                to={user ? "/dashboard" : "/signup?type=landlord"}
                className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.becomeHost')}
                </div>
              </Link>

              {/* Mobile User Actions Section - Sehemu ya vitendo vya mtumiaji kwa simu */}
              <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                {/* Mobile Language Toggle - Kubadilisha lugha kwa simu */}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
                >
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.language')} ({i18n.language.toUpperCase()})
                </Button>
                
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-lg mt-1 sm:mt-2 text-sm sm:text-base"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                    {t('navigation.signOut')}
                  </Button>
                ) : (
                  <>
                    {/* Mobile Sign In Link - Kiungo cha kuingia kwa simu */}
                    <Link to="/signin" className="block mt-1 sm:mt-2">
                      <Button variant="ghost" className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-lg text-sm sm:text-base">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                        {t('navigation.signIn')}
                      </Button>
                    </Link>
                    
                    {/* Mobile Sign Up Button - Kitufe cha kujisajili kwa simu */}
                    <Link to="/signup" className="block mt-1 sm:mt-2">
                      <Button className="w-full mt-1 sm:mt-2 bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3">
                        {t('navigation.signUp')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
