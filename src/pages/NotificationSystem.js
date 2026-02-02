import React, { useState, useEffect } from 'react';
import { sendNotification, getNotificationHistory } from '../services/api';
import './NotificationSystem.css';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all',
        scheduledFor: ''
    });

    useEffect(() => {
        fetchNotificationHistory();
    }, []);

    const fetchNotificationHistory = async () => {
        try {
            setLoading(true);
            const response = await getNotificationHistory();
            if (response.success) {
                setNotifications(response.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setSending(true);
            const response = await sendNotification(formData);

            if (response.success) {
                alert('Notification sent successfully!');
                setFormData({
                    title: '',
                    message: '',
                    type: 'info',
                    recipients: 'all',
                    scheduledFor: ''
                });
                fetchNotificationHistory(); // Refresh the list
            } else {
                alert('Failed to send notification: ' + response.error);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return '#28a745';
            case 'warning': return '#ffc107';
            case 'error': return '#dc3545';
            case 'info': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-times-circle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-bell';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="notification-system">
            <div className="container">
                <div className="notification-header">
                    <h1>Notification System</h1>
                    <p>Send notifications to users and manage communication</p>
                </div>

                <div className="notification-content">
                    {/* Send Notification Form */}
                    <div className="notification-form-card">
                        <h2>Send New Notification</h2>
                        <form onSubmit={handleSendNotification} className="notification-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="title">Notification Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter notification title"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Type</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="info">Info</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Enter your notification message"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="recipients">Recipients</label>
                                    <select
                                        id="recipients"
                                        name="recipients"
                                        value={formData.recipients}
                                        onChange={handleInputChange}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="jobseekers">Job Seekers Only</option>
                                        <option value="employers">Employers Only</option>
                                        <option value="active">Active Users Only</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="scheduledFor">Schedule For (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        id="scheduledFor"
                                        name="scheduledFor"
                                        value={formData.scheduledFor}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Send Notification
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setFormData({
                                        title: '',
                                        message: '',
                                        type: 'info',
                                        recipients: 'all',
                                        scheduledFor: ''
                                    })}
                                >
                                    Clear Form
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Notification History */}
                    <div className="notification-history-card">
                        <h2>Notification History</h2>

                        {loading ? (
                            <div className="loading">Loading notification history...</div>
                        ) : notifications.length === 0 ? (
                            <div className="no-notifications">
                                <i className="fas fa-bell-slash"></i>
                                <h3>No notifications sent yet</h3>
                                <p>Your sent notifications will appear here.</p>
                            </div>
                        ) : (
                            <div className="notifications-list">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="notification-item">
                                        <div className="notification-icon">
                                            <i
                                                className={`fas ${getTypeIcon(notification.type)}`}
                                                style={{ color: getTypeColor(notification.type) }}
                                            ></i>
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-header">
                                                <h4>{notification.title}</h4>
                                                <span
                                                    className="notification-type"
                                                    style={{ backgroundColor: getTypeColor(notification.type) }}
                                                >
                                                    {notification.type}
                                                </span>
                                            </div>
                                            <p className="notification-message">{notification.message}</p>
                                            <div className="notification-meta">
                                                <span>
                                                    <i className="fas fa-users"></i>
                                                    Recipients: {notification.recipients}
                                                </span>
                                                <span>
                                                    <i className="fas fa-clock"></i>
                                                    Sent: {formatDate(notification.sent_at)}
                                                </span>
                                                <span>
                                                    <i className="fas fa-eye"></i>
                                                    Delivered: {notification.delivered_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="notification-status">
                                            <span className={`status-badge ${notification.status}`}>
                                                {notification.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Templates */}
                <div className="quick-templates">
                    <h3>Quick Templates</h3>
                    <div className="templates-grid">
                        <div
                            className="template-card"
                            onClick={() => setFormData({
                                ...formData,
                                title: 'Welcome to Ethiopia Job Portal',
                                message: 'Welcome to our platform! Start exploring job opportunities and connect with top employers.',
                                type: 'success'
                            })}
                        >
                            <i className="fas fa-hand-wave"></i>
                            <h4>Welcome Message</h4>
                        </div>
                        <div
                            className="template-card"
                            onClick={() => setFormData({
                                ...formData,
                                title: 'System Maintenance Notice',
                                message: 'We will be performing scheduled maintenance. The platform may be temporarily unavailable.',
                                type: 'warning'
                            })}
                        >
                            <i className="fas fa-tools"></i>
                            <h4>Maintenance Notice</h4>
                        </div>
                        <div
                            className="template-card"
                            onClick={() => setFormData({
                                ...formData,
                                title: 'New Feature Available',
                                message: 'Check out our latest feature that will help you find better job opportunities!',
                                type: 'info'
                            })}
                        >
                            <i className="fas fa-star"></i>
                            <h4>Feature Announcement</h4>
                        </div>
                        <div
                            className="template-card"
                            onClick={() => setFormData({
                                ...formData,
                                title: 'Profile Update Required',
                                message: 'Please update your profile to ensure you receive relevant job recommendations.',
                                type: 'warning'
                            })}
                        >
                            <i className="fas fa-user-edit"></i>
                            <h4>Profile Update</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSystem;