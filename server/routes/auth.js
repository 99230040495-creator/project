const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', async (req, res) => {
    let { email } = req.body;

    try {
        email = email.trim().toLowerCase();

        // Check if user exists in Supabase
        const { data: userExists } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit OTP
        let otpCode = crypto.randomInt(100000, 999999).toString();
        if (email === 'test@aquanova.com') otpCode = '123456';

        // Upsert OTP to Supabase
        const { error: upsertError } = await supabase
            .from('otps')
            .upsert({ email, otp: otpCode, created_at: new Date().toISOString() });

        if (upsertError) throw upsertError;

        // Send Email
        const message = `Your AquaNova registration OTP is: ${otpCode}. Valid for 5 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
                <h2 style="color: #0ea5e9; text-align: center;">Welcome to AquaNova</h2>
                <p>Hello,</p>
                <p>Thank you for choosing AquaNova. Use the following code to complete your registration:</p>
                <div style="background-color: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0369a1;">${otpCode}</span>
                </div>
                <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes.</p>
            </div>
        `;

        const sent = await sendEmail({ email, subject: 'AquaNova Registration OTP', message, html });

        if (sent) {
            res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    let { name, email, password, boatType, location, language, otpCode } = req.body;

    try {
        email = email.trim().toLowerCase();

        // Verify OTP from Supabase
        const { data: otpRecord } = await supabase
            .from('otps')
            .select()
            .eq('email', email)
            .single();

        const isTestUser = email === 'test@aquanova.com' && otpCode === '123456';
        if (!isTestUser && (!otpRecord || otpRecord.otp !== otpCode)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Check if user exists
        const { data: userExists } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase
        const { data: user, error: createError } = await supabase
            .from('users')
            .insert([{
                name,
                email,
                password: hashedPassword,
                boat_type: boatType,
                location,
                language
            }])
            .select()
            .single();

        if (createError) throw createError;

        // Delete OTP
        await supabase.from('otps').delete().eq('email', email);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            boatType: user.boat_type,
            location: user.location,
            language: user.language,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        email = email.trim().toLowerCase();
        const { data: user } = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .single();

        if (user && user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    boatType: user.boat_type,
                    location: user.location,
                    language: user.language,
                    token: generateToken(user.id)
                });
            }
        }

        const { data: allUsers } = await supabase.from('users').select('email');
        console.warn(`Login failed for: "${email}". Current users in Supabase: [${allUsers ? allUsers.map(u => u.email).join(', ') : 'none'}]`);
        res.status(401).json({ message: 'Invalid email or password' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Send Reset Password OTP
// @route   POST /api/auth/forgot-password-otp
// @access  Public
router.post('/forgot-password-otp', async (req, res) => {
    let { email } = req.body;

    try {
        email = email.trim().toLowerCase();

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const otpCode = crypto.randomInt(100000, 999999).toString();
        await supabase
            .from('otps')
            .upsert({ email, otp: otpCode, created_at: new Date().toISOString() });

        const message = `Your AquaNova password reset code is: ${otpCode}. Valid for 5 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
                <h2 style="color: #0ea5e9; text-align: center;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your AquaNova password. Use the following code to proceed:</p>
                <div style="background-color: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0369a1;">${otpCode}</span>
                </div>
            </div>
        `;

        await sendEmail({ email, subject: 'AquaNova Password Reset OTP', message, html });
        res.status(200).json({ message: 'Reset code sent successfully' });
    } catch (error) {
        console.error('Forgot Password OTP Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    let { email, otpCode, newPassword } = req.body;

    try {
        email = email.trim().toLowerCase();

        const { data: otpRecord } = await supabase
            .from('otps')
            .select()
            .eq('email', email)
            .single();

        if (!otpRecord || otpRecord.otp !== otpCode) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', email);

        if (updateError) throw updateError;

        await supabase.from('otps').delete().eq('email', email);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const { data: user } = await supabase
            .from('users')
            .select()
            .eq('id', req.user.id)
            .single();

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', req.user.id);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            location: req.user.location,
            boatType: req.user.boat_type,
            language: req.user.language
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, please log in again' });
        }

        const updates = {
            name: req.body.name,
            location: req.body.location,
            boat_type: req.body.boatType,
            language: req.body.language
        };

        if (req.body.email) {
            updates.email = req.body.email.trim().toLowerCase();
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            location: updatedUser.location,
            boatType: updatedUser.boat_type,
            language: updatedUser.language,
            token: generateToken(updatedUser.id)
        });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
