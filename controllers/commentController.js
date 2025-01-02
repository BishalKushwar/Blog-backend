const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const { ErrorResponse } = require('../utils/errorResponse');

// Get all comments for a post
exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        next(error);
    }
};

// Get single comment
exports.getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('author', 'username avatar')
            .populate('post', 'title');

        if (!comment) {
            return next(new ErrorResponse('Comment not found', 404));
        }

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

// Create comment
exports.createComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        const comment = await Comment.create({
            content: req.body.content,
            post: req.params.postId,
            author: req.user.id
        });

        await comment.populate('author', 'username avatar');

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

// Update comment
exports.updateComment = async (req, res, next) => {
    try {
        let comment = await Comment.findById(req.params.id);

        if (!comment) {
            return next(new ErrorResponse('Comment not found', 404));
        }

        // Check if user is comment owner
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to update this comment', 403));
        }

        comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true, runValidators: true }
        ).populate('author', 'username avatar');

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return next(new ErrorResponse('Comment not found', 404));
        }

        // Check if user is comment owner or admin
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this comment', 403));
        }

        await comment.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Report comment
exports.reportComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return next(new ErrorResponse('Comment not found', 404));
        }

        comment.isReported = true;
        comment.reportReason = req.body.reason;
        await comment.save();

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};