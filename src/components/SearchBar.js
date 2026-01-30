import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search jobs..."
                    className="search-input"
                    required
                />
                <button type="submit" className="search-button">Search</button>
            </form>
        </div>
    );
};

export default SearchBar;