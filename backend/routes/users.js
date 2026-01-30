const express = require('express');
const db = require('../config/sqlite');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        let query, table;

        if (userType === 'jobseeker') {
            table = 'jobseekers';
            query = 'SELECT id, first_name, last_name, email, phone, created_at FROM jobseekers WHERE id = ?';
        } else if (userType === 'employer') {
            table = 'employers';
            query = 'SELECT id, company_name, contact_person, email, phone, website, description, location, industry, employees, founded, created_at FROM employers WHERE id = ?';
        } else {
            table = 'adminb';
            query = 'SELECT id, username, email, created_at FROM adminb WHERE id = ?';
        }

        const user = await db.get(query, [userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: user,
            userType: userType
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        const updateData = req.body;

        let query, values;

        if (userType === 'jobseeker') {
            const { firstName, lastName, phone } = updateData;
            query = 'UPDATE jobseekers SET first_name = ?, last_name = ?, phone = ? WHERE id = ?';
            values = [firstName, lastName, phone, userId];
        } else if (userType === 'employer') {
            const { companyName, contactPerson, phone, website, description, location, industry, employees, founded } = updateData;
            query = 'UPDATE employers SET company_name = ?, contact_person = ?, phone = ?, website = ?, description = ?, location = ?, industry = ?, employees = ?, founded = ? WHERE id = ?';
            values = [companyName, contactPerson, phone, website, description, location, industry, employees, founded, userId];
        } else {
            return res.status(403).json({ error: 'Admin profile updates not allowed via API' });
        }

        await db.run(query, values);

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

module.exports = router;