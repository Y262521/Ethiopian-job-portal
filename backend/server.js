const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Add process-level error handling to prevent crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const companyRoutes = require('./routes/companies');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const applicationRoutes = require('./routes/applications');
const savedJobsRoutes = require('./routes/savedJobs');
const jobAlertsRoutes = require('./routes/jobAlerts');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - more permissive for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // increased from 100 to 1000 requests per windowMs
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS configuration - Updated for production
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'https://ethiopia-job-portal.netlify.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/job-alerts', jobAlertsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Ethiopia Job Portal API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Ethiopia Job Portal API',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            jobs: '/api/jobs',
            companies: '/api/companies'
        }
    });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Express Error Handler:', err.message);
    console.error('Stack:', err.stack);
    console.error('Request URL:', req.url);
    console.error('Request Method:', req.method);

    // Don't crash the server, always send a response
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Something went wrong!',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ethiopia Job Portal API server running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🛡️  Process error handlers installed`);
    console.log(`🎯 Server ready for connections`);

    // Log server health every 30 seconds in development
    if (process.env.NODE_ENV !== 'production') {
        setInterval(() => {
            const memUsage = process.memoryUsage();
            console.log(`💚 Server healthy - Memory: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
        }, 30000);
    }
});