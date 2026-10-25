import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Search, RefreshCw, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { iotService } from '../../services/api';

const IoTSupervision = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const loadDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await iotService.getAll();
            setDevices(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Erreur chargement boîtiers réels:', err.message);
            setError(err.message || 'Impossible de charger les boîtiers IoT');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDevices();
    }, []);

    const filteredDevices = devices.filter((d) => {
        const query = search.toLowerCase();
        return (
            (d.serialNumber && d.serialNumber.toLowerCase().includes(query)) ||
            (d.field?.name && d.field.name.toLowerCase().includes(query)) ||
            (d.field?.farm?.name && d.field.farm.name.toLowerCase().includes(query))
        );
    });

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'En ligne';
            case 'OFFLINE':
                return 'Hors ligne';
            case 'MAINTENANCE':
                return 'Maintenance';
            case 'PENDING_APPROVAL':
                return 'En attente';
            default:
                return status || 'En ligne';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Supervision IoT</h2>
                    <p className="text-slate-400">État réel du parc de boîtiers ESP32 PhyTera et connectivité</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={loadDevices} className="btn-outline text-sm flex items-center gap-2">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher Série/Parcelle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white w-full sm:w-60"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-16 text-slate-400 gap-3">
                    <RefreshCw className="animate-spin" size={24} />
                    <span>Chargement des boîtiers IoT réels...</span>
                </div>
            ) : filteredDevices.length === 0 ? (
                <div className="card text-center py-12 text-slate-400">
                    Aucun boîtier IoT trouvé en base de données.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDevices.map((device) => {
                        const statusLabel = getStatusLabel(device.status);
                        const isOnline = device.status === 'ACTIVE';

                        return (
                            <div key={device.id} className="card hover:border-slate-600 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isOnline
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-rose-500/10 text-rose-500'
                                            }`}
                                        >
                                            <Wifi size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white font-mono text-sm">{device.serialNumber}</h3>
                                            <p className="text-xs text-slate-400">{device.deviceType} v{device.firmwareVersion}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={statusLabel} />
                                </div>

                                <div className="space-y-3 border-t border-slate-800 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Exploitation</span>
                                        <span className="text-slate-300 font-medium">
                                            {device.field?.farm?.name || 'Non assigné'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Parcelle</span>
                                        <span className="text-slate-300">
                                            {device.field?.name || '-'} ({device.field?.cultureType || '-'})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1 text-emerald-400">
                                                <Battery size={14} /> 100%
                                            </span>
                                            <span className="flex items-center gap-1 text-primary">
                                                <Signal size={14} /> 4G / WiFi
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {device.lastSeen
                                                ? new Date(device.lastSeen).toLocaleTimeString('fr-FR', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : 'Récemment'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IoTSupervision;
