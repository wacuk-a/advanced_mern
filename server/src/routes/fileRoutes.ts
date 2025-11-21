import express from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  getFile,
  deleteFile,
  serveFile
} from '../controllers/fileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// File upload routes
router.post('/upload', uploadFile);
router.post('/upload-multiple', uploadMultipleFiles);

// File management routes
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

// File serving route (less strict authentication if needed for public files)
router.get('/serve/:filename', serveFile);

export default router;
