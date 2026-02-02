import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobAlerts, createJobAlert, updateJobAlert, deleteJobAlert, toggleJobAlert } from '../services/api';
import './JobAlerts.css';

const JobAlerts = () => {
    const [jobAlerts, setJobAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAlert, setEditingAlert] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        keywords: '',
        location: '',
        category: '',
        jobType: '',
        experienceLevel: '',
        salaryMin: '',
        salaryMax: '',
        emailFrequency: 'daily'
    });
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
            alert('Only job seekers can access job alerts.');
            navigate('/');
            return;
        }

        setUser(parsedUser);
        fetchJobAlerts(parsedUser.email);
    }, [navigate]);

    const fetchJobAlerts = async (email) => {
        try {
            setLoading(true);
            const response = await getJobAlerts(email);
            if (response.success) {
                setJobAlerts(response.jobAlerts);
            }
        } catch (error) {
            console.error('Error fetching job alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            keywords: '',
            location: '',
            category: '',
            jobType: '',
            experienceLevel: '',
            salaryMin: '',
            salaryMax: '',
            emailFrequency: 'daily'
        });
        setEditingAlert(null);
        setShowCreateForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const alertData = {
                ...formData,
                email: user.email
            };

            if (editingAlert) {
                // Update existing alert
                const response = await updateJobAlert(editingAlert.id, alertData);
                if (response.success) {
                    alert('Job alert updated successfully!');
                    fetchJobAlerts(user.email);
                    resetForm();
                }
            } else {
                // Create new alert
                const response = await createJobAlert(alertData);
                if (response.success) {
                    alert('Job alert created successfully!');
                    fetchJobAlerts(user.email);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving job alert:', error);
            alert('Failed to save job alert. Please try again.');
        }
    };

    const handleEdit = (alert) => {
        setFormData({
            title: alert.title || '',
            keywords: alert.keywords || '',
            location: alert.location || '',
            category: alert.category || '',
            jobType: alert.job_type || '',
            experienceLevel: alert.experience_level || '',
            salaryMin: alert.salary_min || '',
            salaryMax: alert.salary_max || '',
            emailFrequency: alert.email_frequency || 'daily'
        });
        setEditingAlert(alert);
        setShowCreateForm(true);
    };

    const handleDelete = async (alertId) => {
        if (!user) return;

        if (window.confirm('Are you sure you want to delete this job alert?')) {
            try {
                const response = await deleteJobAlert(alertId, user.email);
                if (response.success) {
                    alert('Job alert deleted successfully!');
                    fetchJobAlerts(user.email);
                }
            } catch (error) {
                console.error('Error deleting job alert:', error);
                alert('Failed to delete job alert. Please try again.');
            }
        }
    };

    const handleToggle = async (alertId) => {
        if (!user) return;

        try {
            const response = await toggleJobAlert(alertId, user.email);
            if (response.success) {
                fetchJobAlerts(user.email);
            }
        } catch (error) {
            console.error('Error toggling job alert:', error);
            alert('Failed to toggle job alert. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="job-alerts-page">
                <div className="container">
                    <div className="loading">Loading job alerts...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="job-alerts-page">
            <div className="container">
                <div className="page-header">
                    <h1>Job Alerts</h1>
                    <p>Get notified when new jobs match your criteria</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus"></i>
                        Create New Alert
                    </button>
                </div>

                {showCreateForm && (
                    <div className="alert-form-modal">
                        <div className="modal-overlay" onClick={resetForm}></div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}</h2>
                                <button onClick={resetForm} className="close-btn">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="alert-form">
                                <div className="form-group">
                                    <label htmlFor="title">Alert Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Software Developer Jobs in Addis Ababa"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="keywords">Keywords</label>
                                        <input
                                            type="text"
                                            id="keywords"
                                            name="keywords"
                                            value={formData.keywords}
                                            onChange={handleInputChange}
                                            placeholder="e.g., React, JavaScript, Node.js"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Addis Ababa"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="category">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Any Category</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Customer Service">Customer Service</option>
                                            <option value="Management">Management</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="jobType">Job Type</label>
                                        <select
                                            id="jobType"
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Any Type</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="experienceLevel">Experience Level</label>
                                        <select
                                            id="experienceLevel"
                                            name="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Any Level</option>
                                            <option value="Entry-level">Entry-level</option>
                                            <option value="Mid-level">Mid-level</option>
                                            <option value="Senior">Senior</option>
                                            <option value="Executive">Executive</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="emailFrequency">Email Frequency</label>
                                        <select
                                            id="emailFrequency"
                                            name="emailFrequency"
                                            value={formData.emailFrequency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="salaryMin">Minimum Salary (ETB)</label>
                                        <input
                                            type="number"
                                            id="salaryMin"
                                            name="salaryMin"
                                            value={formData.salaryMin}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 15000"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="salaryMax">Maximum Salary (ETB)</label>
                                        <input
                                            type="number"
                                            id="salaryMax"
                                            name="salaryMax"
                                            value={formData.salaryMax}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 50000"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={resetForm} className="btn btn-outline">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingAlert ? 'Update Alert' : 'Create Alert'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {jobAlerts.length > 0 ? (
                    <div className="alerts-grid">
                        {jobAlerts.map((alert) => (
                            <div key={alert.id} className={`alert-card ${!alert.is_active ? 'inactive' : ''}`}>
                                <div className="alert-header">
                                    <h3>{alert.title}</h3>
                                    <div className="alert-actions">
                                        <button
                                            onClick={() => handleToggle(alert.id)}
                                            className={`toggle-btn ${alert.is_active ? 'active' : 'inactive'}`}
                                            title={alert.is_active ? 'Deactivate alert' : 'Activate alert'}
                                        >
                                            <i className={`fas ${alert.is_active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(alert)}
                                            className="btn btn-outline btn-sm"
                                            title="Edit alert"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(alert.id)}
                                            className="btn btn-danger btn-sm"
                                            title="Delete alert"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="alert-details">
                                    {alert.keywords && (
                                        <div className="detail-item">
                                            <strong>Keywords:</strong> {alert.keywords}
                                        </div>
                                    )}
                                    {alert.location && (
                                        <div className="detail-item">
                                            <strong>Location:</strong> {alert.location}
                                        </div>
                                    )}
                                    {alert.category && (
                                        <div className="detail-item">
                                            <strong>Category:</strong> {alert.category}
                                        </div>
                                    )}
                                    {alert.job_type && (
                                        <div className="detail-item">
                                            <strong>Job Type:</strong> {alert.job_type}
                                        </div>
                                    )}
                                    {alert.experience_level && (
                                        <div className="detail-item">
                                            <strong>Experience:</strong> {alert.experience_level}
                                        </div>
                                    )}
                                    {(alert.salary_min || alert.salary_max) && (
                                        <div className="detail-item">
                                            <strong>Salary Range:</strong>
                                            {alert.salary_min && ` ${alert.salary_min} ETB`}
                                            {alert.salary_min && alert.salary_max && ' - '}
                                            {alert.salary_max && `${alert.salary_max} ETB`}
                                        </div>
                                    )}
                                </div>

                                <div className="alert-footer">
                                    <div className="alert-status">
                                        <span className={`status-badge ${alert.is_active ? 'active' : 'inactive'}`}>
                                            {alert.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="frequency">
                                            {alert.email_frequency} notifications
                                        </span>
                                    </div>
                                    <div className="alert-date">
                                        Created {formatDate(alert.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-alerts">
                        <div className="empty-state">
                            <i className="fas fa-bell"></i>
                            <h3>No Job Alerts</h3>
                            <p>Create your first job alert to get notified when new opportunities match your criteria!</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                            >
                                Create Your First Alert
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobAlerts;