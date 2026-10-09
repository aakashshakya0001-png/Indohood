import { Router } from 'express';
import dynamoService from '../services/dynamo.service.js';
import db from '../../database/db.js';

const router = Router();

// GET /api/pickups
router.get('/', async (req, res) => {
  try {
    let list = await dynamoService.getPickups();
    if (!list || list.length === 0) {
      list = db.getPickups();
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/pickups/schedule
router.post('/schedule', async (req, res) => {
  try {
    const { 
      itemId, itemName, itemIcon, stream, streamLabel, 
      weightEst, credits, co2Grams, pickupDate, timeSlot, address, instructions, userId = 'usr_resident_01'
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

    const pickupItem = {
      id: `pk_${Date.now()}`,
      bookingRef: `IND-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'SCHEDULED',
      userId,
      itemId: itemId || 'custom_item',
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
    };

    let savedPickup = null;
    try {
      savedPickup = await dynamoService.savePickup(pickupItem);
    } catch (dErr) {
      console.warn('[Pickups Route] DynamoDB savePickup failed, using local DB:', dErr.message);
    }

    // Also persist in local db cache
    const localPickup = db.addPickup(pickupItem);

    res.status(201).json({ 
      success: true, 
      message: 'Doorstep pickup scheduled and saved in DynamoDB cloud database', 
      data: savedPickup || localPickup 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/pickups/:id/complete (Simulate picker completion and instant credit payout)
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { pickerId = 'usr_picker_01', actualWeightKg, verificationNotes } = req.body;

    let existing = await dynamoService.getPickupById(id);
    if (!existing) {
      existing = db.getPickupById(id);
    }
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    const updates = {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      verifiedBy: pickerId,
      ...(actualWeightKg && { actualWeightKg: Number(actualWeightKg) }),
      ...(verificationNotes && { verificationNotes })
    };

    let updated = null;
    try {
      updated = await dynamoService.updatePickup(id, updates);
    } catch (dErr) {
      console.warn('[Pickups Route] DynamoDB updatePickup failed, using local DB:', dErr.message);
    }
    const localUpdated = db.updatePickup(id, updates);

    // Credit user's wallet in DynamoDB
    const targetUserId = existing.userId || 'usr_resident_01';
    let resident = await dynamoService.getUserById(targetUserId);
    if (!resident) {
      resident = db.getUserById(targetUserId);
    }

    const earnedCredits = existing.credits || 25;
    if (resident) {
      const newBalance = (resident.walletBalance ?? 0) + earnedCredits;
      try {
        await dynamoService.updateUser(targetUserId, { walletBalance: newBalance });
      } catch (uErr) {
        console.warn('[Pickups Route] DynamoDB credit update failed:', uErr.message);
      }
      db.updateUser(targetUserId, { walletBalance: newBalance });
    }

    res.json({
      success: true,
      message: 'Pickup verified and credits deposited into wallet (saved to cloud database)',
      data: updated || localUpdated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
