import React, { useState, useEffect } from 'react';
import { getAllPayments, confirmPayment } from '../services/api';
import './PaymentManagement.css';

const PaymentManagement = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [summaryStats, setSummaryStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchPayments();
        fetchSummaryStats();
    }, [activeTab, fetchPayments]);

    const fetchSummaryStats = async () => {
        try {
            // Fetch counts for all statuses
            const allResponse = await getAllPayments('all', 1000, 0);
            if (allResponse.success) {
                const allPayments = allResponse.payments || [];
                const stats = {
                    total: allPayments.length,
                    pending: allPayments.filter(p => p.status === 'pending').length,
                    completed: allPayments.filter(p => p.status === 'completed').length,
                    totalRevenue: allPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
                };
                setSummaryStats(stats);
            }
        } catch (error) {
            console.error('❌ Error fetching summary stats:', error);
        }
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching payments for status:', activeTab);

            const response = await getAllPayments(activeTab, 100, 0);

            if (response.success) {
                console.log('✅ Payments loaded:', response.payments);
                setPayments(response.payments || []);
                setTotalPayments(response.total || 0);
            } else {
                console.error('❌ Failed to fetch payments:', response.error);
                setPayments([]);
                setTotalPayments(0);
            }
        } catch (error) {
            console.error('❌ Error fetching payments:', error);
            setPayments([]);
            setTotalPayments(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentAction = async (paymentId, action) => {
        try {
            const newStatus = action === 'approve' ? 'completed' : 'failed';
            const adminNotes = `Payment ${action}d by admin on ${new Date().toLocaleString()}`;

            console.log(`🔄 ${action}ing payment ${paymentId}...`);

            const response = await confirmPayment(paymentId, newStatus, adminNotes);

            if (response.success) {
                console.log('✅ Payment status updated successfully');

                // Update local state
                setPayments(payments.map(payment =>
                    payment.id === paymentId
                        ? { ...payment, status: newStatus }
                        : payment
                ));

                alert(`Payment ${action}d successfully!`);

                // Refresh the data to get updated counts
                fetchPayments();
                fetchSummaryStats();
            } else {
                console.error('❌ Failed to update payment:', response.error);
                alert(`Failed to ${action} payment: ${response.error}`);
            }
        } catch (error) {
            console.error(`❌ Error ${action}ing payment:`, error);
            alert(`Failed to ${action} payment. Please try again.`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `${amount.toFixed(2)} ETB`;
    };

    const filteredPayments = payments.filter(payment =>
        payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="payment-management">
            <div className="container">
                <div className="page-header">
                    <h1>Payment Management</h1>
                    <p>Approve payments and track revenue</p>
                </div>

                {/* Controls */}
                <div className="management-controls">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Payment Status Tabs */}
                <div className="payment-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <i className="fas fa-clock"></i>
                        Pending ({summaryStats.pending})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <i className="fas fa-check-circle"></i>
                        Completed ({summaryStats.completed})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'failed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('failed')}
                    >
                        <i className="fas fa-times-circle"></i>
                        Failed ({summaryStats.total - summaryStats.pending - summaryStats.completed})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <i className="fas fa-list"></i>
                        All ({summaryStats.total})
                    </button>
                </div>

                {/* Payments Table */}
                <div className="payments-table-container">
                    {loading ? (
                        <div className="loading">
                            <i className="fas fa-spinner fa-spin"></i>
                            Loading payments...
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <div className="table-info">
                                <span>Showing {filteredPayments.length} of {payments.length} payments</span>
                            </div>
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Type</th>
                                        <th>Plan</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Transaction ID</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="no-data">
                                                No payments found matching your criteria
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPayments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td>{payment.id}</td>
                                                <td>
                                                    <div className="user-info">
                                                        <strong>{payment.user_name}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`type-badge ${payment.user_type}`}>
                                                        <i className={`fas ${payment.user_type === 'employer' ? 'fa-building' : 'fa-user'}`}></i>
                                                        {payment.user_type}
                                                    </span>
                                                </td>
                                                <td>{payment.plan_name}</td>
                                                <td>
                                                    <strong className="amount">{formatCurrency(payment.amount)}</strong>
                                                </td>
                                                <td>
                                                    <span className="payment-method">
                                                        {payment.payment_method.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <code className="transaction-id">{payment.transaction_id}</code>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${payment.status}`}>
                                                        <i className={`fas ${payment.status === 'completed' ? 'fa-check-circle' :
                                                            payment.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                                                            }`}></i>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(payment.created_at)}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {payment.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-approve"
                                                                    onClick={() => handlePaymentAction(payment.id, 'approve')}
                                                                    title="Approve Payment"
                                                                >
                                                                    <i className="fas fa-check"></i>
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="btn btn-reject"
                                                                    onClick={() => handlePaymentAction(payment.id, 'reject')}
                                                                    title="Reject Payment"
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            className="btn btn-view"
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
                <div className="payment-summary">
                    <div className="summary-card">
                        <h3>Payment Summary</h3>
                        <div className="summary-stats">
                            <div className="stat-item">
                                <span className="stat-label">Total Payments:</span>
                                <span className="stat-value">{summaryStats.total}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Pending Approval:</span>
                                <span className="stat-value">{summaryStats.pending}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Completed:</span>
                                <span className="stat-value">{summaryStats.completed}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total Revenue:</span>
                                <span className="stat-value">
                                    {formatCurrency(summaryStats.totalRevenue)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentManagement;