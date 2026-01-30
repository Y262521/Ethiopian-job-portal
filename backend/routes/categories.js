const express = require('express');
const db = require('../config/sqlite');

const router = express.Router();

// Get all job categories with job counts
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        category_name,
        COUNT(*) as job_count
      FROM jobs 
      WHERE status = 'active' 
      GROUP BY category_name 
      ORDER BY job_count DESC, category_name ASC
    `;

    const categories = await db.all(query);
    res.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get popular categories (top 8)
router.get('/popular', async (req, res) => {
  try {
    const query = `
      SELECT 
        category_name as name,
        COUNT(*) as job_count,
        category_name as id
      FROM jobs 
      WHERE status = 'active' 
      GROUP BY category_name 
      ORDER BY job_count DESC 
      LIMIT 8
    `;

    const categories = await db.all(query);
    res.json(categories);

  } catch (error) {
    console.error('Error fetching popular categories:', error);
    res.status(500).json({ error: 'Failed to fetch popular categories' });
  }
});

module.exports = router;