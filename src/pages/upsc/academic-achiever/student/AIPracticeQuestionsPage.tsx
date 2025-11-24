import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Target, CheckCircle, XCircle, RefreshCw,
  Clock, Zap, Trophy, TrendingUp, BarChart, BookOpen,
  Lightbulb, Star, Sparkles, ChevronRight, AlertCircle,
  MessageSquare, Eye, EyeOff, Timer, Activity
} from 'lucide-react';

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  hint?: string;
  detailedSolution?: string;
}

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  averageTime: number;
  questionsAnswered: number;
}

export function AIPracticeQuestionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageTime: 0,
    questionsAnswered: 0
  });
  const [difficulty, setDifficulty] = useState<'adaptive' | 'easy' | 'medium' | 'hard'>('adaptive');

  const topic = searchParams.get('topic') || '';
  const originalDifficulty = searchParams.get('difficulty') || 'medium';

  useEffect(() => {
    generateInitialQuestions();
  }, [topic, difficulty]);

  const generateInitialQuestions = () => {
    setIsLoading(true);
    // Simulate AI generation of practice questions
    setTimeout(() => {
      const generatedQuestions = generateAIPracticeQuestions(topic, difficulty === 'adaptive' ? originalDifficulty : difficulty);
      setQuestions(generatedQuestions);
      setTimePerQuestion(new Array(generatedQuestions.length).fill(0));
      setQuizStats(prev => ({ ...prev, totalQuestions: generatedQuestions.length }));
      setIsLoading(false);
      setQuestionStartTime(Date.now());
    }, 2000);
  };

  const generateAIPracticeQuestions = (topic: string, difficulty: string): PracticeQuestion[] => {
    // Simulate AI-generated questions based on the topic
    const questions: PracticeQuestion[] = [];
    const concepts = extractConcepts(topic);
    
    for (let i = 0; i < 10; i++) {
      const questionDifficulty = difficulty === 'adaptive' 
        ? (i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard'
        : difficulty as 'easy' | 'medium' | 'hard';

      questions.push({
        id: `q-${i + 1}`,
        question: generateQuestionText(topic, concepts[i % concepts.length], questionDifficulty),
        options: generateOptions(topic, i),
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: generateExplanation(topic, concepts[i % concepts.length]),
        difficulty: questionDifficulty,
        concept: concepts[i % concepts.length],
        hint: generateHint(topic, concepts[i % concepts.length]),
        detailedSolution: generateDetailedSolution(topic, concepts[i % concepts.length])
      });
    }
    
    return questions;
  };

  const extractConcepts = (topic: string): string[] => {
    // Extract key concepts from the topic
    const conceptMap: { [key: string]: string[] } = {
      'Geography': ['Climate patterns', 'Geographical features', 'Natural resources', 'Environmental systems'],
      'History': ['Historical events', 'Cause and effect', 'Timeline analysis', 'Cultural impact'],
      'Science': ['Scientific principles', 'Experimental methods', 'Data analysis', 'Theoretical applications'],
      'Mathematics': ['Problem solving', 'Formula application', 'Logical reasoning', 'Pattern recognition'],
      'Economics': ['Economic principles', 'Market analysis', 'Policy implications', 'Statistical interpretation'],
      'Indian Polity': ['Constitutional provisions', 'Governmental processes', 'Legal frameworks', 'Democratic principles'],
      'Current Affairs': ['Recent developments', 'Global perspectives', 'Policy changes', 'Socio-economic impacts']
    };

    // Find matching concepts based on topic
    for (const [key, concepts] of Object.entries(conceptMap)) {
      if (topic.toLowerCase().includes(key.toLowerCase())) {
        return concepts;
      }
    }
    
    return ['Core concepts', 'Applications', 'Analysis', 'Problem solving'];
  };

  const generateQuestionText = (topic: string, concept: string, difficulty: string): string => {
    const templates = {
      easy: [
        `Which of the following best describes ${concept} in the context of ${topic}?`,
        `What is the primary characteristic of ${concept} related to ${topic}?`,
        `In ${topic}, ${concept} refers to:`,
        `Which statement about ${concept} in ${topic} is correct?`
      ],
      medium: [
        `How does ${concept} influence the understanding of ${topic}?`,
        `Analyze the relationship between ${concept} and ${topic}:`,
        `Which factor best explains the role of ${concept} in ${topic}?`,
        `Compare and contrast ${concept} within the framework of ${topic}:`
      ],
      hard: [
        `Evaluate the complex interactions between ${concept} and other aspects of ${topic}:`,
        `Which advanced principle of ${concept} most significantly impacts ${topic}?`,
        `Critically analyze how ${concept} shapes our understanding of ${topic}:`,
        `In the context of ${topic}, how does ${concept} challenge conventional understanding?`
      ]
    };

    const difficultyTemplates = templates[difficulty as keyof typeof templates] || templates.medium;
    return difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
  };

  const generateOptions = (topic: string, index: number): string[] => {
    // Generate plausible options based on the topic
    const optionSets = [
      [
        `A fundamental principle that defines the core of ${topic}`,
        `A secondary factor with limited influence on ${topic}`,
        `An outdated concept no longer relevant to ${topic}`,
        `A controversial theory disputed in ${topic} studies`
      ],
      [
        `Direct correlation with positive outcomes`,
        `Inverse relationship with measurable impact`,
        `No significant relationship established`,
        `Complex interdependence requiring further study`
      ],
      [
        `Primary cause of observed phenomena`,
        `Contributing factor among many`,
        `Negligible influence on outcomes`,
        `Contradictory evidence exists`
      ]
    ];

    return optionSets[index % optionSets.length];
  };

  const generateExplanation = (topic: string, concept: string): string => {
    return `This question tests your understanding of ${concept} within ${topic}. The correct answer demonstrates a comprehensive grasp of how ${concept} operates in this context. Understanding this relationship is crucial for mastering advanced concepts in ${topic}.`;
  };

  const generateHint = (topic: string, concept: string): string => {
    return `Think about how ${concept} specifically relates to ${topic}. Consider the fundamental principles and eliminate options that contradict basic understanding of this relationship.`;
  };

  const generateDetailedSolution = (topic: string, concept: string): string => {
    return `Step 1: Identify the key relationship between ${concept} and ${topic}.
Step 2: Eliminate obviously incorrect options based on fundamental principles.
Step 3: Compare remaining options for accuracy and completeness.
Step 4: Select the option that best captures the essential relationship.
Remember: In ${topic}, ${concept} plays a crucial role that must be understood in context.`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentTime = Date.now();
    const timeSpent = (currentTime - questionStartTime) / 1000;
    const newTimePerQuestion = [...timePerQuestion];
    newTimePerQuestion[currentQuestionIndex] = timeSpent;
    setTimePerQuestion(newTimePerQuestion);

    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    
    setQuizStats(prev => {
      const newStats = { ...prev };
      newStats.questionsAnswered += 1;
      
      if (isCorrect) {
        newStats.correctAnswers += 1;
        newStats.currentStreak += 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
      } else {
        newStats.currentStreak = 0;
      }
      
      const totalTime = newTimePerQuestion.reduce((sum, time) => sum + time, 0);
      newStats.averageTime = totalTime / newStats.questionsAnswered;
      
      return newStats;
    });

    setShowResult(true);
    setShowExplanation(true);

    // Generate additional questions if adaptive mode
    if (difficulty === 'adaptive' && currentQuestionIndex === questions.length - 1) {
      generateMoreQuestions(isCorrect);
    }
  };

  const generateMoreQuestions = (lastCorrect: boolean) => {
    // Adjust difficulty based on performance
    const accuracy = quizStats.correctAnswers / quizStats.questionsAnswered;
    let newDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
    
    if (accuracy > 0.8 && lastCorrect) {
      newDifficulty = 'hard';
    } else if (accuracy < 0.5 && !lastCorrect) {
      newDifficulty = 'easy';
    }

    const newQuestions = generateAIPracticeQuestions(topic, newDifficulty);
    setQuestions(prev => [...prev, ...newQuestions]);
    setTimePerQuestion(prev => [...prev, ...new Array(newQuestions.length).fill(0)]);
    setQuizStats(prev => ({ ...prev, totalQuestions: prev.totalQuestions + newQuestions.length }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else if (difficulty === 'adaptive') {
      // In adaptive mode, questions are already generated
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setShowExplanation(false);
    setQuizStats({
      totalQuestions: questions.length,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      averageTime: 0,
      questionsAnswered: 0
    });
    setTimePerQuestion(new Array(questions.length).fill(0));
    setQuestionStartTime(Date.now());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-full h-full text-brand-primary" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Generating AI Practice Questions</h2>
          <p className="text-gray-600">Tailored to your learning needs...</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const accuracy = quizStats.questionsAnswered > 0 
    ? (quizStats.correctAnswers / quizStats.questionsAnswered) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AI Practice Questions</h1>
                  <p className="text-sm text-gray-600">Topic: {topic}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              >
                <option value="adaptive">Adaptive Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress Card */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity size={20} className="text-brand-primary" />
                Progress
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Question Progress</span>
                    <span className="font-medium">{currentQuestionIndex + 1}/{questions.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-medium">{accuracy.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart size={20} className="text-brand-secondary" />
                Performance Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Correct Answers</span>
                  <span className="font-semibold text-green-600">{quizStats.correctAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-semibold text-orange-600 flex items-center gap-1">
                    {quizStats.currentStreak} <Zap size={14} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Best Streak</span>
                  <span className="font-semibold text-purple-600 flex items-center gap-1">
                    {quizStats.bestStreak} <Trophy size={14} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Time</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    {quizStats.averageTime.toFixed(1)}s <Timer size={14} />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-2">
                <div className={`p-2 rounded-lg ${quizStats.currentStreak >= 3 ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-400'}`}>
                  🔥 3+ Streak
                </div>
                <div className={`p-2 rounded-lg ${accuracy >= 80 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  🎯 80%+ Accuracy
                </div>
                <div className={`p-2 rounded-lg ${quizStats.questionsAnswered >= 10 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>
                  📚 10+ Questions
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Quiz Area */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Question Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentQuestion.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-700'
                        : currentQuestion.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {currentQuestion.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Concept: {currentQuestion.concept}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={showResult}
                    >
                      <Lightbulb size={20} className={showHint ? 'text-yellow-500' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentQuestion.question}
                </h2>
                
                {/* Hint */}
                <AnimatePresence>
                  {showHint && !showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800 flex items-start gap-2">
                        <Lightbulb size={16} className="flex-shrink-0 mt-0.5" />
                        {currentQuestion.hint}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Options */}
              <div className="p-6">
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = showResult && index === currentQuestion.correctAnswer;
                    const isWrong = showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer;
                    const isSelected = index === selectedAnswer;
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : isWrong
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-gray-200 hover:border-brand-secondary'
                        } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                            isCorrect
                              ? 'border-green-500 text-green-700 bg-green-100'
                              : isWrong
                              ? 'border-red-500 text-red-700 bg-red-100'
                              : isSelected
                              ? 'border-brand-primary text-brand-primary bg-brand-primary/10'
                              : 'border-gray-300 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isCorrect && <CheckCircle className="text-green-600" size={20} />}
                          {isWrong && <XCircle className="text-red-600" size={20} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-4"
                    >
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <MessageSquare size={18} />
                          Explanation
                        </h4>
                        <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
                      </div>
                      
                      {currentQuestion.detailedSolution && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <BookOpen size={18} />
                            Detailed Solution
                          </h4>
                          <div className="text-sm text-purple-800 whitespace-pre-line">
                            {currentQuestion.detailedSolution}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between gap-4">
                  {!showResult ? (
                    <motion.button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Answer
                    </motion.button>
                  ) : (
                    <>
                      {currentQuestionIndex < questions.length - 1 || difficulty === 'adaptive' ? (
                        <motion.button
                          onClick={handleNextQuestion}
                          className="flex-1 py-3 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Next Question
                          <ChevronRight size={20} />
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => navigate('/results2')}
                          className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Results
                          <Trophy size={20} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={handleResetQuiz}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RefreshCw size={20} />
                        Reset Quiz
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Learning Tips */}
            <motion.div
              className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" />
                AI Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Active Recall</h4>
                    <p className="text-sm text-gray-600">Try to recall the answer before looking at options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Process of Elimination</h4>
                    <p className="text-sm text-gray-600">Rule out obviously wrong answers first</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Learn from Mistakes</h4>
                    <p className="text-sm text-gray-600">Review explanations carefully for wrong answers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Maintain Streaks</h4>
                    <p className="text-sm text-gray-600">Build momentum with consecutive correct answers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPracticeQuestionsPage;