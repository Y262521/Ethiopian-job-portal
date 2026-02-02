import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobById } from '../services/api';
import JobApplication from '../components/JobApplication';
import './JobApplicationPage.css';

const JobApplicationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            // Store the job ID to redirect back after login
            localStorage.setItem('redirectAfterLogin', `/apply/${id}`);
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Check user type - only job seekers can apply
            if (parsedUser.type !== 'jobseeker') {
                alert(`Only job seekers can apply for jobs. Your account type is: ${parsedUser.type}. Please log in with a job seeker account.`);
                localStorage.setItem('redirectAfterLogin', `/apply/${id}`);
                navigate('/login');
                return;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
            return;
        }

        // Fetch job details
        fetchJobDetails();
    }, [id, navigate]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const jobData = await fetchJobById(id);

            // Transform API data to match component expectations
            const jobDetail = {
                id: jobData.id,
                title: jobData.title,
                company: jobData.company_name,
                companyLogo: jobData.company_logo ? `/image/${jobData.company_logo}` : null,
                location: jobData.location,
                jobType: jobData.job_type,
                experienceLevel: jobData.experience_level,
                salary: jobData.salary || 'Negotiable',
                postedDate: jobData.created_at,
                category: jobData.category,
                description: jobData.description
            };

            setJob(jobDetail);
        } catch (error) {
            console.error('Error fetching job details:', error);
            alert('Job not found or no longer available.');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationSubmit = (applicationData) => {
        console.log('Application submitted:', applicationData);
        // Redirect to user home or my applications page after successful submission
        navigate('/user/my-applications');
    };

    const handleClose = () => {
        // Go back to jobs page or job detail page
        navigate(`/job/${id}`);
    };

    if (loading) {
        return (
            <div className="job-application-page">
                <div className="container">
                    <div className="loading">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-application-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Job not found</h2>
                        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="job-application-page">
            <div className="container">
                <div className="application-header">
                    <Link to={`/job/${id}`} className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Job Details
                    </Link>
                    <div className="job-info">
                        <h1>Apply for {job.title}</h1>
                        <p className="company-name">{job.company}</p>
                        <div className="job-meta">
                            <span className="location">
                                <i className="fas fa-map-marker-alt"></i>
                                {job.location}
                            </span>
                            <span className="job-type">
                                <i className="fas fa-briefcase"></i>
                                {job.jobType}
                            </span>
                            <span className="salary">
                                <i className="fas fa-money-bill-wave"></i>
                                {job.salary}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="application-content">
                    <JobApplication
                        job={job}
                        onClose={handleClose}
                        onSubmit={handleApplicationSubmit}
                        isPage={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobApplicationPage;