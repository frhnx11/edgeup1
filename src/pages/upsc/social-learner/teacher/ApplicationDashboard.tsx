import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Home, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Users, 
  Heart, 
  FileText, 
  Settings,
  Menu,
  X,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BookOpen,
  Target,
  Clock,
  Award,
  Calendar,
  MessageSquare,
  Zap
} from 'lucide-react';
import { AdminLayout } from '../../../../layouts/AdminLayout';

// Define types
type UserRole = 'student' | 'faculty' | 'admin';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgGradient: string;
  stats?: {
    value: string;
    change: number;
    trend: 'up' | 'down';
  };
  route: string;
}

export function ApplicationDashboard() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Dashboard cards data
  const dashboardCards: DashboardCard[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Overview of your learning journey',
      icon: Home,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
      stats: {
        value: '92%',
        change: 5,
        trend: 'up'
      },
      route: '/admin/dashboard'
    },
    {
      id: 'test-analytics',
      title: 'Test Analytics',
      description: 'Detailed performance insights',
      icon: BarChart3,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500 to-purple-600',
      stats: {
        value: '85%',
        change: 3,
        trend: 'up'
      },
      route: '/admin/test-analytics'
    },
    {
      id: 'learning-insights',
      title: 'Learning Insights',
      description: 'AI-powered learning recommendations',
      icon: Brain,
      color: 'text-pink-600',
      bgGradient: 'from-pink-500 to-pink-600',
      stats: {
        value: '24',
        change: 2,
        trend: 'down'
      },
      route: '/admin/insights'
    },
    {
      id: 'progress-tracking',
      title: 'Progress Tracking',
      description: 'Monitor your academic progress',
      icon: TrendingUp,
      color: 'text-green-600',
      bgGradient: 'from-green-500 to-green-600',
      stats: {
        value: '78%',
        change: 12,
        trend: 'up'
      },
      route: '/admin/progress'
    },
    {
      id: 'peer-collaboration',
      title: 'Peer Collaboration',
      description: 'Connect and learn with peers',
      icon: Users,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500 to-indigo-600',
      stats: {
        value: '156',
        change: 8,
        trend: 'up'
      },
      route: '/admin/collaboration'
    },
    {
      id: 'health-wellness',
      title: 'Health & Wellness',
      description: 'Track your well-being',
      icon: Heart,
      color: 'text-red-600',
      bgGradient: 'from-red-500 to-red-600',
      stats: {
        value: 'Good',
        change: 0,
        trend: 'up'
      },
      route: '/admin/wellness'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Comprehensive academic reports',
      icon: FileText,
      color: 'text-amber-600',
      bgGradient: 'from-amber-500 to-amber-600',
      stats: {
        value: '12',
        change: 4,
        trend: 'up'
      },
      route: '/admin/reports'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Customize your experience',
      icon: Settings,
      color: 'text-gray-600',
      bgGradient: 'from-gray-500 to-gray-600',
      route: '/admin/settings'
    }
  ];

  // Sample notifications
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setNotifications([
        {
          id: '1',
          title: 'New Assignment',
          message: 'Physics Lab Report due tomorrow',
          time: '2 hours ago',
          type: 'warning',
          read: false
        },
        {
          id: '2',
          title: 'Test Score Released',
          message: 'You scored 92% in Mathematics',
          time: '5 hours ago',
          type: 'success',
          read: false
        },
        {
          id: '3',
          title: 'Study Group Invitation',
          message: 'Join the Chemistry study group',
          time: '1 day ago',
          type: 'info',
          read: true
        }
      ]);
    }, 1000);
  }, []);

  // Filter cards based on search
  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Custom Top Navbar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Search */}
              <div className="flex items-center flex-1">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                <div className="relative ml-4 flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Right side - Role switcher, Notifications, Profile */}
              <div className="flex items-center gap-4 ml-4">
                {/* Role Switcher */}
                <div className="hidden sm:block">
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 animate-fadeIn">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500 mt-1">{unreadNotifications} unread</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      A
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 animate-fadeIn">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-medium text-gray-900">Admin User</p>
                        <p className="text-sm text-gray-500">admin@edgeup.com</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          Profile Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          Account Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          Help & Support
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Menu</h2>
              </div>
              <div className="p-4">
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your learning today.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +5% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                  <p className="text-xs text-gray-500 mt-1">3 completed this month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">15 days</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Personal best!
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                  <p className="text-xs text-amber-600 mt-1">2 new this week</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          {filteredCards.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => window.location.href = card.route}
                >
                  {/* Card Header with Gradient */}
                  <div className={`h-32 bg-gradient-to-br ${card.bgGradient} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <card.icon className="w-10 h-10 text-white mb-2" />
                      <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                    
                    {card.stats && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{card.stats.value}</p>
                          <p className="text-xs text-gray-500 mt-1">Current</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          card.stats.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {card.stats.trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span>{Math.abs(card.stats.change)}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Open {card.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Completed Python Basics Module</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Earned "Quick Learner" Badge</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Joined Data Science Study Group</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Physics Lab Test</p>
                  <p className="text-sm text-gray-600">Tomorrow at 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Group Study Session</p>
                  <p className="text-sm text-gray-600">Friday at 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </AdminLayout>
  );
}