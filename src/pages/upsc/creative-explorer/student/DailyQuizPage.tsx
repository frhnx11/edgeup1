import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Timer,
  Award,
  ChevronRight,
  ChevronLeft,
  Flag,
  RotateCcw,
  Send,
  Target,
  Brain,
  TrendingUp,
  Star,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  BarChart3,
  Info,
  Lightbulb
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'single' | 'multiple';
  timeLimit?: number;
  points: number;
  hint?: string;
  markedForReview?: boolean;
  userAnswer?: number | number[];
  timeTaken?: number;
}

interface QuizSection {
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
}

export function DailyQuizPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | number[] | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // Sample quiz data - in real app, this would come from backend
  const quizSections: QuizSection[] = [
    {
      title: "Conceptual Understanding",
      description: "Test your understanding of today's core concepts",
      timeLimit: 15, // minutes
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "Which of the following best describes the Mauryan Empire's administrative system?",
          options: [
            "A highly decentralized system with autonomous provinces",
            "A centralized bureaucracy with appointed officials",
            "A feudal system with hereditary nobles",
            "A democratic republic with elected representatives"
          ],
          correctAnswer: 1,
          explanation: "The Mauryan Empire, especially under Chandragupta and Ashoka, had a highly centralized administrative system with appointed officials (Amatyas) who reported directly to the emperor. This system was detailed in Kautilya's Arthashastra.",
          topic: "Mauryan Administration",
          difficulty: "medium",
          type: "single",
          points: 10,
          hint: "Think about Kautilya's Arthashastra and its emphasis on state control"
        },
        {
          id: 2,
          question: "What was the primary economic activity in the Mauryan Empire?",
          options: [
            "Maritime trade",
            "Agriculture",
            "Mining",
            "Textile production"
          ],
          correctAnswer: 1,
          explanation: "Agriculture was the backbone of the Mauryan economy. The state maintained irrigation systems and collected taxes primarily from agricultural produce. While trade and crafts were important, agriculture supported the majority of the population.",
          topic: "Mauryan Economy",
          difficulty: "easy",
          type: "single",
          points: 5,
          hint: "Consider what supported the majority of the population"
        },
        {
          id: 3,
          question: "Which of Ashoka's edicts promoted religious tolerance?",
          options: [
            "Rock Edict XII",
            "Pillar Edict VII",
            "Rock Edict XIII",
            "Minor Rock Edict I"
          ],
          correctAnswer: 0,
          explanation: "Rock Edict XII explicitly promotes religious tolerance, stating that all religions should be respected and that one should not elevate one's own religion by condemning others.",
          topic: "Ashoka's Dhamma",
          difficulty: "hard",
          type: "single",
          points: 15,
          hint: "This edict specifically mentions respecting all sects"
        }
      ]
    },
    {
      title: "Application & Analysis",
      description: "Apply concepts to solve problems and analyze scenarios",
      timeLimit: 20,
      passingScore: 75,
      questions: [
        {
          id: 4,
          question: "If you were a trader during the Mauryan period, which routes would be most profitable?",
          options: [
            "Northern routes through the Himalayas",
            "Western routes to ports like Bharuch",
            "Eastern routes to Southeast Asia",
            "Southern routes through the Deccan"
          ],
          correctAnswer: 1,
          explanation: "Western trade routes to ports like Bharuch (Broach) were most profitable as they connected to maritime trade with the Roman Empire and Arabian Peninsula. These routes carried high-value goods like spices, textiles, and precious stones.",
          topic: "Trade Routes",
          difficulty: "medium",
          type: "single",
          points: 10,
          hint: "Consider which routes connected to international maritime trade"
        },
        {
          id: 5,
          question: "How did the Mauryan taxation system differ from modern systems?",
          options: [
            "It was primarily based on land revenue",
            "It included income tax on individuals",
            "It relied mainly on customs duties",
            "It was voluntary contribution based"
          ],
          correctAnswer: 0,
          explanation: "The Mauryan taxation system was primarily agrarian, with land revenue (bhaga) being the main source of state income, typically 1/6th of the produce. This differs from modern systems which rely more on income tax and service taxes.",
          topic: "Economic Systems",
          difficulty: "medium",
          type: "single",
          points: 10,
          hint: "Think about the primary economic activity of that era"
        }
      ]
    },
    {
      title: "Critical Thinking",
      description: "Evaluate and synthesize information from multiple perspectives",
      timeLimit: 10,
      passingScore: 80,
      questions: [
        {
          id: 6,
          question: "What factors contributed to the decline of the Mauryan Empire? (Select all that apply)",
          options: [
            "Weak successors after Ashoka",
            "Economic burden of maintaining large army",
            "Rise of regional powers",
            "Foreign invasions",
            "Natural disasters"
          ],
          correctAnswer: [0, 1, 2, 3],
          explanation: "The Mauryan Empire declined due to multiple factors: weak successors couldn't maintain central authority, the economic burden of a large standing army strained resources, regional powers asserted independence, and foreign invasions (like the Greeks) weakened frontier regions.",
          topic: "Fall of Mauryas",
          difficulty: "hard",
          type: "multiple",
          points: 20,
          hint: "Multiple factors led to the decline - think comprehensively"
        }
      ]
    }
  ];

  // Initialize selected answers array
  useEffect(() => {
    const totalQuestions = quizSections.reduce((acc, section) => acc + section.questions.length, 0);
    setSelectedAnswers(new Array(totalQuestions).fill(null));
    setQuestionTimes(new Array(totalQuestions).fill(0));
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
        
        // Track time spent on current question
        const currentIndex = getGlobalQuestionIndex();
        setQuestionTimes(prev => {
          const newTimes = [...prev];
          newTimes[currentIndex] = (newTimes[currentIndex] || 0) + 1;
          return newTimes;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted, timeRemaining]);

  const getGlobalQuestionIndex = () => {
    let index = 0;
    for (let i = 0; i < currentSection; i++) {
      index += quizSections[i].questions.length;
    }
    return index + currentQuestion;
  };

  const handleStartQuiz = () => {
    const totalTime = quizSections.reduce((acc, section) => acc + section.timeLimit, 0);
    setTimeRemaining(totalTime * 60); // Convert to seconds
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answer: number | number[]) => {
    const currentIndex = getGlobalQuestionIndex();
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizSections[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < quizSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
    setShowExplanation(false);
    setShowHint(false);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(quizSections[currentSection - 1].questions.length - 1);
    }
    setShowExplanation(false);
    setShowHint(false);
  };

  const handleMarkForReview = () => {
    const currentQ = quizSections[currentSection].questions[currentQuestion];
    currentQ.markedForReview = !currentQ.markedForReview;
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setReviewMode(true);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let earnedScore = 0;
    let correctAnswers = 0;
    let totalQuestions = 0;

    quizSections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        const globalIndex = sectionIndex * section.questions.length + questionIndex;
        totalScore += question.points;
        totalQuestions++;

        if (question.type === 'single') {
          if (selectedAnswers[globalIndex] === question.correctAnswer) {
            earnedScore += question.points;
            correctAnswers++;
          }
        } else if (question.type === 'multiple') {
          const userAnswer = selectedAnswers[globalIndex] as number[] || [];
          const correctAnswer = question.correctAnswer as number[];
          if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort())) {
            earnedScore += question.points;
            correctAnswers++;
          }
        }
      });
    });

    return {
      percentage: Math.round((earnedScore / totalScore) * 100),
      earnedScore,
      totalScore,
      correctAnswers,
      totalQuestions,
      timeTaken: Math.round((Date.now() - startTime) / 1000)
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuiz = quizSections[currentSection];
  const currentQ = currentQuiz?.questions[currentQuestion];
  const currentIndex = getGlobalQuestionIndex();

  if (!quizStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Assessment Quiz</h1>
              <p className="text-gray-600">Day {dayNumber} - Test your understanding of today's topics</p>
            </div>

            <div className="space-y-6 mb-8">
              {quizSections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-700">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {section.timeLimit} minutes
                        </span>
                        <span className="flex items-center gap-2 text-gray-500">
                          <Target className="w-4 h-4" />
                          {section.questions.length} questions
                        </span>
                        <span className="flex items-center gap-2 text-gray-500">
                          <Award className="w-4 h-4" />
                          Pass: {section.passingScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Quiz Instructions
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Total time: {quizSections.reduce((acc, s) => acc + s.timeLimit, 0)} minutes</li>
                <li>• You can navigate between questions using Previous/Next buttons</li>
                <li>• Mark questions for review if you want to revisit them</li>
                <li>• Each question has different points based on difficulty</li>
                <li>• You can use hints, but they will reduce your score by 20%</li>
                <li>• Submit the quiz when done or it will auto-submit when time expires</li>
              </ul>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Quiz
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (quizCompleted) {
    const results = calculateScore();
    const passed = results.percentage >= 70;

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-600">
                {passed ? 'You passed the assessment' : 'You need more practice'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{results.percentage}%</p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{results.correctAnswers}/{results.totalQuestions}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{results.earnedScore}</p>
                <p className="text-sm text-gray-600">Points</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{formatTime(results.timeTaken)}</p>
                <p className="text-sm text-gray-600">Time</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-800">Section-wise Performance</h3>
              {quizSections.map((section, index) => {
                let sectionCorrect = 0;
                let sectionTotal = section.questions.length;
                
                section.questions.forEach((q, qIndex) => {
                  const globalIndex = index * section.questions.length + qIndex;
                  if (q.type === 'single' && selectedAnswers[globalIndex] === q.correctAnswer) {
                    sectionCorrect++;
                  }
                });

                const sectionPercentage = Math.round((sectionCorrect / sectionTotal) * 100);
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-32">{section.title}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${sectionPercentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${sectionPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12">{sectionPercentage}%</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setReviewMode(true);
                  setQuizCompleted(false);
                  setCurrentSection(0);
                  setCurrentQuestion(0);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={() => navigate(`/course/${courseId}/day/${dayNumber}`)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Course
              </button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentQuiz.title} - Question {currentQuestion + 1} of {currentQuiz.questions.length}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={handleMarkForReview}
                className={`p-2 rounded-lg transition-colors ${
                  currentQ.markedForReview
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: quizSections.reduce((acc, s) => acc + s.questions.length, 0) }).map((_, index) => {
              const isAnswered = selectedAnswers[index] !== null;
              const isCurrent = index === currentIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    // Navigate to this question
                    let sectionIndex = 0;
                    let questionIndex = index;
                    
                    for (let i = 0; i < quizSections.length; i++) {
                      if (questionIndex < quizSections[i].questions.length) {
                        setCurrentSection(i);
                        setCurrentQuestion(questionIndex);
                        break;
                      }
                      questionIndex -= quizSections[i].questions.length;
                    }
                  }}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    isCurrent
                      ? 'bg-brand-primary text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Content */}
        <motion.div
          key={`${currentSection}-${currentQuestion}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800 flex-1">
                {currentQ.question}
              </h3>
              <span className="text-sm font-medium text-gray-500 ml-4">
                {currentQ.points} points
              </span>
            </div>
            
            {currentQ.hint && !reviewMode && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide' : 'Show'} Hint (-20% points)
              </button>
            )}
            
            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">{currentQ.hint}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = currentQ.type === 'single'
                ? selectedAnswers[currentIndex] === index
                : (selectedAnswers[currentIndex] as number[] || []).includes(index);
              
              const isCorrect = currentQ.type === 'single'
                ? index === currentQ.correctAnswer
                : (currentQ.correctAnswer as number[]).includes(index);
              
              return (
                <label
                  key={index}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    reviewMode
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : isSelected
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {currentQ.type === 'single' ? (
                      <input
                        type="radio"
                        name={`question-${currentIndex}`}
                        checked={isSelected}
                        onChange={() => !reviewMode && handleAnswerSelect(index)}
                        disabled={reviewMode}
                        className="w-4 h-4 text-brand-primary"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (!reviewMode) {
                            const current = (selectedAnswers[currentIndex] as number[]) || [];
                            if (isSelected) {
                              handleAnswerSelect(current.filter(a => a !== index));
                            } else {
                              handleAnswerSelect([...current, index]);
                            }
                          }
                        }}
                        disabled={reviewMode}
                        className="w-4 h-4 text-brand-primary"
                      />
                    )}
                    <span className="flex-1 text-gray-800">{option}</span>
                    {reviewMode && (
                      <span>
                        {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {!isCorrect && isSelected && <XCircle className="w-5 h-5 text-red-600" />}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {reviewMode && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
              <p className="text-sm text-blue-800">{currentQ.explanation}</p>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-4">
            {!reviewMode && (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentSection === quizSections.length - 1 && currentQuestion === quizSections[currentSection].questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}