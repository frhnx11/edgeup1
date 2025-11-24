import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Book,
  Headphones,
  Video,
  Download,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Calendar,
  Star,
  Heart,
  Bookmark,
  Share2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Upload,
  Folder,
  FolderOpen,
  Tag,
  Hash,
  User,
  Users,
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  FileCheck,
  FilePlus,
  FileX,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  ExternalLink,
  Copy,
  Trash2,
  Edit3,
  Plus,
  X,
  Check,
  Info,
  AlertCircle,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  SortAsc,
  SortDesc,
  LayoutGrid,
  LayoutList,
  Layers,
  Package,
  Archive,
  Zap,
  Target,
  Trophy,
  Medal,
  Flag,
  Pin,
  Paperclip,
  Link,
  Globe,
  Lock,
  Unlock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  History,
  Lightbulb,
  Brain,
  GraduationCap,
  Library,
  BookMarked,
  Newspaper,
  FileAudio,
  FileVideo,
  Image,
  Music,
  Mic,
  Camera,
  Film,
  Tv,
  Radio,
  Wifi,
  WifiOff,
  Cloud,
  CloudDownload,
  CloudUpload,
  HardDrive,
  Database,
  Server,
  Cpu,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Headset,
  Speaker,
  Battery,
  BatteryLow,
  Power,
  Plug,
  Flashlight,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Droplet,
  Flame,
  Sparkles
} from 'lucide-react';

// Material Type Icons
const getMaterialIcon = (type) => {
  switch (type) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-600 bg-red-100' };
    case 'book':
      return { icon: Book, color: 'text-blue-600 bg-blue-100' };
    case 'audio':
      return { icon: Headphones, color: 'text-purple-600 bg-purple-100' };
    case 'video':
      return { icon: Video, color: 'text-green-600 bg-green-100' };
    case 'notes':
      return { icon: FileCheck, color: 'text-orange-600 bg-orange-100' };
    case 'article':
      return { icon: Newspaper, color: 'text-indigo-600 bg-indigo-100' };
    default:
      return { icon: FileText, color: 'text-gray-600 bg-gray-100' };
  }
};

// Stats Card Component
const StatsCard = ({ stat, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
          <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
        </div>
        <span className={`text-sm font-medium ${
          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
        } flex items-center gap-1`}>
          {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {stat.change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
    </motion.div>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
          activeCategory === 'all'
            ? 'bg-brand-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All Materials
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-brand-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <category.icon className="w-4 h-4" />
          {category.name}
          <span className="ml-1 text-xs opacity-80">({category.count})</span>
        </button>
      ))}
    </div>
  );
};

// Advanced Search Component
const AdvancedSearch = ({ onSearch, onClose }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    type: 'all',
    subject: 'all',
    dateRange: 'all',
    author: '',
    tags: []
  });

  return (
    <motion.div
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Advanced Search</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
          <input
            type="text"
            value={searchParams.query}
            onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            placeholder="Enter keywords..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
          <select
            value={searchParams.type}
            onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDFs</option>
            <option value="book">Books</option>
            <option value="audio">Audio Books</option>
            <option value="video">Videos</option>
            <option value="notes">Notes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            value={searchParams.subject}
            onChange={(e) => setSearchParams({ ...searchParams, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="all">All Subjects</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="polity">Polity</option>
            <option value="economy">Economy</option>
            <option value="science">Science & Tech</option>
            <option value="environment">Environment</option>
            <option value="current">Current Affairs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={searchParams.dateRange}
            onChange={(e) => setSearchParams({ ...searchParams, dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSearch(searchParams)}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
        >
          Search
        </button>
      </div>
    </motion.div>
  );
};

// Material Card Component
const MaterialCard = ({ material, viewMode, onAction }) => {
  const { icon: Icon, color } = getMaterialIcon(material.type);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(material.isFavorite || false);
  const [showOptions, setShowOptions] = useState(false);

  if (viewMode === 'grid') {
    return (
      <motion.div
        className="bg-white rounded-xl border border-gray-200 hover:border-brand-primary/30 transition-all overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
      >
        {/* Thumbnail/Preview */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {material.thumbnail ? (
            <img 
              src={material.thumbnail} 
              alt={material.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className={`w-16 h-16 ${color.split(' ')[0]}`} />
            </div>
          )}
          
          {/* Overlay Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => onAction('view', material)}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={() => onAction('download', material)}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-800'}`} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {material.isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">NEW</span>
            )}
            {material.isPremium && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </span>
            )}
          </div>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{material.title}</h3>
              <p className="text-sm text-gray-600">{material.author}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{material.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {material.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{material.tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {material.views}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {material.downloads}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {material.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500">{material.size}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 hover:border-brand-primary/30 transition-all p-5"
      whileHover={{ x: 2 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{material.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{material.author}</span>
                <span>•</span>
                <span>{material.subject}</span>
                <span>•</span>
                <span>{material.size}</span>
                <span>•</span>
                <span>{material.uploadDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAction('view', material)}
                className="p-2 text-gray-600 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAction('download', material)}
                className="p-2 text-gray-600 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Audio Player Component
const AudioPlayer = ({ audioBook, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioBook.duration || 3600);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
    >
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center gap-6">
          {/* Cover Art */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {audioBook.cover ? (
              <img src={audioBook.cover} alt={audioBook.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Headphones className="w-8 h-8 text-gray-500" />
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">{audioBook.title}</h4>
            <p className="text-sm text-gray-600">{audioBook.author}</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-colors"
            >
              {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{formatTime(duration)}</span>
          </div>
          
          {/* Additional Controls */}
          <div className="flex items-center gap-3">
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Repeat className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Collection Component
const CollectionCard = ({ collection }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-xl p-6 border border-brand-primary/20 hover:border-brand-primary/40 transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${collection.gradient} flex items-center justify-center`}>
          <collection.icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">{collection.itemCount} items</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{collection.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{collection.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {collection.contributors.slice(0, 3).map((contributor, idx) => (
            <div key={idx} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          ))}
          {collection.contributors.length > 3 && (
            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">+{collection.contributors.length - 3}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </motion.div>
  );
};

// Crown icon for premium content
const Crown = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 11L3 5l3 1 4-5 4 5 3-1-2 6v6H5v-6z" />
  </svg>
);

export function StudyMaterialsPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeAudioBook, setActiveAudioBook] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Sample data
  const stats = [
    { icon: FileText, value: '2,456', label: 'Total Materials', change: '+12%', trend: 'up', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: Download, value: '15.2K', label: 'Downloads', change: '+8%', trend: 'up', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: Users, value: '892', label: 'Contributors', change: '+5%', trend: 'up', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { icon: Star, value: '4.8', label: 'Avg Rating', change: '+0.2', trend: 'up', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' }
  ];
  
  const categories = [
    { id: 'pdf', name: 'PDFs', icon: FileText, count: 856 },
    { id: 'book', name: 'Books', icon: Book, count: 342 },
    { id: 'audio', name: 'Audio Books', icon: Headphones, count: 127 },
    { id: 'video', name: 'Video Lectures', icon: Video, count: 445 },
    { id: 'notes', name: 'Notes', icon: FileCheck, count: 686 }
  ];
  
  const materials = [
    {
      id: 1,
      type: 'pdf',
      title: 'Indian Constitution - Complete Guide',
      author: 'Dr. Rajesh Kumar',
      description: 'Comprehensive study material covering all articles and amendments of the Indian Constitution',
      subject: 'Polity',
      size: '15.2 MB',
      views: 2456,
      downloads: 1234,
      rating: 4.8,
      uploadDate: 'Mar 10, 2024',
      tags: ['Constitution', 'Polity', 'UPSC', 'Fundamentals'],
      isNew: true,
      isPremium: false,
      thumbnail: null
    },
    {
      id: 2,
      type: 'book',
      title: 'Ancient India - NCERT Class 11',
      author: 'NCERT',
      description: 'Official NCERT textbook for Ancient Indian History',
      subject: 'History',
      size: '45.8 MB',
      views: 5632,
      downloads: 3421,
      rating: 4.9,
      uploadDate: 'Feb 28, 2024',
      tags: ['NCERT', 'History', 'Ancient India'],
      isNew: false,
      isPremium: false,
      thumbnail: null
    },
    {
      id: 3,
      type: 'audio',
      title: 'Economic Survey 2024 - Audio Summary',
      author: 'EdgeUp Team',
      description: 'Complete audio summary of Economic Survey 2024 with key highlights',
      subject: 'Economy',
      size: '125 MB',
      duration: 7200, // 2 hours in seconds
      views: 1876,
      downloads: 892,
      rating: 4.7,
      uploadDate: 'Mar 12, 2024',
      tags: ['Economy', 'Current Affairs', 'Audio'],
      isNew: true,
      isPremium: true,
      thumbnail: null
    },
    {
      id: 4,
      type: 'video',
      title: 'Geography - Monsoon System Explained',
      author: 'Prof. Sarah Williams',
      description: 'Detailed video lecture on Indian Monsoon System with animations',
      subject: 'Geography',
      size: '256 MB',
      duration: '45:30',
      views: 3421,
      downloads: 1567,
      rating: 4.9,
      uploadDate: 'Mar 5, 2024',
      tags: ['Geography', 'Monsoon', 'Climate'],
      isNew: false,
      isPremium: true,
      thumbnail: null
    },
    {
      id: 5,
      type: 'notes',
      title: 'Current Affairs March 2024 - Compiled Notes',
      author: 'EdgeUp Current Affairs Team',
      description: 'Monthly compilation of important current affairs with practice questions',
      subject: 'Current Affairs',
      size: '8.5 MB',
      views: 6789,
      downloads: 4532,
      rating: 4.6,
      uploadDate: 'Mar 15, 2024',
      tags: ['Current Affairs', 'Monthly', 'Notes'],
      isNew: true,
      isPremium: false,
      thumbnail: null
    }
  ];
  
  const collections = [
    {
      id: 1,
      title: 'NCERT Complete Collection',
      description: 'All NCERT books from Class 6-12 for UPSC preparation',
      icon: Library,
      gradient: 'from-blue-500 to-blue-600',
      itemCount: 45,
      contributors: ['NCERT', 'EdgeUp Team']
    },
    {
      id: 2,
      title: 'Previous Year Papers',
      description: '10+ years of UPSC Prelims and Mains papers with solutions',
      icon: Archive,
      gradient: 'from-purple-500 to-purple-600',
      itemCount: 120,
      contributors: ['EdgeUp Team', 'Community']
    },
    {
      id: 3,
      title: 'Topper\'s Notes Collection',
      description: 'Handwritten notes from UPSC toppers',
      icon: Trophy,
      gradient: 'from-green-500 to-green-600',
      itemCount: 85,
      contributors: ['AIR 1-100 Toppers']
    },
    {
      id: 4,
      title: 'Current Affairs Archive',
      description: 'Monthly current affairs from last 2 years',
      icon: Globe,
      gradient: 'from-orange-500 to-orange-600',
      itemCount: 24,
      contributors: ['Current Affairs Team']
    }
  ];
  
  const handleMaterialAction = (action, material) => {
    switch (action) {
      case 'view':
        if (material.type === 'video') {
          navigate(`/course/${courseId}/day/${dayNumber}/video-lessons`);
        } else if (material.type === 'audio') {
          setActiveAudioBook(material);
        } else {
          // Open PDF viewer or other viewers
          console.log('View material:', material);
        }
        break;
      case 'download':
        console.log('Download material:', material);
        break;
      default:
        break;
    }
  };
  
  const filteredMaterials = materials.filter(material => {
    if (activeCategory !== 'all' && material.type !== activeCategory) return false;
    if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Study Materials Library</h1>
            <p className="text-white/90 mb-6">Access comprehensive study resources for your UPSC preparation</p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials by title, author, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50 transition-all"
              />
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showAdvancedSearch && (
                  <AdvancedSearch 
                    onSearch={(params) => console.log('Advanced search:', params)}
                    onClose={() => setShowAdvancedSearch(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} stat={stat} delay={idx * 0.1} />
          ))}
        </div>
        
        {/* Collections */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Collections</h2>
            <button className="text-brand-primary hover:text-brand-secondary font-medium">
              View All Collections →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, idx) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div>
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between">
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''} transition-all`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''} transition-all`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Material
              </button>
            </div>
          </div>
          
          {/* Materials Grid/List */}
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'grid-cols-1 gap-4'
          }`}>
            {filteredMaterials.map((material, idx) => (
              <MaterialCard
                key={material.id}
                material={material}
                viewMode={viewMode}
                onAction={handleMaterialAction}
              />
            ))}
          </div>
          
          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Materials
            </button>
          </div>
        </div>
        
        {/* Audio Player */}
        <AnimatePresence>
          {activeAudioBook && (
            <AudioPlayer 
              audioBook={activeAudioBook}
              onClose={() => setActiveAudioBook(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}