import { motion } from 'framer-motion';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  delay?: number;
  showLabel?: boolean;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  color = 'bg-brand-primary',
  height = 'h-3',
  delay = 0,
  showLabel = false,
  className = ''
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100;

  const getGradient = () => {
    if (color.includes('green')) return 'from-green-400 to-green-600';
    if (color.includes('blue')) return 'from-blue-400 to-blue-600';
    if (color.includes('purple')) return 'from-purple-400 to-purple-600';
    if (color.includes('yellow')) return 'from-yellow-400 to-yellow-600';
    if (color.includes('red')) return 'from-red-400 to-red-600';
    return 'from-brand-primary to-brand-secondary';
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <motion.div
          className={`${height} bg-gradient-to-r ${getGradient()} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1.5,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              delay: delay + 0.5,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
      {showLabel && (
        <motion.span
          className="absolute right-0 -top-6 text-sm font-semibold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1 }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
      )}
    </div>
  );
}
