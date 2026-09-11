import React, { useState } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Badge from '../common/Badge';
import NotificationPanel from '../common/NotificationPanel';

const Header = () => {
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Determine page title based on path
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Vue d\'ensemble';
            case '/missions': return 'Missions Drone';
            case '/exploitations': return 'Exploitations';
            case '/devices': return 'Appareils Connectés';
            case '/analytics': return 'Analyses & Rapports';
            case '/settings': return 'Paramètres';
            default: return 'Tableau de Bord';
        }
    };

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
            {/* Left : Title & Mobile Menu */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-100 tracking-tight">{getPageTitle()}</h1>
                    <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Dernière mise à jour : il y a 2 min</p>
                </div>
            </div>

            {/* Right : Actions */}
            <div className="flex items-center gap-6">

                {/* Search Bar */}
                <div className="hidden md:flex relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-slate-600"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2 transition-colors rounded-full hover:bg-slate-900/50 ${isNotifOpen ? 'text-cyan-400 bg-slate-900/50' : 'text-slate-400 hover:text-cyan-400'}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                    </button>
                    <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-slate-800" />

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">Thomas Dubois</p>
                        <p className="text-xs text-slate-500">Technicien Senior</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-500/30 transition-all">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
