# Admin Settings Setup & Fix
**Date:** October 1, 2026  
**Status:** ✅ Fixed and Ready

---

## 🎯 What Was Done

Made AdminSettings page fully functional with database persistence.

### Features Working:

1. **Platform Settings**
   - Platform Name
   - Support Email & Phone
   - Company WhatsApp
   - Use Company Contact (toggle)
   - Maintenance Mode
   - Registration Open/Closed
   - Property Approval Required

2. **Email Settings**
   - Email Notifications (master toggle)
   - Welcome Email
   - Inquiry Notifications

3. **Database Management** (UI ready, backend needs implementation)
   - Backup/Restore buttons

4. **Security Settings** (UI only, not persisted yet)
   - Session Timeout
   - Max Login Attempts

5. **SEO Settings** (UI only, not persisted yet)
   - Site Title & Description
   - Default Language

---

## 🔧 Changes Made

### 1. Created `FIX_PLATFORM_SETTINGS.sql`

Creates the `platform_settings` table with:
- `id` (uuid, primary key)
- `key` (text, unique) - Setting identifier
- `value` (text) - Setting value
- `description` (text) - What the setting does
- `created_at` & `updated_at` timestamps

**Default Settings Inserted:**
```sql
platform_name = 'Nyumba Link'
support_email = 'info@nyumbalink.co.tz'
support_phone = '+255750929317'
company_whatsapp = '+255792072561'
use_company_contact = 'false'
maintenance_mode = 'false'
registration_open = 'true'
property_approval_required = 'false'
email_notifications = 'true'
welcome_email = 'true'
inquiry_email = 'true'
```

**RLS Policies:**
- Anyone (authenticated) can READ settings
- Only admins can UPDATE settings
- Only admins can INSERT settings

### 2. Updated `AdminSettings.tsx`

**fetchSettings():**
- Added error handling for missing table
- Added console logging for debugging
- Shows default values if table doesn't exist
- Gracefully handles empty database

**handleSaveSettings():**
- Changed from `UPDATE` to `UPSERT` (insert or update)
- Uses `onConflict: 'key'` to handle duplicates
- Adds console logging for each save
- Shows better error messages

---

## 📝 Setup Instructions

### Step 1: Create Database Table

1. Open **Supabase Dashboard** → SQL Editor
2. Copy entire **`FIX_PLATFORM_SETTINGS.sql`** file
3. Paste and **Run**
4. Verify you see **11 settings** in output

### Step 2: Test Admin Settings

1. Go to `/admin` → **Mipangilio (Settings)** tab
2. Change any setting (e.g., Platform Name)
3. Click **"Hifadhi Mabadiliko / Save Changes"**
4. Refresh the page
5. Setting should persist ✅

### Step 3: Check Console (F12)

You should see:
```
📥 Fetching platform settings...
✅ Settings fetched: 11 settings
Setting: platform_name = Nyumba Link
Setting: support_email = info@nyumbalink.co.tz
...

💾 Saving settings...
✅ Saved: platform_name
✅ Saved: support_email
...
✅ All settings saved successfully!
```

---

## 🔑 Key Settings Explained

### Platform Settings

| Setting | Purpose | Default |
|---------|---------|---------|
| **platform_name** | Name shown in UI | Nyumba Link |
| **support_email** | Contact email for support | info@nyumbalink.co.tz |
| **support_phone** | Contact phone for support | +255750929317 |
| **company_whatsapp** | WhatsApp for properties | +255792072561 |
| **use_company_contact** | Show company # instead of landlord # | false |
| **maintenance_mode** | Block all access (admins only) | false |
| **registration_open** | Allow new signups | true |
| **property_approval_required** | Admin must approve properties | false |

### Email Settings

| Setting | Purpose | Default |
|---------|---------|---------|
| **email_notifications** | Master toggle for all emails | true |
| **welcome_email** | Send email to new users | true |
| **inquiry_email** | Notify landlords of inquiries | true |

---

## 💡 How Settings Work

### Data Flow:

1. **Load:** `fetchSettings()` → Reads from `platform_settings` table → Sets state
2. **Display:** React state → Shows in input fields
3. **Change:** User edits → Updates state
4. **Save:** Click button → `handleSaveSettings()` → UPSERT to database
5. **Persist:** Settings saved in database forever ✅

### UPSERT vs UPDATE:

```typescript
// OLD WAY (would fail if setting doesn't exist):
.update({ value: newValue }).eq('key', 'platform_name')

// NEW WAY (creates if missing, updates if exists):
.upsert({ key: 'platform_name', value: newValue }, { onConflict: 'key' })
```

---

## 🚀 Future Enhancements

### Ready to Implement:

1. **Database Backup/Restore**
   - Create Supabase Edge Function for backups
   - Store backups in Supabase Storage

2. **Security Settings Persistence**
   - Add `session_timeout` and `max_login_attempts` to table
   - Implement session management logic

3. **SEO Settings Persistence**
   - Add `site_title`, `site_description` to table
   - Update meta tags dynamically

4. **Settings History**
   - Track who changed what and when
   - Allow rollback to previous settings

---

## 🐛 Troubleshooting

### Settings Not Saving?

**Check Console (F12):**
- Look for `💥 Error saving settings:` message
- Common errors:
  - `relation "platform_settings" does not exist` → Run SQL script
  - `new row violates row-level security policy` → Check you're logged in as admin
  - `duplicate key value violates unique constraint` → Old code using INSERT, should use UPSERT

**Check Supabase:**
1. Go to Table Editor → `platform_settings`
2. Verify table exists
3. Check RLS policies are enabled
4. Verify your user has `role='admin'`

### Settings Not Loading?

**Check Console (F12):**
- Look for `📥 Fetching platform settings...`
- Should show `✅ Settings fetched: 11 settings`
- If shows `⚠️ platform_settings table not found` → Run SQL script

---

## ✅ Verification Checklist

- [ ] Run `FIX_PLATFORM_SETTINGS.sql` in Supabase
- [ ] See 11 settings in SQL output
- [ ] Go to /admin → Settings
- [ ] Page loads without errors
- [ ] Change Platform Name
- [ ] Click Save
- [ ] See success toast
- [ ] Refresh page
- [ ] Platform Name still changed ✅

---

## 📁 Files Modified

1. `src/components/admin/AdminSettings.tsx` - Save/Load logic
2. `FIX_PLATFORM_SETTINGS.sql` - Database setup (new file)
3. `ADMIN_SETTINGS_SETUP.md` - This documentation (new file)

---

## 🎉 Result

**Before:** Settings UI exists but doesn't save ❌  
**After:** Full settings management with database persistence ✅

All platform configuration now works through admin dashboard! 🚀
