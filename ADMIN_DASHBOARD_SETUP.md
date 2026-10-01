# ADMIN DASHBOARD SETUP GUIDE
## Mwongozo wa Kuanzisha Dashibodi ya Msimamizi

### 📋 OVERVIEW / MUHTASARI

This guide explains how to set up and use the new Admin Dashboard for the Nyumba Link platform.

Mwongozo huu unaeleza jinsi ya kuanzisha na kutumia Dashibodi mpya ya Msimamizi kwa jukwaa la Nyumba Link.

---

## 🔧 DATABASE SETUP / MIPANGILIO YA DATABASE

### Step 1: Add Role Column to Profiles Table

You need to add a `role` column to the `profiles` table in Supabase. Run this SQL in your Supabase SQL Editor:

```sql
-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'admin', 'super_admin'));

-- Add verification_status column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));

-- Update existing landlords to have landlord role
UPDATE profiles 
SET role = 'landlord'
WHERE id IN (SELECT DISTINCT landlord_id FROM properties);

-- Create an index for faster role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
```

### Step 2: Set Admin Users

To make a user an admin, run this SQL (replace the email with actual admin email):

```sql
-- Make a specific user an admin
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@example.com';

-- Or make a user a super admin (highest privilege)
UPDATE profiles 
SET role = 'super_admin'
WHERE email = 'superadmin@example.com';
```

### Step 3: Update RLS Policies

Update the Row Level Security policies to allow admins to manage all data:

```sql
-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Allow admins to read all properties
CREATE POLICY "Admins can read all properties" ON properties
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Allow admins to update all properties
CREATE POLICY "Admins can update all properties" ON properties
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- Allow admins to delete any property
CREATE POLICY "Admins can delete any property" ON properties
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);
```

---

## 📱 FEATURES / VIPENGELE

### 1. Overview Dashboard / Dashibodi ya Muhtasari
- Total users, landlords, and students statistics
- Property statistics (total, active, rented)
- Recent growth metrics (last 7 days)
- Quick action cards

**Takwimu:**
- Jumla ya watumiaji, wenye nyumba, na wanafunzi
- Takwimu za mali (jumla, zinazopatikana, zimepangwa)
- Ukuaji wa hivi karibuni (siku 7 zilizopita)

### 2. User Management / Usimamizi wa Watumiaji
- View all users with their details
- Search by name, email, or phone
- Filter by role (student, landlord, admin)
- Edit user roles and verification status
- View property count for landlords

**Uwezo:**
- Angalia watumiaji wote na maelezo yao
- Tafuta kwa jina, email, au simu
- Chuja kwa wadhifa
- Hariri wadhifa na hali ya uthibitisho
- Angalia idadi ya mali kwa wenye nyumba

### 3. Property Management / Usimamizi wa Mali
- View all properties on the platform
- Search properties by title, location, or landlord
- Filter by status (active, rented, pending)
- Toggle property availability
- Delete problematic listings
- View property details

**Uwezo:**
- Angalia mali zote kwenye jukwaa
- Tafuta mali kwa jina, eneo, au mwenye nyumba
- Chuja kwa hali (inatumika, imepangwa, inasubiri)
- Badilisha upatikanaji wa mali
- Futa matangazo ya matatizo
- Angalia maelezo ya mali

### 4. Analytics / Takwimu
- User growth metrics (monthly comparison)
- Property growth metrics
- Top locations by property count
- Average, minimum, and maximum prices
- Property type distribution
- Monthly inquiry statistics

**Takwimu:**
- Ukuaji wa watumiaji (kulinganisha kila mwezi)
- Ukuaji wa mali
- Maeneo maarufu kwa idadi ya mali
- Bei ya wastani, ya chini, na ya juu
- Usambazaji wa aina za mali
- Takwimu za maswali ya kila mwezi

### 5. Platform Settings / Mipangilio ya Jukwaa
- Platform name and contact information
- Maintenance mode toggle
- Registration controls
- Property approval workflow
- Email notification settings
- Security settings (session timeout, login attempts)
- SEO and localization settings

**Mipangilio:**
- Jina la jukwaa na maelezo ya mawasiliano
- Hali ya matengenezo
- Udhibiti wa usajili
- Mchakato wa idhini ya mali
- Mipangilio ya arifa za barua pepe
- Mipangilio ya usalama
- Mipangilio ya SEO na lugha

---

## 🚀 ACCESSING THE ADMIN DASHBOARD / KUINGIA KWENYE DASHIBODI

### For Users / Kwa Watumiaji:
1. Log in to your account
2. If you have admin role, navigate to `/admin`
3. You will see the admin dashboard with all tabs

### For Non-Admin Users:
- Non-admin users will see an access denied message
- They will be redirected to their regular dashboard

### URL Structure:
- Main Dashboard: `https://yourdomain.com/admin`
- All admin features are accessible via tabs within the single admin page

---

## 🔐 SECURITY CONSIDERATIONS / MAMBO YA USALAMA

### Access Control / Udhibiti wa Ufikiaji:
- Only users with `admin` or `super_admin` role can access the dashboard
- Authentication is required for all admin operations
- Non-admin users are automatically redirected

### Role Hierarchy / Utaratibu wa Wadhifa:
1. **Super Admin**: Highest privilege, can manage everything including other admins
2. **Admin**: Can manage users and properties, but not other admins
3. **Landlord**: Regular landlord with property management rights
4. **Student**: Regular student user

### Best Practices / Mbinu Bora:
- Limit the number of admin users
- Use strong passwords for admin accounts
- Regularly audit admin actions
- Keep admin credentials secure
- Monitor unusual admin activity

---

## 📊 COMMON ADMIN TASKS / KAZI ZA KAWAIDA ZA MSIMAMIZI

### 1. Verify a Landlord
1. Go to "Users" tab
2. Search for the landlord
3. Click the edit icon
4. Change verification status to "Verified"
5. Click "Save"

### 2. Deactivate a Property
1. Go to "Properties" tab
2. Search for the property
3. Click the toggle availability icon
4. Property will be marked as unavailable

### 3. Delete Spam Property
1. Go to "Properties" tab
2. Find the problematic property
3. Click the delete icon
4. Confirm deletion

### 4. Promote User to Admin
1. Go to "Users" tab
2. Find the user
3. Click edit icon
4. Change role to "admin"
5. Save changes

### 5. View Platform Statistics
1. Go to "Overview" tab
2. View all statistics at a glance
3. For detailed analytics, go to "Analytics" tab

---

## 🛠️ TROUBLESHOOTING / KUSULUHISHA MATATIZO

### Problem: Can't Access Admin Dashboard
**Solution:**
- Check if your user has admin or super_admin role in the database
- Verify you are logged in
- Clear browser cache and try again

### Problem: Can't See All Users/Properties
**Solution:**
- Check RLS policies in Supabase
- Ensure admin policies are properly set
- Verify your role is correctly set in the database

### Problem: Changes Not Saving
**Solution:**
- Check browser console for errors
- Verify Supabase connection
- Ensure you have proper permissions

---

## 📝 FUTURE ENHANCEMENTS / MABORESHO YA BAADAYE

Planned features for future versions:

1. **Activity Logs**: Track all admin actions
2. **Bulk Operations**: Edit multiple users/properties at once
3. **Advanced Filters**: More filtering options
4. **Export Data**: Export statistics and reports
5. **Email Templates**: Customize email notifications
6. **Real-time Updates**: WebSocket for live data
7. **User Reports**: Handle user-reported content
8. **Payment Management**: Track and manage payments
9. **Advanced Analytics**: Charts and graphs
10. **Mobile Admin App**: Native mobile admin app

---

## 📞 SUPPORT / MSAADA

If you need help with the admin dashboard:

**Technical Support:**
- Email: support@nyumbalink.co.tz
- Phone: +255 750 929 317

**Documentation:**
- Check project documentation in `/docs` folder
- Review database schema in Supabase

---

## ✅ IMPLEMENTATION CHECKLIST / ORODHA YA UTEKELEZAJI

- [ ] Run database migration SQL scripts
- [ ] Set at least one user as admin
- [ ] Update RLS policies for admin access
- [ ] Test admin dashboard access
- [ ] Test user management features
- [ ] Test property management features
- [ ] Verify analytics are displaying correctly
- [ ] Test settings page functionality
- [ ] Set up email notifications (if needed)
- [ ] Document admin procedures for your team

---

**Created by**: StarLabs AI  
**Date**: 2026  
**Version**: 1.0  
**Platform**: Nyumba Link - Tanzania Housing Platform

---

*Imeandaliwa kwa ajili ya jamii ya Tanzania*  
*Prepared for the Tanzanian community*
