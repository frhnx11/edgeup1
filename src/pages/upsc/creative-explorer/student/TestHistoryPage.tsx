import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Trophy, Target, TrendingUp, TrendingDown,
  Filter, Search, Download, BarChart2, PieChart, Activity,
  ChevronRight, Award, BookOpen, FileText, Eye, RefreshCw,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TestHistory {
  id: string;
  title: string;
  type: string;
  date: string;
  score: number;
  totalScore: number;
  percentage: number;
  rank: number;
  timeSpent: number;
  questions: {
    total: number;
    attempted: number;
    correct: number;
    wrong: number;
    skipped: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  improvement: number;
}

interface PerformanceStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  subjectWiseAverage: { subject: string; average: number }[];
}

export function TestHistoryPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailedStats, setShowDetailedStats] = useState(true);

  // Mock test history data
  const testHistory: TestHistory[] = [
    {
      id: 'test-1',
      title: 'UPSC Prelims 2023 - GS Paper I',
      type: 'Previous Year',
      date: '2024-02-15',
      score: 82,
      totalScore: 100,
      percentage: 82,
      rank: 234,
      timeSpent: 7080, // seconds
      questions: { total: 100, attempted: 98, correct: 82, wrong: 16, skipped: 2 },
      difficulty: 'hard',
      improvement: 5
    },
    {
      id: 'test-2',
      title: 'Ancient Indian History',
      type: 'Topic-wise',
      date: '2024-02-13',
      score: 24,
      totalScore: 30,
      percentage: 80,
      rank: 456,
      timeSpent: 1680,
      questions: { total: 30, attempted: 30, correct: 24, wrong: 6, skipped: 0 },
      difficulty: 'easy',
      improvement: -2
    },
    {
      id: 'test-3',
      title: 'CSAT Paper II - Full Test 1',
      type: 'Prelims',
      date: '2024-02-10',
      score: 65,
      totalScore: 80,
      percentage: 81.25,
      rank: 178,
      timeSpent: 6900,
      questions: { total: 80, attempted: 78, correct: 65, wrong: 13, skipped: 2 },
      difficulty: 'medium',
      improvement: 3
    },
    {
      id: 'test-4',
      title: 'Indian Monsoon System',
      type: 'Topic-wise',
      date: '2024-02-08',
      score: 22,
      totalScore: 30,
      percentage: 73.33,
      rank: 567,
      timeSpent: 1560,
      questions: { total: 30, attempted: 29, correct: 22, wrong: 7, skipped: 1 },
      difficulty: 'medium',
      improvement: 0
    },
    {
      id: 'test-5',
      title: 'GS Paper IV - Ethics & Integrity',
      type: 'Mains',
      date: '2024-02-05',
      score: 145,
      totalScore: 250,
      percentage: 58,
      rank: 890,
      timeSpent: 10200,
      questions: { total: 12, attempted: 12, correct: 8, wrong: 4, skipped: 0 },
      difficulty: 'hard',
      improvement: -5
    }
  ];

  const performanceStats: PerformanceStats = {
    totalTests: 48,
    averageScore: 75.4,
    bestScore: 92,
    worstScore: 45,
    totalTimeSpent: 124560, // seconds
    currentStreak: 5,
    longestStreak: 12,
    subjectWiseAverage: [
      { subject: 'Indian Polity', average: 78 },
      { subject: 'History', average: 82 },
      { subject: 'Geography', average: 75 },
      { subject: 'Economy', average: 68 },
      { subject: 'Science & Tech', average: 72 },
      { subject: 'Current Affairs', average: 80 }
    ]
  };

  // Chart data
  const scoreProgressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score %',
        data: [65, 68, 72, 70, 75, 78],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const subjectPerformanceData = {
    labels: performanceStats.subjectWiseAverage.map(s => s.subject),
    datasets: [
      {
        label: 'Average Score',
        data: performanceStats.subjectWiseAverage.map(s => s.average),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  };

  const accuracyData = {
    labels: ['Correct', 'Wrong', 'Skipped'],
    datasets: [
      {
        data: [75, 20, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }
    ]
  };

  const filteredTests = testHistory.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || test.title.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const viewTestDetails = (testId: string) => {
    navigate(`/test-results/${testId}`);
  };

  const retakeTest = (test: TestHistory) => {
    // Store test info and navigate to test interface
    localStorage.setItem('currentTest', JSON.stringify({
      id: test.id,
      title: test.title,
      type: test.type,
      questions: test.questions.total,
      duration: Math.ceil(test.timeSpent / 60)
    }));
    navigate('/test-interface');
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Test History & Analytics</h1>
              <p className="opacity-90">Track your progress and performance over time</p>
            </div>
            <Activity className="w-12 h-12 opacity-80" />
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-primary/10 rounded-lg">
                <Trophy className="w-6 h-6 text-brand-primary" />
              </div>
              <span className="text-sm text-green-600 font-medium">+3.2%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{performanceStats.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">{performanceStats.totalTests}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{performanceStats.bestScore}%</p>
            <p className="text-sm text-gray-600">Best Score</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-amber-600">Current</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{performanceStats.currentStreak}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.floor(performanceStats.totalTimeSpent / 3600)}h</p>
            <p className="text-sm text-gray-600">Total Time</p>
          </motion.div>
        </div>

        {/* Analytics Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(['week', 'month', 'year', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedPeriod === period
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <BarChart2 className="w-4 h-4 text-gray-700" />
            {showDetailedStats ? 'Hide' : 'Show'} Analytics
          </button>
        </div>

        {/* Detailed Analytics */}
        {showDetailedStats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Progress</h3>
              <Line 
                data={scoreProgressData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Score: ${context.parsed.y}%`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <Bar 
                data={subjectPerformanceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Average: ${context.parsed.y}%`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Accuracy Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Accuracy</h3>
              <Pie 
                data={accuracyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.parsed}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Test History Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  <option value="polity">Indian Polity</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="economy">Economy</option>
                  <option value="science">Science & Tech</option>
                </select>
                
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <motion.tr
                    key={test.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(test.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {test.score}/{test.totalScore}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          test.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          test.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {test.percentage}%
                        </span>
                        {test.improvement !== 0 && (
                          <span className={`text-xs flex items-center gap-0.5 ${
                            test.improvement > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {test.improvement > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(test.improvement)}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      #{test.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {test.questions.correct}
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-500" />
                          {test.questions.wrong}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-gray-400" />
                          {test.questions.skipped}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {Math.floor(test.timeSpent / 60)}m
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewTestDetails(test.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => retakeTest(test)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Retake Test"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}