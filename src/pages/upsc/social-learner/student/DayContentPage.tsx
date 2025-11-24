import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Users,
  FileText,
  Brain,
  MessageSquare,
  HelpCircle,
  CheckSquare,
  Play,
  PlayCircle,
  Download,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Mic,
  Send,
  AlertCircle,
  CheckCircle,
  Timer,
  Award,
  Target,
  Zap,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  BarChart3,
  Activity,
  Headphones,
  Monitor,
  Wifi,
  WifiOff,
  Circle,
  BookMarked,
  ClipboardList,
  MessageCircle,
  Bot,
  Ticket,
  ListChecks,
  FileCheck,
  Youtube,
  Tv,
  Cast
} from 'lucide-react';

// Section Card Component
const SectionCard = ({ section, delay = 0 }) => {
  const Icon = section.icon;
  const navigate = useNavigate();
  
  return (
    <motion.div
      className={`relative bg-white rounded-xl p-6 border-2 ${
        section.isLocked 
          ? 'border-gray-200 opacity-75' 
          : 'border-gray-200 hover:border-brand-primary/30 cursor-pointer'
      } transition-all`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={!section.isLocked ? { y: -3 } : {}}
      onClick={() => !section.isLocked && section.onClick && section.onClick()}
    >
      {section.isLocked && (
        <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${section.color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {section.badge && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${section.badgeColor}`}>
            {section.badge}
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2">{section.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{section.description}</p>
      
      {section.stats && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {section.stats.map((stat, idx) => (
            <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      
      {section.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{section.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${section.progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </div>
        </div>
      )}
      
      <button
        className={`w-full py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
          section.isLocked
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'
        }`}
        disabled={section.isLocked}
      >
        {section.buttonText}
        {!section.isLocked && <ChevronRight className="w-4 h-4" />}
      </button>
    </motion.div>
  );
};

// Quick Info Widget
const QuickInfoWidget = ({ dayInfo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { icon: Calendar, label: 'Day', value: `Day ${dayInfo.dayNumber}` },
        { icon: Clock, label: 'Duration', value: dayInfo.duration },
        { icon: Target, label: 'Topics', value: dayInfo.topicCount },
        { icon: Activity, label: 'Activities', value: dayInfo.activityCount }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          className="bg-white rounded-lg p-4 border border-gray-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Live Class Widget
const LiveClassWidget = ({ liveClass }) => {
  if (!liveClass) return null;
  
  return (
    <motion.div
      className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wifi className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Live Class in Progress</h3>
            <p className="text-white/90 text-sm">{liveClass.topic} with {liveClass.instructor}</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-white/90 transition-colors">
          Join Now
        </button>
      </div>
    </motion.div>
  );
};

export function DayContentPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  
  // Sample day information (in real app, fetch based on courseId and dayNumber)
  const dayInfo = {
    dayNumber: dayNumber || '1',
    date: 'March 15, 2024',
    topic: 'Ancient India - Indus Valley Civilization',
    duration: '4 hours',
    topicCount: '5 Topics',
    activityCount: '8 Activities',
    weekNumber: 1,
    weekTheme: 'Foundation & Ancient History',
    course: courseId === 'prelims' ? 'UPSC Prelims' : 'UPSC Mains'
  };
  
  // Sample live class info
  const liveClass = {
    isLive: true,
    topic: 'Indus Valley Civilization - Architecture & Town Planning',
    instructor: 'Dr. Rajesh Kumar',
    startTime: '10:00 AM',
    duration: '90 minutes',
    students: 245
  };
  
  // Content sections
  const sections = [
    {
      id: 'recorded-videos',
      title: 'Video Recorded Content',
      description: 'Access pre-recorded lectures and explanations',
      icon: Youtube,
      color: 'from-red-500 to-red-600',
      buttonText: 'Watch Videos',
      badge: '5 Videos',
      badgeColor: 'bg-red-100 text-red-700',
      stats: [
        { value: '3h 45m', label: 'Total Duration' },
        { value: '2/5', label: 'Completed' }
      ],
      progress: 40,
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/video-lessons`)
    },
    {
      id: 'live-class',
      title: 'Live Video Class',
      description: 'Join interactive live sessions with instructors',
      icon: Tv,
      color: 'from-blue-500 to-blue-600',
      buttonText: 'View Schedule',
      badge: 'Live Now',
      badgeColor: 'bg-red-100 text-red-700',
      stats: [
        { value: '10:00 AM', label: 'Next Class' },
        { value: '90 min', label: 'Duration' }
      ],
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/live-class/live-${dayNumber}`)
    },
    {
      id: 'study-materials',
      title: 'Study Materials',
      description: 'Download PDFs, notes, and reference materials',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      buttonText: 'Access Materials',
      badge: '12 Files',
      badgeColor: 'bg-green-100 text-green-700',
      stats: [
        { value: '8', label: 'PDFs' },
        { value: '4', label: 'Notes' }
      ],
      progress: 75,
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/study-materials`)
    },
    {
      id: 'quiz',
      title: 'Quiz (Test)',
      description: 'Test your understanding with topic-wise quizzes',
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      buttonText: 'Start Quiz',
      badge: '3 Quizzes',
      badgeColor: 'bg-purple-100 text-purple-700',
      stats: [
        { value: '50', label: 'Questions' },
        { value: '1/3', label: 'Attempted' }
      ],
      progress: 33,
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/quiz`)
    },
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      description: 'Get instant answers and explanations from AI',
      icon: Bot,
      color: 'from-indigo-500 to-indigo-600',
      buttonText: 'Open AI Chat',
      badge: 'Available 24/7',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      stats: [
        { value: '∞', label: 'Questions' },
        { value: 'Instant', label: 'Response' }
      ],
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/ai-assistant`)
    },
    {
      id: 'doubts',
      title: 'Doubts (Ticketing/AI)',
      description: 'Ask questions and get help from instructors or AI',
      icon: HelpCircle,
      color: 'from-orange-500 to-orange-600',
      buttonText: 'Ask Doubt',
      badge: '2 Pending',
      badgeColor: 'bg-orange-100 text-orange-700',
      stats: [
        { value: '5', label: 'Asked' },
        { value: '3', label: 'Resolved' }
      ],
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/doubts`)
    },
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Complete assignments and practice exercises',
      icon: ListChecks,
      color: 'from-teal-500 to-teal-600',
      buttonText: 'View Tasks',
      badge: '4 Tasks',
      badgeColor: 'bg-teal-100 text-teal-700',
      stats: [
        { value: '2/4', label: 'Completed' },
        { value: 'Today', label: 'Due Date' }
      ],
      progress: 50,
      isLocked: false,
      onClick: () => navigate(`/course/${courseId}/day/${dayNumber}/tasks`)
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schedule
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">
                {dayInfo.course} • Week {dayInfo.weekNumber} - {dayInfo.weekTheme}
              </p>
              <h1 className="text-2xl font-bold mb-2">Day {dayInfo.dayNumber}: {dayInfo.topic}</h1>
              <p className="text-white/90">{dayInfo.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {dayInfo.duration}
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Info */}
        <QuickInfoWidget dayInfo={dayInfo} />
        
        {/* Live Class Alert */}
        {liveClass.isLive && <LiveClassWidget liveClass={liveClass} />}
        
        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section, idx) => (
            <SectionCard
              key={section.id}
              section={section}
              delay={idx * 0.1}
            />
          ))}
        </div>
        
        {/* Progress Summary */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-primary" />
            Today's Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Completion</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">45%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Time Spent</p>
              <p className="text-2xl font-bold text-gray-800">2h 15m</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Activities Completed</p>
              <p className="text-2xl font-bold text-gray-800">4/8</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}