import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    cb(null, baseName + '-' + uniqueSuffix + fileExtension);
  }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: audio, images, and documents`));
  }
};

// Configure multer
export const uploadSingle = (fieldName: string) => 
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for audio files
      files: 1
    }
  }).single(fieldName);

export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
      files: maxCount
    }
  }).array(fieldName, maxCount);

// File validation function
export const validateFile = (file: Express.Multer.File): { isValid: boolean; error?: string } => {
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
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (blacklistedExtensions.includes(fileExtension)) {
    return { isValid: false, error: 'File type not allowed for security reasons' };
  }

  return { isValid: true };
};

// Utility functions
export const generateFileUrl = (filename: string): string => {
  return `/api/files/serve/${filename}`;
};

export const getFilePath = (filename: string): string => {
  return path.join(process.cwd(), 'uploads', filename);
};

export const deleteFile = async (filename: string): Promise<boolean> => {
  try {
    const filePath = getFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
