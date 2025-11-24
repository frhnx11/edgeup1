import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ChevronLeft, ChevronRight, Grid, Flag, 
  AlertCircle, CheckCircle, Send, Bookmark, BookmarkCheck,
  Play, Pause, RotateCcw, List, HelpCircle
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
}

export function VerandaTestInterfacePage() {
  const navigate = useNavigate();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(true);
  const [showQuestionPalette, setShowQuestionPalette] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const questionTimerRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Generate mock questions
  const generateMockQuestion = (num: number, type: string) => {
    const questions = {
      banking: [
        `A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. What is the sum?`,
        `If the cost price is 96% of the selling price, then what is the profit percent?`,
        `What is the compound interest on Rs. 2500 for 2 years at 4% per annum?`
      ],
      ssc: [
        `If 3x + 2y = 12 and 2x + 3y = 13, then x + y = ?`,
        `The HCF of 12, 16, 28 and 36 is?`,
        `A train 125m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. What is the speed of the train?`
      ],
      railway: [
        `A train runs at the speed of 36 km/hr and crosses a platform in 15 seconds. If the length of the platform is 50m, what is the length of the train?`,
        `In what time will a railway train 60 m long moving at the rate of 36 km/hr pass a telegraph post?`,
        `Two trains are moving in opposite directions at 60 km/hr and 90 km/hr. Their lengths are 1.10 km and 0.9 km respectively. What is the time taken by the slower train to cross the faster train?`
      ]
    };
    
    const typeQuestions = questions[type as keyof typeof questions] || questions.banking;
    return typeQuestions[num % typeQuestions.length] || `Question ${num}: Sample question for ${type} exam.`;
  };

  const generateMockOptions = (type: string) => {
    return [
      'Option A',
      'Option B', 
      'Option C',
      'Option D'
    ];
  };

  // Load test data
  useEffect(() => {
    const savedTest = localStorage.getItem('currentTest');
    if (savedTest) {
      const test = JSON.parse(savedTest);
      setTestData(test);
      setTimeRemaining(test.duration * 60);
      
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
      navigate('/veranda-test-suite');
    }
  }, [navigate]);

  // Timer
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
      questionTimerRef.current += 1;
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTestActive, isPaused]);

  const handleAnswerSelect = (optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[currentQuestion];
    
    question.selectedAnswer = optionIndex;
    question.isAnswered = true;
    question.timeSpent = (question.timeSpent || 0) + questionTimerRef.current;
    
    setQuestions(updatedQuestions);
    questionTimerRef.current = 0;
  };

  const handleMarkForReview = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].isMarked = !updatedQuestions[currentQuestion].isMarked;
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      questionTimerRef.current = 0;
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      questionTimerRef.current = 0;
    }
  };

  const handleSubmitTest = () => {
    setIsTestActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Calculate results
    const answeredQuestions = questions.filter(q => q.isAnswered);
    const score = Math.floor(Math.random() * answeredQuestions.length * 0.8) + answeredQuestions.length * 0.2;
    
    const results = {
      testId: testData?.id,
      title: testData?.title,
      score: Math.round(score),
      totalQuestions: questions.length,
      answered: answeredQuestions.length,
      marked: questions.filter(q => q.isMarked).length,
      timeSpent: (testData?.duration || 0) * 60 - timeRemaining,
      percentage: Math.round((score / questions.length) * 100)
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    navigate(`/veranda-test-results/${testData?.id}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (question: Question) => {
    if (question.isAnswered && question.isMarked) return 'answered-marked';
    if (question.isAnswered) return 'answered';
    if (question.isMarked) return 'marked';
    return 'not-visited';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'marked':
        return 'bg-purple-500 text-white';
      case 'answered-marked':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
  };

  if (!testData) {
    return <div>Loading...</div>;
  }

  const currentQ = questions[currentQuestion];
  const stats = {
    answered: questions.filter(q => q.isAnswered).length,
    marked: questions.filter(q => q.isMarked).length,
    notVisited: questions.length - questions.filter(q => q.isAnswered || q.isMarked).length
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{testData.title}</h1>
            <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className={`font-mono text-lg font-semibold ${
                timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Question Panel */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {currentQ && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Question {currentQ.questionNumber}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkForReview}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentQ.isMarked 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {currentQ.isMarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      {currentQ.isMarked ? 'Marked' : 'Mark'}
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <p className="text-gray-900 text-lg leading-relaxed">{currentQ.question}</p>
                </div>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        currentQ.selectedAnswer === index
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          currentQ.selectedAnswer === index
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          <span className="text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Question Palette */}
        {showQuestionPalette && (
          <div className="w-80 bg-white border-l p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Question Palette</h3>
              <button
                onClick={() => setShowQuestionPalette(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{stats.answered}</div>
                <div className="text-xs text-green-700">Answered</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{stats.marked}</div>
                <div className="text-xs text-purple-700">Marked</div>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion 
                      ? 'ring-2 ring-purple-500 ' + getStatusColor(getQuestionStatus(question))
                      : getStatusColor(getQuestionStatus(question))
                  }`}
                >
                  {question.questionNumber}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold mb-4">Submit Test</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit the test? You have answered {stats.answered} out of {questions.length} questions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}