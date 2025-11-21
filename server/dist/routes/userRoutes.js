"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.requireAuth);
// Basic user routes placeholder
router.get('/profile', (req, res) => {
    res.json({ message: 'User profile route' });
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map