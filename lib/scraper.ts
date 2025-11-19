import playwright from 'playwright';
import * as cheerio from 'cheerio';

export async function findLinkedInFromDuckDuckGo(urls: string[]) {
  const browser = await playwright.chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  // Enhanced stealth settings to avoid detection
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    }
  });
  
  // Inject script to mask automation
  await context.addInitScript(() => {
    // Override the navigator.webdriver property
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    
    // Mock plugins and languages
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
  
  const results = [];

  for (const url of urls) {
    const page = await context.newPage();

    try {
      const query = `site:linkedin.com/company ${url}`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      
      console.log(`\n🔍 Searching Google: ${query}`);
      
      // Random delay before search (human-like behavior)
      await page.waitForTimeout(Math.random() * 2000 + 1000);
      
      await page.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for Google to load results
      await page.waitForTimeout(3000);
      
      // Get the page HTML
      const html = await page.content();
      const $ = cheerio.load(html);
      
      let linkedinUrl: string | null = null;
      
      // Look for LinkedIn links in Google search results
      $('a').each((i: number, el: any) => {
        const href = $(el).attr('href');
        if (href && href.includes('linkedin.com/company/')) {
          // Extract actual URL from Google redirect
          const match = href.match(/url=([^&]+)/);
          if (match) {
            linkedinUrl = decodeURIComponent(match[1]).split('?')[0].split('#')[0];
          } else if (href.startsWith('http') && href.includes('linkedin.com/company/')) {
            linkedinUrl = href.split('?')[0].split('#')[0];
          }
          if (linkedinUrl) return false; // Stop searching
        }
      });

      if (linkedinUrl) {
        console.log(`✅ Found: ${linkedinUrl}`);
        results.push({
          url: url,
          linkedin: linkedinUrl
        });
      } else {
        console.log(`❌ Not found`);
        results.push({
          url: url,
          linkedin: null
        });
      }

    } catch (error: any) {
      console.error(`Error searching for ${url}:`, error.message);
      results.push({
        url: url,
        linkedin: null,
        error: error.message
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return results;
}

export function convertToCSV(data: Array<{ url: string; linkedin: string | null }>) {
  const headers = ['url', 'linkedin'];
  let csv = headers.join(',') + '\n';

  data.forEach(row => {
    const url = row.url ? row.url.replace(/"/g, '""') : '';
    const linkedin = row.linkedin ? row.linkedin.replace(/"/g, '""') : '';
    csv += `"${url}","${linkedin}"\n`;
  });

  return csv;
}
