import { motion } from 'framer-motion';
import { usePASCOStore } from '../../store/usePASCOStore';
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Target, Zap, Star } from 'lucide-react';

const dimensionInfo = {
  P: { label: 'Personality', icon: Heart, color: 'from-pink-500 to-rose-500', description: 'Learning style & persistence' },
  A: { label: 'Aptitude', icon: Star, color: 'from-purple-500 to-indigo-500', description: 'Natural abilities & talents' },
  S: { label: 'Skills', icon: Target, color: 'from-blue-500 to-cyan-500', description: 'Study & practical skills' },
  C: { label: 'Cognitive', icon: Brain, color: 'from-green-500 to-emerald-500', description: 'Problem-solving & reasoning' },
  O: { label: 'Overall Wellness', icon: Zap, color: 'from-amber-500 to-orange-500', description: 'Engagement & wellbeing' }
};

/**
 * Expanded PASCO Metrics View - Detailed breakdown with charts and trends
 */
export function PASCOMetrics() {
  const { metrics, getTrendDirection, recentChanges } = usePASCOStore();

  const getTrendIcon = (dimension: keyof typeof metrics) => {
    const trend = getTrendDirection(dimension);
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (dimension: keyof typeof metrics) => {
    const trend = getTrendDirection(dimension);
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">PASCO Metrics</h3>
          <p className="text-xs text-gray-600">Real-time performance tracking</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-3">
        {(Object.keys(metrics) as Array<keyof typeof metrics>).map((dimension, index) => {
          const value = metrics[dimension];
          const info = dimensionInfo[dimension];
          const Icon = info.icon;
          const percentage = (value / 10) * 100;

          return (
            <motion.div
              key={dimension}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-cyan-300 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{info.label}</h4>
                      {getTrendIcon(dimension)}
                    </div>
                    <p className="text-xs text-gray-600">{info.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {dimension}{Math.round(value)}
                  </div>
                  <div className={`text-xs font-medium ${getTrendColor(dimension)}`}>
                    {getTrendDirection(dimension) === 'up' && '+'}
                    {getTrendDirection(dimension) === 'down' && '-'}
                    {getTrendDirection(dimension) !== 'stable' && '0.2'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${info.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              {/* Level Description */}
              <div className="mt-2 text-xs text-gray-600">
                {value >= 8 && 'Excellent performance'}
                {value >= 6 && value < 8 && 'Good progress'}
                {value >= 4 && value < 6 && 'Average level'}
                {value >= 2 && value < 4 && 'Needs improvement'}
                {value < 2 && 'Requires attention'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      {recentChanges.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-4 h-4 text-cyan-500" />
            </motion.div>
            Recent Changes
          </h4>
          <div className="space-y-2">
            {recentChanges.slice(-3).reverse().map((change, index) => {
              const info = dimensionInfo[change.dimension];
              const isImprovement = change.newValue > change.oldValue;

              return (
                <motion.div
                  key={`${change.dimension}-${change.timestamp}`}
                  className="flex items-center justify-between text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-gray-700">{info.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {change.oldValue.toFixed(1)} → {change.newValue.toFixed(1)}
                    </span>
                    {isImprovement ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Score */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Overall PASCO Score</p>
            <p className="text-3xl font-bold">
              {((Object.values(metrics).reduce((a, b) => a + b, 0) / 5) * 10).toFixed(1)}%
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-12 h-12 opacity-80" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
