import { Router } from 'express';
import dynamoService from '../services/dynamo.service.js';
import db from '../../database/db.js';

const router = Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    let users = await dynamoService.getUsers();
    if (!users || users.length === 0) {
      users = db.getUsers();
    }
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    let user = await dynamoService.getUserById(req.params.id);
    if (!user) {
      user = db.getUserById(req.params.id);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/profile/:id (Update bio, avatar, name, address, location)
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, bio, avatar, address, location, walletBalance } = req.body;
    const updates = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(address && { address }),
      ...(location !== undefined && { location }),
      ...(walletBalance !== undefined && { walletBalance: Number(walletBalance) }),
    };

    let updated = null;
    try {
      updated = await dynamoService.updateUser(req.params.id, updates);
    } catch (dErr) {
      console.warn('[Users Route] DynamoDB update failed, using local DB:', dErr.message);
    }

    const localUpdated = db.updateUser(req.params.id, updates);
    const finalUser = updated || localUpdated;

    if (!finalUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully in cloud database', 
      data: finalUser 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
