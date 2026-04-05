import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Dock from '../components/layout/Dock';
import { motion } from 'framer-motion';

const dockIconStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    objectFit: 'contain',
    pointerEvents: 'none',
};

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname === '/auth';

    const dockItems = [
        {
            icon: <img src="/icons/home.png" alt="Home" style={dockIconStyle} />,
            label: 'Home',
            onClick: () => navigate('/'),
            isActive: location.pathname === '/'
        },
        {
            icon: <img src="/icons/event.png" alt="Events" style={dockIconStyle} />,
            label: 'Events',
            onClick: () => navigate('/events'),
            isActive: location.pathname === '/events' || location.pathname.startsWith('/events/')
        },
        {
            icon: <img src="/icons/gallery.png" alt="Gallery" style={dockIconStyle} />,
            label: 'Gallery',
            onClick: () => navigate('/gallery'),
            isActive: location.pathname === '/gallery'
        },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            {!isAuthPage && <Navbar />}
            {!isAuthPage && (
                <Dock
                    items={dockItems}
                    panelWidth={68}
                    baseItemSize={52}
                    magnification={72}
                    distance={160}
                />
            )}
            <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1]
                }}
                style={{ flex: 1, paddingLeft: isAuthPage ? '0' : '90px' }}
            >
                <Outlet />
            </motion.main>

        </div>
    );
};

export default MainLayout;
