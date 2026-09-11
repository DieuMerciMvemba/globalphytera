import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Cpu,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTech, setSelectedTech] = useState(null);
    const [reportStatus, setReportStatus] = useState('Nouveau');
    const [assignedTechnician, setAssignedTechnician] = useState(null);

    // Mock Report Data
    const report = {
        id: id,
        farmer: 'Jean Dupont',
        field: 'Parcelle Blé #12',
        type: 'Irrigation défaillante',
        description: 'Le système d\'irrigation de la zone Nord ne se déclenche pas malgré les seuils d\'humidité atteints. Les capteurs indiquent une baisse critique.',
        urgency: 'Urgent',
        date: '15/12/2025 09:30',
        location: '45.123, 0.456',
        sensors: ['S-101', 'S-102']
    };

    // Mock Technicians
    const technicians = [
        { id: 1, name: 'Pierre Martin', status: 'Disponible', dist: '5 km', skill: 'Irrigation' },
        { id: 2, name: 'Alice Voisin', status: 'En mission', dist: '12 km', skill: 'IoT' },
        { id: 3, name: 'Lucas Dubreuil', status: 'Disponible', dist: '25 km', skill: 'Mécanique' },
    ];

    const handleAssign = () => {
        if (selectedTech) {
            setAssignedTechnician(selectedTech);
            setReportStatus('Assigné');
            setAssignModalOpen(false);
            // In real app, make API call here
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/admin/reports')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Retour aux signalements
            </button>

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">Signalement {report.id}</h1>
                        <StatusBadge status={reportStatus} />
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {report.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {report.location}</span>
                    </div>
                </div>

                {reportStatus === 'Nouveau' && (
                    <button
                        onClick={() => setAssignModalOpen(true)}
                        className="btn-primary"
                    >
                        <User size={18} /> Affecter un technicien
                    </button>
                )}
                {reportStatus === 'Assigné' && (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {assignedTechnician?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Assigné à {assignedTechnician?.name}</p>
                            <p className="text-slate-400 text-xs">Technicien</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4">Détails du problème</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-500 text-sm">Type d'incident</label>
                                <p className="text-white font-medium">{report.type}</p>
                            </div>
                            <div>
                                <label className="text-slate-500 text-sm">Description</label>
                                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-800 mt-1">
                                    {report.description}
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg">
                                <AlertTriangle className="text-rose-500 shrink-0" />
                                <div>
                                    <h4 className="text-rose-400 font-medium">Niveau d'urgence : {report.urgency}</h4>
                                    <p className="text-rose-300/70 text-sm">Intervention requise sous 24h.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4">Contexte Terrain</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Agriculteur</span>
                                <span className="text-white">{report.farmer}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Parcelle</span>
                                <span className="text-white">{report.field}</span>
                            </div>
                            <div className="py-2">
                                <span className="text-slate-400 block mb-2">Capteurs associés</span>
                                <div className="flex gap-2">
                                    {report.sensors.map(s => (
                                        <span key={s} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700 flex items-center gap-1">
                                            <Cpu size={12} /> {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Affecter un technicien"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setAssignModalOpen(false)} className="btn-outline">Annuler</button>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedTech}
                            className={`btn-primary ${!selectedTech ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Confirmer l'affectation
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">Sélectionnez un technicien disponible à proximité de la parcelle.</p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {technicians.map(tech => (
                            <div
                                key={tech.id}
                                onClick={() => tech.status === 'Disponible' && setSelectedTech(tech)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedTech?.id === tech.id
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                    } ${tech.status !== 'Disponible' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{tech.name}</h4>
                                        <span className="text-xs text-slate-400">{tech.skill} • {tech.dist}</span>
                                    </div>
                                </div>
                                <div>
                                    {tech.status === 'Disponible' ? (
                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Disponible</span>
                                    ) : (
                                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">En mission</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReportDetails;
