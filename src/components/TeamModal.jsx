import React, { useState } from 'react';
import { X, Users, Plus, UserPlus, Loader2, Shield } from 'lucide-react';
import API from '../api/axios';

const TeamModal = ({ isOpen, onClose, onRefresh, initialMode = 'create' }) => {
    const [mode, setMode] = useState(initialMode); // 'create' or 'join'
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'create') {
                await API.post('/teams', { name, description });
                alert('Team created successfully!');
            } else {
                await API.post('/teams/join', { inviteCode });
                alert('Joined team successfully!');
            }
            onRefresh();
            onClose();
            setName('');
            setDescription('');
            setInviteCode('');
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="relative p-8 space-y-6">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            {mode === 'create' ? <Users className="text-indigo-600" size={24} /> : <UserPlus className="text-indigo-600" size={24} />}
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                {mode === 'create' ? 'Assemble Squad' : 'Enlist in Unit'}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                {mode === 'create' ? 'Initialize collaborative node' : 'Enter authorized invite key'}
                            </p>
                        </div>
                    </div>

                    <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setMode('create')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${mode === 'create' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Establish
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${mode === 'join' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Authorize
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'create' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Squad Designation</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Core Architecture Team"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Brief</label>
                                    <textarea
                                        placeholder="Define the scope of this mission..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[120px] resize-none font-medium"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Transmission Key</label>
                                <input
                                    type="text"
                                    placeholder="000-0000"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-center text-3xl font-black tracking-[0.4em]"
                                    required
                                    maxLength={7}
                                />
                                <p className="text-[9px] text-slate-400 text-center font-medium uppercase tracking-tight italic">Verify key with squad administrator before initialization.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-[10px]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>{mode === 'create' ? <Plus size={18} /> : <Shield size={18} />} {mode === 'create' ? 'Initialize Node' : 'Enlist Squad'}</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;
