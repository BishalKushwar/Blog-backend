const dotenv = require('dotenv');
dotenv.config();

const config = {
    // Server settings
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database settings
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blog',
    
    // Authentication settings
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30,

    // Email settings
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.FROM_EMAIL,
    FROM_NAME: process.env.FROM_NAME,

    // API settings
    API_URL: process.env.API_URL || 'http://localhost:5000',
    API_VERSION: process.env.API_VERSION || 'v1',

    // CORS settings
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
    if (!config[envVar]) {
        throw new Error(`Environment variable ${envVar} is required`);
    }
});

module.exports = config;