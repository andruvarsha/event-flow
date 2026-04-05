import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { TrendingUp, BarChart3, Users, Calendar, Download } from 'lucide-react';
import Button from '../ui/Button';

const ReportsTab = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.getReports();
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading reports...</div>;
    }

    if (!reports) return null;

    return (
        <motion.div key="admin-reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="section-head" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><TrendingUp size={20} /> Analytics & Reports</h2>
                <Button variant="outline" size="sm"><Download size={14} /> Export CSV</Button>
            </div>

            {/* Overview Stats */}
            <div className="stats-row" style={{ marginBottom: '2rem' }}>
                <div className="stat-card-v2">
                    <div className="stat-icon-wrap indigo"><Users size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Students</span>
                        <span className="stat-value">{reports.overview.totalStudents}</span>
                    </div>
                </div>
                <div className="stat-card-v2">
                    <div className="stat-icon-wrap emerald"><Calendar size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Events</span>
                        <span className="stat-value">{reports.overview.activeEvents}</span>
                    </div>
                </div>
                <div className="stat-card-v2">
                    <div className="stat-icon-wrap amber"><BarChart3 size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Registrations</span>
                        <span className="stat-value">{reports.overview.totalRegistrations}</span>
                    </div>
                </div>
                <div className="stat-card-v2">
                    <div className="stat-icon-wrap rose"><TrendingUp size={22} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Engagement</span>
                        <span className="stat-value">{reports.overview.engagementGrowth}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Attendance by Category */}
                <div className="admin-table-wrap glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Attendance by Category
                    </h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th style={{ textAlign: 'right' }}>Attendees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.attendanceByCategory.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: '500' }}>{item.category}</td>
                                    <td style={{ textAlign: 'right' }}>{item.attendees}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Departmental Engagement */}
                <div className="admin-table-wrap glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Departmental Engagement
                    </h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th style={{ textAlign: 'right' }}>Enrolled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.departmentalEngagement.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: '500' }}>{item.name}</td>
                                    <td style={{ textAlign: 'right' }}>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Certificate Trends */}
                <div className="admin-table-wrap glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Certificate Issuance Trends
                    </h3>
                    <div style={{ marginTop: '1rem' }}>
                        {reports.certificateTrends.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th style={{ textAlign: 'right' }}>Issued</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.certificateTrends.map((item, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: '500' }}>{item.month}</td>
                                            <td style={{ textAlign: 'right' }}>{item.certificates}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                No certificates issued yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="admin-table-wrap glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Live Registrations
                    </h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Event</th>
                                <th style={{ textAlign: 'right' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.recentRegistrations.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: '500' }}>{item.studentName}</td>
                                    <td>{item.eventTitle}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{new Date(item.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsTab;
