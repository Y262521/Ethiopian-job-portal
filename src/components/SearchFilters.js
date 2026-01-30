import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchFilters.css';

const SearchFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        jobType: searchParams.get('jobType') || '',
        experienceLevel: searchParams.get('experienceLevel') || '',
        salaryRange: searchParams.get('salaryRange') || '',
        category: searchParams.get('category') || ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            jobType: '',
            experienceLevel: '',
            salaryRange: '',
            category: ''
        });
        setSearchParams({});
    };

    return (
        <div className="search-filters">
            <div className="filters-header">
                <h3>Filter Jobs</h3>
                <button onClick={clearFilters} className="clear-filters">
                    Clear All
                </button>
            </div>

            <div className="filter-group">
                <label className="filter-label">Location</label>
                <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Locations</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Mekelle">Mekelle</option>
                    <option value="Gondar">Gondar</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Adama">Adama</option>
                    <option value="Jimma">Jimma</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Job Type</label>
                <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Experience Level</label>
                <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Levels</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Salary Range</label>
                <select
                    value={filters.salaryRange}
                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Any Salary</option>
                    <option value="0-5000">0 - 5,000 ETB</option>
                    <option value="5000-10000">5,000 - 10,000 ETB</option>
                    <option value="10000-20000">10,000 - 20,000 ETB</option>
                    <option value="20000-50000">20,000 - 50,000 ETB</option>
                    <option value="50000+">50,000+ ETB</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    <option value="Accounting and Finance">Accounting and Finance</option>
                    <option value="Admin, Secretarial, and Clerical">Admin, Secretarial, and Clerical</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Architecture and Construction">Architecture and Construction</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Banking and Insurance">Banking and Insurance</option>
                    <option value="Business and Administration">Business and Administration</option>
                    <option value="Communications, Media and Journalism">Communications, Media and Journalism</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Information Technology">Information Technology</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilters;