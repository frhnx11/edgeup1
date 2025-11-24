import { motion } from 'framer-motion';
import { Loader2, Brain, Sparkles, Zap } from 'lucide-react';

type LoadingVariant = 'default' | 'brain' | 'sparkles' | 'pulse' | 'dots';

interface LoadingSpinnerProps {
  variant?: LoadingVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'default',
  size = 'md',
  message,
  fullScreen = false
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50'
    : 'flex flex-col items-center justify-center p-4';

  const renderSpinner = () => {
    switch (variant) {
      case 'brain':
        return (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Brain className={`${sizeMap[size]} text-brand-primary`} />
          </motion.div>
        );

      case 'sparkles':
        return (
          <div className="relative">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-8px',
                  marginTop: '-8px'
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI * 2) / 8) * 30],
                  y: [0, Math.sin((i * Math.PI * 2) / 8) * 30],
                  opacity: [1, 0],
                  scale: [0, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeOut'
                }}
              >
                <Sparkles className="w-4 h-4 text-brand-secondary" />
              </motion.div>
            ))}
            <Brain className={`${sizeMap[size]} text-brand-primary`} />
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeMap[size]} rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        );

      case 'dots':
        return (
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Loader2 className={`${sizeMap[size]} text-brand-primary`} />
          </motion.div>
        );
    }
  };

  return (
    <div className={containerClass}>
      {renderSpinner()}
      {message && (
        <motion.p
          className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton Loader for content
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Loading Overlay for async operations
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring' }}
      >
        <LoadingSpinner variant="sparkles" size="lg" />
        <p className="mt-4 text-center text-gray-800 dark:text-gray-200 font-medium">
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
};
