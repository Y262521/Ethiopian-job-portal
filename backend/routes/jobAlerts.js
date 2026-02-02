const express = require('express');
const router = express.Router();
const db = require('../config/sqlite');

// Get job alerts for a user
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // First get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker not found'
            });
        }

        // Get job alerts
        const jobAlerts = await db.all(`
            SELECT 
                id,
                title,
                keywords,
                location,
                category,
                job_type,
                experience_level,
                salary_min,
                salary_max,
                is_active,
                email_frequency,
                last_sent,
                created_at
            FROM job_alerts
            WHERE jobseeker_id = ?
            ORDER BY created_at DESC
        `, [jobseeker.id]);

        res.json({
            success: true,
            jobAlerts: jobAlerts
        });

    } catch (error) {
        console.error('Error fetching job alerts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch job alerts'
        });
    }
});

// Create a job alert
router.post('/create', async (req, res) => {
    try {
        const {
            email,
            title,
            keywords,
            location,
            category,
            jobType,
            experienceLevel,
            salaryMin,
            salaryMax,
            emailFrequency
        } = req.body;

        if (!email || !title) {
            return res.status(400).json({
                success: false,
                error: 'Email and title are required'
            });
        }

        // Get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker not found'
            });
        }

        // Create the job alert
        const result = await db.run(`
            INSERT INTO job_alerts (
                jobseeker_id, 
                title, 
                keywords, 
                location, 
                category, 
                job_type, 
                experience_level, 
                salary_min, 
                salary_max, 
                email_frequency
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            jobseeker.id,
            title,
            keywords || null,
            location || null,
            category || null,
            jobType || null,
            experienceLevel || null,
            salaryMin || null,
            salaryMax || null,
            emailFrequency || 'daily'
        ]);

        res.json({
            success: true,
            message: 'Job alert created successfully',
            alertId: result.id
        });

    } catch (error) {
        console.error('Error creating job alert:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create job alert'
        });
    }
});

// Update a job alert
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            email,
            title,
            keywords,
            location,
            category,
            jobType,
            experienceLevel,
            salaryMin,
            salaryMax,
            emailFrequency,
            isActive
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker not found'
            });
        }

        // Update the job alert
        const result = await db.run(`
            UPDATE job_alerts SET
                title = ?,
                keywords = ?,
                location = ?,
                category = ?,
                job_type = ?,
                experience_level = ?,
                salary_min = ?,
                salary_max = ?,
                email_frequency = ?,
                is_active = ?
            WHERE id = ? AND jobseeker_id = ?
        `, [
            title,
            keywords || null,
            location || null,
            category || null,
            jobType || null,
            experienceLevel || null,
            salaryMin || null,
            salaryMax || null,
            emailFrequency || 'daily',
            isActive !== undefined ? (isActive ? 1 : 0) : 1,
            id,
            jobseeker.id
        ]);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Job alert not found'
            });
        }

        res.json({
            success: true,
            message: 'Job alert updated successfully'
        });

    } catch (error) {
        console.error('Error updating job alert:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update job alert'
        });
    }
});

// Delete a job alert
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker not found'
            });
        }

        // Delete the job alert
        const result = await db.run(
            'DELETE FROM job_alerts WHERE id = ? AND jobseeker_id = ?',
            [id, jobseeker.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Job alert not found'
            });
        }

        res.json({
            success: true,
            message: 'Job alert deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting job alert:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete job alert'
        });
    }
});

// Toggle job alert active status
router.patch('/toggle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.status(404).json({
                success: false,
                error: 'Job seeker not found'
            });
        }

        // Get current status
        const alert = await db.get(
            'SELECT is_active FROM job_alerts WHERE id = ? AND jobseeker_id = ?',
            [id, jobseeker.id]
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Job alert not found'
            });
        }

        // Toggle status
        const newStatus = alert.is_active ? 0 : 1;
        await db.run(
            'UPDATE job_alerts SET is_active = ? WHERE id = ? AND jobseeker_id = ?',
            [newStatus, id, jobseeker.id]
        );

        res.json({
            success: true,
            message: `Job alert ${newStatus ? 'activated' : 'deactivated'} successfully`,
            isActive: !!newStatus
        });

    } catch (error) {
        console.error('Error toggling job alert:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle job alert'
        });
    }
});

module.exports = router;