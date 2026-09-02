import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Wifi, Car, Utensils, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties, type Property } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PropertyGridSkeleton } from '@/components/common/PropertyCardSkeleton';
import { useTranslation } from 'react-i18next';

/**
 * INDIVIDUAL PROPERTY CARD COMPONENT WITH MOBILE TOUCH
 * ===================================================
 * 
 * Wrapper component that handles mobile touch functionality
 * for each individual property card in the featured section.
 */
const FeaturedPropertyCard = ({ property, index, t }: { property: any, index: number, t: any }) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  /**
   * MOBILE TOUCH HANDLER
   * ===================
   * 
   * Shows action buttons when user taps on mobile devices.
   * Auto-hides after 3 seconds for clean UX.
   * Does NOT prevent navigation - allows clicking anywhere to go to details.
   */
  const handleMobileTouch = (e: React.TouchEvent | React.MouseEvent) => {
    // Don't prevent default - allow navigation to work
    setShowMobileActions(true);

    // Auto-hide buttons after 3 seconds
    setTimeout(() => {
      setShowMobileActions(false);
    }, 3000);
  };

  return (
    <Card key={property.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 
                       bg-white hover:border-primary/30 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-serengeti-500/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl"
            onTouchStart={handleMobileTouch}
            onClick={handleMobileTouch}
          >
            <img
              src={property.images && property.images.length > 0
                ? property.images[0]
                : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop'
              }
              alt={property.title}
              className={`w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl ${!property.is_available ? 'opacity-60' : ''}`}
            />
            
            {/* SOLD OUT Badge */}
            {!property.is_available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-30">
                <div className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-xl transform rotate-[-15deg]">
                  SOLD OUT
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Featured Badge */}
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 text-white z-20 shadow-lg border border-white/20 backdrop-blur-sm font-bold text-xs px-3 py-1 transform group-hover:scale-105 transition-transform duration-300">
            ⭐ {t('featuredProperties.featured')}
          </Badge>
          {/* Rating badge - HIDDEN */}
          {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center z-20 shadow-lg border border-yellow-200/50 transform group-hover:scale-105 transition-transform duration-300">
            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
            <span className="text-xs font-bold text-gray-800">4.8</span>
          </div> */}

          {/* Enhanced hover overlay with quick view icon - shows on hover OR mobile touch */}
          <div className={`absolute inset-0 transition-all duration-500 z-10 ${showMobileActions
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100'
            }`}>
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/95 rounded-full p-1.5 transform hover:scale-110 transition-all duration-300 shadow-lg">
                <Eye className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Location/Distance */}
          {property.university && property.distance_from_campus && (
            <div className="flex items-center text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {/* Mobile: Show abbreviation */}
                <span className="sm:hidden">
                  {property.distance_from_campus} mins from {property.university.abbreviation || property.university.name}
                </span>
                {/* Desktop: Show full name */}
                <span className="hidden sm:inline">
                  {property.distance_from_campus} mins from {property.university.name}
                </span>
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
              TZS {Number(property.monthly_rent || property.price).toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-gray-600 ml-1">/month</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { data: allProperties = [], isLoading, error } = useProperties();

  // Get featured properties - 8 for mobile, 16 for desktop
  const isMobile = window.innerWidth < 768; // md breakpoint
  const propertyLimit = isMobile ? 8 : 16;
  const typedProperties = allProperties as Property[];
  const properties = typedProperties.slice(0, propertyLimit);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Zap': return <Zap className="h-3 w-3" />;
      case 'Parking': return <Car className="h-3 w-3" />;
      case 'Kitchen': return <Utensils className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <section className="pt-0 pb-8 bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50 relative overflow-hidden -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4">
              Find Your Perfect College Home in Dar es Salaam
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('featuredProperties.subtitle')}
            </p>
          </div>

          {/* Skeleton Loading Grid */}
          <PropertyGridSkeleton
            count={8}
            viewMode="grid"
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('featuredProperties.loadingError')}
            </h2>
            <p className="text-gray-600">
              {t('featuredProperties.tryAgain')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-0 pb-8 bg-gradient-to-br from-safari-50 via-white to-kilimanjaro-50 relative overflow-hidden -mt-8">
      {/* Background Pattern for Visual Interest */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-serengeti-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6 text-left mt-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1">
            Find Your Perfect College Home in MUST
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t('featuredProperties.subtitle')}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {properties.map((property, index) => (
              <FeaturedPropertyCard
                key={property.id}
                property={property}
                index={index}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t('featuredProperties.noProperties')}
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/browse">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              {t('featuredProperties.viewMore')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;