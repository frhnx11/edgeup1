import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Zap,
  Flame,
  Star,
  Award,
  TrendingUp,
  Target,
  Medal,
  Crown,
  Sparkles,
  ChevronRight,
  Lock,
  Check
} from 'lucide-react';
import GamificationService, { type Achievement, type UserStats, type DailyChallenge } from '../../../services/gamificationService';

interface GamificationWidgetProps {
  compact?: boolean;
  showAchievements?: boolean;
  showChallenges?: boolean;
  showLeaderboard?: boolean;
}

export function GamificationWidget({
  compact = false,
  showAchievements = true,
  showChallenges = true,
  showLeaderboard = false
}: GamificationWidgetProps) {
  const gamification = GamificationService.getInstance();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'achievements' | 'challenges'>('stats');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUserStats(gamification.getUserStats());
    setAchievements(gamification.getAchievements());
    setDailyChallenges(gamification.getDailyChallenges());
  };

  if (!userStats) return null;

  const recentAchievements = achievements.filter(a => a.unlocked).slice(-3);
  const progressPercentage = (userStats.currentLevelXP / userStats.nextLevelXP) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  if (compact) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Level & XP Progress */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">{userStats.level}</span>
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-3 h-3 text-yellow-900" />
              </motion.div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{userStats.rank}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Level {userStats.level}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-brand-primary dark:text-brand-secondary">{userStats.totalXP.toLocaleString()} XP</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {userStats.currentLevelXP}/{userStats.nextLevelXP}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{userStats.studyStreak}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>

          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-blue-500" />
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{userStats.achievementsUnlocked}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Achievements</p>
          </div>

          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{userStats.testsCompleted}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tests</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Your Progress</h2>
            <p className="text-white/80 text-sm">Keep up the great work!</p>
          </div>
          <motion.div
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Level Display */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{userStats.level}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-yellow-400 rounded-full shadow-lg">
              <Crown className="w-4 h-4 text-yellow-900 inline mr-1" />
              <span className="text-xs font-bold text-yellow-900">{userStats.rank}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Level {userStats.level}</span>
              <span className="text-white/90 text-sm">
                {userStats.currentLevelXP}/{userStats.nextLevelXP} XP
              </span>
            </div>
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-white/70 text-xs mt-1">
              {Math.round(progressPercentage)}% to next level
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['stats', 'achievements', 'challenges'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTab === tab
                  ? 'bg-white text-brand-primary'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {selectedTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<Flame className="w-6 h-6" />}
                  label="Current Streak"
                  value={`${userStats.studyStreak} days`}
                  color="orange"
                  subtext={`Best: ${userStats.longestStreak} days`}
                />
                <StatCard
                  icon={<Trophy className="w-6 h-6" />}
                  label="Achievements"
                  value={`${userStats.achievementsUnlocked}/${achievements.length}`}
                  color="yellow"
                  subtext={`${Math.round((userStats.achievementsUnlocked / achievements.length) * 100)}% unlocked`}
                />
                <StatCard
                  icon={<Target className="w-6 h-6" />}
                  label="Tests Completed"
                  value={userStats.testsCompleted.toString()}
                  color="blue"
                  subtext={`${userStats.perfectScores} perfect scores`}
                />
                <StatCard
                  icon={<Zap className="w-6 h-6" />}
                  label="Total XP"
                  value={userStats.totalXP.toLocaleString()}
                  color="purple"
                  subtext="Keep earning!"
                />
                <StatCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="Questions Answered"
                  value={userStats.questionsAnswered.toLocaleString()}
                  color="green"
                  subtext="Great progress!"
                />
                <StatCard
                  icon={<Star className="w-6 h-6" />}
                  label="Study Time"
                  value={`${Math.floor(userStats.totalStudyTime / 60)}h ${userStats.totalStudyTime % 60}m`}
                  color="pink"
                  subtext="Time well spent"
                />
                <StatCard
                  icon={<Medal className="w-6 h-6" />}
                  label="Concepts Mastered"
                  value={userStats.conceptsMastered.toString()}
                  color="indigo"
                  subtext="Keep learning!"
                />
                <StatCard
                  icon={<Award className="w-6 h-6" />}
                  label="Rank"
                  value={userStats.rank}
                  color="brand"
                  subtext={`Level ${userStats.level}`}
                />
              </div>
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? `${getRarityBg(achievement.rarity)} border-transparent`
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${getRarityColor(achievement.rarity)}`}>
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>

                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              Progress: {achievement.progress}/{achievement.target}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {Math.round((achievement.progress / achievement.target) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500"
                              style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                        <Zap className="w-4 h-4" />
                        <span>{achievement.xpReward}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{achievement.rarity}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Challenges</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Resets in {Math.floor((dailyChallenges[0]?.expiresAt - Date.now()) / (1000 * 60 * 60))}h
                  </span>
                </div>

                {dailyChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      challenge.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {challenge.description}
                        </p>
                      </div>
                      {challenge.completed && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {challenge.progress}/{challenge.target}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                          <Zap className="w-4 h-4" />
                          <span>{challenge.xpReward} XP</span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            challenge.completed
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
  subtext
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtext?: string;
}) {
  const colorClasses = {
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    brand: 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary',
  };

  return (
    <motion.div
      className={`p-4 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} transition-all hover:scale-105`}
      whileHover={{ y: -5 }}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs font-medium mb-1">{label}</p>
      {subtext && <p className="text-xs opacity-75">{subtext}</p>}
    </motion.div>
  );
}
