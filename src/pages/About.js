import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="container">
                <div className="about-header">
                    <h1>About Ethiopia Job</h1>
                    <p>Connecting talent with opportunity across Ethiopia</p>
                </div>

                <div className="about-content">
                    <section className="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            Ethiopia Job is the leading job portal in Ethiopia, dedicated to connecting
                            talented job seekers with top employers across the country. We believe that
                            everyone deserves the opportunity to find meaningful work and build a
                            successful career.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature">
                                <i className="fas fa-search"></i>
                                <h3>Job Search</h3>
                                <p>Advanced search and filtering to find the perfect job match</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-building"></i>
                                <h3>Company Profiles</h3>
                                <p>Detailed company information to help you make informed decisions</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-user-tie"></i>
                                <h3>Career Resources</h3>
                                <p>Tools and guidance to advance your professional development</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-handshake"></i>
                                <h3>Direct Connection</h3>
                                <p>Connect directly with employers and hiring managers</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>Our Leadership Team</h2>
                        <div className="team-grid">
                            <div className="team-member">
                                <div className="member-image">
                                    <img src="/image/admin1.jpg" alt="Yonas Teklu" />
                                </div>
                                <div className="member-info">
                                    <h3>Yonas Teklu</h3>
                                    <p className="position">Founder and CEO</p>
                                    <p>Yonas is a visionary entrepreneur with over 15 years of experience in technology and business development. He founded Ethiopia Job with the mission to bridge the employment gap in Ethiopia by connecting talented professionals with leading companies. Under his leadership, the platform has grown to serve over 1 million job seekers and 500+ companies across Ethiopia. Yonas holds an MBA in Business Administration and is passionate about leveraging technology to create economic opportunities for Ethiopian youth.</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-image">
                                    <img src="/image/admin.jpg" alt="Eyuel Birhanu" />
                                </div>
                                <div className="member-info">
                                    <h3>Eyuel Birhanu</h3>
                                    <p className="position">Chief Operating Officer</p>
                                    <p>Operations expert focused on scaling platform efficiency and user experience.</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-image">
                                    <img src="/image/admin.jpg" alt="Alem Gebre" />
                                </div>
                                <div className="member-info">
                                    <h3>Alem Gebre</h3>
                                    <p className="position">CTO</p>
                                    <p>Technology innovator building Africa's most advanced recruitment platform.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>Our Impact</h2>
                        <div className="stats-grid">
                            <div className="stat">
                                <h3>10,000+</h3>
                                <p>Job Seekers</p>
                            </div>
                            <div className="stat">
                                <h3>500+</h3>
                                <p>Companies</p>
                            </div>
                            <div className="stat">
                                <h3>5,000+</h3>
                                <p>Jobs Posted</p>
                            </div>
                            <div className="stat">
                                <h3>95%</h3>
                                <p>Success Rate</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;