const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('userType').isIn(['jobseeker', 'employer']).withMessage('Invalid user type'),
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
    body('companyName').if(body('userType').equals('employer')).notEmpty().trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters')
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
];

// Register endpoint
router.post('/register', validateRegistration, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { userType, firstName, lastName, email, password, phone, companyName } = req.body;

        // Check if email already exists in any user table
        const tables = ['jobseekers', 'employers', 'adminb'];
        for (const table of tables) {
            const existing = await db.get(`SELECT id FROM ${table} WHERE email = ?`, [email]);
            if (existing) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user based on type
        if (userType === 'jobseeker') {
            await db.run(`
        INSERT INTO jobseekers (first_name, last_name, email, password, phone, status) 
        VALUES (?, ?, ?, ?, ?, 'approved')
      `, [firstName, lastName, email, hashedPassword, phone]);
        } else {
            if (!companyName) {
                return res.status(400).json({
                    success: false,
                    error: 'Company name is required for employers'
                });
            }

            await db.run(`
        INSERT INTO employers (company_name, contact_person, email, password, phone, status) 
        VALUES (?, ?, ?, ?, ?, 'approved')
      `, [companyName, `${firstName} ${lastName}`, email, hashedPassword, phone]);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! You can now login.'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed. Please try again.'
        });
    }
});

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;
        let user = null;
        let userType = null;

        // Check jobseekers table
        user = await db.get(
            'SELECT id, email, password, first_name, last_name, status FROM jobseekers WHERE email = ?',
            [email]
        );

        if (user) {
            userType = 'jobseeker';
        }

        // Check employers table if not found in jobseekers
        if (!user) {
            user = await db.get(
                'SELECT id, email, password, company_name, status FROM employers WHERE email = ?',
                [email]
            );

            if (user) {
                userType = 'employer';
            }
        }

        // Check admin table if not found in employers
        if (!user) {
            user = await db.get(
                'SELECT id, email, password, username, status FROM adminb WHERE email = ?',
                [email]
            );

            if (user) {
                userType = 'admin';
            }
        }

        // Verify user exists and password is correct
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check if account is approved
        if (user.status !== 'approved') {
            return res.status(403).json({
                success: false,
                error: 'Account not approved yet'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                userType: userType,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Prepare user data for response
        const userData = {
            id: user.id,
            email: user.email,
            type: userType,
            name: userType === 'jobseeker'
                ? `${user.first_name} ${user.last_name}`
                : (userType === 'employer' ? user.company_name : user.username)
        };

        res.json({
            success: true,
            token: token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;