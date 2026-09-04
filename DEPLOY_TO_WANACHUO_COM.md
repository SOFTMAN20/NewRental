# 🚀 Deploy React App to wanachuo.com
## Replace Old PHP Site with New React App

---

## 🔍 PROBLEM IDENTIFIED

**Current Situation**:
- wanachuo.com → Redirects to `https://www.wanachuo.com/index.php`
- Old PHP website is running
- New React app is not deployed yet

**Solution**: Deploy this React app to wanachuo.com

---

## ✅ OPTION 1: DEPLOY TO VERCEL (EASIEST - 5 MINUTES)

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy**
```bash
# From project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: wanachuo
# - Deploy? Yes
```

### **Step 4: Add Custom Domain**
```bash
vercel domains add wanachuo.com
```

**Or via Vercel Dashboard**:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Domains
4. Add: `wanachuo.com`
5. Add: `www.wanachuo.com`

### **Step 5: Configure DNS (at your domain registrar)**
```
A Record:
Name: @
Value: 76.76.21.21

CNAME Record:
Name: www
Value: cname.vercel-dns.com
```

**Done! wanachuo.com will now serve your React app!**

---

## ✅ OPTION 2: DEPLOY TO EXISTING SERVER (If you have cPanel/SSH)

### **Step 1: Build the App**
```bash
npm run build
```
This creates `/dist` folder with all files.

### **Step 2: Upload to Server**
Via FTP/cPanel:
1. Delete old PHP files (backup first!)
2. Upload everything from `/dist` folder to public_html
3. Create `.htaccess` file:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
```

### **Step 3: Configure Server**
Make sure server has:
- Node.js support (for build)
- Or just serve static files from `/dist`

---

## ✅ OPTION 3: NETLIFY (ALTERNATIVE)

### **Step 1: Connect to Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify init
```

### **Step 2: Deploy**
```bash
netlify deploy --prod
```

### **Step 3: Add Domain**
1. Netlify Dashboard → Domain Settings
2. Add custom domain: `wanachuo.com`
3. Configure DNS as instructed

---

## 🎯 RECOMMENDED: VERCEL

**Why Vercel**:
- ✅ Already configured (`vercel.json` exists)
- ✅ Automatic HTTPS
- ✅ CDN (fast globally)
- ✅ Free for hobby projects
- ✅ Easy domain management
- ✅ Automatic deployments (push to GitHub = auto deploy)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, make sure:

- [x] ✅ `.env.local` has correct Supabase credentials
- [x] ✅ `index.html` has correct meta tags (wanachuo.com URLs)
- [x] ✅ `sitemap.xml` points to wanachuo.com
- [x] ✅ `robots.txt` allows indexing
- [x] ✅ All images optimized
- [x] ✅ Build works locally: `npm run build && npm run preview`

---

## 🔧 ENVIRONMENT VARIABLES

Make sure to set these in Vercel/Netlify:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**In Vercel**:
1. Dashboard → Project → Settings → Environment Variables
2. Add each variable

---

## 🚀 QUICK DEPLOY NOW (5 MIN)

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel --prod

# 3. Add domain
vercel domains add wanachuo.com

# 4. Configure DNS (at your registrar)
# Follow instructions from Vercel

# DONE! 🎉
```

---

## 🌐 AFTER DEPLOYMENT

### **1. Test the Site**:
- Visit: https://wanachuo.com
- Should see React app (not PHP!)
- Test all pages work
- Test mobile view

### **2. Google Search Console**:
- Verify domain ownership
- Submit sitemap: https://wanachuo.com/sitemap.xml
- Request indexing

### **3. Monitor**:
- Check Vercel Analytics
- Check error logs
- Monitor performance

---

## 🔄 UPDATE OLD PHP SITE

If you want to keep some PHP functionality:

### **Option A: Subdomain**
- New React app: `wanachuo.com`
- Old PHP app: `old.wanachuo.com`

### **Option B: Subfolder**
- New React app: `wanachuo.com/*`
- Old PHP app: `wanachuo.com/old/*`

### **Option C: Full Migration (RECOMMENDED)**
- Replace everything
- Migrate any PHP functionality to React/API

---

## ❓ TROUBLESHOOTING

### **Issue: Still seeing PHP site**
**Solution**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Check DNS propagation: https://dnschecker.org
- Wait 24-48 hours for DNS to propagate

### **Issue: 404 errors on page refresh**
**Solution**: 
- Vercel: Already handled by `vercel.json` rewrites
- Other servers: Add `.htaccess` rewrite rules

### **Issue: Environment variables not working**
**Solution**: 
- Check they're prefixed with `VITE_`
- Rebuild after adding variables
- Check Vercel dashboard settings

---

## 📞 NEED HELP?

If stuck:
1. Check Vercel docs: https://vercel.com/docs
2. Check DNS propagation: https://dnschecker.org
3. Clear browser cache
4. Check server logs

---

## ✅ SUCCESS CRITERIA

After deployment, you should see:
- ✅ wanachuo.com → React app homepage (not PHP)
- ✅ HTTPS enabled (green padlock)
- ✅ All pages load correctly
- ✅ Mobile responsive
- ✅ Fast loading (<2 seconds)
- ✅ No console errors

---

## 🎉 READY TO DEPLOY?

Run this now:
```bash
vercel login
vercel --prod
```

**Your new React app will be live on wanachuo.com!**

---

*Created: 2026-09-04*  
*Status: Ready to Deploy*  
*Estimated Time: 5-10 minutes*
