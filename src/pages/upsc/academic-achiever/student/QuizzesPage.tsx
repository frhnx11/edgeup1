import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  HelpCircle,
  Play,
  Globe,
  BookOpen,
  Scale,
  Coins,
  Newspaper,
  Heart,
  X,
  Zap,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Flag,
  Send,
  BarChart2,
  MessageCircle,
  Trophy,
  ChevronDown,
  CheckCircle,
  XCircle,
  Target,
  TrendingUp
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  timeLimit: string;
  participants: number;
  status: 'live' | 'upcoming' | 'completed';
  gradient: string;
  icon: React.ElementType;
  startsIn?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isYou?: boolean;
  gradient: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  image?: string;
}

const quizzesData: Quiz[] = [
  {
    id: '1',
    title: 'Daily Polity Challenge',
    subject: 'Polity',
    questions: 20,
    timeLimit: '15 mins',
    participants: 156,
    status: 'upcoming',
    gradient: 'from-blue-500 to-indigo-500',
    icon: Scale,
    startsIn: '2 hours'
  },
  {
    id: '2',
    title: 'History Speed Round',
    subject: 'History',
    questions: 30,
    timeLimit: '20 mins',
    participants: 89,
    status: 'upcoming',
    gradient: 'from-amber-500 to-orange-500',
    icon: BookOpen,
    startsIn: '4 hours'
  },
  {
    id: '3',
    title: 'Geography Rapid Blitz',
    subject: 'Geography',
    questions: 10,
    timeLimit: '18 mins',
    participants: 234,
    status: 'live',
    gradient: 'from-green-500 to-emerald-500',
    icon: Globe
  },
  {
    id: '4',
    title: 'Economy Weekly Test',
    subject: 'Economy',
    questions: 40,
    timeLimit: '30 mins',
    participants: 67,
    status: 'upcoming',
    gradient: 'from-purple-500 to-violet-500',
    icon: Coins,
    startsIn: 'Tomorrow'
  },
  {
    id: '5',
    title: 'Current Affairs Daily',
    subject: 'Current Affairs',
    questions: 15,
    timeLimit: '10 mins',
    participants: 312,
    status: 'upcoming',
    gradient: 'from-cyan-500 to-teal-500',
    icon: Newspaper,
    startsIn: '6 hours'
  },
  {
    id: '6',
    title: 'Ethics Case Study',
    subject: 'Ethics',
    questions: 10,
    timeLimit: '25 mins',
    participants: 45,
    status: 'upcoming',
    gradient: 'from-rose-500 to-pink-500',
    icon: Heart,
    startsIn: 'Tomorrow'
  }
];

const lobbyParticipants: Participant[] = [
  { id: '1', name: 'You', avatar: 'Y', isYou: true, gradient: 'from-green-500 to-emerald-500' },
  { id: '2', name: 'Priya Sharma', avatar: 'P', gradient: 'from-rose-500 to-pink-500' },
  { id: '3', name: 'Rahul Verma', avatar: 'R', gradient: 'from-blue-500 to-indigo-500' },
  { id: '4', name: 'Anita Singh', avatar: 'A', gradient: 'from-amber-500 to-orange-500' },
  { id: '5', name: 'Vikram Patel', avatar: 'V', gradient: 'from-purple-500 to-violet-500' },
  { id: '6', name: 'Neha Gupta', avatar: 'N', gradient: 'from-cyan-500 to-teal-500' },
  { id: '7', name: 'Arjun Reddy', avatar: 'A', gradient: 'from-red-500 to-rose-500' },
  { id: '8', name: 'Sneha Patel', avatar: 'S', gradient: 'from-indigo-500 to-purple-500' },
  { id: '9', name: 'Karan Singh', avatar: 'K', gradient: 'from-orange-500 to-amber-500' },
  { id: '10', name: 'Meera Joshi', avatar: 'M', gradient: 'from-teal-500 to-green-500' },
  { id: '11', name: 'Amit Kumar', avatar: 'A', gradient: 'from-pink-500 to-rose-500' },
  { id: '12', name: 'Pooja Verma', avatar: 'P', gradient: 'from-violet-500 to-indigo-500' }
];

// Geography Quiz Questions - UPSC Standard
const geographyQuestions: Question[] = [
  {
    id: 1,
    question: 'Consider the following statements regarding the Brahmaputra River:\n1. It originates from the Angsi Glacier in Tibet.\n2. In Tibet, it is known as Yarlung Tsangpo.\n3. It receives the maximum rainfall in the monsoon season.\n4. It is one of the few rivers that exhibit a tidal bore.\n\nWhich of the statements given above are correct?',
    options: ['1, 2 and 3 only', '2, 3 and 4 only', '1, 3 and 4 only', 'All of the above'],
    correct: 3
  },
  {
    id: 2,
    question: 'Identify the state marked as "A" in the given map of North-East India:',
    options: ['Nagaland', 'Manipur', 'Mizoram', 'Tripura'],
    correct: 0,
    image: '/467ffe22-2ebc-4a9f-b709-460ceee7f3b9.jpg'
  },
  {
    id: 3,
    question: 'With reference to the "Indian Desert" or "Thar Desert", consider the following statements:\n1. It is bounded by the Aravalli Hills on the east.\n2. The Luni is the only river in this region that drains into the sea.\n3. The annual rainfall in this region is less than 150 mm.\n\nWhich of the statements given above is/are correct?',
    options: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    correct: 1
  },
  {
    id: 4,
    question: 'Consider the following pairs of States and their State Animals:\n1. Arunachal Pradesh – Gayal (Mithun)\n2. Manipur – Sangai (Brow-antlered Deer)\n3. Meghalaya – Clouded Leopard\n4. Nagaland – Mithun\n\nWhich of the pairs given above are correctly matched?',
    options: ['1 and 2 only', '2 and 3 only', '1, 2 and 3 only', 'All of the above'],
    correct: 2
  },
  {
    id: 5,
    question: 'Which of the following statements about the Indian Ocean Dipole (IOD) is/are correct?\n1. A positive IOD is associated with droughts in eastern Africa.\n2. The IOD affects the monsoon patterns in the Indian subcontinent.\n3. It is characterized by the difference in sea surface temperatures between eastern and western Indian Ocean.\n\nSelect the correct answer using the code given below:',
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    correct: 1
  },
  {
    id: 6,
    question: 'The Tropic of Cancer passes through which of the following Indian states?\n1. Gujarat\n2. Jharkhand\n3. Assam\n4. Mizoram\n\nSelect the correct answer using the code given below:',
    options: ['1, 2 and 3 only', '1, 3 and 4 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    correct: 1
  },
  {
    id: 7,
    question: 'Identify the historical event depicted in this image:',
    options: ['Quit India Movement', 'Jallianwala Bagh Massacre', 'Non-Cooperation Movement', 'Salt March'],
    correct: 1,
    image: '/Jallianwala-Bagh-Massacre-13-4-1919.jpg'
  },
  {
    id: 8,
    question: 'Consider the following statements about the Western Ghats:\n1. They are older than the Himalayas.\n2. They are a UNESCO World Heritage Site.\n3. They receive rainfall from both the Southwest and Northeast monsoons.\n4. The Nilgiri Hills are part of the Western Ghats.\n\nWhich of the statements given above are correct?',
    options: ['1, 2 and 3 only', '2, 3 and 4 only', '1, 2 and 4 only', 'All of the above'],
    correct: 3
  },
  {
    id: 9,
    question: 'With reference to the soil types found in India, which of the following statements is/are correct?\n1. Black soil is rich in lime, iron, magnesia, and alumina.\n2. Red soil is deficient in nitrogen, phosphorus, and humus.\n3. Laterite soil is suitable for plantation crops like tea and coffee.\n\nSelect the correct answer using the code given below:',
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    correct: 3
  },
  {
    id: 10,
    question: 'Consider the following pairs of Mountain Passes and their locations:\n1. Shipki La – Uttarakhand\n2. Nathu La – Sikkim\n3. Bomdila – Arunachal Pradesh\n4. Rohtang Pass – Himachal Pradesh\n\nWhich of the pairs given above are correctly matched?',
    options: ['1 and 2 only', '2, 3 and 4 only', '1, 3 and 4 only', 'All of the above'],
    correct: 1
  }
];

// Leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Priya Sharma', score: 9, time: '12:45', gradient: 'from-rose-500 to-pink-500' },
  { rank: 2, name: 'Rahul Verma', score: 8, time: '14:20', gradient: 'from-blue-500 to-indigo-500' },
  { rank: 3, name: 'Anita Singh', score: 8, time: '15:10', gradient: 'from-amber-500 to-orange-500' },
  { rank: 4, name: 'You', score: 0, time: '00:00', gradient: 'from-green-500 to-emerald-500', isYou: true },
  { rank: 5, name: 'Vikram Patel', score: 7, time: '13:30', gradient: 'from-purple-500 to-violet-500' },
  { rank: 6, name: 'Neha Gupta', score: 7, time: '14:50', gradient: 'from-cyan-500 to-teal-500' },
  { rank: 7, name: 'Arjun Reddy', score: 6, time: '16:00', gradient: 'from-red-500 to-rose-500' },
  { rank: 8, name: 'Sneha Patel', score: 6, time: '16:30', gradient: 'from-indigo-500 to-purple-500' },
  { rank: 9, name: 'Karan Singh', score: 5, time: '15:45', gradient: 'from-orange-500 to-amber-500' },
  { rank: 10, name: 'Meera Joshi', score: 5, time: '17:00', gradient: 'from-teal-500 to-green-500' },
  { rank: 11, name: 'Amit Kumar', score: 4, time: '17:30', gradient: 'from-pink-500 to-rose-500' },
  { rank: 12, name: 'Pooja Verma', score: 4, time: '18:00', gradient: 'from-violet-500 to-indigo-500' }
];

export function QuizzesPage() {
  const [isInLobby, setIsInLobby] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(18 * 60); // 18 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [activeResultsTab, setActiveResultsTab] = useState<'analysis' | 'questions' | 'leaderboard' | 'chat'>('analysis');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; name: string; message: string; time: string }>>([
    { id: '1', name: 'Priya Sharma', message: 'Great quiz everyone! That map question was tricky!', time: '2:30 PM' },
    { id: '2', name: 'Rahul Verma', message: 'I got confused with the Tropic of Cancer states', time: '2:31 PM' },
    { id: '3', name: 'Anita Singh', message: 'The Jallianwala Bagh image was a giveaway though', time: '2:32 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Timer effect
  useEffect(() => {
    if (!isQuizStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted]);

  const handleJoinQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsInLobby(true);
  };

  const handleLeaveLobby = () => {
    setIsInLobby(false);
    setSelectedQuiz(null);
  };

  const handleStartQuiz = () => {
    setIsInLobby(false);
    setIsQuizStarted(true);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < geographyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitQuiz = () => {
    setIsQuizStarted(false);
    setIsShowingResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(18 * 60);
    setFlaggedQuestions(new Set());
    setSelectedQuiz(null);
    setActiveResultsTab('analysis');
  };

  const handleSubmitQuiz = () => {
    setIsQuizStarted(false);
    setIsShowingResults(true);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      name: 'You',
      message: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    geographyQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / geographyQuestions.length) * 100);
  const timeTaken = formatTime(18 * 60 - timeRemaining);

  // Quiz Interface
  if (isQuizStarted && selectedQuiz) {
    const question = geographyQuestions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gray-900"
      >
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleExitQuiz}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-white font-bold">{selectedQuiz.title}</h2>
                <p className="text-gray-400 text-sm">Question {currentQuestion + 1} of {geographyQuestions.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Timer */}
              <motion.div
                animate={timeRemaining < 120 ? {
                  scale: [1, 1.05, 1],
                  color: ['#ef4444', '#f87171', '#ef4444']
                } : {}}
                transition={{ duration: 1, repeat: timeRemaining < 120 ? Infinity : 0 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  timeRemaining < 120 ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-white'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </motion.div>

              {/* Progress */}
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">{answeredCount}/{geographyQuestions.length} answered</span>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / geographyQuestions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Question Navigator Sidebar */}
          <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Questions
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {geographyQuestions.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentQuestion(index)}
                  className={`relative w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                    currentQuestion === index
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-gray-800'
                      : answers[index] !== undefined
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded bg-gray-700" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="relative w-3 h-3 rounded bg-gray-700">
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
                </div>
                <span>Flagged</span>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Question {currentQuestion + 1}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleToggleFlag}
                      className={`p-2 rounded-lg transition-colors ${
                        flaggedQuestions.has(currentQuestion)
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-gray-700 text-gray-400 hover:text-orange-400'
                      }`}
                    >
                      <Flag className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Question Image */}
                  {question.image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 rounded-xl overflow-hidden border-2 border-gray-700"
                    >
                      <img
                        src={question.image}
                        alt="Question visual"
                        className="w-full max-h-80 object-contain bg-gray-800"
                      />
                    </motion.div>
                  )}

                  <h2 className="text-xl font-bold text-white leading-relaxed whitespace-pre-line">
                    {question.question}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectAnswer(index)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        answers[currentQuestion] === index
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500 text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      {/* Option Letter */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        answers[currentQuestion] === index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>

                      {/* Option Text */}
                      <span className="flex-1 font-medium">{option}</span>

                      {/* Check Icon */}
                      {answers[currentQuestion] === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      currentQuestion === 0
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </motion.button>

                  {currentQuestion === geographyQuestions.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitQuiz}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      Submit
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  // Results View
  if (isShowingResults && selectedQuiz) {
    // Update leaderboard with user's score
    const updatedLeaderboard = leaderboardData.map(entry =>
      entry.isYou ? { ...entry, score, time: timeTaken } : entry
    ).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time.localeCompare(b.time);
    }).map((entry, index) => ({ ...entry, rank: index + 1 }));

    const userRank = updatedLeaderboard.find(e => e.isYou)?.rank || 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleExitQuiz}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-white font-bold">{selectedQuiz.title} - Results</h2>
                <p className="text-gray-400 text-sm">Quiz completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6">
          {/* Score Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 mb-6 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pie Chart */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 251.2' }}
                    animate={{ strokeDasharray: `${percentage * 2.512} 251.2` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="text-4xl font-bold text-white"
                  >
                    {score}/{geographyQuestions.length}
                  </motion.span>
                  <span className="text-gray-400 text-sm">Correct</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Correct</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{score}</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Wrong</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{geographyQuestions.length - score}</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Time Taken</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{timeTaken}</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-medium">Rank</span>
                  </div>
                  <p className="text-2xl font-bold text-white">#{userRank}</p>
                </div>
              </div>
            </div>

            {/* Performance Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`mt-6 p-4 rounded-xl text-center ${
                percentage >= 70
                  ? 'bg-green-500/20 text-green-400'
                  : percentage >= 40
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <p className="font-semibold">
                {percentage >= 70
                  ? 'Excellent Performance! Keep up the great work!'
                  : percentage >= 40
                  ? 'Good effort! Review the topics you missed.'
                  : 'Keep practicing! Focus on the weak areas.'}
              </p>
            </motion.div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-gray-800 rounded-xl p-1">
            {[
              { id: 'analysis', label: 'Analysis', icon: BarChart2 },
              { id: 'questions', label: 'Questions', icon: HelpCircle },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'chat', label: 'Live Chat', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveResultsTab(tab.id as typeof activeResultsTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeResultsTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Analysis Tab */}
            {activeResultsTab === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Performance Breakdown */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Performance Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white font-medium">{percentage}%</span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Speed</span>
                        <span className="text-white font-medium">{timeTaken}</span>
                      </div>
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((18 * 60 - timeRemaining) / (18 * 60)) * 100)}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topic Analysis */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Topic Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Physical Geography</p>
                      <p className="text-white font-semibold">Strong</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Map Reading</p>
                      <p className="text-white font-semibold">Good</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Indian Geography</p>
                      <p className="text-white font-semibold">Average</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">History</p>
                      <p className="text-white font-semibold">Needs Work</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Questions Tab */}
            {activeResultsTab === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {geographyQuestions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correct;

                  return (
                    <div
                      key={q.id}
                      className={`bg-gray-800 rounded-2xl p-5 border ${
                        isCorrect ? 'border-green-500/50' : 'border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-3 whitespace-pre-line">
                            Q{index + 1}. {q.question}
                          </p>

                          {q.image && (
                            <div className="mb-3 rounded-lg overflow-hidden max-w-sm">
                              <img src={q.image} alt="Question visual" className="w-full h-32 object-cover" />
                            </div>
                          )}

                          <div className="space-y-2">
                            {q.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                                  optIndex === q.correct
                                    ? 'bg-green-500/20 text-green-400'
                                    : optIndex === userAnswer && !isCorrect
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'text-gray-400'
                                }`}
                              >
                                <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                <span>{option}</span>
                                {optIndex === q.correct && (
                                  <CheckCircle className="w-4 h-4 ml-auto" />
                                )}
                                {optIndex === userAnswer && !isCorrect && (
                                  <XCircle className="w-4 h-4 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Leaderboard Tab */}
            {activeResultsTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Live Leaderboard
                  </h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {updatedLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 ${
                        entry.isYou ? 'bg-green-500/10' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        entry.rank === 1
                          ? 'bg-yellow-500 text-black'
                          : entry.rank === 2
                          ? 'bg-gray-300 text-black'
                          : entry.rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${entry.gradient} flex items-center justify-center text-white font-bold`}>
                        {entry.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${entry.isYou ? 'text-green-400' : 'text-white'}`}>
                          {entry.name}
                          {entry.isYou && <span className="text-xs ml-2">(You)</span>}
                        </p>
                        <p className="text-xs text-gray-400">Time: {entry.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{entry.score}/10</p>
                        <p className="text-xs text-gray-400">{entry.score * 10}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Live Chat Tab */}
            {activeResultsTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    Live Chat
                  </h3>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.name === 'You' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                        msg.name === 'You' ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-indigo-500'
                      } flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {msg.name.charAt(0)}
                      </div>
                      <div className={`max-w-[70%] ${msg.name === 'You' ? 'text-right' : ''}`}>
                        <p className="text-xs text-gray-400 mb-1">{msg.name} • {msg.time}</p>
                        <div className={`px-4 py-2 rounded-xl ${
                          msg.name === 'You'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-gray-700 text-white'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 border-0 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendChatMessage}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
      <>
      <div className="min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Live Quizzes
          </h1>
          <p className="text-gray-600">
            Compete with fellow aspirants and test your knowledge in real-time!
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Live Now</span>
            </div>
            <p className="text-2xl font-bold">1</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Upcoming</span>
            </div>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Total Players</span>
            </div>
            <p className="text-2xl font-bold">903</p>
          </div>
        </motion.div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzesData.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {quiz.status === 'live' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-green-500 rounded-full"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-white">LIVE</span>
                  </motion.div>
                ) : (
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-medium text-gray-600">Upcoming</span>
                  </div>
                )}
              </div>

              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${quiz.gradient} p-6 pb-8`}>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                  <quiz.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{quiz.title}</h3>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
                  {quiz.subject}
                </span>
              </div>

              {/* Quiz Details */}
              <div className="p-5 -mt-4 bg-white rounded-t-2xl relative">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{quiz.questions}</p>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{quiz.timeLimit}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{quiz.participants}</p>
                    <p className="text-xs text-gray-500">Players</p>
                  </div>
                </div>

                {/* Action Button */}
                {quiz.status === 'live' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinQuiz(quiz)}
                    className={`w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r ${quiz.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Join Now</span>
                  </motion.button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Starts in {quiz.startsIn}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pre-Battle Lobby Overlay */}
      <AnimatePresence>
        {isInLobby && selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl mx-4">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleLeaveLobby}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full mb-4"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white">LIVE NOW</span>
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {selectedQuiz.title}
                  </span>
                </h2>
                <p className="text-white/70">
                  {selectedQuiz.questions} Questions • {selectedQuiz.timeLimit}
                </p>
              </motion.div>

              {/* Participants Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Players Ready
                  </h3>
                  <span className="text-white/70 text-sm">{lobbyParticipants.length} joined</span>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {lobbyParticipants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.3 + index * 0.05,
                        type: 'spring',
                        stiffness: 200
                      }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-2">
                        <motion.div
                          animate={participant.isYou ? {
                            boxShadow: [
                              '0 0 20px rgba(34, 197, 94, 0.5)',
                              '0 0 40px rgba(34, 197, 94, 0.8)',
                              '0 0 20px rgba(34, 197, 94, 0.5)'
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-14 h-14 rounded-full bg-gradient-to-br ${participant.gradient} flex items-center justify-center text-white font-bold text-lg ${
                            participant.isYou ? 'ring-4 ring-green-400' : ''
                          }`}
                        >
                          {participant.avatar}
                        </motion.div>

                        {participant.isYou && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute -top-2 -right-2"
                          >
                            <Crown className="w-5 h-5 text-yellow-400" />
                          </motion.div>
                        )}

                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900" />
                      </div>

                      <span className={`text-xs font-medium truncate w-full text-center ${
                        participant.isYou ? 'text-green-400' : 'text-white/80'
                      }`}>
                        {participant.name}
                      </span>

                      {participant.isYou && (
                        <span className="text-xs text-green-400/70">(You)</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Begin Quiz Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartQuiz}
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(34, 197, 94, 0.4)',
                      '0 0 60px rgba(34, 197, 94, 0.6)',
                      '0 0 30px rgba(34, 197, 94, 0.4)'
                    ]
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                  className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Begin Quiz
                    <Sparkles className="w-5 h-5" />
                  </span>
                </motion.button>

                <p className="text-white/50 text-sm mt-4">
                  Waiting for more players to join...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
  );
}
