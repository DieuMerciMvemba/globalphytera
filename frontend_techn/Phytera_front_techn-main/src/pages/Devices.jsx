import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import DeviceList from '../components/devices/DeviceList';
import DeviceDetail from '../components/devices/DeviceDetail';
import { Plus, Filter, Cpu, ShieldCheck } from 'lucide-react';
import { devicesService } from '../services/devicesService';

const mockDevicesFallback = [
  {
    id: 'dev-demo-1',
    serialNumber: 'SN-PHY-2026-X8F2A',
    deviceKey: 'KEY_PHY_998811A',
    name: 'ESP32 - Champ Piments Est',
    type: 'ESP32 IoT Node',
    location: 'Domaine Agricole de Mbanza',
    status: 'online',
    battery: 94,
    signal: 25,
    lastReading: 'Air 28.5°C / Sol 48%',
    firmwareVersion: '1.0.0',
  },
  {
    id: 'dev-demo-2',
    serialNumber: 'SN-PHY-2026-B3C91',
    deviceKey: 'KEY_PHY_442299B',
    name: 'ESP32 - Parcelle Maïs Nord',
    type: 'ESP32 IoT Node',
    location: 'Exploitation Maraîchère Nsele',
    status: 'pending',
    battery: 100,
    signal: 15,
    lastReading: 'En attente d\'activation client',
    firmwareVersion: '1.0.0',
  },
];

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await devicesService.getAllDevices();
      // Transformer les données backend pour adapter aux composants si nécessaire
      const mapped = data.map((d) => ({
        ...d,
        name: d.name || `Boîtier ESP32 (${d.serialNumber || d.id})`,
        type: 'ESP32 PhyTera',
        location: d.fieldName ? `${d.fieldName} (${d.farmName || 'Ferme'})` : (d.farmName || 'Non assigné'),
        status: (d.status === 'ACTIVE' || d.status === 'online') ? 'online' : (d.status === 'PENDING_APPROVAL' ? 'pending' : 'offline'),
        battery: d.batteryLevel || 95,
        signal: 20,
        lastReading: d.lastSeen ? `Dernier signal: ${new Date(d.lastSeen).toLocaleTimeString()}` : 'Jamais connecté',
      }));
      setDevices(mapped.length > 0 ? mapped : mockDevicesFallback);
    } catch (err) {
      setDevices(mockDevicesFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="space-y-6">
      {!selectedDevice ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Boîtiers IoT & Capteurs (ESP32)
                <span className="text-cyan-500">.</span>
              </h1>
              <p className="text-slate-400 mt-2">
                Gestion des numéros de série automatiques (`SN-PHY-...`), clés d'authentification et état des capteurs (SHT45/SID12).
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={Filter}>
                Filtres
              </Button>
              <Button icon={Plus} onClick={loadDevices}>
                Rafraîchir
              </Button>
            </div>
          </div>

          <DeviceList
            devices={devices}
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
