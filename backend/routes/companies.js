const express = require('express');
const db = require('../config/sqlite');

const router = express.Router();

// Get featured companies
router.get('/featured', async (req, res) => {
    try {
        const query = `
      SELECT 
        e.id, e.company_name, e.description, e.logo, e.website, 
        e.location, e.industry, e.employees, e.founded,
        COUNT(j.id) as job_count
      FROM employers e
      LEFT JOIN jobs j ON e.id = j.employer_id AND j.status = 'active'
      WHERE e.status = 'approved' AND e.is_featured = 1
      GROUP BY e.id
      ORDER BY job_count DESC, e.created_at DESC
      LIMIT 20
    `;

        const companies = await db.all(query);
        res.json(companies);

    } catch (error) {
        console.error('Error fetching featured companies:', error);
        res.status(500).json({ error: 'Failed to fetch featured companies' });
    }
});

// Get all companies
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, industry, location } = req.query;
        const offset = (page - 1) * limit;

        let whereConditions = ["e.status = 'approved'"];
        let queryParams = [];

        if (industry) {
            whereConditions.push("e.industry = ?");
            queryParams.push(industry);
        }

        if (location) {
            whereConditions.push("e.location LIKE ?");
            queryParams.push(`%${location}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM employers e WHERE ${whereClause}`;
        const countResult = await db.get(countQuery, queryParams);
        const totalCompanies = countResult.total;

        // Get companies
        const companiesQuery = `
      SELECT 
        e.id, e.company_name, e.description, e.logo, e.website, 
        e.location, e.industry, e.employees, e.founded,
        COUNT(j.id) as job_count
      FROM employers e
      LEFT JOIN jobs j ON e.id = j.employer_id AND j.status = 'active'
      WHERE ${whereClause}
      GROUP BY e.id
      ORDER BY e.is_featured DESC, job_count DESC, e.created_at DESC
      LIMIT ? OFFSET ?
    `;

        queryParams.push(parseInt(limit), parseInt(offset));
        const companies = await db.all(companiesQuery, queryParams);

        const totalPages = Math.ceil(totalCompanies / limit);

        res.json({
            companies: companies,
            totalCompanies: totalCompanies,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
});

// Get company by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const companyQuery = `
      SELECT 
        e.*, 
        COUNT(j.id) as job_count
      FROM employers e
      LEFT JOIN jobs j ON e.id = j.employer_id AND j.status = 'active'
      WHERE e.id = ? AND e.status = 'approved'
      GROUP BY e.id
    `;

        const company = await db.get(companyQuery, [id]);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Get company jobs
        const jobsQuery = `
      SELECT id, title, location, job_type, experience_level, salary, created_at
      FROM jobs 
      WHERE employer_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 10
    `;

        const jobs = await db.all(jobsQuery, [id]);
        company.jobs = jobs;

        res.json(company);

    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Failed to fetch company' });
    }
});

module.exports = router;