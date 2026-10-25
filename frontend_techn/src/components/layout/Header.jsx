import React, { useState } from 'react';
import { Bell, Search, Menu, User, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationPanel from '../common/NotificationPanel';
import { authService } from '../../services/authService';

const Header = ({ onMenuClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const user = authService.getUser() || { nom: 'Thomas Dubois', role: 'TECHNICIEN' };

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Vue d\'ensemble';
            case '/missions': return 'Missions Drone';
            case '/exploitations': return 'Exploitations & Clients';
            case '/devices': return 'Boîtiers Connectés';
            case '/fields': return 'Cartographie des Parcelles';
            case '/interventions': return 'Interventions Terrain';
            case '/reports': return 'Rapports & Audit';
            case '/analytics': return 'Analyses Agronomiques';
            case '/settings': return 'Paramètres';
            default: return 'Tableau de Bord';
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60 shadow-sm">
            {/* Left : Title & Mobile Menu Button */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">{getPageTitle()}</h1>
                    <p className="text-[11px] text-slate-400 hidden sm:block">Espace Technicien Agréé PhyTera</p>
                </div>
            </div>

            {/* Right : Actions & User */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Search Bar on desktop */}
                <div className="hidden md:flex relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher exploitation, boîtier..."
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-full py-2 pl-9 pr-4 w-56 lg:w-64 focus:outline-none focus:border-cyan-500/50 transition-all placeholder-slate-600"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2 transition-colors rounded-xl border border-slate-800 hover:border-slate-700 ${
                            isNotifOpen ? 'text-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-white bg-slate-900/60'
                        }`}
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                    </button>
                    <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </div>

                {/* User Profile Mini */}
                <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-200">{user.nom || 'Technicien'}</p>
                        <p className="text-[10px] text-cyan-400 font-mono uppercase">Technicien</p>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors hidden sm:block"
                        title="Déconnexion"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
