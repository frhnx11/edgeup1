import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Clock, CheckCircle, XCircle, AlertCircle,
  BarChart2, TrendingUp, Download, Share2, RefreshCw,
  BookOpen, ChevronLeft, ChevronRight, Filter, Search,
  Eye, EyeOff, Bookmark, FileText, PieChart, Award,
  Brain, Zap, Timer, Users, Lightbulb, MessageSquare,
  Activity, ArrowUp, ArrowDown, Info, Star, Medal,
  Flame, Shield, Sparkles, Hash, Gauge, LineChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer?: number;
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  isMarked?: boolean;
  timeSpent?: number;
}

interface TestResult {
  testId: string;
  title: string;
  questions: Question[];
  score: number;
  totalScore: number;
  timeSpent: number;
  submittedAt: string;
  accuracy: number;
  rank?: number;
  percentile?: number;
}

interface AnalysisData {
  topicWisePerformance: { topic: string; correct: number; total: number; percentage: number; avgTime: number }[];
  difficultyWisePerformance: { difficulty: string; correct: number; total: number; avgTime: number; expectedScore: number }[];
  timeAnalysis: { 
    avgTimePerQuestion: number; 
    fastestQuestion: number; 
    slowestQuestion: number;
    timeDistribution: { range: string; count: number }[];
    optimalTime: number;
  };
  comparisonData: { category: string; userScore: number; avgScore: number; topScore: number }[];
  strengthsWeaknesses: {
    strengths: { topic: string; score: number; improvement: number }[];
    weaknesses: { topic: string; score: number; suggestion: string }[];
  };
  peerComparison: {
    percentile: number;
    totalStudents: number;
    scoreDistribution: { range: string; count: number; isUser?: boolean }[];
  };
  insights: {
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    icon: any;
  }[];
}

interface QuestionMetrics {
  questionId: string;
  topic: string;
  difficulty: string;
  timeSpent: number;
  isCorrect: boolean;
  avgPeerTime: number;
  successRate: number;
  concepts: string[];
}

export function TestResultsPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);
  const [showOnlyMarked, setShowOnlyMarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [selectedAnalysisView, setSelectedAnalysisView] = useState<'overview' | 'detailed' | 'comparative'>('overview');
  const [showInsights, setShowInsights] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'time' | 'difficulty'>('accuracy');
  const [showQuestionMetrics, setShowQuestionMetrics] = useState(false);

  useEffect(() => {
    // Load test result from localStorage
    const savedResult = localStorage.getItem('testResult');
    if (savedResult) {
      const result = JSON.parse(savedResult);
      
      // Add mock correct answers and explanations
      const questionsWithAnswers = result.questions.map((q: any, index: number) => ({
        ...q,
        correctAnswer: Math.floor(Math.random() * 4), // Mock correct answer
        explanation: generateMockExplanation(q.questionNumber),
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
        topic: generateMockTopic(index)
      }));

      // Calculate score
      const correctAnswers = questionsWithAnswers.filter((q: Question) => 
        q.selectedAnswer === q.correctAnswer
      ).length;
      const totalQuestions = questionsWithAnswers.length;
      const score = correctAnswers;
      const totalScore = totalQuestions;
      const accuracy = (correctAnswers / totalQuestions) * 100;

      setTestResult({
        testId: result.testId,
        title: result.title,
        questions: questionsWithAnswers,
        score,
        totalScore,
        timeSpent: result.timeSpent,
        submittedAt: result.submittedAt,
        accuracy,
        rank: Math.floor(Math.random() * 1000) + 1,
        percentile: Math.floor(Math.random() * 30) + 70
      });
    }
  }, [testId]);

  const generateMockExplanation = (questionNumber: number): string => {
    const explanations = [
      'This is based on Article 21 of the Indian Constitution which guarantees the Right to Life and Personal Liberty.',
      'The correct answer follows from the principle of separation of powers as established in the Kesavananda Bharati case.',
      'This concept is derived from the Economic Survey 2023-24 and relates to fiscal consolidation measures.',
      'According to the NCERT textbook, this historical event occurred during the reign of Akbar in 1576.',
      'This geographical phenomenon is caused by the differential heating of land and water bodies.'
    ];
    return explanations[questionNumber % explanations.length];
  };

  const generateMockTopic = (index: number): string => {
    const topics = ['Indian Polity', 'Ancient History', 'Geography', 'Economy', 'Current Affairs', 'Science & Tech'];
    return topics[index % topics.length];
  };

  const getAnalysisData = (): AnalysisData => {
    if (!testResult) return {
      topicWisePerformance: [],
      difficultyWisePerformance: [],
      timeAnalysis: { 
        avgTimePerQuestion: 0, 
        fastestQuestion: 0, 
        slowestQuestion: 0,
        timeDistribution: [],
        optimalTime: 0
      },
      comparisonData: [],
      strengthsWeaknesses: { strengths: [], weaknesses: [] },
      peerComparison: { percentile: 0, totalStudents: 0, scoreDistribution: [] },
      insights: []
    };

    // Enhanced Topic-wise performance with time analysis
    const topicMap = new Map<string, { correct: number; total: number; totalTime: number }>();
    testResult.questions.forEach(q => {
      if (!topicMap.has(q.topic)) {
        topicMap.set(q.topic, { correct: 0, total: 0, totalTime: 0 });
      }
      const stats = topicMap.get(q.topic)!;
      stats.total++;
      stats.totalTime += q.timeSpent || 0;
      if (q.selectedAnswer === q.correctAnswer) {
        stats.correct++;
      }
    });

    const topicWisePerformance = Array.from(topicMap.entries()).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: (stats.correct / stats.total) * 100,
      avgTime: Math.round(stats.totalTime / stats.total)
    })).sort((a, b) => b.percentage - a.percentage);

    // Enhanced Difficulty-wise performance
    const difficultyMap = new Map<string, { correct: number; total: number; totalTime: number }>();
    const difficultyExpected = { easy: 90, medium: 70, hard: 50 };
    
    testResult.questions.forEach(q => {
      if (!difficultyMap.has(q.difficulty)) {
        difficultyMap.set(q.difficulty, { correct: 0, total: 0, totalTime: 0 });
      }
      const stats = difficultyMap.get(q.difficulty)!;
      stats.total++;
      stats.totalTime += q.timeSpent || 0;
      if (q.selectedAnswer === q.correctAnswer) {
        stats.correct++;
      }
    });

    const difficultyWisePerformance = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
      difficulty,
      correct: stats.correct,
      total: stats.total,
      avgTime: Math.round(stats.totalTime / stats.total),
      expectedScore: difficultyExpected[difficulty as keyof typeof difficultyExpected] || 70
    }));

    // Enhanced Time analysis with distribution
    const questionTimes = testResult.questions.map(q => q.timeSpent || 0).filter(t => t > 0);
    const timeRanges = [
      { range: '0-30s', min: 0, max: 30, count: 0 },
      { range: '31-60s', min: 31, max: 60, count: 0 },
      { range: '61-90s', min: 61, max: 90, count: 0 },
      { range: '91-120s', min: 91, max: 120, count: 0 },
      { range: '>120s', min: 121, max: Infinity, count: 0 }
    ];
    
    questionTimes.forEach(time => {
      const range = timeRanges.find(r => time >= r.min && time <= r.max);
      if (range) range.count++;
    });

    const timeAnalysis = {
      avgTimePerQuestion: questionTimes.length > 0 ? Math.round(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length) : 0,
      fastestQuestion: Math.min(...questionTimes),
      slowestQuestion: Math.max(...questionTimes),
      timeDistribution: timeRanges.map(r => ({ range: r.range, count: r.count })),
      optimalTime: 60 // seconds
    };

    // Strengths and Weaknesses
    const strengthsWeaknesses = {
      strengths: topicWisePerformance
        .filter(t => t.percentage >= 80)
        .slice(0, 3)
        .map(t => ({
          topic: t.topic,
          score: t.percentage,
          improvement: Math.round(Math.random() * 20) + 5
        })),
      weaknesses: topicWisePerformance
        .filter(t => t.percentage < 60)
        .slice(-3)
        .map(t => ({
          topic: t.topic,
          score: t.percentage,
          suggestion: getSuggestion(t.topic, t.percentage)
        }))
    };

    // Peer Comparison
    const peerComparison = {
      percentile: testResult.percentile || 75,
      totalStudents: 15234,
      scoreDistribution: [
        { range: '0-20%', count: 523 },
        { range: '21-40%', count: 2134 },
        { range: '41-60%', count: 4567 },
        { range: '61-80%', count: 5432, isUser: testResult.accuracy >= 61 && testResult.accuracy <= 80 },
        { range: '81-100%', count: 2578, isUser: testResult.accuracy > 80 }
      ]
    };

    // Enhanced Comparison data
    const comparisonData = [
      { category: 'Your Score', userScore: testResult.accuracy, avgScore: 0, topScore: 0 },
      { category: 'Batch Average', userScore: 0, avgScore: 65, topScore: 92 },
      { category: 'Top 10%', userScore: 0, avgScore: 85, topScore: 98 },
      { category: 'National Average', userScore: 0, avgScore: 58, topScore: 100 }
    ];

    // Generate insights
    const insights = generateInsights(testResult, topicWisePerformance, timeAnalysis);

    return {
      topicWisePerformance,
      difficultyWisePerformance,
      timeAnalysis,
      comparisonData,
      strengthsWeaknesses,
      peerComparison,
      insights
    };
  };

  const getSuggestion = (topic: string, score: number): string => {
    const suggestions = {
      'Indian Polity': 'Focus on Constitutional amendments and recent Supreme Court judgments',
      'History': 'Practice more map-based questions and chronological events',
      'Geography': 'Revise physical geography concepts and current environmental issues',
      'Economy': 'Study recent economic surveys and budget highlights',
      'Science & Tech': 'Keep updated with latest technological developments',
      'Current Affairs': 'Read daily newspapers and monthly compilations'
    };
    return suggestions[topic] || 'Practice more questions from this topic';
  };

  const generateInsights = (result: TestResult, topics: any[], timeData: any): any[] => {
    const insights = [];
    
    if (result.accuracy >= 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Performance!',
        description: 'You scored in the top 20% of all test takers',
        icon: Trophy
      });
    }
    
    if (timeData.avgTimePerQuestion < 45) {
      insights.push({
        type: 'warning',
        title: 'Fast Solver',
        description: 'You\'re answering quickly. Ensure you\'re reading questions carefully',
        icon: Zap
      });
    }
    
    const weakTopics = topics.filter(t => t.percentage < 50);
    if (weakTopics.length > 0) {
      insights.push({
        type: 'info',
        title: 'Focus Areas Identified',
        description: `Improve in: ${weakTopics.map(t => t.topic).join(', ')}`,
        icon: Target
      });
    }
    
    return insights;
  };

  const filteredQuestions = testResult?.questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchesWrong = !showOnlyWrong || q.selectedAnswer !== q.correctAnswer;
    const matchesMarked = !showOnlyMarked || q.isMarked;
    
    return matchesSearch && matchesTopic && matchesWrong && matchesMarked;
  }) || [];

  const topics = Array.from(new Set(testResult?.questions.map(q => q.topic) || []));
  const analysisData = getAnalysisData();

  if (!testResult) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Loading test results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header with Animated Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-8 text-white overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-accent rounded-full filter blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold mb-2 flex items-center gap-3"
                >
                  Test Results
                  {testResult.accuracy >= 80 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                    >
                      <Medal className="w-10 h-10 text-yellow-300" />
                    </motion.div>
                  )}
                </motion.h1>
                <p className="opacity-90 text-lg">{testResult.title}</p>
                <p className="text-sm opacity-80 mt-1">
                  Submitted on {new Date(testResult.submittedAt).toLocaleString()}
                </p>
              </div>
              <motion.div
                animate={{ rotate: testResult.accuracy >= 80 ? 360 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Trophy className="w-20 h-20 text-yellow-300" />
              </motion.div>
            </div>

            {/* Enhanced Score Overview with Animations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Target,
                  label: 'Score',
                  value: `${testResult.score}/${testResult.totalScore}`,
                  subtext: `${testResult.accuracy.toFixed(1)}% Accuracy`,
                  color: testResult.accuracy >= 80 ? 'from-green-400 to-emerald-400' : 
                         testResult.accuracy >= 60 ? 'from-yellow-400 to-amber-400' : 
                         'from-red-400 to-pink-400',
                  delay: 0.3
                },
                {
                  icon: Trophy,
                  label: 'Rank',
                  value: `#${testResult.rank}`,
                  subtext: `Out of ${analysisData.peerComparison.totalStudents.toLocaleString()}`,
                  color: 'from-purple-400 to-indigo-400',
                  delay: 0.4
                },
                {
                  icon: Gauge,
                  label: 'Percentile',
                  value: `${testResult.percentile}%`,
                  subtext: `Top ${100 - testResult.percentile}%`,
                  color: 'from-blue-400 to-cyan-400',
                  delay: 0.5
                },
                {
                  icon: Timer,
                  label: 'Speed',
                  value: `${analysisData.timeAnalysis.avgTimePerQuestion}s`,
                  subtext: 'Avg per question',
                  color: 'from-orange-400 to-red-400',
                  delay: 0.6
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20" 
                       style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color})` }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <stat.icon className="w-5 h-5" />
                      <p className="text-sm font-medium">{stat.label}</p>
                    </div>
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: "spring" }}
                      className="text-3xl font-bold"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm opacity-80 mt-1">{stat.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Insights Section */}
        {showInsights && analysisData.insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {analysisData.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  insight.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'success' ? 'bg-green-100' :
                    insight.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-90">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/test-suite')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Test
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <Download className="w-5 h-5 text-gray-700" />
            Download Detailed Report
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
            Share Results
          </motion.button>
          
          <div className="ml-auto flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {(['overview', 'detailed', 'comparative'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedAnalysisView(view)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedAnalysisView === view
                    ? 'bg-white shadow-sm text-brand-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Performance Analysis with Multiple Views */}
        {showAnalysis && (
          <AnimatePresence mode="wait">
            {selectedAnalysisView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Your Strengths
                    </h3>
                    <div className="space-y-3">
                      {analysisData.strengthsWeaknesses.strengths.map((strength, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-900">{strength.topic}</span>
                            <span className="text-sm text-green-700">
                              {strength.score.toFixed(0)}% 
                              <ArrowUp className="w-3 h-3 inline ml-1" />
                              {strength.improvement}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${strength.score}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-600" />
                      Areas to Improve
                    </h3>
                    <div className="space-y-3">
                      {analysisData.strengthsWeaknesses.weaknesses.map((weakness, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-red-900">{weakness.topic}</span>
                            <span className="text-sm text-red-700">{weakness.score.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${weakness.score}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-red-400 to-pink-500"
                            />
                          </div>
                          <p className="text-xs text-red-700 flex items-start gap-1">
                            <Lightbulb className="w-3 h-3 mt-0.5" />
                            {weakness.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Time Distribution and Peer Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Distribution</h3>
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: analysisData.timeAnalysis.timeDistribution.map(t => t.range),
                          datasets: [{
                            label: 'Questions',
                            data: analysisData.timeAnalysis.timeDistribution.map(t => t.count),
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.8)',
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(251, 146, 60, 0.8)',
                              'rgba(239, 68, 68, 0.8)',
                              'rgba(168, 85, 247, 0.8)'
                            ],
                            borderRadius: 8
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => `${context.parsed.y} questions`
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 5
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span>Optimal: {analysisData.timeAnalysis.optimalTime}s/question</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-600" />
                        <span>Your Avg: {analysisData.timeAnalysis.avgTimePerQuestion}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                    <div className="h-64">
                      <Doughnut
                        data={{
                          labels: analysisData.peerComparison.scoreDistribution.map(s => s.range),
                          datasets: [{
                            data: analysisData.peerComparison.scoreDistribution.map(s => s.count),
                            backgroundColor: analysisData.peerComparison.scoreDistribution.map(s => 
                              s.isUser ? 'rgba(99, 102, 241, 0.8)' : 'rgba(229, 231, 235, 0.8)'
                            ),
                            borderColor: analysisData.peerComparison.scoreDistribution.map(s => 
                              s.isUser ? 'rgb(99, 102, 241)' : 'rgb(229, 231, 235)'
                            ),
                            borderWidth: 2
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 15,
                                font: { size: 11 }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || '';
                                  const value = context.parsed || 0;
                                  const isUser = analysisData.peerComparison.scoreDistribution[context.dataIndex]?.isUser;
                                  return `${label}: ${value} students${isUser ? ' (You)' : ''}`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedAnalysisView === 'detailed' && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Detailed Topic Analysis */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Topic Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Topic</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Questions</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Correct</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Accuracy</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Time</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.topicWisePerformance.map((topic, index) => (
                          <motion.tr
                            key={topic.topic}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium">{topic.topic}</td>
                            <td className="text-center py-3 px-4">{topic.total}</td>
                            <td className="text-center py-3 px-4">{topic.correct}</td>
                            <td className="text-center py-3 px-4">
                              <span className={`font-medium ${
                                topic.percentage >= 80 ? 'text-green-600' :
                                topic.percentage >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {topic.percentage.toFixed(0)}%
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">{topic.avgTime}s</td>
                            <td className="py-3 px-4">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${topic.percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className={`h-full ${
                                    topic.percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                    topic.percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                                    'bg-gradient-to-r from-red-400 to-pink-500'
                                  }`}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Difficulty vs Performance Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty vs Performance</h3>
                    <div className="h-64">
                      <Radar
                        data={{
                          labels: ['Easy', 'Medium', 'Hard'],
                          datasets: [
                            {
                              label: 'Your Performance',
                              data: analysisData.difficultyWisePerformance.map(d => 
                                (d.correct / d.total) * 100
                              ),
                              borderColor: 'rgb(99, 102, 241)',
                              backgroundColor: 'rgba(99, 102, 241, 0.2)',
                              pointBackgroundColor: 'rgb(99, 102, 241)',
                              pointBorderColor: '#fff',
                              pointHoverBackgroundColor: '#fff',
                              pointHoverBorderColor: 'rgb(99, 102, 241)'
                            },
                            {
                              label: 'Expected Performance',
                              data: analysisData.difficultyWisePerformance.map(d => d.expectedScore),
                              borderColor: 'rgb(156, 163, 175)',
                              backgroundColor: 'rgba(156, 163, 175, 0.1)',
                              pointBackgroundColor: 'rgb(156, 163, 175)',
                              pointBorderColor: '#fff',
                              pointHoverBackgroundColor: '#fff',
                              pointHoverBorderColor: 'rgb(156, 163, 175)'
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          },
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                stepSize: 20
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Time vs Accuracy</h3>
                    <div className="h-64">
                      <Line
                        data={{
                          labels: analysisData.topicWisePerformance.map(t => t.topic),
                          datasets: [
                            {
                              label: 'Accuracy %',
                              data: analysisData.topicWisePerformance.map(t => t.percentage),
                              borderColor: 'rgb(99, 102, 241)',
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              yAxisID: 'y',
                              tension: 0.3
                            },
                            {
                              label: 'Avg Time (s)',
                              data: analysisData.topicWisePerformance.map(t => t.avgTime),
                              borderColor: 'rgb(251, 146, 60)',
                              backgroundColor: 'rgba(251, 146, 60, 0.1)',
                              yAxisID: 'y1',
                              tension: 0.3
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: 'index',
                            intersect: false
                          },
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          },
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              title: {
                                display: true,
                                text: 'Accuracy %'
                              }
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              title: {
                                display: true,
                                text: 'Time (seconds)'
                              },
                              grid: {
                                drawOnChartArea: false
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedAnalysisView === 'comparative' && (
              <motion.div
                key="comparative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Comparative Analysis */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: analysisData.comparisonData.map(c => c.category),
                        datasets: [
                          {
                            label: 'Score %',
                            data: analysisData.comparisonData.map(c => c.userScore || c.avgScore),
                            backgroundColor: analysisData.comparisonData.map(c => 
                              c.userScore > 0 ? 'rgba(99, 102, 241, 0.8)' : 'rgba(156, 163, 175, 0.8)'
                            ),
                            borderRadius: 8
                          },
                          {
                            label: 'Top Score %',
                            data: analysisData.comparisonData.map(c => c.topScore),
                            backgroundColor: 'rgba(34, 197, 94, 0.3)',
                            borderColor: 'rgb(34, 197, 94)',
                            borderWidth: 2,
                            type: 'line' as const,
                            tension: 0.3
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              stepSize: 20,
                              callback: (value) => `${value}%`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Percentile Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-purple-900">Your Percentile</h4>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-purple-900 mb-2">
                        {analysisData.peerComparison.percentile}
                        <span className="text-2xl">th</span>
                      </p>
                      <p className="text-sm text-purple-700">
                        Better than {analysisData.peerComparison.percentile}% of {analysisData.peerComparison.totalStudents.toLocaleString()} students
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-green-900">Rank Range</h4>
                      <Hash className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-900 mb-2">
                        {Math.round((100 - analysisData.peerComparison.percentile) / 100 * analysisData.peerComparison.totalStudents).toLocaleString()}
                        -
                        {Math.round((100 - analysisData.peerComparison.percentile + 5) / 100 * analysisData.peerComparison.totalStudents).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700">Estimated rank range</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900">Improvement</h4>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-900 mb-2">
                        +{Math.round(Math.random() * 20 + 5)}%
                      </p>
                      <p className="text-sm text-blue-700">From last attempt</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Solutions Section */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Filters */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="all">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowOnlyWrong(!showOnlyWrong)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOnlyWrong 
                      ? 'bg-red-100 text-red-700 border border-red-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Wrong Only
                </button>
                
                <button
                  onClick={() => setShowOnlyMarked(!showOnlyMarked)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOnlyMarked 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Marked Only
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1} of {filteredQuestions.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(filteredQuestions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === filteredQuestions.length - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Content */}
            {filteredQuestions[currentQuestion] && (
              <div className="space-y-6">
                {/* Question Header */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filteredQuestions[currentQuestion].selectedAnswer === filteredQuestions[currentQuestion].correctAnswer
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {filteredQuestions[currentQuestion].selectedAnswer === filteredQuestions[currentQuestion].correctAnswer
                      ? 'Correct'
                      : 'Incorrect'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {filteredQuestions[currentQuestion].topic}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    filteredQuestions[currentQuestion].difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    filteredQuestions[currentQuestion].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {filteredQuestions[currentQuestion].difficulty}
                  </span>
                  {filteredQuestions[currentQuestion].isMarked && (
                    <Bookmark className="w-4 h-4 text-yellow-500" />
                  )}
                </div>

                {/* Question */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {filteredQuestions[currentQuestion].question}
                  </h4>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    {filteredQuestions[currentQuestion].options.map((option, index) => {
                      const isSelected = filteredQuestions[currentQuestion].selectedAnswer === index;
                      const isCorrect = filteredQuestions[currentQuestion].correctAnswer === index;
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrect ? 'border-green-500 bg-green-50' :
                            isSelected ? 'border-red-500 bg-red-50' :
                            'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCorrect ? 'bg-green-500 text-white' :
                              isSelected ? 'bg-red-500 text-white' :
                              'bg-gray-200 text-gray-600'
                            }`}>
                              {isCorrect ? <CheckCircle className="w-4 h-4" /> :
                               isSelected ? <XCircle className="w-4 h-4" /> :
                               String.fromCharCode(65 + index)}
                            </div>
                            <span className={`flex-1 ${
                              isCorrect ? 'text-green-700 font-medium' :
                              isSelected ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {option}
                            </span>
                            {isSelected && !isCorrect && (
                              <span className="text-xs text-red-600">Your Answer</span>
                            )}
                            {isCorrect && (
                              <span className="text-xs text-green-600">Correct Answer</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Explanation
                  </h5>
                  <p className="text-blue-800">{filteredQuestions[currentQuestion].explanation}</p>
                </div>

                {/* Time Spent */}
                {filteredQuestions[currentQuestion].timeSpent && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Time spent: {filteredQuestions[currentQuestion].timeSpent} seconds
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}