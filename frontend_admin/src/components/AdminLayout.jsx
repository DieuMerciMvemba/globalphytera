import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import HeaderAdmin from './HeaderAdmin';

import { LayoutDashboard, AlertTriangle, Users, Wifi, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const getPageTitle = (pathname) => {
        switch (true) {
            case pathname.includes('/dashboard'): return 'Tableau de Bord';
            case pathname.includes('/reports'): return 'Gestion des Signalements';
            case pathname.includes('/technicians'): return 'Équipe Technique';
            case pathname.includes('/iot'): return 'Supervision IoT';
            case pathname.includes('/farmers'): return 'Agriculteurs';
            case pathname.includes('/marketplace'): return 'Marketplace';
            default: return 'Phytera Admin';
        }
    };

    return (
        <div className="flex h-screen bg-phytera-bg overflow-hidden text-slate-100">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
                <HeaderAdmin
                    title={getPageTitle(location.pathname)}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-20 lg:pb-8">
                    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Navigation Bar (Mobile-first pour l'administrateur) */}
                <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                                isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-white'
                            }`
                        }
                    >
                        <LayoutDashboard size={19} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/reports"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                                isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-white'
                            }`
                        }
                    >
                        <AlertTriangle size={19} />
                        <span>Alertes</span>
                    </NavLink>

                    <NavLink
                        to="/admin/technicians"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                                isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-white'
                            }`
                        }
                    >
                        <Users size={19} />
                        <span>Équipe</span>
                    </NavLink>

                    <NavLink
                        to="/admin/iot"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
                                isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-white'
                            }`
                        }
                    >
                        <Wifi size={19} />
                        <span>Parc IoT</span>
                    </NavLink>

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu size={19} />
                        <span>Menu</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default AdminLayout;
