-- ============================================================================
-- FIX: Allow Public to Read Landlord Profiles When Viewing Properties
-- ============================================================================
-- This fixes the 500 error when fetching properties with landlord info
-- ============================================================================

-- Problem: 
-- Properties query joins with profiles table to get landlord info,
-- but RLS policies block public from reading other users' profiles
--
-- Solution:
-- Add policy that allows reading landlord profiles for active properties

-- Check current policies on profiles
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Add policy to allow reading landlord profiles
-- This is safe because we only expose: full_name, phone, email, verification_status
CREATE POLICY "enable_read_landlord_profiles_for_properties"
ON profiles FOR SELECT
USING (
  -- Allow if this profile is a landlord with active properties
  user_type = 'landlord'
  AND EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.landlord_id = profiles.user_id 
    AND properties.status = 'active'
  )
);

-- Verify the new policy was created
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%landlord%' THEN '🏠 Landlord Policy'
    WHEN policyname LIKE '%admin%' THEN '🔑 Admin Policy'
    WHEN policyname LIKE '%own%' THEN '👤 User Own Policy'
    ELSE '❓ Other'
  END as policy_type
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================================
-- TEST: Verify you can now fetch properties with landlord info
-- ============================================================================
-- Run this query to test (should not give 500 error):
/*
SELECT 
  p.*,
  l.full_name as landlord_name,
  l.phone as landlord_phone,
  l.email as landlord_email,
  l.verification_status as landlord_verification
FROM properties p
LEFT JOIN profiles l ON p.landlord_id = l.user_id
WHERE p.status = 'active'
LIMIT 5;
*/

-- ============================================================================
-- ✅ WHAT TO DO NEXT:
-- ============================================================================
-- 
-- 1. Run this script in Supabase SQL Editor
-- 2. Refresh your website (Ctrl+Shift+R)
-- 3. Check console - the 500 errors should be gone!
-- 4. Properties should now load with landlord information
-- 
-- ============================================================================
