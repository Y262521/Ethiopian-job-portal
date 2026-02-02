import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DatabaseDashboard.css';

const DatabaseDashboard = () => {
    const [dbStats, setDbStats] = useState({
        tables: [],
        totalRecords: 0,
        databaseSize: '0 MB',
        lastBackup: null,
        loading: true
    });
    const [tableData, setTableData] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.type !== 'admin') {
            navigate('/admin');
            return;
        }

        fetchDatabaseStats();
    }, [navigate]);

    const fetchDatabaseStats = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching database statistics...');

            // Fetch database overview
            const response = await fetch('http://localhost:5000/api/admin/database/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Database stats loaded:', data);
                setDbStats(data);
            } else {
                console.error('❌ Failed to fetch database stats');
                // Set mock data if API fails
                setDbStats({
                    tables: [
                        { name: 'users', records: 12, size: '2.1 MB' },
                        { name: 'employers', records: 8, size: '1.8 MB' },
                        { name: 'jobs', records: 25, size: '4.2 MB' },
                        { name: 'job_applications', records: 45, size: '3.5 MB' },
                        { name: 'saved_jobs', records: 18, size: '0.8 MB' },
                        { name: 'job_alerts', records: 12, size: '0.6 MB' },
                        { name: 'payments', records: 6, size: '0.4 MB' },
                        { name: 'notifications', records: 32, size: '1.2 MB' }
                    ],
                    totalRecords: 158,
                    databaseSize: '14.6 MB',
                    lastBackup: new Date().toISOString(),
                    loading: false
                });
            }
        } catch (error) {
            console.error('❌ Error fetching database stats:', error);
            // Set mock data on error
            setDbStats({
                tables: [
                    { name: 'users', records: 12, size: '2.1 MB' },
                    { name: 'employers', records: 8, size: '1.8 MB' },
                    { name: 'jobs', records: 25, size: '4.2 MB' },
                    { name: 'job_applications', records: 45, size: '3.5 MB' },
                    { name: 'saved_jobs', records: 18, size: '0.8 MB' },
                    { name: 'job_alerts', records: 12, size: '0.6 MB' },
                    { name: 'payments', records: 6, size: '0.4 MB' },
                    { name: 'notifications', records: 32, size: '1.2 MB' }
                ],
                totalRecords: 158,
                databaseSize: '14.6 MB',
                lastBackup: new Date().toISOString(),
                loading: false
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async (tableName) => {
        try {
            console.log(`🔍 Fetching data for table: ${tableName}`);

            const response = await fetch(`http://localhost:5000/api/admin/database/table/${tableName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Table data loaded for ${tableName}:`, data);
                setTableData(prev => ({
                    ...prev,
                    [tableName]: data
                }));
            } else {
                console.error(`❌ Failed to fetch data for table: ${tableName}`);
            }
        } catch (error) {
            console.error(`❌ Error fetching table data for ${tableName}:`, error);
        }
    };

    const handleTableClick = (tableName) => {
        setSelectedTable(tableName);
        if (!tableData[tableName]) {
            fetchTableData(tableName);
        }
    };

    const handleBackup = async () => {
        try {
            console.log('🔄 Initiating database backup...');

            const response = await fetch('http://localhost:5000/api/admin/database/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                alert(`✅ Database backup completed successfully!\nFile: ${result.filename}`);
                fetchDatabaseStats(); // Refresh stats
            } else {
                alert('❌ Database backup failed. Please try again.');
            }
        } catch (error) {
            console.error('❌ Error during backup:', error);
            alert('❌ Database backup failed. Please check the console for details.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    const renderTableData = (tableName, data) => {
        if (!data || !data.length) {
            return <p>No data available for this table.</p>;
        }

        const columns = Object.keys(data[0]);

        return (
            <div className="table-data">
                <div className="table-header">
                    <h4>Table: {tableName}</h4>
                    <span className="record-count">{data.length} records</span>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map(column => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 10).map((row, index) => (
                                <tr key={index}>
                                    {columns.map(column => (
                                        <td key={column}>
                                            {typeof row[column] === 'string' && row[column].length > 50
                                                ? `${row[column].substring(0, 50)}...`
                                                : String(row[column] || '')
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length > 10 && (
                        <p className="table-note">Showing first 10 records of {data.length} total</p>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="database-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading database dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="database-dashboard">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-database"></i>
                            Database Dashboard
                        </h1>
                        <p>Monitor and manage your Ethiopia Job Portal database</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleBackup}
                        >
                            <i className="fas fa-download"></i>
                            Create Backup
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back to Admin
                        </button>
                    </div>
                </div>

                {/* Database Overview */}
                <div className="db-overview">
                    <div className="overview-cards">
                        <div className="overview-card">
                            <div className="card-icon">
                                <i className="fas fa-table"></i>
                            </div>
                            <div className="card-content">
                                <h3>{dbStats.tables.length}</h3>
                                <p>Database Tables</p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-icon">
                                <i className="fas fa-list"></i>
                            </div>
                            <div className="card-content">
                                <h3>{dbStats.totalRecords}</h3>
                                <p>Total Records</p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-icon">
                                <i className="fas fa-hdd"></i>
                            </div>
                            <div className="card-content">
                                <h3>{dbStats.databaseSize}</h3>
                                <p>Database Size</p>
                            </div>
                        </div>

                        <div className="overview-card">
                            <div className="card-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="card-content">
                                <h3>{formatDate(dbStats.lastBackup)}</h3>
                                <p>Last Backup</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables List */}
                <div className="tables-section">
                    <h2>Database Tables</h2>
                    <div className="tables-grid">
                        {dbStats.tables.map((table) => (
                            <div
                                key={table.name}
                                className={`table-card ${selectedTable === table.name ? 'active' : ''}`}
                                onClick={() => handleTableClick(table.name)}
                            >
                                <div className="table-icon">
                                    <i className="fas fa-table"></i>
                                </div>
                                <div className="table-info">
                                    <h3>{table.name}</h3>
                                    <div className="table-stats">
                                        <span className="record-count">
                                            <i className="fas fa-list"></i>
                                            {table.records} records
                                        </span>
                                        <span className="table-size">
                                            <i className="fas fa-hdd"></i>
                                            {table.size}
                                        </span>
                                    </div>
                                </div>
                                <div className="table-arrow">
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Table Data Display */}
                {selectedTable && (
                    <div className="table-details">
                        <div className="details-header">
                            <h2>Table Details: {selectedTable}</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedTable(null)}
                            >
                                <i className="fas fa-times"></i>
                                Close
                            </button>
                        </div>

                        {tableData[selectedTable] ? (
                            renderTableData(selectedTable, tableData[selectedTable])
                        ) : (
                            <div className="loading-table">
                                <div className="loading-spinner"></div>
                                <p>Loading table data...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Database Actions */}
                <div className="db-actions">
                    <h2>Database Actions</h2>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={handleBackup}>
                            <i className="fas fa-download"></i>
                            <span>Create Backup</span>
                        </button>
                        <button className="action-btn" onClick={fetchDatabaseStats}>
                            <i className="fas fa-sync"></i>
                            <span>Refresh Stats</span>
                        </button>
                        <button className="action-btn" onClick={() => alert('Database optimization feature coming soon!')}>
                            <i className="fas fa-cogs"></i>
                            <span>Optimize Database</span>
                        </button>
                        <button className="action-btn" onClick={() => alert('Database maintenance feature coming soon!')}>
                            <i className="fas fa-wrench"></i>
                            <span>Maintenance</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseDashboard;