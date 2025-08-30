
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
 * - Enhanced visual appeal and animations
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // Navigation function
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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Enhanced Brand Logo Section - Sehemu ya nembo ya chapa */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary to-serengeti-500 
                              rounded-lg sm:rounded-xl transform group-hover:scale-110 transition-all duration-300 
                              shadow-lg group-hover:shadow-xl">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 
                                bg-clip-text text-transparent">
                  Nyumba
                </span>
                <span className="text-lg sm:text-2xl font-bold text-serengeti-600">Link</span>
              </div>
            </Link>
            
            {/* Host Dashboard Link - Kiungo cha dashibodi ya mwenye nyumba (LEFT SIDE) - Only show for non-logged in users */}
            {!user && (
              <Link to="/signup?type=landlord">
                <Button
                  variant="ghost"
                  className="px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                             hover:bg-primary/10 hover:text-primary hover:scale-105"
                >
                  {t('navigation.becomeHost')}
                </Button>
              </Link>
            )}
          </div>

          {/* Enhanced Desktop Navigation Menu - Menyu ya uongozaji wa kompyuta */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Home Link - Kiungo cha nyumbani */}
            <Link to="/">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.home')}
              </Button>
            </Link>
            
            {/* Browse Properties Link - Kiungo cha kutazama nyumba */}
            <Link to="/browse">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/browse' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.browse')}
              </Button>
            </Link>
            
            {/* About Us Link - Kiungo cha kuhusu */}
            <Link to="/about">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base
                           hover:bg-primary/10 hover:text-primary hover:scale-105 ${
                  location.pathname === '/about' 
                    ? 'bg-primary/15 text-primary font-semibold shadow-md border border-primary/20' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {t('navigation.about')}
              </Button>
            </Link>
          </div>

          {/* Enhanced Desktop Right Side Controls - Vidhibiti vya upande wa kulia vya kompyuta */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon - Aikoni ya kutafuta */}
            <Link to="/browse">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary/10 
                           hover:text-primary hover:scale-105 transition-all duration-300"
                title={t('navigation.browse')}
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-sm font-medium">{t('common.search')}</span>
              </Button>
            </Link>

            {/* Enhanced User Account Menu - Menyu ya akaunti ya mtumiaji */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-primary/10 
                               hover:text-primary hover:scale-105 transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">{t('navigation.dashboard')}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut(navigate)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-red-50 
                             hover:text-red-600 hover:scale-105 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{t('navigation.signOut')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="text-sm px-3 py-2 hover:bg-gray-100 
                                                               hover:scale-105 transition-all duration-300">
                    {t('navigation.signIn')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-serengeti-500 
                                              hover:from-primary/90 hover:to-serengeti-400 text-sm px-4 py-2
                                              shadow-lg hover:shadow-xl transform hover:scale-105 
                                              transition-all duration-300">
                    {t('navigation.signUp')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Language Toggle Button - Kitufe cha kubadilisha lugha (RIGHT SIDE) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 
                         hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-primary/30"
            >
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{i18n.language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Enhanced Mobile Menu Toggle Button - Kitufe cha menyu ya simu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button - Takes user to browse page */}
            <Link to="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300 hover:scale-105"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu - Menyu ya uongozaji wa simu */}
        {/* Mobile Menu Overlay - Background overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Mobile Menu Container - Dropdown from top */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md 
                         shadow-lg z-50 transform transition-all duration-300 ease-in-out border-t border-gray-200
                         ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
            
            {/* Mobile Menu Content - Maudhui ya menyu ya simu */}
            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {/* Enhanced Mobile Home Link - Kiungo cha nyumbani kwa simu */}
              <Link
                to="/"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-xl text-sm sm:text-base transition-all duration-300 ${
                  location.pathname === '/' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.home')}
                </div>
              </Link>
              
              {/* Enhanced Mobile Browse Link - Kiungo cha kutazama kwa simu */}
              <Link
                to="/browse"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-xl text-sm sm:text-base transition-all duration-300 ${
                  location.pathname === '/browse' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.browse')}
                </div>
              </Link>
              
              {/* Enhanced Mobile About Link - Kiungo cha kuhusu kwa simu */}
              <Link
                to="/about"
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-xl text-sm sm:text-base transition-all duration-300 ${
                  location.pathname === '/about' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.about')}
                </div>
              </Link>
              
              {/* Enhanced Mobile Dashboard Link - Kiungo cha dashibodi kwa simu */}
              {user && (
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-xl text-sm sm:text-base transition-all duration-300 ${
                    location.pathname === '/dashboard' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-400" />
                    {t('navigation.dashboard')}
                  </div>
                </Link>
              )}
              
              <Link
                to={user ? "/dashboard" : "/signup?type=landlord"}
                className={`block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-xl text-sm sm:text-base transition-all duration-300 ${
                  location.pathname === '/dashboard' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.becomeHost')}
                </div>
              </Link>

              {/* Enhanced Mobile User Actions Section - Sehemu ya vitendo vya mtumiaji kwa simu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {/* Enhanced Mobile Language Toggle - Kubadilisha lugha kwa simu */}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="w-full justify-start px-4 py-3 hover:bg-gray-100 rounded-xl text-sm sm:text-base
                             transition-all duration-300 hover:scale-105"
                >
                  <Globe className="h-5 w-5 mr-3 text-gray-400" />
                  {t('navigation.language')} ({i18n.language.toUpperCase()})
                </Button>
                
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={() => signOut(navigate)}
                    className="w-full justify-start px-4 py-3 hover:bg-red-50 hover:text-red-600 
                               rounded-xl mt-2 text-sm sm:text-base transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                    {t('navigation.signOut')}
                  </Button>
                ) : (
                  <>
                    {/* Enhanced Mobile Sign In Link - Kiungo cha kuingia kwa simu */}
                    <Link to="/signin" className="block mt-2">
                      <Button variant="ghost" className="w-full justify-start px-4 py-3 hover:bg-gray-100 
                                                       rounded-xl text-sm sm:text-base transition-all duration-300 hover:scale-105">
                        <User className="h-5 w-5 mr-3 text-gray-400" />
                        {t('navigation.signIn')}
                      </Button>
                    </Link>
                    
                    {/* Enhanced Mobile Sign Up Button - Kitufe cha kujisajili kwa simu */}
                    <Link to="/signup" className="block mt-2">
                      <Button className="w-full bg-gradient-to-r from-primary to-serengeti-500 
                                       hover:from-primary/90 hover:to-serengeti-400 text-sm sm:text-base 
                                       py-3 shadow-lg hover:shadow-xl transform hover:scale-105 
                                       transition-all duration-300">
                        {t('navigation.signUp')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
