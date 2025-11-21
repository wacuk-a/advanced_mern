"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFilePath = exports.generateFileUrl = exports.validateFile = exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads');
        // Create uploads directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, fileExtension)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);
        cb(null, baseName + '-' + uniqueSuffix + fileExtension);
    }
});
// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types for Safe Voice app
    const allowedMimes = [
        // Audio files
        'audio/mpeg', // mp3
        'audio/wav',
        'audio/x-wav',
        'audio/webm',
        'audio/ogg',
        // Image files
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        // Document files
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: audio, images, and documents`));
    }
};
// Configure multer
const uploadSingle = (fieldName) => (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit for audio files
        files: 1
    }
}).single(fieldName);
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName, maxCount = 5) => (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: maxCount
    }
}).array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
// File validation function
const validateFile = (file) => {
    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        return { isValid: false, error: 'File size exceeds 50MB limit' };
    }
    // Check for empty files
    if (file.size === 0) {
        return { isValid: false, error: 'File is empty' };
    }
    // Additional security checks
    const blacklistedExtensions = ['.exe', '.bat', '.sh', '.php', '.js', '.py'];
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    if (blacklistedExtensions.includes(fileExtension)) {
        return { isValid: false, error: 'File type not allowed for security reasons' };
    }
    return { isValid: true };
};
exports.validateFile = validateFile;
// Utility functions
const generateFileUrl = (filename) => {
    return `/api/files/serve/${filename}`;
};
exports.generateFileUrl = generateFileUrl;
const getFilePath = (filename) => {
    return path_1.default.join(process.cwd(), 'uploads', filename);
};
exports.getFilePath = getFilePath;
const deleteFile = async (filename) => {
    try {
        const filePath = (0, exports.getFilePath)(filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=upload.js.map