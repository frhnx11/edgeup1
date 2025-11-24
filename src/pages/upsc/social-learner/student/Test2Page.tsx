import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Zap,
  Target,
  Award,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';
import { ClassTestLoadingTransition } from '../../../../components/upsc/common/ClassTestLoadingTransition';
import { generateClassQuestions } from '../../../../utils/classQuestionGenerator';
import type { ClassQuestion } from '../../../../utils/classQuestionBank';

type ConfidenceLevel = 'not_at_all' | 'slightly' | 'moderately' | 'very' | 'extremely' | null;

export function Test2Page() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [questions, setQuestions] = useState<ClassQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [confidenceLevels, setConfidenceLevels] = useState<ConfidenceLevel[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
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
  }, [testStarted, timeLeft]);

  const handleLoadingComplete = () => {
    const generatedQuestions = generateClassQuestions(15);
    setQuestions(generatedQuestions);
    setAnswers(new Array(generatedQuestions.length).fill(null));
    setConfidenceLevels(new Array(generatedQuestions.length).fill(null));
    setTimePerQuestion(new Array(generatedQuestions.length).fill(0));
    setQuestionStartTime(Date.now());
    setTestStarted(true);
    setShowLoading(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const updateQuestionTime = () => {
    const currentTime = Date.now();
    const timeSpent = (currentTime - questionStartTime) / 1000;
    const newTimePerQuestion = [...timePerQuestion];
    newTimePerQuestion[currentQuestion] = (newTimePerQuestion[currentQuestion] || 0) + timeSpent;
    setTimePerQuestion(newTimePerQuestion);
    setQuestionStartTime(currentTime);
  };

  const handleQuestionChange = (newQuestion: number) => {
    if (newQuestion !== currentQuestion) {
      updateQuestionTime();
      setCurrentQuestion(newQuestion);
    }
  };

  const handleConfidenceLevel = (level: ConfidenceLevel) => {
    const newConfidenceLevels = [...confidenceLevels];
    newConfidenceLevels[currentQuestion] = level;
    setConfidenceLevels(newConfidenceLevels);
  };

  const handleSubmit = () => {
    updateQuestionTime();
    const testData = {
      answers,
      confidenceLevels,
      questions,
      timeUsed: 1800 - timeLeft,
      timePerQuestion,
      submitTime: new Date().toISOString()
    };
    localStorage.setItem('testData', JSON.stringify(testData));
    navigate('/results2');
  };

  if (showLoading) {
    return <ClassTestLoadingTransition onComplete={handleLoadingComplete} />;
  }

  if (!testStarted || questions.length === 0) return null;

  const confidenceOptions: {
    value: ConfidenceLevel;
    label: string;
    color: string;
    emoji: string;
    gradient: string;
  }[] = [
    {
      value: 'not_at_all',
      label: 'Not at all',
      color: 'from-red-500 to-red-600',
      emoji: '😟',
      gradient: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    {
      value: 'slightly',
      label: 'Slightly',
      color: 'from-orange-500 to-orange-600',
      emoji: '😐',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      value: 'moderately',
      label: 'Moderately',
      color: 'from-yellow-500 to-yellow-600',
      emoji: '🙂',
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    },
    {
      value: 'very',
      label: 'Very',
      color: 'from-blue-500 to-blue-600',
      emoji: '😊',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      value: 'extremely',
      label: 'Extremely',
      color: 'from-green-500 to-green-600',
      emoji: '😄',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600'
    }
  ];

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  // Get current topic info for display
  const currentTopicData = localStorage.getItem('currentLearningTopic');
  const topicInfo = currentTopicData ? JSON.parse(currentTopicData) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1]
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Enhanced Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-80 bg-gradient-to-br from-[#094d88] via-blue-800 to-indigo-900 text-white p-6 hidden lg:flex flex-col relative shadow-2xl z-10"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative flex items-center gap-3 mb-8"
        >
          <img
            src="/Logo.png"
            alt="Edgeup Logo"
            className="h-12 object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Class Info Card */}
        {topicInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border-2 border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-brand-secondary" />
              <span className="text-sm font-semibold">Test Subject</span>
            </div>
            <div className="text-lg font-bold mb-1">{topicInfo.subject}</div>
            <div className="text-sm opacity-90">{topicInfo.topic}</div>
          </motion.div>
        )}

        {/* Enhanced Timer Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 border-2 ${
            isLowTime ? 'border-red-400 animate-pulse' : 'border-white/20'
          } shadow-xl overflow-hidden`}
        >
          {/* Animated gradient background */}
          <motion.div
            animate={{
              background: isLowTime
                ? ['linear-gradient(45deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                   'linear-gradient(45deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)']
                : ['linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)',
                   'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%)']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={isLowTime ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
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
                Hurry up! Time is running out
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Progress Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 shadow-xl mb-6"
        >
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progress
              </span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full relative"
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
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-90 mb-1">Answered</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {answeredCount}
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-90 mb-1">Remaining</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {questions.length - answeredCount}
                <Target className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Question Palette */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-auto relative"
        >
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Question Palette
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuestionChange(index)}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg relative overflow-hidden
                  ${currentQuestion === index
                    ? 'bg-white text-indigo-600 shadow-white/50'
                    : answers[index] !== null
                      ? 'bg-emerald-500/80 text-white hover:bg-emerald-400'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                {currentQuestion === index && (
                  <motion.div
                    layoutId="activeQuestion"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{index + 1}</span>
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
          {/* Enhanced Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-white/50"
            >
              {/* Header with gradient */}
              <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                    >
                      <GraduationCap className="w-4 h-4" />
                      {questions[currentQuestion].subject}
                    </motion.span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {questions[currentQuestion].topic}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                      ${questions[currentQuestion].difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        questions[currentQuestion].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {questions[currentQuestion].difficulty.toUpperCase()}
                    </span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    {answers[currentQuestion] !== null && (
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
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-full relative"
                  >
                    <motion.div
                      animate={{ x: [-20, 100, -20] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Question Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8"
              >
                {/* Question Text */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group relative overflow-hidden
                        ${answers[currentQuestion] === index
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-brand-secondary hover:bg-gray-50'}`}
                    >
                      {/* Animated background on selection */}
                      {answers[currentQuestion] === index && (
                        <motion.div
                          layoutId="selectedOption"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-lg
                        ${answers[currentQuestion] === index
                          ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
                          : 'border-gray-300 text-gray-500 group-hover:border-brand-secondary group-hover:text-brand-secondary'}`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="relative flex-1 text-left text-gray-800 font-medium text-lg">{option}</span>
                      {answers[currentQuestion] === index && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500 }}
                          className="relative"
                        >
                          <CheckCircle className="text-indigo-600 w-6 h-6" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Enhanced Confidence Level Selection */}
                <AnimatePresence>
                  {answers[currentQuestion] !== null && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -20 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -20 }}
                      className="border-t border-gray-100 pt-6 overflow-hidden"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        How confident are you with your answer?
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {confidenceOptions.map(({ value, label, gradient, emoji }) => (
                          <motion.button
                            key={value}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConfidenceLevel(value)}
                            className={`relative p-4 rounded-2xl text-sm font-bold transition-all shadow-lg overflow-hidden
                              ${confidenceLevels[currentQuestion] === value
                                ? `${gradient} text-white scale-105 shadow-2xl`
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            {confidenceLevels[currentQuestion] === value && (
                              <motion.div
                                layoutId="selectedConfidence"
                                className={`absolute inset-0 ${gradient}`}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                            <div className="relative">
                              <div className="text-3xl mb-2">{emoji}</div>
                              <div className="text-xs">{label}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Enhanced Navigation Footer */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100 flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuestionChange(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2 bg-white shadow-md hover:shadow-lg"
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
                    <Award className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuestionChange(Math.min(questions.length - 1, currentQuestion + 1))}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 transition-all font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl"
                  >
                    Next Question
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
