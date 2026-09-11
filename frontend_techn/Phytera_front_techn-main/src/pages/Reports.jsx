import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Plus, FileBarChart, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Reports = () => {
    const [filter, setFilter] = useState('all');

    const reports = [
        { id: 1, title: 'Rapport Maintenance Mensuelle - Oct 2025', type: 'Maintenance', date: '14 Oct 2025', author: 'T. Dubois', size: '2.4 MB', status: 'valid' },
        { id: 2, title: 'Incident Capteur #442 - Analyse', type: 'Incident', date: '12 Oct 2025', author: 'T. Dubois', size: '1.1 MB', status: 'pending' },
        { id: 3, title: 'Log de Vol - Mission Survey B2', type: 'Vol', date: '10 Oct 2025', author: 'Système', size: '845 KB', status: 'valid' },
        { id: 4, title: 'Diagnostic Batterie Drone D-04', type: 'Technique', date: '08 Oct 2025', author: 'J. Dupont', size: '3.2 MB', status: 'valid' },
        { id: 5, title: 'Intervention Remplacement Hélice', type: 'Maintenance', date: '05 Oct 2025', author: 'T. Dubois', size: '1.5 MB', status: 'valid' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'valid': return <Badge variant="success">Validé</Badge>;
            case 'pending': return <Badge variant="warning">En revue</Badge>;
            default: return <Badge variant="default">Brouillon</Badge>;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Maintenance': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Incident': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Vol': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-slate-700/30 text-slate-300 border-slate-600';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Centre de Rapports</h2>
                    <p className="text-slate-400">Générez et consultez les rapports d'intervention technique.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filtrer
                    </Button>
                    <Button variant="primary" className="gap-2 shadow-lg shadow-cyan-500/20">
                        <Plus className="w-4 h-4" /> Nouveau Rapport
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Rapports ce mois</p>
                        <p className="text-2xl font-bold text-slate-100">12</p>
                    </div>
                </Card>
                <Card className="p-5 flex items-center gap-4 border-l-4 border-l-yellow-500">
                    <div className="p-3 bg-yellow-500/10 rounded-full">
                        <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">En attente de validation</p>
                        <p className="text-2xl font-bold text-slate-100">3</p>
                    </div>
                </Card>
                <Card className="p-5 flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="p-3 bg-green-500/10 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">Taux de résolution</p>
                        <p className="text-2xl font-bold text-slate-100">94%</p>
                    </div>
                </Card>
            </div>

            {/* Reports List */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-slate-100">Historique des Documents</h3>
                    <div className="flex gap-2">
                        {['Tout', 'Maintenance', 'Incidents', 'Vols'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${(tab === 'Tout' && filter === 'all')
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-slate-800/50">
                    {reports.map((report) => (
                        <div key={report.id} className="p-4 flex items-center gap-4 hover:bg-slate-900/50 transition-colors group">
                            <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                <FileBarChart className="w-6 h-6 text-slate-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-slate-200 font-medium truncate">{report.title}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getTypeColor(report.type)}`}>
                                        {report.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                                    <span>Par {report.author}</span>
                                    <span>{report.size}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {getStatusBadge(report.status)}
                                <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-700/50 text-center">
                    <button className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">
                        Charger plus de documents
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
