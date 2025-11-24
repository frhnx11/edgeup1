import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Clock, Target, TrendingUp, Award, Zap, ChevronRight } from 'lucide-react';
import { GlassCard } from '../../../../components/upsc/common/premium/GlassCard';
import { AnimatedNumber } from '../../../../components/upsc/common/premium/AnimatedNumber';
import { AnimatedProgress } from '../../../../components/upsc/common/premium/AnimatedProgress';

const TestAnalyticsPage: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const mockTests = [
    {
      id: 1,
      name: 'Prelims Mock Test #15',
      date: '2025-01-15',
      score: 145,
      totalMarks: 200,
      percentage: 72.5,
      timeTaken: '118 min',
      accuracy: 78,
      rank: 12
    },
    {
      id: 2,
      name: 'Prelims Mock Test #14',
      date: '2025-01-08',
      score: 138,
      totalMarks: 200,
      percentage: 69,
      timeTaken: '120 min',
      accuracy: 74,
      rank: 18
    },
    {
      id: 3,
      name: 'Subject Test: History',
      date: '2025-01-05',
      score: 42,
      totalMarks: 50,
      percentage: 84,
      timeTaken: '45 min',
      accuracy: 88,
      rank: 5
    }
  ];

  const detailedAnalysis = {
    speedVsAccuracy: {
      yourSpeed: 1.52,
      topperSpeed: 1.65,
      yourAccuracy: 78,
      topperAccuracy: 92
    },
    questionDifficulty: {
      easy: { attempted: 45, correct: 42, accuracy: 93 },
      medium: { attempted: 35, correct: 24, accuracy: 69 },
      hard: { attempted: 20, correct: 9, accuracy: 45 }
    },
    topicWise: [
      { topic: 'Ancient History', correct: 8, total: 10, accuracy: 80 },
      { topic: 'Modern History', correct: 12, total: 15, accuracy: 80 },
      { topic: 'Geography', correct: 14, total: 20, accuracy: 70 },
      { topic: 'Polity', correct: 16, total: 20, accuracy: 80 },
      { topic: 'Economics', correct: 10, total: 15, accuracy: 67 }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/30 min-h-screen">
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
            <ClipboardList className="w-8 h-8 text-brand-primary" />
          </motion.div>
          Mock Test Analytics
        </h1>
        <p className="text-gray-600 mt-2">Detailed insights from your test performance</p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard delay={0} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <ClipboardList className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={45} delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Total Tests Taken</p>
        </GlassCard>

        <GlassCard delay={0.1} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span
              className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              +8%
            </motion.span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={76} suffix="%" delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Avg Accuracy</p>
        </GlassCard>

        <GlassCard delay={0.2} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Clock className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={1.52} decimals={2} delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Min per Question</p>
        </GlassCard>

        <GlassCard delay={0.3} className="p-6">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Award className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span
              className="text-sm font-semibold text-orange-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              +5 ranks
            </motion.span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            #<AnimatedNumber value={12} delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Latest Rank</p>
        </GlassCard>
      </motion.div>

      {/* Recent Tests */}
      <GlassCard delay={0.4} className="mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Test Performance</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {mockTests.map((test, index) => (
            <motion.div
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              className="p-6 hover:bg-gray-50/50 cursor-pointer transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{test.name}</h3>
                  <p className="text-sm text-gray-600">{new Date(test.date).toLocaleDateString('en-US', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  })}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedNumber value={test.score} delay={0.6 + index * 0.1} />
                      /<AnimatedNumber value={test.totalMarks} delay={0.6 + index * 0.1} />
                    </div>
                    <div className="text-sm text-gray-600">
                      <AnimatedNumber value={test.percentage} decimals={1} suffix="%" delay={0.7 + index * 0.1} />
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {test.timeTaken}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="w-4 h-4" />
                      <AnimatedNumber value={test.accuracy} suffix="%" delay={0.7 + index * 0.1} />
                    </div>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Award className="w-4 h-4" />
                      Rank <AnimatedNumber value={test.rank} delay={0.7 + index * 0.1} />
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Speed vs Accuracy Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard delay={0.7} className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Speed vs Topper
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Your Speed</span>
                <span className="text-lg font-bold text-blue-600">
                  <AnimatedNumber value={1.52} decimals={2} delay={0.8} /> min/Q
                </span>
              </div>
              <AnimatedProgress value={76} color="blue" delay={0.9} height="h-3" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Topper's Speed</span>
                <span className="text-lg font-bold text-green-600">
                  <AnimatedNumber value={1.65} decimals={2} delay={0.8} /> min/Q
                </span>
              </div>
              <AnimatedProgress value={82} color="green" delay={1} height="h-3" />
            </div>
          </div>

          <motion.p
            className="text-sm text-gray-600 mt-4 bg-blue-50 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <TrendingUp className="w-4 h-4 inline mr-1 text-blue-600" />
            You're slightly faster! Focus on improving accuracy.
          </motion.p>
        </GlassCard>

        <GlassCard delay={0.8} className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-500" />
            Accuracy vs Topper
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Your Accuracy</span>
                <span className="text-lg font-bold text-blue-600">
                  <AnimatedNumber value={78} suffix="%" delay={0.9} />
                </span>
              </div>
              <AnimatedProgress value={78} color="blue" delay={1} height="h-3" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Topper's Accuracy</span>
                <span className="text-lg font-bold text-green-600">
                  <AnimatedNumber value={92} suffix="%" delay={0.9} />
                </span>
              </div>
              <AnimatedProgress value={92} color="green" delay={1.1} height="h-3" />
            </div>
          </div>

          <motion.p
            className="text-sm text-gray-600 mt-4 bg-yellow-50 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Award className="w-4 h-4 inline mr-1 text-yellow-600" />
            14% gap with topper. Practice more to bridge this!
          </motion.p>
        </GlassCard>
      </div>

      {/* Question Difficulty Analysis */}
      <GlassCard delay={0.9} className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Question Difficulty</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(detailedAnalysis.questionDifficulty).map(([level, data], index) => (
            <motion.div
              key={level}
              className={`rounded-lg p-4 ${
                level === 'easy' ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200' :
                level === 'medium' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200' :
                'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className={`font-bold mb-3 capitalize text-lg ${
                level === 'easy' ? 'text-green-700' :
                level === 'medium' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {level}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempted:</span>
                  <span className="font-semibold text-gray-900">
                    <AnimatedNumber value={data.attempted} delay={1.1 + index * 0.1} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-semibold text-green-600">
                    <AnimatedNumber value={data.correct} delay={1.2 + index * 0.1} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold text-gray-900">
                    <AnimatedNumber value={data.accuracy} suffix="%" delay={1.3 + index * 0.1} />
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <AnimatedProgress
                  value={data.accuracy}
                  color={level === 'easy' ? 'green' : level === 'medium' ? 'yellow' : 'red'}
                  delay={1.4 + index * 0.1}
                  height="h-2"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Topic-wise Breakdown */}
      <GlassCard delay={1.2} className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Topic-wise Performance</h2>

        <div className="space-y-4">
          {detailedAnalysis.topicWise.map((topic, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
            >
              <div className="w-48 font-semibold text-gray-800">{topic.topic}</div>

              <div className="flex-1">
                <AnimatedProgress
                  value={topic.accuracy}
                  color={topic.accuracy >= 80 ? 'green' : topic.accuracy >= 70 ? 'blue' : 'yellow'}
                  delay={1.4 + index * 0.1}
                  height="h-8"
                  showLabel
                />
              </div>

              <div className="w-24 text-sm text-gray-600">
                <AnimatedNumber value={topic.correct} delay={1.5 + index * 0.1} />
                /<AnimatedNumber value={topic.total} delay={1.5 + index * 0.1} /> correct
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default TestAnalyticsPage;
