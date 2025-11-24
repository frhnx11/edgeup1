import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Clock, 
  Book, 
  FileText, 
  Target, 
  Calendar as CalendarIcon, 
  GraduationCap,
  Search,
  MoreVertical,
  Download,
  Mail,
  Phone,
  MapPin,
  Users,
  Settings,
  Printer,
  Share2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Video,
  Brain,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  BellRing,
  RefreshCw,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  Layout,
  Grid,
  List,
  MonitorSpeaker,
  Mic,
  MessageSquare,
  Lightbulb,
  Tag,
  Palette,
  ChevronDown,
  Timer,
  Laptop,
  Repeat,
  CalendarDays,
  CalendarClock,
  CalendarRange,
  Loader2,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Send
} from 'lucide-react';
import { upscModules } from '../../../../data/upscModules';

interface Event {
  id: string;
  title: string;
  type: 'class' | 'test' | 'assignment' | 'seminar' | 'workshop' | 'task' | 'study' | 'break' | 'goal';
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  subject?: string;
  duration?: string;
  location?: string;
  instructor?: string;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  reminder?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees?: string[];
  attachments?: string[];
  meetingLink?: string;
  isOnline?: boolean;
  tags?: string[];
  isAiSuggested?: boolean;
  completionRate?: number;
  notes?: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  estimatedTime: string;
  progress: number;
  relatedEvents?: string[];
}

interface TimeSlot {
  time: string;
  height: number;
}

interface StudyGoal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  milestones: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

interface CalendarStats {
  totalEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  studyHours: number;
  productivityScore: number;
  streakDays: number;
}

// Modern color scheme for event types
const EVENT_COLORS = {
  class: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', gradient: 'from-indigo-400 to-indigo-600' },
  test: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', gradient: 'from-red-400 to-red-600' },
  assignment: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', gradient: 'from-amber-400 to-amber-600' },
  seminar: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', gradient: 'from-green-400 to-green-600' },
  workshop: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', gradient: 'from-purple-400 to-purple-600' },
  task: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', gradient: 'from-blue-400 to-blue-600' },
  study: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', gradient: 'from-teal-400 to-teal-600' },
  break: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', gradient: 'from-gray-400 to-gray-600' },
  goal: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300', gradient: 'from-pink-400 to-pink-600' }
};

// Time slots for week/day view
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  height: 60
}));

export function CalendarPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1)); // June 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [syncInProgress, setSyncInProgress] = useState<'google' | 'apple' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    class: true,
    test: true,
    assignment: true,
    seminar: true,
    workshop: true,
    task: true,
    study: true,
    break: false,
    goal: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarStats, setCalendarStats] = useState<CalendarStats>({
    totalEvents: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    studyHours: 0,
    productivityScore: 0,
    streakDays: 0
  });
  const weekViewRef = useRef<HTMLDivElement>(null);
  const dayViewRef = useRef<HTMLDivElement>(null);

  // Enhanced events with more details and real-time data
  const [events, setEvents] = useState<Record<string, Event[]>>({
    // January 2025 Events
    '2025-01-06': [
      {
        id: 'c-jan6-1',
        title: 'Indian Polity - Fundamental Rights',
        type: 'class',
        date: '2025-01-06',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Detailed analysis of Articles 12-35, landmark cases on fundamental rights',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['constitution', 'fundamental-rights', 'articles'],
        attendees: ['125 students enrolled'],
        attachments: ['Fundamental_Rights_Notes.pdf', 'Case_Studies.pdf']
      },
      {
        id: 's-jan6',
        title: 'Current Affairs Review',
        type: 'study',
        date: '2025-01-06',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        description: 'Weekly current affairs compilation and analysis',
        subject: 'General Studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['current-affairs', 'self-study', 'weekly-review'],
        isAiSuggested: true
      }
    ],
    '2025-01-07': [
      {
        id: 'c-jan7-1',
        title: 'Ancient History - Indus Valley Civilization',
        type: 'class',
        date: '2025-01-07',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'Urban planning, trade, script, and decline of Harappan civilization',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['ancient-history', 'indus-valley', 'harappa'],
        attendees: ['98 students enrolled']
      },
      {
        id: 'w-jan7',
        title: 'Essay Writing Workshop',
        type: 'workshop',
        date: '2025-01-07',
        startTime: '15:00',
        endTime: '17:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'Philosophical essays - structure, arguments, and examples',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['essay', 'writing', 'philosophy'],
        instructor: 'Dr. Anita Desai',
        attendees: ['45 participants']
      }
    ],
    '2025-01-08': [
      {
        id: 'c-jan8-1',
        title: 'Economics - Indian Banking System',
        type: 'class',
        date: '2025-01-08',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'RBI functions, monetary policy, banking reforms, NPAs',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'banking', 'monetary-policy'],
        attendees: ['110 students enrolled']
      },
      {
        id: 't-jan8',
        title: 'Complete Polity Assignment',
        type: 'task',
        date: '2025-01-08',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Submit analysis on recent Supreme Court judgments',
        subject: 'Indian Polity',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'polity', 'deadline']
      }
    ],
    '2025-01-09': [
      {
        id: 'c-jan9-1',
        title: 'Geography - Monsoon & Climate',
        type: 'class',
        date: '2025-01-09',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Indian monsoon mechanism, El Nino, La Nina effects',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'climate', 'monsoon'],
        attendees: ['95 students enrolled']
      },
      {
        id: 's-jan9',
        title: 'Ethics Case Studies Practice',
        type: 'study',
        date: '2025-01-09',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice ethical dilemmas and case study answers',
        subject: 'Ethics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['ethics', 'case-studies', 'practice']
      }
    ],
    '2025-01-10': [
      {
        id: 'sem-jan10',
        title: 'Current Affairs Weekly Seminar',
        type: 'seminar',
        date: '2025-01-10',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Analysis of this week\'s important national and international events',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-affairs-jan10',
        tags: ['current-affairs', 'seminar', 'weekly'],
        instructor: 'Panel Discussion',
        attendees: ['200+ participants expected']
      },
      {
        id: 'g-jan10',
        title: 'Weekly Progress Review',
        type: 'goal',
        date: '2025-01-10',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Review weekly goals and adjust study plan',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'planning']
      }
    ],
    '2025-01-11': [
      {
        id: 't-jan11',
        title: 'Indian History Mock Test',
        type: 'test',
        date: '2025-01-11',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'History',
        description: 'Full-length test covering Ancient and Medieval India',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'history', 'mock'],
        attachments: ['Test_Syllabus.pdf', 'Previous_Papers.pdf']
      },
      {
        id: 'b-jan11',
        title: 'Lunch Break & Relaxation',
        type: 'break',
        date: '2025-01-11',
        startTime: '13:00',
        endTime: '14:00',
        duration: '1 hour',
        description: 'Take a break to recharge',
        priority: 'low',
        status: 'upcoming',
        isAiSuggested: true
      }
    ],
    '2025-01-13': [
      {
        id: 'c-jan13-1',
        title: 'Indian Polity - Parliament & Legislature',
        type: 'class',
        date: '2025-01-13',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Parliamentary procedures, bills, question hour, committees',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'parliament', 'legislature'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-jan13',
        title: 'Map Reading Workshop',
        type: 'workshop',
        date: '2025-01-13',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Geography Lab',
        description: 'Physical and political map reading techniques for UPSC',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['geography', 'maps', 'workshop'],
        instructor: 'Dr. Priya Sharma',
        attendees: ['30 participants']
      }
    ],
    '2025-01-14': [
      {
        id: 'c-jan14-1',
        title: 'Medieval History - Delhi Sultanate',
        type: 'class',
        date: '2025-01-14',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'Slave, Khilji, Tughlaq, Sayyid, and Lodi dynasties',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['medieval-history', 'delhi-sultanate', 'dynasties'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-jan14',
        title: 'Economics Numerical Practice',
        type: 'study',
        date: '2025-01-14',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice GDP, inflation, fiscal deficit calculations',
        subject: 'Economics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['economics', 'numericals', 'practice']
      }
    ],
    '2025-01-15': [
      {
        id: 'c-jan15-1',
        title: 'Economics - Indian Agriculture',
        type: 'class',
        date: '2025-01-15',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Green revolution, MSP, PDS, agricultural reforms',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'agriculture', 'reforms'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'sem-jan15',
        title: 'UPSC Interview Preparation',
        type: 'seminar',
        date: '2025-01-15',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Mock interviews, personality test guidance by experts',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['interview', 'personality-test', 'guidance'],
        instructor: 'UPSC Board Members (Retd.)',
        attendees: ['150 participants']
      }
    ],
    '2025-01-16': [
      {
        id: 'c-jan16-1',
        title: 'Geography - Natural Resources',
        type: 'class',
        date: '2025-01-16',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Distribution of minerals, energy resources, conservation',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'resources', 'minerals'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-jan16',
        title: 'Submit Geography Project',
        type: 'task',
        date: '2025-01-16',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Submit project on Indian river systems',
        subject: 'Geography',
        priority: 'high',
        status: 'upcoming',
        tags: ['project', 'geography', 'deadline']
      }
    ],
    '2025-01-17': [
      {
        id: 'w-jan17',
        title: 'Answer Writing Workshop',
        type: 'workshop',
        date: '2025-01-17',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Mains answer writing techniques, time management',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['answer-writing', 'mains', 'techniques'],
        instructor: 'UPSC Toppers Panel',
        attendees: ['60 participants'],
        attachments: ['Answer_Writing_Tips.pdf', 'Model_Answers.pdf']
      },
      {
        id: 'g-jan17',
        title: 'Mid-Month Goal Assessment',
        type: 'goal',
        date: '2025-01-17',
        startTime: '18:00',
        endTime: '19:00',
        duration: '1 hour',
        description: 'Assess progress and realign study goals',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'assessment', 'mid-month']
      }
    ],
    '2025-01-18': [
      {
        id: 't-jan18',
        title: 'Economics Mock Test',
        type: 'test',
        date: '2025-01-18',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Economics',
        description: 'Comprehensive test on Indian Economy',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'economics', 'mock'],
        attachments: ['Economics_Syllabus.pdf']
      }
    ],
    '2025-01-20': [
      {
        id: 'c-jan20-1',
        title: 'Indian Polity - Judiciary System',
        type: 'class',
        date: '2025-01-20',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Supreme Court, High Courts, judicial review, PIL',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'judiciary', 'courts'],
        attendees: ['125 students enrolled']
      },
      {
        id: 's-jan20',
        title: 'History Revision Session',
        type: 'study',
        date: '2025-01-20',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        description: 'Revise Ancient and Medieval history topics',
        subject: 'History',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['history', 'revision', 'self-study']
      }
    ],
    '2025-01-21': [
      {
        id: 'c-jan21-1',
        title: 'Modern History - British Rule',
        type: 'class',
        date: '2025-01-21',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'East India Company, Governor Generals, reforms',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['modern-history', 'british-rule', 'reforms'],
        attendees: ['98 students enrolled']
      }
    ],
    '2025-01-22': [
      {
        id: 'c-jan22-1',
        title: 'Economics - External Sector',
        type: 'class',
        date: '2025-01-22',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Balance of payments, forex, international trade',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'external-sector', 'trade'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'w-jan22',
        title: 'Ethics & Integrity Workshop',
        type: 'workshop',
        date: '2025-01-22',
        startTime: '15:00',
        endTime: '17:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'Ethical theories, thinkers, case study approach',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'integrity', 'workshop'],
        instructor: 'Dr. Madhav Khosla',
        attendees: ['50 participants']
      }
    ],
    '2025-01-23': [
      {
        id: 'c-jan23-1',
        title: 'Geography - Indian Agriculture',
        type: 'class',
        date: '2025-01-23',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Cropping patterns, irrigation, agricultural regions',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'agriculture', 'cropping'],
        attendees: ['95 students enrolled']
      },
      {
        id: 's-jan23',
        title: 'Current Affairs Compilation',
        type: 'study',
        date: '2025-01-23',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Compile and analyze this month\'s current affairs',
        subject: 'General Studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['current-affairs', 'compilation', 'monthly']
      }
    ],
    '2025-01-24': [
      {
        id: 'sem-jan24',
        title: 'Science & Technology Seminar',
        type: 'seminar',
        date: '2025-01-24',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Latest developments in space, IT, biotechnology',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/science-tech-jan24',
        tags: ['science', 'technology', 'current'],
        instructor: 'Dr. Kiran Mazumdar',
        attendees: ['180 participants expected']
      },
      {
        id: 'g-jan24',
        title: 'Weekly Review & Planning',
        type: 'goal',
        date: '2025-01-24',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Review week\'s progress and plan ahead',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'planning']
      }
    ],
    '2025-01-25': [
      {
        id: 't-jan25',
        title: 'Indian Polity Mock Test',
        type: 'test',
        date: '2025-01-25',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Indian Polity',
        description: 'Full syllabus test with current affairs',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'polity', 'mock'],
        attachments: ['Polity_Test_Pattern.pdf']
      }
    ],
    '2025-01-27': [
      {
        id: 'c-jan27-1',
        title: 'Indian Polity - Federal System',
        type: 'class',
        date: '2025-01-27',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Centre-State relations, GST council, Inter-state council',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'federalism', 'centre-state'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-jan27',
        title: 'Disaster Management Workshop',
        type: 'workshop',
        date: '2025-01-27',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'Natural disasters, mitigation strategies, case studies',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['disaster-management', 'environment', 'workshop'],
        instructor: 'NDMA Officials',
        attendees: ['40 participants']
      }
    ],
    '2025-01-28': [
      {
        id: 'c-jan28-1',
        title: 'Modern History - Freedom Movement',
        type: 'class',
        date: '2025-01-28',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'INC formation, moderates, extremists, Gandhi era',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['modern-history', 'freedom-movement', 'gandhi'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-jan28',
        title: 'Geography Map Practice',
        type: 'study',
        date: '2025-01-28',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice locating places, rivers, mountains on maps',
        subject: 'Geography',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['geography', 'maps', 'practice']
      }
    ],
    '2025-01-29': [
      {
        id: 'c-jan29-1',
        title: 'Economics - Budget Analysis',
        type: 'class',
        date: '2025-01-29',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Union budget components, fiscal policy, deficits',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'budget', 'fiscal-policy'],
        attendees: ['110 students enrolled']
      }
    ],
    '2025-01-30': [
      {
        id: 'c-jan30-1',
        title: 'Geography - Environmental Issues',
        type: 'class',
        date: '2025-01-30',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Climate change, pollution, conservation strategies',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'environment', 'climate-change'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-jan30',
        title: 'Monthly Review Assignment',
        type: 'task',
        date: '2025-01-30',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Submit comprehensive monthly progress report',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'monthly-review', 'deadline']
      }
    ],
    '2025-01-31': [
      {
        id: 'sem-jan31',
        title: 'Month-End Review Seminar',
        type: 'seminar',
        date: '2025-01-31',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'January progress review, February planning session',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['review', 'planning', 'monthly'],
        instructor: 'All Faculty',
        attendees: ['All students']
      },
      {
        id: 'g-jan31',
        title: 'Monthly Goal Evaluation',
        type: 'goal',
        date: '2025-01-31',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Evaluate January goals and set February targets',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'evaluation', 'monthly']
      }
    ],
    // June 2025 Events
    '2025-06-01': [
      {
        id: 't-jun1',
        title: 'UPSC Prelims Mock Test - Full Syllabus',
        type: 'test',
        date: '2025-06-01',
        startTime: '09:30',
        endTime: '12:30',
        duration: '3 hours',
        location: 'Main Examination Hall',
        subject: 'General Studies',
        description: 'Complete prelims pattern test with 100 questions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['prelims', 'mock-test', 'full-syllabus'],
        attachments: ['Prelims_Pattern.pdf', 'Answer_Key.pdf']
      }
    ],
    '2025-06-02': [
      {
        id: 'c-jun2-1',
        title: 'Current Affairs Intensive - May 2025 Review',
        type: 'class',
        date: '2025-06-02',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Current Affairs',
        instructor: 'Dr. Amit Verma',
        description: 'Comprehensive review of May 2025 national and international events',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['current-affairs', 'monthly-review', 'intensive'],
        attendees: ['150 students enrolled']
      },
      {
        id: 's-jun2',
        title: 'Polity Revision - Constitutional Bodies',
        type: 'study',
        date: '2025-06-02',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Self-study session on Election Commission, CAG, UPSC',
        subject: 'Indian Polity',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['polity', 'revision', 'constitutional-bodies']
      }
    ],
    '2025-06-03': [
      {
        id: 'c-jun3-1',
        title: 'Geography Special Class - Mapping Skills',
        type: 'class',
        date: '2025-06-03',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Geography Lab',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Map-based questions practice for prelims',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'mapping', 'prelims-special'],
        attendees: ['80 students enrolled']
      },
      {
        id: 'w-jun3',
        title: 'Prelims Strategy Workshop',
        type: 'workshop',
        date: '2025-06-03',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Last month preparation strategy by UPSC toppers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['prelims', 'strategy', 'toppers'],
        instructor: 'UPSC 2024 Toppers Panel',
        attendees: ['200 participants']
      }
    ],
    '2025-06-04': [
      {
        id: 'c-jun4-1',
        title: 'Economics Rapid Revision',
        type: 'class',
        date: '2025-06-04',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Quick revision of important economic concepts and current data',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'revision', 'prelims'],
        attendees: ['120 students enrolled']
      },
      {
        id: 't-jun4',
        title: 'Complete Environment Notes',
        type: 'task',
        date: '2025-06-04',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Finalize environment and ecology notes compilation',
        subject: 'Environment',
        priority: 'high',
        status: 'upcoming',
        tags: ['environment', 'notes', 'compilation']
      }
    ],
    '2025-06-05': [
      {
        id: 'c-jun5-1',
        title: 'History Fast Track - Modern India',
        type: 'class',
        date: '2025-06-05',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'Quick revision of freedom struggle and important personalities',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['history', 'modern-india', 'revision'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'sem-jun5',
        title: 'Science & Technology Updates',
        type: 'seminar',
        date: '2025-06-05',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Latest developments in space, defense, and biotechnology',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/sci-tech-jun5',
        tags: ['science', 'technology', 'current'],
        instructor: 'Dr. Kiran Mazumdar',
        attendees: ['180 participants expected']
      }
    ],
    '2025-06-06': [
      {
        id: 't-jun6',
        title: 'Ancient & Medieval History Test',
        type: 'test',
        date: '2025-06-06',
        startTime: '10:00',
        endTime: '11:30',
        duration: '1.5 hours',
        location: 'Room 105',
        subject: 'History',
        description: '50 MCQs on Ancient and Medieval Indian History',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'history', 'mcq']
      },
      {
        id: 's-jun6',
        title: 'Polity Practice Questions',
        type: 'study',
        date: '2025-06-06',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Solve previous year polity questions',
        subject: 'Indian Polity',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['polity', 'practice', 'pyq']
      }
    ],
    '2025-06-07': [
      {
        id: 'w-jun7',
        title: 'CSAT Problem Solving Session',
        type: 'workshop',
        date: '2025-06-07',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Computer Lab',
        description: 'Quantitative aptitude and logical reasoning practice',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['csat', 'aptitude', 'reasoning'],
        instructor: 'Prof. Rajiv Mehta',
        attendees: ['60 participants']
      },
      {
        id: 'g-jun7',
        title: 'Weekly Progress Review',
        type: 'goal',
        date: '2025-06-07',
        startTime: '18:00',
        endTime: '19:00',
        duration: '1 hour',
        description: 'Assess preparation progress and adjust strategy',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'weekly']
      }
    ],
    '2025-06-08': [
      {
        id: 't-jun8',
        title: 'Full Length Mock Test - GS Paper 1',
        type: 'test',
        date: '2025-06-08',
        startTime: '09:30',
        endTime: '11:30',
        duration: '2 hours',
        location: 'Main Examination Hall',
        subject: 'General Studies',
        description: 'Prelims pattern full mock test',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'prelims', 'gs1']
      }
    ],
    '2025-06-09': [
      {
        id: 'c-jun9-1',
        title: 'International Relations Overview',
        type: 'class',
        date: '2025-06-09',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'International Relations',
        instructor: 'Dr. Rajesh Kumar',
        description: 'India\'s foreign policy, bilateral relations, international organizations',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['ir', 'foreign-policy', 'bilateral'],
        attendees: ['130 students enrolled']
      },
      {
        id: 's-jun9',
        title: 'Art & Culture Revision',
        type: 'study',
        date: '2025-06-09',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Review Indian art, architecture, and cultural heritage',
        subject: 'Art & Culture',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['art-culture', 'revision', 'heritage']
      }
    ],
    '2025-06-10': [
      {
        id: 'c-jun10-1',
        title: 'Government Schemes Update',
        type: 'class',
        date: '2025-06-10',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Current Affairs',
        instructor: 'Dr. Amit Verma',
        description: 'Important government schemes and their implementation',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['schemes', 'government', 'current'],
        attendees: ['140 students enrolled']
      },
      {
        id: 'w-jun10',
        title: 'Disaster Management Workshop',
        type: 'workshop',
        date: '2025-06-10',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Seminar Hall',
        description: 'Natural disasters, mitigation, NDMA guidelines',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['disaster', 'management', 'ndma'],
        instructor: 'NDMA Officials',
        attendees: ['50 participants']
      }
    ],
    '2025-06-11': [
      {
        id: 't-jun11',
        title: 'Economy & Social Issues Test',
        type: 'test',
        date: '2025-06-11',
        startTime: '10:00',
        endTime: '11:30',
        duration: '1.5 hours',
        location: 'Room 106',
        subject: 'Economics',
        description: '50 MCQs on Indian economy and social issues',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'economy', 'social-issues']
      },
      {
        id: 's-jun11',
        title: 'Ethics Case Studies',
        type: 'study',
        date: '2025-06-11',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice ethical dilemmas and case study approach',
        subject: 'Ethics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['ethics', 'case-studies', 'practice']
      }
    ],
    '2025-06-12': [
      {
        id: 'c-jun12-1',
        title: 'Environment & Biodiversity',
        type: 'class',
        date: '2025-06-12',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Environment',
        instructor: 'Dr. Priya Sharma',
        description: 'Protected areas, wildlife acts, environmental conventions',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['environment', 'biodiversity', 'conservation'],
        attendees: ['100 students enrolled']
      },
      {
        id: 'sem-jun12',
        title: 'Prelims Last Mile Preparation',
        type: 'seminar',
        date: '2025-06-12',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Final tips and strategies for UPSC Prelims',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['prelims', 'strategy', 'final-tips'],
        instructor: 'Expert Panel',
        attendees: ['300 participants expected']
      }
    ],
    '2025-06-13': [
      {
        id: 't-jun13',
        title: 'CSAT Mock Test',
        type: 'test',
        date: '2025-06-13',
        startTime: '14:30',
        endTime: '16:30',
        duration: '2 hours',
        location: 'Examination Hall',
        subject: 'CSAT',
        description: 'Full CSAT paper with 80 questions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['csat', 'mock-test', 'aptitude']
      }
    ],
    '2025-06-14': [
      {
        id: 'w-jun14',
        title: 'Current Affairs Rapid Fire',
        type: 'workshop',
        date: '2025-06-14',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Conference Room',
        description: 'Quick revision of last 6 months current affairs',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-rapid-jun14',
        tags: ['current-affairs', 'revision', 'rapid'],
        instructor: 'Current Affairs Team',
        attendees: ['250 participants expected']
      },
      {
        id: 'g-jun14',
        title: 'Pre-exam Goal Setting',
        type: 'goal',
        date: '2025-06-14',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Set targets for final two weeks before prelims',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'prelims', 'planning']
      }
    ],
    '2025-06-15': [
      {
        id: 't-jun15',
        title: 'Mega Mock Test - Full Prelims',
        type: 'test',
        date: '2025-06-15',
        startTime: '09:30',
        endTime: '14:00',
        duration: '4.5 hours',
        location: 'Main Examination Hall',
        subject: 'General Studies',
        description: 'Both GS and CSAT papers in exam conditions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'prelims', 'full-exam'],
        attachments: ['Exam_Instructions.pdf']
      }
    ],
    '2025-06-16': [
      {
        id: 's-jun16',
        title: 'Mock Test Analysis',
        type: 'study',
        date: '2025-06-16',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        description: 'Detailed analysis of yesterday\'s mock test',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['analysis', 'mock-test', 'review'],
        isAiSuggested: true
      },
      {
        id: 'c-jun16-1',
        title: 'Doubt Clearing Session',
        type: 'class',
        date: '2025-06-16',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies',
        instructor: 'All Faculty',
        description: 'Open session for clearing last-minute doubts',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['doubt-clearing', 'all-subjects', 'interactive'],
        attendees: ['Open to all students']
      }
    ],
    '2025-06-17': [
      {
        id: 'w-jun17',
        title: 'Static GK Revision Marathon',
        type: 'workshop',
        date: '2025-06-17',
        startTime: '09:00',
        endTime: '17:00',
        duration: '8 hours',
        location: 'Seminar Hall',
        description: 'Day-long revision of static portions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['revision', 'static-gk', 'marathon'],
        instructor: 'Multiple Faculty',
        attendees: ['150 participants']
      }
    ],
    '2025-06-18': [
      {
        id: 't-jun18',
        title: 'Previous Year Questions Practice',
        type: 'task',
        date: '2025-06-18',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        description: 'Solve last 5 years UPSC prelims questions',
        priority: 'high',
        status: 'upcoming',
        tags: ['practice', 'pyq', 'prelims']
      },
      {
        id: 's-jun18',
        title: 'Current Affairs Final Review',
        type: 'study',
        date: '2025-06-18',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Final review of important current affairs topics',
        subject: 'Current Affairs',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['current-affairs', 'final-review', 'important']
      }
    ],
    '2025-06-19': [
      {
        id: 'sem-jun19',
        title: 'Pre-Prelims Motivation Session',
        type: 'seminar',
        date: '2025-06-19',
        startTime: '16:00',
        endTime: '17:30',
        duration: '1.5 hours',
        location: 'Auditorium',
        description: 'Motivational talk and exam day tips',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['motivation', 'exam-tips', 'prelims'],
        instructor: 'UPSC Achievers',
        attendees: ['All students']
      }
    ],
    '2025-06-20': [
      {
        id: 'b-jun20',
        title: 'Pre-exam Relaxation',
        type: 'break',
        date: '2025-06-20',
        startTime: '10:00',
        endTime: '18:00',
        duration: '8 hours',
        description: 'Rest day before prelims - light revision only',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['rest', 'relaxation', 'pre-exam']
      }
    ],
    '2025-06-21': [
      {
        id: 'g-jun21',
        title: 'UPSC Prelims 2025',
        type: 'goal',
        date: '2025-06-21',
        startTime: '09:30',
        endTime: '16:30',
        duration: '7 hours',
        description: 'D-Day: UPSC Civil Services Preliminary Examination',
        priority: 'high',
        status: 'upcoming',
        tags: ['upsc', 'prelims', 'exam-day'],
        location: 'Designated Exam Centers'
      }
    ],
    '2025-06-22': [
      {
        id: 'b-jun22',
        title: 'Post-exam Break',
        type: 'break',
        date: '2025-06-22',
        startTime: '09:00',
        endTime: '18:00',
        duration: '9 hours',
        description: 'Well-deserved break after prelims',
        priority: 'low',
        status: 'upcoming',
        tags: ['break', 'post-exam', 'relaxation']
      }
    ],
    '2025-06-23': [
      {
        id: 'sem-jun23',
        title: 'Prelims Answer Key Discussion',
        type: 'seminar',
        date: '2025-06-23',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Auditorium',
        description: 'Detailed discussion of prelims paper and answer key',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['answer-key', 'discussion', 'prelims'],
        instructor: 'Faculty Team',
        attendees: ['Open to all']
      }
    ],
    '2025-06-24': [
      {
        id: 'c-jun24-1',
        title: 'Mains Preparation Kickoff',
        type: 'class',
        date: '2025-06-24',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Introduction to mains preparation strategy',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['mains', 'preparation', 'strategy'],
        attendees: ['Expected prelims qualifiers']
      },
      {
        id: 'g-jun24',
        title: 'Mains Preparation Planning',
        type: 'goal',
        date: '2025-06-24',
        startTime: '15:00',
        endTime: '16:00',
        duration: '1 hour',
        description: 'Create detailed study plan for mains preparation',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['mains', 'planning', 'goal']
      }
    ],
    '2025-06-25': [
      {
        id: 'w-jun25',
        title: 'Essay Writing Foundation',
        type: 'workshop',
        date: '2025-06-25',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Basics of essay writing for UPSC mains',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['essay', 'writing', 'mains'],
        instructor: 'Dr. Anita Desai',
        attendees: ['60 participants']
      }
    ],
    '2025-06-26': [
      {
        id: 'c-jun26-1',
        title: 'GS Paper 1 - Indian Heritage',
        type: 'class',
        date: '2025-06-26',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'General Studies 1',
        instructor: 'Prof. Arun Kumar',
        description: 'Indian culture, art forms, literature, architecture',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['gs1', 'heritage', 'culture'],
        attendees: ['Mains aspirants']
      },
      {
        id: 's-jun26',
        title: 'Answer Writing Practice',
        type: 'study',
        date: '2025-06-26',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice answer writing for GS Paper 1',
        subject: 'General Studies 1',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['answer-writing', 'practice', 'gs1']
      }
    ],
    '2025-06-27': [
      {
        id: 'c-jun27-1',
        title: 'GS Paper 2 - Governance',
        type: 'class',
        date: '2025-06-27',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies 2',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Governance, transparency, accountability, e-governance',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['gs2', 'governance', 'polity'],
        attendees: ['Mains aspirants']
      }
    ],
    '2025-06-28': [
      {
        id: 'w-jun28',
        title: 'Ethics Paper Strategy',
        type: 'workshop',
        date: '2025-06-28',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Approach to ethics paper, case studies methodology',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'gs4', 'strategy'],
        instructor: 'Dr. Madhav Khosla',
        attendees: ['50 participants']
      },
      {
        id: 'g-jun28',
        title: 'June Month Review',
        type: 'goal',
        date: '2025-06-28',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Review June progress and plan July schedule',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['review', 'monthly', 'planning']
      }
    ],
    '2025-06-29': [
      {
        id: 't-jun29',
        title: 'Essay Mock Test',
        type: 'test',
        date: '2025-06-29',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Essay',
        description: 'Full essay paper - 2 essays in 3 hours',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['essay', 'mock-test', 'mains']
      }
    ],
    '2025-06-30': [
      {
        id: 'sem-jun30',
        title: 'June Wrap-up Seminar',
        type: 'seminar',
        date: '2025-06-30',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Monthly review and July preparation roadmap',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['review', 'planning', 'monthly'],
        instructor: 'Faculty Coordinators',
        attendees: ['All students']
      }
    ],
    // July 2025 Events
    '2025-07-01': [
      {
        id: 'c-jul1-1',
        title: 'GS Paper 3 - Economy Foundation',
        type: 'class',
        date: '2025-07-01',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'General Studies 3',
        instructor: 'Prof. Sarah Williams',
        description: 'Indian economy, planning, mobilization of resources',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['gs3', 'economy', 'mains'],
        attendees: ['Mains aspirants']
      },
      {
        id: 's-jul1',
        title: 'July Planning Session',
        type: 'study',
        date: '2025-07-01',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Create detailed July study schedule',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['planning', 'monthly', 'schedule'],
        isAiSuggested: true
      }
    ],
    '2025-07-02': [
      {
        id: 'c-jul2-1',
        title: 'Optional Subject Strategy',
        type: 'class',
        date: '2025-07-02',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Optional Subject',
        instructor: 'Subject Experts',
        description: 'Approach to optional subject preparation',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['optional', 'strategy', 'mains'],
        attendees: ['Subject-wise batches']
      },
      {
        id: 'w-jul2',
        title: 'Answer Writing Advanced',
        type: 'workshop',
        date: '2025-07-02',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Advanced techniques for high-scoring answers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['answer-writing', 'advanced', 'techniques'],
        instructor: 'UPSC Toppers 2024',
        attendees: ['80 participants']
      }
    ],
    '2025-07-03': [
      {
        id: 'c-jul3-1',
        title: 'World History Comprehensive',
        type: 'class',
        date: '2025-07-03',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'General Studies 1',
        instructor: 'Prof. Arun Kumar',
        description: 'Industrial revolution, world wars, decolonization',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['world-history', 'gs1', 'comprehensive'],
        attendees: ['Mains aspirants']
      },
      {
        id: 't-jul3',
        title: 'Complete GS1 Notes',
        type: 'task',
        date: '2025-07-03',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Finalize notes compilation for GS Paper 1',
        subject: 'General Studies 1',
        priority: 'high',
        status: 'upcoming',
        tags: ['notes', 'gs1', 'compilation']
      }
    ],
    '2025-07-04': [
      {
        id: 'c-jul4-1',
        title: 'International Relations Deep Dive',
        type: 'class',
        date: '2025-07-04',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies 2',
        instructor: 'Dr. Rajesh Kumar',
        description: 'India and its neighborhood, bilateral relations',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['ir', 'gs2', 'bilateral'],
        attendees: ['Mains aspirants']
      },
      {
        id: 's-jul4',
        title: 'Current Affairs Integration',
        type: 'study',
        date: '2025-07-04',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Link current affairs with static portions',
        subject: 'Current Affairs',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['current-affairs', 'integration', 'mains']
      }
    ],
    '2025-07-05': [
      {
        id: 't-jul5',
        title: 'GS Paper 1 Mock Test',
        type: 'test',
        date: '2025-07-05',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'General Studies 1',
        description: 'Full length GS1 paper - 20 questions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'gs1', 'mains']
      },
      {
        id: 'g-jul5',
        title: 'Weekly Progress Check',
        type: 'goal',
        date: '2025-07-05',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Assess weekly progress and adjust plans',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['progress', 'weekly', 'assessment']
      }
    ],
    '2025-07-06': [
      {
        id: 's-jul6',
        title: 'Mock Test Review & Analysis',
        type: 'study',
        date: '2025-07-06',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        description: 'Detailed analysis of GS1 mock test',
        subject: 'General Studies 1',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['analysis', 'mock-test', 'review']
      }
    ],
    '2025-07-07': [
      {
        id: 'c-jul7-1',
        title: 'Science & Technology for Mains',
        type: 'class',
        date: '2025-07-07',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'General Studies 3',
        instructor: 'Dr. Kiran Mazumdar',
        description: 'S&T developments, applications, indigenization',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['science-tech', 'gs3', 'mains'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'w-jul7',
        title: 'Case Study Workshop',
        type: 'workshop',
        date: '2025-07-07',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Ethics paper case study solving techniques',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'case-study', 'gs4'],
        instructor: 'Dr. Madhav Khosla',
        attendees: ['60 participants']
      }
    ],
    '2025-07-08': [
      {
        id: 'c-jul8-1',
        title: 'Security Issues & Challenges',
        type: 'class',
        date: '2025-07-08',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies 3',
        instructor: 'Col. (Retd.) Vikram Singh',
        description: 'Internal security, terrorism, cyber security',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['security', 'gs3', 'internal'],
        attendees: ['Mains aspirants']
      },
      {
        id: 't-jul8',
        title: 'Essay Practice Session',
        type: 'task',
        date: '2025-07-08',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Write one philosophical essay',
        subject: 'Essay',
        priority: 'medium',
        status: 'upcoming',
        tags: ['essay', 'practice', 'philosophical']
      }
    ],
    '2025-07-09': [
      {
        id: 'c-jul9-1',
        title: 'Disaster Management Comprehensive',
        type: 'class',
        date: '2025-07-09',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'General Studies 3',
        instructor: 'Dr. Priya Sharma',
        description: 'Natural disasters, management, case studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['disaster-management', 'gs3', 'comprehensive'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'sem-jul9',
        title: 'Optional Subject Seminar',
        type: 'seminar',
        date: '2025-07-09',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Subject-specific guidance by experts',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['optional', 'seminar', 'guidance'],
        instructor: 'Subject Experts',
        attendees: ['Subject-wise groups']
      }
    ],
    '2025-07-10': [
      {
        id: 't-jul10',
        title: 'GS Paper 2 Mock Test',
        type: 'test',
        date: '2025-07-10',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'General Studies 2',
        description: 'Full length GS2 paper - governance and IR',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'gs2', 'mains']
      }
    ],
    '2025-07-11': [
      {
        id: 'w-jul11',
        title: 'Current Affairs for Mains',
        type: 'workshop',
        date: '2025-07-11',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Integrating current affairs in mains answers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['current-affairs', 'mains', 'integration'],
        instructor: 'Dr. Amit Verma',
        attendees: ['100 participants']
      }
    ],
    '2025-07-12': [
      {
        id: 'c-jul12-1',
        title: 'Ethics & Human Interface',
        type: 'class',
        date: '2025-07-12',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies 4',
        instructor: 'Dr. Madhav Khosla',
        description: 'Ethical concepts, thinkers, human values',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['ethics', 'gs4', 'concepts'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'g-jul12',
        title: 'Mid-month Goal Review',
        type: 'goal',
        date: '2025-07-12',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Review progress and realign goals',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['review', 'goals', 'mid-month']
      }
    ],
    '2025-07-13': [
      {
        id: 's-jul13',
        title: 'Optional Subject Deep Study',
        type: 'study',
        date: '2025-07-13',
        startTime: '09:00',
        endTime: '17:00',
        duration: '8 hours',
        description: 'Intensive optional subject preparation',
        subject: 'Optional Subject',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['optional', 'intensive', 'study']
      }
    ],
    '2025-07-14': [
      {
        id: 'c-jul14-1',
        title: 'Social Justice & Welfare',
        type: 'class',
        date: '2025-07-14',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'General Studies 2',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Welfare schemes, vulnerable sections, social sector',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['social-justice', 'gs2', 'welfare'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'w-jul14',
        title: 'Map-based Questions Workshop',
        type: 'workshop',
        date: '2025-07-14',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Geography Lab',
        description: 'Handling map-based questions in mains',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['maps', 'geography', 'mains'],
        instructor: 'Dr. Priya Sharma',
        attendees: ['40 participants']
      }
    ],
    '2025-07-15': [
      {
        id: 't-jul15',
        title: 'GS Paper 3 Mock Test',
        type: 'test',
        date: '2025-07-15',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'General Studies 3',
        description: 'Economy, environment, security, S&T',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'gs3', 'mains']
      },
      {
        id: 's-jul15',
        title: 'Answer Writing Practice',
        type: 'study',
        date: '2025-07-15',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice 10 markers and 15 markers',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['answer-writing', 'practice', 'mains']
      }
    ],
    '2025-07-16': [
      {
        id: 'c-jul16-1',
        title: 'Agriculture & Food Security',
        type: 'class',
        date: '2025-07-16',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'General Studies 3',
        instructor: 'Prof. Sarah Williams',
        description: 'Agricultural issues, food processing, PDS',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['agriculture', 'gs3', 'food-security'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'sem-jul16',
        title: 'Personality Test Preparation',
        type: 'seminar',
        date: '2025-07-16',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Early preparation for interview stage',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['interview', 'personality-test', 'preparation'],
        instructor: 'Interview Board Members (Retd.)',
        attendees: ['150 participants']
      }
    ],
    '2025-07-17': [
      {
        id: 'w-jul17',
        title: 'Essay Excellence Workshop',
        type: 'workshop',
        date: '2025-07-17',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Advanced essay writing for 150+ marks',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['essay', 'advanced', 'excellence'],
        instructor: 'Essay Toppers Panel',
        attendees: ['70 participants']
      }
    ],
    '2025-07-18': [
      {
        id: 't-jul18',
        title: 'Ethics Paper Mock Test',
        type: 'test',
        date: '2025-07-18',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'General Studies 4',
        description: 'Full ethics paper with case studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'ethics', 'gs4']
      }
    ],
    '2025-07-19': [
      {
        id: 'c-jul19-1',
        title: 'Land Reforms & Infrastructure',
        type: 'class',
        date: '2025-07-19',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'General Studies 3',
        instructor: 'Prof. Sarah Williams',
        description: 'Land reforms, infrastructure development',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['land-reforms', 'infrastructure', 'gs3'],
        attendees: ['Mains aspirants']
      },
      {
        id: 'g-jul19',
        title: 'Weekly Achievement Review',
        type: 'goal',
        date: '2025-07-19',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Celebrate progress and plan ahead',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['review', 'achievement', 'weekly']
      }
    ],
    '2025-07-20': [
      {
        id: 't-jul20',
        title: 'Optional Subject Test 1',
        type: 'test',
        date: '2025-07-20',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Optional Subject',
        description: 'First paper of optional subject',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['optional', 'test', 'paper1']
      }
    ],
    '2025-07-21': [
      {
        id: 'c-jul21-1',
        title: 'Environmental Conservation',
        type: 'class',
        date: '2025-07-21',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'General Studies 3',
        instructor: 'Dr. Priya Sharma',
        description: 'Conservation efforts, environmental impact assessment',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['environment', 'conservation', 'gs3'],
        attendees: ['Mains aspirants']
      },
      {
        id: 's-jul21',
        title: 'Comprehensive Revision',
        type: 'study',
        date: '2025-07-21',
        startTime: '14:00',
        endTime: '18:00',
        duration: '4 hours',
        description: 'Revise all GS papers topics',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['revision', 'comprehensive', 'all-gs']
      }
    ],
    '2025-07-22': [
      {
        id: 'w-jul22',
        title: 'Mains Test Series Launch',
        type: 'workshop',
        date: '2025-07-22',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Introduction to comprehensive mains test series',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['test-series', 'mains', 'launch'],
        instructor: 'Exam Coordinators',
        attendees: ['All mains aspirants']
      }
    ],
    '2025-07-23': [
      {
        id: 'c-jul23-1',
        title: 'Governance Case Studies',
        type: 'class',
        date: '2025-07-23',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'General Studies 2',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Real-world governance challenges and solutions',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['governance', 'case-studies', 'gs2'],
        attendees: ['Mains aspirants']
      },
      {
        id: 't-jul23',
        title: 'Current Affairs Compilation',
        type: 'task',
        date: '2025-07-23',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Compile July current affairs notes',
        subject: 'Current Affairs',
        priority: 'high',
        status: 'upcoming',
        tags: ['current-affairs', 'compilation', 'july']
      }
    ],
    '2025-07-24': [
      {
        id: 'sem-jul24',
        title: 'Mains Strategy Refinement',
        type: 'seminar',
        date: '2025-07-24',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Fine-tuning mains preparation strategy',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/mains-strategy-jul24',
        tags: ['strategy', 'mains', 'refinement'],
        instructor: 'Strategy Experts',
        attendees: ['200 participants expected']
      }
    ],
    '2025-07-25': [
      {
        id: 't-jul25',
        title: 'Full Mains Mock Day 1',
        type: 'test',
        date: '2025-07-25',
        startTime: '09:00',
        endTime: '17:00',
        duration: '8 hours',
        location: 'Examination Hall',
        subject: 'Mains Mock',
        description: 'Essay and GS1 papers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'full-mains', 'day1']
      }
    ],
    '2025-07-26': [
      {
        id: 't-jul26',
        title: 'Full Mains Mock Day 2',
        type: 'test',
        date: '2025-07-26',
        startTime: '09:00',
        endTime: '17:00',
        duration: '8 hours',
        location: 'Examination Hall',
        subject: 'Mains Mock',
        description: 'GS2 and GS3 papers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'full-mains', 'day2']
      },
      {
        id: 'g-jul26',
        title: 'Weekend Progress Check',
        type: 'goal',
        date: '2025-07-26',
        startTime: '18:00',
        endTime: '19:00',
        duration: '1 hour',
        description: 'Evaluate test performance and progress',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['progress', 'evaluation', 'weekend']
      }
    ],
    '2025-07-27': [
      {
        id: 't-jul27',
        title: 'Full Mains Mock Day 3',
        type: 'test',
        date: '2025-07-27',
        startTime: '09:00',
        endTime: '17:00',
        duration: '8 hours',
        location: 'Examination Hall',
        subject: 'Mains Mock',
        description: 'GS4 and Optional papers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['mock-test', 'full-mains', 'day3']
      }
    ],
    '2025-07-28': [
      {
        id: 's-jul28',
        title: 'Mock Test Analysis Marathon',
        type: 'study',
        date: '2025-07-28',
        startTime: '10:00',
        endTime: '18:00',
        duration: '8 hours',
        description: 'Detailed analysis of 3-day mock test',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['analysis', 'mock-test', 'detailed']
      }
    ],
    '2025-07-29': [
      {
        id: 'c-jul29-1',
        title: 'Final Tips for Mains',
        type: 'class',
        date: '2025-07-29',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Auditorium',
        subject: 'General Studies',
        instructor: 'All Faculty',
        description: 'Last-minute tips and guidance for mains',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['final-tips', 'mains', 'guidance'],
        attendees: ['All mains aspirants']
      },
      {
        id: 'w-jul29',
        title: 'Stress Management Session',
        type: 'workshop',
        date: '2025-07-29',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Seminar Hall',
        description: 'Managing exam stress and anxiety',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['stress-management', 'wellness', 'exam'],
        instructor: 'Counseling Team',
        attendees: ['Open to all']
      }
    ],
    '2025-07-30': [
      {
        id: 'sem-jul30',
        title: 'July Wrap-up & August Planning',
        type: 'seminar',
        date: '2025-07-30',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Monthly review and next month planning',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['review', 'planning', 'monthly'],
        instructor: 'Program Coordinators',
        attendees: ['All students']
      }
    ],
    '2025-07-31': [
      {
        id: 'g-jul31',
        title: 'July Achievement Celebration',
        type: 'goal',
        date: '2025-07-31',
        startTime: '17:00',
        endTime: '19:00',
        duration: '2 hours',
        description: 'Celebrate monthly achievements and set August goals',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['celebration', 'achievement', 'monthly'],
        location: 'Student Lounge'
      }
    ],
    // February 2025 Events
    '2025-02-01': [
      {
        id: 't-feb1',
        title: 'Geography Mock Test',
        type: 'test',
        date: '2025-02-01',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Geography',
        description: 'Comprehensive test on Physical and Human Geography',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'geography', 'mock'],
        attachments: ['Geography_Syllabus.pdf']
      },
      {
        id: 's-feb1',
        title: 'Monthly Planning Session',
        type: 'study',
        date: '2025-02-01',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Plan February study schedule and set monthly goals',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['planning', 'monthly', 'goals'],
        isAiSuggested: true
      }
    ],
    '2025-02-03': [
      {
        id: 'c-feb3-1',
        title: 'Indian Polity - Emergency Provisions',
        type: 'class',
        date: '2025-02-03',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'National, State, Financial Emergency - Articles 352-360',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'emergency', 'constitution'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-feb3',
        title: 'GS Paper Writing Workshop',
        type: 'workshop',
        date: '2025-02-03',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Answer writing techniques for GS papers',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['answer-writing', 'general-studies', 'workshop'],
        instructor: 'UPSC Toppers Panel',
        attendees: ['70 participants']
      }
    ],
    '2025-02-04': [
      {
        id: 'c-feb4-1',
        title: 'Modern History - Post-Independence India',
        type: 'class',
        date: '2025-02-04',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'Integration of states, foreign policy, economic development',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['modern-history', 'post-independence', 'integration'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-feb4',
        title: 'Science & Tech Current Affairs',
        type: 'study',
        date: '2025-02-04',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Review recent developments in Science & Technology',
        subject: 'General Studies',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['science-tech', 'current-affairs', 'study']
      }
    ],
    '2025-02-05': [
      {
        id: 'c-feb5-1',
        title: 'Economics - International Organizations',
        type: 'class',
        date: '2025-02-05',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'World Bank, IMF, WTO, ADB - India\'s engagement',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'international-orgs', 'global'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'sem-feb5',
        title: 'Environment & Ecology Seminar',
        type: 'seminar',
        date: '2025-02-05',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Climate change, biodiversity, environmental laws',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['environment', 'ecology', 'climate'],
        instructor: 'Environmental Experts',
        attendees: ['200 participants']
      }
    ],
    '2025-02-06': [
      {
        id: 'c-feb6-1',
        title: 'Geography - Industrial Location',
        type: 'class',
        date: '2025-02-06',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Factors of industrial location, major industrial regions',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'industries', 'location'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-feb6',
        title: 'Submit History Assignment',
        type: 'task',
        date: '2025-02-06',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Submit essay on Indian National Movement',
        subject: 'History',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'history', 'deadline']
      }
    ],
    '2025-02-07': [
      {
        id: 'w-feb7',
        title: 'Current Affairs Weekly Review',
        type: 'workshop',
        date: '2025-02-07',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Interactive discussion on week\'s important events',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-affairs-feb7',
        tags: ['current-affairs', 'weekly', 'discussion'],
        instructor: 'Current Affairs Team',
        attendees: ['150 participants expected']
      },
      {
        id: 'g-feb7',
        title: 'Weekly Goal Assessment',
        type: 'goal',
        date: '2025-02-07',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Review weekly progress and adjust study plan',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'assessment', 'weekly']
      }
    ],
    '2025-02-08': [
      {
        id: 't-feb8',
        title: 'General Studies Full Mock Test',
        type: 'test',
        date: '2025-02-08',
        startTime: '09:00',
        endTime: '12:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'General Studies',
        description: 'UPSC Prelims pattern full-length test',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'prelims', 'mock'],
        attachments: ['GS_Mock_Pattern.pdf']
      },
      {
        id: 's-feb8',
        title: 'Test Analysis & Review',
        type: 'study',
        date: '2025-02-08',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Analyze mock test performance and identify weak areas',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['analysis', 'review', 'performance'],
        isAiSuggested: true
      }
    ],
    '2025-02-10': [
      {
        id: 'c-feb10-1',
        title: 'Indian Polity - Local Government',
        type: 'class',
        date: '2025-02-10',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Panchayati Raj, Municipalities, 73rd & 74th Amendment',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'local-government', 'panchayat'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-feb10',
        title: 'Ethics Case Study Workshop',
        type: 'workshop',
        date: '2025-02-10',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'Solving ethics case studies, applied ethics',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'case-study', 'workshop'],
        instructor: 'Dr. Madhav Khosla',
        attendees: ['55 participants']
      }
    ],
    '2025-02-11': [
      {
        id: 'c-feb11-1',
        title: 'Art & Culture - Indian Architecture',
        type: 'class',
        date: '2025-02-11',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Art & Culture',
        instructor: 'Prof. Arun Kumar',
        description: 'Temple architecture, Indo-Islamic architecture, Modern',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['art-culture', 'architecture', 'heritage'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-feb11',
        title: 'Polity Revision Session',
        type: 'study',
        date: '2025-02-11',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Revise Constitutional provisions and amendments',
        subject: 'Indian Polity',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['polity', 'revision', 'constitution']
      }
    ],
    '2025-02-12': [
      {
        id: 'c-feb12-1',
        title: 'Economics - Social Sector Initiatives',
        type: 'class',
        date: '2025-02-12',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Education, Health, Poverty alleviation schemes',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'social-sector', 'schemes'],
        attendees: ['110 students enrolled']
      },
      {
        id: 't-feb12',
        title: 'Complete Geography Project',
        type: 'task',
        date: '2025-02-12',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Submit project on Climate Change impacts in India',
        subject: 'Geography',
        priority: 'high',
        status: 'upcoming',
        tags: ['project', 'geography', 'deadline']
      }
    ],
    '2025-02-13': [
      {
        id: 'c-feb13-1',
        title: 'Geography - Transport & Communication',
        type: 'class',
        date: '2025-02-13',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Transport networks, communication systems, trade routes',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'transport', 'communication'],
        attendees: ['95 students enrolled']
      },
      {
        id: 'sem-feb13',
        title: 'International Relations Seminar',
        type: 'seminar',
        date: '2025-02-13',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'India\'s foreign policy, bilateral relations, global issues',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/ir-seminar-feb13',
        tags: ['international-relations', 'foreign-policy', 'seminar'],
        instructor: 'Former Diplomats Panel',
        attendees: ['180 participants expected']
      }
    ],
    '2025-02-14': [
      {
        id: 'w-feb14',
        title: 'Essay Writing Intensive Workshop',
        type: 'workshop',
        date: '2025-02-14',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Essay structure, arguments, time management',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['essay', 'writing', 'intensive'],
        instructor: 'Dr. Anita Desai',
        attendees: ['50 participants'],
        attachments: ['Essay_Templates.pdf', 'Sample_Essays.pdf']
      },
      {
        id: 'g-feb14',
        title: 'Mid-Month Progress Review',
        type: 'goal',
        date: '2025-02-14',
        startTime: '17:30',
        endTime: '18:30',
        duration: '1 hour',
        description: 'Review February goals and adjust strategies',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'mid-month']
      }
    ],
    '2025-02-15': [
      {
        id: 't-feb15',
        title: 'CSAT Mock Test',
        type: 'test',
        date: '2025-02-15',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Examination Hall',
        subject: 'CSAT',
        description: 'Aptitude test - Comprehension, Logical reasoning, Maths',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'csat', 'aptitude'],
        attachments: ['CSAT_Pattern.pdf']
      },
      {
        id: 'b-feb15',
        title: 'Relaxation & Wellness Break',
        type: 'break',
        date: '2025-02-15',
        startTime: '14:00',
        endTime: '15:00',
        duration: '1 hour',
        description: 'Yoga and meditation session',
        priority: 'low',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['wellness', 'break', 'relaxation']
      }
    ],
    '2025-02-17': [
      {
        id: 'c-feb17-1',
        title: 'Indian Polity - Constitutional Bodies',
        type: 'class',
        date: '2025-02-17',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Election Commission, CAG, UPSC, Finance Commission',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'constitutional-bodies', 'institutions'],
        attendees: ['125 students enrolled']
      },
      {
        id: 's-feb17',
        title: 'Current Affairs Monthly Compilation',
        type: 'study',
        date: '2025-02-17',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        description: 'Compile and revise February current affairs',
        subject: 'General Studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['current-affairs', 'compilation', 'monthly']
      }
    ],
    '2025-02-18': [
      {
        id: 'c-feb18-1',
        title: 'Art & Culture - Indian Paintings',
        type: 'class',
        date: '2025-02-18',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Art & Culture',
        instructor: 'Prof. Arun Kumar',
        description: 'Miniature paintings, Modern Indian art, Folk paintings',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['art-culture', 'paintings', 'heritage'],
        attendees: ['98 students enrolled']
      },
      {
        id: 'w-feb18',
        title: 'Disaster Management Workshop',
        type: 'workshop',
        date: '2025-02-18',
        startTime: '15:00',
        endTime: '17:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'DM Act, NDMA, mitigation strategies, case studies',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['disaster-management', 'ndma', 'workshop'],
        instructor: 'NDMA Officials',
        attendees: ['45 participants']
      }
    ],
    '2025-02-19': [
      {
        id: 'c-feb19-1',
        title: 'Economics - Infrastructure Development',
        type: 'class',
        date: '2025-02-19',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Infrastructure financing, PPP models, major projects',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'infrastructure', 'development'],
        attendees: ['110 students enrolled']
      },
      {
        id: 't-feb19',
        title: 'Submit Ethics Case Study',
        type: 'task',
        date: '2025-02-19',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Submit analysis of ethical dilemmas in governance',
        subject: 'Ethics',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'ethics', 'deadline']
      }
    ],
    '2025-02-20': [
      {
        id: 'c-feb20-1',
        title: 'Geography - Urbanization in India',
        type: 'class',
        date: '2025-02-20',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Urban growth, smart cities, urban problems & solutions',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'urbanization', 'cities'],
        attendees: ['95 students enrolled']
      },
      {
        id: 'sem-feb20',
        title: 'Science & Technology Update',
        type: 'seminar',
        date: '2025-02-20',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Recent developments in Space, IT, Biotech, Nanotech',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['science-tech', 'updates', 'seminar'],
        instructor: 'Science Experts Panel',
        attendees: ['160 participants']
      }
    ],
    '2025-02-21': [
      {
        id: 'w-feb21',
        title: 'Prelims Strategy Workshop',
        type: 'workshop',
        date: '2025-02-21',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Conference Room',
        description: 'Prelims preparation strategy, tips, and techniques',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/prelims-strategy-feb21',
        tags: ['prelims', 'strategy', 'preparation'],
        instructor: 'UPSC Experts',
        attendees: ['200+ participants expected']
      },
      {
        id: 'g-feb21',
        title: 'Weekly Goal Review',
        type: 'goal',
        date: '2025-02-21',
        startTime: '17:30',
        endTime: '18:30',
        duration: '1 hour',
        description: 'Assess weekly progress and plan next week',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'weekly']
      }
    ],
    '2025-02-22': [
      {
        id: 't-feb22',
        title: 'History & Culture Mock Test',
        type: 'test',
        date: '2025-02-22',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'History & Culture',
        description: 'Comprehensive test covering all periods and art forms',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'history', 'culture', 'mock'],
        attachments: ['History_Culture_Syllabus.pdf']
      },
      {
        id: 's-feb22',
        title: 'Optional Subject Preparation',
        type: 'study',
        date: '2025-02-22',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Focus on optional subject preparation',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['optional', 'preparation', 'study']
      }
    ],
    '2025-02-24': [
      {
        id: 'c-feb24-1',
        title: 'Indian Polity - Special Provisions',
        type: 'class',
        date: '2025-02-24',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Article 370, Fifth & Sixth Schedule, Special status',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'special-provisions', 'schedules'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-feb24',
        title: 'Map Work Intensive Session',
        type: 'workshop',
        date: '2025-02-24',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Geography Lab',
        description: 'Practice locating important places on Indian & World map',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['geography', 'maps', 'practice'],
        instructor: 'Dr. Priya Sharma',
        attendees: ['35 participants']
      }
    ],
    '2025-02-25': [
      {
        id: 'c-feb25-1',
        title: 'Art & Culture - Performing Arts',
        type: 'class',
        date: '2025-02-25',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Art & Culture',
        instructor: 'Prof. Arun Kumar',
        description: 'Classical dances, music, theatre forms of India',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['art-culture', 'performing-arts', 'classical'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-feb25',
        title: 'Economics Numerical Practice',
        type: 'study',
        date: '2025-02-25',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice economic data interpretation and calculations',
        subject: 'Economics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['economics', 'numericals', 'practice']
      }
    ],
    '2025-02-26': [
      {
        id: 'c-feb26-1',
        title: 'Economics - Economic Survey Analysis',
        type: 'class',
        date: '2025-02-26',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Key highlights and analysis of Economic Survey',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'economic-survey', 'analysis'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'sem-feb26',
        title: 'Ethics in Governance Seminar',
        type: 'seminar',
        date: '2025-02-26',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Ethical issues in administration, case studies',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'governance', 'administration'],
        instructor: 'Retired Civil Servants',
        attendees: ['120 participants']
      }
    ],
    '2025-02-27': [
      {
        id: 'c-feb27-1',
        title: 'Geography - Regional Development',
        type: 'class',
        date: '2025-02-27',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Regional imbalances, planning, special economic zones',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'regional-development', 'planning'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-feb27',
        title: 'Submit Monthly Progress Report',
        type: 'task',
        date: '2025-02-27',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Submit comprehensive February progress report',
        priority: 'high',
        status: 'upcoming',
        tags: ['report', 'monthly', 'deadline']
      }
    ],
    '2025-02-28': [
      {
        id: 'sem-feb28',
        title: 'Month-End Review Conference',
        type: 'seminar',
        date: '2025-02-28',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'February review, March planning, strategy discussion',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['review', 'planning', 'conference'],
        instructor: 'All Faculty',
        attendees: ['All students'],
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/month-review-feb28'
      },
      {
        id: 'g-feb28',
        title: 'Monthly Goal Evaluation',
        type: 'goal',
        date: '2025-02-28',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Evaluate February achievements and set March goals',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'evaluation', 'monthly']
      }
    ],
    '2025-03-01': [
      {
        id: 't-mar1',
        title: 'Comprehensive Mock Test - Prelims',
        type: 'test',
        date: '2025-03-01',
        startTime: '09:00',
        endTime: '13:00',
        duration: '4 hours',
        location: 'Examination Hall',
        subject: 'General Studies',
        description: 'Full UPSC Prelims pattern - GS Paper I & CSAT',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'prelims', 'comprehensive'],
        attachments: ['Prelims_Pattern.pdf', 'Instructions.pdf']
      },
      {
        id: 's-mar1',
        title: 'March Study Plan Creation',
        type: 'study',
        date: '2025-03-01',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Create detailed study plan for March',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['planning', 'study-plan', 'march'],
        isAiSuggested: true
      }
    ],
    '2025-03-02': [
      {
        id: 'w-mar2',
        title: 'UPSC Essay Writing Workshop',
        type: 'workshop',
        date: '2025-03-02',
        startTime: '11:00',
        endTime: '14:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Intensive workshop on essay writing techniques',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        isOnline: false,
        tags: ['essay', 'writing', 'workshop'],
        attendees: ['Dr. Anita Desai', '45 participants'],
        attachments: ['Essay_Writing_Guide.pdf', 'Sample_Essays.pdf']
      },
      {
        id: 't-mar2',
        title: 'Complete Economics Assignment',
        type: 'task',
        date: '2025-03-02',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Submit analysis on monetary policy',
        subject: 'Economics',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'economics', 'deadline']
      }
    ],
    '2025-03-05': [
      {
        id: 's-mar5',
        title: 'Current Affairs Seminar',
        type: 'seminar',
        date: '2025-03-05',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Analysis of recent national and international events',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-affairs-mar5',
        tags: ['current-affairs', 'seminar', 'online'],
        attendees: ['Prof. Sharma', '80+ participants expected']
      }
    ],
    '2025-03-08': [
      {
        id: 'c-mar8-1',
        title: 'Economics Class',
        type: 'class',
        date: '2025-03-08',
        startTime: '09:00',
        endTime: '10:30',
        duration: '1.5 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Monetary Policy and Banking System',
        priority: 'high',
        status: 'upcoming',
        tags: ['economics', 'monetary-policy'],
        attendees: ['98 students enrolled']
      },
      {
        id: 'c-mar8-2',
        title: 'Geography Tutorial',
        type: 'class',
        date: '2025-03-08',
        startTime: '11:00',
        endTime: '12:30',
        duration: '1.5 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Indian Climate Systems',
        priority: 'high',
        status: 'upcoming',
        tags: ['geography', 'climate'],
        attendees: ['75 students enrolled']
      },
      {
        id: 'g-mar8',
        title: 'Weekly Study Goal Review',
        type: 'goal',
        date: '2025-03-08',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Review weekly progress and adjust study plan',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'planning']
      }
    ],
    '2025-03-03': [
      {
        id: 'c-mar3-1',
        title: 'Indian Polity - Amendment Procedures',
        type: 'class',
        date: '2025-03-03',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Article 368, types of amendments, important amendments',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'amendments', 'constitution'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-mar3',
        title: 'Optional Subject Strategy Workshop',
        type: 'workshop',
        date: '2025-03-03',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Strategy for optional subject preparation and answer writing',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['optional', 'strategy', 'workshop'],
        instructor: 'Subject Experts Panel',
        attendees: ['80 participants']
      }
    ],
    '2025-03-04': [
      {
        id: 'c-mar4-1',
        title: 'Modern History - Partition & Independence',
        type: 'class',
        date: '2025-03-04',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'Partition of India, transfer of power, integration challenges',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['modern-history', 'partition', 'independence'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-mar4',
        title: 'Ethics Answer Writing Practice',
        type: 'study',
        date: '2025-03-04',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice ethics answers with case studies',
        subject: 'Ethics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['ethics', 'answer-writing', 'practice']
      }
    ],
    '2025-03-05-2': [
      {
        id: 'c-mar5-2',
        title: 'Economics - Planning & Development',
        type: 'class',
        date: '2025-03-05',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Five Year Plans, NITI Aayog, development strategies',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'planning', 'development'],
        attendees: ['110 students enrolled']
      },
      {
        id: 's-mar5',
        title: 'Current Affairs Seminar',
        type: 'seminar',
        date: '2025-03-05',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Analysis of recent national and international events',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-affairs-mar5',
        tags: ['current-affairs', 'seminar', 'online'],
        attendees: ['Prof. Sharma', '80+ participants expected']
      }
    ],
    '2025-03-06': [
      {
        id: 'c-mar6-1',
        title: 'Geography - Disaster Management',
        type: 'class',
        date: '2025-03-06',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Natural disasters in India, vulnerability mapping, mitigation',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'disaster-management', 'mitigation'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-mar6',
        title: 'Submit Polity Assignment',
        type: 'task',
        date: '2025-03-06',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Submit assignment on Constitutional amendments',
        subject: 'Indian Polity',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'polity', 'deadline']
      }
    ],
    '2025-03-07': [
      {
        id: 'w-mar7',
        title: 'Mains Answer Writing Marathon',
        type: 'workshop',
        date: '2025-03-07',
        startTime: '14:00',
        endTime: '17:30',
        duration: '3.5 hours',
        location: 'Examination Hall',
        description: 'Timed practice session for mains answer writing',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['mains', 'answer-writing', 'marathon'],
        instructor: 'Faculty Team',
        attendees: ['100 participants'],
        attachments: ['Answer_Sheet_Format.pdf']
      },
      {
        id: 'g-mar7',
        title: 'Weekly Progress Check',
        type: 'goal',
        date: '2025-03-07',
        startTime: '18:00',
        endTime: '19:00',
        duration: '1 hour',
        description: 'Review weekly achievements and adjust study plan',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'weekly']
      }
    ],
    '2025-03-08-2': [
      {
        id: 'c-mar8-2',
        title: 'Economics Class',
        type: 'class',
        date: '2025-03-08',
        startTime: '09:00',
        endTime: '10:30',
        duration: '1.5 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Monetary Policy and Banking System',
        priority: 'high',
        status: 'upcoming',
        tags: ['economics', 'monetary-policy'],
        attendees: ['98 students enrolled']
      },
      {
        id: 'c-mar8-2',
        title: 'Geography Tutorial',
        type: 'class',
        date: '2025-03-08',
        startTime: '11:00',
        endTime: '12:30',
        duration: '1.5 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Indian Climate Systems',
        priority: 'high',
        status: 'upcoming',
        tags: ['geography', 'climate'],
        attendees: ['75 students enrolled']
      },
      {
        id: 'g-mar8',
        title: 'Weekly Study Goal Review',
        type: 'goal',
        date: '2025-03-08',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Review weekly progress and adjust study plan',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'planning']
      }
    ],
    '2025-03-09': [
      {
        id: 't-mar9',
        title: 'Environment & Ecology Mock Test',
        type: 'test',
        date: '2025-03-09',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Examination Hall',
        subject: 'Environment',
        description: 'Comprehensive test on Environment, Ecology & Biodiversity',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'environment', 'ecology'],
        attachments: ['Environment_Syllabus.pdf']
      },
      {
        id: 'b-mar9',
        title: 'Sports & Recreation Time',
        type: 'break',
        date: '2025-03-09',
        startTime: '16:00',
        endTime: '17:30',
        duration: '1.5 hours',
        description: 'Physical activities and team sports',
        priority: 'low',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['sports', 'recreation', 'wellness']
      }
    ],
    '2025-03-10': [
      {
        id: 't-mar10',
        title: 'Indian Polity Mock Test',
        type: 'test',
        date: '2025-03-10',
        startTime: '10:00',
        endTime: '13:00',
        duration: '3 hours',
        location: 'Examination Hall',
        subject: 'Indian Polity',
        description: 'Comprehensive test on Constitutional Framework',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'polity', 'mock'],
        attachments: ['Test_Syllabus.pdf', 'Previous_Papers.pdf']
      }
    ],
    '2025-03-11': [
      {
        id: 'c-mar11-1',
        title: 'Art & Culture - Indian Literature',
        type: 'class',
        date: '2025-03-11',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Art & Culture',
        instructor: 'Prof. Arun Kumar',
        description: 'Classical Sanskrit, Tamil literature, modern Indian writings',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['art-culture', 'literature', 'classical'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-mar11',
        title: 'Geography Map Practice',
        type: 'study',
        date: '2025-03-11',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Practice world geography locations and features',
        subject: 'Geography',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['geography', 'maps', 'practice']
      }
    ],
    '2025-03-12': [
      {
        id: 'c-mar12-1',
        title: 'Economics - Digital Economy',
        type: 'class',
        date: '2025-03-12',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Digital India, FinTech, cryptocurrency, e-governance',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'digital-economy', 'fintech'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'w-mar12',
        title: 'Personality Development Workshop',
        type: 'workshop',
        date: '2025-03-12',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Seminar Hall',
        description: 'Communication skills, body language for interviews',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['personality', 'interview', 'skills'],
        instructor: 'Soft Skills Trainers',
        attendees: ['65 participants']
      }
    ],
    '2025-03-13': [
      {
        id: 'c-mar13-1',
        title: 'Geography - Population Geography',
        type: 'class',
        date: '2025-03-13',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Demographics, migration, census data analysis',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'population', 'demographics'],
        attendees: ['95 students enrolled']
      },
      {
        id: 'sem-mar13',
        title: 'Internal Security Seminar',
        type: 'seminar',
        date: '2025-03-13',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Border management, terrorism, cyber security challenges',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['internal-security', 'terrorism', 'cyber-security'],
        instructor: 'Security Experts',
        attendees: ['140 participants']
      }
    ],
    '2025-03-14': [
      {
        id: 'w-mar14',
        title: 'Current Affairs Workshop',
        type: 'workshop',
        date: '2025-03-14',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Weekly analysis of important current events',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/current-affairs-mar14',
        tags: ['current-affairs', 'weekly', 'analysis'],
        instructor: 'Current Affairs Team',
        attendees: ['170 participants expected']
      },
      {
        id: 'g-mar14',
        title: 'Mid-Month Goal Review',
        type: 'goal',
        date: '2025-03-14',
        startTime: '17:00',
        endTime: '18:00',
        duration: '1 hour',
        description: 'Assess March progress and realign goals',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'mid-month']
      }
    ],
    '2025-03-15': [
      {
        id: 't-mar15',
        title: 'UPSC Prelims Full Mock Test',
        type: 'test',
        date: '2025-03-15',
        startTime: '09:00',
        endTime: '14:00',
        duration: '5 hours',
        location: 'Examination Hall',
        subject: 'General Studies',
        description: 'Complete UPSC Prelims simulation - GS + CSAT',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'prelims', 'full-mock'],
        attachments: ['Prelims_Instructions.pdf', 'OMR_Sheet.pdf']
      },
      {
        id: 's-mar15',
        title: 'Test Analysis Session',
        type: 'study',
        date: '2025-03-15',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Detailed analysis of mock test performance',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['analysis', 'performance', 'review'],
        isAiSuggested: true
      }
    ],
    '2025-03-17': [
      {
        id: 'c-mar17-1',
        title: 'Indian Polity - Rights & Duties',
        type: 'class',
        date: '2025-03-17',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Fundamental duties, DPSPs, recent judicial interpretations',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'rights', 'duties'],
        attendees: ['125 students enrolled']
      },
      {
        id: 'w-mar17',
        title: 'Science & Tech Workshop',
        type: 'workshop',
        date: '2025-03-17',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Science Lab',
        description: 'Recent developments in space, defense technology',
        priority: 'medium',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['science-tech', 'space', 'defense'],
        instructor: 'Dr. APJ Abdul',
        attendees: ['50 participants']
      }
    ],
    '2025-03-18': [
      {
        id: 'c-mar18-1',
        title: 'Art & Culture - Folk Traditions',
        type: 'class',
        date: '2025-03-18',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Art & Culture',
        instructor: 'Prof. Arun Kumar',
        description: 'Folk dances, music, festivals, tribal culture',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['art-culture', 'folk', 'traditions'],
        attendees: ['98 students enrolled']
      },
      {
        id: 's-mar18',
        title: 'Economics Revision',
        type: 'study',
        date: '2025-03-18',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Revise important economic concepts and current data',
        subject: 'Economics',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['economics', 'revision', 'concepts']
      }
    ],
    '2025-03-19': [
      {
        id: 'c-mar19-1',
        title: 'Economics - Environmental Economics',
        type: 'class',
        date: '2025-03-19',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Sustainable development, carbon credits, green economy',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'environment', 'sustainability'],
        attendees: ['110 students enrolled']
      },
      {
        id: 't-mar19',
        title: 'Submit Art & Culture Project',
        type: 'task',
        date: '2025-03-19',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Submit project on Indian heritage sites',
        subject: 'Art & Culture',
        priority: 'high',
        status: 'upcoming',
        tags: ['project', 'heritage', 'deadline']
      }
    ],
    '2025-03-20': [
      {
        id: 'c-mar20-1',
        title: 'Geography - Geopolitics',
        type: 'class',
        date: '2025-03-20',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Strategic locations, maritime boundaries, border disputes',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'geopolitics', 'boundaries'],
        attendees: ['95 students enrolled']
      },
      {
        id: 'sem-mar20',
        title: 'Social Issues Seminar',
        type: 'seminar',
        date: '2025-03-20',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'Poverty, inequality, gender issues, social justice',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['social-issues', 'inequality', 'justice'],
        instructor: 'Social Scientists Panel',
        attendees: ['180 participants']
      }
    ],
    '2025-03-21': [
      {
        id: 'w-mar21',
        title: 'Mains Essay Writing Workshop',
        type: 'workshop',
        date: '2025-03-21',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Seminar Hall',
        description: 'Advanced essay writing techniques for mains',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['essay', 'mains', 'advanced'],
        instructor: 'Dr. Anita Desai',
        attendees: ['60 participants'],
        attachments: ['Essay_Topics_2025.pdf']
      },
      {
        id: 'g-mar21',
        title: 'Weekly Goal Assessment',
        type: 'goal',
        date: '2025-03-21',
        startTime: '17:30',
        endTime: '18:30',
        duration: '1 hour',
        description: 'Review weekly achievements and plan ahead',
        priority: 'medium',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'assessment', 'weekly']
      }
    ],
    '2025-03-22': [
      {
        id: 't-mar22',
        title: 'Science & Technology Mock Test',
        type: 'test',
        date: '2025-03-22',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Examination Hall',
        subject: 'Science & Technology',
        description: 'Comprehensive test on S&T developments and basics',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'science-tech', 'mock'],
        attachments: ['Science_Tech_Syllabus.pdf']
      },
      {
        id: 'b-mar22',
        title: 'Cultural Event Participation',
        type: 'break',
        date: '2025-03-22',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        description: 'Participate in cultural activities and networking',
        priority: 'low',
        status: 'upcoming',
        tags: ['cultural', 'networking', 'break']
      }
    ],
    '2025-03-24': [
      {
        id: 'c-mar24-1',
        title: 'Indian Polity - Recent Amendments',
        type: 'class',
        date: '2025-03-24',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 201',
        subject: 'Indian Polity',
        instructor: 'Dr. Rajesh Kumar',
        description: 'Recent constitutional amendments and their implications',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['polity', 'amendments', 'recent'],
        attendees: ['125 students enrolled']
      },
      {
        id: 's-mar24',
        title: 'History Timeline Revision',
        type: 'study',
        date: '2025-03-24',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        description: 'Create and revise chronological timeline of Indian history',
        subject: 'History',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        tags: ['history', 'timeline', 'revision']
      }
    ],
    '2025-03-25': [
      {
        id: 'c-mar25-1',
        title: 'World History - Important Events',
        type: 'class',
        date: '2025-03-25',
        startTime: '10:00',
        endTime: '12:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'History',
        instructor: 'Prof. Arun Kumar',
        description: 'World Wars, Cold War, decolonization movements',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['world-history', 'wars', 'decolonization'],
        attendees: ['98 students enrolled']
      },
      {
        id: 'w-mar25',
        title: 'Ethics & Integrity Case Studies',
        type: 'workshop',
        date: '2025-03-25',
        startTime: '15:00',
        endTime: '17:30',
        duration: '2.5 hours',
        location: 'Seminar Hall',
        description: 'Real-world ethical dilemmas and solutions',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['ethics', 'case-studies', 'integrity'],
        instructor: 'Dr. Madhav Khosla',
        attendees: ['55 participants']
      }
    ],
    '2025-03-26': [
      {
        id: 'c-mar26-1',
        title: 'Economics - Budget 2025 Analysis',
        type: 'class',
        date: '2025-03-26',
        startTime: '09:00',
        endTime: '11:00',
        duration: '2 hours',
        location: 'Room 102',
        subject: 'Economics',
        instructor: 'Prof. Sarah Williams',
        description: 'Detailed analysis of Union Budget 2025-26',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['economics', 'budget', 'analysis'],
        attendees: ['110 students enrolled']
      },
      {
        id: 'sem-mar26',
        title: 'Governance Reforms Seminar',
        type: 'seminar',
        date: '2025-03-26',
        startTime: '16:00',
        endTime: '18:00',
        duration: '2 hours',
        location: 'Conference Room',
        description: 'Administrative reforms, e-governance, citizen charter',
        priority: 'medium',
        status: 'upcoming',
        reminder: '30min',
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/governance-mar26',
        tags: ['governance', 'reforms', 'e-governance'],
        instructor: 'Administrative Experts',
        attendees: ['150 participants expected']
      }
    ],
    '2025-03-27': [
      {
        id: 'c-mar27-1',
        title: 'Geography - World Geography Overview',
        type: 'class',
        date: '2025-03-27',
        startTime: '11:00',
        endTime: '13:00',
        duration: '2 hours',
        location: 'Room 103',
        subject: 'Geography',
        instructor: 'Dr. Priya Sharma',
        description: 'Continents, oceans, major geographical features',
        priority: 'high',
        status: 'upcoming',
        reminder: '15min',
        isOnline: false,
        tags: ['geography', 'world', 'features'],
        attendees: ['95 students enrolled']
      },
      {
        id: 't-mar27',
        title: 'Submit Monthly Assignment',
        type: 'task',
        date: '2025-03-27',
        startTime: '16:00',
        endTime: '17:00',
        duration: '1 hour',
        description: 'Submit comprehensive assignment on current topics',
        priority: 'high',
        status: 'upcoming',
        tags: ['assignment', 'monthly', 'deadline']
      }
    ],
    '2025-03-28': [
      {
        id: 'w-mar28',
        title: 'Answer Writing Improvement Workshop',
        type: 'workshop',
        date: '2025-03-28',
        startTime: '14:00',
        endTime: '17:00',
        duration: '3 hours',
        location: 'Examination Hall',
        description: 'Advanced techniques for scoring high in mains',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['answer-writing', 'mains', 'scoring'],
        instructor: 'UPSC Toppers',
        attendees: ['80 participants'],
        attachments: ['Scoring_Techniques.pdf']
      },
      {
        id: 'g-mar28',
        title: 'Monthly Goal Review',
        type: 'goal',
        date: '2025-03-28',
        startTime: '17:30',
        endTime: '18:30',
        duration: '1 hour',
        description: 'Review March achievements and plan April',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'review', 'monthly']
      }
    ],
    '2025-03-29': [
      {
        id: 't-mar29',
        title: 'Comprehensive GS Mock Test',
        type: 'test',
        date: '2025-03-29',
        startTime: '09:00',
        endTime: '13:00',
        duration: '4 hours',
        location: 'Examination Hall',
        subject: 'General Studies',
        description: 'Full-length GS test covering all subjects',
        priority: 'high',
        status: 'upcoming',
        reminder: '1day',
        tags: ['test', 'general-studies', 'comprehensive'],
        attachments: ['GS_Complete_Syllabus.pdf']
      },
      {
        id: 's-mar29',
        title: 'Optional Subject Focus',
        type: 'study',
        date: '2025-03-29',
        startTime: '15:00',
        endTime: '17:00',
        duration: '2 hours',
        description: 'Intensive optional subject preparation session',
        priority: 'high',
        status: 'upcoming',
        reminder: '30min',
        tags: ['optional', 'intensive', 'preparation']
      }
    ],
    '2025-03-31': [
      {
        id: 'sem-mar31',
        title: 'Monthly Review & Strategy Session',
        type: 'seminar',
        date: '2025-03-31',
        startTime: '14:00',
        endTime: '16:00',
        duration: '2 hours',
        location: 'Auditorium',
        description: 'March performance review and April strategy',
        priority: 'high',
        status: 'upcoming',
        reminder: '1hour',
        tags: ['review', 'strategy', 'monthly'],
        instructor: 'All Faculty',
        attendees: ['All students'],
        isOnline: true,
        meetingLink: 'https://meet.edgeup.com/monthly-review-mar31'
      },
      {
        id: 'g-mar31',
        title: 'Quarter-End Goal Evaluation',
        type: 'goal',
        date: '2025-03-31',
        startTime: '17:00',
        endTime: '18:30',
        duration: '1.5 hours',
        description: 'Evaluate Q1 2025 progress and set Q2 targets',
        priority: 'high',
        status: 'upcoming',
        isAiSuggested: true,
        tags: ['goal', 'quarter', 'evaluation']
      }
    ]
  });

  // Tasks integrated with calendar
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Complete Indian Polity Notes',
      dueDate: '2025-03-05',
      priority: 'high',
      status: 'in-progress',
      category: 'Study Material',
      estimatedTime: '4 hours',
      progress: 65,
      relatedEvents: ['c-mar1']
    },
    {
      id: 'task-2',
      title: 'Practice Essay Writing',
      dueDate: '2025-03-03',
      priority: 'medium',
      status: 'pending',
      category: 'Practice',
      estimatedTime: '2 hours',
      progress: 0,
      relatedEvents: ['w-mar2']
    },
    {
      id: 'task-3',
      title: 'Review Economics Concepts',
      dueDate: '2025-03-07',
      priority: 'high',
      status: 'pending',
      category: 'Revision',
      estimatedTime: '3 hours',
      progress: 0,
      relatedEvents: ['c-mar8-1']
    }
  ]);

  // Study goals
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([
    {
      id: 'goal-1',
      title: 'Master Indian Polity',
      targetDate: '2025-04-30',
      progress: 45,
      milestones: [
        { title: 'Complete Constitutional Framework', date: '2025-03-15', completed: false },
        { title: 'Finish Fundamental Rights', date: '2025-03-30', completed: false },
        { title: 'Study Union & State Relations', date: '2025-04-15', completed: false }
      ]
    },
    {
      id: 'goal-2',
      title: 'Economics Preparation',
      targetDate: '2025-05-15',
      progress: 30,
      milestones: [
        { title: 'Indian Economy Basics', date: '2025-03-20', completed: false },
        { title: 'Economic Survey Analysis', date: '2025-04-10', completed: false },
        { title: 'Current Economic Issues', date: '2025-05-01', completed: false }
      ]
    }
  ]);

  // AI-suggested time slots for optimal studying
  const [aiSuggestions, setAiSuggestions] = useState<Event[]>([
    {
      id: 'ai-1',
      title: 'Optimal Study Time: Geography',
      type: 'study',
      date: new Date().toISOString().split('T')[0],
      startTime: '06:00',
      endTime: '08:00',
      duration: '2 hours',
      description: 'Your productivity peaks at this time for Geography',
      subject: 'Geography',
      priority: 'medium',
      status: 'upcoming',
      isAiSuggested: true,
      tags: ['ai-suggested', 'productivity', 'geography']
    },
    {
      id: 'ai-2',
      title: 'Recommended Break',
      type: 'break',
      date: new Date().toISOString().split('T')[0],
      startTime: '13:00',
      endTime: '13:30',
      duration: '30 minutes',
      description: 'AI suggests a break to maintain focus',
      priority: 'low',
      status: 'upcoming',
      isAiSuggested: true,
      tags: ['ai-suggested', 'break', 'wellness']
    }
  ]);

  // Calculate calendar statistics
  useEffect(() => {
    const calculateStats = () => {
      let total = 0;
      let completed = 0;
      let upcoming = 0;
      let studyHours = 0;
      
      Object.values(events).forEach(dayEvents => {
        dayEvents.forEach(event => {
          total++;
          if (event.status === 'completed') completed++;
          if (event.status === 'upcoming') upcoming++;
          if (event.type === 'study' || event.type === 'class') {
            const duration = parseFloat(event.duration || '0');
            studyHours += duration;
          }
        });
      });
      
      const productivityScore = completed > 0 ? Math.round((completed / total) * 100) : 0;
      const streakDays = calculateStreak();
      
      setCalendarStats({
        totalEvents: total,
        completedEvents: completed,
        upcomingEvents: upcoming,
        studyHours,
        productivityScore,
        streakDays
      });
    };
    
    calculateStats();
  }, [events]);

  // Calculate study streak
  const calculateStreak = () => {
    // Simplified streak calculation
    return 7; // In real app, calculate based on daily activity
  };

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Update event statuses based on current time
      const updatedEvents = { ...events };
      let hasChanges = false;
      
      Object.keys(updatedEvents).forEach(date => {
        updatedEvents[date] = updatedEvents[date].map(event => {
          if (event.date === now.toISOString().split('T')[0]) {
            if (currentTime >= event.startTime && currentTime < event.endTime && event.status === 'upcoming') {
              hasChanges = true;
              return { ...event, status: 'ongoing' as const };
            } else if (currentTime >= event.endTime && event.status === 'ongoing') {
              hasChanges = true;
              return { ...event, status: 'completed' as const };
            }
          }
          return event;
        });
      });
      
      if (hasChanges) {
        setEvents(updatedEvents);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [events]);

  const handleSyncCalendar = async (provider: 'google' | 'apple') => {
    setSyncInProgress(provider);
    try {
      // In a real app, this would integrate with the respective calendar APIs
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      
      // Show success message with modern notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-brand-primary text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Successfully synced with ${provider === 'google' ? 'Google' : 'Apple'} Calendar
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (error) {
      console.error(`Error syncing with ${provider} calendar:`, error);
    } finally {
      setSyncInProgress(null);
      setShowSyncModal(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i),
        key: `prev-${i}`,
        isOtherMonth: true
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        date,
        key: `day-${i}`,
        isOtherMonth: false
      });
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    let nextDay = 1;
    for (let i = days.length; i < totalCells; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, nextDay++),
        key: `next-${i}`,
        isOtherMonth: true
      });
    }

    return days;
  };

  // Get week dates for week view
  const getWeekDates = () => {
    const startOfWeek = new Date(selectedDate || new Date());
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    const filtered: Record<string, Event[]> = {};
    
    Object.entries(events).forEach(([date, dayEvents]) => {
      const filteredDayEvents = dayEvents.filter(event => {
        // Apply type filters
        if (!activeFilters[event.type]) return false;
        
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.subject?.toLowerCase().includes(query) ||
            event.instructor?.toLowerCase().includes(query) ||
            event.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return true;
      });
      
      if (filteredDayEvents.length > 0) {
        filtered[date] = filteredDayEvents;
      }
    });
    
    return filtered;
  }, [events, activeFilters, searchQuery]);

  // Add new event
  const handleAddEvent = (newEvent: Event) => {
    const dateKey = newEvent.date;
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));
    setShowEventModal(false);
  };

  // Update event
  const handleUpdateEvent = (updatedEvent: Event) => {
    const dateKey = updatedEvent.date;
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(e => e.id === updatedEvent.id ? updatedEvent : e)
    }));
    setSelectedEvent(null);
  };

  // Delete event
  const handleDeleteEvent = (eventId: string, date: string) => {
    setEvents(prev => ({
      ...prev,
      [date]: prev[date].filter(e => e.id !== eventId)
    }));
    setSelectedEvent(null);
  };

  // Modern sidebar with animations
  const EventsSidebar = () => {
    if (!selectedDate) return null;

    const dateEvents = getEventsForDate(selectedDate);
    const dateTasks = tasks.filter(task => task.dueDate === selectedDate.toISOString().split('T')[0]);
    const formattedDate = selectedDate.toLocaleDateString('default', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed right-0 top-0 h-screen w-[450px] bg-gradient-to-b from-white to-gray-50 shadow-2xl overflow-hidden z-50"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-brand-primary/10 via-brand-secondary/10 to-transparent" />
          
          <div className="relative h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"
                  >
                    {formattedDate}
                  </motion.h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {dateEvents.length} events
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                      {dateTasks.length} tasks
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDate(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Suggest
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              {/* Daily Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl p-4 mb-6"
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-primary" />
                  Daily Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-primary">
                      {dateEvents.filter(e => e.type === 'study' || e.type === 'class').length}
                    </div>
                    <div className="text-xs text-gray-600">Study Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-secondary">
                      {dateEvents.reduce((acc, e) => acc + parseFloat(e.duration || '0'), 0)}h
                    </div>
                    <div className="text-xs text-gray-600">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-accent">
                      {Math.round((dateEvents.filter(e => e.status === 'completed').length / dateEvents.length) * 100) || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>
              </motion.div>

              {/* Events Section */}
              {dateEvents.length === 0 && dateTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium mb-2">No Events Scheduled</h4>
                  <p className="text-gray-500 text-sm mb-4">Start planning your day!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEventModal(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm"
                  >
                    Create Event
                  </motion.button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Events */}
                  {dateEvents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        Events
                      </h4>
                      <div className="space-y-3">
                        {dateEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {renderModernEventCard(event)}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {dateTasks.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Tasks
                      </h4>
                      <div className="space-y-3">
                        {dateTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">{task.title}</h5>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {task.priority} priority
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {task.estimatedTime}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-700">
                                  {task.progress}%
                                </div>
                                <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className="h-full bg-brand-primary rounded-full"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents[dateStr] || [];
  };

  // Modern event card with glassmorphism
  const renderModernEventCard = (event: Event) => {
    const colors = EVENT_COLORS[event.type];
    const isOngoing = event.status === 'ongoing';
    const isCompleted = event.status === 'completed';
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={`relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all ${
          isOngoing ? 'ring-2 ring-brand-primary ring-offset-2' : ''
        } ${isCompleted ? 'opacity-75' : ''}`}
        onClick={() => setSelectedEvent(event)}
      >
        {/* Status indicator */}
        {isOngoing && (
          <div className="absolute top-3 right-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
            </span>
          </div>
        )}
        
        {/* Gradient accent */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.gradient}`} />
        
        <div className="p-4 pl-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {event.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.priority === 'high' ? 'bg-red-100 text-red-700' :
                    event.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {event.priority}
                  </span>
                )}
                {event.isAiSuggested && (
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                )}
              </div>
              
              <h4 className={`font-semibold text-gray-800 mb-1 ${isCompleted ? 'line-through' : ''}`}>
                {event.title}
              </h4>
              
              {event.subject && (
                <p className="text-sm text-gray-600 mb-2">{event.subject}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.startTime} - {event.endTime}
                </span>
                {event.location && !event.isOnline && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
                {event.isOnline && (
                  <span className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Online
                  </span>
                )}
              </div>
              
              {event.instructor && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  {event.instructor}
                </div>
              )}
              
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {event.reminder && (
                <Bell className="w-4 h-4 text-gray-400" />
              )}
              {event.attachments && event.attachments.length > 0 && (
                <FileText className="w-4 h-4 text-gray-400" />
              )}
              {event.meetingLink && (
                <ExternalLink className="w-4 h-4 text-brand-primary cursor-pointer hover:text-brand-secondary" />
              )}
            </div>
          </div>
          
          {isCompleted && event.completionRate !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Completion</span>
                <span>{event.completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-brand-primary rounded-full"
                  style={{ width: `${event.completionRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderEventIndicators = (date: Date) => {
    const dateEvents = getEventsForDate(date);
    const dateTasks = tasks.filter(task => task.dueDate === date.toISOString().split('T')[0]);
    const totalItems = dateEvents.length + dateTasks.length;
    
    if (totalItems === 0) return null;

    // For month view, show dots
    if (activeView === 'month') {
      return (
        <div className="flex justify-center gap-1 mt-1">
          {dateEvents.slice(0, 3).map((event) => {
            const colors = EVENT_COLORS[event.type];
            return (
              <div
                key={event.id}
                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${colors.gradient}`}
              />
            );
          })}
          {totalItems > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          )}
        </div>
      );
    }
    
    // For other views, show mini cards
    return (
      <div className="space-y-1 mt-1 px-1">
        {dateEvents.slice(0, 2).map((event) => {
          const colors = EVENT_COLORS[event.type];
          return (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.05 }}
              className={`text-xs px-2 py-1 rounded-lg truncate cursor-pointer ${
                colors.bg
              } ${colors.text} ${event.status === 'ongoing' ? 'animate-pulse' : ''}`}
            >
              <span className="font-medium">{event.startTime}</span> {event.title}
            </motion.div>
          );
        })}
        {totalItems > 2 && (
          <div className="text-xs text-gray-500 text-center font-medium">
            +{totalItems - 2} more
          </div>
        )}
      </div>
    );
  };

  // Week view component
  const WeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
            Time
          </div>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <div
                key={index}
                className={`p-4 text-center border-r border-gray-200 cursor-pointer transition-colors ${
                  isToday ? 'bg-brand-primary/10' : ''
                } ${isSelected ? 'bg-brand-primary text-white' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs font-medium">
                  {date.toLocaleDateString('default', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold ${
                  isSelected ? 'text-white' : isToday ? 'text-brand-primary' : 'text-gray-800'
                }`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="relative h-[600px] overflow-y-auto" ref={weekViewRef}>
          <div className="grid grid-cols-8">
            <div className="border-r border-gray-200">
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.time}
                  className="h-[60px] px-2 py-1 text-xs text-gray-500 border-b border-gray-100"
                >
                  {slot.time}
                </div>
              ))}
            </div>
            
            {weekDates.map((date, dateIndex) => (
              <div key={dateIndex} className="relative border-r border-gray-200">
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={`${dateIndex}-${slot.time}`}
                    className="h-[60px] border-b border-gray-100 relative"
                  >
                    {getEventsForDate(date)
                      .filter(event => event.startTime.startsWith(slot.time.split(':')[0]))
                      .map((event) => {
                        const colors = EVENT_COLORS[event.type];
                        const startHour = parseInt(event.startTime.split(':')[0]);
                        const startMinute = parseInt(event.startTime.split(':')[1]);
                        const endHour = parseInt(event.endTime.split(':')[0]);
                        const endMinute = parseInt(event.endTime.split(':')[1]);
                        const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                        const topOffset = (startMinute / 60) * 60;
                        
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02, zIndex: 10 }}
                            className={`absolute left-1 right-1 rounded-lg p-2 cursor-pointer overflow-hidden ${
                              colors.bg
                            } ${colors.border} border`}
                            style={{
                              top: `${topOffset}px`,
                              height: `${duration * 60 - 4}px`,
                              minHeight: '40px'
                            }}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedEvent(event);
                            }}
                          >
                            <div className={`text-xs font-medium ${colors.text} line-clamp-1`}>
                              {event.title}
                            </div>
                            <div className={`text-xs ${colors.text} opacity-75`}>
                              {event.startTime} - {event.endTime}
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Day view component
  const DayView = () => {
    const currentDate = selectedDate || new Date();
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5">
          <h3 className="text-2xl font-bold text-gray-800">
            {currentDate.toLocaleDateString('default', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-600">
              {dayEvents.length} events scheduled
            </span>
            <span className="text-sm text-gray-600">
              {dayEvents.reduce((acc, e) => acc + parseFloat(e.duration || '0'), 0)} hours total
            </span>
          </div>
        </div>
        
        <div className="relative h-[600px] overflow-y-auto" ref={dayViewRef}>
          <div className="grid grid-cols-[100px_1fr]">
            <div>
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.time}
                  className="h-[60px] px-2 py-1 text-sm text-gray-500 border-b border-r border-gray-100 text-right"
                >
                  {slot.time}
                </div>
              ))}
            </div>
            
            <div className="relative">
              {TIME_SLOTS.map((slot, index) => (
                <div
                  key={slot.time}
                  className="h-[60px] border-b border-gray-100 relative"
                >
                  {index % 2 === 0 && (
                    <div className="absolute inset-0 bg-gray-50/50" />
                  )}
                </div>
              ))}
              
              {dayEvents.map((event) => {
                const colors = EVENT_COLORS[event.type];
                const startHour = parseInt(event.startTime.split(':')[0]);
                const startMinute = parseInt(event.startTime.split(':')[1]);
                const endHour = parseInt(event.endTime.split(':')[0]);
                const endMinute = parseInt(event.endTime.split(':')[1]);
                const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                const topOffset = startHour * 60 + startMinute;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    className={`absolute left-2 right-2 rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                      colors.bg
                    } ${colors.border} border`}
                    style={{
                      top: `${topOffset}px`,
                      height: `${duration * 60 - 8}px`,
                      minHeight: '50px'
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold ${colors.text}`}>
                          {event.title}
                        </h4>
                        <p className={`text-sm ${colors.text} opacity-80 mt-1`}>
                          {event.startTime} - {event.endTime}
                        </p>
                        {event.location && (
                          <p className={`text-xs ${colors.text} opacity-70 mt-1 flex items-center gap-1`}>
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      {event.status === 'ongoing' && (
                        <div className="animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Agenda view component
  const AgendaView = () => {
    const upcomingDays = 7;
    const agendaDates = [];
    const today = new Date();
    
    for (let i = 0; i < upcomingDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      agendaDates.push(date);
    }
    
    return (
      <div className="space-y-6">
        {agendaDates.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          
          if (dayEvents.length === 0) return null;
          
          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className={`p-4 border-b border-gray-200 ${
                isToday ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {date.toLocaleDateString('default', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  {isToday && (
                    <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {dayEvents.length} events • {dayEvents.reduce((acc, e) => acc + parseFloat(e.duration || '0'), 0)} hours
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                {dayEvents.map((event) => renderModernEventCard(event))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Smart Calendar</h1>
              <p className="text-white/80">Manage your schedule with AI-powered insights</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSyncModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sync</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-brand-primary rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </motion.button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.totalEvents}</div>
              <div className="text-sm text-white/80">Total Events</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.upcomingEvents}</div>
              <div className="text-sm text-white/80">Upcoming</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.completedEvents}</div>
              <div className="text-sm text-white/80">Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.studyHours}h</div>
              <div className="text-sm text-white/80">Study Hours</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.productivityScore}%</div>
              <div className="text-sm text-white/80">Productivity</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-2xl font-bold">{calendarStats.streakDays} days</div>
              <div className="text-sm text-white/80">Study Streak</div>
            </motion.div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                  {Object.entries(activeFilters).map(([type, active]) => {
                    const colors = EVENT_COLORS[type as keyof typeof EVENT_COLORS];
                    return (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilters(prev => ({ ...prev, [type]: !prev[type as keyof typeof activeFilters] }))}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          active ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {type}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* View Switcher */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {['month', 'week', 'day', 'agenda'].map((view) => (
                <motion.button
                  key={view}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(view as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeView === view
                      ? 'bg-white text-brand-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </motion.button>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskPanel(!showTaskPanel)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Target className="w-5 h-5 text-gray-600" />
                {tasks.filter(t => t.status !== 'completed').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {tasks.filter(t => t.status !== 'completed').length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Sparkles className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-600"
              >
                Today
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Calendar View */}
        <div className="flex gap-6">
          <div className="flex-1">
            {activeView === 'month' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentMonth(prev => {
                          const newDate = new Date(prev);
                          newDate.setMonth(prev.getMonth() - 1);
                          return newDate;
                        })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <h2 className="text-xl font-bold text-gray-800">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentMonth(prev => {
                          const newDate = new Date(prev);
                          newDate.setMonth(prev.getMonth() + 1);
                          return newDate;
                        })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center font-semibold text-gray-700 text-sm uppercase tracking-wider">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays().map(({ date, key, isOtherMonth }) => {
                      if (!date) {
                        return (
                          <div
                            key={key}
                            className="aspect-square p-2"
                          />
                        );
                      }

                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const dayEvents = getEventsForDate(date);
                      const hasTasks = tasks.some(task => task.dueDate === date.toISOString().split('T')[0]);

                      return (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(date)}
                          className={`relative aspect-square p-2 rounded-xl transition-all overflow-hidden ${
                            isSelected
                              ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                              : isToday
                              ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                              : isOtherMonth
                              ? 'text-gray-400 hover:bg-gray-50'
                              : 'hover:bg-gray-50 text-gray-800'
                          } ${dayEvents.length > 0 ? 'ring-1 ring-gray-200' : ''}`}
                        >
                          {/* Date number */}
                          <div className={`text-right font-bold mb-1 ${
                            isSelected ? 'text-white' : ''
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          {/* Event indicators */}
                          {renderEventIndicators(date)}
                          
                          {/* Task indicator */}
                          {hasTasks && (
                            <div className="absolute top-2 left-2">
                              <Target className={`w-3 h-3 ${
                                isSelected ? 'text-white/80' : 'text-brand-accent'
                              }`} />
                            </div>
                          )}
                          
                          {/* AI suggestion indicator */}
                          {aiSuggestions.some(s => s.date === date.toISOString().split('T')[0]) && (
                            <div className="absolute bottom-2 right-2">
                              <Sparkles className={`w-3 h-3 ${
                                isSelected ? 'text-white/80' : 'text-brand-primary'
                              }`} />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'week' && <WeekView />}
            {activeView === 'day' && <DayView />}
            {activeView === 'agenda' && <AgendaView />}
          </div>

          {/* AI Suggestions Panel */}
          {showAiSuggestions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                AI Suggestions
              </h3>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-lg cursor-pointer"
                    onClick={() => handleAddEvent(suggestion)}
                  >
                    <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {suggestion.startTime} - {suggestion.endTime}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tasks Panel */}
          {showTaskPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-primary" />
                Tasks & Goals
              </h3>
              
              {/* Study Goals */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Study Goals</h4>
                <div className="space-y-3">
                  {studyGoals.map((goal) => (
                    <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm">{goal.title}</h5>
                        <span className="text-xs text-gray-500">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tasks */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Upcoming Tasks</h4>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.status !== 'completed')
                    .slice(0, 5)
                    .map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-amber-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">{task.title}</h5>
                          <p className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.estimatedTime}
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Calendar Sync Modal */}
        <AnimatePresence>
          {showSyncModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSyncModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-6">Sync Calendar</h3>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSyncCalendar('google')}
                    disabled={syncInProgress !== null}
                    className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018 1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062-2.31 0-4.187 1.956-4.187 4.273 0 2.315 1.877 4.277 4.187 4.277 2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474 0 4.01-2.677 6.86-6.72 6.86z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Google Calendar</div>
                      <div className="text-sm text-gray-600">Sync with your Google account</div>
                    </div>
                    {syncInProgress === 'google' && (
                      <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSyncCalendar('apple')}
                    disabled={syncInProgress !== null}
                    className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Apple Calendar</div>
                      <div className="text-sm text-gray-600">Sync with your iCloud calendar</div>
                    </div>
                    {syncInProgress === 'apple' && (
                      <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                    )}
                  </motion.button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export as ICS File
                  </motion.button>
                </div>
                
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Modal */}
        <AnimatePresence>
          {showEventModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowEventModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Create New Event</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEventModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Event creation form would go here */}
                <div className="text-center py-8 text-gray-500">
                  Event creation form coming soon...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Details Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</div>
                      <div className="text-sm text-gray-600">{selectedEvent.duration}</div>
                    </div>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div className="font-medium">{selectedEvent.location}</div>
                    </div>
                  )}
                  
                  {selectedEvent.instructor && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="font-medium">{selectedEvent.instructor}</div>
                    </div>
                  )}
                  
                  {selectedEvent.meetingLink && (
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-gray-400" />
                      <a 
                        href={selectedEvent.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-brand-primary hover:text-brand-secondary"
                      >
                        Join Online Meeting
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                  >
                    <Edit3 className="w-4 h-4 inline mr-2" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4 inline mr-2" />
                    Duplicate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.date)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Events Sidebar */}
        {selectedDate && <EventsSidebar />}
      </div>
    </>
  );
}