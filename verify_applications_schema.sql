-- VERIFY AND UPDATE APPLICATIONS TABLE SCHEMA
-- ============================================
-- This script checks the applications table structure
-- and provides the correct schema if needed

-- First, check current structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applications'
ORDER BY ordinal_position;

-- If the table needs to be created/updated, use this schema:
/*
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

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Allow tenants to view their own applications
CREATE POLICY "Tenants can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = tenant_id);

-- Allow tenants to create applications
CREATE POLICY "Tenants can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );

-- Allow admins to update application status
CREATE POLICY "Admins can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_property_id ON applications(property_id);
CREATE INDEX IF NOT EXISTS idx_applications_tenant_id ON applications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
*/
