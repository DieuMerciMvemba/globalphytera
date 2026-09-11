import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, MapPin, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import NewInterventionModal from '../components/interventions/NewInterventionModal';

const Interventions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Kanban Columns Data
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: 'À Faire',
            color: 'border-l-blue-500',
            items: [
                { id: 1, title: 'Calibration Capteur C-12', priority: 'high', location: 'Parcelle Nord', date: '15 Oct', type: 'Calibration' },
                { id: 2, title: 'Inspection Visuelle Drone D-01', priority: 'medium', location: 'Hangar Principal', date: '16 Oct', type: 'Inspection' },
            ]
        },
        in_progress: {
            id: 'in_progress',
            title: 'En Cours',
            color: 'border-l-yellow-500',
            items: [
                { id: 3, title: 'Réparation Moteur Bras G', priority: 'critical', location: 'Atelier', date: 'Auj.', type: 'Réparation' }
            ]
        },
        done: {
            id: 'done',
            title: 'Terminé',
            color: 'border-l-green-500',
            items: [
                { id: 4, title: 'Mise à jour Firmware V2.4', priority: 'low', location: 'Remote', date: 'Hier', type: 'Software' },
                { id: 5, title: 'Nettoyage Optique Caméra', priority: 'medium', location: 'Terrain', date: 'Hier', type: 'Maintenance' }
            ]
        }
    });

    const handleAddIntervention = (formData) => {
        const newIntervention = {
            id: Date.now(),
            ...formData,
            // Format date for display if needed, keeping simple for now
        };

        setColumns(prev => ({
            ...prev,
            todo: {
                ...prev.todo,
                items: [newIntervention, ...prev.todo.items]
            }
        }));
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'critical': return <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">CRITIQUE</span>;
            case 'high': return <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">HAUTE</span>;
            case 'low': return <span className="text-[10px] font-bold text-slate-400 bg-slate-700/30 px-1.5 py-0.5 rounded border border-slate-600">BASSE</span>;
            default: return <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">MOYENNE</span>;
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Interventions</h2>
                    <p className="text-slate-400">Gestion des tickets et maintenance planifiée.</p>
                </div>
                <Button
                    variant="primary"
                    className="gap-2 shadow-lg shadow-cyan-500/20"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Nouvelle Intervention
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 h-full min-w-[1000px] pb-4">
                    {Object.values(columns).map((column) => (
                        <div key={column.id} className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            {/* Column Header */}
                            <div className={`p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center ${column.color} border-l-4`}>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-slate-200">{column.title}</h3>
                                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">{column.items.length}</span>
                                </div>
                                <button className="text-slate-500 hover:text-slate-300">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Column Content */}
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {column.items.map((item) => (
                                    <div key={item.id} className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800 transition-all cursor-pointer group shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            {getPriorityBadge(item.priority)}
                                            <button className="text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-300 transition-opacity">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <h4 className="text-slate-200 font-medium mb-2">{item.title}</h4>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <MapPin className="w-3 h-3 text-cyan-500" />
                                                {item.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar className="w-3 h-3 text-cyan-500" />
                                                {item.date}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{item.type}</span>
                                            <div className="w-6 h-6 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center text-xs font-bold ring-1 ring-cyan-500/30">
                                                TD
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm hover:border-slate-500 hover:text-slate-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Ajouter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <NewInterventionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddIntervention}
            />
        </div>
    );
};

export default Interventions;
