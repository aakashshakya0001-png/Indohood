import { Router } from 'express';
import dynamoService from '../services/dynamo.service.js';
import db from '../../database/db.js';

const router = Router();

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    let list = await dynamoService.getActivities();
    if (!list || list.length === 0) {
      list = db.getActivities();
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/activities
router.post('/', async (req, res) => {
  try {
    const { actionTitle, category, impactStat, creditsEarned, image, notes, userName, userAvatar } = req.body;
    if (!actionTitle) {
      return res.status(400).json({ success: false, message: 'Action title is required' });
    }

    let finalCategory = 'Non-Degradable';
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('degradable') && !catLower.includes('non')) {
      finalCategory = 'Degradable';
    } else if (catLower.includes('mix') || catLower.includes('hazard') || catLower.includes('sanitary') || catLower.includes('medic')) {
      finalCategory = 'Mix';
    }

    const defaultCredits = finalCategory === 'Degradable' ? 15 : finalCategory === 'Mix' ? 5 : 25;
    const badgeColor = finalCategory === 'Degradable' ? 'emerald' : finalCategory === 'Mix' ? 'rose' : 'blue';

    const activityData = {
      id: `act_${Date.now()}`,
      createdAt: new Date().toISOString(),
      cheers: 0,
      userName: userName || 'Resident Citizen',
      userLocation: 'Flat 402, Green Valley Apartments',
      society: 'Green Valley Society',
      userAvatar: userAvatar || null,
      actionTitle,
      category: finalCategory,
      badgeColor,
      impactStat: impactStat || 'Eco-Action Recorded',
      creditsEarned: Number(creditsEarned) || defaultCredits,
      image: image || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      notes: notes || 'Verified neighborhood waste segregation contribution.',
      verified: true
    };

    let saved = null;
    try {
      saved = await dynamoService.saveActivity(activityData);
    } catch (dErr) {
      console.warn('[Activities Route] DynamoDB saveActivity failed, fallback to local DB:', dErr.message);
    }

    const localCreated = db.addActivity(activityData);
    const finalActivity = saved || localCreated;

    res.status(201).json({ success: true, data: finalActivity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/activities/:id/cheer
router.post('/:id/cheer', async (req, res) => {
  try {
    let cheered = null;
    try {
      cheered = await dynamoService.cheerActivity(req.params.id);
    } catch (dErr) {
      console.warn('[Activities Route] DynamoDB cheerActivity failed, fallback to local DB:', dErr.message);
    }

    const localCheered = db.cheerActivity(req.params.id);
    const finalCheered = cheered || localCheered;

    if (!finalCheered) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, cheers: finalCheered.cheers, data: finalCheered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
