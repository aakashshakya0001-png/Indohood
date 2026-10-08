import { Router } from 'express';
import db from '../../database/db.js';

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/profile/:id
router.get('/profile/:id', (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/profile/:id (Update bio, avatar, name)
router.put('/profile/:id', (req, res) => {
  try {
    const { name, bio, avatar, address } = req.body;
    const updated = db.updateUser(req.params.id, {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(address && { address })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
