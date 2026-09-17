/**
 * FIRST VISIT HANDLER - ENSURES HOMEPAGE IS SHOWN FIRST
 * =====================================================
 * 
 * Component inayohakikisha user anaanza homepage kwanza
 * Component that ensures user starts at homepage first
 * 
 * FUNCTIONALITY:
 * - Detects first visit to site
 * - Redirects to homepage if it's first visit
 * - Stores flag in sessionStorage (cleared when browser closes)
 * - Allows direct navigation after first homepage visit
 * 
 * USE CASE:
 * - User types wanachuo.com/browse → Redirected to / first
 * - User clicks link to wanachuo.com/property/123 → Redirected to / first
 * - After seeing homepage once, can navigate freely
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FirstVisitHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisitedHomepage = sessionStorage.getItem('wanachuo_homepage_visited');
    
    // If not on homepage and haven't visited homepage yet
    if (!hasVisitedHomepage && location.pathname !== '/') {
      console.log('First visit - redirecting to homepage');
      
      // Store the intended destination
      sessionStorage.setItem('wanachuo_intended_destination', location.pathname + location.search);
      
      // Redirect to homepage
      navigate('/', { replace: true });
    }
    
    // Mark homepage as visited when user is on homepage
    if (location.pathname === '/') {
      sessionStorage.setItem('wanachuo_homepage_visited', 'true');
      
      // Optional: After 2 seconds, navigate to intended destination if exists
      // const intendedDestination = sessionStorage.getItem('wanachuo_intended_destination');
      // if (intendedDestination) {
      //   setTimeout(() => {
      //     sessionStorage.removeItem('wanachuo_intended_destination');
      //     navigate(intendedDestination, { replace: true });
      //   }, 2000);
      // }
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default FirstVisitHandler;
