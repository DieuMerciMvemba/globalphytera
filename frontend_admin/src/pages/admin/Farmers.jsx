import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Tractor, Sprout, RefreshCw, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { technicianService } from '../../services/api';

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const loadFarmers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await technicianService.getFarmers();
            setFarmers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Erreur chargement agriculteurs réels:', err.message);
            setError(err.message || 'Impossible de charger les agriculteurs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFarmers();
    }, []);

    const filteredFarmers = farmers.filter((f) => {
        const query = search.toLowerCase();
        return (
            (f.nom && f.nom.toLowerCase().includes(query)) ||
            (f.email && f.email.toLowerCase().includes(query)) ||
            (f.farms && f.farms.some((farm) => farm.name.toLowerCase().includes(query)))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Agriculteurs</h2>
                    <p className="text-slate-400">Comptes agriculteurs, exploitations et parcelles en direct</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={loadFarmers} className="btn-outline text-sm flex items-center gap-2">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Agriculteur / Exploitation</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-center">Champs</th>
                            <th className="px-6 py-4 text-center">Capteurs</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <RefreshCw className="animate-spin" size={20} />
                                        <span>Chargement des comptes réels...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredFarmers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                    Aucun agriculteur trouvé.
                                </td>
                            </tr>
                        ) : (
                            filteredFarmers.map((farmer) => {
                                const farms = farmer.farms || [];
                                const totalFields = farms.reduce((acc, f) => acc + (f.fields?.length || 0), 0);
                                const totalDevices = farms.reduce(
                                    (acc, f) =>
                                        acc + (f.fields || []).reduce((dAcc, fld) => dAcc + (fld.devices?.length || 0), 0),
                                    0,
                                );
                                const status = farmer.isActive ? 'Actif' : 'Inactif';

                                return (
                                    <tr key={farmer.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Tractor size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{farmer.nom}</div>
                                                    <div className="text-xs text-slate-500">
                                                        {farms.length > 0 ? farms.map((f) => f.name).join(', ') : 'Aucune ferme'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            {farmer.email}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs text-emerald-400">
                                                <Sprout size={12} /> {totalFields}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-white text-xs">
                                            {totalDevices}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Farmers;
