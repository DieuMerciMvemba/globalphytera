import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { ArrowLeft, Droplets, Thermometer, Wind, AlertCircle } from 'lucide-react';

const FieldDetail = ({ field, onBack }) => {
    if (!field) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" icon={ArrowLeft} onClick={onBack}>Retour</Button>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {field.name}
                        <Badge variant="default">{field.crop}</Badge>
                    </h2>
                    <p className="text-slate-400 text-sm">{field.location} • {field.area} • Propriétaire: {field.owner}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Map / NDVI */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Analyse NDVI (Santé Végétale)" className="min-h-[400px]">
                        <div className="relative w-full h-[350px] bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center group">
                            {/* Abstract heatmap representation */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 via-yellow-900/20 to-red-900/20"></div>

                            {/* Mock Grid */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>

                            {/* Simulated Hotspots */}
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                            {field.health === 'Warning' || field.health === 'Critical' ? (
                                <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                            ) : null}

                            <div className="z-10 text-center">
                                <p className="text-slate-400 text-sm mb-2">Carte générée le {field.lastScan}</p>
                                <Button size="sm" variant="outline">Comparer avec J-7</Button>
                            </div>
                        </div>
                    </Card>

                    {/* AI Recommendations */}
                    <Card title="Recommandations IA" className="border-l-4 border-l-cyan-500">
                        <div className="space-y-4">
                            {field.health === 'Warning' || field.health === 'Critical' ? (
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-red-500/10 rounded text-red-400 mt-1">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Stress Hydrique Détecté</h4>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Les capteurs de la **Zone Sud-Est** indiquent une humidité inférieure à 15%. Une irrigation ciblée est recommandée avant 18h00.
                                        </p>
                                        <Button size="sm" variant="primary" className="mt-3">Planifier Irrigation</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-emerald-500/10 rounded text-emerald-400 mt-1">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Conditions Optimales</h4>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Le développement végétatif est conforme aux prévisions. Aucun apport d'engrais nécessaire cette semaine.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Soil Data */}
                <div className="space-y-6">
                    <Card title="Données Sol Actuelles">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg text-center">
                                <div className="text-slate-400 text-xs mb-1 flex justify-center gap-1"><Droplets size={12} /> Humidité</div>
                                <div className="text-2xl font-bold text-cyan-400">
                                    {field.health === 'Critical' ? '12%' : '45%'}
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg text-center">
                                <div className="text-slate-400 text-xs mb-1">pH</div>
                                <div className="text-2xl font-bold text-purple-400">6.5</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg text-center">
                                <div className="text-slate-400 text-xs mb-1 flex justify-center gap-1"><Thermometer size={12} /> Temp.</div>
                                <div className="text-2xl font-bold text-amber-400">28°C</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg text-center">
                                <div className="text-slate-400 text-xs mb-1">Azote (N)</div>
                                <div className="text-2xl font-bold text-emerald-400">Bon</div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Météo Locale">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">🌤️</div>
                                <div>
                                    <div className="text-xl font-bold text-white">26°C</div>
                                    <div className="text-xs text-slate-400">Partiellement Nuageux</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2"><Wind size={14} /> Vent</span>
                                <span className="text-white">14 km/h NO</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2"><Droplets size={14} /> Précipitations</span>
                                <span className="text-white">0mm (24h)</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;
