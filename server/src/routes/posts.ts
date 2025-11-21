import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';
import { validateCreatePost, validateUpdatePost } from '../middleware/validation';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, validateCreatePost, createPost);
router.put('/:id', protect, validateUpdatePost, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);

export default router;
