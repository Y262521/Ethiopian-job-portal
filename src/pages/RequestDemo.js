import React, { useState } from 'react';
import './RequestDemo.css';

const RequestDemo = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        companySize: '',
        industry: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                company: '',
                jobTitle: '',
                companySize: '',
                industry: '',
                message: ''
            });
        }, 2000);
    };

    return (
        <div className="request-demo-page">
            <div className="container">
                <div className="demo-header">
                    <h1>Request a Demo</h1>
                    <p>See how Ethiopia Job can transform your hiring process</p>
                </div>

                <div className="demo-content">
                    <div className="demo-info">
                        <h2>What You'll Get</h2>
                        <div className="demo-benefits">
                            <div className="benefit-item">
                                <i className="fas fa-video"></i>
                                <div>
                                    <h3>Personalized Demo</h3>
                                    <p>30-minute one-on-one session tailored to your needs</p>
                                </div>
                            </div>

                            <div className="benefit-item">
                                <i className="fas fa-chart-line"></i>
                                <div>
                                    <h3>ROI Analysis</h3>
                                    <p>See potential cost savings and efficiency gains</p>
                                </div>
                            </div>

                            <div className="benefit-item">
                                <i className="fas fa-users"></i>
                                <div>
                                    <h3>Expert Consultation</h3>
                                    <p>Get hiring strategy advice from our experts</p>
                                </div>
                            </div>

                            <div className="benefit-item">
                                <i className="fas fa-gift"></i>
                                <div>
                                    <h3>Special Offer</h3>
                                    <p>Exclusive pricing and setup assistance</p>
                                </div>
                            </div>
                        </div>

                        <div className="demo-stats">
                            <h3>Join 500+ Ethiopian Companies</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-number">75%</div>
                                    <div className="stat-label">Faster Hiring</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">60%</div>
                                    <div className="stat-label">Cost Reduction</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">90%</div>
                                    <div className="stat-label">Client Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="demo-form-container">
                        {success ? (
                            <div className="success-message">
                                <i className="fas fa-check-circle"></i>
                                <h3>Demo Request Submitted!</h3>
                                <p>Thank you for your interest. Our team will contact you within 24 hours to schedule your personalized demo.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="btn btn-primary"
                                >
                                    Request Another Demo
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="demo-form">
                                <h2>Schedule Your Demo</h2>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">First Name *</label>
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
                                        <label className="form-label">Last Name *</label>
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

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Work Email *</label>
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
                                        <label className="form-label">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Company Name *</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Job Title *</label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Company Size *</label>
                                        <select
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="">Select company size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201-1000">201-1000 employees</option>
                                            <option value="1000+">1000+ employees</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Industry *</label>
                                        <select
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="">Select industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Banking & Finance">Banking & Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Education">Education</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Construction">Construction</option>
                                            <option value="Agriculture">Agriculture</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tell us about your hiring needs</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="What challenges are you facing with hiring? How many positions do you typically fill per month?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-full"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Schedule Demo'}
                                </button>

                                <p className="form-note">
                                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDemo;