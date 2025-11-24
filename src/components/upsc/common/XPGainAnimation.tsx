import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface XPGain {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
}

interface XPGainAnimationProps {
  xpGain: XPGain | null;
  onComplete?: () => void;
}

export const XPGainAnimation: React.FC<XPGainAnimationProps> = ({ xpGain, onComplete }) => {
  useEffect(() => {
    if (xpGain) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [xpGain, onComplete]);

  return (
    <AnimatePresence>
      {xpGain && (
        <motion.div
          key={xpGain.id}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed bottom-24 right-8 z-40"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-2xl shadow-amber-500/50 min-w-[200px]">
            {/* Sparkle effects */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -30]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    ease: 'easeOut'
                  }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut'
                }}
              >
                <Zap className="w-8 h-8 text-white fill-white" />
              </motion.div>

              <div>
                <motion.div
                  className="text-2xl font-bold text-white flex items-center gap-1"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  +{xpGain.amount}
                  <span className="text-sm font-medium">XP</span>
                </motion.div>
                <p className="text-xs text-white/90 mt-0.5">{xpGain.reason}</p>
              </div>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// XP Progress Bar with level
interface XPProgressBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  requiredXP,
  level,
  showLabel = true,
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min((currentXP / requiredXP) * 100, 100);

  const heightMap = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className={`flex items-center justify-between mb-2 ${textSizeMap[size]}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {level}
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Level {level}
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className={`relative ${heightMap[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-full"
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Percentage text on larger sizes */}
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Level Up Animation
interface LevelUpAnimationProps {
  show: boolean;
  newLevel: number;
  onComplete?: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  show,
  newLevel,
  onComplete
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            {/* Confetti effect */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  background: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32'][i % 5]
                }}
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
              />
            ))}

            {/* Main Content */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl p-12 shadow-2xl">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 blur-2xl opacity-50 -z-10" />

                {/* Stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: '-20px'
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                  >
                    <Star className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                ))}

                <div className="text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-white text-4xl font-bold mb-2">LEVEL UP!</h2>
                    <p className="text-white/90 text-lg mb-6">You've reached a new level</p>
                  </motion.div>

                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <motion.div
                      className="text-6xl font-bold text-white"
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    >
                      {newLevel}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                    <p className="text-white font-semibold">Keep up the great work!</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
