import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useTranslation } from 'react-i18next';

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { data: allProperties = [], isLoading, error } = useProperties();
  
  // Get featured properties (limit to 4 for homepage display)
  const properties = allProperties.slice(0, 4);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi': return <Wifi className="h-3 w-3" />;
      case 'Parking': return <Car className="h-3 w-3" />;
      case 'Kitchen': return <Utensils className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredProperties.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('featuredProperties.subtitle')}
            </p>
          </div>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
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
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('featuredProperties.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('featuredProperties.subtitle')}
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Link 
                key={property.id}
                to={`/property/${property.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={property.images && property.images.length > 0 
                        ? property.images[0] 
                        : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop'
                      } 
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {t('featuredProperties.featured')}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                      <span className="text-xs font-medium">4.8</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {property.electricity && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          <span className="mr-1">{getAmenityIcon('WiFi')}</span>
                          Umeme
                        </Badge>
                      )}
                      {property.water && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          <span className="mr-1">💧</span>
                          Maji
                        </Badge>
                      )}
                      {property.parking && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          <span className="mr-1">{getAmenityIcon('Parking')}</span>
                          Parking
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-foreground">
                          TSh {Number(property.price).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm">{t('featuredProperties.perMonth')}</span>
                        <div className="text-xs text-muted-foreground mt-1">
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
                </Card>
              </Link>
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