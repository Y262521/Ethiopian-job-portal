const express = require('express');
const db = require('../config/sqlite');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for profile photo uploads
const profilePhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile-photos';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer for CV uploads
const cvStorage = multer.diskStorage({
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
    if (file.fieldname === 'profilePhoto') {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
        }
    } else if (file.fieldname === 'cvFile') {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
        }
    } else {
        cb(new Error('Unknown field'), false);
    }
};

const uploadProfilePhoto = multer({
    storage: profilePhotoStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadCV = multer({
    storage: cvStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        let query, table;

        if (userType === 'jobseeker') {
            table = 'jobseekers';
            query = `SELECT id, first_name, last_name, email, phone, bio, skills, experience, 
                     education, location, cv_file_path, cv_file_name, preferred_job_types, 
                     preferred_categories, preferred_locations, salary_expectation, 
                     work_arrangement, experience_level, availability, created_at 
                     FROM jobseekers WHERE id = ?`;
        } else if (userType === 'employer') {
            table = 'employers';
            query = 'SELECT id, company_name, contact_person, email, phone, website, description, location, industry, employees, founded, created_at FROM employers WHERE id = ?';
        } else {
            table = 'adminb';
            query = 'SELECT id, username, email, created_at FROM adminb WHERE id = ?';
        }

        const user = await db.get(query, [userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: user,
            userType: userType
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { userId, userType } = req.user;
        const updateData = req.body;

        console.log('🔄 Profile update request:', { userId, userType, updateData });

        let query, values;

        if (userType === 'jobseeker') {
            const { firstName, lastName, phone, bio, skills, experience, education, location,
                preferredJobTypes, preferredCategories, preferredLocations, salaryExpectation,
                workArrangement, experienceLevel, availability } = updateData;

            query = `UPDATE jobseekers SET 
                first_name = ?, last_name = ?, phone = ?, bio = ?, skills = ?, 
                experience = ?, education = ?, location = ?, preferred_job_types = ?, 
                preferred_categories = ?, preferred_locations = ?, salary_expectation = ?, 
                work_arrangement = ?, experience_level = ?, availability = ?
                WHERE id = ?`;

            values = [
                firstName, lastName, phone, bio, skills, experience, education, location,
                Array.isArray(preferredJobTypes) ? preferredJobTypes.join(',') : preferredJobTypes,
                Array.isArray(preferredCategories) ? preferredCategories.join(',') : preferredCategories,
                Array.isArray(preferredLocations) ? preferredLocations.join(',') : preferredLocations,
                salaryExpectation, workArrangement, experienceLevel, availability, userId
            ];
        } else if (userType === 'employer') {
            // Build dynamic query for employer updates
            const allowedFields = ['company_name', 'contact_person', 'phone', 'website', 'description', 'location', 'industry', 'employees', 'founded'];
            const fieldMappings = {
                companyName: 'company_name',
                contactPerson: 'contact_person',
                phone: 'phone',
                website: 'website',
                description: 'description',
                location: 'location',
                industry: 'industry',
                employees: 'employees',
                founded: 'founded'
            };

            const updateFields = [];
            const updateValues = [];

            // Only update fields that are provided
            for (const [frontendField, dbField] of Object.entries(fieldMappings)) {
                if (updateData.hasOwnProperty(frontendField) && updateData[frontendField] !== undefined) {
                    updateFields.push(`${dbField} = ?`);
                    updateValues.push(updateData[frontendField]);
                }
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'No valid fields to update' });
            }

            query = `UPDATE employers SET ${updateFields.join(', ')} WHERE id = ?`;
            values = [...updateValues, userId];
        } else if (userType === 'admin') {
            // Handle admin profile updates
            const { username, email } = updateData;

            // Only allow updating username for admin (email should not be changed)
            if (username) {
                query = 'UPDATE adminb SET username = ? WHERE id = ?';
                values = [username, userId];
            } else {
                return res.status(400).json({ error: 'No valid fields to update for admin' });
            }
        } else {
            return res.status(403).json({ error: 'Invalid user type' });
        }

        console.log('📝 Executing query:', query);
        console.log('📊 Query values:', values);

        await db.run(query, values);

        console.log('✅ Profile updated successfully');

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            error: 'Failed to update user profile',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Upload profile photo
router.post('/profile/photo', authenticateToken, uploadProfilePhoto.single('profilePhoto'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No photo file uploaded'
            });
        }

        const { userId, userType } = req.user;
        const photoPath = req.file.path;

        // Update user record with photo path
        let query;
        if (userType === 'jobseeker') {
            query = 'UPDATE jobseekers SET profile_photo = ? WHERE id = ?';
        } else if (userType === 'employer') {
            query = 'UPDATE employers SET profile_photo = ? WHERE id = ?';
        } else {
            query = 'UPDATE adminb SET profile_photo = ? WHERE id = ?';
        }

        await db.run(query, [photoPath, userId]);

        res.json({
            success: true,
            message: 'Profile photo uploaded successfully',
            photoPath: photoPath
        });

    } catch (error) {
        console.error('Error uploading profile photo:', error);

        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to upload profile photo'
        });
    }
});

// Upload CV file
router.post('/profile/cv', authenticateToken, uploadCV.single('cvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No CV file uploaded'
            });
        }

        const { userId, userType } = req.user;

        if (userType !== 'jobseeker') {
            return res.status(403).json({
                success: false,
                error: 'Only job seekers can upload CV files'
            });
        }

        const cvPath = req.file.path;
        const cvFileName = req.file.originalname;

        // Update jobseeker record with CV path
        await db.run(
            'UPDATE jobseekers SET cv_file_path = ?, cv_file_name = ? WHERE id = ?',
            [cvPath, cvFileName, userId]
        );

        res.json({
            success: true,
            message: 'CV uploaded successfully',
            cvPath: cvPath,
            cvFileName: cvFileName
        });

    } catch (error) {
        console.error('Error uploading CV:', error);

        // Clean up uploaded file on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to upload CV'
        });
    }
});

// Get profile photo
router.get('/profile/photo/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/profile-photos', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Photo not found'
            });
        }

        // Send the file
        res.sendFile(path.resolve(filePath));

    } catch (error) {
        console.error('Error serving profile photo:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to serve profile photo'
        });
    }
});

// Get user statistics for dashboard
router.get('/stats/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Get user type first
        let user = await db.get('SELECT id, first_name, last_name, "jobseeker" as type FROM jobseekers WHERE email = ?', [email]);
        if (!user) {
            user = await db.get('SELECT id, company_name as name, "employer" as type FROM employers WHERE email = ?', [email]);
        }
        if (!user) {
            user = await db.get('SELECT id, username as name, "admin" as type FROM adminb WHERE email = ?', [email]);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let stats = {};

        if (user.type === 'jobseeker') {
            // Get job seeker statistics
            const applications = await db.get('SELECT COUNT(*) as count FROM job_applications WHERE email = ?', [email]);
            const pendingApps = await db.get('SELECT COUNT(*) as count FROM job_applications WHERE email = ? AND status = "pending"', [email]);
            const shortlistedApps = await db.get('SELECT COUNT(*) as count FROM job_applications WHERE email = ? AND status = "shortlisted"', [email]);
            const hiredApps = await db.get('SELECT COUNT(*) as count FROM job_applications WHERE email = ? AND status = "hired"', [email]);

            // Get saved jobs count
            const savedJobs = await db.get(`
                SELECT COUNT(*) as count 
                FROM saved_jobs sj 
                JOIN jobseekers js ON sj.jobseeker_id = js.id 
                WHERE js.email = ?
            `, [email]);

            stats = {
                applications: applications.count || 0,
                savedJobs: savedJobs.count || 0,
                profileViews: Math.floor(Math.random() * 50) + 10, // Placeholder until profile views are tracked
                profileCompletion: 75, // TODO: Calculate based on profile completeness
                pendingApplications: pendingApps.count || 0,
                shortlistedApplications: shortlistedApps.count || 0,
                hiredApplications: hiredApps.count || 0
            };

        } else if (user.type === 'employer') {
            // Get employer statistics
            const activeJobs = await db.get('SELECT COUNT(*) as count FROM jobs WHERE employer_id = ? AND status = "active"', [user.id]);
            const totalApplications = await db.get(`
                SELECT COUNT(*) as count 
                FROM job_applications ja 
                JOIN jobs j ON ja.job_id = j.id 
                WHERE j.employer_id = ?
            `, [user.id]);
            const pendingApps = await db.get(`
                SELECT COUNT(*) as count 
                FROM job_applications ja 
                JOIN jobs j ON ja.job_id = j.id 
                WHERE j.employer_id = ? AND ja.status = "pending"
            `, [user.id]);
            const hiredCandidates = await db.get(`
                SELECT COUNT(*) as count 
                FROM job_applications ja 
                JOIN jobs j ON ja.job_id = j.id 
                WHERE j.employer_id = ? AND ja.status = "hired"
            `, [user.id]);

            stats = {
                activeJobs: activeJobs.count || 0,
                totalApplications: totalApplications.count || 0,
                viewsThisMonth: Math.floor(Math.random() * 500) + 50, // Placeholder until job views are tracked
                hiredCandidates: hiredCandidates.count || 0,
                pendingApplications: pendingApps.count || 0
            };

        } else if (user.type === 'admin') {
            // Get admin statistics
            const totalJobseekers = await db.get('SELECT COUNT(*) as count FROM jobseekers');
            const totalEmployers = await db.get('SELECT COUNT(*) as count FROM employers');
            const totalJobs = await db.get('SELECT COUNT(*) as count FROM jobs');
            const pendingJobseekers = await db.get('SELECT COUNT(*) as count FROM jobseekers WHERE status = "pending"');
            const pendingEmployers = await db.get('SELECT COUNT(*) as count FROM employers WHERE status = "pending"');

            stats = {
                totalJobseekers: totalJobseekers.count || 0,
                totalEmployers: totalEmployers.count || 0,
                totalJobs: totalJobs.count || 0,
                pendingApprovals: (pendingJobseekers.count || 0) + (pendingEmployers.count || 0),
                pendingJobseekers: pendingJobseekers.count || 0,
                pendingEmployers: pendingEmployers.count || 0
            };
        }

        res.json({
            success: true,
            stats: stats,
            userType: user.type
        });

    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
});

// Get recent activity for user dashboard
router.get('/recent-activity/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Get user type first
        let user = await db.get('SELECT id, "jobseeker" as type FROM jobseekers WHERE email = ?', [email]);
        if (!user) {
            user = await db.get('SELECT id, "employer" as type FROM employers WHERE email = ?', [email]);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let activities = [];

        if (user.type === 'jobseeker') {
            // Get recent applications
            const recentApplications = await db.all(`
                SELECT 
                    ja.id,
                    ja.applied_at,
                    ja.status,
                    j.title as job_title,
                    e.company_name
                FROM job_applications ja
                JOIN jobs j ON ja.job_id = j.id
                JOIN employers e ON j.employer_id = e.id
                WHERE ja.email = ?
                ORDER BY ja.applied_at DESC
                LIMIT 5
            `, [email]);

            activities = recentApplications.map(app => ({
                id: app.id,
                type: 'application',
                title: `Applied for ${app.job_title}`,
                description: `at ${app.company_name}`,
                status: app.status,
                date: app.applied_at
            }));

        } else if (user.type === 'employer') {
            // Get recent applications to employer's jobs
            const recentApplications = await db.all(`
                SELECT 
                    ja.id,
                    ja.applied_at,
                    ja.status,
                    ja.full_name as applicant_name,
                    j.title as job_title
                FROM job_applications ja
                JOIN jobs j ON ja.job_id = j.id
                WHERE j.employer_id = ?
                ORDER BY ja.applied_at DESC
                LIMIT 5
            `, [user.id]);

            activities = recentApplications.map(app => ({
                id: app.id,
                type: 'application_received',
                title: `New application from ${app.applicant_name}`,
                description: `for ${app.job_title}`,
                status: app.status,
                date: app.applied_at
            }));
        }

        res.json({
            success: true,
            activities: activities
        });

    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
});
module.exports = router;
// Get CV file
router.get('/profile/cv/:filename', authenticateToken, (req, res) => {
    try {
        const { filename } = req.params;
        const { userType } = req.user;

        if (userType !== 'jobseeker') {
            return res.status(403).json({
                success: false,
                error: 'Only job seekers can access CV files'
            });
        }

        const filePath = path.join(__dirname, '../uploads/cvs', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'CV file not found'
            });
        }

        // Send the file
        res.sendFile(path.resolve(filePath));

    } catch (error) {
        console.error('Error serving CV file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to serve CV file'
        });
    }
});