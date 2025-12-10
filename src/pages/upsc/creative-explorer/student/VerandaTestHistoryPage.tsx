import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, Calendar, Clock, Trophy, TrendingUp, BarChart3,
  Filter, Search, Eye, RotateCcw, Download, Share2,
  ChevronLeft, ChevronRight, Grid, List, Star, Target,
  CheckCircle, AlertCircle, BookmarkCheck, Award
} from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';

interface TestHistory {
  id: string;
  title: string;
  type: 'banking' | 'ssc' | 'railway' | 'insurance';
  date: string;
  duration: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  rank: number;
  timeSpent: string;
  status: 'completed' | 'partial' | 'not-attempted';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface StatsData {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: string;
  currentStreak: number;
  bestStreak: number;
  improvementTrend: number;
}

export function VerandaTestHistoryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const [testHistory] = useState<TestHistory[]>([
    {
      id: '1',
      title: 'SBI PO Prelims - Mock Test 1',
      type: 'banking',
      date: '2024-01-15',
      duration: '60 mins',
      score: 78,
      totalQuestions: 100,
      percentage: 78,
      rank: 1234,
      timeSpent: '57m 30s',
      status: 'completed',
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'IBPS Clerk Prelims - Mock Test 1',
      type: 'banking',
      date: '2024-01-12',
      duration: '60 mins',
      score: 82,
      totalQuestions: 100,
      percentage: 82,
      rank: 987,
      timeSpent: '54m 15s',
      status: 'completed',
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'SSC CGL Tier 1 - Mock Test 1',
      type: 'ssc',
      date: '2024-01-10',
      duration: '60 mins',
      score: 72,
      totalQuestions: 100,
      percentage: 72,
      rank: 2156,
      timeSpent: '59m 45s',
      status: 'completed',
      difficulty: 'medium'
    },
    {
      id: '4',
      title: 'RRB NTPC CBT 1 - Mock Test 1',
      type: 'railway',
      date: '2024-01-08',
      duration: '90 mins',
      score: 65,
      totalQuestions: 100,
      percentage: 65,
      rank: 3421,
      timeSpent: '47m 20s',
      status: 'partial',
      difficulty: 'hard'
    },
    {
      id: '5',
      title: 'Banking Awareness - Practice Test',
      type: 'banking',
      date: '2024-01-05',
      duration: '30 mins',
      score: 85,
      totalQuestions: 50,
      percentage: 85,
      rank: 456,
      timeSpent: '28m 10s',
      status: 'completed',
      difficulty: 'easy'
    }
  ]);

  const [stats] = useState<StatsData>({
    totalTests: 15,
    averageScore: 76.4,
    bestScore: 89,
    totalTimeSpent: '12h 45m',
    currentStreak: 5,
    bestStreak: 8,
    improvementTrend: 12
  });

  // Filter and sort tests
  const filteredTests = testHistory
    .filter(test => {
      const matchesType = filterType === 'all' || test.type === filterType;
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'score':
          return b.percentage - a.percentage;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, startIndex + itemsPerPage);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'banking':
        return 'bg-blue-100 text-blue-700';
      case 'ssc':
        return 'bg-green-100 text-green-700';
      case 'railway':
        return 'bg-purple-100 text-purple-700';
      case 'insurance':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'partial':
        return 'text-amber-600';
      case 'not-attempted':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <History className="w-10 h-10" />
                Test History
              </h1>
              <p className="text-lg opacity-90">Track your progress and performance</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalTests}</div>
              <div className="text-sm opacity-80">Total Tests</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">{stats.averageScore}%</div>
              <div className="text-sm opacity-80">Avg Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">{stats.bestScore}%</div>
              <div className="text-sm opacity-80">Best Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">{stats.totalTimeSpent}</div>
              <div className="text-sm opacity-80">Time Spent</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm opacity-80">Streak</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">+{stats.improvementTrend}%</div>
              <div className="text-sm opacity-80">Improvement</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-xl font-bold">{stats.bestStreak}</div>
              <div className="text-sm opacity-80">Best Streak</div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="banking">Banking</option>
                <option value="ssc">SSC</option>
                <option value="railway">Railway</option>
                <option value="insurance">Insurance</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'title')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="title">Sort by Title</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test History List/Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Test</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTests.map((test, index) => (
                    <motion.tr
                      key={test.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{test.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${getTypeColor(test.type)}`}>
                              {test.type.toUpperCase()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(test.date)}</div>
                        <div className="text-xs text-gray-500">{test.duration}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {test.score}/{test.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-500">{test.percentage}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{test.timeSpent}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">#{test.rank}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 text-sm ${getStatusColor(test.status)}`}>
                          {test.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {test.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/veranda-test-results/${test.id}`)}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('/veranda-test-interface')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(test.type)}`}>
                      {test.type.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{formatDate(test.date)}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span className="font-medium">{test.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{test.timeSpent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rank:</span>
                      <span>#{test.rank}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className={`flex items-center gap-1 text-xs ${getStatusColor(test.status)}`}>
                      {test.status === 'completed' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {test.status}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/veranda-test-results/${test.id}`)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('/veranda-test-interface')}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTests.length)} of {filteredTests.length} tests
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      page === currentPage 
                        ? 'bg-purple-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}