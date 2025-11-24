import { motion } from 'framer-motion';
import { CheckCircle, Circle, AlertCircle, Bookmark, TrendingUp, Target, Zap, Award } from 'lucide-react';

interface Question {
  id: string;
  questionNumber: number;
  isAnswered?: boolean;
  isMarked?: boolean;
  timeSpent?: number;
  selectedAnswer?: number;
}

interface TestProgressVisualizationProps {
  questions: Question[];
  currentQuestion: number;
  onQuestionClick: (index: number) => void;
  variant?: 'grid' | 'linear' | 'compact';
}

export const TestProgressVisualization: React.FC<TestProgressVisualizationProps> = ({
  questions,
  currentQuestion,
  onQuestionClick,
  variant = 'grid'
}) => {
  const stats = {
    answered: questions.filter(q => q.isAnswered).length,
    marked: questions.filter(q => q.isMarked).length,
    notAnswered: questions.filter(q => !q.isAnswered).length
  };

  const getQuestionStatus = (question: Question, index: number) => {
    if (index === currentQuestion) return 'current';
    if (question.isAnswered && question.isMarked) return 'answered-marked';
    if (question.isAnswered) return 'answered';
    if (question.isMarked) return 'marked';
    return 'not-answered';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-brand-primary to-brand-secondary',
          text: 'text-white',
          border: 'border-brand-primary',
          ring: 'ring-4 ring-brand-primary/30'
        };
      case 'answered':
        return {
          bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
          text: 'text-white',
          border: 'border-green-500',
          ring: ''
        };
      case 'marked':
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
          text: 'text-white',
          border: 'border-yellow-500',
          ring: ''
        };
      case 'answered-marked':
        return {
          bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
          text: 'text-white',
          border: 'border-purple-500',
          ring: ''
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600',
          ring: ''
        };
    }
  };

  if (variant === 'linear') {
    return (
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.answered / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Current position indicator */}
          <motion.div
            className="absolute top-0 h-full w-1 bg-brand-primary"
            animate={{ left: `${(currentQuestion / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">{stats.answered} Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-700 dark:text-gray-300">{stats.marked} Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{stats.notAnswered} Remaining</span>
            </div>
          </div>
          <div className="font-semibold text-brand-primary">
            {Math.round((stats.answered / questions.length) * 100)}% Complete
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {/* Mini progress circle */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 20}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 20 * (1 - stats.answered / questions.length)
              }}
              transition={{ duration: 0.5 }}
              className="text-green-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
            {Math.round((stats.answered / questions.length) * 100)}%
          </div>
        </div>

        {/* Compact stats */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{stats.answered}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-700 dark:text-gray-300">{stats.marked}</span>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Answered</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.answered}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Marked</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.marked}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-1">
            <Circle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Remaining</span>
          </div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.notAnswered}</div>
        </motion.div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const styles = getStatusStyles(status);

          return (
            <motion.button
              key={question.id}
              onClick={() => onQuestionClick(index)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square rounded-lg font-semibold text-sm
                transition-all relative overflow-hidden
                ${styles.bg} ${styles.text} ${styles.ring}
                border-2 ${styles.border}
                hover:shadow-lg
              `}
            >
              {/* Shimmer effect for current */}
              {status === 'current' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}

              <span className="relative z-10">{question.questionNumber}</span>

              {/* Time spent indicator */}
              {question.timeSpent && question.timeSpent > 120 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Performance Insights Component
interface PerformanceInsightsProps {
  questions: Question[];
  timeRemaining: number;
  totalTime: number;
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  questions,
  timeRemaining,
  totalTime
}) => {
  const stats = {
    answered: questions.filter(q => q.isAnswered).length,
    avgTimePerQuestion: questions.reduce((acc, q) => acc + (q.timeSpent || 0), 0) / questions.filter(q => q.timeSpent).length || 0,
    slowQuestions: questions.filter(q => (q.timeSpent || 0) > 120).length,
    pace: (questions.filter(q => q.isAnswered).length / ((totalTime - timeRemaining) / 60)) || 0
  };

  const insights = [
    {
      icon: Zap,
      label: 'Current Pace',
      value: `${stats.pace.toFixed(1)} Q/min`,
      color: stats.pace > 1 ? 'text-green-600' : 'text-yellow-600',
      bgColor: stats.pace > 1 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: Target,
      label: 'Avg Time/Q',
      value: `${Math.round(stats.avgTimePerQuestion)}s`,
      color: stats.avgTimePerQuestion < 90 ? 'text-green-600' : 'text-orange-600',
      bgColor: stats.avgTimePerQuestion < 90 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: `${Math.round((stats.answered / questions.length) * 100)}%`,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10'
    },
    {
      icon: AlertCircle,
      label: 'Slow Questions',
      value: stats.slowQuestions.toString(),
      color: stats.slowQuestions > 5 ? 'text-red-600' : 'text-gray-600',
      bgColor: stats.slowQuestions > 5 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl ${insight.bgColor} border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center gap-2 mb-2">
            <insight.icon className={`w-4 h-4 ${insight.color}`} />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {insight.label}
            </span>
          </div>
          <div className={`text-2xl font-bold ${insight.color}`}>
            {insight.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Question Navigation Mini Map
interface QuestionMiniMapProps {
  questions: Question[];
  currentQuestion: number;
  onQuestionClick: (index: number) => void;
}

export const QuestionMiniMap: React.FC<QuestionMiniMapProps> = ({
  questions,
  currentQuestion,
  onQuestionClick
}) => {
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < questions.length; i += chunkSize) {
    chunks.push(questions.slice(i, i + chunkSize));
  }

  return (
    <div className="space-y-2">
      {chunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="flex gap-1">
          <span className="text-xs text-gray-500 w-8">
            {chunkIndex * chunkSize + 1}-{Math.min((chunkIndex + 1) * chunkSize, questions.length)}
          </span>
          <div className="flex gap-0.5 flex-1">
            {chunk.map((question, index) => {
              const globalIndex = chunkIndex * chunkSize + index;
              const isCurrent = globalIndex === currentQuestion;
              const isAnswered = question.isAnswered;
              const isMarked = question.isMarked;

              return (
                <button
                  key={question.id}
                  onClick={() => onQuestionClick(globalIndex)}
                  className={`flex-1 h-2 rounded-sm transition-all ${
                    isCurrent
                      ? 'bg-brand-primary scale-y-150'
                      : isAnswered && isMarked
                      ? 'bg-purple-500'
                      : isAnswered
                      ? 'bg-green-500'
                      : isMarked
                      ? 'bg-yellow-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  title={`Question ${question.questionNumber}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
