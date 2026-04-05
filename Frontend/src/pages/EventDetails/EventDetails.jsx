import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Calendar, Clock, MapPin, CheckCircle, Share2, 
    Activity, Users, Zap, Globe, FileText, ChevronRight, Info
} from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import './EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { registerForEvent, isRegistered } = useEvents();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [activeTab, setActiveTab] = useState('briefing');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await api.getEventById(id);
                setEvent(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            alert('Please login to register');
            return;
        }
        setRegistering(true);
        try {
            await registerForEvent(id);
            const data = await api.getEventById(id);
            setEvent(data);
        } catch (err) {
            alert(err || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    const hasRegistered = isRegistered(id);

    if (loading) return (
        <div className="engine-loading-overlay">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="engine-spinner"
            />
            <p>Initializing Event Engine...</p>
        </div>
    );

    if (!event) return (
        <div className="error-manifest container">
            <h2>ERR_EVENT_NOT_FOUND</h2>
            <Link to="/dashboard"><Button variant="outline">Return to Control</Button></Link>
        </div>
    );

    return (
        <div className="event-engine-v2">
            {/* Command Header (Hero) */}
            <header className="engine-header" style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.85), rgba(10, 10, 15, 0.98)), url(${event.image})` }}>
                <div className="container header-container">
                    <div className="breadcrumb-nav">
                        <Link to="/dashboard" className="nav-token">
                            <ArrowLeft size={14} /> <span>SYSTEM / EVENTS</span>
                        </Link>
                        <div className="header-tags">
                            <span className="tag-node primary">{event.category}</span>
                            {event.registered / event.capacity > 0.8 && <span className="tag-node warning">CRITICAL_CAPACITY</span>}
                        </div>
                    </div>

                    <div className="header-main">
                        <div className="header-title-block">
                            <motion.h1 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="engine-title"
                            >
                                {event.title}
                            </motion.h1>
                            <div className="header-stat-row">
                                <div className="stat-node">
                                    <Calendar size={14} /> <span>{event.date}</span>
                                </div>
                                <div className="stat-node">
                                    <Clock size={14} /> <span>{event.time}</span>
                                </div>
                                <div className="stat-node">
                                    <MapPin size={14} /> <span>{event.venue || event.location || 'MAIN_HQ'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="header-action-module">
                            <div className="status-box glass-card">
                                <div className="capacity-intel">
                                    <div className="intel-row">
                                        <span className="label">REGISTRATION_PULSE</span>
                                        <span className="value">{Math.round((event.registered / event.capacity) * 100)}%</span>
                                    </div>
                                    <div className="engine-progress-bar">
                                        <div className="bar-fill" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
                                    </div>
                                    <p className="intel-subtext">{event.registered} nodes active / {event.capacity} total</p>
                                </div>

                                {!hasRegistered ? (
                                    <Button 
                                        variant="primary" 
                                        className="engine-cta" 
                                        onClick={handleRegister}
                                        isLoading={registering}
                                        disabled={event.registered >= event.capacity}
                                    >
                                        {event.registered >= event.capacity ? 'MANIFEST_FULL' : 'ENGAGE_PROTOCOL'}
                                    </Button>
                                ) : (
                                    <div className="registered-confirmation">
                                        <CheckCircle size={18} />
                                        <span>PROTOCOL_ACTIVE</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Operational Layout */}
            <div className="container engine-content">
                <nav className="engine-tabs">
                    <button className={activeTab === 'briefing' ? 'active' : ''} onClick={() => setActiveTab('briefing')}>
                        <Info size={16} /> BRIEFING
                    </button>
                    <button className={activeTab === 'pipeline' ? 'active' : ''} onClick={() => setActiveTab('pipeline')}>
                        <Zap size={16} /> PIPELINE
                    </button>
                    <button className={activeTab === 'intel' ? 'active' : ''} onClick={() => setActiveTab('intel')}>
                        <Activity size={16} /> ANALYTICS
                    </button>
                </nav>

                <div className="engine-grid">
                    <main className="engine-main-panel">
                        <AnimatePresence mode="wait">
                            {activeTab === 'briefing' && (
                                <motion.section 
                                    key="briefing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="briefing-module"
                                >
                                    <div className="briefing-card glass-card">
                                        <h3>About the Manifest</h3>
                                        <p className="briefing-text">{event.description}</p>
                                        <div className="key-intelligence-grid">
                                            <div className="intel-item">
                                                <Users size={18} />
                                                <div>
                                                    <p className="label">Networking</p>
                                                    <p className="desc">Connect with 500+ attendees</p>
                                                </div>
                                            </div>
                                            <div className="intel-item">
                                                <Zap size={18} />
                                                <div>
                                                    <p className="label">Innovation</p>
                                                    <p className="desc">Cutting-edge sessions</p>
                                                </div>
                                            </div>
                                            <div className="intel-item">
                                                <Globe size={18} />
                                                <div>
                                                    <p className="label">Hybrid</p>
                                                    <p className="desc">Global accessible nodes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            {activeTab === 'pipeline' && (
                                <motion.section 
                                    key="pipeline"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="pipeline-module"
                                >
                                    <div className="pipeline-container glass-card">
                                        <h3>Timeline Flow</h3>
                                        <div className="pipeline-track">
                                            <div className="pipeline-item current">
                                                <div className="item-time">09:00</div>
                                                <div className="item-marker"><div className="marker-core" /></div>
                                                <div className="item-content">
                                                    <h4>Initialization & Logistics</h4>
                                                    <p>Main Hub / Registration Pulse</p>
                                                </div>
                                            </div>
                                            <div className="pipeline-item">
                                                <div className="item-time">10:30</div>
                                                <div className="item-marker"><div className="marker-core" /></div>
                                                <div className="item-content">
                                                    <h4>Core Execution Sync</h4>
                                                    <p>Main Hall / Keynote Data Stream</p>
                                                </div>
                                            </div>
                                            <div className="pipeline-item">
                                                <div className="item-time">13:00</div>
                                                <div className="item-marker"><div className="marker-core" /></div>
                                                <div className="item-content">
                                                    <h4>Network Fusion Session</h4>
                                                    <p>Breakout Nodes / Lunch Intelligence</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>
                    </main>

                    <aside className="engine-aside">
                        <section className="aside-module glass-card">
                            <div className="module-header">
                                <Activity size={16} /> <span>LIVE_INTEL</span>
                            </div>
                            <div className="intel-pulse">
                                <div className="pulse-row">
                                    <span>TRENDING</span>
                                    <span className="trend-up">+12% / hr</span>
                                </div>
                                <div className="pulse-row">
                                    <span>SOCIAL_ACTIVITY</span>
                                    <span>MODERATE</span>
                                </div>
                            </div>
                        </section>

                        <section className="aside-module glass-card mt-md">
                            <div className="module-header">
                                <Users size={16} /> <span>ORGANIZER_ACCESS</span>
                            </div>
                            <div className="organizer-node">
                                <div className="node-avatar">A</div>
                                <div className="node-info">
                                    <p className="node-name">Protocol Team Alpha</p>
                                    <p className="node-status">Verified Agent</p>
                                </div>
                            </div>
                        </section>

                        <button className="share-engine-btn" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('MANIFEST_LINK_COPIED');
                        }}>
                            <Share2 size={16} /> EXPORT_MANIFEST
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

