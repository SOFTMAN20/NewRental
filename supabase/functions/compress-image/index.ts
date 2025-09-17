/**
 * COMPRESS-IMAGE EDGE FUNCTION
 * ============================
 * 
 * Supabase Edge Function for server-side image compression using Sharp
 * 
 * Features:
 * - Accept multipart/form-data uploads
 * - Server-side compression with Sharp
 * - Resize to max 800px width
 * - Convert to JPEG/WebP with 70% quality
 * - Upload to Supabase Storage
 * - Return public URL
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Sharp from "npm:sharp@0.33.1";

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CompressImageResponse {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    format: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🖼️ Image compression request received');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse multipart form data
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    if (!imageFile) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`📁 Processing image: ${imageFile.name}, Size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);

    // Convert File to ArrayBuffer
    const imageBuffer = await imageFile.arrayBuffer();
    const originalSize = imageBuffer.byteLength;

    // Server-side compression with Sharp
    console.log('⚙️ Starting server-side compression with Sharp...');
    
    const sharpInstance = Sharp(imageBuffer);
    const metadata = await sharpInstance.metadata();
    
    console.log(`📐 Original dimensions: ${metadata.width}x${metadata.height}`);
    
    // Determine output format (prefer WebP for better compression, fallback to JPEG)
    const outputFormat = 'jpeg'; // You can change this to 'webp' if needed
    
    // Compress and resize image
    const compressedBuffer = await sharpInstance
      .resize(800, null, { 
        withoutEnlargement: true, // Don't upscale smaller images
        fit: 'inside' // Maintain aspect ratio
      })
      .jpeg({ 
        quality: 70,
        progressive: true,
        mozjpeg: true // Use mozjpeg encoder for better compression
      })
      .toBuffer();

    const compressedSize = compressedBuffer.byteLength;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    console.log(`📊 Compression results:`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Compression ratio: ${compressionRatio.toFixed(1)}%`);

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = outputFormat === 'webp' ? 'webp' : 'jpg';
    const fileName = `${userId}/${timestamp}-${randomId}.${fileExtension}`;

    console.log(`⬆️ Uploading to Supabase Storage: ${fileName}`);

    // Upload compressed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, compressedBuffer, {
        contentType: `image/${outputFormat}`,
        cacheControl: '3600', // Cache for 1 hour
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    console.log(`✅ Upload successful: ${publicUrl}`);

    // Get final dimensions after compression
    const finalMetadata = await Sharp(compressedBuffer).metadata();

    const response: CompressImageResponse = {
      success: true,
      url: publicUrl,
      metadata: {
        originalSize,
        compressedSize,
        compressionRatio: Math.round(compressionRatio * 10) / 10,
        format: outputFormat,
        dimensions: {
          width: finalMetadata.width || 0,
          height: finalMetadata.height || 0
        }
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error in compress-image function:', error);
    
    const response: CompressImageResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
