import { useEffect, useState } from 'react';
import { Brain, Sparkles, Shield, Zap } from 'lucide-react';

interface AITwinLoadingTransitionProps {
  onComplete: () => void;
}

export function AITwinLoadingTransition({ onComplete }: AITwinLoadingTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initializing Neural Network...',
    'Syncing Quantum State...',
    'Loading Personal Data...',
    'Calibrating AI Parameters...',
    'Establishing Neural Link...'
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
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="https://media-hosting.imagekit.io//8e131b7e3a9a43cf/background.mp4?Expires=1833786621&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=izc5tXN9pvMxanNTVbJw-LUR7EPC~93qRW0vo9gmEXk4ILH5JbRHoPdzPIwkxoLTbbyiqEkefNJZ9mfXMoDD4w~42yQMlKKGhxeCnB26kQ3e67gbGV9MhtPU~806ehR0g1mblPrAcQoW1XpV19t9xPSJvKTZ9vlsjRdJxS3HZh50Y~csvfr8-nydwkF4fKZLHewFx16h3nhVnWLLSDNbqmsRpD62IXZxOnHAFhMCKbL0J2RVgXMBCoyMOw6PpQamkktNTrc~RWTxLrUGJ3qVQdVwXjzIVw1AKxPXc9lrBRIu-rSNjG-zhvqRd20cMujZ~Fpgh7PJG19~tvn0qbSdpA__" type="video/mp4" />
      </video>

      <div className="relative max-w-md w-full mx-auto p-8">
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-indigo-400" />
            </div>
            
            <div className="absolute inset-0">
              <div className="w-full h-full animate-spin-slow rounded-full border-b-2 border-indigo-500" />
            </div>
            
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
              <Shield className="w-6 h-6 text-indigo-400 absolute top-0 left-1/2 -translate-x-1/2" />
              <Zap className="w-6 h-6 text-indigo-400 absolute bottom-0 left-1/2 -translate-x-1/2" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute left-0 top-1/2 -translate-y-1/2" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            Neural Network Synthesis
          </h2>
          <p className="text-indigo-300 h-5 transition-all">
            {steps[currentStep]}
          </p>
        </div>

        <div className="w-full h-2 bg-gray-700 rounded-full mb-4">
          <div
            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-indigo-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-indigo-400 mb-1">Neural Sync</div>
            <div className="text-white">82%</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-indigo-400 mb-1">Data Streams</div>
            <div className="text-white">202/512</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-indigo-400 mb-1">Quantum State</div>
            <div className="text-white">Syncing</div>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-sm text-indigo-300">
          <span>Initializing AI Twin</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}