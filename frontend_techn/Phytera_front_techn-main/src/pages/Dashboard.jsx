import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
    Activity,
    Droplets,
    Wind,
    AlertTriangle,
    Plane,
    CheckCircle,
    TrendingUp,
    Map as MapIcon
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
    Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
    { name: 'Lun', missions: 4, incidents: 1 },
    { name: 'Mar', missions: 3, incidents: 0 },
    { name: 'Mer', missions: 6, incidents: 2 },
    { name: 'Jeu', missions: 8, incidents: 0 },
    { name: 'Ven', missions: 5, incidents: 1 },
    { name: 'Sam', missions: 9, incidents: 0 },
    { name: 'Dim', missions: 2, incidents: 0 },
];

const sensorData = [
    { name: 'pH Sol', value: 65 },
    { name: 'Humidité', value: 82 },
    { name: 'Azote', value: 45 },
    { name: 'Temp', value: 55 },
];

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Vue d'ensemble
                        <span className="text-cyan-500">.</span>
                    </h1>
                    <p className="text-slate-400 mt-2">Synthèse des opérations et alertes critiques.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-300">Système Nominal</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-white font-mono">15:34</div>
                        <div className="text-xs text-slate-500">Local Time</div>
                    </div>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Plane size={24} />
                        </div>
                        <Badge variant="info">+12%</Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">24</div>
                    <div className="text-sm text-slate-400">Missions Actives</div>
                </Card>

                <Card className="hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <Badge variant="success">98%</Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">142</div>
                    <div className="text-sm text-slate-400">Parcelles Saines</div>
                </Card>

                <Card className="hover:border-amber-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <AlertTriangle size={24} />
                        </div>
                        <Badge variant="warning">3 New</Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">5</div>
                    <div className="text-sm text-slate-400">Alertes Critiques</div>
                </Card>

                <Card className="hover:border-purple-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <Badge variant="default">Stable</Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">85%</div>
                    <div className="text-sm text-slate-400">Performance Flotte</div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <Card className="lg:col-span-2 min-h-[400px]" title="Activité Hebdomadaire">
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="missions"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMissions)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="incidents"
                                    stroke="#f43f5e"
                                    strokeWidth={2}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Side Panel: Quick Actions & Alerts */}
                <div className="space-y-6">
                    <Card title="État des Capteurs">
                        <div className="space-y-4">
                            {sensorData.map((sensor, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">{sensor.name}</span>
                                        <span className="text-white font-medium">{sensor.value}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                            style={{ width: `${sensor.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Alertes Récentes">
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start pb-3 border-b border-slate-800">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Baisse de pression (Zone 4)</p>
                                    <p className="text-xs text-slate-500 mt-1">Il y a 10 min • Capteur P-402</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start pb-3 border-b border-slate-800">
                                <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Vent violent détecté</p>
                                    <p className="text-xs text-slate-500 mt-1">Il y a 25 min • Station Météo</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">Voir tout</Button>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-blue-500/20">
                        <h3 className="text-lg font-bold text-white mb-2">Lancer une mission</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Déployez un drone pour une inspection rapide.
                        </p>
                        <Button className="w-full" icon={Plane} onClick={() => navigate('/missions')}>
                            Nouvelle Mission
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
