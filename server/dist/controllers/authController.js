"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateDetails = exports.getMe = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const errorHandler_1 = require("../middleware/errorHandler");
// Generate JWT Token
const generateToken = (id) => {
    const payload = { id };
    const secret = process.env.JWT_SECRET;
    // Use type assertion to avoid TypeScript strict checking
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '30d' });
};
// Send token response
const sendTokenResponse = (user, statusCode, res) => {
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
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    const { name, email, password } = req.body;
    // Check if user exists
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        return next(new errorHandler_1.AppError('User already exists with this email', 400));
    }
    // Create user
    const user = await User_1.User.create({
        name,
        email,
        password,
    });
    sendTokenResponse(user, 201, res);
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    const { email, password } = req.body;
    // Check if user exists and password is correct
    const user = await User_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return next(new errorHandler_1.AppError('Invalid email or password', 401));
    }
    sendTokenResponse(user, 200, res);
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user?._id);
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
exports.updateDetails = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User_1.User.findByIdAndUpdate(req.user?._id, fieldsToUpdate, {
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
exports.updatePassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    const user = await User_1.User.findById(req.user?._id).select('+password');
    if (!user) {
        return next(new errorHandler_1.AppError('User not found', 404));
    }
    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new errorHandler_1.AppError('Current password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});
//# sourceMappingURL=authController.js.map