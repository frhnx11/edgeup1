import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import Lottie from 'lottie-react';
import { simpleAudioTracker } from '../../../utils/simpleAudioTracker';
import { userInteractionTracker } from '../../../utils/userInteractionTracker';

// Audio file paths mapping
const VOICE_AUDIO_MAP: Record<string, string> = {
  'advanced-analytics': '/voice-audio/advanced-analytics.mp3',
  'leaderboard': '/voice-audio/leaderboard.mp3',
  'readiness-score': '/voice-audio/readiness-score.mp3',
  'test-analytics': '/voice-audio/test-analytics.mp3',
  'quizzes': '/voice-audio/quizzes.mp3',
  'calendar': '/voice-audio/calendar.mp3',
  'classes': '/voice-audio/classes.mp3',
  'performance': '/voice-audio/performance.mp3',
  'tasks': '/voice-audio/tasks.mp3',
  'resources': '/voice-audio/resources.mp3',
  'syllabus': '/voice-audio/syllabus.mp3',
  'tests': '/voice-audio/tests.mp3',
  'skills': '/voice-audio/skills.mp3',
  'question-generation': '/voice-audio/question-generation.mp3',
  'exam-correction': '/voice-audio/exam-correction.mp3',
  'mentor': '/voice-audio/mentor.mp3',
  'smart-gadgets': '/voice-audio/smart-gadgets.mp3',
  'pasco': '/voice-audio/pasco.mp3',
  'dashboard': '/voice-audio/dashboard.mp3',
  'ai-learning': '/voice-audio/ai-learning.mp3',
  'ai-lesson-plan': '/voice-audio/ai-lesson-plan.mp3',
  'test-page': '/voice-audio/test-page.mp3',
  'default': '/voice-audio/dashboard.mp3' // Use dashboard audio as default fallback
};

interface PreGeneratedVoiceAgentProps {
  messageKey: string; // Key to lookup pre-generated audio
  message: string; // Text to display
  autoPlay?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function PreGeneratedVoiceAgent({
  messageKey,
  message,
  autoPlay = true,
  position = 'bottom-right'
}: PreGeneratedVoiceAgentProps) {
  // Debug logging
  const userType = window.location.pathname.includes('academic-achiever')
    ? 'academic-achiever'
    : window.location.pathname.includes('social-learner')
    ? 'social-learner'
    : 'unknown';

  console.log('🔍 PreGeneratedVoiceAgent v6.12: INIT', {
    messageKey,
    userType,
    path: window.location.pathname,
    autoPlay
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);

  const lottieRef = useRef<any>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Function to trigger Lottie animation
  const triggerLottieAnimation = (play: boolean) => {
    if (lottieRef.current) {
      try {
        if (play) {
          lottieRef.current.play();
        } else {
          lottieRef.current.pause();
        }
      } catch (err) {
        console.error('Lottie animation error:', err);
      }
    }
  };

  // Stop audio and hide message
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }

    setIsPlaying(false);
    setShowMessage(false);
    triggerLottieAnimation(false);
    simpleAudioTracker.markAsStopped();
  };

  // Play pre-generated audio
  const playAudio = useCallback(() => {
    console.log('🎬 PreGeneratedVoiceAgent v6.12: playAudio called for key:', messageKey);

    // Clear waiting state if it was set
    setWaitingForInteraction(false);

    // Use simple tracker to check if should play
    if (!simpleAudioTracker.shouldPlay(messageKey)) {
      console.log('❌ Tracker says not to play');
      return;
    }

    console.log('🎵 PreGeneratedVoiceAgent v6.12: Starting playback for key:', messageKey);
    const audioPath = VOICE_AUDIO_MAP[messageKey];

    if (!audioPath) {
      console.warn(`❌ No audio file found for message key: ${messageKey}`);
      return;
    }

    console.log('🎵 Audio path:', audioPath);

    // Mark as playing in tracker
    simpleAudioTracker.markAsPlaying(messageKey);

    // Stop any existing audio first
    stopAudio();

    // Show message bubble
    setShowMessage(true);

    // Create and play audio
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      // Calculate when to hide message (audio duration + 500ms buffer)
      const hideDelay = (audio.duration * 1000) + 500;

      messageTimeoutRef.current = setTimeout(() => {
        setShowMessage(false);
        setIsPlaying(false);
        triggerLottieAnimation(false);
      }, hideDelay);
    };

    audio.onplay = () => {
      setIsPlaying(true);
      triggerLottieAnimation(true);
    };

    audio.onended = () => {
      setIsPlaying(false);
      triggerLottieAnimation(false);
      simpleAudioTracker.markAsStopped();
    };

    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setShowMessage(false);
      triggerLottieAnimation(false);
      simpleAudioTracker.markAsStopped();
    };

    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
      setShowMessage(false);
      simpleAudioTracker.markAsStopped();
    });
  }, [messageKey]);

  // Toggle playback
  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load animation:', error));
  }, []);

  // Track the previous messageKey to detect actual changes
  const prevMessageKeyRef = useRef<string | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedAutoplay = useRef(false);

  // Auto-play on mount or when messageKey changes
  useEffect(() => {
    console.log('🔄 PreGeneratedVoiceAgent v6.12: Auto-play effect', {
      messageKey,
      prevKey: prevMessageKeyRef.current,
      autoPlay,
      isVisible,
      hasUserInteracted: userInteractionTracker.hasUserInteracted(),
      hasAttempted: hasAttemptedAutoplay.current,
      userType
    });

    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    // Skip if messageKey hasn't actually changed (prevent StrictMode double render)
    if (prevMessageKeyRef.current === messageKey && hasAttemptedAutoplay.current) {
      return;
    }

    if (prevMessageKeyRef.current !== messageKey) {
      prevMessageKeyRef.current = messageKey;
      hasAttemptedAutoplay.current = false;
    }

    // Only play if autoPlay is enabled and visible
    if (autoPlay && isVisible && !hasAttemptedAutoplay.current) {
      // Check with simple tracker
      if (simpleAudioTracker.shouldPlay(messageKey)) {
        console.log('✅ PreGeneratedVoiceAgent v6.12: Will auto-play:', messageKey);
        hasAttemptedAutoplay.current = true;

        // Check if user has interacted
        if (userInteractionTracker.hasUserInteracted()) {
          // User has interacted, we can autoplay with a delay
          // v6.12: Longer delay for Social Learner dashboard due to lazy loading
          const delay = (messageKey === 'dashboard' && userType === 'social-learner') ? 1500 : 1000;
          console.log(`🎯 Setting autoplay timer for: ${messageKey} with ${delay}ms delay`);
          autoplayTimerRef.current = setTimeout(() => {
            console.log('⏰ Timer fired, calling playAudio for:', messageKey);
            playAudio();
          }, delay);
        } else {
          // Wait for user interaction
          console.log('⏳ Waiting for user interaction before autoplay');
          setWaitingForInteraction(true);
          userInteractionTracker.waitForInteraction(() => {
            // Check again if should play (user might have manually played it)
            if (simpleAudioTracker.shouldPlay(messageKey)) {
              console.log('👆 User interacted! Now playing:', messageKey);
              setWaitingForInteraction(false);
              playAudio();
            }
          });
        }
      }
    }

    // Cleanup function
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [messageKey, autoPlay, isVisible]); // Removed playAudio from deps to prevent re-renders

  // Fallback autoplay mechanism - runs after component stabilizes
  useEffect(() => {
    if (!autoPlay || !isVisible) return;

    // Only run fallback after a longer delay to ensure primary mechanism had a chance
    const fallbackTimer = setTimeout(() => {
      if (userInteractionTracker.hasUserInteracted() && simpleAudioTracker.shouldPlay(messageKey)) {
        console.log('🔧 Fallback autoplay mechanism triggered for:', messageKey);
        playAudio();
      }
    }, 2000); // 2 second fallback

    // Special handling for dashboard pages which use lazy loading
    if (messageKey === 'dashboard') {
      // v6.12: Even longer delay for Social Learner dashboards (4 seconds)
      const dashboardDelay = userType === 'social-learner' ? 4000 : 3000;
      const dashboardFallback = setTimeout(() => {
        if (userInteractionTracker.hasUserInteracted() && simpleAudioTracker.shouldPlay(messageKey)) {
          console.log(`🏠 Dashboard-specific fallback triggered for ${userType}:`, messageKey);
          playAudio();
        }
      }, dashboardDelay);

      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(dashboardFallback);
      };
    }

    return () => clearTimeout(fallbackTimer);
  }, [messageKey, autoPlay, isVisible, playAudio, userType]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Message Bubble */}
      <AnimatePresence>
        {showMessage && (
          <>
            {/* Invisible backdrop to capture clicks */}
            <motion.div
              className="fixed inset-0 z-[9998]"
              onClick={stopAudio}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Speech Bubble - Responsive */}
            <motion.div
              className={`fixed ${messageBubblePosition[position]} z-[9999] max-w-[280px] sm:max-w-sm`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              {/* Speech bubble container - Responsive padding */}
              <div
                className="relative rounded-2xl shadow-2xl p-4 pr-9 sm:p-5 sm:pr-10"
                style={{
                  background: 'linear-gradient(135deg, #8B7FF8 0%, #7B6FE8 50%, #6B5FD8 100%)',
                  boxShadow: '0 8px 32px rgba(107, 95, 216, 0.4), 0 4px 16px rgba(139, 127, 248, 0.3)'
                }}
              >
                {/* Close button */}
                <button
                  onClick={stopAudio}
                  className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors"
                  aria-label="Close message"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Message text - Responsive font size */}
                <motion.p
                  className="font-semibold text-sm sm:text-base leading-relaxed"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {message}
                </motion.p>

                {/* Speech bubble tail */}
                <div
                  className="absolute -bottom-3 right-16 w-6 h-6 transform rotate-45"
                  style={{
                    background: '#6B5FD8'
                  }}
                ></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Robot-Bot Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
        className={`fixed ${positionClasses[position]} z-[9999]`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
          <div className="relative group">
            {/* Pulsing rings when speaking */}
            {isPlaying && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-brand-primary/30"
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
                  className="absolute inset-0 rounded-full bg-brand-secondary/40"
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

            {/* Main Lottie Animation Container - Responsive Size */}
            <motion.div
              className={`relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-2xl cursor-pointer ${
                waitingForInteraction ? 'animate-bounce' : ''
              }`}
              style={{
                background: 'radial-gradient(circle at center, #B4A7FF 0%, #9B8FE8 40%, #7D6FD3 100%)'
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayback}
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

              {/* Sound wave effect */}
              {isPlaying && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white/90 rounded-full shadow-lg"
                      animate={{ height: [8, 20, 8] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Close button (appears on hover) */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: showTooltip ? 1 : 0,
                scale: showTooltip ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                stopAudio();
                setIsVisible(false);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X className="w-3 h-3" />
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && !isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-xl"
                >
                  {waitingForInteraction ? 'Click anywhere to enable audio' :
                   !simpleAudioTracker.shouldPlay(messageKey) ? 'Click to replay' : 'Click to play'}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </motion.div>
    </>
  );
}