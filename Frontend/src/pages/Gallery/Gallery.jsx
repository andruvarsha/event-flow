import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, ZoomIn, Calendar, MapPin, Tag, ChevronLeft, ChevronRight, ImageOff, Search } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';
import './Gallery.css';

// --- 3D Magnetic Tilt Component ---
const TiltCard = ({ children, event, onClick, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
    const glareOpacity = useTransform(x, [-0.5, 0, 0.5], [0.3, 0, 0.3]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className="gallery-masonry-item"
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1200px",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={{
                hidden: { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onClick(index)}
        >
            <motion.div 
                className="gallery-card"
                layoutId={`card-container-${event._id}`}
            >
                {/* Sweeping Glass Glare */}
                <motion.div
                    className="gallery-glare"
                    style={{
                        opacity: glareOpacity,
                        x: glareX,
                    }}
                />
                
                <div className="gallery-image-wrapper">
                    <motion.img
                        layoutId={`card-image-${event._id}`}
                        src={event.imageUrl}
                        alt={event.title}
                        className="gallery-image"
                        loading="lazy"
                    />
                    <div className="gallery-card-overlay">
                        <div className="gallery-zoom-circle">
                            <ZoomIn size={24} />
                        </div>
                    </div>
                </div>
                <motion.div 
                    className="gallery-card-content"
                    layoutId={`card-content-${event._id}`}
                >
                    <motion.div className="gallery-category-badge" layoutId={`badge-${event._id}`}>
                        {event.category}
                    </motion.div>
                    <h3 className="gallery-card-title">{event.title}</h3>
                    <div className="gallery-card-meta">
                        {event.date && (
                            <span className="meta-info">
                                <Calendar size={12} />
                                {event.date}
                            </span>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


const Gallery = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Spotlight cursor tracking
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    // Local Gallery Data using the 13 images
    useEffect(() => {
        const galleryMemories = [
            {
                _id: 'g1',
                title: 'Tech Symposium Highlights',
                category: 'Technical',
                imageUrl: '/events/1.jpg',
                date: 'March 15, 2024',
                location: 'Main Auditorium',
                description: 'A look back at the incredible technical symposium and the brilliant minds that joined us.'
            },
            {
                _id: 'g2',
                title: 'Cultural Fest Opening',
                category: 'Cultural',
                imageUrl: '/events/2.jpg',
                date: 'April 1, 2024',
                location: 'Campus Ground',
                description: 'The spectacular opening ceremony of our annual cultural festival.'
            },
            {
                _id: 'g3',
                title: 'Sports Meet Action',
                category: 'Sports',
                imageUrl: '/events/3.jpg',
                date: 'February 20, 2024',
                location: 'University Stadium',
                description: 'Action-packed moments from the inter-departmental sports meet.'
            },
            {
                _id: 'g4',
                title: 'AI Workshop Practicals',
                category: 'Technical',
                imageUrl: '/events/4.jpg',
                date: 'March 25, 2024',
                location: 'Computer Lab 3',
                description: 'Students getting hands-on experience during the AI & ML workshop.'
            },
            {
                _id: 'g5',
                title: 'Photography Club Showcase',
                category: 'Cultural',
                imageUrl: '/events/5.jpg',
                date: 'April 10, 2024',
                location: 'Arts Block Atrium',
                description: 'Beautiful captures displayed by our talented photography club.'
            },
            {
                _id: 'g6',
                title: 'Startup Pitch Finale',
                category: 'Academic',
                imageUrl: '/events/6.jpg',
                date: 'May 5, 2024',
                location: 'Innovation Hub',
                description: 'Tense and exciting moments from the startup pitch competition.'
            },
            {
                _id: 'g7',
                title: 'Hackathon Midnight Coding',
                category: 'Technical',
                imageUrl: '/events/7.jpg',
                date: 'April 15, 2024',
                location: 'Main Lab Complex',
                description: '24 hours of non-stop coding and innovation at the annual hackathon.'
            },
            {
                _id: 'g8',
                title: 'Dance Royale Winners',
                category: 'Cultural',
                imageUrl: '/events/8.jpg',
                date: 'March 10, 2024',
                location: 'Open Air Theatre',
                description: 'The winning crew celebrating their victory at the Dance Battle Royale.'
            },
            {
                _id: 'g9',
                title: 'Drone Flying Session',
                category: 'Technical',
                imageUrl: '/events/9.jpg',
                date: 'May 12, 2024',
                location: 'Engineering Block',
                description: 'Students flying their newly assembled drones.'
            },
            {
                _id: 'g10',
                title: 'Web3 Guest Lecture',
                category: 'Academic',
                imageUrl: '/events/10.jpg',
                date: 'March 22, 2024',
                location: 'Seminar Hall 1',
                description: 'Insightful discussions on the future of decentralized technologies.'
            },
            {
                _id: 'g11',
                title: 'Premier League Finals',
                category: 'Sports',
                imageUrl: '/events/11.jpg',
                date: 'April 20, 2024',
                location: 'Cricket Ground',
                description: 'The thrilling conclusion to the university cricket league.'
            },
            {
                _id: 'g12',
                title: 'Jam Session Live',
                category: 'Cultural',
                imageUrl: '/events/12.jpg',
                date: 'March 5, 2024',
                location: 'Student Activity Center',
                description: 'An unforgettable acoustic night with the music club.'
            },
            {
                _id: 'g13',
                title: 'Cybersecurity Drill',
                category: 'Technical',
                imageUrl: '/events/13.jpg',
                date: 'April 5, 2024',
                location: 'Cyber Lab',
                description: 'Intense network defense scenarios during the bootcamp.'
            }
        ];
        
        // Simulate a slight loading delay for effect
        setTimeout(() => {
            setEvents(galleryMemories);
            setLoading(false);
        }, 600);
    }, []);

    const categories = ['All', ...new Set(events.map(e => e.category).filter(Boolean))];
    
    // Filter & Search Logic
    const filtered = events.filter(e => {
        const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Lightbox Navigation Logic
    const handleNext = useCallback((e) => {
        e?.stopPropagation();
        if (filtered.length > 0) {
            setSelectedIndex((prevIndex) => (prevIndex + 1) % filtered.length);
        }
    }, [filtered.length]);

    const handlePrev = useCallback((e) => {
        e?.stopPropagation();
        if (filtered.length > 0) {
            setSelectedIndex((prevIndex) => (prevIndex - 1 + filtered.length) % filtered.length);
        }
    }, [filtered.length]);

    const closeLightbox = () => setSelectedIndex(null);

    // Keyboard support for Lightbox & Command Palette shortcut
    const searchInputRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, handleNext, handlePrev]);

    const selectedImage = selectedIndex !== null ? filtered[selectedIndex] : null;

    return (
        <div className="gallery-page">
            {/* Global Spotlight */}
            <motion.div 
                className="gallery-spotlight"
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
            />

            {/* Ambient Aurora Backgrounds */}
            <div className="gallery-ambient-1"></div>
            <div className="gallery-ambient-2"></div>

            <div className="gallery-header">
                <motion.h1
                    className="gallery-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Event <span className="gallery-title-accent">Gallery</span>
                </motion.h1>

                {/* Command Palette Search Bar */}
                <motion.div 
                    className="gallery-search-container"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Search className="gallery-search-icon" size={20} />
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search memories... (⌘K)" 
                        className="gallery-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Highly Interactive Filter Chips */}
                <motion.div
                    className="gallery-filters"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`gallery-filter-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSelectedIndex(null);
                            }}
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="active-gallery-chip"
                                    className="gallery-filter-active-bg"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="gallery-filter-text">{cat}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {loading ? (
                <div className="gallery-loading">
                    <div className="gallery-spinner" />
                    <p>Curating your gallery...</p>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div 
                    className="gallery-empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <ImageOff size={48} className="gallery-empty-icon" />
                    <h2>No memories found</h2>
                    <p>We couldn't find any images matching your criteria.</p>
                </motion.div>
            ) : (
                <motion.div
                    className="gallery-masonry"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } }
                    }}
                >
                    {filtered.map((event, index) => (
                        <TiltCard 
                            key={event._id} 
                            event={event} 
                            index={index} 
                            onClick={setSelectedIndex} 
                        />
                    ))}
                </motion.div>
            )}

            {/* Immersive Shared-Element Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="gallery-lightbox-wrapper">
                        <motion.div
                            className="gallery-lightbox-backdrop"
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.4 }}
                            onClick={closeLightbox}
                        />
                        
                        <div className="gallery-lightbox-ui" pointer-events="none">
                            <button className="gallery-nav-btn prev" onClick={handlePrev} style={{ pointerEvents: 'auto' }}>
                                <ChevronLeft size={36} />
                            </button>
                            <button className="gallery-nav-btn next" onClick={handleNext} style={{ pointerEvents: 'auto' }}>
                                <ChevronRight size={36} />
                            </button>
                            <button className="gallery-lightbox-close" onClick={closeLightbox} style={{ pointerEvents: 'auto' }}>
                                <X size={24} />
                            </button>
                            <div className="gallery-lightbox-counter">
                                {selectedIndex + 1} / {filtered.length}
                            </div>
                        </div>

                        <div className="gallery-lightbox-content-wrapper" onClick={closeLightbox}>
                            <motion.div
                                className="gallery-lightbox-container"
                                layoutId={`card-container-${selectedImage._id}`}
                                onClick={e => e.stopPropagation()}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <div className="gallery-lightbox-visual">
                                    <motion.img
                                        layoutId={`card-image-${selectedImage._id}`}
                                        src={selectedImage.imageUrl}
                                        alt={selectedImage.title}
                                        className="gallery-lightbox-img-full"
                                    />
                                    <motion.div className="gallery-category-badge-lb" layoutId={`badge-${selectedImage._id}`}>
                                        {selectedImage.category}
                                    </motion.div>
                                </div>
                                <motion.div 
                                    className="gallery-lightbox-details"
                                    layoutId={`card-content-${selectedImage._id}`}
                                >
                                    <h2 className="lightbox-title">{selectedImage.title}</h2>
                                    <p className="lightbox-desc">{selectedImage.description || 'Experience the vibrant moments captured during this amazing campus event.'}</p>
                                    <div className="lightbox-meta-grid">
                                        {selectedImage.date && (
                                            <div className="meta-pill">
                                                <Calendar size={15} /> <span>{selectedImage.date}</span>
                                            </div>
                                        )}
                                        {selectedImage.location && (
                                            <div className="meta-pill">
                                                <MapPin size={15} /> <span>{selectedImage.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
