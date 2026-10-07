-- ============================================
-- SETUP MARKETPLACE CATEGORIES - FURNITURE & MATTRESSES
-- ============================================
-- Run this in Supabase SQL Editor
-- This sets up main categories and furniture subcategories

-- First, ensure main categories exist
-- Insert or update Furniture category
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
VALUES ('Furniture', 'Samani', 'furniture', '🛋️', 'Tables, beds, wardrobes, chairs and other furniture', 1, NULL)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  name_sw = EXCLUDED.name_sw,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Insert or update Mattresses category
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
VALUES ('Mattresses', 'Magodoro', 'mattresses', '🛏️', 'Mattresses and bedding items for students', 2, NULL)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  name_sw = EXCLUDED.name_sw,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Get the Furniture category ID for subcategories
DO $$
DECLARE
  furniture_id UUID;
BEGIN
  -- Get furniture category ID
  SELECT id INTO furniture_id FROM marketplace_categories WHERE slug = 'furniture';
  
  -- Insert Furniture Subcategories
  -- Meza (Tables)
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Tables', 'Meza', 'tables', '🪑', 'Study tables, dining tables, coffee tables', 1, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Vitanda (Beds)
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Beds', 'Vitanda', 'beds', '🛏️', 'Single beds, double beds, bed frames', 2, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Kabati (Wardrobes)
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Wardrobes', 'Kabati', 'wardrobes', '🚪', 'Wardrobes, closets, storage cabinets', 3, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Viti (Chairs)
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Chairs', 'Viti', 'chairs', '🪑', 'Study chairs, dining chairs, office chairs', 4, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Shelves/Rafu
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Shelves', 'Rafu', 'shelves', '📚', 'Bookshelves, storage shelves, racks', 5, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Sofa/Sofa Set
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Sofas', 'Sofa', 'sofas', '🛋️', 'Sofas, couches, seating furniture', 6, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Desk/Dawati
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Desks', 'Madawati', 'desks', '🖥️', 'Study desks, computer desks, writing desks', 7, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
  -- Other Furniture
  INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order, parent_id) 
  VALUES ('Other Furniture', 'Samani Nyingine', 'other-furniture', '📦', 'Other furniture items', 99, furniture_id)
  ON CONFLICT (slug) DO UPDATE 
  SET parent_id = EXCLUDED.parent_id, display_order = EXCLUDED.display_order;
  
END $$;

-- Verify the setup
SELECT 
  c1.name as main_category,
  c1.slug as main_slug,
  c2.name as subcategory,
  c2.name_sw as subcategory_sw,
  c2.slug as sub_slug,
  c2.display_order
FROM marketplace_categories c1
LEFT JOIN marketplace_categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL 
  AND c1.slug IN ('furniture', 'mattresses')
ORDER BY c1.display_order, c2.display_order;

-- SUCCESS MESSAGE
SELECT '✅ Marketplace categories setup complete! Furniture with subcategories and Mattresses added.' AS message;
