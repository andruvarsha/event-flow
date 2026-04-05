import { motion, useInView, AnimatePresence } from 'framer-motion';
import Hero from '../../components/home/Hero';
import { useEvents } from '../../context/EventContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    Calendar, MapPin, ArrowRight, Shield, Zap, Users,
    Layers, BarChart3, Bell, ChevronRight, Star, Clock,
    Rocket, Sparkles, GraduationCap, Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import './Home.css';

/* ── Features Data ── */
const featureItems = [
    {
        icon: <Layers size={22} />,
        title: 'Smart Discovery',
        desc: 'AI-powered recommendations based on your interests, department, and campus activity.',
        color: '#a78bfa',
        tag: 'AI Powered'
    },
    {
        icon: <Zap size={22} />,
        title: 'Instant Registration',
        desc: 'One-click registration with QR-based check-in. Zero paperwork, instant confirmation.',
        color: '#38bdf8',
        tag: 'Quick'
    },
    {
        icon: <BarChart3 size={22} />,
        title: 'Live Analytics',
        desc: 'Real-time dashboards with attendance tracking, engagement metrics, and capacity alerts.',
        color: '#34d399',
        tag: 'Real-time'
    },
    {
        icon: <Bell size={22} />,
        title: 'Smart Alerts',
        desc: 'Contextual notifications for events you care about. Never miss what matters.',
        color: '#f472b6',
        tag: 'Smart'
    },
    {
        icon: <Shield size={22} />,
        title: 'Verified Events',
        desc: 'Admin-approved events with trust badges ensuring quality and authenticity.',
        color: '#fb923c',
        tag: 'Trusted'
    },
    {
        icon: <Users size={22} />,
        title: 'Community Hub',
        desc: 'Connect, form teams, collaborate, and build lasting relationships on campus.',
        color: '#818cf8',
        tag: 'Social'
    }
];

/* ── Testimonials Data ── */
const testimonials = [
    {
        text: "EventFlow completely changed how I discover campus events. The recommendations are spot-on!",
        name: "Priya Sharma",
        role: "CS, 3rd Year",
        avatar: "PS"
    },
    {
        text: "As an organizer, the analytics dashboard gives me real-time insights I never had before.",
        name: "Arjun Patel",
        role: "Event Coordinator",
        avatar: "AP"
    },
    {
        text: "QR check-in saved us hours of manual attendee tracking. Absolutely game-changing.",
        name: "Sneha Reddy",
        role: "Cultural Secretary",
        avatar: "SR"
    }
];

/* ── Timeline Data ── */
const howItWorks = [
    { step: '01', title: 'Create Account', desc: 'Sign up in seconds with your university email.', icon: <GraduationCap size={20} /> },
    { step: '02', title: 'Discover Events', desc: 'Browse curated events or get AI-powered recommendations.', icon: <Sparkles size={20} /> },
    { step: '03', title: 'Register & Attend', desc: 'One-click registration. Show QR at the venue.', icon: <Rocket size={20} /> },
    { step: '04', title: 'Earn Certificates', desc: 'Get verified certificates on successful attendance.', icon: <Trophy size={20} /> },
];

/* ── Section heading ── */
const SectionHeading = ({ badge, title, subtitle, align = 'center' }) => (
    <div className={`section-heading ${align === 'left' ? 'section-heading--left' : ''}`}>
        {badge && <span className="section-badge">{badge}</span>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
);

/* ── AnimatedSection wrapper ── */
const AnimatedSection = ({ children, className, ...props }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.section
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            {...props}
        >
            {children}
        </motion.section>
    );
};

const Home = () => {
    const { events, loading } = useEvents();
    const featuredEvents = events ? events.slice(0, 3) : [];
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    return (
        <div className="home-page">
            <Hero />

            {/* ═══ Features Bento Grid ═══ */}
            <AnimatedSection className="home-section">
                <SectionHeading
                    badge="Why EventFlow"
                    title="Built for Campus Life"
                    subtitle="Everything you need to discover, register, and manage university events — in one place."
                />
                <div className="features-bento">
                    {featureItems.map((f, i) => (
                        <motion.div
                            key={f.title}
                            className={`bento-card ${i === 0 ? 'bento-card--wide' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                            whileHover={{ y: -6 }}
                        >
                            <div className="bento-card-top">
                                <div className="bento-icon" style={{ '--bc': f.color }}>{f.icon}</div>
                                <span className="bento-tag" style={{ '--bc': f.color }}>{f.tag}</span>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <div className="bento-card-shine" />
                        </motion.div>
                    ))}
                </div>
            </AnimatedSection>

            {/* ═══ How It Works ═══ */}
            <AnimatedSection className="home-section home-section--how">
                <SectionHeading
                    badge="How It Works"
                    title="Four Simple Steps"
                    subtitle="From signup to certificate — the entire journey, simplified."
                />
                <div className="how-steps">
                    {howItWorks.map((step, i) => (
                        <motion.div
                            key={step.step}
                            className="how-step"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                        >
                            <div className="how-step-number">{step.step}</div>
                            <div className="how-step-connector" />
                            <div className="how-step-content">
                                <div className="how-step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatedSection>

            {/* ═══ Featured Events ═══ */}
            <AnimatedSection className="home-section">
                <div className="section-heading-row">
                    <SectionHeading
                        badge="Trending Now"
                        title="Featured Events"
                        align="left"
                    />
                    <Link to="/events" className="view-all-link">
                        <span>View All</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="events-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="event-skeleton" />
                        ))}
                    </div>
                ) : (
                    <div className="events-grid">
                        {featuredEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -6 }}
                            >
                                <div className="event-card-home">
                                    <div className="event-card-img">
                                        <img src={event.image} alt={event.title} />
                                        <span className="event-card-badge">{event.category}</span>
                                        <div className="event-card-img-overlay" />
                                    </div>
                                    <div className="event-card-body">
                                        <h3>{event.title}</h3>
                                        <p className="event-card-desc">
                                            {event.description?.substring(0, 90)}...
                                        </p>
                                        <div className="event-card-meta">
                                            <span><Calendar size={14} /> {event.date} • {event.time}</span>
                                            <span><MapPin size={14} /> {event.venue}</span>
                                        </div>
                                        <Link to={`/events/${event.id}`} className="event-card-link">
                                            <span>View Details</span>
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatedSection>

            {/* ═══ Testimonials ═══ */}
            <AnimatedSection className="home-section home-section--testimonials">
                <SectionHeading
                    badge="What Students Say"
                    title="Loved by Campus"
                />
                <div className="testimonials-container">
                    <div className="testimonials-track">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial}
                                className="testimonial-card"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="testimonial-stars">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                                    ))}
                                </div>
                                <p>"{testimonials[activeTestimonial].text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        {testimonials[activeTestimonial].avatar}
                                    </div>
                                    <div>
                                        <strong>{testimonials[activeTestimonial].name}</strong>
                                        <span>{testimonials[activeTestimonial].role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="testimonial-dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonial-dot ${i === activeTestimonial ? 'active' : ''}`}
                                onClick={() => setActiveTestimonial(i)}
                                aria-label={`Testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══ CTA Section ═══ */}
            <AnimatedSection className="home-cta-section">
                <div className="home-cta-card">
                    <div className="cta-glow" aria-hidden />
                    <div className="cta-grid-bg" aria-hidden />
                    <Rocket size={40} className="cta-rocket" />
                    <h2>Ready to Transform <span className="cta-gradient-text">Campus Life?</span></h2>
                    <p>Join thousands of students already using EventFlow to make the most of university.</p>
                    <div className="cta-actions">
                        <Link to="/auth" className="hero-btn-primary">
                            <span>Create Free Account</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/events" className="hero-btn-secondary">
                            <span>Browse Events</span>
                        </Link>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default Home;
