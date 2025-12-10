import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { generateQuestions } from '../../../../utils/questionGenerator';
import { TestLoadingTransition } from '../../../../components/upsc/common/TestLoadingTransition';
import { MultimediaQuestionComponent } from '../../../../components/upsc/common/MultimediaQuestion';
import type { MultimediaQuestion } from '../../../../utils/questionBank';
import { useGameStore } from '../../../../store/useGameStore';

type ConfidenceLevel = 'not_at_all' | 'slightly' | 'moderately' | 'very' | 'extremely' | null;

export function TestPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MultimediaQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showLoading, setShowLoading] = useState(true);
  const [startTime] = useState<number>(Date.now());
  const { addXP, addCoins } = useGameStore();

  useEffect(() => {
    if (!showLoading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showLoading]);

  const handleLoadingComplete = () => {
    const generatedQuestions = generateQuestions();
    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(null));
    setConfidenceLevels(new Array(generatedQuestions.length).fill(null));
    setShowLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleConfidenceLevel = (level: ConfidenceLevel) => {
    const newConfidenceLevels = [...confidenceLevels];
    newConfidenceLevels[currentQuestion] = level;
    setConfidenceLevels(newConfidenceLevels);
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const testData = {
      questions,
      answers,
      confidenceLevels,
      timeUsed: Math.floor((endTime - startTime) / 1000),
      submitTime: new Date().toISOString(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    };

    localStorage.setItem('testData', JSON.stringify(testData));
    navigate('/results');
  };

  const currentSection = currentQuestion < 4 ? 'VARK Assessment' :
    currentQuestion < 11 ? 'PASCO Assessment' :
      'Subject Knowledge';

  const confidenceOptions: { value: ConfidenceLevel; label: string; color: string; emoji: string }[] = [
    { value: 'not_at_all', label: 'Not at all', color: 'from-red-500 to-red-600', emoji: '😟' },
    { value: 'slightly', label: 'Slightly', color: 'from-orange-500 to-orange-600', emoji: '😐' },
    { value: 'moderately', label: 'Moderately', color: 'from-yellow-500 to-yellow-600', emoji: '🙂' },
    { value: 'very', label: 'Very', color: 'from-blue-500 to-blue-600', emoji: '😊' },
    { value: 'extremely', label: 'Extremely', color: 'from-green-500 to-green-600', emoji: '😄' }
  ];

  const isCurrentQuestionAnswered = answers[currentQuestion] !== null;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  if (showLoading) {
    return <TestLoadingTransition onComplete={handleLoadingComplete} />;
  }

  if (questions.length === 0) return null;

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-80 bg-gradient-to-br from-[#094d88] via-blue-800 to-indigo-900 text-white p-6 hidden lg:flex flex-col relative shadow-2xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative flex items-center gap-3 text-xl font-semibold mb-8"
        >
          <img
            src="/Logo.png"
            alt="Edgeup Logo"
            className="h-12 object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Timer Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 border-2 ${isLowTime ? 'border-red-400 animate-pulse' : 'border-white/20'
            } shadow-xl`}
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={isLowTime ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Clock className={`w-6 h-6 ${isLowTime ? 'text-red-400' : 'text-white'}`} />
            </motion.div>
            <span className="text-sm font-semibold">Time Remaining</span>
          </div>
          <div className={`text-4xl font-bold ${isLowTime ? 'text-red-400' : 'text-white'}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          {isLowTime && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-red-300 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              Hurry up!
            </motion.div>
          )}
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 shadow-xl"
        >
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full relative"
              >
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-90">Answered</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {answeredCount}
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90">Remaining</div>
              <div className="text-2xl font-bold">{questions.length - answeredCount}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-sm opacity-90 mb-1">Current Section</div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {currentSection}
            </div>
          </div>
        </motion.div>

        {/* Question Palette */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto relative"
        >
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg
                  ${currentQuestion === index
                    ? 'bg-white text-indigo-600 shadow-white/50'
                    : answers[index] !== null
                      ? 'bg-emerald-500/80 text-white hover:bg-emerald-400'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-white/50"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                  >
                    <GraduationCap className="w-4 h-4" />
                    {currentSection}
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    {isCurrentQuestionAnswered && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                  />
                </div>
              </div>

              {/* Question Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8"
              >
                <MultimediaQuestionComponent
                  question={questions[currentQuestion]}
                  selectedAnswer={answers[currentQuestion]}
                  onAnswer={handleAnswer}
                />

                {/* Confidence Level Selection */}
                <AnimatePresence>
                  {answers[currentQuestion] !== null && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-8 border-t border-gray-100 pt-6 overflow-hidden"
                    >
                      <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💭</span>
                        How confident are you with your answer?
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {confidenceOptions.map(({ value, label, color, emoji }) => (
                          <motion.button
                            key={value}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConfidenceLevel(value)}
                            className={`p-4 rounded-2xl text-sm font-bold transition-all shadow-lg ${confidenceLevels[currentQuestion] === value
                                ? `bg-gradient-to-br ${color} text-white scale-105`
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <div className="text-2xl mb-1">{emoji}</div>
                            {label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Navigation Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2 bg-white shadow-md hover:shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>

                {currentQuestion === questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 transition-all font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl"
                  >
                    <Send className="w-5 h-5" />
                    Submit Test
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 transition-all font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
