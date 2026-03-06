import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Clock, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../api/axios';

const TimerCard = ({ activeTimer, onStart, onStop, tasks }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [sessionType, setSessionType] = useState('Coding');
    const timerRef = useRef(null);

    useEffect(() => {
        if (activeTimer) {
            const startTime = new Date(activeTimer.startTime).getTime();
            const updateTimer = () => {
                const now = new Date().getTime();
                setElapsedTime(Math.floor((now - startTime) / 1000));
            };
            updateTimer();
            timerRef.current = setInterval(updateTimer, 1000);
        } else {
            clearInterval(timerRef.current);
            setElapsedTime(0);
        }
        return () => clearInterval(timerRef.current);
    }, [activeTimer]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        if (!selectedTaskId) return alert('Please select a task first');
        onStart(selectedTaskId, sessionType);
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${activeTimer ? 'bg-indigo-600/10 opacity-100' : 'bg-indigo-600/5 opacity-50'}`}></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-8 flex-1 w-full">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black border border-indigo-100 uppercase tracking-widest">
                        {activeTimer ? 'Session Progressing' : 'System Standby'}
                    </div>

                    {!activeTimer && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 pl-1">Target Module</label>
                                <div className="relative">
                                    <select
                                        value={selectedTaskId}
                                        onChange={(e) => setSelectedTaskId(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-300 appearance-none transition-all"
                                    >
                                        <option value="">Choose a task to track...</option>
                                        {tasks.filter(t => t.status !== 'Done').map(task => (
                                            <option key={task._id} value={task._id}>{task.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 pl-1">Activity Classification</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Coding', 'Research', 'Meeting', 'Learning'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSessionType(type)}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${sessionType === type
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTimer && (
                        <div className="space-y-3 animate-in fade-in zoom-in duration-500">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Currently Tracking</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                {activeTimer.taskId?.title || 'System Core Activity'}
                            </h3>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {activeTimer.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertCircle size={14} className="text-indigo-600" />
                                    Optimizing Deep Focus
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-8 lg:min-w-[350px]">
                    <div className="text-8xl md:text-9xl font-black tracking-tighter text-slate-900 tabular-nums">
                        {formatTime(elapsedTime)}
                    </div>

                    {activeTimer ? (
                        <button
                            onClick={onStop}
                            className="w-full bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 font-black py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] group shadow-sm"
                        >
                            <Square size={16} className="fill-red-600" />
                            Terminate Session
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            disabled={!selectedTaskId}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                        >
                            <Play size={16} className="fill-white group-hover:scale-110 transition-transform" />
                            Begin Implementation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimerCard;
