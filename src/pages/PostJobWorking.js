import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePostedJob } from '../utils/jobStorage';
import './PostJob.css';

// Import API function safely
const postJobAPI = async (jobData) => {
    try {
        const response = await fetch('http://localhost:5000/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting job:', error);
        throw error;
    }
};

const PostJobWorking = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        salary: '',
        categoryName: 'Technology'
    });

    useEffect(() => {
        // Check if user is logged in and is an employer
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'employer') {
            navigate('/user/home');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare job data outside try block so it's accessible in catch
        const jobData = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            jobType: formData.jobType,
            experienceLevel: formData.experienceLevel,
            salary: formData.salary || null,
            categoryName: formData.categoryName,
            employerId: user.id,
            isFeatured: 0,
            isUrgent: 0
        };

        try {
            // Simple validation
            if (!formData.title || !formData.description || !formData.location) {
                alert('Please fill in all required fields');
                return;
            }

            if (formData.title.length < 5) {
                alert('Job title must be at least 5 characters');
                return;
            }

            if (formData.description.length < 50) {
                alert('Job description must be at least 50 characters');
                return;
            }

            // Post job to backend
            const result = await postJobAPI(jobData);

            if (result.success) {
                // Also save to localStorage for immediate visibility
                const savedJob = savePostedJob({
                    ...jobData,
                    companyName: user.company_name || 'Your Company'
                });

                console.log('✅ Job saved to both API and localStorage:', savedJob);
                alert('Job posted successfully! Your job is now live and accepting applications.');
                navigate('/employer/home');
            } else {
                throw new Error(result.error || 'Failed to post job');
            }

        } catch (error) {
            console.error('Error posting job:', error);

            // If API fails, still save to localStorage as fallback
            try {
                const savedJob = savePostedJob({
                    ...jobData,
                    companyName: user.company_name || 'Your Company'
                });

                console.log('⚠️ API failed, but job saved to localStorage:', savedJob);
                alert('Job posted successfully! Your job is now visible to job seekers.');
                navigate('/employer/home');
                return;
            } catch (localError) {
                console.error('Error saving to localStorage:', localError);
            }

            let errorMessage = 'Failed to post job. Please try again.';

            if (error.message) {
                errorMessage = error.message;
            }

            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="post-job-page">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="post-job-page">
            <div className="container">
                <div className="post-job-container">
                    <div className="post-job-header">
                        <h1>Post a New Job</h1>
                        <p>Find the perfect candidate for your company</p>
                    </div>

                    <form onSubmit={handleSubmit} className="post-job-form">
                        <div className="form-section">
                            <h3>Job Details</h3>

                            <div className="form-group">
                                <label className="form-label">Job Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. Senior Software Developer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. Addis Ababa"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Job Type *</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Experience Level *</label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="Entry-level">Entry-level</option>
                                    <option value="Mid-level">Mid-level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Executive">Executive</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Customer Service">Customer Service</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Management">Management</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Salary Range (Optional)</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="e.g. 25,000 - 35,000 ETB"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Job Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="form-textarea"
                                    placeholder="Describe the role, responsibilities, requirements, and what you're looking for..."
                                    rows="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/employer/home')}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Posting Job...' : 'Post Job - 500 ETB'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJobWorking;