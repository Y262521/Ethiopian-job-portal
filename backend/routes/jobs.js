const express = require('express');
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

// Search jobs
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

module.exports = router;