import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Tag, Flag } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task, initialStatus }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        tags: [],
        subtasks: [],
        estimatedTime: 0
    });
    const [newTag, setNewTag] = useState('');
    const [newSubtask, setNewSubtask] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({ ...task });
        } else {
            setFormData(prev => ({ ...prev, status: initialStatus || 'Todo', title: '', description: '', tags: [], subtasks: [], estimatedTime: 0 }));
        }
    }, [task, initialStatus, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
    };

    const addSubtask = () => {
        if (newSubtask.trim()) {
            setFormData({
                ...formData,
                subtasks: [...formData.subtasks, { title: newSubtask.trim(), completed: false }]
            });
            setNewSubtask('');
        }
    };

    const toggleSubtask = (index) => {
        const updatedSubtasks = [...formData.subtasks];
        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
        setFormData({ ...formData, subtasks: updatedSubtasks });
    };

    const removeSubtask = (index) => {
        setFormData({ ...formData, subtasks: formData.subtasks.filter((_, i) => i !== index) });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{task ? 'Edit Objective' : 'New Mission'}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Protocol Delta-9: Task Initialization</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-lg tracking-tight"
                                placeholder="e.g. Architect Authentication Node"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Parameters (Description)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[120px] resize-none font-medium leading-relaxed"
                                placeholder="Details regarding execution and deliverables..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Flag size={14} className="text-indigo-600" /> Priority Level
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none font-black uppercase tracking-widest text-[10px]"
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                    <option value="Critical">Critical Priority</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Clock size={14} className="text-indigo-600" /> Estimated Magnitude (Hrs)
                                </label>
                                <input
                                    type="number"
                                    value={formData.estimatedTime}
                                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-black"
                                    min="0"
                                    step="0.5"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={14} className="text-indigo-600" /> Technology Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, i) => (
                                    <span key={i} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-white transition-colors">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 bg-transparent border-none py-2 px-4 text-sm text-slate-900 focus:outline-none placeholder:text-slate-300 font-medium"
                                    placeholder="Enter identifier..."
                                />
                                <button type="button" onClick={addTag} className="bg-white hover:bg-slate-100 text-slate-900 p-2 rounded-xl border border-slate-200 transition-all shadow-sm">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Objectives (Timeline)</label>
                            <div className="space-y-2 mb-3">
                                {formData.subtasks.map((sub, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={sub.completed}
                                                    onChange={() => toggleSubtask(i)}
                                                    className="w-5 h-5 rounded-lg border-slate-200 bg-white text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                                />
                                            </div>
                                            <span className={`text-[13px] font-medium tracking-tight ${sub.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                                {sub.title}
                                            </span>
                                        </div>
                                        <button type="button" onClick={() => removeSubtask(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <input
                                    type="text"
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                                    className="flex-1 bg-transparent border-none py-2 px-4 text-sm text-slate-900 focus:outline-none placeholder:text-slate-300 font-medium"
                                    placeholder="Define sub-task..."
                                />
                                <button type="button" onClick={addSubtask} className="bg-white hover:bg-slate-100 text-slate-900 p-2 rounded-xl border border-slate-200 transition-all shadow-sm">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-900 font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all uppercase tracking-widest text-[10px]"
                        >
                            {task ? 'Commit Changes' : 'Initialize Mission'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
