import React from 'react';
import { User, MapPin, Award, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const Technicians = () => {
    const technicians = [
        { id: 1, name: 'Pierre Martin', role: 'Expert Irrigation', status: 'Disponible', location: 'Bordeaux', missions: 124, skills: ['Irrigation', 'Hydraulique'] },
        { id: 2, name: 'Alice Voisin', role: 'Spécialiste IoT', status: 'En mission', location: 'Toulouse', missions: 58, skills: ['IoT', 'Réseaux', 'Capteurs'] },
        { id: 3, name: 'Lucas Dubreuil', role: 'Pilote Drone', status: 'Disponible', location: 'Agen', missions: 32, skills: ['Drone', 'Cartographie'] },
        { id: 4, name: 'Sarah Connor', role: 'Agronome', status: 'Congés', location: 'Pau', missions: 210, skills: ['Sols', 'Biologie'] },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des Techniciens</h2>
                    <p className="text-slate-400">Équipe technique et disponibilités</p>
                </div>
                <button className="btn-primary">
                    <User size={18} /> Ajouter un technicien
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {technicians.map(tech => (
                    <div key={tech.id} className="card relative group hover:border-slate-500 transition-colors">
                        <div className="absolute top-4 right-4">
                            <StatusBadge status={tech.status} />
                        </div>

                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 mb-4 border-2 border-slate-600">
                                <User size={40} />
                            </div>
                            <h3 className="font-bold text-white text-lg">{tech.name}</h3>
                            <p className="text-primary text-sm font-medium">{tech.role}</p>

                            <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                                <MapPin size={12} /> {tech.location}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                            <div>
                                <p className="text-xs text-slate-500 mb-2 uppercase font-medium">Compétences</p>
                                <div className="flex flex-wrap gap-2">
                                    {tech.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm pt-2">
                                <span className="text-slate-400 flex items-center gap-1"><Clock size={14} /> Missions</span>
                                <span className="text-white font-mono">{tech.missions}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button className="w-full btn-outline text-xs h-9">Voir Détails</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Technicians;
