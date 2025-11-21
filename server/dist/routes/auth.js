"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.validateRegister, authController_1.register);
router.post('/login', validation_1.validateLogin, authController_1.login);
router.get('/me', auth_1.requireAuth, authController_1.getMe);
router.put('/updatedetails', auth_1.requireAuth, validation_1.validateUpdateDetails, authController_1.updateDetails);
router.put('/updatepassword', auth_1.requireAuth, validation_1.validateUpdatePassword, authController_1.updatePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map