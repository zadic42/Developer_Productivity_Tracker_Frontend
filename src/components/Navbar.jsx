import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, LogOut, Settings, CheckCircle2, AlertTriangle, Flame, MailOpen } from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        fetchUserProfile();
        const interval = setInterval(fetchNotifications, 60000); // Pulse every minute
        return () => clearInterval(interval);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const { data } = await API.get('/user/profile');
            setUser(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'Deadline': return <AlertTriangle size={16} className="text-orange-400" />;
            case 'Goal': return <CheckCircle2 size={16} className="text-emerald-400" />;
            case 'Streak': return <Flame size={16} className="text-red-500" />;
            default: return <Bell size={16} className="text-indigo-400" />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="h-20 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for tasks, goals or skills..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-300 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-xl border transition-all relative
                            ${showNotifications ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-900 tracking-tight text-sm">Notifications</h3>
                                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{unreadCount} New</span>
                            </div>
                            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => markAsRead(n._id)}
                                            className={`p-5 border-b border-slate-50 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors relative group
                                                ${!n.isRead ? 'bg-indigo-50/20' : 'opacity-60'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
                                                ${!n.isRead ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-sm leading-tight ${!n.isRead ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {new Date(n.createdAt).toLocaleDateString()} • {n.type}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MailOpen size={14} className="text-indigo-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center space-y-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 border border-dashed border-slate-200">
                                            <Bell size={32} />
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">All caught up! No notifications.</p>
                                    </div>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                                    className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors bg-white border-t border-slate-100"
                                >
                                    View All Activity
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-1 pl-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-slate-900 tracking-tight">{user?.name || 'Loading...'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tier-1 Developer</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:bg-slate-800 transition-colors uppercase">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : <User size={18} />}
                        </div>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-2">
                                <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                                    <User size={18} className="text-slate-400" /> Account Identity
                                </button>
                                <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                                    <Settings size={18} className="text-slate-400" /> Preferences
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
