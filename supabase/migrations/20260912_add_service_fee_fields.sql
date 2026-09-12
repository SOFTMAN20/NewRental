-- Add service fee fields to properties table
-- This allows property owners to specify their service fee

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS service_fee_type TEXT CHECK (service_fee_type IN ('percentage', 'fixed', NULL)),
ADD COLUMN IF NOT EXISTS service_fee_value DECIMAL(10,2);

-- Add comments
COMMENT ON COLUMN properties.service_fee_type IS 'Type of service fee: percentage or fixed amount';
COMMENT ON COLUMN properties.service_fee_value IS 'Service fee value: percentage (e.g., 10 for 10%) or fixed amount in TZS';
