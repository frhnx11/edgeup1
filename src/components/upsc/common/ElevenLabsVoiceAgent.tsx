import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import Lottie from 'lottie-react';

// ==========================================
// BRAND NEW ELEVENLABS-ONLY AUDIO COMPONENT
// NO PRE-RECORDED AUDIO - ONLY ELEVENLABS API
// v5.2: Tracks played messages to prevent duplicates
// ==========================================

interface ElevenLabsVoiceAgentProps {
  message: string;
  autoPlay?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onComplete?: () => void;
}

export const ElevenLabsVoiceAgent = memo(function ElevenLabsVoiceAgent({
  message,
  autoPlay = true,
  position = 'bottom-right',
  onComplete
}: ElevenLabsVoiceAgentProps) {
  console.log('🎤✨ ElevenLabsVoiceAgent: BRAND NEW COMPONENT LOADED!');
  console.log('🎤✨ ElevenLabsVoiceAgent: Message:', message.substring(0, 50) + '...');
  console.log('🎤✨ ElevenLabsVoiceAgent: AutoPlay:', autoPlay);
  console.log('🎤✨ ElevenLabsVoiceAgent: ONLY ELEVENLABS - NO PRE-RECORDED AUDIO!');

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);

  const lottieRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioInstanceIdRef = useRef(0);
  const lastPlayedMessageRef = useRef<string>('');

  const words = message.split(' ');

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-40 right-6',
    'top-left': 'top-40 left-6'
  };

  // Trigger Lottie animation
  const triggerLottieAnimation = (play: boolean) => {
    if (lottieRef.current) {
      try {
        if (play) {
          lottieRef.current.play();
        } else {
          lottieRef.current.pause();
        }
      } catch (err) {
        console.error('Lottie error:', err);
      }
    }
  };

  // Stop all audio
  const stopAudio = useCallback(() => {
    console.log('🛑 ElevenLabsVoiceAgent: Stopping all audio');
    audioInstanceIdRef.current++;

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      } catch (e) {
        console.error('Error stopping audio:', e);
      }
    }

    // Stop browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setIsLoading(false);
    triggerLottieAnimation(false);
  }, []);

  // ElevenLabs Text-to-Speech
  const synthesizeSpeechElevenLabs = useCallback(async (text: string) => {
    console.log('🎤 ElevenLabsVoiceAgent: Starting ElevenLabs synthesis');

    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.error('❌ ElevenLabsVoiceAgent: No API key found!');
      alert('ElevenLabs API key is missing. Please add VITE_ELEVENLABS_API_KEY to your .env file');
      return false;
    }

    try {
      setIsLoading(true);
      audioInstanceIdRef.current++;
      const currentInstanceId = audioInstanceIdRef.current;

      const voiceId = 'qr9D67rNgxf5xNgv46nx'; // Your cloned voice

      console.log('🎤 ElevenLabsVoiceAgent: Calling ElevenLabs API with voice ID:', voiceId);

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
          optimize_streaming_latency: 4,
          output_format: 'mp3_44100_64'
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (currentInstanceId !== audioInstanceIdRef.current) {
        URL.revokeObjectURL(audioUrl);
        return false;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        console.log('🎤 ElevenLabsVoiceAgent: Audio loaded');
        setIsLoading(false);
      };

      audio.oncanplay = () => {
        console.log('🎤 ElevenLabsVoiceAgent: Audio ready to play');
        setIsLoading(false);
      };

      audio.onplay = () => {
        console.log('🎤 ElevenLabsVoiceAgent: Audio playing!');
        setIsPlaying(true);
        setIsLoading(false);
        triggerLottieAnimation(true);
      };

      audio.onended = () => {
        console.log('🎤 ElevenLabsVoiceAgent: Audio ended');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setIsPlaying(false);
        lastPlayedMessageRef.current = text; // Track which message was played
        triggerLottieAnimation(false);
        if (onComplete) {
          onComplete();
        }
      };

      audio.onerror = (event) => {
        console.error('❌ ElevenLabsVoiceAgent: Audio error:', event);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setIsPlaying(false);
        setIsLoading(false);
      };

      console.log('🎤 ElevenLabsVoiceAgent: Starting playback...');
      await audio.play();
      console.log('✅ ElevenLabsVoiceAgent: Playing successfully!');
      return true;

    } catch (error) {
      console.error('❌ ElevenLabsVoiceAgent: Error:', error);
      setIsLoading(false);
      setIsPlaying(false);
      return false;
    }
  }, [onComplete]);

  // Toggle playback
  const togglePlayback = useCallback(() => {
    console.log('🔘 ElevenLabsVoiceAgent: Toggle clicked! isPlaying:', isPlaying);
    if (isPlaying) {
      stopAudio();
    } else {
      synthesizeSpeechElevenLabs(message);
    }
  }, [isPlaying, message, stopAudio, synthesizeSpeechElevenLabs]);

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => {
        console.log('🎭 ElevenLabsVoiceAgent: Lottie animation loaded');
        setAnimationData(data);
      })
      .catch(error => {
        console.error('Lottie load error:', error);
      });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 ElevenLabsVoiceAgent: Cleaning up');
      stopAudio();
    };
  }, [stopAudio]);

  // Auto-play when message changes (only if it's different from last played)
  useEffect(() => {
    const hasAlreadyPlayed = lastPlayedMessageRef.current === message;

    console.log('🎵 ElevenLabsVoiceAgent: Auto-play check:', {
      autoPlay,
      message: message.substring(0, 30) + '...',
      lastPlayed: lastPlayedMessageRef.current.substring(0, 30) + '...',
      hasAlreadyPlayed,
      isVisible,
      isPlaying,
      isLoading
    });

    if (autoPlay && !hasAlreadyPlayed && isVisible && !isPlaying && !isLoading && message) {
      console.log('🎵 ElevenLabsVoiceAgent: AUTO-PLAY TRIGGERED for NEW message!');
      const timer = setTimeout(() => {
        console.log('🎵 ElevenLabsVoiceAgent: NOW PLAYING!');
        synthesizeSpeechElevenLabs(message);
      }, 500);

      return () => clearTimeout(timer);
    } else if (hasAlreadyPlayed) {
      console.log('⏭️ ElevenLabsVoiceAgent: Skipping - already played this message');
    }
  }, [autoPlay, message, isVisible, isPlaying, isLoading, synthesizeSpeechElevenLabs]);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
        className={`fixed ${positionClasses[position]} z-[999999]`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="relative group">
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/40"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Pulsing rings when speaking */}
          {isPlaying && !isLoading && (
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

          {/* Main Lottie Animation Container */}
          <motion.div
            className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl cursor-pointer"
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
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid meet'
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

            {/* Sound wave effect overlay */}
            {isPlaying && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/90 rounded-full shadow-lg"
                    animate={{
                      height: [8, 20, 8],
                    }}
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

          {/* Close button */}
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
                {lastPlayedMessageRef.current === message ? 'Click to replay' : 'Click to play'}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
