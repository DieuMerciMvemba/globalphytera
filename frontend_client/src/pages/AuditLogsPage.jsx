import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, Terminal, Globe, Calendar, RefreshCw, FileText } from 'lucide-react';
import { auditService } from '../services/auditService';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await auditService.getAuditLogs(page, 50);
            setLogs(Array.isArray(data) ? data : data?.data || []);
        } catch (err) {
            console.error('Erreur récupération logs d\'audit:', err.message);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-neon-blue" />
                        Journaux d'Audit & Sécurité System (Admin)
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Traçabilité intégrale des accès, modifications de configuration et sécurité NestJS/Prisma.
                    </p>
                </div>

                <button
                    onClick={fetchLogs}
                    className="p-2.5 rounded-xl bg-navy-800 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all self-start md:self-auto"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Audit Logs Table */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-16 rounded-xl bg-navy-900/50 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-16 bg-navy-900/30 border border-white/5 rounded-2xl">
                    <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white">Aucun journal d'audit</h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto mt-1">
                        Aucun événement de sécurité consigné pour l'instant.
                    </p>
                </div>
            ) : (
                <div className="bg-navy-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-navy-950/80 text-xs font-semibold uppercase text-neon-cyan border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4">Horodatage</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Entité / Cible</th>
                                    <th className="px-6 py-4">Utilisateur</th>
                                    <th className="px-6 py-4">Adresse IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neon-blue/10 border border-neon-blue/30 text-neon-cyan font-mono">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {log.entity} {log.entityId && <span className="text-xs text-gray-500">({log.entityId})</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-400" />
                                                <span>{log.user?.nom || log.user?.email || 'Système'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            {log.ipAddress || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
