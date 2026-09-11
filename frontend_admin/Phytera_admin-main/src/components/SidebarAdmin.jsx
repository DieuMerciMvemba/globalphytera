import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    AlertTriangle,
    Users,
    Wifi,
    Sprout,
    ShoppingBag,
    Settings,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

const SidebarAdmin = ({ isOpen, onClose }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: AlertTriangle, label: 'Signalements', path: '/admin/reports' },
        { icon: Users, label: 'Techniciens', path: '/admin/technicians' },
        { icon: Wifi, label: 'Supervision IoT', path: '/admin/iot' },
        { icon: Sprout, label: 'Agriculteurs', path: '/admin/farmers' },
        { icon: ShoppingBag, label: 'Marketplace', path: '/admin/marketplace' },
    ];

    return (
        <aside
            className={clsx(
                "w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">PHYTERA</span>
                </div>
                {/* Mobile Close Button */}
                <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onClose && onClose()}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                        )}
                    >
                        <item.icon size={20} className={clsx("group-hover:scale-110 transition-transform")} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
                    <Settings size={20} />
                    <span className="font-medium">Paramètres</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
