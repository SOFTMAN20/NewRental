
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    if (images.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('dashboard.canAddMore', { remaining: maxImages })
      });
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            variant: "destructive",
            title: t('common.error'),
            description: "Please select images only"
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: t('common.error'),
            description: "Image size should not exceed 5MB"
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
      }

      onImagesChange([...images, ...newImageUrls]);
      
      toast({
        title: t('common.success'),
        description: "Images uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: "Failed to upload images"
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>{t('dashboard.propertyImages', { current: images.length, max: maxImages })}</Label>
      
      {/* Upload button */}
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        <Label 
          htmlFor="image-upload" 
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 ${
            uploading || images.length >= maxImages 
              ? 'opacity-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          <Upload className="h-4 w-4" />
          {uploading ? t('dashboard.uploading') : t('dashboard.selectImages')}
        </Label>
        {images.length < maxImages && (
          <span className="text-sm text-gray-600">
            {t('dashboard.canAddMore', { remaining: maxImages - images.length })}
          </span>
        )}
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Picha ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>{t('dashboard.noImagesSelected')}</p>
          <p className="text-sm">{t('dashboard.selectPropertyImages')}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
