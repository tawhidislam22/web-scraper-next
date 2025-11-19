export interface ScrapeJob {
  id: string;
  filename: string;
  url_count: number;
  results_count: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

export interface ScrapeResult {
  url: string;
  linkedin: string | null;
  error?: string;
}

export interface ScrapeResponse {
  message: string;
  filename: string;
  downloadUrl: string;
  results: ScrapeResult[];
  stats: {
    totalUrls: number;
    validUrls: number;
    invalidUrls: number;
    resultsFound: number;
  };
}
