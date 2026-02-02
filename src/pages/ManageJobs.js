import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployerJobs, updateJob, deleteJob } from '../services/api';
import './ManageJobs.css';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingJob, setEditingJob] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and is an employer
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'employer') {
            navigate('/user/home');
            return;
        }

        fetchEmployerJobs(parsedUser.id);
    }, [navigate]);

    const fetchEmployerJobs = async (employerId) => {
        try {
            setLoading(true);
            console.log('🔍 Fetching jobs for employer:', employerId);

            const response = await getEmployerJobs(employerId);

            if (response.success) {
                console.log('✅ Jobs loaded:', response.jobs);
                setJobs(response.jobs || []);
            } else {
                console.error('❌ Failed to fetch jobs:', response.error);
                setJobs([]);
            }
        } catch (error) {
            console.error('❌ Error fetching jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditJob = (job) => {
        setEditingJob({ ...job });
        setShowEditModal(true);
    };

    const handleSaveJob = async () => {
        try {
            console.log('🔄 Updating job:', editingJob.id);

            const response = await updateJob(editingJob.id, editingJob);

            if (response.success) {
                console.log('✅ Job updated successfully');

                // Update local state
                setJobs(jobs.map(job =>
                    job.id === editingJob.id ? editingJob : job
                ));

                setShowEditModal(false);
                setEditingJob(null);
                alert('Job updated successfully!');
            } else {
                console.error('❌ Failed to update job:', response.error);
                alert(`Failed to update job: ${response.error}`);
            }
        } catch (error) {
            console.error('❌ Error updating job:', error);
            alert('Failed to update job. Please try again.');
        }
    };

    const handleDeleteJob = async (jobId, jobTitle) => {
        if (window.confirm(`Are you sure you want to delete the job "${jobTitle}"? This action cannot be undone.`)) {
            try {
                console.log('🔄 Deleting job:', jobId);

                const response = await deleteJob(jobId);

                if (response.success) {
                    console.log('✅ Job deleted successfully');

                    // Remove from local state
                    setJobs(jobs.filter(job => job.id !== jobId));
                    alert('Job deleted successfully!');
                } else {
                    console.error('❌ Failed to delete job:', response.error);
                    alert(`Failed to delete job: ${response.error}`);
                }
            } catch (error) {
                console.error('❌ Error deleting job:', error);
                alert('Failed to delete job. Please try again.');
            }
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            const jobToUpdate = jobs.find(job => job.id === jobId);
            const updatedJob = { ...jobToUpdate, status: newStatus };

            const response = await updateJob(jobId, updatedJob);

            if (response.success) {
                setJobs(jobs.map(job =>
                    job.id === jobId ? { ...job, status: newStatus } : job
                ));
                alert(`Job status updated to ${newStatus}!`);
            } else {
                alert(`Failed to update job status: ${response.error}`);
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'closed': return '#dc3545';
            case 'draft': return '#ffc107';
            case 'pending': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    // Filter jobs based on search term and status
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Group jobs by title for better organization
    const groupedJobs = filteredJobs.reduce((groups, job) => {
        const title = job.title;
        if (!groups[title]) {
            groups[title] = [];
        }
        groups[title].push(job);
        return groups;
    }, {});

    const closeModal = () => {
        setShowEditModal(false);
        setEditingJob(null);
    };

    return (
        <div className="manage-jobs">
            <div className="container">
                <div className="page-header">
                    <h1>Manage Jobs</h1>
                    <p>Edit, close, or delete your job postings</p>
                </div>

                {/* Controls */}
                <div className="job-controls">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search jobs by title, category, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Jobs Content */}
                {loading ? (
                    <div className="loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        Loading your jobs...
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                        <div className="no-jobs-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <h3>No jobs found</h3>
                        <p>
                            {jobs.length === 0
                                ? "You haven't posted any jobs yet."
                                : "No jobs match your search criteria."
                            }
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/post-job')}
                        >
                            <i className="fas fa-plus"></i>
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="jobs-by-title">
                        {Object.entries(groupedJobs).map(([title, jobsGroup]) => (
                            <div key={title} className="job-title-group">
                                <div className="group-header">
                                    <h2>{title}</h2>
                                    <span className="job-count">{jobsGroup.length} posting{jobsGroup.length > 1 ? 's' : ''}</span>
                                </div>

                                <div className="jobs-grid">
                                    {jobsGroup.map((job) => (
                                        <div key={job.id} className="job-card">
                                            <div className="job-header">
                                                <div className="job-info">
                                                    <h3>{job.title}</h3>
                                                    <div className="job-meta">
                                                        <span className="location">
                                                            <i className="fas fa-map-marker-alt"></i>
                                                            {job.location}
                                                        </span>
                                                        <span className="category">
                                                            <i className="fas fa-tag"></i>
                                                            {job.category_name}
                                                        </span>
                                                        <span className="job-type">
                                                            <i className="fas fa-clock"></i>
                                                            {job.job_type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="job-status">
                                                    <span
                                                        className={`status-badge ${job.status}`}
                                                        style={{ backgroundColor: getStatusColor(job.status) }}
                                                    >
                                                        {job.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="job-details">
                                                <p className="job-description">
                                                    {job.description.length > 150
                                                        ? `${job.description.substring(0, 150)}...`
                                                        : job.description
                                                    }
                                                </p>

                                                <div className="job-stats">
                                                    <div className="stat">
                                                        <span className="stat-label">Posted:</span>
                                                        <span className="stat-value">{formatDate(job.created_at)}</span>
                                                    </div>
                                                    {job.salary && (
                                                        <div className="stat">
                                                            <span className="stat-label">Salary:</span>
                                                            <span className="stat-value">{job.salary}</span>
                                                        </div>
                                                    )}
                                                    <div className="stat">
                                                        <span className="stat-label">Experience:</span>
                                                        <span className="stat-value">{job.experience_level}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="job-actions">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleEditJob(job)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                    Edit
                                                </button>

                                                <select
                                                    value={job.status}
                                                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="closed">Closed</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="pending">Pending</option>
                                                </select>

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
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="jobs-summary">
                    <div className="summary-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Jobs:</span>
                            <span className="stat-value">{jobs.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Active:</span>
                            <span className="stat-value">{jobs.filter(j => j.status === 'active').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Closed:</span>
                            <span className="stat-value">{jobs.filter(j => j.status === 'closed').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Draft:</span>
                            <span className="stat-value">{jobs.filter(j => j.status === 'draft').length}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Job Modal */}
                {showEditModal && editingJob && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Job: {editingJob.title}</h2>
                                <button className="modal-close" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        value={editingJob.title}
                                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={editingJob.description}
                                        onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                                        className="form-textarea"
                                        rows="4"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={editingJob.location}
                                            onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Salary</label>
                                        <input
                                            type="text"
                                            value={editingJob.salary || ''}
                                            onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                                            className="form-input"
                                            placeholder="e.g., 25,000 - 35,000 ETB"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveJob}>
                                    <i className="fas fa-save"></i>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;