import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// PASCO Dimensions with levels 0-10
export interface PASCOMetrics {
  P: number; // Personality
  A: number; // Aptitude
  S: number; // Skills
  C: number; // Cognitive
  O: number; // Overall Wellness
}

export type ActivityType =
  | 'test_completed'
  | 'class_attended'
  | 'resource_accessed'
  | 'practice_session'
  | 'assignment_completed'
  | 'quiz_passed'
  | 'idle_detected';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  timestamp: Date;
  impact: {
    P?: number;
    A?: number;
    S?: number;
    C?: number;
    O?: number;
  };
  metadata?: Record<string, any>;
}

export type AnimationState =
  | 'idle'           // Normal monitoring
  | 'analyzing'      // Processing activity
  | 'positive'       // Metrics improved
  | 'negative'       // Metrics declined
  | 'celebration';   // Major achievement

interface PASCOState {
  // Core metrics
  metrics: PASCOMetrics;

  // Profile initialization
  isInitialized: boolean;
  baselineProfile: PASCOMetrics | null;

  // Activity tracking
  activityLog: ActivityLog[];
  lastActivityTime: Date;

  // Animation state
  animationState: AnimationState;
  recentChanges: {
    dimension: keyof PASCOMetrics;
    oldValue: number;
    newValue: number;
    timestamp: Date;
  }[];

  // Statistics
  totalActivities: number;
  consecutiveDays: number;
  lastLoginDate: string;

  // Actions
  initializeFromProfile: (profile: any) => void;
  updateMetric: (dimension: keyof PASCOMetrics, change: number) => void;
  recordActivity: (type: ActivityType, impact: Partial<PASCOMetrics>, metadata?: Record<string, any>) => void;
  setAnimationState: (state: AnimationState) => void;
  applyInactivityPenalty: () => void;
  resetDailyMetrics: () => void;

  // Getters
  getPASCOString: () => string;
  getOverallScore: () => number;
  getTrendDirection: (dimension: keyof PASCOMetrics) => 'up' | 'down' | 'stable';
}

// Helper to clamp values between 0-10
const clamp = (value: number, min = 0, max = 10): number => {
  return Math.max(min, Math.min(max, value));
};

// Calculate initial metrics from PASCO profile
const calculateMetricsFromProfile = (profile: any): PASCOMetrics => {
  if (!profile) {
    return { P: 5, A: 5, S: 5, C: 5, O: 5 }; // Default baseline
  }

  return {
    // Personality: Based on grit, VARK alignment, and emotional regulation
    P: Math.round((profile.personality?.grit?.overall || 50) / 10),

    // Aptitude: Based on cognitive scores and recommended fields alignment
    A: Math.round(
      ((profile.cognitive?.overallIQ || 100) - 70) / 6 // IQ 70-130 maps to 0-10
    ),

    // Skills: Based on study skills and foundational abilities
    S: Math.round(
      (profile.skills?.studySkills?.timeManagement || 50) / 10
    ),

    // Cognitive: Based on fluid/crystallized IQ and processing speed
    C: Math.round(
      ((profile.cognitive?.fluidIQ || 100) - 70) / 6
    ),

    // Overall wellness: Based on psychological wellness indicators
    O: Math.round(
      (profile.psychological?.overallWellness || 50) / 10
    )
  };
};

export const usePASCOStore = create<PASCOState>()(
  persist(
    (set, get) => ({
      // Initial state
      metrics: { P: 5, A: 5, S: 5, C: 5, O: 5 },
      isInitialized: false,
      baselineProfile: null,
      activityLog: [],
      lastActivityTime: new Date(),
      animationState: 'idle',
      recentChanges: [],
      totalActivities: 0,
      consecutiveDays: 0,
      lastLoginDate: new Date().toISOString(),

      // Initialize from PASCO test results
      initializeFromProfile: (profile) => {
        const metrics = calculateMetricsFromProfile(profile);
        set({
          metrics,
          baselineProfile: metrics,
          isInitialized: true,
          lastActivityTime: new Date()
        });
      },

      // Update a specific metric
      updateMetric: (dimension, change) => {
        set((state) => {
          const oldValue = state.metrics[dimension];
          const newValue = clamp(oldValue + change);

          // Only record if there's an actual change
          if (oldValue === newValue) return state;

          const recentChanges = [
            ...state.recentChanges,
            { dimension, oldValue, newValue, timestamp: new Date() }
          ].slice(-5); // Keep last 5 changes

          return {
            metrics: {
              ...state.metrics,
              [dimension]: newValue
            },
            recentChanges,
            animationState: change > 0 ? 'positive' : 'negative',
            lastActivityTime: new Date()
          };
        });

        // Reset animation state after 3 seconds
        setTimeout(() => {
          set({ animationState: 'idle' });
        }, 3000);
      },

      // Record an activity with its impact
      recordActivity: (type, impact, metadata) => {
        set((state) => {
          const activity: ActivityLog = {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            timestamp: new Date(),
            impact,
            metadata
          };

          // Apply the impact to metrics
          const newMetrics = { ...state.metrics };
          const recentChanges = [...state.recentChanges];

          Object.entries(impact).forEach(([dimension, change]) => {
            if (change !== undefined && change !== 0) {
              const dim = dimension as keyof PASCOMetrics;
              const oldValue = newMetrics[dim];
              const newValue = clamp(oldValue + change);

              if (oldValue !== newValue) {
                newMetrics[dim] = newValue;
                recentChanges.push({
                  dimension: dim,
                  oldValue,
                  newValue,
                  timestamp: new Date()
                });
              }
            }
          });

          // Determine animation state based on overall impact
          const totalImpact = Object.values(impact).reduce((sum, val) => sum + (val || 0), 0);
          let animationState: AnimationState = 'analyzing';

          if (totalImpact > 0.5) {
            animationState = totalImpact > 1 ? 'celebration' : 'positive';
          } else if (totalImpact < -0.5) {
            animationState = 'negative';
          }

          return {
            metrics: newMetrics,
            activityLog: [...state.activityLog, activity].slice(-50), // Keep last 50 activities
            recentChanges: recentChanges.slice(-5),
            totalActivities: state.totalActivities + 1,
            lastActivityTime: new Date(),
            animationState
          };
        });

        // Reset animation state after delay
        setTimeout(() => {
          set({ animationState: 'idle' });
        }, 3000);
      },

      // Set animation state manually
      setAnimationState: (animationState) => {
        set({ animationState });
      },

      // Apply penalty for inactivity
      applyInactivityPenalty: () => {
        const now = new Date();
        const lastActivity = get().lastActivityTime;
        // Handle both Date objects and string dates from localStorage
        const lastActivityDate = lastActivity instanceof Date ? lastActivity : new Date(lastActivity);
        const hoursSinceActivity = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);

        // Apply small penalty if inactive for more than 24 hours
        if (hoursSinceActivity > 24) {
          const penalty = Math.min(0.5, hoursSinceActivity / 48); // Max 0.5 penalty

          set((state) => ({
            metrics: {
              P: clamp(state.metrics.P - penalty * 0.3),
              A: clamp(state.metrics.A - penalty * 0.2),
              S: clamp(state.metrics.S - penalty * 0.4),
              C: clamp(state.metrics.C - penalty * 0.2),
              O: clamp(state.metrics.O - penalty * 0.5)
            },
            animationState: 'negative'
          }));

          setTimeout(() => {
            set({ animationState: 'idle' });
          }, 3000);
        }
      },

      // Reset daily metrics (for new day)
      resetDailyMetrics: () => {
        const today = new Date();
        const lastLoginDate = get().lastLoginDate;
        // Handle both Date strings and ISO strings from localStorage
        const lastLogin = new Date(lastLoginDate);
        const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          set((state) => ({
            consecutiveDays: state.consecutiveDays + 1,
            lastLoginDate: today.toISOString()
          }));
        } else if (diffDays > 1) {
          set({
            consecutiveDays: 0,
            lastLoginDate: today.toISOString()
          });
        }
      },

      // Get PASCO string representation
      getPASCOString: () => {
        const { metrics } = get();
        return `P${Math.round(metrics.P)}A${Math.round(metrics.A)}S${Math.round(metrics.S)}C${Math.round(metrics.C)}O${Math.round(metrics.O)}`;
      },

      // Get overall score (average)
      getOverallScore: () => {
        const { metrics } = get();
        return (metrics.P + metrics.A + metrics.S + metrics.C + metrics.O) / 5;
      },

      // Get trend direction for a dimension
      getTrendDirection: (dimension) => {
        const changes = get().recentChanges
          .filter(c => c.dimension === dimension)
          .slice(-3);

        if (changes.length === 0) return 'stable';

        const avgChange = changes.reduce((sum, c) => sum + (c.newValue - c.oldValue), 0) / changes.length;

        if (avgChange > 0.1) return 'up';
        if (avgChange < -0.1) return 'down';
        return 'stable';
      }
    }),
    {
      name: 'pasco-storage',
      partialize: (state) => ({
        metrics: state.metrics,
        isInitialized: state.isInitialized,
        baselineProfile: state.baselineProfile,
        activityLog: state.activityLog.slice(-20), // Only persist last 20 activities
        totalActivities: state.totalActivities,
        consecutiveDays: state.consecutiveDays,
        lastLoginDate: state.lastLoginDate,
        lastActivityTime: state.lastActivityTime
      }),
      // Handle Date deserialization when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert lastActivityTime back to Date if it's a string
          if (state.lastActivityTime && typeof state.lastActivityTime === 'string') {
            state.lastActivityTime = new Date(state.lastActivityTime);
          }
          // Ensure lastActivityTime exists
          if (!state.lastActivityTime) {
            state.lastActivityTime = new Date();
          }
        }
      }
    }
  )
);
