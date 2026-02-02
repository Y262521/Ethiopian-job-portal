import React, { useState } from 'react';
import { submitJobApplication } from '../services/api';
import './JobApplication.css';

const JobApplication = ({ job, onClose, onSubmit, isPage = false }) => {
    // Get user data from localStorage to pre-fill form
    const getUserData = () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                return {
                    fullName: parsedUser.name || '',
                    email: parsedUser.email || '',
                    phone: parsedUser.phone || ''
                };
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
        return { fullName: '', email: '', phone: '' };
    };

    const userData = getUserData();

    const [formData, setFormData] = useState({
        coverLetter: '',
        cvFile: null,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        experience: '',
        expectedSalary: '',
        availableStartDate: '',
        additionalInfo: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    cvFile: 'Please upload a PDF or Word document'
                }));
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    cvFile: 'File size must be less than 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                cvFile: file
            }));
            setErrors(prev => ({
                ...prev,
                cvFile: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = 'Cover letter is required';
        } else if (formData.coverLetter.trim().length < 100) {
            newErrors.coverLetter = 'Cover letter must be at least 100 characters';
        }

        if (!formData.cvFile) {
            newErrors.cvFile = 'CV/Resume is required';
        }

        if (!formData.experience.trim()) {
            newErrors.experience = 'Experience information is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file upload
            const applicationData = new FormData();
            applicationData.append('jobId', job.id);
            applicationData.append('fullName', formData.fullName);
            applicationData.append('email', formData.email);
            applicationData.append('phone', formData.phone);
            applicationData.append('coverLetter', formData.coverLetter);
            applicationData.append('experience', formData.experience);
            applicationData.append('expectedSalary', formData.expectedSalary);
            applicationData.append('availableStartDate', formData.availableStartDate);
            applicationData.append('additionalInfo', formData.additionalInfo);

            if (formData.cvFile) {
                applicationData.append('cvFile', formData.cvFile);
            }

            // Debug logging
            console.log('Submitting application data:');
            console.log('Job ID:', job.id);
            console.log('User Email:', formData.email);
            console.log('Full Name:', formData.fullName);
            for (let [key, value] of applicationData.entries()) {
                console.log(`${key}:`, value);
            }

            // Submit application to backend using API service
            const result = await submitJobApplication(applicationData);

            if (result.success) {
                // Call parent component's submit handler
                onSubmit({
                    ...formData,
                    jobId: job.id,
                    jobTitle: job.title,
                    company: job.company,
                    applicationId: result.application.id
                });

                // Show success message
                alert('Application submitted successfully! You will receive a confirmation email shortly.');
                onClose();
            } else {
                throw new Error(result.error || 'Failed to submit application');
            }

        } catch (error) {
            console.error('Error submitting application:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = 'Failed to submit application. Please try again.';

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.details) {
                // Handle validation errors
                const validationErrors = error.response.data.details.map(detail => `${detail.path}: ${detail.msg}`).join('\n');
                errorMessage = `Validation failed:\n${validationErrors}`;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please check your connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(`Failed to submit application: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`job-application-modal ${isPage ? 'page-mode' : ''}`}>
            {!isPage && <div className="modal-overlay" onClick={onClose}></div>}
            <div className="modal-content">
                {!isPage && (
                    <div className="modal-header">
                        <h2>Apply for {job.title}</h2>
                        <p className="company-name">{job.company}</p>
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-section">
                        <h3>Personal Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={errors.fullName ? 'error' : ''}
                                    placeholder="Enter your full name"
                                />
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="Enter your email address"
                                    readOnly={userData.email ? true : false}
                                    style={userData.email ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                                />
                                {userData.email && (
                                    <small style={{ color: '#6c757d' }}>
                                        <i className="fas fa-info-circle"></i> Using your account email
                                    </small>
                                )}
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={errors.phone ? 'error' : ''}
                                    placeholder="+251 9XX XXX XXX"
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="expectedSalary">Expected Salary (ETB)</label>
                                <input
                                    type="text"
                                    id="expectedSalary"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 25,000 - 30,000"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="availableStartDate">Available Start Date</label>
                            <input
                                type="date"
                                id="availableStartDate"
                                name="availableStartDate"
                                value={formData.availableStartDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Professional Information</h3>

                        <div className="form-group">
                            <label htmlFor="experience">Work Experience *</label>
                            <textarea
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className={errors.experience ? 'error' : ''}
                                placeholder="Briefly describe your relevant work experience..."
                                rows="4"
                            />
                            {errors.experience && <span className="error-message">{errors.experience}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvFile">CV/Resume *</label>
                            <div className="file-upload">
                                <input
                                    type="file"
                                    id="cvFile"
                                    name="cvFile"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className={errors.cvFile ? 'error' : ''}
                                />
                                <label htmlFor="cvFile" className="file-upload-label">
                                    <i className="fas fa-upload"></i>
                                    {formData.cvFile ? formData.cvFile.name : 'Choose CV/Resume file'}
                                </label>
                                <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                            </div>
                            {errors.cvFile && <span className="error-message">{errors.cvFile}</span>}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Cover Letter</h3>

                        <div className="form-group">
                            <label htmlFor="coverLetter">Why are you interested in this position? *</label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                className={errors.coverLetter ? 'error' : ''}
                                placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                                rows="6"
                            />
                            <small>{formData.coverLetter.length}/500 characters (minimum 100)</small>
                            {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="additionalInfo">Additional Information</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                placeholder="Any additional information you'd like to share..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobApplication;