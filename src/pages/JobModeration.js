import React, { useState, useEffect } from 'react';
import { getJobsForModeration, updateJobStatus } from '../services/api';
import './JobModeration.css';

const JobModeration = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await getJobsForModeration(filter);
            if (response.success) {
                setJobs(response.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJobAction = async (jobId, action, reason = '') => {
        try {
            const response = await updateJobStatus(jobId, action, reason);
            if (response.success) {
                // Update local state
                setJobs(jobs.map(job =>
                    job.id === jobId
                        ? { ...job, status: action, moderation_reason: reason }
                        : job
                ));
                setSelectedJob(null);
                alert(`Job ${action} successfully!`);
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status');
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
            case 'pending': return '#ffc107';
            case 'approved': return '#28a745';
            case 'rejected': return '#dc3545';
            case 'flagged': return '#fd7e14';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return (
            <div className="job-moderation">
                <div className="loading">Loading jobs for moderation...</div>
            </div>
        );
    }

    return (
        <div className="job-moderation">
            <div className="container">
                <div className="moderation-header">
                    <h1>Job Moderation</h1>
                    <p>Review and moderate job postings</p>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending Review ({jobs.filter(j => j.status === 'pending').length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved ({jobs.filter(j => j.status === 'approved').length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected ({jobs.filter(j => j.status === 'rejected').length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'flagged' ? 'active' : ''}`}
                        onClick={() => setFilter('flagged')}
                    >
                        Flagged ({jobs.filter(j => j.status === 'flagged').length})
                    </button>
                </div>

                {/* Jobs List */}
                <div className="jobs-list">
                    {jobs.length === 0 ? (
                        <div className="no-jobs">
                            <i className="fas fa-inbox"></i>
                            <h3>No jobs found</h3>
                            <p>No jobs match the current filter.</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="job-header">
                                    <div className="job-info">
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.company_name}</p>
                                        <div className="job-meta">
                                            <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                                            <span><i className="fas fa-briefcase"></i> {job.job_type}</span>
                                            <span><i className="fas fa-calendar"></i> {formatDate(job.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="job-status">
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(job.status) }}
                                        >
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="job-description">
                                    <p>{job.description.substring(0, 200)}...</p>
                                </div>

                                {job.moderation_reason && (
                                    <div className="moderation-reason">
                                        <strong>Moderation Note:</strong> {job.moderation_reason}
                                    </div>
                                )}

                                <div className="job-actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <i className="fas fa-eye"></i>
                                        View Details
                                    </button>

                                    {job.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleJobAction(job.id, 'approved')}
                                            >
                                                <i className="fas fa-check"></i>
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    const reason = prompt('Reason for rejection (optional):');
                                                    if (reason !== null) {
                                                        handleJobAction(job.id, 'rejected', reason);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                                Reject
                                            </button>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => {
                                                    const reason = prompt('Reason for flagging:');
                                                    if (reason) {
                                                        handleJobAction(job.id, 'flagged', reason);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-flag"></i>
                                                Flag
                                            </button>
                                        </>
                                    )}

                                    {job.status === 'rejected' && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleJobAction(job.id, 'approved')}
                                        >
                                            <i className="fas fa-undo"></i>
                                            Approve
                                        </button>
                                    )}

                                    {job.status === 'approved' && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                const reason = prompt('Reason for rejection:');
                                                if (reason) {
                                                    handleJobAction(job.id, 'rejected', reason);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-ban"></i>
                                            Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Job Detail Modal */}
                {selectedJob && (
                    <div className="job-modal">
                        <div className="modal-overlay" onClick={() => setSelectedJob(null)}></div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{selectedJob.title}</h2>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedJob(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="job-details">
                                    <div className="detail-section">
                                        <h3>Company Information</h3>
                                        <p><strong>Company:</strong> {selectedJob.company_name}</p>
                                        <p><strong>Location:</strong> {selectedJob.location}</p>
                                        <p><strong>Job Type:</strong> {selectedJob.job_type}</p>
                                        <p><strong>Experience Level:</strong> {selectedJob.experience_level}</p>
                                        {selectedJob.salary && (
                                            <p><strong>Salary:</strong> {selectedJob.salary} ETB</p>
                                        )}
                                    </div>

                                    <div className="detail-section">
                                        <h3>Job Description</h3>
                                        <div className="description-content">
                                            {selectedJob.description}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Posting Information</h3>
                                        <p><strong>Posted:</strong> {formatDate(selectedJob.created_at)}</p>
                                        <p><strong>Status:</strong>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(selectedJob.status), marginLeft: '0.5rem' }}
                                            >
                                                {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                {selectedJob.status === 'pending' && (
                                    <>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleJobAction(selectedJob.id, 'approved')}
                                        >
                                            <i className="fas fa-check"></i>
                                            Approve Job
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                const reason = prompt('Reason for rejection (optional):');
                                                if (reason !== null) {
                                                    handleJobAction(selectedJob.id, 'rejected', reason);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                            Reject Job
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobModeration;