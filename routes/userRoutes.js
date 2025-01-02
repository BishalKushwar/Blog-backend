const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth/authMiddleware');
const { checkRole } = require('../middleware/auth/roleMiddleware');

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile,
    getProfile
} = require('../controllers/userController');

// Public routes
router.get('/profile/:username', getUser);

// Protected routes
router.use(verifyToken);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin only routes
router.get('/', checkRole('admin'), getAllUsers);
router.put('/:id', checkRole('admin'), updateUser);
router.delete('/:id', checkRole('admin'), deleteUser);

module.exports = router;