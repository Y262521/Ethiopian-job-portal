import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Add click handlers for admin tools
    const handleToolClick = (toolName) => {
        switch (toolName) {
            case 'approve-users':
                navigate('/admin/user-management');
                break;
            case 'moderate-jobs':
                navigate('/admin/job-moderation');
                break;
            case 'revenue-reports':
                alert('Revenue reports feature coming soon!');
                break;
            case 'pricing-settings':
                navigate('/pricing');
                break;
            case 'suspend-users':
                navigate('/admin/user-management');
                break;
            case 'send-notifications':
                navigate('/admin/notifications');
                break;
            case 'verify-companies':
                alert('Company verification feature coming soon!');
                break;
            case 'feature-content':
                alert('Content featuring system coming soon!');
                break;
            case 'database-backup':
                navigate('/admin/database');
                break;
            case 'security-settings':
                alert('Security settings panel coming soon!');
                break;
            case 'system-alerts':
                alert('System alerts dashboard coming soon!');
                break;
            case 'analytics':
                navigate('/admin/analytics');
                break;
            default:
                alert('Feature coming soon!');
        }
    };

    useEffect(() => {
        // Check if admin is logged in
        const userData = localStorage.getItem('user');

        if (!userData) {
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.type !== 'admin') {
                navigate('/login');
                return;
            }
            setAdmin(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
            return;
        }

        setLoading(false);
    }, [navigate]);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Admin Header */}
            <div className="admin-header">
                <div className="container">
                    <div className="admin-welcome">
                        <div className="admin-avatar">
                            <i className="fas fa-user-shield"></i>
                        </div>
                        <div className="admin-info">
                            <h2>Welcome, {admin?.name || admin?.username || 'Administrator'}!</h2>
                            <p>Ethiopia Job Administration Panel</p>
                        </div>
                    </div>
                    <div className="admin-actions">
                        <button
                            onClick={() => navigate('/admin/database')}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-database"></i>
                            Database Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="admin-stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-content">
                                <h3>User Management</h3>
                                <p>Manage job seekers and employers</p>
                                <button
                                    className="stat-btn"
                                    onClick={() => navigate('/admin/user-management')}
                                >
                                    View Users
                                </button>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Payment Management</h3>
                                <p>Approve payments and track revenue</p>
                                <button
                                    className="stat-btn"
                                    onClick={() => navigate('/admin/payments')}
                                >
                                    Manage Payments
                                </button>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Job Management</h3>
                                <p>Monitor and moderate job postings</p>
                                <button
                                    className="stat-btn"
                                    onClick={() => navigate('/admin/jobs')}
                                >
                                    View All Jobs
                                </button>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Analytics</h3>
                                <p>View platform statistics and reports</p>
                                <button
                                    className="stat-btn"
                                    onClick={() => handleToolClick('analytics')}
                                >
                                    View Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Tools */}
            <div className="admin-tools">
                <div className="container">
                    <h2>Administration Tools</h2>

                    <div className="tools-grid">
                        <div className="tool-section">
                            <h3>💰 Revenue Management</h3>
                            <div className="tool-buttons">
                                <button
                                    className="tool-btn"
                                    onClick={() => navigate('/admin/database')}
                                >
                                    <i className="fas fa-eye"></i>
                                    View Database Dashboard
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('revenue-reports')}
                                >
                                    <i className="fas fa-chart-line"></i>
                                    Revenue Reports
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('pricing-settings')}
                                >
                                    <i className="fas fa-cog"></i>
                                    Pricing Settings
                                </button>
                            </div>
                        </div>

                        <div className="tool-section">
                            <h3>👥 User Management</h3>
                            <div className="tool-buttons">
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('approve-users')}
                                >
                                    <i className="fas fa-user-check"></i>
                                    Approve Users
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('suspend-users')}
                                >
                                    <i className="fas fa-ban"></i>
                                    Suspend Users
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('send-notifications')}
                                >
                                    <i className="fas fa-envelope"></i>
                                    Send Notifications
                                </button>
                            </div>
                        </div>

                        <div className="tool-section">
                            <h3>🏢 Content Management</h3>
                            <div className="tool-buttons">
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('moderate-jobs')}
                                >
                                    <i className="fas fa-briefcase"></i>
                                    Moderate Jobs
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('verify-companies')}
                                >
                                    <i className="fas fa-building"></i>
                                    Verify Companies
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('feature-content')}
                                >
                                    <i className="fas fa-star"></i>
                                    Feature Content
                                </button>
                            </div>
                        </div>

                        <div className="tool-section">
                            <h3>⚙️ System Settings</h3>
                            <div className="tool-buttons">
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('database-backup')}
                                >
                                    <i className="fas fa-database"></i>
                                    Database Backup
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('security-settings')}
                                >
                                    <i className="fas fa-shield-alt"></i>
                                    Security Settings
                                </button>
                                <button
                                    className="tool-btn"
                                    onClick={() => handleToolClick('system-alerts')}
                                >
                                    <i className="fas fa-bell"></i>
                                    System Alerts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="quick-access">
                <div className="container">
                    <h2>Quick Access</h2>
                    <div className="access-links">
                        <a
                            href="/admin/database"
                            className="access-link"
                        >
                            <i className="fas fa-database"></i>
                            Database Dashboard
                        </a>
                        <a href="/" className="access-link">
                            <i className="fas fa-home"></i>
                            Main Website
                        </a>
                        <a href="/pricing" className="access-link">
                            <i className="fas fa-tags"></i>
                            Pricing Plans
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;