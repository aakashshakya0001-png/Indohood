import { Router } from 'express';
import { reverseGeocodeCoordinates } from '../services/location.service.js';

const router = Router();

// POST /api/location/reverse-geocode
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'latitude and longitude are required in request body',
      });
    }

    const result = await reverseGeocodeCoordinates({ latitude, longitude });
    res.json(result);
  } catch (err) {
    console.error('[Location Route Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Reverse geocoding failed',
    });
  }
});

export default router;
