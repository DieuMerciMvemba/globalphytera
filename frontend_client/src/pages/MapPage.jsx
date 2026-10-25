import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Droplets, Sun, ChevronDown, ChevronUp, Plus, Layers, Globe, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { farmsService } from '../services/farmsService';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Couches sans clé d'API requise (ESRI Satellite pour l'agronomie, OSM pour le plan)
const MAP_LAYERS = {
    satellite: {
        label: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Sources: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
        maxZoom: 19,
    },
    osm: {
        label: 'Plan',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
};

// Helper pour recentrer la carte quand des parcelles sont chargées
const MapAutoRecenter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && Array.isArray(center) && center.length === 2) {
            map.setView(center, zoom || 13);
        }
    }, [center, zoom, map]);
    return null;
};

const MapPage = () => {
    const navigate = useNavigate();
    const [isOverlayOpen, setIsOverlayOpen] = useState(true);
    const [layerType, setLayerType] = useState('satellite');
    const [farms, setFarms] = useState([]);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState([-4.325, 15.312]); // Kinshasa par défaut
    const [mapZoom, setMapZoom] = useState(13);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await farmsService.getAllFarms();
                const farmList = Array.isArray(data) ? data : [];
                setFarms(farmList);

                // Extraction de tous les champs
                const allFields = farmList.flatMap(f => (f.fields || []).map(field => ({ ...field, farmName: f.name })));
                setFields(allFields);

                // Si des parcelles ont des coordonnées, centrer sur la première parcelle
                for (const f of allFields) {
                    const firstCoord = f.locationPolygon?.coordinates?.[0]?.[0];
                    if (firstCoord && firstCoord.length >= 2) {
                        setMapCenter([firstCoord[1], firstCoord[0]]);
                        setMapZoom(14);
                        break;
                    }
                }
            } catch (e) {
                setFarms([]);
                setFields([]);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const activeLayer = MAP_LAYERS[layerType] || MAP_LAYERS.satellite;

    return (
        <div className="h-[calc(100vh-8rem)] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl fade-in">
            {/* Map Controls / Overlay */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[400] bg-navy-900/90 backdrop-blur p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 w-64 sm:w-72 max-w-[calc(100%-1.5rem)] shadow-xl">
                <button
                    onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                    className="w-full text-white font-bold flex items-center justify-between gap-2"
                >
                    <span className="flex items-center gap-2 text-sm sm:text-base">
                        <MapPin size={16} className="text-neon-blue" />
                        Cartographie Parcelles
                    </span>
                    <span className="text-gray-400 sm:hidden">
                        {isOverlayOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                </button>

                {isOverlayOpen && (
                    <div className="space-y-3 mt-3 pt-2 border-t border-white/10">
                        {/* Sélecteur de couche Satellite / Plan */}
                        <div>
                            <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1.5 font-bold">
                                Fond de carte
                            </span>
                            <div className="grid grid-cols-2 gap-1.5 bg-navy-950/80 p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setLayerType('satellite')}
                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                        layerType === 'satellite'
                                            ? 'bg-neon-blue/20 text-neon-cyan border border-neon-blue/40 shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Globe size={13} />
                                    Satellite
                                </button>
                                <button
                                    onClick={() => setLayerType('osm')}
                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                        layerType === 'osm'
                                            ? 'bg-neon-blue/20 text-neon-cyan border border-neon-blue/40 shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Compass size={13} />
                                    Plan OSM
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-400">Parcelles Actives</span>
                            <span className="text-white font-mono font-bold">{fields.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-400">Exploitations</span>
                            <span className="text-neon-green font-mono font-bold">{farms.length}</span>
                        </div>

                        {fields.length === 0 ? (
                            <div className="pt-2 border-t border-white/5 space-y-2">
                                <p className="text-[11px] text-gray-400 leading-tight">
                                    Vous n'avez pas encore de parcelles enregistrées sur votre compte.
                                </p>
                                <button
                                    onClick={() => navigate('/farms')}
                                    className="w-full py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-navy-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:shadow-lg transition"
                                >
                                    <Plus size={14} /> Créer une exploitation
                                </button>
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-white/5 space-y-2">
                                <div className="text-[11px] text-gray-400 leading-tight">
                                    Cliquez sur une parcelle pour afficher les indicateurs agronomiques.
                                </div>
                                <button
                                    onClick={() => navigate('/farms')}
                                    className="w-full py-1.5 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-cyan rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                                >
                                    <Plus size={13} /> Gérer / Créer un champ
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <MapAutoRecenter center={mapCenter} zoom={mapZoom} />

                <TileLayer
                    key={layerType}
                    attribution={activeLayer.attribution}
                    url={activeLayer.url}
                    maxZoom={activeLayer.maxZoom}
                />

                {fields.map((field) => {
                    const coords = field.locationPolygon?.coordinates?.[0]?.map(pt => [pt[1], pt[0]]) || [];
                    if (coords.length === 0) return null;
                    return (
                        <Polygon
                            key={field.id}
                            positions={coords}
                            pathOptions={{
                                color: '#00FF9D',
                                fillColor: '#00FF9D',
                                fillOpacity: 0.35,
                                weight: 2.5
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-bold text-navy-900 text-base mb-1 border-b border-navy-900/10 pb-1">
                                        {field.name}
                                    </h4>
                                    <p className="text-xs text-navy-700 mb-2">Culture: {field.cultureType || 'Non spécifiée'}</p>
                                    <button
                                        onClick={() => navigate(`/fields/${field.id}`)}
                                        className="block w-full text-center mt-2 bg-navy-900 text-white text-xs py-1.5 rounded-lg hover:bg-navy-800 transition"
                                    >
                                        Détails Parcelle
                                    </button>
                                </div>
                            </Popup>
                        </Polygon>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapPage;
