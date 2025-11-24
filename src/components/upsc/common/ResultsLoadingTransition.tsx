import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Target, Award, Sparkles, CheckCircle2, BarChart2, Zap } from 'lucide-react';

interface ResultsLoadingTransitionProps {
  onComplete: () => void;
}

export function ResultsLoadingTransition({ onComplete }: ResultsLoadingTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseRings, setPulseRings] = useState<number[]>([]);

  const steps = [
    'Analyzing test responses...',
    'Calculating VARK profile...',
    'Processing PASCO metrics...',
    'Evaluating subject performance...',
    'Generating insights...',
    'Preparing recommendations...'
  ];

  useEffect(() => {
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

    // Generate pulse rings periodically
    const pulseTimer = setInterval(() => {
      setPulseRings(prev => [...prev, Date.now()]);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      clearInterval(pulseTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Subtle animated background shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#094d88]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-3xl w-full mx-auto p-8">
        {/* Main content card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50">
          {/* Central animation area */}
          <div className="text-center mb-10">
            {/* Animated brain icon with pulse rings */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              {/* Pulse rings */}
              {pulseRings.slice(-3).map((timestamp, index) => (
                <div
                  key={timestamp}
                  className="absolute inset-0 rounded-full border-2 border-[#094d88] animate-ping"
                  style={{
                    animationDuration: '2s',
                    opacity: 0.3 - index * 0.1
                  }}
                />
              ))}

              {/* Rotating orbital elements */}
              <div className="absolute inset-0 animate-spin-slow">
                {[0, 90, 180, 270].map((angle, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[#094d88] to-[#10ac8b]"
                    style={{
                      left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 10px rgba(9, 77, 136, 0.5)'
                    }}
                  />
                ))}
              </div>

              {/* Center icon container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-full blur-2xl opacity-40 animate-pulse" />

                  {/* Icon background */}
                  <div className="relative bg-gradient-to-br from-[#094d88] to-[#10ac8b] rounded-full p-8 shadow-2xl">
                    <Brain className="w-20 h-20 text-white" />
                  </div>

                  {/* Checkmarks animation */}
                  {progress > 30 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg animate-scale-in">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Corner icons */}
              <div className="absolute inset-0">
                {[
                  { Icon: Target, position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', delay: '0s' },
                  { Icon: Award, position: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', delay: '0.5s' },
                  { Icon: BarChart2, position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', delay: '1s' },
                  { Icon: Zap, position: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', delay: '1.5s' }
                ].map(({ Icon, position, delay }, i) => (
                  <div
                    key={i}
                    className={`absolute ${position} bg-white rounded-full p-3 shadow-lg`}
                    style={{
                      opacity: progress > i * 20 ? 1 : 0.2,
                      transition: 'opacity 0.5s',
                      animationDelay: delay
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#094d88]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Title and step indicator */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Analyzing Your Results
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-lg h-7">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#10ac8b] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span>{steps[currentStep]}</span>
            </div>
          </div>

          {/* Progress section */}
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="relative">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Processing</span>
                <span className="font-bold text-[#094d88]">{Math.round(progress)}%</span>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Mini checkpoints */}
              <div className="flex justify-between mt-2">
                {steps.map((_, idx) => {
                  const checkpoint = ((idx + 1) / steps.length) * 100;
                  return (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        progress >= checkpoint
                          ? 'bg-[#10ac8b] scale-125'
                          : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { icon: Target, label: 'Accuracy', value: Math.min(95, Math.floor(progress * 0.95)), unit: '%' },
                { icon: TrendingUp, label: 'Performance', value: Math.min(88, Math.floor(progress * 0.88)), unit: '%' },
                { icon: Brain, label: 'Analyzed', value: Math.floor(progress * 0.45), unit: '/45' },
                { icon: Award, label: 'Insights', value: Math.floor(progress * 0.08), unit: '/8' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 transition-all hover:shadow-md"
                  style={{
                    opacity: progress > idx * 15 ? 1 : 0.4,
                    transform: progress > idx * 15 ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.3s'
                  }}
                >
                  <stat.icon className="w-5 h-5 text-[#094d88] mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-[#094d88] text-center">
                    {stat.value}{stat.unit}
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Processing status */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="relative flex items-center">
                <div className="w-2 h-2 bg-[#10ac8b] rounded-full animate-pulse" />
                <div className="absolute w-2 h-2 bg-[#10ac8b] rounded-full animate-ping" />
              </div>
              <span className="text-sm text-gray-500 font-medium">
                Preparing your personalized insights...
              </span>
            </div>
          </div>
        </div>

        {/* Bottom sparkle */}
        <div className="flex justify-center mt-6">
          <Sparkles className="w-6 h-6 text-[#10ac8b] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
