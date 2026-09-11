import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Play, Calendar, MapPin, User, Activity, Battery, Signal, Wind } from 'lucide-react';

const MissionDetail = ({ mission, onBack, onLaunch }) => {
    if (!mission) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>&larr; Retour</Button>
                <h2 className="text-2xl font-bold text-white">Détails de la Mission <span className="text-slate-500">#{mission.id}</span></h2>
                <div className="ml-auto flex gap-3">
                    <Button variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Annuler</Button>
                    <Button variant="primary" icon={Play} onClick={onLaunch}>Lancer Mission</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info & Farmer */}
                <div className="space-y-6">
                    <Card title="Informations Générales">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><Calendar size={16} /> Date Prévue</span>
                                <span className="text-white">{mission.date}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><Activity size={16} /> Type de Mission</span>
                                <span className="text-white">{mission.type}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-slate-400 flex items-center gap-2"><MapPin size={16} /> Champ Cible</span>
                                <span className="text-white">{mission.field_name}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Agriculteur">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-lg font-bold text-white">
                                {mission.farmer_name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-white">{mission.farmer_name}</div>
                                <div className="text-sm text-slate-400">Abonnement: <span className="text-cyan-400">{mission.sub || 'Standard'}</span></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-500">Surface</div>
                                <div className="text-white font-medium">{mission.area || 'N/A'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-500">Culture</div>
                                <div className="text-white font-medium">Variable</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Middle Column: Flight Plan & Sensors */}
                <div className="space-y-6">
                    <Card title="Plan de Vol Automatique">
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-xs text-slate-400 mb-1">Altitude</div>
                                    <div className="text-lg font-bold text-white">
                                        {mission.sub === 'Standard' ? '120m' : '60-80m'}
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-xs text-slate-400 mb-1">Vitesse</div>
                                    <div className="text-lg font-bold text-white">15m/s</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-xs text-slate-400 mb-1">Durée Est.</div>
                                    <div className="text-lg font-bold text-white">
                                        {mission.sub === 'Standard' ? '15min' : '25min'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg text-sm text-blue-200">
                                {mission.sub === 'Standard' && 'ℹ️ Vol Orthophoto simple (2D).'}
                                {mission.sub === 'Pro' && 'ℹ️ Vol optimisé avec corrélation IoT.'}
                                {mission.sub === 'Premium' && 'ℹ️ Vol complexe: NDVI + Topographie 3D.'}
                            </div>
                        </div>
                    </Card>

                    <Card title="Statut Drone & Capteurs">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                                <span className="flex items-center gap-2 text-slate-300"><Battery size={16} className="text-emerald-400" /> Batterie Drone</span>
                                <span className="font-mono text-emerald-400">98%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                                <span className="flex items-center gap-2 text-slate-300"><Signal size={16} className="text-blue-400" /> Signal GPS</span>
                                <span className="font-mono text-blue-400">Fort (12 sats)</span>
                            </div>
                            {(mission.sub === 'Pro' || mission.sub === 'Premium') && (
                                <div className="flex items-center justify-between p-2 bg-indigo-500/10 border border-indigo-500/20 rounded">
                                    <span className="flex items-center gap-2 text-indigo-300"><Activity size={16} className="text-indigo-400" /> Capteurs IoT Sol</span>
                                    <span className="font-mono text-indigo-400">Sync OK</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Map Placeholder */}
                <div className="lg:col-span-1">
                    <Card title="Aperçu Zone" className="h-full min-h-[400px]">
                        <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                            {/* Fake Map Elements */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-950"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-cyan-500/50 rounded-full animate-pulse"></div>
                            <div className="text-slate-500 text-sm z-10 flex flex-col items-center gap-2">
                                <MapPin size={32} className="text-cyan-500" />
                                Carte Satellite
                                <span className="text-xs text-slate-600">(Mock)</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MissionDetail;
