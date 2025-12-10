import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { BookOpen, Clock, Target, Award, Brain, Sparkles } from 'lucide-react';

function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
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

export function LessonPlanPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Your Lesson Plan</h1>
          <button 
            onClick={() => navigate('/test2')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Test
          </button>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {[
              {
                time: '09:00 AM',
                title: 'Indian Polity',
                topic: 'Constitutional Framework',
                duration: '2 hours'
              },
              {
                time: '11:30 AM',
                title: 'Economics',
                topic: 'Monetary Policy',
                duration: '1.5 hours'
              },
              {
                time: '02:00 PM',
                title: 'Practice Test',
                topic: 'Current Affairs',
                duration: '1 hour'
              }
            ].map((session, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 text-sm text-gray-600">{session.time}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-600">{session.topic}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {session.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Topics to Cover</h3>
                <p className="text-2xl font-bold text-indigo-600">12/15</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Practice Tests</h3>
                <p className="text-2xl font-bold text-green-600">4/5</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-green-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Average Score</h3>
                <p className="text-2xl font-bold text-yellow-600">85%</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-yellow-600 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Upcoming Topics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                subject: 'Indian Polity',
                topic: 'Fundamental Rights',
                date: 'Tomorrow',
                progress: 60
              },
              {
                subject: 'Economics',
                topic: 'Fiscal Policy',
                date: 'Feb 15',
                progress: 40
              },
              {
                subject: 'Geography',
                topic: 'Climate Systems',
                date: 'Feb 16',
                progress: 20
              },
              {
                subject: 'History',
                topic: 'Modern India',
                date: 'Feb 17',
                progress: 10
              }
            ].map((topic, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{topic.subject}</h3>
                    <p className="text-sm text-gray-600">{topic.topic}</p>
                  </div>
                  <span className="text-sm text-gray-600">{topic.date}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${topic.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}