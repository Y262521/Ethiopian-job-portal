import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyCard.css';

const CompanyCard = ({ company }) => {
    const getCompanyLogo = (companyName) => {
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
        <div className="company-card">
            <div className="company-header">
                <div className="company-logo">
                    <img
                        src={company.logo ? `/image/${company.logo}` : getCompanyLogo(company.company_name)}
                        alt={company.company_name}
                        onError={(e) => {
                            e.target.src = getCompanyLogo(company.company_name);
                        }}
                    />
                </div>
                <div className="company-info">
                    <h3 className="company-name">
                        <Link to={`/company/${company.id}`}>
                            {company.company_name}
                        </Link>
                    </h3>
                    <p className="company-industry">{company.industry || 'Various Industries'}</p>
                    <div className="company-meta">
                        <span className="location">
                            <i className="fas fa-map-marker-alt"></i>
                            {company.location || 'Ethiopia'}
                        </span>
                        <span className="company-size">
                            <i className="fas fa-users"></i>
                            {company.employees || 'Not specified'}
                        </span>
                    </div>
                </div>
            </div>

            {company.description && (
                <div className="company-description">
                    <p>{company.description.substring(0, 150)}...</p>
                </div>
            )}

            <div className="company-footer">
                <div className="job-count">
                    <i className="fas fa-briefcase"></i>
                    <span>{company.job_count || 0} Open Positions</span>
                </div>
                <Link to={`/jobs?company=${company.id}`} className="btn btn-outline">
                    View Jobs
                </Link>
            </div>
        </div>
    );
};

export default CompanyCard;