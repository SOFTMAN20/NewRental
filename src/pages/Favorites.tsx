
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['1', '3']);

  // Sample properties (in real app, these would be fetched based on favoriteIds)
  const favoriteProperties = [
    {
      id: '1',
      title: 'Nyumba ya Kisasa Mikocheni',
      description: 'Nyumba nzuri ya vyumba 3 na jiko la kisasa. Ina bustani ndogo na nafasi ya gari.',
      price: 800000,
      location: 'Mikocheni, Dar es Salaam',
      images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop'],
      utilities: { electricity: true, water: true },
      nearbyServices: ['school', 'hospital', 'market'],
      landlord: { name: 'Mwalimu John', phone: '+255712345678', email: 'john@example.com' }
    },
    {
      id: '3',
      title: 'Nyumba ya Familia Arusha',
      description: 'Nyumba kubwa ya vyumba 4 na bustani. Mazingira mazuri na hewa safi.',
      price: 1200000,
      location: 'Njiro, Arusha',
      images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop'],
      utilities: { electricity: true, water: true },
      nearbyServices: ['school', 'hospital'],
      landlord: { name: 'Mzee Hassan', phone: '+255678901234', email: 'hassan@example.com' }
    }
  ];

  const handleToggleFavorite = (propertyId: string) => {
    setFavoriteIds(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            Nyumba Pendwa
          </h1>
          <p className="text-gray-600">
            Nyumba {favoriteProperties.length} ulizoziokoa kwa ajili ya baadaye
          </p>
        </div>

        {/* Content */}
        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                isFavorited={favoriteIds.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hakuna nyumba za pendwa
              </h3>
              <p className="text-gray-600 mb-6">
                Tazama nyumba na ubofye ikoni ya moyo kuziokoa kwa ajili ya baadaye
              </p>
              <Link to="/browse">
                <Button className="bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4 mr-2" />
                  Tazama Nyumba
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tips section */}
        {favoriteProperties.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vidokezo vya Kutumia Nyumba Pendwa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                • Linganisha bei na mazingira ya nyumba tofauti
              </div>
              <div>
                • Wasiliana na wenye nyumba moja kwa moja
              </div>
              <div>
                • Angalia mara kwa mara kwa updates za bei
              </div>
              <div>
                • Shiriki nyumba na familia au marafiki
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
