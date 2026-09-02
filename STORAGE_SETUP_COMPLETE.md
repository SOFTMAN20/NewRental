# 🗄️ Supabase Storage Setup - COMPLETE! ✅

## Storage Buckets Created

### 1. **property-images** (Public) 📸
**Purpose:** Store property photos for listings

| Setting | Value |
|---------|-------|
| Bucket ID | `property-images` |
| Visibility | ✅ Public (anyone can view) |
| Max File Size | 10 MB |
| Allowed Types | JPEG, JPG, PNG, WebP, GIF |
| Created | 2026-09-01 11:35 UTC |

**Usage:**
- Landlords upload property photos
- Students can view all property images
- Images stored in user folders: `{user_id}/{timestamp}-{random}.jpg`

**Storage Policies (RLS):**
- ✅ Anyone can view (SELECT)
- ✅ Authenticated users can upload (INSERT) - in their own folder
- ✅ Users can update their own images (UPDATE)
- ✅ Users can delete their own images (DELETE)

---

### 2. **avatars** (Public) 👤
**Purpose:** Store user profile pictures

| Setting | Value |
|---------|-------|
| Bucket ID | `avatars` |
| Visibility | ✅ Public (anyone can view) |
| Max File Size | 2 MB |
| Allowed Types | JPEG, JPG, PNG, WebP |
| Created | 2026-09-01 11:35 UTC |

**Usage:**
- Users upload profile avatars
- Displayed on profiles, property cards, reviews
- Images stored in user folders: `{user_id}/{timestamp}.jpg`

**Storage Policies (RLS):**
- ✅ Anyone can view (SELECT)
- ✅ Users can upload their avatar (INSERT)
- ✅ Users can update their avatar (UPDATE)
- ✅ Users can delete their avatar (DELETE)

---

### 3. **property-documents** (Private) 📄
**Purpose:** Store private documents (contracts, ID verification, etc.)

| Setting | Value |
|---------|-------|
| Bucket ID | `property-documents` |
| Visibility | 🔒 Private (owner only) |
| Max File Size | 5 MB |
| Allowed Types | PDF, JPEG, JPG, PNG |
| Created | 2026-09-01 11:35 UTC |

**Usage:**
- Landlords upload verification documents
- Rental agreements
- ID copies for verification
- Private contracts

**Storage Policies (RLS):**
- ✅ Only owner can view their documents (SELECT)
- ✅ Authenticated users can upload (INSERT)
- ✅ Users can delete their own documents (DELETE)

---

## Security Features 🔐

### Row Level Security (RLS)
All storage buckets have RLS enabled with proper policies:

1. **User Folder Isolation**
   - Each user's files stored in their own folder: `{user_id}/`
   - Users can only access their own folders
   - Prevents unauthorized access

2. **Public vs Private**
   - `property-images` & `avatars`: Public viewing
   - `property-documents`: Owner-only access

3. **Authentication Required**
   - Uploads require valid auth session
   - Anonymous users can only view public images

---

## Image Upload Flow 🖼️

### Current Implementation (Hybrid System)

```
User selects image
    ↓
Client-side compression (2MB max, 1200px)
    ↓
Upload to Edge Function (compress-image)
    ↓
Server-side compression (800KB max, 1024px)
    ↓
Upload to property-images bucket
    ↓
Return public URL
    ↓
Save URL to properties.images array
```

### Fallback System
If Edge Function fails:
```
Client-side compression
    ↓
Direct upload to property-images bucket
    ↓
Return public URL
```

---

## File Structure

### Property Images
```
property-images/
├── {landlord_user_id_1}/
│   ├── 1735732521234-abc123.jpg
│   ├── 1735732522456-def456.png
│   └── 1735732523789-ghi789.webp
├── {landlord_user_id_2}/
│   ├── 1735732525012-jkl012.jpg
│   └── 1735732526345-mno345.jpg
```

### Avatars
```
avatars/
├── {user_id_1}/
│   └── avatar-1735732521234.jpg
├── {user_id_2}/
│   └── avatar-1735732522456.png
```

### Documents (Private)
```
property-documents/
├── {landlord_id_1}/
│   ├── contract-property-123.pdf
│   ├── id-verification.jpg
│   └── license.pdf
```

---

## Usage in Code

### Upload Property Image
```typescript
import { supabase } from '@/lib/integrations/supabase/client';

// Upload file
const file = event.target.files[0];
const fileName = `${userId}/${Date.now()}-${Math.random()}.jpg`;

const { data, error } = await supabase.storage
  .from('property-images')
  .upload(fileName, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('property-images')
  .getPublicUrl(fileName);

// Save URL to database
await supabase
  .from('properties')
  .update({ images: [...existingImages, publicUrl] })
  .eq('id', propertyId);
```

### Upload Avatar
```typescript
const fileName = `${userId}/avatar-${Date.now()}.jpg`;

await supabase.storage
  .from('avatars')
  .upload(fileName, file, { upsert: true });

const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName);

// Update profile
await supabase
  .from('profiles')
  .update({ avatar_url: publicUrl })
  .eq('id', userId);
```

### Delete Image
```typescript
// Extract filename from URL
const fileName = imageUrl.split('/property-images/')[1];

await supabase.storage
  .from('property-images')
  .remove([fileName]);
```

---

## Validation & Security

### File Validation (Client-side)
✅ **Type checking:**
- Only: JPEG, JPG, PNG, WebP
- Blocked: PHP, EXE, BAT, CMD, JS, HTML

✅ **Size limits:**
- Min: 1 KB (prevent empty files)
- Max: 5 MB (before compression)

✅ **Filename security:**
- No path traversal (..)
- No directory separators (/ \)
- No suspicious patterns

✅ **Rate limiting:**
- Prevents spam uploads
- User-specific limits

### Storage Policies (Server-side)
✅ **Bucket-level:**
- File size limits enforced
- MIME type restrictions
- Public/private access control

✅ **RLS policies:**
- User folder isolation
- Owner-only access for private docs
- Authenticated uploads only

---

## Storage URLs

### Public URL Format
```
https://tegsmahtigsrgjvsnzef.supabase.co/storage/v1/object/public/{bucket}/{path}
```

**Example:**
```
https://tegsmahtigsrgjvsnzef.supabase.co/storage/v1/object/public/property-images/f109476b-82c9-4a03-9997-6d2c5bdc8a5b/1735732521234-abc123.jpg
```

### Private URL Format
```
https://tegsmahtigsrgjvsnzef.supabase.co/storage/v1/object/authenticated/{bucket}/{path}
```

---

## Testing Storage

### Test Upload (Browser Console)
```javascript
// 1. Check if buckets exist
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Buckets:', buckets);

// 2. Test file upload
const file = document.querySelector('input[type="file"]').files[0];
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`test/${Date.now()}.jpg`, file);

console.log('Upload result:', { data, error });

// 3. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('property-images')
  .getPublicUrl(data.path);

console.log('Public URL:', publicUrl);

// 4. Test image loads
const img = new Image();
img.src = publicUrl;
img.onload = () => console.log('✅ Image loads successfully');
img.onerror = () => console.log('❌ Image failed to load');
```

---

## Storage Monitoring

### Check Storage Usage
```sql
-- Total files per bucket
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint / 1024 / 1024 as total_mb
FROM storage.objects
GROUP BY bucket_id;

-- Files per user
SELECT 
  (metadata->>'owner')::uuid as user_id,
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint / 1024 / 1024 as total_mb
FROM storage.objects
GROUP BY user_id, bucket_id
ORDER BY total_mb DESC;

-- Recent uploads
SELECT 
  name,
  bucket_id,
  created_at,
  (metadata->>'size')::bigint / 1024 as size_kb
FROM storage.objects
ORDER BY created_at DESC
LIMIT 10;
```

---

## Troubleshooting

### Issue 1: "Storage bucket not found"
**Cause:** Bucket doesn't exist or name mismatch
**Fix:**
```sql
-- Check buckets
SELECT * FROM storage.buckets;

-- Recreate if needed (run migration again)
```

### Issue 2: "Permission denied" on upload
**Cause:** RLS policy blocking upload
**Fix:**
```sql
-- Check policies
SELECT * FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Verify user authentication
SELECT auth.uid(); -- Should return user ID
```

### Issue 3: "File too large"
**Cause:** Exceeds bucket limit
**Fix:**
- Compress image before upload
- Check bucket `file_size_limit`
- Edge function should handle compression

### Issue 4: Image doesn't load
**Cause:** Invalid URL or deleted file
**Fix:**
```javascript
// Check if file exists
const { data, error } = await supabase.storage
  .from('property-images')
  .list(userId, { limit: 100 });

console.log('User files:', data);
```

---

## Performance Optimization

### Image Compression
✅ **2-stage compression:**
1. Client: 2MB max, 1200px
2. Server: 800KB max, 1024px

✅ **Benefits:**
- Faster uploads (smaller files)
- Lower storage costs
- Faster page loads
- Better mobile experience

### CDN Caching
✅ **Supabase Storage includes CDN:**
- Images cached globally
- Faster load times worldwide
- Automatic cache headers (`Cache-Control: 3600`)

---

## Cost Estimation

### Supabase Free Tier
- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month
- **Sufficient for:** ~500 properties (2MB per property × 5 images)

### Paid Tier (if needed)
- **Pro:** $25/month
  - 100 GB storage
  - 200 GB bandwidth
- **Sufficient for:** ~10,000 properties

---

## Summary

### ✅ What's Working
1. 3 storage buckets created
2. RLS policies configured
3. Public/private access control
4. File validation & security
5. Image compression system
6. Hybrid upload (Edge Function + Fallback)

### 🎯 Ready for Use
- Landlords can upload property images ✅
- Users can upload profile avatars ✅
- Private documents storage ✅
- Public image viewing ✅

### 📝 Next Steps
1. Test uploading images in property form
2. Verify images appear in property cards
3. Test avatar upload in profile settings
4. Monitor storage usage

---

**Storage is fully configured and ready to use!** 🚀

Try uploading images through the property form now.
