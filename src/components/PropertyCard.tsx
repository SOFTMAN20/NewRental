/**
 * PROPERTYCARD.TSX - REUSABLE PROPERTY DISPLAY COMPONENT
 * =====================================================
 * 
 * Kipengele cha kuonyesha nyumba - Reusable property display component
 * 
 * ARCHITECTURE / MUUNDO:
 * This is a highly reusable component that can display property information
 * in multiple formats (grid/list) across different pages of the application.
 * 
 * DESIGN PATTERNS / MIFUMO YA MUUNDO:
 * - Compound component pattern for flexible layouts
 * - Prop-based configuration for different use cases
 * - Event delegation for user interactions
 * - Responsive design with mobile-first approach
 * 
 * FEATURES / VIPENGELE:
 * - Dual view modes (grid and list)
 * - Interactive image carousel
 * - Favorite toggle functionality
 * - Direct WhatsApp integration
 * - Responsive design for all devices
 * - Accessibility features
 * 
 * SCALABILITY / UKUAJI:
 * - Easy to extend with new view modes
 * - Configurable through props
 * - Reusable across different pages
 * - Can be enhanced with additional features
 * 
 * PERFORMANCE / UTENDAJI:
 * - Optimized image loading
 * - Minimal re-renders through proper state management
 * - Efficient event handling
 * - Lazy loading support ready
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Map from '@/components/ui/map';
import { Heart, MapPin, Phone, Zap, Droplets, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * PROPERTY CARD PROPS INTERFACE
 * ============================
 * 
 * Defines the contract for PropertyCard component props.
 * Ensures type safety and clear API for component usage.
 * 
 * REQUIRED PROPS / VIPENGELE VINAVYOHITAJIKA:
 * - id: Unique property identifier for routing
 * - title: Property name/title for display
 * - price: Monthly rent amount in TZS
 * - location: Property location string
 * - images: Array of image URLs
 * 
 * OPTIONAL PROPS / VIPENGELE VYA HIARI:
 * - phone: Landlord contact number
 * - isFavorited: Current favorite status
 * - onToggleFavorite: Callback for favorite toggle
 * - viewMode: Display format (grid or list)
 * 
 * EXTENSIBILITY / UWEZEKANO WA KUONGEZA:
 * - Easy to add new props without breaking existing usage
 * - Optional props provide flexibility
 * - Type safety prevents runtime errors
 */
interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  phone?: string;
  contactPhone?: string;
  contactWhatsappPhone?: string;
  electricity?: boolean;
  water?: boolean;
  bedrooms?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

/**
 * PROPERTY CARD COMPONENT
 * ======================
 * 
 * Main component function that renders property information
 * in either grid or list format based on viewMode prop.
 * 
 * STATE MANAGEMENT / USIMAMIZI WA HALI:
 * - currentImageIndex: Tracks which image is currently displayed
 * - Local state for image carousel functionality
 * 
 * CONDITIONAL RENDERING / UONYESHAJI WA MASHARTI:
 * - Different layouts based on viewMode prop
 * - Responsive behavior for different screen sizes
 * - Graceful handling of missing data
 * 
 * USER INTERACTIONS / MWINGILIANO WA MTUMIAJI:
 * - Image carousel navigation
 * - Favorite toggle with callback
 * - WhatsApp contact integration
 * - Navigation to property details
 */
const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  images,
  phone,
  contactPhone,
  contactWhatsappPhone,
  electricity,
  water,
  bedrooms,
  isFavorited = false,
  onToggleFavorite,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation();

  /**
   * IMAGE CAROUSEL STATE
   * ===================
   * 
   * Manages which image is currently displayed in the carousel.
   * Starts at index 0 and cycles through available images.
   * 
   * USAGE / MATUMIZI:
   * - Updated by image navigation buttons
   * - Used to display current image
   * - Enables smooth image transitions
   */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * FAVORITE TOGGLE HANDLER
   * ======================
   * 
   * Handles favorite button clicks with proper event handling.
   * 
   * EVENT HANDLING / KUSHUGHULIKIA MATUKIO:
   * - preventDefault: Stops link navigation
   * - stopPropagation: Prevents event bubbling
   * - Calls parent callback if provided
   * 
   * ACCESSIBILITY / UFIKIVU:
   * - Keyboard accessible
   * - Screen reader friendly
   * - Clear visual feedback
   */
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  /**
   * LIST VIEW RENDERING
   * ==================
   * 
   * Renders property card in horizontal list format.
   * Optimized for desktop viewing with more details.
   * 
   * LAYOUT / MPANGILIO:
   * - Horizontal flex layout
   * - Fixed image width (320px)
   * - Expanded content area
   * - Enhanced information display
   * 
   * FEATURES / VIPENGELE:
   * - Larger image display
   * - More detailed information
   * - Better for comparison viewing
   * - Desktop-optimized layout
   */
  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <Link to={`/property/${id}`} className="block">
          <div className="flex">
            {/* 
             * LIST VIEW IMAGE SECTION
             * ======================
             * 
             * Fixed-width image container for list view.
             * Maintains aspect ratio and provides hover effects.
             */}
            <div className="w-80 h-60 flex-shrink-0 relative overflow-hidden">
              <img
                src={images[0] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* 
               * FAVORITE BUTTON - LIST VIEW
               * ==========================
               * 
               * Positioned absolutely in top-right corner.
               * Changes color based on favorite status.
               */}
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  isFavorited ? 'text-red-500' : 'text-white'
                } hover:text-red-500 bg-black/20 hover:bg-white/90`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>

              {/* 
               * PRICE OVERLAY - LIST VIEW
               * ========================
               * 
               * Displays price prominently on image.
               * High contrast for readability.
               */}
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-white text-gray-900 font-bold text-base px-3 py-1 shadow-sm">
                  TZS {price.toLocaleString()}/mwezi
                </Badge>
              </div>
            </div>

            {/* 
             * LIST VIEW CONTENT SECTION
             * ========================
             * 
             * Expanded content area with detailed information.
             * Includes title, location, rating, and contact button.
             */}
            <div className="flex-1 p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-xl text-primary group-hover:text-gray-900 transition-colors line-clamp-1">
                    {title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{location}</span>
                  </div>
                </div>

                {/* 
                 * RATING AND CONTACT SECTION
                 * ==========================
                 * 
                 * Shows property amenities and provides contact options.
                 * WhatsApp integration for direct communication.
                 */}
                <div className="flex items-center space-x-3">
                  {electricity && (
                    <div className="flex items-center text-green-600" title="Umeme">
                      <Zap className="h-4 w-4" />
                    </div>
                  )}
                  {water && (
                    <div className="flex items-center text-blue-600" title="Maji">
                      <Droplets className="h-4 w-4" />
                    </div>
                  )}
                  {bedrooms && bedrooms > 0 && (
                    <div className="flex items-center text-gray-600" title="Vyumba vya kulala">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">{bedrooms} {t('propertyCard.bedrooms')}</span>
                    </div>
                  )}
                </div>

                {/* 
                 * VIEW DETAILS BUTTON - LIST VIEW
                 * ==============================
                 * 
                 * Button to navigate to property details page.
                 */}
                <div className="pt-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white text-sm py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/property/${id}`;
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  /**
   * GRID VIEW RENDERING (DEFAULT)
   * =============================
   * 
   * Renders property card in vertical grid format.
   * Optimized for mobile and grid layouts.
   * 
   * LAYOUT / MPANGILIO:
   * - Vertical card layout
   * - Square aspect ratio image
   * - Compact information display
   * - Mobile-first design
   * 
   * FEATURES / VIPENGELE:
   * - Image carousel with indicators
   * - Hover effects and animations
   * - Responsive design
   * - Touch-friendly interactions
   */
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-sm">
      <Link to={`/property/${id}`} className="block">
        <div className="relative">
          {/* 
           * GRID VIEW IMAGE SECTION
           * ======================
           * 
           * Square aspect ratio image with carousel functionality.
           * Includes navigation and indicators for multiple images.
           */}
          <div className="aspect-[4/3] overflow-hidden relative">
            <img
              src={images[currentImageIndex] || `https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* 
           * IMAGE CAROUSEL INDICATORS
           * ========================
           * 
           * Shows dots for each image and allows navigation.
           * Only displayed when multiple images are available.
           */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 
           * FAVORITE BUTTON - GRID VIEW
           * ===========================
           * 
           * Heart icon for adding/removing from favorites.
           * Visual feedback based on current state.
           */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFavorited ? 'text-red-500' : 'text-white'
            } hover:text-red-500 bg-black/20 hover:bg-white/90 transition-all`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* 
         * GRID VIEW CONTENT SECTION
         * ========================
         * 
         * Compact content area with essential information.
         * Optimized for quick scanning and comparison.
         */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* 
             * TITLE AND LOCATION
             * =================
             * 
             * Property name and location with truncation.
             * Hover effects for better interactivity.
             */}
            <div>
                             <h3 className="font-semibold text-lg line-clamp-1 text-primary group-hover:text-gray-900 transition-colors">
                {title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>

            {/* 
             * AMENITIES DISPLAY
             * ================
             * 
             * Shows property amenities like electricity, water, and bedrooms.
             * Provides quick overview of property features.
             */}
            <div className="flex items-center space-x-3">
              {electricity && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                  <Zap className="h-3 w-3 mr-1" />
                  {t('browse.electricity')}
                </Badge>
              )}
              {water && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-800">
                  <Droplets className="h-3 w-3 mr-1" />
                  {t('browse.water')}
                </Badge>
              )}
                             {bedrooms && bedrooms > 0 && (
                 <Badge variant="secondary" className="text-xs px-2 py-1">
                   <Bed className="h-3 w-3" />
                   <span className="ml-1">{bedrooms}</span>
                 </Badge>
               )}
            </div>

                         {/* 
              * PRICE SECTION
              * =============
              * 
              * Displays price information.
              */}
             <div className="pt-1">
               <div className="flex items-baseline">
                 <span className="text-lg font-bold text-gray-900">
                   TZS {price.toLocaleString()}
                 </span>
                 <span className="text-gray-500 ml-1 text-sm">{t('propertyCard.perMonth')}</span>
               </div>
             </div>

             {/* 
              * VIEW DETAILS BUTTON
              * ===================
              * 
              * Button to navigate to property details page.
              */}
             <div className="pt-2">
               <Button 
                 className="w-full bg-primary hover:bg-primary/90 text-white text-sm py-2"
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   window.location.href = `/property/${id}`;
                 }}
               >
                 View Details
               </Button>
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;