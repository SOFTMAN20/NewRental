# Marketplace Setup Guide - Supabase Configuration

## 🚀 Quick Setup Steps

Follow these steps to complete the marketplace setup in Supabase:

---

## Step 1: Execute Database Migration

### Option A: Using Supabase MCP (Recommended)
Since you already have the tables created via MCP, verify they exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'marketplace_%';
```

You should see:
- `marketplace_categories`
- `marketplace_favorites`
- `marketplace_listings`
- `marketplace_reviews`

### Option B: Manual SQL Execution
If tables don't exist, run the `marketplace_schema.sql` file in Supabase SQL Editor.

---

## Step 2: Create View Counter Function

This function is needed for the item detail page to track views.

Go to **Supabase Dashboard > SQL Editor** and run:

```sql
CREATE OR REPLACE FUNCTION increment_marketplace_views(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE marketplace_listings
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Step 3: Create Storage Bucket

Go to **Supabase Dashboard > Storage**

1. Click **"New bucket"**
2. Name: `marketplace-images`
3. **Public bucket:** ✅ YES (Check this box)
4. Click **"Create bucket"**

### Configure Bucket Policies

After creating the bucket, set up policies:

```sql
-- Allow public read access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace-images');

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'marketplace-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'marketplace-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Step 4: Verify Categories

Check that the 8 default categories exist:

```sql
SELECT id, name, description FROM marketplace_categories ORDER BY name;
```

Expected categories:
1. Furniture
2. Electronics
3. Textbooks
4. Kitchen
5. Clothing
6. Sports
7. Services
8. Other

If missing, they were already inserted via the MCP migration.

---

## Step 5: Test Database Access

### Test 1: Check RLS Policies
```sql
-- View all RLS policies for marketplace tables
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE 'marketplace_%';
```

### Test 2: Insert Test Listing (as authenticated user)
```sql
-- This should work when you're logged in
INSERT INTO marketplace_listings (
  seller_id,
  title,
  description,
  price,
  category_id,
  condition,
  location,
  images,
  status
) VALUES (
  auth.uid(), -- Your user ID
  'Test Item',
  'This is a test item for the marketplace',
  50000,
  (SELECT id FROM marketplace_categories WHERE name = 'Furniture' LIMIT 1),
  'good',
  'Dar es Salaam',
  ARRAY['https://via.placeholder.com/400'],
  'active'
);
```

### Test 3: Query Listings
```sql
-- View all active listings
SELECT 
  l.id,
  l.title,
  l.price,
  c.name as category,
  l.created_at
FROM marketplace_listings l
LEFT JOIN marketplace_categories c ON l.category_id = c.id
WHERE l.status = 'active'
ORDER BY l.created_at DESC
LIMIT 10;
```

---

## Step 6: Configure Storage Settings (Optional)

For better performance and security:

### File Size Limit
In Supabase Dashboard > Storage > marketplace-images > Settings:
- Set **Maximum file size:** 5 MB

### Allowed MIME Types
- image/jpeg
- image/png
- image/webp
- image/gif

---

## Step 7: Environment Variables Check

Verify your `.env.local` file has Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🧪 Testing Checklist

After completing the setup:

### Frontend Tests
- [ ] Navigate to `/marketplace` - Page loads without errors
- [ ] Click on any item - Detail page opens
- [ ] Click "Sell Item" (when logged in) - Form appears
- [ ] Upload an image - Upload succeeds
- [ ] Submit listing - Item is created
- [ ] View your listing - Shows correctly
- [ ] Test on mobile - Responsive design works

### Database Tests
- [ ] New listings appear in `marketplace_listings` table
- [ ] View count increments when viewing items
- [ ] Favorites are saved in `marketplace_favorites`
- [ ] Images are stored in `marketplace-images` bucket

### Navigation Tests
- [ ] "Marketplace" link visible in desktop menu
- [ ] "Marketplace" link visible in mobile menu
- [ ] "Marketplace" link visible in user dropdown

---

## 🐛 Troubleshooting

### Issue: "Could not load images"
**Solution:** Check that `marketplace-images` bucket is public

### Issue: "Permission denied" when creating listing
**Solution:** Verify RLS policies allow authenticated users to insert

### Issue: "Category not found"
**Solution:** Run category insert statements from `marketplace_schema.sql`

### Issue: Images not uploading
**Solution:** 
1. Check bucket exists and is public
2. Verify storage policies are set
3. Check file size < 5MB

### Issue: View count not incrementing
**Solution:** Create the `increment_marketplace_views` function (Step 2)

---

## 📊 Monitoring Queries

### Check listing statistics
```sql
SELECT 
  COUNT(*) as total_listings,
  COUNT(*) FILTER (WHERE status = 'active') as active_listings,
  COUNT(*) FILTER (WHERE is_sold = true) as sold_items,
  AVG(price) as average_price
FROM marketplace_listings;
```

### Most popular categories
```sql
SELECT 
  c.name,
  COUNT(l.id) as listing_count
FROM marketplace_categories c
LEFT JOIN marketplace_listings l ON c.id = l.category_id
GROUP BY c.id, c.name
ORDER BY listing_count DESC;
```

### Recent listings
```sql
SELECT 
  title,
  price,
  created_at,
  views_count
FROM marketplace_listings
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;
```

---

## ✅ Setup Complete!

Once all steps are done:

1. **Restart your dev server:** `npm run dev`
2. **Open browser:** Navigate to `http://localhost:5173/marketplace`
3. **Test the flow:** Browse → View Item → Add Listing
4. **Check mobile:** Test responsive design

---

## 🎉 Success Indicators

You'll know the setup is complete when:
- ✅ Marketplace page loads without console errors
- ✅ Items display in a grid
- ✅ You can upload and view images
- ✅ Creating a listing saves to database
- ✅ WhatsApp link generates correctly
- ✅ Mobile navigation shows marketplace link

---

## 📞 Need Help?

Common commands:
```bash
# Check if dev server is running
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Check for build errors
npm run build
```

Check browser console for specific error messages.

---

**Last Updated:** December 2024
**Status:** Ready for Setup 🚀
