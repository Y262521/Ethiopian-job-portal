import React from 'react';
import { Link } from 'react-router-dom';
import './Employers.css';

const Employers = () => {
    return (
        <div className="employers-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Ethiopian Job</h1>
                        <h2>Where Talent Meets Opportunity</h2>
                        <p>
                            Comprehensive job board, ATS integration, employer branding, physical job fair,
                            reporting and analytics and talent acquisition.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/post-job" className="btn btn-primary btn-large">
                                <i className="fas fa-plus"></i>
                                Post a Job
                            </Link>
                            <Link to="/request-demo" className="btn btn-outline btn-large">
                                Request Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose Ethiopia Job for Hiring?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>1M+ Active Candidates</h3>
                            <p>Access the largest database of qualified Ethiopian professionals across all industries.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3>Advanced Filtering</h3>
                            <p>Find the perfect candidates with our sophisticated search and filtering tools.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <h3>Real-time Analytics</h3>
                            <p>Track your job performance with detailed insights and hiring analytics.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3>ATS Integration</h3>
                            <p>Seamlessly integrate with your existing Applicant Tracking System.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-star"></i>
                            </div>
                            <h3>Employer Branding</h3>
                            <p>Showcase your company culture and attract top talent with enhanced profiles.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-calendar"></i>
                            </div>
                            <h3>Job Fair Events</h3>
                            <p>Participate in physical and virtual job fairs to meet candidates in person.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <h2>Our Recruitment Services</h2>
                    <div className="services-grid">
                        <div className="service-item">
                            <Link to="/job-management" className="service-link">
                                <div className="service-icon">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                <h3>Job Management</h3>
                                <p>Post, manage, and track your job listings with our comprehensive job management system.</p>
                                <span className="learn-more">Learn More <i className="fas fa-arrow-right"></i></span>
                            </Link>
                        </div>

                        <div className="service-item">
                            <Link to="/reporting-analytics" className="service-link">
                                <div className="service-icon">
                                    <i className="fas fa-analytics"></i>
                                </div>
                                <h3>Reporting & Analytics</h3>
                                <p>Get detailed insights into your hiring process with advanced reporting tools.</p>
                                <span className="learn-more">Learn More <i className="fas fa-arrow-right"></i></span>
                            </Link>
                        </div>

                        <div className="service-item">
                            <Link to="/pricing" className="service-link">
                                <div className="service-icon">
                                    <i className="fas fa-tags"></i>
                                </div>
                                <h3>Flexible Pricing</h3>
                                <p>Choose from our range of pricing plans designed to fit businesses of all sizes.</p>
                                <span className="learn-more">View Pricing <i className="fas fa-arrow-right"></i></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="success-stories">
                <div className="container">
                    <h2>Success Stories</h2>
                    <div className="stories-grid">
                        <div className="story-card">
                            <div className="story-content">
                                <p>"Ethiopia Job helped us find qualified candidates 3x faster than traditional methods. The platform's filtering system is exceptional."</p>
                                <div className="story-author">
                                    <strong>Sarah Mekonnen</strong>
                                    <span>HR Director, Ethiopian Airlines</span>
                                </div>
                            </div>
                        </div>

                        <div className="story-card">
                            <div className="story-content">
                                <p>"We've hired over 50 employees through Ethiopia Job. The quality of candidates and the platform's ease of use is outstanding."</p>
                                <div className="story-author">
                                    <strong>Daniel Tadesse</strong>
                                    <span>CEO, Dashen Bank</span>
                                </div>
                            </div>
                        </div>

                        <div className="story-card">
                            <div className="story-content">
                                <p>"The analytics dashboard gives us insights we never had before. We can now optimize our hiring process effectively."</p>
                                <div className="story-author">
                                    <strong>Hanan Ahmed</strong>
                                    <span>Talent Acquisition Manager, Safaricom Ethiopia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Find Your Next Great Hire?</h2>
                        <p>Join thousands of Ethiopian companies already using our platform to build their teams.</p>
                        <div className="cta-buttons">
                            <Link to="/request-demo" className="btn btn-primary">Request Demo</Link>
                            <Link to="/signup" className="btn btn-outline">Start Free Trial</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Employers;