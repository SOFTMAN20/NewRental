/**
 * BROWSE.TSX - PROPERTY LISTING AND SEARCH PAGE
 * =============================================
 * 
 * Ukurasa wa kutazama na kutafuta nyumba - Property browsing and search page
 * 
 * ARCHITECTURE OVERVIEW / MUHTASARI WA MUUNDO:
 * This is the main property discovery page that handles complex filtering,
 * search functionality, and property display. It serves as the primary
 * interface for users to find properties that match their criteria.
 * 
 * DESIGN PATTERNS / MIFUMO YA MUUNDO:
 * - URL-driven state management for shareable searches
 * - Compound filtering with multiple criteria
 * - Responsive grid/list view switching
 * - Real-time search with debouncing (can be added)
 * - Infinite scroll ready architecture
 * 
 * MAIN FUNCTIONALITY / KAZI KEKUU:
 * - Display all available properties (Kuonyesha nyumba zote zinazopatikana)
 * - Advanced filtering by location, price, utilities (Vichujio vya kirefu vya eneo, bei, huduma)
 * - Property search functionality (Utendakazi wa kutafuta nyumba)
 * - Sorting options (price, date, etc.) (Chaguo za kupanga)
 * - Grid and list view modes (Hali za kuona kama gridi na orodha)
 * - Favorites management (Usimamizi wa vipendwa)
 */

import React, { useState } from 'react';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Search, MapPin, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import type { Property } from '@/hooks/useProperties';
import { useTranslation } from 'react-i18next';

/**
 * FILTER STATE INTERFACE
 * ======================
 * 
 * Defines the structure for all filter-related state.
 * Centralizes filter management for better maintainability.
 */
interface FilterState {
  searchQuery: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  utilities: string[];
  nearbyServices: string[];
  sortBy: string;
}

/**
 * UI STATE INTERFACE
 * ==================
 * 
 * Defines the structure for UI-related state.
 * Separates UI state from business logic.
 */
interface UIState {
  showFilters: boolean;
  favoriteIds: string[];
  viewMode: 'grid' | 'list';
}

/**
 * INITIAL FILTER STATE
 * ====================
 * 
 * Default values for all filters.
 * Extracted for reusability and consistency.
 */
const getInitialFilterState = (searchParams: URLSearchParams): FilterState => ({
  searchQuery: searchParams.get('location') || '',
  priceRange: searchParams.get('price') || 'all',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  utilities: [],
  nearbyServices: [],
  sortBy: 'newest'
});

/**
 * INITIAL UI STATE
 * ================
 * 
 * Default values for UI-related state.
 */
const getInitialUIState = (): UIState => ({
  showFilters: false,
  favoriteIds: [],
  viewMode: 'grid'
});

/**
 * PROPERTY FILTERING LOGIC
 * ========================
 * 
 * Pure function that filters properties based on current filter state.
 * Separated for testability and reusability.
 * 
 * @param properties - Array of properties to filter
 * @param filters - Current filter state
 * @returns Filtered array of properties
 */
const filterProperties = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    // Location filtering - case insensitive partial match
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const location = property.location.toLowerCase();
      
      if (!location.includes(query)) {
        return false;
      }
    }

    // Custom price range filtering
    if (filters.minPrice && parseInt(filters.minPrice) > Number(property.price)) {
      return false;
    }
    if (filters.maxPrice && parseInt(filters.maxPrice) < Number(property.price)) {
      return false;
    }

    // Predefined price range filtering
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPriceRange = parseInt(min);
      const maxPriceRange = max ? parseInt(max) : Infinity;
      
      if (Number(property.price) < minPriceRange || Number(property.price) > maxPriceRange) {
        return false;
      }
    }

    // Utilities filtering
    if (filters.utilities.length > 0) {
      if (filters.utilities.includes('electricity') && !property.electricity) return false;
      if (filters.utilities.includes('water') && !property.water) return false;
    }

    // Nearby services filtering
    if (filters.nearbyServices.length > 0) {
      const hasAllServices = filters.nearbyServices.every(service => 
        property.nearby_services?.includes(service)
      );
      if (!hasAllServices) return false;
    }

    return true;
  });
};

/**
 * PROPERTY SORTING LOGIC
 * ======================
 * 
 * Pure function that sorts properties based on sort criteria.
 * Separated for clarity and reusability.
 * 
 * @param properties - Array of properties to sort
 * @param sortBy - Sort criteria
 * @returns Sorted array of properties
 */
const sortProperties = (properties: Property[], sortBy: string): Property[] => {
  return [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
};

/**
 * FILTER UTILITIES
 * ================
 * 
 * Helper functions for filter management.
 */
const FilterUtils = {
  /**
   * Clears all filters to their default state
   */
  clearAll: (): FilterState => ({
    searchQuery: '',
    priceRange: 'all',
    minPrice: '',
    maxPrice: '',
    utilities: [],
    nearbyServices: [],
    sortBy: 'newest'
  }),

  /**
   * Checks if any filters are currently active
   */
  hasActiveFilters: (filters: FilterState): boolean => {
    return !!(
      filters.searchQuery ||
      (filters.priceRange && filters.priceRange !== 'all') ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.utilities.length > 0 ||
      filters.nearbyServices.length > 0
    );
  },

  /**
   * Toggles a utility filter on/off
   */
  toggleUtility: (utilities: string[], utility: string): string[] => {
    return utilities.includes(utility)
      ? utilities.filter(u => u !== utility)
      : [...utilities, utility];
  },

  /**
   * Toggles a nearby service filter on/off
   */
  toggleNearbyService: (services: string[], service: string): string[] => {
    return services.includes(service)
      ? services.filter(s => s !== service)
      : [...services, service];
  }
};

/**
 * BROWSE COMPONENT
 * ===============
 * 
 * Main component for property browsing and search functionality.
 * Handles all filtering, sorting, and display logic.
 */
const Browse = () => {
  // URL parameter handling for search state persistence
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  // State management - separated into logical groups
  const [filters, setFilters] = useState<FilterState>(() => getInitialFilterState(searchParams));
  const [uiState, setUIState] = useState<UIState>(() => getInitialUIState());
  
  // Data fetching from Supabase
  const { data: properties = [], isLoading, error } = useProperties();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * FILTER UPDATE HANDLERS
   * =====================
   * 
   * Centralized handlers for updating different types of filters.
   */
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateUIState = <K extends keyof UIState>(key: K, value: UIState[K]) => {
    setUIState(prev => ({ ...prev, [key]: value }));
  };

  /**
   * UTILITY TOGGLE HANDLER
   * =====================
   * 
   * Handles toggling of utility filters (electricity, water).
   */
  const handleUtilityToggle = (utility: string) => {
    const newUtilities = FilterUtils.toggleUtility(filters.utilities, utility);
    updateFilter('utilities', newUtilities);
  };

  /**
   * NEARBY SERVICE TOGGLE HANDLER
   * ============================
   * 
   * Handles toggling of nearby service filters (school, hospital, market).
   */
  const handleNearbyServiceToggle = (service: string) => {
    const newServices = FilterUtils.toggleNearbyService(filters.nearbyServices, service);
    updateFilter('nearbyServices', newServices);
  };

  /**
   * FAVORITE TOGGLE HANDLER
   * ======================
   * 
   * Manages adding/removing properties from favorites list.
   */
  const handleToggleFavorite = (propertyId: string) => {
    const newFavorites = uiState.favoriteIds.includes(propertyId)
      ? uiState.favoriteIds.filter(id => id !== propertyId)
      : [...uiState.favoriteIds, propertyId];
    
    updateUIState('favoriteIds', newFavorites);
  };

  /**
   * CLEAR ALL FILTERS HANDLER
   * ========================
   * 
   * Resets all filters to their default state.
   */
  const handleClearAllFilters = () => {
    setFilters(FilterUtils.clearAll());
  };

  // Apply filtering and sorting to properties
  const filteredProperties = filterProperties(properties, filters);
  const sortedProperties = sortProperties(filteredProperties, filters.sortBy);

  /**
   * ERROR STATE RENDERING
   * ====================
   * 
   * Displays error message if data fetching fails.
   */
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('browse.errorLoading')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('browse.tryAgainLater')}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t('browse.tryAgain')}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /**
   * MAIN COMPONENT RENDERING
   * =======================
   * 
   * Renders the complete browse page with all sections.
   */
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary/5 to-serengeti-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('browse.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('browse.propertiesAvailable', { count: sortedProperties.length })}
            </p>
          </div>

          {/* Main Search Interface */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Location Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t('browse.cityPlaceholder')}
                      value={filters.searchQuery}
                      onChange={(e) => updateFilter('searchQuery', e.target.value)}
                      className="pl-12 h-14 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Price Range Selector */}
                <div className="flex gap-4">
                  <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                    <SelectTrigger className="w-48 h-14 border-0">
                      <SelectValue placeholder={t('browse.priceLabel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('browse.anyPrice')}</SelectItem>
                      <SelectItem value="0-100000">{t('browse.under100k')}</SelectItem>
                      <SelectItem value="100000-500000">{t('browse.100kTo500k')}</SelectItem>
                      <SelectItem value="500000-1000000">{t('browse.500kTo1m')}</SelectItem>
                      <SelectItem value="1000000-2000000">{t('browse.1mTo2m')}</SelectItem>
                      <SelectItem value="2000000+">{t('browse.over2m')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Toggle Button */}
                  <Button
                    variant="outline"
                    onClick={() => updateUIState('showFilters', !uiState.showFilters)}
                    className="h-14 px-6 border-2"
                  >
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    {t('browse.filters')}
                  </Button>

                  {/* Search Button */}
                  <Button className="h-14 px-8 bg-primary hover:bg-primary/90">
                    <Search className="h-5 w-5 mr-2" />
                    {t('browse.search')}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {uiState.showFilters && (
                <div className="border-t mt-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Custom Price Range */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.customPrice')}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('browse.minPriceLabel')}
                          </label>
                          <Input
                            type="number"
                            placeholder="30,000"
                            value={filters.minPrice}
                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('browse.maxPriceLabel')}
                          </label>
                          <Input
                            type="number"
                            placeholder="500,000"
                            value={filters.maxPrice}
                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Utilities Filter */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.basicUtilities')}</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'electricity', label: t('browse.electricity') },
                          { key: 'water', label: t('browse.water') }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.utilities.includes(key)}
                              onChange={() => handleUtilityToggle(key)}
                              className="mr-3 w-4 h-4 text-primary"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nearby Services Filter */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.nearbyServices')}</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'school', label: t('browse.school') },
                          { key: 'hospital', label: t('browse.hospital') },
                          { key: 'market', label: t('browse.market') }
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.nearbyServices.includes(key)}
                              onChange={() => handleNearbyServiceToggle(key)}
                              className="mr-3 w-4 h-4 text-primary"
                            />
                            <span className="text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('browse.sortBy')}</h4>
                      <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">{t('browse.newest')}</SelectItem>
                          <SelectItem value="price-low">{t('browse.priceLow')}</SelectItem>
                          <SelectItem value="price-high">{t('browse.priceHigh')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" onClick={handleClearAllFilters} className="text-gray-600">
                      <X className="h-4 w-4 mr-2" />
                      {t('browse.clearFilters')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header with View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('browse.propertiesFound', { count: sortedProperties.length })}
            </h2>
            {filters.searchQuery && (
              <p className="text-gray-600 mt-1">{t('browse.inLocation', { location: filters.searchQuery })}</p>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex border rounded-lg">
              <Button
                variant={uiState.viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateUIState('viewMode', 'grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={uiState.viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateUIState('viewMode', 'list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {FilterUtils.hasActiveFilters(filters) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {/* Search Query Badge */}
              {filters.searchQuery && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.searchQuery}
                  <button
                    onClick={() => updateFilter('searchQuery', '')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {/* Price Range Badge */}
              {filters.priceRange && filters.priceRange !== 'all' && (
                <Badge variant="secondary" className="px-3 py-1">
                  TZS {filters.priceRange}
                  <button
                    onClick={() => updateFilter('priceRange', 'all')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {/* Min Price Badge */}
              {filters.minPrice && (
                <Badge variant="secondary" className="px-3 py-1">
                  Min: TZS {parseInt(filters.minPrice).toLocaleString()}
                  <button
                    onClick={() => updateFilter('minPrice', '')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {/* Max Price Badge */}
              {filters.maxPrice && (
                <Badge variant="secondary" className="px-3 py-1">
                  Max: TZS {parseInt(filters.maxPrice).toLocaleString()}
                  <button
                    onClick={() => updateFilter('maxPrice', '')}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {/* Utility Badges */}
              {filters.utilities.map(utility => (
                <Badge key={utility} variant="secondary" className="px-3 py-1">
                  {utility === 'electricity' ? 'Umeme' : 'Maji'}
                  {utility === 'electricity' ? t('browse.electricity') : t('browse.water')}
                  <button
                    onClick={() => handleUtilityToggle(utility)}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              
              {/* Nearby Service Badges */}
              {filters.nearbyServices.map(service => (
                <Badge key={service} variant="secondary" className="px-3 py-1">
                  {service === 'school' ? t('browse.school') : service === 'hospital' ? t('browse.hospital') : t('browse.market')}
                  <button
                    onClick={() => handleNearbyServiceToggle(service)}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-16">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-center text-gray-600">{t('browse.loadingProperties')}</p>
          </div>
        )}

        {/* Properties Grid/List Display */}
        {!isLoading && sortedProperties.length > 0 ? (
          <div className={`grid gap-6 ${
            uiState.viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={Number(property.price)}
                location={property.location}
                images={property.images || []}
                phone={property.profiles?.phone || undefined}
                contactPhone={property.contact_phone || undefined}
                contactWhatsappPhone={property.contact_whatsapp_phone || undefined}
                electricity={property.electricity || false}
                water={property.water || false}
                bedrooms={property.bedrooms || undefined}
                isFavorited={uiState.favoriteIds.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
                viewMode={uiState.viewMode}
              />
            ))}
          </div>
        ) : !isLoading ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('browse.noPropertiesFound')}
              </h3>
              <p className="text-gray-600 mb-8">
                {t('browse.tryChangingFilters')}
              </p>
              <Button onClick={handleClearAllFilters} size="lg">
                {t('browse.clearFilters')}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
};

export default Browse;