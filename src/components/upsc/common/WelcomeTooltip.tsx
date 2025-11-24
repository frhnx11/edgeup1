import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { generateSpeech } from '../../../services/elevenlabsAudio';

interface WelcomeTooltipProps {
  message: string;
  showDelay?: number;
}

export const WelcomeTooltip: React.FC<WelcomeTooltipProps> = ({
  message,
  showDelay = 500
}) => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;

    const initAudio = async () => {
      showTimer = setTimeout(async () => {
        setShowWelcomeMessage(true);
        setIsLoadingAudio(true);

        try {
          // Generate audio from ElevenLabs
          const audioUrl = await generateSpeech(message);
          audioUrlRef.current = audioUrl;

          // Create and play audio
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          // Hide tooltip when audio ends
          audio.onended = () => {
            setShowWelcomeMessage(false);
          };

          // Play audio
          await audio.play();
          setIsLoadingAudio(false);
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsLoadingAudio(false);
          // Fallback: hide after 5 seconds if audio fails
          setTimeout(() => {
            setShowWelcomeMessage(false);
          }, 5000);
        }
      }, showDelay);
    };

    initAudio();

    return () => {
      clearTimeout(showTimer);
      // Clean up audio resources
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [message, showDelay]);

  const handleDismissWelcome = () => {
    // Stop audio immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowWelcomeMessage(false);
  };

  return (
    <AnimatePresence>
      {showWelcomeMessage && (
        <>
          {/* Invisible backdrop to capture clicks */}
          <motion.div
            className="fixed inset-0 z-40"
            onClick={handleDismissWelcome}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Speech Bubble */}
          <motion.div
            className="fixed bottom-52 right-20 z-50 max-w-sm"
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
            <div
              className="relative rounded-2xl shadow-2xl p-5 pr-10"
              style={{
                background: 'linear-gradient(135deg, #8B7FF8 0%, #7B6FE8 50%, #6B5FD8 100%)',
                boxShadow: '0 8px 32px rgba(107, 95, 216, 0.4), 0 4px 16px rgba(139, 127, 248, 0.3)'
              }}
            >
              <button
                onClick={handleDismissWelcome}
                className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.p
                className="font-semibold text-base leading-relaxed"
                style={{
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                }}
              >
                {message}
              </motion.p>

              <div
                className="absolute -bottom-3 right-16 w-6 h-6 transform rotate-45"
                style={{ background: '#6B5FD8' }}
              ></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
