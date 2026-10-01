-- ============================================================================
-- SYNC user_type TO role - Fix Landlord Display Issue
-- ============================================================================
-- Tatizo: Watu wana user_type='landlord' lakini role='student'
-- Problem: Users have user_type='landlord' but role='student'
-- 
-- Solution: Copy user_type to role for all users
-- ============================================================================

-- Step 1: Show current mismatch
-- ============================================================================
SELECT 
  email,
  user_type,
  role,
  CASE 
    WHEN user_type = 'landlord' AND role != 'landlord' THEN '⚠️ Mismatch: Should be landlord'
    WHEN user_type IN ('tenant', 'professional') AND role != 'student' THEN '⚠️ Mismatch: Should be student'
    WHEN role IN ('admin', 'super_admin') THEN '✅ Admin - Keep as is'
    ELSE '✅ Correct'
  END as status
FROM profiles
WHERE role NOT IN ('admin', 'super_admin')  -- Don't change admins
ORDER BY created_at DESC
LIMIT 20;

-- Step 2: Count mismatches
-- ============================================================================
SELECT 
  COUNT(*) as total_mismatches
FROM profiles
WHERE role NOT IN ('admin', 'super_admin')
  AND (
    (user_type = 'landlord' AND role != 'landlord')
    OR (user_type IN ('tenant', 'professional', 'student') AND role != 'student')
  );

-- Step 3: FIX - Sync user_type to role (keep admins as admins)
-- ============================================================================
UPDATE profiles 
SET role = CASE 
    -- Keep admins as admins
    WHEN role IN ('admin', 'super_admin') THEN role
    
    -- Landlords should have role='landlord'
    WHEN user_type = 'landlord' THEN 'landlord'
    
    -- Tenants, students, professionals should have role='student'
    WHEN user_type IN ('tenant', 'student', 'professional') THEN 'student'
    
    -- Default fallback
    ELSE 'student'
END
WHERE role NOT IN ('admin', 'super_admin');  -- Only update non-admins

-- Step 4: Verify the fix
-- ============================================================================
SELECT 
  user_type,
  role,
  COUNT(*) as count
FROM profiles
GROUP BY user_type, role
ORDER BY user_type, role;

-- Step 5: Show sample of fixed users
-- ============================================================================
SELECT 
  email,
  full_name,
  user_type,
  role,
  '✅ Fixed!' as status
FROM profiles
WHERE user_type = 'landlord'
ORDER BY created_at DESC
LIMIT 10;

-- Step 6: Summary
-- ============================================================================
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM profiles

UNION ALL

SELECT 
  'Admins',
  COUNT(*) 
FROM profiles 
WHERE role IN ('admin', 'super_admin')

UNION ALL

SELECT 
  'Landlords (role)',
  COUNT(*) 
FROM profiles 
WHERE role = 'landlord'

UNION ALL

SELECT 
  'Students (role)',
  COUNT(*) 
FROM profiles 
WHERE role = 'student'

UNION ALL

SELECT 
  'Landlords (user_type)',
  COUNT(*) 
FROM profiles 
WHERE user_type = 'landlord'

UNION ALL

SELECT 
  'Tenants (user_type)',
  COUNT(*) 
FROM profiles 
WHERE user_type IN ('tenant', 'student', 'professional');

-- ============================================================================
-- ✅ DONE!
-- ============================================================================
-- 
-- After running this:
-- 1. All landlords (user_type='landlord') will have role='landlord'
-- 2. All students/tenants will have role='student'
-- 3. Admins stay as admins
-- 
-- Now when you filter by "Landlords" in admin dashboard, you'll see them!
-- ============================================================================
