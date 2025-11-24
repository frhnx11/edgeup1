import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Medal, Crown, TrendingUp, MapPin } from 'lucide-react';
import { GlassCard } from '../../../../components/upsc/common/premium/GlassCard';
import { AnimatedNumber } from '../../../../components/upsc/common/premium/AnimatedNumber';

const LeaderboardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'national' | 'state' | 'city'>('national');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');

  // Mock leaderboard data
  const leaderboardData = {
    national: [
      { rank: 1, name: 'Raj Kumar', score: 9245, tests: 120, accuracy: 94, avatar: '🏆' },
      { rank: 2, name: 'Priya Sharma', score: 9180, tests: 115, accuracy: 93, avatar: '🥈' },
      { rank: 3, name: 'Amit Patel', score: 9050, tests: 110, accuracy: 92, avatar: '🥉' },
      { rank: 4, name: 'Sneha Reddy', score: 8920, tests: 105, accuracy: 91, avatar: '⭐' },
      { rank: 5, name: 'Vikram Singh', score: 8850, tests: 108, accuracy: 90, avatar: '⭐' },
      { rank: 12, name: 'You', score: 7850, tests: 45, accuracy: 76, avatar: '👤', isCurrentUser: true },
    ],
    state: [
      { rank: 1, name: 'Ananya Iyer', score: 8920, tests: 115, accuracy: 93, avatar: '🏆' },
      { rank: 2, name: 'Karthik Menon', score: 8750, tests: 110, accuracy: 92, avatar: '🥈' },
      { rank: 3, name: 'Divya Krishna', score: 8650, tests: 105, accuracy: 91, avatar: '🥉' },
      { rank: 5, name: 'You', score: 7850, tests: 45, accuracy: 76, avatar: '👤', isCurrentUser: true },
    ],
    city: [
      { rank: 1, name: 'Rohan Joshi', score: 8450, tests: 100, accuracy: 90, avatar: '🏆' },
      { rank: 2, name: 'You', score: 7850, tests: 45, accuracy: 76, avatar: '👤', isCurrentUser: true },
      { rank: 3, name: 'Sakshi Verma', score: 7720, tests: 88, accuracy: 89, avatar: '🥉' },
    ]
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <Trophy className="w-5 h-5 text-brand-primary" />;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-8 h-8 text-brand-primary" />
          </motion.div>
          Competitive Leaderboard
        </h1>
        <p className="text-gray-600 mt-2">See how you stack up against other aspirants</p>
      </motion.div>

      {/* Current Rank Card */}
      <motion.div
        className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-xl p-6 shadow-2xl mb-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(9, 77, 136, 0.5)' }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-lg font-semibold mb-1">Your Current Rank</h2>
            <div className="flex items-baseline gap-3">
              <motion.span
                className="text-5xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                #<AnimatedNumber value={12} delay={0.4} />
              </motion.span>
              <span className="text-xl opacity-90">Nationally</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <motion.div
                className="flex items-center gap-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+5 ranks this week</span>
              </motion.div>
              <div className="text-sm opacity-75">|</div>
              <div className="text-sm">Top 2% of all users</div>
            </div>
          </div>

          <motion.div
            className="text-7xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            👤
          </motion.div>
        </div>
      </motion.div>

      {/* Filters */}
      <GlassCard delay={0.3} className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Location Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">View By Location</label>
            <div className="flex gap-2">
              {['national', 'state', 'city'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedTab === tab
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Time Period</label>
            <div className="flex gap-2">
              {['weekly', 'monthly', 'all-time'].map((period) => (
                <motion.button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedPeriod === period
                      ? 'bg-brand-secondary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {period.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Leaderboard Table */}
      <GlassCard delay={0.4} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Score</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Tests</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence mode="wait">
                {leaderboardData[selectedTab].map((user, index) => (
                  <motion.tr
                    key={`${selectedTab}-${user.rank}`}
                    className={`transition-colors ${
                      user.isCurrentUser
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-brand-primary'
                        : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={!user.isCurrentUser ? { x: 4 } : {}}
                  >
                    <td className="px-6 py-4">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          getRankBadgeColor(user.rank)
                        }`}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <div className={`font-semibold ${
                            user.isCurrentUser ? 'text-brand-primary' : 'text-gray-900'
                          }`}>
                            {user.name}
                            {user.isCurrentUser && (
                              <motion.span
                                className="ml-2 text-xs bg-brand-primary text-white px-2 py-1 rounded-full"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                You
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-lg text-gray-900">
                        <AnimatedNumber value={user.score} delay={0.2 + index * 0.05} />
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-700">
                        <AnimatedNumber value={user.tests} delay={0.3 + index * 0.05} />
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${
                        user.accuracy >= 90 ? 'text-green-600' : user.accuracy >= 80 ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        <AnimatedNumber value={user.accuracy} suffix="%" delay={0.4 + index * 0.05} />
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Motivational Footer */}
      <motion.div
        className="mt-6 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)' }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🎯
          </motion.div>
          <div>
            <h3 className="font-bold text-purple-900 mb-1">Keep Pushing!</h3>
            <p className="text-purple-700 text-sm">
              You're doing great! Complete 5 more tests to climb into the top 10.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
