import serverless from 'serverless-http';
import app from './server.js';
import { getScrapedRates, scrapeLiveScrapRates } from './services/scrap-scraper.service.js';

// Pre-warm scrap rates cache on cold start
let warmPromise = null;
function warmRates() {
  if (!warmPromise) {
    const existing = getScrapedRates();
    if (!existing || !existing.lastUpdated) {
      warmPromise = scrapeLiveScrapRates().catch(err => {
        console.warn('[Lambda Cold Start Scraper Fallback]:', err.message);
      });
    } else {
      warmPromise = Promise.resolve();
    }
  }
  return warmPromise;
}

const serverlessHandler = serverless(app, {
  binary: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
});

export const handler = async (event, context) => {
  // Allow asynchronous cold-start warming
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await warmRates();
  } catch (e) {
    // Graceful fallback to verified benchmarks
  }
  return await serverlessHandler(event, context);
};
