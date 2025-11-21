import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { File } from '../models/File';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { 
  uploadSingle, 
  uploadMultiple, 
  validateFile, 
  generateFileUrl, 
  getFilePath, 
  deleteFile as deleteFileFromFS 
} from '../middleware/upload';

// @desc    Upload single file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = [
  uploadSingle('file'),
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    // Validate file
    const validation = validateFile(req.file);
    if (!validation.isValid) {
      return next(new AppError(validation.error!, 400));
    }

    const { originalname, mimetype, size, filename } = req.file;
    const fileUrl = generateFileUrl(filename);

    // Process image files (create thumbnail, get dimensions)
    let metadata: any = {};
    
    if (mimetype.startsWith('image/')) {
      try {
        const image = sharp(getFilePath(filename));
        const imageMetadata = await image.metadata();
        
        metadata.width = imageMetadata.width;
        metadata.height = imageMetadata.height;

        // Create thumbnail for images
        if (imageMetadata.width && imageMetadata.width > 200) {
          const thumbnailFilename = `thumb-${filename}`;
          const thumbnailPath = getFilePath(thumbnailFilename);
          
          await image
            .resize(200, 200, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
            
          metadata.thumbnail = generateFileUrl(thumbnailFilename);
        }
      } catch (error) {
        console.warn('Could not process image metadata:', error);
      }
    }

    // Save file info to database
    const fileDoc = await File.create({
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      path: getFilePath(filename),
      url: fileUrl,
      uploadedBy: req.user?._id,
      metadata,
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    });

    await fileDoc.populate('uploadedBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: fileDoc
    });
  })
];

// @desc    Upload multiple files
// @route   POST /api/files/upload-multiple
// @access  Private
export const uploadMultipleFiles = [
  uploadMultiple('files', 10),
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new AppError('No files uploaded', 400));
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    for (const file of files) {
      // Validate each file
      const validation = validateFile(file);
      if (!validation.isValid) {
        continue; // Skip invalid files
      }

      const { originalname, mimetype, size, filename } = file;
      const fileUrl = generateFileUrl(filename);

      let metadata: any = {};
      
      // Process image files
      if (mimetype.startsWith('image/')) {
        try {
          const image = sharp(getFilePath(filename));
          const imageMetadata = await image.metadata();
          
          metadata.width = imageMetadata.width;
          metadata.height = imageMetadata.height;

          // Create thumbnail
          if (imageMetadata.width && imageMetadata.width > 200) {
            const thumbnailFilename = `thumb-${filename}`;
            const thumbnailPath = getFilePath(thumbnailFilename);
            
            await image
              .resize(200, 200, {
                fit: 'inside',
                withoutEnlargement: true
              })
              .jpeg({ quality: 80 })
              .toFile(thumbnailPath);
              
            metadata.thumbnail = generateFileUrl(thumbnailFilename);
          }
        } catch (error) {
          console.warn('Could not process image metadata for file:', originalname, error);
        }
      }

      // Save file info to database
      const fileDoc = await File.create({
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        path: getFilePath(filename),
        url: fileUrl,
        uploadedBy: req.user?._id,
        metadata,
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      });

      await fileDoc.populate('uploadedBy', 'name email avatar');
      uploadedFiles.push(fileDoc);
    }

    res.status(201).json({
      success: true,
      data: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} files`
    });
  })
];

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
export const getFiles = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const filter: any = { uploadedBy: req.user?._id };
  
  // Filter by file type
  if (req.query.type) {
    if (req.query.type === 'image') {
      filter.mimeType = { $regex: /^image\// };
    } else if (req.query.type === 'document') {
      filter.mimeType = { $regex: /^application\// };
    } else if (req.query.type === 'video') {
      filter.mimeType = { $regex: /^video\// };
    } else if (req.query.type === 'audio') {
      filter.mimeType = { $regex: /^audio\// };
    }
  }

  // Search by filename
  if (req.query.search) {
    filter.originalName = { $regex: req.query.search, $options: 'i' };
  }

  // Filter by tags
  if (req.query.tags) {
    filter.tags = { $in: (req.query.tags as string).split(',') };
  }

  const files = await File.find(filter)
    .populate('uploadedBy', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await File.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: files,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
export const getFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const file = await File.findById(req.params.id)
    .populate('uploadedBy', 'name email avatar');

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Check if user owns the file or file is public
  if (file.uploadedBy._id.toString() !== req.user?._id.toString() && !file.isPublic) {
    return next(new AppError('Not authorized to access this file', 403));
  }

  res.status(200).json({
    success: true,
    data: file
  });
});

// @desc    Serve file
// @route   GET /api/files/serve/:filename
// @access  Public/Private (depends on file visibility)
export const serveFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params;
  
  const file = await File.findOne({ filename });
  
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Check if file is public or user is authenticated and owns the file
  if (!file.isPublic) {
    const authReq = req as AuthRequest;
    if (!authReq.user || authReq.user._id.toString() !== file.uploadedBy.toString()) {
      return next(new AppError('Not authorized to access this file', 403));
    }
  }

  const filePath = getFilePath(filename);
  
  if (!fs.existsSync(filePath)) {
    return next(new AppError('File not found on server', 404));
  }

  // Set appropriate headers
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
  res.setHeader('Content-Length', file.size.toString());

  // Stream file to response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Check if user owns the file
  if (file.uploadedBy.toString() !== req.user?._id.toString()) {
    return next(new AppError('Not authorized to delete this file', 403));
  }

  // Delete file from filesystem
  try {
    await deleteFileFromFS(file.filename);
    
    // Delete thumbnail if exists
    if (file.metadata.thumbnail) {
      const thumbnailFilename = path.basename(file.metadata.thumbnail);
      await deleteFileFromFS(thumbnailFilename);
    }
  } catch (error) {
    console.warn('Could not delete file from filesystem:', error);
  }

  // Delete file record from database
  await File.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'File deleted successfully'
  });
});

// @desc    Update file metadata
// @route   PUT /api/files/:id
// @access  Private
export const updateFile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Check if user owns the file
  if (file.uploadedBy.toString() !== req.user?._id.toString()) {
    return next(new AppError('Not authorized to update this file', 403));
  }

  const { originalName, isPublic, tags } = req.body;

  const updatedFile = await File.findByIdAndUpdate(
    req.params.id,
    {
      originalName: originalName || file.originalName,
      isPublic: isPublic !== undefined ? isPublic : file.isPublic,
      tags: tags ? JSON.parse(tags) : file.tags
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('uploadedBy', 'name email avatar');

  res.status(200).json({
    success: true,
    data: updatedFile
  });
});
