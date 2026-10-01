-- ============================================================================
-- PLATFORM SETTINGS TABLE - For Admin Dashboard Configuration
-- ============================================================================
-- This migration creates a settings table to store platform-wide configurations
-- ============================================================================

-- Step 1: Create platform_settings table
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Insert default settings
-- ============================================================================
INSERT INTO platform_settings (key, value, description) VALUES
  ('platform_name', 'Nyumba Link', 'Platform name displayed across the site'),
  ('support_email', 'info@nyumbalink.co.tz', 'Support email for contact'),
  ('support_phone', '+255 750 929 317', 'Support phone number'),
  ('company_whatsapp', '+255792072561', 'Company WhatsApp number for inquiries'),
  ('use_company_contact', 'false', 'Use company contact instead of landlord contact'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('registration_open', 'true', 'Allow new user registration'),
  ('property_approval_required', 'false', 'Require admin approval for new properties'),
  ('email_notifications', 'true', 'Enable email notifications'),
  ('welcome_email', 'true', 'Send welcome email to new users'),
  ('inquiry_email', 'true', 'Send inquiry notifications to landlords')
ON CONFLICT (key) DO NOTHING;

-- Step 3: Create function to update timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for auto-updating timestamp
-- ============================================================================
DROP TRIGGER IF EXISTS platform_settings_updated_at ON platform_settings;
CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Step 5: Add RLS policies
-- ============================================================================
-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read platform settings" ON platform_settings
FOR SELECT
TO public
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update platform settings" ON platform_settings
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Only admins can insert settings
CREATE POLICY "Admins can insert platform settings" ON platform_settings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Step 6: Create helper function to get setting value
-- ============================================================================
CREATE OR REPLACE FUNCTION get_setting(setting_key TEXT)
RETURNS TEXT AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT value INTO setting_value
  FROM platform_settings
  WHERE key = setting_key;
  
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create index for faster lookups
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(key);

-- Step 8: Verification query
-- ============================================================================
-- Run this to verify the setup
SELECT key, value, description 
FROM platform_settings 
ORDER BY key;

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- The platform_settings table is ready to use.
-- The admin dashboard can now save and retrieve settings from the database.
-- ============================================================================
