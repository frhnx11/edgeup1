import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Video,
  FileText,
  MessageSquare,
  Activity,
  Download,
  Filter,
  Search,
  MoreVertical,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Trophy,
  Star,
  ArrowUp,
  ArrowDown,
  BookMarked,
  Folder,
  Settings,
  UserPlus
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
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';

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

export function LMSDashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Course Progress Data
  const courseProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Course Completions',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#10ac8b',
        backgroundColor: 'rgba(16, 172, 139, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10ac8b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'New Enrollments',
        data: [8, 12, 10, 18, 14, 20, 16],
        borderColor: '#094d88',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#094d88',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Learning Activity Data
  const learningActivityData = {
    labels: ['Video Lessons', 'Assignments', 'Quizzes', 'Discussions', 'Live Classes'],
    datasets: [
      {
        label: 'Student Engagement',
        data: [850, 620, 780, 450, 680],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  };

  // Course Performance Data
  const coursePerformanceData = {
    labels: ['UPSC Foundation', 'Current Affairs', 'Indian Polity', 'Economics', 'Geography', 'History'],
    datasets: [
      {
        label: 'Average Score',
        data: [82, 78, 85, 75, 80, 88],
        backgroundColor: 'rgba(16, 172, 139, 0.6)',
        borderColor: '#10ac8b',
        borderWidth: 2,
        pointBackgroundColor: '#10ac8b',
        pointHoverBackgroundColor: '#10ac8b',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#10ac8b'
      }
    ]
  };

  // Content Distribution Data
  const contentDistributionData = {
    labels: ['Videos', 'Documents', 'Quizzes', 'Assignments', 'Live Sessions'],
    datasets: [
      {
        data: [342, 256, 189, 142, 98],
        backgroundColor: [
          '#094d88',
          '#10ac8b',
          '#fbbf24',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 0
      }
    ]
  };

  const metrics = [
    {
      title: 'Total Students',
      value: '3,247',
      change: '+15%',
      trend: 'up',
      icon: Users,
      description: 'Active learners',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Active Courses',
      value: '42',
      change: '+3',
      trend: 'up',
      icon: BookOpen,
      description: 'Courses available',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Completion Rate',
      value: '78%',
      change: '+5%',
      trend: 'up',
      icon: GraduationCap,
      description: 'Average completion',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Learning Hours',
      value: '15.2K',
      change: '+12%',
      trend: 'up',
      icon: Clock,
      description: 'This month',
      bgColor: 'bg-gradient-to-br from-orange-500 to-amber-600',
      iconBg: 'bg-white/20'
    }
  ];

  const courseStats = [
    {
      id: '1',
      name: 'UPSC Foundation Course',
      students: 892,
      completion: 82,
      rating: 4.8,
      revenue: '₹2.4L',
      status: 'active',
      instructor: 'Dr. Rajesh Kumar',
      lastUpdated: '2 days ago'
    },
    {
      id: '2',
      name: 'Current Affairs Mastery',
      students: 654,
      completion: 75,
      rating: 4.6,
      revenue: '₹1.8L',
      status: 'active',
      instructor: 'Prof. Anita Sharma',
      lastUpdated: '1 week ago'
    },
    {
      id: '3',
      name: 'Indian Polity Deep Dive',
      students: 523,
      completion: 88,
      rating: 4.9,
      revenue: '₹1.5L',
      status: 'active',
      instructor: 'Dr. Vivek Patel',
      lastUpdated: '3 days ago'
    },
    {
      id: '4',
      name: 'Economics Simplified',
      students: 412,
      completion: 70,
      rating: 4.5,
      revenue: '₹1.2L',
      status: 'active',
      instructor: 'CA Priya Mehta',
      lastUpdated: '5 days ago'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'enrollment',
      student: 'Rahul Verma',
      course: 'UPSC Foundation Course',
      time: '10 minutes ago',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: '2',
      type: 'completion',
      student: 'Sneha Patel',
      course: 'Indian Polity Module 3',
      time: '25 minutes ago',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: '3',
      type: 'submission',
      student: 'Amit Singh',
      course: 'Economics Assignment',
      time: '1 hour ago',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: '4',
      type: 'achievement',
      student: 'Priya Sharma',
      course: 'Geography Excellence Badge',
      time: '2 hours ago',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      id: '5',
      type: 'live',
      student: 'Dr. Kumar',
      course: 'Started Live Session',
      time: '3 hours ago',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const upcomingClasses = [
    {
      id: '1',
      title: 'Constitutional Law Basics',
      instructor: 'Dr. Rajesh Kumar',
      time: '10:00 AM',
      duration: '2 hours',
      students: 145,
      type: 'live'
    },
    {
      id: '2',
      title: 'Economic Survey Analysis',
      instructor: 'Prof. Anita Sharma',
      time: '2:00 PM',
      duration: '1.5 hours',
      students: 98,
      type: 'webinar'
    },
    {
      id: '3',
      title: 'Geography Map Practice',
      instructor: 'Dr. Vivek Patel',
      time: '4:00 PM',
      duration: '1 hour',
      students: 67,
      type: 'workshop'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-brand-primary" />
              LMS Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of your learning management system</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="relative group">
              <div className={`${metric.bgColor} text-white p-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold mt-2">{metric.value}</p>
                    <p className="text-white/70 text-xs mt-1">{metric.description}</p>
                    <div className="flex items-center gap-1 mt-3">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{metric.change}</span>
                      <span className="text-xs text-white/70">vs last period</span>
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Course Progress Chart */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Course Progress & Enrollments</h2>
                <p className="text-sm text-gray-600 mt-1">Weekly completion and enrollment trends</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="h-80">
              <Line
                data={courseProgressData}
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
                      ticks: {
                        stepSize: 5
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Content Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Content Library</h2>
            <div className="h-64">
              <Doughnut
                data={contentDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Resources</span>
                <span className="font-semibold">1,027</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New This Week</span>
                <span className="font-semibold text-green-600">+42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Engagement</h2>
                <p className="text-sm text-gray-600 mt-1">Activity across different learning formats</p>
              </div>
              <Activity className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="h-80">
              <Bar
                data={learningActivityData}
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
                        stepSize: 200
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Course Performance */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Course Performance</h2>
                <p className="text-sm text-gray-600 mt-1">Average scores by subject</p>
              </div>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div className="h-80">
              <PolarArea
                data={coursePerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Course Statistics Table */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Top Performing Courses</h2>
              <button className="text-sm text-brand-primary hover:text-brand-secondary font-medium transition-colors">
                View All Courses
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courseStats.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-xs text-gray-500">Updated {course.lastUpdated}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">{course.students}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-secondary h-2 rounded-full"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">{course.revenue}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities and Upcoming Classes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                <button className="text-sm text-brand-primary hover:text-brand-secondary font-medium transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                      <p className="text-xs text-gray-600">{activity.course}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <Calendar className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{class_.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{class_.instructor}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {class_.time} • {class_.duration}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          {class_.students} enrolled
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white text-xs font-medium rounded-lg hover:bg-brand-secondary transition-colors">
                      <Play className="w-3 h-3" />
                      Start
                    </button>
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
              <h2 className="text-xl font-bold">Ready to create engaging content?</h2>
              <p className="text-white/80 mt-1">Build new courses, upload resources, and engage with your students</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl hover:bg-white/30 transition-all duration-200">
                <BookMarked className="w-5 h-5" />
                Create Course
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-brand-primary rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
                <Zap className="w-5 h-5" />
                Quick Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}