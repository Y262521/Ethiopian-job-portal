import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCategories from '../components/JobCategories';
import FeaturedCompanies from '../components/FeaturedCompanies';
import './Admin.css';

const Admin = () => {
    return (
        <div className="admin-page">
            <div className="container">
                {/* Admin Greeting Section */}
                <div className="admin-greeting">
                    <div className="greeting-content">
                        <h2 className="greeting-text">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Administrator!
                        </h2>
                    </div>
                </div>

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage and monitor the Ethiopia Job Portal</p>
                    <div className="dashboard-button-container">
                        <Link to="/admin/dashboard" className="dashboard-btn">
                            <i className="fas fa-tachometer-alt"></i>
                            Go to Admin Dashboard
                        </Link>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1>Ethiopian Job</h1>
                            <h2>Platform Administration</h2>

                            <div className="companies-nav">
                                <Link to="/jobs">Jobs</Link>
                                <Link to="/companies">Companies</Link>
                                <Link to="/admin" className="active">Admin</Link>
                            </div>

                            <SearchBar />

                            <div className="popular-searches">
                                <p>Quick Admin Actions:</p>
                                <div className="search-tags">
                                    <Link to="/admin/user-management">Manage Users</Link>
                                    <Link to="/admin/job-moderation">Manage Jobs</Link>
                                    <Link to="/admin/analytics">Analytics</Link>
                                    <Link to="/admin/notifications">Notifications</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Administration Tools */}
                <div className="admin-tools">
                    <h2>Administration Tools</h2>
                    <div className="tools-grid">
                        <Link to="/admin/user-management" className="tool-card">
                            <div className="tool-icon">
                                <i className="fas fa-users-cog"></i>
                            </div>
                            <div className="tool-content">
                                <h3>User Management</h3>
                                <p>Approve users, suspend accounts, and manage user data</p>
                                <span className="tool-badge">Manage Users</span>
                            </div>
                        </Link>

                        <Link to="/admin/job-moderation" className="tool-card">
                            <div className="tool-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <div className="tool-content">
                                <h3>Job Moderation</h3>
                                <p>Review and moderate job postings</p>
                                <span className="tool-badge">Active</span>
                            </div>
                        </Link>

                        <Link to="/admin/analytics" className="tool-card">
                            <div className="tool-icon">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <div className="tool-content">
                                <h3>Analytics Dashboard</h3>
                                <p>View platform statistics and performance metrics</p>
                                <span className="tool-badge">Live Data</span>
                            </div>
                        </Link>

                        <Link to="/admin/notifications" className="tool-card">
                            <div className="tool-icon">
                                <i className="fas fa-bell"></i>
                            </div>
                            <div className="tool-content">
                                <h3>Notification System</h3>
                                <p>Send notifications to users and manage alerts</p>
                                <span className="tool-badge">Ready</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Job Categories */}
                <JobCategories />

                {/* Featured Companies */}
                <FeaturedCompanies />

                {/* Admin Steps Section */}
                <section className="steps-section">
                    <div className="container">
                        <h2>Platform Management</h2>
                        <div className="steps-grid">
                            <div className="step">
                                <div className="icon">👥</div>
                                <div className="content">
                                    <h3>User Management</h3>
                                    <p>Approve and manage job seekers and employers.</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="icon">📊</div>
                                <div className="content">
                                    <h3>Analytics & Reports</h3>
                                    <p>Monitor platform performance and user activity.</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="icon">⚙️</div>
                                <div className="content">
                                    <h3>System Settings</h3>
                                    <p>Configure platform settings and preferences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;