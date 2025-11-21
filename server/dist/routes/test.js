"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Public test endpoint
router.get('/test-upload', (req, res) => {
    res.json({ message: 'File upload test endpoint is reachable', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=test.js.map