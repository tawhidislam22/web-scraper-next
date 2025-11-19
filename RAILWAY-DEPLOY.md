# Railway.app Deployment Guide

## Why Railway.app?

✅ **Perfect for Playwright** - Full server environment, not serverless
✅ **Easy deployment** - Connects directly to GitHub
✅ **Free tier** - $5 credit per month (enough for development)
✅ **Auto-deploys** - Updates automatically when you push to GitHub

---

## Step-by-Step Deployment

### 1. Go to Railway.app
Visit: **https://railway.app**

### 2. Sign Up with GitHub
- Click **"Login"**
- Choose **"Login with GitHub"**
- Authorize Railway to access your GitHub account

### 3. Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose: **`tawhidislam22/web-scraper-next`**

### 4. Configure the Project
Railway will auto-detect Next.js. Just wait for it to analyze.

### 5. Add Environment Variables
Click on your service → **"Variables"** tab → Add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://myocezdzfayfqqmszcsh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15b2NlemR6ZmF5ZnFxbXN6Y3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mzk4MDQsImV4cCI6MjA3OTExNTgwNH0.9WyiX9jq8gb_DBJiE3yrZiSRjqhfZVbyURQ69zbGcPM
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Deploy!
- Click **"Deploy"**
- Railway will:
  - Install Node.js dependencies
  - Install Playwright and Chromium
  - Build your Next.js app
  - Deploy to a live URL

### 7. Get Your URL
After deployment completes (2-3 minutes):
- Click on **"Settings"** → **"Domains"**
- Click **"Generate Domain"**
- You'll get a URL like: `https://web-scraper-next-production.up.railway.app`

---

## 🎉 That's It!

Your scraper will work perfectly on Railway because:
- ✅ Playwright browsers are fully supported
- ✅ No serverless timeout limits
- ✅ Enough memory for Chromium
- ✅ Auto-scaling if needed

---

## Monitoring & Logs

- **View Logs**: Click on your service → "Deployments" → Click latest deployment
- **Check Usage**: Dashboard shows memory, CPU, and bandwidth usage
- **Redeploy**: Push to GitHub `main` branch = auto redeploy

---

## Free Tier Limits

- **$5 credit/month** (free)
- **Resets every month**
- **More than enough** for testing and small-scale usage
- **Upgrade available** if you need more

---

## Troubleshooting

### If Deployment Fails:

**Check logs** in Railway dashboard for errors.

Common fixes:
- Ensure environment variables are set correctly
- Make sure `.env.local` is NOT committed to GitHub (it's in `.gitignore`)

### If Scraping Doesn't Work:

Check that Supabase storage bucket policies are set correctly.

---

## Alternative: Railway CLI

You can also deploy using the CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

**Your app will be live in minutes!** 🚀
