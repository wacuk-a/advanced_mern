import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  validateUpdateDetails,
  validateUpdatePassword,
} from '../middleware/validation';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', requireAuth, getMe);
router.put('/updatedetails', requireAuth, validateUpdateDetails, updateDetails);
router.put('/updatepassword', requireAuth, validateUpdatePassword, updatePassword);

export default router;
