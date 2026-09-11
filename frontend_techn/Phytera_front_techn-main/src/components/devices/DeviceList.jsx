import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Eye, Battery, Signal, Wifi, WifiOff } from 'lucide-react';

const DeviceList = ({ devices, onViewDetails }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
                <Card key={device.id} className="cursor-pointer hover:border-cyan-500/50 transition-all group" onClick={() => onViewDetails(device)}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${device.status === 'online' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                {device.type === 'Weather Station' ? '🌤️' : '🌱'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{device.name}</h3>
                                <p className="text-xs text-slate-500">{device.id}</p>
                            </div>
                        </div>
                        <Badge variant={device.status === 'online' ? 'success' : 'danger'}>
                            {device.status === 'online' ? 'En Ligne' : 'Hors Ligne'}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Lecture Actuelle</div>
                            <div className="text-xl font-mono text-white font-bold">{device.lastReading}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Localisation</div>
                            <div className="text-sm text-white truncate">{device.location}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Battery size={12} className={device.battery < 20 ? 'text-red-500' : 'text-emerald-400'} />
                                {device.battery}%
                            </span>
                            <span className="flex items-center gap-1">
                                <Signal size={12} className="text-blue-400" />
                                {device.signal}db
                            </span>
                        </div>
                        <Button variant="ghost" size="sm" icon={Eye} onClick={(e) => { e.stopPropagation(); onViewDetails(device); }}>
                            Voir
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DeviceList;
