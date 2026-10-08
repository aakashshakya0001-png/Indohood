import { Router } from 'express';
import db from '../../database/db.js';

const router = Router();

// GET /api/activities
router.get('/', (req, res) => {
  try {
    const list = db.getActivities();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/activities
router.post('/', (req, res) => {
  try {
    const { actionTitle, category, impactStat, creditsEarned, image, notes, userName, userAvatar } = req.body;
    if (!actionTitle) {
      return res.status(400).json({ success: false, message: 'Action title is required' });
    }

    const created = db.addActivity({
      userName: userName || 'Resident Citizen',
      userLocation: 'Flat 402, Green Valley Apartments',
      society: 'Green Valley Society',
      userAvatar: userAvatar || null,
      actionTitle,
      category: category || 'Dry Scrap',
      badgeColor: 'emerald',
      impactStat: impactStat || 'Eco-Action Recorded',
      creditsEarned: Number(creditsEarned) || 30,
      image: image || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      notes: notes || 'Verified neighborhood waste segregation contribution.',
      verified: true
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/activities/:id/cheer
router.post('/:id/cheer', (req, res) => {
  try {
    const cheered = db.cheerActivity(req.params.id);
    if (!cheered) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, cheers: cheered.cheers, data: cheered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
