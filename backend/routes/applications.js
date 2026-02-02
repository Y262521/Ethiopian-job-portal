const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/sqlite');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/cvs';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Validation middleware
const validateApplication = [
    body('jobId').isInt().withMessage('Valid job ID is required'),
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
    body('coverLetter').trim().isLength({ min: 100 }).withMessage('Cover letter must be at least 100 characters'),
    body('experience').trim().isLength({ min: 2 }).withMessage('Experience information is required')
];

// Submit job application
router.post('/submit', upload.single('cvFile'), validateApplication, async (req, res) => {
    try {
        console.log('📝 Application submission request received');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Clean up uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            jobId,
            fullName,
            email,
            phone,
            coverLetter,
            experience,
            expectedSalary,
            availableStartDate,
            additionalInfo
        } = req.body;

        // Check if CV file was uploaded
        if (!req.file) {
            console.log('❌ No CV file uploaded');
            return res.status(400).json({
                success: false,
                error: 'CV file is required'
            });
        }

        console.log('✅ CV file uploaded successfully');

        // Check if job exists and get employer info
        const job = await db.get(`
            SELECT j.id, j.title, j.employer_id, e.company_name 
            FROM jobs j 
            JOIN employers e ON j.employer_id = e.id 
            WHERE j.id = ?
        `, [jobId]);

        console.log('🔍 Job lookup result:', job);

        if (!job) {
            console.log('❌ Job not found');
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }

        console.log('✅ Job found:', job.title);

        // Get jobseeker ID if the user is registered as a jobseeker
        const jobseeker = await db.get(
            'SELECT id FROM jobseekers WHERE email = ?',
            [email]
        );

        console.log('🔍 Jobseeker lookup result:', jobseeker);

        // Check if user already applied for this job
        const existingApplication = await db.get(
            'SELECT id FROM job_applications WHERE job_id = ? AND email = ?',
            [jobId, email]
        );

        if (existingApplication) {
            console.log('❌ User already applied for this job');
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(409).json({
                success: false,
                error: 'You have already applied for this job'
            });
        }

        console.log('✅ No existing application found, proceeding with submission');

        // Insert application into database
        console.log('💾 Inserting application into database...');
        const result = await db.run(`
            INSERT INTO job_applications (
                job_id, 
                jobseeker_id,
                employer_id,
                full_name, 
                email, 
                phone, 
                cover_letter, 
                experience, 
                expected_salary, 
                available_start_date, 
                additional_info, 
                cv_file_path, 
                status, 
                applied_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
        `, [
            jobId,
            jobseeker ? jobseeker.id : null,
            job.employer_id,
            fullName,
            email,
            phone,
            coverLetter,
            experience,
            expectedSalary || null,
            availableStartDate || null,
            additionalInfo || null,
            req.file.path
        ]);

        console.log('✅ Application inserted successfully, ID:', result.id);

        // Get the created application
        const application = await db.get(
            'SELECT * FROM job_applications WHERE id = ?',
            [result.id]
        );

        console.log('✅ Application retrieved:', application);

        console.log('🎉 Sending success response');
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully!',
            application: {
                id: application.id,
                jobId: application.job_id,
                jobTitle: job.title,
                company: job.company_name,
                status: application.status,
                appliedAt: application.applied_at
            }
        });

    } catch (error) {
        console.error('❌ Application submission error:', error);

        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to submit application. Please try again.'
        });
    }
});

// Get user's applications
router.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const applications = await db.all(`
            SELECT 
                ja.*,
                j.title as job_title,
                e.company_name,
                j.location,
                j.salary
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            JOIN employers e ON j.employer_id = e.id
            WHERE ja.email = ?
            ORDER BY ja.applied_at DESC
        `, [email]);

        res.json({
            success: true,
            applications: applications
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch applications'
        });
    }
});

// Get application details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const application = await db.get(`
            SELECT 
                ja.*,
                j.title as job_title,
                e.company_name,
                j.location,
                j.salary,
                j.description as job_description
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            JOIN employers e ON j.employer_id = e.id
            WHERE ja.id = ?
        `, [id]);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        res.json({
            success: true,
            application: application
        });

    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch application'
        });
    }
});

// Update application status (for employers/admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, message } = req.body;

        const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        await db.run(`
            UPDATE job_applications 
            SET status = ?, response_message = ?, reviewed_at = datetime('now')
            WHERE id = ?
        `, [status, message || null, id]);

        res.json({
            success: true,
            message: 'Application status updated successfully'
        });

    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update application status'
        });
    }
});

// Get applications for a job (for employers)
router.get('/job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        const applications = await db.all(`
            SELECT 
                ja.*,
                j.title as job_title,
                j.company_name
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            WHERE ja.job_id = ?
            ORDER BY ja.applied_at DESC
        `, [jobId]);

        res.json({
            success: true,
            applications: applications
        });

    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch applications'
        });
    }
});

// Get applications for employer's jobs
router.get('/employer/:employerId', async (req, res) => {
    try {
        const { employerId } = req.params;

        const applications = await db.all(`
            SELECT 
                ja.*,
                j.title as job_title,
                j.location,
                j.salary
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            WHERE j.employer_id = ?
            ORDER BY ja.applied_at DESC
        `, [employerId]);

        res.json({
            success: true,
            applications: applications
        });

    } catch (error) {
        console.error('Error fetching employer applications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch applications'
        });
    }
});

// Download CV file (with authentication for employers)
router.get('/download-cv/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        console.log('📥 CV download request for:', filename);

        // Get auth token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            // If token provided, verify it
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('✅ Authenticated user:', decoded.userType, decoded.userId);

                // Check if user is employer or admin (they can download CVs)
                if (decoded.userType !== 'employer' && decoded.userType !== 'admin') {
                    console.log('❌ Unauthorized user type:', decoded.userType);
                    return res.status(403).json({
                        success: false,
                        error: 'Only employers and admins can download CVs'
                    });
                }

                // For employers, verify they have access to this CV through an application
                if (decoded.userType === 'employer') {
                    const application = await db.get(`
                        SELECT ja.id 
                        FROM job_applications ja
                        JOIN jobs j ON ja.job_id = j.id
                        WHERE j.employer_id = ? AND ja.cv_file_path LIKE ?
                    `, [decoded.userId, `%${filename}`]);

                    if (!application) {
                        console.log('❌ Employer does not have access to this CV');
                        return res.status(403).json({
                            success: false,
                            error: 'You do not have permission to access this CV'
                        });
                    }
                }
            } catch (jwtError) {
                console.log('❌ Invalid token:', jwtError.message);
                return res.status(401).json({
                    success: false,
                    error: 'Invalid authentication token'
                });
            }
        }

        const filePath = path.join(__dirname, '../uploads/cvs', filename);
        console.log('📁 Looking for file at:', filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log('❌ CV file not found at:', filePath);
            return res.status(404).json({
                success: false,
                error: 'CV file not found'
            });
        }

        console.log('✅ CV file found, starting download');

        // Get file stats for proper headers
        const stats = fs.statSync(filePath);
        const fileExtension = path.extname(filename).toLowerCase();

        // Set content type based on file extension
        let contentType = 'application/octet-stream';
        if (fileExtension === '.pdf') {
            contentType = 'application/pdf';
        } else if (fileExtension === '.doc') {
            contentType = 'application/msword';
        } else if (fileExtension === '.docx') {
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('❌ Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to download CV'
                });
            }
        });

        fileStream.on('end', () => {
            console.log('✅ CV download completed successfully');
        });

    } catch (error) {
        console.error('❌ Error downloading CV:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to download CV'
        });
    }
});

module.exports = router;