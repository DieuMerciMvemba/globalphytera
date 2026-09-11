import React from 'react';
import clsx from 'clsx';

const StatusBadge = ({ status, type = 'default' }) => {
    const getStyles = () => {
        // Normalization
        const normalizedStatus = status.toLowerCase();

        // Status Logic
        if (['nouveau', 'en ligne', 'actif', 'disponible', 'résolu'].includes(normalizedStatus)) {
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        }
        if (['en cours', 'mission', 'maintenance', 'assigné'].includes(normalizedStatus)) {
            return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        }
        if (['urgent', 'hors ligne', 'batterie faible', 'suspendu'].includes(normalizedStatus)) {
            return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        }
        if (['attente', 'pending'].includes(normalizedStatus)) {
            return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        }
        return 'bg-slate-700 text-slate-300 border border-slate-600';
    };

    return (
        <span className={clsx(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
            getStyles()
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
