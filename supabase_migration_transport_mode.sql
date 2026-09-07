-- Add transport_mode column to properties table
-- This field stores how users travel to campus: 'walking', 'bike', or 'car'

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS transport_mode TEXT DEFAULT 'walking' 
CHECK (transport_mode IN ('walking', 'bike', 'car'));

-- Add comment to explain the field
COMMENT ON COLUMN properties.transport_mode IS 'Mode of transport to reach campus: walking, bike (motorbike/bodaboda), or car';

-- Update existing records to have default value
UPDATE properties 
SET transport_mode = 'walking' 
WHERE transport_mode IS NULL;

-- Create index for filtering by transport mode (optional, for future filtering feature)
CREATE INDEX IF NOT EXISTS idx_properties_transport_mode ON properties(transport_mode);
