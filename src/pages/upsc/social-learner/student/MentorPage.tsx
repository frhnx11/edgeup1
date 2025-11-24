import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  UserCog,
  Video,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  GraduationCap,
  Award,
  Target,
  Book,
  FileText,
  Download,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Users,
  Brain,
  Sparkles,
  Trophy,
  Medal,
  Crown,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Flame,
  TrendingDown,
  Eye,
  Share2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Radar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// FuturisticCard Component
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
      {/* Holographic borders */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#094d88]/5 via-transparent to-[#10ac8b]/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#094d88]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#10ac8b]/20 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#094d88]/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#10ac8b]/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export function MentorPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const mentor = {
    name: 'Dr. Sarah Williams',
    role: 'Primary Academic Mentor',
    expertise: ['Indian Polity', 'International Relations', 'Economics'],
    experience: '15+ years',
    rating: 4.9,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: 'Available Now',
    nextSession: '2024-02-15T10:00:00',
    totalStudents: 156,
    activeStudents: 142,
    sessionsCompleted: 1248,
    overallRanking: 3,
    departmentRanking: 1
  };

  // Student Understanding Analytics
  const topicUnderstanding = [
    { topic: 'Constitutional Framework', understood: 88, partial: 10, struggling: 2, totalStudents: 142 },
    { topic: 'Fundamental Rights', understood: 92, partial: 6, struggling: 2, totalStudents: 142 },
    { topic: 'Directive Principles', understood: 75, partial: 20, struggling: 5, totalStudents: 142 },
    { topic: 'Parliamentary System', understood: 82, partial: 15, struggling: 3, totalStudents: 142 },
    { topic: 'Judiciary', understood: 85, partial: 12, struggling: 3, totalStudents: 142 },
    { topic: 'Economic Policies', understood: 78, partial: 18, struggling: 4, totalStudents: 142 }
  ];

  // Teacher Rankings
  const teacherRankings = [
    { rank: 1, name: 'Dr. Sarah Williams', rating: 4.9, students: 156, understanding: 88, badge: 'gold' },
    { rank: 2, name: 'Prof. Michael Chen', rating: 4.8, students: 148, understanding: 85, badge: 'silver' },
    { rank: 3, name: 'Dr. Priya Sharma', rating: 4.7, students: 139, understanding: 83, badge: 'bronze' },
    { rank: 4, name: 'Dr. James Wilson', rating: 4.6, students: 132, understanding: 80, badge: null },
    { rank: 5, name: 'Prof. Emma Davis', rating: 4.6, students: 125, understanding: 79, badge: null }
  ];

  // Student Engagement Metrics
  const engagementMetrics = {
    averageAttendance: 94,
    averageParticipation: 87,
    assignmentCompletion: 91,
    averageResponseTime: 85,
    studentSatisfaction: 96
  };

  // Performance Trends
  const performanceTrends = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Understanding %',
        data: [75, 78, 82, 85, 87, 88],
        borderColor: 'rgb(9, 77, 136)',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Topic Mastery Chart Data
  const topicMasteryData = {
    labels: topicUnderstanding.map(t => t.topic),
    datasets: [
      {
        label: 'Fully Understood',
        data: topicUnderstanding.map(t => t.understood),
        backgroundColor: 'rgba(16, 172, 139, 0.8)'
      },
      {
        label: 'Partially Understood',
        data: topicUnderstanding.map(t => t.partial),
        backgroundColor: 'rgba(251, 191, 36, 0.8)'
      },
      {
        label: 'Struggling',
        data: topicUnderstanding.map(t => t.struggling),
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      }
    ]
  };

  // Engagement Radar Data
  const engagementRadarData = {
    labels: ['Attendance', 'Participation', 'Assignments', 'Response Time', 'Satisfaction'],
    datasets: [
      {
        label: 'Engagement Metrics',
        data: [
          engagementMetrics.averageAttendance,
          engagementMetrics.averageParticipation,
          engagementMetrics.assignmentCompletion,
          engagementMetrics.averageResponseTime,
          engagementMetrics.studentSatisfaction
        ],
        backgroundColor: 'rgba(9, 77, 136, 0.2)',
        borderColor: 'rgb(9, 77, 136)',
        borderWidth: 2
      }
    ]
  };

  const assignments = [
    {
      id: 1,
      title: 'Indian Economy Analysis',
      dueDate: '2024-02-20',
      status: 'pending',
      type: 'Research Paper',
      feedback: null,
      submitted: 45,
      total: 142
    },
    {
      id: 2,
      title: 'Constitutional Framework Study',
      dueDate: '2024-02-15',
      status: 'completed',
      type: 'Case Study',
      feedback: 'Excellent analysis of fundamental rights. Consider adding more recent Supreme Court judgments.',
      submitted: 138,
      total: 142
    },
    {
      id: 3,
      title: 'Current Affairs Weekly Review',
      dueDate: '2024-02-18',
      status: 'in_progress',
      type: 'Report',
      feedback: null,
      submitted: 89,
      total: 142
    }
  ];

  const studyMaterials = [
    {
      id: 1,
      title: 'Advanced Constitutional Law Notes',
      type: 'PDF',
      size: '2.5 MB',
      date: '2024-02-10',
      downloads: 134,
      views: 142
    },
    {
      id: 2,
      title: 'Economic Reforms Case Studies',
      type: 'DOCX',
      size: '1.8 MB',
      date: '2024-02-12',
      downloads: 128,
      views: 138
    },
    {
      id: 3,
      title: 'International Relations Framework',
      type: 'PDF',
      size: '3.2 MB',
      date: '2024-02-14',
      downloads: 98,
      views: 115
    }
  ];

  const progressMetrics = [
    {
      subject: 'Indian Polity',
      progress: 85,
      trend: '+5%',
      lastTest: 92,
      understanding: 88
    },
    {
      subject: 'Economics',
      progress: 78,
      trend: '+3%',
      lastTest: 85,
      understanding: 78
    },
    {
      subject: 'International Relations',
      progress: 72,
      trend: '+7%',
      lastTest: 88,
      understanding: 82
    }
  ];

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'gold':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'silver':
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 'bronze':
        return <Trophy className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
      <>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 172, 139, 0.15) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(9, 77, 136, 0.15) 0%, transparent 70%)',
            top: '50%',
            right: '10%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
            bottom: '10%',
            left: '50%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="space-y-6 relative">
        <WelcomeTooltip message="Connect with mentors for personalized guidance." />

        {/* Mentor Header */}
        <FuturisticCard className="rounded-2xl p-6" delay={0.1} neonGlow>
          <div className="flex items-start gap-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-28 h-28 rounded-2xl object-cover shadow-lg border-4 border-white"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                    {mentor.name}
                  </h1>
                  <p className="text-[#094d88] font-medium text-lg">{mentor.role}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {mentor.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({mentor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-green-700">{mentor.availability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all shadow-md"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Session</span>
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-[#094d88] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </motion.button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4">
                {[
                  { icon: GraduationCap, label: 'Experience', value: mentor.experience, color: 'from-blue-500 to-indigo-600' },
                  { icon: Users, label: 'Total Students', value: mentor.totalStudents, color: 'from-purple-500 to-pink-600' },
                  { icon: Activity, label: 'Active Students', value: mentor.activeStudents, color: 'from-green-500 to-emerald-600' },
                  { icon: CheckCircle, label: 'Sessions', value: mentor.sessionsCompleted, color: 'from-yellow-500 to-orange-600' }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Expertise</div>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 text-[#094d88] rounded-full text-sm font-medium border border-[#094d88]/20"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(9, 77, 136, 0.5)' }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FuturisticCard>

        {/* Rankings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Ranking */}
          <FuturisticCard className="rounded-2xl p-6" delay={0.2} neonGlow>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                  Teacher Rankings
                </h2>
                <p className="text-sm text-gray-600">Top performing educators</p>
              </div>
            </div>

            <div className="space-y-3">
              {teacherRankings.map((teacher, index) => (
                <motion.div
                  key={teacher.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    teacher.name === mentor.name
                      ? 'bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 border-[#094d88]'
                      : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        teacher.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                        teacher.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg' :
                        teacher.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {teacher.rank}
                      </div>
                      {teacher.badge && getBadgeIcon(teacher.badge)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{teacher.name}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-600">{teacher.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{teacher.students} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                        {teacher.understanding}%
                      </div>
                      <div className="text-xs text-gray-600">Understanding</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </FuturisticCard>

          {/* Engagement Metrics Radar */}
          <FuturisticCard className="rounded-2xl p-6" delay={0.25}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                  Student Engagement
                </h2>
                <p className="text-sm text-gray-600">Overall class metrics</p>
              </div>
            </div>

            <div className="h-64">
              <Radar
                data={engagementRadarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Attendance', value: engagementMetrics.averageAttendance, icon: CheckCircle },
                { label: 'Participation', value: engagementMetrics.averageParticipation, icon: MessageCircle },
                { label: 'Satisfaction', value: engagementMetrics.studentSatisfaction, icon: ThumbsUp }
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={metric.label} className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="w-4 h-4 text-[#094d88]" />
                      <span className="text-xs text-gray-600">{metric.label}</span>
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                      {metric.value}%
                    </div>
                  </div>
                );
              })}
            </div>
          </FuturisticCard>
        </div>

        {/* Student Understanding Analytics */}
        <FuturisticCard className="rounded-2xl p-6" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                  Student Understanding Analytics
                </h2>
                <p className="text-sm text-gray-600">Topic-wise comprehension breakdown</p>
              </div>
            </div>
            <motion.div
              className="px-4 py-2 bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 rounded-xl"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-xs text-gray-600">Overall Class Average</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                85%
              </div>
            </motion.div>
          </div>

          <div className="h-80 mb-6">
            <Bar
              data={topicMasteryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          </div>

          <div className="space-y-3">
            {topicUnderstanding.map((topic, index) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#094d88]" />
                    <span className="font-semibold text-gray-900">{topic.topic}</span>
                  </div>
                  <span className="text-sm text-gray-600">{topic.totalStudents} students</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Understood</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{topic.understood}%</div>
                    <div className="text-xs text-green-600 mt-1">
                      {Math.round((topic.understood / 100) * topic.totalStudents)} students
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-yellow-700 font-medium">Partial</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700">{topic.partial}%</div>
                    <div className="text-xs text-yellow-600 mt-1">
                      {Math.round((topic.partial / 100) * topic.totalStudents)} students
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-700 font-medium">Struggling</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700">{topic.struggling}%</div>
                    <div className="text-xs text-red-600 mt-1">
                      {Math.round((topic.struggling / 100) * topic.totalStudents)} students
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FuturisticCard>

        {/* Performance Trends */}
        <FuturisticCard className="rounded-2xl p-6" delay={0.35}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                Performance Trends
              </h2>
              <p className="text-sm text-gray-600">Weekly understanding improvement</p>
            </div>
          </div>

          <div className="h-64">
            <Line
              data={performanceTrends}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </FuturisticCard>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressMetrics.map((metric, index) => (
            <FuturisticCard key={index} className="rounded-2xl p-6" delay={0.4 + index * 0.05}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-900">{metric.subject}</h3>
                <motion.span
                  className="text-[#10ac8b] text-sm flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-4 h-4" />
                  {metric.trend}
                </motion.span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Student Understanding</span>
                  <span className="font-bold text-[#094d88]">{metric.understanding}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.understanding}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Overall Progress</div>
                  <div className="text-xl font-bold text-blue-700">{metric.progress}%</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Last Test</div>
                  <div className="text-xl font-bold text-purple-700">{metric.lastTest}%</div>
                </div>
              </div>
            </FuturisticCard>
          ))}
        </div>

        {/* Assignments & Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignments */}
          <FuturisticCard className="rounded-2xl p-6" delay={0.45}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Current Assignments</h2>
              </div>
              <button className="text-sm text-[#094d88] hover:text-[#10ac8b] font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#094d88]/30 transition-all"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      assignment.status === 'completed'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : assignment.status === 'in_progress'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-600">{assignment.type}</span>
                        <span className="text-xs text-gray-600">Due {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b]"
                            style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {assignment.submitted}/{assignment.total}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </FuturisticCard>

          {/* Study Materials */}
          <FuturisticCard className="rounded-2xl p-6" delay={0.5}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Study Materials</h2>
              </div>
              <button className="text-sm text-[#094d88] hover:text-[#10ac8b] font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {studyMaterials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#094d88]/30 transition-all"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{material.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-600">{material.type}</span>
                        <span className="text-xs text-gray-600">{material.size}</span>
                        <span className="text-xs text-gray-600">Added {material.date}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{material.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{material.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-lg shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </FuturisticCard>
        </div>

        {/* Next Session */}
        <FuturisticCard className="rounded-2xl p-6" delay={0.55} neonGlow>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
              Next Session
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-2xl flex items-center justify-center shadow-lg"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Calendar className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <div className="font-semibold text-lg text-gray-900">
                  {new Date(mentor.nextSession).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-[#094d88] font-medium">
                  {new Date(mentor.nextSession).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Topic: Advanced Constitutional Framework</span>
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Expected Attendance: {mentor.activeStudents} students</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all shadow-md font-medium"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Join Session
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-[#094d88] transition-all font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Share Link
              </motion.button>
            </div>
          </div>
        </FuturisticCard>
      </div>
      </>
  );
}
