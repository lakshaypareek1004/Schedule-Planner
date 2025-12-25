import React from 'react';
import { Mission, MissionType } from '../types';
import { CheckCircle2, Circle, Brain, Dumbbell, Laptop, Coffee } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onComplete: (id: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete }) => {
  const getIcon = (type: MissionType) => {
    switch (type) {
      case MissionType.INTELLECT: return <Brain size={18} />;
      case MissionType.PHYSICAL: return <Dumbbell size={18} />;
      case MissionType.GADGETS: return <Laptop size={18} />;
      case MissionType.RESTORE: return <Coffee size={18} />;
    }
  };

  const getBorderColor = (type: MissionType) => {
    switch (type) {
      case MissionType.INTELLECT: return 'border-blue-500/50';
      case MissionType.PHYSICAL: return 'border-red-500/50';
      case MissionType.GADGETS: return 'border-emerald-500/50';
      case MissionType.RESTORE: return 'border-amber-500/50';
      default: return 'border-slate-700';
    }
  };

  return (
    <div 
      className={`relative group flex items-start gap-4 p-4 rounded-lg bg-slate-900/80 border-l-4 ${getBorderColor(mission.type)} mb-3 transition-all hover:bg-slate-800 ${mission.isCompleted ? 'opacity-50 grayscale-[0.8]' : ''}`}
    >
      <button 
        onClick={() => onComplete(mission.id)}
        className="mt-1 text-slate-500 hover:text-cyan-400 transition-colors"
      >
        {mission.isCompleted ? <CheckCircle2 size={24} className="text-cyan-500" /> : <Circle size={24} />}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-bold text-lg leading-tight ${mission.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {mission.title}
          </h3>
          <span className="font-mono-tech text-xs text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded bg-cyan-950/50">
            {mission.startTime}
          </span>
        </div>
        
        <p className="text-sm text-slate-400 mt-1 font-mono">{mission.description}</p>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
            {getIcon(mission.type)}
            {mission.type}
          </span>
          <span className="text-xs font-mono-tech text-yellow-500">
            +{mission.xpReward} XP
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
            {mission.difficulty}
          </span>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-600"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-600"></div>
    </div>
  );
};

export default MissionCard;