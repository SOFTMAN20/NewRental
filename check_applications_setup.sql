-- CHECK APPLICATIONS TABLE SETUP
-- ==============================
-- Run this in Supabase SQL Editor to debug

-- 1. Check if applications table exists
SELECT 
    table_name, 
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'applications';

-- 2. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applications'
ORDER BY ordinal_position;

-- 3. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'applications';

-- 4. Check existing policies
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
WHERE tablename = 'applications';

-- 5. Count total applications
SELECT COUNT(*) as total_applications FROM applications;

-- 6. Check applications by status
SELECT 
    status,
    COUNT(*) as count
FROM applications 
GROUP BY status;

-- 7. View sample applications with joined data
SELECT 
    a.id,
    a.status,
    a.move_in_date,
    a.created_at,
    p.title as property_title,
    p.location as property_location,
    pr.full_name as tenant_name,
    pr.email as tenant_email
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
ORDER BY a.created_at DESC
LIMIT 5;

-- 8. Check if current user can see applications (run as admin)
SELECT 
    a.*,
    p.title as property_title,
    pr.full_name as tenant_name
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
LIMIT 5;
