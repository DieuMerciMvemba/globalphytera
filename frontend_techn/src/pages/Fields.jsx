import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import FieldList from '../components/fields/FieldList';
import FieldDetail from '../components/fields/FieldDetail';
import { Plus, Filter, Loader2, Sprout } from 'lucide-react';
import { fieldsService } from '../services/fieldsService';

const Fields = () => {
    const [selectedField, setSelectedField] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFields = async () => {
        setLoading(true);
        try {
            const data = await fieldsService.getFields();
            const mapped = (data || []).map((f) => ({
                ...f,
                crop: f.cultureType ? `${f.cultureType}${f.variety ? ' (' + f.variety + ')' : ''}` : 'Culture générale',
                area: f.surfaceArea ? (f.surfaceArea >= 10000 ? `${(f.surfaceArea / 10000).toFixed(1)} Ha` : `${f.surfaceArea} m²`) : 'Non mesurée',
                health: f.alerts && f.alerts.length > 0 ? (f.alerts.some(a => a.severity === 'CRITICAL') ? 'Critical' : 'Warning') : 'Good',
                owner: f.farm?.owner?.nom || f.farm?.name || 'Exploitant',
                location: f.farm?.location || 'Parcelle client',
            }));
            setFields(mapped);
        } catch (err) {
            console.error('Erreur chargement parcelles:', err.message);
            setFields([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFields();
    }, []);

    return (
        <div className="space-y-6">
            {!selectedField ? (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Champs & Cultures
                                <span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Suivi agronomique et santé végétale des parcelles réelles.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" icon={Filter} onClick={loadFields}>Rafraîchir</Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="min-h-[250px] flex flex-col items-center justify-center text-cyan-400 gap-2">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm text-slate-400">Chargement des parcelles depuis Supabase...</p>
                        </div>
                    ) : fields.length > 0 ? (
                        <FieldList
                            fields={fields}
                            onViewDetails={setSelectedField}
                        />
                    ) : (
                        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
                            <Sprout className="mx-auto text-slate-600 mb-3" size={36} />
                            <h3 className="text-lg font-bold text-white">Aucune parcelle trouvée</h3>
                            <p className="text-sm text-slate-400 mt-1">Les exploitations n'ont pas encore enregistré de parcelles dans le système.</p>
                        </div>
                    )}
                </>
            ) : (
                <FieldDetail
                    field={selectedField}
                    onBack={() => setSelectedField(null)}
                />
            )}
        </div>
    );
};

export default Fields;
