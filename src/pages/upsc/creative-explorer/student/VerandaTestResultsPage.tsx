import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Clock, Target, TrendingUp, BarChart3, 
  CheckCircle, XCircle, AlertCircle, BookmarkCheck,
  ArrowRight, RotateCcw, Download, Share2, Home,
  Award, Star, Zap, Brain
} from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';

interface TestResult {
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  answered: number;
  marked: number;
  timeSpent: number;
  percentage: number;
}

interface QuestionAnalysis {
  questionNumber: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function VerandaTestResultsPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [results, setResults] = useState<TestResult | null>(null);
  const [showQuestionAnalysis, setShowQuestionAnalysis] = useState(false);
  const [currentAnalysisQuestion, setCurrentAnalysisQuestion] = useState(0);
  const [questionAnalysis] = useState<QuestionAnalysis[]>([
    {
      questionNumber: 1,
      question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. What is the sum?",
      yourAnswer: "Rs. 698",
      correctAnswer: "Rs. 698", 
      isCorrect: true,
      timeSpent: 45,
      difficulty: 'medium'
    },
    {
      questionNumber: 2,
      question: "If the cost price is 96% of the selling price, then what is the profit percent?",
      yourAnswer: "4.17%",
      correctAnswer: "4.17%",
      isCorrect: true,
      timeSpent: 32,
      difficulty: 'easy'
    },
    {
      questionNumber: 3,
      question: "What is the compound interest on Rs. 2500 for 2 years at 4% per annum?",
      yourAnswer: "Rs. 200",
      correctAnswer: "Rs. 204",
      isCorrect: false,
      timeSpent: 67,
      difficulty: 'hard'
    }
  ]);

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Mock results for demo
      setResults({
        testId: testId || '1',
        title: 'SBI PO Prelims - Mock Test 1',
        score: 78,
        totalQuestions: 100,
        answered: 95,
        marked: 12,
        timeSpent: 3420, // 57 minutes
        percentage: 78
      });
    }
  }, [testId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  const handleRetakeTest = () => {
    navigate('/veranda-test-suite');
  };

  if (!results) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Test results not found</p>
            <button
              onClick={() => navigate('/veranda-test-suite')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4"
            >
              <Trophy className="w-12 h-12 text-yellow-300" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Test Completed!</h1>
            <p className="text-lg opacity-90">{results.title}</p>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <div className="text-6xl font-bold mb-2">{results.percentage}%</div>
              <div className="text-xl opacity-90">
                {results.score} out of {results.totalQuestions} correct
              </div>
              <div className={`text-2xl font-bold mt-2 ${getPerformanceColor(results.percentage)}`}>
                Grade: {getPerformanceGrade(results.percentage)}
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center bg-white/10 rounded-xl p-4"
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <div className="text-2xl font-bold">{results.answered}</div>
              <div className="text-sm opacity-80">Answered</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center bg-white/10 rounded-xl p-4"
            >
              <BookmarkCheck className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <div className="text-2xl font-bold">{results.marked}</div>
              <div className="text-sm opacity-80">Marked</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center bg-white/10 rounded-xl p-4"
            >
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
              <div className="text-sm opacity-80">Time Taken</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center bg-white/10 rounded-xl p-4"
            >
              <Target className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <div className="text-2xl font-bold">{Math.round((results.timeSpent / results.answered) / 60)}m</div>
              <div className="text-sm opacity-80">Avg per Q</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Performance Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accuracy */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3"
                    strokeDasharray={`${results.percentage}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600">{results.percentage}%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Accuracy</h3>
              <p className="text-sm text-gray-600">Overall performance</p>
            </div>

            {/* Speed */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Speed</h3>
              <p className="text-sm text-gray-600">
                {Math.round((results.timeSpent / results.answered) / 60)}m per question
              </p>
            </div>

            {/* Efficiency */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Efficiency</h3>
              <p className="text-sm text-gray-600">
                {Math.round((results.answered / results.totalQuestions) * 100)}% completion
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" />
              AI Recommendations
            </h3>
            <div className="space-y-2 text-sm text-purple-800">
              {results.percentage >= 80 ? (
                <p>🎉 Excellent performance! Focus on maintaining consistency across all subjects.</p>
              ) : results.percentage >= 60 ? (
                <p>📈 Good attempt! Work on time management and review marked questions.</p>
              ) : (
                <p>📚 Need improvement. Focus on concept clarity and practice more mock tests.</p>
              )}
              <p>💡 Spend more time on questions you marked for review.</p>
              <p>⏱️ Try to improve your speed while maintaining accuracy.</p>
            </div>
          </div>
        </motion.div>

        {/* Question Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Question Analysis
            </h2>
            <button
              onClick={() => setShowQuestionAnalysis(!showQuestionAnalysis)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              {showQuestionAnalysis ? 'Hide' : 'Show'} Analysis
            </button>
          </div>

          {showQuestionAnalysis && (
            <div className="space-y-4">
              {questionAnalysis.map((qa, index) => (
                <motion.div
                  key={qa.questionNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    qa.isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        qa.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {qa.isCorrect ? '✓' : '✗'}
                      </div>
                      <span className="font-medium">Question {qa.questionNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        qa.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        qa.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {qa.difficulty}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{qa.timeSpent}s</span>
                  </div>
                  
                  <p className="text-gray-900 mb-3">{qa.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Your Answer: </span>
                      <span className={qa.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {qa.yourAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Correct Answer: </span>
                      <span className="text-green-600">{qa.correctAnswer}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={handleRetakeTest}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Test
          </button>
          
          <button
            onClick={() => navigate('/veranda-test-suite')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            More Tests
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
            <Download className="w-5 h-5" />
            Download Report
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}