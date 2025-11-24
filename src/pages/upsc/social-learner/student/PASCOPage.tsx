import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  Award,
  MessageCircle,
  FileText,
  Target,
  Brain,
  Zap,
  Heart,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  Cpu,
  Network
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { socialLearnerPASCO } from '../../../../data/pascoSocialLearnerData';

type TabType = 'overview' | 'history' | 'performance' | 'timeline';

export function PASCOPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scanPosition, setScanPosition] = useState(0);
  const [scanDirection, setScanDirection] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const loadingSteps = [
    'Initializing PASCO Analysis...',
    'Analyzing Personality Traits...',
    'Evaluating Aptitude Levels...',
    'Assessing Skills Proficiency...',
    'Mapping Character Attributes...',
    'Generating Comprehensive Report...'
  ];

  // Loading Animation Effect
  useEffect(() => {
    if (loading) {
      const duration = 5000;
      const interval = 30;
      const incrementPerStep = (100 * interval) / duration;

      setDataPoints(Array.from({ length: 20 }, () => Math.random() * 100));

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementPerStep;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setLoading(false), 500);
            return 100;
          }
          return newProgress;
        });

        setDataPoints(prev => [...prev.slice(1), Math.random() * 100]);
      }, interval);

      // Step text animation
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, duration / loadingSteps.length);

      // Scanner animation
      const scanTimer = setInterval(() => {
        setScanPosition(prev => {
          const newPosition = prev + (scanDirection * 2);
          if (newPosition >= 100) {
            setScanDirection(-1);
            return 100;
          }
          if (newPosition <= 0) {
            setScanDirection(1);
            return 0;
          }
          return newPosition;
        });
      }, 50);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
        clearInterval(scanTimer);
      };
    }
  }, [loading, scanDirection]);

  // Loading Screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="https://media-hosting.imagekit.io//8e131b7e3a9a43cf/background.mp4?Expires=1833786621&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=izc5tXN9pvMxanNTVbJw-LUR7EPC~93qRW0vo9gmEXk4ILH5JbRHoPdzPIwkxoLTbbyiqEkefNJZ9mfXMoDD4w~42yQMlKKGhxeCnB26kQ3e67gbGV9MhtPU~806ehR0g1mblPrAcQoW1XpV19t9xPSJvKTZ9vlsjRdJxS3HZh50Y~csvfr8-nydwkF4fKZLHewFx16h3nhVnWLLSDNbqmsRpD62IXZxOnHAFhMCKbL0J2RVgXMBCoyMOw6PpQamkktNTrc~RWTxLrUGJ3qVQdVwXjzIVw1AKxPXc9lrBRIu-rSNjG-zhvqRd20cMujZ~Fpgh7PJG19~tvn0qbSdpA__" type="video/mp4" />
        </video>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-purple-500 rounded-full opacity-20 animate-float"
                style={{
                  width: Math.random() * 4 + 'px',
                  height: Math.random() * 4 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's',
                  animationDuration: Math.random() * 3 + 3 + 's'
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-2xl w-full mx-auto p-8">
          <div className="text-center mb-12">
            {/* Scanner Container */}
            <div className="relative w-96 h-96 mx-auto mb-8 perspective-1000">
              {/* Main Scanner Frame */}
              <div className="absolute inset-0 rounded-lg border border-[#094d88]/30 overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
                }} />
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
                }} />

                {/* Scanning Line */}
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#094d88] to-transparent"
                  style={{
                    top: `${scanPosition}%`,
                    boxShadow: '0 0 30px rgba(9, 77, 136, 0.8)'
                  }}
                />

                {/* Scan Overlay */}
                <div
                  className="absolute left-0 right-0 bg-gradient-to-b from-[#094d88]/20 to-transparent transition-all duration-200"
                  style={{
                    top: 0,
                    height: `${scanPosition}%`,
                    opacity: 0.3
                  }}
                />

                {/* Animated Data Points */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-[#094d88] rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      boxShadow: '0 0 15px rgba(9, 77, 136, 0.6)'
                    }}
                  />
                ))}

                {/* Scanning Lines */}
                <div className="absolute inset-0">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border border-[#094d88]/20"
                      style={{
                        transform: `scale(${0.8 + (i * 0.1)})`,
                        animation: `pulse 2s ease-in-out ${i * 0.5}s infinite`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner Markers */}
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="absolute w-8 h-8 border-2 border-[#094d88]"
                  style={{
                    [i < 2 ? 'top' : 'bottom']: '-2px',
                    [i % 2 === 0 ? 'left' : 'right']: '-2px',
                    borderTop: i >= 2 ? 'none' : undefined,
                    borderBottom: i < 2 ? 'none' : undefined,
                    borderLeft: i % 2 ? 'none' : undefined,
                    borderRight: i % 2 === 0 ? 'none' : undefined,
                  }}
                />
              ))}

              {/* Edge Indicators */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#094d88] rounded-full animate-pulse"
                  style={{
                    [i < 2 ? 'top' : 'bottom']: '-1px',
                    left: `${i % 2 === 0 ? 25 : 75}%`,
                    boxShadow: '0 0 10px rgba(9, 77, 136, 0.8)'
                  }}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">
              PASCO ANALYSIS
            </h2>
            <p className="text-purple-300 h-6 transition-all text-lg">
              {loadingSteps[currentStep]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-800/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#094d88] via-[#a855f7] to-[#094d88] animate-gradient" />
                <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Data Visualization */}
            <div className="absolute -top-6 left-0 w-full flex items-end justify-between h-4 px-1">
              {dataPoints.map((point, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-[#094d88]/30 transition-all duration-300"
                  style={{ height: `${point}%` }}
                />
              ))}
            </div>
          </div>

          {/* Status Metrics */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Personality Sync', value: '95%', icon: Network },
              { label: 'Data Streams', value: '182/256', icon: Network },
              { label: 'Analysis State', value: 'Processing', icon: Cpu }
            ].map((metric, i) => (
              <div
                key={i}
                className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 overflow-hidden group hover:bg-gray-800/60 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <metric.icon className="w-5 h-5 text-[#a855f7]" />
                    <div className="text-[#a855f7] text-sm">{metric.label}</div>
                  </div>
                  <div className="text-white font-mono text-lg">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-between items-center text-sm">
            <span className="text-[#a855f7] font-mono">INITIALIZING PASCO REPORT</span>
            <span className="text-[#a855f7] font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Main PASCO Report
  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeTooltip message="Understand your learning personality and optimize your study approach." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6"
      >
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                PASCO Report
              </h1>
              <p className="text-gray-600 text-lg">{socialLearnerPASCO.tagline}</p>
            </div>
            <div className="text-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth="14"
                    fill="none"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#gradient)"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 64}`}
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - socialLearnerPASCO.overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900">{socialLearnerPASCO.overallScore}</div>
                  <div className="text-sm text-gray-600">Overall</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Learning Style', value: 'Auditory', icon: Brain, color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600' },
              { label: 'Social Energy', value: 'Extroverted', icon: Users, color: 'bg-cyan-50 border-cyan-200', iconColor: 'text-cyan-600' },
              { label: 'Study Preference', value: 'Large Group (4+)', icon: Users, color: 'bg-indigo-50 border-indigo-200', iconColor: 'text-indigo-600' },
              { label: 'Motivation', value: 'Peer Recognition', icon: Trophy, color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`${stat.color} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ${stat.iconColor}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    <div className="font-bold text-sm text-gray-900">{stat.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Personality Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 px-5 py-3 rounded-full border border-blue-200">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">{socialLearnerPASCO.personalityType}</span>
            <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 border border-gray-200">
          <div className="flex gap-2">
            {(['overview', 'history', 'performance', 'timeline'] as TabType[]).map((tab) => {
              const icons = { overview: Target, history: Clock, performance: TrendingUp, timeline: Calendar };
              const Icon = icons[tab];
              const isActive = activeTab === tab;

              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="capitalize">{tab}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'performance' && <PerformanceTab />}
            {activeTab === 'timeline' && <TimelineTab />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab() {
  const colors = {
    purple: 'from-blue-500 to-blue-600',
    blue: 'from-cyan-500 to-cyan-600',
    green: 'from-teal-500 to-teal-600',
    amber: 'from-indigo-500 to-indigo-600'
  };

  // Prepare radar chart data
  const radarData = socialLearnerPASCO.categories.find(c => c.name === 'Aptitude')?.attributes.map(attr => ({
    subject: attr.label.split(' ')[0],
    value: attr.score
  })) || [];

  return (
    <div className="space-y-6">
      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-6">
        {socialLearnerPASCO.categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-gray-900">{category.name}</h3>
              <div className={`text-4xl font-bold bg-gradient-to-r ${colors[category.color as keyof typeof colors]} bg-clip-text text-transparent`}>
                {category.score}
              </div>
            </div>

            <div className="space-y-4">
              {category.attributes.map((attr, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{attr.label}</span>
                    <span className="font-semibold text-gray-900">{attr.value}</span>
                  </div>
                  {attr.score && (
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${attr.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${colors[category.color as keyof typeof colors]}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Aptitude Radar Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Aptitude Profile</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(0, 0, 0, 0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#374151' }} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Profile Summary */}
      <div className="bg-blue-50 rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Profile Summary</h3>
        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line text-lg">
          {socialLearnerPASCO.profileSummary.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {socialLearnerPASCO.profileSummary.strengths.map((strength, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="px-5 py-2.5 bg-white rounded-full text-sm font-semibold text-gray-900 shadow-md border border-gray-200"
            >
              ✨ {strength}
            </motion.span>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-xl">
            <Target className="w-6 h-6 text-blue-600" />
            Recommendations
          </h4>
          <ul className="space-y-3">
            {socialLearnerPASCO.profileSummary.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// History Tab Component
function HistoryTab() {
  const chartData = socialLearnerPASCO.history.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Overall: entry.overallScore,
    Personality: entry.categoryScores.personality,
    Aptitude: entry.categoryScores.aptitude,
    Skills: entry.categoryScores.skills,
    Character: entry.categoryScores.character
  }));

  return (
    <div className="space-y-6">
      {/* Score Progression Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Score Progression</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#374151', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#374151' }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: '#1f2937',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line type="monotone" dataKey="Overall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} />
            <Line type="monotone" dataKey="Personality" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} />
            <Line type="monotone" dataKey="Aptitude" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
            <Line type="monotone" dataKey="Skills" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
            <Line type="monotone" dataKey="Character" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test History Cards */}
      <div className="grid grid-cols-2 gap-6">
        {socialLearnerPASCO.history.slice(0, 2).map((entry, index) => {
          const prevEntry = socialLearnerPASCO.history[index + 1];
          const improvement = prevEntry ? entry.overallScore - prevEntry.overallScore : 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Test Date</div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    {entry.overallScore}
                  </div>
                  {improvement !== 0 && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {improvement > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.abs(improvement)} pts
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(entry.categoryScores).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-xs text-gray-500 capitalize mb-2">{category}</div>
                    <div className="text-2xl font-bold text-gray-900">{score}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Growth Statistics */}
      <div className="bg-emerald-50 rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Growth Statistics</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="text-5xl font-bold text-green-600 mb-2">+8</div>
            <div className="text-sm text-gray-600">Total Improvement</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="text-5xl font-bold text-blue-600 mb-2">4</div>
            <div className="text-sm text-gray-600">Tests Completed</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="text-5xl font-bold text-purple-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">Consistency Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Tab Component
function PerformanceTab() {
  const { peerComparison, studyGroupStats, socialLearningIndex } = socialLearnerPASCO.performance;

  return (
    <div className="space-y-6">
      {/* Peer Comparison */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Peer Comparison</h3>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Your Score', value: peerComparison.yourScore, color: 'from-blue-500 to-indigo-600' },
            { label: 'Peer Average', value: peerComparison.averageScore, color: 'from-purple-500 to-violet-600' },
            { label: 'Percentile', value: `${peerComparison.percentile}%`, color: 'from-green-500 to-emerald-600' },
            { label: 'Total Students', value: peerComparison.totalStudents, color: 'from-indigo-500 to-purple-600' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`text-center p-6 bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl`}
            >
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Study Group Stats */}
      <div className="bg-cyan-50 rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-600" />
          Study Group Performance
        </h3>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">{studyGroupStats.groupName}</div>
              <div className="text-sm text-gray-600">{studyGroupStats.groupSize} members</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-cyan-600">{studyGroupStats.groupAverageScore}</div>
              <div className="text-sm text-gray-600">Group Average</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="text-sm text-gray-700 mb-2">Collaboration Rate</div>
              <div className="text-3xl font-bold text-gray-900">{studyGroupStats.collaborationRate}%</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <div className="text-sm text-gray-700 mb-2">Weekly Sessions</div>
              <div className="text-3xl font-bold text-gray-900">{studyGroupStats.weeklyStudySessions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Learning Index */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          Social Learning Index
        </h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 text-lg">Overall Index</span>
            <span className="text-3xl font-bold text-blue-600">{socialLearningIndex.score}/100</span>
          </div>
          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${socialLearningIndex.score}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Forum Participation', value: socialLearningIndex.forumParticipation },
            { label: 'Peer Teaching', value: socialLearningIndex.peerTeachingRate },
            { label: 'Group Engagement', value: socialLearningIndex.groupEngagement },
            { label: 'Discussion Quality', value: socialLearningIndex.discussionQuality }
          ].map((metric, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="text-sm text-gray-600 mb-3">{metric.label}</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full bg-blue-600"
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">{metric.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Category Performance */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Category Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={socialLearnerPASCO.categories.map(c => ({
              name: c.name,
              score: c.score,
              target: 85
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#374151', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#374151' }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                color: '#1f2937',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {socialLearnerPASCO.categories.map((entry, index) => {
                const colors = ['#3b82f6', '#06b6d4', '#10b981', '#6366f1'];
                return <Cell key={`cell-${index}`} fill={colors[index]} />;
              })}
            </Bar>
            <Bar dataKey="target" fill="rgba(0, 0, 0, 0.05)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Timeline Tab Component
function TimelineTab() {
  const iconMap: Record<string, any> = {
    trophy: Trophy,
    users: Users,
    'message-circle': MessageCircle,
    calendar: Calendar,
    'message-square': MessageCircle,
    'file-text': FileText,
    award: Award
  };

  return (
    <div className="space-y-6">
      {/* Activity Stream */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Recent Activities</h3>

        <div className="space-y-4">
          {socialLearnerPASCO.timeline.map((activity, index) => {
            const Icon = iconMap[activity.icon] || Star;
            const colors = {
              achievement: 'from-amber-500 to-yellow-500',
              session: 'from-blue-500 to-indigo-500',
              collaboration: 'from-purple-500 to-pink-500',
              milestone: 'from-green-500 to-emerald-500'
            };

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-200"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[activity.type]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{activity.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{activity.description}</p>

                  {activity.participants && activity.participants.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {activity.participants.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-indigo-50 rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-indigo-600" />
          Upcoming Milestones
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {socialLearnerPASCO.upcomingMilestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-sm text-gray-700">{milestone.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          Achievement Gallery
        </h3>

        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Team Player', icon: Users, color: 'from-blue-500 to-indigo-500' },
            { name: 'Discussion Leader', icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
            { name: 'Peer Motivator', icon: Heart, color: 'from-rose-500 to-pink-500' },
            { name: '50 Day Streak', icon: Zap, color: 'from-amber-500 to-orange-500' },
            { name: 'Study Champion', icon: Award, color: 'from-green-500 to-emerald-500' },
            { name: 'Top Contributor', icon: Star, color: 'from-yellow-500 to-amber-500' },
            { name: 'Group Leader', icon: Trophy, color: 'from-orange-500 to-red-500' },
            { name: 'Collaboration Pro', icon: Users, color: 'from-violet-500 to-purple-500' }
          ].map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="bg-gray-50 rounded-2xl p-5 text-center cursor-pointer border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-semibold text-gray-900">{achievement.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
