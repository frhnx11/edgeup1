import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Target, AlertCircle, CheckCircle, TrendingUp, BookOpen } from 'lucide-react';
import { GlassCard } from '../../../../components/upsc/common/premium/GlassCard';
import { AnimatedNumber } from '../../../../components/upsc/common/premium/AnimatedNumber';
import { AnimatedProgress } from '../../../../components/upsc/common/premium/AnimatedProgress';

const ReadinessScorePage: React.FC = () => {
  const readinessScore = 68; // Overall readiness percentage
  const [gaugeValue, setGaugeValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGaugeValue(readinessScore);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const subjectReadiness = [
    { subject: 'History', readiness: 85, status: 'excellent', color: 'green' },
    { subject: 'Polity', readiness: 78, status: 'good', color: 'blue' },
    { subject: 'Geography', readiness: 65, status: 'average', color: 'yellow' },
    { subject: 'Economics', readiness: 52, status: 'needs-work', color: 'red' },
    { subject: 'Science & Tech', readiness: 70, status: 'good', color: 'blue' },
    { subject: 'Current Affairs', readiness: 80, status: 'excellent', color: 'green' }
  ];

  const insights = [
    {
      type: 'strength',
      icon: CheckCircle,
      title: 'Strong Foundation',
      description: 'Your History and Current Affairs are exam-ready',
      color: 'green'
    },
    {
      type: 'focus',
      icon: AlertCircle,
      title: 'Focus on Economics',
      description: 'Economics needs 28% more work to reach exam readiness',
      color: 'red'
    },
    {
      type: 'tip',
      icon: TrendingUp,
      title: 'Almost There!',
      description: 'You need 32% improvement overall to be fully prepared',
      color: 'blue'
    }
  ];

  const getStatusColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      red: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[color as keyof typeof colors];
  };

  // Calculate SVG circle properties
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (gaugeValue / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Gauge className="w-8 h-8 text-brand-primary" />
          </motion.div>
          Exam Readiness Score
        </h1>
        <p className="text-gray-600 mt-2">AI-powered analysis of your UPSC preparation</p>
      </motion.div>

      {/* Main Readiness Gauge */}
      <GlassCard delay={0.1} className="p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular Gauge */}
          <div className="relative">
            <svg className="w-64 h-64 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#094d88" />
                  <stop offset="100%" stopColor="#10ac8b" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="128"
                cy="128"
                r={radius}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 2, ease: "easeOut" }}
                filter="drop-shadow(0 0 8px rgba(16, 172, 139, 0.5))"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-6xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <AnimatedNumber value={readinessScore} suffix="%" delay={0.6} />
                </motion.div>
                <div className="text-sm text-gray-600 mt-1">Ready for UPSC</div>
              </div>
            </div>
          </div>

          {/* Readiness Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're Getting There!</h2>
            <p className="text-gray-600 mb-6">
              Based on your test performance and study patterns, you're {readinessScore}% ready for the UPSC exam.
            </p>

            <div className="space-y-4">
              <motion.div
                className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-r-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ x: 4, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900">Strong Subjects</h3>
                    <p className="text-green-700 text-sm">History, Current Affairs, Polity</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-r-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ x: 4, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Needs Attention</h3>
                    <p className="text-red-700 text-sm">Economics, Geography</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Subject-wise Readiness */}
      <GlassCard delay={0.3} className="p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-primary" />
          Subject-wise Readiness
        </h2>

        <div className="space-y-5">
          {subjectReadiness.map((subject, index) => (
            <motion.div
              key={index}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{subject.subject}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                    getStatusColor(subject.color)
                  }`}>
                    {subject.status.replace('-', ' ')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 w-16 text-right">
                    <AnimatedNumber value={subject.readiness} suffix="%" delay={0.5 + index * 0.1} />
                  </span>
                </div>
              </div>

              <AnimatedProgress
                value={subject.readiness}
                color={subject.color}
                delay={0.6 + index * 0.1}
              />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Gap Analysis & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <GlassCard delay={1 + index * 0.1} className="p-6 h-full">
              <motion.div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  insight.color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                  insight.color === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                  'bg-gradient-to-br from-blue-400 to-blue-600'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <insight.icon className="w-6 h-6 text-white" />
              </motion.div>

              <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-gray-600 text-sm">{insight.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Predicted Score Range */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-brand-primary" />
          Predicted Score Range
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Prelims (Expected)', range: '320 - 380' },
            { label: 'Mains (Expected)', range: '420 - 480' },
            { label: 'Current Bracket', range: 'Top 15%' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' }}
            >
              <div className="text-2xl font-bold text-gray-900">{item.range}</div>
              <div className="text-sm text-gray-600 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Based on current performance, you're expected to score within this range. Keep improving!
        </p>
      </motion.div>
    </div>
  );
};

export default ReadinessScorePage;
