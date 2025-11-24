import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Heart, Target, TrendingUp, Activity, Clock, Smartphone,
  AlertTriangle, Award, BookOpen, Users, Lightbulb, Zap, Star,
  Trophy, Flame, Shield, Eye, BarChart3, PieChart, Timer,
  ChevronRight, CheckCircle, ArrowLeft, Info, TrendingDown,
  User, Sparkles
} from 'lucide-react';
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';
import { usePASCOStore } from '../../../../store/usePASCOStore';
import { useEUstaadStore } from '../../../../store/useEUstaadStore';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';

// Futuristic Card Component (matching DashboardPage)
const FuturisticCard = ({ children, className = "", delay = 0, neonGlow = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5 }}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(16, 172, 139, 0.15) 0%,
            transparent 60%
          ),
          linear-gradient(135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(10px)',
        boxShadow: neonGlow
          ? '0 0 30px rgba(16, 172, 139, 0.3), 0 8px 32px 0 rgba(9, 77, 136, 0.1)'
          : '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />
      {children}
    </motion.div>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <motion.div
        className="relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl blur-xl opacity-50" />
      </motion.div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
};

// Enhanced Slot Machine Reel Component - Shows PASCO as "P1A2S3C4O5"
interface SlotReelCharacterProps {
  character: string;
  color: string;
  delay: number;
  isLetter: boolean;
}

function SlotReelCharacter({ character, color, delay, isLetter }: SlotReelCharacterProps) {
  const [displayChar, setDisplayChar] = useState(isLetter ? 'A' : '0');
  const [isSpinning, setIsSpinning] = useState(true);
  const [reelPosition, setReelPosition] = useState(0);

  // Generate reel characters (letters or numbers)
  const reelChars = isLetter
    ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  useEffect(() => {
    const spinDuration = 3000; // 3 seconds
    const startDelay = delay * 300; // Stagger by 300ms

    const startTimeout = setTimeout(() => {
      const startTime = Date.now();
      let animationFrame: number;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        if (progress < 1) {
          // Fast spinning at start, gradually slowing down
          const speed = (1 - easedProgress) * 50; // Start fast, slow down
          setReelPosition(prev => prev + speed);

          // Update display character based on position
          const charIndex = Math.floor(reelPosition / 100) % reelChars.length;
          setDisplayChar(reelChars[charIndex]);

          animationFrame = requestAnimationFrame(animate);
        } else {
          // Stop at target character
          setDisplayChar(character);
          setIsSpinning(false);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [character, delay, isLetter]);

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.05 }}
    >
      {/* Slot Reel Container */}
      <div className="relative h-20 w-14 rounded-xl overflow-hidden bg-white shadow-lg border-2 border-gray-200">
        {/* Light frame effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-gray-50/50 pointer-events-none" />

        {/* Inner glow when spinning */}
        {isSpinning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`
            }}
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}

        {/* Spinning reel effect */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {isSpinning && (
              <>
                {/* Multiple characters scrolling */}
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-start"
                  animate={{ y: ['-300%', '0%'] }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  {[...Array(6)].map((_, i) => {
                    const charIndex = (Math.floor(reelPosition / 100) + i) % reelChars.length;
                    return (
                      <div
                        key={i}
                        className="h-20 w-14 flex items-center justify-center text-4xl font-black"
                        style={{
                          color: isLetter ? color : '#4b5563',
                          textShadow: `0 0 10px ${color}40`,
                          filter: i === 2 ? 'blur(0px)' : 'blur(1px)',
                          opacity: i === 2 ? 1 : 0.5
                        }}
                      >
                        {reelChars[charIndex]}
                      </div>
                    );
                  })}
                </motion.div>

                {/* Motion blur lines */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`blur-${i}`}
                    className="absolute left-0 right-0 h-px opacity-20"
                    style={{
                      top: `${30 + i * 20}%`,
                      background: `linear-gradient(90deg, transparent, ${color}, transparent)`
                    }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Final character display */}
          <motion.div
            className="relative z-10 text-5xl font-black"
            animate={isSpinning ? {
              opacity: [0.3, 0.5, 0.3],
              filter: ['blur(2px)', 'blur(3px)', 'blur(2px)']
            } : {
              opacity: 1,
              filter: 'blur(0px)',
              scale: [1, 1.2, 1],
              textShadow: [
                `0 0 20px ${color}60`,
                `0 0 30px ${color}80`,
                `0 0 20px ${color}60`
              ]
            }}
            transition={isSpinning ? {
              duration: 0.2,
              repeat: Infinity
            } : {
              scale: { duration: 0.5 },
              textShadow: { duration: 2, repeat: Infinity }
            }}
            style={{
              color: isLetter ? color : '#374151',
              textShadow: isSpinning ? 'none' : `0 0 20px ${color}60, 0 0 30px ${color}40`
            }}
          >
            {displayChar}
          </motion.div>
        </div>

        {/* Viewing window frame */}
        <div className="absolute inset-0 pointer-events-none border-2 border-gray-300 rounded-xl" />

        {/* Center line indicators */}
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="h-px opacity-20" style={{ backgroundColor: color }} />
        </div>

        {/* Win flash effect */}
        {!isSpinning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6, delay: 0.2, repeat: 2 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                boxShadow: `inset 0 0 30px ${color}60`
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Bottom glow effect */}
      {!isSpinning && (
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-3 rounded-full blur-lg"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export function EnhancedPASCOProfilePage() {
  const navigate = useNavigate();
  const { metrics, getPASCOString, getOverallScore } = usePASCOStore();
  const {
    skillGaps,
    digitalUsage,
    health,
    mentalHealth,
    behavioralTraits,
    redFlags
  } = useEUstaadStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'digital' | 'health' | 'mental' | 'behavioral' | 'flags'>('overview');

  // Colors for each PASCO dimension
  const pascoColors = {
    P: '#ec4899',  // Pink - Personality
    A: '#a855f7',  // Purple - Aptitude
    S: '#10ac8b',  // Teal - Skills (brand-primary)
    C: '#10b981',  // Green - Cognitive
    O: '#f59e0b'   // Amber - Overall
  };

  // Mock celebrity data
  const mockCelebrities = [
    { name: 'Elon Musk', profession: 'Entrepreneur', trait: 'Visionary Thinking', match: 85 },
    { name: 'Oprah Winfrey', profession: 'Media Mogul', trait: 'Empathy & Communication', match: 78 },
    { name: 'Steve Jobs', profession: 'Tech Pioneer', trait: 'Innovation & Design', match: 72 }
  ];

  // Mock skill gaps data
  const mockSkillGaps = [
    {
      skill: 'Time Management',
      current: 65,
      target: 90,
      priority: 'high' as const,
      improvement: ['Use Pomodoro technique', 'Set daily goals', 'Track time spent']
    },
    {
      skill: 'Critical Thinking',
      current: 70,
      target: 85,
      priority: 'medium' as const,
      improvement: ['Practice problem-solving', 'Analyze case studies', 'Question assumptions']
    },
    {
      skill: 'Communication',
      current: 75,
      target: 90,
      priority: 'medium' as const,
      improvement: ['Practice public speaking', 'Write regularly', 'Active listening exercises']
    }
  ];

  // Digital usage data
  const digitalUsageData = {
    labels: ['Learning', 'Social', 'Entertainment', 'Breaks'],
    datasets: [{
      data: [180, 45, 30, 15],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      borderWidth: 0
    }]
  };

  // Screen time trend
  const screenTimeTrend = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Screen Time (hours)',
      data: [4.5, 5.2, 4.8, 5.5, 4.2, 6.0, 5.8],
      borderColor: '#10ac8b',
      backgroundColor: 'rgba(16, 172, 139, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Healthy Limit',
      data: [5, 5, 5, 5, 5, 5, 5],
      borderColor: '#10b981',
      borderDash: [5, 5],
      backgroundColor: 'transparent'
    }]
  };

  // Mental health mood data
  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Mood Score',
      data: [75, 80, 70, 85, 78, 90, 88],
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Your eUstaad Profile
          </h1>
          <p className="text-gray-600">Comprehensive learning analytics and personalized insights</p>
        </motion.div>

        {/* Hero Section - Enhanced Slot Machine PASCO Meter */}
        <FuturisticCard className="p-10 rounded-3xl" neonGlow={true}>
          {/* Header with animated title */}
          <div className="text-center mb-10">
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-accent/10 rounded-full mb-6 border-2 border-brand-primary/30 backdrop-blur-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: [
                  '0 0 20px rgba(16, 172, 139, 0.2)',
                  '0 0 40px rgba(16, 172, 139, 0.4)',
                  '0 0 20px rgba(16, 172, 139, 0.2)'
                ]
              }}
              transition={{
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            >
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <span className="text-base font-bold tracking-widest bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                YOUR PASCO SCORE
              </span>
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </motion.div>

            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Personalized Assessment for Students & Cognitive Development
            </motion.p>
          </div>

          {/* Enhanced Slot Machine Display - Shows "P1A2S3C4O5" */}
          <div className="relative mb-10">
            <motion.div
              className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 rounded-3xl pointer-events-none" />

              {/* Decorative corner accents */}
              {[
                { top: '0', left: '0', rotate: '0' },
                { top: '0', right: '0', rotate: '90' },
                { bottom: '0', right: '0', rotate: '180' },
                { bottom: '0', left: '0', rotate: '270' }
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12"
                  style={pos}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <div
                    className="w-full h-full border-l-2 border-t-2 border-brand-primary/30 rounded-tl-2xl"
                    style={{ transform: `rotate(${pos.rotate}deg)` }}
                  />
                </motion.div>
              ))}

              {/* PASCO Score Label */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-block bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 py-2 rounded-lg font-black text-sm tracking-widest shadow-md">
                  PASCO SCORE
                </div>
              </motion.div>

              {/* Slot Machine Reels - P1A2S3C4O5 Format */}
              <div className="flex justify-center items-center gap-1">
                <SlotReelCharacter character="P" color={pascoColors.P} delay={0} isLetter={true} />
                <SlotReelCharacter character={Math.round(metrics.P).toString()} color={pascoColors.P} delay={1} isLetter={false} />

                <SlotReelCharacter character="A" color={pascoColors.A} delay={2} isLetter={true} />
                <SlotReelCharacter character={Math.round(metrics.A).toString()} color={pascoColors.A} delay={3} isLetter={false} />

                <SlotReelCharacter character="S" color={pascoColors.S} delay={4} isLetter={true} />
                <SlotReelCharacter character={Math.round(metrics.S).toString()} color={pascoColors.S} delay={5} isLetter={false} />

                <SlotReelCharacter character="C" color={pascoColors.C} delay={6} isLetter={true} />
                <SlotReelCharacter character={Math.round(metrics.C).toString()} color={pascoColors.C} delay={7} isLetter={false} />

                <SlotReelCharacter character="O" color={pascoColors.O} delay={8} isLetter={true} />
                <SlotReelCharacter character={Math.round(metrics.O).toString()} color={pascoColors.O} delay={9} isLetter={false} />
              </div>
            </motion.div>
          </div>

          {/* Score Legend */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            {[
              { label: 'Personality', color: pascoColors.P, key: 'P' },
              { label: 'Aptitude', color: pascoColors.A, key: 'A' },
              { label: 'Skills', color: pascoColors.S, key: 'S' },
              { label: 'Cognitive', color: pascoColors.C, key: 'C' },
              { label: 'Overall', color: pascoColors.O, key: 'O' }
            ].map((item, index) => (
              <motion.div
                key={item.key}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Overall Performance Score */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3 }}
          >
            <div className="inline-block relative">
              {/* Animated rings around score */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-3xl border-2"
                  style={{
                    borderColor: `rgba(16, 172, 139, ${0.3 - i * 0.1})`
                  }}
                  animate={{
                    scale: [1, 1.1 + i * 0.1],
                    opacity: [0.3 - i * 0.1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeOut'
                  }}
                />
              ))}

              <div className="relative p-8 bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 rounded-3xl border-2 border-brand-primary/20 shadow-lg">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-3xl"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative">
                  <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                    OVERALL PERFORMANCE
                  </p>
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="w-8 h-8 text-brand-primary" />
                    <p className="text-7xl font-black bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                      {Math.round(getOverallScore() * 10)}%
                    </p>
                    <Trophy className="w-8 h-8 text-brand-secondary" />
                  </motion.div>
                  <motion.div
                    className="mt-3 text-xs text-gray-500 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                  >
                    {getOverallScore() * 10 >= 80 ? '🎉 Excellent Performance!' :
                     getOverallScore() * 10 >= 60 ? '👍 Good Progress!' :
                     '💪 Keep Growing!'}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </FuturisticCard>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'skills', label: 'Skills', icon: Target },
            { id: 'digital', label: 'Digital Usage', icon: Smartphone },
            { id: 'health', label: 'Health', icon: Heart },
            { id: 'mental', label: 'Mental Wellness', icon: Brain },
            { id: 'behavioral', label: 'Behavioral', icon: Users },
            { id: 'flags', label: 'Alerts', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewSection key="overview" metrics={metrics} pascoColors={pascoColors} />
          )}
          {activeTab === 'skills' && (
            <SkillsSection key="skills" skillGaps={mockSkillGaps} />
          )}
          {activeTab === 'digital' && (
            <DigitalUsageSection key="digital" usageData={digitalUsageData} trendData={screenTimeTrend} />
          )}
          {activeTab === 'health' && (
            <HealthSection key="health" healthMetrics={health} />
          )}
          {activeTab === 'mental' && (
            <MentalHealthSection key="mental" mentalHealth={mentalHealth} moodData={moodData} />
          )}
          {activeTab === 'behavioral' && (
            <BehavioralSection key="behavioral" celebrities={mockCelebrities} />
          )}
          {activeTab === 'flags' && (
            <RedFlagsSection key="flags" flags={redFlags} />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// Overview Section Component - Enhanced with comprehensive metrics
function OverviewSection({ metrics, pascoColors }: any) {
  // Mock historical data for progress tracking (last 30 days)
  const historicalData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [
      {
        label: 'Personality',
        data: [6.2, 6.5, 6.8, 7.0, metrics.P],
        backgroundColor: pascoColors.P,
        borderRadius: 8
      },
      {
        label: 'Aptitude',
        data: [7.0, 7.2, 7.3, 7.4, metrics.A],
        backgroundColor: pascoColors.A,
        borderRadius: 8
      },
      {
        label: 'Skills',
        data: [5.8, 6.2, 6.6, 7.0, metrics.S],
        backgroundColor: pascoColors.S,
        borderRadius: 8
      },
      {
        label: 'Cognitive',
        data: [6.5, 6.8, 7.1, 7.3, metrics.C],
        backgroundColor: pascoColors.C,
        borderRadius: 8
      },
      {
        label: 'Overall',
        data: [6.8, 7.0, 7.2, 7.4, metrics.O],
        backgroundColor: pascoColors.O,
        borderRadius: 8
      }
    ]
  };

  const radarData = {
    labels: ['Personality', 'Aptitude', 'Skills', 'Cognitive', 'Overall'],
    datasets: [
      {
        label: 'Current',
        data: [metrics.P, metrics.A, metrics.S, metrics.C, metrics.O],
        backgroundColor: 'rgba(16, 172, 139, 0.2)',
        borderColor: 'rgba(16, 172, 139, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 172, 139, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 172, 139, 1)'
      },
      {
        label: 'Last Month',
        data: [6.2, 7.0, 5.8, 6.5, 6.8],
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(168, 85, 247, 0.5)',
        pointBorderColor: '#fff'
      }
    ]
  };

  // Calculate strengths and improvements
  const allMetrics = [
    { label: 'Personality', value: metrics.P, color: pascoColors.P, key: 'P' },
    { label: 'Aptitude', value: metrics.A, color: pascoColors.A, key: 'A' },
    { label: 'Skills', value: metrics.S, color: pascoColors.S, key: 'S' },
    { label: 'Cognitive', value: metrics.C, color: pascoColors.C, key: 'C' },
    { label: 'Overall', value: metrics.O, color: pascoColors.O, key: 'O' }
  ];

  const strengths = allMetrics.filter(m => m.value >= 7);
  const improvements = allMetrics.filter(m => m.value < 7);

  // Mock achievements
  const recentAchievements = [
    {
      title: 'Consistency Champion',
      description: '7-day learning streak maintained',
      icon: Flame,
      color: '#f59e0b',
      date: '2 days ago'
    },
    {
      title: 'Skills Master',
      description: 'Skills score increased by 20%',
      icon: Trophy,
      color: '#10b981',
      date: '1 week ago'
    },
    {
      title: 'Test Ace',
      description: 'Scored 90%+ on last 3 tests',
      icon: Award,
      color: '#8b5cf6',
      date: '2 weeks ago'
    }
  ];

  // Personalized recommendations
  const getRecommendations = () => {
    const recommendations = [];

    if (metrics.P < 7) {
      recommendations.push({
        area: 'Personality',
        color: pascoColors.P,
        tips: [
          'Complete personality assessment quizzes',
          'Engage in team activities and group discussions',
          'Practice self-reflection journaling'
        ]
      });
    }

    if (metrics.A < 7) {
      recommendations.push({
        area: 'Aptitude',
        color: pascoColors.A,
        tips: [
          'Take aptitude practice tests regularly',
          'Focus on logical reasoning exercises',
          'Explore diverse problem-solving techniques'
        ]
      });
    }

    if (metrics.S < 7) {
      recommendations.push({
        area: 'Skills',
        color: pascoColors.S,
        tips: [
          'Enroll in skill development courses',
          'Practice hands-on projects',
          'Attend workshops and webinars'
        ]
      });
    }

    if (metrics.C < 7) {
      recommendations.push({
        area: 'Cognitive',
        color: pascoColors.C,
        tips: [
          'Play brain training games daily',
          'Practice mindfulness and meditation',
          'Get adequate sleep (7-8 hours)'
        ]
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Top Section: Radar Chart and Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PASCO Radar Chart with Comparison */}
        <FuturisticCard className="p-6 rounded-2xl">
          <SectionHeader
            icon={PieChart}
            title="PASCO Distribution"
            subtitle="Current vs Last Month comparison"
          />
          <div className="h-80">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { stepSize: 2, color: '#9ca3af' },
                    grid: { color: '#e5e7eb' },
                    pointLabels: { color: '#4b5563', font: { size: 12, weight: '600' } }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: '#4b5563', font: { size: 12 } }
                  }
                }
              }}
            />
          </div>
        </FuturisticCard>

        {/* Quick Stats */}
        <div className="space-y-4">
          {allMetrics.map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-primary/30 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    {item.key === 'P' && <Heart className="w-5 h-5" style={{ color: item.color }} />}
                    {item.key === 'A' && <Star className="w-5 h-5" style={{ color: item.color }} />}
                    {item.key === 'S' && <Target className="w-5 h-5" style={{ color: item.color }} />}
                    {item.key === 'C' && <Brain className="w-5 h-5" style={{ color: item.color }} />}
                    {item.key === 'O' && <Zap className="w-5 h-5" style={{ color: item.color }} />}
                  </div>
                  <span className="font-semibold text-gray-800">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black" style={{ color: item.color }}>
                    {Math.round(item.value)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{((item.value - 6.5) / 6.5 * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / 10) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Timeline */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={TrendingUp}
          title="Progress Timeline"
          subtitle="Your growth over the last 30 days"
        />
        <div className="h-80">
          <Bar
            data={historicalData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#4b5563', font: { size: 12 } }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}/10`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                  ticks: { stepSize: 2, color: '#9ca3af' },
                  grid: { color: '#e5e7eb' }
                },
                x: {
                  ticks: { color: '#9ca3af' },
                  grid: { display: false }
                }
              }
            }}
          />
        </div>
      </FuturisticCard>

      {/* Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <FuturisticCard className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Your Strengths</h3>
              <p className="text-sm text-gray-600">Areas where you excel (7+)</p>
            </div>
          </div>

          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <motion.div
                  key={strength.key}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: strength.color }}
                  />
                  <span className="font-semibold text-gray-800 flex-1">{strength.label}</span>
                  <span className="text-lg font-black" style={{ color: strength.color }}>
                    {Math.round(strength.value)}/10
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Keep working to achieve scores of 7 or higher!</p>
            </div>
          )}
        </FuturisticCard>

        {/* Areas for Improvement */}
        <FuturisticCard className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Growth Areas</h3>
              <p className="text-sm text-gray-600">Focus on these for improvement</p>
            </div>
          </div>

          {improvements.length > 0 ? (
            <div className="space-y-3">
              {improvements.map((area, index) => (
                <motion.div
                  key={area.key}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                  <span className="font-semibold text-gray-800 flex-1">{area.label}</span>
                  <span className="text-lg font-black" style={{ color: area.color }}>
                    {Math.round(area.value)}/10
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-3">🎉</div>
              <p className="font-semibold">All areas are strong!</p>
            </div>
          )}
        </FuturisticCard>
      </div>

      {/* Recent Achievements */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={Award}
          title="Recent Achievements"
          subtitle="Your latest milestones and wins"
        />
        <div className="grid md:grid-cols-3 gap-4">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-200 hover:border-brand-primary/30 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${achievement.color}20` }}
              >
                <achievement.icon className="w-8 h-8" style={{ color: achievement.color }} />
              </div>
              <h4 className="font-bold text-gray-800 text-center mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 text-center mb-3">{achievement.description}</p>
              <div className="text-xs text-gray-500 text-center">{achievement.date}</div>

              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-12 h-12 opacity-10"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${achievement.color} 50%)`
                }}
              />
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <FuturisticCard className="p-6 rounded-2xl">
          <SectionHeader
            icon={Lightbulb}
            title="Personalized Recommendations"
            subtitle="Targeted actions to boost your scores"
          />
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.area}
                className="p-5 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl border border-brand-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: rec.color }}
                  />
                  <h4 className="font-bold text-gray-800 text-lg">
                    Improve Your {rec.area}
                  </h4>
                </div>
                <div className="space-y-2 ml-6">
                  {rec.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </FuturisticCard>
      )}

      {/* Quick Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.button
          className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <BookOpen className="w-5 h-5" />
          Start Learning
        </motion.button>

        <motion.button
          className="p-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Target className="w-5 h-5" />
          Take Assessment
        </motion.button>

        <motion.button
          className="p-4 bg-white border-2 border-purple-500 text-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-5 h-5" />
          View Progress
        </motion.button>
      </div>
    </motion.div>
  );
}

// Skills Section Component - Enhanced with comprehensive analysis
function SkillsSection({ skillGaps }: any) {
  // Add more comprehensive skill data
  const allSkills = [
    ...skillGaps,
    { skill: 'Problem Solving', current: 80, target: 90, priority: 'low' as const, improvement: ['Solve coding challenges daily', 'Practice algorithm questions', 'Work on real-world projects'], category: 'Cognitive' },
    { skill: 'Leadership', current: 68, target: 85, priority: 'medium' as const, improvement: ['Lead team projects', 'Take leadership courses', 'Mentor junior members'], category: 'Soft Skills' },
    { skill: 'Data Analysis', current: 72, target: 88, priority: 'medium' as const, improvement: ['Learn advanced Excel/Tableau', 'Practice with datasets', 'Take statistics courses'], category: 'Technical' }
  ];

  // Group by category
  const categories = {
    'Technical': allSkills.filter(s => ['Data Analysis', 'Problem Solving'].includes(s.skill)),
    'Soft Skills': allSkills.filter(s => ['Communication', 'Leadership'].includes(s.skill)),
    'Cognitive': allSkills.filter(s => ['Time Management', 'Critical Thinking', 'Problem Solving'].includes(s.skill))
  };

  // Radar chart data for skills
  const skillsRadarData = {
    labels: allSkills.map(s => s.skill),
    datasets: [{
      label: 'Current Level',
      data: allSkills.map(s => s.current),
      backgroundColor: 'rgba(16, 172, 139, 0.2)',
      borderColor: 'rgba(16, 172, 139, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(16, 172, 139, 1)',
    },
    {
      label: 'Target Level',
      data: allSkills.map(s => s.target),
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: 'rgba(168, 85, 247, 0.8)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointBackgroundColor: 'rgba(168, 85, 247, 0.8)',
    }]
  };

  // Calculate learning resources needed
  const learningResources = [
    { skill: 'Time Management', resources: ['Pomodoro Timer App', 'Todoist Premium', 'Deep Work by Cal Newport'] },
    { skill: 'Critical Thinking', resources: ['Critical Thinking Course (Coursera)', 'Think Again by Adam Grant', 'Philosophy 101'] },
    { skill: 'Communication', resources: ['Toastmasters Club', 'TED Talks Speaking', 'Business Writing Course'] }
  ];

  // Calculate overall skill completion
  const overallProgress = allSkills.reduce((sum, skill) => sum + (skill.current / skill.target), 0) / allSkills.length * 100;

  // Priority distribution
  const priorityCount = {
    high: allSkills.filter(s => s.priority === 'high').length,
    medium: allSkills.filter(s => s.priority === 'medium').length,
    low: allSkills.filter(s => s.priority === 'low').length
  };

  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Overall Skills Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <FuturisticCard className="p-6 rounded-2xl text-center" neonGlow={true}>
          <Target className="w-12 h-12 text-brand-primary mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
          <p className="text-4xl font-black text-brand-primary">{Math.round(overallProgress)}%</p>
          <p className="text-xs text-gray-500 mt-2">of target levels achieved</p>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl text-center">
          <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Skills Tracked</p>
          <p className="text-4xl font-black text-purple-600">{allSkills.length}</p>
          <p className="text-xs text-gray-500 mt-2">across all categories</p>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl text-center">
          <Flame className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">High Priority</p>
          <p className="text-4xl font-black text-orange-500">{priorityCount.high}</p>
          <p className="text-xs text-gray-500 mt-2">critical skills to develop</p>
        </FuturisticCard>
      </div>

      {/* Skills Radar Chart */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={PieChart}
          title="Skills Matrix"
          subtitle="Visual representation of your current vs target skill levels"
        />
        <div className="h-96">
          <Radar
            data={skillsRadarData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { stepSize: 20, color: '#9ca3af' },
                  grid: { color: '#e5e7eb' },
                  pointLabels: { color: '#4b5563', font: { size: 11, weight: '600' } }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#4b5563', font: { size: 12 } }
                }
              }
            }}
          />
        </div>
      </FuturisticCard>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(categories).map(([category, skills], catIndex) => (
          skills.length > 0 && (
            <FuturisticCard key={category} className="p-6 rounded-2xl" delay={catIndex * 0.1}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                  {category === 'Technical' && <Award className="w-6 h-6 text-white" />}
                  {category === 'Soft Skills' && <Users className="w-6 h-6 text-white" />}
                  {category === 'Cognitive' && <Brain className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{category} Skills</h3>
              </div>

              <div className="space-y-4">
                {skills.map((skill: any, index: number) => (
                  <motion.div
                    key={skill.skill}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-brand-primary/30 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-800">{skill.skill}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            skill.priority === 'high'
                              ? 'bg-red-100 text-red-600'
                              : skill.priority === 'medium'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {skill.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Current: <span className="font-semibold text-brand-primary">{skill.current}%</span></span>
                          <ChevronRight className="w-4 h-4" />
                          <span>Target: <span className="font-semibold text-purple-600">{skill.target}%</span></span>
                          <span className="ml-auto">Gap: <span className="font-semibold text-orange-600">{skill.target - skill.current}%</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="absolute h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.current}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                      <div
                        className="absolute h-full border-l-2 border-purple-500"
                        style={{ left: `${skill.target}%` }}
                      >
                        <div className="absolute -top-1 left-0 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2" />
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <Timer className="w-4 h-4 text-brand-primary" />
                      <span className="text-gray-600">
                        Estimated time to target: <span className="font-semibold text-brand-primary">
                          {Math.ceil((skill.target - skill.current) / 5)} weeks
                        </span>
                      </span>
                    </div>

                    {/* Improvement Actions */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Action Plan:
                      </h5>
                      <div className="grid md:grid-cols-2 gap-2">
                        {skill.improvement.map((step: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-700 p-2 bg-white rounded-lg border border-gray-100">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>
          )
        ))}
      </div>

      {/* Learning Resources & Recommendations */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={BookOpen}
          title="Recommended Learning Resources"
          subtitle="Curated materials to help you bridge your skill gaps"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {learningResources.map((item, index) => (
            <motion.div
              key={item.skill}
              className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-brand-primary/40 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800">{item.skill}</h4>
              </div>
              <div className="space-y-2">
                {item.resources.map((resource, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ChevronRight className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span>{resource}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                Explore Resources
              </button>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Industry Benchmarks */}
      <FuturisticCard className="p-6 rounded-2xl">
        <SectionHeader
          icon={BarChart3}
          title="Industry Benchmarks"
          subtitle="Compare your skills with industry standards"
        />
        <div className="space-y-4">
          {allSkills.slice(0, 4).map((skill, index) => {
            const industryAvg = 75; // Mock industry average
            return (
              <div key={skill.skill} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">{skill.skill}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      You: <span className="font-semibold text-brand-primary">{skill.current}%</span>
                    </span>
                    <span className="text-gray-600">
                      Industry: <span className="font-semibold text-purple-600">{industryAvg}%</span>
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-brand-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.current}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                  <div
                    className="absolute h-full border-l-2 border-purple-500"
                    style={{ left: `${industryAvg}%` }}
                  >
                    <div className="absolute -top-1 left-0 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {skill.current >= industryAvg ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Above industry average by {skill.current - industryAvg}%
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Below industry average by {industryAvg - skill.current}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </FuturisticCard>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <BookOpen className="w-5 h-5" />
          Browse Courses
        </motion.button>

        <motion.button
          className="p-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Target className="w-5 h-5" />
          Take Skill Assessment
        </motion.button>
      </div>
    </motion.div>
  );
}

// Digital Usage Section - Enhanced with comprehensive analytics
function DigitalUsageSection({ usageData, trendData }: any) {
  const totalMinutes = usageData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Calculate health metrics
  const healthyLimit = 5; // hours per day
  const currentAvg = hours + (minutes / 60);
  const isHealthy = currentAvg <= healthyLimit;
  const weeklyAvg = 5.1; // Mock weekly average

  // App-specific breakdown
  const appBreakdown = [
    { app: 'Study Apps', time: 180, percentage: 66.7, category: 'Productive', color: '#10b981' },
    { app: 'Social Media', time: 45, percentage: 16.7, category: 'Social', color: '#3b82f6' },
    { app: 'Entertainment', time: 30, percentage: 11.1, category: 'Leisure', color: '#f59e0b' },
    { app: 'Breaks', time: 15, percentage: 5.6, category: 'Rest', color: '#8b5cf6' }
  ];

  // Productivity insights
  const productivityScore = 78;
  const focusTime = 3.2;
  const distractionTime = 1.3;

  return (
    <motion.div
      key="digital"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <FuturisticCard className="p-6 rounded-2xl text-center" neonGlow={true}>
          <Smartphone className="w-10 h-10 text-brand-primary mx-auto mb-3" />
          <p className="text-xs text-gray-600 mb-2">Today's Screen Time</p>
          <p className="text-3xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            {hours}h {minutes}m
          </p>
          <div className={`mt-2 text-xs font-semibold ${isHealthy ? 'text-green-600' : 'text-orange-600'}`}>
            {isHealthy ? '✓ Within healthy limits' : '⚠ Above recommended'}
          </div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl text-center">
          <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <p className="text-xs text-gray-600 mb-2">Productivity Score</p>
          <p className="text-3xl font-black text-purple-600">{productivityScore}%</p>
          <div className="mt-2 text-xs text-green-600 font-semibold">+5% from last week</div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl text-center">
          <Target className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <p className="text-xs text-gray-600 mb-2">Focus Time</p>
          <p className="text-3xl font-black text-green-600">{focusTime}h</p>
          <div className="mt-2 text-xs text-gray-600">Deep work sessions</div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl text-center">
          <Clock className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <p className="text-xs text-gray-600 mb-2">Weekly Average</p>
          <p className="text-3xl font-black text-amber-600">{weeklyAvg}h</p>
          <div className="mt-2 text-xs text-gray-600">per day</div>
        </FuturisticCard>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Usage Breakdown */}
        <FuturisticCard className="p-6 rounded-2xl">
          <SectionHeader
            icon={PieChart}
            title="Usage Breakdown"
            subtitle="How you spend your screen time"
          />
          <div className="h-64 mb-4">
            <Doughnut
              data={usageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#4b5563', font: { size: 12 } }
                  }
                }
              }}
            />
          </div>
        </FuturisticCard>

        {/* Weekly Trend */}
        <FuturisticCard className="p-6 rounded-2xl">
          <SectionHeader
            icon={BarChart3}
            title="Weekly Trend"
            subtitle="Your screen time patterns"
          />
          <div className="h-64">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#4b5563', font: { size: 12 } }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#e5e7eb' }
                  },
                  x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#e5e7eb' }
                  }
                }
              }}
            />
          </div>
        </FuturisticCard>
      </div>

      {/* Detailed App Breakdown */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={Smartphone}
          title="App Usage Details"
          subtitle="Time spent on different categories"
        />
        <div className="space-y-4">
          {appBreakdown.map((app, index) => (
            <motion.div
              key={app.app}
              className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${app.color}20` }}
                  >
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: app.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{app.app}</h4>
                    <p className="text-xs text-gray-600">{app.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: app.color }}>
                    {Math.floor(app.time / 60)}h {app.time % 60}m
                  </p>
                  <p className="text-xs text-gray-600">{app.percentage}%</p>
                </div>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{ backgroundColor: app.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${app.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Insights & Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <FuturisticCard className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Positive Habits</h3>
              <p className="text-sm text-gray-600">What you're doing right</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, text: '67% time spent on learning', color: 'text-green-600' },
              { icon: CheckCircle, text: 'Consistent study schedule', color: 'text-green-600' },
              { icon: CheckCircle, text: 'Good focus time ratio', color: 'text-green-600' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Recommendations</h3>
              <p className="text-sm text-gray-600">Ways to improve</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: ChevronRight, text: 'Reduce social media to 30 min/day', color: 'text-amber-600' },
              { icon: ChevronRight, text: 'Take 10-min breaks every hour', color: 'text-amber-600' },
              { icon: ChevronRight, text: 'Enable focus mode during study', color: 'text-amber-600' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </FuturisticCard>
      </div>

      {/* Digital Wellbeing Goals */}
      <FuturisticCard className="p-6 rounded-2xl">
        <SectionHeader
          icon={Target}
          title="Digital Wellbeing Goals"
          subtitle="Track your healthy screen time goals"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { goal: 'Daily Screen Time', current: currentAvg, target: healthyLimit, unit: 'hours' },
            { goal: 'Social Media', current: 0.75, target: 0.5, unit: 'hours' },
            { goal: 'Learning Time', current: 3, target: 4, unit: 'hours' }
          ].map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const isOnTrack = goal.current <= goal.target;
            return (
              <div key={goal.goal} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">{goal.goal}</h4>
                <div className="flex items-end gap-2 mb-3">
                  <span className={`text-3xl font-black ${isOnTrack ? 'text-green-600' : 'text-orange-600'}`}>
                    {goal.current.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 mb-1">/ {goal.target} {goal.unit}</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute h-full rounded-full ${isOnTrack ? 'bg-green-500' : 'bg-orange-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {isOnTrack ? '✓ On track' : `${(goal.current - goal.target).toFixed(1)}${goal.unit} over goal`}
                </p>
              </div>
            );
          })}
        </div>
      </FuturisticCard>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Shield className="w-5 h-5" />
          Set App Limits
        </motion.button>

        <motion.button
          className="p-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-5 h-5" />
          View Detailed Report
        </motion.button>
      </div>
    </motion.div>
  );
}

// Health Section - Enhanced with comprehensive wellness tracking
function HealthSection({ healthMetrics }: any) {
  // Mock health data
  const weeklyActivity = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Activity Minutes',
      data: [45, 60, 30, 75, 50, 90, 80],
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: '#10b981',
      borderWidth: 2
    }]
  };

  const healthGoals = [
    { goal: 'Daily Exercise', current: 60, target: 30, unit: 'mins', icon: Activity, color: '#10b981' },
    { goal: 'Sleep Duration', current: 7.5, target: 8, unit: 'hours', icon: Clock, color: '#8b5cf6' },
    { goal: 'Water Intake', current: 6, target: 8, unit: 'glasses', icon: Heart, color: '#3b82f6' },
    { goal: 'Steps', current: 8500, target: 10000, unit: 'steps', icon: TrendingUp, color: '#f59e0b' }
  ];

  return (
    <motion.div
      key="health"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Main Health Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Activity Level', value: healthMetrics.activityLevel, icon: Activity, color: '#10b981', desc: 'Daily movement' },
          { label: 'Sleep Quality', value: `${healthMetrics.sleepQuality}%`, icon: Clock, color: '#8b5cf6', desc: 'Rest & recovery' },
          { label: 'Wellness Score', value: `${healthMetrics.wellnessScore}%`, icon: Heart, color: '#ec4899', desc: 'Overall health' }
        ].map((metric, index) => (
          <FuturisticCard key={metric.label} className="p-6 rounded-2xl text-center" delay={index * 0.1} neonGlow={index === 2}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${metric.color}20` }}>
              <metric.icon className="w-8 h-8" style={{ color: metric.color }} />
            </div>
            <h4 className="text-sm text-gray-600 mb-2">{metric.label}</h4>
            <p className="text-4xl font-black mb-2" style={{ color: metric.color }}>
              {typeof metric.value === 'string' ? metric.value : metric.value.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">{metric.desc}</p>
          </FuturisticCard>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <FuturisticCard className="p-6 rounded-2xl">
        <SectionHeader icon={BarChart3} title="Weekly Activity" subtitle="Your exercise minutes this week" />
        <div className="h-64">
          <Bar data={weeklyActivity} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: '#e5e7eb' } }, x: { ticks: { color: '#9ca3af' }, grid: { display: false } } } }} />
        </div>
      </FuturisticCard>

      {/* Health Goals */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader icon={Target} title="Health Goals" subtitle="Track your daily wellness targets" />
        <div className="grid md:grid-cols-2 gap-4">
          {healthGoals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const isAchieved = goal.current >= goal.target;
            return (
              <motion.div key={goal.goal} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${goal.color}20` }}>
                    <goal.icon className="w-5 h-5" style={{ color: goal.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{goal.goal}</h4>
                    <p className="text-xs text-gray-600">{goal.current} / {goal.target} {goal.unit}</p>
                  </div>
                  {isAchieved && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className={`absolute h-full rounded-full ${isAchieved ? 'bg-green-500' : 'bg-gray-400'}`} style={{ backgroundColor: goal.color }} initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 1, delay: index * 0.1 }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </FuturisticCard>

      {/* Health Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <FuturisticCard className="p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Trophy className="w-6 h-6 text-green-600" /> Healthy Habits</h3>
          <div className="space-y-3">
            {['Consistent exercise routine', 'Good sleep hygiene', 'Balanced daily routine'].map((habit, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">{habit}</span>
              </div>
            ))}
          </div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Lightbulb className="w-6 h-6 text-amber-600" /> Suggestions</h3>
          <div className="space-y-3">
            {['Increase water intake by 2 glasses', 'Add 30 mins morning walk', 'Maintain 8-hour sleep schedule'].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <ChevronRight className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </FuturisticCard>
      </div>
    </motion.div>
  );
}

// Mental Health Section - Enhanced with detailed mood tracking
function MentalHealthSection({ mentalHealth, moodData }: any) {
  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
  const recentMoods = [
    { day: 'Today', mood: '😊', score: 88, color: '#10b981' },
    { day: 'Yesterday', mood: '😊', score: 90, color: '#10b981' },
    { day: '2 days ago', mood: '🙂', score: 78, color: '#10ac8b' },
    { day: '3 days ago', mood: '🙂', score: 85, color: '#10ac8b' }
  ];

  const mentalHealthTips = [
    { category: 'Stress Management', tips: ['Practice deep breathing', '10-min meditation daily', 'Regular exercise breaks'], icon: Brain },
    { category: 'Emotional Balance', tips: ['Journal your feelings', 'Talk to someone you trust', 'Practice gratitude'], icon: Heart },
    { category: 'Mindfulness', tips: ['Focus on present moment', 'Take mindful walks', 'Digital detox hours'], icon: Zap }
  ];

  return (
    <motion.div key="mental" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      {/* Mood Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Mood Score', value: mentalHealth.moodScore, icon: '😊', color: '#ec4899' },
          { label: 'Stress Level', value: mentalHealth.stressLevel, icon: '⚡', color: '#f59e0b' },
          { label: 'Anxiety', value: mentalHealth.anxietyLevel, icon: '😰', color: '#ef4444' },
          { label: 'Coping', value: mentalHealth.copingEffectiveness, icon: '💪', color: '#10b981' }
        ].map((metric, index) => (
          <FuturisticCard key={metric.label} className="p-6 rounded-2xl text-center" delay={index * 0.1}>
            <div className="text-4xl mb-2">{metric.icon}</div>
            <p className="text-xs text-gray-600 mb-2">{metric.label}</p>
            <p className="text-3xl font-black" style={{ color: metric.color }}>{metric.value}%</p>
          </FuturisticCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
          <SectionHeader icon={BarChart3} title="Weekly Mood Trend" subtitle="Track your emotional wellbeing" />
          <div className="h-64">
            <Line data={moodData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#9ca3af' }, grid: { color: '#e5e7eb' } }, x: { ticks: { color: '#9ca3af' }, grid: { color: '#e5e7eb' } } } }} />
          </div>
        </FuturisticCard>

        <FuturisticCard className="p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Mood Log</h3>
          <div className="space-y-3">
            {recentMoods.map((entry, index) => (
              <motion.div key={entry.day} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="text-3xl">{entry.mood}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{entry.day}</p>
                  <p className="text-xs text-gray-600">Mood score: {entry.score}%</p>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ backgroundColor: entry.color, width: `${entry.score}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </FuturisticCard>
      </div>

      {/* Mental Health Tips */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader icon={Lightbulb} title="Mental Wellness Tips" subtitle="Personalized recommendations for your wellbeing" />
        <div className="grid md:grid-cols-3 gap-6">
          {mentalHealthTips.map((category, index) => (
            <motion.div key={category.category} className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800">{category.category}</h4>
              </div>
              <div className="space-y-2">
                {category.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ChevronRight className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <Brain className="w-5 h-5" />Log Today's Mood
        </motion.button>
        <motion.button className="p-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition-all" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <Heart className="w-5 h-5" />Access Support Resources
        </motion.button>
      </div>
    </motion.div>
  );
}

// Behavioral Analysis Section
function BehavioralSection({ celebrities }: any) {
  // Big Five Personality Traits (mock data)
  const bigFive = {
    openness: 78,
    conscientiousness: 85,
    extraversion: 62,
    agreeableness: 72,
    neuroticism: 35 // Lower is better
  };

  // Behavioral patterns (scales 0-100)
  const behavioralPatterns = [
    { trait: 'Introvert vs Extrovert', score: 62, left: 'Introvert', right: 'Extrovert' },
    { trait: 'Thinking vs Feeling', score: 68, left: 'Thinking', right: 'Feeling' },
    { trait: 'Judging vs Perceiving', score: 75, left: 'Judging', right: 'Perceiving' },
    { trait: 'Sensing vs Intuition', score: 55, left: 'Sensing', right: 'Intuition' }
  ];

  // Enhanced celebrity matches (expanded from 3 to 6)
  const enhancedCelebrities = [
    {
      name: 'Elon Musk',
      profession: 'Entrepreneur & Innovator',
      match: 87,
      trait: 'High Openness to Experience',
      avatar: '🚀',
      description: 'Shares your visionary thinking and problem-solving approach',
      commonTraits: ['Innovative', 'Risk-taker', 'Strategic thinker']
    },
    {
      name: 'Oprah Winfrey',
      profession: 'Media Executive & Philanthropist',
      match: 82,
      trait: 'High Emotional Intelligence',
      avatar: '⭐',
      description: 'Similar empathy and communication skills',
      commonTraits: ['Empathetic', 'Influential', 'Goal-oriented']
    },
    {
      name: 'Bill Gates',
      profession: 'Technology Pioneer',
      match: 78,
      trait: 'High Conscientiousness',
      avatar: '💻',
      description: 'Matches your analytical and systematic approach',
      commonTraits: ['Analytical', 'Detail-oriented', 'Persistent']
    },
    {
      name: 'Michelle Obama',
      profession: 'Lawyer & Former First Lady',
      match: 75,
      trait: 'Strong Leadership',
      avatar: '👑',
      description: 'Shares your balanced approach to challenges',
      commonTraits: ['Diplomatic', 'Inspiring', 'Resilient']
    },
    {
      name: 'Steve Jobs',
      profession: 'Visionary & Designer',
      match: 72,
      trait: 'Creative Excellence',
      avatar: '🎨',
      description: 'Similar perfectionism and attention to detail',
      commonTraits: ['Perfectionist', 'Creative', 'Determined']
    },
    {
      name: 'Malala Yousafzai',
      profession: 'Education Activist',
      match: 70,
      trait: 'Strong Values',
      avatar: '📚',
      description: 'Matches your commitment and resilience',
      commonTraits: ['Principled', 'Courageous', 'Focused']
    }
  ];

  // Career suggestions based on personality
  const careerSuggestions = [
    {
      title: 'Technology & Innovation',
      match: 88,
      careers: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'],
      icon: Lightbulb,
      color: '#10ac8b'
    },
    {
      title: 'Business & Leadership',
      match: 82,
      careers: ['Management Consultant', 'Business Analyst', 'Entrepreneur', 'Project Manager'],
      icon: Trophy,
      color: '#3b82f6'
    },
    {
      title: 'Education & Research',
      match: 75,
      careers: ['Researcher', 'University Professor', 'Educational Consultant', 'Curriculum Developer'],
      icon: BookOpen,
      color: '#8b5cf6'
    }
  ];

  // Personality insights
  const insights = [
    {
      type: 'Strength',
      title: 'Excellent Self-Discipline',
      description: 'Your high conscientiousness (85%) indicates strong organizational skills and reliability.',
      icon: Shield,
      color: '#10b981'
    },
    {
      type: 'Strength',
      title: 'Open to New Ideas',
      description: 'Your openness score (78%) shows you embrace learning and creative thinking.',
      icon: Sparkles,
      color: '#10b981'
    },
    {
      type: 'Development',
      title: 'Balanced Social Energy',
      description: 'Your moderate extraversion (62%) suggests you balance social and solo activities well.',
      icon: Users,
      color: '#f59e0b'
    },
    {
      type: 'Development',
      title: 'Emotional Stability',
      description: 'Low neuroticism (35%) indicates strong emotional resilience and stress management.',
      icon: Heart,
      color: '#10b981'
    }
  ];

  // Big Five radar chart data
  const bigFiveData = {
    labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Stability'],
    datasets: [{
      label: 'Your Personality',
      data: [bigFive.openness, bigFive.conscientiousness, bigFive.extraversion, bigFive.agreeableness, 100 - bigFive.neuroticism],
      backgroundColor: 'rgba(16, 172, 139, 0.2)',
      borderColor: '#10ac8b',
      borderWidth: 3,
      pointBackgroundColor: '#10ac8b',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, color: '#6b7280', backdropColor: 'transparent' },
        grid: { color: '#e5e7eb' },
        pointLabels: { font: { size: 12, weight: 'bold' }, color: '#374151' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <motion.div
      key="behavioral"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
        <SectionHeader
          icon={Users}
          title="Behavioral Traits Analysis"
          subtitle="Comprehensive personality profile based on Big Five model"
        />
      </FuturisticCard>

      {/* Big Five Overview Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        {[
          { label: 'Openness', score: bigFive.openness, icon: Lightbulb, color: '#10ac8b' },
          { label: 'Conscientiousness', score: bigFive.conscientiousness, icon: Target, color: '#3b82f6' },
          { label: 'Extraversion', score: bigFive.extraversion, icon: Users, color: '#f59e0b' },
          { label: 'Agreeableness', score: bigFive.agreeableness, icon: Heart, color: '#ec4899' },
          { label: 'Stability', score: 100 - bigFive.neuroticism, icon: Shield, color: '#10b981' }
        ].map((trait, index) => (
          <FuturisticCard key={trait.label} className="p-4 rounded-xl" delay={index * 0.05}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${trait.color}20` }}>
                <trait.icon className="w-6 h-6" style={{ color: trait.color }} />
              </div>
              <div className="text-3xl font-black mb-1" style={{ color: trait.color }}>{trait.score}%</div>
              <div className="text-xs text-gray-600 font-semibold">{trait.label}</div>
            </div>
          </FuturisticCard>
        ))}
      </div>

      {/* Big Five Radar Chart */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-primary" />
          Big Five Personality Profile
        </h3>
        <div className="h-80">
          <Radar data={bigFiveData} options={radarOptions} />
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg border border-brand-primary/20">
          <p className="text-sm text-gray-700">
            <strong>Your Profile:</strong> You show high conscientiousness and openness, indicating strong work ethic and creativity.
            Your balanced extraversion suggests adaptability in both social and independent settings.
          </p>
        </div>
      </FuturisticCard>

      {/* Behavioral Patterns */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-brand-primary" />
          Behavioral Patterns
        </h3>
        <div className="space-y-6">
          {behavioralPatterns.map((pattern, index) => (
            <motion.div
              key={pattern.trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{pattern.trait}</span>
                <span className="text-sm font-bold text-brand-primary">{pattern.score}%</span>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pattern.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{pattern.left}</span>
                <span className="text-xs text-gray-500">{pattern.right}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Personality Insights */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-primary" />
          Personality Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2"
              style={{ borderColor: `${insight.color}40` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${insight.color}20` }}>
                  <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${insight.color}20`, color: insight.color }}>
                      {insight.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Celebrity Matches */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-brand-primary" />
          Personality Matches with Successful Leaders
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {enhancedCelebrities.map((celeb, index) => (
            <motion.div
              key={celeb.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-brand-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">{celeb.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{celeb.name}</h4>
                  <p className="text-xs text-gray-600">{celeb.profession}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-brand-primary">{celeb.match}%</div>
                  <div className="text-xs text-gray-600">Match</div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{celeb.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700">{celeb.trait}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {celeb.commonTraits.map((trait) => (
                  <span key={trait} className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-semibold">
                    {trait}
                  </span>
                ))}
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${celeb.match}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Career Suggestions */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-primary" />
          Career Paths Based on Your Personality
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {careerSuggestions.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2"
              style={{ borderColor: `${category.color}40` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                  <category.icon className="w-6 h-6" style={{ color: category.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{category.title}</h4>
                  <div className="text-lg font-black" style={{ color: category.color }}>{category.match}% Match</div>
                </div>
              </div>

              <div className="space-y-2">
                {category.careers.map((career) => (
                  <div key={career} className="flex items-center gap-2 text-sm text-gray-700">
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: category.color }} />
                    <span>{career}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </FuturisticCard>

      {/* Peer Comparison */}
      <FuturisticCard className="p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-primary" />
          How You Compare with Your Peers
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-black text-green-600 mb-1">Top 15%</div>
              <div className="text-sm text-gray-700">Conscientiousness</div>
              <p className="text-xs text-gray-600 mt-2">You're more organized than 85% of peers</p>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-black text-blue-600 mb-1">Top 20%</div>
              <div className="text-sm text-gray-700">Openness</div>
              <p className="text-xs text-gray-600 mt-2">More creative than 80% of peers</p>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
            <div className="text-center">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-black text-purple-600 mb-1">Top 30%</div>
              <div className="text-sm text-gray-700">Emotional Stability</div>
              <p className="text-xs text-gray-600 mt-2">Better stress management than 70% of peers</p>
            </div>
          </div>
        </div>
      </FuturisticCard>

      {/* Quick Actions */}
      <FuturisticCard className="p-6 rounded-2xl">
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Take Full Assessment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-brand-primary font-semibold rounded-xl border-2 border-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            Explore Career Paths
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            Download Report
          </motion.button>
        </div>
      </FuturisticCard>
    </motion.div>
  );
}

// Red Flags Section
function RedFlagsSection({ flags }: any) {
  // Comprehensive mock flags across all categories
  const mockFlags = [
    {
      id: '1',
      category: 'performance',
      severity: 'high',
      title: 'Declining Test Scores',
      description: 'Your test performance has dropped by 15% over the last month. Mathematics and Physics scores show the most significant decline.',
      actions: ['Schedule tutoring session for Math & Physics', 'Review study materials and notes', 'Take practice tests weekly', 'Join peer study group'],
      detectedDate: '2 days ago',
      impact: 'High impact on overall GPA and course progress',
      trend: 'declining',
      resolved: false
    },
    {
      id: '2',
      category: 'engagement',
      severity: 'medium',
      title: 'Reduced Class Participation',
      description: 'Class attendance has decreased from 95% to 78% over the past two weeks. Missing important lectures and discussions.',
      actions: ['Set attendance reminders', 'Talk to instructor about challenges', 'Join study group for accountability', 'Review recorded lectures if available'],
      detectedDate: '5 days ago',
      impact: 'Medium impact on learning and understanding',
      trend: 'declining',
      resolved: false
    },
    {
      id: '3',
      category: 'health',
      severity: 'medium',
      title: 'Irregular Sleep Pattern',
      description: 'Sleep duration has been inconsistent, averaging 5.5 hours per night. This may affect concentration and performance.',
      actions: ['Set consistent bedtime routine', 'Limit screen time before bed', 'Avoid caffeine after 4 PM', 'Create a relaxing sleep environment'],
      detectedDate: '1 week ago',
      impact: 'Medium impact on energy levels and focus',
      trend: 'stable',
      resolved: false
    },
    {
      id: '4',
      category: 'mental',
      severity: 'high',
      title: 'Elevated Stress Levels',
      description: 'Recent mood logs indicate increased stress and anxiety, particularly around exam periods and deadlines.',
      actions: ['Practice daily mindfulness or meditation', 'Talk to counselor or mentor', 'Break large tasks into smaller steps', 'Schedule regular breaks and self-care time'],
      detectedDate: '3 days ago',
      impact: 'High impact on well-being and performance',
      trend: 'increasing',
      resolved: false
    },
    {
      id: '5',
      category: 'engagement',
      severity: 'low',
      title: 'Low Assignment Submission Rate',
      description: 'Recent assignment submission rate dropped to 70%. Two assignments were submitted late last week.',
      actions: ['Create assignment tracker with deadlines', 'Set reminder notifications', 'Start assignments earlier', 'Ask for extensions if needed'],
      detectedDate: '4 days ago',
      impact: 'Low to medium impact on course grade',
      trend: 'stable',
      resolved: false
    },
    {
      id: '6',
      category: 'performance',
      severity: 'critical',
      title: 'At Risk of Failing Course',
      description: 'Current grade in Advanced Calculus is 55%, below passing threshold. Urgent intervention needed.',
      actions: ['Meet with professor immediately', 'Arrange intensive tutoring sessions', 'Consider course withdrawal deadline', 'Create detailed study plan'],
      detectedDate: '1 day ago',
      impact: 'Critical impact on academic standing',
      trend: 'declining',
      resolved: false
    }
  ];

  const displayFlags = flags.length > 0 ? flags : mockFlags;

  // Calculate statistics
  const stats = {
    total: displayFlags.length,
    critical: displayFlags.filter((f: any) => f.severity === 'critical').length,
    high: displayFlags.filter((f: any) => f.severity === 'high').length,
    medium: displayFlags.filter((f: any) => f.severity === 'medium').length,
    low: displayFlags.filter((f: any) => f.severity === 'low').length
  };

  // Category breakdown
  const categories = {
    performance: displayFlags.filter((f: any) => f.category === 'performance').length,
    engagement: displayFlags.filter((f: any) => f.category === 'engagement').length,
    health: displayFlags.filter((f: any) => f.category === 'health').length,
    mental: displayFlags.filter((f: any) => f.category === 'mental').length
  };

  // Alert trends (mock data for chart)
  const alertTrends = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [{
      label: 'Total Alerts',
      data: [2, 3, 4, 5, 6],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: '#ef4444'
    }]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#6b7280' }, grid: { color: '#e5e7eb' } },
      x: { ticks: { color: '#374151' }, grid: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return { icon: AlertTriangle, color: '#dc2626' };
      case 'high': return { icon: AlertTriangle, color: '#ea580c' };
      case 'medium': return { icon: Info, color: '#f59e0b' };
      case 'low': return { icon: Info, color: '#eab308' };
      default: return { icon: Info, color: '#6b7280' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'performance': return { icon: TrendingDown, color: '#ef4444', label: 'Performance' };
      case 'engagement': return { icon: Users, color: '#f59e0b', label: 'Engagement' };
      case 'health': return { icon: Activity, color: '#10b981', label: 'Health' };
      case 'mental': return { icon: Brain, color: '#8b5cf6', label: 'Mental Health' };
      default: return { icon: AlertTriangle, color: '#6b7280', label: 'Other' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'declining': return { icon: TrendingDown, color: '#ef4444' };
      case 'increasing': return { icon: TrendingUp, color: '#ef4444' };
      case 'stable': return { icon: Activity, color: '#f59e0b' };
      default: return { icon: Activity, color: '#6b7280' };
    }
  };

  return (
    <motion.div
      key="flags"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {displayFlags.length === 0 ? (
        <FuturisticCard className="p-12 rounded-2xl text-center" neonGlow={true}>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
          <p className="text-gray-600">No alerts detected. Keep up the great work!</p>
        </FuturisticCard>
      ) : (
        <>
          {/* Header */}
          <FuturisticCard className="p-6 rounded-2xl" neonGlow={true}>
            <SectionHeader
              icon={AlertTriangle}
              title="Alerts & Red Flags"
              subtitle="Important issues that need your attention"
            />
          </FuturisticCard>

          {/* Alert Statistics Overview */}
          <div className="grid md:grid-cols-5 gap-4">
            <FuturisticCard className="p-4 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-800 mb-1">{stats.total}</div>
                <div className="text-xs text-gray-600 font-semibold">Total Alerts</div>
              </div>
            </FuturisticCard>
            <FuturisticCard className="p-4 rounded-xl border-2 border-red-300">
              <div className="text-center">
                <div className="text-3xl font-black text-red-600 mb-1">{stats.critical}</div>
                <div className="text-xs text-gray-600 font-semibold">Critical</div>
              </div>
            </FuturisticCard>
            <FuturisticCard className="p-4 rounded-xl border-2 border-orange-300">
              <div className="text-center">
                <div className="text-3xl font-black text-orange-600 mb-1">{stats.high}</div>
                <div className="text-xs text-gray-600 font-semibold">High</div>
              </div>
            </FuturisticCard>
            <FuturisticCard className="p-4 rounded-xl border-2 border-amber-300">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-600 mb-1">{stats.medium}</div>
                <div className="text-xs text-gray-600 font-semibold">Medium</div>
              </div>
            </FuturisticCard>
            <FuturisticCard className="p-4 rounded-xl border-2 border-yellow-300">
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-600 mb-1">{stats.low}</div>
                <div className="text-xs text-gray-600 font-semibold">Low</div>
              </div>
            </FuturisticCard>
          </div>

          {/* Category Breakdown & Alert Trends */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <FuturisticCard className="p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-brand-primary" />
                Alerts by Category
              </h3>
              <div className="space-y-4">
                {Object.entries(categories).map(([category, count], index) => {
                  const catInfo = getCategoryIcon(category);
                  const CatIcon = catInfo.icon;
                  const percentage = (count as number / stats.total) * 100;
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-4 h-4" style={{ color: catInfo.color }} />
                          <span className="text-sm font-semibold text-gray-700">{catInfo.label}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: catInfo.color }}>{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: catInfo.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </FuturisticCard>

            {/* Alert Trends */}
            <FuturisticCard className="p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-primary" />
                Alert Trends (5 Weeks)
              </h3>
              <div className="h-48">
                <Line data={alertTrends} options={trendOptions} />
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Trend Analysis:</strong> Alerts have been increasing over the past 5 weeks. Take action to address these issues.
                </p>
              </div>
            </FuturisticCard>
          </div>

          {/* Priority Action Items */}
          <FuturisticCard className="p-6 rounded-2xl border-2 border-red-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              Urgent Actions Required
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {displayFlags
                .filter((f: any) => f.severity === 'critical' || f.severity === 'high')
                .slice(0, 4)
                .map((flag: any, index: number) => {
                  const catInfo = getCategoryIcon(flag.category);
                  const CatIcon = catInfo.icon;
                  return (
                    <motion.div
                      key={flag.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <CatIcon className="w-5 h-5 flex-shrink-0" style={{ color: catInfo.color }} />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm mb-1">{flag.title}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                            {flag.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{flag.impact}</p>
                    </motion.div>
                  );
                })}
            </div>
          </FuturisticCard>

          {/* Detailed Alert Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-primary" />
              All Alerts ({stats.total})
            </h3>
            {displayFlags.map((flag: any, index: number) => {
              const severityInfo = getSeverityIcon(flag.severity);
              const SeverityIcon = severityInfo.icon;
              const catInfo = getCategoryIcon(flag.category);
              const CatIcon = catInfo.icon;
              const trendInfo = getTrendIcon(flag.trend);
              const TrendIcon = trendInfo.icon;

              return (
                <FuturisticCard
                  key={flag.id}
                  className={`p-6 rounded-2xl border-2 ${
                    flag.severity === 'critical'
                      ? 'border-red-300 bg-red-50/30'
                      : flag.severity === 'high'
                      ? 'border-orange-300 bg-orange-50/30'
                      : flag.severity === 'medium'
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-yellow-300 bg-yellow-50/30'
                  }`}
                  delay={index * 0.05}
                >
                  <div className="flex items-start gap-4">
                    {/* Alert Icon */}
                    <div
                      className={`p-3 rounded-xl ${
                        flag.severity === 'critical'
                          ? 'bg-red-100'
                          : flag.severity === 'high'
                          ? 'bg-orange-100'
                          : flag.severity === 'medium'
                          ? 'bg-amber-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      <SeverityIcon className="w-6 h-6" style={{ color: severityInfo.color }} />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-xl font-bold text-gray-800">{flag.title}</h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                flag.severity === 'critical'
                                  ? 'bg-red-100 text-red-600'
                                  : flag.severity === 'high'
                                  ? 'bg-orange-100 text-orange-600'
                                  : flag.severity === 'medium'
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              {flag.severity.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CatIcon className="w-4 h-4" style={{ color: catInfo.color }} />
                              <span>{catInfo.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{flag.detectedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendIcon className="w-4 h-4" style={{ color: trendInfo.color }} />
                              <span className="capitalize">{flag.trend}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-3">{flag.description}</p>

                      {/* Impact Badge */}
                      <div className="mb-4 p-3 bg-white/60 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-semibold text-gray-700">Impact:</span>
                          <span className="text-sm text-gray-600">{flag.impact}</span>
                        </div>
                      </div>

                      {/* Action Items */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Target className="w-4 h-4 text-brand-primary" />
                          Recommended Actions:
                        </h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {flag.actions.map((action: string, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 + i * 0.05 }}
                              className="flex items-center gap-2 p-2 bg-white/80 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-brand-primary hover:shadow-md transition-all cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4 text-brand-primary flex-shrink-0" />
                              <span>{action}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FuturisticCard>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <FuturisticCard className="p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Address Critical Issues
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-brand-primary font-semibold rounded-xl border-2 border-brand-primary hover:bg-brand-primary/5 transition-all"
              >
                Schedule Mentor Meeting
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                View Action Plan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                Export Report
              </motion.button>
            </div>
          </FuturisticCard>
        </>
      )}
    </motion.div>
  );
}
