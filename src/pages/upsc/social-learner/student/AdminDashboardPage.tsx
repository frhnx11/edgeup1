import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Users,
  BookOpen,
  Target,
  Activity,
  Settings,
  Search,
  Filter,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Clock,
  Brain,
  Download,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  GraduationCap,
  Zap
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);

export function AdminDashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Student Performance',
        data: [75, 78, 82, 85, 88, 92, 95],
        borderColor: '#094d88',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#094d88',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Course Completion',
        data: [68, 70, 75, 78, 82, 85, 87],
        borderColor: '#10ac8b',
        backgroundColor: 'rgba(16, 172, 139, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10ac8b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const subjectDistributionData = {
    labels: ['Indian Polity', 'Economics', 'Geography', 'History', 'Science'],
    datasets: [
      {
        label: 'Enrollments',
        data: [245, 198, 167, 182, 156],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(10, 125, 100, 0.8)',
          'rgba(6, 52, 86, 0.8)',
          'rgba(99, 102, 241, 0.8)'
        ],
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  };

  const engagementData = {
    labels: ['Login Rate', 'Course Progress', 'Test Completion', 'Assignment Submission', 'Forum Activity', 'Live Sessions'],
    datasets: [
      {
        label: 'This Week',
        data: [85, 75, 80, 72, 65, 88],
        backgroundColor: 'rgba(9, 77, 136, 0.2)',
        borderColor: '#094d88',
        pointBackgroundColor: '#094d88',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#094d88'
      },
      {
        label: 'Last Week',
        data: [78, 70, 75, 68, 60, 82],
        backgroundColor: 'rgba(16, 172, 139, 0.2)',
        borderColor: '#10ac8b',
        pointBackgroundColor: '#10ac8b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10ac8b'
      }
    ]
  };

  const completionRateData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          '#10ac8b',
          '#fbbf24',
          '#e5e7eb'
        ],
        borderWidth: 0
      }
    ]
  };

  const metrics = [
    {
      title: 'Total Students',
      value: '2,458',
      change: '+12%',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-brand-primary to-brand-dark',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Active Courses',
      value: '24',
      change: '+4',
      trend: 'up',
      icon: BookOpen,
      bgColor: 'bg-gradient-to-br from-brand-secondary to-brand-accent',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Avg. Test Score',
      value: '82%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Study Hours',
      value: '12,845',
      change: '+18%',
      trend: 'up',
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      iconBg: 'bg-white/20'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      user: 'Priya Sharma',
      avatar: 'PS',
      action: 'Completed test',
      subject: 'Indian Polity',
      score: '92%',
      time: '15 minutes ago',
      type: 'test',
      status: 'success'
    },
    {
      id: '2',
      user: 'Raj Kumar',
      avatar: 'RK',
      action: 'Started course',
      subject: 'Economics Fundamentals',
      time: '1 hour ago',
      type: 'course',
      status: 'info'
    },
    {
      id: '3',
      user: 'Anita Verma',
      avatar: 'AV',
      action: 'Submitted assignment',
      subject: 'Geography Module 3',
      time: '2 hours ago',
      type: 'assignment',
      status: 'success'
    },
    {
      id: '4',
      user: 'Deepak Singh',
      avatar: 'DS',
      action: 'Failed quiz',
      subject: 'History Assessment',
      score: '45%',
      time: '3 hours ago',
      type: 'test',
      status: 'error'
    },
    {
      id: '5',
      user: 'Maya Patel',
      avatar: 'MP',
      action: 'Earned certificate',
      subject: 'Advanced Economics',
      time: '4 hours ago',
      type: 'achievement',
      status: 'success'
    }
  ];

  const topPerformers = [
    { name: 'Arjun Mehta', score: 98, courses: 5, rank: 1, trend: 'up' },
    { name: 'Sneha Reddy', score: 96, courses: 4, rank: 2, trend: 'up' },
    { name: 'Vikram Joshi', score: 94, courses: 6, rank: 3, trend: 'same' },
    { name: 'Pooja Nair', score: 92, courses: 4, rank: 4, trend: 'down' },
    { name: 'Karan Gupta', score: 90, courses: 5, rank: 5, trend: 'up' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-8 h-8 text-brand-primary" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your platform overview</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-brand-primary hover:shadow-md transition-all duration-200">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Last 7 days</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-brand-primary hover:shadow-md transition-all duration-200">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="relative group">
              <div className={`${metric.bgColor} text-white p-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold mt-2">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                  </div>
                  <div className={`${metric.iconBg} p-3 rounded-xl`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Performance Trends</h2>
                <p className="text-sm text-gray-600 mt-1">Student performance and course completion rates</p>
              </div>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-80">
              <Line
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Completion Rate Donut */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Course Completion</h2>
            <div className="h-64">
              <Doughnut
                data={completionRateData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Courses</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Students</span>
                <span className="font-semibold">1,842</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Subject Enrollments</h2>
                <p className="text-sm text-gray-600 mt-1">Student distribution across subjects</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="h-80">
              <Bar
                data={subjectDistributionData}
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
                      beginAtZero: true,
                      ticks: {
                        stepSize: 50
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Engagement Radar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Engagement</h2>
                <p className="text-sm text-gray-600 mt-1">Weekly engagement metrics comparison</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="h-80">
              <Radar
                data={engagementData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Top Performers and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {performer.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-600">{performer.courses} courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-primary">{performer.score}%</span>
                    {performer.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                    {performer.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-brand-primary hover:text-brand-secondary font-medium transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivities.map(activity => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        activity.status === 'success' ? 'bg-gradient-to-br from-brand-secondary to-brand-accent' :
                        activity.status === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        'bg-gradient-to-br from-brand-primary to-brand-dark'
                      }`}>
                        {activity.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.user}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{activity.action}</span>
                          <span className="text-sm font-medium text-brand-primary">{activity.subject}</span>
                          {activity.score && (
                            <span className={`text-sm font-semibold ${
                              activity.status === 'error' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {activity.score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {activity.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                      {activity.status === 'info' && <AlertCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-white">
              <h2 className="text-xl font-bold">Need more insights?</h2>
              <p className="text-white/80 mt-1">Explore detailed analytics and reports for better decision making</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl hover:bg-white/30 transition-all duration-200">
                <BarChart2 className="w-5 h-5" />
                View Analytics
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-brand-primary rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
                <Zap className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}