import playwright from 'playwright';
import * as cheerio from 'cheerio';

export async function findLinkedInFromDuckDuckGo(urls: string[]) {
  const browser = await playwright.chromium.launch({ 
    headless: false,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  });
  
  // Stealth settings to avoid detection in headless mode
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
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
      const query = `linkedin.com/company ${url}`;
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      
      console.log(`\n🔍 Searching DuckDuckGo: ${query}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for DuckDuckGo to load results (increase wait time for headless)
      await page.waitForTimeout(7000);
      
      // Get the page HTML
      const html = await page.content();
      const $ = cheerio.load(html);
      
      let linkedinUrl: string | null = null;
      
      // Look for LinkedIn links in the HTML
      $('a').each((i: number, el: any) => {
        const href = $(el).attr('href');
        if (href && (href.includes('linkedin.com/company/') || href.includes('linkedin.com/in/'))) {
          // Clean the URL
          linkedinUrl = href.split('?')[0].split('#')[0];
          return false; // Stop searching
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
