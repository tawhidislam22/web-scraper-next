# LinkedIn Company Scraper - Next.js App

A powerful web application that scrapes LinkedIn company profiles from bulk URLs or CSV files, built with Next.js, Playwright, and Supabase.

## Features

- 🔍 **Bulk URL Scraping**: Enter multiple company URLs and find their LinkedIn profiles
- 📁 **CSV Upload Support**: Upload CSV files containing URLs for batch processing
- ☁️ **Supabase Storage**: Automatically stores scraped results in Supabase
- 📊 **Real-time Stats**: View scraping statistics and results preview
- 💾 **Easy Downloads**: Download results directly from Supabase storage
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Scraping**: Playwright, Cheerio
- **Storage**: Supabase (Database + Storage)
- **Search Engine**: DuckDuckGo (to avoid bot detection)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Playwright browsers installed

## Installation

1. **Clone the repository**
```bash
cd e:\all projects\web-scraper-next
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install chromium
```

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Create a bucket named: `scraped-files`
4. Make it **Public** (check the public checkbox)
5. Click **Create bucket**

### 3. Set up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql` file
3. Paste and run the SQL commands
4. This creates the `scrape_jobs` table and necessary policies

### 4. Get Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following:
   - **Project URL** (under Project URL)
   - **Anon/Public Key** (under Project API keys - anon public)
   - **Service Role Key** (optional, for server-side operations)

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

### Method 1: Bulk URL Input

1. Navigate to the home page
2. Enter company URLs in the text area (one per line)
   ```
   example.com
   company-website.com
   another-site.org
   ```
3. Click **"Start Scraping"**
4. Wait for the process to complete
5. Click **"Download CSV"** to get your results from Supabase

### Method 2: CSV File Upload

1. Prepare a CSV file with URLs in the first column:
   ```csv
   url
   example.com
   company-website.com
   another-site.org
   ```
2. Click **"Upload CSV File"** and select your file
3. Click **"Start Scraping"**
4. Download results when complete

### Results Format

The output CSV contains:
- **url**: Original company URL
- **linkedin**: Found LinkedIn company profile URL (or empty if not found)

## Project Structure

```
web-scraper-next/
├── pages/
│   ├── api/
│   │   ├── scrape.ts       # Main scraping endpoint
│   │   └── jobs.ts         # Get scraping history
│   ├── _app.tsx            # App wrapper
│   └── index.tsx           # Main UI page
├── lib/
│   ├── supabase.ts         # Supabase client config
│   ├── scraper.ts          # Scraping logic
│   └── csvUtils.ts         # CSV parsing utilities
├── types/
│   └── index.ts            # TypeScript types
├── styles/
│   └── globals.css         # Global styles
├── supabase-setup.sql      # Database schema
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/scrape`

Scrape LinkedIn profiles from URLs or CSV file.

**Request (URL Array)**:
```json
{
  "urls": ["example.com", "company.com"]
}
```

**Request (CSV Upload)**:
- Form data with `csvFile` field

**Response**:
```json
{
  "message": "LinkedIn scraping completed",
  "filename": "linkedin_results_1234567890.csv",
  "downloadUrl": "https://your-project.supabase.co/storage/v1/object/public/scraped-files/...",
  "results": [
    {
      "url": "example.com",
      "linkedin": "https://linkedin.com/company/example"
    }
  ],
  "stats": {
    "totalUrls": 10,
    "validUrls": 10,
    "invalidUrls": 0,
    "resultsFound": 8
  }
}
```

### GET `/api/jobs`

Get scraping job history.

**Response**:
```json
{
  "jobs": [
    {
      "id": "uuid",
      "filename": "linkedin_results_1234567890.csv",
      "url_count": 10,
      "results_count": 8,
      "created_at": "2023-12-01T10:00:00Z"
    }
  ]
}
```

## Configuration

### Scraping Settings

Edit `lib/scraper.ts` to customize:
- Browser settings (headless mode, user agent)
- Search query format
- Timeout values
- Wait times between requests

### Storage Settings

Edit `pages/api/scrape.ts` to configure:
- Supabase bucket name
- File naming convention
- Upload options

## Troubleshooting

### Playwright Installation Issues

```bash
# Install specific browser
npx playwright install chromium

# Install system dependencies (Linux)
npx playwright install-deps chromium
```

### Supabase Connection Issues

1. Verify your `.env.local` credentials
2. Check if your Supabase project is active
3. Ensure the storage bucket is public
4. Verify RLS policies are set correctly

### Rate Limiting

If you encounter rate limiting from DuckDuckGo:
- Reduce batch sizes
- Add delays between requests
- Use rotating proxies (advanced)

## Performance Considerations

- **Batch Processing**: Process URLs in smaller batches for better reliability
- **Headless Mode**: Set to `true` in production for better performance
- **Caching**: Consider implementing caching for frequently searched URLs
- **Queue System**: For large batches, consider implementing a job queue

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Configure Supabase RLS policies for production
- Consider rate limiting API endpoints
- Validate and sanitize all user inputs

## Future Enhancements

- [ ] Add authentication for multi-user support
- [ ] Implement job queue for large batches
- [ ] Add progress tracking with real-time updates
- [ ] Support for multiple search engines
- [ ] Export to multiple formats (Excel, JSON)
- [ ] Email notifications when scraping completes
- [ ] Scheduled/recurring scraping jobs

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues or questions, please open an issue on GitHub.

---

**Note**: This tool is for educational purposes. Always respect LinkedIn's terms of service and robots.txt. Use responsibly and ethically.
