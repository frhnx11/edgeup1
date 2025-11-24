import { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface ClassTestLoadingTransitionProps {
  onComplete: () => void;
}

export function ClassTestLoadingTransition({ onComplete }: ClassTestLoadingTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing your class performance...',
    'Generating personalized questions...',
    'Calibrating difficulty levels...',
    'Preparing your assessment...'
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

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#094d88]/5 to-[#10ac8b]/5 flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          {/* Scanning Animation */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-indigo-200 rounded-lg overflow-hidden">
              {/* Scanning Line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent animate-[scan_2s_ease-in-out_infinite]"
                style={{
                  animation: 'scan 2s ease-in-out infinite',
                  boxShadow: '0 0 20px rgba(9, 77, 136, 0.5)'
                }}
              />
              
              {/* Scan Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-indigo-100/20 via-transparent to-transparent"
                style={{
                  animation: 'scanOverlay 2s ease-in-out infinite'
                }}
              />

              {/* Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(9, 77, 136, 0.05) 25%, rgba(9, 77, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(9, 77, 136, 0.05) 75%, rgba(9, 77, 136, 0.05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(9, 77, 136, 0.05) 25%, rgba(9, 77, 136, 0.05) 26%, transparent 27%, transparent 74%, rgba(9, 77, 136, 0.05) 75%, rgba(9, 77, 136, 0.05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '30px 30px'
              }} />

              {/* Animated Dots */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-indigo-600 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Test
          </h2>
          <p className="text-sm text-gray-600 h-5 transition-all">
            {steps[currentStep]}
          </p>
        </div>

        <div className="w-full bg-white rounded-full h-2 mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Generating</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}