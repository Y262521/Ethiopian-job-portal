import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedJobs, setRelatedJobs] = useState([]);

    useEffect(() => {
        // Simulate loading job details
        setTimeout(() => {
            const jobDetail = {
                id: parseInt(id),
                title: "Senior Software Engineer",
                company: "Ethiopian Airlines",
                companyLogo: "/image/company-logo.png",
                location: "Addis Ababa, Ethiopia",
                jobType: "Full-time",
                experienceLevel: "Senior Level",
                salary: "25,000 - 35,000 ETB",
                postedDate: "2025-01-20",
                deadline: "2025-02-20",
                category: "Information Technology",
                description: `
          <h3>About the Role</h3>
          <p>We are seeking a highly skilled Senior Software Engineer to join our dynamic technology team. The successful candidate will be responsible for designing, developing, and maintaining high-quality software solutions that support our airline operations.</p>
          
          <h3>Key Responsibilities</h3>
          <ul>
            <li>Design and develop scalable software applications</li>
            <li>Lead technical discussions and architectural decisions</li>
            <li>Mentor junior developers and conduct code reviews</li>
            <li>Collaborate with cross-functional teams to deliver projects</li>
            <li>Ensure code quality and adherence to best practices</li>
            <li>Troubleshoot and resolve complex technical issues</li>
          </ul>
          
          <h3>Required Qualifications</h3>
          <ul>
            <li>Bachelor's degree in Computer Science or related field</li>
            <li>5+ years of software development experience</li>
            <li>Proficiency in Java, Python, or C#</li>
            <li>Experience with cloud platforms (AWS, Azure)</li>
            <li>Strong understanding of database systems</li>
            <li>Excellent problem-solving and communication skills</li>
          </ul>
          
          <h3>Preferred Qualifications</h3>
          <ul>
            <li>Master's degree in Computer Science</li>
            <li>Experience in airline or transportation industry</li>
            <li>Knowledge of microservices architecture</li>
            <li>DevOps and CI/CD experience</li>
          </ul>
          
          <h3>What We Offer</h3>
          <ul>
            <li>Competitive salary and benefits package</li>
            <li>Professional development opportunities</li>
            <li>Flexible working arrangements</li>
            <li>Health insurance and retirement plans</li>
            <li>Travel benefits</li>
          </ul>
        `,
                companyDescription: "Ethiopian Airlines is the flag carrier of Ethiopia and one of the largest airlines in Africa. We are committed to connecting Africa with the world through our extensive network and innovative services.",
                requirements: [
                    "Bachelor's degree in Computer Science",
                    "5+ years of experience",
                    "Proficiency in Java/Python/C#",
                    "Cloud platform experience",
                    "Strong communication skills"
                ],
                benefits: [
                    "Competitive salary",
                    "Health insurance",
                    "Professional development",
                    "Travel benefits",
                    "Flexible working"
                ]
            };

            setJob(jobDetail);

            // Set related jobs
            setRelatedJobs([
                {
                    id: 2,
                    title: "Frontend Developer",
                    company: "Dashen Bank",
                    location: "Addis Ababa",
                    salary: "18,000 - 25,000 ETB",
                    postedDate: "2025-01-18"
                },
                {
                    id: 3,
                    title: "DevOps Engineer",
                    company: "Safaricom Ethiopia",
                    location: "Addis Ababa",
                    salary: "22,000 - 30,000 ETB",
                    postedDate: "2025-01-15"
                },
                {
                    id: 4,
                    title: "Data Scientist",
                    company: "Commercial Bank of Ethiopia",
                    location: "Addis Ababa",
                    salary: "20,000 - 28,000 ETB",
                    postedDate: "2025-01-12"
                }
            ]);

            setLoading(false);
        }, 1000);
    }, [id]);

    const handleApply = () => {
        // Handle job application
        alert('Application functionality would be implemented here');
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
                                <button className="btn btn-outline">
                                    <i className="fas fa-heart"></i> Save Job
                                </button>
                                <button className="btn btn-outline">
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
                                <a href="#" className="share-btn facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="share-btn twitter">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="share-btn linkedin">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="share-btn whatsapp">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
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
        </div>
    );
};

export default JobDetail;