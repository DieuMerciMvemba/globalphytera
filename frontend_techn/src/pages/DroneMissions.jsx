import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import MissionList from '../components/missions/MissionList';
import MissionDetail from '../components/missions/MissionDetail';
import PreFlightModal from '../components/missions/PreFlightModal';
import MissionMonitor from '../components/missions/MissionMonitor';
import { Plus, Loader2, Plane } from 'lucide-react';
import { droneService } from '../services/droneService';

const DroneMissions = () => {
    const [viewState, setViewState] = useState('list'); // 'list', 'detail', 'monitor'
    const [selectedMission, setSelectedMission] = useState(null);
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMissions = async () => {
        setLoading(true);
        try {
            const data = await droneService.getAllMissions();
            const mapped = (data || []).map((m) => ({
                id: m.id,
                field_name: m.field ? `${m.field.name} (${m.field.cultureType || 'Culture'})` : (m.name || 'Mission Drone'),
                farmer_name: m.field?.farm?.name || m.pilotName || 'Exploitant',
                type: m.ndviMapUrl ? 'NDVI Multispectral' : 'Survol Thermique',
                sub: 'Standard',
                area: m.field?.surfaceArea ? `${m.field.surfaceArea} m²` : 'N/A',
                date: m.flightDate ? new Date(m.flightDate).toLocaleDateString() : 'Aujourd\'hui',
                status: m.status ? m.status.toLowerCase() : 'pending',
                raw: m,
            }));
            setMissions(mapped);
        } catch (err) {
            console.error('Erreur chargement missions drone:', err.message);
            setMissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMissions();
    }, []);

    // Handlers
    const handleViewDetails = (mission) => {
        setSelectedMission(mission);
        setViewState('detail');
    };

    const handleStartMission = () => {
        setIsChecklistOpen(true);
    };

    const handleChecklistComplete = () => {
        setIsChecklistOpen(false);
        setViewState('monitor');
    };

    const handleMissionFinish = () => {
        setViewState('list');
        setSelectedMission(null);
        alert("Mission terminée avec succès !");
        loadMissions();
    };

    const handleMissionAbort = () => {
        if (confirm("Êtes-vous sûr de vouloir annuler la mission en cours ? Retour à la base immédiat.")) {
            setViewState('detail');
        }
    };

    return (
        <div className="space-y-6">
            {viewState === 'list' && (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Missions Drone
                                <span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">Surveillez et planifiez les vols réels de cartographie multispectrale.</p>
                        </div>
                        <Button icon={Plus} onClick={loadMissions}>Actualiser</Button>
                    </div>

                    {loading ? (
                        <div className="min-h-[250px] flex flex-col items-center justify-center text-cyan-400 gap-2">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm text-slate-400">Chargement des missions réelles...</p>
                        </div>
                    ) : missions.length > 0 ? (
                        <MissionList
                            missions={missions}
                            onViewDetails={handleViewDetails}
                        />
                    ) : (
                        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
                            <Plane className="mx-auto text-slate-600 mb-3" size={36} />
                            <h3 className="text-lg font-bold text-white">Aucune mission enregistrée</h3>
                            <p className="text-sm text-slate-400 mt-1">Aucun vol de drone n'est actuellement programmé pour vos parcelles.</p>
                        </div>
                    )}
                </>
            )}

            {viewState === 'detail' && selectedMission && (
                <MissionDetail
                    mission={selectedMission}
                    onBack={() => {
                        setViewState('list');
                        setSelectedMission(null);
                    }}
                    onStart={handleStartMission}
                />
            )}

            {viewState === 'monitor' && selectedMission && (
                <MissionMonitor
                    mission={selectedMission}
                    onAbort={handleMissionAbort}
                    onFinish={handleMissionFinish}
                />
            )}

            <PreFlightModal
                isOpen={isChecklistOpen}
                onClose={() => setIsChecklistOpen(false)}
                onConfirm={handleChecklistComplete}
            />
        </div>
    );
};

export default DroneMissions;
