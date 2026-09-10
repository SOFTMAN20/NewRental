/**
 * PROPERTY CARD - STUDENT.COM STYLE
 * =================================
 * 
 * Clean, minimal property card design inspired by Student.com
 * Focus on image, title, location, and price
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import DirectionsWalk from '@/components/icons/DirectionsWalk';
import { TwoWheeler } from '@mui/icons-material';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/common/OptimizedImage';

interface PropertyCardProps {
  id: string;
  title: string;
  monthly_rent: number;
  address: string;
  city: string;
  images: string[];
  room_type?: string;
  distance_from_campus?: number;
  transport_mode?: string;
  university?: {
    name: string;
    abbreviation: string;
  };
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  gender_restrictions?: string;
  amenities?: any;
  landlord?: any;
  available_beds?: number;
  is_available?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  monthly_rent,
  address,
  city,
  images,
  distance_from_campus,
  transport_mode,
  university,
  is_available = true,
  gender_restrictions,
}) => {
  const imageUrl = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop';

  // Get transport mode icon/emoji
  const getTransportIcon = () => {
    switch(transport_mode) {
      case 'walking':
        return '🚶';
      case 'bike':
        return '🏍️';
      case 'car':
        return '🚗';
      default:
        return '🚶';
    }
  };

  // Get transport mode icon component
  const getTransportIconComponent = () => {
    switch(transport_mode) {
      case 'bike':
        return <TwoWheeler className="h-4 w-4 mr-1 flex-shrink-0" style={{ fontSize: '1rem' }} />;
      case 'car':
        return <Car className="h-4 w-4 mr-1 flex-shrink-0" />;
      case 'walking':
      default:
        return <DirectionsWalk className="h-4 w-4 mr-1 flex-shrink-0" />;
    }
  };

  return (
    <Link to={`/property/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
        {/* Property Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className={`w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl ${!is_available ? 'opacity-60' : ''}`}
            width={500}
            height={400}
            placeholder="blur"
          />
          
          {/* SOLD OUT Badge */}
          {!is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
              <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl transform rotate-[-15deg]">
                SOLD OUT
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>

          {/* Location/Distance Info - Always show if available */}
          {university && distance_from_campus && (
            <div className="flex items-center text-gray-500 mb-3">
              {getTransportIconComponent()}
              <span className="text-xs sm:text-sm mr-1">
                {distance_from_campus} min
              </span>
              <span className="text-sm sm:text-base mr-1">{getTransportIcon()}</span>
              <span className="text-xs sm:text-sm line-clamp-1">
                {/* Mobile: Show abbreviation */}
                <span className="sm:hidden">
                  from {university.abbreviation || university.name}
                </span>
                {/* Desktop: Show full name */}
                <span className="hidden sm:inline">
                  from {university.name}
                </span>
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
              TZS {Number(monthly_rent).toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-gray-600 ml-1">/month</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
