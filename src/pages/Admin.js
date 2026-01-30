import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('jobseekers');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading users data
        setTimeout(() => {
            const mockUsers = {
                jobseekers: [
                    {
                        id: 1,
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@email.com',
                        phone: '+251911234567',
                        status: 'pending',
                        created_at: '2025-01-20'
                    },
                    {
                        id: 2,
                        first_name: 'Jane',
                        last_name: 'Smith',
                        email: 'jane.smith@email.com',
                        phone: '+251922345678',
                        status: 'approved',
                        created_at: '2025-01-19'
                    },
                    {
                        id: 3,
                        first_name: 'Michael',
                        last_name: 'Johnson',
                        email: 'michael.j@email.com',
                        phone: '+251933456789',
                        status: 'pending',
                        created_at: '2025-01-18'
                    }
                ],
                employers: [
                    {
                        id: 1,
                        company_name: 'Ethiopian Airlines',
                        contact_person: 'Sarah Mekonnen',
                        email: 'hr@ethiopianairlines.com',
                        phone: '+251911111111',
                        status: 'approved',
                        created_at: '2025-01-20'
                    },
                    {
                        id: 2,
                        company_name: 'Dashen Bank',
                        contact_person: 'Daniel Tadesse',
                        email: 'hr@dashenbank.com',
                        phone: '+251922222222',
                        status: 'pending',
                        created_at: '2025-01-19'
                    }
                ]
            };

            setUsers(mockUsers[activeTab]);
            setLoading(false);
        }, 1000);
    }, [activeTab]);

    const handleApproval = (id, action) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: action === 'approve' ? 'approved' : 'rejected' }
                : user
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage user registrations and approvals</p>
                </div>

                <div className="admin-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <h3>1,234</h3>
                            <p>Total Job Seekers</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="stat-info">
                            <h3>156</h3>
                            <p>Total Employers</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="stat-info">
                            <h3>2,567</h3>
                            <p>Active Jobs</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="stat-info">
                            <h3>23</h3>
                            <p>Pending Approvals</p>
                        </div>
                    </div>
                </div>

                <div className="admin-content">
                    <div className="admin-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'jobseekers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('jobseekers')}
                        >
                            Job Seekers
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'employers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('employers')}
                        >
                            Employers
                        </button>
                    </div>

                    <div className="admin-table-container">
                        {loading ? (
                            <div className="loading">Loading users...</div>
                        ) : (
                            <div className="table-wrapper">
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
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                {activeTab === 'jobseekers' ? (
                                                    <>
                                                        <td>{user.first_name} {user.last_name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{user.company_name}</td>
                                                        <td>{user.contact_person}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone}</td>
                                                    </>
                                                )}
                                                <td>
                                                    <span className={`status-badge ${user.status}`}>
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
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="btn btn-reject"
                                                                    onClick={() => handleApproval(user.id, 'reject')}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button className="btn btn-view">
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-actions">
                    <Link to="/admin/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                    <Link to="/admin/reports" className="btn btn-secondary">
                        View Reports
                    </Link>
                    <Link to="/admin/settings" className="btn btn-outline">
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Admin;