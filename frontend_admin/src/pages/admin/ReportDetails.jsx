import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Cpu,
    CheckCircle,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { reportService, technicianService } from '../../services/api';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTech, setSelectedTech] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ticketData, techsData] = await Promise.all([
                reportService.getById(id),
                technicianService.getAll(),
            ]);
            setReport(ticketData);
            setTechnicians(Array.isArray(techsData) ? techsData : []);
            if (ticketData?.technician) {
                setSelectedTech(ticketData.technician);
            }
        } catch (err) {
            console.error('Erreur chargement détails ticket:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const handleAssign = async () => {
        if (!selectedTech || !report) return;
        setSubmitting(true);
        try {
            await reportService.assignTechnician(report.id, selectedTech.id);
            setAssignModalOpen(false);
            await loadData();
        } catch (err) {
            alert("Erreur lors de l'affectation du technicien: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-primary gap-3">
                <Loader2 className="animate-spin" size={36} />
                <p className="text-sm text-slate-400 font-medium">Chargement du signalement depuis Supabase...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="card text-center p-8 max-w-md mx-auto mt-10 space-y-4">
                <AlertTriangle className="text-amber-400 mx-auto" size={48} />
                <h2 className="text-xl font-bold text-white">Signalement introuvable</h2>
                <p className="text-sm text-slate-400">Ce ticket n'existe pas ou a été résolu.</p>
                <button onClick={() => navigate('/admin/reports')} className="btn-primary mx-auto">
                    Retour aux signalements
                </button>
            </div>
        );
    }

    const assignedTechnician = report.technician;
    const farmName = report.device?.field?.farm?.name || 'Exploitation cliente';
    const fieldName = report.device?.field?.name || 'Parcelle associée';
    const farmerName = report.device?.field?.farm?.owner?.nom || 'Agriculteur';

    return (
        <div className="space-y-6 px-1 md:px-0">
            <button
                onClick={() => navigate('/admin/reports')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
                <ArrowLeft size={18} /> Retour aux signalements
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{report.title || `Signalement #${report.id}`}</h1>
                        <StatusBadge status={report.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs md:text-sm">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {new Date(report.createdAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={14} /> {farmName} - {fieldName}
                        </span>
                    </div>
                </div>

                {!assignedTechnician && report.status === 'OPEN' && (
                    <button
                        onClick={() => setAssignModalOpen(true)}
                        className="btn-primary self-start sm:self-auto"
                    >
                        <User size={18} /> Affecter un technicien
                    </button>
                )}

                {assignedTechnician && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3 self-start sm:self-auto">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {assignedTechnician.nom ? assignedTechnician.nom.charAt(0) : 'T'}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Assigné à {assignedTechnician.nom || assignedTechnician.email}</p>
                            <p className="text-slate-400 text-xs">Technicien Agréé</p>
                        </div>
                        <button
                            onClick={() => setAssignModalOpen(true)}
                            className="text-xs text-primary hover:underline ml-2"
                        >
                            Changer
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card space-y-4">
                        <h3 className="text-lg font-semibold text-white">Détails de l'incident</h3>
                        <div>
                            <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Titre / Motif</label>
                            <p className="text-white font-medium mt-1">{report.title}</p>
                        </div>
                        <div>
                            <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Description détaillée</label>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 mt-1 text-sm">
                                {report.issueDescription || "Aucune description additionnelle renseignée."}
                            </p>
                        </div>
                        {report.resolutionNote && (
                            <div>
                                <label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Note de résolution technique</label>
                                <p className="text-emerald-300 leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 mt-1 text-sm">
                                    {report.resolutionNote}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card space-y-3">
                        <h3 className="text-lg font-semibold text-white mb-2">Contexte Terrain Réel</h3>
                        <div className="flex items-center justify-between py-2 border-b border-slate-800 text-sm">
                            <span className="text-slate-400">Agriculteur</span>
                            <span className="text-white font-medium">{farmerName}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-800 text-sm">
                            <span className="text-slate-400">Exploitation</span>
                            <span className="text-white font-medium">{farmName}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-800 text-sm">
                            <span className="text-slate-400">Parcelle</span>
                            <span className="text-white font-medium">{fieldName}</span>
                        </div>
                        <div className="py-2 text-sm">
                            <span className="text-slate-400 block mb-2">Boîtier IoT Associé</span>
                            {report.device ? (
                                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between">
                                    <span className="text-cyan-400 font-mono font-medium">{report.device.serialNumber || report.device.id}</span>
                                    <span className="text-slate-400">Firmware: {report.device.firmwareVersion || '1.0.0'}</span>
                                </div>
                            ) : (
                                <span className="text-slate-500 text-xs">Aucun boîtier lié</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Affecter un technicien réel"
                footer={
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setAssignModalOpen(false)} className="btn-outline">Annuler</button>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedTech || submitting}
                            className={`btn-primary ${!selectedTech || submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Affectation...' : "Confirmer l'affectation"}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-xs md:text-sm text-slate-400">
                        Sélectionnez un technicien de votre équipe pour prendre en charge ce ticket sur le terrain.
                    </p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {technicians.map(tech => (
                            <div
                                key={tech.id}
                                onClick={() => setSelectedTech(tech)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedTech?.id === tech.id
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                                        {tech.nom ? tech.nom.charAt(0) : 'T'}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-medium">{tech.nom || tech.email}</h4>
                                        <span className="text-xs text-slate-400">{tech.email}</span>
                                    </div>
                                </div>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                    Actif
                                </span>
                            </div>
                        ))}

                        {technicians.length === 0 && (
                            <p className="text-xs text-slate-500 italic p-4 text-center">Aucun technicien enregistré.</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReportDetails;
