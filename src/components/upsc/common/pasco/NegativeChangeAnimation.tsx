import { motion } from 'framer-motion';
import { ArrowDown, AlertTriangle, TrendingDown } from 'lucide-react';

/**
 * Negative Change Animation - Warning effect when metrics decline
 * Features: red pulses, downward indicators, warning symbols
 */
export function NegativeChangeAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Red warning pulse */}
      <motion.div
        className="absolute inset-0 bg-red-400/15 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.8, repeat: 2 }}
      />

      {/* Warning border flash */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-red-400/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, repeat: 3 }}
      />

      {/* Falling particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-400 rounded-full"
          style={{
            left: `${15 + i * 7}%`,
            top: '0%'
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: 100,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.06,
            ease: 'easeIn'
          }}
        />
      ))}

      {/* Alert triangles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`alert-${i}`}
          className="absolute"
          style={{
            left: `${25 + i * 25}%`,
            top: `${25 + i * 15}%`
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.2
          }}
        >
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </motion.div>
      ))}

      {/* Downward trend arrows */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`arrow-${i}`}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `${i * 25}%` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, 40]
          }}
          transition={{
            duration: 1,
            delay: i * 0.2
          }}
        >
          <TrendingDown className="w-6 h-6 text-red-500" />
        </motion.div>
      ))}

      {/* Warning ripples */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-400/40"
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: ['0px', '150px'],
            height: ['0px', '150px'],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Minus symbols */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`minus-${i}`}
          className="absolute text-red-500 text-2xl font-bold"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 40}%`
          }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 0],
            y: 30,
            scale: [0.5, 1, 0.8]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.1
          }}
        >
          −
        </motion.div>
      ))}

      {/* Vibration effect for the whole container */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -2, 2, -2, 2, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: 2
        }}
      />

      {/* Fading decline bars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`bar-${i}`}
          className="absolute bottom-0 w-1 bg-red-400"
          style={{
            left: `${20 + i * 15}%`,
            height: `${60 - i * 10}%`
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}
