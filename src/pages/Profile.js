import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

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
                        <div className="profile-avatar">
                            <i className={`fas ${user.type === 'admin' ? 'fa-user-shield' :
                                user.type === 'employer' ? 'fa-building' : 'fa-user'
                                }`}></i>
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="user-type">
                                {user.type === 'jobseeker' ? 'Job Seeker' :
                                    user.type === 'employer' ? 'Employer' : 'Administrator'}
                            </p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-card">
                            <h3>Personal Information</h3>
                            <div className="detail-row">
                                <span className="label">Full Name:</span>
                                <span className="value">{user.name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Email:</span>
                                <span className="value">{user.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Type:</span>
                                <span className="value">
                                    {user.type === 'jobseeker' ? 'Job Seeker' :
                                        user.type === 'employer' ? 'Employer' : 'Administrator'}
                                </span>
                            </div>
                            {user.phone && (
                                <div className="detail-row">
                                    <span className="label">Phone:</span>
                                    <span className="value">{user.phone}</span>
                                </div>
                            )}
                            {user.company && (
                                <div className="detail-row">
                                    <span className="label">Company:</span>
                                    <span className="value">{user.company}</span>
                                </div>
                            )}
                        </div>

                        <div className="profile-actions">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;