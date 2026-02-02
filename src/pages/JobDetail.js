import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobById, checkJobSaved, saveJob, removeSavedJob } from '../services/api';
import JobApplication from '../components/JobApplication';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [user, setUser] = useState(null);
    const [isJobSaved, setIsJobSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        // Fetch real job details from API
        fetchJobDetails();

        // Check if job is saved (only for logged-in job seekers)
        if (userData) {
            const user = JSON.parse(userData);
            if (user.type === 'jobseeker') {
                checkIfJobSaved(user.email);
            }
        }
    }, [id, navigate]);

    const fetchJobDetails = async () => {
        try {
            console.log('🔍 Fetching job details for ID:', id);
            setLoading(true);

            const jobData = await fetchJobById(id);
            console.log('✅ Job data loaded:', jobData);

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
                deadline: jobData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                category: jobData.category,
                description: jobData.description ? `
                    <h3>Job Description</h3>
                    <p>${jobData.description}</p>
                    
                    <h3>Requirements</h3>
                    <ul>
                        <li>Experience Level: ${jobData.experience_level}</li>
                        <li>Job Type: ${jobData.job_type}</li>
                        <li>Location: ${jobData.location}</li>
                    </ul>
                    
                    <h3>What We Offer</h3>
                    <ul>
                        <li>Competitive salary: ${jobData.salary || 'Negotiable'}</li>
                        <li>Professional development opportunities</li>
                        <li>Health insurance and benefits</li>
                        <li>Flexible working arrangements</li>
                    </ul>
                ` : 'No detailed description available.',
                companyDescription: jobData.company_description || `${jobData.company_name} is a leading company in Ethiopia committed to excellence and innovation.`,
                requirements: [
                    "Relevant education or equivalent experience",
                    `${jobData.experience_level} level experience required`,
                    "Strong communication and interpersonal skills",
                    "Ability to work effectively in a team environment",
                    "Proficiency in relevant tools and technologies"
                ],
                benefits: [
                    "Competitive salary package",
                    "Health insurance coverage",
                    "Professional development opportunities",
                    "Flexible working arrangements",
                    "Career advancement prospects"
                ]
            };

            setJob(jobDetail);

            // Fetch real related jobs from the same category
            try {
                const relatedJobsResponse = await fetch(`http://localhost:5000/api/jobs?category=${encodeURIComponent(jobData.category)}&limit=3`);
                if (relatedJobsResponse.ok) {
                    const relatedData = await relatedJobsResponse.json();
                    const filteredRelatedJobs = relatedData.jobs
                        .filter(relatedJob => relatedJob.id !== jobData.id) // Exclude current job
                        .slice(0, 3) // Limit to 3 jobs
                        .map(relatedJob => ({
                            id: relatedJob.id,
                            title: relatedJob.title,
                            company: relatedJob.company_name,
                            location: relatedJob.location,
                            salary: relatedJob.salary || 'Competitive',
                            postedDate: relatedJob.created_at
                        }));

                    setRelatedJobs(filteredRelatedJobs);
                    console.log('✅ Related jobs loaded:', filteredRelatedJobs);
                } else {
                    // Fallback to sample related jobs if API fails
                    setRelatedJobs([
                        {
                            id: jobData.id + 1,
                            title: "Similar Position Available",
                            company: "Related Company",
                            location: jobData.location,
                            salary: "Competitive Package",
                            postedDate: new Date().toISOString()
                        }
                    ]);
                }
            } catch (relatedError) {
                console.warn('⚠️ Could not fetch related jobs:', relatedError);
                // Fallback to sample related jobs
                setRelatedJobs([
                    {
                        id: jobData.id + 1,
                        title: "Similar Position Available",
                        company: "Related Company",
                        location: jobData.location,
                        salary: "Competitive Package",
                        postedDate: new Date().toISOString()
                    }
                ]);
            }

        } catch (error) {
            console.error('❌ Error fetching job details:', error);
            setJob(null); // This will show "Job not found"
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        // Debug logging
        console.log('User data:', user);
        console.log('User type:', user?.type);

        // Check if user is logged in
        if (!user) {
            // Store the current job ID to redirect back after login
            localStorage.setItem('redirectAfterLogin', `/apply/${id}`);
            // Redirect to login page
            navigate('/login');
            return;
        }

        // Check user type - only job seekers can apply
        if (user.type !== 'jobseeker') {
            alert(`Only job seekers can apply for jobs. Your account type is: ${user.type}. Please log in with a job seeker account.`);
            // Redirect to login page for job seeker account
            localStorage.setItem('redirectAfterLogin', `/apply/${id}`);
            navigate('/login');
            return;
        }

        // If logged in as job seeker, go to application page
        navigate(`/apply/${id}`);
    };

    const handleApplicationSubmit = (applicationData) => {
        console.log('Application submitted:', applicationData);
        // Here you would typically send the data to your backend
        // For now, we'll just log it and show a success message
        setShowApplicationModal(false);
    };

    const checkIfJobSaved = async (email) => {
        try {
            const response = await checkJobSaved(email, id);
            if (response.success) {
                setIsJobSaved(response.isSaved);
            }
        } catch (error) {
            console.error('Error checking if job is saved:', error);
        }
    };

    const handleSaveJob = async () => {
        if (!user) {
            // Store the current job ID to redirect back after login
            localStorage.setItem('redirectAfterLogin', `/job/${id}`);
            // Redirect to login page
            navigate('/login');
            return;
        }

        if (user.type !== 'jobseeker') {
            alert('Only job seekers can save jobs.');
            return;
        }

        setSavingJob(true);

        try {
            if (isJobSaved) {
                // Remove from saved jobs
                const response = await removeSavedJob(user.email, id);
                if (response.success) {
                    setIsJobSaved(false);
                    alert('Job removed from saved list!');
                }
            } else {
                // Save the job
                const response = await saveJob(user.email, id);
                if (response.success) {
                    setIsJobSaved(true);
                    alert('Job saved successfully!');
                }
            }
        } catch (error) {
            console.error('Error saving/removing job:', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to save/remove job. Please try again.');
            }
        } finally {
            setSavingJob(false);
        }
    };

    const handleShareJob = () => {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: `Check out this job opportunity: ${job.title} at ${job.company}`,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Job link copied to clipboard!');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="job-detail-page">
                <div className="container">
                    <div className="loading">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-detail-page">
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
        <div className="job-detail-page">
            <div className="container">
                <div className="job-detail-header">
                    <Link to="/jobs" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Jobs
                    </Link>
                </div>

                <div className="job-detail-content">
                    <div className="job-main">
                        <div className="job-header">
                            <div className="company-logo">
                                <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    onError={(e) => {
                                        e.target.src = '/image/default-logo.png';
                                    }}
                                />
                            </div>
                            <div className="job-info">
                                <h1 className="job-title">{job.title}</h1>
                                <h2 className="company-name">
                                    <Link to={`/company/${job.id}`}>{job.company}</Link>
                                </h2>
                                <div className="job-meta">
                                    <span className="location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {job.location}
                                    </span>
                                    <span className="job-type">
                                        <i className="fas fa-briefcase"></i>
                                        {job.jobType}
                                    </span>
                                    <span className="experience">
                                        <i className="fas fa-user-tie"></i>
                                        {job.experienceLevel}
                                    </span>
                                    <span className="salary">
                                        <i className="fas fa-money-bill-wave"></i>
                                        {job.salary}
                                    </span>
                                </div>
                            </div>
                            <div className="job-actions">
                                <button onClick={handleApply} className="btn btn-primary btn-large">
                                    Apply Now
                                </button>
                                <button onClick={handleSaveJob} className={`btn btn-outline ${isJobSaved ? 'saved' : ''}`} disabled={savingJob}>
                                    <i className={`fas ${isJobSaved ? 'fa-heart' : 'fa-heart'}`}></i>
                                    {savingJob ? 'Saving...' : (isJobSaved ? 'Saved' : 'Save Job')}
                                </button>
                                <button onClick={handleShareJob} className="btn btn-outline">
                                    <i className="fas fa-share"></i> Share
                                </button>
                            </div>
                        </div>

                        <div className="job-description">
                            <div dangerouslySetInnerHTML={{ __html: job.description }} />
                        </div>
                    </div>

                    <div className="job-sidebar">
                        <div className="job-summary">
                            <h3>Job Summary</h3>
                            <div className="summary-item">
                                <strong>Posted:</strong>
                                <span>{formatDate(job.postedDate)}</span>
                            </div>
                            <div className="summary-item">
                                <strong>Deadline:</strong>
                                <span>{formatDate(job.deadline)}</span>
                            </div>
                            <div className="summary-item">
                                <strong>Category:</strong>
                                <span>{job.category}</span>
                            </div>
                            <div className="summary-item">
                                <strong>Job Type:</strong>
                                <span>{job.jobType}</span>
                            </div>
                            <div className="summary-item">
                                <strong>Experience:</strong>
                                <span>{job.experienceLevel}</span>
                            </div>
                        </div>

                        <div className="company-info">
                            <h3>About {job.company}</h3>
                            <p>{job.companyDescription}</p>
                            <Link to={`/company/${job.id}`} className="btn btn-outline btn-full">
                                View Company Profile
                            </Link>
                        </div>

                        <div className="job-share">
                            <h3>Share this Job</h3>
                            <div className="share-buttons">
                                <button type="button" className="share-btn facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button type="button" className="share-btn twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(job.title)}`, '_blank')}>
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button type="button" className="share-btn linkedin" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}>
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button type="button" className="share-btn whatsapp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(job.title + ' - ' + window.location.href)}`, '_blank')}>
                                    <i className="fab fa-whatsapp"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="related-jobs">
                    <h3>Similar Jobs</h3>
                    <div className="related-jobs-grid">
                        {relatedJobs.map((relatedJob) => (
                            <Link
                                key={relatedJob.id}
                                to={`/job/${relatedJob.id}`}
                                className="related-job-card"
                            >
                                <h4 className="related-job-title">{relatedJob.title}</h4>
                                <p className="related-job-company">{relatedJob.company}</p>
                                <div className="related-job-meta">
                                    <span className="related-job-location">{relatedJob.location}</span>
                                    <span className="related-job-salary">{relatedJob.salary}</span>
                                </div>
                                <div className="related-job-date">
                                    Posted {formatDate(relatedJob.postedDate)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Application Modal */}
            {showApplicationModal && (
                <JobApplication
                    job={job}
                    onClose={() => setShowApplicationModal(false)}
                    onSubmit={handleApplicationSubmit}
                />
            )}
        </div>
    );
};

export default JobDetail;