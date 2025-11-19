import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';

interface ScrapeResult {
  url: string;
  linkedin: string | null;
  error?: string;
}

interface ScrapeResponse {
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

export default function Home() {
  const [urls, setUrls] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [showSetup, setShowSetup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrls(''); // Clear URL input when file is selected
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();

      if (file) {
        formData.append('csvFile', file);
      } else if (urls.trim()) {
        const urlArray = urls
          .split('\n')
          .map(url => url.trim())
          .filter(url => url.length > 0);
        
        if (urlArray.length === 0) {
          setError('Please enter at least one URL');
          setLoading(false);
          return;
        }

        formData.append('urls', JSON.stringify(urlArray));
      } else {
        setError('Please provide URLs or upload a CSV file');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/scrape', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('SUPABASE') || data.error?.includes('supabase')) {
          setError('⚠️ Supabase not configured. Please set up your .env.local file with Supabase credentials.');
          setShowSetup(true);
        } else {
          throw new Error(data.error || 'Scraping failed');
        }
        setLoading(false);
        return;
      }

      setResult(data);
      
      // Clear form
      setUrls('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    }
  };

  return (
    <>
      <Head>
        <title>LinkedIn Scraper - Find Company LinkedIn Profiles</title>
        <meta name="description" content="Scrape LinkedIn company profiles from URLs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                LinkedIn Company Scraper
              </h1>
              <p className="text-lg text-gray-600">
                Find LinkedIn company profiles from bulk URLs or CSV files
              </p>
            </div>

            {/* Setup Warning */}
            {showSetup && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">⚙️ Setup Required</h3>
                <div className="text-yellow-800 space-y-2 text-sm">
                  <p className="font-semibold">You need to configure Supabase first:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">supabase.com</a> and create a project</li>
                    <li>Create a storage bucket named <code className="bg-yellow-200 px-1 rounded">scraped-files</code> (make it public)</li>
                    <li>Run the SQL from <code className="bg-yellow-200 px-1 rounded">supabase-setup.sql</code></li>
                    <li>Get your credentials from Settings → API</li>
                    <li>Update <code className="bg-yellow-200 px-1 rounded">.env.local</code> file with your credentials</li>
                    <li>Restart the dev server: <code className="bg-yellow-200 px-1 rounded">npm run dev</code></li>
                  </ol>
                  <p className="mt-3">See <code className="bg-yellow-200 px-1 rounded">SETUP.md</code> for detailed instructions.</p>
                </div>
                <button
                  onClick={() => setShowSetup(false)}
                  className="mt-4 text-yellow-900 underline text-sm"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
              <form onSubmit={handleSubmit}>
                {/* URL Input */}
                <div className="mb-6">
                  <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URLs (one per line)
                  </label>
                  <textarea
                    id="urls"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="example.com&#10;company-website.com&#10;another-site.org"
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    disabled={file !== null || loading}
                  />
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="csvFile"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={urls.trim() !== '' || loading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {file && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scraping in progress...
                    </span>
                  ) : (
                    'Start Scraping'
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Results Card */}
            {result && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Scraping Complete! 🎉
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Download CSV
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total URLs</p>
                    <p className="text-2xl font-bold text-blue-600">{result.stats.totalUrls}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Valid URLs</p>
                    <p className="text-2xl font-bold text-green-600">{result.stats.validUrls}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Found</p>
                    <p className="text-2xl font-bold text-purple-600">{result.stats.resultsFound}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Not Found</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {result.stats.validUrls - result.stats.resultsFound}
                    </p>
                  </div>
                </div>

                {/* Results Preview */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Preview</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            URL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LinkedIn Profile
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.results.slice(0, 10).map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.url}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {item.linkedin ? (
                                <a
                                  href={item.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {item.linkedin}
                                </a>
                              ) : (
                                <span className="text-gray-400">Not found</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.results.length > 10 && (
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Showing 10 of {result.results.length} results. Download CSV for full data.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
