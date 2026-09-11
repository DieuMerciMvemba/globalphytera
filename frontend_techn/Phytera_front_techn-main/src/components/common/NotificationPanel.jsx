import React, { useRef, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import Button from './Button';

const NotificationPanel = ({ isOpen, onClose }) => {
    const panelRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const notifications = [
        {
            id: 1,
            type: 'warning',
            title: 'Niveau d\'eau critique',
            message: 'Réservoir principal à 15%',
            time: 'Il y a 10 min',
            read: false
        },
        {
            id: 2,
            type: 'info',
            title: 'Mission Terminée',
            message: 'Survol Zone Nord : Succès',
            time: 'Il y a 45 min',
            read: false
        },
        {
            id: 3,
            type: 'error',
            title: 'Erreur Capteur',
            message: 'Sonde Hygrométrie #4 H.S.',
            time: 'Il y a 2h',
            read: true
        }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'info': default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div
            ref={panelRef}
            className="absolute top-16 right-20 w-80 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="font-semibold text-slate-100">Notifications</h3>
                <div className="flex gap-2">
                    <button className="text-xs text-cyan-400 hover:text-cyan-300">Tout lire</button>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer ${!notif.read ? 'bg-slate-800/10' : ''}`}>
                        <div className="flex gap-3">
                            <div className="mt-1">
                                {getIcon(notif.type)}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${!notif.read ? 'text-slate-100' : 'text-slate-400'}`}>
                                    {notif.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-slate-600 mt-2">{notif.time}</p>
                            </div>
                            {!notif.read && (
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-slate-700/50 text-center">
                <Button variant="ghost" className="w-full text-xs py-2 h-auto text-slate-400 hover:text-white justify-center">
                    Voir tout l'historique
                </Button>
            </div>
        </div>
    );
};

export default NotificationPanel;
