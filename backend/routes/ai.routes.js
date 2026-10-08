import { Router } from 'express';
import { classifyWasteImage } from '../services/bedrock.service.js';

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

export default router;
