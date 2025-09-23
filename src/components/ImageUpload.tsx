
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import imageCompression from 'browser-image-compression';

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
  const [compressionStatus, setCompressionStatus] = useState<string>('');

  /**
   * CLIENT-SIDE COMPRESSION (First Stage)
   * =====================================
   * 
   * Performs initial compression on the client to reduce upload size.
   * Target: 2MB max size, 1200px max dimensions
   */
  const clientSideCompress = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2, // Target max size: 2MB (before server-side compression)
      maxWidthOrHeight: 1200, // Max width/height: 1200px
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      // Log client-side compression results
      console.log('🖼️ Client-Side Compression Results:');
      console.log(`📁 Original: ${file.name}`);
      console.log(`📏 Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📏 Client compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📊 Client compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
      console.log('---');
      
      return compressedFile;
    } catch (error) {
      console.error('Error in client-side compression:', error);
      throw error;
    }
  };

  /**
   * HYBRID UPLOAD SYSTEM
   * ====================
   * 
   * Sends client-compressed image to Edge Function for final server-side compression
   */
  const uploadToEdgeFunction = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', user!.id);

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/compress-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server compression failed: ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Server compression failed');
    }

    // Server-side compression completed successfully

    return result.url;
  };

  /**
   * VALIDATE IMAGE FILE
   * ==================
   * 
   * Validates file type and size before processing
   */
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, and WebP images are allowed'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size must be less than 5MB'
      };
    }

    return { isValid: true };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    if (images.length + files.length > maxImages) {
      setCompressionStatus('❌ Too many images selected');
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: t('dashboard.canAddMore', { remaining: maxImages })
      });
      return;
    }

    setUploading(true);
    setCompressionStatus('🔍 Validating images...');
    const newImageUrls: string[] = [];
    const validFiles: File[] = [];

    // Validate all files first
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
      const validation = validateImageFile(file);
        
      if (!validation.isValid) {
        setCompressionStatus(`❌ ${validation.error}`);
          toast({
            variant: "destructive",
            title: t('common.error'),
          description: validation.error
        });
        setUploading(false);
        event.target.value = '';
        return;
      }
      
      validFiles.push(file);
    }

    try {
      console.log('🚀 Starting hybrid image upload process...');
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Update status for client-side compression
        setCompressionStatus(`🔄 Client-side compressing image ${i + 1} of ${validFiles.length}...`);

        // Step 1: Client-side compression
        const clientCompressedFile = await clientSideCompress(file);

        // Update status for server-side processing
        setCompressionStatus(`⚙️ Server-side processing image ${i + 1} of ${validFiles.length}...`);

        // Step 2: Send to Edge Function for final compression and upload
        const publicUrl = await uploadToEdgeFunction(clientCompressedFile);

        newImageUrls.push(publicUrl);
        
        // Update status for successful individual upload
        setCompressionStatus(`✅ Processed ${i + 1} of ${validFiles.length} images...`);
      }

      // Update images state
      onImagesChange([...images, ...newImageUrls]);
      
      // Show final success message
      setCompressionStatus(`🎉 Successfully uploaded ${newImageUrls.length} image(s) with hybrid compression!`);
      toast({
        title: t('common.success'),
        description: `${newImageUrls.length} image(s) uploaded with optimal compression`
      });

      // Clear success message after 4 seconds
      setTimeout(() => setCompressionStatus(''), 4000);
      
    } catch (error) {
      console.error('❌ Error in hybrid upload process:', error);
      setCompressionStatus(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error instanceof Error ? error.message : "Failed to process images"
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
      <div className="space-y-3">
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
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg transition-all duration-200 ${
            uploading || images.length >= maxImages 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
        >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
          <Upload className="h-4 w-4" />
            )}
            {uploading ? 'Processing...' : t('dashboard.selectImages')}
        </Label>
          {images.length < maxImages && !uploading && (
          <span className="text-sm text-gray-600">
            {t('dashboard.canAddMore', { remaining: maxImages - images.length })}
          </span>
        )}
        </div>

        {/* Compression Status Display */}
        {compressionStatus && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            compressionStatus.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : compressionStatus.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {compressionStatus}
          </div>
        )}

        {/* Hybrid compression info */}
        <div className="text-xs text-gray-500 bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 mt-0.5">🔄</div>
            <div>
              <strong className="text-blue-800">Hybrid Compression System:</strong>
              <div className="mt-1 space-y-1">
                <div>• <strong>Client-side:</strong> Compress to 2MB, 1200px max</div>
                <div>• <strong>Server-side:</strong> Final compression to 800px, 70% quality</div>
                <div>• <strong>Formats:</strong> JPG, PNG, WebP (max 5MB input)</div>
              </div>
            </div>
          </div>
        </div>
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
