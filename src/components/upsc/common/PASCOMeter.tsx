import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePASCOStore } from '../../../store/usePASCOStore';
import { ChevronDown, ChevronUp, Activity, X, Zap, TrendingUp, Brain, Sparkles, Radio } from 'lucide-react';
import { PASCOMetrics } from './pasco/PASCOMetrics';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * PASCO Meter - Futuristic Holographic Design with Rotating Number Wheels
 * Features: 3D transforms, rotating number wheels, navigation animations, click interactions
 */

// Number Wheel Component - Rotating digit display
interface NumberWheelProps {
  value: number;
  color: string;
  isChanging: boolean;
}

function NumberWheel({ value, color, isChanging }: NumberWheelProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (value !== displayValue || isChanging) {
      setIsSpinning(true);

      // Animate through numbers
      let current = displayValue;
      const target = Math.round(value);
      const steps = Math.abs(target - current);
      const direction = target > current ? 1 : -1;

      if (steps > 0) {
        let step = 0;
        const interval = setInterval(() => {
          step++;
          current = current + direction;
          if (current < 0) current = 0;
          if (current > 10) current = 10;
          setDisplayValue(current);

          if (step >= steps) {
            clearInterval(interval);
            setIsSpinning(false);
          }
        }, 100);

        return () => clearInterval(interval);
      } else {
        setTimeout(() => setIsSpinning(false), 500);
      }
    }
  }, [value, isChanging]);

  return (
    <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-black/60 border-2"
      style={{
        borderColor: `${color}60`,
        boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`
      }}
    >
      {/* Number roll effect */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={{
          y: isSpinning ? [-20, 0] : 0,
        }}
        transition={{
          duration: 0.15,
          repeat: isSpinning ? Infinity : 0,
        }}
      >
        {/* Previous number (above) */}
        <motion.div
          className="absolute text-4xl font-black opacity-30"
          style={{
            color,
            top: '-50%',
            textShadow: `0 0 10px ${color}`
          }}
        >
          {displayValue > 0 ? displayValue - 1 : 10}
        </motion.div>

        {/* Current number (center) */}
        <motion.div
          className="text-5xl font-black"
          style={{
            color: 'white',
            textShadow: `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`
          }}
          animate={{
            scale: isSpinning ? [1, 1.2, 1] : 1,
            rotateX: isSpinning ? [0, 360] : 0
          }}
          transition={{
            duration: 0.15,
            repeat: isSpinning ? Infinity : 0,
          }}
        >
          {displayValue}
        </motion.div>

        {/* Next number (below) */}
        <motion.div
          className="absolute text-4xl font-black opacity-30"
          style={{
            color,
            bottom: '-50%',
            textShadow: `0 0 10px ${color}`
          }}
        >
          {displayValue < 10 ? displayValue + 1 : 0}
        </motion.div>
      </motion.div>

      {/* Slot machine effect lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-8" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 translate-y-8" />
      </div>

      {/* Spinning glow effect */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color}40, transparent 70%)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Holographic Metric Display Component with Number Wheel
interface HolographicMetricProps {
  label: string;
  value: number;
  color: string;
  index: number;
  isChanging: boolean;
  onClick: () => void;
}

function HolographicMetric({ label, value, color, index, isChanging, onClick }: HolographicMetricProps) {
  const [clickEffect, setClickEffect] = useState(false);

  const handleClick = () => {
    setClickEffect(true);
    onClick();
    setTimeout(() => setClickEffect(false), 600);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={handleClick}
    >
      {/* Hexagonal container */}
      <motion.div
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05, z: 50 }}
        animate={clickEffect ? { scale: [1, 0.95, 1.05, 1] } : {}}
        style={{ perspective: 1000 }}
      >
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${color}40, transparent, ${color}60)`,
            filter: 'blur(8px)'
          }}
          animate={{
            opacity: clickEffect ? [0.3, 1, 0.3] : [0.3, 0.8, 0.3],
            scale: clickEffect ? [1, 1.2, 1] : [1, 1.05, 1]
          }}
          transition={{ duration: clickEffect ? 0.6 : 3, repeat: clickEffect ? 0 : Infinity }}
        />

        {/* Main card */}
        <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl border-2 overflow-hidden"
          style={{ borderColor: `${color}40` }}>

          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="h-px bg-cyan-400"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${i * 10}%`
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 opacity-60"
            style={{ borderColor: color }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 opacity-60"
            style={{ borderColor: color }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 opacity-60"
            style={{ borderColor: color }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 opacity-60"
            style={{ borderColor: color }} />

          {/* Content */}
          <div className="relative p-6 flex flex-col items-center justify-center">
            {/* Label */}
            <motion.div
              className="text-xs font-bold tracking-[0.3em] mb-3 opacity-70"
              style={{ color }}
              animate={{
                textShadow: [
                  `0 0 5px ${color}`,
                  `0 0 20px ${color}`,
                  `0 0 5px ${color}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {label}
            </motion.div>

            {/* Number Wheel */}
            <NumberWheel value={value} color={color} isChanging={isChanging} />

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`
                }}
                animate={{ width: `${(value / 10) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            {/* Data points */}
            <div className="flex gap-1 mt-3">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: i < value ? color : '#333' }}
                  animate={{ scale: i < value ? 1 : 0.5 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Holographic overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(45deg, transparent, ${color}10, transparent)`
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Click burst effect */}
          <AnimatePresence>
            {clickEffect && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{
                      x: Math.cos(i * Math.PI / 4) * 50,
                      y: Math.sin(i * Math.PI / 4) * 50,
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}30, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function PASCOMeter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { metrics, animationState, isInitialized, recordActivity } = usePASCOStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState(metrics);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [isChanging, setIsChanging] = useState(false);
  const [navigationEffect, setNavigationEffect] = useState(false);
  const [clickInteractions, setClickInteractions] = useState(0);

  // Draggable position
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('pasco-position');
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);

  if (!isInitialized) return null;

  // Detect navigation changes and trigger animations
  useEffect(() => {
    setNavigationEffect(true);
    setIsChanging(true);

    // Create navigation particle burst
    const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00', '#ff0080'];
    const navParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(navParticles);

    setTimeout(() => {
      setNavigationEffect(false);
      setIsChanging(false);
      setParticles([]);
    }, 1500);
  }, [location.pathname]);

  // Track click interactions globally
  useEffect(() => {
    const handleGlobalClick = () => {
      setClickInteractions(prev => prev + 1);
      setIsChanging(true);
      setTimeout(() => setIsChanging(false), 800);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Handle metric click interactions
  const handleMetricClick = () => {
    // Create ripple effect
    const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00', '#ff0080'];
    const clickParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i + 1000,
      x: Math.cos(i * Math.PI / 4) * 80,
      y: Math.sin(i * Math.PI / 4) * 80,
      color: colors[i % colors.length]
    }));
    setParticles(prev => [...prev, ...clickParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id < Date.now() - 1000));
    }, 1000);
  };

  // Particle effects on change
  useEffect(() => {
    const hasChanged = Object.keys(metrics).some(
      (key) => metrics[key as keyof typeof metrics] !== previousMetrics[key as keyof typeof previousMetrics]
    );

    if (hasChanged) {
      const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00', '#ff0080'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
        setPreviousMetrics(metrics);
      }, 3000);
    }
  }, [metrics, previousMetrics]);

  // Auto-update every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const generateRandomChange = () => (Math.random() - 0.5) * 0.6;
      const dimensionsToUpdate = Math.floor(Math.random() * 3) + 1;
      const dimensions = ['P', 'A', 'S', 'C', 'O'];
      const shuffled = dimensions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, dimensionsToUpdate);

      const impact: any = {};
      selected.forEach(dim => {
        impact[dim] = generateRandomChange();
      });

      recordActivity('practice_session', impact, {
        source: 'auto-update',
        timestamp: new Date().toISOString()
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [recordActivity]);

  const handleDragEnd = () => {
    const newPosition = { x: x.get(), y: y.get() };
    setPosition(newPosition);
    localStorage.setItem('pasco-position', JSON.stringify(newPosition));
  };

  const metricColors = {
    P: '#ff0080',
    A: '#a855f7',
    S: '#00f5ff',
    C: '#00ff88',
    O: '#ffff00'
  };

  const getStatusColor = () => {
    switch (animationState) {
      case 'positive':
      case 'celebration':
        return '#00ff88';
      case 'negative':
        return '#ff0080';
      case 'analyzing':
        return '#a855f7';
      default:
        return '#00f5ff';
    }
  };

  const getStatusText = () => {
    switch (animationState) {
      case 'positive': return 'OPTIMIZING';
      case 'celebration': return 'PEAK PERFORMANCE';
      case 'negative': return 'ALERT';
      case 'analyzing': return 'PROCESSING';
      default: return 'ONLINE';
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y }}
        onDragEnd={handleDragEnd}
        className="fixed top-24 right-8 z-50 cursor-move"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="relative w-24 h-24 bg-black/90 backdrop-blur-xl rounded-full border-4 border-cyan-400/30 overflow-hidden group"
          whileHover={{ scale: 1.1, borderColor: 'rgba(0, 245, 255, 0.8)' }}
          style={{
            boxShadow: `0 0 40px ${getStatusColor()}80, inset 0 0 20px ${getStatusColor()}40`
          }}
        >
          {/* Rotating rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 rounded-full"
              style={{ borderColor: getStatusColor() }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}

          {/* Center icon */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Radio className="w-10 h-10 text-cyan-400" />
          </motion.div>

          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: getStatusColor() }}
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{ x, y, perspective: 2000 }}
      onDragEnd={handleDragEnd}
      className="fixed top-20 right-6 z-50 cursor-move"
      initial={{ opacity: 0, y: -50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className={`${isExpanded ? 'w-[900px]' : 'w-auto'} transition-all duration-700`}>
        {/* Main Container */}
        <motion.div
          className="relative"
          animate={{
            rotateY: [0, 0.5, 0, -0.5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          {/* Holographic panel */}
          <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl overflow-visible border-2"
            style={{
              borderColor: getStatusColor(),
              boxShadow: `0 0 60px ${getStatusColor()}60, inset 0 0 60px ${getStatusColor()}20`
            }}>

            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(${getStatusColor()}40 1px, transparent 1px), linear-gradient(90deg, ${getStatusColor()}40 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '30px 30px']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>

            {/* Particle burst effects */}
            <AnimatePresence>
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    backgroundColor: particle.color,
                    boxShadow: `0 0 10px ${particle.color}`
                  }}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    opacity: 0,
                    scale: [0, 2, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              ))}
            </AnimatePresence>

            {/* Header section */}
            <div className="relative z-10 p-6 pb-0">
              {/* Status bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Animated status indicator */}
                  <motion.div
                    className="relative w-16 h-16 flex items-center justify-center"
                    animate={{
                      rotate: 360
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    {/* Orbiting dots */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(),
                          boxShadow: `0 0 10px ${getStatusColor()}`
                        }}
                        animate={{
                          x: Math.cos(i * Math.PI / 2) * 25,
                          y: Math.sin(i * Math.PI / 2) * 25
                        }}
                      />
                    ))}

                    {/* Center icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: -360
                      }}
                      transition={{ duration: 8, repeat: Infinity }}
                    >
                      {animationState === 'analyzing' ? (
                        <Brain className="w-7 h-7 text-purple-400" />
                      ) : animationState === 'positive' || animationState === 'celebration' ? (
                        <TrendingUp className="w-7 h-7 text-green-400" />
                      ) : (
                        <Activity className="w-7 h-7 text-cyan-400" />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <div>
                    <motion.h2
                      className="text-2xl font-black tracking-wider"
                      style={{
                        color: getStatusColor(),
                        textShadow: `0 0 20px ${getStatusColor()}`
                      }}
                      animate={{
                        textShadow: [
                          `0 0 10px ${getStatusColor()}`,
                          `0 0 30px ${getStatusColor()}`,
                          `0 0 10px ${getStatusColor()}`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      PASCO • ENGINE
                    </motion.h2>
                    <motion.div
                      className="flex items-center gap-2 mt-1"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getStatusColor() }}
                            animate={{
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white/70 tracking-widest">
                        {getStatusText()}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-xl border-2 transition-all"
                    style={{ borderColor: `${getStatusColor()}40` }}
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${getStatusColor()}40` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" style={{ color: getStatusColor() }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: getStatusColor() }} />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => setIsMinimized(true)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-xl border-2 transition-all"
                    style={{ borderColor: `${getStatusColor()}40` }}
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${getStatusColor()}40` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" style={{ color: getStatusColor() }} />
                  </motion.button>
                </div>
              </div>

              {/* Metrics Grid */}
              <motion.div
                className="relative"
                animate={navigationEffect ? {
                  scale: [1, 1.02, 1],
                  rotateY: [0, 5, 0]
                } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-5 gap-4 p-4">
                  <HolographicMetric
                    label="PERSONALITY"
                    value={metrics.P}
                    color={metricColors.P}
                    index={0}
                    isChanging={isChanging}
                    onClick={handleMetricClick}
                  />
                  <HolographicMetric
                    label="APTITUDE"
                    value={metrics.A}
                    color={metricColors.A}
                    index={1}
                    isChanging={isChanging}
                    onClick={handleMetricClick}
                  />
                  <HolographicMetric
                    label="SKILLS"
                    value={metrics.S}
                    color={metricColors.S}
                    index={2}
                    isChanging={isChanging}
                    onClick={handleMetricClick}
                  />
                  <HolographicMetric
                    label="COGNITIVE"
                    value={metrics.C}
                    color={metricColors.C}
                    index={3}
                    isChanging={isChanging}
                    onClick={handleMetricClick}
                  />
                  <HolographicMetric
                    label="OVERALL"
                    value={metrics.O}
                    color={metricColors.O}
                    index={4}
                    isChanging={isChanging}
                    onClick={handleMetricClick}
                  />
                </div>

                {/* System info bar */}
                <div className="px-6 pb-6">
                  <motion.div
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border-2 cursor-pointer"
                    style={{ borderColor: `${getStatusColor()}20` }}
                    whileHover={{ borderColor: `${getStatusColor()}60`, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/pasco-results')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-wider text-white/60">SYSTEM PERFORMANCE</span>
                        <AnimatePresence>
                          {navigationEffect && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1, rotate: 360 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Zap className="w-3 h-3" style={{ color: getStatusColor() }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <motion.span
                        className="text-lg font-black"
                        style={{
                          color: getStatusColor(),
                          textShadow: `0 0 10px ${getStatusColor()}`
                        }}
                        animate={isChanging ? { scale: [1, 1.3, 1] } : {}}
                      >
                        {Math.round((metrics.P + metrics.A + metrics.S + metrics.C + metrics.O) / 5 * 10)}%
                      </motion.span>
                    </div>

                    {/* Multi-segment progress */}
                    <div className="flex gap-1 h-2 mb-2">
                      {Object.entries(metricColors).map(([key, color]) => {
                        const value = metrics[key as keyof typeof metrics];
                        return (
                          <motion.div
                            key={key}
                            className="flex-1 rounded-full overflow-hidden bg-white/10"
                          >
                            <motion.div
                              className="h-full"
                              style={{
                                backgroundColor: color,
                                boxShadow: `0 0 10px ${color}`
                              }}
                              animate={{
                                height: `${(value / 10) * 100}%`,
                                opacity: isChanging ? [1, 0.5, 1] : 1
                              }}
                              transition={{ duration: isChanging ? 0.5 : 1, delay: 0.2 }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Interaction counter */}
                    <div className="flex items-center justify-between text-[9px] text-white/30 mb-2">
                      <span className="tracking-wider">INTERACTIONS: {clickInteractions}</span>
                      <motion.span
                        className="tracking-wider"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {location.pathname.toUpperCase().replace(/\//g, ' / ').slice(3) || 'HOME'}
                      </motion.span>
                    </div>

                    <motion.p
                      className="text-[10px] text-center text-white/40 tracking-widest"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ▸ CLICK FOR DETAILED ANALYSIS
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Outer glow */}
            <motion.div
              className="absolute -inset-4 rounded-3xl -z-10 blur-2xl"
              style={{ backgroundColor: getStatusColor() }}
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* Expanded View */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="mt-6 bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl border-2 overflow-hidden"
                style={{
                  borderColor: `${getStatusColor()}60`,
                  boxShadow: `0 0 40px ${getStatusColor()}40`
                }}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                  <PASCOMetrics />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00f5ff, #a855f7);
          border-radius: 10px;
          box-shadow: 0 0 10px #00f5ff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00f5ff, #ff0080);
        }
      `}</style>
    </motion.div>
  );
}
