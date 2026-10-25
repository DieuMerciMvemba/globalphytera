import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Sun, Wind, Activity, Sprout, TrendingUp, AlertTriangle, Cpu, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fieldsService } from '../services/fieldsService';
import { telemetryService } from '../services/telemetryService';

const Gauge = ({ value, max, label, unit, color }) => {
    const numericVal = typeof value === 'number' && !isNaN(value) ? value : 0;
    const percentage = Math.min(Math.max((numericVal / max) * 100, 0), 100);
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 md:w-32 md:h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-navy-800"
                    />
                    <circle
                        cx="50%"
                        cy="50%"
                        r="40"
                        stroke={color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-xl md:text-2xl font-bold">{value !== null && value !== undefined ? value : '--'}</span>
                    <span className="text-xs text-gray-400">{unit}</span>
                </div>
            </div>
            <span className="mt-2 text-xs md:text-sm font-medium text-gray-300">{label}</span>
        </div>
    );
};

const FieldDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [field, setField] = useState(null);
    const [telemetry, setTelemetry] = useState([]);
    const [latestTel, setLatestTel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const loadFieldData = async () => {
            setLoading(true);
            try {
                const [fieldData, telData] = await Promise.all([
                    fieldsService.getFieldById(id),
                    telemetryService.getFieldTelemetry(id, 30),
                ]);

                if (isMounted) {
                    setField(fieldData);
                    const telList = Array.isArray(telData) ? telData : [];
                    setTelemetry(telList);
                    if (telList.length > 0) {
                        setLatestTel(telList[0]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('Impossible de charger les données de cette parcelle.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (id) {
            loadFieldData();
        }
        return () => { isMounted = false; };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-cyan-400 gap-3">
                <Loader2 className="animate-spin" size={36} />
                <p className="text-sm text-slate-400 font-medium">Chargement des données réelles de la parcelle...</p>
            </div>
        );
    }

    if (error || !field) {
        return (
            <div className="glass-panel p-6 rounded-3xl text-center space-y-4 max-w-lg mx-auto mt-8">
                <AlertTriangle className="text-amber-400 mx-auto" size={48} />
                <h2 className="text-xl font-bold text-white">Parcelle introuvable</h2>
                <p className="text-sm text-slate-400">{error || 'Cette parcelle n\'existe pas ou a été déplacée.'}</p>
                <button
                    onClick={() => navigate('/fields')}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                    Retour aux parcelles
                </button>
            </div>
        );
    }

    // Chart data mapping from real telemetry
    const chartData = telemetry.slice(0, 15).reverse().map((t, idx) => ({
        time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        humidity: t.humSol !== null ? t.humSol : t.humAir,
        temp: t.tempAir !== null ? t.tempAir : t.tempSol,
    }));

    const activeAlerts = field.alerts?.filter(a => !a.resolved) || [];

    return (
        <div className="fade-in space-y-6 px-1 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/fields')}
                        className="p-2.5 rounded-xl bg-navy-800 hover:bg-white/10 text-gray-300 hover:text-white transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex flex-wrap items-center gap-2">
                            {field.name}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeAlerts.length > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-neon-green/10 text-neon-green border-neon-green/20'}`}>
                                {activeAlerts.length > 0 ? `${activeAlerts.length} ALERTE(S)` : 'STATUT OPTIMAL'}
                            </span>
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400 mt-1">
                            Culture: <span className="text-white font-medium">{field.cultureType || 'Non spécifiée'}</span>
                            {field.variety && <span> ({field.variety})</span>} • Superficie: <span className="text-white font-medium">{field.surfaceArea ? `${field.surfaceArea} m²` : 'Non renseignée'}</span>
                        </p>
                    </div>
                </div>

                {field.farm && (
                    <div className="text-xs md:text-sm text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/5 self-start sm:self-auto">
                        Exploitation: <span className="text-cyan-400 font-medium">{field.farm.name}</span>
                    </div>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
                    <Gauge value={latestTel?.humSol ?? latestTel?.humAir ?? null} max={100} label="Humidité Sol" unit="%" color="#00F0FF" />
                </div>
                <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
                    <Gauge value={latestTel?.tempAir ?? latestTel?.tempSol ?? null} max={50} label="Température Air" unit="°C" color="#FF9F1C" />
                </div>
                <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
                    <Gauge value={latestTel?.phSol ?? null} max={14} label="pH du Sol" unit="pH" color="#7B2CBF" />
                </div>
                <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center bg-neon-green/10 rounded-full mb-2">
                        <Sprout size={40} className="text-neon-green" />
                    </div>
                    <span className="mt-2 text-xs md:text-sm font-medium text-gray-300">
                        {field.devices?.length > 0 ? `${field.devices.length} Boîtier(s) IoT` : 'Aucun boîtier assigné'}
                    </span>
                </div>
            </div>

            {/* Analysis Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Real Telemetry History */}
                <div className="lg:col-span-2 glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-neon-blue" size={20} />
                        Évolution Télémétrique Réelle (Capteurs)
                    </h3>

                    {chartData.length > 0 ? (
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#101826', borderRadius: '12px', border: '1px solid #1e293b' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <CartesianGrid vertical={false} stroke="#1e293b" />
                                    <Area type="monotone" dataKey="humidity" stroke="#00F0FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHum)" name="Humidité (%)" />
                                    <Area type="monotone" dataKey="temp" stroke="#FF9F1C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" name="Température (°C)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                            <Cpu size={32} className="mb-2 text-slate-600" />
                            <p className="text-sm">En attente des premières mesures télémétriques de l'ESP32.</p>
                        </div>
                    )}
                </div>

                {/* Boîtiers & Alertes */}
                <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <Cpu className="text-cyan-400" size={20} />
                        Équipements & Alertes
                    </h3>

                    <div className="space-y-3">
                        {field.devices && field.devices.length > 0 ? (
                            field.devices.map((d) => (
                                <div key={d.id} className="p-3 bg-navy-900/60 rounded-xl border border-white/5 space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-white">{d.serialNumber || d.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        Batterie: {d.batteryLevel ? `${d.batteryLevel}%` : 'N/A'} • Firmware: {d.firmwareVersion || '1.0.0'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 italic">Aucun boîtier IoT associé à cette parcelle.</p>
                        )}

                        <div className="pt-3 border-t border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Alertes Récentes</h4>
                            {activeAlerts.length > 0 ? (
                                activeAlerts.map((a) => (
                                    <div key={a.id} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-200 mb-2">
                                        <span className="font-semibold block">{a.title || a.message}</span>
                                        <span className="text-[10px] text-red-300">{new Date(a.createdAt).toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    Aucune anomalie active détectée.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDetailPage;
