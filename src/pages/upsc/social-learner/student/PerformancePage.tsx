import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Brain,
  BookOpen,
  Calendar,
  ChevronUp,
  Users,
  BarChart2,
  PieChart,
  LineChart,
  CheckCircle,
  XCircle,
  Medal,
  Star,
  Trophy,
  Filter,
  X,
  Zap,
  Activity,
  Sparkles,
  Flame,
  ChevronRight,
  ChevronDown,
  TrendingDown
} from 'lucide-react';
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useState(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const numericValue = typeof value === 'string' ? parseInt(value) : value;
      const current = numericValue * easeOutQuart;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });

  return (
    <span>
      {Math.round(displayValue)}{suffix}
    </span>
  );
};

// Futuristic Card Component
const FuturisticCard = ({ children, className = "", delay = 0, neonGlow = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5 }}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(16, 172, 139, 0.15) 0%,
            transparent 60%
          ),
          linear-gradient(135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(10px)',
        boxShadow: neonGlow
          ? '0 0 30px rgba(16, 172, 139, 0.3), 0 8px 32px 0 rgba(9, 77, 136, 0.1)'
          : '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-brand-secondary/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export function PerformancePage() {
  const [activeTimeframe, setActiveTimeframe] = useState<'all' | 'month' | 'week'>('month');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  // Performance Metrics
  const metrics = [
    {
      title: 'Overall Score',
      value: '85',
      suffix: '%',
      trend: '+5%',
      trendUp: true,
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    },
    {
      title: 'Study Hours',
      value: '128',
      suffix: '',
      trend: '12 hrs this week',
      trendUp: true,
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Tests Taken',
      value: '24',
      suffix: '',
      trend: '95% completion',
      trendUp: true,
      icon: Target,
      color: 'from-brand-primary to-brand-secondary',
      bgColor: 'bg-blue-50',
      textColor: 'text-brand-primary',
      iconBg: 'bg-gradient-to-br from-brand-primary to-brand-secondary'
    },
    {
      title: 'Attendance Rate',
      value: '92',
      suffix: '%',
      trend: '45/48 classes',
      trendUp: true,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600'
    }
  ];

  // Subject Performance Data
  const subjectPerformance = [
    { subject: 'Indian Polity', score: 88, hours: 45, trend: '+8%', tests: 12, attendance: 95 },
    { subject: 'Economics', score: 82, hours: 38, trend: '+5%', tests: 10, attendance: 92 },
    { subject: 'Geography', score: 78, hours: 32, trend: '+3%', tests: 8, attendance: 88 },
    { subject: 'History', score: 85, hours: 35, trend: '+6%', tests: 11, attendance: 90 }
  ];

  // Chart Data
  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [
      {
        label: 'Performance Score',
        data: [75, 78, 82, 85, 88],
        borderColor: 'rgb(9, 77, 136)',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(9, 77, 136)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const studyHoursData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [4, 6, 5, 8, 7, 3, 2],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.6)',
          'rgba(9, 77, 136, 0.6)'
        ],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const subjectDistributionData = {
    labels: subjectPerformance.map(s => s.subject),
    datasets: [
      {
        data: subjectPerformance.map(s => s.hours),
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(10, 125, 100, 0.8)',
          'rgba(6, 52, 86, 0.8)'
        ],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 10
      }
    ]
  };

  // Achievements Data
  const achievements = [
    {
      title: 'Perfect Attendance',
      description: 'Attended all classes this month',
      icon: Medal,
      date: 'Jan 2025',
      color: 'from-yellow-400 to-orange-500',
      points: 100
    },
    {
      title: 'Top Performer',
      description: 'Ranked #1 in Economics',
      icon: Trophy,
      date: 'Jan 2025',
      color: 'from-brand-primary to-brand-secondary',
      points: 150
    },
    {
      title: 'Study Streak',
      description: '15 days consecutive study',
      icon: Flame,
      date: 'Feb 2025',
      color: 'from-orange-500 to-red-600',
      points: 75
    },
    {
      title: 'Fast Learner',
      description: 'Completed 5 modules ahead',
      icon: Zap,
      date: 'Feb 2025',
      color: 'from-purple-500 to-pink-600',
      points: 125
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      type: 'test',
      title: 'Economics Mock Test',
      description: 'Comprehensive test covering all major topics',
      score: '85/100',
      date: '2 days ago',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      type: 'class',
      title: 'Indian Polity Lecture',
      description: 'Constitutional amendments and governance',
      score: 'Present',
      date: '3 days ago',
      color: 'from-green-500 to-emerald-600'
    },
    {
      type: 'assignment',
      title: 'Geography Project',
      description: 'Regional development analysis',
      score: '92/100',
      date: '5 days ago',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
      <>
      <div className="space-y-6 relative">
        <WelcomeTooltip message="Track your academic progress and identify areas for improvement." />

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 50, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1]
            }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-brand-primary to-brand-secondary bg-clip-text text-transparent flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BarChart2 className="w-10 h-10 text-brand-primary" />
              </motion.div>
              Performance Tracking
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 mt-2 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-secondary" />
              Monitor your progress and achievements
            </motion.p>
          </div>
          <div className="flex gap-3">
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 rounded-xl focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all shadow-sm"
              value={activeTimeframe}
              onChange={(e) => setActiveTimeframe(e.target.value as 'all' | 'month' | 'week')}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/30 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <FuturisticCard key={index} delay={index * 0.1} neonGlow={index === 0}>
              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <div className="flex items-baseline gap-2">
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                        className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-brand-primary bg-clip-text text-transparent"
                      >
                        <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={1500} />
                      </motion.p>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-sm text-brand-secondary flex items-center gap-1 font-semibold mt-1"
                    >
                      {metric.trendUp ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {metric.trend}
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 ${metric.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <metric.icon className="w-7 h-7 text-white" />
                  </motion.div>
                </div>
              </div>
            </FuturisticCard>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FuturisticCard delay={0.4}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <LineChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Performance Trend</h3>
                  <p className="text-xs text-gray-600">Your progress over time</p>
                </div>
              </div>
              <div className="h-80">
                <Line
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          callback: (value) => value + '%'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Score: ${context.parsed.y}%`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </FuturisticCard>

          <FuturisticCard delay={0.5}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Weekly Study Hours</h3>
                  <p className="text-xs text-gray-600">Daily study time distribution</p>
                </div>
              </div>
              <div className="h-80">
                <Bar
                  data={studyHoursData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                          callback: (value) => value + 'h'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.parsed.y} hours`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </FuturisticCard>
        </div>

        {/* Subject Performance */}
        <FuturisticCard delay={0.6}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Subject Performance</h3>
                <p className="text-xs text-gray-600">Detailed subject-wise analysis</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ x: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                    className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-brand-primary transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedSubject(subject.subject);
                      setShowSubjectModal(true);
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-brand-primary" />
                        {subject.subject}
                      </h4>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {subject.trend}
                      </span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.score}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_100%] animate-gradient rounded-full relative"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-brand-primary">{subject.score}% Score</span>
                      <div className="flex items-center gap-3 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {subject.hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {subject.tests} tests
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-brand-secondary" />
                  <h4 className="text-sm font-bold text-gray-900">Study Time Distribution</h4>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  <Pie
                    data={subjectDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: {
                              size: 12,
                              weight: 'bold'
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </FuturisticCard>

        {/* Achievements */}
        <FuturisticCard delay={1.1}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Achievements</h3>
                <p className="text-xs text-gray-600">Your milestones and badges</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="p-6 border-2 border-gray-200 rounded-2xl text-center hover:border-brand-primary transition-all group relative overflow-hidden bg-gradient-to-br from-white to-gray-50"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl relative z-10`}
                  >
                    <achievement.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-gray-900 mb-2 relative z-10">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 relative z-10">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-brand-primary">{achievement.points} pts</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 relative z-10">{achievement.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FuturisticCard>

        {/* Recent Activity */}
        <FuturisticCard delay={1.5}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <p className="text-xs text-gray-600">Your latest learning activities</p>
              </div>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-brand-primary transition-all cursor-pointer group"
                    onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      {activity.type === 'test' ? <Target className="w-7 h-7 text-white" /> :
                       activity.type === 'class' ? <Users className="w-7 h-7 text-white" /> :
                       <BookOpen className="w-7 h-7 text-white" />}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {typeof activity.score === 'string' && activity.score.includes('/') ? (
                        <span className="text-brand-primary font-bold text-xl">{activity.score}</span>
                      ) : activity.score === 'Present' ? (
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1 text-green-600 bg-green-100 px-4 py-2 rounded-full font-bold"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Present
                        </motion.span>
                      ) : (
                        <span className="text-brand-primary font-bold text-xl">{activity.score}</span>
                      )}
                      <motion.div
                        animate={{ rotate: expandedActivity === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {expandedActivity === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-5 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-2xl border-2 border-brand-primary/20">
                          <p className="text-sm text-gray-700">{activity.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </FuturisticCard>
      </div>

      {/* Subject Detail Modal */}
      <AnimatePresence>
        {showSubjectModal && selectedSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5" />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSubjectModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {selectedSubject}
                    </h3>
                    <p className="text-sm text-gray-600">Detailed Performance Analysis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Current Score', value: `${subjectPerformance.find(s => s.subject === selectedSubject)?.score}%`, icon: Target, color: 'from-indigo-500 to-purple-600' },
                      { label: 'Study Hours', value: subjectPerformance.find(s => s.subject === selectedSubject)?.hours, icon: Clock, color: 'from-green-500 to-emerald-600' },
                      { label: 'Tests Taken', value: subjectPerformance.find(s => s.subject === selectedSubject)?.tests, icon: Award, color: 'from-blue-500 to-indigo-600' },
                      { label: 'Attendance', value: `${subjectPerformance.find(s => s.subject === selectedSubject)?.attendance}%`, icon: Users, color: 'from-purple-500 to-pink-600' }
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-brand-primary transition-all"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                          {stat.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl text-white shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-6 h-6" />
                      <h4 className="font-bold text-lg">Keep up the great work!</h4>
                    </div>
                    <p className="text-sm opacity-90">
                      Your performance in {selectedSubject} is improving consistently. Continue practicing and reviewing concepts to achieve even better results.
                    </p>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSubjectModal(false)}
                  className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Close Details
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
  );
}
