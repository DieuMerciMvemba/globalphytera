import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import HeaderAdmin from './HeaderAdmin';

const AdminLayout = () => {
    const location = useLocation();

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Determine title based on path
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
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
                <HeaderAdmin
                    title={getPageTitle(location.pathname)}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
