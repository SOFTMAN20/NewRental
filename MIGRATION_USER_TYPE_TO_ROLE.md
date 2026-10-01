# MIGRATION: user_type → role
## Kubadilisha kutoka user_type kwenda role

### 📋 TATIZO / PROBLEM

Sasa tunayo **columns mbili** kwenye `profiles` table:

1. **user_type** (Zamani) - Values: `'student'`, `'landlord'`, `'tenant'`, `'professional'`
2. **role** (Mpya) - Values: `'student'`, `'landlord'`, `'admin'`, `'super_admin'`

Hii inasababisha:
- ❌ Confusion (Utata)
- ❌ Duplication (Urudiaji)
- ❌ Maintenance issues (Matatizo ya matengenezo)
- ❌ Potential bugs (Bugs zinazoweza kutokea)

### ✅ SULUHISHO / SOLUTION

**Chaguo 1: RETAIN BOTH (Recommended) - Weka zote mbili**

Tumia:
- `user_type` → Kwa UI display na user experience
- `role` → Kwa permissions na access control

**Chaguo 2: USE ROLE ONLY - Tumia role tu**

Ondoa `user_type` na tumia `role` pekee.

---

## 🎯 CHAGUO 1: KEEP BOTH (RECOMMENDED)

### Rationale / Sababu

**user_type:**
- Kwa UI labels (Student, Landlord, Professional)
- Kwa user registration
- Kwa profile display

**role:**
- Kwa permissions (admin, super_admin)
- Kwa access control
- Kwa admin dashboard

### Mapping / Uunganisho

```
user_type → role mapping:
├── student/tenant → student
├── landlord → landlord
├── professional → student (or landlord)
└── (special) → admin/super_admin
```

### Database Sync Strategy

```sql
-- Keep both columns synced
CREATE OR REPLACE FUNCTION sync_user_type_and_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync user_type to role
  IF NEW.user_type IN ('student', 'tenant', 'professional') THEN
    IF NEW.role NOT IN ('admin', 'super_admin') THEN
      NEW.role = CASE 
        WHEN NEW.user_type = 'landlord' THEN 'landlord'
        ELSE 'student'
      END;
    END IF;
  END IF;
  
  -- Sync role to user_type (for non-admins)
  IF NEW.role IN ('student', 'landlord') THEN
    NEW.user_type = NEW.role;
  ELSIF NEW.role IN ('admin', 'super_admin') THEN
    -- Keep existing user_type for admins
    IF NEW.user_type IS NULL THEN
      NEW.user_type = 'landlord';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_user_type_role ON profiles;
CREATE TRIGGER sync_user_type_role
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_type_and_role();
```

### Code Usage Guidelines

**In Frontend Components:**

```typescript
// ✅ For UI display - use user_type
{profile?.user_type === 'landlord' && <Badge>Landlord</Badge>}
{profile?.user_type === 'student' && <Badge>Student</Badge>}

// ✅ For permissions - use role
{profile?.role === 'admin' && <AdminDashboard />}
{(profile?.role === 'admin' || profile?.role === 'super_admin') && <AdminMenu />}

// ✅ For navigation decisions
if (profile?.user_type === 'landlord') {
  navigate('/dashboard');
} else {
  navigate('/browse');
}

// ✅ For admin checks
const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
```

**Best Practices:**

```typescript
// Navigation.tsx
const showBecomeHost = profile?.user_type !== 'landlord';
const showAdminMenu = profile?.role === 'admin' || profile?.role === 'super_admin';

// Dashboard.tsx
const canManageProperties = profile?.user_type === 'landlord' || 
                            profile?.role === 'admin';

// Admin components
const isAuthorized = profile?.role === 'admin' || 
                     profile?.role === 'super_admin';
```

---

## 🎯 CHAGUO 2: USE ROLE ONLY (Alternative)

Ikiwa unataka kutumia `role` tu, hii ni migration:

### Step 1: Update Database

```sql
-- Map existing user_type values to role
UPDATE profiles SET role = 
  CASE 
    WHEN user_type = 'landlord' THEN 'landlord'
    WHEN user_type IN ('student', 'tenant', 'professional') THEN 'student'
    ELSE 'student'
  END
WHERE role IS NULL;

-- Drop user_type column (CAREFUL!)
-- ALTER TABLE profiles DROP COLUMN user_type;
```

### Step 2: Update Code

Replace all instances:

```typescript
// BEFORE
profile?.user_type === 'landlord'

// AFTER  
profile?.role === 'landlord'

// BEFORE
profile?.user_type === 'student'

// AFTER
profile?.role === 'student'
```

**Files to Update:**
1. `src/hooks/useAuth.tsx`
2. `src/components/layout/Navigation.tsx`
3. `src/components/layout/MobileBottomNav.tsx`
4. `src/pages/Dashboard.tsx`
5. `src/pages/Profile.tsx`
6. `src/pages/SignUp.tsx`
7. `src/components/forms/ProfileSettings.tsx`

---

## 📊 COMPARISON / KULINGANISHA

| Aspect | Keep Both | Role Only |
|--------|-----------|-----------|
| Complexity | Medium | Low |
| Flexibility | High | Medium |
| Migration Effort | Low | High |
| Future-proof | ✅ Yes | ⚠️ Limited |
| Admin Support | ✅ Perfect | ✅ Good |
| UI Clarity | ✅ Clear | ⚠️ Need mapping |

---

## 🚀 RECOMMENDED APPROACH / NJIA INAYOPENDEKEZWA

### Use CHAGUO 1: Keep Both

**Why?**
1. ✅ Less code changes needed
2. ✅ Clear separation of concerns
3. ✅ Easy to maintain
4. ✅ Flexible for future needs
5. ✅ Admin system works perfectly

**Implementation Steps:**

### Step 1: Run Sync Migration

```bash
# In Supabase SQL Editor
# Run: sync_user_type_to_role.sql
```

### Step 2: Update Admin Components

Keep using `role` for admin checks:

```typescript
// AdminOverview.tsx, AdminUsers.tsx, etc.
const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
```

### Step 3: Keep Frontend Using user_type

No changes needed! Continue using:

```typescript
// Navigation.tsx, Dashboard.tsx, etc.
{profile?.user_type === 'landlord' && <Component />}
```

### Step 4: Add Helper Hook (Optional)

```typescript
// src/hooks/useUserRole.ts
export const useUserRole = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('user_type, role, verification_status')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  return {
    userType: profile?.user_type,
    role: profile?.role,
    isLandlord: profile?.user_type === 'landlord',
    isStudent: profile?.user_type === 'student',
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    isSuperAdmin: profile?.role === 'super_admin',
    isVerified: profile?.verification_status === 'verified',
  };
};

// Usage
const { isLandlord, isAdmin } = useUserRole();
```

---

## ✅ ACTION ITEMS / HATUA ZA KUFUATA

### Immediate (Haraka):

- [ ] Run `sync_user_type_to_role.sql` in Supabase
- [ ] Verify sync worked with verification queries
- [ ] Test admin dashboard access
- [ ] Test landlord dashboard access
- [ ] Test student profile access

### Short-term (Muda mfupi):

- [ ] Document the dual-column approach
- [ ] Add comments in code explaining usage
- [ ] Create helper hook (useUserRole)
- [ ] Update any new components to follow pattern

### Long-term (Muda mrefu):

- [ ] Consider unifying to role-only if needed
- [ ] Add more granular permissions
- [ ] Implement role-based features

---

## 🔍 VERIFICATION / UTHIBITISHO

### Test Scenarios:

1. **Student User:**
   ```
   user_type: 'student'
   role: 'student'
   ✅ Can browse properties
   ❌ Cannot access admin dashboard
   ❌ Cannot access landlord dashboard
   ```

2. **Landlord User:**
   ```
   user_type: 'landlord'
   role: 'landlord'
   ✅ Can browse properties
   ✅ Can access landlord dashboard
   ✅ Can list properties
   ❌ Cannot access admin dashboard
   ```

3. **Admin User:**
   ```
   user_type: 'landlord' (or any)
   role: 'admin'
   ✅ Can browse properties
   ✅ Can access landlord dashboard
   ✅ Can access admin dashboard
   ✅ Can manage users
   ✅ Can manage properties
   ```

4. **Super Admin User:**
   ```
   user_type: 'landlord' (or any)
   role: 'super_admin'
   ✅ Everything admin can do
   ✅ Can manage other admins
   ```

---

## 📝 SUMMARY / MUHTASARI

**Recommended Solution:**  
✅ **Keep both `user_type` and `role`**

**Reason:**
- Minimal code changes
- Clear purpose for each field
- Easy to maintain
- Flexible for future

**Action:**
1. Run sync migration
2. Test all user types
3. Document the pattern
4. Continue development

---

**Imeandaliwa na StarLabs AI**  
**Tarehe: October 2026**

Hongera! Sasa una strategy wazi ya kutumia user_type na role! 🎉
