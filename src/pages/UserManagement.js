import React, { useState, useEffect } from 'react';
import { getAllUsers, suspendUser, activateUser } from '../services/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(filter);
            if (response.success) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendUser = async (userId, reason) => {
        try {
            const response = await suspendUser(userId, reason);
            if (response.success) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId
                        ? { ...user, status: 'suspended', suspension_reason: reason }
                        : user
                ));
                alert('User suspended successfully!');
                setSelectedUser(null);
                setSuspensionReason('');
            }
        } catch (error) {
            console.error('Error suspending user:', error);
            alert('Failed to suspend user');
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            const response = await activateUser(userId);
            if (response.success) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId
                        ? { ...user, status: 'active', suspension_reason: null }
                        : user
                ));
                alert('User activated successfully!');
            }
        } catch (error) {
            console.error('Error activating user:', error);
            alert('Failed to activate user');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'suspended': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6c757d';
        }
    };

    const getUserTypeIcon = (type) => {
        switch (type) {
            case 'jobseeker': return 'fa-user';
            case 'employer': return 'fa-building';
            case 'admin': return 'fa-user-shield';
            default: return 'fa-user';
        }
    };

    if (loading) {
        return (
            <div className="user-management">
                <div className="loading">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="container">
                <div className="management-header">
                    <h1>User Management</h1>
                    <p>Manage user accounts and permissions</p>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Users ({users.length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'jobseeker' ? 'active' : ''}`}
                        onClick={() => setFilter('jobseeker')}
                    >
                        Job Seekers ({users.filter(u => u.type === 'jobseeker').length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'employer' ? 'active' : ''}`}
                        onClick={() => setFilter('employer')}
                    >
                        Employers ({users.filter(u => u.type === 'employer').length})
                    </button>
                    <button
                        className={`tab-btn ${filter === 'suspended' ? 'active' : ''}`}
                        onClick={() => setFilter('suspended')}
                    >
                        Suspended ({users.filter(u => u.status === 'suspended').length})
                    </button>
                </div>

                {/* Users List */}
                <div className="users-list">
                    {users.length === 0 ? (
                        <div className="no-users">
                            <i className="fas fa-users"></i>
                            <h3>No users found</h3>
                            <p>No users match the current filter.</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={`${user.type}-${user.id}`} className="user-card">
                                <div className="user-header">
                                    <div className="user-avatar">
                                        <i className={`fas ${getUserTypeIcon(user.type)}`}></i>
                                    </div>
                                    <div className="user-info">
                                        <h3>{user.name}</h3>
                                        <p className="user-email">{user.email}</p>
                                        <div className="user-meta">
                                            <span className="user-type">
                                                <i className={`fas ${getUserTypeIcon(user.type)}`}></i>
                                                {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                                            </span>
                                            <span className="join-date">
                                                <i className="fas fa-calendar"></i>
                                                Joined {formatDate(user.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="user-status">
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(user.status) }}
                                        >
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {user.suspension_reason && (
                                    <div className="suspension-reason">
                                        <strong>Suspension Reason:</strong> {user.suspension_reason}
                                    </div>
                                )}

                                <div className="user-stats">
                                    {user.type === 'jobseeker' && (
                                        <>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.applications_count || 0}</span>
                                                <span className="stat-label">Applications</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.saved_jobs_count || 0}</span>
                                                <span className="stat-label">Saved Jobs</span>
                                            </div>
                                        </>
                                    )}
                                    {user.type === 'employer' && (
                                        <>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.jobs_posted || 0}</span>
                                                <span className="stat-label">Jobs Posted</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-value">{user.applications_received || 0}</span>
                                                <span className="stat-label">Applications</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="user-actions">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <i className="fas fa-eye"></i>
                                        View Details
                                    </button>

                                    {user.status === 'active' && user.type !== 'admin' && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                const reason = prompt('Reason for suspension:');
                                                if (reason) {
                                                    handleSuspendUser(user.id, reason);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-ban"></i>
                                            Suspend
                                        </button>
                                    )}

                                    {user.status === 'suspended' && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleActivateUser(user.id)}
                                        >
                                            <i className="fas fa-check"></i>
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="user-modal">
                        <div className="modal-overlay" onClick={() => setSelectedUser(null)}></div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{selectedUser.name}</h2>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="user-details">
                                    <div className="detail-section">
                                        <h3>Account Information</h3>
                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                        <p><strong>User Type:</strong> {selectedUser.type}</p>
                                        <p><strong>Status:</strong>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(selectedUser.status), marginLeft: '0.5rem' }}
                                            >
                                                {selectedUser.status}
                                            </span>
                                        </p>
                                        <p><strong>Joined:</strong> {formatDate(selectedUser.created_at)}</p>
                                    </div>

                                    {selectedUser.type === 'employer' && (
                                        <div className="detail-section">
                                            <h3>Company Information</h3>
                                            <p><strong>Company:</strong> {selectedUser.company_name || 'N/A'}</p>
                                            <p><strong>Contact Person:</strong> {selectedUser.contact_person || 'N/A'}</p>
                                            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                                            <p><strong>Website:</strong> {selectedUser.website || 'N/A'}</p>
                                        </div>
                                    )}

                                    {selectedUser.type === 'jobseeker' && (
                                        <div className="detail-section">
                                            <h3>Personal Information</h3>
                                            <p><strong>Full Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                                            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                                        </div>
                                    )}

                                    {selectedUser.suspension_reason && (
                                        <div className="detail-section">
                                            <h3>Suspension Details</h3>
                                            <p><strong>Reason:</strong> {selectedUser.suspension_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                {selectedUser.status === 'active' && selectedUser.type !== 'admin' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const reason = prompt('Reason for suspension:');
                                            if (reason) {
                                                handleSuspendUser(selectedUser.id, reason);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-ban"></i>
                                        Suspend User
                                    </button>
                                )}

                                {selectedUser.status === 'suspended' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleActivateUser(selectedUser.id)}
                                    >
                                        <i className="fas fa-check"></i>
                                        Activate User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;