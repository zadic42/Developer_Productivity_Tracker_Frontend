import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, MailOpen, Trash2, AlertTriangle, CheckCircle2, Flame, Loader2 } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            // Assuming DELETE endpoint exists or we skip for now
            // await API.delete(`/notifications/${id}`);
            // setNotifications(notifications.filter(n => n._id !== id));
            alert('Delete functionality coming soon!');
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Deadline': return <AlertTriangle size={24} className="text-orange-400" />;
            case 'Goal': return <CheckCircle2 size={24} className="text-emerald-400" />;
            case 'Streak': return <Flame size={24} className="text-red-500" />;
            default: return <Bell size={24} className="text-indigo-400" />;
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Gathering your updates...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Feed</h2>
                    <p className="text-slate-500 font-medium">System diagnostics and achievement logs.</p>
                </div>
                <div className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                    {notifications.filter(n => !n.isRead).length} Unread Logs
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-10 flex gap-8 items-start hover:bg-slate-50 transition-all group relative
                                    ${!n.isRead ? 'bg-indigo-50/10' : 'bg-white'}`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border transition-all duration-500
                                    ${!n.isRead ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-600/5 scale-110' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                            {n.type} LOG • {new Date(n.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {!n.isRead && (
                                            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></span>
                                        )}
                                    </div>
                                    <p className={`text-lg leading-relaxed tracking-tight ${!n.isRead ? 'text-slate-900 font-black' : 'text-slate-400 font-medium'}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-6 pt-4">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => markAsRead(n._id)}
                                                className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl"
                                            >
                                                <MailOpen size={14} /> Clear Log
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n._id)}
                                            className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-red-600 transition-colors uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl"
                                        >
                                            <Trash2 size={14} /> Purge
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-24 text-center space-y-8">
                        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 shadow-inner">
                            <Bell size={64} className="text-slate-200" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Silent</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">All diagnostic protocols are clear. Your development environment is synchronized.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
