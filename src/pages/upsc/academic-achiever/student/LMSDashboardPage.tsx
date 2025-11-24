import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Target,
  Clock,
  Calendar,
  Brain,
  ChevronRight,
  Award,
  BarChart3,
  FileText,
  Video,
  Headphones,
  Users,
  Activity,
  Trophy,
  Star,
  TrendingUp,
  Bell,
  Filter,
  Search,
  Grid3x3,
  List,
  CheckCircle,
  AlertCircle,
  Timer,
  Zap,
  Map,
  Compass,
  Medal,
  Flame,
  BookMarked,
  Library,
  PenTool,
  Calculator,
  Globe,
  History,
  Briefcase,
  MessageSquare,
  PlayCircle,
  Download,
  ExternalLink,
  ChevronDown,
  Info,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
  Swords,
  Flag,
  Mountain,
  Crosshair,
  Moon
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

// Course Selection Card Component
const CourseSelectionCard = ({ course, isSelected, onSelect }) => {
  const Icon = course.icon;
  
  return (
    <motion.div
      className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
        isSelected 
          ? 'border-brand-primary bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10' 
          : 'border-gray-200 bg-white hover:border-brand-primary/30'
      }`}
      onClick={() => onSelect(course)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSelected && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-brand-primary" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
          isSelected 
            ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <Icon className="w-7 h-7" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{course.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.subjects} subjects
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {course.students} students
            </span>
          </div>
          
          {course.features && (
            <div className="mt-3 flex flex-wrap gap-2">
              {course.features.map((feature, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Study Progress Card
const StudyProgressCard = ({ subject, progress, totalTopics, completedTopics, color }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-primary/30 transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">{subject}</h4>
        <span className={`text-sm font-medium ${color}`}>{progress}%</span>
      </div>
      
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <motion.div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color.replace('text-', 'from-')}-500 ${color.replace('text-', 'to-')}-600`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{completedTopics} completed</span>
        <span>{totalTopics} total topics</span>
      </div>
    </motion.div>
  );
};

// Quick Stats Widget
const QuickStatsWidget = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100"
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
          <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

// UPSC Feature Card
const UPSCFeatureCard = ({ feature, delay = 0 }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
      
      {feature.stats && (
        <div className="grid grid-cols-2 gap-3">
          {feature.stats.map((stat, idx) => (
            <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      
      <motion.button
        className="mt-4 w-full py-2 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors flex items-center justify-center gap-2"
        whileHover={{ x: 5 }}
      >
        {feature.action}
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

// Course Schedule Component
const CourseSchedule = ({ schedule, courseName, courseId }) => {
  const [expandedWeek, setExpandedWeek] = useState(0);
  const navigate = useNavigate();
  
  const handleDayClick = (dayNumber) => {
    navigate(`/course/${courseId}/day/${dayNumber}`);
  };
  
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Course Schedule - {courseName}</h2>
            <p className="text-sm text-gray-600">Day-wise content breakdown</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Total Duration: {schedule.totalDays} days
        </span>
      </div>
      
      <div className="space-y-4">
        {schedule.weeks.map((week, weekIdx) => (
          <motion.div
            key={weekIdx}
            className="border border-gray-200 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: weekIdx * 0.1 }}
          >
            <button
              onClick={() => setExpandedWeek(expandedWeek === weekIdx ? -1 : weekIdx)}
              className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Week {week.weekNumber}</span>
                <span className="text-xs text-gray-500">({week.theme})</span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedWeek === weekIdx ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            <AnimatePresence>
              {expandedWeek === weekIdx && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    {week.days.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => handleDayClick(day.dayNumber)}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            day.isCompleted 
                              ? 'bg-green-100 text-green-700' 
                              : day.isCurrent
                              ? 'bg-brand-primary text-white'
                              : 'bg-gray-100 text-gray-600'
                          } group-hover:scale-110 transition-transform`}>
                            {day.dayNumber}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1 group-hover:text-brand-primary transition-colors">Day {day.dayNumber}</h4>
                          <p className="text-sm text-gray-600">{day.topics}</p>
                          {day.isCurrent && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">
                              <Clock className="w-3 h-3" />
                              Today's Schedule
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">{day.duration}</span>
                          {day.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto mt-1" />
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Student Details Card Component
const StudentDetailsCard = ({ studentInfo }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
        </div>
        <button className="text-sm text-brand-primary hover:text-brand-secondary font-medium">
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Student ID</p>
          <p className="font-medium text-gray-800">{studentInfo.studentId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Batch Number</p>
          <p className="font-medium text-gray-800">{studentInfo.batchNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Batch Timing</p>
          <p className="font-medium text-gray-800">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              studentInfo.batchTiming === 'Morning' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-indigo-100 text-indigo-700'
            }`}>
              {studentInfo.batchTiming === 'Morning' ? <Clock className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {studentInfo.batchTiming} Batch
            </span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Enrollment Date</p>
          <p className="font-medium text-gray-800">{studentInfo.enrollmentDate}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Faculty Advisor</p>
          <p className="font-medium text-gray-800">{studentInfo.facultyAdvisor}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Study Group</p>
          <p className="font-medium text-gray-800">{studentInfo.studyGroup}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Attempt Number</p>
          <p className="font-medium text-gray-800">{studentInfo.attemptNumber}</p>
        </div>
      </div>
    </motion.div>
  );
};

export function LMSDashboardPage() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // Student Information (in real app, this would come from backend/database)
  const studentInfo = {
    studentId: userData.studentId || 'UPSC2024001',
    batchNumber: 'Batch-27',
    batchTiming: 'Morning', // 'Morning' or 'Evening'
    enrollmentDate: 'Jan 15, 2024',
    facultyAdvisor: 'Dr. Rajesh Kumar',
    studyGroup: 'Group A - Constitutional Law',
    attemptNumber: '1st Attempt',
    email: userData.email || 'student@example.com',
    phone: userData.phone || '+91 9876543210'
  };

  // UPSC Courses with Schedule
  const upscCourses = [
    {
      id: 'prelims',
      title: 'UPSC Prelims',
      icon: Target,
      description: 'Comprehensive preparation for UPSC Civil Services Preliminary Examination',
      subjects: 8,
      duration: '6 months',
      students: '12.5k',
      features: ['GS Paper I', 'GS Paper II (CSAT)', 'Current Affairs', 'Mock Tests'],
      modules: [
        { name: 'History', progress: 65, totalTopics: 45, completedTopics: 29 },
        { name: 'Geography', progress: 78, totalTopics: 38, completedTopics: 30 },
        { name: 'Polity', progress: 45, totalTopics: 42, completedTopics: 19 },
        { name: 'Economy', progress: 32, totalTopics: 35, completedTopics: 11 },
        { name: 'Science & Tech', progress: 58, totalTopics: 30, completedTopics: 17 },
        { name: 'Environment', progress: 70, totalTopics: 25, completedTopics: 18 },
        { name: 'Current Affairs', progress: 85, totalTopics: 60, completedTopics: 51 },
        { name: 'CSAT', progress: 40, totalTopics: 40, completedTopics: 16 }
      ],
      schedule: {
        totalDays: 180,
        weeks: [
          {
            weekNumber: 1,
            theme: 'Foundation & Ancient History',
            days: [
              { dayNumber: 1, topics: 'Course Introduction & Study Strategy', duration: '3 hours', isCompleted: true },
              { dayNumber: 2, topics: 'Ancient India - Indus Valley Civilization', duration: '4 hours', isCompleted: true },
              { dayNumber: 3, topics: 'Vedic Period & Early Kingdoms', duration: '4 hours', isCompleted: true },
              { dayNumber: 4, topics: 'Mauryan Empire & Post-Mauryan Period', duration: '4 hours', isCompleted: true },
              { dayNumber: 5, topics: 'Gupta Period & Regional Kingdoms', duration: '4 hours', isCompleted: false, isCurrent: true },
              { dayNumber: 6, topics: 'Revision & Mock Test', duration: '5 hours', isCompleted: false },
              { dayNumber: 7, topics: 'Weekly Assessment & Doubt Clearing', duration: '3 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 2,
            theme: 'Medieval History & Geography Basics',
            days: [
              { dayNumber: 8, topics: 'Delhi Sultanate & Regional Kingdoms', duration: '4 hours', isCompleted: false },
              { dayNumber: 9, topics: 'Mughal Empire - Rise and Consolidation', duration: '4 hours', isCompleted: false },
              { dayNumber: 10, topics: 'Physical Geography - Earth & Universe', duration: '4 hours', isCompleted: false },
              { dayNumber: 11, topics: 'Climatology & Weather Systems', duration: '4 hours', isCompleted: false },
              { dayNumber: 12, topics: 'Indian Monsoon System', duration: '4 hours', isCompleted: false },
              { dayNumber: 13, topics: 'Revision & Practice Questions', duration: '5 hours', isCompleted: false },
              { dayNumber: 14, topics: 'Weekly Test & Analysis', duration: '3 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 3,
            theme: 'Modern History & Indian Geography',
            days: [
              { dayNumber: 15, topics: 'British Rule - Company Era', duration: '4 hours', isCompleted: false },
              { dayNumber: 16, topics: 'Crown Rule & Administrative Changes', duration: '4 hours', isCompleted: false },
              { dayNumber: 17, topics: 'Indian Physical Geography - Mountains & Rivers', duration: '4 hours', isCompleted: false },
              { dayNumber: 18, topics: 'Indian Climate & Natural Resources', duration: '4 hours', isCompleted: false },
              { dayNumber: 19, topics: 'Agriculture & Irrigation in India', duration: '4 hours', isCompleted: false },
              { dayNumber: 20, topics: 'Comprehensive Revision', duration: '5 hours', isCompleted: false },
              { dayNumber: 21, topics: 'Mock Test & Performance Analysis', duration: '3 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 4,
            theme: 'Polity Foundation & Constitution',
            days: [
              { dayNumber: 22, topics: 'Historical Background of Constitution', duration: '4 hours', isCompleted: false },
              { dayNumber: 23, topics: 'Preamble & Features of Constitution', duration: '4 hours', isCompleted: false },
              { dayNumber: 24, topics: 'Fundamental Rights & DPSP', duration: '4 hours', isCompleted: false },
              { dayNumber: 25, topics: 'Fundamental Duties & Amendments', duration: '4 hours', isCompleted: false },
              { dayNumber: 26, topics: 'Union Executive - President & PM', duration: '4 hours', isCompleted: false },
              { dayNumber: 27, topics: 'Practice Session & Case Studies', duration: '5 hours', isCompleted: false },
              { dayNumber: 28, topics: 'Monthly Assessment', duration: '3 hours', isCompleted: false }
            ]
          }
        ]
      }
    },
    {
      id: 'mains',
      title: 'UPSC Mains',
      icon: PenTool,
      description: 'Advanced preparation for UPSC Civil Services Main Examination',
      subjects: 9,
      duration: '8 months',
      students: '8.2k',
      features: ['Essay Writing', 'GS Papers I-IV', 'Optional Subject', 'Answer Writing'],
      modules: [
        { name: 'Essay Writing', progress: 55, totalTopics: 20, completedTopics: 11 },
        { name: 'GS Paper I', progress: 42, totalTopics: 50, completedTopics: 21 },
        { name: 'GS Paper II', progress: 38, totalTopics: 45, completedTopics: 17 },
        { name: 'GS Paper III', progress: 28, totalTopics: 48, completedTopics: 13 },
        { name: 'GS Paper IV', progress: 60, totalTopics: 30, completedTopics: 18 },
        { name: 'Optional - History', progress: 35, totalTopics: 60, completedTopics: 21 },
        { name: 'Current Affairs', progress: 75, totalTopics: 40, completedTopics: 30 },
        { name: 'Answer Writing', progress: 48, totalTopics: 25, completedTopics: 12 },
        { name: 'Case Studies', progress: 52, totalTopics: 35, completedTopics: 18 }
      ],
      schedule: {
        totalDays: 240,
        weeks: [
          {
            weekNumber: 1,
            theme: 'Essay Writing Foundation',
            days: [
              { dayNumber: 1, topics: 'Essay Structure & Introduction Techniques', duration: '4 hours', isCompleted: true },
              { dayNumber: 2, topics: 'Types of Essays - Philosophical & Social', duration: '4 hours', isCompleted: true },
              { dayNumber: 3, topics: 'Essay Practice - Current Topics', duration: '5 hours', isCompleted: true },
              { dayNumber: 4, topics: 'GS Paper I - Indian Heritage & Culture', duration: '4 hours', isCompleted: false, isCurrent: true },
              { dayNumber: 5, topics: 'Modern Indian History - Freedom Struggle', duration: '4 hours', isCompleted: false },
              { dayNumber: 6, topics: 'Essay Writing Workshop', duration: '6 hours', isCompleted: false },
              { dayNumber: 7, topics: 'Peer Review & Feedback Session', duration: '3 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 2,
            theme: 'GS Paper I & II Focus',
            days: [
              { dayNumber: 8, topics: 'Post-Independence India - Major Events', duration: '4 hours', isCompleted: false },
              { dayNumber: 9, topics: 'World History - Industrial Revolution', duration: '4 hours', isCompleted: false },
              { dayNumber: 10, topics: 'GS Paper II - Governance & Constitution', duration: '4 hours', isCompleted: false },
              { dayNumber: 11, topics: 'Social Justice & Welfare Schemes', duration: '4 hours', isCompleted: false },
              { dayNumber: 12, topics: 'International Relations - India & Neighbors', duration: '4 hours', isCompleted: false },
              { dayNumber: 13, topics: 'Answer Writing Practice', duration: '5 hours', isCompleted: false },
              { dayNumber: 14, topics: 'Mock Test - GS Papers I & II', duration: '6 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 3,
            theme: 'GS Paper III - Economy & Technology',
            days: [
              { dayNumber: 15, topics: 'Indian Economy - Planning & Development', duration: '4 hours', isCompleted: false },
              { dayNumber: 16, topics: 'Agriculture & Food Processing', duration: '4 hours', isCompleted: false },
              { dayNumber: 17, topics: 'Science & Technology - Recent Developments', duration: '4 hours', isCompleted: false },
              { dayNumber: 18, topics: 'Environment & Biodiversity Conservation', duration: '4 hours', isCompleted: false },
              { dayNumber: 19, topics: 'Disaster Management', duration: '4 hours', isCompleted: false },
              { dayNumber: 20, topics: 'Answer Writing - Economy Questions', duration: '5 hours', isCompleted: false },
              { dayNumber: 21, topics: 'Weekly Assessment & Review', duration: '3 hours', isCompleted: false }
            ]
          },
          {
            weekNumber: 4,
            theme: 'Ethics & Optional Subject',
            days: [
              { dayNumber: 22, topics: 'Ethics - Theories & Thinkers', duration: '4 hours', isCompleted: false },
              { dayNumber: 23, topics: 'Ethics in Governance', duration: '4 hours', isCompleted: false },
              { dayNumber: 24, topics: 'Case Studies - Ethical Dilemmas', duration: '5 hours', isCompleted: false },
              { dayNumber: 25, topics: 'Optional Subject - Core Topics', duration: '4 hours', isCompleted: false },
              { dayNumber: 26, topics: 'Optional Subject - Advanced Topics', duration: '4 hours', isCompleted: false },
              { dayNumber: 27, topics: 'Integrated Answer Writing', duration: '5 hours', isCompleted: false },
              { dayNumber: 28, topics: 'Monthly Grand Test', duration: '6 hours', isCompleted: false }
            ]
          }
        ]
      }
    }
  ];

  // Quick Stats
  const quickStats = [
    { label: 'Study Streak', value: '15 days', change: '+3', trend: 'up', icon: Flame },
    { label: 'Tests Taken', value: '24', change: '+5', trend: 'up', icon: FileText },
    { label: 'Avg Score', value: '78%', change: '+8%', trend: 'up', icon: Trophy },
    { label: 'Rank', value: '#234', change: '+12', trend: 'up', icon: Medal }
  ];

  // UPSC Specific Features
  const upscFeatures = [
    {
      title: 'Daily Current Affairs',
      description: 'Stay updated with daily news analysis and monthly compilations',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      action: 'Read Today\'s News',
      stats: [
        { value: '365+', label: 'Daily Updates' },
        { value: '12', label: 'Monthly Magazines' }
      ]
    },
    {
      title: 'Previous Year Papers',
      description: 'Access 10+ years of solved UPSC papers with detailed explanations',
      icon: History,
      color: 'from-purple-500 to-purple-600',
      action: 'Practice Papers',
      stats: [
        { value: '150+', label: 'Papers' },
        { value: '15k+', label: 'Questions' }
      ]
    },
    {
      title: 'Mock Test Series',
      description: 'Attempt full-length mock tests in real exam conditions',
      icon: Timer,
      color: 'from-green-500 to-green-600',
      action: 'Start Mock Test',
      stats: [
        { value: '50+', label: 'Full Tests' },
        { value: '200+', label: 'Sectional Tests' }
      ]
    },
    {
      title: 'Answer Writing Practice',
      description: 'Improve your mains answer writing with expert evaluation',
      icon: PenTool,
      color: 'from-orange-500 to-orange-600',
      action: 'Write Answers',
      stats: [
        { value: '500+', label: 'Questions' },
        { value: 'Expert', label: 'Evaluation' }
      ]
    },
    {
      title: 'NCERT Resources',
      description: 'Complete NCERT books and summaries from Class 6-12',
      icon: BookMarked,
      color: 'from-red-500 to-red-600',
      action: 'Access NCERTs',
      stats: [
        { value: '100+', label: 'Books' },
        { value: 'Quick', label: 'Summaries' }
      ]
    },
    {
      title: 'Topper\'s Strategy',
      description: 'Learn from toppers\' strategies, notes, and interviews',
      icon: Trophy,
      color: 'from-indigo-500 to-indigo-600',
      action: 'View Strategies',
      stats: [
        { value: '50+', label: 'Toppers' },
        { value: '200+', label: 'Resources' }
      ]
    }
  ];

  // Performance Chart Data
  const performanceData = {
    labels: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Environment'],
    datasets: [{
      label: 'Your Score',
      data: [75, 82, 68, 72, 78, 85],
      backgroundColor: 'rgba(9, 77, 136, 0.2)',
      borderColor: 'rgb(9, 77, 136)',
      pointBackgroundColor: 'rgb(9, 77, 136)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(9, 77, 136)'
    }, {
      label: 'Average Score',
      data: [70, 75, 72, 68, 73, 78],
      backgroundColor: 'rgba(16, 172, 139, 0.2)',
      borderColor: 'rgb(16, 172, 139)',
      pointBackgroundColor: 'rgb(16, 172, 139)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(16, 172, 139)'
    }]
  };

  // Study Time Chart
  const studyTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Study Hours',
      data: [4, 5, 3, 6, 5, 7, 4],
      borderColor: 'rgb(9, 77, 136)',
      backgroundColor: 'rgba(9, 77, 136, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-32 translate-y-32" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to UPSC Learning Hub, {userData.name || 'Aspirant'}! 🎯
            </h1>
            <p className="text-white/90 mb-6">
              Your personalized dashboard for cracking the Civil Services Examination
            </p>
          </div>
        </motion.div>

        {/* Student Details Section */}
        <StudentDetailsCard studentInfo={studentInfo} />

        {/* Course Selection */}
        {!selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Choose Your Course</h2>
                <p className="text-gray-600 mt-1">Select your primary preparation focus</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upscCourses.map((course) => (
                <CourseSelectionCard
                  key={course.id}
                  course={course}
                  isSelected={selectedCourse?.id === course.id}
                  onSelect={setSelectedCourse}
                />
              ))}
            </div>
            
            {selectedCourse && (
              <motion.button
                className="mt-6 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
              >
                Continue with {selectedCourse.title}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Main Dashboard Content (shown after course selection) */}
        {selectedCourse && (
          <>
            {/* Quick Stats */}
            <QuickStatsWidget stats={quickStats} />

            {/* Course Schedule */}
            <CourseSchedule schedule={selectedCourse.schedule} courseName={selectedCourse.title} courseId={selectedCourse.id} />

            {/* Study Progress */}
            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Your Progress - {selectedCourse.title}</h2>
                    <p className="text-sm text-gray-600">Track your subject-wise preparation</p>
                  </div>
                </div>
                <button
                  className="text-sm text-brand-primary hover:text-brand-secondary font-medium"
                  onClick={() => setSelectedCourse(null)}
                >
                  Change Course
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCourse.modules.map((module, idx) => (
                  <StudyProgressCard
                    key={idx}
                    subject={module.name}
                    progress={module.progress}
                    totalTopics={module.totalTopics}
                    completedTopics={module.completedTopics}
                    color={`text-${['blue', 'green', 'purple', 'orange', 'red', 'indigo'][idx % 6]}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* UPSC Features Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">UPSC Preparation Tools</h2>
                  <p className="text-sm text-gray-600">Everything you need to crack the exam</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upscFeatures.map((feature, idx) => (
                  <UPSCFeatureCard key={idx} feature={feature} delay={idx * 0.1} />
                ))}
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-primary" />
                  Subject Performance
                </h3>
                <div className="h-64">
                  <Radar
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        }
                      },
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  Study Time This Week
                </h3>
                <div className="h-64">
                  <Line
                    data={studyTimeData}
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
                          max: 8
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: PlayCircle, label: 'Resume Learning', color: 'from-blue-500 to-blue-600', route: '/video-learning' },
                  { icon: FileText, label: 'Take Mock Test', color: 'from-green-500 to-green-600', route: '/test' },
                  { icon: MessageSquare, label: 'AI Assistant', color: 'from-purple-500 to-purple-600', route: '/ai-chat-assistant' },
                  { icon: Calendar, label: 'Study Planner', color: 'from-orange-500 to-orange-600', route: '/calendar' }
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => navigate(action.route)}
                    className="bg-white rounded-xl p-4 hover:shadow-md transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{action.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}