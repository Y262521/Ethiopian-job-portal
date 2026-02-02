import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // Increased timeout to 30 seconds for file uploads
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Functions
export const fetchJobCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchFeaturedCompanies = async () => {
    try {
        const response = await api.get('/companies/featured');
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const fetchJobs = async (params = {}) => {
    try {
        const response = await api.get('/jobs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

export const searchJobs = async (query, filters = {}) => {
    try {
        const params = { q: query, ...filters };
        const response = await api.get('/jobs/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching jobs:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        console.log('Sending registration data:', userData);
        const response = await api.post('/auth/register', userData);
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
};

// Job Application Functions
export const submitJobApplication = async (applicationData) => {
    try {
        const response = await api.post('/applications/submit', applicationData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};

export const getUserApplications = async (email) => {
    try {
        const response = await api.get(`/applications/user/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

export const getEmployerApplications = async (employerId) => {
    try {
        const response = await api.get(`/applications/employer/${employerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employer applications:', error);
        throw error;
    }
};

export const updateApplicationStatus = async (applicationId, status, message = '') => {
    try {
        const response = await api.put(`/applications/${applicationId}/status`, {
            status,
            message
        });
        return response.data;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
};

// Job posting functions
export const postJob = async (jobData) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        console.error('Error posting job:', error);
        throw error;
    }
};

export const getEmployerJobs = async (employerId, params = {}) => {
    try {
        const response = await api.get(`/jobs/employer/${employerId}`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching employer jobs:', error);
        throw error;
    }
};

export const updateJob = async (jobId, jobData) => {
    try {
        const response = await api.put(`/jobs/${jobId}`, jobData);
        return response.data;
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
};

export const deleteJob = async (jobId) => {
    try {
        const response = await api.delete(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

export default api;
// User Statistics Functions
export const getUserStats = async (email) => {
    try {
        const response = await api.get(`/users/stats/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

export const getUserActivity = async (email) => {
    try {
        const response = await api.get(`/users/recent-activity/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity:', error);
        throw error;
    }
};

// Profile Functions
export const getUserProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// CV Upload Functions
export const uploadCV = async (cvFile) => {
    try {
        const formData = new FormData();
        formData.append('cvFile', cvFile);

        const response = await api.post('/users/profile/cv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading CV:', error);
        throw error;
    }
};

export const downloadCV = async (filename) => {
    try {
        const response = await api.get(`/users/profile/cv/${filename}`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading CV:', error);
        throw error;
    }
};

export const uploadProfilePhoto = async (photoFile) => {
    try {
        const formData = new FormData();
        formData.append('profilePhoto', photoFile);

        const response = await api.post('/users/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw error;
    }
};

// Admin Functions
export const getAdminUsers = async (userType = 'jobseekers') => {
    try {
        const response = await api.get(`/admin/users/${userType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw error;
    }
};

export const updateUserStatus = async (userId, userType, status) => {
    try {
        const response = await api.put(`/admin/users/${userType}/${userId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};
// Saved Jobs Functions
export const getSavedJobs = async (email) => {
    try {
        const response = await api.get(`/saved-jobs/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        throw error;
    }
};

export const saveJob = async (email, jobId) => {
    try {
        const response = await api.post('/saved-jobs/save', { email, jobId });
        return response.data;
    } catch (error) {
        console.error('Error saving job:', error);
        throw error;
    }
};

export const removeSavedJob = async (email, jobId) => {
    try {
        const response = await api.delete('/saved-jobs/remove', {
            data: { email, jobId }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing saved job:', error);
        throw error;
    }
};

export const checkJobSaved = async (email, jobId) => {
    try {
        const response = await api.get(`/saved-jobs/check/${email}/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking saved job:', error);
        throw error;
    }
};

// Job Alerts Functions
export const getJobAlerts = async (email) => {
    try {
        const response = await api.get(`/job-alerts/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching job alerts:', error);
        throw error;
    }
};

export const createJobAlert = async (alertData) => {
    try {
        const response = await api.post('/job-alerts/create', alertData);
        return response.data;
    } catch (error) {
        console.error('Error creating job alert:', error);
        throw error;
    }
};

export const updateJobAlert = async (alertId, alertData) => {
    try {
        const response = await api.put(`/job-alerts/update/${alertId}`, alertData);
        return response.data;
    } catch (error) {
        console.error('Error updating job alert:', error);
        throw error;
    }
};

export const deleteJobAlert = async (alertId, email) => {
    try {
        const response = await api.delete(`/job-alerts/delete/${alertId}`, {
            data: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting job alert:', error);
        throw error;
    }
};

export const toggleJobAlert = async (alertId, email) => {
    try {
        const response = await api.patch(`/job-alerts/toggle/${alertId}`, { email });
        return response.data;
    } catch (error) {
        console.error('Error toggling job alert:', error);
        throw error;
    }
};
// Admin Analytics API
export const getAnalytics = async (timeRange = '30days') => {
    try {
        const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return { success: false, error: error.message };
    }
};

// Job Moderation API
export const getJobsForModeration = async (status = 'all') => {
    try {
        const response = await api.get(`/admin/jobs/moderation?status=${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs for moderation:', error);
        return { success: false, error: error.message };
    }
};

export const updateJobStatus = async (jobId, status, reason = '') => {
    try {
        const response = await api.put(`/admin/jobs/${jobId}/status`, { status, reason });
        return response.data;
    } catch (error) {
        console.error('Error updating job status:', error);
        return { success: false, error: error.message };
    }
};

// User Management API
export const suspendUser = async (userId, reason) => {
    try {
        const response = await api.put(`/admin/users/${userId}/suspend`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error suspending user:', error);
        return { success: false, error: error.message };
    }
};

// Notifications API
export const sendNotification = async (notificationData) => {
    try {
        const response = await api.post('/admin/notifications/send', notificationData);
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
};
// User Management API
export const getAllUsers = async (filter = 'all') => {
    try {
        const response = await api.get(`/admin/users/all?filter=${filter}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all users:', error);
        return { success: false, error: error.message };
    }
};

export const activateUser = async (userId) => {
    try {
        const response = await api.put(`/admin/users/${userId}/activate`);
        return response.data;
    } catch (error) {
        console.error('Error activating user:', error);
        return { success: false, error: error.message };
    }
};

// Notification System API
export const getNotificationHistory = async () => {
    try {
        const response = await api.get('/admin/notifications/history');
        return response.data;
    } catch (error) {
        console.error('Error fetching notification history:', error);
        return { success: false, error: error.message };
    }
};

// Payment Management API
export const getAllPayments = async (status = 'all', limit = 50, offset = 0) => {
    try {
        const response = await api.get(`/payments/admin/all?status=${status}&limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        return { success: false, error: error.message };
    }
};

export const confirmPayment = async (paymentId, status, adminNotes = '') => {
    try {
        const response = await api.put(`/payments/confirm/${paymentId}`, {
            status,
            admin_notes: adminNotes
        });
        return response.data;
    } catch (error) {
        console.error('Error confirming payment:', error);
        return { success: false, error: error.message };
    }
};

export const getPaymentAnalytics = async () => {
    try {
        const response = await api.get('/payments/analytics');
        return response.data;
    } catch (error) {
        console.error('Error fetching payment analytics:', error);
        return { success: false, error: error.message };
    }
};