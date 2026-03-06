import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import TimerCard from '../components/TimerCard';
import { Clock, History, Calendar, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';

const TimeTracker = () => {
    const [activeTimer, setActiveTimer] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ dailyHours: 0, weeklyHours: 0, sessionsToday: 0 });
    const [timeTrend, setTimeTrend] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [activeRes, tasksRes, analyticsRes, historyRes] = await Promise.all([
                API.get('/time/active'),
                API.get('/tasks'),
                API.get('/analytics/dashboard'),
                API.get('/time/history')
            ]);

            setActiveTimer(activeRes.data);
            setTasks(tasksRes.data);
            setHistory(historyRes.data);
            setTimeTrend(analyticsRes.data.timeTrend);

            // Calculate daily hours from the most recent day in trend
            const todayTrend = analyticsRes.data.timeTrend[analyticsRes.data.timeTrend.length - 1];

            setStats({
                dailyHours: todayTrend?.hours || 0,
                weeklyHours: analyticsRes.data.summary.totalHours,
                sessionsToday: historyRes.data.filter(s =>
                    new Date(s.startTime).toDateString() === new Date().toDateString()
                ).length + (activeRes.data ? 1 : 0)
            });
        } catch (error) {
            console.error('Error fetching time data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTimer = async (taskId, type) => {
        try {
            const { data } = await API.post('/time/start', { taskId, type });
            setActiveTimer(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Error starting timer');
        }
    };

    const handleStopTimer = async () => {
        try {
            await API.post('/time/stop');
            setActiveTimer(null);
            fetchInitialData(); // Refresh stats
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Setting up your focus zone...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Focus Zone</h2>
                    <p className="text-slate-500 font-medium">Clock in and watch your productivity soar.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily Focus</p>
                        <p className="text-xl font-black text-indigo-600">{stats.dailyHours}h</p>
                    </div>
                </div>
            </div>

            <TimerCard
                activeTimer={activeTimer}
                tasks={tasks}
                onStart={handleStartTimer}
                onStop={handleStopTimer}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                            <History size={20} className="text-indigo-600" />
                            Recent Sessions
                        </h3>
                        <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                            View Full Log <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {history.length > 0 ? history.map((session, i) => (
                            <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{session.taskId?.title || 'System Task'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(session.startTime).toLocaleDateString()} • {session.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900 tracking-tight">{session.duration}m</p>
                                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">+{Math.round(session.duration * 0.5)} XP</p>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full text-slate-200 border border-slate-100">
                                    <Clock size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-900 font-black uppercase tracking-tight text-sm">No recent logs</p>
                                    <p className="text-xs text-slate-500 font-medium max-w-xs">Start a session above to begin tracking and earning XP.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                        <Calendar size={20} className="text-indigo-600" />
                        Weekly Momentum
                    </h3>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-5">
                            {timeTrend.length > 0 ? timeTrend.map((d, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{d.date}</span>
                                        <span className="text-slate-900">{d.hours}h</span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((d.hours / 8) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    Insufficient Data
                                </div>
                            )}
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Committed</span>
                                <span className="text-lg font-black text-slate-900 tracking-tight">{stats.weeklyHours}h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTracker;
