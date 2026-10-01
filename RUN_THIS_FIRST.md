# 🚀 RUN THIS FIRST - Admin Dashboard Setup

## ⚡ Quick Setup (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your project: `tegsmahtigsrgjvsnzef`

### Step 2: Run the Migration
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query** button
3. Open the file `admin_dashboard_migration.sql` from this folder
4. **IMPORTANT**: Before running, find this section around line 40:

```sql
-- Example: Make a user an admin
-- UPDATE profiles 
-- SET role = 'admin'
-- WHERE email = 'admin@example.com';
```

5. **Uncomment and change the email** to YOUR email:

```sql
-- Example: Make a user an admin
UPDATE profiles 
SET role = 'admin'
WHERE email = 'YOUR_ACTUAL_EMAIL@example.com';
```

6. Copy the ENTIRE contents of `admin_dashboard_migration.sql`
7. Paste into the SQL Editor
8. Click **Run** button (or press Ctrl+Enter)

### Step 3: Verify It Worked
You should see output like:
```
Success. No rows returned
Success. No rows returned
...
role       | count
-----------+-------
student    | 25
landlord   | 5
admin      | 1
```

### Step 4: Test Admin Access
1. Go to your website
2. Sign in with the email you made admin
3. Click your profile picture (top right)
4. You should see **"Admin Dashboard"** with a purple badge
5. Click it to access `/admin`

## ✅ Success Checklist
- [ ] Opened Supabase SQL Editor
- [ ] Changed the admin email to YOUR email
- [ ] Ran the migration successfully
- [ ] Signed in to the website
- [ ] See "Admin Dashboard" in user menu
- [ ] Can access /admin page

## ⚠️ Troubleshooting

### "Admin Dashboard" not showing in menu?
→ Check your role: Go to Supabase → Table Editor → profiles → Find your user → Check the `role` column should be `admin`

### Can't access /admin page?
→ Clear your browser cache and sign out/sign in again

### SQL errors when running migration?
→ Some policies might already exist. That's OK! The migration uses `IF NOT EXISTS` to handle this.

## 🎉 You're Done!

Your admin dashboard is ready! Explore these features:
- **Overview**: Platform statistics
- **Users**: Manage all users and roles
- **Properties**: View and control all properties
- **Analytics**: Growth metrics and insights
- **Settings**: Platform configuration

---

**Need help?**  
Check `ADMIN_QUICK_START.md` for detailed usage instructions.
