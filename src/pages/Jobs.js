import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import { getAllJobs } from '../utils/jobStorage';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';
import './Jobs.css';

// Sample fallback data
const sampleJobs = [
    {
        id: 1,
        title: "Software Developer",
        company_name: "Tech Solutions Ethiopia",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Mid-level",
        salary: "25,000 - 35,000 ETB",
        category: "Technology",
        description: "We are looking for a skilled software developer to join our growing team...",
        is_featured: true,
        is_urgent: false,
        created_at: "2024-01-15",
        company_logo: null
    },
    {
        id: 2,
        title: "Marketing Manager",
        company_name: "Ethiopian Marketing Group",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Senior",
        salary: "30,000 - 45,000 ETB",
        category: "Marketing",
        description: "Lead our marketing initiatives and drive brand awareness across Ethiopia...",
        is_featured: false,
        is_urgent: true,
        created_at: "2024-01-14",
        company_logo: null
    },
    {
        id: 3,
        title: "Customer Service Representative",
        company_name: "Ethiopian Airlines",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Entry-level",
        salary: "15,000 - 20,000 ETB",
        category: "Customer Service",
        description: "Provide excellent customer service to our valued passengers...",
        is_featured: false,
        is_urgent: false,
        created_at: "2024-01-13",
        company_logo: null
    },
    {
        id: 4,
        title: "Sales Manager",
        company_name: "Commercial Bank of Ethiopia",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Mid-level",
        salary: "28,000 - 40,000 ETB",
        category: "Sales",
        description: "Drive sales growth and manage key client relationships...",
        is_featured: true,
        is_urgent: false,
        created_at: "2024-01-12",
        company_logo: null
    },
    {
        id: 5,
        title: "Project Manager",
        company_name: "Ethiopian Construction Corp",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Senior",
        salary: "35,000 - 50,000 ETB",
        category: "Management",
        description: "Oversee construction projects from planning to completion...",
        is_featured: false,
        is_urgent: true,
        created_at: "2024-01-11",
        company_logo: null
    },
    {
        id: 6,
        title: "Accountant",
        company_name: "Ethiopian Revenue Authority",
        location: "Addis Ababa",
        job_type: "Full-time",
        experience_level: "Mid-level",
        salary: "22,000 - 30,000 ETB",
        category: "Finance",
        description: "Handle financial records and ensure compliance with regulations...",
        is_featured: false,
        is_urgent: false,
        created_at: "2024-01-10",
        company_logo: null
    }
];

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                console.log('🔍 Starting to load jobs...');

                let apiJobs = [];

                // Try to fetch from API first
                try {
                    console.log('🌐 Attempting to fetch jobs from API...');
                    const apiResponse = await fetchJobs();
                    if (apiResponse && apiResponse.jobs) {
                        apiJobs = apiResponse.jobs;
                        console.log('✅ Loaded jobs from API:', apiJobs.length, apiJobs);
                    } else {
                        console.log('⚠️ API response format unexpected:', apiResponse);
                    }
                } catch (apiError) {
                    console.warn('⚠️ API fetch failed, using localStorage and sample data:', apiError.message);
                }

                // Combine API jobs, localStorage jobs, and sample jobs
                const allJobs = getAllJobs([...apiJobs, ...sampleJobs]);
                console.log('📊 Total jobs available:', allJobs.length);

                const searchQuery = searchParams.get('search');
                const category = searchParams.get('category');
                console.log('🔍 Search params:', { searchQuery, category });

                let filteredJobs = [...allJobs];

                if (searchQuery) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                if (category) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.category.toLowerCase() === category.toLowerCase()
                    );
                }

                console.log('✅ Showing filtered jobs:', filteredJobs.length);
                setJobs(filteredJobs);
                setTotalPages(1);
            } catch (error) {
                console.error('Error loading jobs:', error);
                // Fallback to localStorage and sample jobs only
                const fallbackJobs = getAllJobs(sampleJobs);
                setJobs(fallbackJobs);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, [searchParams, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="jobs-page">
                <div className="container">
                    <div className="loading">Loading jobs...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-page">
            <div className="container">
                <div className="jobs-header">
                    <h1>Find Jobs</h1>
                    <p>Discover your next career opportunity</p>
                </div>

                <div className="jobs-content">
                    <aside className="jobs-sidebar">
                        <SearchFilters />
                    </aside>

                    <main className="jobs-main">
                        {jobs.length > 0 ? (
                            <>
                                <div className="jobs-results">
                                    <p>{jobs.length} jobs found</p>
                                </div>

                                <div className="jobs-grid">
                                    {jobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-jobs">
                                <h3>No jobs found</h3>
                                <p>Try adjusting your search criteria or browse all jobs.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;