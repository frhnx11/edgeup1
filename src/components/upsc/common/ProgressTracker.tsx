import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { useState } from 'react';

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'locked' | 'upcoming';
  completedDate?: Date;
  icon?: React.ReactNode;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  variant?: 'vertical' | 'horizontal';
  showDetails?: boolean;
  onStepClick?: (step: ProgressStep) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  variant = 'vertical',
  showDetails = true,
  onStepClick
}) => {
  const getStepIcon = (step: ProgressStep) => {
    if (step.icon) return step.icon;

    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'current':
        return <Clock className="w-5 h-5" />;
      case 'locked':
        return <Lock className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-600';
      case 'current':
        return 'from-blue-500 to-indigo-600';
      case 'locked':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
          <motion.div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary -z-10"
            initial={{ width: 0 }}
            animate={{
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => onStepClick?.(step)}
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStepColor(step.status)} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
                  step.status === 'current' ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getStepIcon(step)}
              </motion.button>

              {showDetails && (
                <div className="mt-2 text-center max-w-[100px]">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    {step.title}
                  </p>
                  {step.status === 'current' && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">In Progress</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className="relative flex gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
              {step.status === 'completed' && (
                <motion.div
                  className="w-full bg-gradient-to-b from-green-500 to-emerald-600"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              )}
            </div>
          )}

          {/* Step indicator */}
          <motion.div
            className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br ${getStepColor(step.status)} text-white flex items-center justify-center shadow-lg flex-shrink-0 ${
              step.status === 'current' ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {getStepIcon(step)}

            {step.status === 'current' && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.div>

          {/* Step content */}
          <motion.button
            onClick={() => onStepClick?.(step)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              step.status === 'current'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                : step.status === 'completed'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            } hover:shadow-lg`}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                )}
                {step.completedDate && step.status === 'completed' && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Completed on {step.completedDate.toLocaleDateString()}
                  </p>
                )}
              </div>

              {step.status === 'current' && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                  In Progress
                </span>
              )}
            </div>
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
};

// Circular Progress component
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true,
  color = 'from-brand-primary to-brand-secondary'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#094d88" />
            <stop offset="100%" stopColor="#10ac8b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            className="text-2xl font-bold text-gray-800 dark:text-gray-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// Stats Card with Progress
interface StatsCardProps {
  title: string;
  value: number;
  target: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  target,
  unit = '',
  icon = <Target className="w-5 h-5" />,
  color = 'from-blue-500 to-indigo-600'
}) => {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              className="text-3xl font-bold text-gray-800 dark:text-gray-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {value.toLocaleString()}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {target.toLocaleString()} {unit}
            </span>
          </div>
        </div>

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}% Complete
        </span>
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>On track</span>
        </div>
      </div>
    </motion.div>
  );
};
