-- Add contract_months column to properties table
-- Ongeza column ya contract_months kwenye jedwali la properties

-- Add the column with default value of 3 months
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS contract_months INTEGER DEFAULT 3;

-- Add comment to explain the column
COMMENT ON COLUMN properties.contract_months IS 'Number of months for the rental contract period (Idadi ya miezi ya mkataba wa kupanga nyumba)';

-- Add check constraint to ensure valid contract period (1-12 months)
ALTER TABLE properties 
ADD CONSTRAINT contract_months_range 
CHECK (contract_months >= 1 AND contract_months <= 12);

-- Update existing properties to have default 3 months contract
UPDATE properties 
SET contract_months = 3 
WHERE contract_months IS NULL;
