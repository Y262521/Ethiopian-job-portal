import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserApplications } from '../services/api';
import './MyApplications.css';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and is a job seeker
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'jobseeker') {
            navigate('/employer/home');
            return;
        }

        fetchApplications(parsedUser.email);
    }, [navigate]);

    const fetchApplications = async (email) => {
        try {
            console.log('🔍 Fetching applications for user:', email);

            // Try to fetch real applications from API
            const response = await getUserApplications(email);

            console.log('📊 API Response:', response);

            if (response.success && response.applications) {
                console.log('✅ Fetched applications from API:', response.applications.length);
                console.log('📋 Applications data:', response.applications);
                setApplications(response.applications);
            } else {
                console.log('⚠️ No applications found for user');
                setApplications([]);
            }

        } catch (error) {
            console.error('❌ Error fetching applications:', error);

            // If API fails, show empty state instead of sample data
            console.log('ℹ️ API failed, showing empty state');
            setApplications([]);
        } finally {
            setLoading(false);
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
            case 'reviewed': return '#17a2b8';
            case 'shortlisted': return '#28a745';
            case 'rejected': return '#dc3545';
            case 'hired': return '#6f42c1';
            default: return '#6c757d';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return 'fas fa-clock';
            case 'reviewed': return 'fas fa-eye';
            case 'shortlisted': return 'fas fa-check-circle';
            case 'rejected': return 'fas fa-times-circle';
            case 'hired': return 'fas fa-trophy';
            default: return 'fas fa-question-circle';
        }
    };

    if (loading) {
        return (
            <div className="my-applications-page">
                <div className="container">
                    <div className="loading">Loading your applications...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-applications-page">
            <div className="container">
                <div className="applications-header">
                    <h1>My Job Applications</h1>
                    <p>Track the status of your job applications</p>
                </div>

                {applications.length === 0 ? (
                    <div className="no-applications">
                        <i className="fas fa-briefcase"></i>
                        <h3>No Applications Yet</h3>
                        <p>You haven't applied for any jobs yet. Start browsing and applying to see your applications here!</p>
                        <div className="application-tips">
                            <h4>💡 How to apply for jobs:</h4>
                            <ol>
                                <li>Browse available jobs</li>
                                <li>Click on a job you're interested in</li>
                                <li>Click "Apply Now" button</li>
                                <li>Fill out the application form</li>
                                <li>Upload your CV</li>
                                <li>Submit your application</li>
                            </ol>
                            <p><strong>Your applications will appear here in real-time!</strong></p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/jobs')}
                        >
                            <i className="fas fa-search"></i>
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map((application) => (
                            <div key={application.id} className="application-card">
                                <div className="application-header">
                                    <div className="job-info">
                                        <h3>{application.job_title}</h3>
                                        <p className="company-name">{application.company_name}</p>
                                        <div className="job-details">
                                            <span className="location">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {application.location}
                                            </span>
                                            <span className="salary">
                                                <i className="fas fa-money-bill-wave"></i>
                                                {application.salary}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="application-status">
                                        <div
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(application.status) }}
                                        >
                                            <i className={getStatusIcon(application.status)}></i>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </div>
                                    </div>
                                </div>

                                <div className="application-details">
                                    <div className="applied-date">
                                        <i className="fas fa-calendar"></i>
                                        Applied on {formatDate(application.applied_at)}
                                    </div>

                                    {application.response_message && (
                                        <div className="response-message">
                                            <h4>Response from Employer:</h4>
                                            <p>{application.response_message}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="application-actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => navigate(`/job/${application.job_id || application.id}`)}
                                    >
                                        <i className="fas fa-eye"></i>
                                        View Job
                                    </button>

                                    {application.status === 'shortlisted' && (
                                        <button className="btn btn-success">
                                            <i className="fas fa-phone"></i>
                                            Prepare for Interview
                                        </button>
                                    )}

                                    {application.status === 'hired' && (
                                        <button className="btn btn-primary">
                                            <i className="fas fa-handshake"></i>
                                            View Offer Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="application-stats">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{applications.length}</div>
                            <div className="stat-label">Total Applications</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {applications.filter(app => app.status === 'pending').length}
                            </div>
                            <div className="stat-label">Pending</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {applications.filter(app => app.status === 'shortlisted').length}
                            </div>
                            <div className="stat-label">Shortlisted</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {applications.filter(app => app.status === 'hired').length}
                            </div>
                            <div className="stat-label">Hired</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyApplications;