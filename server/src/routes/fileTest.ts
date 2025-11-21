import express from 'express';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

// Public file upload test endpoint (no auth required)
router.post('/upload-test', uploadSingle('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully (test)',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

export default router;
