import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getEmployerApplications, updateApplicationStatus as updateAppStatus } from '../services/api';
import './EmployerApplications.css';

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [user, setUser] = useState(null);
    const [highlightedApplicationId, setHighlightedApplicationId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Check if we need to highlight a specific application
        if (location.state?.highlightApplicationId) {
            setHighlightedApplicationId(location.state.highlightApplicationId);
            // Clear the highlight after 3 seconds
            setTimeout(() => {
                setHighlightedApplicationId(null);
            }, 3000);
        }

        // Get user data
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                fetchApplications(parsedUser.id);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, [location.state]);

    const fetchApplications = async (employerId) => {
        try {
            const result = await getEmployerApplications(employerId);

            if (result.success) {
                setApplications(result.applications);
            } else {
                console.error('Failed to fetch applications:', result.error);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, status, message = '') => {
        try {
            const result = await updateAppStatus(applicationId, status, message);

            if (result.success) {
                // Update the application in the list
                setApplications(prev =>
                    prev.map(app =>
                        app.id === applicationId
                            ? { ...app, status, response_message: message }
                            : app
                    )
                );
                alert('Application status updated successfully!');
            } else {
                alert('Failed to update application status');
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Failed to update application status');
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

    const downloadCV = async (cvPath, applicantName) => {
        try {
            // Extract filename from the full path - handle both Windows and Unix separators
            const filename = cvPath.split(/[/\\]/).pop();
            console.log('Downloading CV:', filename);
            console.log('Full CV path:', cvPath);

            // Get auth token for the request
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Create direct download URL using the applications route
            const downloadUrl = `http://localhost:5000/api/applications/download-cv/${filename}`;
            console.log('Download URL:', downloadUrl);

            // Fetch the file with authentication
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('CV file not found');
                } else if (response.status === 401) {
                    throw new Error('Authentication failed');
                } else if (response.status === 403) {
                    throw new Error('You do not have permission to access this CV');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            // Get the blob
            const blob = await response.blob();
            console.log('Blob size:', blob.size);

            if (blob.size === 0) {
                throw new Error('CV file is empty');
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${applicantName}_CV.${filename.split('.').pop()}`;

            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(url);

            console.log('Download completed successfully');

        } catch (error) {
            console.error('Error downloading CV:', error);
            alert(`Failed to download CV: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="employer-applications">
                <div className="loading">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="employer-applications">
            <div className="container">
                <div className="applications-header">
                    <h2>Job Applications</h2>
                    <p>Manage applications for your job postings</p>
                </div>

                {applications.length === 0 ? (
                    <div className="no-applications">
                        <i className="fas fa-inbox"></i>
                        <h3>No Applications Yet</h3>
                        <p>Applications for your job postings will appear here.</p>
                    </div>
                ) : (
                    <div className="applications-by-job">
                        {/* Group applications by job title */}
                        {Object.entries(
                            applications.reduce((groups, application) => {
                                const jobTitle = application.job_title || 'Unknown Job';
                                if (!groups[jobTitle]) {
                                    groups[jobTitle] = [];
                                }
                                groups[jobTitle].push(application);
                                return groups;
                            }, {})
                        ).map(([jobTitle, jobApplications]) => (
                            <div key={jobTitle} className="job-applications-group">
                                <div className="job-group-header">
                                    <h2>{jobTitle}</h2>
                                    <span className="application-count">
                                        {jobApplications.length} application{jobApplications.length > 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="applications-grid">
                                    {jobApplications.map((application) => (
                                        <div
                                            key={application.id}
                                            className={`application-card ${highlightedApplicationId === application.id ? 'highlighted' : ''
                                                }`}
                                        >
                                            <div className="application-header">
                                                <div className="applicant-info">
                                                    <h3>{application.full_name}</h3>
                                                    <p className="application-date">Applied: {formatDate(application.applied_at)}</p>
                                                </div>
                                                <div
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(application.status) }}
                                                >
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </div>
                                            </div>

                                            <div className="application-details">
                                                <div className="detail-item">
                                                    <i className="fas fa-envelope"></i>
                                                    <span>{application.email}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <i className="fas fa-phone"></i>
                                                    <span>{application.phone}</span>
                                                </div>
                                                {application.expected_salary && (
                                                    <div className="detail-item">
                                                        <i className="fas fa-money-bill-wave"></i>
                                                        <span>Expected: {application.expected_salary} ETB</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="application-preview">
                                                <h4>Cover Letter:</h4>
                                                <p>{application.cover_letter.substring(0, 150)}...</p>
                                            </div>

                                            <div className="application-actions">
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={() => setSelectedApplication(application)}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                    View Details
                                                </button>

                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => downloadCV(application.cv_file_path, application.full_name)}
                                                >
                                                    <i className="fas fa-download"></i>
                                                    Download CV
                                                </button>

                                                <div className="status-actions">
                                                    {application.status === 'pending' && (
                                                        <>
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                                                            >
                                                                <i className="fas fa-check"></i>
                                                                Shortlist
                                                            </button>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {application.status === 'shortlisted' && (
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => updateApplicationStatus(application.id, 'hired')}
                                                        >
                                                            <i className="fas fa-user-check"></i>
                                                            Hire
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Application Detail Modal */}
                {selectedApplication && (
                    <div className="application-modal">
                        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}></div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{selectedApplication.full_name}</h2>
                                <p>Application for: {selectedApplication.job_title}</p>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedApplication(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="applicant-details">
                                    <h3>Contact Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <strong>Email:</strong>
                                            <span>{selectedApplication.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Phone:</strong>
                                            <span>{selectedApplication.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Expected Salary:</strong>
                                            <span>{selectedApplication.expected_salary || 'Not specified'} ETB</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Available From:</strong>
                                            <span>{selectedApplication.available_start_date || 'Immediately'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="experience-section">
                                    <h3>Experience</h3>
                                    <p>{selectedApplication.experience}</p>
                                </div>

                                <div className="cover-letter-section">
                                    <h3>Cover Letter</h3>
                                    <p>{selectedApplication.cover_letter}</p>
                                </div>

                                {selectedApplication.additional_info && (
                                    <div className="additional-info-section">
                                        <h3>Additional Information</h3>
                                        <p>{selectedApplication.additional_info}</p>
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => downloadCV(selectedApplication.cv_file_path, selectedApplication.full_name)}
                                >
                                    <i className="fas fa-download"></i>
                                    Download CV
                                </button>

                                <div className="status-actions">
                                    {selectedApplication.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => {
                                                    updateApplicationStatus(selectedApplication.id, 'shortlisted');
                                                    setSelectedApplication(null);
                                                }}
                                            >
                                                <i className="fas fa-check"></i>
                                                Shortlist
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    updateApplicationStatus(selectedApplication.id, 'rejected');
                                                    setSelectedApplication(null);
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {selectedApplication.status === 'shortlisted' && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                updateApplicationStatus(selectedApplication.id, 'hired');
                                                setSelectedApplication(null);
                                            }}
                                        >
                                            <i className="fas fa-user-check"></i>
                                            Hire
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;