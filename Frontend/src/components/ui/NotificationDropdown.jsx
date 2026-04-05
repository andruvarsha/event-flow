import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, BellOff } from 'lucide-react';
import './NotificationDropdown.css';

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New Registration', message: 'Alice Smith has registered for "Tech Symposium".', time: '5m ago', type: 'info', read: false },
    { id: 2, title: 'Event Capacity Alert', message: 'Event "Hackathon 2026" is 95% full.', time: '1h ago', type: 'warning', read: false },
    { id: 3, title: 'System Updated', message: 'The dashboard has been updated to v2.1.0.', time: '2h ago', type: 'success', read: true },
    { id: 4, title: 'Payment Received', message: 'Payment of $150 received from Bob Jones.', time: '3h ago', type: 'success', read: true },
    { id: 5, title: 'Reminder', message: '"Workshop: UI/UX" starts in 30 minutes.', time: '4h ago', type: 'info', read: true },
];

const NotificationDropdown = ({ isOpen, onClose, toggleButtonId }) => {
    const panelRef = useRef(null);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    /* Lock body scroll when panel is open */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const typeIndicator = (type) => {
        const map = { info: '#6366f1', warning: '#f59e0b', success: '#22c55e' };
        return map[type] || '#6366f1';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="notif-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Slide-in Panel */}
                    <motion.aside
                        ref={panelRef}
                        className="notif-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="notif-panel-header">
                            <div className="notif-panel-title-row">
                                <Bell size={20} className="notif-panel-icon" />
                                <h3 className="notif-panel-title">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="notif-badge">{unreadCount}</span>
                                )}
                            </div>
                            <div className="notif-panel-actions">
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="notif-mark-read">
                                        <Check size={14} /> Mark all read
                                    </button>
                                )}
                                <button onClick={onClose} className="notif-panel-close">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="notif-panel-body">
                            {notifications.length === 0 ? (
                                <div className="notif-empty">
                                    <BellOff size={40} strokeWidth={1.2} />
                                    <p>You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="notif-list">
                                    {notifications.map(notif => (
                                        <motion.div
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className={`notif-card ${!notif.read ? 'unread' : ''}`}
                                        >
                                            <span
                                                className="notif-type-dot"
                                                style={{ background: typeIndicator(notif.type) }}
                                            />
                                            <div className="notif-card-content">
                                                <div className="notif-card-header">
                                                    <span className="notif-card-title">{notif.title}</span>
                                                    <button onClick={() => removeNotification(notif.id)} className="notif-close">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="notif-message">{notif.message}</p>
                                                <span className="notif-time">{notif.time}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
