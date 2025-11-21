import express from 'express';
import authRoutes from './auth';
import userRoutes from './userRoutes';
import postRoutes from './posts';
import fileRoutes from './fileRoutes';

const router = express.Router();

// Use routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/files', fileRoutes);

export default router;
