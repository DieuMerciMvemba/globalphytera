import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const MissionList = ({ missions, onViewDetails }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <Badge variant="success">Terminé</Badge>;
            case 'pending': return <Badge variant="warning">En attente</Badge>;
            case 'in-progress': return <Badge variant="info">En cours</Badge>;
            case 'cancelled': return <Badge variant="danger">Annulé</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Titre / Champ</th>
                            <th className="p-4 font-semibold">Agriculteur</th>
                            <th className="p-4 font-semibold">Offre</th>
                            <th className="p-4 font-semibold">Type Vol</th>
                            <th className="p-4 font-semibold">Statut</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {missions.map((mission) => (
                            <tr key={mission.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-white">{mission.field_name}</div>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>ID: {mission.id}</span>
                                        {mission.area && <span>• {mission.area}</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                            {mission.farmer_name.charAt(0)}
                                        </div>
                                        {mission.farmer_name}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {mission.sub === 'Premium' && <Badge variant="purple">PREMIUM</Badge>}
                                    {mission.sub === 'Pro' && <Badge variant="info">PRO</Badge>}
                                    {mission.sub === 'Standard' && <Badge variant="default">STD</Badge>}
                                </td>
                                <td className="p-4">
                                    <span className="text-sm text-slate-300">{mission.type}</span>
                                    <div className="text-xs text-slate-500">{mission.date}</div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(mission.status)}
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Eye}
                                        onClick={() => onViewDetails(mission)}
                                    >
                                        Détails
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MissionList;
