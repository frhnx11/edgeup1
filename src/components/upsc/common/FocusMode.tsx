import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Maximize2, Moon, Volume2, VolumeX, Focus, Settings, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FocusModeProps {
  isActive: boolean;
  onToggle: () => void;
  settings: FocusSettings;
  onSettingsChange: (settings: Partial<FocusSettings>) => void;
}

export interface FocusSettings {
  hideQuestionPalette: boolean;
  hideTimer: boolean;
  enableWhiteNoise: boolean;
  dimBackground: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'default' | 'sepia' | 'dark' | 'highContrast';
}

export const FocusMode: React.FC<FocusModeProps> = ({
  isActive,
  onToggle,
  settings,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const colorSchemes = {
    default: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200'
    },
    sepia: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700'
    },
    highContrast: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-white'
    }
  };

  return (
    <>
      {/* Focus Mode Toggle Button */}
      <motion.button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
          isActive
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Toggle Focus Mode"
      >
        <Focus className="w-4 h-4" />
        {isActive ? 'Exit Focus' : 'Focus Mode'}
      </motion.button>

      {/* Focus Mode Settings Button */}
      {isActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          title="Focus Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      )}

      {/* Focus Mode Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-16 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Focus Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Hide Question Palette */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hide Question Palette
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hideQuestionPalette}
                  onChange={(e) => onSettingsChange({ hideQuestionPalette: e.target.checked })}
                  className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer appearance-none checked:bg-purple-600 transition-colors"
                />
              </label>

              {/* Hide Timer */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hide Timer
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hideTimer}
                  onChange={(e) => onSettingsChange({ hideTimer: e.target.checked })}
                  className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer appearance-none checked:bg-purple-600 transition-colors"
                />
              </label>

              {/* White Noise */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    White Noise
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableWhiteNoise}
                  onChange={(e) => onSettingsChange({ enableWhiteNoise: e.target.checked })}
                  className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer appearance-none checked:bg-purple-600 transition-colors"
                />
              </label>

              {/* Dim Background */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Dim Background
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dimBackground}
                  onChange={(e) => onSettingsChange({ dimBackground: e.target.checked })}
                  className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer appearance-none checked:bg-purple-600 transition-colors"
                />
              </label>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {/* Font Size */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => onSettingsChange({ fontSize: size })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          settings.fontSize === size
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>).map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => onSettingsChange({ colorScheme: scheme })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          settings.colorScheme === scheme
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {scheme === 'highContrast'
                          ? 'High Contrast'
                          : scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onSettingsChange({
                    hideQuestionPalette: false,
                    hideTimer: false,
                    enableWhiteNoise: false,
                    dimBackground: false,
                    fontSize: 'medium',
                    colorScheme: 'default'
                  });
                }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Reset to Defaults
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dim Background Overlay */}
      <AnimatePresence>
        {isActive && settings.dimBackground && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Focus Mode Active Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <Focus className="w-4 h-4" />
            <span className="text-sm font-medium">Focus Mode Active</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Breathing Exercise Component (for focus breaks)
interface BreathingExerciseProps {
  onComplete?: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const totalCycles = 3;

  useEffect(() => {
    const durations = { inhale: 4000, hold: 4000, exhale: 4000 };
    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold');
      } else if (phase === 'hold') {
        setPhase('exhale');
      } else {
        if (count < totalCycles - 1) {
          setCount(count + 1);
          setPhase('inhale');
        } else {
          onComplete?.();
        }
      }
    }, durations[phase]);

    return () => clearTimeout(timer);
  }, [phase, count, onComplete]);

  const instructions = {
    inhale: 'Breathe In...',
    hold: 'Hold...',
    exhale: 'Breathe Out...'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: phase === 'inhale' ? 2 : phase === 'hold' ? 2 : 1,
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: phase === 'inhale' ? 4 : phase === 'hold' ? 4 : 4,
            ease: 'easeInOut'
          }}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
        />

        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-4"
        >
          {instructions[phase]}
        </motion.h2>

        <p className="text-white/70">
          Cycle {count + 1} of {totalCycles}
        </p>
      </div>
    </motion.div>
  );
};
