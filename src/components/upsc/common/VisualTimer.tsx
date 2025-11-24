import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertCircle, Bell, BellOff, Clock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VisualTimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isPaused: boolean;
  variant?: 'compact' | 'full' | 'minimal';
  onTimeUp?: () => void;
  showAlerts?: boolean;
}

export const VisualTimer: React.FC<VisualTimerProps> = ({
  timeRemaining,
  totalTime,
  isPaused,
  variant = 'compact',
  onTimeUp,
  showAlerts = true
}) => {
  const [alertsEnabled, setAlertsEnabled] = useState(showAlerts);
  const [hasAlerted5Min, setHasAlerted5Min] = useState(false);
  const [hasAlerted1Min, setHasAlerted1Min] = useState(false);

  const percentage = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining < 300; // Less than 5 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute

  useEffect(() => {
    if (timeRemaining === 0 && onTimeUp) {
      onTimeUp();
    }

    // Alert at 5 minutes
    if (alertsEnabled && timeRemaining === 300 && !hasAlerted5Min) {
      setHasAlerted5Min(true);
      playAlertSound();
      showNotification('5 minutes remaining!');
    }

    // Alert at 1 minute
    if (alertsEnabled && timeRemaining === 60 && !hasAlerted1Min) {
      setHasAlerted1Min(true);
      playAlertSound();
      showNotification('1 minute remaining!');
    }
  }, [timeRemaining, alertsEnabled, hasAlerted5Min, hasAlerted1Min, onTimeUp]);

  const playAlertSound = () => {
    // Implement sound alert
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const showNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Timer', { body: message, icon: '/logo.png' });
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        animate={{
          scale: isCritical ? [1, 1.05, 1] : 1,
          color: isCritical ? ['#ef4444', '#dc2626', '#ef4444'] : undefined
        }}
        transition={{
          duration: 1,
          repeat: isCritical ? Infinity : 0
        }}
        className={`font-mono text-lg font-bold ${
          isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {formatTime(timeRemaining)}
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="relative">
        {/* Circular Timer */}
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: (2 * Math.PI * 88) * (1 - percentage / 100)
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#094d88'}
              />
              <stop
                offset="100%"
                stopColor={isCritical ? '#dc2626' : isLow ? '#d97706' : '#10ac8b'}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: isPaused ? [1, 1.1, 1] : isCritical ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: isPaused ? 2 : 1,
              repeat: isPaused || isCritical ? Infinity : 0
            }}
            className={`text-4xl font-bold font-mono mb-2 ${
              isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-gray-900 dark:text-white'
            }`}
          >
            {formatTime(timeRemaining)}
          </motion.div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(percentage)}% remaining
          </div>

          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium"
            >
              Paused
            </motion.div>
          )}
        </div>

        {/* Alert indicator */}
        <AnimatePresence>
          {(isLow || isCritical) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className={`p-2 rounded-full ${
                  isCritical ? 'bg-red-500' : 'bg-orange-500'
                } text-white shadow-lg`}
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert toggle */}
        <button
          onClick={() => setAlertsEnabled(!alertsEnabled)}
          className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={alertsEnabled ? 'Disable Alerts' : 'Enable Alerts'}
        >
          {alertsEnabled ? (
            <Bell className="w-4 h-4 text-brand-primary" />
          ) : (
            <BellOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <motion.div
      animate={{
        scale: isCritical ? [1, 1.05, 1] : 1
      }}
      transition={{
        duration: 1,
        repeat: isCritical ? Infinity : 0
      }}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
        isCritical
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          : isLow
          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
          : 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary'
      }`}
    >
      <Timer className="w-5 h-5" />
      <div className="flex flex-col">
        <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
        {isPaused && (
          <span className="text-xs opacity-70">Paused</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-24 h-2 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isCritical ? 'bg-red-600' : isLow ? 'bg-orange-600' : 'bg-brand-primary'
          }`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <button
        onClick={() => setAlertsEnabled(!alertsEnabled)}
        className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded transition-colors"
        title={alertsEnabled ? 'Disable Alerts' : 'Enable Alerts'}
      >
        {alertsEnabled ? (
          <Bell className="w-4 h-4" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
      </button>
    </motion.div>
  );
};

// Time Milestones Component
interface TimeMilestonesProps {
  timeRemaining: number;
  totalTime: number;
}

export const TimeMilestones: React.FC<TimeMilestonesProps> = ({
  timeRemaining,
  totalTime
}) => {
  const milestones = [
    { time: totalTime * 0.75, label: '75%' },
    { time: totalTime * 0.5, label: '50%' },
    { time: totalTime * 0.25, label: '25%' },
    { time: 300, label: '5 min' },
    { time: 60, label: '1 min' }
  ];

  const passed = milestones.filter(m => timeRemaining < m.time);

  return (
    <div className="flex gap-2">
      {milestones.map((milestone, index) => (
        <motion.div
          key={milestone.label}
          initial={{ scale: 0 }}
          animate={{
            scale: passed.includes(milestone) ? 1 : 0.8,
            opacity: passed.includes(milestone) ? 1 : 0.3
          }}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            passed.includes(milestone)
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          {milestone.label}
        </motion.div>
      ))}
    </div>
  );
};

// Question Timer (tracks time per question)
interface QuestionTimerProps {
  timeSpent: number;
  isActive: boolean;
}

export const QuestionTimer: React.FC<QuestionTimerProps> = ({
  timeSpent,
  isActive
}) => {
  const formatQuestionTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLong = timeSpent > 120; // More than 2 minutes

  return (
    <motion.div
      animate={{
        backgroundColor: isLong ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.1)'
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
    >
      <motion.div
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 1,
          repeat: isActive ? Infinity : 0
        }}
      >
        <Clock className={`w-4 h-4 ${isLong ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`} />
      </motion.div>
      <span className={`text-sm font-mono font-medium ${
        isLong ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {formatQuestionTime(timeSpent)}
      </span>
      {isLong && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
        >
          <Zap className="w-3 h-3" />
          <span>Long</span>
        </motion.div>
      )}
    </motion.div>
  );
};
