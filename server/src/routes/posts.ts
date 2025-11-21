import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController';
import { requireAuth } from '../middleware/auth';
import { validateCreatePost, validateUpdatePost } from '../middleware/validation';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', requireAuth, validateCreatePost, createPost);
router.put('/:id', requireAuth, validateUpdatePost, updatePost);
router.delete('/:id', requireAuth, deletePost);
router.post('/:id/like', requireAuth, likePost);

export default router;
