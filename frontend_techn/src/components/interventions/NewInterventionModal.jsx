import React, { useState } from 'react';
import { X, Calendar, MapPin, AlertTriangle, FileText } from 'lucide-react';
import Button from '../common/Button';

const NewInterventionModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Maintenance',
        priority: 'medium',
        location: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100">Nouvelle Intervention</h3>
                        <p className="text-sm text-slate-400">Créer un ticket de maintenance</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Titre de l'intervention</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="Ex: Réparation Drone D-04"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Type</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Maintenance">Maintenance</option>
                                <option value="Réparation">Réparation</option>
                                <option value="Inspection">Inspection</option>
                                <option value="Calibration">Calibration</option>
                                <option value="Software">Software</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Priorité</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="critical">Critique</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Lieu</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="Zone, Parcelle..."
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Date Prévue</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description (Optionnel)</label>
                        <textarea
                            rows="3"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                            placeholder="Détails supplémentaires sur le problème..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-700/50">
                        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                        <Button type="submit" variant="primary" className="shadow-lg shadow-cyan-500/20">Créer le ticket</Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewInterventionModal;
