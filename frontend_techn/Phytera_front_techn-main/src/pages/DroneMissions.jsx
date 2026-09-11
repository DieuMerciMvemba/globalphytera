import React, { useState } from 'react';
import Button from '../components/common/Button';
import MissionList from '../components/missions/MissionList';
import MissionDetail from '../components/missions/MissionDetail';
import PreFlightModal from '../components/missions/PreFlightModal';
import MissionMonitor from '../components/missions/MissionMonitor';
import { Plus } from 'lucide-react';

const mockMissions = [
    { id: 'MIS-001', field_name: 'Parcelle Nord - Tomates', farmer_name: 'M. Diop', type: 'NDVI', sub: 'Premium', area: '1.2 Ha', date: '2025-12-19', status: 'pending' },
    { id: 'MIS-002', field_name: 'Champ Maïs', farmer_name: 'Mme. Nidaye', type: 'Ortho 2D', sub: 'Standard', area: '300 m²', date: '2025-12-19', status: 'pending' },
    { id: 'MIS-003', field_name: 'Zone Cultures Piment', farmer_name: 'Jean Kabila', type: 'IoT + 2D', sub: 'Pro', area: '450 m²', date: '2025-12-20', status: 'pending' },
    { id: 'MIS-004', field_name: 'Vignoble Sud', farmer_name: 'Sophie Germain', type: '3D + IA', sub: 'Premium', area: '2.5 Ha', date: '2025-12-18', status: 'completed' },
];

const DroneMissions = () => {
    const [viewState, setViewState] = useState('list'); // 'list', 'detail', 'monitor'
    const [selectedMission, setSelectedMission] = useState(null);
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);

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
        alert("Mission Terminée avec succès ! Rapport généré.");
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
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Missions Drone
                                <span className="text-cyan-500">.</span>
                            </h1>
                            <p className="text-slate-400 mt-2">Gérez les plans de vol et suivez les missions en cours.</p>
                        </div>
                        <Button icon={Plus}>Nouvelle Mission</Button>
                    </div>

                    <MissionList
                        missions={mockMissions}
                        onViewDetails={handleViewDetails}
                    />
                </>
            )}

            {viewState === 'detail' && selectedMission && (
                <MissionDetail
                    mission={selectedMission}
                    onBack={() => {
                        setViewState('list');
                        setSelectedMission(null);
                    }}
                    onLaunch={handleStartMission}
                />
            )}

            {viewState === 'monitor' && selectedMission && (
                <MissionMonitor
                    mission={selectedMission}
                    onAbort={handleMissionAbort}
                    onFinish={handleMissionFinish}
                />
            )}

            {/* Modals */}
            <PreFlightModal
                isOpen={isChecklistOpen}
                onClose={() => setIsChecklistOpen(false)}
                onComplete={handleChecklistComplete}
            />
        </div>
    );
};

export default DroneMissions;
