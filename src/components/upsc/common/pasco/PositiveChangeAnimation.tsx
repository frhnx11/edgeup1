import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, TrendingUp } from 'lucide-react';

/**
 * Positive Change Animation - Celebration effect when metrics improve
 * Features: particles, upward arrows, green glow, sparkles
 */
export function PositiveChangeAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Green glow pulse */}
      <motion.div
        className="absolute inset-0 bg-green-400/20 rounded-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.2, 1] }}
        transition={{ duration: 1 }}
      />

      {/* Rising particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            left: `${10 + i * 7}%`,
            bottom: '0%'
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.05,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Sparkle effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1
          }}
        >
          <Sparkles className="w-4 h-4 text-green-400" />
        </motion.div>
      ))}

      {/* Upward trend arrows */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`arrow-${i}`}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: `${i * 25}%` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, -40]
          }}
          transition={{
            duration: 1,
            delay: i * 0.2
          }}
        >
          <TrendingUp className="w-6 h-6 text-green-500" />
        </motion.div>
      ))}

      {/* Success ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: [0, 1.5], rotate: 360 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="w-24 h-24 border-4 border-green-400/60 rounded-full" />
      </motion.div>

      {/* Expanding success wave */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0 rounded-2xl border-2 border-green-400/40"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Plus symbols */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`plus-${i}`}
          className="absolute text-green-500 text-xl font-bold"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 40}%`
          }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 0],
            y: -30,
            scale: [0.5, 1, 0.8]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.1
          }}
        >
          +
        </motion.div>
      ))}
    </div>
  );
}
