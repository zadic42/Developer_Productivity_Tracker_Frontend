import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import {
    Users,
    Plus,
    UserPlus,
    Trophy,
    BarChart3,
    CheckCircle2,
    Clock,
    Loader2,
    ArrowRight,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TeamModal from '../components/TeamModal';

const Team = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            const myTeamsRes = await API.get('/teams/my');
            if (myTeamsRes.data.length > 0) {
                const teamId = myTeamsRes.data[0]._id;
                const { data } = await API.get(`/teams/${teamId}/stats`);
                setTeam(data);
            } else {
                setTeam(null);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Assembling the squad...</p>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-700 pb-20">
                <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center border border-slate-200 shadow-xl relative group">
                    <Users size={56} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg">
                        <Plus size={20} />
                    </div>
                </div>
                <div className="max-w-md space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Collaborative Mode</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Establish a new squad or synchronize with an existing unit to aggregate productivity telemetry and accelerate collective milestones.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                        onClick={() => { setModalMode('create'); setIsModalOpen(true); }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                    >
                        <Plus size={18} /> Initialize Squad
                    </button>
                    <button
                        onClick={() => { setModalMode('join'); setIsModalOpen(true); }}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-black py-5 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                    >
                        <UserPlus size={18} /> Join Unit
                    </button>
                </div>

                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={fetchTeamData}
                    initialMode={modalMode}
                />
            </div>
        );
    }

    const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f43f5e', '#f59e0b'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{team.name}</h2>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 rounded-lg flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Active Node
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium tracking-tight">Collaborating on {team.projectCount} active projects within this unit.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    {['Overview', 'Members', 'Tasks'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Team Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TeamSummaryCard
                    icon={<Users className="text-indigo-600" />}
                    label="Active Unit"
                    value={team.memberCount}
                    sub="Total Collaborators"
                />
                <TeamSummaryCard
                    icon={<CheckCircle2 className="text-emerald-600" />}
                    label="Output Matrix"
                    value={team.completedTasks}
                    sub="Fulfilled Objectives"
                />
                <TeamSummaryCard
                    icon={<Clock className="text-cyan-600" />}
                    label="Focus Telemetry"
                    value={`${team.totalHours}h`}
                    sub="Cumulative Capacity"
                />
            </div>

            {/* Productivity Chart */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                        <BarChart3 size={24} className="text-indigo-600" />
                        Contribution Distribution
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-xl">
                        <TrendingUp size={14} className="text-emerald-500" /> Output increased by 12%
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={team.memberStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                                itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '10px' }}
                            />
                            <Bar dataKey="hours" radius={[12, 12, 0, 0]} barSize={40}>
                                {team.memberStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                        <Trophy size={28} className="text-amber-500" />
                        Alpha Performers
                    </h3>
                    <div className="space-y-4">
                        {team.memberStats.sort((a, b) => b.hours - a.hours).slice(0, 3).map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-sm">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-lg tracking-tight uppercase">{member.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{member.projects} Core Projects</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{member.hours}h</p>
                                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Logged Capacity</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck size={160} className="text-white" />
                    </div>
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                        <ShieldCheck size={48} className="text-indigo-400" />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Expand Perimeter</h3>
                        <p className="text-slate-400 font-medium leading-relaxed max-w-sm">Integrate additional contributors to unlock aggregate productivity heatmaps and strategic analysis.</p>
                    </div>
                    <button
                        onClick={() => { setModalMode('join'); setIsModalOpen(true); }}
                        className="bg-indigo-600 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-4 text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 relative z-10"
                    >
                        Invite Collaborators <ArrowRight size={20} />
                    </button>

                    {team.inviteCode && (
                        <div className="mt-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl relative z-10">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Private Secure Key</p>
                            <p className="text-xl font-black text-white tracking-[0.4em] font-mono">{team.inviteCode}</p>
                        </div>
                    )}
                </div>
            </div>

            <TeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchTeamData}
                initialMode={modalMode}
            />
        </div>
    );
};

const TeamSummaryCard = ({ icon, label, value, sub }) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 space-y-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default shadow-sm group">
        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h4 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 mb-1">{label}</p>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{sub}</p>
        </div>
    </div>
);

export default Team;
