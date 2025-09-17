import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Wifi, Car, Utensils, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PropertyGridSkeleton } from '@/components/PropertyCardSkeleton';
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
            className="relative overflow-hidden"
            onTouchStart={handleMobileTouch}
            onClick={handleMobileTouch}
          >
            <img 
              src={property.images && property.images.length > 0 
                ? property.images[0] 
                : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop'
              } 
              alt={property.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          
          {/* Enhanced Featured Badge */}
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 text-white z-20 shadow-lg border border-white/20 backdrop-blur-sm font-bold text-xs px-3 py-1 transform group-hover:scale-105 transition-transform duration-300">
            ⭐ {t('featuredProperties.featured')}
          </Badge>
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center z-20 shadow-lg border border-yellow-200/50 transform group-hover:scale-105 transition-transform duration-300">
            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
            <span className="text-xs font-bold text-gray-800">4.8</span>
          </div>

          {/* Enhanced hover overlay with quick actions - shows on hover OR mobile touch */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                          transition-all duration-500 z-10 ${
                            showMobileActions 
                              ? 'opacity-100' 
                              : 'opacity-0 group-hover:opacity-100'
                          }`}>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center items-center">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/95 text-gray-900 hover:bg-white transform hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/property/${property.id}`;
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {property.electricity && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-800 
                                                   border border-green-200 hover:bg-green-200 transition-colors duration-300">
                <Zap className="h-3 w-3 mr-1" />
                Umeme
              </Badge>
            )}
            {property.water && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-800 
                                                   border border-blue-200 hover:bg-blue-200 transition-colors duration-300">
                <span className="mr-1">💧</span>
                Maji
              </Badge>
            )}
            {property.parking && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-800 
                                                   border border-gray-200 hover:bg-gray-200 transition-colors duration-300">
                <Car className="h-3 w-3 mr-1" />
                Parking
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-gray-900">
                TSh {Number(property.price).toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">{t('featuredProperties.perMonth')}</span>
              <div className="text-xs text-gray-500 mt-1">
                {Math.floor(Math.random() * 50) + 10} {t('featuredProperties.reviews')}
              </div>
            </div>
            
            {property.profiles?.phone && (
              <a
                href={`https://wa.me/${(property.contact_whatsapp_phone || property.contact_phone || property.profiles.phone)!.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full text-xs transition-colors"
              >
                <span className="mr-1">📱</span>
                {t('featuredProperties.call')}
              </a>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { data: allProperties = [], isLoading, error } = useProperties();
  
  // Get featured properties (limit to 16 for homepage display)
  const properties = allProperties.slice(0, 16);

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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredProperties.title')}
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent mb-1">
            {t('featuredProperties.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t('featuredProperties.subtitle')}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="text-center mt-10">
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