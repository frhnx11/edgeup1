import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, X, Eye, Activity, Brain, Heart, TrendingUp } from 'lucide-react';

interface EUstaadConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function EUstaadConsentModal({ isOpen, onAccept, onDecline }: EUstaadConsentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDecline}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, rgba(0,217,255,0.3) 1px, transparent 1px),
                      linear-gradient(rgba(0,217,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onDecline}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="relative p-8 md:p-12">
                {/* Robot Animation */}
                <motion.div
                  className="flex justify-center mb-6"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="relative">
                    {/* Glowing rings */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-cyan-400"
                        animate={{
                          scale: [1, 1.5 + i * 0.3],
                          opacity: [0.6, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4
                        }}
                      />
                    ))}

                    {/* Robot Icon */}
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg">
                      <Brain className="w-12 h-12 text-white" />

                      {/* Glowing eyes */}
                      <motion.div
                        className="absolute top-8 left-7 w-2 h-2 rounded-full bg-cyan-300"
                        animate={{
                          opacity: [1, 0.3, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                      <motion.div
                        className="absolute top-8 right-7 w-2 h-2 rounded-full bg-cyan-300"
                        animate={{
                          opacity: [1, 0.3, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Meet eUstaad
                </motion.h2>

                <motion.p
                  className="text-center text-gray-600 mb-6 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Your Personal AI Learning Companion
                </motion.p>

                {/* Features */}
                <motion.div
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-gray-700 text-center mb-6">
                    eUstaad monitors your learning journey and provides personalized insights to help you succeed.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: Activity, text: 'Track your learning activities', color: 'from-blue-500 to-cyan-500' },
                      { icon: TrendingUp, text: 'Monitor performance trends', color: 'from-purple-500 to-pink-500' },
                      { icon: Brain, text: 'Get personalized insights', color: 'from-green-500 to-emerald-500' },
                      { icon: Heart, text: 'Support mental wellness', color: 'from-red-500 to-orange-500' }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/70 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Privacy Assurance */}
                <motion.div
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 mb-1">100% Private & Secure</h4>
                      <p className="text-sm text-green-800">
                        All your data stays on this platform and is encrypted. We never share your personal information with third parties. You have complete control over your data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Tracked Metrics */}
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm">What eUstaad Tracks:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Learning activities</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Test performance</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Study patterns</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Progress metrics</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Engagement levels</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Wellness indicators</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <button
                    onClick={onAccept}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Accept & Continue
                  </button>
                  <button
                    onClick={onDecline}
                    className="flex-1 py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Maybe Later
                  </button>
                </motion.div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  You can change your preferences anytime from settings
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
