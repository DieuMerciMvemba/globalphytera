import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Filter, Download } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const Reports = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    // Mock Data
    const reports = [
        { id: 'R-2025-001', farmer: 'Jean Dupont', field: 'Parcelle Blé #12', type: 'Irrigation défaillante', urgency: 'Urgent', status: 'Nouveau', date: '15/12 09:30' },
        { id: 'R-2025-002', farmer: 'EARL La Verdure', field: 'Serre Tomates B', type: 'Capteur Hors Ligne', urgency: 'Moyenne', status: 'En cours', date: '14/12 14:15' },
        { id: 'R-2025-003', farmer: 'Marc Oger', field: 'Vigne Sud', type: 'Attaque Parasitaire', urgency: 'Haute', status: 'Nouveau', date: '14/12 11:00' },
        { id: 'R-2025-004', farmer: 'Sophie Martin', field: 'Verger Pommiers', type: 'Drone endommagé', urgency: 'Faible', status: 'Résolu', date: '12/12 16:45' },
        { id: 'R-2025-005', farmer: 'Coopérative Bio', field: 'Champ Maïs', type: 'Données incohérentes', urgency: 'Moyenne', status: 'Assigné', date: '12/12 08:20' },
    ];

    const handleViewDetails = (id) => {
        navigate(`/admin/reports/${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Signalements</h2>
                    <p className="text-slate-400">Suivi des incidents et assignation technique</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-outline text-sm">
                        <Filter size={16} /> Filtres
                    </button>
                    <button className="btn-primary text-sm">
                        <Download size={16} /> Exporter
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Agriculteur / Parcelle</th>
                                <th className="px-6 py-4">Problème</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Urgence</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">{report.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{report.farmer}</div>
                                        <div className="text-xs text-slate-500">{report.field}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white">{report.type}</td>
                                    <td className="px-6 py-4 text-slate-400">{report.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${report.urgency === 'Urgent' || report.urgency === 'Haute' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' :
                                                report.urgency === 'Moyenne' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                                                    'text-slate-400 border-slate-600 bg-slate-700/30'
                                            }`}>
                                            {report.urgency}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleViewDetails(report.id)}
                                            className="text-primary hover:text-primary-light transition-colors p-2 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1"
                                        >
                                            <Eye size={16} /> <span className="hidden sm:inline">Détails</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
