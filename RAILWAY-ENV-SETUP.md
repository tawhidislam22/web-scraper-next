# Railway Environment Variables Setup

## Go to Railway Dashboard

1. Open your Railway project
2. Click on your service (web-scraper-next)
3. Go to **"Variables"** tab
4. Add these variables:

## Required Variables

### Supabase (from your .env.local file)

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://myocezdzfayfqqmszcsh.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15b2NlemR6ZmF5ZnFxbXN6Y3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Mzk4MDQsImV4cCI6MjA3OTExNTgwNH0.9WyiX9jq8gb_DBJiE3yrZiSRjqhfZVbyURQ69zbGcPM
```

```
SUPABASE_SERVICE_ROLE_KEY
Value: [Copy from your .env.local file - line 7]
```

### Playwright (NEW - for Chromium fix)

```
PLAYWRIGHT_BROWSERS_PATH
Value: /opt/render/project/.cache
```

## After Adding Variables

Railway will automatically redeploy with the new configuration.

## Check Build Logs

Look for these successful steps:
- ✅ Installing system packages (chromium, nss, freetype...)
- ✅ Running playwright install chromium
- ✅ Building Next.js app
- ✅ Starting server

If successful, you'll see: "Ready in X ms"
