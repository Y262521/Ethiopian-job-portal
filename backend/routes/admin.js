const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('🔍 Admin token verification:', {
        hasToken: !!token,
        tokenStart: token ? token.substring(0, 20) + '...' : 'none'
    });

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔍 Decoded token:', {
            userId: decoded.userId,
            userType: decoded.userType,
            email: decoded.email
        });

        if (decoded.userType !== 'admin') {
            console.log('❌ Not an admin user:', decoded.userType);
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }
        req.admin = decoded;
        console.log('✅ Admin token verified successfully');
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        res.status(400).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};

// Admin login route
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check admin table
        const admin = await db.get(
            'SELECT id, email, password, username, status FROM adminb WHERE email = ?',
            [email]
        );

        if (!admin || !await bcrypt.compare(password, admin.password)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        if (admin.status !== 'approved') {
            return res.status(403).json({
                success: false,
                error: 'Admin account not approved'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: admin.id,
                userType: 'admin',
                email: admin.email,
                username: admin.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: admin.id,
                email: admin.email,
                type: 'admin',
                name: admin.username
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
});

// Admin dashboard route to view database tables (protected)
router.get('/dashboard', async (req, res) => {
    try {
        // Get all users data
        const jobseekers = await db.all('SELECT * FROM jobseekers ORDER BY created_at DESC');
        const employers = await db.all('SELECT * FROM employers ORDER BY created_at DESC');
        const admins = await db.all('SELECT * FROM adminb ORDER BY created_at DESC');
        const jobs = await db.all('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 20');

        // Get payment data
        const totalRevenue = await db.get(`
            SELECT SUM(amount) as total 
            FROM payments 
            WHERE status = 'completed'
        `);

        const pendingPayments = await db.all(`
            SELECT p.*, pl.name as plan_name,
                   CASE 
                       WHEN p.user_type = 'employer' THEN e.company_name
                       ELSE js.first_name || ' ' || js.last_name
                   END as user_name
            FROM payments p
            LEFT JOIN pricing_plans pl ON p.plan_id = pl.id
            LEFT JOIN employers e ON p.user_id = e.id AND p.user_type = 'employer'
            LEFT JOIN jobseekers js ON p.user_id = js.id AND p.user_type = 'jobseeker'
            WHERE p.status = 'pending'
            ORDER BY p.created_at DESC
            LIMIT 10
        `);

        const recentPayments = await db.all(`
            SELECT p.*, pl.name as plan_name,
                   CASE 
                       WHEN p.user_type = 'employer' THEN e.company_name
                       ELSE js.first_name || ' ' || js.last_name
                   END as user_name
            FROM payments p
            LEFT JOIN pricing_plans pl ON p.plan_id = pl.id
            LEFT JOIN employers e ON p.user_id = e.id AND p.user_type = 'employer'
            LEFT JOIN jobseekers js ON p.user_id = js.id AND p.user_type = 'jobseeker'
            WHERE p.status = 'completed'
            ORDER BY p.created_at DESC
            LIMIT 10
        `);

        // Create HTML response
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ethiopia Job - Database Dashboard</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                h1 {
                    color: #28a745;
                    text-align: center;
                    margin-bottom: 30px;
                }
                h2 {
                    color: #333;
                    border-bottom: 2px solid #28a745;
                    padding-bottom: 10px;
                    margin-top: 40px;
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #28a745;
                }
                .stat-label {
                    color: #666;
                    margin-top: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 30px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #28a745;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f8f9fa;
                }
                .badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                .badge-success {
                    background-color: #d4edda;
                    color: #155724;
                }
                .badge-warning {
                    background-color: #fff3cd;
                    color: #856404;
                }
                .badge-featured {
                    background-color: #cce5ff;
                    color: #004085;
                }
                .no-data {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                    font-style: italic;
                }
                .refresh-btn {
                    background: #28a745;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-bottom: 20px;
                }
                .refresh-btn:hover {
                    background: #218838;
                }
                .btn-approve, .btn-reject {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    margin: 2px;
                }
                .btn-approve {
                    background: #28a745;
                    color: white;
                }
                .btn-approve:hover {
                    background: #218838;
                }
                .btn-reject {
                    background: #dc3545;
                    color: white;
                }
                .btn-reject:hover {
                    background: #c82333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🇪🇹 Ethiopia Job - Database Dashboard</h1>
                
                <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh Data</button>
                
                <!-- Statistics -->
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${jobseekers.length}</div>
                        <div class="stat-label">Job Seekers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${employers.length}</div>
                        <div class="stat-label">Employers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${jobs.length}</div>
                        <div class="stat-label">Jobs Posted</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalRevenue.total ? totalRevenue.total.toFixed(2) : '0.00'} ETB</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${pendingPayments.length}</div>
                        <div class="stat-label">Pending Payments</div>
                    </div>
                </div>

                <!-- Job Seekers Table -->
                <h2>👤 Job Seekers (${jobseekers.length})</h2>
                ${jobseekers.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Registered</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobseekers.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name} ${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td><span class="badge badge-success">${user.status}</span></td>
                            <td>${new Date(user.created_at).toLocaleString()}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No job seekers registered yet</div>'}

                <!-- Employers Table -->
                <h2>🏢 Employers (${employers.length})</h2>
                ${employers.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Registered</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employers.map(employer => `
                        <tr>
                            <td>${employer.id}</td>
                            <td><strong>${employer.company_name}</strong></td>
                            <td>${employer.contact_person}</td>
                            <td>${employer.email}</td>
                            <td>${employer.phone}</td>
                            <td><span class="badge badge-success">${employer.status}</span></td>
                            <td>${new Date(employer.created_at).toLocaleString()}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No employers registered yet</div>'}

                <!-- Jobs Table -->
                <h2>💼 Recent Jobs (${jobs.length})</h2>
                ${jobs.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Company ID</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Salary</th>
                            <th>Category</th>
                            <th>Featured</th>
                            <th>Posted</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobs.map(job => `
                        <tr>
                            <td>${job.id}</td>
                            <td><strong>${job.title}</strong></td>
                            <td>${job.employer_id}</td>
                            <td>${job.location}</td>
                            <td>${job.job_type}</td>
                            <td>${job.salary || 'Not specified'}</td>
                            <td>${job.category_name}</td>
                            <td>${job.is_featured ? '<span class="badge badge-featured">Featured</span>' : ''}</td>
                            <td>${new Date(job.created_at).toLocaleString()}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No jobs posted yet</div>'}

                <!-- Admins Table -->
                <h2>👑 Administrators (${admins.length})</h2>
                ${admins.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${admins.map(admin => `
                        <tr>
                            <td>${admin.id}</td>
                            <td>${admin.username}</td>
                            <td>${admin.email}</td>
                            <td><span class="badge badge-success">${admin.status}</span></td>
                            <td>${new Date(admin.created_at).toLocaleString()}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No administrators created yet</div>'}

                <!-- Pending Payments -->
                <h2>💰 Pending Payments (${pendingPayments.length})</h2>
                ${pendingPayments.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingPayments.map(payment => `
                        <tr>
                            <td>${payment.id}</td>
                            <td>${payment.user_name || 'Unknown'}</td>
                            <td><span class="badge badge-warning">${payment.user_type}</span></td>
                            <td>${payment.plan_name || payment.payment_type}</td>
                            <td><strong>${payment.amount} ETB</strong></td>
                            <td>${payment.payment_method}</td>
                            <td>${payment.transaction_id || 'N/A'}</td>
                            <td>${new Date(payment.created_at).toLocaleString()}</td>
                            <td>
                                <button onclick="confirmPayment(${payment.id}, 'completed')" class="btn-approve">✅ Approve</button>
                                <button onclick="confirmPayment(${payment.id}, 'failed')" class="btn-reject">❌ Reject</button>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No pending payments</div>'}

                <!-- Recent Completed Payments -->
                <h2>✅ Recent Completed Payments (${recentPayments.length})</h2>
                ${recentPayments.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentPayments.map(payment => `
                        <tr>
                            <td>${payment.id}</td>
                            <td>${payment.user_name || 'Unknown'}</td>
                            <td><span class="badge badge-success">${payment.user_type}</span></td>
                            <td>${payment.plan_name || payment.payment_type}</td>
                            <td><strong>${payment.amount} ETB</strong></td>
                            <td>${payment.payment_method}</td>
                            <td>${new Date(payment.created_at).toLocaleString()}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<div class="no-data">No completed payments yet</div>'}

                <div style="text-align: center; margin-top: 40px; color: #666;">
                    <p>Last updated: ${new Date().toLocaleString()}</p>
                    <p>Ethiopia Job Portal Database Dashboard</p>
                </div>
            </div>
            
            <script>
                function confirmPayment(paymentId, status) {
                    const action = status === 'completed' ? 'approve' : 'reject';
                    if (confirm(\`Are you sure you want to \${action} this payment?\`)) {
                        fetch(\`/api/payments/confirm/\${paymentId}\`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ 
                                status: status,
                                admin_notes: \`Payment \${action}d by admin\`
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert(\`Payment \${action}d successfully!\`);
                                window.location.reload();
                            } else {
                                alert('Error: ' + data.error);
                            }
                        })
                        .catch(error => {
                            alert('Error: ' + error.message);
                        });
                    }
                }
            </script>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching database data:', error);
        res.status(500).json({ error: 'Failed to fetch database data' });
    }
});

// Get users by type (jobseekers or employers)
router.get('/users/:userType', async (req, res) => {
    try {
        const { userType } = req.params;
        const { page = 1, limit = 20, status } = req.query;
        const offset = (page - 1) * limit;

        let query, countQuery;
        let queryParams = [];
        let countParams = [];

        if (userType === 'jobseekers') {
            query = `
                SELECT id, first_name, last_name, email, phone, status, created_at
                FROM jobseekers
            `;
            countQuery = 'SELECT COUNT(*) as total FROM jobseekers';

            if (status) {
                query += ' WHERE status = ?';
                countQuery += ' WHERE status = ?';
                queryParams.push(status);
                countParams.push(status);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            queryParams.push(parseInt(limit), parseInt(offset));

        } else if (userType === 'employers') {
            query = `
                SELECT id, company_name, contact_person, email, phone, status, created_at
                FROM employers
            `;
            countQuery = 'SELECT COUNT(*) as total FROM employers';

            if (status) {
                query += ' WHERE status = ?';
                countQuery += ' WHERE status = ?';
                queryParams.push(status);
                countParams.push(status);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            queryParams.push(parseInt(limit), parseInt(offset));

        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        const users = await db.all(query, queryParams);
        const countResult = await db.get(countQuery, countParams);
        const totalUsers = countResult.total;
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            success: true,
            users: users,
            totalUsers: totalUsers,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user status
router.put('/users/:userType/:userId/status', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        let table;
        if (userType === 'jobseekers') {
            table = 'jobseekers';
        } else if (userType === 'employers') {
            table = 'employers';
        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        await db.run(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, userId]);

        res.json({
            success: true,
            message: `User status updated to ${status}`
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});
// Get analytics data
router.get('/analytics', async (req, res) => {
    try {
        const { timeRange = '30days' } = req.query;

        // Helper function to format time ago
        const getTimeAgo = (dateString) => {
            const now = new Date();
            const date = new Date(dateString);
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours} hours ago`;
            } else if (diffInDays === 1) {
                return '1 day ago';
            } else {
                return `${diffInDays} days ago`;
            }
        };

        // Helper function to parse time ago for sorting (approximate)
        const parseTimeAgo = (timeAgoString) => {
            const now = Date.now();
            if (timeAgoString.includes('minutes ago')) {
                const minutes = parseInt(timeAgoString);
                return now - (minutes * 60 * 1000);
            } else if (timeAgoString.includes('hours ago')) {
                const hours = parseInt(timeAgoString);
                return now - (hours * 60 * 60 * 1000);
            } else if (timeAgoString.includes('days ago')) {
                const days = parseInt(timeAgoString);
                return now - (days * 24 * 60 * 60 * 1000);
            }
            return now;
        };

        // Calculate date range
        let dateFilter = '';
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case '7days':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        dateFilter = `WHERE created_at >= '${startDate.toISOString()}'`;

        // Get total counts
        const totalJobseekers = await db.get('SELECT COUNT(*) as count FROM jobseekers');
        const totalEmployers = await db.get('SELECT COUNT(*) as count FROM employers');
        const totalUsers = await db.get('SELECT COUNT(*) as count FROM (SELECT id FROM jobseekers UNION SELECT id FROM employers)');
        const totalJobs = await db.get('SELECT COUNT(*) as count FROM jobs');
        const totalApplications = await db.get('SELECT COUNT(*) as count FROM job_applications');
        const totalCompanies = await db.get('SELECT COUNT(*) as count FROM employers');
        const pendingJobs = await db.get('SELECT COUNT(*) as count FROM jobs WHERE status = "pending"');
        const pendingApplications = await db.get('SELECT COUNT(*) as count FROM job_applications WHERE status = "pending"');
        const activeCompanies = await db.get('SELECT COUNT(*) as count FROM employers WHERE status = "active"');

        // Get top job categories
        const topCategories = await db.all(`
            SELECT 
                category_name as name,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM jobs)), 1) as percentage
            FROM jobs 
            WHERE category_name IS NOT NULL 
            GROUP BY category_name 
            ORDER BY count DESC 
            LIMIT 5
        `);

        // Get recent activity from database
        const recentJobseekers = await db.all(`
            SELECT first_name || ' ' || last_name as name, created_at
            FROM jobseekers 
            ORDER BY created_at DESC 
            LIMIT 3
        `);

        const recentEmployers = await db.all(`
            SELECT company_name as name, created_at
            FROM employers 
            ORDER BY created_at DESC 
            LIMIT 3
        `);

        const recentJobs = await db.all(`
            SELECT j.title, e.company_name, j.created_at
            FROM jobs j
            JOIN employers e ON j.employer_id = e.id
            ORDER BY j.created_at DESC 
            LIMIT 3
        `);

        const recentApplications = await db.all(`
            SELECT ja.full_name, j.title, ja.applied_at, ja.status
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            ORDER BY ja.applied_at DESC 
            LIMIT 3
        `);

        // Format recent activity
        const recentActivity = [];

        // Add recent job seekers
        recentJobseekers.forEach(user => {
            const timeAgo = getTimeAgo(user.created_at);
            recentActivity.push({
                icon: 'fa-user-plus',
                description: `${user.name} registered as job seeker`,
                timestamp: timeAgo
            });
        });

        // Add recent employers
        recentEmployers.forEach(employer => {
            const timeAgo = getTimeAgo(employer.created_at);
            recentActivity.push({
                icon: 'fa-building',
                description: `${employer.name} registered as employer`,
                timestamp: timeAgo
            });
        });

        // Add recent jobs
        recentJobs.forEach(job => {
            const timeAgo = getTimeAgo(job.created_at);
            recentActivity.push({
                icon: 'fa-briefcase',
                description: `${job.title} posted by ${job.company_name}`,
                timestamp: timeAgo
            });
        });

        // Add recent applications
        recentApplications.forEach(app => {
            const timeAgo = getTimeAgo(app.applied_at);
            const statusIcon = app.status === 'approved' ? 'fa-check-circle' : 'fa-file-alt';
            recentActivity.push({
                icon: statusIcon,
                description: `${app.full_name} applied for ${app.title}`,
                timestamp: timeAgo
            });
        });

        // Sort by timestamp and limit to 10 most recent
        recentActivity.sort((a, b) => {
            // Convert timestamp back to date for sorting
            const aTime = parseTimeAgo(a.timestamp);
            const bTime = parseTimeAgo(b.timestamp);
            return aTime - bTime;
        });

        const finalActivity = recentActivity.slice(0, 10);

        res.json({
            success: true,
            data: {
                totalUsers: totalUsers.count || 0,
                totalJobseekers: totalJobseekers.count || 0,
                totalEmployers: totalEmployers.count || 0,
                totalJobs: totalJobs.count || 0,
                totalApplications: totalApplications.count || 0,
                totalCompanies: totalCompanies.count || 0,
                pendingJobs: pendingJobs.count || 0,
                pendingApplications: pendingApplications.count || 0,
                activeCompanies: activeCompanies.count || 0,
                topCategories: topCategories || [],
                recentActivity: finalActivity
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics data'
        });
    }
});

// Get jobs for moderation
router.get('/jobs/moderation', async (req, res) => {
    try {
        const { status = 'all' } = req.query;

        let statusFilter = '';
        if (status !== 'all') {
            statusFilter = `WHERE j.status = '${status}'`;
        }

        const jobs = await db.all(`
            SELECT 
                j.*,
                e.company_name,
                e.contact_person
            FROM jobs j
            JOIN employers e ON j.employer_id = e.id
            ${statusFilter}
            ORDER BY j.created_at DESC
        `);

        res.json({
            success: true,
            jobs: jobs || []
        });

    } catch (error) {
        console.error('Error fetching jobs for moderation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch jobs for moderation'
        });
    }
});

// Update job status
router.put('/jobs/:jobId/status', verifyAdminToken, async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status, reason } = req.body;

        console.log(`🔄 Admin updating job ${jobId} status to ${status}...`);
        console.log('🔍 Request body:', { status, reason });

        const validStatuses = ['pending', 'approved', 'rejected', 'flagged', 'active', 'closed', 'draft'];
        if (!validStatuses.includes(status)) {
            console.log('❌ Invalid status:', status);
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        // Check if job exists first
        const existingJob = await db.get('SELECT * FROM jobs WHERE id = ?', [jobId]);
        if (!existingJob) {
            console.log('❌ Job not found:', jobId);
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        console.log('🔍 Existing job:', {
            id: existingJob.id,
            title: existingJob.title,
            currentStatus: existingJob.status
        });

        const result = await db.run(`
            UPDATE jobs 
            SET status = ?, moderation_reason = ?, updated_at = datetime('now')
            WHERE id = ?
        `, [status, reason || null, jobId]);

        console.log('✅ Job status update result:', {
            changes: result.changes,
            lastID: result.lastID
        });

        if (result.changes === 0) {
            console.log('❌ No rows updated');
            return res.status(404).json({
                success: false,
                error: 'Job not found or no changes made'
            });
        }

        console.log(`✅ Job ${jobId} status updated to ${status} successfully`);

        res.json({
            success: true,
            message: `Job ${status} successfully`
        });

    } catch (error) {
        console.error('❌ Error updating job status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update job status'
        });
    }
});
// Get all users for management
router.get('/users/all', async (req, res) => {
    try {
        const { filter = 'all' } = req.query;

        let users = [];

        if (filter === 'all' || filter === 'jobseeker') {
            const jobseekers = await db.all(`
                SELECT 
                    j.id,
                    j.first_name || ' ' || j.last_name as name,
                    j.email,
                    j.phone,
                    j.first_name,
                    j.last_name,
                    j.status,
                    j.suspension_reason,
                    j.created_at,
                    'jobseeker' as type,
                    COUNT(DISTINCT ja.id) as applications_count,
                    COUNT(DISTINCT sj.id) as saved_jobs_count
                FROM jobseekers j
                LEFT JOIN job_applications ja ON j.id = ja.jobseeker_id
                LEFT JOIN saved_jobs sj ON j.id = sj.jobseeker_id
                GROUP BY j.id
                ORDER BY j.created_at DESC
            `);
            users = users.concat(jobseekers);
        }

        if (filter === 'all' || filter === 'employer') {
            const employers = await db.all(`
                SELECT 
                    e.id,
                    e.company_name as name,
                    e.email,
                    e.phone,
                    e.contact_person,
                    e.company_name,
                    e.website,
                    e.status,
                    e.suspension_reason,
                    e.created_at,
                    'employer' as type,
                    COUNT(DISTINCT j.id) as jobs_posted,
                    COUNT(DISTINCT ja.id) as applications_received
                FROM employers e
                LEFT JOIN jobs j ON e.id = j.employer_id
                LEFT JOIN job_applications ja ON j.id = ja.job_id
                GROUP BY e.id
                ORDER BY e.created_at DESC
            `);
            users = users.concat(employers);
        }

        // Filter by status if needed
        if (filter === 'suspended') {
            users = users.filter(user => user.status === 'suspended');
        }

        res.json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// Suspend user
router.put('/users/:userId/suspend', async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        // Update in both jobseekers and employers tables
        await db.run(`
            UPDATE jobseekers 
            SET status = 'suspended', suspension_reason = ?
            WHERE id = ?
        `, [reason, userId]);

        await db.run(`
            UPDATE employers 
            SET status = 'suspended', suspension_reason = ?
            WHERE id = ?
        `, [reason, userId]);

        res.json({
            success: true,
            message: 'User suspended successfully'
        });

    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to suspend user'
        });
    }
});

// Activate user
router.put('/users/:userId/activate', async (req, res) => {
    try {
        const { userId } = req.params;

        // Update in both jobseekers and employers tables
        await db.run(`
            UPDATE jobseekers 
            SET status = 'active', suspension_reason = NULL
            WHERE id = ?
        `, [userId]);

        await db.run(`
            UPDATE employers 
            SET status = 'active', suspension_reason = NULL
            WHERE id = ?
        `, [userId]);

        res.json({
            success: true,
            message: 'User activated successfully'
        });

    } catch (error) {
        console.error('Error activating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to activate user'
        });
    }
});

// Send notification
router.post('/notifications/send', async (req, res) => {
    try {
        const { title, message, type, recipients, scheduledFor } = req.body;

        // Insert notification into database
        const result = await db.run(`
            INSERT INTO notifications (
                title, message, type, recipients, scheduled_for, status, sent_at
            ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `, [title, message, type, recipients, scheduledFor || null, 'sent']);

        // In a real application, you would send actual notifications here
        // For now, we'll just simulate it
        let deliveredCount = 0;
        switch (recipients) {
            case 'all':
                const allUsers = await db.get('SELECT COUNT(*) as count FROM (SELECT id FROM jobseekers UNION SELECT id FROM employers)');
                deliveredCount = allUsers.count;
                break;
            case 'jobseekers':
                const jobseekers = await db.get('SELECT COUNT(*) as count FROM jobseekers WHERE status = "active"');
                deliveredCount = jobseekers.count;
                break;
            case 'employers':
                const employers = await db.get('SELECT COUNT(*) as count FROM employers WHERE status = "active"');
                deliveredCount = employers.count;
                break;
            case 'active':
                const activeUsers = await db.get(`
                    SELECT COUNT(*) as count FROM (
                        SELECT id FROM jobseekers WHERE status = 'active' 
                        UNION 
                        SELECT id FROM employers WHERE status = 'active'
                    )
                `);
                deliveredCount = activeUsers.count;
                break;
        }

        // Update delivered count
        await db.run(`
            UPDATE notifications 
            SET delivered_count = ?
            WHERE id = ?
        `, [deliveredCount, result.id]);

        res.json({
            success: true,
            message: 'Notification sent successfully',
            deliveredCount: deliveredCount
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send notification'
        });
    }
});

// Get notification history
router.get('/notifications/history', async (req, res) => {
    try {
        const notifications = await db.all(`
            SELECT * FROM notifications 
            ORDER BY sent_at DESC 
            LIMIT 50
        `);

        res.json({
            success: true,
            notifications: notifications
        });

    } catch (error) {
        console.error('Error fetching notification history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notification history'
        });
    }
});

// Check job payment status before approval
router.get('/jobs/:jobId/payment-status', verifyAdminToken, async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log(`🔍 Checking payment status for job ${jobId}...`);

        // Get job details with employer information
        const job = await db.get(`
            SELECT j.*, e.id as employer_id, e.email as employer_email, e.company_name
            FROM jobs j
            LEFT JOIN employers e ON j.employer_id = e.id
            WHERE j.id = ?
        `, [jobId]);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if there's a payment for this job
        const payment = await db.get(`
            SELECT * FROM payments 
            WHERE employer_id = ? AND job_id = ? AND status = 'approved'
            ORDER BY created_at DESC
            LIMIT 1
        `, [job.employer_id, jobId]);

        if (payment) {
            console.log('✅ Payment found for job:', payment);
            res.json({
                success: true,
                message: 'Payment verified',
                payment: {
                    id: payment.id,
                    amount: payment.amount,
                    status: payment.status,
                    created_at: payment.created_at
                }
            });
        } else {
            // For now, allow approval even without payment (you can change this logic)
            console.log('⚠️ No payment found, but allowing approval');
            res.json({
                success: true,
                message: 'No payment required or payment check bypassed',
                payment: null
            });
        }

    } catch (error) {
        console.error('❌ Error checking payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check payment status'
        });
    }
});

// Get all jobs for admin (with more details)
router.get('/jobs/all', verifyAdminToken, async (req, res) => {
    try {
        console.log('🔍 Admin fetching all jobs...');

        const { page = 1, limit = 50, status, category } = req.query;
        const offset = (page - 1) * limit;

        let whereConditions = [];
        let queryParams = [];

        // Add status filter if provided
        if (status && status !== 'all') {
            whereConditions.push("j.status = ?");
            queryParams.push(status);
        }

        // Add category filter if provided
        if (category && category !== 'all') {
            whereConditions.push("j.category_name = ?");
            queryParams.push(category);
        }

        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(' AND ')}`
            : '';

        // Get jobs with employer information
        const jobs = await db.all(`
            SELECT 
                j.*,
                e.company_name,
                e.email as employer_email,
                e.phone as employer_phone,
                (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count
            FROM jobs j
            LEFT JOIN employers e ON j.employer_id = e.id
            ${whereClause}
            ORDER BY j.created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM jobs j 
            ${whereClause}
        `;
        const countResult = await db.get(countQuery, queryParams);

        const totalJobs = countResult.total;
        const totalPages = Math.ceil(totalJobs / limit);

        console.log(`✅ Admin loaded ${jobs.length} jobs`);

        res.json({
            success: true,
            jobs: jobs,
            totalJobs: totalJobs,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('❌ Error fetching all jobs for admin:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch jobs'
        });
    }
});

// Database Dashboard Routes

// Get database statistics
router.get('/database/stats', verifyAdminToken, async (req, res) => {
    try {
        console.log('🔍 Fetching database statistics...');

        // Get table information
        const tables = await db.all(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        `);

        const tableStats = [];
        let totalRecords = 0;

        for (const table of tables) {
            try {
                const countResult = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`);
                const count = countResult.count || 0;
                totalRecords += count;

                tableStats.push({
                    name: table.name,
                    records: count,
                    size: `${Math.round(count * 0.1)}KB` // Rough estimate
                });
            } catch (error) {
                console.error(`Error getting count for table ${table.name}:`, error);
                tableStats.push({
                    name: table.name,
                    records: 0,
                    size: '0KB'
                });
            }
        }

        // Calculate total database size (rough estimate)
        const totalSizeMB = Math.round(totalRecords * 0.1 / 1024 * 100) / 100;

        res.json({
            success: true,
            tables: tableStats,
            totalRecords: totalRecords,
            databaseSize: `${totalSizeMB} MB`,
            lastBackup: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error fetching database stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch database statistics'
        });
    }
});

// Get table data
router.get('/database/table/:tableName', verifyAdminToken, async (req, res) => {
    try {
        const { tableName } = req.params;
        const { limit = 50 } = req.query;

        console.log(`🔍 Fetching data for table: ${tableName}`);

        // Validate table name to prevent SQL injection
        const validTables = await db.all(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);

        const tableExists = validTables.some(table => table.name === tableName);
        if (!tableExists) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        // Get table data
        const data = await db.all(`SELECT * FROM ${tableName} LIMIT ?`, [parseInt(limit)]);

        res.json({
            success: true,
            data: data,
            tableName: tableName,
            recordCount: data.length
        });

    } catch (error) {
        console.error(`❌ Error fetching table data:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch table data'
        });
    }
});

// Create database backup
router.post('/database/backup', verifyAdminToken, async (req, res) => {
    try {
        console.log('🔄 Creating database backup...');

        const fs = require('fs');
        const path = require('path');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFilename = `backup-${timestamp}.sqlite`;
        const backupPath = path.join(__dirname, '../backups', backupFilename);

        // Create backups directory if it doesn't exist
        const backupsDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // Copy database file
        const dbPath = path.join(__dirname, '../database.sqlite');
        fs.copyFileSync(dbPath, backupPath);

        console.log(`✅ Database backup created: ${backupFilename}`);

        res.json({
            success: true,
            message: 'Database backup created successfully',
            filename: backupFilename,
            path: backupPath,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error creating database backup:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create database backup'
        });
    }
});

module.exports = router;