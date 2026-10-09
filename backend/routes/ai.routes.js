import { Router } from 'express';
import { classifyWasteImage } from '../services/bedrock.service.js';
import { getScrapedRates, scrapeLiveScrapRates } from '../services/scrap-scraper.service.js';

const router = Router();

// POST /api/ai/classify-waste
router.post('/classify-waste', async (req, res) => {
  try {
    const { imageBase64, itemHint } = req.body;
    const result = await classifyWasteImage({ imageBase64, itemHint });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AI Route Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process waste classification',
      error: error.message
    });
  }
});

// GET /api/ai/scrap-rates
router.get('/scrap-rates', (req, res) => {
  try {
    const data = getScrapedRates();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ai/scrap-rates/refresh
router.post('/scrap-rates/refresh', async (req, res) => {
  try {
    const data = await scrapeLiveScrapRates();
    res.json({
      success: true,
      message: 'Scrap rates refreshed from Indian market source',
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
