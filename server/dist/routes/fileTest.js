"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Public file upload test endpoint (no auth required)
router.post('/upload-test', (0, upload_1.uploadSingle)('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        success: true,
        message: 'File uploaded successfully (test)',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        }
    });
});
exports.default = router;
//# sourceMappingURL=fileTest.js.map