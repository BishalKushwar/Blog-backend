const Post = require('../models/post.model');
const { ErrorResponse } = require('../utils/errorResponse');

// Get all posts
exports.getPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, tag, search } = req.query;

        // Build query
        let query = Post.find({ status: 'published' });

        // Search
        if (search) {
            query = query.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            });
        }

        // Filter by category
        if (category) {
            query = query.find({ category });
        }

        // Filter by tag
        if (tag) {
            query = query.find({ tags: tag });
        }

        // Execute query with pagination
        const posts = await query
            .populate('author', 'username avatar')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Post.countDocuments(query.getQuery());

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            pages: Math.ceil(total / limit),
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// Get single post
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username avatar')
            .populate('comments');

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Create post
exports.createPost = async (req, res, next) => {
    try {
        req.body.author = req.user.id;
        
        const post = await Post.create(req.body);
        await post.populate('author', 'username avatar');

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Update post
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check post ownership
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to update this post', 403));
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'username avatar');

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Delete post
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check post ownership
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this post', 403));
        }

        await post.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Like post
exports.likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        if (post.likes.includes(req.user.id)) {
            return next(new ErrorResponse('Post already liked', 400));
        }

        post.likes.push(req.user.id);
        await post.save();

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Unlike post
exports.unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        post.likes = post.likes.filter(
            like => like.toString() !== req.user.id
        );
        
        await post.save();

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Get user posts
exports.getMyPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .populate('author', 'username avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};