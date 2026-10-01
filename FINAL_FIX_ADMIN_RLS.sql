-- ============================================================================
-- FINAL FIX: Admin Can See All Users - Simplified RLS
-- ============================================================================
-- Copy paste YOTE hii kwenye Supabase SQL Editor na run
-- ============================================================================

-- Step 1: Check current policies (for debugging)
-- ============================================================================
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 2: DROP ALL existing policies on profiles table
-- ============================================================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 3: Create NEW simplified policies
-- ============================================================================

-- Policy 1: Everyone can read their own profile
CREATE POLICY "enable_read_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Admins can read ALL profiles (THIS IS THE KEY!)
CREATE POLICY "enable_read_all_for_admin"
ON profiles FOR SELECT
TO authenticated
USING (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'super_admin')
);

-- Policy 3: Everyone can update their own profile
CREATE POLICY "enable_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Admins can update ALL profiles
CREATE POLICY "enable_update_all_for_admin"
ON profiles FOR UPDATE
TO authenticated
USING (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'super_admin')
)
WITH CHECK (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'super_admin')
);

-- Policy 5: Admins can insert profiles
CREATE POLICY "enable_insert_for_admin"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'super_admin')
);

-- Policy 6: Admins can delete profiles
CREATE POLICY "enable_delete_for_admin"
ON profiles FOR DELETE
TO authenticated
USING (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'super_admin')
);

-- Step 4: Verify new policies
-- ============================================================================
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%admin%' THEN '🔑 Admin Policy'
    WHEN policyname LIKE '%own%' THEN '👤 User Own Policy'
    ELSE '❓ Other'
  END as policy_type
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 5: Create the bypass function (for extra safety)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_all_users_for_admin()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  phone text,
  role text,
  verification_status text,
  user_type text,
  created_at timestamptz
)
SECURITY DEFINER  -- Runs with elevated permissions
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Only admins can call this function';
  END IF;

  -- Return all users (bypasses RLS because of SECURITY DEFINER)
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.phone,
    p.role,
    p.verification_status,
    p.user_type,
    p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_all_users_for_admin() TO authenticated;

-- Step 6: Verify your admin status
-- ============================================================================
SELECT 
  email,
  full_name,
  role,
  CASE 
    WHEN role IN ('admin', 'super_admin') THEN '✅ Is Admin'
    ELSE '❌ Not Admin'
  END as admin_status
FROM profiles
WHERE email IN ('alexmray2002@gmail.com', 'wanachuo2026@gmail.com')
ORDER BY created_at;

-- Step 7: Count total users
-- ============================================================================
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as total_admins,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
  COUNT(CASE WHEN role = 'landlord' THEN 1 END) as total_landlords
FROM profiles;

-- ============================================================================
-- ✅ WHAT TO DO NEXT:
-- ============================================================================
-- 
-- 1. Run this ENTIRE script in Supabase SQL Editor
-- 2. Verify output shows your email as "✅ Is Admin"
-- 3. Sign OUT and sign IN again to your website
-- 4. Go to /admin -> Watumiaji (Users)
-- 5. You should now see ALL 24 users!
-- 
-- If you still see only 1 user:
-- - Open browser console (F12)
-- - Look for the log messages
-- - Copy any errors and tell me
-- 
-- The component will try:
-- 1. First: Use get_all_users_for_admin() function (bypasses RLS)
-- 2. Fallback: Direct query with new policies
-- 
-- Both should work now!
-- ============================================================================
