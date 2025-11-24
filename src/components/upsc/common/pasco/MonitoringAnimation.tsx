import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Monitoring Animation - Subtle scanning effect showing PASCO is actively monitoring
 * Features: scanning lines, pulse effects, data streams
 */
export function MonitoringAnimation() {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          top: `${scanPosition}%`,
          background: 'linear-gradient(90deg, transparent, rgba(16, 172, 139, 0.5), transparent)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Pulse circles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30"
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: ['0px', '120px'],
            height: ['0px', '120px'],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Corner indicators */}
      <div className="absolute top-2 left-2 w-4 h-4">
        <motion.div
          className="w-full h-full border-l-2 border-t-2 border-cyan-400/40"
          animate={{
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      </div>

      <div className="absolute top-2 right-2 w-4 h-4">
        <motion.div
          className="w-full h-full border-r-2 border-t-2 border-cyan-400/40"
          animate={{
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
      </div>

      <div className="absolute bottom-2 left-2 w-4 h-4">
        <motion.div
          className="w-full h-full border-l-2 border-b-2 border-cyan-400/40"
          animate={{
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1
          }}
        />
      </div>

      <div className="absolute bottom-2 right-2 w-4 h-4">
        <motion.div
          className="w-full h-full border-r-2 border-b-2 border-cyan-400/40"
          animate={{
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5
          }}
        />
      </div>

      {/* Data stream dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${20 + i * 12}%`,
            top: '50%'
          }}
          animate={{
            y: [-20, 20],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}
