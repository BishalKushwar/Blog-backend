const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
    // Create transport
    const transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465,
        auth: {
            user: config.SMTP_EMAIL,
            pass: config.SMTP_PASSWORD
        }
    });

    // Email options
    const mailOptions = {
        from: `${config.FROM_NAME} <${config.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html || options.text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Email could not be sent');
    }
};

// Email templates
const emailTemplates = {
    resetPassword: (token) => ({
        subject: 'Password Reset Request',
        html: `
            <h1>You have requested to reset your password</h1>
            <p>Please click on the link below to reset your password:</p>
            <a href="${config.API_URL}/reset-password/${token}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `
    }),
    
    welcomeEmail: (username) => ({
        subject: 'Welcome to our Blog',
        html: `
            <h1>Welcome ${username}!</h1>
            <p>Thank you for registering with us.</p>
            <p>We're excited to have you on board!</p>
        `
    })
};

module.exports = {
    sendEmail,
    emailTemplates
};