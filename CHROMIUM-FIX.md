# IMPORTANT: Chromium Installation Fix

## Changes Made

The Railway deployment has been updated to use **system Chromium** instead of Playwright's downloaded version.

### Updated Files:

1. **nixpacks.toml** - Now installs system packages including Chromium
2. **railway.json** - Build command updated to install Chromium in correct path
3. **lib/scraper.ts** - Now uses headless mode with system Chromium
4. **package.json** - Removed postinstall script (moved to Railway config)

### Railway Environment Variables

Add this in Railway → Variables:

```
PLAYWRIGHT_BROWSERS_PATH=/opt/render/project/.cache
```

Plus your existing Supabase variables.

### What This Fixes

- ✅ Chromium will be installed from Nix packages (system-level)
- ✅ Playwright will use the system Chromium instead of downloading
- ✅ Browser executable will exist at build time and runtime
- ✅ Headless mode now enabled for production

## Next Steps

1. Commit and push these changes
2. Railway will auto-redeploy
3. Check build logs to verify Chromium installation
