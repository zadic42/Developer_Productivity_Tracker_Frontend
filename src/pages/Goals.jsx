import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Loader2, Plus, Target, Calendar, Trophy, ArrowRight, Flag } from 'lucide-react';
import GoalModal from '../components/GoalModal';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const { data } = await API.get('/goals');
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGoal = async (goalData) => {
        try {
            const { data } = await API.post('/goals', goalData);
            setGoals(prev => [...prev, data].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving goal:', error);
            alert(error.response?.data?.message || 'Error saving goal');
        }
    };

    const handleIncrementProgress = async (id, currentProgress, target) => {
        try {
            const newProgress = Math.min(target, currentProgress + 1);
            const { data } = await API.patch(`/goals/${id}`, { progress: newProgress });
            setGoals(prev => prev.map(g => g._id === id ? data : g));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const getDaysLeft = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days left` : 'Expired';
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Aligning your targets...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Milestones</h2>
                    <p className="text-slate-500 font-medium">Define your professional targets and track implementation.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Archive Target
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {goals.map((goal, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group hover:border-indigo-300 transition-all shadow-sm">
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] -mr-24 -mt-24 transition-opacity opacity-10 ${goal.progress >= goal.target ? 'bg-emerald-600' : 'bg-indigo-600'}`}></div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <Flag size={14} /> Objective Module
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors uppercase tracking-tight leading-tight">{goal.title}</h3>
                                </div>
                                {goal.progress >= goal.target ? (
                                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                                        <Trophy size={28} />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 text-slate-300 rounded-2xl border border-slate-100 flex items-center justify-center">
                                        <Target size={28} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{goal.progress}</span>
                                            <span className="text-sm text-slate-400 font-black uppercase tracking-widest">/ {goal.target} {goal.unit || 'units'}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-slate-50 rounded-lg w-fit">Registry Progress</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-2 rounded-xl border ${new Date(goal.deadline) < new Date() ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            <Calendar size={14} />
                                            {getDaysLeft(goal.deadline)}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <div
                                        className={`h-full transition-all duration-1000 ${goal.progress >= goal.target ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                        style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={`https://ui-avatars.com/api/?name=U&background=0f172a&color=fff&bold=true`} alt="User" />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Bound Goal</span>
                                </div>
                                <button
                                    onClick={() => handleIncrementProgress(goal._id, goal.progress, goal.target)}
                                    disabled={goal.progress >= goal.target}
                                    className="text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group/btn disabled:opacity-20 disabled:cursor-not-allowed bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-xl"
                                >
                                    {goal.progress >= goal.target ? 'Fulfilled' : 'Increment Telemetry'} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {goals.length === 0 && (
                    <div className="lg:col-span-2 bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="p-8 bg-slate-50 rounded-full text-slate-200 border border-slate-100">
                            <Target size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-900 font-black uppercase tracking-tight text-xl">Operational Vacuum Detected</p>
                            <p className="text-xs text-slate-500 font-medium max-w-sm">No active milestones registered. Establish new professional coordinates to begin tracking.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 bg-slate-50 hover:bg-slate-100 text-slate-900 font-black py-4 px-10 rounded-2xl border border-slate-200 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest"
                        >
                            <Plus size={18} /> Initialize Objective
                        </button>
                    </div>
                )}
            </div>

            <GoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveGoal}
            />
        </div>
    );
};

export default Goals;
