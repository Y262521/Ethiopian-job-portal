import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCategories from '../components/JobCategories';
import FeaturedCompanies from '../components/FeaturedCompanies';
import { fetchJobs } from '../services/api';
import './UserHome.css';

const UserHome = () => {
    const [user, setUser] = useState(null);
    const [userStats, setUserStats] = useState({
        applications: 0,
        savedJobs: 0,
        profileViews: 0,
        profileCompletion: 25
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Simulate user stats (in real app, fetch from API)
        setUserStats({
            applications: Math.floor(Math.random() * 10),
            savedJobs: Math.floor(Math.random() * 20),
            profileViews: Math.floor(Math.random() * 50),
            profileCompletion: parsedUser.profileCompletion || 25
        });

        // Fetch recent jobs
        fetchRecentJobs();
    }, [navigate]);

    const fetchRecentJobs = async () => {
        try {
            const response = await fetchJobs({ limit: 6 });
            setRecentJobs(response.jobs || []);
        } catch (error) {
            console.error('Error fetching recent jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getFirstName = (fullName) => {
        if (!fullName) return 'User';
        return fullName.split(' ')[0];
    };

    if (loading) {
        return (
            <div className="user-home">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-home">
            {/* User Header */}
            <div className="user-header">
                <div className="container">
                    <div className="welcome-message">
                        <h2>{getGreeting()}, {getFirstName(user?.name)}!</h2>
                        <p>Find your next opportunity • {user?.type === 'jobseeker' ? 'Job Seeker' : 'Employer'}</p>
                    </div>
                    <div className="user-actions">
                        <div className="user-stats">
                            <div className="stat-item">
                                <span className="stat-number">{userStats.applications}</span>
                                <span className="stat-label">Applications</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{userStats.savedJobs}</span>
                                <span className="stat-label">Saved Jobs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{userStats.profileViews}</span>
                                <span className="stat-label">Profile Views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Ethiopia Job</h1>
                        <h2>Unlock Your Career Potential</h2>

                        <div className="companies-nav">
                            <Link to="/jobs" className="active">Browse Jobs</Link>
                            <Link to="/companies">Explore Companies</Link>
                        </div>

                        <SearchBar />

                        <div className="popular-searches">
                            <p>Popular Searches:
                                <Link to="/jobs?category=Technology">Technology</Link>
                                <Link to="/jobs?category=Sales">Sales</Link>
                                <Link to="/jobs?category=Customer Service">Customer Service</Link>
                                <Link to="/jobs?category=Management">Management</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
                <div className="container">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/user/profile" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-user"></i>
                            </div>
                            <h3>Update Profile</h3>
                            <p>Complete your profile to attract employers</p>
                        </Link>

                        <Link to="/jobs" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3>Browse Jobs</h3>
                            <p>Find your next opportunity</p>
                        </Link>

                        <Link to="/user/applications" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <h3>My Applications</h3>
                            <p>Track your job applications</p>
                        </Link>

                        <Link to="/user/saved-jobs" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h3>Saved Jobs</h3>
                            <p>View your saved positions</p>
                        </Link>

                        <Link to="/user/job-alerts" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-bell"></i>
                            </div>
                            <h3>Job Alerts</h3>
                            <p>Set up personalized job notifications</p>
                        </Link>

                        <Link to="/user/cv-builder" className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-file-pdf"></i>
                            </div>
                            <h3>CV Builder</h3>
                            <p>Create a professional resume</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Jobs */}
            <section className="recent-jobs">
                <div className="container">
                    <div className="section-header">
                        <h2>Latest Job Opportunities</h2>
                        <Link to="/jobs" className="view-all-btn">View All Jobs</Link>
                    </div>

                    {recentJobs.length > 0 ? (
                        <div className="jobs-grid">
                            {recentJobs.map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="job-header">
                                        <h3>{job.title}</h3>
                                        <div className="job-badges">
                                            {job.is_featured && <span className="badge featured">Featured</span>}
                                            {job.is_urgent && <span className="badge urgent">Urgent</span>}
                                        </div>
                                    </div>
                                    <p className="company-name">
                                        <i className="fas fa-building"></i>
                                        Company ID: {job.employer_id}
                                    </p>
                                    <p className="job-location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {job.location}
                                    </p>
                                    <p className="job-type">
                                        <i className="fas fa-clock"></i>
                                        {job.job_type} • {job.experience_level}
                                    </p>
                                    {job.salary && (
                                        <p className="job-salary">
                                            <i className="fas fa-money-bill-wave"></i>
                                            {job.salary}
                                        </p>
                                    )}
                                    <div className="job-actions">
                                        <Link to={`/job/${job.id}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                        <button className="btn btn-outline save-btn">
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-jobs">
                            <i className="fas fa-briefcase"></i>
                            <p>No jobs available at the moment. Check back later!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Job Categories */}
            <JobCategories />

            {/* Featured Companies */}
            <FeaturedCompanies />

            {/* Recent Activity */}
            <section className="recent-activity">
                <div className="container">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="activity-content">
                                <h4>Welcome to Ethiopia Job, {getFirstName(user?.name)}!</h4>
                                <p>Your account has been created successfully. Complete your profile to get started.</p>
                                <span className="activity-time">Just now</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <div className="activity-content">
                                <h4>Getting Started Tips</h4>
                                <p>Upload your CV and set up job alerts to maximize your opportunities.</p>
                                <span className="activity-time">Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Completion */}
            <section className="profile-completion">
                <div className="container">
                    <div className="completion-card">
                        <div className="completion-header">
                            <h3>Complete Your Profile</h3>
                            <div className="progress-circle">
                                <span>{userStats.profileCompletion}%</span>
                            </div>
                        </div>
                        <p>A complete profile increases your chances of being found by employers.</p>
                        <div className="completion-steps">
                            <div className="step completed">
                                <i className="fas fa-check"></i>
                                <span>Basic Information</span>
                            </div>
                            <div className="step">
                                <i className="fas fa-circle"></i>
                                <span>Upload CV/Resume</span>
                            </div>
                            <div className="step">
                                <i className="fas fa-circle"></i>
                                <span>Add Skills & Experience</span>
                            </div>
                            <div className="step">
                                <i className="fas fa-circle"></i>
                                <span>Set Job Preferences</span>
                            </div>
                        </div>
                        <Link to="/user/profile" className="btn btn-primary">
                            Complete Profile
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserHome;