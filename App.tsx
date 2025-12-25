import React, { useState, useEffect, useMemo } from 'react';
import { generateSchedule } from './services/geminiService';
import { Mission, UserProfile, INITIAL_PROFILE, MissionType } from './types';
import BatInput from './components/BatInput';
import MissionCard from './components/MissionCard';
import ProfileStats from './components/ProfileStats';
import MissionDebriefModal from './components/MissionDebriefModal';
import { Activity, AlertTriangle, LayoutDashboard, Clock, Zap, BarChart3, ArrowUpDown, Coffee } from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debriefMissionId, setDebriefMissionId] = useState<string | null>(null);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'time' | 'xp' | 'difficulty'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wayne-profile');
    const savedMissions = localStorage.getItem('wayne-missions');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedMissions) setMissions(JSON.parse(savedMissions));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('wayne-profile', JSON.stringify(profile));
    localStorage.setItem('wayne-missions', JSON.stringify(missions));
  }, [profile, missions]);

  const handleGenerateSchedule = async (input: string) => {
    setLoading(true);
    setError(null);
    try {
      const generatedMissions = await generateSchedule(input);
      
      const newMissions: Mission[] = generatedMissions.map((m, index) => ({
        ...m,
        id: Date.now().toString() + index,
        isCompleted: false
      }));

      setMissions(newMissions);
    } catch (err) {
      setError("Failed to connect to Batcomputer. Network interference detected.");
    } finally {
      setLoading(false);
    }
  };

  const initiateDebrief = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission || mission.isCompleted) return;
    setDebriefMissionId(id);
  };

  const finalizeDebrief = (multiplier: number) => {
    if (!debriefMissionId) return;

    const mission = missions.find(m => m.id === debriefMissionId);
    if (!mission) {
      setDebriefMissionId(null);
      return;
    }

    // Update missions
    setMissions(prev => prev.map(m => m.id === debriefMissionId ? { ...m, isCompleted: true } : m));

    // Update Profile Stats
    setProfile(prev => {
      const xpGained = Math.floor(mission.xpReward * multiplier);
      const newXp = prev.currentXp + xpGained;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;

      // Level Up Logic
      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        newXpToNext = Math.floor(prev.xpToNextLevel * 1.5);
      }

      // Stat Increase Logic
      const newStats = { ...prev.stats };
      const statIncrease = multiplier >= 1.25 ? 3 : (multiplier <= 0.5 ? 1 : 2); // Bonus stat for exceptional
      
      switch (mission.type) {
        case MissionType.INTELLECT: newStats.intellect += statIncrease; break;
        case MissionType.PHYSICAL: newStats.strength += statIncrease; break;
        case MissionType.GADGETS: newStats.tech += statIncrease; break;
        case MissionType.RESTORE: newStats.willpower += statIncrease; break;
      }

      return {
        ...prev,
        currentXp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        stats: newStats,
        streak: multiplier >= 1.0 ? prev.streak + (prev.streak === 0 ? 1 : 0) : prev.streak // Simple streak logic, could be more complex
      };
    });

    setDebriefMissionId(null);
  };

  const handleSort = (criteria: 'time' | 'xp' | 'difficulty') => {
    if (sortBy === criteria) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => {
      let res = 0;
      if (sortBy === 'time') {
        res = a.startTime.localeCompare(b.startTime);
      } else if (sortBy === 'xp') {
        res = a.xpReward - b.xpReward;
      } else if (sortBy === 'difficulty') {
        const difficultyRank = { 'ROOKIE': 1, 'VIGILANTE': 2, 'KNIGHT': 3 };
        res = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
      }
      return sortOrder === 'asc' ? res : -res;
    });
  }, [missions, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-full border border-slate-700 flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <span className="text-2xl">🦇</span>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-widest text-slate-100">Wayne Planner</h1>
              <p className="text-[10px] text-cyan-500 font-mono-tech tracking-wider">SECURE CONNECTION ESTABLISHED</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>TEMP: 54°F</span>
            <span>HUMIDITY: 82%</span>
            <span>GOTHAM CITY</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Input */}
        <div className="lg:col-span-1 space-y-8">
          <ProfileStats profile={profile} />
          
          <BatInput onGenerate={handleGenerateSchedule} isLoading={loading} />
          
          {error && (
            <div className="bg-red-950/30 border border-red-900 p-4 rounded flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Mission Log */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold uppercase flex items-center gap-2">
              <LayoutDashboard className="text-cyan-500" />
              Daily Operations
            </h2>
            <div className="text-xs font-mono-tech text-slate-500 border border-slate-800 px-2 py-1 rounded">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Sort Controls */}
          {missions.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <div className="text-xs text-slate-500 font-mono-tech uppercase self-center mr-2 shrink-0">Sort Protocols:</div>
              <button 
                onClick={() => handleSort('time')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech border transition-all ${sortBy === 'time' ? 'text-cyan-400 border-cyan-800 bg-cyan-950/30' : 'text-slate-500 border-slate-800 hover:border-slate-600'}`}
              >
                <Clock size={12} /> TIME 
                {sortBy === 'time' && <ArrowUpDown size={10} className={sortOrder === 'asc' ? '' : 'rotate-180'} />}
              </button>
              <button 
                onClick={() => handleSort('xp')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech border transition-all ${sortBy === 'xp' ? 'text-yellow-400 border-yellow-800 bg-yellow-950/30' : 'text-slate-500 border-slate-800 hover:border-slate-600'}`}
              >
                <Zap size={12} /> XP
                {sortBy === 'xp' && <ArrowUpDown size={10} className={sortOrder === 'asc' ? '' : 'rotate-180'} />}
              </button>
              <button 
                onClick={() => handleSort('difficulty')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech border transition-all ${sortBy === 'difficulty' ? 'text-emerald-400 border-emerald-800 bg-emerald-950/30' : 'text-slate-500 border-slate-800 hover:border-slate-600'}`}
              >
                <BarChart3 size={12} /> DIFF
                {sortBy === 'difficulty' && <ArrowUpDown size={10} className={sortOrder === 'asc' ? '' : 'rotate-180'} />}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {missions.length === 0 && !loading && (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-lg">
                <Activity className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-mono">NO ACTIVE MISSIONS</p>
                <p className="text-slate-600 text-sm mt-2">Input your objectives to initialize protocols.</p>
              </div>
            )}

            {loading && (
               <div className="space-y-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="h-24 bg-slate-900/50 rounded animate-pulse border border-slate-800"></div>
                 ))}
               </div>
            )}

            {sortedMissions.map(mission => (
              <MissionCard 
                key={mission.id} 
                mission={mission} 
                onComplete={initiateDebrief} 
              />
            ))}
          </div>
        </div>
      </main>

      <MissionDebriefModal 
        isOpen={!!debriefMissionId}
        onClose={() => setDebriefMissionId(null)}
        onConfirm={finalizeDebrief}
      />

      {/* Donation Button */}
      <a
        href="https://buymeacoffee.com/lakshay_pareek2025"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded-full backdrop-blur-md transition-all hover:scale-105 group shadow-[0_0_15px_rgba(234,179,8,0.2)]"
      >
        <Coffee size={20} className="group-hover:-rotate-12 transition-transform" />
        <span className="font-mono-tech text-sm font-bold tracking-wide">PLEASE DONATE</span>
      </a>

      {/* Decorative background elements */}
      <div className="fixed top-20 left-0 w-full h-1 bg-cyan-500/10 blur-sm pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-900/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default App;