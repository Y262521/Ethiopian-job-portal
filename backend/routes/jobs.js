const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Get all jobs with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            location,
            jobType,
            experienceLevel,
            company,
            search
        } = req.query;

        const offset = (page - 1) * limit;
        let whereConditions = ["j.status = 'active'"];
        let queryParams = [];

        // Build WHERE clause based on filters
        if (category) {
            whereConditions.push("j.category_name = ?");
            queryParams.push(category);
        }

        if (location) {
            whereConditions.push("j.location LIKE ?");
            queryParams.push(`%${location}%`);
        }

        if (jobType) {
            whereConditions.push("j.job_type = ?");
            queryParams.push(jobType);
        }

        if (experienceLevel) {
            whereConditions.push("j.experience_level = ?");
            queryParams.push(experienceLevel);
        }

        if (company) {
            whereConditions.push("j.employer_id = ?");
            queryParams.push(company);
        }

        if (search) {
            whereConditions.push("(j.title LIKE ? OR j.description LIKE ? OR e.company_name LIKE ?)");
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        // Get total count
        const countQuery = `
      SELECT COUNT(*) as total 
      FROM jobs j 
      INNER JOIN employers e ON j.employer_id = e.id 
      WHERE ${whereClause}
    `;

        const countResult = await db.get(countQuery, queryParams);
        const totalJobs = countResult.total;

        // Get jobs
        const jobsQuery = `
      SELECT 
        j.id, j.title, j.description, j.location, j.job_type, 
        j.experience_level, j.salary, j.category_name as category,
        j.is_featured, j.is_urgent, j.created_at,
        e.company_name, e.logo as company_logo
      FROM jobs j 
      INNER JOIN employers e ON j.employer_id = e.id 
      WHERE ${whereClause} 
      ORDER BY j.is_featured DESC, j.created_at DESC 
      LIMIT ? OFFSET ?
    `;

        queryParams.push(parseInt(limit), parseInt(offset));
        const jobs = await db.all(jobsQuery, queryParams);

        const totalPages = Math.ceil(totalJobs / limit);

        res.json({
            jobs: jobs,
            totalJobs: totalJobs,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Search jobs (MUST be before /:id route)
router.get('/search', async (req, res) => {
    try {
        const { q: query, category, location, page = 1, limit = 20 } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const offset = (page - 1) * limit;
        let whereConditions = ["j.status = 'active'"];
        let queryParams = [];

        // Add search conditions
        whereConditions.push("(j.title LIKE ? OR j.description LIKE ? OR e.company_name LIKE ?)");
        queryParams.push(`%${query}%`, `%${query}%`, `%${query}%`);

        if (category) {
            whereConditions.push("j.category_name = ?");
            queryParams.push(category);
        }

        if (location) {
            whereConditions.push("j.location LIKE ?");
            queryParams.push(`%${location}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        // Get total count
        const countQuery = `
      SELECT COUNT(*) as total 
      FROM jobs j 
      INNER JOIN employers e ON j.employer_id = e.id 
      WHERE ${whereClause}
    `;

        const countResult = await db.get(countQuery, queryParams);
        const totalJobs = countResult.total;

        // Get jobs
        const jobsQuery = `
      SELECT 
        j.id, j.title, j.description, j.location, j.job_type, 
        j.experience_level, j.salary, j.category_name as category,
        j.is_featured, j.is_urgent, j.created_at,
        e.company_name, e.logo as company_logo
      FROM jobs j 
      INNER JOIN employers e ON j.employer_id = e.id 
      WHERE ${whereClause} 
      ORDER BY j.is_featured DESC, j.created_at DESC 
      LIMIT ? OFFSET ?
    `;

        queryParams.push(parseInt(limit), parseInt(offset));
        const jobs = await db.all(jobsQuery, queryParams);

        const totalPages = Math.ceil(totalJobs / limit);

        res.json({
            jobs: jobs,
            totalJobs: totalJobs,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit),
            query: query
        });

    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({ error: 'Failed to search jobs' });
    }
});

// Get job by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
      SELECT 
        j.*, 
        e.company_name, e.logo as company_logo, e.description as company_description,
        e.website as company_website, e.location as company_location
      FROM jobs j 
      INNER JOIN employers e ON j.employer_id = e.id 
      WHERE j.id = ? AND j.status = 'active'
    `;

        const job = await db.get(query, [id]);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);

    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// Create new job (for employers)
router.post('/', [
    body('title').trim().isLength({ min: 5 }).withMessage('Job title must be at least 5 characters'),
    body('description').trim().isLength({ min: 50 }).withMessage('Job description must be at least 50 characters'),
    body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
    body('jobType').isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type'),
    body('experienceLevel').isIn(['Entry-level', 'Mid-level', 'Senior', 'Executive']).withMessage('Invalid experience level'),
    body('categoryName').trim().isLength({ min: 2 }).withMessage('Category is required'),
    body('employerId').isInt().withMessage('Valid employer ID is required')
], async (req, res) => {
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

        const {
            title,
            description,
            location,
            jobType,
            experienceLevel,
            salary,
            categoryName,
            employerId,
            isFeatured = 0,
            isUrgent = 0
        } = req.body;

        // Verify employer exists
        const employer = await db.get('SELECT id FROM employers WHERE id = ?', [employerId]);
        if (!employer) {
            return res.status(404).json({
                success: false,
                error: 'Employer not found'
            });
        }

        // Insert job into database
        const result = await db.run(`
            INSERT INTO jobs (
                employer_id, title, description, location, job_type, 
                experience_level, salary, category_name, is_featured, 
                is_urgent, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))
        `, [
            employerId, title, description, location, jobType,
            experienceLevel, salary || null, categoryName, isFeatured,
            isUrgent
        ]);

        console.log('✅ Job created with ID:', result.id);
        console.log('📊 Job data:', { employerId, title, location, categoryName });

        // Get the created job
        const job = await db.get(`
            SELECT 
                j.*, 
                e.company_name, e.logo as company_logo
            FROM jobs j 
            INNER JOIN employers e ON j.employer_id = e.id 
            WHERE j.id = ?
        `, [result.id]);

        res.status(201).json({
            success: true,
            message: 'Job posted successfully!',
            job: job
        });

    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create job. Please try again.'
        });
    }
});

// Update job (for employers)
router.put('/:id', [
    body('title').optional().trim().isLength({ min: 5 }).withMessage('Job title must be at least 5 characters'),
    body('description').optional().trim().isLength({ min: 50 }).withMessage('Job description must be at least 50 characters'),
    body('location').optional().trim().isLength({ min: 2 }).withMessage('Location is required'),
    body('jobType').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type'),
    body('experienceLevel').optional().isIn(['Entry-level', 'Mid-level', 'Senior', 'Executive']).withMessage('Invalid experience level'),
    body('categoryName').optional().trim().isLength({ min: 2 }).withMessage('Category is required')
], async (req, res) => {
    try {
        const { id } = req.params;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        // Check if job exists
        const existingJob = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        const updateFields = [];
        const updateValues = [];

        // Build dynamic update query
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                switch (key) {
                    case 'title':
                        updateFields.push('title = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'description':
                        updateFields.push('description = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'location':
                        updateFields.push('location = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'jobType':
                        updateFields.push('job_type = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'experienceLevel':
                        updateFields.push('experience_level = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'salary':
                        updateFields.push('salary = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'categoryName':
                        updateFields.push('category_name = ?');
                        updateValues.push(req.body[key]);
                        break;
                    case 'status':
                        updateFields.push('status = ?');
                        updateValues.push(req.body[key]);
                        break;
                }
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        updateValues.push(id);
        const updateQuery = `UPDATE jobs SET ${updateFields.join(', ')} WHERE id = ?`;

        await db.run(updateQuery, updateValues);

        // Get updated job
        const updatedJob = await db.get(`
            SELECT 
                j.*, 
                e.company_name, e.logo as company_logo
            FROM jobs j 
            INNER JOIN employers e ON j.employer_id = e.id 
            WHERE j.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Job updated successfully!',
            job: updatedJob
        });

    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update job'
        });
    }
});

// Delete job (for employers)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if job exists
        const job = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Soft delete by updating status
        await db.run('UPDATE jobs SET status = ? WHERE id = ?', ['deleted', id]);

        res.json({
            success: true,
            message: 'Job deleted successfully!'
        });

    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete job'
        });
    }
});

// Get jobs by employer
router.get('/employer/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;
        const { page = 1, limit = 20, status } = req.query;
        const offset = (page - 1) * limit;

        // Build query based on status filter
        let statusCondition = '';
        let queryParams = [employerId];

        if (status && status !== 'all') {
            statusCondition = 'AND j.status = ?';
            queryParams.push(status);
        }

        // Get jobs for specific employer
        const jobs = await db.all(`
            SELECT 
                j.*, 
                e.company_name, e.logo as company_logo,
                (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count
            FROM jobs j 
            INNER JOIN employers e ON j.employer_id = e.id 
            WHERE j.employer_id = ? ${statusCondition}
            ORDER BY j.created_at DESC 
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM jobs WHERE employer_id = ?';
        let countParams = [employerId];

        if (status && status !== 'all') {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }

        const countResult = await db.get(countQuery, countParams);

        const totalJobs = countResult.total;
        const totalPages = Math.ceil(totalJobs / limit);

        res.json({
            success: true,
            jobs: jobs,
            totalJobs: totalJobs,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching employer jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch jobs'
        });
    }
});

module.exports = router;