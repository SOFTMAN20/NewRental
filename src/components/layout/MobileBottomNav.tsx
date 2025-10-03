/**
 * MOBILE BOTTOM NAVIGATION - AIRBNB STYLE
 * =======================================
 * 
 * Mobile bottom navigation bar similar to Airbnb's design
 * Provides easy access to main app sections on mobile devices
 * 
 * FEATURES:
 * - 5 main navigation items (Explore, Wishlists, Log in, Profile)
 * - Active state highlighting
 * - Smooth animations and transitions
 * - Responsive design optimized for mobile
 * - Icons with labels
 * - Authentication-aware navigation
 * - Auto-hide on scroll down, show on scroll up
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  requiresAuth?: boolean;
  guestPath?: string; // Alternative path for non-authenticated users
}

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Use custom hook for scroll-based visibility
  const { isVisible } = useScrollDirection({
    threshold: 10,   // Only hide/show after scrolling 10px
    minScrollY: 100  // Only hide after scrolling past 100px from top
  });

  // Define navigation items similar to Airbnb
  const navItems: NavItem[] = [
    {
      id: 'explore',
      icon: <Search className="h-5 w-5" />,
      label: t('bottomNav.explore'),
      path: '/browse'
    },
    {
      id: 'wishlists',
      icon: <Heart className="h-5 w-5" />,
      label: t('bottomNav.wishlists'),
      path: '/favorites'
    },
    {
      id: 'host',
      icon: <Building2 className="h-5 w-5" />,
      label: user ? t('bottomNav.host') : t('bottomNav.becomeHost'),
      path: user ? '/dashboard' : '/signup?type=landlord'
    },
    {
      id: 'profile',
      icon: <User className="h-5 w-5" />,
      label: user ? t('bottomNav.profile') : t('bottomNav.login'),
      path: user ? '/dashboard' : '/signin'
    }
  ];

  // Check if current path matches nav item
  const isActive = (path: string) => {
    if (path === '/browse') {
      return location.pathname === '/browse';
    }
    if (path === '/favorites') {
      return location.pathname === '/favorites';
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/signin') {
      return location.pathname === '/signin' || location.pathname === '/signup';
    }
    if (path === '/signup?type=landlord') {
      return location.pathname === '/signup';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Bottom Navigation Bar - Only visible on mobile with scroll-based hiding */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}>
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-all duration-200 ${
                  active
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`transition-transform duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-xs mt-1 font-medium truncate w-full text-center transition-colors duration-200 ${
                  active 
                    ? 'text-primary' 
                    : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -top-0.5 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Bottom padding spacer for content - Only on mobile */}
      <div className="md:hidden h-20 w-full" />
    </>
  );
};

export default MobileBottomNav;
