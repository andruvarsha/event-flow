import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import {
    Calendar, MapPin, Users, Ticket, TrendingUp, Plus, Search, Edit2, Trash2, X,
    GraduationCap, BarChart3, Award, Settings, LogOut, CheckCircle, Star, Clock,
    BookOpen, QrCode, ArrowRight, Bell, Eye, ChevronRight
} from 'lucide-react';

import ManageEventsTab from '../../components/admin/ManageEventsTab';
import StudentsTab from '../../components/admin/StudentsTab';
import ReportsTab from '../../components/admin/ReportsTab';
import SampleCertificate from '../../components/common/SampleCertificate';
import './Dashboard.css';

const Dashboard = () => {
    const { user, setUser, logout } = useAuth();
    const { events, myRegistrations, registerForEvent, isRegistered } = useEvents();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isRegistering, setIsRegistering] = useState(null);

    // ─── Profile form state ───
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        department: user?.department || '',
        semester: user?.semester || '',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileError, setProfileError] = useState('');

    // ─── Password form state ───
    const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
    const [isChangingPwd, setIsChangingPwd] = useState(false);
    const [pwdChanged, setPwdChanged] = useState(false);
    const [pwdError, setPwdError] = useState('');

    // ─── Certificate settings state ───
    const [certDisplayName, setCertDisplayName] = useState(user?.name || '');
    const [showSampleCerts, setShowSampleCerts] = useState(true);

    const MOCK_CERTIFICATES = [
        {
            id: 'CERT-2023-FSD-092',
            title: 'Full-Stack Development Mastery',
            date: 'December 12, 2023',
            issuer: 'EventFlow Academy'
        },
        {
            id: 'CERT-2024-UIX-114',
            title: 'UI/UX Design Principles',
            date: 'January 05, 2024',
            issuer: 'Design Studio X'
        },
        {
            id: 'CERT-2024-CYS-552',
            title: 'Cybersecurity Essentials',
            date: 'February 10, 2024',
            issuer: 'Global Security Inst.'
        },
        {
            id: 'CERT-2024-AIM-001',
            title: 'Machine Learning Fundamentals',
            date: 'March 01, 2024',
            issuer: 'AI Research Lab'
        }
    ];

    const [downloadingCert, setDownloadingCert] = useState(null);
    const [viewingCert, setViewingCert] = useState(null);
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [selectedTicketEvent, setSelectedTicketEvent] = useState(null);

    if (!user) return (
        <div className="dash-login-prompt">
            <div className="prompt-card glass-panel">
                <GraduationCap size={48} />
                <h2>Access Your Dashboard</h2>
                <p>Login with your university credentials to manage events and track registrations.</p>
                <Link to="/auth"><Button variant="primary" size="lg">Login Now</Button></Link>
            </div>
        </div>
    );

    // ─── Derived Stats ───
    const attendedRegistrations = myRegistrations.filter(r => r.status === 'attended');
    const attendedCount = attendedRegistrations.length;
    const certificateCount = attendedCount;
    const pointsEarned = attendedCount * 40;

    const handleQuickRegister = async (eventId) => {
        setIsRegistering(eventId);
        try {
            await registerForEvent(eventId);
        } catch (err) {
            console.error('Registration failed:', err);
        } finally {
            setIsRegistering(null);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        setProfileError('');
        try {
            const updated = await api.updateProfile(profileForm);
            // Sync auth context and localStorage
            const updatedUser = { ...user, ...updated, id: updated._id || updated.id };
            setUser(updatedUser);
            localStorage.setItem('eventflow_user', JSON.stringify(updatedUser));
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err) {
            setProfileError(err.message || 'Failed to save profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        setIsChangingPwd(true);
        setPwdError('');
        try {
            if (!pwdForm.currentPassword || !pwdForm.newPassword) {
                throw new Error('Please fill in both password fields');
            }
            await api.changePassword(pwdForm.currentPassword, pwdForm.newPassword);
            setPwdChanged(true);
            setPwdForm({ currentPassword: '', newPassword: '' });
            setTimeout(() => setPwdChanged(false), 3000);
        } catch (err) {
            setPwdError(err.message || 'Failed to change password');
        } finally {
            setIsChangingPwd(false);
        }
    };

    const handleViewCert = (certData) => {
        setViewingCert(certData);
    };

    const handleDownloadCert = (id) => {
        setDownloadingCert(id);
        setTimeout(() => {
            setDownloadingCert(null);
        }, 1500);
    };

    const myEvents = events.filter(e => isRegistered(e.id));
    const availableEvents = events.filter(e => !isRegistered(e.id));

    /* ─── Sidebar Nav Items ─── */
    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'my-events', label: 'My Events', icon: Ticket },
        { id: 'browse', label: 'Quick Register', icon: Plus },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const adminSidebarItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'manage-events', label: 'Manage Events', icon: Calendar },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'reports', label: 'Reports', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const navItems = user.role === 'admin' ? adminSidebarItems : sidebarItems;

    const handleLogout = () => {
        logout();
        navigate('/auth', { replace: true });
    };

    return (
        <div className="dashboard-layout">
            {/* ─── Top Header Banner ─── */}
            <div className="dash-header-banner">
                <div className="dash-header-top">
                    <div className="dash-header-profile">
                        <div className="dash-avatar-ring">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt="Avatar"
                                className="dash-header-avatar"
                            />
                        </div>
                        <div className="dash-header-info">
                            <h2 className="dash-header-name">
                                {user.role === 'admin' ? 'Admin Dashboard' : `Welcome back, `}
                                {user.role !== 'admin' && <span style={{ color: '#a855f7' }}>{user.name}</span>}
                            </h2>
                            <p className="dash-header-role">
                                {user.role === 'admin'
                                    ? 'Administrator • Platform Management'
                                    : `${user.department || 'Student'} • ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
                                }
                            </p>
                        </div>
                    </div>
                    

                </div>

                <nav className="dash-horizontal-nav">
                    <div className="nav-scroll-container">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`dash-nav-tab ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon size={16} />
                                <span>{item.label}</span>
                                {activeTab === item.id && <motion.div layoutId="dashTabIndicator" className="dash-tab-indicator" />}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* ─── Main Content ─── */}
            < main className="dash-main" >

                <div className="dash-content">
                    <AnimatePresence mode="wait">
                        {/* ─── STUDENT: Overview Tab ─── */}
                        {activeTab === 'overview' && user.role !== 'admin' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                {/* Stats Row */}
                                <div className="stats-row">
                                    <div className="stat-card-v2">
                                        <div className="stat-icon-wrap indigo"><Ticket size={22} /></div>
                                        <div className="stat-info">
                                            <span className="stat-label">Registered Events</span>
                                            <span className="stat-value">{myEvents.length}</span>
                                        </div>
                                    </div>
                                    <div className="stat-card-v2">
                                        <div className="stat-icon-wrap emerald"><CheckCircle size={22} /></div>
                                        <div className="stat-info">
                                            <span className="stat-label">Attended</span>
                                            <span className="stat-value">{attendedCount}</span>
                                        </div>
                                    </div>
                                    <div className="stat-card-v2">
                                        <div className="stat-icon-wrap amber"><Award size={22} /></div>
                                        <div className="stat-info">
                                            <span className="stat-label">Certificates</span>
                                            <span className="stat-value">{certificateCount}</span>
                                        </div>
                                    </div>
                                    <div className="stat-card-v2">
                                        <div className="stat-icon-wrap rose"><Star size={22} /></div>
                                        <div className="stat-info">
                                            <span className="stat-label">Points Earned</span>
                                            <span className="stat-value">{pointsEarned}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Two-Column: Upcoming + Quick Register */}
                                <div className="dash-two-col">
                                    <section className="dash-section">
                                        <div className="section-head">
                                            <h2><Calendar size={20} /> Upcoming Events</h2>
                                            <button className="see-all" onClick={() => setActiveTab('my-events')}>See All <ChevronRight size={14} /></button>
                                        </div>
                                        <div className="upcoming-list">
                                            {myEvents.slice(0, 3).map((event, i) => (
                                                <div className="upcoming-card" key={event.id}>
                                                    <div className="upcoming-date">
                                                        <span className="up-day">{event.date.split('-')[2]}</span>
                                                        <span className="up-month">{new Date(event.date).toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                                                    </div>
                                                    <div className="upcoming-info">
                                                        <h4>{event.title}</h4>
                                                        <div className="upcoming-meta">
                                                            <span><Clock size={12} /> {event.time}</span>
                                                            <span><MapPin size={12} /> {event.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="upcoming-status">
                                                        <span className="badge-confirmed"><CheckCircle size={14} /> Confirmed</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {myEvents.length === 0 && (
                                                <div className="empty-state">
                                                    <BookOpen size={32} />
                                                    <p>No registered events yet.</p>
                                                    <Button variant="primary" size="sm" onClick={() => setActiveTab('browse')}>Browse Events</Button>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section className="dash-section">
                                        <div className="section-head">
                                            <h2><Plus size={20} /> Quick Register</h2>
                                            <Link to="/events" className="see-all">All Events <ChevronRight size={14} /></Link>
                                        </div>
                                        <div className="quick-register-list">
                                            {availableEvents.slice(0, 3).map(event => (
                                                <div className="qr-card" key={event.id}>
                                                    <div className="qr-img-wrap">
                                                        <img src={event.image} alt={event.title} className="qr-img" />
                                                    </div>
                                                    <div className="qr-info">
                                                        <span className="qr-cat">{event.category}</span>
                                                        <h4>{event.title}</h4>
                                                        <span className="qr-date"><Calendar size={12} /> {event.date}</span>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="qr-btn"
                                                        isLoading={isRegistering === event.id}
                                                        onClick={() => handleQuickRegister(event.id)}
                                                    >
                                                        Register
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STUDENT: My Events Tab ─── */}
                        {activeTab === 'my-events' && (
                            <motion.div key="my-events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="section-head">
                                    <h2><Ticket size={20} /> My Registered Events ({myEvents.length})</h2>
                                </div>
                                <div className="my-events-grid">
                                    {myEvents.map(event => (
                                        <div
                                            className="my-event-card glass-panel"
                                            key={event.id}
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            <div className="mec-image">
                                                <img src={event.image} alt={event.title} />
                                                <span className="mec-badge">{event.category}</span>
                                            </div>
                                            <div className="mec-body">
                                                <h3>{event.title}</h3>
                                                <div className="mec-meta">
                                                    <span><Calendar size={14} /> {event.date}</span>
                                                    <span><Clock size={14} /> {event.time}</span>
                                                    <span><MapPin size={14} /> {event.location}</span>
                                                </div>
                                                <div className="mec-footer">
                                                    <span className="badge-confirmed"><CheckCircle size={14} /> Confirmed</span>
                                                    <div className="mec-actions">
                                                        <Link to={`/events/${event.id}`} onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
                                                        </Link>
                                                        <Button variant="ghost" size="sm" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTicketEvent(event);
                                                            setTicketModalOpen(true);
                                                        }}><QrCode size={14} /> Ticket</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {myEvents.length === 0 && (
                                        <div className="empty-state">
                                            <BookOpen size={32} />
                                            <p>You haven't registered for any events yet.</p>
                                            <Button variant="primary" size="sm" onClick={() => setActiveTab('browse')}>Browse Events</Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STUDENT: Browse / Quick Register Tab ─── */}
                        {activeTab === 'browse' && (
                            <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="section-head">
                                    <h2><Plus size={20} /> Quick Register for Events</h2>
                                </div>
                                <p className="section-desc">Register for upcoming events with a single click.</p>
                                <div className="browse-grid">
                                    {availableEvents.slice(0, 9).map(event => (
                                        <div className="browse-card glass-panel" key={event.id}>
                                            <img src={event.image} alt={event.title} className="browse-img" />
                                            <div className="browse-body">
                                                <span className="browse-cat">{event.category}</span>
                                                <h4>{event.title}</h4>
                                                <div className="browse-meta">
                                                    <span><Calendar size={12} /> {event.date}</span>
                                                    <span><MapPin size={12} /> {event.location}</span>
                                                </div>
                                                <div className="browse-capacity">
                                                    <div className="cap-bar"><div className="cap-fill" style={{ width: `${(event.registered / event.capacity) * 100}%` }}></div></div>
                                                    <span>{event.registered}/{event.capacity} spots</span>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="w-full"
                                                    isLoading={isRegistering === event.id}
                                                    onClick={() => handleQuickRegister(event.id)}
                                                >
                                                    Register Now <ArrowRight size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Certificates Tab ─── */}
                        {activeTab === 'certificates' && (
                            <motion.div key="certs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="section-head">
                                    <h2><Award size={20} /> My Certificates</h2>
                                    <div className="section-actions">
                                        <Button variant="outline" size="sm" onClick={() => setActiveTab('browse')}>
                                            Earn More <ArrowRight size={14} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="certs-stats-row">
                                    <div className="cert-stat-item">
                                        <span className="cert-stat-val">{attendedCount}</span>
                                        <span className="cert-stat-lbl">From Events</span>
                                    </div>
                                    <div className="cert-stat-sep"></div>
                                    <div className="cert-stat-item">
                                        <span className="cert-stat-val">{user.certificates?.length || 0}</span>
                                        <span className="cert-stat-lbl">Manual Entries</span>
                                    </div>
                                </div>

                                <div className="certs-grid">
                                    {/* 1. Official Event Certificates (Attended Registrations) */}
                                    {attendedRegistrations.map((reg, i) => {
                                        const eventName = reg.event?.title || 'Event Achievement';
                                        const eventDate = reg.event?.date
                                            ? new Date(reg.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'N/A';
                                        return (
                                            <div className="cert-card-v3 glass-panel" key={reg._id || `event-cert-${i}`}>
                                                <div className="cert-type-tag">Official Event</div>
                                                <div className="cert-visual">
                                                    <Award size={32} className="cert-icon-anim" />
                                                    <div className="cert-glow"></div>
                                                </div>
                                                <div className="cert-info-v3">
                                                    <h4>{eventName}</h4>
                                                    <div className="cert-meta-v3">
                                                        <span><Calendar size={12} /> {eventDate}</span>
                                                        <span><Ticket size={12} /> ID: {reg._id?.substring(reg._id.length - 8).toUpperCase() || 'OFFICIAL'}</span>
                                                    </div>
                                                </div>
                                                <Button variant="primary" size="sm" className="w-full" onClick={() => handleViewCert({
                                                    studentName: user.name,
                                                    eventName: eventName,
                                                    date: eventDate,
                                                    certificateId: reg._id?.substring(reg._id.length - 8).toUpperCase() || 'OFFICIAL-2024'
                                                })}>
                                                    View Certificate
                                                </Button>
                                            </div>
                                        );
                                    })}

                                    {/* 2. Manual/Uploaded Certificates */}
                                    {user.certificates?.map((cert, i) => (
                                        <div className="cert-card-v3 glass-panel manual" key={cert._id || `manual-cert-${i}`}>
                                            <div className="cert-type-tag manual">External</div>
                                            <div className="cert-visual">
                                                <BookOpen size={32} />
                                                <div className="cert-glow blue"></div>
                                            </div>
                                            <div className="cert-info-v3">
                                                <h4>{cert.title}</h4>
                                                <div className="cert-meta-v3">
                                                    <span><Calendar size={12} /> {new Date(cert.date).toLocaleDateString()}</span>
                                                    <span><CheckCircle size={12} /> Verified</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(cert.url, '_blank')}>
                                                View Document <Eye size={14} />
                                            </Button>
                                        </div>
                                    ))}

                                    {attendedRegistrations.length === 0 && (!user.certificates || user.certificates.length === 0) && (
                                        <div className="empty-state-v2">
                                            <div className="empty-icon-ring"><Award size={40} /></div>
                                            <h3>No Certificates Found</h3>
                                            <p>Complete registered events or upload external achievements to see them here.</p>
                                            <Button variant="primary" onClick={() => setActiveTab('browse')}>Browse Upcoming Events</Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Settings Tab ─── */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="section-head"><h2><Settings size={20} /> Account Settings</h2></div>

                                {/* ── Profile Information ── */}
                                <div className="settings-section">
                                    <h3 className="settings-section-title"><Users size={16} /> Profile Information</h3>
                                    <div className="settings-card glass-panel">
                                        <div className="settings-avatar-row">
                                            <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt="Avatar"
                                                className="settings-avatar"
                                            />
                                            <div className="settings-avatar-actions">
                                                <Button variant="outline" size="sm">Change Photo</Button>
                                                <span className="settings-hint">JPG, PNG or GIF. Max 2MB.</span>
                                            </div>
                                        </div>

                                        <div className="settings-grid">
                                            <div className="settings-row">
                                                <label>Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                                    className="settings-input"
                                                />
                                            </div>
                                            <div className="settings-row">
                                                <label>Email Address</label>
                                                <input type="email" defaultValue={user.email} className="settings-input" readOnly />
                                                <span className="settings-hint">Managed by university. Contact admin to change.</span>
                                            </div>
                                            <div className="settings-row">
                                                <label>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={profileForm.phone}
                                                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                                    placeholder="+91 00000 00000"
                                                    className="settings-input"
                                                />
                                            </div>
                                            <div className="settings-row">
                                                <label>Department</label>
                                                <input
                                                    type="text"
                                                    value={profileForm.department}
                                                    onChange={(e) => setProfileForm(p => ({ ...p, department: e.target.value }))}
                                                    className="settings-input"
                                                />
                                            </div>
                                            {user.role !== 'admin' && (
                                                <>
                                                    <div className="settings-row">
                                                        <label>Student ID</label>
                                                        <input type="text" defaultValue={user.studentId || 'N/A'} className="settings-input" readOnly />
                                                    </div>
                                                    <div className="settings-row">
                                                        <label>Semester</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.semester}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, semester: e.target.value }))}
                                                            className="settings-input"
                                                        />
                                                    </div>
                                                    <div className="settings-row">
                                                        <label>Enrollment Year</label>
                                                        <input type="text" defaultValue={user.enrollmentYear || '2024'} className="settings-input" readOnly />
                                                    </div>
                                                    <div className="settings-row">
                                                        <label>Role</label>
                                                        <input type="text" defaultValue="Student" className="settings-input" readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {profileError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{profileError}</p>}
                                        <Button variant="primary" onClick={handleSaveProfile} disabled={isSavingProfile}>
                                            {isSavingProfile ? 'Saving...' : profileSaved ? '✓ Saved!' : 'Save Profile'}
                                        </Button>
                                    </div>
                                </div>

                                {/* ── Notifications & Security — side by side ── */}
                                <div className="settings-two-col">
                                    <div className="settings-section">
                                        <h3 className="settings-section-title"><Bell size={16} /> Notifications</h3>
                                        <div className="settings-card glass-panel">
                                            <div className="settings-toggle-row">
                                                <div className="toggle-info">
                                                    <span className="toggle-label">Email Notifications</span>
                                                    <span className="toggle-desc">Event reminders and updates via email</span>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            <div className="settings-toggle-row">
                                                <div className="toggle-info">
                                                    <span className="toggle-label">Push Notifications</span>
                                                    <span className="toggle-desc">Browser alerts for upcoming events</span>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            <div className="settings-toggle-row">
                                                <div className="toggle-info">
                                                    <span className="toggle-label">Event Recommendations</span>
                                                    <span className="toggle-desc">Personalized suggestions based on interests</span>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="settings-section">
                                        <h3 className="settings-section-title"><Eye size={16} /> Security</h3>
                                        <div className="settings-card glass-panel">
                                            <div className="settings-row" style={{ marginBottom: '1rem' }}>
                                                <label>Current Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter current password"
                                                    value={pwdForm.currentPassword}
                                                    onChange={(e) => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                    className="settings-input"
                                                />
                                            </div>
                                            <div className="settings-row" style={{ marginBottom: '1.25rem' }}>
                                                <label>New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    value={pwdForm.newPassword}
                                                    onChange={(e) => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
                                                    className="settings-input"
                                                />
                                            </div>
                                            {pwdError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{pwdError}</p>}
                                            <Button variant="primary" size="sm" onClick={handleChangePassword} disabled={isChangingPwd}>
                                                {isChangingPwd ? 'Updating...' : pwdChanged ? '✓ Updated!' : 'Change Password'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Certificate Preview & Settings ── */}
                                <div className="settings-section full-width">
                                    <h3 className="settings-section-title"><Award size={16} /> Certificate Settings (Sample Data)</h3>
                                    <div className="settings-card glass-panel cert-settings-card">
                                        <div className="settings-two-col">
                                            <div className="cert-config-panel">
                                                <div className="settings-row">
                                                    <label>Display Name on Certificates</label>
                                                    <input 
                                                        type="text" 
                                                        value={certDisplayName}
                                                        onChange={(e) => setCertDisplayName(e.target.value)}
                                                        className="settings-input" 
                                                        placeholder="Enter your full name"
                                                    />
                                                    <span className="settings-hint">This name will be printed on all future certificates.</span>
                                                </div>
                                                <div className="settings-toggle-row">
                                                    <div className="toggle-info">
                                                        <span className="toggle-label">Include Honors/Badges</span>
                                                        <span className="toggle-desc">Show special achievement icons if applicable</span>
                                                    </div>
                                                    <label className="toggle-switch">
                                                        <input type="checkbox" defaultChecked />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                                <div className="settings-toggle-row">
                                                    <div className="toggle-info">
                                                        <span className="toggle-label">Public Certificate Page</span>
                                                        <span className="toggle-desc">Generate a link to share your achievements</span>
                                                    </div>
                                                    <label className="toggle-switch">
                                                        <input type="checkbox" />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                                <Button variant="primary" size="sm" onClick={() => alert('Settings Saved!')} style={{ marginTop: '1rem' }}>
                                                    Save Certificate Preferences
                                                </Button>
                                            </div>

                                            <div className="cert-preview-panel">
                                                <div className="preview-label">Live Preview</div>
                                                <SampleCertificate 
                                                    studentName={certDisplayName} 
                                                    eventName="Annual Design Innovation Summit"
                                                    date="April 05, 2024"
                                                    certificateId="SAMP-PRE-8842"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── ADMIN: Overview Tab ─── */}
                        {activeTab === 'overview' && user.role === 'admin' && (
                            <motion.div key="admin-overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="stats-row">
                                    <div className="stat-card-v2"><div className="stat-icon-wrap indigo"><Users size={22} /></div><div className="stat-info"><span className="stat-label">Total Students</span><span className="stat-value">—</span></div></div>
                                    <div className="stat-card-v2"><div className="stat-icon-wrap emerald"><Calendar size={22} /></div><div className="stat-info"><span className="stat-label">Active Events</span><span className="stat-value">{events.length}</span></div></div>
                                    <div className="stat-card-v2"><div className="stat-icon-wrap amber"><BarChart3 size={22} /></div><div className="stat-info"><span className="stat-label">Registrations</span><span className="stat-value">—</span></div></div>
                                    <div className="stat-card-v2"><div className="stat-icon-wrap rose"><TrendingUp size={22} /></div><div className="stat-info"><span className="stat-label">Engagement</span><span className="stat-value">—</span></div></div>
                                </div>

                                <section className="dash-section">
                                    <div className="section-head">
                                        <h2>Recent Events</h2>
                                        <Button variant="primary" size="sm" onClick={() => setActiveTab('manage-events')}><Plus size={14} /> Create Event</Button>
                                    </div>
                                    <div className="admin-table-wrap glass-panel">
                                        <table className="admin-table">
                                            <thead>
                                                <tr><th>Event Name</th><th>Date</th><th>Category</th><th>Registrations</th><th>Status</th><th>Action</th></tr>
                                            </thead>
                                            <tbody>
                                                {events.slice(0, 8).map(event => (
                                                    <tr key={event.id}>
                                                        <td className="td-event"><img src={event.image} alt="" className="td-img" />{event.title}</td>
                                                        <td>{event.date}</td>
                                                        <td><span className="td-cat">{event.category}</span></td>
                                                        <td>
                                                            <div className="td-bar-wrap">
                                                                <div className="td-bar"><div className="td-fill" style={{ width: `${(event.registered / event.capacity) * 100}%` }}></div></div>
                                                                <span>{event.registered}/{event.capacity}</span>
                                                            </div>
                                                        </td>
                                                        <td><span className="badge-active">Active</span></td>
                                                        <td><Link to={`/events/${event.id}`}><Button variant="ghost" size="sm"><Eye size={14} /></Button></Link></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* ─── ADMIN: Manage Events Tab ─── */}
                        {activeTab === 'manage-events' && user.role === 'admin' && (
                            <ManageEventsTab />
                        )}

                        {/* ─── ADMIN: Students Tab ─── */}
                        {activeTab === 'students' && user.role === 'admin' && (
                            <StudentsTab />
                        )}

                        {/* ─── ADMIN: Reports Tab ─── */}
                        {activeTab === 'reports' && user.role === 'admin' && (
                            <ReportsTab />
                        )}
                    </AnimatePresence>
                </div>
            </main >

            {/* ─── Ticket Modal ─── */}
            {/* ─── Certificate View Modal ─── */}
            <AnimatePresence>
                {viewingCert && (
                    <motion.div 
                        className="modal-overlay" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingCert(null)}
                    >
                        <motion.div 
                            className="cert-modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close-btn" onClick={() => setViewingCert(null)}>
                                <X size={24} />
                            </button>
                            <SampleCertificate 
                                studentName={viewingCert.studentName}
                                eventName={viewingCert.eventName}
                                date={viewingCert.date}
                                certificateId={viewingCert.certificateId}
                                isSample={false}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {ticketModalOpen && selectedTicketEvent && (
                    <div 
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000, padding: '1rem'
                        }}
                        onClick={() => setTicketModalOpen(false)}
                    >
                        <motion.div
                            className="glass-panel"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'rgba(20, 20, 30, 0.95)',
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                maxWidth: '350px',
                                width: '100%',
                                position: 'relative',
                                textAlign: 'center'
                            }}
                        >
                            <button 
                                onClick={() => setTicketModalOpen(false)} 
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                            <h3 style={{ marginBottom: '0.5rem', paddingRight: '1.5rem' }}>{selectedTicketEvent.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <span><Calendar size={14} style={{ verticalAlign: '-2px', marginRight: '4px' }}/>{selectedTicketEvent.date}</span>
                                <span style={{ marginLeft: '1rem' }}><Clock size={14} style={{ verticalAlign: '-2px', marginRight: '4px' }}/>{selectedTicketEvent.time}</span>
                            </p>
                            <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                                <QrCode size={180} color="#000" strokeWidth={1.5} />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
                                TICKET #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Bottom Left Logout */}
            <button 
                type="button" 
                className="dash-logout-btn" 
                onClick={handleLogout}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
            >
                <LogOut size={16} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Dashboard;
