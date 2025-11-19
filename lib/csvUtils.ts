import { parse } from 'csv-parse/sync';

export function parseCSV(fileContent: string): string[] {
  try {
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true,
      trim: true
    });

    const urls: string[] = [];
    
    // Extract URLs from CSV (assuming first column contains URLs)
    records.forEach((record: any[]) => {
      if (record[0] && typeof record[0] === 'string') {
        const url = record[0].trim();
        if (url && url.length > 0) {
          urls.push(url);
        }
      }
    });

    return urls;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Invalid CSV format');
  }
}

export function validateUrls(urls: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  urls.forEach(url => {
    // Basic URL validation
    try {
      const trimmed = url.trim();
      if (trimmed.length > 0) {
        // Check if it's a valid domain or URL
        if (trimmed.match(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/) || trimmed.match(/^https?:\/\//)) {
          valid.push(trimmed);
        } else {
          invalid.push(trimmed);
        }
      }
    } catch (error) {
      invalid.push(url);
    }
  });

  return { valid, invalid };
}
