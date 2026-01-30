import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedCompanies } from '../services/api';
import './FeaturedCompanies.css';

const FeaturedCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await fetchFeaturedCompanies();
                setCompanies(data);
            } catch (error) {
                console.error('Error loading companies:', error);
                // Fallback to sample companies when API is not available
                setCompanies([
                    {
                        id: 1,
                        company_name: "Ethiopian Airlines",
                        logo: "logo6.png",
                        industry: "Aviation",
                        location: "Addis Ababa",
                        company_size: "10,000+ employees",
                        description: "Ethiopia's flag carrier and largest airline.",
                        job_count: 25
                    },
                    {
                        id: 2,
                        company_name: "Commercial Bank of Ethiopia",
                        logo: "logo7.png",
                        industry: "Banking",
                        location: "Addis Ababa",
                        company_size: "5,000+ employees",
                        description: "Ethiopia's largest commercial bank.",
                        job_count: 18
                    },
                    {
                        id: 3,
                        company_name: "Ethio Telecom",
                        logo: "logo8.png",
                        industry: "Telecommunications",
                        location: "Addis Ababa",
                        company_size: "15,000+ employees",
                        description: "Ethiopia's leading telecommunications provider.",
                        job_count: 32
                    },
                    {
                        id: 4,
                        company_name: "Tech Solutions Ethiopia",
                        logo: "logo9.png",
                        industry: "Technology",
                        location: "Addis Ababa",
                        company_size: "500+ employees",
                        description: "Leading tech solutions provider in Ethiopia.",
                        job_count: 15
                    },
                    {
                        id: 5,
                        company_name: "Ethiopian Marketing Group",
                        logo: "logo10.png",
                        industry: "Marketing",
                        location: "Addis Ababa",
                        company_size: "200+ employees",
                        description: "Top marketing agency in Ethiopia.",
                        job_count: 12
                    },
                    {
                        id: 6,
                        company_name: "Ethiopian Construction Corp",
                        logo: "logo11.png",
                        industry: "Construction",
                        location: "Addis Ababa",
                        company_size: "5,000+ employees",
                        description: "Major construction company in Ethiopia.",
                        job_count: 8
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadCompanies();
    }, []);

    const nextSlide = () => {
        const cardsToShow = window.innerWidth <= 768 ? 1 : 3;
        if (currentIndex < companies.length - cardsToShow) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return (
            <section className="featured-companies">
                <div className="container">
                    <div className="companies-header">
                        <h2>Featured Companies</h2>
                    </div>
                    <div className="loading">Loading companies...</div>
                </div>
            </section>
        );
    }

    if (companies.length === 0) {
        return (
            <section className="featured-companies">
                <div className="container">
                    <div className="companies-header">
                        <h2>Featured Companies</h2>
                    </div>
                    <p>No featured companies available at this time.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-companies">
            <div className="container">
                <div className="companies-header">
                    <h2>Featured Companies</h2>
                    <Link to="/companies">All Featured Companies</Link>
                </div>

                <div className="company-carousel-container">
                    <div className="company-carousel">
                        {companies.map((company, index) => {
                            const getCompanyLogo = (companyName, logoFile) => {
                                // If we have a logo file, use it
                                if (logoFile) {
                                    return `/image/${logoFile}`;
                                }

                                // Map real company names to their actual logos
                                const companyLogos = {
                                    'Ethiopian Airlines': '/image/logo6.png',
                                    'Commercial Bank of Ethiopia': '/image/logo7.png',
                                    'Ethio Telecom': '/image/logo8.png',
                                    'Tech Solutions Ethiopia': '/image/logo9.png',
                                    'Ethiopian Marketing Group': '/image/logo10.png',
                                    'Ethiopian Construction Corp': '/image/logo11.png',
                                    'Ethiopian Revenue Authority': '/image/logo12.png'
                                };

                                // Return specific logo if available
                                if (companyLogos[companyName]) {
                                    return companyLogos[companyName];
                                }

                                // Generate a unique color based on company name for fallback
                                const colors = ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];
                                const colorIndex = companyName.length % colors.length;
                                const color = colors[colorIndex];

                                // Get first letter of company name
                                const firstLetter = companyName.charAt(0).toUpperCase();

                                return `data:image/svg+xml;base64,${btoa(`
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="80" rx="10" fill="${color}"/>
                                        <text x="40" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
                                    </svg>
                                `)}`;
                            };

                            return (
                                <div
                                    key={company.id}
                                    className={`company-card ${index >= currentIndex &&
                                        index < currentIndex + (window.innerWidth <= 768 ? 1 : 3)
                                        ? 'visible' : 'hidden'
                                        }`}
                                >
                                    <div className="logo-placeholder">
                                        <img
                                            src={getCompanyLogo(company.company_name, company.logo)}
                                            alt={company.company_name}
                                            onError={(e) => {
                                                e.target.src = getCompanyLogo(company.company_name, null);
                                            }}
                                        />
                                    </div>
                                    <h3>{company.company_name}</h3>
                                    <p className="job-count">
                                        Jobs <span>({company.job_count})</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {companies.length > 3 && (
                        <div className="carousel-controls">
                            <button
                                className="carousel-btn left"
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                aria-label="Previous"
                            >
                                &#8592;
                            </button>
                            <button
                                className="carousel-btn right"
                                onClick={nextSlide}
                                disabled={currentIndex >= companies.length - (window.innerWidth <= 768 ? 1 : 3)}
                                aria-label="Next"
                            >
                                &#8594;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCompanies;