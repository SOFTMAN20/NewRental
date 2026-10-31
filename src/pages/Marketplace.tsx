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
  Shirt, Dumbbell, Wrench, Package, Bed,
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

// Category icons mapping - Main categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Furniture': <Sofa className="h-5 w-5" />,
  'Home Utensils': <UtensilsCrossed className="h-5 w-5" />,
  'Gas': <Package className="h-5 w-5" />,
  'Mattress': <Bed className="h-5 w-5" />,
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

  // Mock data for demo purposes - Using real product images
  const getMockListings = (): MarketplaceListing[] => {
    // Get listings from localStorage
    const localStorageListings = localStorage.getItem('marketplace_listings');
    const userListings = localStorageListings ? JSON.parse(localStorageListings) : [];

    // Default mock listings with real product images from public/images/market image/
    const defaultMockListings: MarketplaceListing[] = [
      {
        id: 'mock-1',
        title: 'Kitanda cha Mbao - Wooden Bed Frame',
        description: 'Beautiful wooden bed frame, solid construction. Perfect for student rooms. Strong and durable.',
        price: 220000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kitanda cha mbao.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 89,
        created_at: '2026-10-28T10:00:00.000Z',
        updated_at: '2026-10-28T10:00:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-2',
        title: 'Kitanda Complete 5×6 - Bed with Mattress',
        description: 'Complete 5×6 feet bed setup with quality mattress. Special discount available! Work in progress - ready soon.',
        price: 400000,
        condition: 'like_new',
        category_id: 'mattress',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kitanda.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 124,
        created_at: '2026-10-27T14:30:00.000Z',
        updated_at: '2026-10-27T14:30:00.000Z',
        category: { id: 'mattress', name: 'Mattress', name_sw: 'Godoro', slug: 'mattress', icon: 'bed', parent_id: null, display_order: 4, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-3',
        title: 'Kitanda - Bed Frame 5×6 & 4×6',
        description: 'Quality bed frames available in two sizes. Choose what fits your room best!',
        price: 200000,
        condition: 'like_new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kitanda 250k.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 67,
        created_at: '2026-10-26T09:15:00.000Z',
        updated_at: '2026-10-26T09:15:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-4',
        title: 'Meza na Kiti - Study Desk with Chair',
        description: 'Complete study set with desk and matching chair. Perfect for studying and assignments.',
        price: 95000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/meza na kiti.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 156,
        created_at: '2026-10-25T16:45:00.000Z',
        updated_at: '2026-10-25T16:45:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-5',
        title: 'Meza ya Gas 80k - Gas Cooker Table',
        description: 'Sturdy gas cooker table with storage space. Perfect for student kitchens. Good quality build.',
        price: 80000,
        condition: 'good',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/meza ya gas 80k.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 78,
        created_at: '2026-10-24T11:20:00.000Z',
        updated_at: '2026-10-24T11:20:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-6',
        title: 'Meza ya Gesi 45k - Small Gas Table',
        description: 'Compact gas table perfect for small spaces. Affordable and functional for student needs.',
        price: 70000,
        condition: 'fair',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/45k meza ya gesi.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 92,
        created_at: '2026-10-23T13:00:00.000Z',
        updated_at: '2026-10-23T13:00:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-7',
        title: 'Kabati - Large Wardrobe',
        description: 'Spacious wooden wardrobe with multiple compartments. Great for organizing clothes and belongings.',
        price: 260000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kabati.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 103,
        created_at: '2026-10-22T08:30:00.000Z',
        updated_at: '2026-10-22T08:30:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-8',
        title: 'Kabati 260k - Premium Wardrobe',
        description: 'High-quality wardrobe with excellent storage capacity. Solid wood construction. Like new condition.',
        price: 260000,
        condition: 'like_new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kabati260.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 45,
        created_at: '2026-10-21T15:45:00.000Z',
        updated_at: '2026-10-21T15:45:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-9',
        title: 'Skeleton ya Nguo - Clothes Rack',
        description: 'Portable clothes hanger rack. Easy to assemble and move. Perfect for hostels without closets.',
        price: 75000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/skeleton ya nguo.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 71,
        created_at: '2026-10-20T10:15:00.000Z',
        updated_at: '2026-10-20T10:15:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-10',
        title: 'Kuekea Viatu - Shoe Rack',
        description: 'Multi-tier shoe rack with good capacity. Keep your room organized. Sturdy metal construction.',
        price: 70000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kuekea viatu.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 58,
        created_at: '2026-10-19T12:00:00.000Z',
        updated_at: '2026-10-19T12:00:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-11',
        title: 'Bed Frame - 5×6 & 4×6 Sizes Available',
        description: 'Quality bed frames in two sizes. Choose the size that fits your needs!',
        price: 160000,
        condition: 'new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/160.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 134,
        created_at: '2026-10-18T14:30:00.000Z',
        updated_at: '2026-10-18T14:30:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-12',
        title: 'Gas Cylinders - Mnjis, Ogas, Taifa & Orxy Available',
        description: 'Quality gas cylinders available with competitive prices. Choose your preferred brand!\n\n💰 PRICES:\n• Mnjis: TZS 45,000 (complete) | Refill: TZS 27,000\n• Ogas: TZS 50,000 (complete) | Refill: TZS 27,000\n• Taifa Gas: TZS 50,000 (complete) | Refill: TZS 27,000\n• Orxy: TZS 60,000 (complete) | Refill: TZS 28,000\n\nAll cylinders come with regulator and safety accessories when you buy complete package.',
        price: 45000,
        condition: 'new',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/gas.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 98,
        created_at: '2026-10-17T09:00:00.000Z',
        updated_at: '2026-10-17T09:00:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' }
      },
      {
        id: 'mock-13',
        title: 'Wooden Bed Frame - 5×6 & 4×6 Available',
        description: 'Quality wooden bed frames in two sizes. Choose the size that fits your room!',
        price: 280000,
        condition: 'new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/bed.jpeg'],
        seller_id: 'mock-user',
        status: 'active',
        is_sold: false,
        views_count: 76,
        created_at: '2026-10-16T11:00:00.000Z',
        updated_at: '2026-10-16T11:00:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' }
      }
    ];

    // Combine user-created listings with default mock listings
    // User listings come first (newest on top)
    return [...userListings, ...defaultMockListings];
  };

  // Fetch categories - Filter to only show Furniture, Home Utensils, and Gas
  useEffect(() => {
    const fetchCategories = async () => {
      // Fetch main categories (Furniture, Home Utensils, Gas)
      const { data: mainCats, error: mainError } = await supabase
        .from('marketplace_categories')
        .select('*')
        .in('slug', ['furniture', 'home-utensils', 'gas', 'mattress'])
        .is('parent_id', null)
        .order('display_order');

      if (!mainError && mainCats) {
        // Add mock Mattress category if not in database
        const hasMattress = mainCats.some(c => c.slug === 'mattress');
        if (!hasMattress) {
          const mockMattress = {
            id: 'mattress',
            name: 'Mattress',
            name_sw: 'Godoro',
            slug: 'mattress',
            icon: 'bed',
            parent_id: null,
            display_order: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setCategories([...mainCats, mockMattress]);
        } else {
          setCategories(mainCats);
        }
        
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

  // Fetch listings and combine with mock data
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      // TEMPORARILY USING MOCK DATA ONLY - Database fetch commented out
      // TODO: Uncomment when database is ready
      
      /* 
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          category:marketplace_categories(*)
        `)
        .eq('status', 'active');

      const { data, error } = await query;

      // Combine real listings with mock data
      const mockData = getMockListings();
      if (!error && data) {
        // Real data comes first, then mock data
        setListings([...data, ...mockData]);
      } else {
        // If error or no data, just show mock data
        setListings(mockData);
      }
      */
      
      // Use mock data only for now
      const mockData = getMockListings();
      setListings(mockData);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />

      {/* Simple Header with Categories */}
      <div className="bg-white border-b border-gray-200 pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Title & Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                Student Marketplace
              </h1>
              <p className="text-gray-600 mt-2">Buy and sell student essentials</p>
            </div>
            
            {/* Sell Item Button - Disabled */}
            <Button 
              disabled
              className="rounded-xl bg-gray-400 cursor-not-allowed shadow-lg h-11 px-6 font-semibold opacity-60"
            >
              <Plus className="h-5 w-5 mr-2" />
              Sell Item
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
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
                variant={filters.category === category.slug ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, category: category.slug })}
                className="rounded-full flex items-center gap-1.5"
                size="sm"
              >
                {CATEGORY_ICONS[category.name]}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State - Enhanced */}
        {!isLoading && sortedListings.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-serengeti-500/10 rounded-3xl p-8 sm:p-12">
                  <Package className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {hasActiveFilters ? 'No items match your search' : 'No items yet'}
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms to find what you need. Or be the first to list this type of item!'
                  : 'Be a pioneer! List the first item on our marketplace and help build our student community.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="rounded-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
                <Button 
                  disabled
                  className="w-full sm:w-auto rounded-full bg-gray-400 cursor-not-allowed opacity-60"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List Item
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid - Improved Layout */}
        {!isLoading && sortedListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
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
