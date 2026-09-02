-- Add minutes_from_campus column to properties table
-- This replaces the distance_from_campus (km) with time in minutes

-- Add new column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS minutes_from_campus INTEGER;

-- Copy data from distance_from_campus to minutes_from_campus
-- Assuming average walking speed: 1km ≈ 12 minutes
UPDATE properties 
SET minutes_from_campus = ROUND(distance_from_campus * 12)
WHERE distance_from_campus IS NOT NULL;

-- Add comment
COMMENT ON COLUMN properties.minutes_from_campus IS 'Time in minutes from campus (walking/transport)';

-- We keep distance_from_campus for backward compatibility but will use minutes_from_campus going forward
