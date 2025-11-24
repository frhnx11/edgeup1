import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';
import type { Achievement } from '../../../services/gamificationService';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const rarityColors = {
  common: {
    bg: 'from-gray-500 to-gray-600',
    glow: 'shadow-gray-500/50',
    text: 'text-gray-300'
  },
  rare: {
    bg: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-300'
  },
  epic: {
    bg: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-300'
  },
  legendary: {
    bg: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/50',
    text: 'text-amber-300'
  }
};

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for exit animation
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [achievement, autoClose, autoCloseDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!achievement) return null;

  const colors = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Achievement Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl p-8 shadow-2xl ${colors.glow}`}>
              {/* Sparkle effects */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 0.5,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 2
                    }}
                    className="absolute top-1/2 left-1/2"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Achievement Unlocked Title */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <p className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
                    Achievement Unlocked!
                  </p>
                  <div className="inline-block px-3 py-1 bg-white/20 rounded-full">
                    <p className={`${colors.text} text-xs font-bold uppercase`}>
                      {achievement.rarity}
                    </p>
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.3, duration: 0.6 }}
                  className="mb-6"
                >
                  <div className="inline-block p-6 bg-white/20 rounded-full">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                </motion.div>

                {/* Achievement Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {achievement.description}
                  </p>

                  {/* XP Reward */}
                  {achievement.xpReward && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span className="text-white font-semibold">
                        +{achievement.xpReward} XP
                      </span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Progress Bar (if not completed) */}
                {!achievement.unlockedAt && achievement.currentProgress !== undefined && achievement.targetProgress && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6"
                  >
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.currentProgress / achievement.targetProgress) * 100}%` }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                    <p className="text-white/70 text-xs mt-2">
                      {achievement.currentProgress} / {achievement.targetProgress}
                    </p>
                  </motion.div>
                )}

                {/* Unlocked Date */}
                {achievement.unlockedAt && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-white/60 text-xs mt-4"
                  >
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </motion.p>
                )}
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 40px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Global achievement notification queue manager
class AchievementNotificationManager {
  private queue: Achievement[] = [];
  private isShowing = false;
  private listeners: ((achievement: Achievement | null) => void)[] = [];

  show(achievement: Achievement) {
    this.queue.push(achievement);
    if (!this.isShowing) {
      this.showNext();
    }
  }

  private showNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      this.notifyListeners(null);
      return;
    }

    this.isShowing = true;
    const achievement = this.queue.shift()!;
    this.notifyListeners(achievement);
  }

  onClose() {
    // Wait a bit before showing next achievement
    setTimeout(() => {
      this.showNext();
    }, 500);
  }

  subscribe(listener: (achievement: Achievement | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(achievement: Achievement | null) {
    this.listeners.forEach(listener => listener(achievement));
  }
}

export const achievementNotificationManager = new AchievementNotificationManager();

// Hook for using achievement notifications
export const useAchievementNotifications = () => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const unsubscribe = achievementNotificationManager.subscribe(setCurrentAchievement);
    return unsubscribe;
  }, []);

  const handleClose = () => {
    achievementNotificationManager.onClose();
  };

  return {
    currentAchievement,
    handleClose
  };
};
