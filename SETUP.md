# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

## 2. Set up Supabase

### Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Wait for provisioning

### Create Storage Bucket
1. Go to Storage in dashboard
2. Create bucket: `scraped-files`
3. Make it Public ✓

### Run Database Setup
1. Go to SQL Editor
2. Run the SQL from `supabase-setup.sql`

### Get Credentials
1. Settings → API
2. Copy:
   - Project URL
   - Anon key
   - Service role key

## 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## 4. Run Application
```bash
npm run dev
```

Open http://localhost:3000

## 5. Test
1. Enter URLs or upload `sample-urls.csv`
2. Click "Start Scraping"
3. Download results

Done! 🎉
