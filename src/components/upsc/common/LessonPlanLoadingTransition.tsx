import { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Target, Brain } from 'lucide-react';

interface LessonPlanLoadingTransitionProps {
  onComplete: () => void;
}

export function LessonPlanLoadingTransition({ onComplete }: LessonPlanLoadingTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing your test performance...',
    'Identifying knowledge gaps...',
    'Customizing study materials...',
    'Creating personalized schedule...',
    'Optimizing learning path...'
  ];

  useEffect(() => {
    const duration = 3000; // 3 seconds total
    const interval = 30; // Update every 30ms
    const incrementPerStep = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + incrementPerStep;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay before transition
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
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Central Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-indigo-600" />
            </div>
            
            {/* Rotating Circle */}
            <div className="absolute inset-0">
              <div className="w-full h-full animate-spin-slow rounded-full border-b-2 border-indigo-600" />
            </div>
            
            {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
              <Brain className="w-6 h-6 text-indigo-600 absolute top-0 left-1/2 -translate-x-1/2" />
              <Target className="w-6 h-6 text-indigo-600 absolute bottom-0 left-1/2 -translate-x-1/2" />
              <Sparkles className="w-6 h-6 text-indigo-600 absolute left-0 top-1/2 -translate-y-1/2" />
              <Sparkles className="w-6 h-6 text-indigo-600 absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Lesson Plan
          </h2>
          <p className="text-sm text-gray-600 h-5 transition-all">
            {steps[currentStep]}
          </p>
        </div>

        <div className="w-full bg-white rounded-full h-2 mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Personalizing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}