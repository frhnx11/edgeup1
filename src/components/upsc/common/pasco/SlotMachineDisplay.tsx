import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SlotMachineDisplayProps {
  value: string;
  isSpinning?: boolean;
  label?: string;
  color?: string;
}

/**
 * Slot Machine Display - Casino-style spinning animation for PASCO values
 * Each character spins in a vertical loop like a slot machine reel
 */
export function SlotMachineDisplay({
  value,
  isSpinning = false,
  label,
  color = 'from-cyan-400 to-blue-500'
}: SlotMachineDisplayProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [spinning, setSpinning] = useState(false);

  // Characters to cycle through during spin
  const allChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  useEffect(() => {
    if (isSpinning && value !== displayValue) {
      setSpinning(true);

      // Spin animation duration
      const spinDuration = 1500;
      const intervalTime = 50;
      const iterations = spinDuration / intervalTime;
      let currentIteration = 0;

      const interval = setInterval(() => {
        if (currentIteration < iterations) {
          // Show random character during spin
          const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
          setDisplayValue(randomChar);
          currentIteration++;
        } else {
          // End spin with final value
          setDisplayValue(value);
          setSpinning(false);
          clearInterval(interval);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    } else if (!isSpinning) {
      setDisplayValue(value);
    }
  }, [value, isSpinning, displayValue]);

  return (
    <div className="relative flex flex-col items-center">
      {label && (
        <motion.div
          className="text-[9px] font-semibold text-gray-400 mb-0.5"
          animate={{ opacity: spinning ? 0.5 : 1 }}
        >
          {label}
        </motion.div>
      )}

      <div className="relative">
        {/* Glow effect when spinning */}
        {spinning && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${color} blur-xl rounded-xl`}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity
            }}
          />
        )}

        {/* Slot machine reel container */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl">
          {/* Top shine effect */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

          {/* Bottom shadow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10" />

          {/* Spinning number/letter */}
          <div className="relative w-6 h-8 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${displayValue}-${spinning}`}
                className={`text-lg font-bold font-mono bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                initial={spinning ? { y: -100, opacity: 0, filter: 'blur(4px)' } : false}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                  scale: spinning ? [0.8, 1.1, 1] : 1
                }}
                exit={spinning ? { y: 100, opacity: 0, filter: 'blur(4px)' } : false}
                transition={{
                  duration: spinning ? 0.05 : 0.3,
                  ease: spinning ? 'linear' : 'easeOut'
                }}
              >
                {displayValue}
              </motion.div>
            </AnimatePresence>

            {/* Spinning lines effect */}
            {spinning && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r ${color}`}
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Side accents */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color}`} />
        </div>

        {/* Spinning indicator particles */}
        {spinning && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${color}`}
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Win effect when value increases */}
      {!spinning && parseInt(displayValue) > 5 && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${color} blur-sm`} />
        </motion.div>
      )}
    </div>
  );
}
