-- ============================================
-- ADD MATTRESS CATEGORY TO MARKETPLACE
-- ============================================
-- Run this in Supabase SQL Editor
-- This adds the Mattresses category alongside Furniture

-- Add Mattress category
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order) 
VALUES ('Mattresses', 'Magodoro', 'mattresses', '🛏️', 'Mattresses and bedding items for students', 1)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  name_sw = EXCLUDED.name_sw,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Verify the categories
SELECT id, name, name_sw, slug, icon, description, display_order 
FROM marketplace_categories 
WHERE slug IN ('furniture', 'mattresses')
ORDER BY display_order;

-- SUCCESS MESSAGE
SELECT 'Mattress category added successfully! Now showing Furniture and Mattresses only. 🛏️' AS message;
