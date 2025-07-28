
/**
 * APP.TSX - MAIN APPLICATION COMPONENT
 * ===================================
 * 
 * Mfumo mkuu wa programu ya Nyumba Link - Tanzania Housing Platform
 * Main application component for Nyumba Link - Tanzania Housing Platform
 * 
 * FUNCTIONALITY / KAZI:
 * - Sets up routing for all pages (Inaweka mipangilio ya kurasa zote)
 * - Provides global context providers (Inatoa huduma za kimsingi)
 * - Manages application-wide state (Inasimamia hali ya programu nzima)
 * 
 * ARCHITECTURE OVERVIEW / MUHTASARI WA MUUNDO:
 * This is the root component that orchestrates the entire application.
 * It follows a provider pattern to inject dependencies and manages
 * global application state through context providers.
 * 
 * SCALABILITY CONSIDERATIONS / MAMBO YA UKUAJI:
 * - Error boundaries prevent app crashes from component failures
 * - Query client enables efficient data caching and synchronization
 * - Modular routing allows easy addition of new pages
 * - Context providers can be extended for additional global state
 * 
 * PERFORMANCE OPTIMIZATIONS / MABORESHO YA UTENDAJI:
 * - React Query handles automatic caching and background updates
 * - Tooltip provider reduces re-renders through context optimization
 * - Error boundaries isolate failures to prevent cascade effects
 * 
 * COMPONENTS INCLUDED / VIPENGELE VILIVYOMO:
 * - QueryClient: For API data management (Kwa usimamizi wa data ya API)
 * - TooltipProvider: For tooltips across the app (Kwa vidokezo vyote)
 * - Toaster: For notifications (Kwa arifa)
 * - BrowserRouter: For navigation (Kwa uongozaji)
 * 
 * ROUTES / NJIA:
 * - / : Homepage with search (Ukurasa wa kwanza na utafutaji)
 * - /browse : Property listings (Orodha ya nyumba)
 * - /property/:id : Individual property details (Maelezo ya nyumba moja)
 * - /dashboard : User dashboard (Dashibodi ya mtumiaji)
 * - /favorites : Saved properties (Nyumba zilizookwa)
 * - /signin : Login page (Ukurasa wa kuingia)
 * - /signup : Registration page (Ukurasa wa kusajili)
 * - /* : 404 page for unknown routes (Ukurasa wa makosa kwa njia zisizojulikana)
 * 
 * FUTURE EXTENSIBILITY / UWEZEKANO WA KUONGEZA:
 * - Additional routes can be added easily to the Routes component
 * - New context providers can be wrapped around existing ones
 * - Error boundaries can be made more granular for specific features
 * - Query client configuration can be extended for advanced caching strategies
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PropertyExample from "./pages/PropertyExample";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

/**
 * REACT QUERY CLIENT CONFIGURATION
 * ================================
 * 
 * Initialize React Query client for API state management
 * Kuanzisha mteja wa React Query kwa usimamizi wa hali ya API
 * 
 * FEATURES / VIPENGELE:
 * - Automatic background refetching
 * - Intelligent caching with stale-while-revalidate
 * - Error retry logic with exponential backoff
 * - Optimistic updates for better UX
 * 
 * CONFIGURATION OPTIONS / CHAGUO ZA MIPANGILIO:
 * - staleTime: How long data stays fresh (default: 0)
 * - cacheTime: How long unused data stays in cache (default: 5 minutes)
 * - retry: Number of retry attempts on failure (default: 3)
 * - refetchOnWindowFocus: Refetch when window regains focus (default: true)
 * 
 * SCALABILITY / UKUAJI:
 * - Can be configured with custom defaults for different query types
 * - Supports query invalidation for real-time updates
 * - Enables offline-first architecture with proper configuration
 */
const queryClient = new QueryClient();

/**
 * Main App Component
 * Kipengele kikuu cha programu
 * 
 * ARCHITECTURE / MUUNDO:
 * 1. QueryClientProvider: Manages server state and caching
 * 2. TooltipProvider: Enables tooltips throughout the application
 * 3. Toaster components: Handle success/error notifications
 * 4. BrowserRouter: Enables client-side routing
 * 5. Routes: Define all application pages
 */
const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Notification systems - Mifumo ya arifa */}
        <Toaster />
        <Sonner />
        
        {/* Main routing configuration - Mipangilio ya uongozaji */}
        <BrowserRouter>
          <Routes>
            {/* Public routes - Njia za umma */}
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/about" element={<About />} />
            
            {/* User-specific routes - Njia za mtumiaji */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/property-example" element={<PropertyExample />} />
            
            {/* Authentication routes - Njia za uthibitisho */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Catch-all route for 404 errors */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
