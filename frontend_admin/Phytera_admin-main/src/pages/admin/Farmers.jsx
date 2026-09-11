import React from 'react';
import { Search, MoreVertical, Tractor, Sprout } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const Farmers = () => {
    const farmers = [
        { id: 1, name: 'Jean Dupont', farm: 'EARL du Soleil', plan: 'Premium', fields: 12, sensors: 45, status: 'Actif' },
        { id: 2, name: 'Marie Curie', farm: 'Vergers de Marie', plan: 'Standard', fields: 4, sensors: 12, status: 'Actif' },
        { id: 3, name: 'Marc Oger', farm: 'Vignes Oger & Fils', plan: 'Pro', fields: 8, sensors: 24, status: 'Retard Paiement' },
        { id: 4, name: 'Sophie Martin', farm: 'Bio Ferme', plan: 'Premium', fields: 15, sensors: 60, status: 'Actif' },
        { id: 5, name: 'Paul Riche', farm: 'Céréales du Nord', plan: 'Standard', fields: 20, sensors: 10, status: 'Suspendu' },
    ];

    const getPlanBadge = (plan) => {
        switch (plan) {
            case 'Premium': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Pro': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-700 text-slate-300 border-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Agriculteurs</h2>
                    <p className="text-slate-400">Base utilisateurs et abonnements</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input type="text" placeholder="Rechercher..." className="bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white w-64" />
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Agriculteur / Exploitation</th>
                            <th className="px-6 py-4">Abonnement</th>
                            <th className="px-6 py-4 text-center">Champs</th>
                            <th className="px-6 py-4 text-center">Capteurs</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                        {farmers.map(farmer => (
                            <tr key={farmer.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Tractor size={18} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{farmer.name}</div>
                                            <div className="text-xs text-slate-500">{farmer.farm}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-xs border uppercase font-bold tracking-wider ${getPlanBadge(farmer.plan)}`}>
                                        {farmer.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs">
                                        <Sprout size={12} /> {farmer.fields}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-slate-400">
                                    {farmer.sensors}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={farmer.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Farmers;
