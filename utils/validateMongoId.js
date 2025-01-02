const mongoose = require('mongoose');
const { ErrorResponse } = require('./errorResponse');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    return true;
};

// Middleware to validate MongoDB ID
const validateMongoId = (req, res, next) => {
    const idToValidate = req.params.id || req.body.id;
    
    if (!idToValidate) {
        return next(new ErrorResponse('No ID parameter provided', 400));
    }

    if (!isValidObjectId(idToValidate)) {
        return next(new ErrorResponse('Invalid ID format', 400));
    }

    next();
};

// Validate array of MongoDB IDs
const validateMongoIdArray = (ids) => {
    if (!Array.isArray(ids)) {
        throw new ErrorResponse('Input must be an array', 400);
    }

    return ids.every(id => isValidObjectId(id));
};

module.exports = {
    isValidObjectId,
    validateMongoId,
    validateMongoIdArray
};