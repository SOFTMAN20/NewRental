/**
 * MARKETPLACE.TSX - MARKETPLACE BROWSE PAGE
 * =========================================
 * 
 * Main marketplace page for buying/selling student items
 * Categories: Furniture, Electronics, Textbooks, Kitchen, Clothing, Sports, Services, Other
 * 
 * FEATURES:
 * - Browse all marketplace items
 * - Filter by category, condition, price range
 * - Search functionality
 * - Sort by newest, price, popularity
 * - Favorites management
 * - Responsive grid layout
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ItemCard from '@/components/marketplace/ItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Search, Plus, Filter, X, 
  Sofa, Laptop, BookOpen, UtensilsCrossed, 
  Shirt, Dumbbell, Wrench, Package,
  TrendingUp, Clock, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import { Database } from '@/lib/integrations/supabase/types';

type MarketplaceListing = Database['public']['Tables']['marketplace_listings']['Row'] & {
  category?: Database['public']['Tables']['marketplace_categories']['Row'];
  seller?: {
    name: string;
    university?: string;
  };
};

interface FilterState {
  searchQuery: string;
  category: string;
  condition: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

// Category icons mapping - Only Furniture and Mattresses for now
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Furniture': <Sofa className="h-5 w-5" />,
  'Mattresses': <Package className="h-5 w-5" />,
};

const Marketplace = () => {
  const { user } = useAuth();
  
  // State management
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    condition: 'all',
    priceRange: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<Database['public']['Tables']['marketplace_categories']['Row']>([]);
  const [subcategories, setSubcategories] = useState<Database['public']['Tables']['marketplace_categories']['Row']>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories - Filter to only show Furniture and Mattresses
  useEffect(() => {
    const fetchCategories = async () => {
      // Fetch main categories (Furniture and Mattresses)
      const { data: mainCats, error: mainError } = await supabase
        .from('marketplace_categories')
        .select('*')
        .in('slug', ['furniture', 'mattresses'])
        .is('parent_id', null)
        .order('display_order');

      if (!mainError && mainCats) {
        setCategories(mainCats);
        
        // Fetch furniture subcategories
        const furnitureCategory = mainCats.find(c => c.slug === 'furniture');
        if (furnitureCategory) {
          const { data: subCats, error: subError } = await supabase
            .from('marketplace_categories')
            .select('*')
            .eq('parent_id', furnitureCategory.id)
            .order('display_order');
          
          if (!subError && subCats) {
            setSubcategories(subCats);
          }
        }
      }
    };

    fetchCategories();
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          category:marketplace_categories(*)
        `)
        .eq('status', 'active');

      const { data, error } = await query;

      if (!error && data) {
        setListings(data);
      }
      
      setIsLoading(false);
    };

    fetchListings();
  }, []);

  // Fetch user favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('marketplace_favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setFavoriteIds(data.map(f => f.listing_id));
      }
    };

    fetchFavorites();
  }, [user]);

  // Filter listings
  const filteredListings = listings.filter(listing => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const title = listing.title?.toLowerCase() || '';
      const description = listing.description?.toLowerCase() || '';
      
      if (!title.includes(query) && !description.includes(query)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (listing.category_id !== filters.category) {
        return false;
      }
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all') {
      if (listing.condition !== filters.condition) {
        return false;
      }
    }

    // Price range filters
    if (filters.minPrice && Number(listing.price) < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && Number(listing.price) > Number(filters.maxPrice)) {
      return false;
    }

    // Predefined price range
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPriceRange = parseInt(min);
      const maxPriceRange = max ? parseInt(max) : Infinity;

      if (Number(listing.price) < minPriceRange || Number(listing.price) > maxPriceRange) {
        return false;
      }
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'popular':
        return (b.views_count || 0) - (a.views_count || 0);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Toggle favorite
  const handleToggleFavorite = async (listingId: string) => {
    if (!user) {
      // Redirect to login or show message
      return;
    }

    const isFavorited = favoriteIds.includes(listingId);

    if (isFavorited) {
      // Remove favorite
      await supabase
        .from('marketplace_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      
      setFavoriteIds(favoriteIds.filter(id => id !== listingId));
    } else {
      // Add favorite
      await supabase
        .from('marketplace_favorites')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });
      
      setFavoriteIds([...favoriteIds, listingId]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      condition: 'all',
      priceRange: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.searchQuery || 
    filters.category !== 'all' || 
    filters.condition !== 'all' || 
    filters.priceRange !== 'all' ||
    filters.minPrice ||
    filters.maxPrice;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-serengeti-50 border-b pt-20 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Student Marketplace
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Buy and sell furniture and mattresses for students
            </p>
          </div>

          {/* Category Quick Filters */}
          <div className="space-y-3 mb-4">
            {/* Main Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={filters.category === 'all' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, category: 'all' })}
                className="rounded-full"
                size="sm"
              >
                All Items
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.category === category.id ? 'default' : 'outline'}
                  onClick={() => setFilters({ ...filters, category: category.id })}
                  className="rounded-full flex items-center gap-2"
                  size="sm"
                >
                  {CATEGORY_ICONS[category.name]}
                  <span className="hidden sm:inline">{category.name}</span>
                </Button>
              ))}
            </div>
            
            {/* Furniture Subcategories - Show when furniture items exist */}
            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-gray-500 self-center mr-2">Furniture Types:</span>
                {subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={filters.category === subcategory.id ? 'default' : 'outline'}
                    onClick={() => setFilters({ ...filters, category: subcategory.id })}
                    className="rounded-full text-xs"
                    size="sm"
                  >
                    {subcategory.name_sw || subcategory.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative border-2 border-gray-300 rounded-full hover:border-primary/50 transition-colors duration-200 focus-within:border-primary shadow-lg bg-white">
                <Input
                  placeholder="Search for items..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-4 sm:pl-5 lg:pl-6 pr-14 sm:pr-16 lg:pr-20 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 sm:p-2.5 lg:p-3 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </button>
              </div>
            </div>

            {/* Price and Filter Controls */}
            <div className="flex gap-2">
              {/* Price Range */}
              <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
                <SelectTrigger className="flex-1 h-10 sm:h-12 lg:h-14 border-2 border-gray-300 rounded-full hover:border-primary/50 min-w-[120px] focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white shadow-lg">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-50000">Under 50k</SelectItem>
                  <SelectItem value="50000-100000">50k - 100k</SelectItem>
                  <SelectItem value="100000-200000">100k - 200k</SelectItem>
                  <SelectItem value="200000-500000">200k - 500k</SelectItem>
                  <SelectItem value="500000+">Over 500k</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 sm:h-12 lg:h-14 border-2 border-gray-300 rounded-full hover:border-primary/50 hover:bg-primary/5 px-4 transition-all duration-200 bg-white shadow-lg"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>

              {/* Sell Item Button */}
              {user && (
                <Link to="/marketplace/add">
                  <Button className="h-10 sm:h-12 lg:h-14 rounded-full px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Sell Item</span>
                    <span className="sm:hidden">Sell</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Condition</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (TZS)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (TZS)</label>
                  <Input
                    type="number"
                    placeholder="No limit"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  size="sm"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {sortedListings.length} {sortedListings.length === 1 ? 'Item' : 'Items'} Found
            </h2>
            {filters.searchQuery && (
              <p className="text-sm text-gray-600 mt-1">
                Results for "{filters.searchQuery}"
              </p>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-[140px] sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price: Low to High
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price: High to Low
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Most Viewed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.searchQuery && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: {filters.searchQuery}
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: '' })}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {categories.find(c => c.id === filters.category)?.name}
                <button
                  onClick={() => setFilters({ ...filters, category: 'all' })}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.condition !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Condition: {filters.condition.replace('_', ' ')}
                <button
                  onClick={() => setFilters({ ...filters, condition: 'all' })}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.priceRange !== 'all' && (
              <Badge variant="secondary" className="px-3 py-1">
                Price: TZS {filters.priceRange}
                <button
                  onClick={() => setFilters({ ...filters, priceRange: 'all' })}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedListings.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results'
                : 'Be the first to list an item!'
              }
            </p>
            {user && (
              <Link to="/marketplace/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Item
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && sortedListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedListings.map((listing) => (
              <ItemCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={Number(listing.price)}
                location={listing.location}
                images={listing.images || []}
                category={listing.category?.name || 'Other'}
                condition={listing.condition}
                created_at={listing.created_at}
                is_sold={listing.is_sold}
                isFavorited={favoriteIds.includes(listing.id)}
                onToggleFavorite={handleToggleFavorite}
                views_count={listing.views_count}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
