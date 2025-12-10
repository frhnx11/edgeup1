import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Clock,
  Flame,
  Target,
  BarChart3,
  ChevronDown,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
  Sparkles
} from 'lucide-react';
import { useFocusTimerStore } from '../../../store/useFocusTimerStore';

// Timer modes configuration
type TimerMode = 'focus' | 'short-break' | 'long-break';

const TIMER_MODES: Record<TimerMode, { duration: number; label: string; color: string; bgColor: string; icon: typeof Brain }> = {
  'focus': {
    duration: 25 * 60,
    label: 'Focus',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    icon: Brain
  },
  'short-break': {
    duration: 5 * 60,
    label: 'Short Break',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    icon: Coffee
  },
  'long-break': {
    duration: 15 * 60,
    label: 'Long Break',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    icon: Sparkles
  }
};

const SUBJECTS = [
  'Indian Polity',
  'Indian History',
  'Geography',
  'Indian Economy',
  'Environment & Ecology',
  'Science & Technology',
  'Current Affairs',
  'Ethics',
  'Essay Practice',
  'General Studies'
];

// Circular Progress Component
const CircularProgress = ({
  progress,
  color,
  size = 280
}: {
  progress: number;
  color: string;
  size?: number
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke="#E5E7EB"
        fill="none"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </svg>
  );
};

// Stats Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  color: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Weekly Chart Component
const WeeklyChart = ({ data }: { data: { day: string; minutes: number }[] }) => {
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        This Week
      </h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, index) => {
          const height = (item.minutes / maxMinutes) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-gradient-to-t from-brand-primary to-emerald-400 rounded-t-md min-h-[4px]"
              />
              <span className="text-xs text-gray-500">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Subject Breakdown Component
const SubjectBreakdown = ({ data }: { data: { subject: string; minutes: number; color: string }[] }) => {
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0) || 1;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Today by Subject
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No sessions yet today</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 4).map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 truncate">{item.subject}</span>
                <span className="text-gray-900 font-medium">{item.minutes}m</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.minutes / totalMinutes) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main FocusTimer Component
export function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Store
  const {
    addSession,
    getTodayFocusTime,
    getTodaySessionCount,
    currentStreak,
    getWeeklyStats,
    getSubjectBreakdown
  } = useFocusTimerStore();

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format total time
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Play notification sound
  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    playSound();

    // Record session
    addSession({
      subject: selectedSubject,
      duration: TIMER_MODES[mode].duration,
      type: mode,
      completedAt: new Date().toISOString()
    });

    // Auto-transition logic
    if (mode === 'focus') {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);

      // Every 4 focus sessions, take a long break
      if (newCount % 4 === 0) {
        setMode('long-break');
        setTimeLeft(TIMER_MODES['long-break'].duration);
      } else {
        setMode('short-break');
        setTimeLeft(TIMER_MODES['short-break'].duration);
      }
    } else {
      // After break, go back to focus
      setMode('focus');
      setTimeLeft(TIMER_MODES.focus.duration);
    }

    setIsRunning(false);
  }, [mode, sessionsCompleted, selectedSubject, addSession, playSound]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  // Handle mode change
  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_MODES[newMode].duration);
    setIsRunning(false);
  };

  // Reset timer
  const handleReset = () => {
    setTimeLeft(TIMER_MODES[mode].duration);
    setIsRunning(false);
  };

  // Skip to next
  const handleSkip = () => {
    if (mode === 'focus') {
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      if (newCount % 4 === 0) {
        setMode('long-break');
        setTimeLeft(TIMER_MODES['long-break'].duration);
      } else {
        setMode('short-break');
        setTimeLeft(TIMER_MODES['short-break'].duration);
      }
    } else {
      setMode('focus');
      setTimeLeft(TIMER_MODES.focus.duration);
    }
    setIsRunning(false);
  };

  // Calculate progress
  const totalDuration = TIMER_MODES[mode].duration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const currentConfig = TIMER_MODES[mode];
  const ModeIcon = currentConfig.icon;

  // Get stats
  const todayFocusTime = getTodayFocusTime();
  const todaySessionCount = getTodaySessionCount();
  const weeklyStats = getWeeklyStats();
  const subjectBreakdown = getSubjectBreakdown();

  return (
    <div className="min-h-[calc(100vh-280px)] bg-gray-50 rounded-2xl p-6">
      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRELQK/i8teleQwFP6Hi9PWteRELP6/i9PWteQwFRKri9PeteRELRLbi9Pu1fRELR7bi9fWtdQ4ITrTi9fW0eA0GTrni9fW0eA0HTrni9fW0eA0HTrni9fW0eA0GTrni9fW0eA4GTrni9fW0eA4GTrni9fW0eA4GTrni9fW0eA4GTrni9fW0eA4GTrni9fW0eA4G" type="audio/wav" />
      </audio>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Mode Tabs */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {(Object.keys(TIMER_MODES) as TimerMode[]).map((m) => {
                  const config = TIMER_MODES[m];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={m}
                      onClick={() => handleModeChange(m)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        mode === m
                          ? `${config.bgColor} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{config.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Timer Display */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <CircularProgress
                    progress={progress}
                    color={currentConfig.color}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ModeIcon className="w-8 h-8 mb-2" style={{ color: currentConfig.color }} />
                    <span className="text-5xl font-bold text-gray-900">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">{currentConfig.label}</span>
                  </div>
                </div>
              </div>

              {/* Subject Selector */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <button
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    <span className="font-medium">{selectedSubject}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showSubjectDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 max-h-60 overflow-y-auto"
                      >
                        {SUBJECTS.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowSubjectDropdown(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                              selectedSubject === subject ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-gray-700'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleReset}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${currentConfig.bgColor}`}
                  style={{ boxShadow: `0 10px 40px -10px ${currentConfig.color}` }}
                >
                  {isRunning ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSkip}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Sound Toggle & Session Count */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound {soundEnabled ? 'On' : 'Off'}</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Session</span>
                  <span className="font-bold text-gray-900">{sessionsCompleted + 1}</span>
                  <span>of 4</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <StatCard
              icon={Clock}
              label="Today's Focus"
              value={formatTotalTime(todayFocusTime)}
              color="bg-emerald-500"
            />
            <StatCard
              icon={Target}
              label="Sessions Today"
              value={todaySessionCount.toString()}
              color="bg-blue-500"
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={`${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
              color="bg-orange-500"
            />

            {/* Weekly Chart */}
            <WeeklyChart data={weeklyStats} />

            {/* Subject Breakdown */}
            <SubjectBreakdown data={subjectBreakdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
