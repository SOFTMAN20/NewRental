# ADMIN DASHBOARD - QUICK START GUIDE ⚡
## Get Your Admin Dashboard Running in 5 Minutes

### 🎯 WHAT YOU GET

A complete admin dashboard to manage your Nyumba Link platform:
- 👥 User Management (view, edit roles, verify users)
- 🏠 Property Management (view, activate/deactivate, delete)
- 📊 Analytics (growth metrics, top locations, price statistics)
- ⚙️ Settings (platform configuration, email settings, security)

---

## ⚡ 3-STEP SETUP

### STEP 1: Setup Database (2 minutes)

Open your Supabase SQL Editor and run this:

```sql
-- Add columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' 
CHECK (role IN ('student', 'landlord', 'admin', 'super_admin'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' 
CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);

-- Make yourself an admin (CHANGE THE EMAIL!)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'YOUR_EMAIL@example.com';

-- Admin access policies
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage all properties" ON properties
FOR ALL TO authenticated
USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')));
```

### STEP 2: Access Dashboard (1 minute)

1. Sign in to your platform with the admin email
2. Click your profile icon (top right)
3. Click "Admin Dashboard" (purple with shield icon)
4. You're in! 🎉

### STEP 3: Explore Features (2 minutes)

Click through the 5 tabs:
1. **Overview** - See your platform stats
2. **Users** - Manage all users
3. **Properties** - Control all listings
4. **Analytics** - View growth and trends
5. **Settings** - Configure platform

---

## 📍 WHERE EVERYTHING IS

### Files Created
```
src/pages/Admin.tsx                      ← Main admin page
src/components/admin/AdminOverview.tsx   ← Statistics dashboard
src/components/admin/AdminUsers.tsx      ← User management
src/components/admin/AdminProperties.tsx ← Property management
src/components/admin/AdminAnalytics.tsx  ← Analytics & reports
src/components/admin/AdminSettings.tsx   ← Platform settings
```

### Files Modified
```
src/App.tsx                              ← Added /admin route
src/components/layout/Navigation.tsx     ← Added admin menu link
```

---

## 🎮 HOW TO USE

### View Statistics
1. Go to **Overview** tab
2. See all platform metrics at a glance
3. Check weekly growth numbers

### Manage Users
1. Go to **Users** tab
2. Search for a user (name, email, phone)
3. Click edit icon (✏️)
4. Change role or verification status
5. Click "Save"

### Manage Properties
1. Go to **Properties** tab
2. Search or filter properties
3. Actions available:
   - 👁️ View details
   - ✅/❌ Toggle availability
   - 🗑️ Delete property

### View Analytics
1. Go to **Analytics** tab
2. See growth trends
3. Check top locations
4. View price statistics

### Configure Settings
1. Go to **Settings** tab
2. Update platform information
3. Toggle features on/off
4. Configure security settings

---

## 🔐 USER ROLES

| Role | Can Access Dashboard | Can Edit Users | Can Delete Properties |
|------|---------------------|----------------|----------------------|
| Student | ❌ | ❌ | ❌ |
| Landlord | ❌ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ |
| Super Admin | ✅ | ✅ | ✅ |

---

## ⚠️ IMPORTANT REMINDERS

1. **Change the email** in Step 1 to YOUR email address
2. **Test in development** before going to production
3. **Keep admin credentials secure**
4. **Limit number of admins** (only trusted users)
5. **Check RLS policies** work correctly

---

## 🐛 TROUBLESHOOTING

### Can't see "Admin Dashboard" in menu?
→ Check your role in database: `SELECT role FROM profiles WHERE email = 'your@email.com'`

### Getting "Access Denied"?
→ Your role must be 'admin' or 'super_admin'

### Statistics not showing?
→ Refresh the page, check browser console for errors

### Can't update users?
→ Verify RLS policies were created correctly

---

## ✅ VERIFICATION CHECKLIST

- [ ] Database columns added
- [ ] Indexes created
- [ ] Your user set to admin role
- [ ] RLS policies created
- [ ] Can log in as admin
- [ ] See "Admin Dashboard" in menu
- [ ] Can access /admin URL
- [ ] Overview tab shows stats
- [ ] Can search users
- [ ] Can edit user role
- [ ] Can view properties
- [ ] Analytics display correctly

---

## 🎉 YOU'RE DONE!

Your admin dashboard is ready to use. Explore all the features and manage your platform effectively!

**Need more details?** Check these files:
- `ADMIN_DASHBOARD_COMPLETE.md` - Full documentation
- `ADMIN_DASHBOARD_SETUP.md` - Detailed setup guide

---

**Questions?**  
Email: support@nyumbalink.co.tz  
Phone: +255 750 929 317

**Asante sana! / Thank you!**
