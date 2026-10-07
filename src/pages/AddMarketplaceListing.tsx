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
      const uploadedUrls: string[] = [];

      for (let i = 0; i < Math.min(files.length, 5); i++) {
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

        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('marketplace-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Upload Failed',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive'
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('marketplace-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({
        title: 'Success',
        description: `${uploadedUrls.length} image(s) uploaded`
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
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast({
          title: 'Error',
          description: 'Session expired. Please sign in again.',
          variant: 'destructive'
        });
        navigate('/signin');
        return;
      }

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          seller_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          category_id: formData.category_id,
          condition: formData.condition,
          location: formData.location.trim(),
          images: formData.images,
          status: 'active',
          is_sold: false,
          views_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating listing:', error);
        throw error;
      }

      toast({
        title: 'Success! 🎉',
        description: 'Your item has been listed',
      });

      navigate(`/marketplace/${data.id}`);
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      
      let errorMessage = 'Failed to create listing';
      if (error.message?.includes('foreign key')) {
        errorMessage = 'Invalid category. Please refresh.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              List Your Item
            </h1>
          </div>
          <p className="text-gray-600">
            Fill in the details to list your item
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Study Desk with Chair"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100
                </p>
              </div>

              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item - condition, features, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/2000 (min 20)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                    required
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="condition">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleInputChange('condition', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    Price (TZS) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., UDSM, Dar es Salaam"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>
                  Upload Images <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Add up to 5 images (max 5MB each)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Upload</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || uploadingImages}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
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
