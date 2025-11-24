import React from 'react';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { PDFViewer } from '../../../../components/upsc/common/PDFViewer';
import { EnhancedVideoPlayer } from '../../../../components/upsc/common/EnhancedVideoPlayer';
import { AudioPlayer } from '../../../../components/upsc/common/AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { performDeepSearch, type DeepSearchResult } from '../../../../utils/deepSearch';
import { DeepSearchResults } from '../../../../components/upsc/common/DeepSearchResults';
import { 
  Play, FileText, Video, Headphones, Brain, Clock, CheckCircle, ArrowLeft,
  Sparkles, Zap, Trophy, Flame, Bookmark, Users, Search, X, Bot, ChevronRight,
  Home, BookOpen, Download, Share2, MessageSquare, Award, Target, Calendar,
  Bell, Star, TrendingUp, Lock, Unlock, ChevronDown, Edit3, Mic, StopCircle,
  Save, Volume2, Wifi, WifiOff, Languages, Moon, Sun, Settings, Filter,
  BarChart3, CircleDollarSign, Timer, PauseCircle, PlayCircle, RefreshCw,
  History, Plus, Minus, Menu, ChevronLeft, Eye, EyeOff, Layers, FolderOpen,
  Laptop, BarChart2, Lightbulb, Camera, List, Grid, Coffee, AlertCircle,
  ArrowRight, Gift, Compass, LifeBuoy, LucideIcon, FolderTree, Gauge,
  SquarePen, ClipboardEdit, GitBranch, PenLine, Clapperboard, CircleUser,
  FileQuestion, HelpCircle, SlidersHorizontal, Paperclip, Sticker, CircleCheck,
  Shield, Medal, Rocket, PenTool, Send, ThumbsUp, Reply, MoreVertical,
  UserPlus, Hash, Zap as Lightning, Activity, TrendingDown, CheckSquare,
  Square, Maximize2, Minimize2, SkipBack, SkipForward, Rewind, FastForward,
  Radio, Subtitles, MonitorPlay, PictureInPicture2, VolumeX, Volume1,
  Network, Cpu, Database, Cloud, CloudOff, MapPin, Navigation, Route,
  Gauge as Speed, BrainCircuit, Sparkle, Stars, BadgeCheck, AwardIcon,
  TrophyIcon, Target as TargetIcon, Crosshair, ClipboardList, FileAudio,
  FileVideo, FilePlus, FolderPlus, MessageCircle, MessagesSquare, UserCircle
} from 'lucide-react';

interface SubtopicContent {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'audio' | 'assignment' | 'interactive' | 'live' | 'workshop';
  duration: string;
  completed: boolean;
  url?: string;
  thumbnail?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  xpReward?: number;
  attachments?: Attachment[];
  transcript?: string;
  captions?: Caption[];
  downloadable?: boolean;
  offlineAvailable?: boolean;
  lastAccessed?: Date;
  completionPercentage?: number;
  estimatedTime?: number;
  prerequisites?: string[];
  relatedContent?: string[];
  tags?: string[];
  instructor?: Instructor;
  likes?: number;
  views?: number;
  rating?: number;
  discussions?: number;
  bookmarked?: boolean;
  watchProgress?: number;
  notes?: Note[];
  resources?: Resource[];
  quiz?: Quiz;
  assignment?: Assignment;
  certificate?: Certificate;
  quality?: VideoQuality[];
  language?: string[];
  lastPosition?: number;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Caption {
  language: string;
  url: string;
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating?: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'xls' | 'link' | 'code';
  url: string;
  size?: string;
}

interface Quiz {
  id: string;
  questions: number;
  passingScore: number;
  attempts: number;
  bestScore?: number;
  timeLimit?: number;
}

interface Assignment {
  id: string;
  dueDate: Date;
  submitted: boolean;
  grade?: number;
  feedback?: string;
}

interface Certificate {
  id: string;
  earned: boolean;
  earnedDate?: Date;
  url?: string;
}

interface VideoQuality {
  quality: string;
  url: string;
}

interface Subtopic {
  id: string;
  title: string;
  description: string;
  content: SubtopicContent[];
  progress: number;
  totalXP?: number;
  earnedXP?: number;
  estimatedDuration?: string;
  learningObjectives?: string[];
  locked?: boolean;
  prerequisites?: string[];
  completedLessons?: number;
  totalLessons?: number;
  nextLesson?: string;
  lastAccessedContent?: string;
  quizScore?: number;
  assignmentStatus?: 'pending' | 'submitted' | 'graded';
  discussionCount?: number;
  bookmarkCount?: number;
}

interface Note {
  id: string;
  content: string;
  timestamp?: number;
  contentId: string;
  contentTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  color?: string;
  type?: 'text' | 'audio' | 'drawing';
  audioUrl?: string;
  drawingData?: string;
  isPublic?: boolean;
  likes?: number;
  replies?: Reply[];
}

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes?: number;
}

interface Discussion {
  id: string;
  author: string;
  authorId: string;
  avatar?: string;
  content: string;
  likes: number;
  replies: Reply[];
  timestamp: Date;
  isInstructor?: boolean;
  isPinned?: boolean;
  attachments?: Attachment[];
  contentId?: string;
  contentTimestamp?: number;
  resolved?: boolean;
  tags?: string[];
  mentions?: string[];
  edited?: boolean;
  editedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'course' | 'streak' | 'completion' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward?: number;
  badgeUrl?: string;
  shareUrl?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedDate?: Date;
  requirements: string[];
  category: string;
  level: number;
}

interface LearningPath {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
  currentModule: string;
  currentLesson?: string;
  progress: number;
  estimatedTime: string;
  completedTime?: string;
  startedAt?: Date;
  targetCompletion?: Date;
  milestones: Milestone[];
  prerequisites?: string[];
  nextPath?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags?: string[];
  certificate?: Certificate;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: number;
  completedLessons: number;
  duration: string;
  locked: boolean;
  current?: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
  xpReward?: number;
}

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  contentCovered: string[];
  xpEarned: number;
  notesCreated: number;
  questionsAnswered?: number;
}

interface LearningAnalytics {
  totalStudyTime: number;
  averageSessionDuration: number;
  preferredStudyTime: string;
  strongTopics: string[];
  weakTopics: string[];
  learningVelocity: number;
  retentionRate: number;
  engagementScore: number;
  lastStudySession?: Date;
  studyStreak: number;
  longestStreak: number;
  completionRate: number;
  averageQuizScore: number;
  totalXpEarned: number;
}

interface Recommendation {
  id: string;
  type: 'content' | 'path' | 'practice' | 'review';
  title: string;
  description: string;
  reason: string;
  thumbnail?: string;
  contentId?: string;
  pathId?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  difficulty?: string;
  matchScore?: number;
}

interface NotificationSettings {
  studyReminders: boolean;
  achievementAlerts: boolean;
  discussionReplies: boolean;
  newContent: boolean;
  deadlineReminders: boolean;
  weeklyProgress: boolean;
  reminderTime?: string;
  reminderDays?: string[];
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  playbackSpeed: number;
  autoplay: boolean;
  captions: boolean;
  captionLanguage?: string;
  videoQuality: 'auto' | '360p' | '480p' | '720p' | '1080p';
  downloadQuality: string;
  offlineMode: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorBlindMode?: string;
  keyboardShortcuts: boolean;
  soundEffects: boolean;
  notificationSound: boolean;
}

interface ContentProgress {
  contentId: string;
  progress: number;
  lastPosition?: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number;
  notes: number;
  bookmarked: boolean;
  rating?: number;
  attempts?: number;
}


export function ModuleContentPage() {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const [activeSubtopic, setActiveSubtopic] = useState<string>('sub-1');
  const [selectedContent, setSelectedContent] = useState<SubtopicContent | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [selectedVideoContent, setSelectedVideoContent] = useState<SubtopicContent | null>(null);
  const [selectedAudioContent, setSelectedAudioContent] = useState<SubtopicContent | null>(null);
  
  // Enhanced LMS states
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [contentFilter, setContentFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [offlineMode, setOfflineMode] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'duration' | 'difficulty' | 'xp'>('default');
  const [showPath, setShowPath] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [currentStudySession, setCurrentStudySession] = useState<StudySession | null>(null);
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en',
    playbackSpeed: 1,
    autoplay: true,
    captions: true,
    videoQuality: 'auto',
    downloadQuality: '720p',
    offlineMode: false,
    reducedMotion: false,
    fontSize: 'medium',
    keyboardShortcuts: true,
    soundEffects: true,
    notificationSound: true
  });
  const [contentProgress, setContentProgress] = useState<Map<string, ContentProgress>>(new Map());
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [selectedNoteColor, setSelectedNoteColor] = useState('#fef3c7');
  const [noteType, setNoteType] = useState<'text' | 'audio' | 'drawing'>('text');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showStudyGroups, setShowStudyGroups] = useState(false);
  const [peerReviews, setPeerReviews] = useState([]);
  const [virtualClassroom, setVirtualClassroom] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoTranscript, setVideoTranscript] = useState('');
  
  // Web search states
  const [webSearchResults, setWebSearchResults] = useState<DeepSearchResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showWebSearch, setShowWebSearch] = useState(true);
  
  const notesRef = useRef<HTMLDivElement>(null);
  const discussionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize study session on mount
  useEffect(() => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      contentCovered: [],
      xpEarned: 0,
      notesCreated: 0
    };
    setCurrentStudySession(session);

    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }

    // Load content progress
    const savedProgress = localStorage.getItem('contentProgress');
    if (savedProgress) {
      setContentProgress(new Map(JSON.parse(savedProgress)));
    }

    // Start auto-save interval
    const autoSaveInterval = setInterval(() => {
      saveProgress();
    }, 30000); // Auto-save every 30 seconds

    return () => {
      clearInterval(autoSaveInterval);
      // Save session data on unmount
      if (session) {
        session.endTime = new Date();
        session.duration = session.endTime.getTime() - session.startTime.getTime();
        saveStudySession(session);
      }
    };
  }, []);

  // Save progress function
  const saveProgress = () => {
    localStorage.setItem('contentProgress', JSON.stringify(Array.from(contentProgress.entries())));
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  };

  // Save study session
  const saveStudySession = (session: StudySession) => {
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    sessions.push(session);
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!userPreferences.keyboardShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Video controls
      if (showVideo && videoRef.current) {
        switch(e.key) {
          case ' ':
            e.preventDefault();
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            videoRef.current.currentTime -= 10;
            break;
          case 'ArrowRight':
            e.preventDefault();
            videoRef.current.currentTime += 10;
            break;
          case 'f':
            e.preventDefault();
            document.fullscreenElement ? document.exitFullscreen() : videoRef.current.requestFullscreen();
            break;
        }
      }

      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
          case 'n':
            e.preventDefault();
            setShowNotes(!showNotes);
            break;
          case 'd':
            e.preventDefault();
            setShowDiscussion(!showDiscussion);
            break;
          case '/':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showVideo, showKeyboardShortcuts, showNotes, showDiscussion, userPreferences.keyboardShortcuts]);

  // Topic mapping function
  const getTopicData = (topicId: string) => {
    const topicMap: { [key: string]: { title: string; description: string } } = {
      // Polity topics
      'constitution': {
        title: 'Constitutional Framework',
        description: 'Master the Indian Constitution through interactive learning'
      },
      'parliament': {
        title: 'Parliament and Legislature',
        description: 'Understand the structure and functioning of Indian Parliament'
      },
      'executive': {
        title: 'Executive Branch',
        description: 'Learn about the President, Prime Minister, and Council of Ministers'
      },
      'judiciary': {
        title: 'Judicial System',
        description: 'Explore the Indian judicial system and its various levels'
      },
      'federalism': {
        title: 'Federalism in India',
        description: 'Study center-state relations and federal structure'
      },
      'local-govt': {
        title: 'Local Governance',
        description: 'Understand Panchayati Raj and Urban Local Bodies'
      },
      'constitutional-bodies': {
        title: 'Constitutional Bodies',
        description: 'Learn about Election Commission, CAG, UPSC, and other bodies'
      },
      'amendments': {
        title: 'Constitutional Amendments',
        description: 'Study important amendments and their implications'
      },
      'emergency': {
        title: 'Emergency Provisions',
        description: 'Understand emergency provisions and their applications'
      },
      'governance': {
        title: 'Governance and Administration',
        description: 'Explore public administration and governance mechanisms'
      },
      
      // Economics topics
      'macro': {
        title: 'Macroeconomics',
        description: 'Study national income, inflation, unemployment, and economic growth'
      },
      'micro': {
        title: 'Microeconomics',
        description: 'Learn market structures, demand-supply, and consumer behavior'
      },
      'monetary-policy': {
        title: 'Monetary Policy',
        description: 'Understand RBI functions, money supply, and interest rates'
      },
      'fiscal-policy': {
        title: 'Fiscal Policy',
        description: 'Explore government budgets, taxation, and public expenditure'
      },
      'international': {
        title: 'International Economics',
        description: 'Study trade, balance of payments, and global economic relations'
      },
      'development': {
        title: 'Development Economics',
        description: 'Learn about economic planning, poverty, and inclusive growth'
      },
      'agriculture': {
        title: 'Agricultural Economics',
        description: 'Understand farming, food security, and rural development'
      },
      'industrial': {
        title: 'Industrial Economics',
        description: 'Explore industrial policy, manufacturing, and infrastructure'
      },
      'public': {
        title: 'Public Economics',
        description: 'Study public goods, welfare economics, and government intervention'
      },
      'financial-markets': {
        title: 'Financial Markets',
        description: 'Learn about stock markets, banking, and financial instruments'
      },
      
      // History topics
      'ancient-india': {
        title: 'Ancient Indian History',
        description: 'Explore Indus Valley, Vedic period, Mauryan and Gupta empires'
      },
      'medieval-india': {
        title: 'Medieval Indian History',
        description: 'Study Delhi Sultanate, Mughal Empire, and regional kingdoms'
      },
      'modern-india': {
        title: 'Modern Indian History',
        description: 'Learn about British rule, freedom struggle, and independence'
      },
      'art-culture': {
        title: 'Art and Culture',
        description: 'Discover Indian art, architecture, literature, and traditions'
      },
      'social-movements': {
        title: 'Social Reform Movements',
        description: 'Study social reformers and movements in Indian history'
      },
      'economic-history': {
        title: 'Economic History',
        description: 'Understand economic changes from ancient to modern India'
      },
      'world-history': {
        title: 'World History',
        description: 'Explore global events, revolutions, and world wars'
      },
      'military-history': {
        title: 'Military History',
        description: 'Study wars, military strategies, and defense evolution'
      },
      'regional-history': {
        title: 'Regional History',
        description: 'Learn about regional kingdoms and local histories'
      },
      'cultural-exchange': {
        title: 'Cultural Exchanges',
        description: 'Explore India\'s cultural interactions with the world'
      },
      
      // Geography topics
      'physical-geography': {
        title: 'Physical Geography',
        description: 'Study landforms, mountains, rivers, and geological features'
      },
      'climate': {
        title: 'Climate and Weather',
        description: 'Understand monsoons, climate zones, and weather patterns'
      },
      'resources': {
        title: 'Natural Resources',
        description: 'Learn about minerals, energy resources, and conservation'
      },
      'agriculture-geo': {
        title: 'Agricultural Geography',
        description: 'Study cropping patterns, irrigation, and agricultural regions'
      },
      'industry': {
        title: 'Industrial Geography',
        description: 'Explore industrial location, regions, and development'
      },
      'population': {
        title: 'Population Geography',
        description: 'Understand demographics, migration, and urbanization'
      },
      'transport': {
        title: 'Transport and Communication',
        description: 'Study transportation networks and communication systems'
      },
      'environmental': {
        title: 'Environmental Geography',
        description: 'Learn about ecosystems, biodiversity, and environmental issues'
      },
      'economic-geo': {
        title: 'Economic Geography',
        description: 'Explore regional development and economic activities'
      },
      'geopolitics': {
        title: 'Geopolitics',
        description: 'Understand international boundaries and strategic importance'
      }
    };
    
    return topicMap[topicId] || {
      title: 'Topic',
      description: 'Learn and master this topic through interactive content'
    };
  };
  
  // Function to get topic-specific subtopics with content
  const getTopicSubtopics = (topicId: string): Subtopic[] => {
    const subtopicsMap: Record<string, Subtopic[]> = {
      // Polity topics
      'constitution': [
        {
          id: 'const-sub-1',
          title: 'Preamble and Basic Structure',
          description: 'Understanding constitutional foundations and basic structure doctrine',
          progress: 75,
          totalXP: 1500,
          earnedXP: 1125,
          completedLessons: 3,
          totalLessons: 4,
          estimatedDuration: '2h 30m',
          learningObjectives: [
            'Understand the significance of the Preamble',
            'Learn about the basic structure doctrine',
            'Analyze constitutional amendments',
            'Explore judicial interpretations'
          ],
          content: [
            {
              id: 'const-content-1',
              title: 'Introduction to Indian Constitution',
              type: 'video' as const,
              duration: '25 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/LYHAy68pQWA',
              thumbnail: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400',
              description: 'Learn the basics of the Indian Constitution',
              completionPercentage: 100,
              transcript: `[00:00] Welcome to this comprehensive introduction to the Indian Constitution.

[00:15] The Constitution of India is the supreme law of India. It lays down the framework that demarcates fundamental political code, structure, procedures, powers, and duties of government institutions.

[00:45] The Preamble serves as an introduction to the Constitution. It declares India to be a Sovereign, Socialist, Secular, Democratic Republic.

[01:15] Key features include:
- Written Constitution
- Lengthiest Constitution in the world
- Blend of rigidity and flexibility
- Federal System with Unitary Bias
- Parliamentary Form of Government

[02:00] The Basic Structure doctrine ensures that certain fundamental features of the Constitution cannot be altered by amendments.

[02:30] Important elements protected under Basic Structure include:
- Supremacy of the Constitution
- Republican and Democratic form of Government
- Secular character of the Constitution
- Federal character of the Constitution
- Separation of powers

[03:00] Understanding these foundational concepts is crucial for comprehending how India's democracy functions.`,
              instructor: {
                id: 'inst-1',
                name: 'Dr. Rajesh Kumar',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                title: 'Constitutional Law Expert',
                rating: 4.8
              }
            },
            {
              id: 'const-content-2',
              title: 'Preamble Deep Dive',
              type: 'document' as const,
              duration: '30 min',
              completed: true,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: 'https://www.constitution.org/cons/india/preamble.pdf',
              description: 'Detailed analysis of the Preamble',
              completionPercentage: 100
            },
            {
              id: 'const-content-3',
              title: 'Basic Structure Doctrine',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Kesavananda Bharati case and implications',
              completionPercentage: 100
            },
            {
              id: 'const-content-4',
              title: 'Preamble Quiz',
              type: 'quiz' as const,
              duration: '15 min',
              completed: false,
              xpReward: 200,
              difficulty: 'medium' as const,
              description: 'Test your understanding',
              quiz: {
                id: 'quiz-1',
                questions: 20,
                passingScore: 70,
                attempts: 2,
                bestScore: 85,
                timeLimit: 900
              }
            }
          ]
        },
        {
          id: 'const-sub-2',
          title: 'Fundamental Rights',
          description: 'Explore the six fundamental rights guaranteed by the Constitution',
          progress: 60,
          totalXP: 2000,
          earnedXP: 1200,
          completedLessons: 3,
          totalLessons: 5,
          estimatedDuration: '3h 15m',
          learningObjectives: [
            'Identify all six fundamental rights',
            'Understand reasonable restrictions',
            'Analyze landmark cases',
            'Learn about writs and remedies'
          ],
          content: [
            {
              id: 'fr-content-1',
              title: 'Introduction to Fundamental Rights',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'Overview of all fundamental rights'
            },
            {
              id: 'fr-content-2',
              title: 'Right to Equality (Articles 14-18)',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Detailed study of equality provisions'
            },
            {
              id: 'fr-content-3',
              title: 'Right to Freedom (Articles 19-22)',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'Understanding freedom and its restrictions'
            },
            {
              id: 'fr-content-4',
              title: 'Case Studies on Fundamental Rights',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Analyze landmark cases',
              assignment: {
                id: 'assign-1',
                dueDate: new Date('2024-02-01'),
                submitted: false
              }
            },
            {
              id: 'fr-content-5',
              title: 'Fundamental Rights Audio Lecture',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              description: 'Expert discussion on rights'
            }
          ]
        },
        {
          id: 'const-sub-3',
          title: 'Directive Principles of State Policy',
          description: 'Understanding DPSPs and their implementation',
          progress: 30,
          totalXP: 1800,
          earnedXP: 540,
          completedLessons: 2,
          totalLessons: 6,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'dpsp-content-1',
              title: 'Introduction to DPSPs',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Overview of directive principles'
            },
            {
              id: 'dpsp-content-2',
              title: 'Classification of DPSPs',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Socialist, Gandhian, and Liberal principles'
            },
            {
              id: 'dpsp-content-3',
              title: 'DPSPs vs Fundamental Rights',
              type: 'video' as const,
              duration: '35 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'Conflicts and resolutions'
            },
            {
              id: 'dpsp-content-4',
              title: 'DPSP Quiz',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'medium' as const,
              description: 'Test your knowledge',
              quiz: {
                id: 'quiz-2',
                questions: 15,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'const-sub-4',
          title: 'Fundamental Duties',
          description: 'Citizens responsibilities under Article 51A',
          progress: 45,
          totalXP: 1200,
          earnedXP: 540,
          estimatedDuration: '1h 30m',
          content: [
            {
              id: 'fd-content-1',
              title: 'Understanding Fundamental Duties',
              type: 'video' as const,
              duration: '25 min',
              completed: true,
              xpReward: 200,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'All 11 fundamental duties explained'
            },
            {
              id: 'fd-content-2',
              title: 'Swaran Singh Committee Report',
              type: 'document' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Historical context and recommendations'
            }
          ]
        },
        {
          id: 'const-sub-5',
          title: 'Amendment Procedure',
          description: 'How the Constitution can be amended',
          progress: 20,
          totalXP: 1500,
          earnedXP: 300,
          estimatedDuration: '2h',
          content: [
            {
              id: 'amend-content-1',
              title: 'Article 368 Explained',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Amendment procedures and types'
            },
            {
              id: 'amend-content-2',
              title: 'Major Constitutional Amendments',
              type: 'document' as const,
              duration: '50 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Study of important amendments'
            }
          ]
        }
      ],
      
      // History topics
      'ancient-india': [
        {
          id: 'ancient-sub-1',
          title: 'Indus Valley Civilization',
          description: 'Explore the Bronze Age civilization of the Indian subcontinent',
          progress: 80,
          totalXP: 1800,
          earnedXP: 1440,
          completedLessons: 4,
          totalLessons: 5,
          estimatedDuration: '3h',
          learningObjectives: [
            'Understand Harappan urban planning',
            'Learn about economic activities',
            'Analyze the decline theories',
            'Study archaeological evidence'
          ],
          content: [
            {
              id: 'ivc-content-1',
              title: 'Discovery and Excavation',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'How Harappa and Mohenjo-daro were discovered'
            },
            {
              id: 'ivc-content-2',
              title: 'Town Planning and Architecture',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Great Bath, granaries, and drainage system'
            },
            {
              id: 'ivc-content-3',
              title: 'Harappan Script and Seals',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 350,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Understanding the undeciphered script'
            },
            {
              id: 'ivc-content-4',
              title: 'Trade and Economy',
              type: 'audio' as const,
              duration: '25 min',
              completed: true,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Maritime trade and craft production'
            },
            {
              id: 'ivc-content-5',
              title: 'IVC Assessment',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              description: 'Test your knowledge of Harappan civilization',
              quiz: {
                id: 'quiz-3',
                questions: 25,
                passingScore: 75,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'ancient-sub-2',
          title: 'Vedic Period',
          description: 'Study the Vedic texts and Aryan society',
          progress: 65,
          totalXP: 2000,
          earnedXP: 1300,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'vedic-content-1',
              title: 'Rigvedic Society',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Early Vedic period and society'
            },
            {
              id: 'vedic-content-2',
              title: 'Later Vedic Period',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Transformation in society and polity'
            },
            {
              id: 'vedic-content-3',
              title: 'Vedic Literature',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Analyze Vedic texts',
              assignment: {
                id: 'assign-2',
                dueDate: new Date('2024-02-10'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'ancient-sub-3',
          title: 'Mauryan Empire',
          description: 'India first major empire under Chandragupta and Ashoka',
          progress: 55,
          totalXP: 2200,
          earnedXP: 1210,
          estimatedDuration: '4h',
          content: [
            {
              id: 'maurya-content-1',
              title: 'Rise of the Mauryas',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Chandragupta Maurya and empire foundation'
            },
            {
              id: 'maurya-content-2',
              title: 'Ashoka the Great',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Dhamma and rock edicts'
            },
            {
              id: 'maurya-content-3',
              title: 'Mauryan Administration',
              type: 'document' as const,
              duration: '40 min',
              completed: false,
              xpReward: 350,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Study Arthashastra and governance'
            }
          ]
        },
        {
          id: 'ancient-sub-4',
          title: 'Gupta Period - Golden Age',
          description: 'Art, science, and literature flourishing',
          progress: 35,
          totalXP: 1600,
          earnedXP: 560,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'gupta-content-1',
              title: 'Gupta Dynasty Overview',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Rise and expansion of Guptas'
            },
            {
              id: 'gupta-content-2',
              title: 'Scientific Achievements',
              type: 'document' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Aryabhata, medicine, and metallurgy'
            }
          ]
        },
        {
          id: 'ancient-sub-5',
          title: 'South Indian Kingdoms',
          description: 'Cholas, Cheras, Pandyas, and Pallavas',
          progress: 25,
          totalXP: 1800,
          earnedXP: 450,
          estimatedDuration: '3h',
          content: [
            {
              id: 'south-content-1',
              title: 'Sangam Age',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Early Tamil kingdoms and literature'
            },
            {
              id: 'south-content-2',
              title: 'Chola Empire',
              type: 'video' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Naval power and temple architecture'
            }
          ]
        }
      ],
      
      // Economics topics
      'macro': [
        {
          id: 'macro-sub-1',
          title: 'National Income and GDP',
          description: 'Understanding economic indicators and measurement',
          progress: 70,
          totalXP: 2000,
          earnedXP: 1400,
          completedLessons: 4,
          totalLessons: 6,
          estimatedDuration: '3h 30m',
          learningObjectives: [
            'Calculate GDP using different methods',
            'Understand GNP, NNP, and other indicators',
            'Analyze real vs nominal GDP',
            'Study GDP limitations'
          ],
          content: [
            {
              id: 'gdp-content-1',
              title: 'Introduction to National Income',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Basic concepts and circular flow',
              transcript: `[00:00] Welcome to our comprehensive guide on National Income and GDP.

[00:20] National Income refers to the total value of goods and services produced by a country during a financial year.

[00:45] GDP or Gross Domestic Product is the total monetary value of all finished goods and services produced within a country's borders in a specific time period.

[01:15] The Circular Flow of Income shows how money moves through an economy:
- Households provide factors of production to firms
- Firms provide goods and services to households
- Money flows in the opposite direction

[02:00] Three methods to calculate GDP:
1. Production Method (Value Added Method)
2. Income Method
3. Expenditure Method

[02:45] GDP = C + I + G + (X-M)
Where:
- C = Consumption
- I = Investment
- G = Government Spending
- X = Exports
- M = Imports

[03:30] Understanding these concepts is fundamental to analyzing economic performance and policy.`,
              instructor: {
                id: 'inst-2',
                name: 'Prof. Anita Sharma',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                title: 'Economics Professor',
                rating: 4.9
              }
            },
            {
              id: 'gdp-content-2',
              title: 'GDP Calculation Methods',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Income, expenditure, and value-added methods'
            },
            {
              id: 'gdp-content-3',
              title: 'Real vs Nominal GDP',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Understanding GDP deflator'
            },
            {
              id: 'gdp-content-4',
              title: 'GDP Practice Problems',
              type: 'assignment' as const,
              duration: '1h 30m',
              completed: true,
              xpReward: 500,
              difficulty: 'hard' as const,
              description: 'Solve numerical problems',
              assignment: {
                id: 'assign-3',
                dueDate: new Date('2024-01-25'),
                submitted: true,
                grade: 85
              }
            },
            {
              id: 'gdp-content-5',
              title: 'Beyond GDP',
              type: 'audio' as const,
              duration: '25 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: '#',
              description: 'HDI, happiness index, and alternatives'
            },
            {
              id: 'gdp-content-6',
              title: 'National Income Quiz',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              description: 'Test your understanding',
              quiz: {
                id: 'quiz-4',
                questions: 30,
                passingScore: 70,
                attempts: 1,
                bestScore: 65
              }
            }
          ]
        },
        {
          id: 'macro-sub-2',
          title: 'Inflation and Price Indices',
          description: 'Understanding price levels and purchasing power',
          progress: 50,
          totalXP: 1800,
          earnedXP: 900,
          estimatedDuration: '3h',
          content: [
            {
              id: 'inflation-content-1',
              title: 'What is Inflation?',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Types and causes of inflation'
            },
            {
              id: 'inflation-content-2',
              title: 'Measuring Inflation - CPI & WPI',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Price indices calculation and usage'
            },
            {
              id: 'inflation-content-3',
              title: 'Inflation Control Measures',
              type: 'video' as const,
              duration: '35 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Monetary and fiscal policies'
            }
          ]
        },
        {
          id: 'macro-sub-3',
          title: 'Monetary Policy',
          description: 'Central banking and money supply management',
          progress: 40,
          totalXP: 2200,
          earnedXP: 880,
          estimatedDuration: '4h',
          content: [
            {
              id: 'monetary-content-1',
              title: 'Role of Central Banks',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'RBI functions and objectives'
            },
            {
              id: 'monetary-content-2',
              title: 'Monetary Policy Tools',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'CRR, SLR, repo rate, and OMOs'
            },
            {
              id: 'monetary-content-3',
              title: 'Money Supply and Multiplier',
              type: 'video' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'M1, M2, M3 and money creation'
            },
            {
              id: 'monetary-content-4',
              title: 'Monetary Policy Simulation',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Policy decision making exercise',
              assignment: {
                id: 'assign-4',
                dueDate: new Date('2024-02-15'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'macro-sub-4',
          title: 'Fiscal Policy',
          description: 'Government spending, taxation, and budget',
          progress: 30,
          totalXP: 1900,
          earnedXP: 570,
          estimatedDuration: '3h 15m',
          content: [
            {
              id: 'fiscal-content-1',
              title: 'Understanding Fiscal Policy',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Budget components and objectives'
            },
            {
              id: 'fiscal-content-2',
              title: 'Types of Taxes',
              type: 'document' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Direct and indirect taxation'
            }
          ]
        },
        {
          id: 'macro-sub-5',
          title: 'Balance of Payments',
          description: 'International trade and forex',
          progress: 15,
          totalXP: 1700,
          earnedXP: 255,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'bop-content-1',
              title: 'BoP Components',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Current and capital account'
            },
            {
              id: 'bop-content-2',
              title: 'Exchange Rate Systems',
              type: 'video' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Fixed vs floating exchange rates'
            }
          ]
        },
        {
          id: 'macro-sub-6',
          title: 'Economic Growth and Development',
          description: 'Long-term economic progress and models',
          progress: 10,
          totalXP: 1600,
          earnedXP: 160,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'growth-content-1',
              title: 'Growth vs Development',
              type: 'video' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Understanding the differences'
            },
            {
              id: 'growth-content-2',
              title: 'Growth Models',
              type: 'document' as const,
              duration: '50 min',
              completed: false,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Solow, Harrod-Domar models'
            }
          ]
        }
      ],
      
      // Geography topics
      'physical': [
        {
          id: 'phys-sub-1',
          title: 'Geomorphology',
          description: 'Study of landforms and processes shaping Earth',
          progress: 60,
          totalXP: 1900,
          earnedXP: 1140,
          estimatedDuration: '3h 20m',
          content: [
            {
              id: 'geo-content-1',
              title: 'Earth Structure and Plate Tectonics',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Interior of Earth and continental drift'
            },
            {
              id: 'geo-content-2',
              title: 'Weathering and Erosion',
              type: 'document' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Physical and chemical weathering processes'
            },
            {
              id: 'geo-content-3',
              title: 'Landform Field Study',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 500,
              difficulty: 'hard' as const,
              description: 'Document local landforms',
              assignment: {
                id: 'assign-5',
                dueDate: new Date('2024-02-20'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'phys-sub-2',
          title: 'Climatology',
          description: 'Weather patterns and climate systems',
          progress: 45,
          totalXP: 2100,
          earnedXP: 945,
          estimatedDuration: '3h 45m',
          content: [
            {
              id: 'climate-content-1',
              title: 'Atmospheric Composition and Structure',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Layers of atmosphere and gases'
            },
            {
              id: 'climate-content-2',
              title: 'Global Wind Systems',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Trade winds, westerlies, and jet streams'
            },
            {
              id: 'climate-content-3',
              title: 'Monsoon Mechanism',
              type: 'document' as const,
              duration: '50 min',
              completed: false,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Indian monsoon system in detail'
            }
          ]
        },
        {
          id: 'phys-sub-3',
          title: 'Oceanography',
          description: 'Ocean currents, tides, and marine resources',
          progress: 35,
          totalXP: 1700,
          earnedXP: 595,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'ocean-content-1',
              title: 'Ocean Currents',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Warm and cold currents worldwide'
            },
            {
              id: 'ocean-content-2',
              title: 'Tides and Waves',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Tidal mechanisms and wave formation'
            }
          ]
        },
        {
          id: 'phys-sub-4',
          title: 'Biogeography',
          description: 'Distribution of plants and animals',
          progress: 25,
          totalXP: 1500,
          earnedXP: 375,
          estimatedDuration: '2h 15m',
          content: [
            {
              id: 'bio-content-1',
              title: 'Biomes of the World',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Major terrestrial and aquatic biomes'
            },
            {
              id: 'bio-content-2',
              title: 'Biodiversity Hotspots',
              type: 'quiz' as const,
              duration: '15 min',
              completed: false,
              xpReward: 200,
              difficulty: 'medium' as const,
              description: 'Test on global biodiversity',
              quiz: {
                id: 'quiz-5',
                questions: 20,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'phys-sub-5',
          title: 'Natural Hazards',
          description: 'Earthquakes, volcanoes, floods, and disasters',
          progress: 20,
          totalXP: 1800,
          earnedXP: 360,
          estimatedDuration: '3h',
          content: [
            {
              id: 'hazard-content-1',
              title: 'Earthquake and Seismic Activity',
              type: 'video' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Causes and measurement of earthquakes'
            },
            {
              id: 'hazard-content-2',
              title: 'Disaster Management',
              type: 'document' as const,
              duration: '40 min',
              completed: false,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Mitigation and preparedness strategies'
            }
          ]
        }
      ],
      
      // Medieval India
      'medieval-india': [
        {
          id: 'med-sub-1',
          title: 'Delhi Sultanate',
          description: 'Turkish, Khilji, Tughlaq, Sayyid, and Lodi dynasties',
          progress: 65,
          totalXP: 2000,
          earnedXP: 1300,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'delhi-content-1',
              title: 'Establishment of Delhi Sultanate',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Muhammad Ghori and Qutb-ud-din Aibak'
            },
            {
              id: 'delhi-content-2',
              title: 'Khilji Dynasty Reforms',
              type: 'document' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Market reforms and military campaigns'
            },
            {
              id: 'delhi-content-3',
              title: 'Tughlaq Experiments',
              type: 'video' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Token currency and capital shifting'
            }
          ]
        },
        {
          id: 'med-sub-2',
          title: 'Mughal Empire',
          description: 'From Babur to Aurangzeb - the golden age',
          progress: 70,
          totalXP: 2500,
          earnedXP: 1750,
          estimatedDuration: '4h',
          content: [
            {
              id: 'mughal-content-1',
              title: 'Babur and the First Battle of Panipat',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Foundation of Mughal rule'
            },
            {
              id: 'mughal-content-2',
              title: 'Akbar the Great',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Religious policy and administration'
            },
            {
              id: 'mughal-content-3',
              title: 'Mughal Art and Architecture',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Study Taj Mahal and Red Fort',
              assignment: {
                id: 'assign-6',
                dueDate: new Date('2024-02-25'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'med-sub-3',
          title: 'Vijayanagar and Bahmani Kingdoms',
          description: 'Southern powers and cultural renaissance',
          progress: 40,
          totalXP: 1600,
          earnedXP: 640,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'vij-content-1',
              title: 'Rise of Vijayanagar',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Harihara and Bukka foundation'
            },
            {
              id: 'vij-content-2',
              title: 'Krishna Deva Raya',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Golden age of Vijayanagar'
            }
          ]
        },
        {
          id: 'med-sub-4',
          title: 'Bhakti and Sufi Movements',
          description: 'Religious and social reform movements',
          progress: 55,
          totalXP: 1400,
          earnedXP: 770,
          estimatedDuration: '2h',
          content: [
            {
              id: 'bhakti-content-1',
              title: 'Bhakti Saints',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Kabir, Nanak, Chaitanya'
            },
            {
              id: 'bhakti-content-2',
              title: 'Sufi Orders in India',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'medium' as const,
              description: 'Test on Chishti and Suhrawardi',
              quiz: {
                id: 'quiz-6',
                questions: 25,
                passingScore: 70,
                attempts: 1,
                bestScore: 60
              }
            }
          ]
        }
      ],
      
      // Modern India
      'modern-india': [
        {
          id: 'mod-sub-1',
          title: 'British Expansion and Consolidation',
          description: 'East India Company to Crown rule',
          progress: 75,
          totalXP: 2200,
          earnedXP: 1650,
          estimatedDuration: '3h 45m',
          content: [
            {
              id: 'brit-content-1',
              title: 'Battle of Plassey and Buxar',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Beginning of British dominance'
            },
            {
              id: 'brit-content-2',
              title: 'Subsidiary Alliance and Doctrine of Lapse',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'British expansion policies'
            },
            {
              id: 'brit-content-3',
              title: '1857 Revolt',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'First War of Independence'
            }
          ]
        },
        {
          id: 'mod-sub-2',
          title: 'Freedom Struggle - Phase I',
          description: 'Early nationalist movement (1885-1919)',
          progress: 60,
          totalXP: 1900,
          earnedXP: 1140,
          estimatedDuration: '3h',
          content: [
            {
              id: 'free1-content-1',
              title: 'Formation of INC',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Early Congress and moderates'
            },
            {
              id: 'free1-content-2',
              title: 'Partition of Bengal',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Swadeshi and Boycott movement'
            },
            {
              id: 'free1-content-3',
              title: 'Home Rule Movement',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              description: 'Tilak and Annie Besant',
              quiz: {
                id: 'quiz-7',
                questions: 20,
                passingScore: 75,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'mod-sub-3',
          title: 'Gandhi Era',
          description: 'Mass movements under Mahatma Gandhi',
          progress: 50,
          totalXP: 2400,
          earnedXP: 1200,
          estimatedDuration: '4h',
          content: [
            {
              id: 'gandhi-content-1',
              title: 'Non-Cooperation Movement',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'First mass movement'
            },
            {
              id: 'gandhi-content-2',
              title: 'Civil Disobedience Movement',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Salt March and beyond'
            },
            {
              id: 'gandhi-content-3',
              title: 'Quit India Movement',
              type: 'assignment' as const,
              duration: '2h 30m',
              completed: false,
              xpReward: 700,
              difficulty: 'hard' as const,
              description: 'Analyze Do or Die call',
              assignment: {
                id: 'assign-7',
                dueDate: new Date('2024-03-01'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'mod-sub-4',
          title: 'Social Reform Movements',
          description: 'Renaissance and reformers',
          progress: 35,
          totalXP: 1500,
          earnedXP: 525,
          estimatedDuration: '2h 15m',
          content: [
            {
              id: 'reform-content-1',
              title: 'Raja Ram Mohan Roy',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Brahmo Samaj and social reforms'
            },
            {
              id: 'reform-content-2',
              title: 'Jyotiba Phule and Periyar',
              type: 'audio' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Anti-caste movements'
            }
          ]
        }
      ],
      
      // World History
      'world-history': [
        {
          id: 'world-sub-1',
          title: 'Renaissance and Reformation',
          description: 'Cultural rebirth and religious changes in Europe',
          progress: 55,
          totalXP: 1700,
          earnedXP: 935,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'ren-content-1',
              title: 'Italian Renaissance',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Art, science, and humanism'
            },
            {
              id: 'ren-content-2',
              title: 'Protestant Reformation',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Martin Luther and religious split'
            },
            {
              id: 'ren-content-3',
              title: 'Scientific Revolution',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'easy' as const,
              description: 'Copernicus to Newton',
              quiz: {
                id: 'quiz-8',
                questions: 15,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'world-sub-2',
          title: 'Age of Revolutions',
          description: 'American, French, and Industrial revolutions',
          progress: 70,
          totalXP: 2300,
          earnedXP: 1610,
          estimatedDuration: '4h',
          content: [
            {
              id: 'rev-content-1',
              title: 'American Revolution',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/xuCn8ux2gbs',
              description: 'Birth of modern democracy'
            },
            {
              id: 'rev-content-2',
              title: 'French Revolution',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/8rTJftKRioc',
              description: 'Liberty, equality, fraternity'
            },
            {
              id: 'rev-content-3',
              title: 'Industrial Revolution',
              type: 'document' as const,
              duration: '55 min',
              completed: false,
              xpReward: 500,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Transformation of production'
            }
          ]
        },
        {
          id: 'world-sub-3',
          title: 'World Wars',
          description: 'Global conflicts and their impact',
          progress: 45,
          totalXP: 2500,
          earnedXP: 1125,
          estimatedDuration: '4h 30m',
          content: [
            {
              id: 'war-content-1',
              title: 'World War I',
              type: 'video' as const,
              duration: '55 min',
              completed: true,
              xpReward: 500,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Great War causes and consequences'
            },
            {
              id: 'war-content-2',
              title: 'Interwar Period',
              type: 'audio' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Rise of fascism and economic crisis'
            },
            {
              id: 'war-content-3',
              title: 'World War II',
              type: 'assignment' as const,
              duration: '3h',
              completed: false,
              xpReward: 800,
              difficulty: 'hard' as const,
              description: 'Analyze global impact',
              assignment: {
                id: 'assign-8',
                dueDate: new Date('2024-03-05'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'world-sub-4',
          title: 'Cold War Era',
          description: 'Bipolar world and decolonization',
          progress: 30,
          totalXP: 1800,
          earnedXP: 540,
          estimatedDuration: '3h',
          content: [
            {
              id: 'cold-content-1',
              title: 'Origins of Cold War',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'USA vs USSR ideological conflict'
            },
            {
              id: 'cold-content-2',
              title: 'Decolonization',
              type: 'document' as const,
              duration: '50 min',
              completed: false,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: '#',
              description: 'End of colonial empires'
            }
          ]
        }
      ],
      
      // Microeconomics
      'micro': [
        {
          id: 'micro-sub-1',
          title: 'Demand and Supply',
          description: 'Market forces and equilibrium',
          progress: 80,
          totalXP: 1800,
          earnedXP: 1440,
          estimatedDuration: '3h',
          content: [
            {
              id: 'demand-content-1',
              title: 'Law of Demand',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Demand curve and determinants'
            },
            {
              id: 'demand-content-2',
              title: 'Supply Analysis',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Supply curve and shifts'
            },
            {
              id: 'demand-content-3',
              title: 'Market Equilibrium',
              type: 'assignment' as const,
              duration: '1h 30m',
              completed: true,
              xpReward: 500,
              difficulty: 'hard' as const,
              description: 'Calculate equilibrium price',
              assignment: {
                id: 'assign-9',
                dueDate: new Date('2024-01-20'),
                submitted: true,
                grade: 90
              }
            },
            {
              id: 'demand-content-4',
              title: 'Elasticity Concepts',
              type: 'quiz' as const,
              duration: '25 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              description: 'Price and income elasticity',
              quiz: {
                id: 'quiz-9',
                questions: 20,
                passingScore: 75,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'micro-sub-2',
          title: 'Consumer Behavior',
          description: 'Utility theory and consumer choice',
          progress: 65,
          totalXP: 1600,
          earnedXP: 1040,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'consumer-content-1',
              title: 'Utility Theory',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Marginal utility and law of DMU'
            },
            {
              id: 'consumer-content-2',
              title: 'Indifference Curves',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Consumer equilibrium analysis'
            },
            {
              id: 'consumer-content-3',
              title: 'Budget Constraints',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Income and substitution effects'
            }
          ]
        },
        {
          id: 'micro-sub-3',
          title: 'Production and Costs',
          description: 'Theory of firm and cost analysis',
          progress: 50,
          totalXP: 2000,
          earnedXP: 1000,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'prod-content-1',
              title: 'Production Function',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Short run and long run production'
            },
            {
              id: 'prod-content-2',
              title: 'Cost Curves',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'TC, AC, MC relationships'
            },
            {
              id: 'prod-content-3',
              title: 'Economies of Scale',
              type: 'video' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'Internal and external economies'
            }
          ]
        },
        {
          id: 'micro-sub-4',
          title: 'Market Structures',
          description: 'Perfect competition to monopoly',
          progress: 40,
          totalXP: 2200,
          earnedXP: 880,
          estimatedDuration: '4h',
          content: [
            {
              id: 'market-content-1',
              title: 'Perfect Competition',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Price taker behavior'
            },
            {
              id: 'market-content-2',
              title: 'Monopoly Power',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Price discrimination and regulation'
            },
            {
              id: 'market-content-3',
              title: 'Oligopoly Models',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Game theory applications',
              assignment: {
                id: 'assign-10',
                dueDate: new Date('2024-03-10'),
                submitted: false
              }
            }
          ]
        }
      ],
      
      // Indian Economy
      'indian-economy': [
        {
          id: 'ind-eco-sub-1',
          title: 'Economic Planning in India',
          description: 'Five Year Plans and NITI Aayog',
          progress: 70,
          totalXP: 1800,
          earnedXP: 1260,
          estimatedDuration: '3h',
          content: [
            {
              id: 'plan-content-1',
              title: 'Evolution of Planning',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'From Planning Commission to NITI Aayog'
            },
            {
              id: 'plan-content-2',
              title: 'Five Year Plans Analysis',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Achievements and failures'
            },
            {
              id: 'plan-content-3',
              title: 'Current Economic Strategy',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Vision 2047 and reforms'
            }
          ]
        },
        {
          id: 'ind-eco-sub-2',
          title: 'Agriculture Sector',
          description: 'Green Revolution to farm reforms',
          progress: 55,
          totalXP: 2000,
          earnedXP: 1100,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'agri-content-1',
              title: 'Green Revolution',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Technology and productivity gains'
            },
            {
              id: 'agri-content-2',
              title: 'MSP and Procurement',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Price support mechanisms'
            },
            {
              id: 'agri-content-3',
              title: 'Recent Farm Laws',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 250,
              difficulty: 'hard' as const,
              description: 'Reforms and controversies',
              quiz: {
                id: 'quiz-10',
                questions: 25,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'ind-eco-sub-3',
          title: 'Industrial Policy',
          description: 'License Raj to Make in India',
          progress: 45,
          totalXP: 1900,
          earnedXP: 855,
          estimatedDuration: '3h 15m',
          content: [
            {
              id: 'industry-content-1',
              title: '1991 Economic Reforms',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'LPG - Liberalization, Privatization, Globalization'
            },
            {
              id: 'industry-content-2',
              title: 'Make in India Initiative',
              type: 'document' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Manufacturing sector promotion'
            },
            {
              id: 'industry-content-3',
              title: 'PLI Schemes',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 550,
              difficulty: 'hard' as const,
              description: 'Analyze sector-specific incentives',
              assignment: {
                id: 'assign-11',
                dueDate: new Date('2024-03-15'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'ind-eco-sub-4',
          title: 'Banking and Finance',
          description: 'Financial inclusion and reforms',
          progress: 60,
          totalXP: 1700,
          earnedXP: 1020,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'bank-content-1',
              title: 'Banking Sector Reforms',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Nationalization to privatization'
            },
            {
              id: 'bank-content-2',
              title: 'Financial Inclusion',
              type: 'document' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Jan Dhan, DBT, and UPI'
            },
            {
              id: 'bank-content-3',
              title: 'NPAs and IBC',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Bad loans and resolution'
            }
          ]
        }
      ],
      
      // Geography - Human Geography topics
      'population': [
        {
          id: 'pop-sub-1',
          title: 'Population Distribution and Density',
          description: 'Global and regional population patterns',
          progress: 65,
          totalXP: 1600,
          earnedXP: 1040,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'pop-dist-content-1',
              title: 'World Population Distribution',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/0kNPiXjlsAE',
              description: 'Factors affecting population spread'
            },
            {
              id: 'pop-dist-content-2',
              title: 'Population Density Patterns',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'High and low density regions'
            },
            {
              id: 'pop-dist-content-3',
              title: 'Population Mapping',
              type: 'assignment' as const,
              duration: '1h 30m',
              completed: false,
              xpReward: 450,
              difficulty: 'hard' as const,
              description: 'Create population density maps',
              assignment: {
                id: 'assign-12',
                dueDate: new Date('2024-03-20'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'pop-sub-2',
          title: 'Demographic Transition',
          description: 'Population growth models and stages',
          progress: 70,
          totalXP: 1800,
          earnedXP: 1260,
          estimatedDuration: '3h',
          content: [
            {
              id: 'demo-content-1',
              title: 'Demographic Transition Model',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/1VYlOKOs3XM',
              description: 'Five stages of population change'
            },
            {
              id: 'demo-content-2',
              title: 'Population Pyramids',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Age-sex structure analysis'
            },
            {
              id: 'demo-content-3',
              title: 'Case Studies',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'easy' as const,
              description: 'Country-specific transitions',
              quiz: {
                id: 'quiz-11',
                questions: 15,
                passingScore: 70,
                attempts: 1,
                bestScore: 65
              }
            }
          ]
        },
        {
          id: 'pop-sub-3',
          title: 'Migration',
          description: 'Types, causes, and impacts of human movement',
          progress: 50,
          totalXP: 2000,
          earnedXP: 1000,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'mig-content-1',
              title: 'Types of Migration',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Internal and international migration'
            },
            {
              id: 'mig-content-2',
              title: 'Push and Pull Factors',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Economic, social, political causes'
            },
            {
              id: 'mig-content-3',
              title: 'Migration Impacts',
              type: 'video' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Effects on origin and destination'
            }
          ]
        },
        {
          id: 'pop-sub-4',
          title: 'Urbanization',
          description: 'Growth of cities and urban challenges',
          progress: 40,
          totalXP: 1900,
          earnedXP: 760,
          estimatedDuration: '3h 15m',
          content: [
            {
              id: 'urban-content-1',
              title: 'Urban Growth Patterns',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Megacities and urban sprawl'
            },
            {
              id: 'urban-content-2',
              title: 'Urban Problems',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Housing, transport, pollution'
            },
            {
              id: 'urban-content-3',
              title: 'Smart Cities',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 500,
              difficulty: 'hard' as const,
              description: 'Sustainable urban planning',
              assignment: {
                id: 'assign-13',
                dueDate: new Date('2024-03-25'),
                submitted: false
              }
            }
          ]
        }
      ],
      
      // Transport and Communication
      'transport': [
        {
          id: 'trans-sub-1',
          title: 'Land Transport Systems',
          description: 'Road and rail networks worldwide',
          progress: 75,
          totalXP: 1800,
          earnedXP: 1350,
          estimatedDuration: '3h',
          content: [
            {
              id: 'land-content-1',
              title: 'Evolution of Transportation',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'From ancient routes to modern highways'
            },
            {
              id: 'land-content-2',
              title: 'Railway Networks',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Trans-continental railways and metros'
            },
            {
              id: 'land-content-3',
              title: 'Highway Systems',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Interstate highways and expressways'
            }
          ]
        },
        {
          id: 'trans-sub-2',
          title: 'Water Transport',
          description: 'Shipping routes and port development',
          progress: 60,
          totalXP: 1600,
          earnedXP: 960,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'water-content-1',
              title: 'International Shipping Routes',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Major sea lanes and canals'
            },
            {
              id: 'water-content-2',
              title: 'Port Infrastructure',
              type: 'document' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: '#',
              description: 'Container terminals and logistics'
            },
            {
              id: 'water-content-3',
              title: 'Inland Waterways',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'easy' as const,
              description: 'Rivers and canal transport',
              quiz: {
                id: 'quiz-12',
                questions: 15,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'trans-sub-3',
          title: 'Air Transport',
          description: 'Aviation industry and airport hubs',
          progress: 55,
          totalXP: 1700,
          earnedXP: 935,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'air-content-1',
              title: 'Global Aviation Network',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Major airlines and routes'
            },
            {
              id: 'air-content-2',
              title: 'Airport Infrastructure',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Hub airports and connectivity'
            },
            {
              id: 'air-content-3',
              title: 'Future of Aviation',
              type: 'assignment' as const,
              duration: '1h 30m',
              completed: false,
              xpReward: 450,
              difficulty: 'hard' as const,
              description: 'Sustainable aviation technologies',
              assignment: {
                id: 'assign-14',
                dueDate: new Date('2024-03-30'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'trans-sub-4',
          title: 'Communication Networks',
          description: 'Internet, telecom, and digital infrastructure',
          progress: 45,
          totalXP: 1500,
          earnedXP: 675,
          estimatedDuration: '2h 15m',
          content: [
            {
              id: 'comm-content-1',
              title: 'Evolution of Communication',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Telegraph to 5G networks'
            },
            {
              id: 'comm-content-2',
              title: 'Internet Infrastructure',
              type: 'audio' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Submarine cables and satellites'
            }
          ]
        }
      ],
      
      // Environmental Geography
      'environmental': [
        {
          id: 'env-sub-1',
          title: 'Climate Change',
          description: 'Global warming and its impacts',
          progress: 70,
          totalXP: 2000,
          earnedXP: 1400,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'climate-change-content-1',
              title: 'Greenhouse Effect and Global Warming',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/3ez10ADR_gM',
              description: 'Causes and evidence of climate change'
            },
            {
              id: 'climate-change-content-2',
              title: 'Climate Change Impacts',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Sea level rise, extreme weather, biodiversity'
            },
            {
              id: 'climate-change-content-3',
              title: 'Mitigation and Adaptation',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 600,
              difficulty: 'hard' as const,
              description: 'Climate action strategies',
              assignment: {
                id: 'assign-15',
                dueDate: new Date('2024-04-05'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'env-sub-2',
          title: 'Ecosystem Conservation',
          description: 'Biodiversity protection and management',
          progress: 55,
          totalXP: 1800,
          earnedXP: 990,
          estimatedDuration: '3h',
          content: [
            {
              id: 'eco-content-1',
              title: 'Biodiversity Hotspots',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/PHe0bXAIuk0',
              description: 'Critical conservation areas'
            },
            {
              id: 'eco-content-2',
              title: 'Protected Areas',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'National parks and reserves'
            },
            {
              id: 'eco-content-3',
              title: 'Conservation Strategies',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              description: 'In-situ and ex-situ conservation',
              quiz: {
                id: 'quiz-13',
                questions: 20,
                passingScore: 75,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'env-sub-3',
          title: 'Pollution and Waste Management',
          description: 'Environmental degradation and solutions',
          progress: 50,
          totalXP: 1700,
          earnedXP: 850,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'pollution-content-1',
              title: 'Types of Pollution',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Air, water, soil, and noise pollution'
            },
            {
              id: 'pollution-content-2',
              title: 'Waste Management Systems',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Reduce, reuse, recycle strategies'
            },
            {
              id: 'pollution-content-3',
              title: 'Circular Economy',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Sustainable production and consumption'
            }
          ]
        },
        {
          id: 'env-sub-4',
          title: 'Sustainable Development',
          description: 'Balancing environment and development',
          progress: 40,
          totalXP: 1900,
          earnedXP: 760,
          estimatedDuration: '3h 15m',
          content: [
            {
              id: 'sustain-content-1',
              title: 'SDGs and Environment',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'UN Sustainable Development Goals'
            },
            {
              id: 'sustain-content-2',
              title: 'Green Technologies',
              type: 'document' as const,
              duration: '45 min',
              completed: false,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Renewable energy and clean tech'
            }
          ]
        }
      ],
      
      // Economic Geography
      'economic-geo': [
        {
          id: 'eco-geo-sub-1',
          title: 'Agricultural Geography',
          description: 'Farming systems and food production',
          progress: 65,
          totalXP: 1800,
          earnedXP: 1170,
          estimatedDuration: '3h',
          content: [
            {
              id: 'agri-geo-content-1',
              title: 'Types of Agriculture',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Subsistence and commercial farming'
            },
            {
              id: 'agri-geo-content-2',
              title: 'Crop Distribution Patterns',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Major crop belts worldwide'
            },
            {
              id: 'agri-geo-content-3',
              title: 'Green Revolution Impact',
              type: 'assignment' as const,
              duration: '1h 30m',
              completed: false,
              xpReward: 500,
              difficulty: 'hard' as const,
              description: 'Analyze agricultural transformation',
              assignment: {
                id: 'assign-16',
                dueDate: new Date('2024-04-10'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'eco-geo-sub-2',
          title: 'Industrial Location',
          description: 'Factors affecting industrial development',
          progress: 70,
          totalXP: 2000,
          earnedXP: 1400,
          estimatedDuration: '3h 30m',
          content: [
            {
              id: 'industry-geo-content-1',
              title: 'Weber Location Theory',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Industrial location principles'
            },
            {
              id: 'industry-geo-content-2',
              title: 'Industrial Regions',
              type: 'document' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Major industrial belts globally'
            },
            {
              id: 'industry-geo-content-3',
              title: 'Special Economic Zones',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'SEZs and industrial policy'
            }
          ]
        },
        {
          id: 'eco-geo-sub-3',
          title: 'Service Sector Geography',
          description: 'Tertiary activities and knowledge economy',
          progress: 50,
          totalXP: 1600,
          earnedXP: 800,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'service-content-1',
              title: 'Tourism Geography',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Tourist destinations and impacts'
            },
            {
              id: 'service-content-2',
              title: 'IT Hubs and Tech Cities',
              type: 'document' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Silicon valleys worldwide'
            },
            {
              id: 'service-content-3',
              title: 'Financial Centers',
              type: 'quiz' as const,
              duration: '15 min',
              completed: false,
              xpReward: 200,
              difficulty: 'easy' as const,
              description: 'Global financial hubs',
              quiz: {
                id: 'quiz-14',
                questions: 15,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'eco-geo-sub-4',
          title: 'Regional Development',
          description: 'Economic disparities and planning',
          progress: 35,
          totalXP: 1700,
          earnedXP: 595,
          estimatedDuration: '2h 45m',
          content: [
            {
              id: 'regional-content-1',
              title: 'Core-Periphery Model',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'Regional inequality theories'
            },
            {
              id: 'regional-content-2',
              title: 'Regional Planning',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Strategies for balanced growth'
            }
          ]
        }
      ],
      
      // Geopolitics
      'geopolitics': [
        {
          id: 'geopol-sub-1',
          title: 'International Boundaries',
          description: 'Borders, disputes, and territorial issues',
          progress: 60,
          totalXP: 1900,
          earnedXP: 1140,
          estimatedDuration: '3h 15m',
          content: [
            {
              id: 'boundary-content-1',
              title: 'Types of Boundaries',
              type: 'video' as const,
              duration: '35 min',
              completed: true,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Natural and artificial boundaries'
            },
            {
              id: 'boundary-content-2',
              title: 'Border Disputes',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'hard' as const,
              url: '#',
              description: 'Major territorial conflicts'
            },
            {
              id: 'boundary-content-3',
              title: 'Maritime Boundaries',
              type: 'video' as const,
              duration: '40 min',
              completed: false,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'UNCLOS and EEZ concepts'
            }
          ]
        },
        {
          id: 'geopol-sub-2',
          title: 'Strategic Resources',
          description: 'Oil, water, and mineral geopolitics',
          progress: 55,
          totalXP: 2100,
          earnedXP: 1155,
          estimatedDuration: '3h 45m',
          content: [
            {
              id: 'resource-content-1',
              title: 'Energy Geopolitics',
              type: 'video' as const,
              duration: '50 min',
              completed: true,
              xpReward: 450,
              difficulty: 'hard' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Oil politics and energy security'
            },
            {
              id: 'resource-content-2',
              title: 'Water Wars',
              type: 'document' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Trans-boundary river disputes'
            },
            {
              id: 'resource-content-3',
              title: 'Critical Minerals',
              type: 'assignment' as const,
              duration: '2h',
              completed: false,
              xpReward: 550,
              difficulty: 'hard' as const,
              description: 'Rare earth elements and tech',
              assignment: {
                id: 'assign-17',
                dueDate: new Date('2024-04-15'),
                submitted: false
              }
            }
          ]
        },
        {
          id: 'geopol-sub-3',
          title: 'Regional Organizations',
          description: 'UN, ASEAN, EU, and other blocs',
          progress: 45,
          totalXP: 1700,
          earnedXP: 765,
          estimatedDuration: '2h 30m',
          content: [
            {
              id: 'org-content-1',
              title: 'United Nations System',
              type: 'video' as const,
              duration: '40 min',
              completed: true,
              xpReward: 350,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'UN structure and peacekeeping'
            },
            {
              id: 'org-content-2',
              title: 'Regional Blocs',
              type: 'document' as const,
              duration: '35 min',
              completed: false,
              xpReward: 300,
              difficulty: 'easy' as const,
              url: '#',
              description: 'EU, ASEAN, SAARC, AU'
            },
            {
              id: 'org-content-3',
              title: 'Trade Organizations',
              type: 'quiz' as const,
              duration: '20 min',
              completed: false,
              xpReward: 200,
              difficulty: 'medium' as const,
              description: 'WTO, RCEP, TPP',
              quiz: {
                id: 'quiz-15',
                questions: 20,
                passingScore: 70,
                attempts: 0
              }
            }
          ]
        },
        {
          id: 'geopol-sub-4',
          title: 'Emerging Powers',
          description: 'BRICS and changing world order',
          progress: 40,
          totalXP: 1800,
          earnedXP: 720,
          estimatedDuration: '3h',
          content: [
            {
              id: 'emerging-content-1',
              title: 'Rise of Asia',
              type: 'video' as const,
              duration: '45 min',
              completed: true,
              xpReward: 400,
              difficulty: 'medium' as const,
              url: 'https://www.youtube.com/embed/i9D50L55UeA',
              description: 'China and India as superpowers'
            },
            {
              id: 'emerging-content-2',
              title: 'BRICS Cooperation',
              type: 'audio' as const,
              duration: '30 min',
              completed: false,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: '#',
              description: 'New Development Bank and currency'
            }
          ]
        }
      ],
      
      // Default/fallback subtopics
      'default': [
        {
          id: 'default-sub-1',
          title: 'Introduction to Topic',
          description: 'Get started with fundamental concepts',
          progress: 50,
          totalXP: 1000,
          earnedXP: 500,
          estimatedDuration: '2h',
          content: [
            {
              id: 'default-content-1',
              title: 'Overview Video',
              type: 'video' as const,
              duration: '30 min',
              completed: true,
              xpReward: 250,
              difficulty: 'easy' as const,
              url: 'https://www.youtube.com/embed/OWTEO5gKVKQ',
              description: 'Introduction to key concepts'
            },
            {
              id: 'default-content-2',
              title: 'Reading Material',
              type: 'document' as const,
              duration: '45 min',
              completed: false,
              xpReward: 300,
              difficulty: 'medium' as const,
              url: '#',
              description: 'Comprehensive study material'
            }
          ]
        }
      ]
    };
    
    return subtopicsMap[topicId] || subtopicsMap['default'];
  };
  
  // Get topic data based on topicId
  const topicInfo = getTopicData(topicId || '');
  
  // Enhanced topic data with real content URLs
  const topic = {
    id: topicId,
    title: topicInfo.title,
    description: topicInfo.description,
    totalXP: 5000,
    earnedXP: 3250,
    level: 12,
    nextLevelXP: 500,
    studyStreak: 15,
    longestStreak: 23,
    completionRate: 65,
    averageQuizScore: 85,
    totalStudyTime: 4320, // minutes
    subtopics: getTopicSubtopics(topicId || '')
  };

  // Sample achievements data
  const sampleAchievements: Achievement[] = [
    {
      id: 'ach-1',
      title: 'Quick Learner',
      description: 'Complete 5 lessons in one day',
      icon: 'lightning',
      unlocked: true,
      unlockedAt: new Date('2024-01-14'),
      progress: 5,
      maxProgress: 5,
      category: 'completion',
      rarity: 'common',
      xpReward: 100
    },
    {
      id: 'ach-2',
      title: 'Constitution Master',
      description: 'Complete all Constitution modules',
      icon: 'crown',
      unlocked: false,
      progress: 2,
      maxProgress: 3,
      category: 'course',
      rarity: 'epic',
      xpReward: 500
    },
    {
      id: 'ach-3',
      title: 'Study Streak Champion',
      description: 'Maintain a 30-day study streak',
      icon: 'fire',
      unlocked: false,
      progress: 15,
      maxProgress: 30,
      category: 'streak',
      rarity: 'rare',
      xpReward: 300
    }
  ];

  // Sample badges data
  const sampleBadges: Badge[] = [
    {
      id: 'badge-1',
      name: 'Constitution Scholar',
      description: 'Earned for mastering constitutional law',
      imageUrl: 'https://example.com/badge1.png',
      earned: true,
      earnedDate: new Date('2024-01-10'),
      requirements: ['Complete all constitution modules', 'Score 90%+ in final quiz'],
      category: 'Academic',
      level: 3
    }
  ];

  // Sample learning path
  const sampleLearningPath: LearningPath = {
    id: 'path-1',
    title: 'Constitutional Law Mastery',
    description: 'Complete path to understanding Indian Constitutional Law',
    modules: [
      {
        id: 'mod-1',
        title: 'Constitutional Framework',
        order: 1,
        lessons: 12,
        completedLessons: 8,
        duration: '6h',
        locked: false,
        current: true
      },
      {
        id: 'mod-2',
        title: 'Fundamental Rights & Duties',
        order: 2,
        lessons: 10,
        completedLessons: 0,
        duration: '5h',
        locked: false
      },
      {
        id: 'mod-3',
        title: 'Constitutional Bodies',
        order: 3,
        lessons: 8,
        completedLessons: 0,
        duration: '4h',
        locked: true
      }
    ],
    currentModule: 'mod-1',
    currentLesson: 'content-4',
    progress: 45,
    estimatedTime: '15h',
    completedTime: '6h 45m',
    startedAt: new Date('2024-01-01'),
    targetCompletion: new Date('2024-02-15'),
    milestones: [
      {
        id: 'mile-1',
        title: 'Foundation Complete',
        description: 'Finish all basic modules',
        completed: true,
        completedAt: new Date('2024-01-10'),
        xpReward: 1000
      },
      {
        id: 'mile-2',
        title: 'Rights Expert',
        description: 'Master fundamental rights',
        completed: false,
        xpReward: 1500
      }
    ],
    difficulty: 'intermediate',
    tags: ['law', 'constitution', 'upsc']
  };

  // Initialize data on mount
  useEffect(() => {
    setAchievements(sampleAchievements);
    setBadges(sampleBadges);
    setLearningPath(sampleLearningPath);
    
    // Load recommendations
    loadRecommendations();
  }, []);

  // Load AI recommendations
  const loadRecommendations = () => {
    const recs: Recommendation[] = [
      {
        id: 'rec-1',
        type: 'content',
        title: 'Constitutional Amendments',
        description: 'Based on your progress, we recommend studying amendments next',
        reason: 'You completed Preamble analysis',
        thumbnail: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=200',
        contentId: 'content-9',
        priority: 'high',
        estimatedTime: '45 min',
        difficulty: 'medium',
        matchScore: 92
      },
      {
        id: 'rec-2',
        type: 'practice',
        title: 'Quick Quiz: Fundamental Rights',
        description: 'Test your understanding with this practice quiz',
        reason: 'Reinforce recent learning',
        priority: 'medium',
        estimatedTime: '15 min',
        matchScore: 85
      }
    ];
    setRecommendations(recs);
  };

  // Load web search results when active subtopic changes
  useEffect(() => {
    const loadWebSearchResults = async () => {
      const activeSubtopicData = topic.subtopics.find(sub => sub.id === activeSubtopic);
      if (!activeSubtopicData) return;

      // Reset previous results
      setWebSearchResults(null);
      setIsSearchLoading(true);
      setSearchError(null);

      try {
        // Get the topic name and subject
        const topicName = activeSubtopicData.title;
        const subject = topic.title; // e.g., "Constitutional Framework"
        
        console.log('Performing web search for:', topicName, 'in', subject);
        const results = await performDeepSearch(topicName, subject);
        setWebSearchResults(results);
      } catch (error) {
        console.error('Failed to load web search results:', error);
        setSearchError('Failed to load related content. Please try again later.');
      } finally {
        setIsSearchLoading(false);
      }
    };

    // Only load if showWebSearch is true
    if (showWebSearch) {
      loadWebSearchResults();
    }
  }, [activeSubtopic, showWebSearch]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'quiz': return Brain;
      case 'audio': return Headphones;
      case 'assignment': return ClipboardEdit;
      case 'interactive': return Sparkles;
      case 'live': return Radio;
      case 'workshop': return Users;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleContentClick = (content: SubtopicContent) => {
    console.log('Content clicked:', content);
    console.log('Content URL:', content.url);
    console.log('Content type:', content.type);
    
    // Update progress tracking
    updateContentProgress(content.id, 'started');
    
    // Add to study session
    if (currentStudySession && !currentStudySession.contentCovered.includes(content.id)) {
      currentStudySession.contentCovered.push(content.id);
    }

    switch (content.type) {
      case 'video':
        if (content.url) {
          // Navigate to dedicated video learning page with content data
          navigate('/video-learning', { state: { content } });
        } else {
          alert('Video content is not available yet.');
        }
        break;
      case 'audio':
        if (content.url) {
          // Navigate to dedicated audio learning page with content data
          navigate('/audio-learning', { state: { content } });
        } else {
          alert('Audio content is not available yet.');
        }
        break;
      case 'document':
        if (content.url) {
          // Navigate to dedicated document learning page with content data
          navigate('/document-learning', { state: { content } });
        } else {
          alert('Document content is not available yet.');
        }
        break;
      case 'quiz':
        // For now, just show an alert until quiz page is implemented
        alert('Quiz feature is coming soon!');
        break;
      case 'assignment':
        alert('Assignment feature is coming soon!');
        break;
      case 'interactive':
        alert('Interactive content is coming soon!');
        break;
      case 'live':
        alert('Live sessions feature is coming soon!');
        break;
      case 'workshop':
        alert('Workshop feature is coming soon!');
        break;
    }
  };

  // Update content progress
  const updateContentProgress = (contentId: string, status: 'started' | 'completed', progress?: number) => {
    const existing = contentProgress.get(contentId) || {
      contentId,
      progress: 0,
      completed: false,
      timeSpent: 0,
      notes: 0,
      bookmarked: false
    };

    const updated: ContentProgress = {
      ...existing,
      progress: progress || (status === 'completed' ? 100 : existing.progress),
      completed: status === 'completed',
      completedAt: status === 'completed' ? new Date() : existing.completedAt
    };

    const newProgress = new Map(contentProgress);
    newProgress.set(contentId, updated);
    setContentProgress(newProgress);

    // Check for achievements
    checkAchievements(status, contentId);
  };

  // Check and unlock achievements
  const checkAchievements = (action: string, contentId?: string) => {
    const updatedAchievements = [...achievements];
    
    // Quick Learner achievement
    const todayCompleted = Array.from(contentProgress.values())
      .filter(p => p.completedAt && 
        new Date(p.completedAt).toDateString() === new Date().toDateString()
      ).length;
    
    if (todayCompleted >= 5) {
      const quickLearner = updatedAchievements.find(a => a.id === 'ach-1');
      if (quickLearner && !quickLearner.unlocked) {
        quickLearner.unlocked = true;
        quickLearner.unlockedAt = new Date();
        showAchievementNotification(quickLearner);
      }
    }

    setAchievements(updatedAchievements);
  };

  // Show achievement notification
  const showAchievementNotification = (achievement: Achievement) => {
    // This would show a toast notification
    console.log('Achievement Unlocked:', achievement.title);
  };

  // Add note with timestamp
  const addNote = (content: string, timestamp?: number) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      content,
      timestamp: timestamp || currentVideoTime,
      contentId: selectedContent?.id || selectedVideoContent?.id || '',
      contentTitle: selectedContent?.title || selectedVideoContent?.title || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      color: selectedNoteColor,
      type: noteType
    };

    setNotes([...notes, note]);
    if (currentStudySession) {
      currentStudySession.notesCreated++;
    }
  };

  // Get filtered and sorted content
  const getFilteredContent = (content: SubtopicContent[]) => {
    let filtered = content;

    // Apply content type filter
    if (contentFilter !== 'all') {
      filtered = filtered.filter(c => c.type === contentFilter);
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(c => c.difficulty === difficultyFilter);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort content
    switch (sortBy) {
      case 'duration':
        return filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration) || 0;
          const bDuration = parseInt(b.duration) || 0;
          return aDuration - bDuration;
        });
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return filtered.sort((a, b) => 
          (difficultyOrder[a.difficulty || 'medium'] || 2) - 
          (difficultyOrder[b.difficulty || 'medium'] || 2)
        );
      case 'xp':
        return filtered.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
      default:
        return filtered;
    }
  };

  const activeSubtopicData = topic.subtopics.find(s => s.id === activeSubtopic);

  return (
    <>
      <DashboardLayout>
        <div className="flex flex-col h-full">
        {/* Enhanced Header with Modern LMS Features */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 -mx-8 -mt-8 mb-6">
          <div className="px-8 py-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all lg:hidden"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                {/* Breadcrumb Navigation */}
                <nav className="hidden sm:flex items-center gap-2 text-sm">
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    <Home className="w-4 h-4" />
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <Link to="/syllabus" className="text-gray-600 hover:text-gray-900">
                    Syllabus
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 font-medium truncate">
                    {topic.title}
                  </span>
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Offline Mode Indicator */}
                {offlineMode && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-lg">
                    <WifiOff className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Offline Mode</span>
                  </div>
                )}

                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                </select>


                {/* Focus Mode */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFocusMode(!focusMode)}
                  className={`p-2 rounded-lg transition-all ${
                    focusMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                </motion.button>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </motion.button>

                {/* Settings */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Course Info and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {topic.title}
                  </h1>
                  <p className="text-gray-600">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Enhanced Stats Display */}
              <div className="flex items-center gap-4">
                {/* Study Streak with Animation */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
                >
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-orange-600">{topic.studyStreak}</span>
                  <span className="text-sm text-orange-600">day streak</span>
                </motion.div>

                {/* XP Progress with Level */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="relative">
                    <Trophy className="w-8 h-8 text-purple-600" />
                    <span className="absolute -bottom-1 -right-1 bg-purple-600 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {topic.level}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-900">
                      Level {topic.level} Scholar
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(topic.earnedXP % 500) / 5}%` }}
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {topic.earnedXP % 500}/500 XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPath(!showPath)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all group"
                    title="Learning Path"
                  >
                    <Route className="w-5 h-5 text-gray-600 group-hover:text-brand-primary" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all group"
                    title="Analytics"
                  >
                    <BarChart3 className="w-5 h-5 text-gray-600 group-hover:text-brand-primary" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAchievements(!showAchievements)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all group"
                    title="Achievements"
                  >
                    <Award className="w-5 h-5 text-gray-600 group-hover:text-brand-primary" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className={`p-2 rounded-lg transition-all ${
                      showAIAssistant ? 'bg-brand-primary text-gray-900' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Section */}
            <div className="mt-4 space-y-3">
              {/* Overall Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-primary">
                      {Math.round((topic.earnedXP / topic.totalXP) * 100)}%
                    </span>
                    <span className="text-xs text-gray-600 text-gray-600">
                      ({topic.earnedXP}/{topic.totalXP} XP)
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(topic.earnedXP / topic.totalXP) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </motion.div>
                </div>
              </div>

              {/* Learning Velocity */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Learning Velocity</span>
                </div>
                <span className="font-medium text-green-600">+15% this week</span>
              </div>

              {/* Time Spent */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Total Study Time</span>
                </div>
                <span className="font-medium text-gray-900">
                  {Math.floor(topic.totalStudyTime / 60)}h {topic.totalStudyTime % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0">
          {/* Enhanced Left Sidebar - Module Navigation */}
          <motion.div
            initial={{ width: sidebarCollapsed ? 80 : 320 }}
            animate={{ width: sidebarCollapsed ? 80 : 320 }}
            transition={{ duration: 0.3 }}
            className="border-r border-gray-200 bg-white/50 flex flex-col flex-shrink-0 h-full hidden lg:flex"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold text-lg text-gray-900 ${sidebarCollapsed ? 'hidden' : ''}`}>
                  Course Modules
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
              </div>

              {/* Module Progress Overview */}
              {!sidebarCollapsed && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Module Progress</span>
                    <span className="font-medium text-brand-primary">
                      {Math.round(topic.subtopics.reduce((acc, s) => acc + s.progress, 0) / topic.subtopics.length)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                      style={{ 
                        width: `${topic.subtopics.reduce((acc, s) => acc + s.progress, 0) / topic.subtopics.length}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtopics List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {topic.subtopics.map((subtopic, index) => (
                  <motion.div
                    key={subtopic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveSubtopic(subtopic.id)}
                    className={`cursor-pointer rounded-lg transition-all ${
                      activeSubtopic === subtopic.id
                        ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border-l-4 border-brand-primary'
                        : 'hover:bg-gray-200'
                    } ${sidebarCollapsed ? 'p-2' : 'p-4'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex-1 ${sidebarCollapsed ? 'hidden' : ''}`}>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {subtopic.title}
                          </h3>
                          {subtopic.locked && (
                            <Lock className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {subtopic.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                            <Layers className="w-3 h-3" />
                            <span>{subtopic.completedLessons || 0}/{subtopic.totalLessons || subtopic.content.length}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{subtopic.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Zap className="w-3 h-3" />
                            <span>{subtopic.earnedXP}/{subtopic.totalXP}</span>
                          </div>
                        </div>
                      </div>
                      
                      {sidebarCollapsed ? (
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activeSubtopic === subtopic.id
                              ? 'bg-brand-primary text-gray-900'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            <span className="font-bold text-sm">{index + 1}</span>
                          </div>
                          {subtopic.progress > 0 && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-gray-900" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform ${
                            activeSubtopic === subtopic.id ? 'rotate-90' : ''
                          }`} />
                          {subtopic.progress === 100 && (
                            <BadgeCheck className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    {!sidebarCollapsed && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subtopic.progress}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Learning Path Quick Access */}
            {!sidebarCollapsed && learningPath && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPath(true)}
                  className="w-full p-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-gray-900 rounded-lg hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <span className="font-medium">View Learning Path</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {showMobileSidebar && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileSidebar(false)}
                  className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-xl"
                >
                  {/* Mobile Sidebar Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-gray-900">Course Modules</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 hover:bg-gray-200 hover:bg-gray-200 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  </div>
                  
                  {/* Mobile Subtopics List */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {topic.subtopics.map((subtopic, index) => (
                        <motion.div
                          key={subtopic.id}
                          onClick={() => {
                            setActiveSubtopic(subtopic.id);
                            setShowMobileSidebar(false);
                          }}
                          className={`cursor-pointer rounded-lg transition-all p-4 ${
                            activeSubtopic === subtopic.id
                              ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border-l-4 border-brand-primary'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900">
                            {subtopic.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subtopic.description}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                              style={{ width: `${subtopic.progress}%` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Enhanced Center Content Area */}
          <div className="flex-1 overflow-y-auto bg-white min-w-0">
            <div className="p-4 sm:p-6">
              {/* Enhanced Content Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {activeSubtopicData?.title || 'Learning Materials'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {activeSubtopicData?.description}
                    </p>
                  </div>
                  
                  {/* View Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white bg-gray-200 shadow-sm'
                            : 'hover:bg-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Grid className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-all ${
                          viewMode === 'list'
                            ? 'bg-white bg-gray-200 shadow-sm'
                            : 'hover:bg-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <List className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex items-center gap-4">
                  {/* Enhanced Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      showFilters
                        ? 'bg-brand-primary text-gray-900'
                        : 'bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {(contentFilter !== 'all' || difficultyFilter !== 'all') && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded-full text-xs">
                        2
                      </span>
                    )}
                  </motion.button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="default">Default Order</option>
                    <option value="duration">Duration</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="xp">XP Reward</option>
                  </select>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {/* Content Type Filter */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 text-gray-600 mb-2 block">
                            Content Type
                          </label>
                          <select
                            value={contentFilter}
                            onChange={(e) => setContentFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-600 rounded-lg text-sm"
                          >
                            <option value="all">All Types</option>
                            <option value="video">Videos</option>
                            <option value="document">Documents</option>
                            <option value="audio">Audio</option>
                            <option value="quiz">Quizzes</option>
                            <option value="assignment">Assignments</option>
                            <option value="interactive">Interactive</option>
                          </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 text-gray-600 mb-2 block">
                            Difficulty
                          </label>
                          <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-600 rounded-lg text-sm"
                          >
                            <option value="all">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Recommendations Section */}
              {showRecommendations && recommendations.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Recommendations
                    </h3>
                    <button
                      onClick={() => setShowRecommendations(false)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 2).map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-700 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-800/50 rounded-lg">
                            <Lightning className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-purple-600">{rec.reason}</span>
                              <span className="text-xs text-gray-600">{rec.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Web Search Section */}
              {showWebSearch && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        Web Resources
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        AI-curated resources from across the web to enhance your learning
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWebSearch(false)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Hide
                    </button>
                  </div>
                  
                  {isSearchLoading ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Searching for related content across the web...</p>
                    </div>
                  ) : searchError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                      {searchError}
                    </div>
                  ) : webSearchResults ? (
                    <DeepSearchResults searchResults={webSearchResults} />
                  ) : null}
                </div>
              )}

              {/* Enhanced Content Grid/List */}
              {activeSubtopicData && (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
                  {getFilteredContent(activeSubtopicData.content).map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01 }}
                      onClick={() => handleContentClick(content)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden group"
                    >
                      {/* Progress Indicator */}
                      {content.completionPercentage !== undefined && content.completionPercentage > 0 && (
                        <div className="h-1 bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all"
                            style={{ width: `${content.completionPercentage}%` }}
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className={`flex ${viewMode === 'list' ? 'items-center' : 'flex-col'} gap-4`}>
                          {/* Content Header */}
                          <div className="flex items-start gap-4 flex-1">
                            {/* Icon with Status */}
                            <div className="relative">
                              <div className={`p-3 rounded-lg transition-colors ${
                                content.completed 
                                  ? 'bg-green-900/20' 
                                  : content.completionPercentage && content.completionPercentage > 0
                                  ? 'bg-yellow-900/20'
                                  : 'bg-brand-primary/20'
                              }`}>
                                {content.completed ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : content.completionPercentage && content.completionPercentage > 0 ? (
                                  <div className="relative">
                                    {React.createElement(getContentIcon(content.type), { 
                                      className: 'w-6 h-6 text-yellow-600'
                                    })}
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                      {Math.round(content.completionPercentage)}%
                                    </div>
                                  </div>
                                ) : (
                                  React.createElement(getContentIcon(content.type), { 
                                    className: 'w-6 h-6 text-brand-primary text-brand-secondary'
                                  })
                                )}
                              </div>
                              
                              {/* Offline Indicator */}
                              {content.offlineAvailable && (
                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                  <CloudOff className="w-3 h-3 text-gray-900" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                                    {content.title}
                                  </h3>
                                  
                                  {content.description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {content.description}
                                    </p>
                                  )}

                                  {/* Instructor Info */}
                                  {content.instructor && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <img 
                                        src={content.instructor.avatar} 
                                        alt={content.instructor.name}
                                        className="w-6 h-6 rounded-full"
                                      />
                                      <span className="text-xs text-gray-600">
                                        {content.instructor.name}
                                      </span>
                                      {content.instructor.rating && (
                                        <div className="flex items-center gap-1">
                                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                          <span className="text-xs text-gray-600">{content.instructor.rating}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 ml-4">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isBookmarked = bookmarks.includes(content.id);
                                      setBookmarks(prev => 
                                        isBookmarked
                                          ? prev.filter(id => id !== content.id)
                                          : [...prev, content.id]
                                      );
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                  >
                                    {bookmarks.includes(content.id) ? (
                                      <Bookmark className="w-4 h-4 text-brand-primary fill-current" />
                                    ) : (
                                      <Bookmark className="w-4 h-4 text-gray-600" />
                                    )}
                                  </motion.button>

                                  {content.downloadable && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle download
                                      }}
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                    >
                                      <Download className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>

                              {/* Content Stats */}
                              <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  {content.duration}
                                </div>
                                
                                {content.xpReward && (
                                  <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                                    <Zap className="w-3 h-3" />
                                    {content.xpReward} XP
                                  </div>
                                )}
                                
                                {content.difficulty && (
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    getDifficultyColor(content.difficulty)
                                  }`}>
                                    {content.difficulty}
                                  </span>
                                )}

                                {content.views !== undefined && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                                    <Eye className="w-3 h-3" />
                                    {content.views.toLocaleString()} views
                                  </div>
                                )}

                                {content.rating !== undefined && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    {content.rating}
                                  </div>
                                )}

                                {content.discussions !== undefined && content.discussions > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-600 text-gray-600">
                                    <MessageSquare className="w-3 h-3" />
                                    {content.discussions}
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              {content.tags && content.tags.length > 0 && (
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                  {content.tags.slice(0, 3).map(tag => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-gray-100 bg-gray-200 text-xs text-gray-600 rounded-full"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {content.tags.length > 3 && (
                                    <span className="text-xs text-gray-600">+{content.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions (for list view) */}
                          {viewMode === 'list' && (
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-brand-primary text-gray-900 rounded-lg hover:bg-brand-primary/90 transition-all flex items-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                <span className="text-sm font-medium">Start</span>
                              </motion.button>
                            </div>
                          )}
                        </div>

                        {/* Resources Section (if available) */}
                        {content.resources && content.resources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Paperclip className="w-3 h-3" />
                              <span>{content.resources.length} resources</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {activeSubtopicData && getFilteredContent(activeSubtopicData.content).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No content found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Right Sidebar - Notes, Discussion, Resources */}
          {(showNotes || showDiscussion || showResources) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 bg-white flex-shrink-0 h-full hidden xl:flex"
            >
              <div className="h-full flex flex-col">
                {/* Sidebar Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => {
                      setShowNotes(true);
                      setShowDiscussion(false);
                      setShowResources(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      showNotes
                        ? 'text-brand-primary border-b-2 border-brand-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PenTool className="w-4 h-4" />
                      Notes
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowNotes(false);
                      setShowDiscussion(true);
                      setShowResources(false);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      showDiscussion
                        ? 'text-brand-primary border-b-2 border-brand-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Discussion
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowNotes(false);
                      setShowDiscussion(false);
                      setShowResources(true);
                    }}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      showResources
                        ? 'text-brand-primary border-b-2 border-brand-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Resources
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowNotes(false);
                      setShowDiscussion(false);
                      setShowResources(false);
                    }}
                    className="p-3 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Notes Panel */}
                {showNotes && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Note Type Selector */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNoteType('text')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            noteType === 'text'
                              ? 'bg-brand-primary text-gray-900'
                              : 'bg-gray-100 bg-gray-200 text-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />
                            Text
                          </div>
                        </button>
                        <button
                          onClick={() => setNoteType('audio')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            noteType === 'audio'
                              ? 'bg-brand-primary text-gray-900'
                              : 'bg-gray-100 bg-gray-200 text-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            Audio
                          </div>
                        </button>
                        <button
                          onClick={() => setNoteType('drawing')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            noteType === 'drawing'
                              ? 'bg-brand-primary text-gray-900'
                              : 'bg-gray-100 bg-gray-200 text-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <PenLine className="w-3 h-3" />
                            Draw
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Notes List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={notesRef}>
                      {notes.length === 0 ? (
                        <div className="text-center py-8">
                          <PenTool className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-600 text-gray-600">No notes yet</p>
                          <p className="text-sm text-gray-600 text-gray-600 mt-2">
                            Start taking notes to remember key concepts
                          </p>
                        </div>
                      ) : (
                        notes.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                            style={{ backgroundColor: note.color + '20' }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                  {note.content}
                                </p>
                                {note.timestamp !== undefined && (
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                    <Clock className="w-3 h-3" />
                                    <span>at {Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toString().padStart(2, '0')}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-600">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </span>
                                  {note.contentTitle && (
                                    <span className="text-xs text-gray-600 bg-gray-100 bg-gray-200 px-2 py-1 rounded-full">
                                      {note.contentTitle}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button className="p-1 hover:bg-gray-200 rounded">
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Note Input */}
                    <div className="p-4 border-t border-gray-200">
                      {noteType === 'text' ? (
                        <div className="space-y-3">
                          <textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Type your note here..."
                            className="w-full p-3 bg-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Color Picker */}
                              <div className="flex items-center gap-1">
                                {['#fef3c7', '#ddd6fe', '#bfdbfe', '#bbf7d0', '#fecaca'].map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setSelectedNoteColor(color)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                      selectedNoteColor === color
                                        ? 'border-gray-600 scale-110'
                                        : 'border-transparent'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (currentNote.trim()) {
                                  addNote(currentNote.trim());
                                  setCurrentNote('');
                                }
                              }}
                              disabled={!currentNote.trim()}
                              className="px-4 py-2 bg-brand-primary text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add Note
                            </motion.button>
                          </div>
                        </div>
                      ) : noteType === 'audio' ? (
                        <div className="text-center py-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsRecording(!isRecording)}
                            className={`p-4 rounded-full transition-all ${
                              isRecording
                                ? 'bg-red-500 text-gray-900 animate-pulse'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isRecording ? (
                              <StopCircle className="w-6 h-6" />
                            ) : (
                              <Mic className="w-6 h-6" />
                            )}
                          </motion.button>
                          <p className="text-sm text-gray-600 mt-2">
                            {isRecording ? 'Recording...' : 'Tap to record audio note'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <canvas
                            ref={canvasRef}
                            className="w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            Drawing feature coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Discussion Panel */}
                {showDiscussion && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={discussionRef}>
                      {discussions.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-600 text-gray-600">No discussions yet</p>
                          <p className="text-sm text-gray-600 text-gray-600 mt-2">
                            Be the first to start a discussion
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Discussion items would go here */}
                        </div>
                      )}
                    </div>

                    {/* Discussion Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-end gap-2">
                        <textarea
                          value={newDiscussion}
                          onChange={(e) => setNewDiscussion(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="flex-1 p-3 bg-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none"
                          rows={2}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={!newDiscussion.trim()}
                          className="p-3 bg-brand-primary text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resources Panel */}
                {showResources && activeSubtopicData && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                      {activeSubtopicData.content
                        .filter(c => c.resources && c.resources.length > 0)
                        .map(content => (
                          <div key={content.id} className="space-y-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {content.title}
                            </h4>
                            <div className="space-y-2">
                              {content.resources?.map(resource => (
                                <div
                                  key={resource.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg">
                                      {resource.type === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                                      {resource.type === 'doc' && <FileText className="w-4 h-4 text-blue-500" />}
                                      {resource.type === 'ppt' && <FileText className="w-4 h-4 text-orange-500" />}
                                      {resource.type === 'link' && <Link className="w-4 h-4 text-purple-500" />}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {resource.title}
                                      </p>
                                      {resource.size && (
                                        <p className="text-xs text-gray-600 text-gray-600">
                                          {resource.size}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Download className="w-4 h-4 text-gray-600" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* AI Learning Assistant (Floating) */}
        <AnimatePresence>
          {showAIAssistant && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200"
            >
              <div className="bg-indigo-600 p-4 text-gray-900">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Learning Assistant
                  </h3>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 h-80 overflow-y-auto bg-white">
                <div className="text-center py-8 text-gray-600">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-sm">
                    AI Assistant is ready to help you learn!
                  </p>
                  <p className="text-xs mt-2">
                    Ask questions about the content you're studying.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-indigo-600 text-gray-900 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
}