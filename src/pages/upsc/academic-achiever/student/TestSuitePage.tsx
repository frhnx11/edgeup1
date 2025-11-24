import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, FileText, Trophy, TrendingUp, 
  Calendar, ChevronRight, Award, Target, BarChart2,
  Timer, Users, Star, Zap, Shield, Brain,
  PenTool, FileCheck, History, Filter, Search,
  AlertCircle, CheckCircle, XCircle, Lock, Unlock,
  Sparkles, Bot, Gamepad2, Moon, Sun, Mic,
  PlayCircle, PauseCircle, Volume2, Bell,
  ArrowUpRight, Flame, Medal, Crown, Rocket,
  RefreshCw, Eye, Grid as GridIcon, List
} from 'lucide-react';

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  tests: Test[];
}

interface Test {
  id: string;
  title: string;
  type: 'prelims-gs' | 'prelims-csat' | 'mains-essay' | 'mains-gs' | 'topic-wise' | 'previous-year';
  subject?: string;
  questions: number;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  attempted?: boolean;
  score?: number;
  totalScore?: number;
  lastAttempted?: string;
  isPremium?: boolean;
  year?: number;
  paper?: string;
}

interface TestStats {
  totalTests: number;
  attemptedTests: number;
  averageScore: number;
  streak: number;
  rank: number;
  improvement: number;
  weeklyGoal: number;
  weeklyProgress: number;
  badges: Badge[];
  nextMilestone: string;
  studyTime: number;
  accuracy: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AIRecommendation {
  testId: string;
  reason: string;
  confidence: number;
  expectedImprovement: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  icon: any;
}

export function TestSuitePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');

  const stats: TestStats = {
    totalTests: 245,
    attemptedTests: 48,
    averageScore: 72,
    streak: 5,
    rank: 1234,
    improvement: 15,
    weeklyGoal: 10,
    weeklyProgress: 7,
    badges: [
      { id: '1', name: 'First Steps', description: 'Complete your first test', icon: Trophy, earned: true, earnedDate: '2024-01-15', rarity: 'common' },
      { id: '2', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: Flame, earned: true, earnedDate: '2024-02-01', rarity: 'rare' },
      { id: '3', name: 'Perfect Score', description: 'Score 100% on any test', icon: Star, earned: false, rarity: 'epic' },
      { id: '4', name: 'UPSC Champion', description: 'Complete all prelims mock tests', icon: Crown, earned: false, rarity: 'legendary' }
    ],
    nextMilestone: '50 tests completed',
    studyTime: 124,
    accuracy: 78
  };

  const testCategories: TestCategory[] = [
    {
      id: 'prelims',
      name: 'Prelims Tests',
      description: 'Complete mock tests for UPSC Prelims',
      icon: BookOpen,
      color: 'blue',
      tests: [
        {
          id: 'prelims-gs-1',
          title: 'General Studies Paper I - Full Test 1',
          type: 'prelims-gs',
          questions: 100,
          duration: 120,
          difficulty: 'medium',
          attempted: true,
          score: 78,
          totalScore: 100,
          lastAttempted: '2 days ago'
        },
        {
          id: 'prelims-gs-2',
          title: 'General Studies Paper I - Full Test 2',
          type: 'prelims-gs',
          questions: 100,
          duration: 120,
          difficulty: 'hard',
          attempted: false
        },
        {
          id: 'prelims-csat-1',
          title: 'CSAT Paper II - Full Test 1',
          type: 'prelims-csat',
          questions: 80,
          duration: 120,
          difficulty: 'medium',
          attempted: true,
          score: 65,
          totalScore: 80,
          lastAttempted: '5 days ago'
        },
        {
          id: 'prelims-csat-2',
          title: 'CSAT Paper II - Full Test 2',
          type: 'prelims-csat',
          questions: 80,
          duration: 120,
          difficulty: 'medium',
          attempted: false
        }
      ]
    },
    {
      id: 'mains',
      name: 'Mains Tests',
      description: 'Essay and GS papers for UPSC Mains',
      icon: PenTool,
      color: 'purple',
      tests: [
        {
          id: 'mains-essay-1',
          title: 'Essay Paper - Philosophy & Ethics',
          type: 'mains-essay',
          questions: 2,
          duration: 180,
          difficulty: 'hard',
          attempted: false,
          isPremium: true
        },
        {
          id: 'mains-gs1-1',
          title: 'GS Paper I - Indian Heritage & Culture',
          type: 'mains-gs',
          paper: 'GS1',
          questions: 20,
          duration: 180,
          difficulty: 'hard',
          attempted: false
        },
        {
          id: 'mains-gs2-1',
          title: 'GS Paper II - Governance & Constitution',
          type: 'mains-gs',
          paper: 'GS2',
          questions: 20,
          duration: 180,
          difficulty: 'hard',
          attempted: false
        },
        {
          id: 'mains-gs3-1',
          title: 'GS Paper III - Economy & Technology',
          type: 'mains-gs',
          paper: 'GS3',
          questions: 20,
          duration: 180,
          difficulty: 'hard',
          attempted: false,
          isPremium: true
        },
        {
          id: 'mains-gs4-1',
          title: 'GS Paper IV - Ethics & Integrity',
          type: 'mains-gs',
          paper: 'GS4',
          questions: 12,
          duration: 180,
          difficulty: 'medium',
          attempted: true,
          score: 145,
          totalScore: 250,
          lastAttempted: '1 week ago'
        }
      ]
    },
    {
      id: 'topic-wise',
      name: 'Topic-wise Tests',
      description: 'Subject-specific practice tests',
      icon: Target,
      color: 'green',
      tests: [
        {
          id: 'topic-history-1',
          title: 'Ancient Indian History',
          type: 'topic-wise',
          subject: 'History',
          questions: 30,
          duration: 30,
          difficulty: 'easy',
          attempted: true,
          score: 24,
          totalScore: 30,
          lastAttempted: '3 days ago'
        },
        {
          id: 'topic-polity-1',
          title: 'Fundamental Rights & Duties',
          type: 'topic-wise',
          subject: 'Polity',
          questions: 25,
          duration: 25,
          difficulty: 'medium',
          attempted: false
        },
        {
          id: 'topic-geography-1',
          title: 'Indian Monsoon System',
          type: 'topic-wise',
          subject: 'Geography',
          questions: 30,
          duration: 30,
          difficulty: 'medium',
          attempted: true,
          score: 22,
          totalScore: 30,
          lastAttempted: '1 week ago'
        },
        {
          id: 'topic-economy-1',
          title: 'Banking & Financial Markets',
          type: 'topic-wise',
          subject: 'Economy',
          questions: 25,
          duration: 25,
          difficulty: 'hard',
          attempted: false
        },
        {
          id: 'topic-science-1',
          title: 'Space Technology & ISRO',
          type: 'topic-wise',
          subject: 'Science & Tech',
          questions: 20,
          duration: 20,
          difficulty: 'easy',
          attempted: false
        },
        {
          id: 'topic-environment-1',
          title: 'Climate Change & Conservation',
          type: 'topic-wise',
          subject: 'Environment',
          questions: 25,
          duration: 25,
          difficulty: 'medium',
          attempted: false,
          isPremium: true
        }
      ]
    },
    {
      id: 'previous-year',
      name: 'Previous Year Papers',
      description: 'Actual UPSC exam papers',
      icon: History,
      color: 'amber',
      tests: [
        {
          id: 'pyq-2023-prelims',
          title: 'UPSC Prelims 2023 - GS Paper I',
          type: 'previous-year',
          year: 2023,
          questions: 100,
          duration: 120,
          difficulty: 'hard',
          attempted: true,
          score: 82,
          totalScore: 100,
          lastAttempted: '2 weeks ago'
        },
        {
          id: 'pyq-2023-csat',
          title: 'UPSC Prelims 2023 - CSAT',
          type: 'previous-year',
          year: 2023,
          questions: 80,
          duration: 120,
          difficulty: 'medium',
          attempted: false
        },
        {
          id: 'pyq-2022-prelims',
          title: 'UPSC Prelims 2022 - GS Paper I',
          type: 'previous-year',
          year: 2022,
          questions: 100,
          duration: 120,
          difficulty: 'hard',
          attempted: false,
          isPremium: true
        },
        {
          id: 'pyq-2021-prelims',
          title: 'UPSC Prelims 2021 - GS Paper I',
          type: 'previous-year',
          year: 2021,
          questions: 100,
          duration: 120,
          difficulty: 'hard',
          attempted: false
        }
      ]
    }
  ];

  const startTest = (test: Test) => {
    // Store test details in localStorage
    localStorage.setItem('currentTest', JSON.stringify(test));
    navigate('/test-interface');
  };

  const viewResults = (testId: string) => {
    navigate(`/test-results/${testId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case 'prelims-gs':
      case 'prelims-csat':
        return <BookOpen className="w-4 h-4" />;
      case 'mains-essay':
      case 'mains-gs':
        return <PenTool className="w-4 h-4" />;
      case 'topic-wise':
        return <Target className="w-4 h-4" />;
      case 'previous-year':
        return <History className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // AI Recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      testId: 'topic-polity-1',
      reason: 'You scored 65% in your last Polity test. This focused practice will help improve your fundamental rights understanding.',
      confidence: 92,
      expectedImprovement: 15
    },
    {
      testId: 'prelims-gs-2',
      reason: 'It\'s been 5 days since your last full-length test. Regular practice maintains exam readiness.',
      confidence: 88,
      expectedImprovement: 10
    },
    {
      testId: 'topic-economy-1',
      reason: 'Economy is your weakest subject (68% avg). Focus here for maximum score improvement.',
      confidence: 95,
      expectedImprovement: 20
    }
  ];

  // Achievements
  const achievements: Achievement[] = [
    {
      id: 'a1',
      title: 'Test Marathon',
      description: 'Complete 10 tests in a week',
      progress: stats.weeklyProgress,
      total: 10,
      reward: '2x XP for next test',
      icon: Rocket
    },
    {
      id: 'a2',
      title: 'Accuracy Master',
      description: 'Maintain 80% accuracy for 5 consecutive tests',
      progress: 3,
      total: 5,
      reward: 'Unlock advanced analytics',
      icon: Target
    },
    {
      id: 'a3',
      title: 'Subject Expert',
      description: 'Score above 90% in all subjects',
      progress: 4,
      total: 6,
      reward: 'Expert badge + Leaderboard boost',
      icon: Medal
    }
  ];

  const filteredTests = testCategories.flatMap(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return [];
    
    return category.tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.subject?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || test.difficulty === difficultyFilter;
      const matchesPremium = !showOnlyFree || !test.isPremium;
      
      return matchesSearch && matchesDifficulty && matchesPremium;
    }).map(test => ({ ...test, category: category.name, categoryColor: category.color }));
  });

  // Voice command handler
  useEffect(() => {
    if (voiceEnabled && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (command.includes('start test')) {
          // Handle voice command
        }
      };
      recognition.start();
      return () => recognition.stop();
    }
  }, [voiceEnabled]);

  return (
    <>
      <div className={`space-y-6 ${darkMode ? 'dark' : ''}`}>
        {/* Enhanced Header with Animated Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-8 text-white overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent rounded-full filter blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">Test Suite</h1>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                </div>
                <p className="opacity-90 text-lg">AI-Powered UPSC Test Platform</p>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      voiceEnabled ? 'bg-green-500/30' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-right">
                    <p className="text-3xl font-bold">#{stats.rank}</p>
                    <p className="text-sm opacity-80">All India Rank</p>
                  </div>
                  <Trophy className="w-12 h-12 text-yellow-300" />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-orange-300" />
                  <span className="font-semibold">{stats.streak} Day Streak</span>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Stats Grid with Animations */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: FileCheck, label: 'Tests Taken', value: `${stats.attemptedTests}/${stats.totalTests}`, delay: 0 },
                { icon: Target, label: 'Avg Score', value: `${stats.averageScore}%`, delay: 0.1 },
                { icon: Zap, label: 'Weekly Goal', value: `${stats.weeklyProgress}/${stats.weeklyGoal}`, delay: 0.2 },
                { icon: TrendingUp, label: 'Improvement', value: `+${stats.improvement}%`, delay: 0.3 },
                { icon: Brain, label: 'Accuracy', value: `${stats.accuracy}%`, delay: 0.4 },
                { icon: Timer, label: 'Study Time', value: `${stats.studyTime}h`, delay: 0.5 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4" />
                    <p className="text-sm">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Weekly Progress Bar */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weekly Test Goal</span>
                <span className="text-sm">{stats.weeklyProgress} / {stats.weeklyGoal} tests</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations Section */}
        {showAIRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-6 border border-brand-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/20 rounded-lg">
                  <Bot className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-xl font-semibold">AI Recommendations</h2>
              </div>
              <button
                onClick={() => setShowAIRecommendations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiRecommendations.map((rec, index) => {
                const test = testCategories.flatMap(c => c.tests).find(t => t.id === rec.testId);
                if (!test) return null;
                
                return (
                  <motion.div
                    key={rec.testId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium text-brand-primary">
                          {rec.confidence}% Match
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">
                        +{rec.expectedImprovement}% Expected
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                    
                    <button
                      onClick={() => startTest(test)}
                      className="w-full px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors text-sm font-medium"
                    >
                      Start Recommended Test
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Badges & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Medal className="w-6 h-6 text-brand-primary" />
                Your Badges
              </h2>
              <span className="text-sm text-gray-500">
                {stats.badges.filter(b => b.earned).length} / {stats.badges.length} Earned
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {stats.badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={badge.earned ? { scale: 1.1 } : {}}
                  className={`relative ${!badge.earned && 'opacity-40'}`}
                >
                  <div className={`
                    p-4 rounded-xl flex flex-col items-center text-center
                    ${badge.earned ? 'bg-gradient-to-br' : 'bg-gray-100'}
                    ${badge.rarity === 'common' && badge.earned && 'from-gray-100 to-gray-200'}
                    ${badge.rarity === 'rare' && badge.earned && 'from-blue-100 to-blue-200'}
                    ${badge.rarity === 'epic' && badge.earned && 'from-purple-100 to-purple-200'}
                    ${badge.rarity === 'legendary' && badge.earned && 'from-yellow-100 to-yellow-200'}
                  `}>
                    <badge.icon className={`w-8 h-8 mb-2 ${
                      badge.earned 
                        ? badge.rarity === 'legendary' ? 'text-yellow-600' 
                        : badge.rarity === 'epic' ? 'text-purple-600'
                        : badge.rarity === 'rare' ? 'text-blue-600'
                        : 'text-gray-600'
                      : 'text-gray-400'
                    }`} />
                    <p className="text-xs font-medium">{badge.name}</p>
                    {!badge.earned && <Lock className="w-4 h-4 absolute top-2 right-2 text-gray-400" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Active Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-brand-primary" />
                Active Achievements
              </h2>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="text-sm text-brand-primary hover:text-brand-secondary"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <achievement.icon className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((achievement.progress / achievement.total) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-brand-primary mt-1">Reward: {achievement.reward}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="flex gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/test-history')}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <History className="w-5 h-5 text-brand-primary group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Test History</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <BarChart2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Analytics</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">New</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm hover:shadow-lg transition-all border border-amber-200"
          >
            <Crown className="w-5 h-5 text-amber-600 group-hover:animate-bounce" />
            <span className="font-medium text-amber-900">Leaderboard</span>
            <span className="text-xs text-amber-700">Top 5%</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="font-medium">Schedule</span>
          </motion.button>
        </div>

        {/* Enhanced Filters with View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests, topics, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Category Pills */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {['all', ...testCategories.map(c => c.id)].map((catId) => (
                  <button
                    key={catId}
                    onClick={() => setSelectedCategory(catId)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedCategory === catId
                        ? 'bg-white text-brand-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {catId === 'all' ? 'All' : testCategories.find(c => c.id === catId)?.name}
                  </button>
                ))}
              </div>
              
              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              
              {/* Toggle Buttons */}
              <button
                onClick={() => setShowOnlyFree(!showOnlyFree)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showOnlyFree 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showOnlyFree ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Free Only
              </button>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`p-2 rounded ${selectedView === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <GridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  className={`p-2 rounded ${selectedView === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Categories */}
        {selectedCategory === 'all' ? (
          testCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                    <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <button className="text-brand-primary hover:text-brand-secondary font-medium text-sm">
                  View All
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tests.slice(0, 3).map((test) => (
                  <TestCard key={test.id} test={test} onStart={startTest} onViewResults={viewResults} />
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} onStart={startTest} onViewResults={viewResults} />
            ))}
          </div>
        )}

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No tests found matching your criteria</p>
          </div>
        )}
      </div>
    </>
  );
}

interface TestCardProps {
  test: Test & { category?: string; categoryColor?: string };
  onStart: (test: Test) => void;
  onViewResults: (testId: string) => void;
}

function TestCard({ test, onStart, onViewResults }: TestCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200';
      case 'hard':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case 'prelims-gs':
      case 'prelims-csat':
        return <BookOpen className="w-5 h-5" />;
      case 'mains-essay':
      case 'mains-gs':
        return <PenTool className="w-5 h-5" />;
      case 'topic-wise':
        return <Target className="w-5 h-5" />;
      case 'previous-year':
        return <History className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-brand-primary/10 rounded-lg"
            >
              {getTestIcon(test.type)}
            </motion.div>
            <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(test.difficulty)}`}>
              {test.difficulty}
            </span>
            {test.isPremium && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1"
              >
                <Crown className="w-3 h-3" />
                Premium
              </motion.span>
            )}
          </div>
          {test.attempted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-1.5 bg-green-100 rounded-full"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </motion.div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-lg mb-2">{test.title}</h3>
        
        {test.subject && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">{test.subject}</span>
            {test.year && <span className="text-xs text-gray-400">• {test.year}</span>}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-primary" />
            <span className="font-medium">{test.questions}</span>
            <span className="text-gray-400">Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span className="font-medium">{test.duration}</span>
            <span className="text-gray-400">mins</span>
          </div>
        </div>

        {test.attempted && test.score !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Previous Score</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  {Math.round((test.score / (test.totalScore || 1)) * 100)}%
                </span>
                <span className="text-xs text-gray-500">
                  ({test.score}/{test.totalScore})
                </span>
              </div>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(test.score / (test.totalScore || 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </motion.div>
            </div>
            {test.lastAttempted && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {test.lastAttempted}
              </p>
            )}
          </motion.div>
        )}

        <div className="flex gap-2">
          {test.attempted ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStart(test)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-md transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewResults(test.id)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Results
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(test)}
              className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                test.isPremium
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:shadow-lg'
              }`}
            >
              {test.isPremium ? (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock & Start
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Start Test
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}