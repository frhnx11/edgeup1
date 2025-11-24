import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, FileText, Trophy, TrendingUp, 
  Calendar, ChevronRight, Award, Target, BarChart2,
  Timer, Users, Star, Zap, Shield, Brain,
  PenTool, FileCheck, History, Search,
  AlertCircle, CheckCircle, PlayCircle, RefreshCw, Eye
} from 'lucide-react';

interface Test {
  id: string;
  title: string;
  type: 'banking' | 'ssc' | 'railway' | 'insurance' | 'government';
  subject?: string;
  questions: number;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  attempted?: boolean;
  score?: number;
  totalScore?: number;
  lastAttempted?: string;
}

interface TestStats {
  totalTests: number;
  attemptedTests: number;
  averageScore: number;
  streak: number;
  rank: number;
  improvement: number;
}

export function VerandaTestSuitePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stats: TestStats = {
    totalTests: 180,
    attemptedTests: 32,
    averageScore: 74,
    streak: 3,
    rank: 856,
    improvement: 12
  };

  const testCategories = [
    {
      id: 'banking',
      name: 'Banking Exams',
      description: 'SBI PO, IBPS, Clerk and other banking exams',
      icon: BookOpen,
      color: 'blue',
      tests: [
        {
          id: 'sbi-po-1',
          title: 'SBI PO Prelims - Mock Test 1',
          type: 'banking' as const,
          questions: 100,
          duration: 60,
          difficulty: 'medium' as const,
          attempted: true,
          score: 78,
          totalScore: 100,
          lastAttempted: '2 days ago'
        },
        {
          id: 'ibps-clerk-1',
          title: 'IBPS Clerk Prelims - Mock Test 1',
          type: 'banking' as const,
          questions: 100,
          duration: 60,
          difficulty: 'easy' as const,
          attempted: false
        }
      ]
    },
    {
      id: 'ssc',
      name: 'SSC Exams',
      description: 'SSC CGL, CHSL, MTS and other staff selection exams',
      icon: PenTool,
      color: 'green',
      tests: [
        {
          id: 'ssc-cgl-1',
          title: 'SSC CGL Tier 1 - Mock Test 1',
          type: 'ssc' as const,
          questions: 100,
          duration: 60,
          difficulty: 'medium' as const,
          attempted: true,
          score: 72,
          totalScore: 100,
          lastAttempted: '1 week ago'
        },
        {
          id: 'ssc-chsl-1',
          title: 'SSC CHSL Tier 1 - Mock Test 1',
          type: 'ssc' as const,
          questions: 100,
          duration: 60,
          difficulty: 'easy' as const,
          attempted: false
        }
      ]
    },
    {
      id: 'railway',
      name: 'Railway Exams',
      description: 'RRB NTPC, Group D, JE and other railway exams',
      icon: Target,
      color: 'purple',
      tests: [
        {
          id: 'rrb-ntpc-1',
          title: 'RRB NTPC CBT 1 - Mock Test 1',
          type: 'railway' as const,
          questions: 100,
          duration: 90,
          difficulty: 'medium' as const,
          attempted: false
        }
      ]
    }
  ];

  const startTest = (test: Test) => {
    localStorage.setItem('currentTest', JSON.stringify(test));
    navigate('/veranda-test-interface');
  };

  const viewResults = (testId: string) => {
    navigate(`/veranda-test-results/${testId}`);
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

  const filteredTests = testCategories.flatMap(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return [];
    
    return category.tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Veranda Test Suite</h1>
              <p className="opacity-90 text-lg">Government Exam Preparation Platform</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-right">
                  <p className="text-3xl font-bold">#{stats.rank}</p>
                  <p className="text-sm opacity-80">National Rank</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: FileCheck, label: 'Tests Taken', value: `${stats.attemptedTests}/${stats.totalTests}` },
              { icon: Target, label: 'Avg Score', value: `${stats.averageScore}%` },
              { icon: TrendingUp, label: 'Improvement', value: `+${stats.improvement}%` },
              { icon: Zap, label: 'Streak', value: `${stats.streak} days` },
              { icon: Brain, label: 'Accuracy', value: '76%' },
              { icon: Timer, label: 'Study Time', value: '89h' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4" />
                  <p className="text-sm">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/veranda-test-history')}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border"
          >
            <History className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Test History</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border"
          >
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Analytics</span>
          </motion.button>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 border"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {['all', ...testCategories.map(c => c.id)].map((catId) => (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === catId
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {catId === 'all' ? 'All' : testCategories.find(c => c.id === catId)?.name}
                </button>
              ))}
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
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View All
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tests.map((test) => (
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
    </DashboardLayout>
  );
}

interface TestCardProps {
  test: Test;
  onStart: (test: Test) => void;
  onViewResults: (testId: string) => void;
}

function TestCard({ test, onStart, onViewResults }: TestCardProps) {
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(test.difficulty)}`}>
            {test.difficulty}
          </span>
        </div>
        {test.attempted && (
          <div className="p-1.5 bg-green-100 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-lg mb-4">{test.title}</h3>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>{test.questions} Questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{test.duration} mins</span>
        </div>
      </div>

      {test.attempted && test.score !== undefined && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Previous Score</span>
            <span className="font-bold">{Math.round((test.score / (test.totalScore || 1)) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${(test.score / (test.totalScore || 1)) * 100}%` }}
            />
          </div>
          {test.lastAttempted && (
            <p className="text-xs text-gray-500 mt-2">{test.lastAttempted}</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {test.attempted ? (
          <>
            <button
              onClick={() => onStart(test)}
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={() => onViewResults(test.id)}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Results
            </button>
          </>
        ) : (
          <button
            onClick={() => onStart(test)}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Start Test
          </button>
        )}
      </div>
    </motion.div>
  );
}