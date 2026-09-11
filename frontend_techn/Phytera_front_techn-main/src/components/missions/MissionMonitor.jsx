import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { X, Battery, Wifi, Activity, CheckCircle, Clock } from 'lucide-react';

const MissionMonitor = ({ mission, onAbort, onFinish }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        altitude: 0,
        speed: 0,
        battery: 100
    });

    const addLog = (message) => {
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), message }, ...prev].slice(0, 5));
    };

    useEffect(() => {
        addLog("Décollage effectué. Montée vers altitude cible.");

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Update mock telemetry
                setStats(prevStats => ({
                    altitude: prev < 10 ? prev * 12 : 120 + Math.random() * 2,
                    speed: prev < 10 ? prev : 15 + Math.random(),
                    battery: Math.max(20, 100 - (prev * 0.5))
                }));

                // Random logs
                if (Math.random() > 0.8) {
                    const messages = [
                        "Correction de trajectoire...",
                        "Acquisition image secteur " + Math.floor(Math.random() * 10),
                        "Liaison stable 24ms",
                        "Analyse spectre NDVI en cours",
                        "Vent détecté 15km/h - Compensation"
                    ];
                    addLog(messages[Math.floor(Math.random() * messages.length)]);
                }

                return prev + 0.5; // Speed of simulation
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            addLog("Mission terminée. Retour à la base.");
            setTimeout(onFinish, 2000);
        }
    }, [progress]);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <Badge variant="info" className="mb-2 animate-pulse">EN VOL</Badge>
                    <h1 className="text-3xl font-bold text-white">Mission en cours: {mission.field_name}</h1>
                    <p className="text-slate-400">Suivi télémétrique en temps réel</p>
                </div>
                <Button variant="danger" icon={X} onClick={onAbort}>Annuler Urgence</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Live Map Area (Big) */}
                <Card className="lg:col-span-3 h-[500px] relative p-0 overflow-hidden group">
                    <div className="absolute inset-0 bg-slate-900">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                        {/* Drone Dot Animation */}
                        <div
                            className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10 transition-all duration-300 ease-linear"
                            style={{
                                top: `${20 + (Math.sin(progress / 10) * 30 + 30)}%`,
                                left: `${progress}%`
                            }}
                        >
                            <div className="absolute inset-0 animate-ping bg-cyan-400 rounded-full opacity-75"></div>
                        </div>

                        {/* Path Trail */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path
                                d={`M 0 300 Q ${progress * 5} ${200 + Math.sin(progress / 10) * 100} ${progress}% ${20 + (Math.sin(progress / 10) * 30 + 30)}%`}
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />
                        </svg>
                    </div>

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur border-t border-slate-800 p-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-white font-mono">PROGRESSION</span>
                            <span className="text-cyan-400 font-mono">{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </Card>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card title="Télémétrie">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><Activity size={12} /> Altitude</div>
                                <div className="text-2xl font-bold text-white font-mono">{stats.altitude.toFixed(1)}m</div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><Wifi size={12} /> Vitesse</div>
                                <div className="text-2xl font-bold text-white font-mono">{stats.speed.toFixed(1)}m/s</div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><Battery size={12} /> Batterie</div>
                                <div className={`text-2xl font-bold font-mono ${stats.battery < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {stats.battery.toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Journal de Vol" className="flex-1">
                        <div className="space-y-3 font-mono text-xs">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-slate-500">[{log.time}]</span>
                                    <span className="text-cyan-300">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MissionMonitor;
