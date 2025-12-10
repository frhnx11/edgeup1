import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Network,
  BookOpen,
  Layout,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell
} from 'recharts';
import { useUserTraitsStore } from '../../../../store/useUserTraitsStore';
import { TRAIT_DEFINITIONS, TRAIT_CATEGORY_META, getTraitsByCategory } from '../../../../config/traitFeatureMapping';
import type { TraitCategory, TraitKey } from '../../../../config/traitFeatureMapping';

type TabType = 'overview' | 'traits' | 'insights';

// PASCO category mapping
const PASCO_CATEGORIES = {
  personality: {
    name: 'Personality',
    letter: 'P',
    traitCategories: ['social', 'communication'] as TraitCategory[],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Users
  },
  aptitude: {
    name: 'Aptitude',
    letter: 'A',
    traitCategories: ['learning', 'pace'] as TraitCategory[],
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Brain
  },
  skills: {
    name: 'Skills',
    letter: 'S',
    traitCategories: ['content'] as TraitCategory[],
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Target
  },
  character: {
    name: 'Character & Optimization',
    letter: 'CO',
    traitCategories: ['motivation', 'ui'] as TraitCategory[],
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Heart
  }
};

export function PASCOPage() {
  const navigate = useNavigate();
  const { traits, personalityReview, hasCompletedQuiz } = useUserTraitsStore();
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

  // Calculate PASCO scores from traits
  const getTraitValue = (key: TraitKey): number => {
    return traits[key] ?? 0.5;
  };

  const getCategoryScore = (traitCategories: TraitCategory[]): number => {
    const allTraits: TraitKey[] = traitCategories.flatMap(cat => getTraitsByCategory(cat));
    const values = allTraits.map(key => getTraitValue(key));
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100);
  };

  const pascoScores = useMemo(() => ({
    personality: getCategoryScore(PASCO_CATEGORIES.personality.traitCategories),
    aptitude: getCategoryScore(PASCO_CATEGORIES.aptitude.traitCategories),
    skills: getCategoryScore(PASCO_CATEGORIES.skills.traitCategories),
    character: getCategoryScore(PASCO_CATEGORIES.character.traitCategories)
  }), [traits]);

  const overallScore = useMemo(() => {
    return Math.round((pascoScores.personality + pascoScores.aptitude + pascoScores.skills + pascoScores.character) / 4);
  }, [pascoScores]);

  // Get learning style label
  const getLearningStyleLabel = () => {
    if (!personalityReview) return 'Mixed';
    const styleMap = {
      visual: 'Visual',
      auditory: 'Auditory',
      kinesthetic: 'Kinesthetic',
      reading_writing: 'Reading/Writing',
      mixed: 'Mixed'
    };
    return styleMap[personalityReview.primaryLearningStyle] || 'Mixed';
  };

  // Get social energy label
  const getSocialEnergyLabel = () => {
    const value = getTraitValue('social_energy_extroversion');
    if (value >= 0.7) return 'Extroverted';
    if (value <= 0.3) return 'Introverted';
    return 'Ambivert';
  };

  // Get study preference label
  const getStudyPreferenceLabel = () => {
    if (!personalityReview) return 'Balanced';
    const prefMap = {
      solo: 'Solo Study',
      collaborative: 'Group Study',
      competitive: 'Competitive',
      balanced: 'Balanced'
    };
    return prefMap[personalityReview.studyApproach] || 'Balanced';
  };

  // Get top motivation
  const getTopMotivation = () => {
    const motivationTraits = getTraitsByCategory('motivation');
    let topTrait: TraitKey = 'achievement_motivation';
    let topValue = 0;

    motivationTraits.forEach(trait => {
      const value = getTraitValue(trait);
      if (value > topValue) {
        topValue = value;
        topTrait = trait;
      }
    });

    return TRAIT_DEFINITIONS[topTrait]?.highLabel || 'Achievement-driven';
  };

  // Loading Animation Effect
  useEffect(() => {
    if (loading) {
      const duration = 3000;
      const interval = 30;
      const incrementPerStep = (100 * interval) / duration;

      setDataPoints(Array.from({ length: 20 }, () => Math.random() * 100));

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

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, duration / loadingSteps.length);

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

  // Check if quiz completed
  const quizCompleted = hasCompletedQuiz();

  // Show prompt to take quiz if not completed
  if (!quizCompleted && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Complete Your PASCO Assessment
          </h2>
          <p className="text-gray-600 mb-6">
            Take the personality assessment quiz to unlock your personalized PASCO report with insights into your learning style, strengths, and recommendations.
          </p>
          <motion.button
            onClick={() => navigate('/upsc/quiz')}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Take Assessment Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-brand-primary rounded-full opacity-20 animate-float"
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
            <div className="relative w-96 h-96 mx-auto mb-8 perspective-1000">
              <div className="absolute inset-0 rounded-lg border border-brand-primary/30 overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
                }} />
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
                }} />

                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent"
                  style={{
                    top: `${scanPosition}%`,
                    boxShadow: '0 0 30px rgba(9, 77, 136, 0.8)'
                  }}
                />

                <div
                  className="absolute left-0 right-0 bg-gradient-to-b from-brand-primary/20 to-transparent transition-all duration-200"
                  style={{
                    top: 0,
                    height: `${scanPosition}%`,
                    opacity: 0.3
                  }}
                />

                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-brand-primary rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      boxShadow: '0 0 15px rgba(9, 77, 136, 0.6)'
                    }}
                  />
                ))}
              </div>

              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="absolute w-8 h-8 border-2 border-brand-primary"
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
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">
              PASCO ANALYSIS
            </h2>
            <p className="text-brand-secondary h-6 transition-all text-lg">
              {loadingSteps[currentStep]}
            </p>
          </div>

          <div className="relative">
            <div className="w-full h-3 bg-gray-800/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-gradient" />
              </div>
            </div>

            <div className="absolute -top-6 left-0 w-full flex items-end justify-between h-4 px-1">
              {dataPoints.map((point, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-brand-primary/30 transition-all duration-300"
                  style={{ height: `${point}%` }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Personality Sync', value: '95%', icon: Network },
              { label: 'Data Streams', value: '182/256', icon: Network },
              { label: 'Analysis State', value: 'Processing', icon: Cpu }
            ].map((metric, i) => (
              <div
                key={i}
                className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <metric.icon className="w-5 h-5 text-brand-secondary" />
                    <div className="text-brand-secondary text-sm">{metric.label}</div>
                  </div>
                  <div className="text-white font-mono text-lg">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center text-sm">
            <span className="text-brand-secondary font-mono">GENERATING PASCO REPORT</span>
            <span className="text-brand-secondary font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Main PASCO Report
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6"
      >
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your PASCO Report
              </h1>
              <p className="text-gray-600 text-lg">Personality, Aptitude, Skills, Character & Optimization</p>
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
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#094d88" />
                      <stop offset="50%" stopColor="#10ac8b" />
                      <stop offset="100%" stopColor="#0a7d64" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900">{overallScore}</div>
                  <div className="text-sm text-gray-600">Overall</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Learning Style', value: getLearningStyleLabel(), icon: Brain, color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600' },
              { label: 'Social Energy', value: getSocialEnergyLabel(), icon: Users, color: 'bg-cyan-50 border-cyan-200', iconColor: 'text-cyan-600' },
              { label: 'Study Preference', value: getStudyPreferenceLabel(), icon: BookOpen, color: 'bg-indigo-50 border-indigo-200', iconColor: 'text-indigo-600' },
              { label: 'Motivation', value: getTopMotivation(), icon: Trophy, color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600' }
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

          {/* Quiz Completion Badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-brand-primary/10 px-5 py-3 rounded-full border border-brand-primary/20">
            <CheckCircle2 className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold text-gray-900">Assessment Completed</span>
            <Star className="w-5 h-5 text-brand-secondary fill-brand-secondary" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 border border-gray-200">
          <div className="flex gap-2">
            {(['overview', 'traits', 'insights'] as TabType[]).map((tab) => {
              const icons = { overview: Target, traits: BarChart, insights: Sparkles };
              const labels = { overview: 'Overview', traits: 'All Traits', insights: 'Insights' };
              const Icon = icons[tab];
              const isActive = activeTab === tab;

              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{labels[tab]}</span>
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
            {activeTab === 'overview' && <OverviewTab pascoScores={pascoScores} getTraitValue={getTraitValue} />}
            {activeTab === 'traits' && <TraitsTab getTraitValue={getTraitValue} />}
            {activeTab === 'insights' && <InsightsTab personalityReview={personalityReview} getTraitValue={getTraitValue} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ pascoScores, getTraitValue }: { pascoScores: Record<string, number>; getTraitValue: (key: TraitKey) => number }) {
  // Prepare radar chart data
  const radarData = Object.entries(PASCO_CATEGORIES).map(([key, category]) => ({
    subject: category.letter,
    fullName: category.name,
    value: pascoScores[key]
  }));

  return (
    <div className="space-y-6">
      {/* PASCO Category Cards */}
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(PASCO_CATEGORIES).map(([key, category], index) => {
          const score = pascoScores[key];
          const Icon = category.icon;
          const allTraits = category.traitCategories.flatMap(cat => getTraitsByCategory(cat));

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white rounded-3xl shadow-xl p-8 border ${category.borderColor} hover:border-gray-300 transition-all`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{allTraits.length} traits</p>
                  </div>
                </div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {score}
                </div>
              </div>

              <div className="space-y-3">
                {allTraits.slice(0, 4).map((traitKey) => {
                  const trait = TRAIT_DEFINITIONS[traitKey];
                  const value = getTraitValue(traitKey);

                  return (
                    <div key={traitKey}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{trait.name}</span>
                        <span className="font-semibold text-gray-900">{Math.round(value * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
                {allTraits.length > 4 && (
                  <p className="text-sm text-gray-500 text-center pt-2">+{allTraits.length - 4} more traits</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">PASCO Profile</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(0, 0, 0, 0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 14, fontWeight: 600 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#374151' }} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#094d88"
              fill="#094d88"
              fillOpacity={0.4}
            />
            <RechartsTooltip
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white shadow-lg rounded-lg p-3 border">
                      <p className="font-semibold text-gray-900">{data.fullName}</p>
                      <p className="text-brand-primary font-bold">{data.value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Traits Tab Component
function TraitsTab({ getTraitValue }: { getTraitValue: (key: TraitKey) => number }) {
  const categories: TraitCategory[] = ['social', 'learning', 'pace', 'communication', 'content', 'motivation', 'ui'];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const meta = TRAIT_CATEGORY_META[category];
        const categoryTraits = getTraitsByCategory(category);
        const avgScore = Math.round(categoryTraits.reduce((sum, t) => sum + getTraitValue(t), 0) / categoryTraits.length * 100);

        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  {category === 'social' && <Users className="w-5 h-5 text-brand-primary" />}
                  {category === 'learning' && <BookOpen className="w-5 h-5 text-brand-primary" />}
                  {category === 'pace' && <Clock className="w-5 h-5 text-brand-primary" />}
                  {category === 'communication' && <MessageSquare className="w-5 h-5 text-brand-primary" />}
                  {category === 'content' && <FileText className="w-5 h-5 text-brand-primary" />}
                  {category === 'motivation' && <Heart className="w-5 h-5 text-brand-primary" />}
                  {category === 'ui' && <Layout className="w-5 h-5 text-brand-primary" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{meta.name}</h3>
                  <p className="text-sm text-gray-500">{categoryTraits.length} traits</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-brand-primary">{avgScore}%</div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {categoryTraits.map((traitKey) => {
                const trait = TRAIT_DEFINITIONS[traitKey];
                const value = getTraitValue(traitKey);
                const percentage = Math.round(value * 100);

                return (
                  <div key={traitKey} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{trait.name}</div>
                        <div className="text-xs text-gray-500">{trait.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-primary">{percentage}%</div>
                        <div className="text-xs text-gray-500">
                          {value >= 0.7 ? trait.highLabel : value <= 0.3 ? trait.lowLabel : 'Moderate'}
                        </div>
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${
                          value >= 0.7 ? 'bg-gradient-to-r from-brand-secondary to-brand-accent' :
                          value >= 0.5 ? 'bg-gradient-to-r from-brand-primary to-brand-secondary' :
                          value >= 0.3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{trait.lowLabel}</span>
                      <span>{trait.highLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Insights Tab Component
function InsightsTab({ personalityReview, getTraitValue }: { personalityReview: any; getTraitValue: (key: TraitKey) => number }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-3xl shadow-xl p-8 border border-brand-primary/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-brand-primary" />
          Your Learning Profile
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {personalityReview?.summary || 'Complete the assessment quiz to get personalized insights about your learning profile.'}
        </p>
      </div>

      {/* Strengths */}
      {personalityReview?.strengths && personalityReview.strengths.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-500" />
            Your Strengths
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {personalityReview.strengths.map((strength: any, index: number) => (
              <motion.div
                key={strength.trait}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-green-50 rounded-xl p-4 border border-green-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {TRAIT_DEFINITIONS[strength.trait as TraitKey]?.name || strength.trait}
                  </span>
                  <span className="text-green-600 font-bold">{Math.round(strength.value * 100)}%</span>
                </div>
                <p className="text-sm text-gray-600">{strength.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Areas to Improve */}
      {personalityReview?.areasToImprove && personalityReview.areasToImprove.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-blue-500" />
            Growth Opportunities
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {personalityReview.areasToImprove.map((area: any, index: number) => (
              <motion.div
                key={area.trait}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-orange-50 rounded-xl p-4 border border-orange-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {TRAIT_DEFINITIONS[area.trait as TraitKey]?.name || area.trait}
                  </span>
                  <span className="text-orange-600 font-bold">{Math.round(area.value * 100)}%</span>
                </div>
                <p className="text-sm text-gray-600">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Target className="w-7 h-7 text-brand-primary" />
          Personalized Recommendations
        </h3>
        <ul className="space-y-3">
          {[
            personalityReview?.primaryLearningStyle === 'visual' && 'Use mind maps, diagrams, and video content to maximize learning retention.',
            personalityReview?.primaryLearningStyle === 'auditory' && 'Listen to podcasts, lectures, and audio summaries for effective learning.',
            personalityReview?.primaryLearningStyle === 'kinesthetic' && 'Engage with interactive content, practice problems, and hands-on activities.',
            personalityReview?.studyApproach === 'collaborative' && 'Join study groups and participate in peer discussions for better engagement.',
            personalityReview?.studyApproach === 'solo' && 'Create a quiet, focused study environment for maximum productivity.',
            personalityReview?.studyApproach === 'competitive' && 'Track your progress on leaderboards and compete in timed quizzes.',
            personalityReview?.pacePreference === 'deep_focus' && 'Schedule longer study sessions with minimal interruptions.',
            personalityReview?.pacePreference === 'micro_sessions' && 'Use the Pomodoro technique with short, focused study intervals.',
            getTraitValue('gamification_response') >= 0.7 && 'Enable streaks, badges, and XP tracking to stay motivated.',
            getTraitValue('competition_drive') >= 0.7 && 'Challenge yourself with mock tests and compete with peers.'
          ].filter(Boolean).map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
