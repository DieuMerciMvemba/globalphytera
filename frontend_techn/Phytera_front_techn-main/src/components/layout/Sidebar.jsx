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
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Tractor size={20} />, label: 'Exploitations', path: '/exploitations' },
        { icon: <Sprout size={20} />, label: 'Fields', path: '/fields' },
        { icon: <Cpu size={20} />, label: 'Devices', path: '/devices' },
        { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts' },
        { icon: <Plane size={20} />, label: 'Drone Missions', path: '/missions' },
        { icon: <Wrench size={20} />, label: 'Interventions', path: '/interventions' },
        { icon: <FileText size={20} />, label: 'Reports', path: '/reports' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        PhyTera
                    </span>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                    Menu Principal
                </div>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600/10 text-cyan-400 border border-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                }`}
                        >
                            <span className={`${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
