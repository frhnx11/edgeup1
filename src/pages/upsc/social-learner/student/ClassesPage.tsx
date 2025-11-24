import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  CheckCircle,
  XCircle,
  Award,
  Wifi,
  WifiOff,
  Download,
  Share2,
  Trophy,
  Play,
  ChevronRight,
  LogIn,
  Sparkles,
  Activity,
  TrendingUp,
  BookOpen,
  Map
} from 'lucide-react';

// Types
interface Class {
  id: string;
  subject: string;
  topic: string;
  instructor: {
    name: string;
    image: string;
    expertise: string;
    rating: number;
    experience: string;
  };
  schedule: {
    date: string;
    time: string;
    duration: string;
  };
  bookingStatus?: 'not-booked' | 'booked' | 'waitlisted' | 'attended' | 'missed';
  attendanceMarked?: boolean;
  totalSeats: number;
  bookedSeats: number;
  waitlistCount?: number;
  materials: Array<{ type: string; title: string; size?: string }>;
  description: string;
  preparation: string[];
  day: 'yesterday' | 'today' | 'tomorrow';
  learningPath?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  liveStatus?: 'live' | 'upcoming' | 'ended';
  tags: string[];
  prerequisites?: string[];
  isPopular?: boolean;
  bookingDeadline?: string;
}

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

export function ClassesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDay, setSelectedDay] = useState<'yesterday' | 'today' | 'tomorrow'>('today');
  const [showFirstPopup, setShowFirstPopup] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const subjects = ['Geography', 'History', 'Current Affairs', 'Economics', 'Polity'];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const currentTime = new Date();

  // Sample classes data
  const classes: Class[] = [
    {
      id: '0',
      subject: 'Geography',
      topic: 'Weather Systems & Climate Change',
      instructor: {
        name: 'Dr. Ravikumar',
        image: '/Ravikumar.png',
        expertise: 'Geography Optional, NET Qualified',
        rating: 4.9,
        experience: '17+ years'
      },
      schedule: {
        date: formatDate(today),
        time: '9:00 AM',
        duration: '2.5 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 200,
      bookedSeats: 195,
      waitlistCount: 50,
      materials: [
        { type: 'pdf', title: 'Weather Systems and Patterns', size: '12.3 MB' },
        { type: 'notes', title: 'Climate Classification Guide' },
        { type: 'video', title: 'Monsoon Mechanism Animation' },
        { type: 'quiz', title: 'Weather & Climate Assessment' }
      ],
      description: 'Comprehensive master class on weather phenomena and climate systems.',
      preparation: [
        'Study atmospheric layers and composition',
        'Review pressure belts and wind systems',
        'Understand basic meteorological concepts',
        'Read about Indian monsoon mechanism',
        'Complete weather symbols worksheet'
      ],
      day: 'today',
      learningPath: 'geography-climate',
      difficulty: 'advanced',
      liveStatus: currentTime.getHours() === 9 ? 'live' : currentTime.getHours() < 9 ? 'upcoming' : 'ended',
      tags: ['Weather Systems', 'Climate', 'Monsoon', 'Master Class'],
      prerequisites: ['Basic Physical Geography', 'Atmospheric Science Fundamentals'],
      isPopular: true,
      bookingDeadline: 'High Demand - Limited Seats'
    },
    {
      id: '1',
      subject: 'Geography',
      topic: 'Indian Monsoon System',
      instructor: {
        name: 'Dr. Ravikumar',
        image: '/Ravikumar.png',
        expertise: 'Geography Optional, NET Qualified',
        rating: 4.9,
        experience: '17+ years'
      },
      schedule: {
        date: formatDate(today),
        time: '11:30 AM',
        duration: '2 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 160,
      bookedSeats: 142,
      materials: [
        { type: 'pdf', title: 'Monsoon Maps & Diagrams', size: '5.2 MB' },
        { type: 'notes', title: 'El Nino & La Nina Effects' },
        { type: 'video', title: 'Animation: Monsoon Mechanism' }
      ],
      description: 'Comprehensive understanding of Indian monsoon, factors affecting it, and impact on agriculture',
      preparation: [
        'Review pressure systems and wind patterns',
        'Study India physical map thoroughly',
        'Complete weather patterns worksheet',
        'Watch IMD monsoon forecast video'
      ],
      day: 'today',
      learningPath: 'geography-climate',
      difficulty: 'intermediate',
      liveStatus: currentTime.getHours() === 11 && currentTime.getMinutes() >= 30 ? 'live' : 'upcoming',
      tags: ['Monsoon', 'Climate', 'Agriculture']
    },
    {
      id: '2',
      subject: 'History',
      topic: 'Quit India Movement 1942',
      instructor: {
        name: 'Dr. Rajesh Sharma',
        image: 'https://randomuser.me/api/portraits/men/42.jpg',
        expertise: 'Retired DGP, Modern Indian History Expert',
        rating: 4.9,
        experience: '30+ years'
      },
      schedule: {
        date: formatDate(today),
        time: '2:30 PM',
        duration: '2 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 160,
      bookedSeats: 142,
      materials: [
        { type: 'pdf', title: 'August Kranti Timeline', size: '3.1 MB' },
        { type: 'video', title: 'Documentary: Do or Die' },
        { type: 'notes', title: 'Key Leaders & Events' }
      ],
      description: 'Analysis of Quit India Movement, its causes, events, and impact on independence struggle',
      preparation: [
        'Read about Cripps Mission failure',
        'Review timeline 1940-1942',
        'Complete notes on provincial movements',
        'Watch documentary on 1942 movement'
      ],
      day: 'today',
      learningPath: 'history-freedom-movement',
      difficulty: 'intermediate',
      liveStatus: 'upcoming',
      tags: ['Freedom Movement', 'Gandhi', 'Important Dates']
    },
    {
      id: '3',
      subject: 'Current Affairs',
      topic: 'G20 Summit & Global Economy',
      instructor: {
        name: 'Mr. Guna Mathivanan',
        image: '/Guna.png',
        expertise: 'Current Affairs & Economics Expert',
        rating: 4.8,
        experience: '15+ years'
      },
      schedule: {
        date: formatDate(today),
        time: '5:00 PM',
        duration: '1.5 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 160,
      bookedSeats: 142,
      materials: [
        { type: 'pdf', title: 'G20 Declaration Summary', size: '1.5 MB' },
        { type: 'notes', title: "India's G20 Presidency" },
        { type: 'quiz', title: 'Current Affairs Quiz' }
      ],
      description: "Analysis of recent G20 summit outcomes and India's role in global economic governance",
      preparation: [
        'Read about G20 member countries',
        "Review India's G20 priorities",
        'Study recent economic indicators',
        'Complete current affairs worksheet'
      ],
      day: 'today',
      difficulty: 'beginner',
      liveStatus: 'upcoming',
      tags: ['G20', 'Current Affairs', 'International']
    },
    {
      id: 't1',
      subject: 'Current Affairs',
      topic: 'International Relations & Global Politics',
      instructor: {
        name: 'Dr. Stanly Johny',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        expertise: 'International Affairs Editor - The Hindu',
        rating: 4.9,
        experience: '20+ years'
      },
      schedule: {
        date: formatDate(tomorrow),
        time: '9:30 AM',
        duration: '2 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 160,
      bookedSeats: 142,
      materials: [
        { type: 'pdf', title: 'Global Power Dynamics Analysis', size: '3.8 MB' },
        { type: 'video', title: 'The Hindu Editorial Analysis' },
        { type: 'quiz', title: 'International Relations Quiz' }
      ],
      description: "Expert analysis of contemporary global politics and India's foreign policy",
      preparation: [
        'Read current editorials on international affairs',
        'Review recent UN Security Council decisions',
        'Study India\'s bilateral relations with major powers'
      ],
      day: 'tomorrow',
      difficulty: 'intermediate',
      tags: ['International Relations', 'Foreign Policy', 'Global Politics']
    },
    {
      id: 't2',
      subject: 'Economics',
      topic: 'Digital Economy & FinTech',
      instructor: {
        name: 'Mr. Guna Mathivanan',
        image: '/Guna.png',
        expertise: 'Economics & Current Affairs Expert',
        rating: 4.8,
        experience: '15+ years'
      },
      schedule: {
        date: formatDate(tomorrow),
        time: '2:00 PM',
        duration: '2 hours'
      },
      bookingStatus: 'not-booked',
      totalSeats: 160,
      bookedSeats: 142,
      materials: [
        { type: 'pdf', title: 'UPI & Digital Payments', size: '2.8 MB' },
        { type: 'notes', title: 'Cryptocurrency Basics' },
        { type: 'video', title: 'Digital India Success Stories' }
      ],
      description: "Exploring India's digital payment ecosystem, UPI success, and future of digital currency",
      preparation: [
        'Study Digital India initiatives',
        "Review RBI's digital currency pilot",
        'Complete fintech terminology sheet',
        'Research UPI transaction statistics'
      ],
      day: 'tomorrow',
      difficulty: 'beginner',
      tags: ['Digital Economy', 'UPI', 'Technology']
    }
  ];

  const handleEnterClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowFirstPopup(true);
  };

  const handleFirstPopupConfirm = () => {
    setShowFirstPopup(false);
    setShowSecondPopup(true);
  };

  const handleSecondPopupClose = () => {
    setShowSecondPopup(false);

    if (selectedClass) {
      // Store class information for AI chat assistant
      const topicData = {
        subject: selectedClass.subject,
        topic: selectedClass.topic,
        description: selectedClass.description,
        instructor: selectedClass.instructor,
        schedule: selectedClass.schedule,
        difficulty: selectedClass.difficulty
      };

      localStorage.setItem('currentLearningTopic', JSON.stringify(topicData));

      // Navigate to AI chat assistant page
      navigate('/ai-chat-assistant', { state: { topic: topicData } });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLiveStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'live':
        return (
          <motion.span
            className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Wifi className="w-3 h-3" />
            LIVE
          </motion.span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-primary text-white rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Upcoming
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded-full text-xs font-medium">
            <WifiOff className="w-3 h-3" />
            Ended
          </span>
        );
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSubject = selectedSubject === 'all' || classItem.subject === selectedSubject;
    const matchesSearch = classItem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = classItem.day === selectedDay;
    return matchesSubject && matchesSearch && matchesDay;
  });

  // Calculate stats
  const todayClasses = classes.filter(c => c.day === 'today');
  const totalClassesToday = todayClasses.length;
  const upcomingClasses = classes.filter(c => (c.day === 'today' || c.day === 'tomorrow'));

  return (
      <>
      <div className="space-y-6">
        <WelcomeTooltip message="Join live sessions or catch up on recorded classes anytime." />

        {/* Header with Enhanced Stats */}
        <FuturisticCard className="p-6 rounded-2xl" delay={0}>
          <SectionHeader
            icon={BookOpen}
            title="My Classes"
            subtitle="Track your learning journey"
          />

          <div className="grid grid-cols-4 gap-6 mt-6">
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-brand-primary mb-1">
                <AnimatedCounter value={totalClassesToday} />
              </div>
              <div className="text-sm text-gray-600">Classes Today</div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-brand-secondary/10 to-brand-secondary/5 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-brand-secondary mb-1">
                <AnimatedCounter value={upcomingClasses.length} />
              </div>
              <div className="text-sm text-gray-600">Upcoming Classes</div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-6 h-6" />
                <AnimatedCounter value={15} />
              </div>
              <div className="text-sm text-gray-600">Classes This Week</div>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-purple-600 flex items-center justify-center gap-2 mb-1">
                <Star className="w-6 h-6" />
                <AnimatedCounter value={4.8} />
              </div>
              <div className="text-sm text-gray-600">Avg. Rating</div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-6">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Download Schedule
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-secondary to-brand-accent text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Award className="w-4 h-4" />
              View Achievements
            </motion.button>
          </div>
        </FuturisticCard>

        {/* Day Selector */}
        <motion.div
          className="flex gap-2 bg-white rounded-xl shadow-sm p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {(['yesterday', 'today', 'tomorrow'] as const).map((day, idx) => (
            <motion.button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <div className="text-xs opacity-80 mt-1">
                {day === 'yesterday' && yesterday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                {day === 'today' && today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                {day === 'tomorrow' && tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by topic or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 transition-all"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              More Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.length === 0 ? (
            <FuturisticCard className="col-span-2 text-center py-12 rounded-2xl" delay={0.4}>
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No classes found for the selected filters</p>
            </FuturisticCard>
          ) : (
            filteredClasses.map((classItem, index) => (
              <FuturisticCard
                key={classItem.id}
                className="rounded-2xl overflow-hidden"
                delay={0.4 + index * 0.1}
                neonGlow={classItem.liveStatus === 'live'}
              >
                {/* Status Bar */}
                <div className={`h-1.5 ${
                  classItem.liveStatus === 'live' ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' :
                  classItem.liveStatus === 'upcoming' ? 'bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent' :
                  'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400'
                }`} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary">
                        {classItem.subject}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(classItem.difficulty)}`}>
                        {classItem.difficulty.charAt(0).toUpperCase() + classItem.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getLiveStatusBadge(classItem.liveStatus)}
                    </div>
                  </div>

                  {/* Topic */}
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-brand-primary transition-colors">
                    {classItem.topic}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {classItem.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Instructor */}
                  <motion.div
                    className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={classItem.instructor.image}
                      alt={classItem.instructor.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{classItem.instructor.name}</div>
                      <div className="text-xs text-gray-600">{classItem.instructor.expertise} • {classItem.instructor.experience}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{classItem.instructor.rating}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Schedule Info */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 bg-gradient-to-r from-brand-primary/5 to-transparent p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      <span className="text-sm">{new Date(classItem.schedule.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gradient-to-r from-brand-secondary/5 to-transparent p-2 rounded-lg">
                      <Clock className="w-4 h-4 text-brand-secondary" />
                      <span className="text-sm">{classItem.schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gradient-to-r from-brand-accent/5 to-transparent p-2 rounded-lg">
                      <Users className="w-4 h-4 text-brand-accent" />
                      <span className="text-sm">{classItem.bookedSeats}/{classItem.totalSeats} seats</span>
                    </div>
                  </div>

                  {/* Enter Button */}
                  <motion.button
                    onClick={() => handleEnterClass(classItem)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Enter Class</span>
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                </div>
              </FuturisticCard>
            ))
          )}
        </div>
      </div>

      {/* First Popup - Completion Confirmation */}
      <AnimatePresence>
        {showFirstPopup && selectedClass && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFirstPopup(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />

                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    Class Completion
                  </h2>

                  {/* Message */}
                  <p className="text-center text-gray-600 mb-8">
                    You have completed <span className="font-semibold text-brand-primary">{selectedClass.topic}</span> class with <span className="font-semibold">{selectedClass.instructor.name}</span>
                  </p>

                  {/* Confirm Button */}
                  <motion.button
                    onClick={handleFirstPopupConfirm}
                    className="w-full py-3 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirm
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Second Popup - Success Message */}
      <AnimatePresence>
        {showSecondPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

                <div className="relative">
                  {/* Success Icon with Animation */}
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Award className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Celebration Effect */}
                  <motion.div
                    className="absolute top-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -50 }}
                    transition={{ duration: 1, repeat: 2 }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    Congratulations! 🎉
                  </h2>

                  {/* Message */}
                  <p className="text-center text-gray-600 mb-8">
                    Your attendance has been marked successfully. Continue learning with our AI Assistant!
                  </p>

                  {/* Continue Button */}
                  <motion.button
                    onClick={handleSecondPopupClose}
                    className="w-full py-3 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Continue to AI Assistant</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </>
  );
}
