import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Filter, Download, RefreshCw, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { reportService } from '../../services/api';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await reportService.getAll();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Erreur chargement signalements réels:', err.message);
            setError(err.message || 'Impossible de charger les signalements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/admin/reports/${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Signalements</h2>
                    <p className="text-slate-400">Suivi des incidents et interventions réelles en direct</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadReports} className="btn-outline text-sm flex items-center gap-2">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                    </button>
                    <button className="btn-primary text-sm">
                        <Download size={16} /> Exporter
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">ID / Titre</th>
                                <th className="px-6 py-4">Exploitation / Parcelle</th>
                                <th className="px-6 py-4">Boîtier & Technicien</th>
                                <th className="px-6 py-4">Date</th>
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
                                            <span>Chargement des interventions réelles...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        Aucun signalement en base de données.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{report.title}</div>
                                            <div className="font-mono text-xs text-slate-500">{report.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">
                                                {report.device?.field?.farm?.name || 'Exploitation'}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {report.device?.field?.name || 'Parcelle'} ({report.device?.field?.cultureType || '-'})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-300 font-mono">
                                                {report.device?.serialNumber || 'N/A'}
                                            </div>
                                            <div className="text-xs text-primary">
                                                {report.technician?.nom || 'Non assigné'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">
                                            {new Date(report.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
