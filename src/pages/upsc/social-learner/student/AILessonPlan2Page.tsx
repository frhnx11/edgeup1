import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { 
  Brain, 
  Target, 
  RefreshCw,
  HelpCircle,
  Bot,
  Send,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Mic,
  Volume2,
  VolumeX,
  Lightbulb,
  BookOpen,
  Clock,
  MessageSquare,
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Layers,
  Activity,
  BarChart3,
  FileText,
  Headphones,
  MicOff,
  PauseCircle,
  PlayCircle,
  Settings,
  Flame
} from 'lucide-react';
import { generateFAQs, getChatResponse, speechToText, textToSpeech } from '../../../../utils/openai';
import { useGameStore } from '../../../../store/useGameStore';
import { RewardPopup } from '../../../../components/upsc/common/GameElements';
import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

export function AILessonPlan2Page() {
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
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const waveformRef = useRef<WaveSurfer>();
  const waveformContainerRef = useRef<HTMLDivElement>(null);

  // UI states
  const [activePanel, setActivePanel] = useState<'chat' | 'faq' | 'metrics'>('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);
  const [voiceMode, setVoiceMode] = useState<'text' | 'voice'>('text');

  // Study metrics
  const [studyMetrics, setStudyMetrics] = useState({
    timeSpent: 0,
    questionsAnswered: 0,
    conceptsCovered: 0,
    focusScore: 85,
    streakDays: dailyStreak || 0,
    xpEarned: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyMetrics(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
        focusScore: Math.min(100, prev.focusScore + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const topicData = localStorage.getItem('currentLearningTopic');
    if (topicData) {
      setCurrentTopic(JSON.parse(topicData));
    }

    // Initialize WaveSurfer
    if (waveformContainerRef.current && !waveformRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#4F46E5',
        barWidth: 2,
        barGap: 3,
        height: 50,
        cursorWidth: 0,
        interact: false,
        normalize: true,
        responsive: true
      });
    }

    return () => {
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const startRecording = async () => {
    try {
      // Stop any ongoing audio playback
      await textToSpeech('');
      
      // If already recording, stop it
      if (recordingState === 'recording') {
        stopRecording();
        return;
      }
      
      // If processing, do nothing
      if (recordingState === 'processing') {
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const newRecorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        timeSlice: 100, // Update visualization every 100ms
        ondataavailable: (blob) => {
          if (waveformRef.current) {
            waveformRef.current.loadBlob(blob);
          }
        }
      });
      
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setRecordingState('recording');

      // Start visualizing audio
      if (waveformRef.current) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        // Update waveform visualization
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateWaveform = () => {
          if (recordingState === 'recording') {
            analyser.getByteTimeDomainData(dataArray);
            waveformRef.current?.loadDecodedBuffer(dataArray);
            requestAnimationFrame(updateWaveform);
          }
        };
        updateWaveform();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Failed to start recording. Please check your microphone permissions.',
        timestamp: new Date()
      }]);
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;
    setRecordingState('processing');

    recorder.stopRecording(async () => {
      const blob = await recorder.getBlob();
      const audioFile = new File([blob], 'audio.webm', { type: 'audio/webm' });
      
      try {
        const transcription = await speechToText(audioFile);
        
        if (transcription) {
          const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: transcription,
            timestamp: new Date()
          };

          setChatMessages(prev => [...prev, newUserMessage]);
          
          setIsTyping(true);
          const response = await getChatResponse(
            [...chatHistory, { role: 'user', content: transcription }],
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
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Sorry, I had trouble processing your voice. Please try again or type your message.',
          timestamp: new Date()
        }]);
      } finally {
        // Clean up media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        setRecordingState('idle');
        setRecorder(null);
        setIsTyping(false);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Stop any ongoing audio playback
    await textToSpeech('');

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: inputMessage }
    ];
    setChatHistory(updatedHistory);

    try {
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
    } catch (error) {
      console.error('Error getting chat response:', error);
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const generateTopicSpecificFAQs = async (topic: { subject: string; topic: string }) => {
    setIsGeneratingFAQs(true);
    try {
      const newFAQs = await generateFAQs(topic.subject, topic.topic);
      setFaqs(newFAQs);
    } catch (error) {
      console.error('Error generating FAQs:', error);
    } finally {
      setIsGeneratingFAQs(false);
    }
  };

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Futuristic Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          </div>
        </div>

        {/* Main Container */}
        <div className="relative h-screen flex flex-col">
          {/* Modern Header */}
          <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left Section - Topic Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                  </div>
                  
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {currentTopic?.topic || 'AI Learning Assistant'}
                    </h1>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      {currentTopic?.subject || 'Advanced Learning Mode'}
                    </p>
                  </div>
                </div>

                {/* Center Section - Quick Stats */}
                <div className="hidden lg:flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-400">Active Session</span>
                  </div>
                  
                  <div className="flex items-center gap-6 bg-white/5 rounded-full px-6 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">{studyMetrics.streakDays} day streak</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{studyMetrics.xpEarned} XP</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3">
                  {/* Voice Mode Toggle */}
                  <div className="bg-white/5 rounded-xl p-1 backdrop-blur-sm">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setVoiceMode('text')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          voiceMode === 'text'
                            ? 'bg-white/20 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setVoiceMode('voice')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          voiceMode === 'voice'
                            ? 'bg-white/20 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Headphones className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Audio Toggle */}
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-xl transition-all backdrop-blur-sm ${
                      audioEnabled 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all backdrop-blur-sm border border-white/10"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>

                  {/* Take Test Button */}
                  <button
                    onClick={() => navigate('/test2')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium group"
                  >
                    <Target className="w-5 h-5" />
                    <span>Take Test</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Metrics Panel */}
            <aside className={`transition-all duration-300 ${showMetricsPanel ? 'w-80' : 'w-0'} overflow-hidden`}>
              <div className="h-full bg-black/30 backdrop-blur-xl border-r border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Study Metrics
                  </h3>
                  <button
                    onClick={() => setShowMetricsPanel(false)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Time Spent */}
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Study Time</span>
                      </div>
                      <span className="text-2xl font-bold">{studyMetrics.timeSpent}m</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(studyMetrics.timeSpent / 60 * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Questions Answered */}
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Questions</span>
                      </div>
                      <span className="text-2xl font-bold">{studyMetrics.questionsAnswered}</span>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i < studyMetrics.questionsAnswered 
                              ? 'bg-purple-500' 
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Concepts Covered */}
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Concepts</span>
                      </div>
                      <span className="text-2xl font-bold">{studyMetrics.conceptsCovered}</span>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                            i < studyMetrics.conceptsCovered 
                              ? 'bg-green-500' 
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Focus Score */}
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-gray-400">Focus Score</span>
                      </div>
                      <span className="text-2xl font-bold">{studyMetrics.focusScore}%</span>
                    </div>
                    <div className="relative h-32 flex items-center justify-center">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 48}`}
                          strokeDashoffset={`${2 * Math.PI * 48 * (1 - studyMetrics.focusScore / 100)}`}
                          className="text-amber-500 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {!showMetricsPanel && (
                    <button
                      onClick={() => setShowMetricsPanel(true)}
                      className="mb-4 p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  )}

                  {chatMessages.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Bot className="w-12 h-12 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Ready to learn!</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Ask me anything about {currentTopic?.topic || 'your topic'}. I'm here to help you understand concepts better.
                      </p>
                    </div>
                  )}

                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3 animate-fadeIn`}
                    >
                      {message.type === 'bot' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div 
                        className={`relative max-w-[70%] px-5 py-3 rounded-2xl backdrop-blur-sm ${
                          message.type === 'user'
                            ? 'bg-blue-500/20 text-white border border-blue-500/30'
                            : 'bg-white/5 text-gray-100 border border-white/10'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/5 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Modern Input Area */}
              <div className="bg-black/30 backdrop-blur-xl border-t border-white/10 p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Voice Visualization */}
                  {recordingState === 'recording' && (
                    <div className="mb-4 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <div ref={waveformContainerRef} className="w-full h-16 mb-2" />
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>Recording... Click microphone to stop</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Voice/Text Toggle */}
                    {voiceMode === 'voice' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={startRecording}
                          disabled={recordingState === 'processing'}
                          className={`p-4 rounded-xl transition-all ${
                            recordingState === 'recording' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                              : recordingState === 'processing'
                              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                              : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {recordingState === 'processing' ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : recordingState === 'recording' ? (
                            <MicOff className="w-5 h-5" />
                          ) : (
                            <Mic className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ) : null}

                    {/* Text Input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={voiceMode === 'voice' ? "Type or use voice input..." : "Ask anything about your studies..."}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-gray-500 text-white backdrop-blur-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <button
                      onClick={() => setActivePanel(activePanel === 'faq' ? 'chat' : 'faq')}
                      className={`p-4 rounded-xl transition-all ${
                        activePanel === 'faq'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Sidebar - FAQ Panel */}
            <aside className={`transition-all duration-300 ${activePanel === 'faq' ? 'w-96' : 'w-0'} overflow-hidden`}>
              <div className="h-full bg-black/30 backdrop-blur-xl border-l border-white/10 flex flex-col">
                <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      Smart Questions
                    </h3>
                    <button
                      onClick={() => setActivePanel('chat')}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {faqs.length === 0 && !isGeneratingFAQs && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="w-10 h-10 text-purple-400" />
                        </div>
                        <p className="text-gray-400 mb-4">No questions generated yet</p>
                        <button
                          onClick={() => currentTopic && generateTopicSpecificFAQs(currentTopic)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-medium"
                        >
                          Generate Smart Questions
                        </button>
                      </div>
                    )}

                    {faqs.map(faq => (
                      <div
                        key={faq.id}
                        className="bg-white/5 rounded-xl overflow-hidden transition-all hover:bg-white/10 backdrop-blur-sm border border-white/10"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full p-4 text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                faq.isOpen
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-white/10 text-gray-400'
                              }`}>
                                {faq.isOpen ? (
                                  <Lightbulb className="w-4 h-4" />
                                ) : (
                                  <HelpCircle className="w-4 h-4" />
                                )}
                              </div>
                              <span className="font-medium text-gray-100">{faq.question}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                              faq.isOpen ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </button>
                        
                        {faq.isOpen && (
                          <div className="px-4 pb-4 pt-2 border-t border-white/10">
                            <p className="text-gray-300 leading-relaxed pl-11">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {isGeneratingFAQs && (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                            <div className="relative w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">Generating smart questions...</p>
                        </div>
                      </div>
                    )}

                    {faqs.length > 0 && !isGeneratingFAQs && (
                      <button
                        onClick={() => currentTopic && generateTopicSpecificFAQs(currentTopic)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all font-medium backdrop-blur-sm border border-white/10"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh Questions</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Audio Element for TTS */}
        <audio ref={audioRef} className="hidden" />

        {/* Reward Popup */}
        {showReward && (
          <RewardPopup
            reward={showReward}
            onClose={() => setShowReward(null)}
          />
        )}
      </div>

    </DashboardLayout>
  );
}