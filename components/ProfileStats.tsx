import React from 'react';
import { UserProfile } from '../types';
import { RANKS } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Shield, TrendingUp, Award } from 'lucide-react';

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const chartData = [
    { subject: 'Intellect', A: profile.stats.intellect, fullMark: 100 },
    { subject: 'Strength', A: profile.stats.strength, fullMark: 100 },
    { subject: 'Tech', A: profile.stats.tech, fullMark: 100 },
    { subject: 'Will', A: profile.stats.willpower, fullMark: 100 },
  ];

  const rankIndex = Math.min(Math.floor(profile.level / 5), RANKS.length - 1);
  const currentRank = RANKS[rankIndex];
  
  const progressPercent = Math.min((profile.currentXp / profile.xpToNextLevel) * 100, 100);

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{profile.name}</h2>
          <div className="text-cyan-500 font-mono-tech text-sm">LVL {profile.level} // {currentRank}</div>
        </div>
        <div className="h-12 w-12 rounded-full bg-slate-800 border border-cyan-500 flex items-center justify-center">
          <Shield className="text-cyan-400" size={24} />
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
          <span>PROGRESS</span>
          <span>{profile.currentXp} / {profile.xpToNextLevel} XP</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="#0ea5e9"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
        
        {/* Overlay Grid lines for tech effect */}
        <div className="absolute inset-0 pointer-events-none border border-slate-800/50 rounded-full opacity-20"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center gap-3">
            <TrendingUp className="text-emerald-500" size={20} />
            <div>
                <div className="text-[10px] text-slate-500 uppercase">Streak</div>
                <div className="text-xl font-mono-tech text-white">{profile.streak} Days</div>
            </div>
        </div>
        <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center gap-3">
            <Award className="text-amber-500" size={20} />
            <div>
                <div className="text-[10px] text-slate-500 uppercase">Missions</div>
                <div className="text-xl font-mono-tech text-white">Active</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;