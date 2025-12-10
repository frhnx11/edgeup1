import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Area, AreaChart, ScatterChart,
  Scatter, ComposedChart
} from 'recharts';
import { 
  Trophy, Brain, Target, TrendingUp, Clock, AlertCircle, 
  CheckCircle, XCircle, Zap, Award, BookOpen, ChevronRight,
  Activity, BarChart3, PieChart as PieChartIcon, Sparkles,
  GraduationCap, Lightbulb, Shield, Flame, Cpu, Atom,
  BrainCircuit, Layers, Orbit, Waves, Volume2, VolumeX,
  Star, Rocket, Bot, Dna, Network, Binary, CircuitBoard,
  Eye, Ear, FileText, Hand, AlertTriangle, TrendingDown,
  GitBranch, Search, Info, ExternalLink, User,
  Fingerprint, Calendar, LineChart as LineChartIcon, Repeat, ArrowRight,
  Puzzle, BookMarked, BrainCog, BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const COLORS = {
  primary: '#094d88',
  secondary: '#10ac8b',
  accent: '#0a7d64',
  dark: '#063456',
  light: '#e6f3ff',
  warning: '#ffd43b',
  success: '#10ac8b',
  error: '#ff6348',
  gradient: ['#094d88', '#10ac8b', '#0a7d64', '#063456'],
  brand: {
    blue: '#094d88',
    teal: '#10ac8b',
    darkTeal: '#0a7d64',
    lightBlue: '#e6f3ff',
    darkBlue: '#063456'
  }
};

const CONFIDENCE_SCORES = {
  not_at_all: 1,
  slightly: 2,
  moderately: 3,
  very: 4,
  extremely: 5
};

// Helper functions for advanced analytics
const analyzeMistakePatterns = (questions, answers) => {
  const patterns = {
    byType: {},
    byTopic: {},
    commonMistakes: [],
    rushPatterns: [],
    conceptualGaps: []
  };

  questions.forEach((q, idx) => {
    if (answers[idx] !== q.correctAnswer) {
      // Track mistake by question type
      const qType = q.type || 'standard';
      patterns.byType[qType] = (patterns.byType[qType] || 0) + 1;
      
      // Track mistake by topic
      const topic = q.topic || q.subject;
      if (!patterns.byTopic[topic]) {
        patterns.byTopic[topic] = { count: 0, questions: [] };
      }
      patterns.byTopic[topic].count++;
      patterns.byTopic[topic].questions.push({
        question: q.question,
        yourAnswer: q.options[answers[idx]],
        correctAnswer: q.options[q.correctAnswer],
        difficulty: q.difficulty
      });
    }
  });

  // Identify common mistake types
  Object.entries(patterns.byType).forEach(([type, count]) => {
    if (count >= 2) {
      patterns.commonMistakes.push({
        type,
        frequency: count,
        recommendation: getRecommendationForType(type)
      });
    }
  });

  return patterns;
};

const calculateVARKProfile = (questions, answers, timePerQuestion = []) => {
  const profile = {
    visual: 0,
    auditory: 0,
    readWrite: 0,
    kinesthetic: 0,
    dominant: '',
    recommendations: []
  };

  // Analyze based on question types and response patterns
  questions.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.correctAnswer;
    const responseTime = timePerQuestion[idx] || 60;
    
    // Visual learners tend to excel with diagrams, charts
    if (q.hasVisual || q.type === 'diagram') {
      profile.visual += isCorrect ? 2 : 0;
    }
    
    // Read/Write learners excel with text-heavy questions
    if (q.type === 'text' || q.question.length > 150) {
      profile.readWrite += isCorrect ? 2 : 0;
    }
    
    // Quick responses might indicate kinesthetic learning
    if (responseTime < 30 && isCorrect) {
      profile.kinesthetic += 1;
    }
    
    // Pattern recognition suggests visual-spatial strength
    if (q.type === 'pattern' && isCorrect) {
      profile.visual += 1;
    }
  });

  // Normalize scores
  const total = Math.max(profile.visual + profile.auditory + profile.readWrite + profile.kinesthetic, 1);
  const scores = {
    visual: (profile.visual / total) * 100,
    auditory: (profile.auditory / total) * 100,
    readWrite: (profile.readWrite / total) * 100,
    kinesthetic: (profile.kinesthetic / total) * 100
  };

  // Find dominant style
  const dominant = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
  profile.dominant = dominant[0];
  profile.scores = scores;

  // Add recommendations based on profile
  profile.recommendations = getVARKRecommendations(profile.dominant);

  return profile;
};

const analyzeTopicErrors = (questions, answers) => {
  const topicAnalysis = {};
  
  questions.forEach((q, idx) => {
    const topic = q.topic || q.subject;
    if (!topicAnalysis[topic]) {
      topicAnalysis[topic] = {
        total: 0,
        correct: 0,
        errors: [],
        concepts: new Set(),
        avgConfidence: 0
      };
    }
    
    topicAnalysis[topic].total++;
    if (answers[idx] === q.correctAnswer) {
      topicAnalysis[topic].correct++;
    } else {
      topicAnalysis[topic].errors.push({
        question: q.question,
        concept: q.concept || 'General',
        difficulty: q.difficulty
      });
      if (q.concept) {
        topicAnalysis[topic].concepts.add(q.concept);
      }
    }
  });
  
  // Convert Set to Array and calculate error rate
  Object.keys(topicAnalysis).forEach(topic => {
    topicAnalysis[topic].concepts = Array.from(topicAnalysis[topic].concepts);
    topicAnalysis[topic].errorRate = 
      ((topicAnalysis[topic].total - topicAnalysis[topic].correct) / topicAnalysis[topic].total) * 100;
    topicAnalysis[topic].mastery = topicAnalysis[topic].errorRate < 20 ? 'Strong' :
                                   topicAnalysis[topic].errorRate < 40 ? 'Moderate' : 'Needs Improvement';
  });
  
  return topicAnalysis;
};

const calculateGrowthMetrics = (questions, answers, confidenceLevels, timePerQuestion = []) => {
  const metrics = {
    learningVelocity: 0,
    consistencyScore: 0,
    adaptabilityIndex: 0,
    strengthProgression: [],
    improvementAreas: [],
    predictedScore: 0
  };
  
  // Calculate learning velocity (improvement over time)
  let correctInFirst = 0, correctInLast = 0;
  const halfPoint = Math.floor(questions.length / 2);
  
  for (let i = 0; i < halfPoint; i++) {
    if (answers[i] === questions[i].correctAnswer) correctInFirst++;
  }
  for (let i = halfPoint; i < questions.length; i++) {
    if (answers[i] === questions[i].correctAnswer) correctInLast++;
  }
  
  metrics.learningVelocity = ((correctInLast - correctInFirst) / halfPoint) * 100;
  
  // Calculate consistency score
  let streaks = [];
  let currentStreak = 0;
  answers.forEach((answer, idx) => {
    if (answer === questions[idx].correctAnswer) {
      currentStreak++;
    } else {
      if (currentStreak > 0) streaks.push(currentStreak);
      currentStreak = 0;
    }
  });
  if (currentStreak > 0) streaks.push(currentStreak);
  
  metrics.consistencyScore = streaks.length > 0 ? 
    (Math.max(...streaks) / questions.length) * 100 : 0;
  
  // Adaptability index (how well student handles difficulty changes)
  let adaptability = 0;
  let lastDifficulty = questions[0]?.difficulty || 'medium';
  questions.forEach((q, idx) => {
    if (q.difficulty !== lastDifficulty) {
      if (answers[idx] === q.correctAnswer) {
        adaptability += 1;
      }
      lastDifficulty = q.difficulty;
    }
  });
  metrics.adaptabilityIndex = (adaptability / questions.length) * 100;
  
  // Predicted future score based on trends
  const trend = metrics.learningVelocity / 100;
  const currentScore = (answers.filter((a, i) => a === questions[i].correctAnswer).length / questions.length) * 100;
  metrics.predictedScore = Math.min(100, currentScore + (currentScore * trend * 0.2));
  
  return metrics;
};

const getRecommendationForType = (type) => {
  const recommendations = {
    'calculation': 'Practice more numerical problems and review formulas',
    'conceptual': 'Focus on understanding core concepts rather than memorization',
    'analytical': 'Work on breaking down complex problems into smaller parts',
    'factual': 'Create flashcards and use spaced repetition for better retention',
    'application': 'Solve more real-world problems to improve practical understanding'
  };
  return recommendations[type] || 'Continue practicing this question type';
};

const getVARKRecommendations = (dominant) => {
  const recommendations = {
    visual: [
      'Use mind maps and diagrams to organize information',
      'Color-code your notes and study materials',
      'Watch educational videos and animations',
      'Create visual summaries of complex topics'
    ],
    auditory: [
      'Record yourself explaining concepts and listen back',
      'Join study groups for discussion',
      'Use mnemonic devices and rhymes',
      'Listen to educational podcasts on the topics'
    ],
    readWrite: [
      'Take detailed notes and rewrite them',
      'Create written summaries of each topic',
      'Practice with written exercises and essays',
      'Use textbooks and written resources primarily'
    ],
    kinesthetic: [
      'Use hands-on experiments and practical examples',
      'Take frequent breaks during study sessions',
      'Walk while reviewing material',
      'Create physical models or use manipulatives'
    ]
  };
  return recommendations[dominant] || recommendations.visual;
};

// Helper functions for generating explanations
const generateExplanation = (question, isCorrect) => {
  // This would ideally use AI to generate context-specific explanations
  const explanations = {
    'calculation': 'This question tests your ability to perform mathematical calculations accurately. Focus on the order of operations and ensure all steps are followed correctly.',
    'conceptual': 'This question evaluates your understanding of fundamental concepts. The correct answer demonstrates proper application of theoretical knowledge.',
    'analytical': 'This requires breaking down the problem into smaller components and analyzing each part systematically to arrive at the correct solution.',
    'factual': 'This tests your knowledge of specific facts and information. Regular review and memorization techniques can help with these types of questions.',
    'application': 'This question requires applying theoretical knowledge to practical scenarios. Understanding real-world implications is key.'
  };
  
  return explanations[question.type] || 'The correct answer demonstrates a comprehensive understanding of the topic and proper application of relevant concepts.';
};

const generateWhyWrong = (question, wrongAnswerIdx) => {
  // Generate specific feedback based on the wrong answer chosen
  const commonMistakes = [
    'This is a common misconception. Review the fundamental concepts to avoid this error.',
    'This answer might seem correct at first glance, but it overlooks a key detail in the question.',
    'This choice represents a partial understanding. Make sure to consider all aspects of the problem.',
    'This is a distractor designed to test careful reading. Always read the question thoroughly.'
  ];
  
  return commonMistakes[wrongAnswerIdx % commonMistakes.length];
};

const generateStudyTip = (question, wasCorrect) => {
  if (wasCorrect) {
    const successTips = [
      'Great work! To maintain this knowledge, review similar problems periodically.',
      'Excellent understanding! Try teaching this concept to someone else to reinforce your knowledge.',
      'Well done! Challenge yourself with more advanced problems on this topic.',
      'Perfect! Create a summary note of this concept for future reference.'
    ];
    return successTips[Math.floor(Math.random() * successTips.length)];
  } else {
    const improvementTips = {
      'easy': 'Start with the basics. Review fundamental concepts and work through simple examples first.',
      'medium': 'Practice more problems at this level. Focus on understanding the process, not just memorizing answers.',
      'hard': 'Break down complex problems into smaller steps. Don\'t hesitate to review prerequisite topics.'
    };
    return improvementTips[question.difficulty] || 'Regular practice and concept review will help improve your performance.';
  }
};

// Custom 3D-like circular progress component
const CircularProgress3D = ({ percentage, size = 200, strokeWidth = 20 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.primary} />
            <stop offset="50%" stopColor={COLORS.secondary} />
            <stop offset="100%" stopColor={COLORS.accent} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {percentage.toFixed(0)}%
          </motion.div>
          <motion.div 
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Score
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Holographic card component
const HolographicCard = ({ children, className = "", delay = 0 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(9, 77, 136, 0.1) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(230, 243, 255, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(9, 77, 136, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

// Animated skill bar component
const SkillBar = ({ skill, percentage, color, delay = 0 }) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{skill}</span>
        <span className="text-sm font-bold text-gray-600">{percentage}%</span>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            boxShadow: `0 0 20px ${color}66`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animation: 'shimmer 2s linear infinite',
            animationDelay: `${delay + 1}s`
          }}
        />
      </div>
    </motion.div>
  );
};

// Particle background component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light via-white to-gray-50" />
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function Results2Page() {
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showExplanation, setShowExplanation] = useState({});
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('testData');
    if (data) {
      setTestData(JSON.parse(data));
      setTimeout(() => {
        setAnimationComplete(true);
        // Trigger confetti for high scores
        const parsedData = JSON.parse(data);
        const score = calculateScore(parsedData);
        if (score >= 80) {
          triggerConfetti();
        }
      }, 500);
    }
  }, []);

  const calculateScore = (data) => {
    const { answers, questions } = data;
    const correctAnswers = answers.reduce((acc, answer, idx) => 
      answer === questions[idx].correctAnswer ? acc + 1 : acc, 0
    );
    return (correctAnswers / questions.length) * 100;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [COLORS.primary, COLORS.secondary, COLORS.accent]
    });
  };

  const analytics = useMemo(() => {
    if (!testData) return null;

    const { answers, confidenceLevels, questions, timeUsed, timePerQuestion = [] } = testData;
    
    // Calculate scores
    const correctAnswers = answers.reduce((acc, answer, idx) => 
      answer === questions[idx].correctAnswer ? acc + 1 : acc, 0
    );
    const score = (correctAnswers / questions.length) * 100;

    // Subject-wise analysis
    const subjectAnalysis = {};
    questions.forEach((q, idx) => {
      if (!subjectAnalysis[q.subject]) {
        subjectAnalysis[q.subject] = { correct: 0, total: 0, time: 0, confidence: [] };
      }
      subjectAnalysis[q.subject].total++;
      if (answers[idx] === q.correctAnswer) {
        subjectAnalysis[q.subject].correct++;
      }
      subjectAnalysis[q.subject].confidence.push(CONFIDENCE_SCORES[confidenceLevels[idx]] || 3);
    });

    // Difficulty analysis
    const difficultyAnalysis = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    questions.forEach((q, idx) => {
      difficultyAnalysis[q.difficulty].total++;
      if (answers[idx] === q.correctAnswer) {
        difficultyAnalysis[q.difficulty].correct++;
      }
    });

    // Confidence vs Accuracy
    const confidenceAccuracy = questions.map((q, idx) => ({
      question: idx + 1,
      confidence: CONFIDENCE_SCORES[confidenceLevels[idx]] || 0,
      correct: answers[idx] === q.correctAnswer,
      subject: q.subject
    }));

    // Time per question (estimated)
    const avgTimePerQuestion = timeUsed / questions.length;

    // Performance metrics
    const accuracy = correctAnswers / questions.length;
    const avgConfidence = confidenceLevels.reduce((acc, level) => 
      acc + (CONFIDENCE_SCORES[level] || 3), 0) / questions.length;
    const efficiency = accuracy * (1800 - timeUsed) / 1800; // Factor in time saved

    // Mistake Pattern Analysis
    const mistakePatterns = analyzeMistakePatterns(questions, answers);
    
    // VARK Learning Style Assessment
    const varkAssessment = calculateVARKProfile(questions, answers, timePerQuestion);
    
    // Topic-wise error analysis
    const topicErrorAnalysis = analyzeTopicErrors(questions, answers);
    
    // Growth tracking metrics
    const growthMetrics = calculateGrowthMetrics(questions, answers, confidenceLevels, timePerQuestion);

    return {
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeUsed,
      subjectAnalysis,
      difficultyAnalysis,
      confidenceAccuracy,
      avgTimePerQuestion,
      accuracy,
      avgConfidence,
      efficiency,
      questions,
      answers,
      confidenceLevels,
      mistakePatterns,
      varkAssessment,
      topicErrorAnalysis,
      growthMetrics
    };
  }, [testData]);

  const toggleNarration = () => {
    if (!isNarrating && analytics) {
      const text = `Your test score is ${analytics.score.toFixed(0)} percent. You answered ${analytics.correctAnswers} out of ${analytics.totalQuestions} questions correctly.`;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
    } else {
      speechSynthesis.cancel();
      setIsNarrating(false);
    }
  };

  if (!testData || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-24 h-24 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Atom size={96} className="text-brand-primary" />
          </motion.div>
          <p className="text-gray-600 text-lg">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  const subjectRadarData = Object.entries(analytics.subjectAnalysis).map(([subject, data]) => ({
    subject,
    score: (data.correct / data.total) * 100,
    confidence: (data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length) * 20
  }));

  const difficultyData = Object.entries(analytics.difficultyAnalysis).map(([level, data]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: (data.correct / data.total) * 100,
    total: data.total
  }));

  const performanceOverTime = analytics.questions.map((_, idx) => {
    const correctSoFar = analytics.answers.slice(0, idx + 1).reduce((acc, answer, i) => 
      answer === analytics.questions[i].correctAnswer ? acc + 1 : acc, 0
    );
    return {
      question: idx + 1,
      performance: (correctSoFar / (idx + 1)) * 100
    };
  });

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Outstanding', color: COLORS.success, icon: Trophy };
    if (score >= 80) return { level: 'Excellent', color: COLORS.primary, icon: Award };
    if (score >= 70) return { level: 'Good', color: COLORS.secondary, icon: Target };
    if (score >= 60) return { level: 'Average', color: COLORS.warning, icon: BookOpen };
    return { level: 'Needs Improvement', color: COLORS.error, icon: AlertCircle };
  };

  const performance = getPerformanceLevel(analytics.score);

  const getInsights = () => {
    const insights = [];
    
    // Subject performance insights
    const subjectScores = Object.entries(analytics.subjectAnalysis).map(([subject, data]) => ({
      subject,
      score: (data.correct / data.total) * 100
    }));
    const bestSubject = subjectScores.reduce((a, b) => a.score > b.score ? a : b);
    const worstSubject = subjectScores.reduce((a, b) => a.score < b.score ? a : b);
    
    insights.push({
      type: 'strength',
      title: 'Subject Mastery',
      description: `You excel in ${bestSubject.subject} with ${bestSubject.score.toFixed(0)}% accuracy`,
      icon: Shield
    });
    
    if (worstSubject.score < 70) {
      insights.push({
        type: 'improvement',
        title: 'Focus Area',
        description: `${worstSubject.subject} needs attention (${worstSubject.score.toFixed(0)}% accuracy)`,
        icon: Target
      });
    }
    
    // Confidence insights
    if (analytics.avgConfidence > 4 && analytics.accuracy > 0.8) {
      insights.push({
        type: 'strength',
        title: 'Confident & Accurate',
        description: 'Your high confidence aligns well with your performance',
        icon: Flame
      });
    } else if (analytics.avgConfidence < 3 && analytics.accuracy > 0.7) {
      insights.push({
        type: 'insight',
        title: 'Hidden Potential',
        description: 'You perform better than you think - boost your confidence!',
        icon: Lightbulb
      });
    }
    
    // Time management
    if (analytics.avgTimePerQuestion < 120) {
      insights.push({
        type: 'strength',
        title: 'Quick Thinker',
        description: `Average ${Math.round(analytics.avgTimePerQuestion)}s per question shows excellent speed`,
        icon: Zap
      });
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {showParticles && <ParticleBackground />}
      
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-brand-secondary rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.img 
              src="/Logo.png" 
              alt="EdgeUp" 
              className="h-12 object-contain"
              whileHover={{ scale: 1.05 }}
            />
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleNarration}
                className="p-2 rounded-lg bg-brand-primary/10 backdrop-blur-sm hover:bg-brand-primary/20 transition-colors border border-brand-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isNarrating ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              <motion.button
                onClick={() => setShowParticles(!showParticles)}
                className="p-2 rounded-lg bg-brand-primary/10 backdrop-blur-sm hover:bg-brand-primary/20 transition-colors border border-brand-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={20} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg hover:from-brand-secondary hover:to-brand-accent transition-all shadow-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Back to Dashboard</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Score Display */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-brand-primary">
            Performance Analysis
          </h1>
          <p className="text-xl text-gray-600">AI-Powered Insights & Recommendations</p>
        </motion.div>

        {/* Score Card */}
        <HolographicCard className="p-8 mb-8" delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="text-center lg:text-left">
              <motion.div 
                className="flex items-center gap-3 justify-center lg:justify-start mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <performance.icon size={32} style={{ color: performance.color }} />
                <span className="text-3xl font-bold" style={{ color: performance.color }}>
                  {performance.level}
                </span>
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Bot size={20} className="text-brand-primary" />
                  <span>AI Assessment Complete</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BrainCircuit size={20} className="text-brand-secondary" />
                  <span>Neural Analysis Ready</span>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center">
              <CircularProgress3D percentage={analytics.score} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, label: 'Correct', value: analytics.correctAnswers, color: COLORS.success },
                { icon: Clock, label: 'Time', value: `${Math.floor(analytics.timeUsed / 60)}:${String(analytics.timeUsed % 60).padStart(2, '0')}`, color: COLORS.primary },
                { icon: Brain, label: 'Confidence', value: `${(analytics.avgConfidence * 20).toFixed(0)}%`, color: COLORS.secondary },
                { icon: Zap, label: 'Efficiency', value: `${(analytics.efficiency * 100).toFixed(0)}%`, color: COLORS.accent }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border border-brand-primary/20 shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} className="mx-auto mb-2" />
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </HolographicCard>

        {/* Futuristic Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'subject', label: 'Subjects', icon: Atom },
            { id: 'patterns', label: 'Patterns', icon: GitBranch },
            { id: 'vark', label: 'VARK Profile', icon: Fingerprint },
            { id: 'questions', label: 'Questions', icon: CircuitBoard },
            { id: 'growth', label: 'Growth', icon: TrendingUp },
            { id: 'insights', label: 'AI Insights', icon: BrainCircuit }
          ].map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                  : 'bg-white backdrop-blur-sm text-gray-600 hover:bg-brand-light border border-brand-primary/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon size={20} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Performance Trend */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-brand-primary" />
                  Performance Trajectory
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceOverTime}>
                    <defs>
                      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="question" stroke="rgba(0,0,0,0.5)" />
                    <YAxis domain={[0, 100]} stroke="rgba(0,0,0,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stroke={COLORS.primary}
                      fillOpacity={1} 
                      fill="url(#performanceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </HolographicCard>

              {/* 3D Pie Chart */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChartIcon size={20} className="text-brand-secondary" />
                  Difficulty Mastery
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {difficultyData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </HolographicCard>

              {/* Neural Network Visualization */}
              <HolographicCard className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Network size={20} className="text-brand-accent" />
                  Confidence Neural Map
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="confidence" 
                      name="Confidence" 
                      stroke="rgba(0,0,0,0.5)"
                      domain={[0, 5]}
                    />
                    <YAxis 
                      dataKey={(data) => data.correct ? 1 : 0} 
                      name="Accuracy" 
                      stroke="rgba(0,0,0,0.5)"
                      domain={[0, 1]}
                      ticks={[0, 1]}
                      tickFormatter={(value) => value === 1 ? 'Correct' : 'Incorrect'}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter 
                      name="Questions" 
                      data={analytics.confidenceAccuracy} 
                      fill={COLORS.secondary}
                    >
                      {analytics.confidenceAccuracy.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.correct ? COLORS.success : COLORS.error} 
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'subject' && (
            <motion.div
              key="subject"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Radar Chart */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Orbit size={20} className="text-brand-primary" />
                  Subject Mastery Radar
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={subjectRadarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.1)" />
                    <PolarAngleAxis dataKey="subject" stroke="rgba(0,0,0,0.5)" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(0,0,0,0.3)" />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary} 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Confidence" 
                      dataKey="confidence" 
                      stroke={COLORS.secondary} 
                      fill={COLORS.secondary} 
                      fillOpacity={0.3} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </HolographicCard>

              {/* Subject Skills */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Binary size={20} className="text-brand-secondary" />
                  Subject Performance Matrix
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.subjectAnalysis).map(([subject, data], idx) => {
                    const percentage = (data.correct / data.total) * 100;
                    const colors = COLORS.gradient;
                    
                    return (
                      <SkillBar
                        key={subject}
                        skill={subject}
                        percentage={Math.round(percentage)}
                        color={colors[idx % colors.length]}
                        delay={idx * 0.1}
                      />
                    );
                  })}
                </div>
              </HolographicCard>

              {/* Performance Heatmap */}
              <HolographicCard className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Waves size={20} className="text-brand-accent" />
                  Performance Wave Analysis
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={subjectRadarData}>
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      fill="url(#waveGradient)" 
                      stroke={COLORS.accent}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke={COLORS.secondary} 
                      strokeWidth={2}
                      dot={{ fill: COLORS.secondary, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CircuitBoard size={20} className="text-brand-primary" />
                  Detailed Question Analysis
                </h3>
                <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                  {analytics.questions.map((question, idx) => {
                    const isCorrect = analytics.answers[idx] === question.correctAnswer;
                    const confidence = analytics.confidenceLevels[idx];
                    const isExpanded = showExplanation[idx];
                    
                    return (
                      <motion.div 
                        key={idx} 
                        className={`border rounded-xl ${
                          isCorrect 
                            ? 'border-green-200 bg-gradient-to-r from-green-50 to-white' 
                            : 'border-red-200 bg-gradient-to-r from-red-50 to-white'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="font-mono text-sm font-bold text-gray-700">Q{String(idx + 1).padStart(2, '0')}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                  {question.subject}
                                </span>
                                {question.topic && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
                                    {question.topic}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                  question.difficulty === 'easy' 
                                    ? 'bg-green-100 text-green-700 border-green-300'
                                    : question.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                    : 'bg-red-100 text-red-700 border-red-300'
                                }`}>
                                  {question.difficulty}
                                </span>
                                {isCorrect ? (
                                  <CheckCircle size={18} className="text-green-600" />
                                ) : (
                                  <XCircle size={18} className="text-red-600" />
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-800 font-medium mb-4">{question.question}</p>
                              
                              {/* Answer Options */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                {question.options.map((option, optIdx) => {
                                  const isYourAnswer = analytics.answers[idx] === optIdx;
                                  const isCorrectOption = question.correctAnswer === optIdx;
                                  
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded-lg border text-sm ${
                                        isCorrectOption
                                          ? 'border-green-400 bg-green-100 text-green-800'
                                          : isYourAnswer && !isCorrectOption
                                          ? 'border-red-400 bg-red-100 text-red-800'
                                          : 'border-gray-200 bg-gray-50 text-gray-600'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs">{String.fromCharCode(65 + optIdx)}.</span>
                                        <span>{option}</span>
                                        {isYourAnswer && !isCorrectOption && (
                                          <XCircle size={14} className="text-red-600 ml-auto" />
                                        )}
                                        {isCorrectOption && (
                                          <CheckCircle size={14} className="text-green-600 ml-auto" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Confidence Level */}
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600">Confidence:</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                      <div
                                        key={level}
                                        className={`w-2 h-2 rounded-full ${
                                          level <= CONFIDENCE_SCORES[confidence]
                                            ? 'bg-brand-secondary'
                                            : 'bg-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-600 ml-1">{confidence || 'Not specified'}</span>
                                </div>
                                
                                {/* Time spent if available */}
                                {testData.timePerQuestion && testData.timePerQuestion[idx] && (
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-500" />
                                    <span className="text-xs text-gray-600">
                                      {Math.round(testData.timePerQuestion[idx])}s
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2 flex-wrap">
                                <motion.button
                                  onClick={() => setShowExplanation(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Info size={14} />
                                  {isExpanded ? 'Hide' : 'Show'} Explanation
                                </motion.button>
                                
                                <motion.button
                                  onClick={() => {
                                    // Navigate to AI Learning page with the question topic
                                    navigate(`/ai-concept-learning?topic=${encodeURIComponent(question.topic || question.subject)}&question=${encodeURIComponent(question.question)}`);
                                  }}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-secondary/10 text-brand-secondary rounded-lg hover:bg-brand-secondary/20 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <BookOpen size={14} />
                                  Learn More
                                </motion.button>
                                
                                {!isCorrect && (
                                  <motion.button
                                    onClick={() => {
                                      // Navigate to practice page with similar questions
                                      navigate(`/ai-practice-questions?topic=${encodeURIComponent(question.topic || question.subject)}&difficulty=${question.difficulty}`);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-accent/10 text-brand-accent rounded-lg hover:bg-brand-accent/20 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Target size={14} />
                                    Practice Similar
                                  </motion.button>
                                )}
                              </div>
                              
                              {/* Explanation Section */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-4 p-4 bg-white/80 rounded-lg border border-brand-primary/20">
                                      <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                        <Lightbulb size={16} className="text-brand-secondary" />
                                        Detailed Explanation
                                      </h5>
                                      
                                      {/* Why the correct answer is correct */}
                                      <div className="mb-3">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium">Why this answer is correct: </span>
                                          {question.explanation || generateExplanation(question, true)}
                                        </p>
                                      </div>
                                      
                                      {/* Why your answer was wrong (if applicable) */}
                                      {!isCorrect && analytics.answers[idx] !== null && (
                                        <div className="mb-3">
                                          <p className="text-sm text-gray-700">
                                            <span className="font-medium text-red-700">Why your answer was incorrect: </span>
                                            {generateWhyWrong(question, analytics.answers[idx])}
                                          </p>
                                        </div>
                                      )}
                                      
                                      {/* Key concepts */}
                                      {question.concepts && question.concepts.length > 0 && (
                                        <div className="mt-3">
                                          <p className="text-sm font-medium text-gray-700 mb-1">Key Concepts:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {question.concepts.map((concept, cIdx) => (
                                              <span
                                                key={cIdx}
                                                className="text-xs px-2 py-1 bg-brand-light text-brand-primary rounded-full border border-brand-primary/20"
                                              >
                                                {concept}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Study tip */}
                                      <div className="mt-3 p-3 bg-brand-light rounded-lg">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium">💡 Study Tip: </span>
                                          {generateStudyTip(question, isCorrect)}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* AI Insights */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-brand-secondary" />
                  Neural Analysis Insights
                </h3>
                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <motion.div 
                      key={idx} 
                      className={`border rounded-xl p-4 ${
                        insight.type === 'strength' 
                          ? 'border-green-200 bg-green-50' 
                          : insight.type === 'improvement' 
                          ? 'border-yellow-200 bg-yellow-50' 
                          : 'border-blue-200 bg-blue-50'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3">
                        <insight.icon size={20} className={
                          insight.type === 'strength' ? 'text-green-600' :
                          insight.type === 'improvement' ? 'text-yellow-600' :
                          'text-blue-600'
                        } />
                        <div>
                          <h4 className="font-medium text-gray-800">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </HolographicCard>

              {/* Recommendations */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Rocket size={20} className="text-brand-accent" />
                  Quantum Learning Path
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.subjectAnalysis)
                    .filter(([_, data]) => (data.correct / data.total) < 0.7)
                    .map(([subject, data], idx) => (
                      <motion.div 
                        key={subject} 
                        className="border border-brand-primary/20 rounded-xl p-4 bg-brand-light"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-medium text-gray-800 mb-2">
                          <Dna size={16} className="inline mr-2 text-brand-secondary" />
                          Enhance {subject}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Neural pathways need strengthening in {subject.toLowerCase()} concepts
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Current: {((data.correct / data.total) * 100).toFixed(0)}%
                          </div>
                          <motion.button 
                            className="text-sm font-medium text-brand-primary hover:text-brand-secondary flex items-center gap-1"
                            whileHover={{ x: 5 }}
                          >
                            Activate Training
                            <ChevronRight size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  
                  <motion.div 
                    className="border-t border-gray-200 pt-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Star size={16} className="text-yellow-600" />
                      Achievement Unlocked
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Trophy, label: 'Quick Thinker', unlocked: analytics.avgTimePerQuestion < 120 },
                        { icon: Brain, label: 'Confidence Master', unlocked: analytics.avgConfidence > 4 },
                        { icon: Zap, label: 'Efficiency Expert', unlocked: analytics.efficiency > 0.8 },
                        { icon: Target, label: 'Accuracy Pro', unlocked: analytics.accuracy > 0.8 }
                      ].map((achievement, idx) => (
                        <motion.div
                          key={achievement.label}
                          className={`p-3 rounded-lg border text-center ${
                            achievement.unlocked
                              ? 'border-yellow-200 bg-yellow-50'
                              : 'border-gray-300 bg-gray-100 opacity-50'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                        >
                          <achievement.icon 
                            size={24} 
                            className={`mx-auto mb-1 ${
                              achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                            }`} 
                          />
                          <p className="text-xs text-gray-600">{achievement.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </HolographicCard>

              {/* Future Learning Path */}
              <HolographicCard className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Atom size={20} className="text-brand-primary" />
                  Quantum Learning Timeline
                </h3>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary to-brand-secondary"></div>
                  {[
                    { 
                      week: 'Week 1-2', 
                      title: 'Neural Foundation', 
                      desc: 'Establish quantum learning pathways',
                      icon: Brain,
                      color: COLORS.primary
                    },
                    { 
                      week: 'Week 3-4', 
                      title: 'Synaptic Enhancement', 
                      desc: 'Accelerate neural processing speed',
                      icon: Zap,
                      color: COLORS.secondary
                    },
                    { 
                      week: 'Week 5-6', 
                      title: 'Mastery Protocol', 
                      desc: 'Achieve quantum comprehension',
                      icon: Star,
                      color: COLORS.accent
                    }
                  ].map((phase, idx) => (
                    <motion.div
                      key={phase.week}
                      className="relative flex items-center gap-4 mb-6"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center z-10"
                        style={{ 
                          background: `linear-gradient(135deg, ${phase.color}33, ${phase.color}66)`,
                          border: `2px solid ${phase.color}`
                        }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <phase.icon size={24} style={{ color: phase.color }} />
                      </motion.div>
                      <div className="flex-1 p-4 rounded-xl bg-white shadow-sm border border-brand-primary/20">
                        <div className="text-sm text-gray-600 mb-1">{phase.week}</div>
                        <h4 className="font-medium text-gray-800">{phase.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{phase.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'patterns' && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Mistake Patterns Analysis */}
              <HolographicCard className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-brand-primary" />
                  Mistake Pattern Recognition
                </h3>
                
                {/* Common Mistakes */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Repeat size={18} className="text-brand-secondary" />
                    Recurring Error Types
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.mistakePatterns.commonMistakes.map((mistake, idx) => (
                      <motion.div
                        key={idx}
                        className="border border-red-200 bg-red-50 rounded-xl p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-800 capitalize">{mistake.type}</h5>
                          <span className="text-red-600 font-bold">{mistake.frequency}x</span>
                        </div>
                        <p className="text-sm text-gray-600">{mistake.recommendation}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Topic-wise Errors */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BookMarked size={18} className="text-brand-accent" />
                    Topic-wise Error Analysis
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(analytics.topicErrorAnalysis)
                      .filter(([_, data]) => data.errorRate > 0)
                      .sort((a, b) => b[1].errorRate - a[1].errorRate)
                      .map(([topic, data], idx) => (
                        <motion.div
                          key={topic}
                          className="border rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-800">{topic}</h5>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                data.mastery === 'Strong' ? 'bg-green-100 text-green-700' :
                                data.mastery === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {data.mastery}
                              </span>
                              <span className="text-sm text-gray-600">
                                {data.errorRate.toFixed(0)}% error rate
                              </span>
                            </div>
                          </div>
                          {data.concepts.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-600">Weak concepts: </span>
                              <span className="text-sm font-medium text-gray-700">
                                {data.concepts.join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="mt-3">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-red-400 to-red-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${data.errorRate}%` }}
                                transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'vark' && (
            <motion.div
              key="vark"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* VARK Profile */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-brand-primary" />
                  Your VARK Learning Profile
                </h3>
                
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-brand-primary mb-2">
                      {analytics.varkAssessment.dominant.charAt(0).toUpperCase() + 
                       analytics.varkAssessment.dominant.slice(1)} Learner
                    </div>
                    <p className="text-gray-600">Your dominant learning style</p>
                  </div>
                  
                  {/* VARK Scores Visualization */}
                  <div className="space-y-3">
                    {[
                      { type: 'Visual', icon: Eye, score: analytics.varkAssessment.scores.visual },
                      { type: 'Auditory', icon: Ear, score: analytics.varkAssessment.scores.auditory },
                      { type: 'Read/Write', icon: FileText, score: analytics.varkAssessment.scores.readWrite },
                      { type: 'Kinesthetic', icon: Hand, score: analytics.varkAssessment.scores.kinesthetic }
                    ].map((style, idx) => (
                      <div key={style.type} className="flex items-center gap-3">
                        <style.icon size={20} className="text-brand-secondary" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{style.type}</span>
                            <span className="text-sm font-bold text-gray-600">
                              {style.score.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                              initial={{ width: 0 }}
                              animate={{ width: `${style.score}%` }}
                              transition={{ delay: idx * 0.1, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* VARK Radar Chart */}
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={[
                    { ability: 'Visual', score: analytics.varkAssessment.scores.visual },
                    { ability: 'Auditory', score: analytics.varkAssessment.scores.auditory },
                    { ability: 'Read/Write', score: analytics.varkAssessment.scores.readWrite },
                    { ability: 'Kinesthetic', score: analytics.varkAssessment.scores.kinesthetic }
                  ]}>
                    <PolarGrid stroke="rgba(0,0,0,0.1)" />
                    <PolarAngleAxis dataKey="ability" stroke="rgba(0,0,0,0.5)" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(0,0,0,0.3)" />
                    <Radar 
                      name="Learning Style" 
                      dataKey="score" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary} 
                      fillOpacity={0.3} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </HolographicCard>

              {/* VARK Recommendations */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb size={20} className="text-brand-secondary" />
                  Personalized Learning Strategies
                </h3>
                
                <div className="space-y-3">
                  {analytics.varkAssessment.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-brand-light border border-brand-primary/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-brand-primary">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl border border-brand-primary/20">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <BrainCog size={18} className="text-brand-primary" />
                    Study Technique Compatibility
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Mind Maps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Flashcards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analytics.varkAssessment.dominant === 'auditory' ? 
                        <CheckCircle size={16} className="text-green-600" /> :
                        <XCircle size={16} className="text-gray-400" />
                      }
                      <span>Group Study</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analytics.varkAssessment.dominant === 'kinesthetic' ? 
                        <CheckCircle size={16} className="text-green-600" /> :
                        <XCircle size={16} className="text-gray-400" />
                      }
                      <span>Lab Work</span>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          )}

          {activeTab === 'growth' && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Growth Metrics */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-brand-primary" />
                  Learning Growth Metrics
                </h3>
                
                <div className="space-y-4">
                  {/* Learning Velocity */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-blue-600" />
                        <span className="font-medium text-gray-800">Learning Velocity</span>
                      </div>
                      <span className={`text-2xl font-bold ${
                        analytics.growthMetrics.learningVelocity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {analytics.growthMetrics.learningVelocity > 0 ? '+' : ''}
                        {analytics.growthMetrics.learningVelocity.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {analytics.growthMetrics.learningVelocity > 0 
                        ? 'You improved as the test progressed!'
                        : 'Performance declined during the test'}
                    </p>
                  </div>
                  
                  {/* Consistency Score */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BarChart2 size={18} className="text-green-600" />
                        <span className="font-medium text-gray-800">Consistency Score</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {analytics.growthMetrics.consistencyScore.toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Measures answer streak patterns
                    </p>
                  </div>
                  
                  {/* Adaptability Index */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Puzzle size={18} className="text-purple-600" />
                        <span className="font-medium text-gray-800">Adaptability Index</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">
                        {analytics.growthMetrics.adaptabilityIndex.toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      How well you handle difficulty changes
                    </p>
                  </div>
                </div>
              </HolographicCard>

              {/* Predicted Performance */}
              <HolographicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LineChartIcon size={20} className="text-brand-secondary" />
                  Performance Projection
                </h3>
                
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                    {analytics.growthMetrics.predictedScore.toFixed(0)}%
                  </div>
                  <p className="text-gray-600 mt-2">Predicted next test score</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your learning velocity and patterns
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Current Score</span>
                    <span className="font-bold text-gray-800">{analytics.score.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-brand-light">
                    <span className="text-sm text-gray-600">Projected Improvement</span>
                    <span className="font-bold text-brand-primary">
                      +{(analytics.growthMetrics.predictedScore - analytics.score).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Star size={18} className="text-yellow-600" />
                    Growth Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {analytics.growthMetrics.learningVelocity < 0 && (
                      <li>• Take breaks to maintain focus throughout tests</li>
                    )}
                    {analytics.growthMetrics.consistencyScore < 50 && (
                      <li>• Build confidence to maintain answer streaks</li>
                    )}
                    {analytics.growthMetrics.adaptabilityIndex < 50 && (
                      <li>• Practice with mixed difficulty questions</li>
                    )}
                    <li>• Continue with current study strategies</li>
                  </ul>
                </div>
              </HolographicCard>

              {/* Time Analysis */}
              <HolographicCard className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-brand-accent" />
                  Temporal Performance Analysis
                </h3>
                
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={performanceOverTime}>
                    <defs>
                      <linearGradient id="performanceGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="question" label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Performance %', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stroke={COLORS.primary}
                      fillOpacity={1} 
                      fill="url(#performanceGradient2)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke={COLORS.secondary} 
                      strokeWidth={2}
                      dot={{ fill: COLORS.secondary, r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </HolographicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default Results2Page;