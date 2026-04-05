import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import './animated-glowing-search-bar.css';

export function AnimatedGlowingSearchBar() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`glowing-search-wrapper ${isFocused ? 'focused' : ''}`}>
            {/* Animated border glow layers */}
            <div className="glowing-search-border-layer layer-1" />
            <div className="glowing-search-border-layer layer-2" />
            <div className="glowing-search-border-layer layer-3" />

            {/* Inner search field */}
            <motion.div
                className="glowing-search-inner"
                animate={{
                    boxShadow: isFocused
                        ? '0 0 20px rgba(168, 85, 247, 0.35), 0 0 40px rgba(139, 92, 246, 0.15)'
                        : '0 0 0px rgba(168, 85, 247, 0)',
                }}
                transition={{ duration: 0.4 }}
            >
                <Search size={16} className="glowing-search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="glowing-search-input"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </motion.div>
        </div>
    );
}

export default AnimatedGlowingSearchBar;
