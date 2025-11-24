import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  EUstaadState,
  EUstaadAnimationState,
  UserActivity,
  DigitalUsageMetrics,
  HealthMetrics,
  MentalHealthMetrics,
  RedFlag,
  SkillGap,
  BehavioralTrait
} from '../types/eustaad';

const initialDigitalUsage: DigitalUsageMetrics = {
  totalScreenTime: 0,
  learningTime: 0,
  socialTime: 0,
  breakTime: 0,
  lastUpdated: new Date()
};

const initialHealth: HealthMetrics = {
  activityLevel: 'moderate',
  sleepQuality: 70,
  stressLevel: 30,
  wellnessScore: 75
};

const initialMentalHealth: MentalHealthMetrics = {
  moodScore: 75,
  stressLevel: 30,
  anxietyLevel: 25,
  copingEffectiveness: 70,
  recentMoods: []
};

export const useEUstaadStore = create<EUstaadState>()(
  persist(
    (set, get) => ({
      // Initial state
      animationState: 'idle',
      isVisible: false,
      consentGiven: false,

      position: { x: 0, y: 0 },

      recentActivities: [],
      totalInteractions: 0,
      navigationCount: 0,

      digitalUsage: initialDigitalUsage,
      health: initialHealth,
      mentalHealth: initialMentalHealth,

      skillGaps: [],
      behavioralTraits: [],
      redFlags: [],

      // Actions
      setAnimationState: (animationState: EUstaadAnimationState) => {
        set({ animationState });

        // Auto-reset to idle after 3 seconds (except for idle state)
        if (animationState !== 'idle') {
          setTimeout(() => {
            if (get().animationState === animationState) {
              set({ animationState: 'idle' });
            }
          }, 3000);
        }
      },

      recordActivity: (activity) => {
        const fullActivity: UserActivity = {
          ...activity,
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };

        set((state) => ({
          recentActivities: [...state.recentActivities, fullActivity].slice(-50),
          totalInteractions: state.totalInteractions + 1,
          navigationCount: activity.type === 'navigation'
            ? state.navigationCount + 1
            : state.navigationCount
        }));

        // Trigger appropriate animation
        switch (activity.type) {
          case 'navigation':
            get().setAnimationState('navigating');
            break;
          case 'click':
            get().setAnimationState('interacting');
            break;
          case 'test':
          case 'quiz':
            get().setAnimationState('analyzing');
            break;
          default:
            get().setAnimationState('analyzing');
        }

        // Update digital usage
        const now = new Date();
        set((state) => ({
          digitalUsage: {
            ...state.digitalUsage,
            totalScreenTime: state.digitalUsage.totalScreenTime + 1,
            learningTime: ['test', 'class', 'resource'].includes(activity.type)
              ? state.digitalUsage.learningTime + 1
              : state.digitalUsage.learningTime,
            lastUpdated: now
          }
        }));
      },

      giveConsent: () => {
        set({ consentGiven: true, isVisible: true });
      },

      revokeConsent: () => {
        set({ consentGiven: false, isVisible: false });
      },

      updatePosition: (position) => {
        set({ position });
      },

      updateDigitalUsage: (metrics) => {
        set((state) => ({
          digitalUsage: {
            ...state.digitalUsage,
            ...metrics,
            lastUpdated: new Date()
          }
        }));
      },

      updateHealth: (metrics) => {
        set((state) => ({
          health: {
            ...state.health,
            ...metrics
          }
        }));
      },

      updateMentalHealth: (metrics) => {
        set((state) => ({
          mentalHealth: {
            ...state.mentalHealth,
            ...metrics
          }
        }));
      },

      addRedFlag: (flag) => {
        const fullFlag: RedFlag = {
          ...flag,
          id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          detectedAt: new Date()
        };

        set((state) => ({
          redFlags: [...state.redFlags, fullFlag],
          animationState: 'concerned'
        }));

        // Reset to idle after showing concern
        setTimeout(() => {
          if (get().animationState === 'concerned') {
            set({ animationState: 'idle' });
          }
        }, 5000);
      },

      removeRedFlag: (id) => {
        set((state) => ({
          redFlags: state.redFlags.filter(flag => flag.id !== id)
        }));
      },

      updateSkillGaps: (gaps) => {
        set({ skillGaps: gaps });
      }
    }),
    {
      name: 'eustaad-storage',
      partialize: (state) => ({
        consentGiven: state.consentGiven,
        isVisible: state.isVisible,
        position: state.position,
        totalInteractions: state.totalInteractions,
        navigationCount: state.navigationCount,
        digitalUsage: state.digitalUsage,
        health: state.health,
        mentalHealth: state.mentalHealth,
        skillGaps: state.skillGaps,
        behavioralTraits: state.behavioralTraits,
        redFlags: state.redFlags,
        recentActivities: state.recentActivities.slice(-20)
      })
    }
  )
);
