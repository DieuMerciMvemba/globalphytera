import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Tractor,
    Sprout,
    Cpu,
    Bell,
    Plane,
    Wrench,
    FileText,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { authService } from '../../services/authService';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Tractor size={20} />, label: 'Exploitations', path: '/exploitations' },
        { icon: <Sprout size={20} />, label: 'Parcelles', path: '/fields' },
        { icon: <Cpu size={20} />, label: 'Boîtiers IoT', path: '/devices' },
        { icon: <Bell size={20} />, label: 'Alertes', path: '/alerts' },
        { icon: <Plane size={20} />, label: 'Missions Drone', path: '/missions' },
        { icon: <Wrench size={20} />, label: 'Interventions', path: '/interventions' },
        { icon: <FileText size={20} />, label: 'Rapports', path: '/reports' },
        { icon: <Settings size={20} />, label: 'Paramètres', path: '/settings' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* Logo & Mobile Close */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => handleNavigate('/')}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                            PhyTera
                        </span>
                        <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase -mt-1">
                            Technicien
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Fermer le menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                    Menu Technicien
                </div>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={index}
                            onClick={() => handleNavigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm ${
                                isActive
                                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/5 text-cyan-400 border border-cyan-500/25 font-semibold shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <span className={`${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400 transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
