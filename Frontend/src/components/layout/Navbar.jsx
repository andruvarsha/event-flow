import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, User, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import NotificationDropdown from '../ui/NotificationDropdown';
import SearchComponent from '../ui/animated-glowing-search-bar';
import AnimatedEventFlowLogo from '../ui/AnimatedEventFlowLogo';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Assuming AuthContext provides user/logout

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
    ];

    return (
        <>
        <motion.nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container nav-container">
                {/* Logo */}
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                    <img src="/logo.png" alt="EventFlow Logo" className="logo-image" />
                    <AnimatedEventFlowLogo />
                </Link>

                {/* Desktop Actions — pinned far right */}
                <div className="nav-actions-right desktop-only">
                    {user ? (
                        <div className="nav-actions-box">
                            <Link to="/dashboard" className="nav-action-link">
                                <User size={16} />
                                <span>Dashboard</span>
                            </Link>
                            <span className="nav-action-divider" />
                            <button
                                className="nav-icon-btn"
                                id="nav-notification-btn"
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            >
                                <Bell size={18} />
                            </button>
                            <span className="nav-action-divider" />
                            <SearchComponent />
                        </div>
                    ) : (
                        <Link to="/auth" className="auth-btn-link">
                            <motion.button
                                className="auth-btn-advanced"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span className="auth-btn-glow" />
                                <User size={16} className="auth-btn-icon" />
                                <span className="auth-btn-text">Login</span>
                                <span className="auth-btn-divider" />
                                <span className="auth-btn-text">Register</span>
                            </motion.button>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu glass-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="mobile-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mobile-actions">
                                {user ? (
                                    <>
                                        <Link to="/dashboard" className="mobile-link">Dashboard</Link>
                                    </>
                                ) : (
                                    <Link to="/auth">
                                        <Button variant="primary" className="w-full">Login</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>

            {/* Notification Slide Panel — outside nav for full-viewport positioning */}
            <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                toggleButtonId="nav-notification-btn"
            />
        </>
    );
};

export default Navbar;
