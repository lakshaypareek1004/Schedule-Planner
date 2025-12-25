export enum MissionType {
  INTELLECT = 'INTELLECT', // Study, Reading
  PHYSICAL = 'PHYSICAL',   // Gym, Sports
  GADGETS = 'GADGETS',     // Coding, Lab work
  RESTORE = 'RESTORE'      // Sleep, Breaks
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  startTime: string; // HH:MM format
  durationMinutes: number;
  type: MissionType;
  xpReward: number;
  isCompleted: boolean;
  difficulty: 'ROOKIE' | 'VIGILANTE' | 'KNIGHT';
}

export interface UserProfile {
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  stats: {
    intellect: number;
    strength: number;
    tech: number;
    willpower: number;
  };
  streak: number;
}

export const INITIAL_PROFILE: UserProfile = {
  name: "Initiate",
  level: 1,
  currentXp: 0,
  xpToNextLevel: 500,
  stats: {
    intellect: 10,
    strength: 10,
    tech: 10,
    willpower: 10
  },
  streak: 0
};