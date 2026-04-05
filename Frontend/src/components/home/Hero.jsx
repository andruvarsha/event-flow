import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Copy, ArrowRight, CheckCircle2, Activity, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import './Hero.css';

const StatPill = ({ icon: Icon, label, value, trend }) => (
    <div className="stat-pill">
        <div className="stat-pill-icon"><Icon size={14} /></div>
        <div className="stat-pill-content">
            <span className="stat-pill-label">{label}</span>
            <div className="stat-pill-data">
                <span className="stat-pill-value">{value}</span>
                <span className="stat-pill-trend">+{trend}%</span>
            </div>
        </div>
    </div>
);

const Hero = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const snippet = `const event = await EventFlow.create({
  title: "Hackathon '26",
  capacity: 500,
  features: ["qr_checkin", "live_analytics"]
});
console.log("Deployed in 120ms");`;

    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="hero-section" ref={sectionRef}>

            
            <motion.div className="hero-content-wrapper" style={{ y, opacity }}>
                <div className="hero-text-column">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="hero-badge-minimal"
                    >
                        <div className="status-dot-green"></div>
                        <span>EventFlow Engine v2.0 Live</span>
                    </motion.div>

                    <motion.h1 
                        className="hero-title-saas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Execute events with <br/>
                        <span className="hero-title-highlight">absolute precision.</span>
                    </motion.h1>
                    
                    <motion.p 
                        className="hero-subtitle-saas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        The high-performance infrastructure for campus events. 
                        Deploy registration portals, track live capacity, and manage 
                        attendees in milliseconds.
                    </motion.p>

                    <motion.div 
                        className="hero-actions-saas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/events" className="btn-primary-saas">
                            Start Building <ArrowRight size={16} />
                        </Link>
                        <Link to="/auth" className="btn-secondary-saas">
                            Read Documentation
                        </Link>
                    </motion.div>

                    <motion.div 
                        className="hero-stats-row"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="stat-metric">
                            <strong>12ms</strong>
                            <span>Avg API Latency</span>
                        </div>
                        <div className="stat-metric">
                            <strong>99.99%</strong>
                            <span>Uptime SLA</span>
                        </div>
                        <div className="stat-metric">
                            <strong>10k+</strong>
                            <span>Reqs / Second</span>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-visual-column">
                    <motion.div 
                        className="hero-b2b-visual"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
                    >
                        {/* Mock Code Snippet Block */}
                        <div className="code-window">
                            <div className="code-header">
                                <div className="code-dots">
                                    <span /> <span /> <span />
                                </div>
                                <div className="code-title">
                                    <Terminal size={14} /> terminal
                                </div>
                                <button className="copy-btn" onClick={handleCopy}>
                                    {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <pre className="code-body">
                                <code>
{/* Minimal syntax highlighting simulation */}
<span className="kw">const</span> event <span className="op">=</span> <span className="kw">await</span> EventFlow.<span className="fn">create</span>({'{'}
{'\n'}  title: <span className="st">"Hackathon '26"</span>,
{'\n'}  capacity: <span className="nm">500</span>,
{'\n'}  features: [<span className="st">"qr_checkin"</span>, <span className="st">"live_analytics"</span>]
{'\n'}{'}'});
{'\n'}<span className="fn">console.log</span>(<span className="st">"Deployed in 120ms"</span>);
                                </code>
                            </pre>
                        </div>

                        {/* Floating live metrics */}
                        <div className="floating-metrics">
                            <StatPill icon={Activity} label="Live Interactions" value="1,492" trend="12.4" />
                            <StatPill icon={Users} label="Check-in Queue" value="24" trend="5.1" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
