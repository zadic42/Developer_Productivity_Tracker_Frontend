import React, { useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';

const SkillModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Frontend');
    const [level, setLevel] = useState(50);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave({ name, category, level });
        setSubmitting(false);
        setName('');
        setLevel(50);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                            <Sparkles className="text-indigo-600" size={24} />
                            Mastery Registry
                        </h3>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Skill Identifier</label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                placeholder="e.g. System Architect, React Native"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Category Sector</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Frontend', 'Backend', 'DevOps', 'Design', 'Mobile', 'Other'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${category === cat
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10'
                                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mastery Level</label>
                                <span className="text-sm font-black text-indigo-600">{level}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Commit Skill'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SkillModal;
