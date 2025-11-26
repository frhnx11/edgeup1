import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import Lottie from 'lottie-react';
import { generateSpeech } from '../../../services/elevenlabsAudio';
import { ChatPopup } from './ChatPopup';

// Voice messages for all tabs
const TAB_MESSAGES: Record<string, string> = {
  // Main pages
  'dashboard': "Hello Social Learner! Welcome to your Dashboard.",

  // Social Learner tabs
  'reels': "Watch educational reels and learn on the go!",
  'messages': "Connect and chat with your study buddies!",
  'study-groups': "Join study groups and learn together!",
  'quizzes': "Challenge yourself with fun quizzes!",

  // Study tabs
  'calendar': "Plan your study schedule and track important dates!",
  'classes': "Access live and recorded classes from expert faculty!",
  'performance': "Track your progress and identify areas to improve!",
  'tasks': "Manage your assignments and stay on top of deadlines!",
  'resources': "Access curated study materials and resources!",
  'syllabus': "Monitor your syllabus coverage and track completion!",
  'tests': "Practice with mock tests and evaluate your readiness!",

  // Development tabs
  'skills': "Develop essential skills for exam success!",
  'question-generation': "Generate custom practice questions with AI!",
  'exam-correction': "Get AI-powered feedback on your answers!",

  // Personal tabs
  'mentor': "Connect with mentors for personalized guidance!",
  'smart-gadgets': "Track your study habits with smart devices!",
  'pasco': "Assess your learning profile and strengths!",
};

interface PreGeneratedVoiceAgentProps {
  currentTab?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function PreGeneratedVoiceAgent({
  currentTab = 'dashboard',
  position = 'bottom-right'
}: PreGeneratedVoiceAgentProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showChatPopup, setShowChatPopup] = useState(() => {
    return localStorage.getItem('chatPopupOpen') === 'true';
  });

  const lottieRef = useRef<any>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTabRef = useRef<string | null>(null);
  const isFirstMount = useRef(true);

  // Position classes - responsive
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6',
    'top-right': 'top-20 right-4 sm:top-40 sm:right-6',
    'top-left': 'top-20 left-4 sm:top-40 sm:left-6'
  };

  // Message bubble position (relative to bot) - responsive
  const messageBubblePosition = {
    'bottom-right': 'bottom-32 right-4 sm:bottom-52 sm:right-20',
    'bottom-left': 'bottom-32 left-4 sm:bottom-52 sm:left-20',
    'top-right': 'top-32 right-4 sm:top-52 sm:right-20',
    'top-left': 'top-32 left-4 sm:top-52 sm:left-20'
  };

  // Stop audio immediately
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Hide message and stop audio immediately
  const hideMessage = useCallback(() => {
    stopAudio();
    setShowMessage(false);
    setCurrentMessage('');
  }, [stopAudio]);

  // Play voice message with ElevenLabs
  const playVoiceMessage = useCallback(async (message: string) => {
    // Stop any existing audio first
    stopAudio();

    // Check if text popups are disabled
    const isTextDisabled = localStorage.getItem('eustad-text-disabled') === 'true';
    if (isTextDisabled) {
      return; // Don't show any text or play audio
    }

    // Show text immediately
    setCurrentMessage(message);
    setShowMessage(true);

    // Check if audio is muted
    const isAudioMuted = localStorage.getItem('eustad-audio-muted') === 'true';

    if (isAudioMuted) {
      // Just show text, no audio - hide after 4 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 4000);
      return;
    }

    try {
      setIsPlaying(true);
      const audioUrl = await generateSpeech(message);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        // Hide message shortly after audio ends
        setShowMessage(false);
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setIsPlaying(false);
        // Keep text visible longer if audio fails
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing voice message:', error);
      setIsPlaying(false);
      // Keep text visible longer if audio fails to load
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }, [stopAudio]);

  // Persist chat popup state to localStorage
  useEffect(() => {
    localStorage.setItem('chatPopupOpen', String(showChatPopup));
  }, [showChatPopup]);

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load animation:', error));
  }, []);

  // Play voice message when tab changes OR on first mount
  useEffect(() => {
    const message = TAB_MESSAGES[currentTab];

    if (message) {
      // Play on first mount or when tab actually changes
      if (isFirstMount.current || currentTab !== previousTabRef.current) {
        isFirstMount.current = false;
        previousTabRef.current = currentTab;

        // Play immediately, no delay
        playVoiceMessage(message);
      }
    }
  }, [currentTab, playVoiceMessage]);

  // Global click listener to dismiss message and stop audio
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // If message is showing and user clicks anywhere (except the robot itself)
      if (showMessage) {
        const target = e.target as HTMLElement;
        // Check if click is outside the robot avatar
        if (!target.closest('[data-voice-agent]')) {
          hideMessage();
        }
      }
    };

    // Add listener
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [showMessage, hideMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Chat Popup */}
      <AnimatePresence>
        {showChatPopup && (
          <ChatPopup
            isOpen={showChatPopup}
            onClose={() => setShowChatPopup(false)}
          />
        )}
      </AnimatePresence>

      {/* Message Bubble */}
      <AnimatePresence>
        {showMessage && currentMessage && (
          <motion.div
            className={`fixed ${messageBubblePosition[position]} z-[9999] max-w-[280px] sm:max-w-sm`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div
              className="relative rounded-2xl shadow-2xl p-4 pr-9 sm:p-5 sm:pr-10"
              style={{
                background: 'linear-gradient(135deg, #8B7FF8 0%, #7B6FE8 50%, #6B5FD8 100%)',
                boxShadow: '0 8px 32px rgba(107, 95, 216, 0.4), 0 4px 16px rgba(139, 127, 248, 0.3)'
              }}
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hideMessage();
                }}
                className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors"
                aria-label="Close message"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Message text */}
              <p
                className="font-semibold text-sm sm:text-base leading-relaxed"
                style={{
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                }}
              >
                {currentMessage}
              </p>

              {/* Speech bubble tail */}
              <div
                className="absolute -bottom-3 right-16 w-6 h-6 transform rotate-45"
                style={{ background: '#6B5FD8' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot-Bot Avatar */}
      <motion.div
        data-voice-agent="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
        className={`fixed ${positionClasses[position]} z-[9999]`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="relative group" data-voice-agent="true">
          {/* Pulsing rings when speaking */}
          {isPlaying && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/30"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-400/40"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3
                }}
              />
            </>
          )}

          {/* Main Lottie Animation Container */}
          <motion.div
            data-voice-agent="true"
            className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-2xl cursor-pointer"
            style={{
              background: 'radial-gradient(circle at center, #B4A7FF 0%, #9B8FE8 40%, #7D6FD3 100%)'
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // Hide voice message and open chat popup
              hideMessage();
              setShowChatPopup(true);
            }}
          >
            {animationData ? (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Bot className="w-16 h-16 text-purple-300 animate-pulse" />
              </div>
            )}

            {/* Animated border when speaking */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/60"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
          </motion.div>

          {/* Close button (appears on hover) */}
          <motion.button
            data-voice-agent="true"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: showTooltip ? 1 : 0,
              scale: showTooltip ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              hideMessage();
              setIsVisible(false);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-3 h-3" />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
