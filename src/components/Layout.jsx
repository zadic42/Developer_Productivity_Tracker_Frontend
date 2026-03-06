import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
