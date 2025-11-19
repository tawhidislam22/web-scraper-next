-- Create a table to store scrape job metadata
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url_count INTEGER NOT NULL,
  results_count INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_created_at ON scrape_jobs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE scrape_jobs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on scrape_jobs" ON scrape_jobs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a storage bucket for scraped files (run this in Supabase dashboard or via SQL)
-- Note: You need to create this bucket manually in Supabase dashboard
-- Bucket name: scraped-files
-- Public: true (for easy downloads)

-- Optional: Create a function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scrape_jobs_updated_at
  BEFORE UPDATE ON scrape_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
