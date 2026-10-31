/**
 * MARKETPLACEITEMDETAIL.TSX - MARKETPLACE ITEM DETAILS PAGE
 * =========================================================
 * 
 * Detailed view of marketplace items with seller contact and purchase info
 * 
 * FUNCTIONALITY:
 * - Fetches item data from Supabase database
 * - Displays item images, details, condition, and seller info
 * - WhatsApp contact integration for buyer-seller communication
 * - Favorites functionality
 * - Related items suggestions
 * - View count tracking
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/integrations/supabase/client';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ShareDropdown from '@/components/common/ShareDropdown';
import ItemCard from '@/components/marketplace/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  Clock,
  MessageCircle,
  ShieldCheck,
  Package,
  Tag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/lib/integrations/supabase/types';
import { formatDistanceToNow } from 'date-fns';
import OptimizedImage from '@/components/common/OptimizedImage';

type MarketplaceListing = Database['public']['Tables']['marketplace_listings']['Row'] & {
  category?: Database['public']['Tables']['marketplace_categories']['Row'];
  seller?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    university?: string;
  };
};

const MarketplaceItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data matching the marketplace page
  const getMockListing = (itemId: string): MarketplaceListing | null => {
    // First, check if it's a localStorage listing
    try {
      const localStorageListings = localStorage.getItem('marketplace_listings');
      if (localStorageListings) {
        const userListings = JSON.parse(localStorageListings);
        const userListing = userListings.find((item: any) => item.id === itemId);
        if (userListing) {
          return {
            ...userListing,
            seller: {
              id: userListing.seller_id,
              name: userListing.seller_name || 'Anonymous',
              email: userListing.seller_email || '',
              phone: '+255722429317',
              university: 'Mbeya University of Science and Technology'
            }
          };
        }
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }

    // If not in localStorage, return default mock listings with real product images
    const mockListings: Record<string, MarketplaceListing> = {
      'mock-1': {
        id: 'mock-1',
        title: 'Kitanda cha Mbao - Wooden Bed Frame',
        description: 'Beautiful wooden bed frame, solid construction. Perfect for student rooms. Strong and durable.\n\nFeatures:\n- Solid wood construction\n- Strong and sturdy design\n- Easy to assemble\n- Good quality finish\n- Spacious sleeping area\n\nSelling because I\'m graduating. Great condition and ready for new owner!',
        price: 250000,
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
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user',
          name: 'John Kimaro',
          email: 'john.kimaro@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-2': {
        id: 'mock-2',
        title: 'Kitanda - Complete Bed with Mattress',
        description: 'Complete bed setup ready to use. Good quality mattress included. Clean and well maintained.\n\nIncludes:\n- Bed frame\n- Comfortable mattress\n- All assembly parts\n- Clean and sanitized\n\nPerfect for students looking for complete sleeping solution. Used with care!',
        price: 180000,
        condition: 'good',
        category_id: 'mattress',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kitanda.jpeg'],
        seller_id: 'mock-user-2',
        status: 'active',
        is_sold: false,
        views_count: 124,
        created_at: '2026-10-27T14:30:00.000Z',
        updated_at: '2026-10-27T14:30:00.000Z',
        category: { id: 'mattress', name: 'Mattress', name_sw: 'Godoro', slug: 'mattress', icon: 'bed', parent_id: null, display_order: 4, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-2',
          name: 'Mary Juma',
          email: 'mary.juma@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-3': {
        id: 'mock-3',
        title: 'Kitanda 250k - Student Bed',
        description: 'Affordable student bed in excellent condition. Space-saving design perfect for hostel rooms.\n\nFeatures:\n- Compact design\n- Strong frame\n- Easy to move\n- Perfect size for student rooms\n- Well maintained\n\nGreat value for money. Selling as I\'m moving to a new place!',
        price: 250000,
        condition: 'like_new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kitanda 250k.jpeg'],
        seller_id: 'mock-user-3',
        status: 'active',
        is_sold: false,
        views_count: 67,
        created_at: '2026-10-26T09:15:00.000Z',
        updated_at: '2026-10-26T09:15:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-3',
          name: 'Peter Mwakasege',
          email: 'peter.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-4': {
        id: 'mock-4',
        title: 'Meza na Kiti - Study Desk with Chair',
        description: 'Complete study set with desk and matching chair. Perfect for studying and assignments.\n\nIncludes:\n- Spacious study desk\n- Comfortable chair\n- Drawer for storage\n- Sturdy construction\n- Good working condition\n\nEssential for every student. Selling because graduating!',
        price: 95000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/meza na kiti.jpeg'],
        seller_id: 'mock-user-4',
        status: 'active',
        is_sold: false,
        views_count: 156,
        created_at: '2026-10-25T16:45:00.000Z',
        updated_at: '2026-10-25T16:45:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-4',
          name: 'Grace Mollel',
          email: 'grace.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-5': {
        id: 'mock-5',
        title: 'Meza ya Gas 80k - Gas Cooker Table',
        description: 'Sturdy gas cooker table with storage space. Perfect for student kitchens. Good quality build.\n\nFeatures:\n- Storage compartment\n- Heat resistant surface\n- Strong metal frame\n- Easy to clean\n- Perfect height for cooking\n\nMakes cooking easier and safer. Great condition!',
        price: 80000,
        condition: 'good',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/meza ya gas 80k.jpeg'],
        seller_id: 'mock-user-5',
        status: 'active',
        is_sold: false,
        views_count: 78,
        created_at: '2026-10-24T11:20:00.000Z',
        updated_at: '2026-10-24T11:20:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-5',
          name: 'Hassan Mwinyi',
          email: 'hassan.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-6': {
        id: 'mock-6',
        title: 'Meza ya Gesi 45k - Small Gas Table',
        description: 'Compact gas table perfect for small spaces. Affordable and functional for student needs.\n\nFeatures:\n- Space-saving design\n- Stable and sturdy\n- Perfect for small kitchens\n- Good condition\n- Easy to move\n\nAffordable solution for student cooking. Still in good working condition!',
        price: 45000,
        condition: 'fair',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/45k meza ya gesi.jpeg'],
        seller_id: 'mock-user-6',
        status: 'active',
        is_sold: false,
        views_count: 92,
        created_at: '2026-10-23T13:00:00.000Z',
        updated_at: '2026-10-23T13:00:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-6',
          name: 'Sarah Kombe',
          email: 'sarah.k@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-7': {
        id: 'mock-7',
        title: 'Kabati - Large Wardrobe',
        description: 'Spacious wooden wardrobe with multiple compartments. Great for organizing clothes and belongings.\n\nFeatures:\n- Multiple shelves\n- Hanging space\n- Solid wood construction\n- Large storage capacity\n- Good condition\n\nPerfect for keeping your room organized!',
        price: 160000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kabati.jpeg'],
        seller_id: 'mock-user-7',
        status: 'active',
        is_sold: false,
        views_count: 103,
        created_at: '2026-10-22T08:30:00.000Z',
        updated_at: '2026-10-22T08:30:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-7',
          name: 'James Nkya',
          email: 'james.n@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-8': {
        id: 'mock-8',
        title: 'Kabati 260k - Premium Wardrobe',
        description: 'High-quality wardrobe with excellent storage capacity. Solid wood construction. Like new condition.\n\nFeatures:\n- Premium wood material\n- Multiple compartments\n- Large hanging space\n- Drawer storage\n- Excellent condition\n\nPerfect for organizing all your belongings!',
        price: 260000,
        condition: 'like_new',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kabati260.jpeg'],
        seller_id: 'mock-user-8',
        status: 'active',
        is_sold: false,
        views_count: 45,
        created_at: '2026-10-21T15:45:00.000Z',
        updated_at: '2026-10-21T15:45:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-8',
          name: 'Lucy Mwita',
          email: 'lucy.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-9': {
        id: 'mock-9',
        title: 'Skeleton ya Nguo - Clothes Rack',
        description: 'Portable clothes hanger rack. Easy to assemble and move. Perfect for hostels without closets.\n\nFeatures:\n- Easy assembly\n- Portable design\n- Multiple hanging bars\n- Stable base\n- Good for small spaces\n\nAffordable solution for hanging clothes!',
        price: 35000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/skeleton ya nguo.jpeg'],
        seller_id: 'mock-user-9',
        status: 'active',
        is_sold: false,
        views_count: 71,
        created_at: '2026-10-20T10:15:00.000Z',
        updated_at: '2026-10-20T10:15:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-9',
          name: 'Daniel Lema',
          email: 'daniel.l@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-10': {
        id: 'mock-10',
        title: 'Kuekea Viatu - Shoe Rack',
        description: 'Multi-tier shoe rack with good capacity. Keep your room organized. Sturdy metal construction.\n\nFeatures:\n- Multiple tiers\n- Metal frame\n- Holds many pairs of shoes\n- Easy to assemble\n- Space-saving design\n\nKeep your shoes organized and accessible!',
        price: 28000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/kuekea viatu.jpeg'],
        seller_id: 'mock-user-10',
        status: 'active',
        is_sold: false,
        views_count: 58,
        created_at: '2026-10-19T12:00:00.000Z',
        updated_at: '2026-10-19T12:00:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-10',
          name: 'Amina Juma',
          email: 'amina.j@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-11': {
        id: 'mock-11',
        title: 'Student Room Setup - Complete Package',
        description: 'Save money with this complete room package! Everything you need to start living comfortably.\n\nIncludes multiple items:\n- Basic furniture pieces\n- Good condition\n- Ready to use\n- Value bundle\n\nPerfect starter package for new students!',
        price: 160000,
        condition: 'good',
        category_id: 'furniture',
        location: 'MUST, Mbeya',
        images: ['/images/market image/160.jpeg'],
        seller_id: 'mock-user-11',
        status: 'active',
        is_sold: false,
        views_count: 134,
        created_at: '2026-10-18T14:30:00.000Z',
        updated_at: '2026-10-18T14:30:00.000Z',
        category: { id: 'furniture', name: 'Furniture', name_sw: 'Samani', slug: 'furniture', icon: 'sofa', parent_id: null, display_order: 1, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-11',
          name: 'Emmanuel Mbwana',
          email: 'emma.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      },
      'mock-12': {
        id: 'mock-12',
        title: 'Gas Cylinders - Mnjis, Ogas, Taifa & Orxy Available',
        description: 'Quality gas cylinders available with competitive prices. Choose your preferred brand!\n\n💰 COMPLETE PACKAGES (Cylinder + Regulator + Accessories):\n• Mnjis Gas: TZS 45,000\n• Ogas Gas: TZS 50,000\n• Taifa Gas: TZS 50,000\n• Orxy Gas: TZS 60,000\n\n🔄 REFILL ONLY:\n• Mnjis: TZS 27,000\n• Ogas: TZS 27,000\n• Taifa: TZS 27,000\n• Orxy: TZS 28,000\n\nAll cylinders are 6kg capacity, perfect for student cooking. Complete packages include regulator, pipe, and safety valve. Safe and reliable brands trusted by students.',
        price: 45000,
        condition: 'new',
        category_id: 'gas',
        location: 'MUST, Mbeya',
        images: ['/images/market image/gas.jpeg'],
        seller_id: 'mock-user-12',
        status: 'active',
        is_sold: false,
        views_count: 98,
        created_at: '2026-10-17T09:00:00.000Z',
        updated_at: '2026-10-17T09:00:00.000Z',
        category: { id: 'gas', name: 'Gas', name_sw: 'Gesi', slug: 'gas', icon: 'package', parent_id: null, display_order: 3, created_at: '', updated_at: '' },
        seller: {
          id: 'mock-user-12',
          name: 'Joseph Mlunde',
          email: 'joseph.m@example.com',
          phone: '+255722429317',
          university: 'Mbeya University of Science and Technology'
        }
      }
    };

    return mockListings[itemId] || null;
  };

  // Get related mock items (same category)
  const getMockRelatedItems = (categoryId: string, excludeId: string): MarketplaceListing[] => {
    const allMockItems = [
      getMockListing('mock-1'),
      getMockListing('mock-2'),
      getMockListing('mock-3'),
      getMockListing('mock-4'),
      getMockListing('mock-5'),
      getMockListing('mock-6'),
      getMockListing('mock-7'),
      getMockListing('mock-8'),
      getMockListing('mock-9'),
      getMockListing('mock-10'),
      getMockListing('mock-11'),
      getMockListing('mock-12'),
    ].filter((item): item is MarketplaceListing => item !== null);

    return allMockItems
      .filter(item => item.category_id === categoryId && item.id !== excludeId)
      .slice(0, 4);
  };

  // State management
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [relatedItems, setRelatedItems] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch listing details - USING MOCK DATA FOR NOW
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      setIsLoading(true);
      
      // TEMPORARILY USING MOCK DATA - Database fetch commented out
      // TODO: Uncomment when database is ready
      
      /*
      try {
        // Fetch listing with category
        const { data: listingData, error: listingError } = await supabase
          .from('marketplace_listings')
          .select(`
            *,
            category:marketplace_categories(*)
          `)
          .eq('id', id)
          .single();

        if (listingError) throw listingError;

        if (listingData) {
          // Fetch seller info from profiles
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, university')
            .eq('id', listingData.seller_id)
            .single();

          setListing({
            ...listingData,
            seller: sellerData ? {
              id: sellerData.id,
              name: sellerData.full_name || 'Anonymous Seller',
              email: sellerData.email,
              phone: sellerData.phone,
              university: sellerData.university
            } : undefined
          });

          // Increment view count
          await supabase.rpc('increment_marketplace_views', { listing_id: id });

          // Fetch related items (same category, exclude current)
          if (listingData.category_id) {
            const { data: related } = await supabase
              .from('marketplace_listings')
              .select(`
                *,
                category:marketplace_categories(*)
              `)
              .eq('category_id', listingData.category_id)
              .eq('status', 'active')
              .neq('id', id)
              .limit(4);

            if (related) {
              setRelatedItems(related);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setIsLoading(false);
      }
      */

      // Use mock data
      const mockItem = getMockListing(id);
      if (mockItem) {
        setListing(mockItem);
        
        // Get related items
        const related = getMockRelatedItems(mockItem.category_id, id);
        setRelatedItems(related);
      }
      
      setIsLoading(false);
    };

    fetchListing();
  }, [id]);

  // Check if item is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;

      const { data } = await supabase
        .from('marketplace_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();

      setIsFavorited(!!data);
    };

    checkFavorite();
  }, [user, id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!user || !id) return;

    if (isFavorited) {
      await supabase
        .from('marketplace_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', id);
      
      setIsFavorited(false);
    } else {
      await supabase
        .from('marketplace_favorites')
        .insert({
          user_id: user.id,
          listing_id: id
        });
      
      setIsFavorited(true);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (!listing?.images || listing.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === listing.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!listing?.images || listing.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images!.length - 1 : prev - 1
    );
  };

  // WhatsApp integration
  const getWhatsAppLink = () => {
    if (!listing?.seller?.phone) return '#';

    const cleanPhone = listing.seller.phone.replace(/[^0-9]/g, '');
    const itemUrl = window.location.href;
    const formattedPrice = `TZS ${Number(listing.price).toLocaleString()}`;
    const condition = listing.condition?.replace(/_/g, ' ') || 'N/A';
    const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : '';

    const message = `🛍️ *${listing.title}*

💰 *Price:* ${formattedPrice}
📦 *Condition:* ${condition}
📍 *Location:* ${listing.location || 'Not specified'}
🏷️ *Category:* ${listing.category?.name || 'Other'}

Hi! I'm interested in this item. Is it still available?

🔗 *Link:* ${itemUrl}

${imageUrl ? `📸 *Image:* ${imageUrl}` : ''}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Item Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=600&fit=crop'];

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 pb-24 lg:pb-0">
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-lg">
              {/* Main Image Carousel */}
              <div className="relative aspect-[4/3] bg-gray-100">
                {listing.is_sold && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-2xl shadow-xl transform rotate-[-15deg]">
                      SOLD
                    </div>
                  </div>
                )}

                <OptimizedImage
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-20"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-20"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-20">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* View All Photos Button */}
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="absolute bottom-4 left-4 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all z-20 flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  View All Photos
                </button>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-4 bg-white">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-primary'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <OptimizedImage
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          width={80}
                          height={80}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Description Card */}
            <Card className="mt-6 border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Similar Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      price={Number(item.price)}
                      location={item.location}
                      images={item.images || []}
                      category={item.category?.name || 'Other'}
                      condition={item.condition}
                      created_at={item.created_at}
                      is_sold={item.is_sold}
                      views_count={item.views_count}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price & Title Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  {/* Category & Condition Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {listing.category?.name || 'Other'}
                    </Badge>
                    {listing.condition && (
                      <Badge variant="outline" className="text-sm">
                        {listing.condition.replace(/_/g, ' ')}
                      </Badge>
                    )}
                    {listing.is_sold && (
                      <Badge variant="destructive" className="text-sm">
                        SOLD
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {listing.title}
                  </h1>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-3xl sm:text-4xl font-bold text-teal-600">
                      TZS {Number(listing.price).toLocaleString()}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Meta Info */}
                  <div className="space-y-3 text-sm text-gray-600">
                    {listing.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>Posted {timeAgo}</span>
                    </div>
                    {listing.views_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 flex-shrink-0" />
                        <span>{listing.views_count} views</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons - Desktop Only */}
                  <div className="hidden lg:block space-y-3">
                    {!listing.is_sold && listing.seller?.phone && (
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Contact Seller on WhatsApp
                        </Button>
                      </a>
                    )}

                    <div className="flex gap-2">
                      {user && (
                        <Button
                          variant="outline"
                          onClick={handleToggleFavorite}
                          className="flex-1 h-12"
                        >
                          <Heart
                            className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                          />
                          {isFavorited ? 'Saved' : 'Save'}
                        </Button>
                      )}
                      <ShareDropdown
                        title={listing.title}
                        description={`TZS ${Number(listing.price).toLocaleString()} - ${listing.category?.name || 'Item'}`}
                      />
                    </div>
                  </div>
                  
                  {/* Save/Share Buttons - Mobile Only */}
                  <div className="lg:hidden flex gap-2">
                    {user && (
                      <Button
                        variant="outline"
                        onClick={handleToggleFavorite}
                        className="flex-1 h-12"
                      >
                        <Heart
                          className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {isFavorited ? 'Saved' : 'Save'}
                      </Button>
                    )}
                    <ShareDropdown
                      title={listing.title}
                      description={`TZS ${Number(listing.price).toLocaleString()} - ${listing.category?.name || 'Item'}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info Card */}
              {listing.seller && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Seller Information
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {listing.seller.name}
                          </div>
                          {listing.seller.university && (
                            <div className="text-sm text-gray-600">
                              {listing.seller.university}
                            </div>
                          )}
                        </div>
                      </div>

                      {listing.seller.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{listing.seller.email}</span>
                        </div>
                      )}

                      {listing.seller.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{listing.seller.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Safety Tips Card */}
              <Card className="border-0 shadow-lg bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Safety Tips</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Meet in a safe, public place</li>
                        <li>• Check the item before paying</li>
                        <li>• Pay only after receiving the item</li>
                        <li>• Beware of unrealistic prices</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Sheet - Mobile Contact Buttons */}
      {!listing.is_sold && listing.seller?.phone && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
          <div className="px-4 py-3 safe-bottom">
            <div className="flex gap-3">
              {/* Phone Call Button */}
              <a
                href={`tel:${listing.seller.phone}`}
                className="flex-1"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-base font-semibold shadow-lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Call
                </Button>
              </a>
              
              {/* WhatsApp Button */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-base font-semibold shadow-lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0">
          <div className="relative h-full flex items-center justify-center bg-black">
            <OptimizedImage
              src={images[currentImageIndex]}
              alt={listing.title}
              className="max-h-full max-w-full object-contain"
              width={1200}
              height={900}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MarketplaceItemDetail;
