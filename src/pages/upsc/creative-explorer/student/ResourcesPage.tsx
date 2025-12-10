import { useState, useEffect, useRef, useCallback } from 'react';
import { PDFViewer } from '../../../../components/upsc/common/PDFViewer';
import { VideoPlayer } from '../../../../components/upsc/common/VideoPlayer';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  BookOpen,
  Headphones,
  Video,
  FileText,
  Download,
  Search,
  Filter,
  ShoppingCart,
  Star,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Lock,
  ChevronRight,
  Clock,
  BarChart2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Sparkles,
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Grid,
  List,
  SlidersHorizontal,
  Zap,
  Trophy,
  Target,
  Brain,
  Lightbulb,
  FolderPlus,
  History,
  Wifi,
  WifiOff,
  ChevronDown,
  X,
  Plus,
  CheckCircle,
  Eye,
  MoreVertical,
  Tag,
  Calendar,
  Award,
  BarChart3,
  Activity,
  Flame
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'audio' | 'video' | 'notes';
  subject: string;
  description: string;
  author: string;
  duration?: string;
  size?: string;
  thumbnail?: string;
  price?: number;
  rating: number;
  reviews: number;
  isPremium: boolean;
  isOwned: boolean;
  image: string;
  pdfUrl?: string;
  videoUrl?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  completionRate?: number;
  lastAccessed?: Date;
  bookmarked?: boolean;
  downloadProgress?: number;
  isDownloaded?: boolean;
  views?: number;
  likes?: number;
  discussions?: number;
  updatedAt?: Date;
  language?: string;
  subtitles?: string[];
  relatedResources?: string[];
  learningObjectives?: string[];
  estimatedTime?: string;
  certificates?: boolean;
  aiRecommended?: boolean;
  trendingScore?: number;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
  color?: string;
  trending?: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  resourceIds: string[];
  isPublic: boolean;
  createdAt: Date;
  thumbnail?: string;
}

interface LearningPath {
  id: string;
  title: string;
  progress: number;
  nextResource?: Resource;
  totalResources: number;
  completedResources: number;
  estimatedHours: number;
}

interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date;
  todayCompleted: boolean;
}

// Futuristic Card Component with Mouse Tracking
const FuturisticCard = ({
  children,
  className = "",
  delay = 0,
  neonGlow = false,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  neonGlow?: boolean;
  onClick?: () => void;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
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
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
          ? '0 0 30px rgba(16, 172, 139, 0.3), 0 8px 32px 0 rgba(9, 77, 136, 0.15)'
          : '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      {/* Holographic borders */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-brand-secondary/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'my-library' | 'catalog' | 'collections' | 'ai-recommended'>('my-library');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest' | 'trending'>('relevance');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [downloadQueue, setDownloadQueue] = useState<Map<string, number>>(new Map());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);
  const [studyStreak, setStudyStreak] = useState<StudyStreak>({
    current: 7,
    longest: 15,
    lastStudyDate: new Date(),
    todayCompleted: true
  });
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'UPSC Prelims Foundation',
      progress: 65,
      totalResources: 20,
      completedResources: 13,
      estimatedHours: 40,
      nextResource: undefined
    },
    {
      id: '2',
      title: 'Indian History Mastery',
      progress: 30,
      totalResources: 15,
      completedResources: 5,
      estimatedHours: 25,
      nextResource: undefined
    }
  ]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [highlightedResourceId, setHighlightedResourceId] = useState<string | null>(null);
  const resourceCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Handle highlight from localStorage (for AI navigation)
  useEffect(() => {
    const highlightId = localStorage.getItem('highlightClassId');
    if (highlightId && highlightId.startsWith('resource-')) {
      localStorage.removeItem('highlightClassId');
      const resourceId = highlightId.replace('resource-', '');
      setHighlightedResourceId(resourceId);

      // Scroll to the resource card
      const scrollToResource = () => {
        const cardElement = resourceCardRefs.current[resourceId];
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      };

      setTimeout(scrollToResource, 500);
      setTimeout(scrollToResource, 1000);
      setTimeout(scrollToResource, 2000);

      // Clear highlight after 6 seconds
      setTimeout(() => {
        setHighlightedResourceId(null);
      }, 6000);
    }
  }, []);

  const categories: Category[] = [
    { id: 'documents', name: 'Study Materials', icon: FileText, count: 125, color: 'indigo', trending: false },
    { id: 'audio', name: 'Audio Books & Lectures', icon: Headphones, count: 75, color: 'purple', trending: true },
    { id: 'video', name: 'Video Lectures', icon: Video, count: 50, color: 'blue', trending: true },
    { id: 'notes', name: 'Notes & Summaries', icon: BookOpen, count: 200, color: 'green', trending: false }
  ];

  const subjects = [
    'Indian Polity',
    'Economics',
    'Geography',
    'History',
    'Science',
    'Current Affairs',
    'Environment',
    'Ethics',
    'International Relations',
    'Art & Culture'
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Indian Constitution Complete Study Material',
      type: 'document',
      subject: 'Indian Polity',
      description: 'Comprehensive study material covering all aspects of Indian Constitution.',
      author: 'Dr. Rajesh Kumar',
      size: '25 MB',
      rating: 4.8,
      reviews: 245,
      isPremium: true,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      pdfUrl: 'https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/05/2023050195.pdf',
      tags: ['Constitution', 'Fundamental Rights', 'DPSP'],
      difficulty: 'intermediate',
      completionRate: 75,
      lastAccessed: new Date('2024-01-15'),
      bookmarked: true,
      views: 1250,
      likes: 189,
      discussions: 23,
      language: 'English',
      learningObjectives: ['Understand fundamental rights', 'Learn about DPSP', 'Constitutional amendments'],
      estimatedTime: '12 hours',
      certificates: true,
      aiRecommended: true,
      trendingScore: 85
    },
    {
      id: '2',
      title: 'Economic Reforms in India (Audio Series)',
      type: 'audio',
      subject: 'Economics',
      description: 'Detailed audio lectures on economic reforms and their impact.',
      author: 'Prof. Sarah Williams',
      duration: '8h 45m',
      rating: 4.6,
      reviews: 180,
      isPremium: true,
      isOwned: false,
      price: 499,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      tags: ['Economic Policy', '1991 Reforms', 'LPG'],
      difficulty: 'advanced',
      views: 892,
      likes: 156,
      discussions: 18,
      language: 'English',
      subtitles: ['Hindi', 'English'],
      learningObjectives: ['Understand 1991 reforms', 'Impact on Indian economy'],
      estimatedTime: '8 hours',
      certificates: true,
      trendingScore: 72
    },
    {
      id: '3',
      title: 'Geography of India Video Series',
      type: 'video',
      subject: 'Geography',
      description: 'Visual learning series covering physical and political geography.',
      author: 'Dr. Priya Sharma',
      duration: '12h 30m',
      thumbnail: 'https://img.youtube.com/vi/dHDQ8ZOeP-Q/maxresdefault.jpg',
      rating: 4.9,
      reviews: 320,
      isPremium: true,
      isOwned: true,
      image: 'https://img.youtube.com/vi/dHDQ8ZOeP-Q/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dHDQ8ZOeP-Q',
      tags: ['Physical Geography', 'Maps', 'Climate'],
      difficulty: 'beginner',
      completionRate: 45,
      lastAccessed: new Date('2024-01-18'),
      bookmarked: false,
      views: 2340,
      likes: 412,
      discussions: 67,
      language: 'English',
      subtitles: ['English', 'Hindi', 'Tamil'],
      learningObjectives: ['Indian physical features', 'Climate patterns', 'River systems'],
      estimatedTime: '12 hours',
      certificates: true,
      aiRecommended: true,
      trendingScore: 92
    },
    {
      id: '4',
      title: 'Modern Indian History Masterclass',
      type: 'video',
      subject: 'History',
      description: 'Comprehensive video series covering Indian history from 1857 to Independence.',
      author: 'Prof. Arun Joshi',
      duration: '15h 30m',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=80',
      rating: 4.7,
      reviews: 290,
      isPremium: true,
      isOwned: false,
      price: 699,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      title: 'Current Affairs Monthly Digest',
      type: 'document',
      subject: 'Current Affairs',
      description: 'Monthly compilation of important current events and their analysis.',
      author: 'EDGEUP Research Team',
      size: '18 MB',
      rating: 4.5,
      reviews: 156,
      isPremium: false,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      pdfUrl: 'https://cdnbbsr.s3waas.gov.in/s380537a945c7aaa788ccfcdf1b99b5d8f/uploads/2023/05/2023050195.pdf'
    },
    {
      id: '6',
      title: 'Science & Technology Policy Notes',
      type: 'notes',
      subject: 'Science',
      description: 'Detailed notes on Indian science policy and technological developments.',
      author: 'Dr. Vikram Seth',
      size: '12 MB',
      rating: 4.4,
      reviews: 178,
      isPremium: false,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=okZ3h3jsTuE'
    },
    {
      id: '7',
      title: 'International Relations Audio Course',
      type: 'audio',
      subject: 'Indian Polity',
      description: 'Comprehensive audio lectures on India\'s foreign relations and policies.',
      author: 'Dr. Meera Singhania',
      duration: '10h 15m',
      rating: 4.7,
      reviews: 225,
      isPremium: true,
      isOwned: false,
      price: 599,
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '8',
      title: 'Environmental Studies Complete Notes',
      type: 'notes',
      subject: 'Geography',
      description: 'Detailed study notes covering ecology, climate change, and conservation.',
      author: 'Prof. Rahul Verma',
      size: '15 MB',
      rating: 4.6,
      reviews: 198,
      isPremium: true,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '9',
      title: 'Indian Economy Case Studies',
      type: 'document',
      subject: 'Economics',
      description: 'Collection of important economic case studies and their analysis.',
      author: 'Dr. Anjali Sharma',
      size: '22 MB',
      rating: 4.8,
      reviews: 267,
      isPremium: true,
      isOwned: false,
      price: 399,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '10',
      title: 'Medieval India Video Lectures',
      type: 'video',
      subject: 'History',
      description: 'Comprehensive coverage of medieval Indian history and culture.',
      author: 'Prof. Rajendra Prasad',
      duration: '14h 20m',
      thumbnail: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=80',
      rating: 4.9,
      reviews: 312,
      isPremium: true,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=Ry9trAKckNY'
    },
    {
      id: '11',
      title: 'UPSC Interview Preparation Guide',
      type: 'document',
      subject: 'Current Affairs',
      description: 'Complete guide for civil services interview preparation with mock questions.',
      author: 'EDGEUP Expert Panel',
      size: '28 MB',
      rating: 4.9,
      reviews: 425,
      isPremium: true,
      isOwned: false,
      price: 799,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '12',
      title: 'Indian Art & Culture Audio Series',
      type: 'audio',
      subject: 'History',
      description: 'Comprehensive audio course on Indian art, architecture, and cultural heritage.',
      author: 'Dr. Smita Patel',
      duration: '9h 30m',
      rating: 4.7,
      reviews: 234,
      isPremium: true,
      isOwned: true,
      image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '13',
      title: 'Ethics Case Studies Collection',
      type: 'notes',
      subject: 'Indian Polity',
      description: 'Extensive collection of ethics case studies with detailed analysis.',
      author: 'Prof. Deepak Gupta',
      size: '20 MB',
      rating: 4.8,
      reviews: 289,
      isPremium: true,
      isOwned: false,
      price: 549,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Enhanced search functionality
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleResourceClick = (resource: Resource) => {
    // Update last accessed
    const updatedResource = { ...resource, lastAccessed: new Date() };
    if (resource.type === 'document' && resource.pdfUrl) {
      setSelectedResource(updatedResource);
      setShowPDFViewer(true);
    } else if (resource.type === 'video' && resource.videoUrl) {
      setSelectedResource(updatedResource);
      setShowVideoPlayer(true);
    } else {
      setSelectedResource(updatedResource);
      setShowResourceModal(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const startDownload = (resourceId: string) => {
    setDownloadQueue(prev => new Map(prev).set(resourceId, 0));
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadQueue(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(resourceId) || 0;
        if (current >= 100) {
          clearInterval(interval);
          newMap.delete(resourceId);
        } else {
          newMap.set(resourceId, current + 10);
        }
        return newMap;
      });
    }, 500);
  };

  const filteredResources = resources.filter(resource => {
    const matchesTab = activeTab === 'catalog' || (activeTab === 'my-library' && resource.isOwned) ||
                      (activeTab === 'ai-recommended' && resource.aiRecommended);
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty?.toLowerCase();
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    const matchesSearch = searchQuery === '' || 
                         resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesCategory && matchesSubject && matchesDifficulty && matchesLanguage && matchesSearch;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
      case 'trending':
        return (b.trendingScore || 0) - (a.trendingScore || 0);
      default:
        return 0;
    }
  });

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
            top: '60%',
            right: '10%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
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
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 space-y-6">

        {/* Study Streak Banner - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.95) 0%, rgba(16, 172, 139, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(9, 77, 136, 0.3), 0 0 40px rgba(16, 172, 139, 0.2)'
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
                </motion.div>
                <div className="text-white">
                  <p className="text-sm opacity-90 font-medium">Study Streak</p>
                  <p className="text-3xl font-bold tracking-tight">{studyStreak.current} days</p>
                </div>
              </motion.div>
              <div className="h-16 w-px bg-white/30" />
              <div className="text-white">
                <p className="text-sm opacity-90 font-medium">Longest Streak</p>
                <p className="text-2xl font-bold tracking-tight">{studyStreak.longest} days</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right text-white">
                <p className="text-sm opacity-90 font-medium">Resources Completed</p>
                <p className="text-2xl font-bold tracking-tight">42 this week</p>
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Header with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            Study Resources
          </motion.h1>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'my-library', label: 'My Library', icon: BookOpen },
              { id: 'catalog', label: 'Browse Catalog', icon: Grid },
              { id: 'collections', label: 'Collections', icon: FolderPlus },
              { id: 'ai-recommended', label: 'AI Picks', icon: Sparkles }
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white border-transparent shadow-xl'
                    : 'bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-[#094d88]/50 text-gray-700'
                }`}
                style={{
                  boxShadow: activeTab === tab.id
                    ? '0 10px 30px rgba(9, 77, 136, 0.3)'
                    : '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}
              >
                <motion.div
                  animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <tab.icon className="w-4 h-4" />
                </motion.div>
                <span className="font-medium">{tab.label}</span>
                {tab.id === 'ai-recommended' && (
                  <motion.span
                    className="ml-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    New
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="space-y-4"
        >
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, topics, or authors... (Ctrl+/)"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all shadow-sm hover:shadow-md"
                  style={{
                    boxShadow: searchQuery ? '0 10px 30px rgba(9, 77, 136, 0.15)' : undefined
                  }}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      whileHover={{ rotate: 90 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3.5 border-2 rounded-2xl transition-all shadow-sm ${
                  showFilters
                    ? 'border-[#094d88] bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 text-[#094d88] shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md text-gray-700'
                }`}
              >
                <motion.div
                  animate={showFilters ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </motion.div>
                <span className="font-medium">Filters</span>
                {(selectedDifficulty !== 'all' || selectedLanguage !== 'all' || selectedSubject !== 'all') && (
                  <motion.span
                    className="ml-1 px-2 py-0.5 bg-[#094d88] text-white text-xs rounded-full font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {[selectedDifficulty !== 'all', selectedLanguage !== 'all', selectedSubject !== 'all'].filter(Boolean).length}
                  </motion.span>
                )}
              </motion.button>
              <motion.div
                className="flex bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <div className="w-px bg-gray-200" />
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3.5 transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 space-y-4 border-2 border-gray-200 shadow-lg"
                style={{
                  boxShadow: '0 10px 40px rgba(9, 77, 136, 0.1)'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 bg-white"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 bg-white"
                  >
                    <option value="all">All Levels</option>
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 bg-white"
                  >
                    <option value="all">All Languages</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 bg-white"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="trending">Trending Now</option>
                  </select>
                  <button
                    onClick={() => {
                      setSelectedSubject('all');
                      setSelectedDifficulty('all');
                      setSelectedLanguage('all');
                      setSortBy('relevance');
                    }}
                    className="px-4 py-2 text-[#094d88] hover:bg-[#094d88]/10 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI Recommendations Section */}
        {activeTab === 'ai-recommended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
                  <p className="text-gray-600 mb-4">Based on your learning patterns and progress, we've curated these resources specifically for you.</p>
                  <div className="flex flex-wrap gap-2">
                    {['Quick revision needed', 'Fills knowledge gaps', 'Matches your pace', 'High success rate'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm text-purple-700 border border-purple-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Paths Progress */}
        {activeTab === 'my-library' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
          >
            {learningPaths.map(path => (
              <div key={path.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#094d88]/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{path.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {path.completedResources} of {path.totalResources} resources completed
                    </p>
                  </div>
                  <Target className="w-5 h-5 text-[#094d88]" />
                </div>
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#094d88] to-[#10ac8b] h-2 rounded-full transition-all"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{path.progress}% Complete</span>
                    <span className="text-gray-600">{path.estimatedHours}h total</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-[#094d88]/10 text-[#094d88] rounded-lg hover:bg-[#094d88]/20 transition-colors font-medium">
                  Continue Learning
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((category, index) => (
            <FuturisticCard
              key={category.id}
              delay={index * 0.1}
              neonGlow={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-[#094d88] shadow-xl'
                  : 'border-gray-200 hover:border-[#094d88]/30'
              }`}
            >
              {category.trending && (
                <motion.div
                  className="absolute top-3 right-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                </motion.div>
              )}
              <div className="relative z-10 flex items-center gap-4">
                <motion.div
                  className={`w-14 h-14 bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 rounded-xl flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <category.icon className="w-7 h-7" />
                </motion.div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{category.count} items</p>
                </div>
              </div>
            </FuturisticCard>
          ))}
        </motion.div>

        {/* Resources Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {sortedResources.map((resource, index) => (
                <div
                  key={resource.id}
                  ref={(el) => { resourceCardRefs.current[resource.id] = el; }}
                  className={`relative transition-all duration-500 rounded-2xl ${
                    highlightedResourceId === resource.id
                      ? 'ring-4 ring-teal-400 ring-offset-2 shadow-[0_0_30px_rgba(20,184,166,0.4)]'
                      : ''
                  }`}
                >
                  {highlightedResourceId === resource.id && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(45, 212, 191, 0.1) 100%)',
                        boxShadow: '0 0 40px rgba(20, 184, 166, 0.25)'
                      }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-[#094d88]/50 group"
                    style={{
                      boxShadow: hoveredResource === resource.id
                        ? '0 20px 60px rgba(9, 77, 136, 0.2)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                    onMouseEnter={() => setHoveredResource(resource.id)}
                    onMouseLeave={() => setHoveredResource(null)}
                  >
                  {/* Enhanced Resource Card Header */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 0.9 }}
                    />

                    {/* AI Recommended Badge */}
                    {resource.aiRecommended && (
                      <motion.div
                        className="absolute top-3 left-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <span className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-xs font-bold shadow-lg">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-3 h-3" />
                          </motion.div>
                          AI Pick
                        </span>
                      </motion.div>
                    )}

                    {/* Trending Badge */}
                    {resource.trendingScore && resource.trendingScore > 80 && (
                      <motion.div
                        className="absolute top-3 right-3"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <span className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs font-bold shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                          Hot
                        </span>
                      </motion.div>
                    )}

                    {/* Download Progress */}
                    {downloadQueue.has(resource.id) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-[#10ac8b] animate-spin mb-2" />
                          <p className="text-white font-medium">{downloadQueue.get(resource.id)}%</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white mb-2">
                        {resource.type === 'document' && <FileText className="w-4 h-4" />}
                        {resource.type === 'audio' && <Headphones className="w-4 h-4" />}
                        {resource.type === 'video' && <Video className="w-4 h-4" />}
                        {resource.type === 'notes' && <BookOpen className="w-4 h-4" />}
                        <span className="text-sm font-medium">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                        {resource.difficulty && (
                          <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                            resource.difficulty === 'beginner' ? 'bg-green-500/80 text-white' :
                            resource.difficulty === 'intermediate' ? 'bg-yellow-500/80 text-white' :
                            'bg-red-500/80 text-white'
                          }`}>
                            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-medium line-clamp-2">{resource.title}</h3>
                    </div>

                    {/* Hover Play Button */}
                    {resource.type === 'video' && hoveredResource === resource.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40"
                      >
                        <div className="w-16 h-16 bg-[#10ac8b] rounded-full flex items-center justify-center shadow-xl">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </motion.button>
                    )}
                  </div>

                  {/* Enhanced Resource Card Body */}
                  <div className="p-6">
                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600">{resource.author}</p>
                        {resource.lastAccessed && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last accessed {new Date(resource.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.certificates && (
                          <Award className="w-4 h-4 text-[#094d88]" title="Certificate Available" />
                        )}
                        {resource.isPremium && !resource.isOwned && (
                          <Lock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {resource.completionRate !== undefined && resource.isOwned && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{resource.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#10ac8b] h-1.5 rounded-full transition-all"
                            style={{ width: `${resource.completionRate}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                      {resource.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {resource.duration}
                        </div>
                      )}
                      {resource.size && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {resource.size}
                        </div>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-3.5 h-3.5 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>

                    {/* Enhanced Stats Row */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {resource.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {resource.likes || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {resource.discussions || 0}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {resource.isOwned ? (
                        <motion.button
                          onClick={() => handleResourceClick(resource)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            {resource.type === 'document' && <ExternalLink className="w-4 h-4" />}
                            {resource.type === 'audio' && <Play className="w-4 h-4" />}
                            {resource.type === 'video' && <Play className="w-4 h-4" />}
                            {resource.type === 'notes' && <BookOpen className="w-4 h-4" />}
                          </motion.div>
                          <span className="text-sm">
                            {resource.completionRate === 100 ? 'Review' : 'Continue'}
                          </span>
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleResourceClick(resource)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>₹{resource.price}</span>
                        </motion.button>
                      )}

                      <motion.button
                        onClick={() => toggleBookmark(resource.id)}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${
                          bookmarkedResources.has(resource.id)
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <motion.div
                          animate={bookmarkedResources.has(resource.id) ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {bookmarkedResources.has(resource.id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </motion.div>
                      </motion.button>
                      
                      {resource.isOwned && !resource.isDownloaded && (
                        <button
                          onClick={() => startDownload(resource.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          {downloadQueue.has(resource.id) ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {sortedResources.map((resource, index) => (
                <div
                  key={resource.id}
                  ref={(el) => { resourceCardRefs.current[resource.id] = el; }}
                  className={`relative transition-all duration-500 rounded-xl ${
                    highlightedResourceId === resource.id
                      ? 'ring-4 ring-teal-400 ring-offset-2 shadow-[0_0_30px_rgba(20,184,166,0.4)]'
                      : ''
                  }`}
                >
                  {highlightedResourceId === resource.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(45, 212, 191, 0.1) 100%)',
                        boxShadow: '0 0 40px rgba(20, 184, 166, 0.25)'
                      }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#094d88]/30 transition-all"
                  >
                    <div className="flex gap-6">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600">{resource.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.aiRecommended && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              <Sparkles className="w-3 h-3" />
                              AI Pick
                            </span>
                          )}
                          {resource.isPremium && !resource.isOwned && (
                            <Lock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {resource.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {resource.duration}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            {resource.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {resource.views || 0}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.isOwned ? (
                            <button
                              onClick={() => handleResourceClick(resource)}
                              className="px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                            >
                              Continue Learning
                            </button>
                          ) : (
                            <button
                              onClick={() => handleResourceClick(resource)}
                              className="px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                            >
                              ₹{resource.price}
                            </button>
                          )}
                          <button
                            onClick={() => toggleBookmark(resource.id)}
                            className={`p-2 rounded-lg transition-all ${
                              bookmarkedResources.has(resource.id)
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {bookmarkedResources.has(resource.id) ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button for Collections */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={() => setShowCreateCollection(true)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all"
            style={{
              boxShadow: '0 10px 40px rgba(9, 77, 136, 0.3), 0 0 60px rgba(16, 172, 139, 0.2)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FolderPlus className="w-5 h-5" />
            </motion.div>
            <span className="font-bold">Create Collection</span>
            <motion.div
              className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {collections.length}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border-2 border-gray-200 max-w-xs z-50"
          style={{
            boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-6">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.p
                className="text-2xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent"
                key={sortedResources.filter(r => r.isOwned).length}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {sortedResources.filter(r => r.isOwned).length}
              </motion.p>
              <p className="text-xs text-gray-600 font-medium">Owned</p>
            </motion.div>
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.p
                className="text-2xl font-bold bg-gradient-to-r from-[#10ac8b] to-[#094d88] bg-clip-text text-transparent"
                key={bookmarkedResources.size}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {bookmarkedResources.size}
              </motion.p>
              <p className="text-xs text-gray-600 font-medium">Saved</p>
            </motion.div>
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.p
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent"
                key={sortedResources.filter(r => r.completionRate === 100).length}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {sortedResources.filter(r => r.completionRate === 100).length}
              </motion.p>
              <p className="text-xs text-gray-600 font-medium">Done</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Create Collection Modal */}
      <AnimatePresence>
        {showCreateCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateCollection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Collection</h3>
                <button
                  onClick={() => setShowCreateCollection(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
                  <input
                    type="text"
                    placeholder="e.g., UPSC Prelims 2024"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Add a description for your collection..."
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#094d88] rounded" />
                    <span className="text-sm text-gray-700">Make this collection public</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateCollection(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors">
                    Create Collection
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Resource Modal */}
      <AnimatePresence>
        {showResourceModal && selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResourceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedResource.title}</h3>
                    {selectedResource.aiRecommended && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        AI Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <p>{selectedResource.author}</p>
                    <span className="text-gray-400">•</span>
                    <p>{selectedResource.language}</p>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {selectedResource.rating} ({selectedResource.reviews} reviews)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

            {selectedResource.type === 'audio' && (
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Headphones className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-[#094d88] rounded-full"
                      style={{ width: `${(currentTime / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 bg-[#094d88] text-white rounded-full hover:bg-[#10ac8b] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <SkipForward className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                      min="0"
                      max="100"
                      value="100"
                    />
                  </div>
                </div>
              </div>
            )}

              {/* Learning Objectives */}
              {selectedResource.learningObjectives && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {selectedResource.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audio Player for Audio Resources */}
              {selectedResource.type === 'audio' && (
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <Headphones className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-[#094d88] rounded-full"
                        style={{ width: `${(currentTime / 100) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatDuration(currentTime)}</span>
                      <span>{selectedResource.duration}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipBack className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 bg-[#094d88] text-white rounded-full hover:bg-[#10ac8b] transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-600" />
                      <input
                        type="range"
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                        min="0"
                        max="100"
                        value="100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedResource.description}</p>
                  </div>
                  
                  {/* Tags */}
                  {selectedResource.tags && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Topics Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResource.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Resource Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium capitalize">{selectedResource.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty</span>
                        <span className="font-medium capitalize">{selectedResource.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{selectedResource.estimatedTime}</span>
                      </div>
                      {selectedResource.certificates && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate</span>
                          <span className="font-medium text-green-600">Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {selectedResource.isOwned ? (
                      <button
                        onClick={() => handleResourceClick(selectedResource)}
                        className="w-full px-4 py-3 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors font-medium"
                      >
                        Start Learning
                      </button>
                    ) : (
                      <button className="w-full px-4 py-3 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors font-medium">
                        Get Access - ₹{selectedResource.price}
                      </button>
                    )}
                    <button className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Add to Collection
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedResource?.pdfUrl && (
        <PDFViewer
          url={selectedResource.pdfUrl}
          onClose={() => setShowPDFViewer(false)}
        />
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && selectedResource && (
        <VideoPlayer
          url={selectedResource.videoUrl || ''}
          title={selectedResource.title}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </>
  );
}