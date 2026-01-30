import React, { useState, useEffect } from 'react';
import { fetchFeaturedCompanies } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import './Companies.css';

// Sample fallback company data
const sampleCompanies = [
    {
        id: 1,
        company_name: "Ethiopian Airlines",
        description: "Africa's largest airline and one of the fastest-growing carriers in the world.",
        industry: "Aviation",
        location: "Addis Ababa",
        website: "https://www.ethiopianairlines.com",
        employees: "17,000+",
        founded: "1945",
        logo: null,
        is_featured: true,
        job_count: 45
    },
    {
        id: 2,
        company_name: "Commercial Bank of Ethiopia",
        description: "Ethiopia's largest commercial bank providing comprehensive banking services.",
        industry: "Banking & Finance",
        location: "Addis Ababa",
        website: "https://www.combanketh.et",
        employees: "40,000+",
        founded: "1963",
        logo: null,
        is_featured: true,
        job_count: 32
    },
    {
        id: 3,
        company_name: "Ethio Telecom",
        description: "Ethiopia's leading telecommunications service provider.",
        industry: "Telecommunications",
        location: "Addis Ababa",
        website: "https://www.ethiotelecom.et",
        employees: "25,000+",
        founded: "1894",
        logo: null,
        is_featured: true,
        job_count: 28
    },
    {
        id: 4,
        company_name: "Ethiopian Electric Power",
        description: "State-owned electric utility company serving Ethiopia.",
        industry: "Energy & Utilities",
        location: "Addis Ababa",
        website: "https://www.eep.gov.et",
        employees: "30,000+",
        founded: "1956",
        logo: null,
        is_featured: true,
        job_count: 22
    },
    {
        id: 5,
        company_name: "Dashen Bank",
        description: "One of Ethiopia's leading private banks offering modern banking solutions.",
        industry: "Banking & Finance",
        location: "Addis Ababa",
        website: "https://www.dashenbanksc.com",
        employees: "15,000+",
        founded: "1995",
        logo: null,
        is_featured: true,
        job_count: 18
    },
    {
        id: 6,
        company_name: "Awash Bank",
        description: "Pioneer private bank in Ethiopia with extensive branch network.",
        industry: "Banking & Finance",
        location: "Addis Ababa",
        website: "https://www.awashbank.com",
        employees: "12,000+",
        founded: "1994",
        logo: null,
        is_featured: true,
        job_count: 15
    },
    {
        id: 7,
        company_name: "Ethiopian Insurance Corporation",
        description: "Leading insurance company providing comprehensive coverage solutions.",
        industry: "Insurance",
        location: "Addis Ababa",
        website: "https://www.eic.com.et",
        employees: "8,000+",
        founded: "1976",
        logo: null,
        is_featured: true,
        job_count: 12
    },
    {
        id: 8,
        company_name: "Habesha Breweries",
        description: "Premium brewery producing quality beers for Ethiopian market.",
        industry: "Food & Beverage",
        location: "Addis Ababa",
        website: "https://www.habeshabreweries.com",
        employees: "5,000+",
        founded: "1999",
        logo: null,
        is_featured: true,
        job_count: 10
    }
];

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await fetchFeaturedCompanies();
                setCompanies(data);
            } catch (error) {
                console.error('Error loading companies:', error);
                // Use fallback data when API fails
                setCompanies(sampleCompanies);
            } finally {
                setLoading(false);
            }
        };

        loadCompanies();
    }, []);

    if (loading) {
        return (
            <div className="companies-page">
                <div className="container">
                    <div className="loading">Loading companies...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="companies-page">
            <div className="container">
                <div className="companies-header">
                    <h1>Featured Companies</h1>
                    <p>Discover top employers in Ethiopia</p>
                </div>

                {companies.length > 0 ? (
                    <div className="companies-grid">
                        {companies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                ) : (
                    <div className="no-companies">
                        <h3>No companies found</h3>
                        <p>Check back later for featured companies.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;