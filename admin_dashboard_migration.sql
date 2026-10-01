-- ============================================================================
-- ADMIN DASHBOARD DATABASE MIGRATION
-- ============================================================================
-- This migration adds the necessary columns and policies for the admin dashboard
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Add role column to profiles table
-- ============================================================================
-- This column determines user privileges (student, landlord, admin, super_admin)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' 
CHECK (role IN ('student', 'landlord', 'admin', 'super_admin'));

-- Step 2: Add verification_status column to profiles table
-- ============================================================================
-- This column tracks the verification status of users (unverified, pending, verified, rejected)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' 
CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));

-- Step 3: Update existing landlords to have landlord role
-- ============================================================================
-- Any user who has created properties should be marked as a landlord
UPDATE profiles 
SET role = 'landlord'
WHERE id IN (SELECT DISTINCT landlord_id FROM properties)
AND role = 'student'; -- Only update if they're still marked as student

-- Step 4: Create indexes for better query performance
-- ============================================================================
-- These indexes speed up role-based queries and verification lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);

-- Step 5: Set admin users (IMPORTANT: Change the email!)
-- ============================================================================
-- Replace 'admin@example.com' with your actual admin email address
-- You can run this multiple times for multiple admins

-- Example: Make a user an admin
-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'admin@example.com';

-- Example: Make a user a super admin (highest privilege)
-- UPDATE profiles 
-- SET role = 'super_admin'
-- WHERE email = 'superadmin@example.com';

-- UNCOMMENT AND MODIFY ONE OF THE ABOVE COMMANDS BEFORE RUNNING!

-- Step 6: Add Row Level Security (RLS) policies for admin access
-- ============================================================================

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Policy: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
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

-- Policy: Admins can read all properties
CREATE POLICY "Admins can read all properties" ON properties
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Policy: Admins can update all properties
CREATE POLICY "Admins can update all properties" ON properties
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

-- Policy: Admins can delete any property
CREATE POLICY "Admins can delete any property" ON properties
FOR DELETE 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Step 7: Verification query
-- ============================================================================
-- Run these queries to verify the migration was successful

-- Check if role column exists and see the distribution
SELECT role, COUNT(*) as count 
FROM profiles 
GROUP BY role;

-- Check if verification_status column exists
SELECT verification_status, COUNT(*) as count 
FROM profiles 
GROUP BY verification_status;

-- List all admin users
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE role IN ('admin', 'super_admin');

-- Check indexes were created
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename = 'profiles' 
AND indexname IN ('idx_profiles_role', 'idx_profiles_verification');

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Make sure you set at least one user as admin (see Step 5)
-- 2. Sign in with that admin account
-- 3. You should see "Admin Dashboard" in the user dropdown menu
-- 4. Navigate to /admin to access the admin dashboard
-- ============================================================================
