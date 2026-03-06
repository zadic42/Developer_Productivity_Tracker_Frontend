import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Clock,
    BarChart3,
    Zap,
    Target,
    Github,
    Bell,
    Users,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
        { icon: <Clock size={20} />, label: 'Time Tracker', path: '/time' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
        { icon: <Zap size={20} />, label: 'Skills', path: '/skills' },
        { icon: <Target size={20} />, label: 'Goals', path: '/goals' },
        { icon: <Github size={20} />, label: 'GitHub', path: '/github' },
        { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
        { icon: <Users size={20} />, label: 'Team', path: '/team' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all shadow-sm">
            <div className="p-6">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Dev<span className="text-indigo-600">Tracker</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Enterprise</p>
                    <p className="text-xs text-slate-600 font-medium">Unlock advanced team features.</p>
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                        Coming soon
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
