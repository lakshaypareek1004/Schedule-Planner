import React from 'react';
import { X, Trophy, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MissionDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (multiplier: number) => void;
}

const MissionDebriefModal: React.FC<MissionDebriefModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-cyan-500">
            <ShieldCheck size={20} />
            <h2 className="font-mono-tech uppercase tracking-widest text-lg">Mission Debrief</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-400 text-sm text-center mb-4">
            Report operational outcome to update Wayne database.
          </p>

          <button 
            onClick={() => onConfirm(1.25)}
            className="w-full group relative p-4 bg-gradient-to-r from-amber-900/20 to-transparent border border-amber-700/50 hover:border-amber-500 hover:from-amber-900/40 rounded flex items-center gap-4 transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400 text-amber-500">
              <Trophy size={20} />
            </div>
            <div className="text-left">
              <div className="text-amber-400 font-bold uppercase tracking-wider text-sm group-hover:text-amber-300">Exceptional Performance</div>
              <div className="text-amber-500/60 text-xs font-mono">Mission completed early or with tactical perfection. (+25% XP)</div>
            </div>
          </button>

          <button 
            onClick={() => onConfirm(1.0)}
            className="w-full group relative p-4 bg-gradient-to-r from-cyan-900/20 to-transparent border border-cyan-700/50 hover:border-cyan-500 hover:from-cyan-900/40 rounded flex items-center gap-4 transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 text-cyan-500">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-left">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-sm group-hover:text-cyan-300">Mission Accomplished</div>
              <div className="text-cyan-500/60 text-xs font-mono">Objectives met within standard parameters. (Standard XP)</div>
            </div>
          </button>

          <button 
            onClick={() => onConfirm(0.5)}
            className="w-full group relative p-4 bg-gradient-to-r from-red-900/20 to-transparent border border-red-700/50 hover:border-red-500 hover:from-red-900/40 rounded flex items-center gap-4 transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-red-900/30 flex items-center justify-center border border-red-500/30 group-hover:border-red-400 text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div className="text-left">
              <div className="text-red-400 font-bold uppercase tracking-wider text-sm group-hover:text-red-300">Late / Compromised</div>
              <div className="text-red-500/60 text-xs font-mono">Mission overdue or complications encountered. (-50% XP)</div>
            </div>
          </button>
        </div>
        
        {/* Footer decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
      </div>
    </div>
  );
};

export default MissionDebriefModal;