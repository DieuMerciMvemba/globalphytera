import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, XCircle, User, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { installationService } from '../../services/installationService';

const PendingInstallationsCard = ({ onAccepted }) => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const loadPending = async () => {
    const data = await installationService.getPendingRequests();
    setRequests(data.filter((r) => r.status === 'PENDING'));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleAccept = async (reqId, fieldName) => {
    setLoadingId(reqId);
    try {
      await installationService.acceptRequest(reqId);
      setFeedbackMsg(`Le champ "${fieldName}" et le boîtier ESP32 ont été activés avec succès !`);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      if (onAccepted) onAccepted();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      alert('Erreur lors de l\'acceptation: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (reqId) => {
    setLoadingId(reqId);
    try {
      await installationService.rejectRequest(reqId, 'Refusé par l\'agriculteur');
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch (err) {
      alert('Erreur lors du refus: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0 && !feedbackMsg) return null;

  return (
    <div className="space-y-3">
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 shadow-lg animate-fade-in">
          <Sparkles className="text-emerald-400 shrink-0" size={20} />
          <span className="font-semibold">{feedbackMsg}</span>
        </div>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="glass-panel p-5 rounded-2xl border border-neon-blue/30 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-navy-950/90 relative overflow-hidden shadow-xl space-y-4"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neon-blue/20 border border-neon-blue/40 rounded-xl text-neon-blue">
                <Cpu size={22} />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-neon-blue">
                  Validation d'installation requise
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {req.fieldName} ({req.cultureType})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <User size={14} className="text-neon-cyan" />
              <span>Proposé par <strong>{req.technician?.nom || 'Votre Technicien'}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-white/5">
              <span className="text-gray-400 block mb-0.5">Culture & Variété</span>
              <span className="font-bold text-white">{req.cultureType} {req.variety ? `(${req.variety})` : ''}</span>
            </div>

            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-white/5">
              <span className="text-gray-400 block mb-0.5">Superficie estimée</span>
              <span className="font-bold text-white">{req.surfaceArea ? `${req.surfaceArea} m²` : 'N/C'}</span>
            </div>

            <div className="bg-navy-950/60 p-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-gray-400 block mb-0.5">Boîtier ESP32 (S/N)</span>
              <span className="font-mono font-bold text-neon-cyan">{req.serialNumber}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-1">
            <button
              onClick={() => handleReject(req.id)}
              disabled={loadingId === req.id}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={16} />
              Refuser
            </button>

            <button
              onClick={() => handleAccept(req.id, req.fieldName)}
              disabled={loadingId === req.id}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-neon-green to-emerald-400 hover:shadow-lg hover:shadow-neon-green/20 transition-all flex items-center justify-center gap-2"
            >
              {loadingId === req.id ? (
                <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Accepter & Activer la Parcelle
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingInstallationsCard;
