import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/Post';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all posts with filtering, sorting, and pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Filtering
  const filter: any = {};
  if (req.query.published) {
    filter.isPublished = req.query.published === 'true';
  }
  if (req.query.author) {
    filter.author = req.query.author;
  }
  if (req.query.tags) {
    filter.tags = { $in: (req.query.tags as string).split(',') };
  }

  // Search
  if (req.query.search) {
    filter.$text = { $search: req.query.search as string };
  }

  // Sorting
  const sort: any = {};
  const sortBy = req.query.sortBy as string || 'createdAt';
  const sortOrder = req.query.sortOrder as string || 'desc';
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const posts = await Post.find(filter)
    .populate('author', 'name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: posts,
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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name email avatar');

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  const { title, content, tags, isPublished } = req.body;

  const post = await Post.create({
    title,
    content,
    tags: tags || [],
    isPublished: isPublished || false,
    author: req.user?._id
  });

  await post.populate('author', 'name email avatar');

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, false));
  }

  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user owns the post
  if (post.author.toString() !== req.user?._id.toString()) {
    return next(new AppError('Not authorized to update this post', 403));
  }

  const { title, content, tags, isPublished } = req.body;

  post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title,
      content,
      tags: tags || post.tags,
      isPublished: isPublished !== undefined ? isPublished : post.isPublished
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('author', 'name email avatar');

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user owns the post
  if (post.author.toString() !== req.user?._id.toString()) {
    return next(new AppError('Not authorized to delete this post', 403));
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
});

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  post.likes += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: { likes: post.likes }
  });
});
