import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, uploadCV } from '../services/api';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        skills: '',
        experience: '',
        education: '',
        location: '',
        profilePhoto: null,
        cvFile: null,
        cvFileName: '',
        // Job Preferences
        preferredJobTypes: [],
        preferredCategories: [],
        preferredLocations: [],
        salaryExpectation: '',
        workArrangement: '',
        experienceLevel: '',
        availability: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // Load profile data from API
                loadProfileData();
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadProfileData = async () => {
        try {
            const response = await getUserProfile();
            if (response.success) {
                const userData = response.user;
                const userType = response.userType;

                // Initialize profile data based on user type
                if (userType === 'jobseeker') {
                    setProfileData({
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        bio: userData.bio || '',
                        skills: userData.skills || '',
                        experience: userData.experience || '',
                        education: userData.education || '',
                        location: userData.location || '',
                        profilePhoto: null,
                        cvFile: null,
                        cvFileName: userData.cv_file_name || '',
                        // Job Preferences - parse comma-separated strings back to arrays
                        preferredJobTypes: userData.preferred_job_types ? userData.preferred_job_types.split(',') : [],
                        preferredCategories: userData.preferred_categories ? userData.preferred_categories.split(',') : [],
                        preferredLocations: userData.preferred_locations ? userData.preferred_locations.split(',') : [],
                        salaryExpectation: userData.salary_expectation || '',
                        workArrangement: userData.work_arrangement || '',
                        experienceLevel: userData.experience_level || '',
                        availability: userData.availability || ''
                    });
                } else if (userType === 'employer') {
                    setProfileData({
                        firstName: userData.contact_person ? userData.contact_person.split(' ')[0] : '',
                        lastName: userData.contact_person ? userData.contact_person.split(' ').slice(1).join(' ') : '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        bio: userData.description || '',
                        skills: '',
                        experience: '',
                        education: '',
                        location: userData.location || '',
                        profilePhoto: null
                    });
                } else if (userType === 'admin') {
                    const nameParts = userData.username ? userData.username.split(' ') : ['', ''];
                    setProfileData({
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        email: userData.email || '',
                        phone: '',
                        bio: '',
                        skills: '',
                        experience: '',
                        education: '',
                        location: '',
                        profilePhoto: null
                    });
                }

                // Load saved photo from localStorage
                const savedPhoto = localStorage.getItem(`profilePhoto_${userData.email}`);
                if (savedPhoto) {
                    setPhotoPreview(savedPhoto);
                }
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
            // Fallback to localStorage data
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                const nameParts = parsedUser.name ? parsedUser.name.split(' ') : ['', ''];
                setProfileData({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: parsedUser.email || '',
                    phone: parsedUser.phone || '',
                    bio: '',
                    skills: '',
                    experience: '',
                    education: '',
                    location: '',
                    profilePhoto: null,
                    cvFile: null,
                    cvFileName: '',
                    // Job Preferences
                    preferredJobTypes: [],
                    preferredCategories: [],
                    preferredLocations: [],
                    salaryExpectation: '',
                    workArrangement: '',
                    experienceLevel: '',
                    availability: ''
                });

                // Load saved photo from localStorage
                const savedPhoto = localStorage.getItem(`profilePhoto_${parsedUser.email}`);
                if (savedPhoto) {
                    setPhotoPreview(savedPhoto);
                }
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            if (file.size > maxSize) {
                alert('Image size must be less than 5MB');
                return;
            }

            setProfileData(prev => ({
                ...prev,
                profilePhoto: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCVChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid CV file (PDF, DOC, or DOCX)');
                return;
            }

            if (file.size > maxSize) {
                alert('CV file size must be less than 10MB');
                return;
            }

            setProfileData(prev => ({
                ...prev,
                cvFile: file,
                cvFileName: file.name
            }));
        }
    };

    const removeCVFile = () => {
        setProfileData(prev => ({
            ...prev,
            cvFile: null,
            cvFileName: ''
        }));

        // Reset file input
        const fileInput = document.getElementById('cvFile');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleJobPreferenceChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMultiSelectChange = (field, value) => {
        setProfileData(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [field]: newValues
            };
        });
    };

    const removePhoto = () => {
        setProfileData(prev => ({
            ...prev,
            profilePhoto: null
        }));
        setPhotoPreview(null);

        // Remove photo from localStorage
        if (user && user.email) {
            localStorage.removeItem(`profilePhoto_${user.email}`);
        }

        // Reset file input
        const fileInput = document.getElementById('profilePhoto');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Handle CV upload first if there's a new CV file
            if (profileData.cvFile) {
                try {
                    const cvResponse = await uploadCV(profileData.cvFile);
                    if (cvResponse.success) {
                        console.log('CV uploaded successfully:', cvResponse.cvFileName);
                    }
                } catch (cvError) {
                    console.error('CV upload failed:', cvError);
                    alert('Failed to upload CV, but profile will still be saved.');
                }
            }

            // Prepare data based on user type
            let updateData = {};

            if (user.type === 'jobseeker') {
                updateData = {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                    bio: profileData.bio,
                    skills: profileData.skills,
                    experience: profileData.experience,
                    education: profileData.education,
                    location: profileData.location,
                    preferredJobTypes: profileData.preferredJobTypes,
                    preferredCategories: profileData.preferredCategories,
                    preferredLocations: profileData.preferredLocations,
                    salaryExpectation: profileData.salaryExpectation,
                    workArrangement: profileData.workArrangement,
                    experienceLevel: profileData.experienceLevel,
                    availability: profileData.availability
                };
            } else if (user.type === 'employer') {
                updateData = {
                    contactPerson: `${profileData.firstName} ${profileData.lastName}`.trim(),
                    phone: profileData.phone,
                    description: profileData.bio,
                    location: profileData.location
                };
            } else if (user.type === 'admin') {
                updateData = {
                    username: `${profileData.firstName} ${profileData.lastName}`.trim() || profileData.firstName
                };
            }

            // Call API to update profile
            const response = await updateUserProfile(updateData);

            if (response.success) {
                // Save photo to localStorage if it exists
                if (photoPreview) {
                    localStorage.setItem(`profilePhoto_${user.email}`, photoPreview);
                }

                // Update localStorage with new data
                const updatedUser = {
                    ...user,
                    name: `${profileData.firstName} ${profileData.lastName}`.trim(),
                    phone: profileData.phone
                };

                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);

                alert('Profile updated successfully!');
            } else {
                throw new Error(response.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data
        const nameParts = user.name ? user.name.split(' ') : ['', ''];
        setProfileData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: '',
            skills: '',
            experience: '',
            education: '',
            location: '',
            profilePhoto: null,
            cvFile: null,
            cvFileName: '',
            // Job Preferences
            preferredJobTypes: [],
            preferredCategories: [],
            preferredLocations: [],
            salaryExpectation: '',
            workArrangement: '',
            experienceLevel: '',
            availability: ''
        });

        // Restore saved photo from localStorage
        const savedPhoto = localStorage.getItem(`profilePhoto_${user.email}`);
        if (savedPhoto) {
            setPhotoPreview(savedPhoto);
        } else {
            setPhotoPreview(null);
        }

        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="profile-photo" />
                                ) : (
                                    <i className={`fas ${user.type === 'admin' ? 'fa-user-shield' :
                                        user.type === 'employer' ? 'fa-building' : 'fa-user'
                                        }`}></i>
                                )}
                            </div>
                            {isEditing && (
                                <div className="photo-upload-controls">
                                    <label htmlFor="profilePhoto" className="photo-upload-btn">
                                        <i className="fas fa-camera"></i>
                                        {photoPreview ? 'Change Photo' : 'Add Photo'}
                                    </label>
                                    <input
                                        type="file"
                                        id="profilePhoto"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        style={{ display: 'none' }}
                                    />
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="photo-remove-btn"
                                        >
                                            <i className="fas fa-trash"></i>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="user-type">
                                {user.type === 'jobseeker' ? 'Job Seeker' :
                                    user.type === 'employer' ? 'Employer' : 'Administrator'}
                            </p>
                            <p className="user-email">{user.email}</p>
                        </div>
                        <div className="profile-actions">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="edit-actions">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-save"></i>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="btn btn-outline"
                                    >
                                        <i className="fas fa-times"></i>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-content">
                        <div className="profile-section">
                            <h3>Personal Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your first name"
                                        />
                                    ) : (
                                        <p>{profileData.firstName || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your last name"
                                        />
                                    ) : (
                                        <p>{profileData.lastName || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <p>{profileData.email}</p>
                                    <small>Email cannot be changed</small>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+251 9XX XXX XXX"
                                        />
                                    ) : (
                                        <p>{profileData.phone || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="form-group full-width">
                                    <label>Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Addis Ababa, Ethiopia"
                                        />
                                    ) : (
                                        <p>{profileData.location || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.type === 'jobseeker' && (
                            <>
                                {/* CV Upload Section */}
                                <div className="profile-section">
                                    <h3>CV/Resume</h3>
                                    <div className="cv-upload-section">
                                        {profileData.cvFileName ? (
                                            <div className="cv-file-display">
                                                <div className="cv-file-info">
                                                    <i className="fas fa-file-pdf"></i>
                                                    <div className="cv-details">
                                                        <h4>{profileData.cvFileName}</h4>
                                                        <p>CV uploaded successfully</p>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <div className="cv-actions">
                                                        <label htmlFor="cvFile" className="btn btn-outline btn-sm">
                                                            <i className="fas fa-sync"></i>
                                                            Replace CV
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={removeCVFile}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="cv-upload-placeholder">
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                <h4>Upload Your CV/Resume</h4>
                                                <p>Upload your CV to increase your chances of being found by employers</p>
                                                {isEditing && (
                                                    <label htmlFor="cvFile" className="btn btn-primary">
                                                        <i className="fas fa-upload"></i>
                                                        Choose CV File
                                                    </label>
                                                )}
                                            </div>
                                        )}

                                        {isEditing && (
                                            <input
                                                type="file"
                                                id="cvFile"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCVChange}
                                                style={{ display: 'none' }}
                                            />
                                        )}

                                        <div className="cv-tips">
                                            <h5>CV Tips:</h5>
                                            <ul>
                                                <li>Use PDF format for best compatibility</li>
                                                <li>Keep file size under 10MB</li>
                                                <li>Include your contact information</li>
                                                <li>Highlight relevant skills and experience</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h3>Professional Summary</h3>
                                    <div className="form-group">
                                        <label>Bio</label>
                                        {isEditing ? (
                                            <textarea
                                                name="bio"
                                                value={profileData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Write a brief professional summary about yourself..."
                                                rows="4"
                                            />
                                        ) : (
                                            <p>{profileData.bio || 'No bio provided yet. Add a professional summary to attract employers!'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h3>Skills & Experience</h3>
                                    <div className="form-group">
                                        <label>Skills</label>
                                        {isEditing ? (
                                            <textarea
                                                name="skills"
                                                value={profileData.skills}
                                                onChange={handleInputChange}
                                                placeholder="List your key skills (e.g., JavaScript, React, Node.js, Project Management...)"
                                                rows="3"
                                            />
                                        ) : (
                                            <p>{profileData.skills || 'No skills listed yet. Add your key skills to improve your profile!'}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Work Experience</label>
                                        {isEditing ? (
                                            <textarea
                                                name="experience"
                                                value={profileData.experience}
                                                onChange={handleInputChange}
                                                placeholder="Describe your work experience, previous roles, and achievements..."
                                                rows="4"
                                            />
                                        ) : (
                                            <p>{profileData.experience || 'No work experience added yet. Share your professional background!'}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Education</label>
                                        {isEditing ? (
                                            <textarea
                                                name="education"
                                                value={profileData.education}
                                                onChange={handleInputChange}
                                                placeholder="List your educational background, degrees, certifications..."
                                                rows="3"
                                            />
                                        ) : (
                                            <p>{profileData.education || 'No education information added yet. Add your educational background!'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Job Preferences Section */}
                                <div className="profile-section">
                                    <h3>Job Preferences</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Preferred Job Types</label>
                                            {isEditing ? (
                                                <div className="checkbox-group">
                                                    {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(type => (
                                                        <label key={type} className="checkbox-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={(profileData.preferredJobTypes || []).includes(type)}
                                                                onChange={() => handleMultiSelectChange('preferredJobTypes', type)}
                                                            />
                                                            <span>{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>{(profileData.preferredJobTypes || []).length > 0 ? (profileData.preferredJobTypes || []).join(', ') : 'No job type preferences set'}</p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Preferred Categories</label>
                                            {isEditing ? (
                                                <div className="checkbox-group">
                                                    {['Technology', 'Sales', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Customer Service'].map(category => (
                                                        <label key={category} className="checkbox-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={(profileData.preferredCategories || []).includes(category)}
                                                                onChange={() => handleMultiSelectChange('preferredCategories', category)}
                                                            />
                                                            <span>{category}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>{(profileData.preferredCategories || []).length > 0 ? (profileData.preferredCategories || []).join(', ') : 'No category preferences set'}</p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Work Arrangement</label>
                                            {isEditing ? (
                                                <select
                                                    value={profileData.workArrangement}
                                                    onChange={(e) => handleJobPreferenceChange('workArrangement', e.target.value)}
                                                >
                                                    <option value="">Select work arrangement</option>
                                                    <option value="On-site">On-site</option>
                                                    <option value="Remote">Remote</option>
                                                    <option value="Hybrid">Hybrid</option>
                                                    <option value="Flexible">Flexible</option>
                                                </select>
                                            ) : (
                                                <p>{profileData.workArrangement || 'No work arrangement preference set'}</p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Experience Level</label>
                                            {isEditing ? (
                                                <select
                                                    value={profileData.experienceLevel}
                                                    onChange={(e) => handleJobPreferenceChange('experienceLevel', e.target.value)}
                                                >
                                                    <option value="">Select experience level</option>
                                                    <option value="Entry Level">Entry Level</option>
                                                    <option value="Mid Level">Mid Level</option>
                                                    <option value="Senior Level">Senior Level</option>
                                                    <option value="Executive">Executive</option>
                                                </select>
                                            ) : (
                                                <p>{profileData.experienceLevel || 'No experience level preference set'}</p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Salary Expectation (ETB)</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={profileData.salaryExpectation}
                                                    onChange={(e) => handleJobPreferenceChange('salaryExpectation', e.target.value)}
                                                    placeholder="e.g., 50,000 - 80,000 ETB per month"
                                                />
                                            ) : (
                                                <p>{profileData.salaryExpectation || 'No salary expectation set'}</p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Availability</label>
                                            {isEditing ? (
                                                <select
                                                    value={profileData.availability}
                                                    onChange={(e) => handleJobPreferenceChange('availability', e.target.value)}
                                                >
                                                    <option value="">Select availability</option>
                                                    <option value="Immediately">Immediately</option>
                                                    <option value="Within 2 weeks">Within 2 weeks</option>
                                                    <option value="Within 1 month">Within 1 month</option>
                                                    <option value="Within 3 months">Within 3 months</option>
                                                </select>
                                            ) : (
                                                <p>{profileData.availability || 'No availability preference set'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section">
                                    <h3>Profile Completion Tips</h3>
                                    <div className="tips-grid">
                                        <button
                                            className="tip-card clickable"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <i className="fas fa-user-edit"></i>
                                            <h4>Complete Your Profile</h4>
                                            <p>Fill out all sections to increase your visibility to employers</p>
                                        </button>
                                        <button
                                            className="tip-card clickable"
                                            onClick={() => document.getElementById('cvFile')?.click()}
                                        >
                                            <i className="fas fa-file-upload"></i>
                                            <h4>Upload Your CV</h4>
                                            <p>Upload your resume to make it easy for employers to review your qualifications</p>
                                        </button>
                                        <button
                                            className="tip-card clickable"
                                            onClick={() => navigate('/user/job-alerts')}
                                        >
                                            <i className="fas fa-bell"></i>
                                            <h4>Set Job Alerts</h4>
                                            <p>Get notified about new opportunities that match your skills</p>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="profile-navigation">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-outline"
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back
                            </button>

                            {user.type === 'jobseeker' && (
                                <button
                                    onClick={() => navigate('/user/home')}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-home"></i>
                                    Go to Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;