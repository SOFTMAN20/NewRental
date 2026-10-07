# MARKETPLACE - FURNITURE & MATTRESSES ONLY
## Wanachuo.com Student Marketplace Restrictions

### Overview
The marketplace has been configured to show **only 2 categories**:
1. **Furniture** (Samani) 🛋️
2. **Mattresses** (Magodoro) 🛏️

All other categories (Electronics, Textbooks, Kitchen, Clothing, Sports, Services, Other) are hidden from the interface.

---

## Changes Made

### 1. **Marketplace.tsx** Updates
**File**: `src/pages/Marketplace.tsx`

#### Category Icons Restricted
```typescript
// Only Furniture and Mattresses
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Furniture': <Sofa className="h-5 w-5" />,
  'Mattresses': <Package className="h-5 w-5" />,
};
```

#### Category Fetch Filtered
```typescript
// Fetch only furniture and mattresses
const { data, error } = await supabase
  .from('marketplace_categories')
  .select('*')
  .in('slug', ['furniture', 'mattresses'])
  .order('name');
```

#### Hero Section Updated
```typescript
<p className="text-gray-600 text-sm sm:text-base">
  Buy and sell furniture and mattresses for students
</p>
```

---

### 2. **Database Migration**
**File**: `add_mattress_category.sql`

Adds the Mattresses category to the database:
```sql
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description, display_order) 
VALUES ('Mattresses', 'Magodoro', 'mattresses', '🛏️', 'Mattresses and bedding items for students', 1);
```

**To apply this migration:**
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the contents of `add_mattress_category.sql`
4. Click "Run"

---

## User Experience

### For Buyers
- Browse page shows only Furniture and Mattresses categories
- Quick filter buttons only show these 2 categories
- Search works across both categories
- All other marketplace features remain functional

### For Sellers
- Can list items in Furniture or Mattresses categories only
- When adding a new item, category dropdown will show:
  - Furniture
  - Mattresses

### Category Pills Display
```
[All Items] [🛋️ Furniture] [🛏️ Mattresses]
```

---

## Benefits

1. **Focused Marketplace**: Students see relevant housing-related items only
2. **Clear Purpose**: Aligns with housing/accommodation focus of the platform
3. **Reduced Clutter**: No unrelated items (electronics, clothes, etc.)
4. **Better for Landlords**: Can sell furniture/mattresses with their properties
5. **Student-Friendly**: Students moving in can buy essentials easily

---

## Future Expansion

To add more categories in the future:

1. Add category to database via SQL:
```sql
INSERT INTO marketplace_categories (name, name_sw, slug, icon, description) 
VALUES ('Category Name', 'Swahili Name', 'slug', '🔧', 'Description', order);
```

2. Update `CATEGORY_ICONS` in `Marketplace.tsx`:
```typescript
const CATEGORY_ICONS = {
  'Furniture': <Sofa />,
  'Mattresses': <Package />,
  'New Category': <Icon />, // Add here
};
```

3. Update `.in()` filter:
```typescript
.in('slug', ['furniture', 'mattresses', 'new-category'])
```

---

## Technical Details

### Database Schema
- **Table**: `marketplace_categories`
- **Columns**: id, name, name_sw, slug, icon, description, display_order
- **Active Slugs**: `furniture`, `mattresses`
- **Inactive Slugs**: `electronics`, `textbooks`, `kitchen`, `clothing`, `sports`, `services`, `other`

### Filter Implementation
- Server-side filtering via Supabase query
- Categories fetched: Only 'furniture' and 'mattresses'
- Other categories remain in database but are not displayed

---

## Testing Checklist

✅ **Marketplace Browse Page**
- [ ] Shows only Furniture and Mattresses category buttons
- [ ] "All Items" button works
- [ ] Category filtering works correctly
- [ ] Search works across both categories

✅ **Add Listing Page**
- [ ] Category dropdown shows only 2 options
- [ ] Can create listing with Furniture category
- [ ] Can create listing with Mattresses category

✅ **Mobile View**
- [ ] Category pills display correctly
- [ ] Filters work on mobile
- [ ] Search and sort functional

---

## Related Files
- `src/pages/Marketplace.tsx` - Main marketplace page
- `marketplace_schema.sql` - Original database schema
- `add_mattress_category.sql` - Migration to add mattresses
- `src/components/marketplace/ItemCard.tsx` - Listing card component

---

**Status**: ✅ Complete
**Date**: January 2025
**Platform**: Wanachuo.com Student Housing
