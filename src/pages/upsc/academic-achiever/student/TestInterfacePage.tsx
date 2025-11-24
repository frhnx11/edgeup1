import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ChevronLeft, ChevronRight, Grid, Flag, 
  AlertCircle, CheckCircle, XCircle, Save, Send,
  Bookmark, BookmarkCheck, Eye, EyeOff, Calculator,
  Pause, Play, RotateCcw, List, HelpCircle, AlertTriangle,
  Volume2, VolumeX, Maximize2, Minimize2, Settings,
  Zap, Brain, Lightbulb, MessageSquare, Moon, Sun,
  BarChart3, Timer, Keyboard, MousePointer
} from 'lucide-react';

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer?: number;
  isMarked?: boolean;
  isAnswered?: boolean;
  timeSpent?: number;
}

interface TestData {
  id: string;
  title: string;
  type: string;
  questions: number;
  duration: number;
  currentQuestions?: Question[];
}

export function TestInterfacePage() {
  const navigate = useNavigate();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const questionTimerRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // New enhanced features
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAIHint, setShowAIHint] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Load test data from localStorage
  useEffect(() => {
    const savedTest = localStorage.getItem('currentTest');
    if (savedTest) {
      const test = JSON.parse(savedTest);
      setTestData(test);
      setTimeRemaining(test.duration * 60); // Convert minutes to seconds
      
      // Generate mock questions
      const mockQuestions: Question[] = Array.from({ length: test.questions }, (_, i) => ({
        id: `q-${i + 1}`,
        questionNumber: i + 1,
        question: generateMockQuestion(i + 1, test.type),
        options: generateMockOptions(test.type),
        isAnswered: false,
        isMarked: false,
        timeSpent: 0
      }));
      setQuestions(mockQuestions);
    } else {
      navigate('/test-suite');
    }
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (!isTestActive || isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
      
      // Track time spent on current question
      questionTimerRef.current += 1;
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTestActive, isPaused]);

  // Update question time when changing questions
  useEffect(() => {
    if (questions[currentQuestion]) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion].timeSpent = (updatedQuestions[currentQuestion].timeSpent || 0) + questionTimerRef.current;
      setQuestions(updatedQuestions);
      questionTimerRef.current = 0;
    }
  }, [currentQuestion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isTestActive || isPaused) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleNavigateQuestion(currentQuestion - 1);
          break;
        case 'ArrowRight':
          handleNavigateQuestion(currentQuestion + 1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          if (!e.ctrlKey && !e.metaKey) {
            handleAnswerSelect(parseInt(e.key) - 1);
          }
          break;
        case 'm':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleMarkQuestion();
          }
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowCalculator(!showCalculator);
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, isTestActive, isPaused, showCalculator]);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sound effect
  const playSound = (type: 'select' | 'navigate' | 'submit') => {
    if (!soundEnabled) return;
    // Add sound implementation
  };

  const generateMockQuestion = (num: number, type: string): string => {
    const questionTemplates = {
      'prelims-gs': [
        `Which of the following statements about the Indian Constitution is/are correct?`,
        `Consider the following statements about Economic Development:`,
        `With reference to Indian History, which of the following is correct?`,
        `In the context of Geography, what is the significance of...?`
      ],
      'prelims-csat': [
        `If a train travels at 60 km/h for 2 hours and then at 80 km/h for 3 hours, what is the average speed?`,
        `In a certain code, DELHI is written as CCIDD. How is MUMBAI written in that code?`,
        `A shopkeeper offers 20% discount on the marked price. If the cost price is ₹800...`,
        `Find the next number in the sequence: 2, 6, 12, 20, 30, ?`
      ],
      'topic-wise': [
        `Which Article of the Indian Constitution deals with...?`,
        `The Mughal Emperor who introduced the Mansabdari system was:`,
        `Which of the following rivers originates from...?`,
        `The monetary policy in India is formulated by:`
      ]
    };

    const templates = questionTemplates[type] || questionTemplates['prelims-gs'];
    return `Question ${num}: ${templates[num % templates.length]}`;
  };

  const generateMockOptions = (type: string): string[] => {
    if (type === 'prelims-csat') {
      return ['42', '45', '48', '50'];
    }
    return [
      '1 only',
      '2 only', 
      'Both 1 and 2',
      'Neither 1 nor 2'
    ];
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].selectedAnswer = optionIndex;
    updatedQuestions[currentQuestion].isAnswered = true;
    setQuestions(updatedQuestions);
    playSound('select');
    setConfidenceLevel(null); // Reset confidence for new answer
  };

  const handleMarkQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].isMarked = !updatedQuestions[currentQuestion].isMarked;
    setQuestions(updatedQuestions);
  };

  const handleClearResponse = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].selectedAnswer = undefined;
    updatedQuestions[currentQuestion].isAnswered = false;
    setQuestions(updatedQuestions);
  };

  const handleNavigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index);
    }
  };

  const handleSubmitTest = () => {
    setIsTestActive(false);
    const testResult = {
      testId: testData?.id,
      title: testData?.title,
      questions: questions,
      timeSpent: (testData?.duration || 0) * 60 - timeRemaining,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem('testResult', JSON.stringify(testResult));
    navigate(`/test-results/${testData?.id}`);
  };

  const getQuestionStatus = (question: Question) => {
    if (question.isAnswered && question.isMarked) return 'answered-marked';
    if (question.isAnswered) return 'answered';
    if (question.isMarked) return 'marked';
    if (question.questionNumber === currentQuestion + 1) return 'current';
    return 'not-answered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'marked':
        return 'bg-yellow-500 text-white';
      case 'answered-marked':
        return 'bg-brand-secondary text-white';
      case 'current':
        return 'bg-brand-primary text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const stats = {
    answered: questions.filter(q => q.isAnswered).length,
    marked: questions.filter(q => q.isMarked).length,
    notVisited: questions.filter(q => !q.isAnswered && !q.isMarked && q.questionNumber !== currentQuestion + 1).length
  };

  // Calculator functions
  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalculatorValue('0');
    } else if (value === '=') {
      try {
        setCalculatorValue(eval(calculatorValue).toString());
      } catch {
        setCalculatorValue('Error');
      }
    } else {
      setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  };

  if (!testData) return null;

  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col ${getFontSizeClass()}`}>
      {/* Enhanced Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6 py-3`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {testData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-primary" />
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {Math.round((questions.filter(q => q.isAnswered).length / questions.length) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Stats Button */}
            <button
              onClick={() => setShowQuickStats(!showQuickStats)}
              className={`p-2 rounded-lg transition-colors ${
                showQuickStats 
                  ? 'bg-brand-primary text-white' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Quick Stats"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            {/* Timer with Animation */}
            <motion.div 
              animate={{ scale: timeRemaining < 300 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeRemaining < 300 ? Infinity : 0, duration: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                timeRemaining < 300 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20'
              }`}
            >
              <Timer className="w-5 h-5" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </motion.div>
            
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 rounded transition-colors ${
                  isPaused ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
                }`}
                title={isPaused ? "Resume Test" : "Pause Test"}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded transition-colors ${
                  soundEnabled ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
                }`}
                title="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`p-2 rounded-lg transition-colors ${
                  showCalculator 
                    ? 'bg-brand-primary text-white' 
                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Calculator"
              >
                <Calculator className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Quick Stats Overlay */}
        <AnimatePresence>
          {showQuickStats && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 top-4 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-64"
            >
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Answered</span>
                  <span className="font-medium">{stats.answered}/{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Marked</span>
                  <span className="font-medium text-yellow-600">{stats.marked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time/Question</span>
                  <span className="font-medium">
                    {Math.floor(((testData?.duration || 0) * 60 - timeRemaining) / (stats.answered || 1))}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy Est.</span>
                  <span className="font-medium text-green-600">~75%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* AI Hint Button */}
            {!showAIHint && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowAIHint(true)}
                className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get AI Hint
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">-5 points</span>
              </motion.button>
            )}

            {/* AI Hint Display */}
            <AnimatePresence>
              {showAIHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        <strong>Hint:</strong> Focus on the key terms in this question. Consider the historical context and chronological order of events.
                      </p>
                      <button
                        onClick={() => setShowAIHint(false)}
                        className="text-xs text-purple-600 hover:text-purple-700 mt-2"
                      >
                        Hide hint
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 mb-6`}
            >
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${getFontSizeClass()}`}>
                    {questions[currentQuestion]?.question}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(fontSize === 'small' ? 'medium' : fontSize === 'medium' ? 'large' : 'small')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      title="Change Font Size"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <motion.label
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      questions[currentQuestion]?.selectedAnswer === index
                        ? darkMode 
                          ? 'border-brand-primary bg-brand-primary/20' 
                          : 'border-brand-primary bg-brand-primary/5'
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={questions[currentQuestion]?.selectedAnswer === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{
                          scale: questions[currentQuestion]?.selectedAnswer === index ? [1, 1.2, 1] : 1
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          questions[currentQuestion]?.selectedAnswer === index
                            ? 'border-brand-primary bg-brand-primary'
                            : darkMode ? 'border-gray-500' : 'border-gray-300'
                        }`}
                      >
                        {questions[currentQuestion]?.selectedAnswer === index && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.div>
                      <span className={`flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'} ${getFontSizeClass()}`}>
                        {option}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                  </motion.label>
                ))}
              </div>
              
              {/* Confidence Level Selector */}
              {questions[currentQuestion]?.isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    How confident are you about this answer?
                  </p>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setConfidenceLevel(level)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                          confidenceLevel === level
                            ? level === 'low'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : level === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : darkMode
                              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {level === 'low' ? '😟 Not Sure' : level === 'medium' ? '🤔 Fairly Sure' : '😊 Very Sure'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  onClick={handleMarkQuestion}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    questions[currentQuestion]?.isMarked
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {questions[currentQuestion]?.isMarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      Marked
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Mark for Review
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleClearResponse}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  disabled={!questions[currentQuestion]?.isAnswered}
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Response
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleNavigateQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => handleNavigateQuestion(currentQuestion + 1)}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors font-medium flex items-center gap-2"
                  >
                    Save & Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette */}
        {showQuestionPalette && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Question Palette</h3>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-secondary rounded"></div>
                  <span>Answered & Marked</span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-medium">{stats.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marked for Review</span>
                  <span className="font-medium">{stats.marked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Not Visited</span>
                  <span className="font-medium">{stats.notVisited}</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleNavigateQuestion(index)}
                    className={`w-full aspect-square rounded-lg font-medium text-sm transition-all ${
                      getStatusColor(getQuestionStatus(question))
                    } hover:scale-105`}
                  >
                    {question.questionNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Test
            </button>
          </div>
        )}
      </div>

      {/* Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-4 z-50"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Calculator</h4>
              <button
                onClick={() => setShowCalculator(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-100 rounded p-3 mb-3 text-right font-mono text-lg">
              {calculatorValue}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorInput(btn)}
                  className={`p-3 rounded font-medium transition-colors ${
                    btn === 'C' ? 'bg-red-100 text-red-700 hover:bg-red-200 col-span-4' :
                    btn === '=' ? 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20' :
                    'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-semibold">Submit Test?</h3>
              </div>
              
              <div className="mb-6 space-y-3">
                <p className="text-gray-600">
                  Are you sure you want to submit the test? You cannot change your answers after submission.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Answered</span>
                    <span className="font-medium">{stats.answered}</span>
                  </div>
                  <div className="flex justify-between text-yellow-600">
                    <span>Marked for Review</span>
                    <span className="font-medium">{stats.marked}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Not Answered</span>
                    <span className="font-medium">{questions.length - stats.answered}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Confirm Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Navigate Previous</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">← Arrow</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Navigate Next</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">→ Arrow</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Select Option</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">1-4</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Mark for Review</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl/⌘ + M</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Calculator</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl/⌘ + C</kbd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Fullscreen</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl/⌘ + F</kbd>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Pause className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Test Paused</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Click resume to continue your test</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors font-medium"
            >
              Resume Test
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}