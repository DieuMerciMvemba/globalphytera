import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Sprout, Map, AlertTriangle, ArrowRight } from 'lucide-react';

const FieldList = ({ fields, onViewDetails }) => {
    return (
        <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Nom Parcelle</th>
                            <th className="p-4 font-semibold">Culture</th>
                            <th className="p-4 font-semibold">Surface</th>
                            <th className="p-4 font-semibold">Santé</th>
                            <th className="p-4 font-semibold">Propriétaire</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {fields.map((field) => (
                            <tr key={field.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded text-emerald-400">
                                            <Map size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{field.name}</div>
                                            <div className="text-xs text-slate-500">{field.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Sprout size={14} className="text-slate-500" />
                                        {field.crop}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300 font-mono text-sm">
                                    {field.area}
                                </td>
                                <td className="p-4">
                                    {field.health === 'Excellent' && <Badge variant="success">Excellent</Badge>}
                                    {field.health === 'Good' && <Badge variant="info">Bon</Badge>}
                                    {field.health === 'Warning' && <Badge variant="warning">Attention</Badge>}
                                    {field.health === 'Critical' && <Badge variant="danger">Critique</Badge>}
                                </td>
                                <td className="p-4 text-slate-400 text-sm">
                                    {field.owner}
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={ArrowRight}
                                        onClick={() => onViewDetails(field)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default FieldList;
