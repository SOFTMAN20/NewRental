-- ============================================================================
-- FIX: Platform Settings Table - Make AdminSettings Work
-- ============================================================================
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Check if table exists
-- ============================================================================
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'platform_settings'
) as table_exists;

-- Step 2: Create table if it doesn't exist
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Insert default settings (with UPSERT - won't duplicate)
-- ============================================================================
INSERT INTO platform_settings (key, value, description)
VALUES
  ('platform_name', 'Nyumba Link', 'Name of the platform'),
  ('support_email', 'info@nyumbalink.co.tz', 'Support email address'),
  ('support_phone', '+255750929317', 'Support phone number'),
  ('company_whatsapp', '+255792072561', 'Company WhatsApp number'),
  ('use_company_contact', 'false', 'Use company contact instead of landlord contact'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('registration_open', 'true', 'Allow new user registration'),
  ('property_approval_required', 'false', 'Require admin approval for properties'),
  ('email_notifications', 'true', 'Enable email notifications'),
  ('welcome_email', 'true', 'Send welcome email to new users'),
  ('inquiry_email', 'true', 'Send inquiry notifications to landlords')
ON CONFLICT (key) DO NOTHING;  -- Don't overwrite existing settings

-- Step 4: Create indexes for better performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(key);

-- Step 5: Create RLS policies
-- ============================================================================
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read platform settings" ON platform_settings;
DROP POLICY IF EXISTS "Admins can update platform settings" ON platform_settings;

-- Anyone can read settings (needed for public features)
CREATE POLICY "Anyone can read platform settings"
ON platform_settings FOR SELECT
TO authenticated
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update platform settings"
ON platform_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Only admins can insert settings
CREATE POLICY "Admins can insert platform settings"
ON platform_settings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Step 6: Create updated_at trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_platform_settings_updated_at ON platform_settings;

CREATE TRIGGER update_platform_settings_updated_at
    BEFORE UPDATE ON platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Verify settings
-- ============================================================================
SELECT 
  key,
  value,
  description,
  created_at
FROM platform_settings
ORDER BY key;

-- Step 8: Count settings
-- ============================================================================
SELECT COUNT(*) as total_settings FROM platform_settings;

-- ============================================================================
-- ✅ VERIFICATION
-- ============================================================================
-- 
-- You should see 11 settings:
-- 1. platform_name
-- 2. support_email
-- 3. support_phone
-- 4. company_whatsapp
-- 5. use_company_contact
-- 6. maintenance_mode
-- 7. registration_open
-- 8. property_approval_required
-- 9. email_notifications
-- 10. welcome_email
-- 11. inquiry_email
-- 
-- If count is 11, everything is working! ✅
-- 
-- Now go to /admin -> Settings and test:
-- 1. Change any setting
-- 2. Click "Save Changes"
-- 3. Refresh page
-- 4. Settings should be saved!
-- 
-- ============================================================================
