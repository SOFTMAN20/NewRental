-- ============================================================================
-- CHECK ALL USERS IN DATABASE
-- ============================================================================
-- Query hii inaonyesha watumiaji WOTE waliopo kwenye database
-- This query shows ALL users that exist in the database
-- ============================================================================

-- Query 1: Show ALL users with basic info
-- ============================================================================
SELECT 
  id,
  email,
  full_name,
  phone,
  role,
  user_type,
  verification_status,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC;

-- Query 2: Count total users
-- ============================================================================
SELECT COUNT(*) as total_users FROM profiles;

-- Query 3: Count users by role
-- ============================================================================
SELECT 
  COALESCE(role, 'no_role') as role,
  COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- Query 4: Count users by user_type
-- ============================================================================
SELECT 
  COALESCE(user_type, 'no_type') as user_type,
  COUNT(*) as count
FROM profiles
GROUP BY user_type
ORDER BY count DESC;

-- Query 5: Show users created in last 7 days
-- ============================================================================
SELECT 
  email,
  full_name,
  user_type,
  role,
  created_at
FROM profiles
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Query 6: Show users with missing data
-- ============================================================================
SELECT 
  email,
  full_name,
  phone,
  CASE 
    WHEN full_name IS NULL THEN 'Missing name'
    WHEN phone IS NULL THEN 'Missing phone'
    WHEN role IS NULL THEN 'Missing role'
    ELSE 'Complete'
  END as status
FROM profiles
WHERE full_name IS NULL 
   OR phone IS NULL 
   OR role IS NULL;

-- Query 7: Show admin users
-- ============================================================================
SELECT 
  email,
  full_name,
  role,
  created_at
FROM profiles
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at DESC;

-- Query 8: Check auth.users table (actual authentication records)
-- ============================================================================
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Query 9: Compare auth.users vs profiles (find missing profiles)
-- ============================================================================
SELECT 
  u.id,
  u.email,
  u.created_at as auth_created,
  p.id as profile_id,
  CASE 
    WHEN p.id IS NULL THEN '❌ Profile Missing'
    ELSE '✅ Profile Exists'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Query 10: Show full user details with property count
-- ============================================================================
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.phone,
  p.role,
  p.user_type,
  p.verification_status,
  COUNT(prop.id) as properties_count,
  p.created_at
FROM profiles p
LEFT JOIN properties prop ON p.id = prop.landlord_id
GROUP BY p.id, p.email, p.full_name, p.phone, p.role, p.user_type, p.verification_status, p.created_at
ORDER BY p.created_at DESC;

-- ============================================================================
-- EXPECTED OUTPUT
-- ============================================================================
-- 
-- Ukiwa na watumiaji wengi, query ya kwanza inapaswa kuonyesha:
-- If you have many users, the first query should show:
-- 
-- alex, landlord1@test.com, student1@test.com, etc.
-- 
-- Ikiwa inaonyesha user 1 tu (wewe), basi:
-- If it shows only 1 user (you), then:
-- 
-- 1. Either hamna watumiaji wengine kwenye database
--    (No other users exist in database)
-- 
-- 2. OR profiles table imevunjika na haiko na data
--    (OR profiles table is broken and has no data)
-- 
-- Check Query 8 (auth.users) - hiyo inaonyesha watu wote ambao wameregister
-- That shows everyone who registered
-- 
-- ============================================================================
