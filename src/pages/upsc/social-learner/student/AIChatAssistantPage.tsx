import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { stripMarkdown, formatDisplayText } from '../../../../utils/markdownStripper';
import {
  Brain,
  Target,
  RefreshCw,
  HelpCircle,
  Bot,
  Send,
  User,
  ChevronDown,
  Sparkles,
  Mic,
  Volume2,
  VolumeX,
  Lightbulb,
  Clock,
  MessageSquare,
  ArrowRight,
  Flame,
  BookmarkPlus,
  Download,
  Share2,
  Loader2,
  GraduationCap,
  Star,
  ChevronRight,
  FileText,
  Headphones,
  MicOff,
  PauseCircle,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { generateClaudeFAQs, getClaudeChatResponseStream, speechToText, textToSpeech, stopCurrentAudio, preloadVoices } from '../../../../utils/claude';
import { useGameStore } from '../../../../store/useGameStore';
import { RewardPopup } from '../../../../components/upsc/common/GameElements';
import { ConversationalAI } from '../../../../components/upsc/common/ConversationalAI';
import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';
import { motion, AnimatePresence } from 'framer-motion';

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
const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  return (
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
  );
};

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

export function AIChatAssistantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentTopic, setCurrentTopic] = useState<{
    subject: string;
    topic: string;
    description: string;
    instructor?: {
      name: string;
      expertise: string;
      rating: number;
      experience: string;
      image?: string;
    };
    schedule?: {
      date: string;
      time: string;
      duration: string;
    };
    difficulty?: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState<number | null>(null);
  const [showReward, setShowReward] = useState<{ xp: number; coins: number; message: string } | null>(null);
  const { addXP, addCoins, dailyStreak } = useGameStore();

  // Voice chat states
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [canStopAudio, setCanStopAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const waveformRef = useRef<WaveSurfer>();
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const isTTSActiveRef = useRef<boolean>(false);

  // UI states
  const [activePanel, setActivePanel] = useState<'chat' | 'faq'>('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'text' | 'voice'>('text');
  const [showTeacherProfile, setShowTeacherProfile] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    localStorage.getItem('preferredLanguage') || 'en'
  );

  // Streaming state
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const streamAbortControllerRef = useRef<AbortController | null>(null);
  const accumulatedTextRef = useRef<string>('');
  const ttsQueueRef = useRef<string>('');
  const isTTSProcessingRef = useRef<boolean>(false);

  // Language configuration
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];

  const [bookmarks, setBookmarks] = useState<Array<{
    id: string;
    message: ChatMessage;
    timestamp: Date;
  }>>([]);

  // Conversational AI states
  const [elevenLabsAgentId] = useState<string>(
    localStorage.getItem('elevenLabsAgentId') || import.meta.env.VITE_ELEVENLABS_AGENT_ID || ''
  );
  const [isConversationalAIConnected, setIsConversationalAIConnected] = useState(false);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    preloadVoices();

    let topicInfo = null;

    if (location.state?.topic) {
      topicInfo = location.state.topic;
      localStorage.setItem('currentLearningTopic', JSON.stringify(topicInfo));
    } else {
      const topicData = localStorage.getItem('currentLearningTopic');
      if (topicData) {
        topicInfo = JSON.parse(topicData);
      }
    }

    if (topicInfo) {
      setCurrentTopic(topicInfo);

      const welcomeMessage = `Hi! 👋

I see you've just attended the ${topicInfo.subject} class on "${topicInfo.topic}" taught by ${topicInfo.instructor?.name || 'your instructor'}${topicInfo.instructor?.expertise ? `, ${topicInfo.instructor.expertise}` : ''}.

${topicInfo.description || ''}

I'm here to help you with:

📚 Comprehensive study notes and explanations
🔗 Related reference materials and resources
📊 Visual explanations and concept breakdowns
💡 Practice questions and examples
🎯 Key concepts and important takeaways

Just let me know what you'd like to explore!`;

      const initialMessage: ChatMessage = {
        id: 'initial-' + Date.now(),
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      };

      setChatMessages([initialMessage]);
      setChatHistory([{ role: 'assistant', content: welcomeMessage }]);
    }

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
  }, [location.state]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!studyStartTime) {
      setStudyStartTime(Date.now());
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
      isTTSActiveRef.current = false;
    };
  }, []);

  const startRecording = async () => {
    try {
      if (isPlayingAudio) {
        stopCurrentAudio();
        setIsPlayingAudio(false);
        setCanStopAudio(false);
      }

      if (recordingState === 'recording') {
        stopRecording();
        return;
      }

      if (recordingState === 'processing') {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;

      const newRecorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        sampleRate: 44100,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        timeSlice: 100,
        ondataavailable: (blob) => {
          if (waveformRef.current) {
            const url = URL.createObjectURL(blob);
            waveformRef.current.load(url);
            waveformRef.current.play();
          }
        }
      });

      newRecorder.startRecording();
      setRecorder(newRecorder);
      setRecordingState('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (!recorder) return;

    setRecordingState('processing');

    recorder.stopRecording(async () => {
      const blob = recorder.getBlob();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (waveformRef.current) {
        waveformRef.current.pause();
      }

      try {
        const transcribedText = await speechToText(blob, selectedLanguage);

        if (transcribedText) {
          setInputMessage(transcribedText);
          await handleSendMessage(transcribedText);
        }
      } catch (error) {
        console.error('Transcription error:', error);
        alert('Failed to transcribe audio. Please try again.');
      } finally {
        setRecordingState('idle');
        setRecorder(null);
      }
    });
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    stopCurrentAudio();
    setIsPlayingAudio(false);
    setCanStopAudio(false);

    if (streamingMessageId) {
      streamAbortControllerRef.current?.abort();
      setStreamingMessageId(null);
    }

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const updatedHistory = [
      ...chatHistory,
      { role: 'user' as const, content: textToSend }
    ];
    setChatHistory(updatedHistory);

    try {
      const botMessageId = 'bot-' + Date.now();
      setStreamingMessageId(botMessageId);

      const abortController = new AbortController();
      streamAbortControllerRef.current = abortController;

      const botMessage: ChatMessage = {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);

      accumulatedTextRef.current = '';
      ttsQueueRef.current = '';
      isTTSProcessingRef.current = false;

      let fullResponse = '';

      // Provide subject and topic context for the AI
      const subject = currentTopic?.subject || 'General Studies';
      const topic = currentTopic?.topic || 'Learning';

      await getClaudeChatResponseStream(
        updatedHistory,
        subject,
        topic,
        selectedLanguage,
        (chunk) => {
          if (abortController.signal.aborted) return;

          fullResponse += chunk;
          accumulatedTextRef.current += chunk;
          ttsQueueRef.current += chunk;

          setChatMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, content: fullResponse }
                : msg
            )
          );

          if (audioEnabled && (ttsQueueRef.current.includes('.') || ttsQueueRef.current.includes('!') || ttsQueueRef.current.includes('?'))) {
            const sentences = ttsQueueRef.current.match(/[^.!?]+[.!?]+/g);
            if (sentences && sentences.length > 0 && !isTTSProcessingRef.current) {
              isTTSProcessingRef.current = true;
              const sentenceToSpeak = sentences[0].trim();
              ttsQueueRef.current = ttsQueueRef.current.substring(sentenceToSpeak.length);

              if (sentenceToSpeak.length > 10) {
                setIsPlayingAudio(true);
                setCanStopAudio(true);
                textToSpeech(sentenceToSpeak, selectedLanguage).finally(() => {
                  isTTSProcessingRef.current = false;
                  setIsPlayingAudio(false);
                  setCanStopAudio(false);
                });
              } else {
                isTTSProcessingRef.current = false;
              }
            }
          }
        },
        abortController.signal
      );

      setStreamingMessageId(null);
      setChatHistory([...updatedHistory, { role: 'assistant', content: fullResponse }]);

      if (audioEnabled && ttsQueueRef.current.trim().length > 10) {
        setIsPlayingAudio(true);
        setCanStopAudio(true);
        textToSpeech(ttsQueueRef.current.trim(), selectedLanguage).finally(() => {
          setIsPlayingAudio(false);
          setCanStopAudio(false);
        });
      }

      const studyTime = studyStartTime ? Math.floor((Date.now() - studyStartTime) / 1000 / 60) : 0;
      if (studyTime >= 5 && chatMessages.length > 3) {
        const xpGained = Math.min(studyTime * 2, 50);
        const coinsGained = Math.floor(xpGained / 10);
        addXP(xpGained);
        addCoins(coinsGained);
        setShowReward({
          xp: xpGained,
          coins: coinsGained,
          message: `Great study session! ${studyTime} minutes of focused learning!`
        });
      }

    } catch (error) {
      console.error('Error getting AI response:', error);

      if (streamAbortControllerRef.current?.signal.aborted) {
        console.log('Stream was cancelled by user');
      } else {
        const errorMessage: ChatMessage = {
          id: 'error-' + Date.now(),
          type: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  const generateTopicSpecificFAQs = async (topic: typeof currentTopic) => {
    if (!topic) return;

    setIsGeneratingFAQs(true);
    try {
      const subject = topic.subject || 'General Studies';
      const topicName = topic.topic || 'Learning';

      const generatedFAQs = await generateClaudeFAQs(subject, topicName, selectedLanguage);
      setFaqs(generatedFAQs.map(faq => ({
        ...faq,
        isOpen: false
      })));
    } catch (error) {
      console.error('Failed to generate FAQs:', error);
    } finally {
      setIsGeneratingFAQs(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    setFaqs(faqs.map(faq =>
      faq.id === faqId ? { ...faq, isOpen: !faq.isOpen } : faq
    ));
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopCurrentAudio();
      setIsPlayingAudio(false);
      setCanStopAudio(false);
    }
    setAudioEnabled(!audioEnabled);
  };

  const stopAudioPlayback = () => {
    stopCurrentAudio();
    setIsPlayingAudio(false);
    setCanStopAudio(false);

    if (streamingMessageId) {
      streamAbortControllerRef.current?.abort();
      setStreamingMessageId(null);
    }
  };

  const bookmarkMessage = (message: ChatMessage) => {
    const bookmark = {
      id: 'bookmark-' + Date.now(),
      message,
      timestamp: new Date()
    };
    setBookmarks(prev => [...prev, bookmark]);
  };

  const exportChat = () => {
    const chatText = chatMessages
      .map(msg => `[${msg.type.toUpperCase()}] ${new Date(msg.timestamp).toLocaleString()}\n${msg.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    const chatText = chatMessages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    if (navigator.share) {
      navigator.share({
        title: 'AI Chat Export',
        text: chatText
      });
    } else {
      navigator.clipboard.writeText(chatText);
      alert('Chat copied to clipboard!');
    }
  };

  const handleConversationalAIMessage = (message: string) => {
    const botMessage: ChatMessage = {
      id: 'voice-ai-' + Date.now(),
      type: 'bot',
      content: message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, botMessage]);
  };

  const totalMessages = chatMessages.length;
  const studyDuration = studyStartTime ? Math.floor((Date.now() - studyStartTime) / 1000 / 60) : 0;

  return (
    <DashboardLayout>
      <div className={`flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-blue-50/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Modern Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                  {/* Branding & Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-base font-bold text-gray-900">AI Study Assistant</h1>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isPlayingAudio || recordingState === 'recording' || isConversationalAIConnected ? 'bg-green-500' : 'bg-gray-400'
                          } ${isPlayingAudio || recordingState === 'recording' ? 'animate-pulse' : ''}`} />
                          <span className="text-xs text-gray-600">
                            {isPlayingAudio ? 'Speaking' :
                            recordingState === 'recording' ? 'Listening' :
                            recordingState === 'processing' ? 'Processing' :
                            isConversationalAIConnected ? 'Voice Active' :
                            'Ready'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Mode Toggles */}
                    <div className="bg-gray-100 rounded-lg p-0.5 flex gap-0.5">
                      <button
                        onClick={() => setVoiceMode('text')}
                        className={`p-2 rounded-md transition-all ${
                          voiceMode === 'text'
                            ? 'bg-white shadow-sm text-brand-primary'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Text Mode"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setVoiceMode('voice')}
                        className={`p-2 rounded-md transition-all ${
                          voiceMode === 'voice'
                            ? 'bg-white shadow-sm text-brand-primary'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Voice Mode"
                      >
                        <Headphones className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Audio Toggle */}
                    <button
                      onClick={toggleAudio}
                      className={`p-2 rounded-lg transition-all ${
                        audioEnabled
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={audioEnabled ? 'Disable Audio' : 'Enable Audio'}
                    >
                      {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    {/* Language Selector */}
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-gray-100 border-0 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300" />

                    {/* Action Buttons */}
                    <button
                      onClick={exportChat}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                      title="Export Chat"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={shareChat}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                      title="Share Chat"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActivePanel(activePanel === 'faq' ? 'chat' : 'faq')}
                      className={`p-2 rounded-lg transition-all ${
                        activePanel === 'faq'
                          ? 'bg-brand-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      title="FAQ"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    {/* Primary CTA */}
                    <button
                      onClick={() => navigate('/test2')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-md transition-all font-medium ml-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Take Test</span>
                    </button>
                  </div>
              </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden gap-0 min-h-0 max-w-7xl mx-auto w-full">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className="group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-brand-primary text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}>
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{formatDisplayText(message.content)}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.type === 'bot' && (
                            <button
                              onClick={() => bookmarkMessage(message)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                              title="Bookmark"
                            >
                              <BookmarkPlus className="w-3 h-3 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-700" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && !streamingMessageId && (
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto px-6 py-4">
                {/* Quick Response Buttons */}
                {chatMessages.length === 1 && chatMessages[0].id.startsWith('initial-') && (
                  <motion.div
                    className="mb-3 flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {[
                      { emoji: '📚', text: 'Study Notes', msg: 'Please provide comprehensive study notes on this topic.' },
                      { emoji: '🔗', text: 'Resources', msg: 'Show me related reference materials and resources.' },
                      { emoji: '💡', text: 'Practice Questions', msg: 'I need practice questions and examples.' },
                      { emoji: '🎯', text: 'Key Concepts', msg: 'Explain the key concepts and takeaways.' }
                    ].map((button, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(button.msg)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                      >
                        <span className="mr-1.5">{button.emoji}</span>
                        {button.text}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Voice Recording Indicator */}
                {recordingState === 'recording' && (
                  <div className="mb-3 bg-red-50 rounded-lg p-3 border border-red-200">
                    <div ref={waveformContainerRef} className="w-full h-12 mb-2" />
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span>Recording... Click mic to stop</span>
                    </div>
                  </div>
                )}

                {recordingState === 'processing' && (
                  <div className="mb-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Processing your voice...</span>
                    </div>
                  </div>
                )}

                {/* AI Speaking Indicator */}
                {(isPlayingAudio || streamingMessageId) && (
                  <div className="mb-3 bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-green-600 animate-pulse" />
                        <span className="text-sm text-gray-700">
                          {isPlayingAudio ? 'AI is speaking...' : 'AI is responding...'}
                        </span>
                      </div>
                      <button
                        onClick={stopAudioPlayback}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-medium"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Voice Input Button */}
                  {voiceMode === 'voice' && (
                    <button
                      onClick={startRecording}
                      disabled={recordingState === 'processing'}
                      className={`p-3 rounded-lg transition-all ${
                        recordingState === 'recording'
                          ? 'bg-red-500 text-white'
                          : recordingState === 'processing'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {recordingState === 'processing' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : recordingState === 'recording' ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {/* Text Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask anything about your studies..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-900 placeholder-gray-500"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversational AI Controls */}
              {elevenLabsAgentId && (
                <div className="mt-3 flex justify-center">
                  <ConversationalAI
                    agentId={elevenLabsAgentId}
                    onMessageReceived={handleConversationalAIMessage}
                    onStatusChange={(status) => console.log('Status:', status)}
                    onConnectionChange={setIsConversationalAIConnected}
                    onConversationReady={() => {}}
                    showTranscript={false}
                    embedded={true}
                    autoStart={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - FAQ/Teacher Profile */}
          {(activePanel === 'faq' || (showTeacherProfile && currentTopic?.instructor)) && (
            <motion.div
              className="w-80 flex flex-col bg-gray-50 border-l border-gray-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
            {/* FAQ Panel */}
            {activePanel === 'faq' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-primary" />
                      Smart Questions
                    </h3>
                    <button
                      onClick={() => setActivePanel('chat')}
                      className="p-1 rounded-lg hover:bg-gray-200 text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {faqs.length === 0 && !isGeneratingFAQs && (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No questions yet</p>
                      <button
                        onClick={() => currentTopic && generateTopicSpecificFAQs(currentTopic)}
                        className="px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-all"
                      >
                        Generate Questions
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {faqs.map(faq => (
                      <div key={faq.id} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <HelpCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${faq.isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {faq.isOpen && (
                          <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed pl-6">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isGeneratingFAQs && (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                      <p className="text-sm text-gray-600">Generating questions...</p>
                    </div>
                  )}

                  {faqs.length > 0 && (
                    <button
                      onClick={() => currentTopic && generateTopicSpecificFAQs(currentTopic)}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium border border-gray-200 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Teacher Profile */}
            {showTeacherProfile && currentTopic?.instructor && activePanel !== 'faq' && (
              <div className="rounded-lg overflow-hidden bg-white border border-gray-200 m-4">
                <div className="p-4 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Your Instructor
                    </h3>
                    <button
                      onClick={() => setShowTeacherProfile(false)}
                      className="p-1 rounded-lg hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white p-1">
                        <img
                          src={currentTopic.instructor.image || '/Cheziyan.png'}
                          alt={currentTopic.instructor.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                        <Star className="w-3 h-3 text-yellow-900 fill-current" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{currentTopic.instructor.name}</h4>
                      <p className="text-white/90 text-xs">{currentTopic.instructor.expertise}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span className="text-xs font-medium">{currentTopic.instructor.rating}</span>
                        <span className="text-xs text-white/70">•</span>
                        <span className="text-xs text-white/80">{currentTopic.instructor.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Class Info */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-brand-primary" />
                      Today's Class
                    </h5>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><span className="font-medium">Subject:</span> {currentTopic.subject}</p>
                      <p><span className="font-medium">Topic:</span> {currentTopic.topic}</p>
                      <p><span className="font-medium">Duration:</span> {currentTopic.schedule?.duration}</p>
                    </div>
                  </div>

                  <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-all font-medium text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Ask Instructor
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Reward Popup */}
      {showReward && (
        <RewardPopup
          reward={showReward}
          onClose={() => setShowReward(null)}
        />
      )}
    </DashboardLayout>
  );
}
