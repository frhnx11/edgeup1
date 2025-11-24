import { useEffect, useState } from 'react';
import { Brain, Sparkles, Zap, Target, BookOpen, TrendingUp } from 'lucide-react';

interface TestLoadingTransitionProps {
  onComplete: () => void;
}

export function TestLoadingTransition({ onComplete }: TestLoadingTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const steps = [
    'Analyzing your goals and preferences...',
    'Generating personalized questions...',
    'Calibrating difficulty levels...',
    'Preparing your assessment...'
  ];

  useEffect(() => {
    // Generate particles
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(particleArray);

    const duration = 3000;
    const interval = 30;
    const incrementPerStep = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + incrementPerStep;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, duration / steps.length);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-full opacity-20 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#094d88]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#10ac8b]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />

      <div className="relative max-w-2xl w-full mx-auto p-8">
        <div className="text-center mb-12">
          {/* Central Animation */}
          <div className="relative w-56 h-56 mx-auto mb-8">
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#094d88]/30 animate-spin-slow" />

            {/* Middle Ring with Icons */}
            <div className="absolute inset-4 rounded-full border-2 border-[#10ac8b]/40 animate-reverse-spin">
              <Target className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#094d88]" />
              <BookOpen className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 text-[#10ac8b]" />
              <Zap className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
              <TrendingUp className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
            </div>

            {/* Inner Pulsing Circle */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#094d88]/20 to-[#10ac8b]/20 backdrop-blur-sm animate-pulse-scale" />

            {/* Center Brain Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-white rounded-full p-6 shadow-2xl">
                  <Brain className="w-16 h-16 text-[#094d88] animate-pulse" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            </div>

            {/* Orbiting Sparkles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-500 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 112}`}
                strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
                className="transition-all duration-300"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#094d88" />
                  <stop offset="100%" stopColor="#10ac8b" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent mb-4">
            Preparing Your Assessment
          </h2>
          <p className="text-lg text-gray-700 h-8 transition-all flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#10ac8b] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="inline-block w-2 h-2 bg-[#10ac8b] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="inline-block w-2 h-2 bg-[#10ac8b] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="ml-2">{steps[currentStep]}</span>
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative">
          {/* Background Track */}
          <div className="w-full h-4 bg-white/80 rounded-full shadow-inner backdrop-blur-sm mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#094d88] via-[#10ac8b] to-[#094d88] bg-[length:200%_100%] animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-[#094d88] rounded-full animate-pulse" />
              Generating
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          {[
            { icon: Target, label: 'Questions', value: Math.floor(progress / 5) },
            { icon: Brain, label: 'Topics', value: Math.floor(progress / 10) },
            { icon: Zap, label: 'Difficulty', value: Math.floor(progress / 20) },
            { icon: TrendingUp, label: 'Levels', value: Math.floor(progress / 25) }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg transform transition-all hover:scale-105"
              style={{
                opacity: progress > idx * 20 ? 1 : 0.3,
                transition: 'opacity 0.5s, transform 0.2s'
              }}
            >
              <stat.icon className="w-5 h-5 text-[#094d88] mb-2 mx-auto" />
              <div className="text-2xl font-bold text-[#094d88] text-center">{stat.value}</div>
              <div className="text-xs text-gray-600 text-center">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
