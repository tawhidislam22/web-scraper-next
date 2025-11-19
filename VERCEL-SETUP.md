# Vercel Deployment Configuration

## Install Vercel-compatible Chromium

First, install the Vercel-compatible Chromium package:

```bash
npm install @sparticuz/chromium playwright-core
```

## Update Environment Variables

In Vercel dashboard, add these:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes

Vercel has a 50MB deployment limit and serverless function timeout.
Chromium might still be too large. If it fails, use Railway.app instead.
