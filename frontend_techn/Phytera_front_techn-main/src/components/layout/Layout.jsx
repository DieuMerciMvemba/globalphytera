import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <main className="pl-64 min-h-screen transition-all duration-300 flex flex-col">
                <Header />
                <div className="p-8 max-w-7xl mx-auto w-full flex-1">
                    {children}
                </div>
            </main>

            {/* Background Ambient Glow */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
};

export default Layout;
