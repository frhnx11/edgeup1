import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { 
  Brain, 
  Target, 
  RefreshCw,
  HelpCircle,
  Send,
  User,
  ChevronDown,
  Sparkles,
  ClipboardCheck,
  Mic,
  Volume2,
  VolumeX,
  Lightbulb,
  BookOpen,
  Star,
  Rocket,
  Timer,
  Award,
  TrendingUp,
  MessageSquare,
  FileText,
  Copy,
  Download,
  Clock,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Maximize2,
  Minimize2,
  Eye,
  Zap,
  Heart,
  PlayCircle,
  PauseCircle,
  CheckCircle
} from 'lucide-react';
import { generateFAQs, getChatResponse, speechToText, textToSpeech } from '../../../../utils/openai';
import { useGameStore } from '../../../../store/useGameStore';
import { RewardPopup } from '../../../../components/upsc/common/GameElements';
import RecordRTC from 'recordrtc';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  bookmarked?: boolean;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  relatedTopics?: string[];
  hasMedia?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  popularity: number;
  relatedQuestions?: string[];
}

interface StudySession {
  startTime: number;
  duration: number;
  messagesCount: number;
  topicsDiscussed: string[];
  difficultyLevel: string;
  engagement: number;
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'suggestion';
  title: string;
  description: string;
  action?: string;
  icon: any;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
}

export function AILearningPlan2Page() {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const [showFAQs, setShowFAQs] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentTopic, setCurrentTopic] = useState<{
    subject: string;
    topic: string;
    description: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<number | null>(null);
  const [showReward, setShowReward] = useState<{ xp: number; coins: number; message: string } | null>(null);
  const { addXP, addCoins, dailyStreak } = useGameStore();

  // Voice chat states
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Enhanced states
  const [sidebarView, setSidebarView] = useState<'faqs' | 'insights' | 'actions' | 'notes'>('faqs');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSessionStats, setCurrentSessionStats] = useState<StudySession>({
    startTime: Date.now(),
    duration: 0,
    messagesCount: 0,
    topicsDiscussed: [],
    difficultyLevel: 'intermediate',
    engagement: 0
  });
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([]);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [studyGoal, setStudyGoal] = useState<string>('');
  const [focusMode, setFocusMode] = useState(false);
  const [chatTheme, setChatTheme] = useState<'light' | 'dark' | 'focus'>('light');
  const [studyTimer, setStudyTimer] = useState(0);
  const [isStudyTimerActive, setIsStudyTimerActive] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({ target: 120, current: 45 });
  const [weeklyStreak, setWeeklyStreak] = useState(7);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'reading' | 'kinesthetic'>('visual');
  const [messageSearch, setMessageSearch] = useState('');
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced timer effect
  useEffect(() => {
    if (isStudyTimerActive) {
      timerRef.current = setInterval(() => {
        setStudyTimer(prev => prev + 1);
        setCurrentSessionStats(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStudyTimerActive]);

  useEffect(() => {
    const topicData = localStorage.getItem('currentLearningTopic');
    if (topicData) {
      const parsedTopic = JSON.parse(topicData);
      setCurrentTopic(parsedTopic);
      setIsStudyTimerActive(true);
      
      // Enhanced welcome message
      getChatResponse([], parsedTopic.subject, parsedTopic.topic).then(response => {
        const welcomeMessage = {
          id: '1',
          type: 'bot' as const,
          content: `🎯 Welcome to your personalized AI learning session on **${parsedTopic.topic}**!\n\nI'm here to help you master this topic step by step. What would you like to start with?\n\n**Quick suggestions:**\n• Explain the key concepts\n• Practice with examples\n• Test my understanding\n• Show real-world applications`,
          timestamp: new Date(),
          complexity: 'beginner' as const,
          relatedTopics: [parsedTopic.subject]
        };
        setChatMessages([welcomeMessage]);
        setChatHistory([{ role: 'assistant', content: response }]);
        setCurrentSessionStats(prev => ({ ...prev, messagesCount: 1 }));
      });

      generateTopicSpecificFAQs(parsedTopic);
      generateLearningInsights(parsedTopic);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    setStudyStartTime(Date.now());

    return () => {
      if (studyStartTime) {
        const duration = (Date.now() - studyStartTime) / 1000 / 60;
        let xpReward = Math.floor(duration) * 8; // Increased XP
        let coinReward = Math.floor(duration) * 3; // Increased coins
        
        // Enhanced multipliers
        const streakMultiplier = 1 + (dailyStreak * 0.15);
        const engagementMultiplier = 1 + (currentSessionStats.engagement * 0.1);
        const difficultyMultiplier = difficulty === 'advanced' ? 1.5 : difficulty === 'intermediate' ? 1.2 : 1;
        
        xpReward = Math.round(xpReward * streakMultiplier * engagementMultiplier * difficultyMultiplier);
        coinReward = Math.round(coinReward * streakMultiplier * engagementMultiplier);
        
        addXP(xpReward);
        addCoins(coinReward);
        setShowReward({
          xp: xpReward,
          coins: coinReward,
          message: `🎉 Amazing session! ${Math.round(duration)} mins • ${currentSessionStats.messagesCount} interactions • ${weeklyStreak} day streak!`
        });
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder
      });
      
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;

    recorder.stopRecording(async () => {
      const blob = await recorder.getBlob();
      const audioFile = new File([blob], 'audio.webm', { type: 'audio/webm' });
      
      try {
        setIsTyping(true);
        const transcription = await speechToText(audioFile);
        
        if (transcription) {
          const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: transcription,
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, newUserMessage]);
          
          const updatedHistory = [
            ...chatHistory,
            { role: 'user', content: transcription }
          ];
          setChatHistory(updatedHistory);

          const response = await getChatResponse(
            updatedHistory,
            currentTopic?.subject || '',
            currentTopic?.topic || ''
          );

          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: response,
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, botResponse]);
          setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);

          if (audioEnabled) {
            await textToSpeech(response);
          }
        }
      } catch (error) {
        console.error('Error processing voice:', error);
      } finally {
        setIsTyping(false);
        setIsRecording(false);
        setRecorder(null);
      }
    });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const generateTopicSpecificFAQs = async (topic: { subject: string; topic: string }) => {
    setIsGeneratingFAQs(true);
    try {
      const newFAQs = await generateFAQs(topic.subject, topic.topic);
      // Enhanced FAQs with additional metadata
      const enhancedFAQs = newFAQs.map((faq: any, index: number) => ({
        ...faq,
        difficulty: ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard',
        category: topic.subject,
        popularity: Math.floor(Math.random() * 100) + 1,
        relatedQuestions: []
      }));
      setFaqs(enhancedFAQs);
    } catch (error) {
      console.error('Error generating FAQs:', error);
    } finally {
      setIsGeneratingFAQs(false);
    }
  };

  const generateLearningInsights = (topic: { subject: string; topic: string }) => {
    const insights: LearningInsight[] = [
      {
        type: 'strength',
        title: 'Strong Foundation',
        description: `Your ${learningStyle} learning style aligns well with ${topic.subject}`,
        icon: TrendingUp
      },
      {
        type: 'suggestion',
        title: 'Practice Recommendation',
        description: 'Try solving practice questions after this session',
        action: 'Take Practice Test',
        icon: Target
      },
      {
        type: 'weakness',
        title: 'Focus Area',
        description: 'Consider reviewing related fundamentals',
        icon: Lightbulb
      }
    ];
    setLearningInsights(insights);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMessageAction = (messageId: string, action: 'like' | 'dislike' | 'bookmark' | 'copy') => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        switch (action) {
          case 'like':
            return { ...msg, liked: !msg.liked, disliked: false };
          case 'dislike':
            return { ...msg, disliked: !msg.disliked, liked: false };
          case 'bookmark':
            return { ...msg, bookmarked: !msg.bookmarked };
          case 'copy':
            navigator.clipboard.writeText(msg.content);
            return msg;
          default:
            return msg;
        }
      }
      return msg;
    }));
  };

  const getQuickActions = (): QuickAction[] => [
    {
      id: 'explain',
      label: 'Explain',
      description: 'Get detailed explanation',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => setInputMessage('Can you explain this topic in detail?')
    },
    {
      id: 'examples',
      label: 'Examples',
      description: 'Show practical examples',
      icon: Lightbulb,
      color: 'from-yellow-500 to-yellow-600',
      action: () => setInputMessage('Can you give me some practical examples?')
    },
    {
      id: 'quiz',
      label: 'Quick Quiz',
      description: 'Test understanding',
      icon: ClipboardCheck,
      color: 'from-green-500 to-green-600',
      action: () => setInputMessage('Give me a quick quiz on this topic')
    },
    {
      id: 'summary',
      label: 'Summary',
      description: 'Key points recap',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      action: () => setInputMessage('Summarize the key points we discussed')
    },
    {
      id: 'real-world',
      label: 'Applications',
      description: 'Real-world uses',
      icon: Target,
      color: 'from-red-500 to-red-600',
      action: () => setInputMessage('How is this used in real world scenarios?')
    },
    {
      id: 'tips',
      label: 'Study Tips',
      description: 'Learning strategies',
      icon: Star,
      color: 'from-indigo-500 to-indigo-600',
      action: () => setInputMessage('What are the best ways to study this topic?')
    }
  ];

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentTopic) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      complexity: difficulty
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Update session stats
    setCurrentSessionStats(prev => ({
      ...prev,
      messagesCount: prev.messagesCount + 1,
      engagement: Math.min(prev.engagement + 0.1, 1)
    }));

    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: currentInput }
    ];
    setChatHistory(updatedHistory);

    try {
      const response = await getChatResponse(
        updatedHistory,
        currentTopic.subject,
        currentTopic.topic
      );

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        complexity: difficulty,
        relatedTopics: [currentTopic.subject],
        hasMedia: response.includes('```') || response.includes('*') || response.includes('#')
      };

      setChatMessages(prev => [...prev, botResponse]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);

      // Update session stats
      setCurrentSessionStats(prev => ({
        ...prev,
        messagesCount: prev.messagesCount + 1,
        topicsDiscussed: [...new Set([...prev.topicsDiscussed, currentTopic.topic])]
      }));

      if (audioEnabled) {
        await textToSpeech(response);
      }
    } catch (error) {
      console.error('Error getting chat response:', error);
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "😔 I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStartTest = () => {
    if (!currentTopic) return;
    
    localStorage.setItem('currentTestContext', JSON.stringify({
      subject: currentTopic.subject,
      topic: currentTopic.topic,
      description: currentTopic.description,
      timestamp: new Date().toISOString()
    }));

    navigate('/test2');
  };

  return (
    <>
      <DashboardLayout>
        {/* Modern Floating Command Bar */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl px-6 py-3 transition-all duration-300 hover:shadow-3xl">
          <div className="flex items-center gap-4">
            {/* AI Status */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="text-sm font-medium text-gray-900">AI Assistant</div>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Session Timer */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStudyTimerActive(!isStudyTimerActive)}
                className={`p-1.5 rounded-lg transition-all ${
                  isStudyTimerActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isStudyTimerActive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              </button>
              <div className="text-sm font-mono font-medium text-gray-700">{formatTime(studyTimer)}</div>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowMessageSearch(!showMessageSearch)}
                className={`p-1.5 rounded-lg transition-all ${
                  showMessageSearch ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Search conversation"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleAudio}
                className={`p-1.5 rounded-lg transition-all ${
                  audioEnabled ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-400'
                }`}
                title="Voice mode"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-1.5 rounded-lg transition-all ${
                  focusMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Focus mode"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Test Button */}
            <button
              onClick={handleStartTest}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Test</span>
            </button>
          </div>
        </div>

        {/* Modern Grid Layout */}
        <div className={`grid ${focusMode ? 'grid-cols-1' : 'grid-cols-12'} gap-6 h-[calc(100vh-2rem)] transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-40 bg-white p-6' : ''}`}>
          
          {/* Left Sidebar - Contextual Info */}
          {!focusMode && (
            <div className="col-span-3 space-y-4">
              {/* Topic Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{currentTopic?.topic || 'AI Learning'}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{currentTopic?.subject}</p>
                    
                    {/* Progress Indicators */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Session Progress</span>
                        <span>{Math.round(currentSessionStats.engagement * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${currentSessionStats.engagement * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path Navigator */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  Learning Path
                </h4>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Understand Concepts', status: 'completed', icon: CheckCircle },
                    { step: 2, title: 'Practice Examples', status: 'current', icon: PlayCircle },
                    { step: 3, title: 'Take Assessment', status: 'upcoming', icon: Clock },
                    { step: 4, title: 'Master Topic', status: 'upcoming', icon: Award }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'current' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          item.status === 'current' ? 'text-indigo-600' : 'text-gray-700'
                        }`}>
                          {item.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{currentSessionStats.messagesCount}</div>
                  <div className="text-xs text-gray-600">Messages</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{weeklyStreak}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className={`${focusMode ? 'col-span-12' : 'col-span-6'} flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-500`}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900">{currentTopic?.topic || 'AI Learning Assistant'}</h2>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageSquare className="w-3 h-3" />
                      <span>{currentSessionStats.messagesCount}</span>
                    </div>
                  </div>
                </div>
                
                {/* Learning Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="visual">👁️ Visual</option>
                    <option value="auditory">🎧 Auditory</option>
                    <option value="reading">📖 Reading</option>
                    <option value="kinesthetic">✋ Kinesthetic</option>
                  </select>
                  
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="beginner">🟢 Beginner</option>
                    <option value="intermediate">🟡 Intermediate</option>
                    <option value="advanced">🔴 Advanced</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              {showMessageSearch && (
                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      placeholder="Search conversation..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Modern Chat Messages */}
            <div className={`flex-1 overflow-y-auto px-6 py-4 space-y-4 ${focusMode ? 'bg-white' : 'bg-gradient-to-b from-gray-50/50 to-white'}`}>
              {chatMessages
                .filter(msg => !messageSearch || msg.content.toLowerCase().includes(messageSearch.toLowerCase()))
                .map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3 group`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Brain className="w-4 h-4" />
                    </div>
                  )}
                  <div 
                    className={`relative max-w-[75%] transition-all duration-200 ${
                      message.type === 'user'
                        ? 'ml-12'
                        : 'mr-12'
                    }`}
                  >
                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl shadow-sm border transition-all duration-200 group-hover:shadow-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-200'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}>
                      {/* Message Meta */}
                      {message.type === 'bot' && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            message.complexity === 'beginner' ? 'bg-green-100 text-green-700' :
                            message.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {message.complexity}
                          </span>
                          {message.hasMedia && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              📎 Rich
                            </span>
                          )}
                          <span className="text-xs text-gray-500 ml-auto">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      
                      {/* Message Content */}
                      <div className="prose prose-sm max-w-none">
                        <div className={`leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                          {message.content.split('**').map((part, i) => 
                            i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                          )}
                        </div>
                      </div>
                      
                      {/* Related Topics */}
                      {message.relatedTopics && message.relatedTopics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {message.relatedTopics.map((topic, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                              #{topic}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* User message timestamp */}
                      {message.type === 'user' && (
                        <div className="text-xs text-white/70 mt-2 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    {message.type === 'bot' && (
                      <div className="flex items-center justify-between mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMessageAction(message.id, 'like')}
                            className={`p-1 rounded transition-colors ${
                              message.liked ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMessageAction(message.id, 'dislike')}
                            className={`p-1 rounded transition-colors ${
                              message.disliked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMessageAction(message.id, 'bookmark')}
                            className={`p-1 rounded transition-colors ${
                              message.bookmarked ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMessageAction(message.id, 'copy')}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Smart Suggestions */}
              {chatMessages.length <= 1 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Quick Start
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getQuickActions().slice(0, 4).map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
                      >
                        <action.icon className="w-5 h-5 text-indigo-600 mb-2" />
                        <div className="text-sm font-medium text-gray-900">{action.label}</div>
                        <div className="text-xs text-gray-600">{action.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Modern Input Area */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                {/* Voice Input */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-3 rounded-full transition-all shadow-sm hover:shadow-md ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Voice input'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Main Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={`Ask about ${currentTopic?.topic || 'anything'}...`}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Actions */}
                <button
                  onClick={() => setChatMessages([])}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2 mt-3 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-sm font-medium">Listening...</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
              )}
            </div>
          </div>

          {/* Modern Right Sidebar */}
          {!focusMode && (
            <div className="col-span-3 space-y-6">
              {/* Sidebar Navigation */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Learning Tools</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${weeklyStreak > 0 ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <span>{weeklyStreak}d streak</span>
                  </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'faqs', icon: HelpCircle, label: 'Q&A', count: faqs.length },
                    { id: 'insights', icon: Lightbulb, label: 'Insights', count: learningInsights.length },
                    { id: 'actions', icon: Zap, label: 'Actions', count: 6 },
                    { id: 'notes', icon: BookOpen, label: 'Notes', count: null }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSidebarView(tab.id as any)}
                      className={`p-3 rounded-xl transition-all text-center relative ${
                        sidebarView === tab.id 
                          ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">{tab.label}</div>
                      {tab.count && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-xs flex items-center justify-center">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {sidebarView === 'faqs' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Smart Questions</h4>
                      <span className="text-xs text-gray-500">{faqs.length} questions</span>
                    </div>
                    
                    {faqs.map((faq, index) => (
                      <div key={faq.id} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full text-left"
                        >
                          <div className={`p-4 rounded-xl transition-all duration-300 border ${
                            faq.isOpen 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-indigo-200 transform scale-105' 
                              : 'bg-white hover:bg-indigo-50 border-gray-100 hover:border-indigo-200 hover:shadow-md'
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  faq.isOpen
                                    ? 'bg-white/20 text-white'
                                    : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                  {faq.isOpen ? (
                                    <Lightbulb className="w-4 h-4" />
                                  ) : (
                                    <HelpCircle className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-medium text-sm leading-tight ${
                                    faq.isOpen ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {faq.question}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      faq.difficulty === 'easy' ? 
                                        (faq.isOpen ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700') :
                                      faq.difficulty === 'medium' ?
                                        (faq.isOpen ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-700') :
                                        (faq.isOpen ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700')
                                    }`}>
                                      {faq.difficulty}
                                    </span>
                                    <span className={`text-xs ${
                                      faq.isOpen ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                      ♥ {faq.popularity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                                faq.isOpen ? 'rotate-180 text-white' : 'text-gray-400'
                              }`} />
                            </div>
                            
                            {faq.isOpen && (
                              <div className="mt-4 pl-11 text-white/90 text-sm leading-relaxed animate-fadeInUp">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}

                    {isGeneratingFAQs ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
                          </div>
                          <p className="text-sm text-gray-600">Generating smart questions...</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => generateTopicSpecificFAQs(currentTopic!)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all font-medium group shadow-sm hover:shadow-md"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGeneratingFAQs ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span>Refresh Questions</span>
                      </button>
                    )}
                  </div>
                )}

                {sidebarView === 'insights' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Learning Insights</h4>
                    {learningInsights.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-l-4 ${
                          insight.type === 'strength' ? 'bg-green-50 border-green-500' :
                          insight.type === 'suggestion' ? 'bg-blue-50 border-blue-500' :
                          'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <insight.icon className={`w-5 h-5 mt-0.5 ${
                            insight.type === 'strength' ? 'text-green-600' :
                            insight.type === 'suggestion' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`} />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm">{insight.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                            {insight.action && (
                              <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                {insight.action} →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sidebarView === 'actions' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {getQuickActions().map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={`p-3 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 text-center`}
                        >
                          <action.icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{action.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {sidebarView === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Personal Notes</h4>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={personalNotes}
                      onChange={(e) => setPersonalNotes(e.target.value)}
                      placeholder="Take notes during your learning session..."
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-sm"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Study Goal</label>
                      <input
                        type="text"
                        value={studyGoal}
                        onChange={(e) => setStudyGoal(e.target.value)}
                        placeholder="What do you want to achieve today?"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Learning Stats */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
                <h5 className="font-semibold text-gray-900 mb-3 text-sm">Session Stats</h5>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Timer className="w-3 h-3 text-indigo-500" />
                      <span>Duration</span>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">{formatTime(studyTimer)}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <MessageSquare className="w-3 h-3 text-purple-500" />
                      <span>Messages</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{currentSessionStats.messagesCount}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>Streak</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-600">{weeklyStreak}d</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>Focus</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">{Math.round(currentSessionStats.engagement * 100)}%</div>
                  </div>
                </div>
                
                {/* Daily Progress Bar */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Daily Goal</span>
                    <span>{dailyProgress.current}/{dailyProgress.target} min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((dailyProgress.current / dailyProgress.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* Audio Element for TTS */}
      <audio ref={audioRef} className="hidden" />

      {/* Reward Popup */}
      {showReward && (
        <RewardPopup
          reward={showReward}
          onClose={() => setShowReward(null)}
        />
      )}

      {/* Enhanced Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
        
        /* Prose styles for formatted messages */
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        .prose code {
          background: rgba(99, 102, 241, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.875em;
        }
        
        .prose ul, .prose ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        .prose li {
          margin: 0.25em 0;
        }
      `}</style>
    </>
  );
}

export default AILearningPlan2Page;