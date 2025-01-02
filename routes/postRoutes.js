const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth/authMiddleware');
const { checkRole } = require('../middleware/auth/roleMiddleware');
const { validatePost, createPostSchema, updatePostSchema } = require('../middleware/validation/postValidation');

// Import controllers
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getMyPosts
} = require('../controllers/postController');

// Reroute into comment router
const commentRouter = require('./commentRoutes');
router.use('/:postId/comments', commentRouter);

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.use(verifyToken);

// Author/Admin only routes
router.post('/', 
    checkRole('author', 'admin'),
    validatePost(createPostSchema),
    createPost
);

router.put('/:id',
    checkRole('author', 'admin'),
    validatePost(updatePostSchema),
    updatePost
);

router.delete('/:id',
    checkRole('author', 'admin'),
    deletePost
);

// User routes
router.get('/user/myposts', getMyPosts);
router.post('/:id/like', likePost);
router.delete('/:id/unlike', unlikePost);

module.exports = router;