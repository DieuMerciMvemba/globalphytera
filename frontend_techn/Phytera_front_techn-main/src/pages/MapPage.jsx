import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate } from 'lucide-react';
import Card from '../components/common/Card';

// Fix for default Leaflet markers in React
// In a real app, import local images or use svg icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
    // Coordonnées approximatives d'une zone agricole (ex: France rurale)
    const center = [47.2184, 1.5536];

    const markers = [
        { id: 1, position: [47.2184, 1.5536], title: 'Parcelle Blé Nord', type: 'field' },
        { id: 2, position: [47.2220, 1.5600], title: 'Drone D-04', type: 'drone' },
        { id: 3, position: [47.2150, 1.5450], title: 'Capteur Hydrométrie #2', type: 'sensor' }
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-100">Carte Interactive</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors">
                        <Locate className="w-4 h-4" /> Centrer sur ma position
                    </button>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden border-2 border-slate-800 relative z-0">
                <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    {/* Dark Mode Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {markers.map((marker) => (
                        <Marker key={marker.id} position={marker.position}>
                            <Popup>
                                <div className="p-1">
                                    <strong className="text-slate-800">{marker.title}</strong>
                                    <br />
                                    <span className="text-slate-600 text-xs uppercase font-bold">{marker.type}</span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Card>
        </div>
    );
};

export default MapPage;
