const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth/authMiddleware');
const { loginLimiter } = require('../middleware/auth/authMiddleware');
const { validateUser } = require('../middleware/validation/userValidation');

const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController');

// Auth routes
router.post('/register', validateUser, register);
router.post('/login', loginLimiter, login);
router.get('/logout', logout);
router.get('/me', verifyToken, getMe);

// Password routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-password', verifyToken, updatePassword);

module.exports = router;