import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  level: number;
  xp: number;
  coins: number;
  achievements: Achievement[];
  dailyStreak: number;
  lastLoginDate: string;
  inventory: InventoryItem[];
  currentQuests: Quest[];
  completedQuests: string[];
  badges: string[];
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  completeQuest: (questId: string) => void;
  updateDailyStreak: () => void;
  addAchievement: (achievement: Achievement) => void;
  addBadge: (badge: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  type: 'theme' | 'avatar' | 'powerup';
  description: string;
  equipped: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: {
    xp: number;
    coins: number;
  };
  progress: number;
  target: number;
  type: 'daily' | 'weekly' | 'achievement';
  completed: boolean;
}

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      coins: 0,
      achievements: [],
      dailyStreak: 0,
      lastLoginDate: new Date().toISOString(),
      inventory: [],
      currentQuests: [
        {
          id: 'daily-study',
          title: 'Daily Scholar',
          description: 'Complete 3 study sessions today',
          reward: { xp: 100, coins: 50 },
          progress: 0,
          target: 3,
          type: 'daily',
          completed: false
        },
        {
          id: 'weekly-test',
          title: 'Test Master',
          description: 'Score 80% or higher on 3 tests this week',
          reward: { xp: 500, coins: 200 },
          progress: 0,
          target: 3,
          type: 'weekly',
          completed: false
        }
      ],
      completedQuests: [],
      badges: [],

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = calculateLevel(newXP);
          
          // Level up notification could be handled here
          if (newLevel > state.level) {
            // You could emit an event or handle level up rewards here
          }

          return {
            xp: newXP,
            level: newLevel
          };
        });
      },

      addCoins: (amount: number) => {
        set((state) => ({
          coins: state.coins + amount
        }));
      },

      completeQuest: (questId: string) => {
        set((state) => {
          const quest = state.currentQuests.find(q => q.id === questId);
          if (!quest || quest.completed) return state;

          return {
            currentQuests: state.currentQuests.map(q => 
              q.id === questId ? { ...q, completed: true } : q
            ),
            completedQuests: [...state.completedQuests, questId],
            xp: state.xp + quest.reward.xp,
            coins: state.coins + quest.reward.coins
          };
        });
      },

      updateDailyStreak: () => {
        set((state) => {
          const today = new Date();
          const lastLogin = new Date(state.lastLoginDate);
          const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

          let newStreak = state.dailyStreak;
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 0;
          }

          return {
            dailyStreak: newStreak,
            lastLoginDate: today.toISOString()
          };
        });
      },

      addAchievement: (achievement: Achievement) => {
        set((state) => ({
          achievements: [...state.achievements, achievement]
        }));
      },

      addBadge: (badge: string) => {
        set((state) => ({
          badges: [...state.badges, badge]
        }));
      }
    }),
    {
      name: 'game-storage'
    }
  )
);