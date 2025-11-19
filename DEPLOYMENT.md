# Deployment Guide: Deploy to Netlify

## ⚠️ Important Note

**Netlify is NOT recommended for this application** because:
- Playwright (web scraping) requires a server with Chromium browser
- Netlify only supports serverless functions with limited execution time (10 seconds max on free tier)
- Browser automation won't work properly on Netlify

## ✅ Recommended Deployment Options

### **Option 1: Vercel (Recommended)**
Best for Next.js apps, but still has limitations for Playwright.

### **Option 2: Railway/Render (Best for this app)**
Full server environment, perfect for Playwright scraping.

### **Option 3: DigitalOcean/AWS/Azure**
Full control, best for production.

---

## If You Still Want to Try Netlify

### Prerequisites
1. Push your code to GitHub
2. Install Netlify CLI: `npm install -g netlify-cli`

### Steps

#### 1. Install Netlify Plugin
```bash
npm install --save-dev @netlify/plugin-nextjs
```

#### 2. Add Environment Variables
Create a file `netlify-env.txt` with your Supabase credentials (don't commit this!):
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

#### 3. Deploy via Netlify Dashboard

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables:
   - Go to Site settings → Environment variables
   - Add all three Supabase variables
6. Click "Deploy site"

#### 4. Known Issues

**Playwright will likely fail** because:
- Chromium installation is too large for Netlify
- Execution time limits
- Memory constraints

**Workaround:** You'd need to use a headless browser service like BrowserStack or Puppeteer with a cloud browser.

---

## 🚀 Better Alternative: Deploy to Vercel

Vercel is made by the Next.js team and works better:

### Quick Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

5. Deploy to production:
```bash
vercel --prod
```

### Or via GitHub

1. Push to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Connect GitHub repo
5. Add environment variables
6. Deploy!

---

## 🎯 Best Solution: Railway.app (Recommended for Playwright)

Railway supports full server deployments:

1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Add environment variables
6. Railway will auto-detect Next.js and deploy

**Advantages:**
- Playwright works perfectly
- No serverless limitations
- Generous free tier
- Easy to use

---

## Summary

| Platform | Playwright Support | Ease of Use | Cost |
|----------|-------------------|-------------|------|
| Netlify  | ❌ No             | ⭐⭐⭐      | Free |
| Vercel   | ⚠️ Limited        | ⭐⭐⭐      | Free |
| Railway  | ✅ Yes            | ⭐⭐⭐      | Free tier available |
| Render   | ✅ Yes            | ⭐⭐        | Free tier available |

**Recommendation:** Use Railway.app for the best experience with this scraper application.
