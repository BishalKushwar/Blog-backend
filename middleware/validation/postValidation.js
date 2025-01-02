const Joi = require('joi');
const mongoose = require('mongoose');

// Validate ObjectId
const validateObjectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

// Create post validation schema
const createPostSchema = Joi.object({
    title: Joi.string()
        .required()
        .min(3)
        .max(100)
        .trim()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title cannot exceed 100 characters'
        }),

    content: Joi.string()
        .required()
        .min(10)
        .max(50000)
        .trim()
        .messages({
            'string.empty': 'Content cannot be empty',
            'string.min': 'Content must be at least 10 characters long',
            'string.max': 'Content cannot exceed 50000 characters'
        }),

    tags: Joi.array()
        .items(Joi.string().trim())
        .max(5)
        .messages({
            'array.max': 'Cannot add more than 5 tags'
        }),

    status: Joi.string()
        .valid('draft', 'published')
        .default('draft'),

    category: Joi.string()
        .required()
        .trim()
});

// Update post validation schema
const updatePostSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .trim(),
    
    content: Joi.string()
        .min(10)
        .max(50000)
        .trim(),
    
    tags: Joi.array()
        .items(Joi.string().trim())
        .max(5),
    
    status: Joi.string()
        .valid('draft', 'published'),
    
    category: Joi.string()
        .trim()
}).min(1);

// Validation middleware
const validatePost = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            
            return res.status(400).json({
                success: false,
                errors
            });
        }
        
        next();
    };
};

module.exports = {
    validatePost,
    createPostSchema,
    updatePostSchema
};