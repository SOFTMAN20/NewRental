-- ============================================================================
-- QUICK FIX: Admin Dashboard Setup
-- ============================================================================
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Check if role column exists
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        RAISE NOTICE '❌ role column does NOT exist - Adding it now...';
        
        -- Add role column
        ALTER TABLE profiles 
        ADD COLUMN role TEXT DEFAULT 'student' 
        CHECK (role IN ('student', 'landlord', 'admin', 'super_admin'));
        
        RAISE NOTICE '✅ role column added successfully!';
    ELSE
        RAISE NOTICE '✅ role column already exists';
    END IF;
END $$;

-- Step 2: Check if verification_status column exists
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'verification_status'
    ) THEN
        RAISE NOTICE '❌ verification_status column does NOT exist - Adding it now...';
        
        -- Add verification_status column
        ALTER TABLE profiles 
        ADD COLUMN verification_status TEXT DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));
        
        RAISE NOTICE '✅ verification_status column added successfully!';
    ELSE
        RAISE NOTICE '✅ verification_status column already exists';
    END IF;
END $$;

-- Step 3: Sync user_type to role for existing users
-- ============================================================================
UPDATE profiles 
SET role = CASE 
    WHEN user_type = 'landlord' THEN 'landlord'
    WHEN user_type IN ('student', 'tenant', 'professional') THEN 'student'
    ELSE 'student'
END
WHERE role IS NULL OR role = 'student';

-- Step 4: Create indexes for better performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);

-- Step 5: IMPORTANT - Make YOUR user an admin
-- ============================================================================
-- ⚠️ CHANGE THE EMAIL BELOW TO YOUR ACTUAL EMAIL ADDRESS! ⚠️
-- Uncomment ONE of the following lines and change the email:

-- For regular admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'youremail@example.com';

-- For super admin:
-- UPDATE profiles SET role = 'super_admin' WHERE email = 'youremail@example.com';

-- Example:
-- UPDATE profiles SET role = 'admin' WHERE email = 'alex@example.com';

-- Step 6: Add RLS policies for admin access (if they don't exist)
-- ============================================================================

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all properties" ON properties;
DROP POLICY IF EXISTS "Admins can update all properties" ON properties;
DROP POLICY IF EXISTS "Admins can delete any property" ON properties;

-- Create admin policies
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE TO authenticated
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

CREATE POLICY "Admins can read all properties" ON properties
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update all properties" ON properties
FOR UPDATE TO authenticated
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

CREATE POLICY "Admins can delete any property" ON properties
FOR DELETE TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- ============================================================================
-- VERIFICATION SECTION
-- ============================================================================

-- Check columns exist
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('role', 'verification_status', 'user_type')
ORDER BY column_name;

-- Check role distribution
SELECT 
  role,
  COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- Check if YOU are an admin (look for your email)
SELECT 
  email,
  full_name,
  user_type,
  role,
  verification_status,
  created_at
FROM profiles
WHERE role IN ('admin', 'super_admin')
   OR email ILIKE '%your%'  -- Change this to part of your email
ORDER BY created_at DESC
LIMIT 10;

-- List all users with their roles
SELECT 
  email,
  user_type,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
-- 
-- 1. ✅ Run this entire script in Supabase SQL Editor
-- 
-- 2. ⚠️ IMPORTANT: Uncomment Step 5 and change the email to YOURS
--    Example: UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- 
-- 3. ✅ Check the verification output at the bottom
-- 
-- 4. ✅ Sign out and sign in again to your website
-- 
-- 5. ✅ Navigate to /admin - you should now have access!
-- 
-- 6. ✅ Check browser console (F12) - you should see:
--    ✅ User found: your@email.com
--    ✅ Profile fetched: {role: 'admin', ...}
--    ✅ Admin access granted
-- 
-- ============================================================================
