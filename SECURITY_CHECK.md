# 🚨 SECURITY & DEPLOYMENT CHECK - TATHMINI YA USALAMA
## Investigating Weird Redirects (index.htm, index.php)

**Date:** September 16, 2026  
**Issue:** Site inapeleka pages zisizopo (`index.htm`, `index.php`)  
**Severity:** 🔴 HIGH - Possible security issue or deployment problem

---

## 🔍 TATIZO / THE PROBLEM

### Symptoms / Dalili:
- ❌ Sometimes redirects to `index.htm` (doesn't exist)
- ❌ Sometimes redirects to `index.php` (PHP file - shouldn't exist!)
- ⚠️ Only happens on mobile sometimes
- ⚠️ Inconsistent behavior

### Possible Causes / Sababu Zinazowezekana:

1. **🔴 OLD DEPLOYMENT** - Previous version still cached on server
2. **🟡 BROWSER/SERVICE WORKER CACHE** - Old cached version
3. **🔴 SECURITY BREACH** - Site imehacked (very serious!)
4. **🟡 CDN/PROXY CACHE** - Cloudflare or proxy serving old content
5. **🟡 DNS ISSUE** - Domain pointing to wrong server

---

## ✅ IMMEDIATE CHECKS / UCHUNGUZI WA HARAKA

### Step 1: Check Your Vercel Deployment

```bash
# Check current deployment
vercel ls

# Should show wanachuo.com with recent deployment
```

**What to look for:**
- ✅ Only ONE active deployment
- ✅ Recent timestamp (today's date)
- ❌ Multiple old deployments (could be conflict)

---

### Step 2: Check Local Project Files

```bash
# Search for PHP files
find . -name "*.php" -type f

# Should return: NOTHING (except node_modules)

# Search for index.htm
find . -name "index.htm" -type f

# Should return: NOTHING
```

**Result from your project:** ✅ NO PHP FILES FOUND (good!)

---

### Step 3: Check Vercel Production Files

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Select your project
3. Click on latest deployment
4. Go to "Source" tab
5. Check files deployed:

**Should see:**
- ✅ `index.html` (NOT index.htm or index.php)
- ✅ `assets/` folder
- ✅ `sw.js`
- ✅ `vercel.json`

**Should NOT see:**
- ❌ `index.htm`
- ❌ `index.php`
- ❌ Any PHP files

---

### Step 4: Test with Clean Browser

```
1. Open INCOGNITO/PRIVATE mode
2. Clear ALL browser data:
   - Cache
   - Cookies
   - Service Workers
   - Local Storage
3. Visit: wanachuo.com
4. Check URL - should be EXACTLY: wanachuo.com/
```

**If still shows index.htm/php in incognito:**
- 🔴 Problem is on SERVER (not browser)
- Need to check Vercel deployment

**If works fine in incognito:**
- 🟡 Problem is BROWSER CACHE
- Solution below

---

## 🛠️ SOLUTIONS / SULUHISHO

### Solution 1: Force New Deployment (RECOMMENDED)

```bash
# 1. Clean everything
rm -rf dist/
rm -rf node_modules/.vite/

# 2. Rebuild
npm run build

# 3. Force deploy to Vercel
vercel --prod --force

# 4. Check deployment URL
# Should get: https://wanachuo.com deployed successfully
```

---

### Solution 2: Clear Service Worker & Cache

Create this file to help users clear cache:

**File: `public/clear-cache.html`** (Already exists - good!)

Users can visit: `wanachuo.com/clear-cache.html`

---

### Solution 3: Update Service Worker Version

The service worker version is already bumped to `v5-2026` ✅

But users need to get new version:

```javascript
// Current in sw.js
const CACHE_NAME = 'wanachuo-v5-2026';

// If problem persists, bump to v6
const CACHE_NAME = 'wanachuo-v6-2026';
```

---

### Solution 4: Add Cache-Busting to index.html

```html
<!-- Add timestamp to force refresh -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

---

## 🔐 SECURITY CHECK / UCHUNGUZI WA USALAMA

### Is Your Site Hacked? / Je Site Imehacked?

**Check these signs:**

```bash
# 1. Check Vercel access logs
# Go to Vercel Dashboard > Settings > Logs

# 2. Look for suspicious activity:
❌ Unknown IP addresses
❌ Unauthorized deployments
❌ Changed environment variables
❌ New collaborators you don't know

# 3. Check your GitHub repo
# Look for unexpected commits
git log --all --oneline | head -20
```

**If you see PHP files in deployment:**
- 🔴 **SERIOUS**: Someone uploaded PHP files
- 🔴 Change Vercel password immediately
- 🔴 Revoke all access tokens
- 🔴 Check GitHub for unauthorized access

---

## 🧪 DIAGNOSTIC COMMANDS / AMRI ZA UCHUNGUZI

### Run These Tests:

```bash
# 1. Check what's in your dist folder
ls -la dist/ | grep index

# Should see ONLY:
# -rw-r--r-- index.html

# Should NOT see:
# index.htm
# index.php

# 2. Check Vercel configuration
cat vercel.json

# Should have rewrites to /index.html

# 3. Check Git history for suspicious changes
git log --all --grep="index.php" --grep="index.htm" -i

# Should return: nothing
```

---

## 📱 MOBILE-SPECIFIC ISSUES / MATATIZO YA SIMU

### Why Mobile Shows Different Results:

1. **Mobile Browser Cache** - Aggressive caching
2. **Mobile Data Network** - ISP proxy cache
3. **Service Worker** - Old version cached on phone
4. **App Mode** - PWA using old cached version

### Solution for Mobile Users:

```
Android Chrome:
1. Settings → Privacy → Clear browsing data
2. Select: Cached images, Site settings
3. Clear data
4. Restart browser

iPhone Safari:
1. Settings → Safari → Clear History and Website Data
2. Confirm
3. Restart Safari

Or simpler:
1. Visit: wanachuo.com/clear-cache.html
2. Follow instructions
```

---

## 🔥 EMERGENCY FIX / MAREKEBISHO YA DHARURA

If the problem is URGENT and affecting users:

### Option A: Complete Redeployment

```bash
# 1. Remove everything from Vercel
vercel rm wanachuo --yes

# 2. Redeploy fresh
vercel --prod

# 3. Update DNS if needed
```

### Option B: Add Redirect Rules

Add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/index.htm",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/index.php",
      "destination": "/",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This catches old URLs and redirects them properly.

---

## 📊 MONITORING / UFUATILIAJI

### Track the Issue:

1. **Check Vercel Analytics**
   - Go to Vercel Dashboard
   - Check visitor paths
   - Look for 404 errors

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors
   - Check Network tab

3. **Monitor User Reports**
   - Ask users to screenshot URL
   - Note which devices/browsers
   - Track time of occurrence

---

## ✅ VERIFICATION STEPS / HATUA ZA UTHIBITISHO

After implementing fixes:

### Test Checklist:

```
1. Desktop Browser (Incognito):
   ✅ Visit wanachuo.com
   ✅ URL should be: wanachuo.com/ (not index.htm)
   ✅ Check DevTools → Network → No 404 errors

2. Mobile Browser (Private):
   ✅ Visit wanachuo.com
   ✅ URL should be: wanachuo.com/
   ✅ Navigate to /browse
   ✅ Refresh - should stay on /browse

3. Different Networks:
   ✅ WiFi connection
   ✅ Mobile data
   ✅ VPN (if available)

4. PWA Mode:
   ✅ Install app
   ✅ Open from home screen
   ✅ Check URL in address bar
```

---

## 🎯 RECOMMENDED ACTION PLAN / MPANGO WA HATUA

**RIGHT NOW (Sasa Hivi):**

1. ✅ Check Vercel deployment (is it correct?)
2. ✅ Test in incognito mode
3. ✅ Check if problem persists in fresh browser

**IF PROBLEM PERSISTS:**

1. 🔴 Add redirects to vercel.json (catch index.htm/php)
2. 🔴 Bump service worker version to v6
3. 🔴 Force new deployment: `vercel --prod --force`
4. 🔴 Clear Vercel cache
5. 🔴 Check security logs

**IF SHOWING PHP FILES:**

1. 🚨 **SECURITY BREACH** - Change passwords immediately
2. 🚨 Check Vercel access logs
3. 🚨 Check GitHub for unauthorized commits
4. 🚨 Contact Vercel support

---

## 📞 GET HELP / PATA MSAADA

If issue continues:

1. **Vercel Support**: https://vercel.com/support
2. **Check Status**: https://www.vercel-status.com/
3. **Community**: https://github.com/vercel/vercel/discussions

---

## 🔍 CURRENT PROJECT STATUS / HALI YA PROJECT SASA

Based on code review:

✅ **Local Files:** Clean (no PHP, no index.htm)  
✅ **vercel.json:** Configured correctly  
✅ **index.html:** Has proper base tag  
✅ **Routing:** React Router configured  
⚠️ **Production:** NEEDS VERIFICATION  

**Next Step:** Check actual Vercel deployment!

---

**IMPORTANT:** If you see `index.php` files, this is **SERIOUS** - your site may be hacked. PHP files should NEVER exist on a React/Vite project deployed to Vercel.

**Last Updated:** September 16, 2026  
**Priority:** 🔴 HIGH  
**Action Required:** Immediate investigation
