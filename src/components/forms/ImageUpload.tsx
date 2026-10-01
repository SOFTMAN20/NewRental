
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/integrations/supabase/client';
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
  maxImages = 8 
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
   * Smart compression that converts to WebP format for optimal size and quality
   * WebP provides 25-35% better compression than JPEG/PNG while maintaining quality
   * - Small files (< 500KB): Minimal compression, maintain quality
   * - Medium files (500KB - 2MB): Moderate compression
   * - Large files (> 2MB): Aggressive compression
   * Target: Optimal size without losing visible quality
   */
  const clientSideCompress = async (file: File): Promise<File> => {
    try {
      const fileSizeMB = file.size / 1024 / 1024;
      
      // Determine compression strategy based on file size
      let compressionOptions;
      
      if (fileSizeMB < 0.5) {
        // Small files: Light compression, preserve quality
        compressionOptions = {
          maxSizeMB: 0.3, // Target 300KB (WebP is more efficient)
          maxWidthOrHeight: 2048, // Keep high resolution
          useWebWorker: true,
          fileType: 'image/webp', // Convert to WebP
          initialQuality: 0.95, // Very high quality (95%)
          alwaysKeepResolution: false,
        };
      } else if (fileSizeMB < 2) {
        // Medium files: Moderate compression
        compressionOptions = {
          maxSizeMB: 0.6, // Target 600KB (WebP is smaller)
          maxWidthOrHeight: 1920, // Good quality resolution
          useWebWorker: true,
          fileType: 'image/webp', // Convert to WebP
          initialQuality: 0.92, // High quality (92%)
          alwaysKeepResolution: false,
        };
      } else {
        // Large files: Aggressive but quality-preserving compression
        compressionOptions = {
          maxSizeMB: 1.0, // Target 1MB (WebP compression is superior)
          maxWidthOrHeight: 1920, // Standard HD resolution
          useWebWorker: true,
          fileType: 'image/webp', // Convert to WebP
          initialQuality: 0.90, // Excellent quality (90%)
          alwaysKeepResolution: false,
        };
      }

      let compressedFile = await imageCompression(file, compressionOptions);
      
      // If still larger than desired, apply one more pass with slightly lower quality
      const targetMaxMB = 1.5; // Absolute maximum: 1.5MB
      if (compressedFile.size > targetMaxMB * 1024 * 1024) {
        console.log('⚠️ Applying final WebP optimization pass...');
        const finalOptions = {
          maxSizeMB: 1.2, // Strict target
          maxWidthOrHeight: 1800,
          useWebWorker: true,
          fileType: 'image/webp', // Keep as WebP
          initialQuality: 0.88, // Still high quality (88%)
        };
        compressedFile = await imageCompression(compressedFile, finalOptions);
      }
      
      // Log compression results
      const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2);
      const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
      
      console.log('🖼️ Smart WebP Compression Results:');
      console.log(`📁 File: ${file.name}`);
      console.log(`📏 Original: ${originalSizeMB} MB (${file.type})`);
      console.log(`📏 Compressed: ${compressedSizeMB} MB (${compressedSizeKB} KB) - WebP`);
      console.log(`📊 Saved: ${compressionRatio}% smaller`);
      console.log(`✨ Quality: High (maintained)`);
      console.log(`🚀 Format: WebP (modern, efficient)`);
      console.log('---');
      
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      // If compression fails, return original file
      console.warn('Using original file due to compression error');
      return file;
    }
  };

  /**
   * DIRECT STORAGE UPLOAD (Simplified)
   * ==================================
   * 
   * Direct upload to Supabase Storage - simple and reliable
   */
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // First, try to compress the image
      let fileToUpload = file;
      try {
        fileToUpload = await clientSideCompress(file);
      } catch (compressError) {
        console.warn('Compression failed, using original:', compressError);
        fileToUpload = file;
      }

      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = fileToUpload.name.split('.').pop() || 'jpg';
      const fileName = `${user!.id}/${timestamp}-${randomId}.${fileExtension}`;

      console.log('Uploading to:', fileName);

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  /**
   * VALIDATE IMAGE FILE
   * ==================
   * 
   * Validates file type before compression
   * No strict size limit - compression will handle large files
   */
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type with enhanced validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, and WebP images are allowed'
      };
    }

    // Validate file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: 'Invalid file extension'
      };
    }

    // Check reasonable max size (20MB before compression)
    // This prevents extremely large files that would take too long to compress
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image is too large. Please use an image smaller than 20MB.'
      };
    }

    // Check minimum file size (prevent empty files)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      return {
        isValid: false,
        error: 'File is too small or corrupted'
      };
    }

    // Validate filename (prevent path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        isValid: false,
        error: 'Invalid filename'
      };
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.php$/i,
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.js$/i,
      /\.html$/i,
      /\.htm$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      return {
        isValid: false,
        error: 'File type not allowed for security reasons'
      };
    }

    return { isValid: true };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    console.log('Files selected:', files.length);
    
    if (!user) {
      console.error('No user found');
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Please sign in to upload images'
      });
      return;
    }

    console.log('User ID:', user.id);

    // Check if would exceed max
    if (images.length + files.length > maxImages) {
      const remaining = maxImages - images.length;
      console.log(`Too many images. Have ${images.length}, trying to add ${files.length}, max is ${maxImages}`);
      setCompressionStatus(`❌ Maximum ${maxImages} images allowed (${remaining} remaining)`);
      toast({
        variant: "destructive",
        title: 'Too many images',
        description: `You can only upload ${maxImages} images total. You have ${images.length} already, so you can add ${remaining} more.`
      });
      setTimeout(() => setCompressionStatus(''), 3000);
      event.target.value = '';
      return;
    }

    setUploading(true);
    setCompressionStatus('Starting upload...');
    const newImageUrls: string[] = [];

    try {
      console.log('Starting upload process...');
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Please sign in again');
      }
      console.log('Session verified');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}:`, file.name, file.size, file.type);
        
        // Basic validation
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          toast({
            variant: "destructive",
            title: 'Invalid file',
            description: `${file.name} is not an image file`
          });
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          console.error('File too large:', file.size);
          toast({
            variant: "destructive",
            title: 'File too large',
            description: `${file.name} is larger than 20MB`
          });
          continue;
        }
        
        try {
          setCompressionStatus(`📤 Uploading ${i + 1}/${files.length}: ${file.name}...`);
          
          const publicUrl = await uploadImage(file);
          console.log('Upload successful:', publicUrl);
          
          newImageUrls.push(publicUrl);
          setCompressionStatus(`✅ Uploaded ${i + 1}/${files.length}`);
        } catch (imageError) {
          console.error(`Failed to upload ${file.name}:`, imageError);
          toast({
            variant: "destructive",
            title: 'Upload failed',
            description: `Failed to upload ${file.name}: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`
          });
        }
      }

      if (newImageUrls.length === 0) {
        throw new Error('No images were uploaded successfully');
      }

      console.log('All uploads complete. URLs:', newImageUrls);

      // Update state
      onImagesChange([...images, ...newImageUrls]);
      
      setCompressionStatus(`🎉 Successfully uploaded ${newImageUrls.length} image(s)!`);
      toast({
        title: 'Success',
        description: `${newImageUrls.length} image(s) uploaded successfully`
      });

      setTimeout(() => setCompressionStatus(''), 4000);
      
    } catch (error) {
      console.error('Upload process error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload images";
      setCompressionStatus(`❌ ${errorMessage}`);
      toast({
        variant: "destructive",
        title: 'Upload failed',
        description: errorMessage
      });
      setTimeout(() => setCompressionStatus(''), 5000);
    } finally {
      setUploading(false);
      event.target.value = '';
      console.log('Upload process finished');
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>{t('dashboard.propertyImages', { current: images.length, max: maxImages })}</Label>
      
      {/* Upload Area - Large Clickable Zone */}
      <div className="space-y-3">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        
        {/* Large Clickable Upload Area */}
        <Label 
          htmlFor="image-upload" 
          className={`cursor-pointer flex flex-col items-center justify-center gap-3 px-6 py-8 sm:py-12 border-2 border-dashed rounded-xl transition-all duration-200 ${
            uploading || images.length >= maxImages 
              ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300' 
              : 'border-primary/30 hover:border-primary hover:bg-primary/5 bg-primary/[0.02]'
          }`}
        >
          <div className={`p-4 rounded-full ${
            uploading || images.length >= maxImages 
              ? 'bg-gray-200' 
              : 'bg-primary/10'
          }`}>
            {uploading ? (
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
            ) : (
              <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            )}
          </div>
          
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1">
              {uploading ? 'Processing images...' : 'Click to upload property photos'}
            </p>
            <p className="text-sm text-gray-500">
              {uploading 
                ? 'Please wait while we process your images' 
                : 'JPG, PNG or WebP (Max 20MB per image, up to 8 photos)'
              }
            </p>
            {images.length < maxImages && !uploading && (
              <p className="text-xs sm:text-sm text-primary font-medium mt-2">
                {maxImages - images.length} {maxImages - images.length === 1 ? 'photo' : 'photos'} remaining
              </p>
            )}
          </div>
        </Label>

        {/* Compression Status Display */}
        {compressionStatus && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            compressionStatus.includes('✅') || compressionStatus.includes('🎉')
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : compressionStatus.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {compressionStatus}
          </div>
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
