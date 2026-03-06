import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import GamificationCard from '../components/GamificationCard';
import { Loader2, Zap, Clock, CheckCircle2, Flame, TrendingUp, Calendar, ArrowRight, Activity, ChevronRight, Layout } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [analytics, setAnalytics] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch basic data that usually doesn't fail if authenticated
                const [analyticsRes, tasksRes] = await Promise.all([
                    API.get('/analytics/dashboard'),
                    API.get('/tasks')
                ]);

                setAnalytics(analyticsRes.data);
                setRecentTasks(tasksRes.data.slice(0, 3));

                // Fetch optional/external data like GitHub streak separately
                if (user?.githubUsername) {
                    try {
                        const streakRes = await API.get('/github/streak');
                        setStreak(streakRes.data);
                    } catch (streakErr) {
                        console.warn("GitHub streak fetch failed:", streakErr.response?.data?.message || streakErr.message);
                        setStreak({ streak: 0 });
                    }
                } else {
                    setStreak({ streak: 0 }); // No username, no streak
                }

            } catch (err) {
                console.error("Critical error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Assembling your workspace...</p>
            </div>
        );
    }

    const { summary, taskStats, skillDistribution } = analytics || {
        summary: { totalHours: 0, avgDailyHours: 0 },
        taskStats: { total: 0, completed: 0, rate: 0 },
        skillDistribution: []
    };

    const stats = {
        hoursTracked: summary.totalHours,
        tasksCompleted: taskStats.completed,
        streak: streak?.streak || 0,
        level: Math.floor((taskStats.completed || 0) / 10) + 1,
        streakToday: (streak?.streak || 0) > 0
    };

    const chartData = (analytics?.timeTrend || []).map(item => ({
        name: item.date,
        value: item.hours
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header section with welcome message */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500 font-medium mt-1">Track your progress and development metrics in real-time.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {stats.streakToday ? '🔥' : '⏳'}
                    </div>
                    <div className="text-sm">
                        <p className="font-black text-slate-900 leading-none">{stats.streakToday ? 'Daily Streak Active!' : 'Session Pending'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Focus Mode Enabled</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Hours Tracked', value: stats.hoursTracked || 0, icon: <Clock className="text-indigo-600" />, trend: '+12%', color: 'blue' },
                    { label: 'Tasks Done', value: stats.tasksCompleted || 0, icon: <Layout className="text-emerald-600" />, trend: '+5', color: 'emerald' },
                    { label: 'Current Streak', value: stats.streak || 0, icon: <Flame className="text-orange-600" />, trend: 'Day', color: 'orange' },
                    { label: 'Developer Level', value: stats.level || 1, icon: <Zap className="text-indigo-600" />, trend: 'Pro', color: 'indigo' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`p-3 rounded-2xl bg-slate-50 text-indigo-600 border border-slate-100 group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div className="mt-4 relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content: Charts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Focus Evolution</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Weekly Intensity Analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-white transition-colors">
                                <Activity size={16} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        fontSize: '12px',
                                        fontWeight: '700'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Mini Cards */}
                <div className="space-y-6">
                    {/* Skills Progress Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Skills</h3>
                            <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform cursor-pointer" />
                        </div>
                        <div className="space-y-5">
                            {['React', 'Node.js', 'TypeScript'].map((skill, i) => (
                                <div key={skill} className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{skill}</span>
                                        <span className="text-indigo-600">{85 - i * 15}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors"
                                            style={{ width: `${85 - i * 15}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Start Card */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Zap size={80} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight relative z-10">Start Tracking</h3>
                        <p className="text-slate-400 text-sm font-bold mt-1 relative z-10">Ready for a new session?</p>
                        <button
                            onClick={() => window.location.href = '/time'}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 relative z-10 text-xs uppercase tracking-widest"
                        >
                            Open Tracker
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, color }) => {
    const colors = {
        indigo: 'hover:border-indigo-500/50',
        emerald: 'hover:border-emerald-500/50 text-emerald-400',
        cyan: 'hover:border-cyan-500/50 text-cyan-400',
        orange: 'hover:border-orange-500/50 text-orange-400'
    };

    return (
        <div className={`p-6 bg-[#0f172a] rounded-2xl border border-slate-700/50 transition-all cursor-pointer group shadow-lg ${colors[color]}`}>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">{title}</p>
            <h3 className={`text-3xl font-black ${color !== 'indigo' ? '' : 'text-white'}`}>{value}</h3>
        </div>
    );
};

export default Dashboard;
