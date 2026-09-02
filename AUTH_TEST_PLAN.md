# Authentication Testing Plan ✅

## Current Authentication Status

### ✅ What's Implemented
1. **Auth Hook** (`useAuth.tsx`)
   - Sign up with email/password
   - Sign in with email/password  
   - Sign out with session cleanup
   - Auto profile creation via database trigger
   - Rate limiting protection
   - Input validation and sanitization
   - CSRF protection ready

2. **Sign Up Page** (`SignUp.tsx`)
   - Full name, email, phone, password fields
   - Password confirmation
   - Only for landlords (hardcoded userType = 'landlord')
   - Auto-redirect to dashboard after signup
   - Validation for matching passwords
   - Beautiful UI with animations

3. **Sign In Page** (`SignIn.tsx`)
   - Email and password fields
   - Remember me checkbox
   - Forgot password link (route exists?)
   - Auto-redirect based on user type
   - Show/hide password toggle

4. **Database Setup**
   - `auth.users` table (Supabase managed)
   - `profiles` table with trigger
   - RLS policies for authenticated users
   - Anonymous viewing enabled for properties

### 🔐 Security Features
- ✅ Password strength validation (min 8 chars)
- ✅ Email format validation
- ✅ Input sanitization
- ✅ Rate limiting (signup/login attempts)
- ✅ CSRF token support
- ✅ Secure session management
- ✅ RLS policies on all tables

---

## Testing Checklist

### Test 1: Sign Up Flow (Landlord)
**URL:** http://localhost:8081/signup

1. Navigate to signup page
2. Fill in form:
   - Full Name: "John Doe"
   - Email: "john.landlord@gmail.com"
   - Phone: "+255 712 345 678"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
3. Click "Register as Landlord"
4. **Expected Result:**
   - ✅ Success toast: "Umefanikiwa kujisajili!"
   - ✅ Auto-redirect to `/dashboard`
   - ✅ Profile created in `profiles` table
   - ✅ User created in `auth.users`
   - ✅ user_type = 'landlord'

**Test with browser console:**
```javascript
// After signup, check user state
console.log('User:', JSON.parse(localStorage.getItem('sb-tegsmahtigsrgjvsnzef-auth-token')));
```

---

### Test 2: Sign In Flow (Existing User)
**URL:** http://localhost:8081/signin

1. Navigate to signin page
2. Fill in form:
   - Email: "john.landlord@gmail.com"
   - Password: "SecurePass123!"
3. Click "Sign In"
4. **Expected Result:**
   - ✅ Success toast: "Umefanikiwa kuingia!"
   - ✅ Redirect to dashboard (if landlord)
   - ✅ Session created
   - ✅ User object populated

---

### Test 3: Sign Out Flow
**Location:** Navigation menu (user dropdown)

1. While logged in, click user avatar/dropdown
2. Click "Sign Out"
3. **Expected Result:**
   - ✅ Success toast: "Umetoka nje"
   - ✅ Redirect to `/browse` (landlords)
   - ✅ Session cleared
   - ✅ User state set to null

---

### Test 4: Protected Routes
**Test access without authentication:**

1. **Dashboard** (`/dashboard`)
   - Without login → Should redirect to signin
   - With landlord account → Should show dashboard
   - With student account → Should redirect to home

2. **Favorites** (`/favorites`)
   - Without login → Should redirect to signin
   - With login → Should show favorites

---

### Test 5: Already Authenticated Redirect

1. Log in as landlord
2. Try to access `/signin` or `/signup`
3. **Expected Result:**
   - ✅ Auto-redirect to dashboard
   - ✅ Toast message (optional)

---

### Test 6: Password Validation

**Test weak passwords on signup:**

1. Try password: "12345" 
   - ❌ Should fail: "Too short"
2. Try password: "password"
   - ❌ Should fail: "Too weak"
3. Try password: "SecurePass123!"
   - ✅ Should succeed

---

### Test 7: Email Validation

**Test invalid emails on signup/signin:**

1. Try email: "notanemail"
   - ❌ Should fail: "Invalid email format"
2. Try email: "test@"
   - ❌ Should fail: "Invalid email format"
3. Try email: "valid@email.com"
   - ✅ Should succeed

---

### Test 8: Password Mismatch

**On signup page:**

1. Password: "SecurePass123!"
2. Confirm Password: "DifferentPass123!"
3. Click submit
4. **Expected Result:**
   - ❌ Alert: "Nywila hazifanani"
   - Form not submitted

---

### Test 9: Rate Limiting

**Test too many attempts:**

1. Try to sign in with wrong password 5+ times quickly
2. **Expected Result:**
   - ❌ Toast: "Umejaribu mara nyingi sana. Jaribu tena baadaye."
   - Further attempts blocked temporarily

---

### Test 10: Session Persistence

1. Log in successfully
2. Refresh the page (F5)
3. **Expected Result:**
   - ✅ User still logged in
   - ✅ No redirect to signin
   - ✅ Session restored from localStorage

---

### Test 11: Profile Creation Trigger

**After signup, check database:**

```sql
-- Check if profile was created automatically
SELECT * FROM profiles WHERE email = 'john.landlord@gmail.com';

-- Expected fields:
-- user_id: UUID (matches auth.users.id)
-- full_name: "John Doe"
-- email: "john.landlord@gmail.com"
-- phone: "+255 712 345 678"
-- user_type: "landlord"
-- verification_status: "pending"
```

---

### Test 12: RLS Policies

**Test Row Level Security:**

1. **As anonymous user:**
   - ✅ Can view active properties
   - ❌ Cannot create/edit properties
   - ❌ Cannot view profiles (except landlords)

2. **As authenticated landlord:**
   - ✅ Can create properties
   - ✅ Can edit own properties
   - ❌ Cannot edit other landlords' properties
   - ✅ Can view own profile
   - ❌ Cannot edit other profiles

---

## Manual Test Script

### Step-by-Step Test Execution

```bash
# 1. Ensure dev server is running
# Open http://localhost:8081

# 2. Test Anonymous Access
# - Browse page should show 20 properties ✅
# - Click "Sign Up" → Should load signup page ✅

# 3. Test Sign Up
# - Fill form with valid data
# - Submit → Should redirect to dashboard ✅
# - Check browser console for any errors ❌

# 4. Test Dashboard Access
# - Should see landlord dashboard ✅
# - Should see "Add Property" button ✅

# 5. Test Sign Out
# - Click user dropdown → Sign Out ✅
# - Should redirect to /browse ✅

# 6. Test Sign In
# - Navigate to /signin
# - Enter credentials from step 3
# - Submit → Should redirect to dashboard ✅

# 7. Test Protected Route
# - Sign out
# - Try to access /dashboard directly
# - Should redirect to /signin ✅
```

---

## Database Verification Queries

### Check User Creation
```sql
-- 1. Check auth.users table
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'john.landlord@gmail.com';

-- 2. Check profiles table
SELECT * FROM profiles 
WHERE email = 'john.landlord@gmail.com';

-- 3. Check if profile.user_id matches auth.users.id
SELECT 
  u.id as user_id,
  u.email as auth_email,
  p.user_id as profile_user_id,
  p.email as profile_email,
  p.user_type
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'john.landlord@gmail.com';
```

### Check Session
```sql
-- View active sessions
SELECT * FROM auth.sessions 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'john.landlord@gmail.com'
);
```

---

## Common Issues & Fixes

### Issue 1: "User not authenticated" after signup
**Cause:** Profile creation trigger failed or RLS policy blocking
**Fix:**
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Manually create profile if needed
INSERT INTO profiles (user_id, email, full_name, user_type, phone)
VALUES (
  '<user_id_from_auth.users>',
  'john.landlord@gmail.com',
  'John Doe',
  'landlord',
  '+255 712 345 678'
);
```

### Issue 2: Cannot access dashboard after login
**Cause:** Redirect logic not working or user_type not set
**Fix:**
```sql
-- Check user type
SELECT user_type FROM profiles WHERE email = 'john.landlord@gmail.com';

-- Update if wrong
UPDATE profiles SET user_type = 'landlord' 
WHERE email = 'john.landlord@gmail.com';
```

### Issue 3: "Too many attempts" error
**Cause:** Rate limiter triggered
**Fix:** Wait 5-10 minutes or clear localStorage
```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## Browser DevTools Checks

### 1. Network Tab
- Check for auth API calls to Supabase
- Look for 200/201 responses on signup/signin
- Check for proper session tokens in responses

### 2. Console Tab
- No red errors ✅
- Look for success messages:
  - "🚀 Properties API: XXXms ✅"
  - User object logged

### 3. Application Tab → Local Storage
- Key: `sb-tegsmahtigsrgjvsnzef-auth-token`
- Should contain: access_token, refresh_token, user object

### 4. Network → Response for auth calls
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "john.landlord@gmail.com",
    "user_metadata": {
      "full_name": "John Doe",
      "user_type": "landlord"
    }
  }
}
```

---

## Success Criteria

### ✅ Authentication is working if:

1. ✅ Can sign up new landlord
2. ✅ Profile is created automatically
3. ✅ Can sign in with credentials
4. ✅ Dashboard redirects work correctly
5. ✅ Can sign out successfully
6. ✅ Session persists on refresh
7. ✅ Protected routes redirect to signin
8. ✅ Anonymous users can browse properties
9. ✅ No console errors
10. ✅ Toast notifications show properly

---

## Next Steps After Verification

If authentication is working:
1. ✅ Test property creation (landlord)
2. ✅ Test favorites (requires auth)
3. ✅ Test bookings (requires auth)
4. ✅ Test profile editing
5. ✅ Test landlord dashboard features

---

## Test User Credentials (for testing)

You can create these test accounts:

```
Landlord 1:
Email: landlord1@test.com
Password: TestPass123!
Name: Jane Landlord
Phone: +255 712 111 111

Landlord 2:
Email: landlord2@test.com
Password: TestPass123!
Name: Bob Properties
Phone: +255 712 222 222

Student:
Email: student1@test.com (use @udsm.ac.tz for auto-detection)
Password: TestPass123!
Name: Alice Student
Phone: +255 712 333 333
```

---

**READY TO TEST!** 🚀

Open your browser and start with Test 1: Sign Up Flow.
