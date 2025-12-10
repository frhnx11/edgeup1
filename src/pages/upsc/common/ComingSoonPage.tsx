import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, RefreshCw } from 'lucide-react';

export function ComingSoonPage() {
  const navigate = useNavigate();
  const archetype = localStorage.getItem('userArchetype') || 'Your learning path';

  const handleRetakeQuiz = () => {
    localStorage.removeItem('userArchetype');
    navigate('/quiz');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-brand-primary" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>

        <p className="text-lg text-gray-600 mb-2">
          The <span className="font-semibold text-brand-primary">{archetype}</span> learning path is under development.
        </p>

        <p className="text-gray-500 mb-8">
          We're working hard to bring you a personalized experience. Check back soon!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetakeQuiz}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-3 px-6 rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Assessment
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
