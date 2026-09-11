import React, { useState } from 'react';
import Button from '../components/common/Button';
import FieldList from '../components/fields/FieldList';
import FieldDetail from '../components/fields/FieldDetail';
import { Plus, Filter } from 'lucide-react';

const mockFields = [
    { id: 'FLD-001', name: 'Parcelle Nord', crop: 'Tomates', area: '1.2 Ha', health: 'Good', owner: 'M. Diop', location: 'Zone A', lastScan: 'Aujourd\'hui' },
    { id: 'FLD-002', name: 'Champ Maïs', crop: 'Maïs', area: '300 m²', health: 'Warning', owner: 'Mme. Nidaye', location: 'Zone B', lastScan: 'Hier' },
    { id: 'FLD-003', name: 'Vignoble Sud', crop: 'Raisin', area: '2.5 Ha', health: 'Excellent', owner: 'Sophie Germain', location: 'Coteaux', lastScan: '12/12/2025' },
    { id: 'FLD-004', name: 'Verger Est', crop: 'Mangues', area: '0.8 Ha', health: 'Critical', owner: 'Coop. Tuungane', location: 'Vallée', lastScan: 'Il y a 3 jours' },
    { id: 'FLD-005', name: 'Culture Piments', crop: 'Piment', area: '450 m²', health: 'Good', owner: 'Jean Kabila', location: 'Zone A', lastScan: 'Aujourd\'hui' },
];

const Fields = () => {
    const [selectedField, setSelectedField] = useState(null);

    return (
        <div className="space-y-6">
            {!selectedField ? (
                <>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Champs & Cultures
                                <span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-slate-400 mt-2">Suivi agronomique et santé végétale des parcelles.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" icon={Filter}>Filtres</Button>
                            <Button icon={Plus}>Ajouter Parcelle</Button>
                        </div>
                    </div>

                    <FieldList
                        fields={mockFields}
                        onViewDetails={setSelectedField}
                    />
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
