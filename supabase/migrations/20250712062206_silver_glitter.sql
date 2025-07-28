/*
  # Ensure Contact Fields Exist in Properties Table

  1. Purpose
    - Ensure contact_phone and contact_whatsapp_phone columns exist in properties table
    - Fix landlord property creation issues
    - Safe migration that won't break if columns already exist
    
  2. New Columns (if they don't exist)
    - `contact_phone` (text, nullable) - Primary contact phone number
    - `contact_whatsapp_phone` (text, nullable) - WhatsApp contact number
    
  3. Benefits
    - Allows landlords to add properties with contact information
    - Enables direct contact between tenants and landlords
    - Solves RLS issues with profile phone access
*/

-- Check and add contact_phone column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'properties'
    AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN contact_phone TEXT;
    COMMENT ON COLUMN public.properties.contact_phone IS 'Primary contact phone number for property inquiries';
  END IF;
END $$;

-- Check and add contact_whatsapp_phone column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'properties'
    AND column_name = 'contact_whatsapp_phone'
  ) THEN
    ALTER TABLE public.properties ADD COLUMN contact_whatsapp_phone TEXT;
    COMMENT ON COLUMN public.properties.contact_whatsapp_phone IS 'WhatsApp contact number for property inquiries';
  END IF;
END $$;