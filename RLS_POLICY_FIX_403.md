# 403 Forbidden Error - RLS Policy Fix
## ⚠️ CRITICAL: Form Submission Blocked by Database Security

**Date**: 2026-09-04  
**Error**: `POST /rest/v1/properties 403 (Forbidden)`  
**Root Cause**: Row Level Security (RLS) policy blocking INSERT operations  
**Status**: 🔴 REQUIRES DATABASE FIX

---

## 🔍 ERROR ANALYSIS

### **Console Error**:
```
POST https://tegsmahtigsrgjvsnzef.supabase.co/rest/v1/properties...
403 (Forbidden)
```

### **What This Means**:
- ❌ Form validation: PASSED ✓
- ❌ User authentication: PASSED ✓  
- ❌ Data formatting: PASSED ✓
- ❌ **DATABASE SECURITY: BLOCKED** ❌

### **Root Cause**:
The Supabase database has **Row Level Security (RLS)** enabled on the `properties` table, but there's NO policy that allows authenticated users to INSERT new properties.

---

## 🎯 THE PROBLEM

### **Current RLS Setup** (Assumed):
```sql
-- properties table has RLS enabled
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- But NO INSERT policy exists for authenticated users ❌
```

### **What Happens**:
1. User fills form completely ✓
2. User clicks "Add Property" ✓
3. Frontend sends authenticated request ✓
4. **Supabase RLS checks policies** ❌
5. **No INSERT policy found** ❌
6. **Request blocked with 403** ❌

---

## ✅ THE SOLUTION

You need to add RLS policies to allow authenticated users to:
1. INSERT their own properties
2. UPDATE their own properties  
3. DELETE their own properties
4. SELECT/READ all properties (for browse page)

---

## 🔧 SQL FIX COMMANDS

### **Run these commands in Supabase SQL Editor**:

### **1. Allow Authenticated Users to INSERT Properties**
```sql
-- Policy: Authenticated users can insert properties
CREATE POLICY "Users can insert their own properties"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = landlord_id);
```

**Explanation**:
- `FOR INSERT` - Applies to INSERT operations
- `TO authenticated` - Only authenticated users
- `WITH CHECK` - Ensures `landlord_id` matches the authenticated user's ID

### **2. Allow Users to UPDATE Their Own Properties**
```sql
-- Policy: Users can update their own properties
CREATE POLICY "Users can update their own properties"
ON properties
FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);
```

**Explanation**:
- `USING` - Check before allowing update
- `WITH CHECK` - Ensure updated data still belongs to user

### **3. Allow Users to DELETE Their Own Properties**
```sql
-- Policy: Users can delete their own properties
CREATE POLICY "Users can delete their own properties"
ON properties
FOR DELETE
TO authenticated
USING (auth.uid() = landlord_id);
```

### **4. Allow Everyone to READ Properties**
```sql
-- Policy: Everyone can view active properties
CREATE POLICY "Anyone can view active properties"
ON properties
FOR SELECT
TO public
USING (status = 'active');
```

**OR** (if you want authenticated users to see all):
```sql
-- Policy: Authenticated users can view all properties
CREATE POLICY "Authenticated users can view all properties"
ON properties
FOR SELECT
TO authenticated
USING (true);
```

---

## 📋 COMPLETE RLS SETUP SCRIPT

### **Copy and run this entire script in Supabase SQL Editor**:

```sql
-- ============================================
-- PROPERTIES TABLE RLS POLICIES
-- ============================================
-- These policies control who can insert, update, delete, and view properties

-- 1. Enable RLS (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can view all properties" ON properties;

-- 3. CREATE NEW POLICIES

-- INSERT: Authenticated users can add properties (landlord_id must match user)
CREATE POLICY "Users can insert their own properties"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = landlord_id);

-- UPDATE: Users can update their own properties
CREATE POLICY "Users can update their own properties"
ON properties
FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

-- DELETE: Users can delete their own properties
CREATE POLICY "Users can delete their own properties"
ON properties
FOR DELETE
TO authenticated
USING (auth.uid() = landlord_id);

-- SELECT: Everyone can view active properties (for browse page)
CREATE POLICY "Anyone can view active properties"
ON properties
FOR SELECT
TO public
USING (status = 'active');

-- SELECT: Authenticated users can view ALL their own properties (including inactive)
CREATE POLICY "Users can view their own properties"
ON properties
FOR SELECT
TO authenticated
USING (auth.uid() = landlord_id);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check that policies are created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'properties';
```

---

## 🧪 TESTING AFTER FIX

### **Test 1: Submit Form**
1. Fill out property form completely
2. Click "Add Property"
3. **Expected**: Success toast ✅
4. **Expected**: Redirect to dashboard ✅
5. **Expected**: Property appears in list ✅

### **Test 2: Check Database**
```sql
-- Verify property was inserted
SELECT id, title, landlord_id, status, created_at
FROM properties
ORDER BY created_at DESC
LIMIT 5;
```

### **Test 3: Update Property**
1. Edit existing property
2. Change title or price
3. Save changes
4. **Expected**: Update successful ✅

### **Test 4: Delete Property**
1. Click delete on own property
2. Confirm deletion
3. **Expected**: Property deleted ✅

---

## 🔒 SECURITY CONSIDERATIONS

### **What These Policies Ensure**:

✅ **Users can only add properties as themselves**
- `landlord_id` must match their `auth.uid()`
- Cannot impersonate other users

✅ **Users can only edit their own properties**
- Can't update properties belonging to others
- Can't change `landlord_id` to someone else

✅ **Users can only delete their own properties**
- Can't delete other people's listings
- Admin access would need separate policy

✅ **Public can browse active properties**
- Browse page works for everyone
- Inactive properties hidden from public

✅ **Users can see all their own properties**
- Dashboard shows active + inactive
- Can manage their full portfolio

---

## 📊 RLS POLICY MATRIX

| Action | Who | Condition | Result |
|--------|-----|-----------|--------|
| INSERT | Authenticated | `landlord_id = auth.uid()` | ✅ Allowed |
| INSERT | Authenticated | `landlord_id ≠ auth.uid()` | ❌ Blocked |
| UPDATE | Authenticated | Own property | ✅ Allowed |
| UPDATE | Authenticated | Other's property | ❌ Blocked |
| DELETE | Authenticated | Own property | ✅ Allowed |
| DELETE | Authenticated | Other's property | ❌ Blocked |
| SELECT | Public | `status = 'active'` | ✅ Allowed |
| SELECT | Authenticated | Own properties | ✅ Allowed |

---

## 🚨 COMMON RLS MISTAKES TO AVOID

### **1. Forgetting WITH CHECK**
```sql
-- ❌ WRONG (allows inserting with any landlord_id)
CREATE POLICY "bad_policy"
ON properties FOR INSERT TO authenticated;

-- ✅ CORRECT (enforces landlord_id check)
CREATE POLICY "good_policy"
ON properties FOR INSERT TO authenticated
WITH CHECK (auth.uid() = landlord_id);
```

### **2. Using `anon` Instead of `authenticated`**
```sql
-- ❌ WRONG (allows anonymous users)
CREATE POLICY "bad_policy"
ON properties FOR INSERT TO anon;

-- ✅ CORRECT (only logged-in users)
CREATE POLICY "good_policy"
ON properties FOR INSERT TO authenticated;
```

### **3. Not Enabling RLS**
```sql
-- ❌ WRONG (no security at all!)
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;

-- ✅ CORRECT (security enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
```

---

## 🔍 DEBUGGING RLS ISSUES

### **Check if RLS is Enabled**:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'properties';
```

**Expected**: `rowsecurity = true`

### **List All Policies**:
```sql
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'properties';
```

### **Test Policy as User**:
```sql
-- Impersonate a specific user for testing
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "USER_UUID_HERE"}';

-- Try to insert
INSERT INTO properties (landlord_id, title, ...) 
VALUES ('USER_UUID_HERE', 'Test Property', ...);

-- Reset
RESET ROLE;
```

---

## 📝 AFTER APPLYING FIX

### **What Will Work**:
1. ✅ Add Property form submission
2. ✅ Edit existing properties
3. ✅ Delete own properties
4. ✅ Browse page (public viewing)
5. ✅ Dashboard property list

### **What Will Still Be Protected**:
1. ✅ Users can't add properties as other users
2. ✅ Users can't edit other users' properties
3. ✅ Users can't delete other users' properties
4. ✅ Public can't see inactive properties
5. ✅ All data is secure

---

## 🎯 IMMEDIATE ACTION REQUIRED

### **Steps to Fix**:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste SQL Script**
   - Copy the "COMPLETE RLS SETUP SCRIPT" above
   - Paste into SQL editor

4. **Run the Script**
   - Click "Run" button
   - Wait for success message

5. **Verify Policies Created**
   - Check that all 5 policies appear
   - No errors in output

6. **Test Form Submission**
   - Go back to your app
   - Try submitting property form
   - Should now work! ✅

---

## ⚠️ TRANSLATION ISSUE (SECONDARY)

### **Issue**: 
Form shows "Email" instead of "Namba ya Simu" for contact phone field.

### **Cause**:
Translation key `t('dashboard.contactPhone')` may be mapped incorrectly.

### **Fix** (If needed):
Check your translation file (`src/locales/sw.json` or similar):

```json
{
  "dashboard": {
    "contactPhone": "Namba ya Simu",
    "contactPhoneDescription": "Weka namba ya simu ili wapangaji waweze kuwasiliana nawe"
  }
}
```

**OR** hardcode the label temporarily:
```typescript
<Label>Namba ya Simu *</Label>
```

---

## ✅ SUMMARY

**Problem**: 403 Forbidden when submitting property  
**Cause**: Missing RLS INSERT policy  
**Solution**: Add RLS policies via SQL  
**Priority**: 🔴 **CRITICAL - BLOCKS ALL SUBMISSIONS**

**Required Action**:
1. Run SQL script in Supabase
2. Test form submission
3. Verify policies working

**After Fix**:
- ✅ Form submissions work
- ✅ Users can manage properties
- ✅ Data remains secure
- ✅ Public can browse safely

**INAFAA KUTENGENEZA RLS POLICIES KWENYE SUPABASE DATABASE! 🔒**

---

*Last Updated: 2026-09-04*  
*Priority: CRITICAL*  
*Requires: Database Admin Access*  
*Status: 🔴 AWAITING DATABASE FIX*
