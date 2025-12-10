import { useState, useEffect } from 'react';
import { Cpu, Network } from 'lucide-react';

export function AITwinPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [scanPosition, setScanPosition] = useState(0);
  const [scanDirection, setScanDirection] = useState(1);

  const steps = [
    'Initializing Quantum Neural Network...',
    'Synchronizing Biometric Data...',
    'Calibrating Neural Pathways...',
    'Establishing Synaptic Links...',
    'Optimizing AI Core Parameters...',
    'Loading Consciousness Matrix...'
  ];

  useEffect(() => {
    const duration = 5000;
    const interval = 30;
    const incrementPerStep = (100 * interval) / duration;

    setDataPoints(Array.from({ length: 20 }, () => Math.random() * 100));

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + incrementPerStep;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });

      setDataPoints(prev => [...prev.slice(1), Math.random() * 100]);
    }, interval);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, duration / steps.length);

    // Scanner animation
    const scanTimer = setInterval(() => {
      setScanPosition(prev => {
        const newPosition = prev + (scanDirection * 2);
        if (newPosition >= 100) {
          setScanDirection(-1);
          return 100;
        }
        if (newPosition <= 0) {
          setScanDirection(1);
          return 0;
        }
        return newPosition;
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      clearInterval(scanTimer);
    };
  }, [scanDirection]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-indigo-500 rounded-full opacity-20 animate-float"
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
          {/* Scanner Container */}
          <div className="relative w-96 h-96 mx-auto mb-8 perspective-1000">
            {/* Main Scanner Frame */}
            <div className="absolute inset-0 rounded-lg border border-[#094d88]/30 overflow-hidden">
              {/* Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
              }} />
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(9, 77, 136, 0.1) 8px, rgba(9, 77, 136, 0.1) 16px)`
              }} />

              {/* Scanning Line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#094d88] to-transparent"
                style={{ 
                  top: `${scanPosition}%`,
                  boxShadow: '0 0 30px rgba(9, 77, 136, 0.8)'
                }}
              />

              {/* Scan Overlay */}
              <div 
                className="absolute left-0 right-0 bg-gradient-to-b from-[#094d88]/20 to-transparent transition-all duration-200"
                style={{ 
                  top: 0,
                  height: `${scanPosition}%`,
                  opacity: 0.3
                }}
              />

              {/* Animated Data Points */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#094d88] rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    boxShadow: '0 0 15px rgba(9, 77, 136, 0.6)'
                  }}
                />
              ))}

              {/* Scanning Lines */}
              <div className="absolute inset-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 border border-[#094d88]/20"
                    style={{
                      transform: `scale(${0.8 + (i * 0.1)})`,
                      animation: `pulse 2s ease-in-out ${i * 0.5}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Corner Markers */}
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="absolute w-8 h-8 border-2 border-[#094d88]"
                style={{
                  [i < 2 ? 'top' : 'bottom']: '-2px',
                  [i % 2 === 0 ? 'left' : 'right']: '-2px',
                  borderTop: i >= 2 ? 'none' : undefined,
                  borderBottom: i < 2 ? 'none' : undefined,
                  borderLeft: i % 2 ? 'none' : undefined,
                  borderRight: i % 2 === 0 ? 'none' : undefined,
                }}
              />
            ))}

            {/* Edge Indicators */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#094d88] rounded-full animate-pulse"
                style={{
                  [i < 2 ? 'top' : 'bottom']: '-1px',
                  left: `${i % 2 === 0 ? 25 : 75}%`,
                  boxShadow: '0 0 10px rgba(9, 77, 136, 0.8)'
                }}
              />
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">
            NEURAL NETWORK SYNTHESIS
          </h2>
          <p className="text-indigo-300 h-6 transition-all text-lg">
            {steps[currentStep]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-gray-800/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
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

        {/* Status Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Neural Sync', value: '82%', icon: Network },
            { label: 'Data Streams', value: '202/512', icon: Network },
            { label: 'Quantum State', value: 'Syncing', icon: Cpu }
          ].map((metric, i) => (
            <div
              key={i}
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 overflow-hidden group hover:bg-gray-800/60 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <metric.icon className="w-5 h-5 text-[#10ac8b]" />
                  <div className="text-[#10ac8b] text-sm">{metric.label}</div>
                </div>
                <div className="text-white font-mono text-lg">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-between items-center text-sm">
          <span className="text-[#10ac8b] font-mono">INITIALIZING AI TWIN</span>
          <span className="text-[#10ac8b] font-mono">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}