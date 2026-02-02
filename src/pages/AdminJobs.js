import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminJobs.css';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchAllJobs();
    }, [navigate]);

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching all jobs for admin...');

            const response = await fetch('http://localhost:5000/api/admin/jobs/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Jobs loaded:', data);

                // Ensure all jobs have required properties with defaults
                const jobsWithDefaults = (data.jobs || []).map(job => ({
                    ...job,
                    status: job.status || 'unknown',
                    title: job.title || 'Untitled Job',
                    location: job.location || 'Unknown Location',
                    description: job.description || 'No description available',
                    category_name: job.category_name || 'Uncategorized',
                    company_name: job.company_name || 'Unknown Company',
                    created_at: job.created_at || new Date().toISOString()
                }));

                setJobs(jobsWithDefaults);
            } else {
                console.error('❌ Failed to fetch jobs');
                // Fallback to public jobs API
                const publicResponse = await fetch('http://localhost:5000/api/jobs');
                if (publicResponse.ok) {
                    const publicData = await publicResponse.json();
                    const jobsWithDefaults = (publicData.jobs || []).map(job => ({
                        ...job,
                        status: job.status || 'active',
                        title: job.title || 'Untitled Job',
                        location: job.location || 'Unknown Location',
                        description: job.description || 'No description available',
                        category_name: job.category_name || 'Uncategorized',
                        company_name: job.company_name || 'Unknown Company',
                        created_at: job.created_at || new Date().toISOString()
                    }));
                    setJobs(jobsWithDefaults);
                }
            }
        } catch (error) {
            console.error('❌ Error fetching jobs:', error);
            // Try fallback API
            try {
                const response = await fetch('http://localhost:5000/api/jobs');
                if (response.ok) {
                    const data = await response.json();
                    const jobsWithDefaults = (data.jobs || []).map(job => ({
                        ...job,
                        status: job.status || 'active',
                        title: job.title || 'Untitled Job',
                        location: job.location || 'Unknown Location',
                        description: job.description || 'No description available',
                        category_name: job.category_name || 'Uncategorized',
                        company_name: job.company_name || 'Unknown Company',
                        created_at: job.created_at || new Date().toISOString()
                    }));
                    setJobs(jobsWithDefaults);
                }
            } catch (fallbackError) {
                console.error('❌ Fallback API also failed:', fallbackError);
                setJobs([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJobAction = async (jobId, action, reason = '') => {
        try {
            console.log(`🔄 ${action} job ${jobId}...`);
            console.log('🔍 Current user token:', localStorage.getItem('token') ? 'Token exists' : 'No token');
            console.log('🔍 Current user data:', localStorage.getItem('user'));

            // If approving, check payment status first
            if (action === 'approved') {
                console.log('💰 Checking payment status before approval...');
                const paymentCheck = await checkJobPaymentStatus(jobId);
                console.log('💰 Payment check result:', paymentCheck);
                if (!paymentCheck.success) {
                    alert(`Cannot approve job: ${paymentCheck.message}`);
                    return;
                }
            }

            // First try the admin API endpoint
            console.log('🔄 Trying admin endpoint...');
            let response = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: action, reason })
            });

            console.log('📡 Admin endpoint response status:', response.status);
            console.log('📡 Admin endpoint response headers:', response.headers);

            // If admin endpoint fails, try the regular jobs endpoint
            if (!response.ok) {
                console.log('❌ Admin endpoint failed, trying regular jobs endpoint...');
                const errorText = await response.text();
                console.log('❌ Admin endpoint error:', errorText);

                response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: action, moderation_reason: reason })
                });
                console.log('📡 Regular endpoint response status:', response.status);
            }

            if (response.ok) {
                console.log(`✅ Job ${action} successfully`);
                const responseData = await response.json();
                console.log('✅ Response data:', responseData);

                // Update local state
                setJobs(jobs.map(job =>
                    job.id === jobId
                        ? { ...job, status: action, moderation_reason: reason }
                        : job
                ));

                setShowJobModal(false);
                setSelectedJob(null);
                alert(`Job ${action} successfully!`);

                // Refresh the jobs list
                await fetchAllJobs();
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error(`❌ Failed to ${action} job:`, errorData);
                alert(`Failed to ${action} job: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`❌ Error ${action} job:`, error);
            alert(`Failed to ${action} job. Please check your connection and try again. Error: ${error.message}`);
        }
    };

    const checkJobPaymentStatus = async (jobId) => {
        try {
            console.log(`🔍 Checking payment status for job ${jobId}...`);

            const response = await fetch(`http://localhost:5000/api/admin/jobs/${jobId}/payment-status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Payment status checked:', data);
                return data;
            } else {
                console.log('❌ Payment check failed, allowing approval anyway');
                return { success: true, message: 'Payment check bypassed' };
            }
        } catch (error) {
            console.error('❌ Error checking payment status:', error);
            // Allow approval if payment check fails
            return { success: true, message: 'Payment check bypassed due to error' };
        }
    };

    const handleDeleteJob = async (jobId, jobTitle) => {
        if (window.confirm(`Are you sure you want to permanently delete the job "${jobTitle}"? This action cannot be undone.`)) {
            try {
                console.log(`🔄 Deleting job ${jobId}...`);

                const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    console.log('✅ Job deleted successfully');

                    // Remove from local state
                    setJobs(jobs.filter(job => job.id !== jobId));
                    setShowJobModal(false);
                    setSelectedJob(null);
                    alert('Job deleted successfully!');

                    // Refresh the jobs list
                    fetchAllJobs();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ Failed to delete job:', errorData);
                    alert(`Failed to delete job: ${errorData.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('❌ Error deleting job:', error);
                alert('Failed to delete job. Please check your connection and try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'approved': return '#28a745';
            case 'closed': return '#6c757d';
            case 'pending': return '#ffc107';
            case 'rejected': return '#dc3545';
            case 'flagged': return '#fd7e14';
            case 'draft': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return 'fas fa-check-circle';
            case 'approved': return 'fas fa-check-circle';
            case 'closed': return 'fas fa-times-circle';
            case 'pending': return 'fas fa-clock';
            case 'rejected': return 'fas fa-ban';
            case 'flagged': return 'fas fa-flag';
            case 'draft': return 'fas fa-edit';
            default: return 'fas fa-question-circle';
        }
    };

    // Filter jobs
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || (job.status || 'unknown') === statusFilter;
        const matchesCategory = categoryFilter === 'all' || job.category_name === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Get unique categories
    const categories = [...new Set(jobs.map(job => job.category_name).filter(Boolean))];

    const openJobModal = (job) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };

    const closeJobModal = () => {
        setShowJobModal(false);
        setSelectedJob(null);
    };

    if (loading) {
        return (
            <div className="admin-jobs">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading all jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-jobs">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-briefcase"></i>
                            All Jobs Management
                        </h1>
                        <p>View, moderate, and manage all job postings</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="jobs-stats">
                    <div className="stat-card">
                        <div className="stat-icon active">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{jobs.filter(j => (j.status || 'unknown') === 'active' || (j.status || 'unknown') === 'approved').length}</h3>
                            <p>Active/Approved Jobs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{jobs.filter(j => (j.status || 'unknown') === 'pending').length}</h3>
                            <p>Pending Review</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon closed">
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{jobs.filter(j => (j.status || 'unknown') === 'closed').length}</h3>
                            <p>Closed Jobs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <i className="fas fa-list"></i>
                        </div>
                        <div className="stat-content">
                            <h3>{jobs.length}</h3>
                            <p>Total Jobs</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="jobs-filters">
                    <div className="filter-group">
                        <input
                            type="text"
                            placeholder="Search jobs by title, company, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                            <option value="rejected">Rejected</option>
                            <option value="flagged">Flagged</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                        <div className="no-jobs-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <h3>No jobs found</h3>
                        <p>No jobs match your current filters.</p>
                    </div>
                ) : (
                    <div className="jobs-list">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="job-header">
                                    <div className="job-info">
                                        <h3>{job.title}</h3>
                                        <div className="job-meta">
                                            <span className="company">
                                                <i className="fas fa-building"></i>
                                                {job.company_name || 'Unknown Company'}
                                            </span>
                                            <span className="location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {job.location}
                                            </span>
                                            <span className="category">
                                                <i className="fas fa-tag"></i>
                                                {job.category_name}
                                            </span>
                                            <span className="date">
                                                <i className="fas fa-calendar"></i>
                                                {formatDate(job.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="job-status">
                                        <span
                                            className={`status-badge ${job.status || 'unknown'}`}
                                            style={{ backgroundColor: getStatusColor(job.status || 'unknown') }}
                                        >
                                            <i className={getStatusIcon(job.status || 'unknown')}></i>
                                            {(job.status || 'UNKNOWN').toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="job-description">
                                    <p>
                                        {job.description.length > 200
                                            ? `${job.description.substring(0, 200)}...`
                                            : job.description
                                        }
                                    </p>
                                </div>

                                <div className="job-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => openJobModal(job)}
                                    >
                                        <i className="fas fa-eye"></i>
                                        View Details
                                    </button>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleJobAction(job.id, 'approved')}
                                        disabled={(job.status || 'unknown') === 'approved' || (job.status || 'unknown') === 'active'}
                                    >
                                        <i className="fas fa-check"></i>
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteJob(job.id, job.title)}
                                    >
                                        <i className="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Job Details Modal */}
                {showJobModal && selectedJob && (
                    <div className="modal-overlay" onClick={closeJobModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{selectedJob.title}</h2>
                                <button className="modal-close" onClick={closeJobModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="job-details">
                                    <div className="detail-section">
                                        <h4>Job Information</h4>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Company:</label>
                                                <span>{selectedJob.company_name || 'Unknown'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Location:</label>
                                                <span>{selectedJob.location}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Category:</label>
                                                <span>{selectedJob.category_name}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Job Type:</label>
                                                <span>{selectedJob.job_type}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Experience Level:</label>
                                                <span>{selectedJob.experience_level}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Salary:</label>
                                                <span>{selectedJob.salary || 'Not specified'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Status:</label>
                                                <span
                                                    className={`status-badge ${selectedJob.status || 'unknown'}`}
                                                    style={{ backgroundColor: getStatusColor(selectedJob.status || 'unknown') }}
                                                >
                                                    {(selectedJob.status || 'UNKNOWN').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Posted:</label>
                                                <span>{formatDate(selectedJob.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Job Description</h4>
                                        <div className="job-description-full">
                                            <p>{selectedJob.description}</p>
                                        </div>
                                    </div>

                                    {selectedJob.requirements && (
                                        <div className="detail-section">
                                            <h4>Requirements</h4>
                                            <div className="job-requirements">
                                                <p>{selectedJob.requirements}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleJobAction(selectedJob.id, 'approved')}
                                    disabled={(selectedJob.status || 'unknown') === 'approved' || (selectedJob.status || 'unknown') === 'active'}
                                >
                                    <i className="fas fa-check"></i>
                                    Approve Job
                                </button>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleJobAction(selectedJob.id, 'rejected', 'Rejected by admin')}
                                    disabled={(selectedJob.status || 'unknown') === 'rejected'}
                                >
                                    <i className="fas fa-ban"></i>
                                    Reject Job
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteJob(selectedJob.id, selectedJob.title)}
                                >
                                    <i className="fas fa-trash"></i>
                                    Delete Job
                                </button>
                                <button className="btn btn-secondary" onClick={closeJobModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminJobs;