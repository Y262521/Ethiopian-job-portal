import React, { useState, useEffect } from 'react';
import { getAdminUsers, updateUserStatus } from '../services/api';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [activeTab, setActiveTab] = useState('jobseekers');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers(activeTab);
    }, [activeTab]);

    const fetchUsers = async (userType) => {
        try {
            setLoading(true);
            console.log('🔍 Fetching users of type:', userType);
            const response = await getAdminUsers(userType);
            if (response.success) {
                console.log('✅ Users loaded:', response.users);
                setUsers(response.users);
            }
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, action) => {
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
            console.log(`🔄 Updating user ${id} status to ${status}...`);

            const response = await updateUserStatus(id, activeTab, status);
            if (response.success) {
                console.log('✅ User status updated successfully');
                // Update local state
                setUsers(users.map(user =>
                    user.id === id ? { ...user, status: status } : user
                ));
            }
        } catch (error) {
            console.error('❌ Error updating user status:', error);
            alert('Failed to update user status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Filter users based on search term and status
    const filteredUsers = users.filter(user => {
        const searchTermLower = (searchTerm || '').toLowerCase();
        const matchesSearch = activeTab === 'jobseekers'
            ? (`${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTermLower) ||
                (user.email || '').toLowerCase().includes(searchTermLower))
            : ((user.company_name || '').toLowerCase().includes(searchTermLower) ||
                (user.contact_person || '').toLowerCase().includes(searchTermLower) ||
                (user.email || '').toLowerCase().includes(searchTermLower));

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-user-management">
            <div className="container">
                <div className="page-header">
                    <h1>User Management</h1>
                    <p>Manage job seekers and employers on the platform</p>
                </div>

                {/* Filters and Search */}
                <div className="management-controls">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* User Type Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'jobseekers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobseekers')}
                    >
                        <i className="fas fa-users"></i>
                        Job Seekers ({activeTab === 'jobseekers' ? users.length : 0})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'employers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('employers')}
                    >
                        <i className="fas fa-building"></i>
                        Employers ({activeTab === 'employers' ? users.length : 0})
                    </button>
                </div>

                {/* Users Table */}
                <div className="admin-table-container">
                    {loading ? (
                        <div className="loading">
                            <i className="fas fa-spinner fa-spin"></i>
                            Loading users...
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <div className="table-info">
                                <span>Showing {filteredUsers.length} of {users.length} users</span>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        {activeTab === 'jobseekers' ? (
                                            <>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                            </>
                                        ) : (
                                            <>
                                                <th>Company</th>
                                                <th>Contact Person</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                            </>
                                        )}
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={activeTab === 'jobseekers' ? 7 : 8} className="no-data">
                                                No users found matching your criteria
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                {activeTab === 'jobseekers' ? (
                                                    <>
                                                        <td>
                                                            <div className="user-info">
                                                                <strong>{user.first_name} {user.last_name}</strong>
                                                            </div>
                                                        </td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>
                                                            <div className="company-info">
                                                                <strong>{user.company_name}</strong>
                                                            </div>
                                                        </td>
                                                        <td>{user.contact_person}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                    </>
                                                )}
                                                <td>
                                                    <span className={`status-badge ${user.status}`}>
                                                        <i className={`fas ${user.status === 'approved' ? 'fa-check-circle' :
                                                            user.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                                                            }`}></i>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(user.created_at)}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {user.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-approve"
                                                                    onClick={() => handleApproval(user.id, 'approve')}
                                                                    title="Approve User"
                                                                >
                                                                    <i className="fas fa-check"></i>
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="btn btn-reject"
                                                                    onClick={() => handleApproval(user.id, 'reject')}
                                                                    title="Reject User"
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            className="btn btn-view"
                                                            onClick={() => handleViewUser(user)}
                                                            title="View Details"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="summary-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Users:</span>
                        <span className="stat-value">{users.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Pending Approval:</span>
                        <span className="stat-value">{users.filter(u => u.status === 'pending').length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Approved:</span>
                        <span className="stat-value">{users.filter(u => u.status === 'approved').length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Rejected:</span>
                        <span className="stat-value">{users.filter(u => u.status === 'rejected').length}</span>
                    </div>
                </div>

                {/* User Details Modal */}
                {showModal && selectedUser && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>
                                    <i className={`fas ${activeTab === 'jobseekers' ? 'fa-user' : 'fa-building'}`}></i>
                                    {activeTab === 'jobseekers' ? 'Job Seeker Details' : 'Employer Details'}
                                </h2>
                                <button className="modal-close" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="user-details-grid">
                                    <div className="detail-section">
                                        <h3>Basic Information</h3>
                                        <div className="detail-item">
                                            <label>ID:</label>
                                            <span>{selectedUser.id}</span>
                                        </div>

                                        {activeTab === 'jobseekers' ? (
                                            <>
                                                <div className="detail-item">
                                                    <label>Full Name:</label>
                                                    <span>{selectedUser.first_name} {selectedUser.last_name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>First Name:</label>
                                                    <span>{selectedUser.first_name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Last Name:</label>
                                                    <span>{selectedUser.last_name}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="detail-item">
                                                    <label>Company Name:</label>
                                                    <span>{selectedUser.company_name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Contact Person:</label>
                                                    <span>{selectedUser.contact_person}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Website:</label>
                                                    <span>{selectedUser.website || 'Not provided'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Industry:</label>
                                                    <span>{selectedUser.industry || 'Not specified'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Company Size:</label>
                                                    <span>{selectedUser.employees || 'Not specified'}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className="detail-item">
                                            <label>Email:</label>
                                            <span>{selectedUser.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Phone:</label>
                                            <span>{selectedUser.phone}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Account Information</h3>
                                        <div className="detail-item">
                                            <label>Status:</label>
                                            <span className={`status-badge ${selectedUser.status}`}>
                                                <i className={`fas ${selectedUser.status === 'approved' ? 'fa-check-circle' :
                                                        selectedUser.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                                                    }`}></i>
                                                {selectedUser.status}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Registration Date:</label>
                                            <span>{formatDate(selectedUser.created_at)}</span>
                                        </div>
                                        {selectedUser.suspension_reason && (
                                            <div className="detail-item">
                                                <label>Suspension Reason:</label>
                                                <span className="suspension-reason">{selectedUser.suspension_reason}</span>
                                            </div>
                                        )}
                                    </div>

                                    {activeTab === 'jobseekers' && (
                                        <div className="detail-section">
                                            <h3>Activity Statistics</h3>
                                            <div className="detail-item">
                                                <label>Applications Submitted:</label>
                                                <span>{selectedUser.applications_count || 0}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Saved Jobs:</label>
                                                <span>{selectedUser.saved_jobs_count || 0}</span>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'employers' && (
                                        <div className="detail-section">
                                            <h3>Business Statistics</h3>
                                            <div className="detail-item">
                                                <label>Jobs Posted:</label>
                                                <span>{selectedUser.jobs_posted || 0}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Applications Received:</label>
                                                <span>{selectedUser.applications_received || 0}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Featured Company:</label>
                                                <span>{selectedUser.is_featured ? 'Yes' : 'No'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                {selectedUser.status === 'pending' && (
                                    <div className="modal-actions">
                                        <button
                                            className="btn btn-approve"
                                            onClick={() => {
                                                handleApproval(selectedUser.id, 'approve');
                                                closeModal();
                                            }}
                                        >
                                            <i className="fas fa-check"></i>
                                            Approve User
                                        </button>
                                        <button
                                            className="btn btn-reject"
                                            onClick={() => {
                                                handleApproval(selectedUser.id, 'reject');
                                                closeModal();
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                            Reject User
                                        </button>
                                    </div>
                                )}
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;