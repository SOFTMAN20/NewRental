/*
  # Increase Price Column Precision

  1. Changes
    - Modify `price` column from DECIMAL(12,2) to DECIMAL(15,2)
    - This increases maximum value from 9,999,999,999.99 to 999,999,999,999,999.99
    
  2. Purpose
    - Fix numeric field overflow error when saving properties with high prices
    - Allow for property prices up to 999 trillion TZS (more than sufficient for Tanzania market)
    
  3. Benefits
    - Resolves "numeric field overflow" error in property creation
    - Accommodates high-value properties without data loss
    - Maintains 2 decimal places for currency precision
*/

-- Increase precision of price column to handle larger property values
ALTER TABLE public.properties 
ALTER COLUMN price TYPE DECIMAL(15,2);

-- Add comment for documentation
COMMENT ON COLUMN public.properties.price IS 'Property price in TZS with increased precision to handle high-value properties';