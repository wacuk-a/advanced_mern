import express from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  getFile,
  deleteFile,
  serveFile
} from '../controllers/fileController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// All routes are requireAuthed
router.use(requireAuth);

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
