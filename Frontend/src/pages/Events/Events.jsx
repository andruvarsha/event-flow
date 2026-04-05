import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '../../context/EventContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { Filter, Search, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Events.css';

const CATEGORIES = ['All', 'Academic', 'Technology', 'Sports', 'Cultural', 'Workshop', 'Seminar', 'Club Activity'];

const Events = () => {
    const { events, loading, error, pagination, filters, updateFilters, fetchEvents } = useEvents();

    // Handle Page Change
    const handlePageChange = (newPage) => {
        fetchEvents(newPage, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle Filter Change
    const handleCategoryChange = (category) => {
        updateFilters({ category });
    };

    // Handle Search
    const handleSearch = (e) => {
        updateFilters({ search: e.target.value });
    };

    // Helper to determine event status (Mock logic for UI redesign)
    const getEventStatus = (dateStr) => {
        const eventDate = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { label: 'Past', class: 'status-past' };
        if (diffDays === 0) return { label: 'Live Now', class: 'status-live' };
        if (diffDays <= 3) return { label: 'Filling Fast', class: 'status-urgent' };
        return { label: 'Upcoming', class: 'status-upcoming' };
    };

    return (
        <div className="container events-page-v2">
            <header className="events-hero-section">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hero-content"
                >
                    <h1 className="text-gradient">Explore Pulse</h1>
                    <p className="hero-subtitle">The central nervous system for campus activity.</p>
                </motion.div>

                {/* Insights Row */}
                <div className="events-insights">
                    <div className="insight-chip">
                        <span className="insight-val">{events.length}</span>
                        <span className="insight-label">Active Events</span>
                    </div>
                    <div className="insight-divider" />
                    <div className="insight-chip">
                        <span className="insight-val">3</span>
                        <span className="insight-label">Closing Soon</span>
                    </div>
                </div>
            </header>

            {/* Sticky Command Bar */}
            <nav className="events-command-bar glass-morphism sticky">
                <div className="command-search">
                    <Search size={18} className="search-icon-v2" />
                    <input
                        type="text"
                        placeholder="Filter by title, organizer, or venue..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="command-input"
                    />
                </div>
                
                <div className="command-sep" />

                <div className="category-pills-scroll">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`pill-btn ${filters.category === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="events-main-content">
                {error && (
                    <div className="error-banner">
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="events-v2-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton-card-v2"></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <>
                        <div className="events-v2-grid">
                            {events.map((event, idx) => {
                                const status = getEventStatus(event.date);
                                // Real capacity calculation from model
                                const capPercent = event.capacity 
                                    ? Math.round((event.registered / event.capacity) * 100) 
                                    : 0;
                                
                                return (
                                    <motion.div
                                        key={event._id || event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <div className="event-card-v2 glass-card">
                                            <div className="card-media">
                                                <img 
                                                    src={event.imageUrl || event.image} 
                                                    alt={event.title} 
                                                    loading="lazy" 
                                                />
                                                <div className={`status-badge ${status.class}`}>
                                                    {status.label}
                                                </div>
                                                <div className="top-actions">
                                                    <button className="icon-save"><Filter size={14} /></button>
                                                </div>
                                            </div>
                                            
                                            <div className="card-body">
                                                <div className="card-header-row">
                                                    <span className="category-tag">{event.category}</span>
                                                    <span className="date-tag"><Calendar size={12} /> {event.date}</span>
                                                </div>
                                                
                                                <h3 className="event-title-v2">{event.title}</h3>
                                                
                                                <div className="venue-row">
                                                    <MapPin size={14} />
                                                    <span>{event.location || event.venue || "Campus Main Hall"}</span>
                                                </div>

                                                <div className="capacity-container">
                                                    <div className="capacity-label">
                                                        <span>Registration</span>
                                                        <span>{capPercent}% Full</span>
                                                    </div>
                                                    <div className="progress-track">
                                                        <div 
                                                            className="progress-fill" 
                                                            style={{ width: `${capPercent}%`, background: capPercent > 80 ? '#ef4444' : '#a855f7' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="card-footer-v2">
                                                    <Link to={`/events/${event._id || event.id}`} className="details-link-v2">
                                                        View Protocol
                                                        <Search size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <Pagination meta={pagination} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <div className="empty-manifest">
                        <div className="empty-icon"><Search size={48} /></div>
                        <h3>No events in current manifest</h3>
                        <p>Adjust your parameters or expand the global search area.</p>
                        <Button variant="outline" onClick={() => updateFilters({ category: 'All', search: '' })}>
                            Reset Filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Events;
