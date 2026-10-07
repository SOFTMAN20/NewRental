-- ============================================
-- WANACHUO.COM MARKETPLACE DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run

-- MARKETPLACE CATEGORIES TABLE
-- Kategoria za bidhaa (Furniture, Electronics, etc.)
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_sw TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  parent_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MARKETPLACE LISTINGS TABLE
-- Bidhaa zinazouzwa na wanafunzi
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'TZS',
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  images TEXT[] DEFAULT '{}',
  location TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  is_negotiable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'inactive')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MARKETPLACE FAVORITES TABLE
-- Vipendwa vya watumiaji
CREATE TABLE IF NOT EXISTS marketplace_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- MARKETPLACE REVIEWS TABLE
-- Maoni na ukadiriaji wa wauzaji
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_university ON marketplace_listings(university_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_created ON marketplace_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_user ON marketplace_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_listing ON marketplace_favorites(listing_id);

-- INSERT DEFAULT CATEGORIES
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order) VALUES
  ('Furniture', 'Samani', 'furniture', '🛋️', 'Beds, tables, chairs, wardrobes', 1),
  ('Electronics', 'Vifaa vya Umeme', 'electronics', '📱', 'Phones, laptops, TVs, appliances', 2),
  ('Textbooks', 'Vitabu', 'textbooks', '📚', 'Course books and study materials', 3),
  ('Kitchen Items', 'Vifaa vya Jikoni', 'kitchen', '🍳', 'Cookware, dishes, utensils', 4),
  ('Clothing', 'Nguo', 'clothing', '👕', 'Clothes, shoes, accessories', 5),
  ('Sports Equipment', 'Vifaa vya Michezo', 'sports', '⚽', 'Sports gear and equipment', 6),
  ('Services', 'Huduma', 'services', '🔧', 'Cleaning, moving, tutoring', 7),
  ('Other', 'Mengineyo', 'other', '📦', 'Miscellaneous items', 8)
ON CONFLICT (slug) DO NOTHING;

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR CATEGORIES (Public read)
CREATE POLICY "Categories are viewable by everyone" ON marketplace_categories
  FOR SELECT USING (true);

-- RLS POLICIES FOR LISTINGS
CREATE POLICY "Listings are viewable by everyone" ON marketplace_listings
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own listings" ON marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings" ON marketplace_listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own listings" ON marketplace_listings
  FOR DELETE USING (auth.uid() = seller_id);

-- RLS POLICIES FOR FAVORITES
CREATE POLICY "Users can view their own favorites" ON marketplace_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON marketplace_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites" ON marketplace_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS POLICIES FOR REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON marketplace_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON marketplace_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON marketplace_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON marketplace_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- UPDATE TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_marketplace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_categories_updated_at
  BEFORE UPDATE ON marketplace_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_reviews_updated_at
  BEFORE UPDATE ON marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_updated_at();

-- SUCCESS MESSAGE
SELECT 'Marketplace database schema created successfully! 🎉' AS message;
