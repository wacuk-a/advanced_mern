"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
exports.userController = {
    async generateAnonymousToken(params) {
        try {
            const { anonymousSessionId } = params;
            // Create anonymous user or use existing
            let user = await User_1.default.findOne({ email: `anonymous_${anonymousSessionId}@temp.com` });
            if (!user) {
                user = new User_1.default({
                    name: 'Anonymous User',
                    email: `anonymous_${anonymousSessionId}@temp.com`,
                    password: 'anonymous_password', // In real app, use proper auth
                    role: 'user',
                    isVerified: false
                });
                await user.save();
            }
            // Create token with proper options
            const token = jsonwebtoken_1.default.sign({ userId: user._id, anonymous: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return {
                success: true,
                token,
                userId: user._id,
                isAnonymous: true
            };
        }
        catch (error) {
            console.error('Generate anonymous token error:', error);
            throw error;
        }
    },
    async updateEmergencyContacts(params) {
        try {
            const { userId, contacts } = params;
            const user = await User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // In a real implementation, you would store emergency contacts
            // For now, we'll just return success
            console.log('Emergency contacts updated for user:', userId, contacts);
            return {
                success: true,
                emergencyContacts: contacts
            };
        }
        catch (error) {
            console.error('Update emergency contacts error:', error);
            throw error;
        }
    },
    async updateSafetyPlan(params) {
        try {
            const { userId, safetyPlan } = params;
            const user = await User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // In a real implementation, you would store safety plan
            // For now, we'll just return success
            console.log('Safety plan updated for user:', userId, safetyPlan);
            return {
                success: true,
                safetyPlan: safetyPlan
            };
        }
        catch (error) {
            console.error('Update safety plan error:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=userController.js.map