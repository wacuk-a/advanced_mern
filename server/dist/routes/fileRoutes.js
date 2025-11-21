"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../controllers/fileController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes are requireAuthed
router.use(auth_1.requireAuth);
// File upload routes
router.post('/upload', fileController_1.uploadFile);
router.post('/upload-multiple', fileController_1.uploadMultipleFiles);
// File management routes
router.get('/', fileController_1.getFiles);
router.get('/:id', fileController_1.getFile);
router.delete('/:id', fileController_1.deleteFile);
// File serving route (less strict authentication if needed for public files)
router.get('/serve/:filename', fileController_1.serveFile);
exports.default = router;
//# sourceMappingURL=fileRoutes.js.map