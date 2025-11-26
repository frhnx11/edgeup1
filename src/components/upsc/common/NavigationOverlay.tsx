import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Navigation, MapPin } from 'lucide-react';
import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';

interface NavigationOverlayProps {
  isVisible: boolean;
  destination: string;
  onComplete?: () => void;
}

export function NavigationOverlay({ isVisible, destination, onComplete }: NavigationOverlayProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load animation:', error));
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      // Complete after animation
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 1200);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(109, 40, 217, 0.95) 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative z-10 text-center"
          >
            {/* Flying robot animation */}
            <motion.div
              className="relative mx-auto mb-6"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 w-36 h-36 mx-auto bg-white/30 rounded-full blur-2xl" />

              {/* Robot container */}
              <div
                className="relative w-36 h-36 mx-auto rounded-full overflow-hidden shadow-2xl"
                style={{
                  background: 'radial-gradient(circle at center, #B4A7FF 0%, #9B8FE8 40%, #7D6FD3 100%)'
                }}
              >
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bot className="w-16 h-16 text-white animate-pulse" />
                  </div>
                )}
              </div>

              {/* Navigation icon orbit */}
              <motion.div
                className="absolute top-1/2 left-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '0 0' }}
              >
                <div className="absolute -top-20 -left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6" />
                Navigating...
              </h2>
              <p className="text-white/80 text-lg font-medium">
                Taking you to <span className="text-white font-bold">{destination}</span>
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 w-64 mx-auto"
            >
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
