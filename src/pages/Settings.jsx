import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Bell, Lock, Shield, Globe, Palette, LogOut, Check } from 'lucide-react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('Profile');

    const sections = [
        { id: 'Profile', icon: <User size={20} />, active: true },
        { id: 'Security', icon: <Lock size={20} /> },
        { id: 'Notifications', icon: <Bell size={20} /> },
        { id: 'Permissions', icon: <Shield size={20} /> },
        { id: 'Display', icon: <Palette size={20} /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Control Center</h2>
                    <p className="text-slate-500 font-medium">Configure your development environment and security protocol.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 space-y-3">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-8 py-5 rounded-[1.5rem] font-black transition-all uppercase tracking-widest text-[10px] border
                                ${activeSection === section.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-900'}`}
                        >
                            <span className={activeSection === section.id ? 'text-indigo-400' : 'text-slate-300'}>{section.icon}</span>
                            {section.id}
                        </button>
                    ))}
                    <div className="pt-6 mt-6 border-t border-slate-100">
                        <button className="w-full flex items-center gap-4 px-8 py-5 rounded-[1.5rem] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest text-[10px]">
                            <LogOut size={20} /> Terminate Session
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden p-10 lg:p-16 space-y-12">
                    {activeSection === 'Profile' && (
                        <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                            <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-100">
                                <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative group">
                                    JD
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-lg">
                                        <Palette size={16} className="text-indigo-600" />
                                    </button>
                                </div>
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Profile Identity</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">System-wide identifier for your collaborative contributions.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Key (Email)</label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        disabled
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-400 cursor-not-allowed opacity-60 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Protocol (Bio)</label>
                                <textarea
                                    placeholder="Specify your technical specialization and expertise..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all h-40 resize-none font-medium leading-relaxed"
                                />
                            </div>

                            <button className="bg-slate-900 hover:bg-slate-800 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center gap-4 uppercase tracking-widest text-[10px]">
                                <Check size={20} className="text-emerald-400" /> Sync Intelligence
                            </button>
                        </div>
                    )}

                    {activeSection !== 'Profile' && (
                        <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-8 text-slate-300 animate-in fade-in duration-700">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                                <SettingsIcon size={48} className="animate-spin-slow opacity-20" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{activeSection} Module</h4>
                                <p className="font-medium text-slate-400 max-w-xs">{activeSection} configuration protocol is currently under development.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
