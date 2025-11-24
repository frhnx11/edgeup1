import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEUstaadStore } from '../../../store/useEUstaadStore';
import { useNavigate } from 'react-router-dom';

export function EUstaadAgent() {
  const navigate = useNavigate();
  const {
    animationState,
    isVisible,
    consentGiven,
    position,
    totalInteractions,
    updatePosition
  } = useEUstaadStore();

  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  if (!consentGiven || !isVisible) {
    return null;
  }

  const handleDragEnd = () => {
    const newPosition = { x: x.get(), y: y.get() };
    updatePosition(newPosition);
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging) {
      setShowProfilePrompt(true);
    }
  };

  const handleViewProfile = () => {
    setShowProfilePrompt(false);
    navigate('/eustaad-profile');
  };

  // Get color based on animation state
  const getStateColor = () => {
    switch (animationState) {
      case 'celebrating':
        return { from: '#10b981', to: '#34d399' }; // Green
      case 'concerned':
        return { from: '#ef4444', to: '#f87171' }; // Red
      case 'analyzing':
        return { from: '#8b5cf6', to: '#a78bfa' }; // Purple
      case 'navigating':
        return { from: '#06b6d4', to: '#22d3ee' }; // Cyan
      case 'interacting':
        return { from: '#f59e0b', to: '#fbbf24' }; // Amber
      case 'thinking':
        return { from: '#1e40af', to: '#3b82f6' }; // Deep Blue
      case 'sleeping':
        return { from: '#6b7280', to: '#9ca3af' }; // Soft Gray
      case 'excited':
        return { from: '#fbbf24', to: '#fb923c' }; // Yellow-Orange
      case 'encouraging':
        return { from: '#fb923c', to: '#f472b6' }; // Orange-Pink
      case 'learning':
        return { from: '#14b8a6', to: '#10b981' }; // Teal-Green
      case 'warning':
        return { from: '#f97316', to: '#ef4444' }; // Orange-Red
      case 'focus':
        return { from: '#6366f1', to: '#8b5cf6' }; // Deep Purple
      case 'celebrating-streak':
        return { from: '#ec4899', to: '#a855f7' }; // Rainbow (Pink-Purple)
      case 'typing':
        return { from: '#0ea5e9', to: '#06b6d4' }; // Light Blue-Cyan
      default:
        return { from: '#00d9ff', to: '#8b5cf6' }; // Cyan to Purple
    }
  };

  const stateColors = getStateColor();

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className="fixed bottom-8 right-8 z-50 cursor-move"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        {/* Main Robot Container */}
        <div className="relative">
          {/* Particle Effects */}
          <AnimatePresence>
            {(animationState === 'analyzing' ||
              animationState === 'celebrating' ||
              animationState === 'celebrating-streak' ||
              animationState === 'excited' ||
              animationState === 'thinking') && (
              <>
                {[...Array(animationState === 'celebrating-streak' ? 12 : 8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: stateColors.from,
                      boxShadow: `0 0 10px ${stateColors.from}`,
                      left: '50%',
                      top: '50%'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      x: Math.cos(i * Math.PI / (animationState === 'celebrating-streak' ? 6 : 4)) * (animationState === 'celebrating-streak' ? 80 : 60),
                      y: Math.sin(i * Math.PI / (animationState === 'celebrating-streak' ? 6 : 4)) * (animationState === 'celebrating-streak' ? 80 : 60),
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: animationState === 'celebrating-streak' ? 1.5 : 1,
                      repeat: Infinity,
                      repeatDelay: animationState === 'celebrating-streak' ? 0.3 : 0.5
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Outer Glowing Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: stateColors.from,
                opacity: 0.3
              }}
              animate={{
                scale: [1, 1.5 + i * 0.3],
                opacity: [0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut'
              }}
            />
          ))}

          {/* Main Robot Body */}
          <motion.div
            className="relative w-28 h-28 shadow-2xl rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
            animate={{
              y: animationState === 'idle' ? [0, -8, 0]
                : animationState === 'navigating' ? [0, -12, 0]
                : animationState === 'excited' ? [0, -15, 0]
                : animationState === 'sleeping' ? [0, -3, 0]
                : 0,
              rotate: animationState === 'interacting' ? [0, 5, -5, 0]
                : animationState === 'thinking' ? [0, -3, 3, 0]
                : animationState === 'typing' ? [0, 2, -2, 0]
                : 0,
              scale: animationState === 'celebrating' ? [1, 1.1, 1]
                : animationState === 'celebrating-streak' ? [1, 1.15, 1]
                : animationState === 'concerned' ? [1, 0.95, 1]
                : animationState === 'warning' ? [1, 1.05, 1]
                : animationState === 'encouraging' ? [1, 1.08, 1]
                : 1,
              opacity: animationState === 'sleeping' ? [1, 0.7, 1] : 1
            }}
            transition={{
              duration: animationState === 'idle' ? 2
                : animationState === 'navigating' ? 1
                : animationState === 'excited' ? 0.6
                : animationState === 'sleeping' ? 4
                : animationState === 'thinking' ? 3
                : animationState === 'typing' ? 0.3
                : animationState === 'celebrating-streak' ? 0.8
                : 0.5,
              repeat: ['idle', 'navigating', 'excited', 'sleeping', 'thinking', 'typing'].includes(animationState) ? Infinity : 0,
              ease: animationState === 'sleeping' ? 'easeInOut' : animationState === 'excited' ? 'easeOut' : 'easeInOut'
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Spline 3D Model Container - Centered and Properly Sized */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: 'scale(0.8)',
                transformOrigin: 'center'
              }}
            >
              <iframe
                src="https://my.spline.design/blobs-OuaR94gecQfaNqEkjNIHfdar/"
                frameBorder="0"
                width="200%"
                height="200%"
                title="eUstaad 3D Avatar"
                style={{
                  pointerEvents: 'none',
                  border: 'none',
                  background: 'transparent',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>

            {/* Glowing Border Effect */}
            <div
              className="absolute inset-0 rounded-full border-4 pointer-events-none z-10"
              style={{
                borderColor: stateColors.from,
                boxShadow: `0 0 30px ${stateColors.from}, 0 0 60px ${stateColors.from}40`
              }}
            />
          </motion.div>

          {/* Interaction Count Badge */}
          {totalInteractions > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            >
              {totalInteractions > 99 ? '99+' : totalInteractions}
            </motion.div>
          )}

          {/* Floating Message Bubble */}
          <AnimatePresence>
            {animationState !== 'idle' && (
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
              >
                <div
                  className="px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${stateColors.from}, ${stateColors.to})`
                  }}
                >
                  {animationState === 'celebrating' && '🎉 Great job!'}
                  {animationState === 'concerned' && '⚠️ Need help?'}
                  {animationState === 'analyzing' && '👀 Analyzing...'}
                  {animationState === 'navigating' && '🚀 Navigating...'}
                  {animationState === 'interacting' && '✨ Tracking...'}
                  {animationState === 'thinking' && '💭 Thinking...'}
                  {animationState === 'sleeping' && '😴 Resting...'}
                  {animationState === 'excited' && '⚡ Let\'s go!'}
                  {animationState === 'encouraging' && '💪 You got this!'}
                  {animationState === 'learning' && '📚 Learning mode...'}
                  {animationState === 'warning' && '⏰ Deadline soon!'}
                  {animationState === 'focus' && '🎯 Focus mode'}
                  {animationState === 'celebrating-streak' && '🔥 Amazing streak!'}
                  {animationState === 'typing' && '⌨️ Writing...'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Profile Prompt Modal */}
      <AnimatePresence>
        {showProfilePrompt && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfilePrompt(false)}
            />
            <motion.div
              className="fixed bottom-32 right-8 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">View Your Profile?</h4>
                  <p className="text-sm text-gray-600">
                    Would you like to see your personalized PASCO profile and insights?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleViewProfile}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Yes, Show Me
                </button>
                <button
                  onClick={() => setShowProfilePrompt(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
