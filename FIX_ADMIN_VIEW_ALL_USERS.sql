-- ============================================================================
-- FIX: Admin Can View All Users
-- ============================================================================
-- Tatizo: Admins hawezi kuona watumiaji wote kwenye dashboard
-- Problem: Admins cannot see all users in the dashboard
-- ============================================================================

-- Step 1: Check current RLS policies on profiles table
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 2: Drop conflicting policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;

-- Step 3: Create new comprehensive policies
-- ============================================================================

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Policy 2: Admins can read ALL profiles (this is the important one!)
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Policy 3: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Admins can update ALL profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE TO authenticated
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

-- Step 4: Enable RLS (if not already enabled)
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Grant necessary permissions
-- ============================================================================
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;

-- Step 6: Verify your admin status
-- ============================================================================
-- ⚠️ REPLACE 'your@email.com' with YOUR actual email!

-- Check if you are admin:
SELECT 
  id,
  email,
  full_name,
  user_type,
  role,
  verification_status
FROM profiles
WHERE email = 'your@email.com';  -- CHANGE THIS!

-- If role is NULL or not 'admin', run this (after changing the email):
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';

-- Step 7: Test query (same query as AdminUsers component)
-- ============================================================================
-- This should return ALL users if you're an admin:

SELECT 
  id,
  email,
  full_name,
  phone,
  role,
  verification_status,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Step 8: Count total users
-- ============================================================================
SELECT COUNT(*) as total_users FROM profiles;

-- Step 9: Show role distribution
-- ============================================================================
SELECT 
  COALESCE(role, 'no_role') as role,
  COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- ============================================================================
-- VERIFICATION CHECKLIST
-- ============================================================================
-- 
-- After running this script:
-- 
-- ✅ Step 1: Verify you see your email in Step 6 output
-- ✅ Step 2: Verify your role is 'admin' or 'super_admin'
-- ✅ Step 3: Step 7 should show ALL users in database
-- ✅ Step 4: Sign out and sign in to your website
-- ✅ Step 5: Go to /admin -> Watumiaji (Users) tab
-- ✅ Step 6: You should now see ALL users
-- 
-- If you still don't see users:
-- 1. Open browser console (F12)
-- 2. Check for any error messages
-- 3. Look for "Error fetching users:" message
-- 4. Copy the error and tell me
-- 
-- ============================================================================

-- ============================================================================
-- QUICK FIX: If policies still not working, use service_role bypass
-- ============================================================================
-- This creates a database function that admins can call to get all users
-- This bypasses RLS completely (secure because only admins can call it)

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
SECURITY DEFINER  -- This runs with elevated permissions
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

  -- Return all users
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

-- Test the function
SELECT * FROM get_all_users_for_admin();

-- ============================================================================
-- If the function works, you can use it in your React component!
-- Just replace the query in AdminUsers.tsx with:
-- const { data: profiles, error } = await supabase.rpc('get_all_users_for_admin')
-- ============================================================================
