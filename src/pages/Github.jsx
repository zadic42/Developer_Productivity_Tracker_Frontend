import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import {
    Github as GithubIcon,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Loader2,
    ExternalLink,
    Flame,
    RefreshCw,
    Code2,
    Shield
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

const Github = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [linking, setLinking] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [streak, setStreak] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        fetchGithubData();
    }, []);

    const fetchGithubData = async () => {
        try {
            const [profileRes, metricsRes, streakRes] = await Promise.all([
                API.get('/user/profile'), // To check if githubUsername exists
                API.get('/github/metrics'),
                API.get('/github/streak')
            ]);

            setUserProfile(profileRes.data);
            if (profileRes.data.githubUsername) {
                setUsername(profileRes.data.githubUsername);
            }
            setMetrics(metricsRes.data);
            setStreak(streakRes.data);
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkProfile = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLinking(true);
        try {
            const { data } = await API.patch('/github/profile', { githubUsername: username });

            // Sync localStorage user object
            const localUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...localUser, githubUsername: data.githubUsername }));

            setUserProfile(prev => ({ ...prev, githubUsername: data.githubUsername }));
            await fetchGithubData();
            alert('GitHub profile linked successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error linking profile');
        } finally {
            setLinking(false);
        }
    };

    const topLanguagesData = metrics?.topLanguages ? Object.entries(metrics.topLanguages).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value).slice(0, 6) : [];

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Fetching GitHub artifacts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <GithubIcon size={40} />
                        GitHub Nexus
                    </h2>
                    <p className="text-slate-500 font-medium tracking-tight">Synchronized contribution telemetry and repository insights.</p>
                </div>
                {userProfile?.githubUsername && (
                    <button
                        onClick={fetchGithubData}
                        className="px-6 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-slate-100"
                    >
                        <RefreshCw size={16} /> Resync Node
                    </button>
                )}
            </div>

            {/* Link Profile Section */}
            {!userProfile?.githubUsername ? (
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden text-center">
                    <div className="relative z-10 max-w-lg mx-auto space-y-8">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                            <GithubIcon size={48} className="text-white" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Protocol: GitHub Link</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Establish a secure connection with your GitHub profile to visualize contribution streaks, language proficiency, and real-time development metrics.</p>
                        </div>
                        <form onSubmit={handleLinkProfile} className="flex gap-3 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                            <input
                                type="text"
                                placeholder="GitHub Identifier (username)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-1 bg-transparent border-none py-4 px-6 text-slate-900 focus:outline-none placeholder:text-slate-300 font-medium"
                                required
                            />
                            <button
                                type="submit"
                                disabled={linking}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                            >
                                {linking ? <Loader2 className="animate-spin" size={20} /> : 'Initialize'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GithubStatCard
                            icon={<GitCommit className="text-indigo-600" />}
                            label="Committed"
                            value={metrics?.commits || 0}
                            sub="Rolling 7 Day Window"
                        />
                        <GithubStatCard
                            icon={<GitPullRequest className="text-emerald-600" />}
                            label="Integrations"
                            value={metrics?.prs || 0}
                            sub="Pull Request Activity"
                        />
                        <GithubStatCard
                            icon={<AlertCircle className="text-amber-600" />}
                            label="Resolutions"
                            value={metrics?.issues || 0}
                            sub="Issue Engagements"
                        />

                        {/* Language Distribution */}
                        <div className="md:col-span-3 bg-white p-10 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center gap-12 shadow-sm">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <h3 className="text-xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-3 uppercase tracking-tight">
                                    <Code2 size={24} className="text-indigo-600" />
                                    Technology Stack
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">Data synthesized from your public repositories and contributions across the GitHub network.</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                                    {topLanguagesData.map((lang, i) => (
                                        <div key={i} className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{lang.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[250px] w-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topLanguagesData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {topLanguagesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Streak & Profile Info */}
                    <div className="space-y-6">
                        <div className="bg-orange-50 p-10 rounded-[2.5rem] border border-orange-100 text-center space-y-8 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                <Flame size={160} className="text-orange-600" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-4">Contribution Streak</p>
                                <div className="text-8xl font-black text-slate-900 drop-shadow-sm flex items-center justify-center gap-4">
                                    {streak?.streak || 0}
                                    <Flame size={56} fill="currentColor" className="text-orange-600 animate-pulse" />
                                </div>
                                <p className="text-slate-500 text-xs mt-6 font-medium leading-relaxed max-w-[180px] mx-auto">Maintain operational momentum. Every commit accelerates growth.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={`https://github.com/${username}.png`} alt="GitHub Avatar" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 tracking-tight text-lg leading-none">@{username}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Active Protocol</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.open(`https://github.com/${username}`, '_blank')}
                                className="w-full bg-[#0f172a] hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                            >
                                View on GitHub <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const GithubStatCard = ({ icon, label, value, sub }) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 space-y-6 hover:border-indigo-300 transition-all cursor-default shadow-sm">
        <div className="flex justify-between items-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">{icon}</div>
        </div>
        <div>
            <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{value}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-1">{label}</p>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{sub}</p>
        </div>
    </div>
);

export default Github;
