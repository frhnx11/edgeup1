import { useEffect, useState } from 'react';
import { Brain, Target, Book, Sparkles, Lightbulb, Rocket, PieChart as ChartPie } from 'lucide-react';

interface LessonPlanGenerationTransitionProps {
  onComplete: () => void;
}

export function LessonPlanGenerationTransition({ onComplete }: LessonPlanGenerationTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  const steps = [
    'Analyzing your learning style...',
    'Evaluating subject preferences...',
    'Identifying knowledge gaps...',
    'Generating personalized study path...',
    'Optimizing learning sequence...',
    'Creating adaptive milestones...'
  ];

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const incrementPerStep = (100 * interval) / duration;

    setDataPoints(Array.from({ length: 20 }, () => Math.random() * 100));

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

      setDataPoints(prev => [...prev.slice(1), Math.random() * 100]);
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
    <div className="fixed inset-0 bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#094d88] rounded-full opacity-20 animate-float"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 3 + 3 + 's'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-2xl w-full mx-auto p-8">
        <div className="text-center mb-12">
          {/* Neural Network Animation */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            {/* Main Circle */}
            <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-full overflow-hidden">
              {/* Scanning Line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                style={{ 
                  top: `${(progress % 100)}%`,
                  boxShadow: '0 0 20px rgba(16, 172, 139, 0.8)'
                }}
              />

              {/* Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(16, 172, 139, 0.1) 25%, rgba(16, 172, 139, 0.1) 26%, transparent 27%, transparent 74%, rgba(16, 172, 139, 0.1) 75%, rgba(16, 172, 139, 0.1) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(16, 172, 139, 0.1) 25%, rgba(16, 172, 139, 0.1) 26%, transparent 27%, transparent 74%, rgba(16, 172, 139, 0.1) 75%, rgba(16, 172, 139, 0.1) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '30px 30px'
              }} />

              {/* Animated Icons */}
              <div className="absolute inset-0 animate-spin-slow">
                <Brain className="w-6 h-6 text-[#094d88] absolute top-0 left-1/2 -translate-x-1/2" />
                <Target className="w-6 h-6 text-[#094d88] absolute bottom-0 left-1/2 -translate-x-1/2" />
                <Lightbulb className="w-6 h-6 text-[#094d88] absolute left-0 top-1/2 -translate-y-1/2" />
                <ChartPie className="w-6 h-6 text-[#094d88] absolute right-0 top-1/2 -translate-y-1/2" />
              </div>

              {/* Neural Network Nodes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#094d88] rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    boxShadow: '0 0 10px rgba(9, 77, 136, 0.6)'
                  }}
                />
              ))}
            </div>

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#094d88]/10 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-[#094d88]" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Generating Your Personalized Lesson Plan
          </h2>
          <p className="text-[#10ac8b] h-6 transition-all text-lg">
            {steps[currentStep]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-[#094d88]/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#094d88] via-[#10ac8b] to-[#094d88] animate-gradient" />
              <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Data Visualization */}
          <div className="absolute -top-6 left-0 w-full flex items-end justify-between h-4 px-1">
            {dataPoints.map((point, i) => (
              <div
                key={i}
                className="w-0.5 bg-[#094d88]/30 transition-all duration-300"
                style={{ height: `${point}%` }}
              />
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-between items-center text-sm">
          <span className="text-[#10ac8b] font-mono">GENERATING LESSON PLAN</span>
          <span className="text-[#10ac8b] font-mono">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}