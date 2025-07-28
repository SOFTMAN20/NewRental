/*
  # Add Contact Fields to Properties Table

  1. New Columns
    - `contact_phone` (text, nullable) - Primary contact phone number for the property
    - `contact_whatsapp_phone` (text, nullable) - WhatsApp contact number for the property
  
  2. Purpose
    - Allow landlords to specify contact numbers directly with each property
    - Solve RLS issues with accessing profile phone numbers
    - Enable public access to contact information for property inquiries
    
  3. Benefits
    - Direct contact information storage with properties
    - No RLS restrictions for public property viewing
    - Flexibility for landlords to use different numbers per property
*/

-- Add contact phone fields to properties table
ALTER TABLE public.properties 
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_whatsapp_phone TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.properties.contact_phone IS 'Primary contact phone number for property inquiries';
COMMENT ON COLUMN public.properties.contact_whatsapp_phone IS 'WhatsApp contact number for property inquiries';