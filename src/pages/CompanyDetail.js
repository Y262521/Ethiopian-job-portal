import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CompanyDetail.css';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Simulate loading company details
        setTimeout(() => {
            const companyDetail = {
                id: parseInt(id),
                name: "Ethiopian Airlines",
                logo: "/image/company-logo.png",
                industry: "Aviation & Transportation",
                location: "Addis Ababa, Ethiopia",
                companySize: "10,000+ employees",
                founded: "1945",
                website: "https://www.ethiopianairlines.com",
                description: `
          Ethiopian Airlines is the flag carrier of Ethiopia and one of the largest airlines in Africa. 
          Founded in 1945, we have grown to become a leading aviation group in Africa, serving over 
          125 destinations worldwide. We are committed to connecting Africa with the world through 
          our extensive network and innovative services.
          
          Our mission is to become the most competitive and leading aviation group in Africa by 
          providing safe, reliable, and customer-focused passenger and cargo services. We pride 
          ourselves on our Ethiopian heritage while embracing global standards of excellence.
        `,
                values: [
                    "Safety First",
                    "Customer Excellence",
                    "Innovation",
                    "Integrity",
                    "Teamwork"
                ],
                benefits: [
                    "Competitive salary packages",
                    "Comprehensive health insurance",
                    "Professional development opportunities",
                    "Travel benefits and discounts",
                    "Retirement savings plan",
                    "Flexible working arrangements"
                ]
            };

            setCompany(companyDetail);

            // Set company jobs
            setJobs([
                {
                    id: 1,
                    title: "Senior Software Engineer",
                    location: "Addis Ababa",
                    jobType: "Full-time",
                    salary: "25,000 - 35,000 ETB",
                    postedDate: "2025-01-20"
                },
                {
                    id: 2,
                    title: "Flight Operations Coordinator",
                    location: "Addis Ababa",
                    jobType: "Full-time",
                    salary: "20,000 - 28,000 ETB",
                    postedDate: "2025-01-18"
                },
                {
                    id: 3,
                    title: "Customer Service Representative",
                    location: "Addis Ababa",
                    jobType: "Full-time",
                    salary: "12,000 - 18,000 ETB",
                    postedDate: "2025-01-15"
                }
            ]);

            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <div className="company-detail-page">
                <div className="container">
                    <div className="loading">Loading company details...</div>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="company-detail-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Company not found</h2>
                        <Link to="/companies" className="btn btn-primary">Browse Companies</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="company-detail-page">
            <div className="container">
                <div className="company-detail-header">
                    <Link to="/companies" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Companies
                    </Link>
                </div>

                <div className="company-hero">
                    <div className="company-logo">
                        <img
                            src={company.logo}
                            alt={company.name}
                            onError={(e) => {
                                e.target.src = '/image/default-logo.png';
                            }}
                        />
                    </div>
                    <div className="company-info">
                        <h1 className="company-name">{company.name}</h1>
                        <div className="company-meta">
                            <span className="industry">
                                <i className="fas fa-industry"></i>
                                {company.industry}
                            </span>
                            <span className="location">
                                <i className="fas fa-map-marker-alt"></i>
                                {company.location}
                            </span>
                            <span className="company-size">
                                <i className="fas fa-users"></i>
                                {company.companySize}
                            </span>
                            <span className="founded">
                                <i className="fas fa-calendar"></i>
                                Founded {company.founded}
                            </span>
                        </div>
                        <div className="company-actions">
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                <i className="fas fa-external-link-alt"></i> Visit Website
                            </a>
                            <button className="btn btn-primary">
                                <i className="fas fa-heart"></i> Follow Company
                            </button>
                        </div>
                    </div>
                </div>

                <div className="company-content">
                    <div className="company-main">
                        <section className="company-description">
                            <h2>About {company.name}</h2>
                            <div className="description-text">
                                {company.description.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
                                ))}
                            </div>
                        </section>

                        <section className="company-values">
                            <h2>Our Values</h2>
                            <div className="values-grid">
                                {company.values.map((value, index) => (
                                    <div key={index} className="value-item">
                                        <i className="fas fa-check-circle"></i>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="company-jobs">
                            <h2>Open Positions ({jobs.length})</h2>
                            <div className="jobs-list">
                                {jobs.map((job) => (
                                    <Link key={job.id} to={`/job/${job.id}`} className="job-item">
                                        <div className="job-info">
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="job-details">
                                                <span className="job-location">{job.location}</span>
                                                <span className="job-type">{job.jobType}</span>
                                                <span className="job-salary">{job.salary}</span>
                                            </div>
                                        </div>
                                        <div className="job-date">
                                            Posted {new Date(job.postedDate).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link to={`/jobs?company=${company.id}`} className="btn btn-primary">
                                View All Jobs
                            </Link>
                        </section>
                    </div>

                    <div className="company-sidebar">
                        <div className="company-stats">
                            <h3>Company Stats</h3>
                            <div className="stat-item">
                                <strong>Industry:</strong>
                                <span>{company.industry}</span>
                            </div>
                            <div className="stat-item">
                                <strong>Company Size:</strong>
                                <span>{company.companySize}</span>
                            </div>
                            <div className="stat-item">
                                <strong>Founded:</strong>
                                <span>{company.founded}</span>
                            </div>
                            <div className="stat-item">
                                <strong>Open Jobs:</strong>
                                <span>{jobs.length}</span>
                            </div>
                        </div>

                        <div className="company-benefits">
                            <h3>Benefits & Perks</h3>
                            <ul>
                                {company.benefits.map((benefit, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check"></i>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;