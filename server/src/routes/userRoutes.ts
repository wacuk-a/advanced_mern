import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// Basic user routes placeholder
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile route' });
});

export default router;
