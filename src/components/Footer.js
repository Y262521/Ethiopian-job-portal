import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Ethiopia Job</h3>
                        <p>The leading job board in Ethiopia. Find jobs, connect with employers, and advance your career.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>For Job Seekers</h4>
                        <ul>
                            <li><Link to="/jobs">Browse Jobs</Link></li>
                            <li><Link to="/companies">Browse Companies</Link></li>
                            <li><Link to="/signup">Create Account</Link></li>
                            <li><Link to="/contact">Career Advice</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>For Employers</h4>
                        <ul>
                            <li><Link to="/signup">Post a Job</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/contact">Employer Resources</Link></li>
                            <li><Link to="/request-demo">Request Demo</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Ethiopia Job. All Rights Reserved.</p>
                    <div className="contact-info">
                        <span>📞 +251962090308 | +251713224196</span>
                        <span>✉️ yonasteklu284@gmail.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;