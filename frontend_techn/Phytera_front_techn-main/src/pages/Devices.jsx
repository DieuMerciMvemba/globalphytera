import React, { useState } from 'react';
import Button from '../components/common/Button';
import DeviceList from '../components/devices/DeviceList';
import DeviceDetail from '../components/devices/DeviceDetail';
import { Plus, Filter } from 'lucide-react';

const mockDevices = [
    { id: 'IOT-S-001', name: 'Sonde Sol Master', type: 'Soil Sensor', location: 'Parcelle Maïs Nord (M. Dupont)', status: 'online', battery: 88, signal: 45, lastReading: '42% Hum.' },
    { id: 'IOT-W-004', name: 'Station Météo Vigne', type: 'Weather Station', location: 'Vignoble Sud (S. Germain)', status: 'online', battery: 95, signal: 32, lastReading: '24°C / 12km/h' },
    { id: 'IOT-S-003', name: 'Capteur pH Zone B', type: 'Soil Sensor', location: 'Coopérative Tuungane', status: 'offline', battery: 12, signal: 85, lastReading: 'pH 6.2' },
    { id: 'IOT-C-012', name: 'Caméra Surveillance', type: 'Camera', location: 'Entrée Principale', status: 'online', battery: 100, signal: 20, lastReading: 'Active' },
    { id: 'IOT-S-008', name: 'Sonde Hydrique', type: 'Soil Sensor', location: 'Champ Maïs (Mme. Ndiaye)', status: 'online', battery: 67, signal: 55, lastReading: '18% Hum.' },
];

const Devices = () => {
    const [selectedDevice, setSelectedDevice] = useState(null);

    return (
        <div className="space-y-6">
            {!selectedDevice ? (
                <>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Capteurs IoT
                                <span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-slate-400 mt-2">Surveillance de la flotte d'objets connectés et stations météo.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" icon={Filter}>Filtres</Button>
                            <Button icon={Plus}>Ajouter Capteur</Button>
                        </div>
                    </div>

                    <DeviceList
                        devices={mockDevices}
                        onViewDetails={setSelectedDevice}
                    />
                </>
            ) : (
                <DeviceDetail
                    device={selectedDevice}
                    onBack={() => setSelectedDevice(null)}
                />
            )}
        </div>
    );
};

export default Devices;
