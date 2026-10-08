-- FIX APPLICATIONS TABLE ACCESS FOR ADMIN
-- ========================================
-- Run this in Supabase SQL Editor

-- Step 1: Enable RLS if not already enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "Tenants can view their own applications" ON applications;
DROP POLICY IF EXISTS "Tenants can create applications" ON applications;
DROP POLICY IF EXISTS "Property owners can view applications for their properties" ON applications;

-- Step 3: Create admin policies
-- Allow admins to SELECT all applications
CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Allow admins to UPDATE applications (for approve/reject)
CREATE POLICY "Admins can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Step 4: Create tenant policies
-- Allow tenants to view their own applications
CREATE POLICY "Tenants can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = tenant_id);

-- Allow tenants to create applications
CREATE POLICY "Tenants can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

-- Step 5: Create landlord policies
-- Allow property owners to view applications for their properties
CREATE POLICY "Property owners can view applications for their properties"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = applications.property_id
            AND properties.host_id = auth.uid()
        )
    );

-- Step 6: Verify your admin user has the correct role
-- Replace 'your-email@example.com' with your actual admin email
SELECT 
    id,
    email,
    full_name,
    role,
    user_type
FROM profiles
WHERE email = 'your-email@example.com';

-- If role is NULL, update it:
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-email@example.com';

-- Step 7: Test query as admin
-- This should return all applications
SELECT 
    a.id,
    a.status,
    a.move_in_date,
    p.title as property_title,
    pr.full_name as tenant_name
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
ORDER BY a.created_at DESC;

-- Step 8: If no applications exist, create sample data for testing
-- First, get a property_id and tenant_id:
-- SELECT id FROM properties LIMIT 1;
-- SELECT id FROM profiles WHERE user_type = 'tenant' LIMIT 1;

-- Then insert sample application (uncomment and fill in IDs):
/*
INSERT INTO applications (
    property_id,
    tenant_id,
    status,
    move_in_date,
    additional_info
) VALUES (
    'PROPERTY-ID-HERE'::uuid,
    'TENANT-ID-HERE'::uuid,
    'pending',
    CURRENT_DATE + INTERVAL '30 days',
    'I am interested in renting this property. Please consider my application.'
);
*/
