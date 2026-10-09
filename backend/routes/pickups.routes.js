import { Router } from 'express';
import db from '../../database/db.js';

const router = Router();

// GET /api/pickups
router.get('/', (req, res) => {
  try {
    const list = db.getPickups();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/pickups/schedule
router.post('/schedule', (req, res) => {
  try {
    const { 
      itemId, itemName, itemIcon, stream, streamLabel, 
      weightEst, credits, co2Grams, pickupDate, timeSlot, address, instructions 
    } = req.body;

    if (!itemName || !pickupDate || !address) {
      return res.status(400).json({ success: false, message: 'Missing required pickup fields' });
    }

    let finalStream = 'Non-Degradable';
    const streamCheck = (stream || streamLabel || '').toLowerCase();
    if (streamCheck.includes('degradable') && !streamCheck.includes('non')) {
      finalStream = 'Degradable';
    } else if (streamCheck.includes('mix') || streamCheck.includes('hazard') || streamCheck.includes('sanitary') || streamCheck.includes('medic')) {
      finalStream = 'Mix';
    }

    const defaultCredits = finalStream === 'Degradable' ? 15 : finalStream === 'Mix' ? 5 : 25;

    const newPickup = db.addPickup({
      itemId,
      itemName,
      itemIcon: itemIcon || '📦',
      stream: finalStream,
      streamLabel: finalStream,
      weightEst: weightEst || '1.0 kg',
      credits: Number(credits) || defaultCredits,
      co2Grams: Number(co2Grams) || 110,
      pickupDate,
      timeSlot: timeSlot || 'Morning (9:00 AM - 12:00 PM)',
      address,
      instructions: instructions || 'Segregated beside main door'
    });

    res.status(201).json({ success: true, message: 'Doorstep pickup scheduled successfully', data: newPickup });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/pickups/:id/complete (Simulate picker completion and instant credit payout)
router.post('/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const { pickerId = 'usr_picker_01' } = req.body;

    const existing = db.getPickupById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    const updated = db.updatePickup(id, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      verifiedBy: pickerId
    });

    // Credit user's wallet
    const user = db.getUserById('usr_resident_01');
    if (user) {
      db.updateUser(user.id, {
        walletBalance: (user.walletBalance || 120) + (existing.credits || 25)
      });
    }

    res.json({
      success: true,
      message: 'Pickup verified and credits deposited into wallet',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
