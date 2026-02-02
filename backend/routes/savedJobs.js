const express = require('express');
const router = express.Router();
const db = require('../config/sqlite');

// Get saved jobs for a user
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

        // Get saved jobs with job details
        const savedJobs = await db.all(`
            SELECT 
                sj.id as saved_id,
                sj.saved_at,
                j.id,
                j.title,
                j.description,
                j.location,
                j.job_type,
                j.experience_level,
                j.salary,
                j.category_name as category,
                j.is_featured,
                j.is_urgent,
                j.created_at,
                e.company_name,
                e.logo
            FROM saved_jobs sj
            JOIN jobs j ON sj.job_id = j.id
            JOIN employers e ON j.employer_id = e.id
            WHERE sj.jobseeker_id = ?
            ORDER BY sj.saved_at DESC
        `, [jobseeker.id]);

        res.json({
            success: true,
            savedJobs: savedJobs
        });

    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch saved jobs'
        });
    }
});

// Save a job
router.post('/save', async (req, res) => {
    try {
        const { email, jobId } = req.body;

        if (!email || !jobId) {
            return res.status(400).json({
                success: false,
                error: 'Email and job ID are required'
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

        // Check if job exists
        const job = await db.get('SELECT id FROM jobs WHERE id = ?', [jobId]);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Check if already saved
        const existingSave = await db.get(
            'SELECT id FROM saved_jobs WHERE jobseeker_id = ? AND job_id = ?',
            [jobseeker.id, jobId]
        );

        if (existingSave) {
            return res.status(400).json({
                success: false,
                error: 'Job already saved'
            });
        }

        // Save the job
        const result = await db.run(
            'INSERT INTO saved_jobs (jobseeker_id, job_id) VALUES (?, ?)',
            [jobseeker.id, jobId]
        );

        res.json({
            success: true,
            message: 'Job saved successfully',
            savedJobId: result.id
        });

    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save job'
        });
    }
});

// Remove a saved job
router.delete('/remove', async (req, res) => {
    try {
        const { email, jobId } = req.body;

        if (!email || !jobId) {
            return res.status(400).json({
                success: false,
                error: 'Email and job ID are required'
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

        // Remove the saved job
        const result = await db.run(
            'DELETE FROM saved_jobs WHERE jobseeker_id = ? AND job_id = ?',
            [jobseeker.id, jobId]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Saved job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job removed from saved list'
        });

    } catch (error) {
        console.error('Error removing saved job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove saved job'
        });
    }
});

// Check if a job is saved by user
router.get('/check/:email/:jobId', async (req, res) => {
    try {
        const { email, jobId } = req.params;

        // Get the jobseeker ID
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        if (!jobseeker) {
            return res.json({
                success: true,
                isSaved: false
            });
        }

        // Check if job is saved
        const savedJob = await db.get(
            'SELECT id FROM saved_jobs WHERE jobseeker_id = ? AND job_id = ?',
            [jobseeker.id, jobId]
        );

        res.json({
            success: true,
            isSaved: !!savedJob
        });

    } catch (error) {
        console.error('Error checking saved job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check saved job status'
        });
    }
});

module.exports = router;