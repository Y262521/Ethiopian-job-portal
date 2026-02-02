import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import './Analytics.css';

const Analytics = () => {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        totalCompanies: 0,
        monthlyStats: [],
        topCategories: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30days');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            console.log('Fetching analytics data...');
            const response = await getAnalytics(timeRange);
            console.log('Analytics response:', response);

            if (response.success) {
                setAnalytics(response.data);
                console.log('Analytics data set:', response.data);
            } else {
                console.error('Analytics API returned error:', response.error);
                // Set default values if API fails
                setAnalytics({
                    totalUsers: 0,
                    totalJobs: 0,
                    totalApplications: 0,
                    totalCompanies: 0,
                    topCategories: [],
                    recentActivity: []
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            // Set default values if API fails
            setAnalytics({
                totalUsers: 0,
                totalJobs: 0,
                totalApplications: 0,
                totalCompanies: 0,
                topCategories: [],
                recentActivity: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="loading">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="container">
                <div className="analytics-header">
                    <h1>Analytics Dashboard</h1>
                    <div className="time-range-selector">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="form-select"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="1year">Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="metric-content">
                            <h3>{analytics.totalUsers}</h3>
                            <p>Total Users</p>
                            <span className="metric-change">
                                {analytics.totalJobseekers || 0} Job Seekers + {analytics.totalEmployers || 0} Employers
                            </span>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="metric-content">
                            <h3>{analytics.totalJobs}</h3>
                            <p>Active Jobs</p>
                            <span className="metric-change">
                                {analytics.pendingJobs || 0} pending approval
                            </span>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="metric-content">
                            <h3>{analytics.totalApplications}</h3>
                            <p>Applications</p>
                            <span className="metric-change">
                                {analytics.pendingApplications || 0} pending review
                            </span>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="metric-content">
                            <h3>{analytics.totalCompanies}</h3>
                            <p>Companies</p>
                            <span className="metric-change">
                                {analytics.activeCompanies || analytics.totalCompanies} active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="chart-card">
                        <h3>Platform Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-label" style={{ color: '#333', fontWeight: '500', fontSize: '1rem' }}>Active Jobs</div>
                                <div className="stat-value">{analytics.totalJobs - (analytics.pendingJobs || 0)}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label" style={{ color: '#333', fontWeight: '500', fontSize: '1rem' }}>Pending Jobs</div>
                                <div className="stat-value">{analytics.pendingJobs || 0}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label" style={{ color: '#333', fontWeight: '500', fontSize: '1rem' }}>Pending Applications</div>
                                <div className="stat-value">{analytics.pendingApplications || 0}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label" style={{ color: '#333', fontWeight: '500', fontSize: '1rem' }}>Active Companies</div>
                                <div className="stat-value">{analytics.activeCompanies || analytics.totalCompanies}</div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>Job Categories</h3>
                        <div className="categories-list">
                            {analytics.topCategories.map((category, index) => (
                                <div key={index} className="category-item">
                                    <span className="category-name">{category.name}</span>
                                    <div className="category-bar">
                                        <div
                                            className="category-fill"
                                            style={{ width: `${category.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="category-count">{category.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                    <h3>Recent Platform Activity</h3>
                    <div className="activity-list">
                        {analytics.recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">
                                    <i className={`fas ${activity.icon}`}></i>
                                </div>
                                <div className="activity-content">
                                    <p>{activity.description}</p>
                                    <small>{activity.timestamp}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;