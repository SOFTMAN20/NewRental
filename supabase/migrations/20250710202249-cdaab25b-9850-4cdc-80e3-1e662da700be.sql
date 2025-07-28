
-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Create policy to allow landlords to upload images
CREATE POLICY "Landlords can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow anyone to view property images (public access)
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Create policy to allow landlords to update their own images
CREATE POLICY "Landlords can update their own property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow landlords to delete their own images
CREATE POLICY "Landlords can delete their own property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
