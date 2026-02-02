import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCategories from '../components/JobCategories';
import FeaturedCompanies from '../components/FeaturedCompanies';
import { getUserStats, getEmployerApplications } from '../services/api';
import './EmployerHome.css';

const EmployerHome = () => {
    const [user, setUser] = useState(null);
    const [employerStats, setEmployerStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        viewsThisMonth: 0,
        hiredCandidates: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
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

        setUser(parsedUser);

        // Fetch real employer statistics from API
        fetchEmployerStats(parsedUser.email);

        // Fetch recent applications
        fetchRecentApplications(parsedUser.id);

        setLoading(false);
    }, [navigate]);

    const fetchEmployerStats = async (email) => {
        try {
            console.log('🔍 Fetching employer statistics for:', email);
            const response = await getUserStats(email);
            if (response.success) {
                console.log('✅ Employer stats loaded:', response.stats);
                setEmployerStats(response.stats);
            }
        } catch (error) {
            console.error('❌ Error fetching employer stats:', error);
            // Fallback to default stats if API fails
            setEmployerStats({
                activeJobs: 0,
                totalApplications: 0,
                viewsThisMonth: 0,
                hiredCandidates: 0
            });
        }
    };

    const fetchRecentApplications = async (employerId) => {
        try {
            console.log('🔍 Fetching recent applications for employer:', employerId);
            const response = await getEmployerApplications(employerId);
            if (response.success && response.applications) {
                // Get the 3 most recent applications
                const recent = response.applications.slice(0, 3).map(app => ({
                    id: app.id,
                    candidateName: app.full_name,
                    position: app.job_title,
                    appliedDate: new Date(app.applied_at).toLocaleDateString(),
                    status: app.status
                }));
                console.log('✅ Recent applications loaded:', recent);
                setRecentApplications(recent);
            }
        } catch (error) {
            console.error('❌ Error fetching recent applications:', error);
            setRecentApplications([]);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCompanyName = (name) => {
        return name ? name.split(' ')[0] : 'Employer';
    };

    if (loading) {
        return (
            <div className="employer-home-page">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="employer-home-page">
            {/* Employer Header */}
            <div className="employer-header">
                <div className="container">
                    <div className="welcome-message">
                        <h2>{getGreeting()}, {getCompanyName(user?.name)}!</h2>
                    </div>
                    <div className="employer-actions">
                        <div className="employer-stats">
                            <div className="stat-item">
                                <span className="stat-number">{employerStats.activeJobs}</span>
                                <span className="stat-label">Active Jobs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{employerStats.totalApplications}</span>
                                <span className="stat-label">Applications</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{employerStats.viewsThisMonth}</span>
                                <span className="stat-label">Profile Views</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{employerStats.hiredCandidates}</span>
                                <span className="stat-label">Hired</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Ethiopian Job</h1>
                        <h2>Find the Perfect Talent</h2>

                        <div className="companies-nav">
                            <Link to="/jobs">Browse Talent</Link>
                            <Link to="/companies" className="active">Companies</Link>
                        </div>

                        <SearchBar />

                        <div className="popular-searches">
                            <p>Popular Skills:</p>
                            <div className="search-tags">
                                <Link to="/jobs?category=Technology">Technology</Link>
                                <Link to="/jobs?category=Sales">Sales</Link>
                                <Link to="/jobs?category=Customer Service">Customer Service</Link>
                                <Link to="/jobs?category=Management">Management</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
                <div className="container">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/post-job" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                            <h3>Post New Job</h3>
                            <p>Create and publish a new job listing</p>
                        </Link>

                        <Link to="/employer/applications" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <h3>View Applications</h3>
                            <p>Review candidate applications</p>
                        </Link>

                        <Link to="/employer/jobs" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <h3>Manage Jobs</h3>
                            <p>Edit or close your job postings</p>
                        </Link>

                        <Link to="/pricing" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-credit-card"></i>
                            </div>
                            <h3>Upgrade Plan</h3>
                            <p>View pricing and upgrade options</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Applications */}
            <section className="recent-applications">
                <div className="container">
                    <div className="section-header">
                        <h2>Recent Applications</h2>
                        <Link to="/employer/applications" className="view-all-link">View All</Link>
                    </div>

                    <div className="applications-list">
                        {recentApplications.map(application => (
                            <div key={application.id} className="application-item">
                                <div className="candidate-info">
                                    <div className="candidate-avatar">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div className="candidate-details">
                                        <h4>{application.candidateName}</h4>
                                        <p>Applied for: {application.position}</p>
                                        <span className="applied-date">Applied on {application.appliedDate}</span>
                                    </div>
                                </div>
                                <div className="application-status">
                                    <span className={`status-badge ${application.status}`}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </span>
                                    <Link
                                        to="/employer/applications"
                                        className="btn btn-primary btn-sm"
                                        state={{ highlightApplicationId: application.id }}
                                    >
                                        Review
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Categories */}
            <JobCategories />

            {/* Featured Companies */}
            <FeaturedCompanies />

            {/* Hiring Tips */}
            <section className="hiring-tips">
                <div className="container">
                    <h2>Hiring Tips</h2>
                    <div className="tips-grid">
                        <div className="tip-card">
                            <div className="tip-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>Write Clear Job Descriptions</h3>
                            <p>Be specific about requirements and responsibilities to attract the right candidates.</p>
                        </div>

                        <div className="tip-card">
                            <div className="tip-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <h3>Respond Quickly</h3>
                            <p>Fast response times improve candidate experience and your company reputation.</p>
                        </div>

                        <div className="tip-card">
                            <div className="tip-icon">
                                <i className="fas fa-star"></i>
                            </div>
                            <h3>Highlight Company Culture</h3>
                            <p>Showcase your work environment and values to attract cultural fits.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section for Employers */}
            <section className="steps-section">
                <div className="container">
                    <h2>How to Hire Successfully</h2>
                    <div className="steps-grid">
                        <div className="step">
                            <div className="icon">📝</div>
                            <div className="content">
                                <h3>Post Jobs</h3>
                                <p>Create detailed job postings to attract qualified candidates.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="icon">👥</div>
                            <div className="content">
                                <h3>Review Applications</h3>
                                <p>Screen candidates and shortlist the best matches.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="icon">🤝</div>
                            <div className="content">
                                <h3>Hire & Onboard</h3>
                                <p>Make offers and welcome new team members.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmployerHome;