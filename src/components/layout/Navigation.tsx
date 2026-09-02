
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

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Search, User, Menu, X, Globe, Building2, LogOut, Heart, Bell, Settings, GraduationCap, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import CollegesModal from '@/components/common/CollegesModal';

import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';

type Profile = Tables<'profiles'>;

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
  const [isCollegesModalOpen, setIsCollegesModalOpen] = useState(false); // Colleges modal visibility
  const [profile, setProfile] = useState<Profile | null>(null); // User profile
  const location = useLocation(); // Current page location for active states
  const navigate = useNavigate(); // Navigation function
  const { user, signOut } = useAuth(); // Authentication state
  const { getFavoritesCount } = useFavorites(); // Favorites functionality
  const { t, i18n } = useTranslation();

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
          return;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

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
    <nav className={`${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property') || location.pathname.includes('/messages') || location.pathname.includes('/settings') ? 'bg-white shadow-lg sticky lg:ml-64 border-b border-gray-100' : location.pathname === '/' ? 'bg-transparent absolute border-b border-white/10' : 'bg-gradient-to-r from-blue-100/95 via-purple-100/95 to-blue-50/95 backdrop-blur-md sticky shadow-lg border-b border-blue-200/50 rounded-b-3xl overflow-hidden'} top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
          
          {/* Enhanced Brand Logo Section - Sehemu ya nembo ya chapa */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="p-1 sm:p-1.5 lg:p-2 bg-gradient-to-br from-primary to-serengeti-500
                              rounded-md sm:rounded-lg lg:rounded-xl transform group-hover:scale-110 transition-all duration-300 
                              shadow-lg group-hover:shadow-xl">
                <Home className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                {/* Mobile label: Wanachuo */}
                <span className={`md:hidden text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent`}>Wanachuo</span>
                <span className="md:hidden text-base sm:text-lg lg:text-2xl font-bold text-serengeti-600"></span>

                {/* Desktop/large label: Wanachuo.com */}
                <span className={`hidden md:inline text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent`}>Wanachuo.com</span>
                <span className="hidden md:inline text-base sm:text-lg lg:text-2xl font-bold text-serengeti-600"> </span>
              </div>
            </Link>
            
            {/* Host Dashboard Link - Kiungo cha dashibodi ya mwenye nyumba (LEFT SIDE) - Only show for non-landlords */}
            {!user || (user && profile?.user_type !== 'landlord') ? (
              <Link to="/signup?type=landlord" className="block">
                <Button
                  variant="ghost"
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm lg:text-base
                             ${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property') 
                               ? 'hover:bg-gray-100 text-gray-700 hover:text-gray-900' 
                               : location.pathname === '/'
                               ? 'hover:bg-white/20 text-white hover:text-white'
                               : 'hover:bg-white/60 text-gray-700 hover:text-gray-900'} hover:scale-105`}
                >
                  {t('navigation.becomeHost')}
                </Button>
              </Link>
            ) : null}
          </div>

          {/* Enhanced Desktop Navigation Menu - Menyu ya uongozaji wa kompyuta */}
          <div className={`hidden md:flex items-center space-x-2 backdrop-blur-md rounded-full px-3 py-2.5 ${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property') ? 'bg-gray-100 border border-gray-200' : location.pathname === '/' ? 'bg-white/10 border border-white/20' : 'bg-white/60 border border-white/80 shadow-sm'}`}>
            
            {/* Colleges Link - Kiungo cha vyuo */}
            <Button
              variant="ghost"
              onClick={() => setIsCollegesModalOpen(true)}
              className={`px-5 py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium
                         ${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property')
                           ? 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                           : location.pathname === '/'
                           ? 'text-white hover:bg-white/30 hover:text-white'
                           : 'text-gray-700 hover:bg-white/70 hover:text-gray-900'}`}
            >
              Colleges
            </Button>
            
            {/* About Link - Kiungo cha kuhusu */}
            <Link to="/about">
              <Button
                variant="ghost"
                className={`px-5 py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium ${
                  location.pathname === '/about' 
                    ? location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property')
                      ? 'bg-gray-200'
                      : location.pathname === '/'
                      ? 'bg-white/30'
                      : 'bg-white/60'
                    : ''
                } ${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property')
                     ? 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                     : location.pathname === '/'
                     ? 'text-white hover:bg-white/30 hover:text-white'
                     : 'text-gray-700 hover:bg-white/70 hover:text-gray-900'}`}
              >
                About
              </Button>
            </Link>
            
            {/* Contact Link - Kiungo cha mawasiliano */}
            <Link to="/contact">
              <Button
                variant="ghost"
                className={`px-5 py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium ${
                  location.pathname === '/contact' 
                    ? location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property')
                      ? 'bg-gray-200'
                      : location.pathname === '/'
                      ? 'bg-white/30'
                      : 'bg-white/60'
                    : ''
                } ${location.pathname.includes('/dashboard') || location.pathname.includes('/favorites') || location.pathname.includes('/add-property')
                     ? 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                     : location.pathname === '/'
                     ? 'text-white hover:bg-white/30 hover:text-white'
                     : 'text-gray-700 hover:bg-white/70 hover:text-gray-900'}`}
              >
                Contact
              </Button>
            </Link>
          </div>

          {/* Enhanced Desktop Right Side Controls - Vidhibiti vya upande wa kulia vya kompyuta */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
            {/* Search Icon - Aikoni ya kutafuta - Hidden on homepage */}
            {location.pathname !== '/' && (
              <Link to="/browse">
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full hover:scale-105 transition-all duration-300 ${
                    location.pathname === '/'
                      ? 'text-white hover:bg-white/20 hover:text-white'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                  }`}
                  title={t('navigation.browse')}
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">{t('common.search')}</span>
                </Button>
              </Link>
            )}

            {/* Enhanced User Account Menu - Menyu ya akaunti ya mtumiaji */}
            {user ? (
              <>
                {/* Hamburger Menu Button */}
                <Button
                  variant="ghost"
                  className="md:hidden p-2 rounded-full hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300"
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
                
                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 rounded-full hover:bg-transparent transition-all duration-300 group flex items-center gap-2"
                    >
                      <div className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:ring-2 transition-all duration-300 ${
                        location.pathname === '/'
                          ? 'bg-white/20 group-hover:ring-white/50'
                          : 'bg-white/60 group-hover:ring-primary/50'
                      }`}>
                        <span className={`text-base font-semibold ${
                          location.pathname === '/' ? 'text-white' : 'text-gray-700'
                        }`}>
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden lg:flex items-center gap-2">
                        <span className={`font-medium ${
                          location.pathname === '/' ? 'text-white' : 'text-gray-700'
                        }`}>
                          Hi, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                        </span>
                        <svg className={`w-4 h-4 ${
                          location.pathname === '/' ? 'text-white' : 'text-gray-700'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Mtumiaji'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/add-property" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Tangaza Nyumba</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Vipendwa</span>
                      {getFavoritesCount() > 0 && (
                        <Badge className="ml-auto bg-primary text-white text-xs px-1.5 py-0.5">
                          {getFavoritesCount()}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>{t('navigation.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem disabled>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Arifa</span>
                    <Badge className="ml-auto bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5">
                      Haribu
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Mipangilio</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      signOut(navigate);
                    }}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('navigation.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <Link to="/signin">
                <Button size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-sm px-4 py-2
                                            shadow-lg hover:shadow-xl transform hover:scale-105 
                                            transition-all duration-300 border border-white/20">
                  {t('navigation.signIn')}
                </Button>
              </Link>
            )}

            {/* Enhanced Language Toggle Button - Kitufe cha kubadilisha lugha (RIGHT SIDE) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-white hover:bg-white/20
                         hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/30"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Enhanced Mobile Menu Toggle Button - Kitufe cha menyu ya simu */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Mobile Search Button - Takes user to browse page */}
            <Link to="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 hover:bg-white/20 text-white hover:text-white rounded-full transition-all duration-300 hover:scale-105"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="py-3 sm:py-4">
            
            {/* Mobile Menu Content - Maudhui ya menyu ya simu */}
            <div className="flex-1 px-2 sm:px-4 py-2 sm:py-4 space-y-1 sm:space-y-2 overflow-y-auto">
              {/* Enhanced Mobile Home Link with Close Button - Kiungo cha nyumbani kwa simu na kitufe cha kufunga */}
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                    location.pathname === '/' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                    {t('navigation.home')}
                  </div>
                </Link>
                
                {/* Close Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 ml-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </Button>
              </div>
              
              {/* Enhanced Mobile Browse Link - Kiungo cha kutazama kwa simu */}
              <Link
                to="/browse"
                className={`block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                  location.pathname === '/browse' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.browse')}
                </div>
              </Link>
              
              {/* Mobile Colleges Link - Kiungo cha vyuo kwa simu */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsCollegesModalOpen(true);
                }}
                className="w-full block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg sm:rounded-xl text-sm transition-all duration-300 text-left"
              >
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  Colleges
                </div>
              </button>
              
              {/* Enhanced Mobile About Link - Kiungo cha kuhusu kwa simu */}
              <Link
                to="/about"
                className={`block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                           rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                  location.pathname === '/about' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.about')}
                </div>
              </Link>
              
              {/* Enhanced Mobile Dashboard Link - Kiungo cha dashibodi kwa simu */}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className={`block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                               rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                      location.pathname === '/profile' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                      Profile
                    </div>
                  </Link>
                  
                  <Link
                    to="/add-property"
                    className={`block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                               rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                      location.pathname === '/add-property' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                      Tangaza Nyumba
                    </div>
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className={`block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                               rounded-lg sm:rounded-xl text-sm transition-all duration-300 ${
                      location.pathname === '/dashboard' ? 'bg-primary/15 text-primary border border-primary/20' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                      {t('navigation.dashboard')}
                    </div>
                  </Link>
                </>
              )}
              
              {/* Only show "Become Host" for non-landlords */}
              {!user || (user && profile?.user_type !== 'landlord') ? (
                <Link
                  to="/signup?type=landlord"
                  className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-primary/10 hover:text-primary 
                             rounded-lg sm:rounded-xl text-sm transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                    {t('navigation.becomeHost')}
                  </div>
                </Link>
              ) : null}

              {/* Enhanced Mobile User Actions Section - Sehemu ya vitendo vya mtumiaji kwa simu */}
              <div className="border-t border-gray-200 pt-2 sm:pt-4 mt-2 sm:mt-4">
                {/* Enhanced Mobile Language Toggle - Kubadilisha lugha kwa simu */}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-lg sm:rounded-xl text-sm
                             transition-all duration-300 hover:scale-105"
                >
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                  {t('navigation.language')} ({i18n.language.toUpperCase()})
                </Button>
                
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={() => signOut(navigate)}
                    className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 hover:bg-red-50 hover:text-red-600 
                               rounded-lg sm:rounded-xl mt-1 sm:mt-2 text-sm transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                    {t('navigation.signOut')}
                  </Button>
                ) : (
                  <>
                    {/* Enhanced Mobile Sign In Button - Kitufe cha kuingia kwa simu */}
                    <Link to="/signin" className="block mt-1 sm:mt-2">
                      <Button className="w-full bg-gradient-to-r from-primary to-serengeti-500 
                                       hover:from-primary/90 hover:to-serengeti-400 text-sm 
                                       py-2 sm:py-3 shadow-lg hover:shadow-xl transform hover:scale-105 
                                       transition-all duration-300">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-white" />
                        {t('navigation.signIn')}
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
      
      {/* Colleges Modal - Kidirisha cha vyuo */}
      <CollegesModal 
        open={isCollegesModalOpen} 
        onClose={() => setIsCollegesModalOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;

