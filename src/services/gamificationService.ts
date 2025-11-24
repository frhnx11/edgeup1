/**
 * Gamification Service
 * Manages achievements, streaks, XP, levels, and rewards
 */

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'social' | 'milestone' | 'special';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  studyStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyTime: number; // in minutes
  testsCompleted: number;
  questionsAnswered: number;
  perfectScores: number;
  conceptsMastered: number;
  achievementsUnlocked: number;
  rank: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  expiresAt: number;
}

interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: Array<{
    rank: number;
    userId: string;
    userName: string;
    xp: number;
    level: number;
    avatar?: string;
  }>;
}

class GamificationService {
  private static instance: GamificationService;
  private userStats: UserStats | null = null;
  private achievements: Achievement[] = [];
  private userId: string = '';

  // XP required for each level (exponential growth)
  private readonly LEVEL_XP_MULTIPLIER = 100;
  private readonly LEVEL_XP_EXPONENT = 1.5;

  private constructor() {
    this.initializeAchievements();
    this.loadUserStats();
  }

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  /**
   * Initialize all available achievements
   */
  private initializeAchievements(): void {
    this.achievements = [
      // Study Achievements
      {
        id: 'first_study',
        title: 'First Steps',
        description: 'Complete your first study session',
        icon: '🎓',
        category: 'study',
        xpReward: 50,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'common'
      },
      {
        id: 'study_streak_3',
        title: 'Getting Started',
        description: 'Maintain a 3-day study streak',
        icon: '🔥',
        category: 'study',
        xpReward: 100,
        unlocked: false,
        progress: 0,
        target: 3,
        rarity: 'common'
      },
      {
        id: 'study_streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        icon: '⚡',
        category: 'study',
        xpReward: 250,
        unlocked: false,
        progress: 0,
        target: 7,
        rarity: 'rare'
      },
      {
        id: 'study_streak_30',
        title: 'Month Master',
        description: 'Maintain a 30-day study streak',
        icon: '👑',
        category: 'study',
        xpReward: 1000,
        unlocked: false,
        progress: 0,
        target: 30,
        rarity: 'epic'
      },
      {
        id: 'study_streak_100',
        title: 'Century Champion',
        description: 'Maintain a 100-day study streak',
        icon: '🏆',
        category: 'study',
        xpReward: 5000,
        unlocked: false,
        progress: 0,
        target: 100,
        rarity: 'legendary'
      },

      // Test Achievements
      {
        id: 'first_test',
        title: 'Test Taker',
        description: 'Complete your first test',
        icon: '📝',
        category: 'milestone',
        xpReward: 50,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'common'
      },
      {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Get 100% on a test',
        icon: '⭐',
        category: 'milestone',
        xpReward: 200,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'rare'
      },
      {
        id: 'tests_10',
        title: 'Test Expert',
        description: 'Complete 10 tests',
        icon: '📚',
        category: 'milestone',
        xpReward: 300,
        unlocked: false,
        progress: 0,
        target: 10,
        rarity: 'rare'
      },
      {
        id: 'tests_50',
        title: 'Test Master',
        description: 'Complete 50 tests',
        icon: '🎯',
        category: 'milestone',
        xpReward: 1500,
        unlocked: false,
        progress: 0,
        target: 50,
        rarity: 'epic'
      },

      // Knowledge Achievements
      {
        id: 'questions_100',
        title: 'Question Solver',
        description: 'Answer 100 questions correctly',
        icon: '💡',
        category: 'milestone',
        xpReward: 200,
        unlocked: false,
        progress: 0,
        target: 100,
        rarity: 'common'
      },
      {
        id: 'questions_500',
        title: 'Knowledge Seeker',
        description: 'Answer 500 questions correctly',
        icon: '🧠',
        category: 'milestone',
        xpReward: 800,
        unlocked: false,
        progress: 0,
        target: 500,
        rarity: 'rare'
      },
      {
        id: 'concepts_mastered_10',
        title: 'Concept Master',
        description: 'Master 10 different concepts',
        icon: '🎓',
        category: 'milestone',
        xpReward: 500,
        unlocked: false,
        progress: 0,
        target: 10,
        rarity: 'rare'
      },

      // Time Achievements
      {
        id: 'study_time_10h',
        title: 'Dedicated Learner',
        description: 'Study for 10 hours total',
        icon: '⏰',
        category: 'milestone',
        xpReward: 300,
        unlocked: false,
        progress: 0,
        target: 600, // 10 hours in minutes
        rarity: 'common'
      },
      {
        id: 'study_time_50h',
        title: 'Serious Student',
        description: 'Study for 50 hours total',
        icon: '⌛',
        category: 'milestone',
        xpReward: 1000,
        unlocked: false,
        progress: 0,
        target: 3000, // 50 hours in minutes
        rarity: 'rare'
      },
      {
        id: 'study_time_100h',
        title: 'Study Champion',
        description: 'Study for 100 hours total',
        icon: '🏅',
        category: 'milestone',
        xpReward: 2500,
        unlocked: false,
        progress: 0,
        target: 6000, // 100 hours in minutes
        rarity: 'epic'
      },

      // Special Achievements
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Study before 7 AM',
        icon: '🌅',
        category: 'special',
        xpReward: 150,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'rare'
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Study after 11 PM',
        icon: '🦉',
        category: 'special',
        xpReward: 150,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'rare'
      },
      {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Study on both Saturday and Sunday',
        icon: '🎖️',
        category: 'special',
        xpReward: 200,
        unlocked: false,
        progress: 0,
        target: 1,
        rarity: 'rare'
      },
      {
        id: 'ai_chat_pro',
        title: 'AI Chat Pro',
        description: 'Have 50 conversations with AI assistant',
        icon: '🤖',
        category: 'social',
        xpReward: 400,
        unlocked: false,
        progress: 0,
        target: 50,
        rarity: 'rare'
      }
    ];
  }

  /**
   * Load user stats from localStorage
   */
  private loadUserStats(): void {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userId = userData.id || 'guest';

    const stored = localStorage.getItem(`gamification_${this.userId}`);
    if (stored) {
      const data = JSON.parse(stored);
      this.userStats = data.stats;

      // Load achievement progress
      if (data.achievements) {
        this.achievements = this.achievements.map(achievement => {
          const saved = data.achievements.find((a: Achievement) => a.id === achievement.id);
          return saved || achievement;
        });
      }
    } else {
      this.userStats = {
        totalXP: 0,
        level: 1,
        currentLevelXP: 0,
        nextLevelXP: this.calculateXPForLevel(2),
        studyStreak: 0,
        longestStreak: 0,
        lastStudyDate: '',
        totalStudyTime: 0,
        testsCompleted: 0,
        questionsAnswered: 0,
        perfectScores: 0,
        conceptsMastered: 0,
        achievementsUnlocked: 0,
        rank: 'Novice'
      };
    }

    this.updateStreak();
  }

  /**
   * Save user stats to localStorage
   */
  private saveUserStats(): void {
    localStorage.setItem(`gamification_${this.userId}`, JSON.stringify({
      stats: this.userStats,
      achievements: this.achievements
    }));
  }

  /**
   * Calculate XP required for a specific level
   */
  private calculateXPForLevel(level: number): number {
    return Math.floor(this.LEVEL_XP_MULTIPLIER * Math.pow(level, this.LEVEL_XP_EXPONENT));
  }

  /**
   * Update study streak based on last study date
   */
  private updateStreak(): void {
    if (!this.userStats) return;

    const today = new Date().toDateString();
    const lastStudy = this.userStats.lastStudyDate;

    if (!lastStudy) {
      this.userStats.studyStreak = 0;
    } else {
      const lastDate = new Date(lastStudy);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        // Continue streak (will be incremented when recordStudySession is called)
      } else {
        // Streak broken
        this.userStats.studyStreak = 0;
      }
    }
  }

  /**
   * Add XP and handle level ups
   */
  addXP(amount: number, reason: string = 'Study activity'): { leveledUp: boolean; newLevel?: number; xpGained: number } {
    if (!this.userStats) return { leveledUp: false, xpGained: 0 };

    this.userStats.totalXP += amount;
    this.userStats.currentLevelXP += amount;

    let leveledUp = false;
    let newLevel = this.userStats.level;

    // Check for level up
    while (this.userStats.currentLevelXP >= this.userStats.nextLevelXP) {
      this.userStats.currentLevelXP -= this.userStats.nextLevelXP;
      this.userStats.level++;
      newLevel = this.userStats.level;
      this.userStats.nextLevelXP = this.calculateXPForLevel(this.userStats.level + 1);
      this.userStats.rank = this.calculateRank(this.userStats.level);
      leveledUp = true;
    }

    this.saveUserStats();

    return {
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
      xpGained: amount
    };
  }

  /**
   * Calculate rank based on level
   */
  private calculateRank(level: number): string {
    if (level >= 100) return 'Legend';
    if (level >= 75) return 'Grandmaster';
    if (level >= 50) return 'Master';
    if (level >= 30) return 'Expert';
    if (level >= 20) return 'Advanced';
    if (level >= 10) return 'Intermediate';
    if (level >= 5) return 'Apprentice';
    return 'Novice';
  }

  /**
   * Record a study session
   */
  recordStudySession(durationMinutes: number): { streakContinued: boolean; newStreak?: number; xpGained: number } {
    if (!this.userStats) return { streakContinued: false, xpGained: 0 };

    const today = new Date().toDateString();
    let streakContinued = false;
    let newStreak = this.userStats.studyStreak;

    // Update streak
    if (this.userStats.lastStudyDate !== today) {
      const lastDate = this.userStats.lastStudyDate ? new Date(this.userStats.lastStudyDate) : null;
      const todayDate = new Date(today);

      if (lastDate) {
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continue streak
          this.userStats.studyStreak++;
          streakContinued = true;
          newStreak = this.userStats.studyStreak;

          if (this.userStats.studyStreak > this.userStats.longestStreak) {
            this.userStats.longestStreak = this.userStats.studyStreak;
          }
        } else if (diffDays > 1) {
          // Streak broken
          this.userStats.studyStreak = 1;
          newStreak = 1;
        }
      } else {
        this.userStats.studyStreak = 1;
        newStreak = 1;
      }

      this.userStats.lastStudyDate = today;
    }

    // Add study time
    this.userStats.totalStudyTime += durationMinutes;

    // Award XP for session
    const baseXP = Math.floor(durationMinutes * 2); // 2 XP per minute
    const streakBonus = this.userStats.studyStreak * 5; // 5 XP per streak day
    const totalXP = baseXP + streakBonus;

    const result = this.addXP(totalXP, 'Study session');

    // Check achievements
    this.checkAchievements();

    this.saveUserStats();

    return {
      streakContinued,
      newStreak: streakContinued ? newStreak : undefined,
      xpGained: result.xpGained
    };
  }

  /**
   * Record a completed test
   */
  recordTestCompleted(score: number, totalQuestions: number): { xpGained: number; achievementsUnlocked: string[] } {
    if (!this.userStats) return { xpGained: 0, achievementsUnlocked: [] };

    this.userStats.testsCompleted++;
    this.userStats.questionsAnswered += totalQuestions;

    // Check for perfect score
    if (score === 100) {
      this.userStats.perfectScores++;
    }

    // Award XP based on score
    const baseXP = Math.floor(score * 2); // 2 XP per percentage point
    const perfectBonus = score === 100 ? 100 : 0;
    const totalXP = baseXP + perfectBonus;

    const result = this.addXP(totalXP, `Test completed (${score}%)`);

    // Check achievements
    const unlockedAchievements = this.checkAchievements();

    this.saveUserStats();

    return {
      xpGained: result.xpGained,
      achievementsUnlocked: unlockedAchievements.map(a => a.title)
    };
  }

  /**
   * Check and unlock achievements
   */
  private checkAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      // Check conditions based on achievement type
      switch (achievement.id) {
        case 'first_study':
          shouldUnlock = this.userStats!.totalStudyTime > 0;
          achievement.progress = Math.min(this.userStats!.totalStudyTime, achievement.target);
          break;

        case 'study_streak_3':
        case 'study_streak_7':
        case 'study_streak_30':
        case 'study_streak_100':
          shouldUnlock = this.userStats!.studyStreak >= achievement.target;
          achievement.progress = this.userStats!.studyStreak;
          break;

        case 'first_test':
        case 'tests_10':
        case 'tests_50':
          shouldUnlock = this.userStats!.testsCompleted >= achievement.target;
          achievement.progress = this.userStats!.testsCompleted;
          break;

        case 'perfect_score':
          shouldUnlock = this.userStats!.perfectScores >= achievement.target;
          achievement.progress = this.userStats!.perfectScores;
          break;

        case 'questions_100':
        case 'questions_500':
          shouldUnlock = this.userStats!.questionsAnswered >= achievement.target;
          achievement.progress = this.userStats!.questionsAnswered;
          break;

        case 'concepts_mastered_10':
          shouldUnlock = this.userStats!.conceptsMastered >= achievement.target;
          achievement.progress = this.userStats!.conceptsMastered;
          break;

        case 'study_time_10h':
        case 'study_time_50h':
        case 'study_time_100h':
          shouldUnlock = this.userStats!.totalStudyTime >= achievement.target;
          achievement.progress = this.userStats!.totalStudyTime;
          break;

        case 'early_bird':
          const hour = new Date().getHours();
          if (hour < 7 && this.userStats!.totalStudyTime > 0) {
            achievement.progress = 1;
            shouldUnlock = true;
          }
          break;

        case 'night_owl':
          const nightHour = new Date().getHours();
          if (nightHour >= 23 && this.userStats!.totalStudyTime > 0) {
            achievement.progress = 1;
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        this.userStats!.achievementsUnlocked++;
        this.addXP(achievement.xpReward, `Achievement: ${achievement.title}`);
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  }

  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Get user stats
   */
  getUserStats(): UserStats | null {
    return this.userStats;
  }

  /**
   * Get daily challenges
   */
  getDailyChallenges(): DailyChallenge[] {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return [
      {
        id: 'daily_study',
        title: 'Daily Study',
        description: 'Study for 30 minutes today',
        xpReward: 50,
        progress: Math.min(this.userStats?.totalStudyTime || 0, 30),
        target: 30,
        completed: (this.userStats?.totalStudyTime || 0) >= 30,
        expiresAt: endOfDay.getTime()
      },
      {
        id: 'daily_test',
        title: 'Daily Test',
        description: 'Complete 1 test today',
        xpReward: 75,
        progress: this.userStats?.testsCompleted || 0,
        target: 1,
        completed: (this.userStats?.testsCompleted || 0) >= 1,
        expiresAt: endOfDay.getTime()
      },
      {
        id: 'daily_questions',
        title: 'Question Master',
        description: 'Answer 20 questions correctly today',
        xpReward: 100,
        progress: Math.min(this.userStats?.questionsAnswered || 0, 20),
        target: 20,
        completed: (this.userStats?.questionsAnswered || 0) >= 20,
        expiresAt: endOfDay.getTime()
      }
    ];
  }

  /**
   * Get mock leaderboard data (replace with API call in production)
   */
  getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly'): Leaderboard {
    // Mock data - replace with actual API call
    return {
      period,
      entries: [
        { rank: 1, userId: 'user1', userName: 'Arjun Kumar', xp: 15240, level: 42 },
        { rank: 2, userId: 'user2', userName: 'Priya Sharma', xp: 14890, level: 40 },
        { rank: 3, userId: 'user3', userName: 'Rahul Verma', xp: 13200, level: 38 },
        { rank: 4, userId: 'user4', userName: 'Sneha Patel', xp: 12500, level: 36 },
        { rank: 5, userId: 'user5', userName: 'Amit Singh', xp: 11800, level: 34 },
        { rank: 6, userId: this.userId, userName: 'You', xp: this.userStats?.totalXP || 0, level: this.userStats?.level || 1 }
      ]
    };
  }

  /**
   * Reset all data (for testing)
   */
  reset(): void {
    localStorage.removeItem(`gamification_${this.userId}`);
    this.loadUserStats();
  }
}

export default GamificationService;
export type { Achievement, UserStats, DailyChallenge, Leaderboard };
