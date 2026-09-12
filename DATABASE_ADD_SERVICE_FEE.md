# Add Service Fee Columns to Properties Table

## What This Does
Adds two new optional columns to the `properties` table:
- `service_fee_type` - Type of service fee (percentage or fixed)
- `service_fee_value` - Value of the service fee (percentage number or fixed amount in TZS)

## How to Add via Supabase Dashboard

### Option 1: SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Paste this SQL:

```sql
-- Add service fee fields to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS service_fee_type TEXT CHECK (service_fee_type IN ('percentage', 'fixed')),
ADD COLUMN IF NOT EXISTS service_fee_value DECIMAL(10,2);

-- Add comments for documentation
COMMENT ON COLUMN properties.service_fee_type IS 'Type of service fee: percentage or fixed amount';
COMMENT ON COLUMN properties.service_fee_value IS 'Service fee value: percentage (e.g., 10 for 10%) or fixed amount in TZS';
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Option 2: Table Editor

1. Open your Supabase project dashboard
2. Go to **Table Editor** (left sidebar)
3. Select the `properties` table
4. Click **Add Column** (+ button)

**First Column:**
- Name: `service_fee_type`
- Type: `text`
- Default value: `NULL`
- Is Nullable: ✅ Yes
- Click **Save**

**Second Column:**
- Name: `service_fee_value`
- Type: `numeric` (precision 10, scale 2)
- Default value: `NULL`
- Is Nullable: ✅ Yes
- Click **Save**

## How to Verify

Run this query in SQL Editor:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('service_fee_type', 'service_fee_value');
```

You should see both columns listed.

## Usage in the App

Once columns are added:

**Step 6 of Property Form:**
- Property owners can set service fee as:
  - **Percentage**: e.g., 10% of rent (stored as `service_fee_type='percentage'`, `service_fee_value=10`)
  - **Fixed Amount**: e.g., TZS 50,000 (stored as `service_fee_type='fixed'`, `service_fee_value=50000`)
  - **No Fee**: Leave empty (both fields NULL)

**ServiceFeeCalculator Component:**
- Will use `property.service_fee_type` and `property.service_fee_value`
- Falls back to default 10% if not set
- Shows calculation based on actual property data

## Example Data

```sql
-- Property with 10% service fee
UPDATE properties 
SET service_fee_type = 'percentage', service_fee_value = 10 
WHERE id = 'some-property-id';

-- Property with fixed TZS 50,000 service fee
UPDATE properties 
SET service_fee_type = 'fixed', service_fee_value = 50000 
WHERE id = 'some-property-id';

-- Property with no service fee
UPDATE properties 
SET service_fee_type = NULL, service_fee_value = NULL 
WHERE id = 'some-property-id';
```

## Migration File Location

A migration file has been created at:
```
supabase/migrations/20260912_add_service_fee_fields.sql
```

This can be applied automatically if you have Supabase CLI set up:
```bash
supabase db push
```
