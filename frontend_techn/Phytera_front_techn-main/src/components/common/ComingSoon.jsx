import React from 'react';
import { Construction } from 'lucide-react';
import Button from './Button';

const ComingSoon = ({ title, description = "Ce module est en cours de développement." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                <Construction size={48} className="text-slate-500" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-slate-400 max-w-md mx-auto">{description}</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.history.back()}>Retour</Button>
                <Button variant="primary" onClick={() => { }}>Me prévenir</Button>
            </div>
        </div>
    );
};

export default ComingSoon;
