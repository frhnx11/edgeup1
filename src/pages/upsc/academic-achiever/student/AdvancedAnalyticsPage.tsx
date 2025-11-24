import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { GlassCard } from '../../../../components/upsc/common/premium/GlassCard';
import { AnimatedNumber } from '../../../../components/upsc/common/premium/AnimatedNumber';
import { AnimatedProgress } from '../../../../components/upsc/common/premium/AnimatedProgress';

const AdvancedAnalyticsPage: React.FC = () => {
  // Mock data for demonstration
  const performanceData = {
    overallScore: 78,
    percentile: 85,
    testsAttempted: 45,
    averageAccuracy: 76
  };

  const subjectPerformance = [
    { subject: 'History', score: 85, trend: '+5', color: 'green' },
    { subject: 'Geography', score: 72, trend: '+3', color: 'blue' },
    { subject: 'Polity', score: 80, trend: '+7', color: 'purple' },
    { subject: 'Economics', score: 68, trend: '-2', color: 'yellow' },
    { subject: 'Science & Tech', score: 75, trend: '+4', color: 'pink' },
    { subject: 'Current Affairs', score: 82, trend: '+6', color: 'indigo' }
  ];

  const strengthsWeaknesses = {
    strengths: ['History', 'Current Affairs', 'Polity'],
    weaknesses: ['Economics', 'Geography']
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <BarChart3 className="w-8 h-8 text-brand-primary" />
          </motion.div>
          Advanced Analytics
        </h1>
        <p className="text-gray-600 mt-2">Detailed performance insights and trends</p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <GlassCard delay={0} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Target className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <AnimatedNumber value={performanceData.percentile} suffix="%ile" delay={0.3} />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={performanceData.overallScore} suffix="%" delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Overall Score</p>
        </GlassCard>

        <GlassCard delay={0.1} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span
              className="text-sm font-semibold text-green-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              +12%
            </motion.span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={performanceData.percentile} suffix="th" delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Percentile Rank</p>
        </GlassCard>

        <GlassCard delay={0.2} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={performanceData.testsAttempted} delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Tests Attempted</p>
        </GlassCard>

        <GlassCard delay={0.3} className="p-6">
          <div className="flex items-center justify-between mb-4">
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
              +8%
            </motion.span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={performanceData.averageAccuracy} suffix="%" delay={0.2} />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Avg Accuracy</p>
        </GlassCard>
      </motion.div>

      {/* Subject-wise Performance */}
      <GlassCard delay={0.4} className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>

        <div className="space-y-4">
          {subjectPerformance.map((subject, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="w-40 text-sm font-semibold text-gray-700">{subject.subject}</div>

              <div className="flex-1">
                <AnimatedProgress
                  value={subject.score}
                  color={subject.color}
                  delay={0.6 + index * 0.1}
                  height="h-8"
                />
              </div>

              <motion.div
                className={`w-16 text-sm font-semibold ${
                  subject.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: 'spring' }}
              >
                {subject.trend}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Strength-Weakness Matrix */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {/* Strengths */}
        <motion.div
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 backdrop-blur-sm"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)' }}
        >
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Your Strengths
          </h2>
          <div className="space-y-3">
            {strengthsWeaknesses.strengths.map((strength, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-green-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ x: 5, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-800 font-semibold">{strength}</span>
                <span className="ml-auto text-green-600 text-sm font-semibold">Strong</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 backdrop-blur-sm"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)' }}
        >
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            Areas to Improve
          </h2>
          <div className="space-y-3">
            {strengthsWeaknesses.weaknesses.map((weakness, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-red-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ x: 5, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-800 font-semibold">{weakness}</span>
                <span className="ml-auto text-red-600 text-sm font-semibold">Focus</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Performance Trend Graph Placeholder */}
      <GlassCard delay={1.5} className="p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Trend (Last 30 Days)</h2>
        <motion.div
          className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          <p className="text-gray-500">Chart visualization will be displayed here</p>
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default AdvancedAnalyticsPage;
