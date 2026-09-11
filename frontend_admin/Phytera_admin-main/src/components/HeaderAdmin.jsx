import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

const HeaderAdmin = ({ title, onMenuClick }) => {
    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-white">{title || 'Dashboard'}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-primary/50 w-64"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">Admin Principal</p>
                            <p className="text-xs text-slate-400">Superviseur</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600 text-slate-300">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
