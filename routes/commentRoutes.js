const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyToken } = require('../middleware/auth/authMiddleware');
const { isOwner } = require('../middleware/auth/roleMiddleware');
const Comment = require('../models/comment.model');

const {
    getComments,
    getComment,
    createComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

// Get all comments for a post
router.get('/', getComments);

// Get single comment
router.get('/:id', getComment);

// Create comment - requires authentication
router.post('/', verifyToken, createComment);

// Update comment - requires authentication and ownership
router.put('/:id', 
    verifyToken, 
    isOwner(Comment),
    updateComment
);

// Delete comment - requires authentication and ownership
router.delete('/:id',
    verifyToken,
    isOwner(Comment),
    deleteComment
);

module.exports = router;