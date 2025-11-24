import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export type StatusType = 'pending' | 'in_progress' | 'completed' | 'failed' | 'warning' | 'new';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    icon: Clock,
    defaultLabel: 'Pending'
  },
  in_progress: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
    icon: Loader2,
    defaultLabel: 'In Progress'
  },
  completed: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
    icon: CheckCircle,
    defaultLabel: 'Completed'
  },
  failed: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    icon: XCircle,
    defaultLabel: 'Failed'
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    icon: AlertCircle,
    defaultLabel: 'Warning'
  },
  new: {
    bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    text: 'text-white',
    border: 'border-purple-300',
    icon: Sparkles,
    defaultLabel: 'New'
  }
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    padding: 'px-4 py-1.5',
    text: 'text-base',
    icon: 'w-5 h-5'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  animated = true,
  showIcon = true
}) => {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const badge = (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.bg} ${config.text} ${config.border}
        ${sizeStyles.padding} ${sizeStyles.text}
        border
      `}
    >
      {showIcon && (
        <Icon
          className={`${sizeStyles.icon} ${
            status === 'in_progress' && animated ? 'animate-spin' : ''
          }`}
        />
      )}
      {displayLabel}
    </span>
  );

  if (!animated || status === 'in_progress') {
    return badge;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {badge}
    </motion.div>
  );
};

// Pill Badge variant (no border, solid colors)
interface PillBadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

const pillColors = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  purple: 'bg-purple-500 text-white',
  gray: 'bg-gray-500 text-white'
};

export const PillBadge: React.FC<PillBadgeProps> = ({
  children,
  color = 'blue',
  size = 'md'
}) => {
  const sizeStyles = sizeConfig[size];

  return (
    <motion.span
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        ${pillColors[color]} ${sizeStyles.padding} ${sizeStyles.text}
        shadow-sm
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  );
};

// Count Badge (like notification badge)
interface CountBadgeProps {
  count: number;
  max?: number;
  color?: 'red' | 'blue' | 'green';
  pulse?: boolean;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  color = 'red',
  pulse = false
}) => {
  const displayCount = count > max ? `${max}+` : count;

  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5 rounded-full
        ${colorClasses[color]} text-white text-xs font-bold
        shadow-lg
      `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      {pulse && (
        <motion.span
          className={`absolute inset-0 rounded-full ${colorClasses[color]} opacity-75`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.75, 0, 0.75]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      <span className="relative z-10">{displayCount}</span>
    </motion.span>
  );
};

// Streak Badge (for gamification)
interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ days, size = 'md' }) => {
  const sizeStyles = sizeConfig[size];

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1.5 rounded-full
        bg-gradient-to-r from-orange-500 to-red-500
        text-white font-bold
        ${sizeStyles.padding} ${sizeStyles.text}
        shadow-lg
      `}
      whileHover={{ scale: 1.05 }}
      animate={{
        boxShadow: [
          '0 4px 6px -1px rgba(251, 146, 60, 0.3)',
          '0 10px 15px -3px rgba(251, 146, 60, 0.5)',
          '0 4px 6px -1px rgba(251, 146, 60, 0.3)'
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      <span className={sizeStyles.icon}>🔥</span>
      <span>{days} Day Streak</span>
    </motion.div>
  );
};
