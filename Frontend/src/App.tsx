import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ui/ScrollToTop';
import { EtheralShadow } from './components/ui/etheral-shadow';
import './index.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'));
const Events = lazy(() => import('./pages/Events/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails/EventDetails'));
const Auth = lazy(() => import('./pages/Auth/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));

// Loading Fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        {/* Global Etheral Shadow Background */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <EtheralShadow
            color="rgba(128, 128, 128, 1)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
            className="w-full h-full"
          />
        </div>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:id" element={<EventDetails />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="auth" element={<Auth />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Fallback */}
                <Route path="*" element={<div className="p-16 text-center">Page Not Found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
