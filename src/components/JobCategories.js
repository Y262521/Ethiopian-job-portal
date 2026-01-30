import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobCategories } from '../services/api';
import './JobCategories.css';

const JobCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchJobCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
                // Fallback to default categories
                setCategories([
                    { category_name: "Accounting and Finance", job_count: 45 },
                    { category_name: "Admin, Secretarial, and Clerical", job_count: 32 },
                    { category_name: "Agriculture", job_count: 28 },
                    { category_name: "Architecture and Construction", job_count: 18 },
                    { category_name: "Automotive", job_count: 12 },
                    { category_name: "Banking and Insurance", job_count: 38 },
                    { category_name: "Business and Administration", job_count: 52 },
                    { category_name: "Business Development", job_count: 25 },
                    { category_name: "Communications, Media and Journalism", job_count: 15 },
                    { category_name: "Consultancy and Training", job_count: 22 },
                    { category_name: "Creative Arts", job_count: 8 },
                    { category_name: "Customer Service", job_count: 35 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return (
            <section className="top-categories">
                <div className="container">
                    <h2>Top Job Categories</h2>
                    <div className="loading">Loading categories...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="top-categories">
            <div className="container">
                <h2>Top Job Categories</h2>
                <div className="category-grid">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/jobs?category=${encodeURIComponent(category.category_name)}`}
                            className="category-item"
                        >
                            <span className="category-name">{category.category_name}</span>
                            <span className="job-count">{category.job_count}</span>
                        </Link>
                    ))}
                </div>
                <Link to="/jobs" className="view-all">
                    View all categories <i className="fas fa-chevron-right"></i>
                </Link>
            </div>
        </section>
    );
};

export default JobCategories;