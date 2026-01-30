import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCategories from '../components/JobCategories';
import FeaturedCompanies from '../components/FeaturedCompanies';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Ethiopian Job</h1>
                        <h2>Unlock Your Career Potential</h2>

                        <div className="companies-nav">
                            <Link to="/" className="active">Jobs</Link>
                            <Link to="/companies">Companies</Link>
                        </div>

                        <SearchBar />

                        <div className="popular-searches">
                            <p>Popular Searches:</p>
                            <div className="search-tags">
                                <Link to="/jobs?category=Communications">Communications</Link>
                                <Link to="/jobs?category=Sales">Sales</Link>
                                <Link to="/jobs?category=Customer Service">Customer Service</Link>
                                <Link to="/jobs?category=Management">Management</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Categories */}
            <JobCategories />

            {/* Featured Companies */}
            <FeaturedCompanies />

            {/* Steps Section */}
            <section className="steps-section">
                <div className="container">
                    <div className="steps-grid">
                        <div className="step">
                            <div className="icon">👤</div>
                            <div className="content">
                                <h3>Register</h3>
                                <p>Apply for jobs from anywhere.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="icon">📄</div>
                            <div className="content">
                                <h3>Add Your CV</h3>
                                <p>Upload your resume and let employers find you.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="icon">📧</div>
                            <div className="content">
                                <h3>Create Email Alert</h3>
                                <p>Set up job notification, and be notified right away.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;