import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { findLinkedInFromDuckDuckGo, convertToCSV } from '@/lib/scraper';
import { parseCSV, validateUrls } from '@/lib/csvUtils';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    let urls: string[] = [];

    // Check if URLs are provided as JSON array
    if (fields.urls && fields.urls[0]) {
      try {
        urls = JSON.parse(fields.urls[0]);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid URLs format' });
      }
    }
    // Check if CSV file is uploaded
    else if (files.csvFile && files.csvFile[0]) {
      const file = files.csvFile[0] as File;
      const fileContent = fs.readFileSync(file.filepath, 'utf-8');
      urls = parseCSV(fileContent);
    }
    else {
      return res.status(400).json({ error: 'No URLs or CSV file provided' });
    }

    // Validate URLs
    const { valid, invalid } = validateUrls(urls);
    
    if (valid.length === 0) {
      return res.status(400).json({ 
        error: 'No valid URLs found',
        invalid: invalid 
      });
    }

    console.log(`\n🔍 Starting LinkedIn search for ${valid.length} URLs...`);
    
    // Perform scraping
    const results = await findLinkedInFromDuckDuckGo(valid);
    
    // Convert to CSV
    const csvContent = convertToCSV(results);
    const timestamp = Date.now();
    const filename = `linkedin_results_${timestamp}.csv`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scraped-files')
      .upload(filename, csvContent, {
        contentType: 'text/csv',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file to storage: ' + uploadError.message });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('scraped-files')
      .getPublicUrl(filename);

    // Store metadata in database (optional)
    const { error: dbError } = await supabase
      .from('scrape_jobs')
      .insert({
        filename: filename,
        url_count: valid.length,
        results_count: results.length,
        storage_path: uploadData.path,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.warn('Database insert error:', dbError);
      // Continue even if DB insert fails
    }

    res.status(200).json({
      message: 'LinkedIn scraping completed',
      filename: filename,
      downloadUrl: urlData.publicUrl,
      results: results,
      stats: {
        totalUrls: urls.length,
        validUrls: valid.length,
        invalidUrls: invalid.length,
        resultsFound: results.filter(r => r.linkedin).length
      }
    });

  } catch (error: any) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Error during scraping: ' + error.message });
  }
}
