/**
 * MARKETPLACE ITEM CARD
 * ====================
 * 
 * Reusable card component for displaying marketplace items
 * Similar style to PropertyCard but adapted for marketplace items
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Eye, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/common/OptimizedImage';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  id: string;
  title: string;
  price: number;
  location?: string;
  images: string[];
  category: string;
  condition?: string;
  created_at: string;
  is_sold?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  views_count?: number;
  seller?: {
    name: string;
    university?: string;
  };
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  price,
  location,
  images,
  category,
  condition,
  created_at,
  is_sold = false,
  isFavorited = false,
  onToggleFavorite,
  views_count,
  seller,
}) => {
  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&h=400&fit=crop';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <Link to={`/marketplace/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
        {/* Item Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className={`w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl ${is_sold ? 'opacity-60' : ''}`}
            width={500}
            height={400}
            placeholder="blur"
          />
          
          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {category}
          </div>

          {/* SOLD Badge */}
          {is_sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
              <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl transform rotate-[-15deg]">
                SOLD
              </div>
            </div>
          )}

          {/* Condition Badge */}
          {!is_sold && condition && (
            <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-medium">
              {condition}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Location/Seller Info */}
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <div className="flex items-center min-w-0">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-xs sm:text-sm line-clamp-1">
                {location || seller?.university || 'Location not specified'}
              </span>
            </div>
            {views_count !== undefined && (
              <div className="flex items-center ml-2 flex-shrink-0">
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-xs">{views_count}</span>
              </div>
            )}
          </div>

          {/* Time Posted */}
          <div className="flex items-center text-gray-400 mb-3">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{timeAgo}</span>
          </div>

          {/* Price with Details Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline flex-wrap">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
                TZS {Number(price).toLocaleString()}
              </span>
            </div>
            <button className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105 whitespace-nowrap">
              Details
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ItemCard;
