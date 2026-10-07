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

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      setIsLoading(true);
      
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
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

                  {/* Action Buttons */}
                  <div className="space-y-3">
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
