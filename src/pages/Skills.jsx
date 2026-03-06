import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Loader2, Plus, Zap, Award } from 'lucide-react';
import SkillModal from '../components/SkillModal';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data } = await API.get('/skills');
            setSkills(data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSkill = async (skillData) => {
        try {
            const { data } = await API.post('/skills', skillData);
            setSkills(prev => {
                const existingIndex = prev.findIndex(s => s._id === data._id || s.name === data.name);
                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = data;
                    return updated.sort((a, b) => b.level - a.level);
                }
                return [...prev, data].sort((a, b) => b.level - a.level);
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving skill:', error);
            alert(error.response?.data?.message || 'Error saving skill');
        }
    };

    const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Other', 'Design', 'Mobile'];
    const filteredSkills = filter === 'All' ? skills : skills.filter(s => s.category === filter);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Lvl 99 Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Skill Matrix</h2>
                    <p className="text-slate-500 font-medium">Visualizing your growth across the tech stack.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Register Skill
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === cat
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSkills.map((skill, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-300 transition-all group shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600 border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                    <Zap size={28} fill="currentColor" className="opacity-20" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{skill.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{skill.category || 'Standard'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-slate-900 tracking-tighter">{skill.level}%</div>
                                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Mastery</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Neophyte</span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Archmage</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredSkills.length === 0 && (
                    <div className="md:col-span-2 bg-white p-16 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-200 border border-slate-100">
                            <Award size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-900 font-black uppercase tracking-tight text-lg">No skills logged in this sector</p>
                            <p className="text-xs text-slate-500 font-medium max-w-sm">Acquire new knowledge and register it here to visualize your professional evolution.</p>
                        </div>
                    </div>
                )}
            </div>

            <SkillModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSkill}
            />
        </div>
    );
};

export default Skills;
