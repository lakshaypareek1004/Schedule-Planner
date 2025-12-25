import { MissionType } from "./types";

export const BAT_COLORS = {
  primary: '#fbbf24', // Amber 400 (Bat Signal Yellow)
  secondary: '#0ea5e9', // Sky 500 (Hologram Blue)
  dark: '#020617', // Slate 950
  panel: '#0f172a', // Slate 900
  success: '#10b981', // Emerald 500
  danger: '#ef4444', // Red 500
};

export const RANKS = [
  "Gotham Citizen",
  "GCPD Rookie",
  "Detective",
  "Vigilante",
  "Caped Crusader",
  "Dark Knight",
  "Legend"
];

export const MOCK_MISSIONS = [
  {
    id: '1',
    title: 'Analyze Algebra Patterns',
    description: 'Solve 10 quadratic equations. Precision is key.',
    startTime: '09:00',
    durationMinutes: 60,
    type: MissionType.INTELLECT,
    xpReward: 50,
    isCompleted: false,
    difficulty: 'ROOKIE'
  },
  {
    id: '2',
    title: 'Physical Conditioning',
    description: '30 minutes cardio. Prepare for the chase.',
    startTime: '16:00',
    durationMinutes: 30,
    type: MissionType.PHYSICAL,
    xpReward: 40,
    isCompleted: false,
    difficulty: 'VIGILANTE'
  }
];