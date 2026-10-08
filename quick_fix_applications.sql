-- QUICK FIX FOR APPLICATIONS - RUN THIS FIRST
-- ============================================

-- 1. Check if applications table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
) as table_exists;

-- 2. If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    move_in_date DATE NOT NULL,
    additional_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies (to avoid conflicts)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
    DROP POLICY IF EXISTS "Admins can update applications" ON applications;
    DROP POLICY IF EXISTS "Tenants can view their own applications" ON applications;
    DROP POLICY IF EXISTS "Tenants can create applications" ON applications;
    DROP POLICY IF EXISTS "Property owners can view applications for their properties" ON applications;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 5. Create admin policies
CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role IN ('admin', 'super_admin') OR profiles.user_type = 'admin')
        )
    );

CREATE POLICY "Admins can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role IN ('admin', 'super_admin') OR profiles.user_type = 'admin')
        )
    );

-- 6. Create tenant policies
CREATE POLICY "Tenants can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

-- 7. Create landlord policies
CREATE POLICY "Property owners can view applications for their properties"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = applications.property_id
            AND properties.host_id = auth.uid()
        )
    );

-- 8. Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_property_id ON applications(property_id);
CREATE INDEX IF NOT EXISTS idx_applications_tenant_id ON applications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- 9. Verify your admin role
-- REPLACE 'your-email@example.com' WITH YOUR ACTUAL EMAIL
SELECT 
    id,
    email,
    full_name,
    role,
    user_type,
    CASE 
        WHEN role IN ('admin', 'super_admin') OR user_type = 'admin' THEN '✅ HAS ADMIN ACCESS'
        ELSE '❌ NO ADMIN ACCESS - RUN UPDATE BELOW'
    END as admin_status
FROM profiles
WHERE email = 'your-email@example.com';

-- If admin_status shows ❌, uncomment and run this:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- 10. Test query (should return empty array if no applications)
SELECT 
    a.id,
    a.status,
    a.move_in_date,
    a.additional_info,
    a.created_at,
    p.title as property_title,
    pr.full_name as tenant_name,
    pr.email as tenant_email,
    pr.phone as tenant_phone
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
ORDER BY a.created_at DESC
LIMIT 10;

-- 11. Count applications
SELECT COUNT(*) as total_applications FROM applications;

-- SUCCESS MESSAGE
SELECT '✅ Applications table setup complete! Now reload your admin page.' as message;
