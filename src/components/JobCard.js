import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const handleQuickApply = () => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            // Store the job ID to redirect back after login
            localStorage.setItem('redirectAfterLogin', `/apply/${job.id}`);
            // Redirect to login page
            navigate('/login');
            return;
        }

        const user = JSON.parse(userData);

        // Check user type - only job seekers can apply
        if (user.type !== 'jobseeker') {
            alert(`Only job seekers can apply for jobs. Your account type is: ${user.type}. Please log in with a job seeker account.`);
            // Redirect to login page for job seeker account
            localStorage.setItem('redirectAfterLogin', `/apply/${job.id}`);
            navigate('/login');
            return;
        }

        // If logged in as job seeker, go directly to application page
        navigate(`/apply/${job.id}`);
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

    const getCompanyLogo = (companyName) => {
        // Map real company names to their actual logos
        const companyLogos = {
            'Ethiopian Airlines': '/image/logo6.png',
            'Commercial Bank of Ethiopia': '/image/logo7.png',
            'Ethio Telecom': '/image/logo8.png',
            'Tech Solutions Ethiopia': '/image/logo9.png',
            'Ethiopian Marketing Group': '/image/logo10.png',
            'Ethiopian Construction Corp': '/image/logo11.png',
            'Ethiopian Revenue Authority': '/image/logo12.png'
        };

        // Return specific logo if available
        if (companyLogos[companyName]) {
            return companyLogos[companyName];
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

    return (
        <div className="job-card">
            <div className="job-header">
                <div className="company-logo">
                    <img
                        src={job.company_logo ? `/image/${job.company_logo}` : getCompanyLogo(job.company_name)}
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
                        <button onClick={handleQuickApply} className="btn btn-primary btn-sm">
                            Apply Now
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
                <div className="job-status">
                    {job.is_featured && <span className="featured">Featured</span>}
                    {job.is_urgent && <span className="urgent">Urgent</span>}
                </div>
            </div>
        </div>
    );
};

export default JobCard;