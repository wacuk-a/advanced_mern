import express from 'express';

const router = express.Router();

// Public test endpoint
router.get('/test-upload', (req, res) => {
  res.json({ message: 'File upload test endpoint is reachable', timestamp: new Date().toISOString() });
});

export default router;
