import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar } from 'recharts';
import { Battery, Activity, Wifi, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Technical Data - Technician Focused
const dataBatteryEvents = [
    { time: '08:00', voltage: 24.5, temp: 42 },
    { time: '10:00', voltage: 24.2, temp: 45 },
    { time: '12:00', voltage: 23.8, temp: 52 }, // Peak use
    { time: '14:00', voltage: 23.5, temp: 48 },
    { time: '16:00', voltage: 22.9, temp: 44 },
    { time: '18:00', voltage: 22.1, temp: 40 },
];

const dataMaintenance = [
    { name: 'Drones', solved: 12, pending: 2 },
    { name: 'Capteurs', solved: 45, pending: 5 },
    { name: 'Stations', solved: 3, pending: 1 },
];

const dataSignal = [
    { name: 'Excellent', value: 65 },
    { name: 'Bon', value: 25 },
    { name: 'Faible', value: 8 },
    { name: 'Hors Ligne', value: 2 },
];

const COLORS_SIGNAL = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-200 font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Diagnostics Système</h2>
                    <p className="text-slate-400">Métriques de performance et santé du parc matériel.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-xs">Exporter Rapport PDF</Button>
                </div>
            </div>

            {/* Technical KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-green-500/10 rounded-xl relative">
                        <Activity className="w-6 h-6 text-green-400" />
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">État du Réseau</p>
                        <p className="text-xl font-bold text-slate-100">Stable (42ms)</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Battery className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Santé Batteries</p>
                        <p className="text-xl font-bold text-slate-100">94% Moy.</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                        <Wrench className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Maintenances</p>
                        <p className="text-xl font-bold text-slate-100">8 Prévues</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Incidents Actifs</p>
                        <p className="text-xl font-bold text-slate-100">2 Critiques</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Telemetry Chart */}
                <Card className="lg:col-span-2 p-6 h-[400px] flex flex-col">
                    <h3 className="font-semibold text-lg text-slate-100 mb-6">Télémétrie Drone D-04 (Vol en cours)</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataBatteryEvents}>
                                <defs>
                                    <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" />
                                <YAxis yAxisId="left" stroke="#64748b" />
                                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" yAxisId="left" dataKey="voltage" name="Voltage (V)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVoltage)" />
                                <Area type="monotone" yAxisId="right" dataKey="temp" name="Température (°C)" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Signal Quality */}
                <Card className="p-6 h-[400px] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <Wifi className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-semibold text-lg text-slate-100">Qualité Signal IoT</h3>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataSignal}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataSignal.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_SIGNAL[index % COLORS_SIGNAL.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-white">90%</span>
                            <span className="text-xs text-slate-400">Connectivité</span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-200 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            2 Capteurs hors ligne (Zone Sud)
                        </p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Maintenance Stats */}
                <Card className="p-6 h-[350px]">
                    <h3 className="font-semibold text-lg text-slate-100 mb-6">Résolution Incidents (Hebdo)</h3>
                    <div className="w-full h-full pb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataMaintenance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="solved" name="Résolu" fill="#22c55e" radius={[0, 4, 4, 0]} stackId="a" barSize={20} />
                                <Bar dataKey="pending" name="En attente" fill="#f59e0b" radius={[0, 4, 4, 0]} stackId="a" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Action Log */}
                <Card className="p-6 h-[350px] overflow-hidden flex flex-col">
                    <h3 className="font-semibold text-lg text-slate-100 mb-4">Dernières Interventions</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Remplacement Hélice Drone D-02</p>
                                    <p className="text-xs text-slate-500">Il y a {item * 2} heures • Par T. Dubois</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full">Clôturé</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
