import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { CheckCircle, XCircle, Loader2, Plane, Check, AlertTriangle } from 'lucide-react';

const steps = [
    { id: 'connection', label: 'Connexion Drone', duration: 1500 },
    { id: 'battery', label: 'Vérification Batterie (> 80%)', duration: 1000 },
    { id: 'sensors', label: 'Calibrage Capteurs (NDVI/RGB)', duration: 2000 },
    { id: 'gps', label: 'Verrouillage GPS (min 10 sats)', duration: 1500 },
    { id: 'weather', label: 'Analyse Météo Locale', duration: 1200 },
    { id: 'airspace', label: 'Autorisation Espace Aérien', duration: 1000 },
];

const PreFlightModal = ({ isOpen, onClose, onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            startChecklist();
        } else {
            reset();
        }
    }, [isOpen]);

    const reset = () => {
        setCurrentStepIndex(0);
        setCompletedSteps([]);
        setIsChecking(false);
        setError(null);
    }

    const startChecklist = async () => {
        setIsChecking(true);
        for (let i = 0; i < steps.length; i++) {
            setCurrentStepIndex(i);
            await new Promise(resolve => setTimeout(resolve, steps[i].duration));

            // Simulation d'un échec aléatoire (pour la démo, on le met à 0% ici pour fluidité, ou on peut scripter)
            const success = true;

            if (success) {
                setCompletedSteps(prev => [...prev, steps[i].id]);
            } else {
                setError("Échec de la vérification : " + steps[i].label);
                setIsChecking(false);
                return;
            }
        }
        setIsChecking(false);
    };

    if (!isOpen) return null;

    const allComplete = completedSteps.length === steps.length;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {allComplete ? (
                            <Plane size={32} className="text-cyan-400 animate-pulse" />
                        ) : (
                            <Loader2 size={32} className="text-cyan-500 animate-spin" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white">Checklist Pré-vol</h2>
                    <p className="text-slate-400 text-sm">Vérification automatique des systèmes...</p>
                </div>

                <div className="space-y-3 mb-8">
                    {steps.map((step, index) => {
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = index === currentStepIndex && isChecking;
                        const isWaiting = !isCompleted && !isCurrent;

                        return (
                            <div key={step.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isCompleted
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : isCurrent
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                        : 'bg-slate-800 border-slate-700 text-slate-500'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {isCompleted ? <CheckCircle size={18} /> : isCurrent ? <Loader2 size={18} className="animate-spin" /> : <div className="w-[18px]" />}
                                    <span className="font-medium text-sm">{step.label}</span>
                                </div>
                                {isCompleted && <span className="text-xs font-bold">OK</span>}
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isChecking && !allComplete}>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1"
                        disabled={!allComplete}
                        onClick={onComplete}
                        icon={Plane}
                    >
                        Décollage
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PreFlightModal;
