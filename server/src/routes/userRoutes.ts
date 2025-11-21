import express from 'express';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth);

// Basic user routes placeholder
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile route' });
});

export default router;
