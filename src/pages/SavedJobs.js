import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedJobs, removeSavedJob } from '../services/api';
import './SavedJobs.css';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'jobseeker') {
            alert('Only job seekers can access saved jobs.');
            navigate('/');
            return;
        }

        setUser(parsedUser);
        fetchSavedJobs(parsedUser.email);
    }, [navigate]);

    const fetchSavedJobs = async (email) => {
        try {
            setLoading(true);
            const response = await getSavedJobs(email);
            if (response.success) {
                setSavedJobs(response.savedJobs);
            }
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveJob = async (jobId) => {
        if (!user) return;

        if (window.confirm('Are you sure you want to remove this job from your saved list?')) {
            try {
                const response = await removeSavedJob(user.email, jobId);
                if (response.success) {
                    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
                    alert('Job removed from saved list!');
                }
            } catch (error) {
                console.error('Error removing saved job:', error);
                alert('Failed to remove job. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    const getCompanyLogo = (companyName, logo) => {
        if (logo) {
            return `/image/${logo}`;
        }

        // Generate a unique color based on company name for fallback
        const colors = ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];
        const colorIndex = companyName.length % colors.length;
        const color = colors[colorIndex];

        // Get first letter of company name
        const firstLetter = companyName.charAt(0).toUpperCase();

        return `data:image/svg+xml;base64,${btoa(`
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" rx="10" fill="${color}"/>
                <text x="40" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
            </svg>
        `)}`;
    };

    if (loading) {
        return (
            <div className="saved-jobs-page">
                <div className="container">
                    <div className="loading">Loading saved jobs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-jobs-page">
            <div className="container">
                <div className="page-header">
                    <h1>Saved Jobs</h1>
                    <p>Jobs you've saved for later review</p>
                </div>

                {savedJobs.length > 0 ? (
                    <div className="saved-jobs-grid">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="saved-job-card">
                                <div className="job-header">
                                    <div className="company-logo">
                                        <img
                                            src={getCompanyLogo(job.company_name, job.logo)}
                                            alt={job.company_name}
                                            onError={(e) => {
                                                e.target.src = getCompanyLogo(job.company_name);
                                            }}
                                        />
                                    </div>
                                    <div className="job-info">
                                        <h3 className="job-title">
                                            <Link to={`/job/${job.id}`}>{job.title}</Link>
                                        </h3>
                                        <p className="company-name">{job.company_name}</p>
                                        <div className="job-meta">
                                            <span className="location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {job.location}
                                            </span>
                                            <span className="job-type">
                                                <i className="fas fa-briefcase"></i>
                                                {job.job_type}
                                            </span>
                                            <span className="posted-date">
                                                <i className="fas fa-clock"></i>
                                                {formatDate(job.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="job-actions">
                                        {job.salary && (
                                            <div className="salary">
                                                <i className="fas fa-dollar-sign"></i>
                                                {job.salary}
                                            </div>
                                        )}
                                        <div className="action-buttons">
                                            <Link to={`/job/${job.id}`} className="btn btn-outline btn-sm">
                                                View Details
                                            </Link>
                                            <Link to={`/apply/${job.id}`} className="btn btn-primary btn-sm">
                                                Apply Now
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveJob(job.id)}
                                                className="btn btn-danger btn-sm"
                                                title="Remove from saved jobs"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-description">
                                    <p>{job.description?.substring(0, 200)}...</p>
                                </div>

                                <div className="job-footer">
                                    <div className="job-tags">
                                        {job.category && (
                                            <span className="tag">{job.category}</span>
                                        )}
                                        {job.experience_level && (
                                            <span className="tag">{job.experience_level}</span>
                                        )}
                                    </div>
                                    <div className="saved-date">
                                        <i className="fas fa-heart"></i>
                                        Saved {formatDate(job.saved_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-saved-jobs">
                        <div className="empty-state">
                            <i className="fas fa-heart"></i>
                            <h3>No Saved Jobs</h3>
                            <p>You haven't saved any jobs yet. Start browsing and save jobs that interest you!</p>
                            <Link to="/jobs" className="btn btn-primary">
                                Browse Jobs
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;