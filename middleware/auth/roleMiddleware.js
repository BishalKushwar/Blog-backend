const User = require('../../models/user.model');

// Role hierarchy
const ROLES = {
    ADMIN: 'admin',
    AUTHOR: 'author',
    USER: 'user'
};

// Check if user has required role
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized`
            });
        }

        next();
    };
};

// Check if user is resource owner
const isOwner = (model) => async (req, res, next) => {
    try {
        const resource = await model.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        if (resource.user.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    ROLES,
    checkRole,
    isOwner
};