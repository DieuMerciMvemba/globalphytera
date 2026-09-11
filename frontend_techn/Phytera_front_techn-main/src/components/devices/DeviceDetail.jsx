import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { ArrowLeft, Battery, Signal, Radio, RefreshCw, Thermometer, Droplets, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
    { time: '00:00', value: 62 },
    { time: '04:00', value: 65 },
    { time: '08:00', value: 68 },
    { time: '12:00', value: 55 },
    { time: '16:00', value: 58 },
    { time: '20:00', value: 60 },
    { time: '23:59', value: 61 },
];

const DeviceDetail = ({ device, onBack }) => {
    if (!device) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" icon={ArrowLeft} onClick={onBack}>Retour</Button>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            {device.name}
                            <Badge variant={device.status === 'online' ? 'success' : 'danger'}>
                                {device.status === 'online' ? 'Connecté' : 'Déconnecté'}
                            </Badge>
                        </h2>
                        <p className="text-slate-400 text-sm">{device.type} • {device.location}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={RefreshCw}>Calibrer</Button>
                    <Button variant="primary">Ping Test</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Metrics */}
                <Card className="lg:col-span-2" title="Données en Temps Réel">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Status & Maintenance */}
                <div className="space-y-6">
                    <Card title="État Santé">
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded text-emerald-400">
                                        <Battery size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Batterie</div>
                                        <div className="font-bold text-white text-lg">{device.battery}%</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">Estimé: 45 jours</div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded text-blue-400">
                                        <Signal size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Signal (LoRaWAN)</div>
                                        <div className="font-bold text-white text-lg">-{device.signal} dBm</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">Excellent</div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400">Uptime</div>
                                        <div className="font-bold text-white text-lg">99.8%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Maintenance">
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between">
                                <span className="text-slate-400">Firmware</span>
                                <span className="text-white font-mono">v2.4.1-stable</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-400">Dernier Ping</span>
                                <span className="text-white">Il y a 2 min</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-400">Installation</span>
                                <span className="text-white">12 Nov 2024</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetail;
