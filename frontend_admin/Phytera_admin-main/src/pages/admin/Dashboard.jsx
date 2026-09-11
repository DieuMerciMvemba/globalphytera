import React from 'react';
import {
    Users,
    Tractor,
    Wifi,
    AlertTriangle,
    TrendingUp,
    Activity
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const StatCard = ({ title, value, label, icon: Icon, trend, color }) => (
    <div className="card hover:border-slate-600 transition-colors">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                {label && <p className="text-slate-500 text-xs mt-1">{label}</p>}
            </div>
            <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                <Icon size={24} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <TrendingUp size={12} /> {trend}
                </span>
                <span className="text-slate-500 text-xs">vs mois dernier</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    // Mock Data
    const activityData = [
        { name: 'Lun', reports: 4, resolved: 3 },
        { name: 'Mar', reports: 7, resolved: 5 },
        { name: 'Mer', reports: 5, resolved: 2 },
        { name: 'Jeu', reports: 12, resolved: 8 },
        { name: 'Ven', reports: 8, resolved: 6 },
        { name: 'Sam', reports: 3, resolved: 3 },
        { name: 'Dim', reports: 2, resolved: 1 },
    ];

    const sensorData = [
        { name: '00h', active: 110, offline: 10 },
        { name: '04h', active: 115, offline: 5 },
        { name: '08h', active: 118, offline: 2 },
        { name: '12h', active: 120, offline: 0 },
        { name: '16h', active: 119, offline: 1 },
        { name: '20h', active: 115, offline: 5 },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Agriculteurs"
                    value="1,280"
                    label="+24 inscriptions cette semaine"
                    icon={Tractor}
                    trend="+12%"
                    color="emerald"
                />
                <StatCard
                    title="Techniciens"
                    value="45"
                    label="8 en mission actuellement"
                    icon={Users}
                    trend="+5%"
                    color="blue"
                />
                <StatCard
                    title="Capteurs IoT"
                    value="5,600"
                    label="98% de disponibilité"
                    icon={Wifi}
                    trend="+8%"
                    color="purple"
                />
                <StatCard
                    title="Signalements"
                    value="12"
                    label="3 urgences en attente"
                    icon={AlertTriangle}
                    trend="-2%"
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <div className="card lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Activité Plateforme</h3>
                        <select className="bg-slate-800 border-none text-xs rounded text-slate-300 px-3 py-1">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                        </select>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#f1f5f9' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="reports" name="Signalements" stroke="#ef4444" fillOpacity={1} fill="url(#colorReports)" />
                                <Area type="monotone" dataKey="resolved" name="Résolus" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Feed / Sensors */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-6">État des Capteurs</h3>
                    <div className="h-48 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sensorData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="active" name="Actifs" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="offline" name="Hors ligne" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                En ligne
                            </span>
                            <span className="font-semibold text-white">5,480</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                Hors ligne
                            </span>
                            <span className="font-semibold text-white">45</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Maintenance
                            </span>
                            <span className="font-semibold text-white">75</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
