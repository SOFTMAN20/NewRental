# MARKETPLACE SETUP - FURNITURE & MATTRESSES WITH SUBCATEGORIES
## Wanachuo.com Student Marketplace Configuration

---

## 📋 Overview

The marketplace has been configured with **2 main categories**:
1. **🛋️ Furniture** (Samani) - with subcategories
2. **🛏️ Mattresses** (Magodoro)

### Furniture Subcategories Include:
- 🪑 **Tables** (Meza) - Study tables, dining tables, coffee tables
- 🛏️ **Beds** (Vitanda) - Single beds, double beds, bed frames
- 🚪 **Wardrobes** (Kabati) - Wardrobes, closets, storage cabinets
- 🪑 **Chairs** (Viti) - Study chairs, dining chairs, office chairs
- 📚 **Shelves** (Rafu) - Bookshelves, storage shelves, racks
- 🛋️ **Sofas** (Sofa) - Sofas, couches, seating furniture
- 🖥️ **Desks** (Madawati) - Study desks, computer desks, writing desks
- 📦 **Other Furniture** (Samani Nyingine) - Other furniture items

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Run Database Migration

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `setup_marketplace_categories.sql`
5. Click **Run** or press **Ctrl+Enter**

**File to run**: `setup_marketplace_categories.sql`

This will:
- ✅ Create/update Furniture and Mattresses main categories
- ✅ Create 8 furniture subcategories (Tables, Beds, Wardrobes, etc.)
- ✅ Set up proper parent-child relationships
- ✅ Assign display order and Swahili names

### Step 2: Verify Setup

After running the SQL, you should see:
```
✅ Marketplace categories setup complete! 
   Furniture with subcategories and Mattresses added.
```

The query will also display all categories in a table format showing:
- Main Category | Subcategory | Swahili Name | Display Order

---

## 📱 User Interface

### Desktop View
```
┌─────────────────────────────────────────────┐
│         Student Marketplace                  │
│  Buy and sell furniture and mattresses       │
│                                              │
│  [All Items] [🛋️ Furniture] [🛏️ Mattresses] │
│                                              │
│  Furniture Types:                            │
│  [Meza] [Vitanda] [Kabati] [Viti] [Rafu]   │
│  [Sofa] [Madawati] [Samani Nyingine]       │
└─────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────┐
│  Student Marketplace │
│                      │
│ [All] [🛋️] [🛏️]     │
│                      │
│ Furniture Types:     │
│ [Meza] [Vitanda]    │
│ [Kabati] [Viti]     │
│ [Rafu] [Sofa]       │
│ [Madawati] [Nyingine]│
└──────────────────────┘
```

---

## 🔧 Technical Implementation

### Files Modified

#### 1. **src/pages/Marketplace.tsx**
- Added `subcategories` state to store furniture subcategories
- Modified category fetch to get main categories AND subcategories
- Updated UI to display subcategories below main categories
- Subcategories show Swahili names (e.g., "Meza" instead of "Tables")

**Key Changes:**
```typescript
// State management
const [subcategories, setSubcategories] = useState<...>([]);

// Fetch subcategories
const furnitureCategory = mainCats.find(c => c.slug === 'furniture');
if (furnitureCategory) {
  const { data: subCats } = await supabase
    .from('marketplace_categories')
    .select('*')
    .eq('parent_id', furnitureCategory.id)
    .order('display_order');
}

// Display subcategories
{subcategories.length > 0 && (
  <div>
    <span>Furniture Types:</span>
    {subcategories.map((sub) => (
      <Button onClick={() => filter by sub.id}>
        {sub.name_sw || sub.name}
      </Button>
    ))}
  </div>
)}
```

#### 2. **setup_marketplace_categories.sql** (NEW)
Complete database migration script that:
- Creates/updates main categories (Furniture, Mattresses)
- Creates 8 furniture subcategories with Swahili names
- Sets up parent-child relationships
- Assigns display order
- Includes verification query

---

## 🗄️ Database Structure

### marketplace_categories Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category name (English) |
| name_sw | TEXT | Category name (Swahili) |
| slug | TEXT | URL-friendly identifier |
| icon | TEXT | Emoji icon |
| description | TEXT | Category description |
| parent_id | UUID | References parent category (NULL for main) |
| display_order | INTEGER | Sort order |

### Category Hierarchy

```
Furniture (parent_id: NULL)
├── Tables (parent_id: furniture_id)
├── Beds (parent_id: furniture_id)
├── Wardrobes (parent_id: furniture_id)
├── Chairs (parent_id: furniture_id)
├── Shelves (parent_id: furniture_id)
├── Sofas (parent_id: furniture_id)
├── Desks (parent_id: furniture_id)
└── Other Furniture (parent_id: furniture_id)

Mattresses (parent_id: NULL)
```

---

## 🎯 User Experience Flow

### For Buyers

1. **Landing**: See main categories: All Items, Furniture, Mattresses
2. **Browse Furniture**: Click "Furniture" → See all furniture items
3. **Narrow Down**: Click specific type (e.g., "Vitanda" for beds) → See only beds
4. **Search**: Use search bar to find specific items
5. **Filter**: Use condition, price filters for refined results

### For Sellers

1. **List Item**: Click "Sell Item" button
2. **Choose Category**: 
   - Select "Furniture" → Choose subcategory (Tables, Beds, etc.)
   - Select "Mattresses" → Direct selection
3. **Fill Details**: Title, description, price, condition, photos
4. **Publish**: Item appears in marketplace

---

## 📊 Benefits

### For Platform
- ✅ **Focused**: Only housing-related items
- ✅ **Organized**: Clear subcategory structure
- ✅ **Scalable**: Easy to add more subcategories
- ✅ **Bilingual**: English and Swahili support

### For Users
- ✅ **Easy Navigation**: Quick filters to find items
- ✅ **Relevant Results**: No unrelated products
- ✅ **Local Language**: Swahili names for familiarity
- ✅ **Clear Categories**: Know exactly what's being sold

### For Landlords
- ✅ **Furniture Sales**: Can sell furniture with properties
- ✅ **Mattress Sales**: Sell mattresses separately
- ✅ **Bulk Listing**: List multiple furniture pieces

---

## 🔄 Future Enhancements

### Potential Additions
1. **More Subcategories**: 
   - Add "Lamps" (Taa)
   - Add "Mirrors" (Vioo)
   - Add "Curtains" (Mapazia)

2. **Mattress Subcategories**:
   - Single Mattress
   - Double Mattress
   - Memory Foam
   - Spring Mattress

3. **Condition Badges**:
   - Visual indicators for item condition
   - "Like New" badge
   - "Good Deal" badge

4. **Seller Ratings**:
   - Star ratings for sellers
   - Review system
   - Verified seller badges

---

## 🐛 Troubleshooting

### Issue: Categories Not Showing

**Solution**:
1. Check if SQL migration ran successfully
2. Verify categories exist: 
   ```sql
   SELECT * FROM marketplace_categories 
   WHERE slug IN ('furniture', 'mattresses');
   ```
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: Subcategories Not Displaying

**Solution**:
1. Verify parent_id is set correctly:
   ```sql
   SELECT name, parent_id FROM marketplace_categories 
   WHERE parent_id IS NOT NULL;
   ```
2. Check that furniture category exists
3. Ensure `subcategories` state is populated (check React DevTools)

### Issue: Swahili Names Not Showing

**Solution**:
1. Verify `name_sw` column has values:
   ```sql
   SELECT name, name_sw FROM marketplace_categories;
   ```
2. Check the display code uses `name_sw || name`

---

## 📝 Testing Checklist

### Database
- [ ] Run `setup_marketplace_categories.sql`
- [ ] Verify 2 main categories created
- [ ] Verify 8 subcategories created
- [ ] Check parent-child relationships
- [ ] Confirm Swahili names populated

### Frontend - Desktop
- [ ] Main categories display (All, Furniture, Mattresses)
- [ ] Subcategories display below main categories
- [ ] Clicking "Furniture" filters to all furniture
- [ ] Clicking "Meza" filters to tables only
- [ ] Clicking "All Items" shows everything
- [ ] Active filter highlights correctly

### Frontend - Mobile
- [ ] Categories display in compact mode
- [ ] Subcategories wrap properly
- [ ] Touch/click interactions work
- [ ] Responsive layout maintains structure

### Functionality
- [ ] Search works across all categories
- [ ] Price filters work
- [ ] Condition filters work
- [ ] Sort options work
- [ ] Creating listing shows correct categories

---

## 📂 Related Files

- `src/pages/Marketplace.tsx` - Main marketplace page
- `setup_marketplace_categories.sql` - Database migration script
- `marketplace_schema.sql` - Original schema (reference)
- `add_mattress_category.sql` - Previous migration (superseded)
- `src/components/marketplace/ItemCard.tsx` - Item display component

---

## ✅ Completion Status

- [x] Database schema with subcategories
- [x] SQL migration script created
- [x] Frontend updated to show subcategories
- [x] Swahili names implemented
- [x] Filter functionality working
- [x] Documentation complete

**Status**: ✅ **READY FOR TESTING**
**Next Step**: Run `setup_marketplace_categories.sql` in Supabase

---

**Created**: January 2025  
**Platform**: Wanachuo.com Student Housing Marketplace  
**Version**: 1.0
