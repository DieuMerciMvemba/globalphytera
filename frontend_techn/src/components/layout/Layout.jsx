import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Tractor, Cpu, Wrench, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Area (adapte mobile: pl-0, desktop: pl-64) */}
            <main className="lg:pl-64 pl-0 min-h-screen transition-all duration-300 flex flex-col flex-1 pb-16 lg:pb-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation Bar (Mobile-first pour le technicien sur le terrain) */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`
                    }
                >
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/exploitations"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`
                    }
                >
                    <Tractor size={19} />
                    <span>Clients</span>
                </NavLink>

                <NavLink
                    to="/devices"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`
                    }
                >
                    <Cpu size={19} />
                    <span>Boîtiers</span>
                </NavLink>

                <NavLink
                    to="/interventions"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`
                    }
                >
                    <Wrench size={19} />
                    <span>Missions</span>
                </NavLink>

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <Menu size={19} />
                    <span>Menu</span>
                </button>
            </nav>

            {/* Background Ambient Glow */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
};

export default Layout;
