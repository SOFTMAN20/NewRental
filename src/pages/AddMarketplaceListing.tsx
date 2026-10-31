/**
 * ADD MARKETPLACE LISTING PAGE
 * ===========================
 * 
 * Page for students to list items for sale in the marketplace
 * Categories: Furniture, Electronics, Textbooks, Kitchen, Clothing, Sports, Services, Other
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, Loader2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/lib/integrations/supabase/types';
import LoadingSpinner from '@/components/ui/loading-spinner';

type MarketplaceCategory = Database['public']['Tables']['marketplace_categories']['Row'];

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category_id: string;
  condition: string;
  location: string;
  images: string[];
}

const AddMarketplaceListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'good',
    location: '',
    images: []
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to list an item',
        variant: 'destructive'
      });
      navigate('/signin');
    }
  }, [user, navigate, toast]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Load images from localStorage on mount
  useEffect(() => {
    if (user) {
      try {
        const storageKey = `marketplace_images_${user.id}`;
        const savedImages = localStorage.getItem(storageKey);
        if (savedImages) {
          const parsedImages = JSON.parse(savedImages);
          setFormData(prev => ({
            ...prev,
            images: parsedImages
          }));
        }
      } catch (error) {
        console.error('Failed to load images from localStorage:', error);
      }
    }
  }, [user]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadedBase64: string[] = [];

      // Limit to 3 images max for localStorage space
      const maxImages = Math.min(files.length, 3);

      for (let i = 0; i < maxImages; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid File',
            description: `${file.name} is not an image`,
            variant: 'destructive'
          });
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File Too Large',
            description: `${file.name} exceeds 5MB`,
            variant: 'destructive'
          });
          continue;
        }

        // Compress and convert image to base64
        const compressedBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              // Create canvas to resize/compress
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Resize to max 600px width/height (smaller for localStorage)
              let width = img.width;
              let height = img.height;
              const maxSize = 600;
              
              if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Draw and compress (0.5 quality = 50% for smaller size)
              ctx?.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
              resolve(compressedBase64);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        uploadedBase64.push(compressedBase64);
      }

      // Store in localStorage
      const currentImages = formData.images;
      const allImages = [...currentImages, ...uploadedBase64].slice(0, 3); // Max 3 images total
      
      // Save to localStorage with user's id as key
      try {
        const storageKey = `marketplace_images_${user!.id}`;
        localStorage.setItem(storageKey, JSON.stringify(allImages));
      } catch (storageError) {
        console.error('LocalStorage error:', storageError);
        toast({
          title: 'Storage Full',
          description: 'Please clear browser data or use fewer images.',
          variant: 'destructive'
        });
        setUploadingImages(false);
        return;
      }

      setFormData(prev => ({
        ...prev,
        images: allImages
      }));

      toast({
        title: 'Success',
        description: `${uploadedBase64.length} image(s) uploaded (max 3 total)`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    
    // Update localStorage
    try {
      const storageKey = `marketplace_images_${user!.id}`;
      if (updatedImages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(updatedImages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
    }

    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters');
    }
    if (!formData.description?.trim() || formData.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('Price must be greater than 0');
    }
    if (parseFloat(formData.price) > 999999999) {
      errors.push('Price is too high');
    }
    if (!formData.category_id) {
      errors.push('Please select a category');
    }
    if (!formData.condition) {
      errors.push('Please select item condition');
    }
    if (!formData.location?.trim()) {
      errors.push('Please provide a location');
    }
    if (!formData.images || formData.images.length === 0) {
      errors.push('Please upload at least one image');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive'
      });
      navigate('/signin');
      return;
    }

    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: 'Validation Error',
        description: validation.errors[0],
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create listing object with unique ID
      const newListing = {
        id: `listing-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        seller_id: user.id,
        seller_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        seller_email: user.email || '',
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        category_name: categories.find(c => c.id === formData.category_id)?.name || 'Other',
        condition: formData.condition,
        location: formData.location.trim(),
        images: formData.images,
        status: 'active',
        is_sold: false,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to localStorage
      try {
        // Get existing listings
        const existingListingsJson = localStorage.getItem('marketplace_listings');
        const existingListings = existingListingsJson ? JSON.parse(existingListingsJson) : [];
        
        // Keep only last 10 listings to save space
        const recentListings = existingListings.slice(0, 10);
        
        // Add new listing
        recentListings.unshift(newListing); // Add at the beginning
        
        // Try to save
        const newListingsJson = JSON.stringify(recentListings);
        
        try {
          localStorage.setItem('marketplace_listings', newListingsJson);
        } catch (quotaError: any) {
          // If still fails, keep only last 5 listings
          const minimalListings = recentListings.slice(0, 5);
          localStorage.setItem('marketplace_listings', JSON.stringify(minimalListings));
          
          toast({
            title: 'Storage Warning',
            description: 'Old listings cleared to make space.',
            variant: 'default'
          });
        }

        // Clear the images storage for this user
        const storageKey = `marketplace_images_${user.id}`;
        localStorage.removeItem(storageKey);

        toast({
          title: 'Success! 🎉',
          description: 'Your item has been listed',
        });

        // Navigate to the listing detail page
        navigate(`/marketplace/${newListing.id}`);
      } catch (storageError: any) {
        console.error('LocalStorage error:', storageError);
        
        let errorMsg = 'Failed to save listing. ';
        
        if (storageError.name === 'QuotaExceededError') {
          errorMsg += 'Storage is full. Please clear browser data: Press F12 → Application → Storage → Clear Site Data';
        } else {
          errorMsg += 'Please try with fewer or smaller images.';
        }
        
        toast({
          title: 'Storage Error',
          description: errorMsg,
          variant: 'destructive',
          duration: 10000
        });
      }
    } catch (error: any) {
      console.error('Error submitting listing:', error);

      toast({
        title: 'Error',
        description: 'Failed to create listing',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-6 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-serengeti-500 rounded-3xl mb-4 shadow-xl">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              List Your Item
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Share what you don't need with fellow students
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Info Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-serengeti-50 border-b">
              <CardTitle className="text-xl font-bold">📝 Item Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-semibold text-gray-900 mb-2">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Study Desk with Chair - Good Condition"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={100}
                  className="h-12 text-base rounded-xl border-2 focus:border-primary"
                  required
                />
                <p className="text-sm text-gray-500 mt-1.5">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-semibold text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail - condition, features, dimensions, why you're selling, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  maxLength={2000}
                  className="text-base rounded-xl border-2 focus:border-primary resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-1.5">
                  {formData.description.length}/2000 characters (minimum 20)
                </p>
              </div>

              {/* Category & Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="category" className="text-base font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                    required
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition" className="text-base font-semibold text-gray-900 mb-2">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleInputChange('condition', value)}
                    required
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">✨ Brand New</SelectItem>
                      <SelectItem value="like_new">🌟 Like New</SelectItem>
                      <SelectItem value="good">👍 Good</SelectItem>
                      <SelectItem value="fair">👌 Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price & Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="price" className="text-base font-semibold text-gray-900 mb-2">
                    Price (TZS) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="50,000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    min="1"
                    className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-semibold text-gray-900 mb-2">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., UDSM, Dar es Salaam"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="h-12 text-base rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-serengeti-500/5 to-primary/5 border-b">
              <CardTitle className="text-xl font-bold">📸 Photos</CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-2">
                  Upload Images <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Add up to 3 clear photos (max 5MB each). First image will be the cover.
                </p>

                {/* Image Grid & Upload Button */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  {/* Existing Images */}
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group">
                      <img
                        src={url}
                        alt={`Item ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Button - Always visible when less than 3 images */}
                  {formData.images.length < 3 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-primary/5 transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-2 animate-spin" />
                          <span className="text-xs sm:text-sm text-gray-600">Uploading...</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Add Photo</span>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {3 - formData.images.length} left
                          </span>
                        </div>
                      )}
                    </label>
                  )}
                </div>

                {/* Help Text */}
                {formData.images.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Add clear, well-lit photos to attract more buyers. Show different angles and any defects honestly.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-4 sm:relative sm:bottom-0 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none shadow-2xl sm:shadow-none border sm:border-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base border-2 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-600 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={submitting || uploadingImages}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Publish Listing
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddMarketplaceListing;
