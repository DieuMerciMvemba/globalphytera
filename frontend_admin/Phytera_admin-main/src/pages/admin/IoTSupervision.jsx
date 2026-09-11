import React, { useState } from 'react';
import { Wifi, Battery, Signal, Search, Filter } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const IoTSupervision = () => {
    const [filter, setFilter] = useState('all');

    const sensors = [
        { id: 'S-101', type: 'Humidité', field: 'Parcelle Blé #12', farmer: 'Jean Dupont', status: 'En ligne', battery: 85, signal: 'Fort', lastPing: '2 min' },
        { id: 'S-102', type: 'Température', field: 'Parcelle Blé #12', farmer: 'Jean Dupont', status: 'En ligne', battery: 82, signal: 'Moyen', lastPing: '5 min' },
        { id: 'S-204', type: 'Caméra IA', field: 'Verger Est', farmer: 'Marie Curie', status: 'Hors ligne', battery: 0, signal: 'Aucun', lastPing: '4h' },
        { id: 'S-305', type: 'Sonde Sol', field: 'Vigne Sud', farmer: 'Marc Oger', status: 'Batterie faible', battery: 12, signal: 'Faible', lastPing: '15 min' },
        { id: 'S-401', type: 'Station Météo', field: 'Grand Champ', farmer: 'Coopérative Bio', status: 'En ligne', battery: 100, signal: 'Excellent', lastPing: '1 min' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Supervision IoT</h2>
                    <p className="text-slate-400">État du parc de capteurs et connectivité</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Rechercher ID..." className="bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white w-48" />
                    </div>
                    <button className="btn-outline text-sm">
                        <Filter size={16} /> Filtres
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sensors.map(sensor => (
                    <div key={sensor.id} className="card hover:border-slate-600 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sensor.status === 'En ligne' ? 'bg-emerald-500/10 text-emerald-500' :
                                        sensor.status === 'Hors ligne' ? 'bg-rose-500/10 text-rose-500' :
                                            'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    <Wifi size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{sensor.id}</h3>
                                    <p className="text-xs text-slate-400">{sensor.type}</p>
                                </div>
                            </div>
                            <StatusBadge status={sensor.status} />
                        </div>

                        <div className="space-y-3 border-t border-slate-800 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Agriculteur</span>
                                <span className="text-slate-300">{sensor.farmer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Champ</span>
                                <span className="text-slate-300">{sensor.field}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className={`flex items-center gap-1 ${sensor.battery < 20 ? 'text-rose-400' : ''}`}>
                                        <Battery size={14} /> {sensor.battery}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Signal size={14} /> {sensor.signal}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-500">{sensor.lastPing}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IoTSupervision;
