import { Router } from 'express';
import db from '../../database/db.js';

const router = Router();

// GET /api/articles
router.get('/', (req, res) => {
  try {
    const list = db.getArticles();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/articles/:id
router.get('/:id', (req, res) => {
  try {
    const article = db.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
