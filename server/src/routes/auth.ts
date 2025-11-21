import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  validateUpdateDetails,
  validateUpdatePassword,
} from '../middleware/validation';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validateUpdateDetails, updateDetails);
router.put('/updatepassword', protect, validateUpdatePassword, updatePassword);

export default router;
