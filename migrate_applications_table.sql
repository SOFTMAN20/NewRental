-- MIGRATE APPLICATIONS TABLE TO NEW SCHEMA
-- =========================================
-- Run this to update applications table from old schema to new

-- Check current columns
\d applications;

-- Step 1: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS applications_backup AS 
SELECT * FROM applications;

-- Step 2: Drop old table and recreate with new schema
DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    move_in_date DATE NOT NULL,
    additional_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 3: Migrate data from backup if it exists
-- If you had applicant_id, map it to tenant_id
/*
INSERT INTO applications (
    id,
    property_id,
    tenant_id,
    status,
    move_in_date,
    additional_info,
    created_at
)
SELECT 
    id,
    property_id,
    applicant_id as tenant_id,  -- Map old column to new
    status,
    move_in_date,
    message as additional_info,  -- Map message to additional_info
    created_at
FROM applications_backup;
*/

-- Step 4: Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Step 5: Create indexes
CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_tenant_id ON applications(tenant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Step 6: Create RLS policies
-- Admins can view all
CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Admins can update
CREATE POLICY "Admins can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Tenants can view their own
CREATE POLICY "Tenants can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = tenant_id);

-- Tenants can create
CREATE POLICY "Tenants can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

-- Property owners can view applications for their properties
CREATE POLICY "Property owners can view applications for their properties"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = applications.property_id
            AND properties.host_id = auth.uid()
        )
    );

-- Step 7: Test query (should work for admins)
SELECT 
    a.id,
    a.status,
    a.move_in_date,
    a.additional_info,
    a.created_at,
    p.title as property_title,
    p.location as property_location,
    pr.full_name as tenant_name,
    pr.email as tenant_email,
    pr.phone as tenant_phone
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
ORDER BY a.created_at DESC;

-- Step 8: Drop backup table after confirming migration worked
-- DROP TABLE applications_backup;

COMMENT ON TABLE applications IS 'Property rental applications - stores tenant applications with references to users via tenant_id';
COMMENT ON COLUMN applications.tenant_id IS 'References auth.users.id - tenant info comes from profiles table via join';
COMMENT ON COLUMN applications.additional_info IS 'Optional message from tenant to landlord';
