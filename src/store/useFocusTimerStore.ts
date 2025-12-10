import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface FocusSession {
  id: string;
  subject: string;
  duration: number; // seconds
  type: 'focus' | 'short-break' | 'long-break';
  completedAt: string;
}

export interface DailyStats {
  day: string;
  minutes: number;
}

export interface SubjectStats {
  subject: string;
  minutes: number;
  color: string;
}

interface FocusTimerState {
  sessions: FocusSession[];
  currentStreak: number;
  lastStudyDate: string | null;

  // Actions
  addSession: (session: Omit<FocusSession, 'id'>) => void;
  clearSessions: () => void;

  // Computed getters
  getTodaySessions: () => FocusSession[];
  getTodayFocusTime: () => number;
  getTodaySessionCount: () => number;
  getWeeklyStats: () => DailyStats[];
  getSubjectBreakdown: () => SubjectStats[];
  updateStreak: () => void;
}

// Subject colors for breakdown chart
const SUBJECT_COLORS: Record<string, string> = {
  'Indian Polity': '#3B82F6',
  'Indian History': '#F59E0B',
  'Geography': '#10B981',
  'Indian Economy': '#8B5CF6',
  'Environment & Ecology': '#06B6D4',
  'Science & Technology': '#EC4899',
  'Current Affairs': '#F97316',
  'Ethics': '#6366F1',
  'Essay Practice': '#14B8A6',
  'General Studies': '#64748B',
};

// Helper to get today's date string
const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper to get day name from date
const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Helper to get date string for N days ago
const getDateNDaysAgo = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString();
};

// Generate mock sessions for demo
const generateMockSessions = (): FocusSession[] => {
  const sessions: FocusSession[] = [];
  const subjects = ['Indian Polity', 'Indian History', 'Geography', 'Indian Economy', 'Current Affairs'];

  // Today's sessions (3 focus sessions)
  sessions.push({
    id: 'mock_1',
    subject: 'Indian Polity',
    duration: 25 * 60,
    type: 'focus',
    completedAt: getDateNDaysAgo(0)
  });
  sessions.push({
    id: 'mock_2',
    subject: 'Indian History',
    duration: 25 * 60,
    type: 'focus',
    completedAt: getDateNDaysAgo(0)
  });
  sessions.push({
    id: 'mock_3',
    subject: 'Indian Polity',
    duration: 25 * 60,
    type: 'focus',
    completedAt: getDateNDaysAgo(0)
  });
  sessions.push({
    id: 'mock_4',
    subject: 'Geography',
    duration: 25 * 60,
    type: 'focus',
    completedAt: getDateNDaysAgo(0)
  });
  sessions.push({
    id: 'mock_5',
    subject: 'Current Affairs',
    duration: 25 * 60,
    type: 'focus',
    completedAt: getDateNDaysAgo(0)
  });

  // Yesterday (4 sessions)
  for (let i = 0; i < 4; i++) {
    sessions.push({
      id: `mock_y_${i}`,
      subject: subjects[i % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(1)
    });
  }

  // 2 days ago (3 sessions)
  for (let i = 0; i < 3; i++) {
    sessions.push({
      id: `mock_2d_${i}`,
      subject: subjects[(i + 1) % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(2)
    });
  }

  // 3 days ago (5 sessions)
  for (let i = 0; i < 5; i++) {
    sessions.push({
      id: `mock_3d_${i}`,
      subject: subjects[i % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(3)
    });
  }

  // 4 days ago (2 sessions)
  for (let i = 0; i < 2; i++) {
    sessions.push({
      id: `mock_4d_${i}`,
      subject: subjects[(i + 2) % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(4)
    });
  }

  // 5 days ago (6 sessions)
  for (let i = 0; i < 6; i++) {
    sessions.push({
      id: `mock_5d_${i}`,
      subject: subjects[i % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(5)
    });
  }

  // 6 days ago (4 sessions)
  for (let i = 0; i < 4; i++) {
    sessions.push({
      id: `mock_6d_${i}`,
      subject: subjects[(i + 3) % subjects.length],
      duration: 25 * 60,
      type: 'focus',
      completedAt: getDateNDaysAgo(6)
    });
  }

  return sessions;
};

// Initial mock data
const INITIAL_MOCK_SESSIONS = generateMockSessions();

export const useFocusTimerStore = create<FocusTimerState>()(
  persist(
    (set, get) => ({
      sessions: INITIAL_MOCK_SESSIONS,
      currentStreak: 7,
      lastStudyDate: getTodayString(),

      addSession: (session) => {
        const newSession: FocusSession = {
          ...session,
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        // Update streak after adding session
        get().updateStreak();
      },

      clearSessions: () => {
        set({ sessions: [], currentStreak: 0, lastStudyDate: null });
      },

      getTodaySessions: () => {
        const today = getTodayString();
        return get().sessions.filter(
          (s) => s.completedAt.split('T')[0] === today
        );
      },

      getTodayFocusTime: () => {
        const todaySessions = get().getTodaySessions();
        const focusSessions = todaySessions.filter((s) => s.type === 'focus');
        return focusSessions.reduce((total, s) => total + s.duration, 0);
      },

      getTodaySessionCount: () => {
        const todaySessions = get().getTodaySessions();
        return todaySessions.filter((s) => s.type === 'focus').length;
      },

      getWeeklyStats: () => {
        const stats: DailyStats[] = [];
        const today = new Date();

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];

          const daySessions = get().sessions.filter(
            (s) =>
              s.completedAt.split('T')[0] === dateString && s.type === 'focus'
          );

          const totalMinutes = Math.round(
            daySessions.reduce((total, s) => total + s.duration, 0) / 60
          );

          stats.push({
            day: getDayName(dateString),
            minutes: totalMinutes,
          });
        }

        return stats;
      },

      getSubjectBreakdown: () => {
        const todaySessions = get().getTodaySessions();
        const focusSessions = todaySessions.filter((s) => s.type === 'focus');

        // Group by subject
        const subjectTotals: Record<string, number> = {};
        focusSessions.forEach((s) => {
          subjectTotals[s.subject] =
            (subjectTotals[s.subject] || 0) + s.duration;
        });

        // Convert to array with colors
        return Object.entries(subjectTotals)
          .map(([subject, seconds]) => ({
            subject,
            minutes: Math.round(seconds / 60),
            color: SUBJECT_COLORS[subject] || '#64748B',
          }))
          .sort((a, b) => b.minutes - a.minutes);
      },

      updateStreak: () => {
        const today = getTodayString();
        const { lastStudyDate, currentStreak, sessions } = get();

        // Check if there are focus sessions today
        const todayFocusSessions = sessions.filter(
          (s) => s.completedAt.split('T')[0] === today && s.type === 'focus'
        );

        if (todayFocusSessions.length === 0) return;

        // If first time studying or same day
        if (!lastStudyDate || lastStudyDate === today) {
          set({
            lastStudyDate: today,
            currentStreak: currentStreak || 1,
          });
          return;
        }

        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastStudyDate === yesterdayString) {
          // Consecutive day - increment streak
          set({
            lastStudyDate: today,
            currentStreak: currentStreak + 1,
          });
        } else {
          // Streak broken - reset to 1
          set({
            lastStudyDate: today,
            currentStreak: 1,
          });
        }
      },
    }),
    {
      name: 'focus-timer-storage',
    }
  )
);
