import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Brain,
  BookOpen,
  Award,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';

interface AnalyticsData {
  studyTime: {
    daily: Array<{ date: string; hours: number; sessions: number }>;
    weekly: Array<{ week: string; hours: number }>;
    monthly: Array<{ month: string; hours: number }>;
  };
  performance: {
    subjects: Array<{ subject: string; score: number; improvement: number; color: string }>;
    tests: Array<{ date: string; score: number; subject: string; difficulty: string }>;
    trends: Array<{ period: string; performance: number; prediction: number }>;
  };
  learning: {
    styles: { visual: number; auditory: number; reading: number; kinesthetic: number };
    effectiveness: Array<{ style: string; retention: number; engagement: number }>;
    patterns: Array<{ timeOfDay: string; focus: number; productivity: number }>;
  };
  goals: {
    completed: number;
    inProgress: number;
    total: number;
    progress: Array<{ goal: string; progress: number; deadline: string }>;
  };
  insights: Array<{
    type: 'strength' | 'weakness' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    priority: number;
  }>;
}

interface AdvancedAnalyticsDashboardProps {
  userId?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onExportData?: () => void;
}

export function AdvancedAnalyticsDashboard({
  userId,
  timeRange = 'month',
  onExportData
}: AdvancedAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'time' | 'engagement' | 'prediction'>('performance');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'predictions' | 'insights'>('overview');
  const [filters, setFilters] = useState({
    subjects: [] as string[],
    difficulty: [] as string[],
    timeRange: timeRange
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockData: AnalyticsData = {
      studyTime: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          hours: Math.random() * 8 + 1,
          sessions: Math.floor(Math.random() * 5) + 1
        })).reverse(),
        weekly: Array.from({ length: 12 }, (_, i) => ({
          week: `Week ${i + 1}`,
          hours: Math.random() * 40 + 10
        })),
        monthly: Array.from({ length: 6 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          hours: Math.random() * 160 + 40
        }))
      },
      performance: {
        subjects: [
          { subject: 'Mathematics', score: 85, improvement: 12, color: '#3b82f6' },
          { subject: 'Physics', score: 78, improvement: -3, color: '#10b981' },
          { subject: 'Chemistry', score: 92, improvement: 8, color: '#f59e0b' },
          { subject: 'Biology', score: 88, improvement: 15, color: '#8b5cf6' },
          { subject: 'English', score: 90, improvement: 5, color: '#ef4444' }
        ],
        tests: Array.from({ length: 20 }, (_, i) => ({
          date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          score: Math.random() * 40 + 60,
          subject: ['Math', 'Physics', 'Chemistry', 'Biology', 'English'][Math.floor(Math.random() * 5)],
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
        })).reverse(),
        trends: Array.from({ length: 12 }, (_, i) => ({
          period: `Period ${i + 1}`,
          performance: Math.random() * 20 + 70,
          prediction: Math.random() * 15 + 75
        }))
      },
      learning: {
        styles: { visual: 75, auditory: 60, reading: 85, kinesthetic: 45 },
        effectiveness: [
          { style: 'Visual', retention: 82, engagement: 78 },
          { style: 'Auditory', retention: 65, engagement: 70 },
          { style: 'Reading', retention: 90, engagement: 85 },
          { style: 'Kinesthetic', retention: 58, engagement: 75 }
        ],
        patterns: Array.from({ length: 24 }, (_, i) => ({
          timeOfDay: `${i}:00`,
          focus: Math.sin((i - 6) * Math.PI / 12) * 30 + 70,
          productivity: Math.sin((i - 8) * Math.PI / 10) * 25 + 65
        }))
      },
      goals: {
        completed: 8,
        inProgress: 5,
        total: 15,
        progress: [
          { goal: 'Master Calculus', progress: 85, deadline: '2024-06-30' },
          { goal: 'Complete Physics Course', progress: 60, deadline: '2024-07-15' },
          { goal: 'Improve English Writing', progress: 40, deadline: '2024-08-01' },
          { goal: 'Chemistry Fundamentals', progress: 90, deadline: '2024-05-30' }
        ]
      },
      insights: [
        {
          type: 'strength',
          title: 'Excellent Reading Comprehension',
          description: 'Your reading-based learning shows 90% retention rate',
          impact: 'high',
          priority: 1
        },
        {
          type: 'weakness',
          title: 'Physics Performance Declining',
          description: 'Physics scores dropped 3% this month',
          impact: 'medium',
          priority: 2
        },
        {
          type: 'recommendation',
          title: 'Optimize Study Schedule',
          description: 'Your peak performance is between 9-11 AM',
          impact: 'high',
          priority: 3
        },
        {
          type: 'achievement',
          title: 'Study Streak Milestone',
          description: 'Maintained daily study habit for 30 days!',
          impact: 'low',
          priority: 4
        }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [userId, timeRange]);

  // Calculate key metrics
  const keyMetrics = useMemo(() => {
    if (!analyticsData) return null;

    const totalStudyTime = analyticsData.studyTime.daily.reduce((sum, day) => sum + day.hours, 0);
    const avgDailyTime = totalStudyTime / analyticsData.studyTime.daily.length;
    const avgScore = analyticsData.performance.subjects.reduce((sum, subject) => sum + subject.score, 0) / analyticsData.performance.subjects.length;
    const goalsCompletionRate = (analyticsData.goals.completed / analyticsData.goals.total) * 100;

    return {
      totalStudyTime: Math.round(totalStudyTime),
      avgDailyTime: Math.round(avgDailyTime * 10) / 10,
      avgScore: Math.round(avgScore),
      goalsCompletionRate: Math.round(goalsCompletionRate)
    };
  }, [analyticsData]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your learning journey</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLoading(true)}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={onExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {(['overview', 'detailed', 'predictions', 'insights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      {keyMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Study Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{keyMetrics.totalStudyTime}h</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">+12% vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{keyMetrics.avgScore}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">+5% improvement</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{keyMetrics.avgDailyTime}h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Consistent pace</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{keyMetrics.goalsCompletionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">{analyticsData.goals.completed} of {analyticsData.goals.total}</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trends</h3>
            <div className="flex space-x-2">
              {(['performance', 'time', 'engagement'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData?.performance.trends}>
              <defs>
                <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="performance"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorPerformance)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="prediction"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorPrediction)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Subject Performance</h3>
          
          <div className="space-y-4">
            {analyticsData?.performance.subjects.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {subject.subject}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {subject.score}%
                  </span>
                  <div className={`flex items-center space-x-1 ${
                    subject.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subject.improvement >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    <span className="text-xs">{Math.abs(subject.improvement)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Patterns & Insights */}
      {activeTab === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Style Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Learning Style Analysis</h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={Object.entries(analyticsData?.learning.styles || {}).map(([key, value]) => ({
                subject: key.charAt(0).toUpperCase() + key.slice(1),
                score: value
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Learning Style"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Patterns */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Daily Focus Patterns</h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData?.learning.patterns}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timeOfDay"
                  interval={2}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="focus"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI-Powered Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData?.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 ${
                  insight.type === 'strength' ? 'border-green-500' :
                  insight.type === 'weakness' ? 'border-red-500' :
                  insight.type === 'recommendation' ? 'border-blue-500' :
                  'border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      insight.type === 'strength' ? 'bg-green-100 text-green-600' :
                      insight.type === 'weakness' ? 'bg-red-100 text-red-600' :
                      insight.type === 'recommendation' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {insight.type === 'strength' && <TrendingUp className="w-5 h-5" />}
                      {insight.type === 'weakness' && <TrendingDown className="w-5 h-5" />}
                      {insight.type === 'recommendation' && <Brain className="w-5 h-5" />}
                      {insight.type === 'achievement' && <Award className="w-5 h-5" />}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}