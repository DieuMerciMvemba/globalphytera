import React from 'react';
import { ShoppingBag, Star, AlertCircle, Check, X } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const Marketplace = () => {
    const products = [
        { id: 1, name: 'Semences Blé Bio', seller: 'Semences de France', category: 'Semences', price: '450 €', stock: 50, status: 'Actif', reports: 0 },
        { id: 2, name: 'Engrais Azoté Liquide', seller: 'AgriChem', category: 'Engrais', price: '89 €', stock: 200, status: 'En attente', reports: 0 },
        { id: 3, name: 'Drone Surveillance Occasion', seller: 'Jean Dupont', category: 'Matériel', price: '1200 €', stock: 1, status: 'Suspendu', reports: 3 },
        { id: 4, name: 'Capteur Humidité Pro', seller: 'IoT Solutions', category: 'Capteurs', price: '150 €', stock: 15, status: 'Actif', reports: 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Supervision Marketplace</h2>
                    <p className="text-slate-400">Validation des annonces et modération</p>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Produit</th>
                            <th className="px-6 py-4">Vendeur</th>
                            <th className="px-6 py-4">Catégorie</th>
                            <th className="px-6 py-4">Prix</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Signalements</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div className="font-medium text-white">{product.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{product.seller}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-white">{product.price}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={product.status} />
                                </td>
                                <td className="px-6 py-4">
                                    {product.reports > 0 ? (
                                        <span className="flex items-center gap-1 text-rose-400 font-medium">
                                            <AlertCircle size={14} /> {product.reports}
                                        </span>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded transition-colors" title="Valider">
                                            <Check size={18} />
                                        </button>
                                        <button className="p-1 hover:bg-rose-500/20 text-rose-500 rounded transition-colors" title="Suspendre">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Marketplace;
