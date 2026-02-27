const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Log OTP to console for development/debugging purposes
        console.log('--- EMAIL SERVICE ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        // console.log(`Message: ${options.message}`); // Hide OTP in logs for safety
        console.log('----------------------');

        // Configure transporter
        // If EMAIL_USER and EMAIL_PASS are not provided, we only log to console
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not found in .env. Skipping actual email sending.');
            return true;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"AquaNova Support" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendEmail;
