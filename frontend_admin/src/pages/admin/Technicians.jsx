import React, { useState, useEffect } from 'react';
import { User, MapPin, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { technicianService } from '../../services/api';

const Technicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTechnicians = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await technicianService.getAll();
            setTechnicians(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Erreur chargement techniciens réels:', err.message);
            setError(err.message || 'Impossible de charger les techniciens');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTechnicians();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Techniciens</h2>
                    <p className="text-slate-400">Équipe technique réelle enregistrée en base Supabase</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadTechnicians} className="btn-outline flex items-center gap-2">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                    </button>
                    <button className="btn-primary">
                        <User size={18} /> Ajouter un technicien
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-16 text-slate-400 gap-3">
                    <RefreshCw className="animate-spin" size={24} />
                    <span>Chargement des techniciens...</span>
                </div>
            ) : technicians.length === 0 ? (
                <div className="card text-center py-12 text-slate-400">
                    Aucun technicien enregistré en base de données.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {technicians.map((tech) => {
                        const prefs = tech.preferences || {};
                        const ticketsCount = tech.maintenanceTickets?.length || 0;
                        const status = tech.isActive ? 'Disponible' : 'Inactif';

                        return (
                            <div key={tech.id} className="card relative group hover:border-slate-500 transition-colors">
                                <div className="absolute top-4 right-4">
                                    <StatusBadge status={status} />
                                </div>

                                <div className="flex flex-col items-center text-center mt-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 mb-4 border-2 border-slate-600">
                                        <User size={40} />
                                    </div>
                                    <h3 className="font-bold text-white text-lg">{tech.nom}</h3>
                                    <p className="text-primary text-sm font-medium">{tech.email}</p>

                                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                                        <MapPin size={12} /> {prefs.sector || 'Secteur Général'}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between text-sm pt-2">
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Clock size={14} /> Tickets assignés
                                        </span>
                                        <span className="text-white font-mono font-bold">{ticketsCount}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button className="w-full btn-outline text-xs h-9">Voir Interventions</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Technicians;
