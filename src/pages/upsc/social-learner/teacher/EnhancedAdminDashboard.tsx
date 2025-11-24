import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Brain,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Clock,
  BookOpen,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  TrendingDown,
  DollarSign,
  UserCheck,
  MessageSquare,
  FileText,
  Zap,
  Shield,
  Globe,
  Wifi,
  Database,
  Server
} from 'lucide-react';
import { StudentBatchAnalytics } from '../../../../components/upsc/common/analytics/StudentBatchAnalytics';
import { MentorAnalytics } from '../../../../components/upsc/common/analytics/MentorAnalytics';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'mentors'>('overview');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Simulate real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      // Update data here
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const overviewMetrics = [
    {
      title: 'Total Students',
      value: '2,458',
      change: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Across all batches'
    },
    {
      title: 'Active Mentors',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: GraduationCap,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Teaching staff'
    },
    {
      title: 'Avg. Performance',
      value: '84%',
      change: '+7%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      description: 'Student success rate'
    },
    {
      title: 'Study Hours',
      value: '45,678',
      change: '+18%',
      trend: 'up',
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      description: 'This month'
    }
  ];

  const quickActions = [
    {
      title: 'Mentor PASCO Assessment',
      description: 'Evaluate mentor teaching effectiveness',
      icon: Brain,
      gradient: 'from-brand-primary to-brand-secondary',
      action: () => navigate('/admin/mentor-pasco-test')
    },
    {
      title: 'Generate Reports',
      description: 'Export analytics and performance data',
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-600',
      action: () => navigate('/admin/reports')
    },
    {
      title: 'Student Analytics',
      description: 'Detailed batch performance insights',
      icon: Users,
      gradient: 'from-purple-500 to-indigo-600',
      action: () => setActiveTab('students')
    },
    {
      title: 'Mentor Comparison',
      description: 'Compare mentor performance metrics',
      icon: Award,
      gradient: 'from-orange-500 to-red-600',
      action: () => setActiveTab('mentors')
    }
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'students' as const, label: 'Student Analytics', icon: Users },
    { id: 'mentors' as const, label: 'Mentor Analytics', icon: GraduationCap }
  ];

  // Chart Data
  const enrollmentTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Student Enrollments',
        data: [120, 190, 250, 320, 380, 420, 480, 520, 580, 640, 720, 2458],
        borderColor: 'rgb(9, 77, 136)',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const performanceDistributionData = {
    labels: ['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Below Average (< 60%)'],
    datasets: [
      {
        data: [35, 42, 18, 5],
        backgroundColor: [
          'rgba(16, 172, 139, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 172, 139)',
          'rgb(59, 130, 246)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Students',
        data: [1850, 1920, 2100, 2050, 1980, 1200, 980],
        backgroundColor: 'rgba(9, 77, 136, 0.8)'
      },
      {
        label: 'Study Hours',
        data: [6500, 7200, 7800, 7400, 6900, 4200, 3500],
        backgroundColor: 'rgba(16, 172, 139, 0.8)'
      }
    ]
  };

  const systemHealthMetrics = [
    {
      name: 'API Response Time',
      value: '245ms',
      status: 'excellent',
      icon: Zap,
      percentage: 95
    },
    {
      name: 'Server Uptime',
      value: '99.9%',
      status: 'excellent',
      icon: Server,
      percentage: 99.9
    },
    {
      name: 'Database Health',
      value: 'Optimal',
      status: 'excellent',
      icon: Database,
      percentage: 98
    },
    {
      name: 'Network Status',
      value: 'Stable',
      status: 'good',
      icon: Wifi,
      percentage: 92
    }
  ];

  const recentActivities = [
    {
      type: 'enrollment',
      message: '45 new students enrolled',
      time: '2 minutes ago',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      type: 'alert',
      message: 'Batch A-12 performance dropped by 5%',
      time: '15 minutes ago',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      type: 'success',
      message: 'Mentor evaluation completed for 8 instructors',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'message',
      message: '12 new support tickets received',
      time: '2 hours ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      type: 'report',
      message: 'Monthly analytics report generated',
      time: '3 hours ago',
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  const upcomingTasks = [
    {
      title: 'Quarterly Performance Review',
      due: 'Tomorrow',
      priority: 'high',
      progress: 65
    },
    {
      title: 'Mentor Training Session',
      due: 'In 3 days',
      priority: 'medium',
      progress: 30
    },
    {
      title: 'Student Survey Analysis',
      due: 'In 5 days',
      priority: 'medium',
      progress: 80
    },
    {
      title: 'Curriculum Update Review',
      due: 'Next week',
      priority: 'low',
      progress: 15
    }
  ];

  const additionalMetrics = [
    {
      title: 'Course Completion Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Student Satisfaction',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Support Tickets',
      value: '89',
      change: '-12%',
      trend: 'down',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Revenue This Month',
      value: '$124.5K',
      change: '+22%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Resource Utilization',
      value: '73%',
      change: '+3%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent p-8 rounded-2xl text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Activity className="w-8 h-8" />
                Admin Dashboard
              </h1>
              <p className="text-white/90">Real-time analytics and comprehensive performance insights</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live Data</span>
                </div>
                <span>•</span>
                <span>Last updated: Just now</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Time Range Selector */}
              <div className="flex gap-1 bg-white/10 backdrop-blur p-1 rounded-lg">
                {['today', 'week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-4 py-2 rounded-md capitalize transition-all ${
                      timeRange === range
                        ? 'bg-white text-brand-primary font-semibold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className={`p-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                    </div>
                    {recentActivities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex gap-3">
                            <div className={`${activity.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewMetrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gradient-to-br ${metric.gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-white/80 text-sm font-medium">{metric.title}</p>
                          <p className="text-3xl font-bold mt-2">{metric.value}</p>
                        </div>
                        <Icon className="w-8 h-8 text-white/80" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 text-sm">{metric.description}</span>
                        <span className="text-white font-semibold text-sm">{metric.change}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={action.action}
                        className="group relative overflow-hidden p-6 bg-white border-2 border-gray-200 hover:border-transparent rounded-xl transition-all hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalMetrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className={`${metric.bgColor} p-5 rounded-xl border-2 border-gray-100 hover:shadow-lg transition-all cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon className="w-4 h-4" />
                          {metric.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                    Enrollment Trend (2024)
                  </h3>
                  <div className="h-64">
                    <Line
                      data={enrollmentTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>

                {/* Performance Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Performance Distribution
                  </h3>
                  <div className="h-64">
                    <Doughnut
                      data={performanceDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Weekly Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Weekly Activity Overview
                </h3>
                <div className="h-80">
                  <Bar
                    data={weeklyActivityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Recent Activity & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </span>
                    <button className="text-sm text-brand-primary hover:underline">View All</button>
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentActivities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.05 }}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className={`${activity.color} mt-1`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* System Health Monitoring */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    System Health
                  </h3>
                  <div className="space-y-4">
                    {systemHealthMetrics.map((metric, idx) => {
                      const Icon = metric.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                            </div>
                            <span className="text-sm font-bold text-green-600">{metric.value}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.percentage}%` }}
                              transition={{ duration: 1, delay: 0.9 + idx * 0.1 }}
                              className={`h-full rounded-full ${
                                metric.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      All systems operational
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Key Insights & Upcoming Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Top Performing Areas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-900">Student Engagement</span>
                      <span className="font-bold text-green-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-900">Course Completion</span>
                      <span className="font-bold text-green-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-900">Mentor Satisfaction</span>
                      <span className="font-bold text-green-600">89%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-900">Weekend Engagement</span>
                      <span className="font-bold text-orange-600">68%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-900">Assignment Submission</span>
                      <span className="font-bold text-orange-600">72%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-900">Response Time</span>
                      <span className="font-bold text-orange-600">3.2 hrs</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Upcoming Tasks
                  </h3>
                  <div className="space-y-3">
                    {upcomingTasks.map((task, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{task.title}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{task.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500">{task.due}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StudentBatchAnalytics />
            </motion.div>
          )}

          {activeTab === 'mentors' && (
            <motion.div
              key="mentors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MentorAnalytics />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
