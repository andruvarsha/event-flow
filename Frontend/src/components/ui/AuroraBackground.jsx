import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './AuroraBackground.css';

const AuroraBackground = ({
    starCount = 60,
    pulseDuration = 10,
}) => {
    // Pre-compute random star positions and timings once
    const stars = useMemo(() => {
        return Array.from({ length: starCount }, () => ({
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            peakOpacity: Math.random() * 0.8,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
    }, [starCount]);

    return (
        <div className="aurora-background" aria-hidden="true">
            <div className="aurora-layers">
                {/* Pulsing radial gradients */}
                <div
                    className="aurora-pulse-layer"
                    style={{ animationDuration: `${pulseDuration}s` }}
                />

                {/* Animated color blobs */}
                <motion.div
                    className="aurora-blobs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <motion.div
                        className="aurora-blob aurora-blob--purple"
                        animate={{
                            x: [-50, 50, -50],
                            y: [-20, 20, -20],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="aurora-blob aurora-blob--fuchsia"
                        animate={{
                            x: [50, -50, 50],
                            y: [20, -20, 20],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="aurora-blob aurora-blob--indigo"
                        animate={{
                            x: [20, -20, 20],
                            y: [-30, 30, -30],
                            rotate: [0, 360, 0],
                        }}
                        transition={{
                            duration: 50,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                </motion.div>

                {/* Twinkling stars */}
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="aurora-star"
                        initial={{
                            left: star.x,
                            top: star.y,
                            opacity: 0,
                        }}
                        animate={{
                            opacity: [0, star.peakOpacity, 0],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: star.delay,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AuroraBackground;
