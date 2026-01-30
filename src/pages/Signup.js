import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        userType: 'jobseeker',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyName: '',
        agreeTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!formData.agreeTerms) {
            setError('Please agree to the terms and conditions');
            setLoading(false);
            return;
        }

        if (formData.phone.length < 10) {
            setError('Phone number must be at least 10 digits');
            setLoading(false);
            return;
        }

        if (formData.userType === 'employer' && !formData.companyName.trim()) {
            setError('Company name is required for employers');
            setLoading(false);
            return;
        }

        try {
            console.log('Form data being sent:', formData);

            // Prepare data for submission - don't send companyName for job seekers
            const submitData = { ...formData };
            if (formData.userType === 'jobseeker') {
                delete submitData.companyName;
            }
            delete submitData.confirmPassword; // Don't send confirm password to backend
            delete submitData.agreeTerms; // Don't send terms agreement to backend

            console.log('Cleaned data being sent:', submitData);

            const response = await registerUser(submitData);
            console.log('Registration response:', response);
            if (response.success) {
                navigate('/login', {
                    state: { message: 'Registration successful! Please sign in.' }
                });
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data?.details) {
                // Show validation errors
                const validationErrors = error.response.data.details.map(err => err.msg).join(', ');
                setError(`Validation failed: ${validationErrors}`);
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>Join Ethiopia Job today</p>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label className="form-label">I am a</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="jobseeker"
                                            checked={formData.userType === 'jobseeker'}
                                            onChange={handleChange}
                                        />
                                        Job Seeker
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="employer"
                                            checked={formData.userType === 'employer'}
                                            onChange={handleChange}
                                        />
                                        Employer
                                    </label>
                                </div>
                            </div>

                            {formData.userType === 'employer' && (
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 0912345678"
                                    minLength="10"
                                    required
                                />
                                <small className="form-help">Enter at least 10 digits</small>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    I agree to the{' '}
                                    <Link to="/terms" className="auth-link">
                                        Terms and Conditions
                                    </Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;