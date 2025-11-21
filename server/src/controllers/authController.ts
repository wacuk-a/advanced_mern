import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Generate JWT Token
const generateToken = (id: string): string => {
  const payload = { id };
  const secret = process.env.JWT_SECRET!;
  
  // Use type assertion to avoid TypeScript strict checking
  return jwt.sign(payload, secret, { expiresIn: '30d' } as jwt.SignOptions);
};

// Send token response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  const { email, password } = req.body;

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user?._id);

  res.status(200).json({
    success: true,
    user: {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      avatar: user?.avatar,
      isVerified: user?.isVerified,
    },
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user?._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user: {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      avatar: user?.avatar,
      isVerified: user?.isVerified,
    },
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  const user = await User.findById(req.user?._id).select('+password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check current password
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
