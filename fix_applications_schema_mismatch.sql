-- FIX APPLICATIONS SCHEMA MISMATCH
-- =================================
-- There are TWO different schemas being used:
-- 1. ApplicationModal uses: applicant_id, applicant_name, applicant_email, applicant_phone, message, move_out_date
-- 2. AdminApplications expects: tenant_id + join with profiles

-- SOLUTION: Update ApplicationModal to use tenant_id instead of applicant_id
-- and remove redundant applicant_* fields since we can join with profiles

-- Step 1: Check current table structure
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applications'
ORDER BY ordinal_position;

-- Step 2: If table has applicant_* columns, we need to migrate to tenant_id model
-- Check if table needs to be recreated or columns renamed

-- Option A: If table is empty or you're okay dropping it, recreate with correct schema
/*
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

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_tenant_id ON applications(tenant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
*/

-- Option B: If table has data, migrate columns
/*
-- Add new column if doesn't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES auth.users(id);

-- Migrate data from applicant_id to tenant_id if both exist
UPDATE applications 
SET tenant_id = applicant_id 
WHERE tenant_id IS NULL AND applicant_id IS NOT NULL;

-- Make tenant_id NOT NULL after migration
ALTER TABLE applications ALTER COLUMN tenant_id SET NOT NULL;

-- Rename message to additional_info if needed
ALTER TABLE applications RENAME COLUMN message TO additional_info;

-- Drop old columns (optional, after verifying migration worked)
-- ALTER TABLE applications DROP COLUMN IF EXISTS applicant_id;
-- ALTER TABLE applications DROP COLUMN IF EXISTS applicant_name;
-- ALTER TABLE applications DROP COLUMN IF EXISTS applicant_email;
-- ALTER TABLE applications DROP COLUMN IF EXISTS applicant_phone;
-- ALTER TABLE applications DROP COLUMN IF EXISTS move_out_date;
*/

-- Step 3: Create RLS policies (regardless of which option above)
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "Tenants can view their own applications" ON applications;
DROP POLICY IF EXISTS "Tenants can create applications" ON applications;
DROP POLICY IF EXISTS "Property owners can view applications for their properties" ON applications;

-- Create new policies
CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Tenants can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Property owners can view applications for their properties"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = applications.property_id
            AND properties.host_id = auth.uid()
        )
    );

-- Step 4: Test query
SELECT 
    a.*,
    p.title as property_title,
    pr.full_name as tenant_name,
    pr.email as tenant_email,
    pr.phone as tenant_phone
FROM applications a
LEFT JOIN properties p ON a.property_id = p.id
LEFT JOIN profiles pr ON a.tenant_id = pr.id
ORDER BY a.created_at DESC;
