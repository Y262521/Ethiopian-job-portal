const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }
        req.admin = decoded;
        next();
    } catch (error) {
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

module.exports = router;