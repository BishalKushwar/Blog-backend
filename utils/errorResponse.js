class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler function
const handleError = (err, res) => {
    const { statusCode = 500, message, stack } = err;

    const response = {
        success: false,
        status: err.status || 'error',
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: stack })
    };

    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack);
    }

    res.status(statusCode).json(response);
};

// Common error types
const commonErrors = {
    VALIDATION_ERROR: {
        message: 'Invalid input data',
        statusCode: 400
    },
    NOT_FOUND: {
        message: 'Resource not found',
        statusCode: 404
    },
    UNAUTHORIZED: {
        message: 'Unauthorized access',
        statusCode: 401
    },
    FORBIDDEN: {
        message: 'Forbidden access',
        statusCode: 403
    }
};

module.exports = {
    ErrorResponse,
    handleError,
    commonErrors
};