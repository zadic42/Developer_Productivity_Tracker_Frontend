import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';
import {
    Clock, CheckCircle, Github, Award, ChevronLeft,
    TrendingUp, Zap, Target, Loader2, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f43f5e'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, reportRes] = await Promise.all([
                    API.get('/analytics/dashboard'),
                    API.get('/reports/weekly')
                ]);
                setData(analyticsRes.data);
                setReport(reportRes.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Crunching your productivity numbers...</p>
            </div>
        );
    }

    const { timeTrend, taskStats, skillDistribution, summary } = data;

    const taskPieData = [
        { name: 'Completed', value: taskStats.completed },
        { name: 'Remaining', value: taskStats.total - taskStats.completed }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Hub</h2>
                    <p className="text-slate-500 font-medium">Data-driven insights to optimize your workflow.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Efficiency Score</p>
                        <p className="text-xl font-black text-indigo-600">
                            {taskStats.rate}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <Clock className="text-indigo-600 mb-2" size={24} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Committed</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{summary.totalHours}h</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <CheckCircle className="text-emerald-600 mb-2" size={24} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Velocity</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{taskStats.weeklyCompletion} <span className="text-xs text-slate-400 uppercase">items/wk</span></h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <Zap className="text-amber-500 mb-2" size={24} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily Average</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{summary.avgDailyHours}h</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <Target className="text-cyan-600 mb-2" size={24} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Consistency</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">92%</h3>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart: Coding Hours */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp size={20} className="text-indigo-600" />
                            Engagement Trend
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeTrend}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#4f46e5', fontWeight: '900', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" strokeWidth={4} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Task Status */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                        <Target size={20} className="text-emerald-600" />
                        Status Delta
                    </h3>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {taskPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{taskStats.rate}%</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Achieved</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Completed</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">{taskStats.completed}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Remaining</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">{taskStats.total - taskStats.completed}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart: Skills */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                        <Zap size={20} className="text-amber-500" />
                        Skill Matrix
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillDistribution}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} fontWeight="900" />
                                <Radar
                                    name="Level"
                                    dataKey="A"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.1}
                                    strokeWidth={3}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Summary / Weekly Report */}
                <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Sparkles size={160} className="text-white" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                            <Award size={24} className="text-indigo-400" />
                            Weekly Insight
                        </h3>
                        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                            AI Generated
                        </span>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                            <p className="text-slate-300 leading-relaxed font-medium text-sm">
                                {report?.summary || "Insufficient telemetry gathered for this period. Maintain active development to generate AI synthesis."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Primary Mode</p>
                                <p className="text-white font-black uppercase tracking-tight">System Architect</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Core Stack</p>
                                <p className="text-white font-black uppercase tracking-tight">MERN Cluster</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
                        Export Strategic Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
