# PWA Install Prompt Debugging Guide

## Issue
PWA install prompt not showing on live production app (wanachuo.com)

## Current Configuration ✅

### 1. Manifest (public/manifest.json)
- ✅ Properly configured
- ✅ Has 192x192 and 512x512 icons
- ✅ Display: standalone
- ✅ Start URL: "/"
- ✅ Name, short_name, description set

### 2. Service Worker (public/sw.js)
- ✅ Registered in main.tsx
- ✅ Network-first strategy
- ✅ Version: wanachuo-v6-2026
- ✅ Skip waiting enabled for instant updates

### 3. PWA Install Prompt Component
- ✅ Shows on every visit (no 2-day wait)
- ✅ Only hides permanently after actual install
- ✅ 5-second delay before showing
- ✅ Handles both Android/Desktop and iOS
- ✅ Now includes detailed console logging

---

## Debugging Steps

### Step 1: Check Browser Console
Open your production site and check the browser console (F12). You should see:

```
🔍 PWA Install Prompt - Starting diagnostic...
📱 Device type: Android/Desktop (or iOS)
🖥️ Display mode: browser (or standalone)
💾 localStorage pwa-installed: false/null
🌐 Browser supports beforeinstallprompt: true/false
⚙️ Service Worker supported: true
📱 PWA not installed - will show install prompt in 5 seconds
👂 Listening for beforeinstallprompt event...
🎉 beforeinstallprompt event fired! (if criteria met)
✅ Showing PWA install prompt now
```

**If you see:**
- ⚠️ `beforeinstallprompt event did NOT fire` → See Step 2

### Step 2: PWA Criteria Checklist

The `beforeinstallprompt` event only fires if ALL these criteria are met:

#### ✅ HTTPS
- [ ] Site must be served over HTTPS (not HTTP)
- [ ] Check URL starts with `https://wanachuo.com`
- [ ] No mixed content warnings in console

#### ✅ Valid Manifest
- [ ] Open DevTools → Application → Manifest
- [ ] Check for errors in manifest
- [ ] Verify manifest URL: `https://wanachuo.com/manifest.json`
- [ ] Check icons load (no 404 errors)

#### ✅ Service Worker
- [ ] Open DevTools → Application → Service Workers
- [ ] Service worker should be "activated and running"
- [ ] Scope: `https://wanachuo.com/`
- [ ] No registration errors

#### ✅ Icons
- [ ] Check these files exist and load:
  - `/web-app-manifest-192x192.png` (192x192)
  - `/web-app-manifest-512x512.png` (512x512)
- [ ] Open in browser to verify: `https://wanachuo.com/web-app-manifest-192x192.png`

#### ✅ Not Already Installed
- [ ] App is NOT already installed
- [ ] Clear localStorage key: `localStorage.removeItem('pwa-installed')`
- [ ] Check display mode in console: should say "browser" not "standalone"

#### ✅ Browser Support
Chrome/Edge (Android & Desktop):
- [ ] Chrome 68+
- [ ] Edge 79+
- ✅ Fully supports `beforeinstallprompt`

Safari (iOS):
- [ ] Safari 11.3+
- ⚠️ Does NOT support `beforeinstallprompt`
- ✅ Shows manual install instructions instead

Firefox:
- ⚠️ Limited PWA support (Android only)
- [ ] Firefox 58+ on Android

### Step 3: Common Issues & Solutions

#### Issue 1: "App already installed"
**Symptom:** Console shows "standalone" display mode
**Solution:**
```javascript
// In browser console, run:
localStorage.removeItem('pwa-installed');
// Then uninstall the app:
// Android/Chrome: Settings → Apps → Wanachuo → Uninstall
// Desktop Chrome: chrome://apps → Right-click Wanachuo → Remove
// Then refresh page
```

#### Issue 2: "beforeinstallprompt blocked by browser"
**Symptom:** Event doesn't fire even though criteria met
**Reasons:**
1. User dismissed install prompt 3+ times → Browser blocks it
2. Browser setting disabled PWA installs
3. Corporate/managed browser with PWA disabled

**Solution:**
```javascript
// Reset Chrome install blocks:
// 1. chrome://flags → Search "PWA"
// 2. Enable all PWA-related flags
// 3. Restart browser

// OR try in Incognito mode (fresh browser state)
```

#### Issue 3: "Icons not loading (404)"
**Symptom:** Manifest shows errors in DevTools
**Solution:**
```bash
# Verify icon files exist in public/ directory:
ls -la public/*.png

# Required files:
# - web-app-manifest-192x192.png
# - web-app-manifest-512x512.png
# - favicon-96x96.png
# - apple-touch-icon.png

# If missing, regenerate icons or copy from backup
```

#### Issue 4: "Service Worker not registering"
**Symptom:** No SW in DevTools → Application → Service Workers
**Solution:**
1. Check `main.tsx` has SW registration code
2. Verify `/sw.js` file exists and loads (no 404)
3. Check browser console for SW registration errors
4. Clear all browser data and reload

#### Issue 5: "Mixed content (HTTP + HTTPS)"
**Symptom:** Console warnings about insecure content
**Solution:**
1. Check all resources load over HTTPS
2. Update API calls to use HTTPS
3. Check iframe/script src URLs

### Step 4: Test in Different Browsers

Test PWA install on:
- [ ] Chrome Android (mobile)
- [ ] Chrome Desktop (Windows/Mac)
- [ ] Edge Desktop
- [ ] Safari iOS (should show manual instructions)

### Step 5: Force Reset Everything

If nothing works, complete reset:

```javascript
// 1. In browser console:
localStorage.clear();
sessionStorage.clear();

// 2. Clear all site data:
// DevTools → Application → Clear storage → Clear site data

// 3. Unregister service worker:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// 4. Close all tabs of wanachuo.com
// 5. Reopen in new tab
// 6. Check console logs
```

---

## Testing Commands

### Check PWA criteria in browser console:

```javascript
// Check if already installed
console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');

// Check localStorage
console.log('pwa-installed:', localStorage.getItem('pwa-installed'));

// Check service worker
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs.length, regs);
});

// Check manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('Manifest:', m))
  .catch(e => console.error('Manifest error:', e));

// Check beforeinstallprompt support
console.log('Supports beforeinstallprompt:', 'onbeforeinstallprompt' in window);

// Listen for event manually
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt fired!', e);
});
```

### Check if icons exist:

```javascript
// Test icon URLs
const icons = [
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/favicon-96x96.png',
  '/apple-touch-icon.png'
];

icons.forEach(icon => {
  fetch(icon)
    .then(r => console.log(icon, r.ok ? '✅' : '❌', r.status))
    .catch(e => console.error(icon, '❌', e));
});
```

---

## Expected Behavior

### On First Visit (Not Installed):
1. Page loads
2. Service worker registers
3. After 5 seconds, `beforeinstallprompt` event fires
4. Install prompt appears (bottom of screen)
5. Console shows: "🎉 beforeinstallprompt event fired!"

### After Installing:
1. User clicks "Install" button
2. Browser shows native install dialog
3. User confirms installation
4. `localStorage.setItem('pwa-installed', 'true')` is saved
5. Prompt never shows again

### On iOS:
1. Page loads
2. After 5 seconds, shows manual instructions
3. "Install Wanachuo: Tap ⬆️ then 'Add to Home Screen'"

---

## Production Deployment Checklist

Before deploying PWA to production:

- [ ] All icon files exist in `public/` directory
- [ ] Manifest.json accessible at root URL
- [ ] Service worker (`sw.js`) accessible at root URL
- [ ] Site served over HTTPS (no HTTP)
- [ ] No mixed content warnings
- [ ] Service worker registers successfully
- [ ] Manifest has no errors in DevTools
- [ ] Icons load without 404 errors
- [ ] Test install on mobile device
- [ ] Test install on desktop browser
- [ ] Verify `beforeinstallprompt` event fires
- [ ] Confirm prompt appears after 5 seconds
- [ ] Test install flow (accept/dismiss)
- [ ] Verify localStorage persists after install

---

## Quick Fix Commands

### For Development/Testing:

```bash
# 1. Verify all icon files exist
ls -la public/*.png

# 2. Test manifest is valid JSON
cat public/manifest.json | jq .

# 3. Check service worker syntax
node -c public/sw.js

# 4. Build and test locally
npm run build
npm run preview

# 5. Open in browser and check console
# Look for the diagnostic messages
```

### For Production:

```bash
# 1. Deploy with updated PWA prompt
git add .
git commit -m "fix: Enhanced PWA install prompt with diagnostics"
git push

# 2. Wait for deployment to complete

# 3. Hard refresh production site
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# 4. Open browser console
# 5. Look for diagnostic messages
# 6. Check if beforeinstallprompt fires
```

---

## Contact Developer

If prompt still not showing after all debugging steps:

1. Share browser console output (all logs)
2. Share DevTools → Application → Manifest screenshot
3. Share DevTools → Application → Service Workers screenshot
4. Specify browser version and device type
5. Note if app was previously installed

---

## Last Updated
Date: January 2026
Version: Wanachuo v6
