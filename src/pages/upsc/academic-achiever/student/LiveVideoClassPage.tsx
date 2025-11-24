import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageSquare,
  Hand,
  Share2,
  Settings,
  Grid,
  Maximize,
  Minimize,
  Phone,
  MoreVertical,
  Send,
  Bookmark,
  Clock,
  FileText,
  Download,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  User,
  Shield,
  Star,
  Heart,
  ThumbsUp,
  Smile,
  HelpCircle,
  PenTool,
  Presentation,
  ScreenShare,
  ScreenShareOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Record,
  Square,
  Play,
  Pause,
  BookOpen,
  ClipboardList,
  BarChart3,
  Award,
  Coffee,
  Brain,
  Lightbulb,
  Flag,
  Pin,
  X,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  Monitor,
  Laptop,
  Smartphone,
  Calendar,
  Bell,
  BellOff,
  Copy,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  Layout,
  SidebarOpen,
  SidebarClose,
  MessageCircle,
  Hash,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Activity,
  Signal,
  Zap,
  Target,
  TrendingUp,
  UserPlus,
  UserMinus,
  UserCheck,
  Ban,
  CheckSquare,
  Square as SquareIcon,
  Circle,
  Info
} from 'lucide-react';

// Network Quality Indicator
const NetworkQualityIndicator = ({ quality }) => {
  const getQualityInfo = () => {
    switch(quality) {
      case 'excellent':
        return { icon: Wifi, color: 'text-green-600', bars: 4 };
      case 'good':
        return { icon: Wifi, color: 'text-yellow-600', bars: 3 };
      case 'poor':
        return { icon: WifiOff, color: 'text-red-600', bars: 1 };
      default:
        return { icon: Wifi, color: 'text-gray-400', bars: 2 };
    }
  };
  
  const { icon: Icon, color } = getQualityInfo();
  
  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs">Network</span>
    </div>
  );
};

// Live Reactions Component
const LiveReactions = ({ onReaction }) => {
  const reactions = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '👏', label: 'Clap' },
    { emoji: '🤔', label: 'Think' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '🙋', label: 'Question' }
  ];
  
  return (
    <div className="flex items-center gap-1 p-2 bg-white rounded-lg shadow-lg">
      {reactions.map((reaction, idx) => (
        <motion.button
          key={idx}
          onClick={() => onReaction(reaction.emoji)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={reaction.label}
        >
          <span className="text-xl">{reaction.emoji}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Floating Reaction Animation
const FloatingReaction = ({ emoji, id }) => {
  return (
    <motion.div
      key={id}
      className="absolute bottom-20 right-10 text-3xl"
      initial={{ y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        y: -200, 
        opacity: 0, 
        scale: [0, 1.2, 1],
        x: Math.random() * 100 - 50 
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      {emoji}
    </motion.div>
  );
};

// Participant Card
const ParticipantCard = ({ participant, isInstructor = false }) => {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {participant.avatar ? (
            <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-gray-500" />
          )}
        </div>
        {participant.isHandRaised && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <Hand className="w-3 h-3 text-white" />
          </div>
        )}
        {participant.isMuted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">{participant.name}</p>
          {isInstructor && (
            <span className="px-2 py-0.5 bg-brand-primary text-white text-xs rounded-full">Host</span>
          )}
        </div>
        {participant.role && (
          <p className="text-xs text-gray-500">{participant.role}</p>
        )}
      </div>
      {participant.isSpeaking && (
        <div className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-3 bg-green-500 rounded-full"
              animate={{ height: [12, 4, 12] }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, onReply }) => {
  return (
    <div className={`p-3 ${message.isInstructor ? 'bg-brand-primary/5 border-l-4 border-l-brand-primary' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {message.avatar ? (
            <img src={message.avatar} alt={message.author} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">{message.author}</span>
            {message.isInstructor && (
              <span className="px-2 py-0.5 bg-brand-primary text-white text-xs rounded-full">Instructor</span>
            )}
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
          <p className="text-sm text-gray-700 break-words">{message.content}</p>
          {message.attachment && (
            <div className="mt-2 p-2 bg-gray-100 rounded-lg flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">{message.attachment}</span>
            </div>
          )}
          <button
            onClick={() => onReply(message)}
            className="text-xs text-gray-500 hover:text-brand-primary mt-1"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Notes Component
const QuickNotes = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <PenTool className="w-4 h-4" />
          Quick Notes
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Take a quick note..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
            <button
              onClick={handleAddNote}
              className="px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2">
            {notes.map((note, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{note.content}</p>
                <span className="text-xs text-gray-500">{note.timestamp}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Bookmarks Component
const BookmarksPanel = ({ bookmarks, currentTime, onAddBookmark }) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  
  const handleAddBookmark = () => {
    if (bookmarkTitle.trim()) {
      onAddBookmark(bookmarkTitle, currentTime);
      setBookmarkTitle('');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
        <Bookmark className="w-4 h-4" />
        Bookmarks
      </h3>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={bookmarkTitle}
          onChange={(e) => setBookmarkTitle(e.target.value)}
          placeholder="Bookmark this moment..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
        />
        <button
          onClick={handleAddBookmark}
          className="px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-1"
        >
          <Bookmark className="w-3 h-3" />
          <span className="text-sm">Add</span>
        </button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {bookmarks.map((bookmark, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{bookmark.title}</p>
                <p className="text-xs text-gray-500">{bookmark.timestamp}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Poll Component
const LivePoll = ({ poll, onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(selectedOption);
      setHasVoted(true);
    }
  };
  
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-4 border-2 border-brand-primary/20"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-primary" />
          Live Poll
        </h3>
        <span className="text-xs text-gray-500">
          {hasVoted ? `${totalVotes} votes` : 'Vote now!'}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">{poll.question}</p>
      
      <div className="space-y-2">
        {poll.options.map((option, idx) => (
          <div key={idx} className="relative">
            {!hasVoted ? (
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="poll"
                  value={idx}
                  onChange={() => setSelectedOption(idx)}
                  className="text-brand-primary"
                />
                <span className="text-sm text-gray-700">{option.text}</span>
              </label>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{option.text}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {Math.round((option.votes / totalVotes) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(option.votes / totalVotes) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!hasVoted && (
        <button
          onClick={handleVote}
          disabled={selectedOption === null}
          className="w-full mt-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-300"
        >
          Submit Vote
        </button>
      )}
    </motion.div>
  );
};

// Main Live Video Component
export function LiveVideoClassPage() {
  const { courseId, classId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activePanel, setActivePanel] = useState('chat'); // chat, participants, notes, bookmarks
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [networkQuality, setNetworkQuality] = useState('excellent');
  const [classElapsedTime, setClassElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [activePoll, setActivePoll] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  
  // Sample data
  const classInfo = {
    title: 'Ancient India - Indus Valley Civilization',
    instructor: 'Dr. Rajesh Kumar',
    subject: 'History',
    scheduledTime: '10:00 AM - 11:30 AM',
    totalParticipants: 245,
    duration: '90 minutes',
    isRecording: true
  };
  
  const participants = [
    { id: 1, name: 'Dr. Rajesh Kumar', role: 'Instructor', isHandRaised: false, isMuted: false, isSpeaking: true, avatar: null },
    { id: 2, name: 'You', role: 'Student', isHandRaised: isHandRaised, isMuted: isMuted, isSpeaking: false, avatar: null },
    { id: 3, name: 'Priya Sharma', role: 'Student', isHandRaised: true, isMuted: true, isSpeaking: false, avatar: null },
    { id: 4, name: 'Amit Patel', role: 'Student', isHandRaised: false, isMuted: true, isSpeaking: false, avatar: null },
    { id: 5, name: 'Neha Singh', role: 'Student', isHandRaised: false, isMuted: true, isSpeaking: false, avatar: null }
  ];
  
  const sampleMessages = [
    { id: 1, author: 'Dr. Rajesh Kumar', content: 'Welcome everyone! We\'ll start in a moment.', timestamp: '10:00 AM', isInstructor: true },
    { id: 2, author: 'System', content: 'Recording has started', timestamp: '10:01 AM', isSystem: true },
    { id: 3, author: 'Priya Sharma', content: 'Good morning sir!', timestamp: '10:01 AM' },
    { id: 4, author: 'Dr. Rajesh Kumar', content: 'Today we\'ll explore the urban planning of Harappan civilization', timestamp: '10:02 AM', isInstructor: true, isPinned: true }
  ];
  
  const samplePoll = {
    question: 'Which was the largest city of the Indus Valley Civilization?',
    options: [
      { text: 'Harappa', votes: 45 },
      { text: 'Mohenjo-daro', votes: 120 },
      { text: 'Dholavira', votes: 35 },
      { text: 'Kalibangan', votes: 25 }
    ]
  };
  
  // Effects
  useEffect(() => {
    setMessages(sampleMessages);
    
    // Simulate class timer
    const timer = setInterval(() => {
      setClassElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Simulate poll after 5 seconds
    setTimeout(() => {
      setActivePoll(samplePoll);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handlers
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: 'You',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };
  
  const handleReaction = (emoji) => {
    const newReaction = {
      id: Date.now(),
      emoji
    };
    setFloatingReactions([...floatingReactions, newReaction]);
    
    // Remove reaction after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };
  
  const handleAddNote = (content) => {
    const newNote = {
      content,
      timestamp: formatTime(classElapsedTime)
    };
    setNotes([...notes, newNote]);
  };
  
  const handleAddBookmark = (title, time) => {
    const newBookmark = {
      title,
      timestamp: formatTime(classElapsedTime),
      timeInSeconds: classElapsedTime
    };
    setBookmarks([...bookmarks, newBookmark]);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] bg-gray-900 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-white font-semibold text-lg">{classInfo.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {classInfo.totalParticipants} participants
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(classElapsedTime)}
                </span>
                {classInfo.isRecording && (
                  <span className="flex items-center gap-1 text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Recording
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NetworkQualityIndicator quality={networkQuality} />
              <button className="text-gray-300 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Leave Class
              </button>
            </div>
          </div>
          
          {/* Video Container */}
          <div className="flex-1 relative bg-black">
            {/* Instructor Video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-6xl">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white rounded-lg text-sm">
                  {classInfo.instructor} (Host)
                </div>
              </div>
            </div>
            
            {/* Floating Reactions */}
            <AnimatePresence>
              {floatingReactions.map((reaction) => (
                <FloatingReaction key={reaction.id} emoji={reaction.emoji} id={reaction.id} />
              ))}
            </AnimatePresence>
            
            {/* Live Poll Overlay */}
            {activePoll && (
              <div className="absolute top-4 right-4 w-80">
                <LivePoll poll={activePoll} onVote={(option) => console.log('Voted:', option)} />
              </div>
            )}
            
            {/* Pinned Message */}
            {pinnedMessage && (
              <div className="absolute top-4 left-4 right-4 max-w-2xl mx-auto">
                <div className="bg-brand-primary text-white p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pin className="w-4 h-4" />
                    <p className="text-sm">{pinnedMessage.content}</p>
                  </div>
                  <button onClick={() => setPinnedMessage(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Quick Notes Floating */}
            <div className="absolute bottom-24 left-4 w-80">
              <QuickNotes notes={notes} onAddNote={handleAddNote} />
            </div>
            
            {/* Bookmarks Floating */}
            <div className="absolute bottom-24 right-[360px] w-80">
              <BookmarksPanel 
                bookmarks={bookmarks} 
                currentTime={classElapsedTime}
                onAddBookmark={handleAddBookmark}
              />
            </div>
          </div>
          
          {/* Bottom Control Bar */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-lg transition-colors ${
                    isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-lg transition-colors ${
                    !isVideoOn ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-lg transition-colors ${
                    isScreenSharing ? 'bg-brand-primary text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isScreenSharing ? <ScreenShareOff className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Center Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsHandRaised(!isHandRaised)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    isHandRaised ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <Hand className="w-5 h-5" />
                  <span className="text-sm">{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                </button>
                
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                <button className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <Activity className="w-5 h-5" />
                </button>
                
                <button className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              
              {/* Right Controls */}
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Resources</span>
                </button>
                
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm">Attendance</span>
                </button>
              </div>
            </div>
            
            {/* Reactions Panel */}
            {showReactions && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <LiveReactions onReaction={handleReaction} />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'participants', label: 'People', icon: Users },
              { id: 'notes', label: 'Notes', icon: PenTool },
              { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activePanel === tab.id
                    ? 'text-brand-primary border-b-2 border-brand-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activePanel === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onReply={(msg) => console.log('Reply to:', msg)}
                    />
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {activePanel === 'participants' && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {participants.length} participants • {participants.filter(p => p.isHandRaised).length} hands raised
                  </p>
                </div>
                <div className="space-y-1">
                  {participants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={participant}
                      isInstructor={participant.role === 'Instructor'}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activePanel === 'notes' && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Session Notes</h3>
                  <p className="text-sm text-gray-600">Your notes will be saved and available after class</p>
                </div>
                <div className="space-y-3">
                  {notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <span className="text-xs text-gray-500">{note.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activePanel === 'bookmarks' && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Session Bookmarks</h3>
                  <p className="text-sm text-gray-600">Bookmark important moments to review later</p>
                </div>
                <div className="space-y-3">
                  {bookmarks.map((bookmark, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">{bookmark.title}</p>
                      <span className="text-xs text-gray-500">{bookmark.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}