import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Droplets,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    BrainCircuit,
    Leaf,
    Cpu,
    Loader2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { fieldsService } from '../services/fieldsService';
import { devicesService } from '../services/devicesService';
import { alertsService } from '../services/alertsService';

const COLORS = ['#00F0FF', '#7B2CBF', '#00FF9D', '#FF9F1C', '#E63946', '#457B9D'];

const KPICard = ({ title, value, unit, subtitle, icon: Icon, colorClass, borderClass }) => (
    <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden group hover:bg-white/5 transition-all">
        <div className={`absolute top-4 right-4 p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <h3 className="text-gray-400 font-medium text-xs md:text-sm mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-xs md:text-sm text-gray-400">{unit}</span>}
        </div>
        {subtitle && (
            <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                {subtitle}
            </p>
        )}
    </div>
);

const AnalyticsPage = () => {
    const [fields, setFields] = useState([]);
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadAnalyticsData = async () => {
            setLoading(true);
            try {
                const [fieldsData, devicesData, alertsData] = await Promise.all([
                    fieldsService.getFields().catch(() => []),
                    devicesService.getAllDevices().catch(() => []),
                    alertsService.getAlerts().catch(() => []),
                ]);

                if (isMounted) {
                    setFields(Array.isArray(fieldsData) ? fieldsData : []);
                    setDevices(Array.isArray(devicesData) ? devicesData : []);
                    setAlerts(Array.isArray(alertsData) ? alertsData : []);
                }
            } catch (err) {
                console.error('[Analytics] Erreur de chargement:', err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadAnalyticsData();
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-cyan-400 gap-3">
                <Loader2 className="animate-spin" size={36} />
                <p className="text-sm text-slate-400 font-medium">Agrégation des statistiques réelles...</p>
            </div>
        );
    }

    // Calcul de la répartition réelle des cultures
    const cropMap = {};
    let totalSurface = 0;
    fields.forEach((f) => {
        const crop = f.cultureType || 'Culture Autre';
        const area = Number(f.surfaceArea) || 1000;
        totalSurface += area;
        cropMap[crop] = (cropMap[crop] || 0) + area;
    });

    const cropDistribution = Object.keys(cropMap).map((key) => ({
        name: key,
        value: cropMap[key],
    }));

    // Données parcellaires réelles pour le graphique en barres
    const parcelsBarData = fields.slice(0, 7).map((f) => ({
        name: f.name.length > 12 ? f.name.substring(0, 10) + '..' : f.name,
        surface: Number(f.surfaceArea) || 0,
        devicesCount: f.devices ? f.devices.length : 0,
    }));

    const activeAlertsCount = alerts.filter(a => !a.resolved).length;
    const onlineDevicesCount = devices.filter(d => d.status === 'ACTIVE').length;

    return (
        <div className="space-y-6 fade-in pb-12 px-1 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Analyse & Statistiques Réelles
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                        Données consolidées depuis vos parcelles et vos capteurs connectés
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-navy-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300 self-start md:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Base Supabase Connectée
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <KPICard
                    title="Parcelles Cultivées"
                    value={fields.length}
                    unit="Parcelles"
                    subtitle={`${(totalSurface / 10000).toFixed(2)} Hectares au total`}
                    icon={Leaf}
                    colorClass="bg-emerald-500/10 text-emerald-400"
                />
                <KPICard
                    title="Boîtiers IoT Actifs"
                    value={`${onlineDevicesCount} / ${devices.length}`}
                    unit="En ligne"
                    subtitle="Transmission de télémétrie continue"
                    icon={Cpu}
                    colorClass="bg-cyan-500/10 text-cyan-400"
                />
                <KPICard
                    title="Superficie Totale"
                    value={totalSurface > 10000 ? `${(totalSurface / 10000).toFixed(1)} ha` : `${totalSurface} m²`}
                    unit=""
                    subtitle="Couverture monitorée"
                    icon={Droplets}
                    colorClass="bg-blue-500/10 text-blue-400"
                />
                <KPICard
                    title="Alertes Actives"
                    value={activeAlertsCount}
                    unit="Non résolue(s)"
                    subtitle={activeAlertsCount === 0 ? "Tout est sous contrôle" : "Nécessite votre attention"}
                    icon={Activity}
                    colorClass={activeAlertsCount > 0 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Parcels Surface Area Bar Chart */}
                <div className="lg:col-span-2 glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="text-cyan-400" size={20} />
                        Superficies des Parcelles Monitorées (m²)
                    </h3>
                    {parcelsBarData.length > 0 ? (
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={parcelsBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Bar dataKey="surface" name="Superficie (m²)" fill="#00F0FF" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                            <Leaf size={32} className="mb-2 text-slate-600" />
                            <p className="text-sm">Aucune parcelle enregistrée pour générer les graphiques.</p>
                        </div>
                    )}
                </div>

                {/* Crop Distribution Pie */}
                <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl flex flex-col">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">Répartition des Cultures</h3>
                    <div className="flex-1 min-h-[260px] relative">
                        {cropDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={cropDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {cropDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                Aucune culture configurée.
                            </div>
                        )}
                        {cropDistribution.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <span className="text-xl font-bold text-white">{cropDistribution.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Agronomic Recommendations Panel */}
                <div className="lg:col-span-3 glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <BrainCircuit className="text-purple-400" size={20} />
                        Surveillance & Diagnostic Automatique
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400 space-y-1">
                            <span className="text-cyan-400 font-bold text-sm block">Transmission Télémétrique</span>
                            <p className="text-xs md:text-sm text-gray-300">
                                {devices.length > 0
                                    ? `${devices.length} boîtier(s) IoT configuré(s). Le moteur de règles analyse en temps réel les seuils d'humidité du sol et de température de l'air.`
                                    : "Connectez votre premier boîtier IoT pour activer l'analyse continue des conditions du sol."}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400 space-y-1">
                            <span className="text-emerald-400 font-bold text-sm block">Santé des Parcelles</span>
                            <p className="text-xs md:text-sm text-gray-300">
                                {activeAlertsCount === 0
                                    ? "Aucune anomalie critique signalée sur les parcelles actives. Les paramètres environnementaux sont nominaux."
                                    : `${activeAlertsCount} anomalie(s) active(s) nécessitant une vérification sur le terrain ou une intervention d'irrigation.`}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
