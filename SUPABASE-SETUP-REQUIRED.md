# 🚨 IMPORTANT: Setup Supabase Before Using

The application is now running but **Supabase is not configured yet**. You need to set up Supabase to store and download the scraped files.

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Name: `linkedin-scraper` (or any name)
   - Database Password: (save this)
   - Region: Choose closest to you
4. Click "Create new project" and wait 2-3 minutes

### Step 2: Create Storage Bucket
1. In your Supabase dashboard, click **Storage** (left sidebar)
2. Click **"New bucket"**
3. Enter bucket name: `scraped-files`
4. **Check "Public bucket"** ✓ (important!)
5. Click **"Create bucket"**

### Step 3: Set Up Database
1. Click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-setup.sql` in this project
4. Copy ALL the SQL code
5. Paste it in the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`

### Step 4: Get Your API Keys
1. Click **Settings** (gear icon at bottom left)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** - copy this
   - **Project API keys** - copy the `anon` `public` key
   - **Service Role** - copy this (click "Reveal" first)

### Step 5: Configure Environment Variables
1. Open the file `.env.local` in your project root
2. Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 6: Restart Dev Server
1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open http://localhost:3000

## ✅ Test It Out

1. Enter a few URLs like:
   ```
   google.com
   microsoft.com
   apple.com
   ```
2. Click "Start Scraping"
3. Wait for results
4. Click "Download CSV" to get your file from Supabase!

## 🎉 Done!

Your scraper is now fully functional with cloud storage!

---

**Need help?** Check `SETUP.md` for more details or `README.md` for full documentation.
