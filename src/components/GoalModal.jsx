import React, { useState } from 'react';
import { X, Loader2, Target, Calendar, Flag } from 'lucide-react';

const GoalModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState(1);
    const [unit, setUnit] = useState('tasks');
    const [deadline, setDeadline] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave({ title, description, target, unit, deadline });
        setSubmitting(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setTarget(1);
        setUnit('tasks');
        setDeadline('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                            <Target className="text-indigo-600" size={28} />
                            Mission Protocol
                        </h3>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Objective Identifier</label>
                            <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                placeholder="e.g. Master React Native Architecture"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Target Magnitude</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-black"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Magnitude Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none font-black uppercase tracking-widest text-[10px]"
                                >
                                    <option value="tasks">Tasks</option>
                                    <option value="hours">Hours</option>
                                    <option value="problems">Problems</option>
                                    <option value="projects">Projects</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Deadline Horizon</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                                    required
                                />
                                <Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] mt-6"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Flag size={20} />
                                    Initialize Tracker
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GoalModal;
