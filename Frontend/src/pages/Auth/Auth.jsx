import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import AnimatedEventFlowLogo from '../../components/ui/AnimatedEventFlowLogo';

import {
    Mail, Lock, User, Eye, EyeOff,
    Award, ChevronRight, GraduationCap,
    AlertCircle, ArrowLeft
} from 'lucide-react';
import './Auth.css';
import '../../components/layout/Navbar.css';

const Auth = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const fillDemo = (role) => {
        if (role === 'student') {
            setEmail('24B11CS001@adityauniversity.in');
            setPassword('12345');
        } else {
            setEmail('aarav@aditya.edu');
            setPassword('12345');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let result;
            if (mode === 'login') {
                result = await login({ email, password });
            } else {
                if (!name || !department) {
                    setError("Please provide a name and department for registration.");
                    setLoading(false);
                    return;
                }
                if (!email.endsWith('@adityauniversity.in')) {
                    setError("Registration requires a student email ending in @adityauniversity.in");
                    setLoading(false);
                    return;
                }
                result = await register({ name, email, password, department, role: 'student' });
            }

            if (result && !result.success) {
                setError(result.error || (mode === 'login' ? 'Invalid credentials' : 'Registration failed'));
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            {/* Left Brand Panel */}
            <div className="auth-brand-panel">

                <div className="auth-brand-content">
                    <Link to="/" className="nav-logo auth-logo" style={{ textDecoration: 'none' }}>
                        <img src="/logo.png" alt="EventFlow Logo" className="logo-image" />
                        <AnimatedEventFlowLogo />
                    </Link>
                    <div className="brand-hero">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Execute events with <span className="text-highlight">absolute precision</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            High-performance event infrastructure. Deploy registration portals, track live capacity, and manage attendees in milliseconds.
                        </motion.p>
                    </div>

                    <div className="brand-footer">
                        <div className="system-status">
                            <span className="status-dot-green"></span>
                            Systems Operational
                        </div>
                        <div className="version-info">
                            v2.0.4-stable
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">
                <Link to="/" className="auth-back-link-mobile">
                    <ArrowLeft size={16} /> Home
                </Link>

                <motion.div
                    className="auth-form-container"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Card header */}
                    <div className="auth-card-header">
                        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{mode === 'login' ? 'Sign in to access your dashboard' : 'Join the university event community'}</p>
                    </div>

                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
                        <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div className="auth-error" initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
                                <AlertCircle size={16} /><span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        <AnimatePresence mode="wait">
                            {mode === 'login' && (
                                <motion.div key="demo-chips" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="demo-chips">
                                    <button type="button" className="demo-chip" onClick={() => fillDemo('student')}>
                                        <User size={16} />
                                        <div><strong>Student Demo</strong><span>Prefills credentials</span></div>
                                    </button>
                                    <button type="button" className="demo-chip" onClick={() => fillDemo('admin')}>
                                        <Award size={16} />
                                        <div><strong>Admin Demo</strong><span>Prefills credentials</span></div>
                                    </button>
                                </motion.div>
                            )}
                            {mode === 'register' && (
                                <motion.div key="register-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="register-extra">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <div className="input-wrap"><User size={18} className="input-icon-el" /><input type="text" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} /></div>
                                    </div>
                                    <div className="input-group">
                                        <label>Department</label>
                                        <div className="input-wrap">
                                            <GraduationCap size={18} className="input-icon-el" />
                                            <select value={department} onChange={e => setDepartment(e.target.value)}>
                                                <option value="">Select Department</option>
                                                <option value="CSE">Computer Science</option>
                                                <option value="ECE">Electronics</option>
                                                <option value="ME">Mechanical</option>
                                                <option value="CE">Civil</option>
                                                <option value="MBA">Business Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="input-group">
                            <label>University Email</label>
                            <div className="input-wrap">
                                <Mail size={18} className="input-icon-el" />
                                <input
                                    type="email"
                                    placeholder={mode === 'register' ? "rollnumber@adityauniversity.in" : "you@aditya.edu or rollnumber@adityauniversity.in"}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <p className="input-hint">
                                {mode === 'register' ? "Students: Use @adityauniversity.in" : "Admins: @aditya.edu | Students: @adityauniversity.in"}
                            </p>
                        </div>
                        
                        <div className="input-group">
                            <div className="label-row"><label>Password</label>{mode === 'login' && <button type="button" className="forgot-link">Forgot?</button>}</div>
                            <div className="input-wrap">
                                <Lock size={18} className="input-icon-el" />
                                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                        </div>
                        
                        <Button variant="primary" size="lg" className="w-full auth-submit" isLoading={loading}>
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                            <ChevronRight size={18} />
                        </Button>
                    </form>

                    <p className="auth-switch">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                            {mode === 'login' ? 'Register Now' : 'Sign In'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
