const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Get all pricing plans
router.get('/plans', async (req, res) => {
    try {
        const { type } = req.query; // 'employer' or 'jobseeker'

        let query = 'SELECT * FROM pricing_plans WHERE is_active = 1';
        let params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        query += ' ORDER BY price ASC';

        const plans = await db.all(query, params);

        // Parse features JSON for each plan
        const plansWithFeatures = plans.map(plan => ({
            ...plan,
            features: JSON.parse(plan.features)
        }));

        res.json({
            success: true,
            plans: plansWithFeatures
        });
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pricing plans'
        });
    }
});

// Create payment for job posting
router.post('/job-post', [
    body('employer_id').isInt().withMessage('Valid employer ID required'),
    body('plan_id').isInt().withMessage('Valid plan ID required'),
    body('payment_method').isIn(['telebirr', 'cbe_birr', 'bank_transfer', 'cash']).withMessage('Valid payment method required')
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

        const { employer_id, plan_id, payment_method, transaction_id, notes } = req.body;

        // Get plan details
        const plan = await db.get('SELECT * FROM pricing_plans WHERE id = ? AND type = "employer"', [plan_id]);
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Pricing plan not found'
            });
        }

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

        // Create payment record
        const paymentResult = await db.run(`
            INSERT INTO payments 
            (user_id, user_type, plan_id, amount, payment_type, payment_method, transaction_id, status, expires_at, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [employer_id, 'employer', plan_id, plan.price, 'job_post', payment_method, transaction_id, 'pending', expiresAt.toISOString(), notes]);

        // Create subscription
        await db.run(`
            INSERT INTO subscriptions 
            (user_id, user_type, plan_id, payment_id, expires_at)
            VALUES (?, ?, ?, ?, ?)
        `, [employer_id, 'employer', plan_id, paymentResult.id, expiresAt.toISOString()]);

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            payment_id: paymentResult.id,
            amount: plan.price,
            expires_at: expiresAt.toISOString()
        });

    } catch (error) {
        console.error('Error creating job post payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment'
        });
    }
});

// Create payment for job application
router.post('/application', [
    body('jobseeker_id').isInt().withMessage('Valid job seeker ID required'),
    body('job_id').isInt().withMessage('Valid job ID required'),
    body('payment_method').isIn(['telebirr', 'cbe_birr', 'bank_transfer', 'cash']).withMessage('Valid payment method required')
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

        const { jobseeker_id, job_id, payment_method, transaction_id, application_fee = 50.00 } = req.body;

        // Get job details
        const job = await db.get('SELECT * FROM jobs WHERE id = ?', [job_id]);
        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        // Create payment record
        const paymentResult = await db.run(`
            INSERT INTO payments 
            (user_id, user_type, amount, payment_type, payment_method, transaction_id, status, reference_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [jobseeker_id, 'jobseeker', application_fee, 'application_fee', payment_method, transaction_id, 'pending', job_id]);

        res.status(201).json({
            success: true,
            message: 'Application payment created successfully',
            payment_id: paymentResult.id,
            amount: application_fee
        });

    } catch (error) {
        console.error('Error creating application payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment'
        });
    }
});

// Confirm payment (admin only)
router.put('/confirm/:payment_id', [
    body('status').isIn(['completed', 'failed']).withMessage('Valid status required')
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

        const { payment_id } = req.params;
        const { status, admin_notes } = req.body;

        // Update payment status
        await db.run(`
            UPDATE payments 
            SET status = ?, notes = COALESCE(notes, '') || ? || ?
            WHERE id = ?
        `, [status, admin_notes ? '\nAdmin: ' : '', admin_notes || '', payment_id]);

        // If payment completed, activate subscription
        if (status === 'completed') {
            await db.run(`
                UPDATE subscriptions 
                SET status = 'active' 
                WHERE payment_id = ?
            `, [payment_id]);
        }

        res.json({
            success: true,
            message: `Payment ${status} successfully`
        });

    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to confirm payment'
        });
    }
});

// Get payment history
router.get('/history/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const { user_type } = req.query;

        const payments = await db.all(`
            SELECT p.*, pl.name as plan_name 
            FROM payments p
            LEFT JOIN pricing_plans pl ON p.plan_id = pl.id
            WHERE p.user_id = ? AND p.user_type = ?
            ORDER BY p.created_at DESC
        `, [user_id, user_type]);

        res.json({
            success: true,
            payments
        });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch payment history'
        });
    }
});

// Get revenue analytics (admin only)
router.get('/analytics', async (req, res) => {
    try {
        // Total revenue
        const totalRevenue = await db.get(`
            SELECT SUM(amount) as total 
            FROM payments 
            WHERE status = 'completed'
        `);

        // Monthly revenue
        const monthlyRevenue = await db.all(`
            SELECT 
                strftime('%Y-%m', payment_date) as month,
                SUM(amount) as revenue,
                COUNT(*) as transactions
            FROM payments 
            WHERE status = 'completed'
            GROUP BY strftime('%Y-%m', payment_date)
            ORDER BY month DESC
            LIMIT 12
        `);

        // Revenue by payment type
        const revenueByType = await db.all(`
            SELECT 
                payment_type,
                SUM(amount) as revenue,
                COUNT(*) as transactions
            FROM payments 
            WHERE status = 'completed'
            GROUP BY payment_type
        `);

        // Pending payments
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
        `);

        res.json({
            success: true,
            analytics: {
                total_revenue: totalRevenue.total || 0,
                monthly_revenue: monthlyRevenue,
                revenue_by_type: revenueByType,
                pending_payments: pendingPayments
            }
        });

    } catch (error) {
        console.error('Error fetching payment analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
});

module.exports = router;