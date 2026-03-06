import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Trophy, Flame, Rocket, Book, Star, Loader2, ChevronRight } from 'lucide-react';

const GamificationCard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGamification = async () => {
            try {
                const { data } = await API.get('/gamification/profile');
                setProfile(data);
            } catch (error) {
                console.error('Error fetching gamification data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGamification();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center bg-[#1e293b] rounded-3xl border border-slate-700/50"><Loader2 className="animate-spin text-indigo-500" /></div>;

    const { level, xp, nextLevelXp, badges } = profile || { level: 1, xp: 0, nextLevelXp: 1000, badges: [] };
    const progress = (xp / nextLevelXp) * 100;

    const badgeIcons = {
        'streak': <Flame size={18} className="text-orange-500" />,
        'commits': <Rocket size={18} className="text-cyan-400" />,
        'learning': <Book size={18} className="text-indigo-400" />,
        'default': <Star size={18} className="text-amber-400" />
    };

    return (
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full group-hover:bg-indigo-600/10 transition-all duration-700"></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-2xl">
                        {level}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Level {level}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{profile?.rank || 'Beginner Dev'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{xp} <span className="text-xs text-slate-400 font-bold">/ {nextLevelXp} XP</span></p>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-0.5">Lvl {level + 1} Evolution</p>
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2 relative z-10">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5 shadow-inner">
                    <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Badges Earned</h4>
                    <button className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest flex items-center hover:text-indigo-400 transition-colors">
                        View All <ChevronRight size={12} />
                    </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl hover:border-slate-300 transition-all cursor-default">
                            {badgeIcons[badge.type] || badgeIcons.default}
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">{badge.name}</span>
                        </div>
                    ))}
                    {badges.length === 0 && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic py-1">No badges earned yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamificationCard;
