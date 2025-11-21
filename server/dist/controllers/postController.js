"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const express_validator_1 = require("express-validator");
const Post_1 = require("../models/Post");
const errorHandler_1 = require("../middleware/errorHandler");
// @desc    Get all posts with filtering, sorting, and pagination
// @route   GET /api/posts
// @access  Public
exports.getPosts = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Filtering
    const filter = {};
    if (req.query.published) {
        filter.isPublished = req.query.published === 'true';
    }
    if (req.query.author) {
        filter.author = req.query.author;
    }
    if (req.query.tags) {
        filter.tags = { $in: req.query.tags.split(',') };
    }
    // Search
    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }
    // Sorting
    const sort = {};
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const posts = await Post_1.Post.find(filter)
        .populate('author', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await Post_1.Post.countDocuments(filter);
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
exports.getPost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id)
        .populate('author', 'name email avatar');
    if (!post) {
        return next(new errorHandler_1.AppError('Post not found', 404));
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
exports.createPost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    const { title, content, tags, isPublished } = req.body;
    const post = await Post_1.Post.create({
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
exports.updatePost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.AppError('Validation failed', 400, false));
    }
    let post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new errorHandler_1.AppError('Post not found', 404));
    }
    // Check if user owns the post
    if (post.author.toString() !== req.user?._id.toString()) {
        return next(new errorHandler_1.AppError('Not authorized to update this post', 403));
    }
    const { title, content, tags, isPublished } = req.body;
    post = await Post_1.Post.findByIdAndUpdate(req.params.id, {
        title,
        content,
        tags: tags || post.tags,
        isPublished: isPublished !== undefined ? isPublished : post.isPublished
    }, {
        new: true,
        runValidators: true
    }).populate('author', 'name email avatar');
    res.status(200).json({
        success: true,
        data: post
    });
});
// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new errorHandler_1.AppError('Post not found', 404));
    }
    // Check if user owns the post
    if (post.author.toString() !== req.user?._id.toString()) {
        return next(new errorHandler_1.AppError('Not authorized to delete this post', 403));
    }
    await Post_1.Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
    });
});
// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new errorHandler_1.AppError('Post not found', 404));
    }
    post.likes += 1;
    await post.save();
    res.status(200).json({
        success: true,
        data: { likes: post.likes }
    });
});
//# sourceMappingURL=postController.js.map