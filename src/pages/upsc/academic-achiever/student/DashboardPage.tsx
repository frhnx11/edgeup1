import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { GamificationWidget } from '../../../../components/upsc/common/GamificationWidget';
import { AchievementPopup, useAchievementNotifications } from '../../../../components/upsc/common/AchievementPopup';
import { useTheme } from '../../../../contexts/ThemeContext';
import { usePASCOTracking } from '../../../../hooks/usePASCOTracking';
// Removed: PreGeneratedVoiceAgent - Now using ElevenLabs AIVoiceAgent from DashboardLayout
import {
  TrendingUp,
  BookOpen,
  Target,
  Clock,
  Calendar,
  Brain,
  ChevronRight,
  Play,
  FileText,
  Video,
  Headphones,
  CheckCircle,
  AlertCircle,
  Star,
  GraduationCap,
  BarChart2,
  Book,
  Users,
  Activity,
  Zap,
  Shield,
  Award,
  MessageSquare,
  Bell,
  Globe,
  Cpu,
  ArrowUp,
  ArrowDown,
  Timer,
  Sparkles,
  Eye,
  TrendingDown,
  Loader2,
  BrainCircuit,
  Network,
  Atom,
  Waves,
  PieChart,
  LineChart,
  Signal,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Upload,
  Folder,
  FolderOpen,
  PlayCircle,
  PauseCircle,
  BookMarked,
  Library,
  Archive,
  Search,
  Filter,
  Grid,
  List,
  Layers,
  Database,
  Mic,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronLeft,
  MoreVertical,
  Compass,
  Map,
  CircuitBoard,
  Hexagon,
  Pentagon,
  Triangle,
  Square,
  Circle,
  Flame,
  File,
  Moon,
  Sun,
  Trophy
} from 'lucide-react';
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
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

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

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(Date.now());
  const startValue = useRef(displayValue);
  
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue.current + (value - startValue.current) * easeOutQuart;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    startTime.current = Date.now();
    startValue.current = displayValue;
    animate();
  }, [value, duration]);
  
  return (
    <span>
      {prefix}{Math.round(displayValue)}{suffix}
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

// Holographic Section Header
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <motion.div 
          className="relative"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl blur-xl opacity-50" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <motion.button 
          className="text-sm text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1"
          whileHover={{ x: 5 }}
        >
          {action}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ resource, type, delay = 0 }) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return PlayCircle;
      case 'audio': return Headphones;
      case 'article': return BookOpen;
      default: return File;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      className="group relative bg-white rounded-xl border border-gray-200 hover:border-brand-primary/30 p-5 transition-all cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          type === 'pdf' ? 'bg-red-100 text-red-600' :
          type === 'video' ? 'bg-blue-100 text-blue-600' :
          type === 'audio' ? 'bg-purple-100 text-purple-600' :
          'bg-green-100 text-green-600'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1 truncate">{resource.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.duration || resource.pages || resource.size}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {resource.views} views
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button 
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bookmark className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button 
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {resource.isNew && (
        <span className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-medium rounded-full">
          NEW
        </span>
      )}
    </motion.div>
  );
};

// Quick Stats Widget
const QuickStats = () => {
  const stats = [
    { label: 'Courses Enrolled', value: 12, change: '+2', trend: 'up', icon: BookOpen },
    { label: 'Completed', value: 8, change: '+1', trend: 'up', icon: CheckCircle },
    { label: 'Hours Studied', value: 256, change: '+12', trend: 'up', icon: Clock },
    { label: 'Avg Score', value: 87, change: '+5%', trend: 'up', icon: Target }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="w-5 h-5 text-gray-600" />
            <span className={`text-xs font-medium flex items-center gap-1 ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {stat.change}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            <AnimatedCounter value={stat.value} suffix={stat.label === 'Avg Score' ? '%' : ''} />
          </div>
          <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <motion.div 
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${stat.trend === 'up' ? 100 : 50}%` }}
              transition={{ delay: idx * 0.1 + 0.5, duration: 1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentAchievement, handleClose } = useAchievementNotifications();
  const { trackTestCompletion } = usePASCOTracking();

  // Sample resources data
  const pdfResources = [
    { id: 1, title: 'Indian Constitution - Complete Guide', description: 'Comprehensive study material covering all articles and amendments', pages: '450 pages', views: 1234, isNew: true },
    { id: 2, title: 'Economics Fundamentals', description: 'Basic concepts of micro and macroeconomics for UPSC', pages: '320 pages', views: 892, isNew: false },
    { id: 3, title: 'Modern History Notes', description: 'From 1857 to Independence - detailed analysis', pages: '280 pages', views: 1567, isNew: false },
    { id: 4, title: 'Geography Climate Systems', description: 'Understanding weather patterns and climate change', pages: '195 pages', views: 743, isNew: true }
  ];

  const videoResources = [
    { id: 1, title: 'Constitutional Law Explained', description: 'Video series on fundamental rights and duties', duration: '2h 30m', views: 3421, isNew: true },
    { id: 2, title: 'Economic Survey Analysis', description: 'Detailed breakdown of latest economic survey', duration: '1h 45m', views: 2103, isNew: true },
    { id: 3, title: 'Ancient History Documentary', description: 'Indus Valley to Gupta Period', duration: '3h 15m', views: 1876, isNew: false },
    { id: 4, title: 'Current Affairs Weekly', description: 'Important news and analysis for UPSC', duration: '45m', views: 4532, isNew: true }
  ];

  const questionPapers = [
    { id: 1, title: 'UPSC Prelims 2023', description: 'Complete paper with detailed solutions', pages: '120 pages', views: 5672, year: 2023 },
    { id: 2, title: 'UPSC Mains 2023', description: 'All papers with model answers', pages: '350 pages', views: 4321, year: 2023 },
    { id: 3, title: 'UPSC Prelims 2022', description: 'Question paper and answer key', pages: '115 pages', views: 3890, year: 2022 },
    { id: 4, title: 'Mock Test Series 2024', description: 'Latest pattern based mock tests', pages: '200 pages', views: 2156, year: 2024 }
  ];

  const studyMaterials = [
    { id: 1, title: 'NCERT Summary Notes', description: 'Class 6-12 consolidated notes for UPSC', size: '15 MB', views: 6789, isNew: false },
    { id: 2, title: 'Current Affairs Compilation', description: 'Monthly current affairs with MCQs', size: '8 MB', views: 4532, isNew: true },
    { id: 3, title: 'Essay Writing Guide', description: 'Tips and sample essays for mains', size: '5 MB', views: 3210, isNew: false },
    { id: 4, title: 'Ethics Case Studies', description: 'Real-world ethical dilemmas and solutions', size: '12 MB', views: 2876, isNew: true }
  ];

  // Upcoming live classes
  const upcomingClasses = [
    {
      id: 1,
      subject: 'Constitutional Law',
      topic: 'Fundamental Rights Deep Dive',
      instructor: 'Dr. Rajesh Kumar',
      time: '10:00 AM',
      duration: '2 hours',
      students: 245,
      isLive: true
    },
    {
      id: 2,
      subject: 'Economics',
      topic: 'Budget Analysis 2024',
      instructor: 'Prof. Sarah Williams',
      time: '2:00 PM',
      duration: '1.5 hours',
      students: 189,
      isLive: false
    }
  ];

  // Learning paths
  const learningPaths = [
    { id: 1, title: 'UPSC Beginner Track', progress: 45, modules: 12, icon: Compass, color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Advanced Geography', progress: 78, modules: 8, icon: Globe, color: 'from-green-500 to-green-600' },
    { id: 3, title: 'Ethics & Governance', progress: 62, modules: 10, icon: Shield, color: 'from-purple-500 to-purple-600' },
    { id: 4, title: 'Current Affairs Pro', progress: 92, modules: 6, icon: Zap, color: 'from-orange-500 to-orange-600' }
  ];

  // Performance data for mini chart
  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Study Hours',
      data: [3, 4, 2, 5, 4, 6, 3],
      borderColor: 'rgb(9, 77, 136)',
      backgroundColor: 'rgba(9, 77, 136, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <DashboardLayout>
      {/* Container with max-width for better alignment */}
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Dark Mode Toggle - Fixed top right, outside content flow */}
        <motion.button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:scale-110 transition-transform border-2 border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Achievement Popup */}
        <AchievementPopup achievement={currentAchievement} onClose={handleClose} />

        {/* Enhanced Welcome Section with Daily Goals */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-6 md:p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-32 translate-y-32" />

          <div className="relative z-10">
            {/* Header with Streak */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {userData.name || 'Student'}! 👋
                </h1>
                <p className="text-white/90">
                  Continue your learning journey with personalized resources
                </p>
              </div>
              <motion.div
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-5 h-5 text-orange-300" />
                <div>
                  <div className="text-xl font-bold">7</div>
                  <div className="text-xs opacity-90">Day Streak</div>
                </div>
              </motion.div>
            </div>

            {/* Daily Goals Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { icon: Target, label: 'Daily Goal', current: 3, target: 4, unit: 'hours' },
                { icon: BookOpen, label: 'Tests Today', current: 2, target: 3, unit: 'tests' },
                { icon: Trophy, label: 'XP Earned', current: 450, target: 500, unit: 'XP' }
              ].map((goal, idx) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <motion.div
                    key={idx}
                    className="bg-white/15 backdrop-blur-md rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <goal.icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{goal.label}</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-bold">{goal.current}</span>
                      <span className="text-sm opacity-75 mb-1">/ {goal.target} {goal.unit}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: idx * 0.1 + 0.5, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { icon: Brain, label: 'AI Study Plan', route: '/ai-lesson-plan', color: 'from-purple-500/20 to-pink-500/20' },
                { icon: Users, label: 'Live Classes', route: '/classes', color: 'from-blue-500/20 to-cyan-500/20' },
                { icon: Target, label: 'Practice Tests', route: '/test', color: 'from-green-500/20 to-emerald-500/20' },
                { icon: MessageSquare, label: 'AI Assistant', route: '/ai-chat', color: 'from-orange-500/20 to-amber-500/20' }
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => navigate(action.route)}
                  className={`bg-gradient-to-br ${action.color} backdrop-blur-md rounded-xl p-4 hover:bg-white/30 transition-all group border border-white/20`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <action.icon className="w-7 h-7 md:w-8 md:h-8 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-xs md:text-sm font-medium">{action.label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Today's Schedule & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Today's Schedule */}
          <FuturisticCard className="p-6 rounded-2xl" delay={0.15}>
            <SectionHeader
              icon={Calendar}
              title="Today's Schedule"
              subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            />

            <div className="space-y-3">
              {[
                {
                  time: '10:00 AM',
                  title: 'Constitutional Law',
                  type: 'Live Class',
                  duration: '2 hours',
                  status: 'upcoming',
                  color: 'blue'
                },
                {
                  time: '2:00 PM',
                  title: 'Economics Quiz',
                  type: 'Assessment',
                  duration: '1 hour',
                  status: 'upcoming',
                  color: 'green'
                },
                {
                  time: '4:30 PM',
                  title: 'Mock Test Discussion',
                  type: 'Session',
                  duration: '1.5 hours',
                  status: 'scheduled',
                  color: 'purple'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-16 text-center py-2 rounded-lg ${
                    item.color === 'blue' ? 'bg-blue-100' :
                    item.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <div className={`text-lg font-bold ${
                      item.color === 'blue' ? 'text-blue-600' :
                      item.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`}>
                      {item.time.split(':')[0]}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.time.split(' ')[1]}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                </motion.div>
              ))}

              <button className="w-full py-2 text-brand-primary hover:text-brand-secondary font-medium text-sm transition-colors flex items-center justify-center gap-1">
                View Full Schedule
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FuturisticCard>

          {/* Upcoming Deadlines & Exams */}
          <FuturisticCard className="p-6 rounded-2xl" delay={0.2}>
            <SectionHeader
              icon={Timer}
              title="Upcoming Deadlines"
              subtitle="Stay on track with your goals"
            />

            <div className="space-y-3">
              {[
                {
                  title: 'UPSC Prelims 2025',
                  date: 'May 25, 2025',
                  daysLeft: 135,
                  type: 'Major Exam',
                  priority: 'high',
                  icon: GraduationCap
                },
                {
                  title: 'Mock Test Submission',
                  date: 'Dec 20, 2024',
                  daysLeft: 5,
                  type: 'Assignment',
                  priority: 'urgent',
                  icon: FileText
                },
                {
                  title: 'Essay Writing Task',
                  date: 'Dec 25, 2024',
                  daysLeft: 10,
                  type: 'Assignment',
                  priority: 'medium',
                  icon: FileText
                },
                {
                  title: 'Current Affairs Quiz',
                  date: 'Dec 22, 2024',
                  daysLeft: 7,
                  type: 'Assessment',
                  priority: 'medium',
                  icon: Target
                }
              ].map((deadline, idx) => (
                <motion.div
                  key={idx}
                  className={`p-4 rounded-xl border-2 ${
                    deadline.priority === 'urgent' ? 'bg-red-50 border-red-200' :
                    deadline.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  } hover:shadow-md transition-all cursor-pointer group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      deadline.priority === 'urgent' ? 'bg-red-100' :
                      deadline.priority === 'high' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      <deadline.icon className={`w-5 h-5 ${
                        deadline.priority === 'urgent' ? 'text-red-600' :
                        deadline.priority === 'high' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{deadline.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">{deadline.date}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          deadline.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          deadline.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {deadline.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        deadline.priority === 'urgent' ? 'text-red-600' :
                        deadline.priority === 'high' ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {deadline.daysLeft}
                      </div>
                      <div className="text-xs text-gray-600">days left</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button className="w-full py-2 text-brand-primary hover:text-brand-secondary font-medium text-sm transition-colors flex items-center justify-center gap-1">
                View All Deadlines
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FuturisticCard>
        </div>

        {/* Learning Paths */}
        <FuturisticCard className="p-6 rounded-2xl" delay={0.25}>
          <SectionHeader 
            icon={Map} 
            title="Your Learning Paths" 
            subtitle="Track your progress across different subjects"
            action="View All Paths"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningPaths.map((path, idx) => (
              <motion.div
                key={path.id}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${path.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <path.icon className="w-5 h-5" />
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1">{path.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{path.modules} modules</p>
                
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${path.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${path.progress}%` }}
                    transition={{ delay: idx * 0.1 + 0.5, duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">{path.progress}% complete</p>
              </motion.div>
            ))}
          </div>
        </FuturisticCard>

        {/* Main Content Grid - Improved spacing and alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Resources Section (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Study Resources Section */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.3}>
              <SectionHeader 
                icon={Library} 
                title="Study Resources" 
                subtitle="Access your learning materials"
              />
              
              {/* Resource Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {['all', 'pdf', 'video', 'audio'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* PDF Resources */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Materials
                </h3>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {pdfResources.slice(0, 2).map((resource, idx) => (
                    <ResourceCard key={resource.id} resource={resource} type="pdf" delay={idx * 0.1} />
                  ))}
                </div>
              </div>
              
              {/* Video Resources */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video Lectures
                </h3>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  {videoResources.slice(0, 2).map((resource, idx) => (
                    <ResourceCard key={resource.id} resource={resource} type="video" delay={idx * 0.1} />
                  ))}
                </div>
              </div>
              
              <button className="w-full py-3 text-brand-primary hover:text-brand-secondary font-medium transition-colors">
                View All Resources →
              </button>
            </FuturisticCard>

            {/* Previous Year Papers */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.4}>
              <SectionHeader 
                icon={Archive} 
                title="Previous Year Papers" 
                subtitle="Practice with past exam questions"
                action="View All Papers"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionPapers.map((paper, idx) => (
                  <motion.div
                    key={paper.id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                        {paper.year}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1">{paper.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{paper.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{paper.pages}</span>
                      <motion.button 
                        className="text-brand-primary hover:text-brand-secondary"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>

            {/* Study Materials & Guides */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.45}>
              <SectionHeader
                icon={BookMarked}
                title="Study Materials & Guides"
                subtitle="Essential resources for exam preparation"
                action="Browse All"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyMaterials.map((material, idx) => (
                  <motion.div
                    key={material.id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -3 }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookMarked className="w-6 h-6 text-teal-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{material.title}</h3>
                          {material.isNew && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{material.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              {material.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {material.views} views
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Bookmark"
                            >
                              <Bookmark className="w-4 h-4 text-teal-600" />
                            </motion.button>
                            <motion.button
                              className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-teal-600" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Live Classes */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.5} neonGlow={true}>
              <SectionHeader 
                icon={Users} 
                title="Live Classes" 
                subtitle="Join ongoing sessions"
              />
              
              <div className="space-y-4">
                {upcomingClasses.map((classItem, idx) => (
                  <motion.div
                    key={classItem.id}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {classItem.isLive && (
                      <div className="absolute top-3 right-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        classItem.isLive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{classItem.topic}</h4>
                        <p className="text-xs text-gray-600 mt-1">{classItem.instructor}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {classItem.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {classItem.students}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      classItem.isLive
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-brand-primary text-white hover:bg-brand-secondary'
                    }`}>
                      {classItem.isLive ? 'Join Now' : 'Set Reminder'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>

            {/* Recent Activity Feed */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.58}>
              <SectionHeader
                icon={Activity}
                title="Recent Activity"
                subtitle="Your latest actions"
              />

              <div className="space-y-3">
                {[
                  {
                    type: 'achievement',
                    icon: Trophy,
                    title: 'Achievement Unlocked',
                    description: 'Completed 7-day study streak',
                    time: '5 min ago',
                    color: 'yellow'
                  },
                  {
                    type: 'test',
                    icon: CheckCircle,
                    title: 'Test Completed',
                    description: 'Economics Quiz - Score: 85%',
                    time: '2 hours ago',
                    color: 'green'
                  },
                  {
                    type: 'class',
                    icon: Users,
                    title: 'Attended Class',
                    description: 'Constitutional Law Session',
                    time: '5 hours ago',
                    color: 'blue'
                  },
                  {
                    type: 'resource',
                    icon: BookOpen,
                    title: 'Resource Accessed',
                    description: 'NCERT Summary Notes',
                    time: 'Yesterday',
                    color: 'purple'
                  }
                ].map((activity, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.color === 'yellow' ? 'bg-yellow-100' :
                      activity.color === 'green' ? 'bg-green-100' :
                      activity.color === 'blue' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <activity.icon className={`w-5 h-5 ${
                        activity.color === 'yellow' ? 'text-yellow-600' :
                        activity.color === 'green' ? 'text-green-600' :
                        activity.color === 'blue' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm group-hover:text-brand-primary transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full py-2 mt-3 text-brand-primary hover:text-brand-secondary font-medium text-sm transition-colors flex items-center justify-center gap-1">
                View All Activity
                <ChevronRight className="w-4 h-4" />
              </button>
            </FuturisticCard>

            {/* Performance Analytics */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.6}>
              <SectionHeader 
                icon={BarChart2} 
                title="Your Progress" 
                subtitle="This week's performance"
              />
              
              <div className="h-48">
                <Line
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 8,
                        borderRadius: 8,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 8,
                        ticks: { stepSize: 2 }
                      },
                      x: {
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">28h</p>
                  <p className="text-xs text-green-600">Total this week</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">4h</p>
                  <p className="text-xs text-blue-600">Daily average</p>
                </div>
              </div>
            </FuturisticCard>

            {/* AI Recommendations */}
            <FuturisticCard className="p-6 rounded-2xl" delay={0.7}>
              <SectionHeader 
                icon={Sparkles} 
                title="AI Insights" 
                subtitle="Personalized recommendations"
              />
              
              <div className="space-y-3">
                <motion.div 
                  className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Focus on Geography</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Your performance in Geography needs improvement. Try the recommended modules.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Great Progress!</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        You're 15% ahead of your study goals this month.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FuturisticCard>
          </div>
        </div>
      </div>

      {/* AI Voice Agent is now in DashboardLayout using ElevenLabs */}

    </DashboardLayout>
  );
}