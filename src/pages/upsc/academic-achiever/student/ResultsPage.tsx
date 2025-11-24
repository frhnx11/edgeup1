import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultsLoadingTransition } from '../../../../components/upsc/common/ResultsLoadingTransition';
import { LessonPlanGenerationTransition } from '../../../../components/upsc/common/LessonPlanGenerationTransition';
import {
  Brain, Clock, Target, Award, TrendingUp, Sparkles,
  Eye, Headphones, BookOpen, HandMetal, Zap, Star,
  ChevronRight, Download, Share2, Trophy, Hexagon,
  Activity, BarChart3, Lightbulb, Gauge, Layers,
  AlertTriangle, CheckCircle2, Info, TrendingDown,
  Users, Percent, Timer, BrainCircuit, Shield,
  BarChart2, PieChart, FileBarChart, GitBranch,
  Fingerprint, Repeat, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useGameStore } from '../../../../store/useGameStore';
import { RewardPopup } from '../../../../components/upsc/common/GameElements';
import { usePASCOTracking } from '../../../../hooks/usePASCOTracking';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Radar, Doughnut, Bar, PolarArea } from 'react-chartjs-2';
import confetti from 'canvas-confetti';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VARKProfile {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
}

interface Question {
  correct: number;
  section: string;
  difficulty?: string;
  topic?: string;
  timeSpent?: number;
}

interface PerformanceMetrics {
  overallScore: number;
  timeManagement: number;
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
}

interface AnalyticsData {
  mistakePatterns: {
    byType: Record<string, number>;
    byTopic: Record<string, { count: number; questions: any[] }>;
    commonMistakes: any[];
  };
  timeAnalysis: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
    rushingIndicator: boolean;
    optimalTimeUsage: number;
  };
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  comparativeAnalysis: {
    percentile: number;
    averageScore: number;
    yourRank: number;
    totalParticipants: number;
  };
}

type ConfidenceLevel = 'not_at_all' | 'slightly' | 'moderately' | 'very' | 'extremely' | null;

export function ResultsPage() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [showLessonPlanLoading, setShowLessonPlanLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const [score, setScore] = useState(0);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [pascoMetrics, setPascoMetrics] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showReward, setShowReward] = useState<{ xp: number; coins: number; message: string } | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedVarkStyle, setSelectedVarkStyle] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const { addXP, addCoins } = useGameStore();
  const { trackTestCompletion } = usePASCOTracking();
  const scoreRef = useRef<HTMLDivElement>(null);
  
  const [varkProfile, setVarkProfile] = useState<VARKProfile>({
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0
  });

  const varkIcons = {
    visual: Eye,
    auditory: Headphones,
    reading: BookOpen,
    kinesthetic: HandMetal
  };

  const varkColors = {
    visual: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
    auditory: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
    reading: { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600' },
    kinesthetic: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600' }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        scalar: 1.2,
        shapes: ['star', 'circle', 'square'],
        colors: ['#094d88', '#10ac8b', '#FFD700', '#FF69B4', '#00CED1']
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setTimeout(() => {
      setShowInsights(true);
      if (score >= 80) {
        triggerConfetti();
      }
    }, 500);
  };

  const handleLessonPlanClick = () => {
    setShowLessonPlanLoading(true);
    localStorage.setItem('varkProfile', JSON.stringify(varkProfile));
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const confidenceValueMap = {
    'not_at_all': 0,
    'slightly': 0.25,
    'moderately': 0.5,
    'very': 0.75,
    'extremely': 1
  };

  // Advanced Analytics Functions
  const analyzeTimeManagement = (questions: any[], answers: any[], timeUsed: number) => {
    const totalQuestions = questions.length;
    const averageTimePerQuestion = timeUsed / totalQuestions;
    const expectedTimePerQuestion = 1800 / totalQuestions; // 30 minutes total
    
    // Calculate time efficiency
    const timeEfficiency = Math.min(100, (expectedTimePerQuestion / averageTimePerQuestion) * 100);
    
    // Check for rushing patterns
    const rushingIndicator = averageTimePerQuestion < expectedTimePerQuestion * 0.5;
    
    // Calculate optimal time usage
    const optimalTimeUsage = Math.max(0, Math.min(100, 100 - Math.abs(timeEfficiency - 100)));
    
    return {
      averageTimePerQuestion,
      fastestQuestion: Math.min(...questions.map((q, i) => q.timeSpent || averageTimePerQuestion)),
      slowestQuestion: Math.max(...questions.map((q, i) => q.timeSpent || averageTimePerQuestion)),
      rushingIndicator,
      optimalTimeUsage,
      timeEfficiency
    };
  };

  const analyzeMistakePatterns = (questions: any[], answers: any[], confidence: ConfidenceLevel[]) => {
    const patterns = {
      byType: {} as Record<string, number>,
      byTopic: {} as Record<string, { count: number; questions: any[] }>,
      commonMistakes: [] as any[],
      confidenceMisalignment: [] as any[]
    };

    questions.forEach((q, idx) => {
      if (answers[idx] !== q.correct) {
        // Track by question type
        const qType = q.type || 'standard';
        patterns.byType[qType] = (patterns.byType[qType] || 0) + 1;
        
        // Track by topic
        const topic = q.topic || q.section;
        if (!patterns.byTopic[topic]) {
          patterns.byTopic[topic] = { count: 0, questions: [] };
        }
        patterns.byTopic[topic].count++;
        patterns.byTopic[topic].questions.push({
          question: q.question,
          yourAnswer: answers[idx],
          correctAnswer: q.correct,
          confidence: confidence[idx]
        });
        
        // Check confidence misalignment
        if (confidence[idx] === 'very' || confidence[idx] === 'extremely') {
          patterns.confidenceMisalignment.push({
            question: q.question,
            confidence: confidence[idx],
            topic: topic
          });
        }
      }
    });

    // Identify common mistake patterns
    Object.entries(patterns.byType).forEach(([type, count]) => {
      if (count >= 2) {
        patterns.commonMistakes.push({
          type,
          frequency: count,
          percentage: (count / questions.length) * 100
        });
      }
    });

    return patterns;
  };

  const calculatePerformanceMetrics = (score: number, timeData: any, consistency: number) => {
    return {
      overallScore: score,
      timeManagement: timeData.optimalTimeUsage,
      accuracy: score,
      speed: timeData.timeEfficiency,
      consistency: consistency,
      improvement: Math.random() * 20 + 5 // Simulated improvement potential
    };
  };

  const generateStrengthsWeaknessesAnalysis = (
    pascoMetrics: any,
    subjectPerformance: any[],
    mistakePatterns: any
  ) => {
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // Analyze PASCO strengths
    Object.entries(pascoMetrics.skillScores).forEach(([skill, score]) => {
      if (score as number >= 80) {
        strengths.push(`Strong ${skill.replace(/([A-Z])/g, ' $1').trim()}`);
      } else if (score as number < 60) {
        weaknesses.push(`${skill.replace(/([A-Z])/g, ' $1').trim()} needs improvement`);
        recommendations.push(`Practice ${skill.toLowerCase()} exercises daily`);
      }
    });

    // Analyze subject strengths
    subjectPerformance.forEach(subject => {
      if (subject.accuracy >= 80) {
        strengths.push(`Excellent grasp of ${subject.subject}`);
      } else if (subject.accuracy < 60) {
        weaknesses.push(`${subject.subject} requires more attention`);
        recommendations.push(`Review ${subject.subject} fundamentals`);
      }
    });

    // Add recommendations based on mistake patterns
    if (mistakePatterns.rushingIndicator) {
      recommendations.push('Slow down and read questions more carefully');
    }
    if (mistakePatterns.confidenceMisalignment.length > 2) {
      recommendations.push('Work on calibrating your confidence levels');
    }

    return { strengths, weaknesses, recommendations };
  };

  const generateComparativeAnalysis = (score: number) => {
    // Simulated comparative data
    const totalParticipants = 10000;
    const percentile = Math.min(99, Math.max(1, 
      Math.round((score / 100) * 85 + Math.random() * 15)
    ));
    const yourRank = Math.round(totalParticipants * (1 - percentile / 100));
    const averageScore = 65 + Math.random() * 10;

    return {
      percentile,
      averageScore,
      yourRank,
      totalParticipants
    };
  };

  const calculateSkillScore = (question: Question | undefined, answer: number | null, confidence: ConfidenceLevel) => {
    if (!question || answer === null) return 0;
    
    const isCorrect = answer === question.correct;
    const confidenceValue = confidence ? confidenceValueMap[confidence] : 0.5;
    return isCorrect ? (100 * (0.7 + 0.3 * confidenceValue)) : (100 * (0.3 * (1 - confidenceValue)));
  };

  const calculateConfidenceAlignment = (answers: (number | null)[], confidence: ConfidenceLevel[], questions: Question[]) => {
    let alignmentScore = 0;
    let validResponses = 0;

    answers.forEach((answer, index) => {
      if (answer !== null && confidence[index] && questions[index]) {
        validResponses++;
        const isCorrect = answer === questions[index].correct;
        const confidenceValue = confidenceValueMap[confidence[index]];
        const alignment = isCorrect ? confidenceValue : (1 - confidenceValue);
        alignmentScore += alignment;
      }
    });

    return validResponses > 0 ? (alignmentScore / validResponses) * 100 : 0;
  };

  useEffect(() => {
    const data = localStorage.getItem('testData');
    if (!data) {
      navigate('/test');
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      setTestData(parsedData);
      
      if (!Array.isArray(parsedData.questions) || !Array.isArray(parsedData.answers)) {
        throw new Error('Invalid test data format');
      }

      const correctAnswers = parsedData.answers.filter(
        (answer: number | null, index: number) =>
          answer !== null &&
          parsedData.questions[index] &&
          answer === parsedData.questions[index].correct
      ).length;

      const calculatedScore = (correctAnswers / parsedData.questions.length) * 100;
      setScore(calculatedScore);

      // Track test completion in PASCO engine
      trackTestCompletion(correctAnswers, parsedData.questions.length);

      // Animate score
      const duration = 2000;
      const steps = 60;
      const increment = calculatedScore / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        if (currentStep < steps) {
          setAnimatedScore(prev => Math.min(prev + increment, calculatedScore));
          currentStep++;
        } else {
          clearInterval(timer);
          setAnimatedScore(calculatedScore);
        }
      }, duration / steps);

      // Calculate rewards based on performance
      const xpReward = Math.round(calculatedScore * 10);
      const coinReward = Math.round(calculatedScore * 5);
      
      // Add rewards
      addXP(xpReward);
      addCoins(coinReward);
      
      // Show reward popup
      setShowReward({
        xp: xpReward,
        coins: coinReward,
        message: `You scored ${Math.round(calculatedScore)}% on the test!`
      });

      // Calculate VARK profile
      const varkQuestions = parsedData.questions.slice(0, 4);
      const varkAnswers = parsedData.answers.slice(0, 4);
      
      const varkScores = {
        visual: 0,
        auditory: 0,
        reading: 0,
        kinesthetic: 0
      };

      varkAnswers.forEach((answer: number | null, index: number) => {
        if (answer === null) return;
        if (answer === 0) varkScores.visual += 25;
        else if (answer === 1) varkScores.auditory += 25;
        else if (answer === 2) varkScores.reading += 25;
        else if (answer === 3) varkScores.kinesthetic += 25;
      });

      setVarkProfile(varkScores);

      // PASCO Analysis
      const pascoQuestions = parsedData.questions.slice(4, 11);
      const pascoAnswers = parsedData.answers.slice(4, 11);
      const pascoConfidence = parsedData.confidenceLevels.slice(4, 11);

      const skillScores = {
        logicalReasoning: calculateSkillScore(pascoQuestions[0], pascoAnswers[0], pascoConfidence[0]),
        analyticalAbility: calculateSkillScore(pascoQuestions[1], pascoAnswers[1], pascoConfidence[1]),
        memory: calculateSkillScore(pascoQuestions[2], pascoAnswers[2], pascoConfidence[2]),
        spatialAbility: calculateSkillScore(pascoQuestions[3], pascoAnswers[3], pascoConfidence[3]),
        decisionMaking: calculateSkillScore(pascoQuestions[4], pascoAnswers[4], pascoConfidence[4]),
        patternRecognition: calculateSkillScore(pascoQuestions[5], pascoAnswers[5], pascoConfidence[5]),
        criticalThinking: calculateSkillScore(pascoQuestions[6], pascoAnswers[6], pascoConfidence[6])
      };

      const confidenceAlignment = calculateConfidenceAlignment(pascoAnswers, pascoConfidence, pascoQuestions);

      setPascoMetrics({
        overallScore: Object.values(skillScores).reduce((a, b) => a + b, 0) / 7,
        confidenceAlignment,
        skillScores
      });

      // Subject Performance Analysis
      const subjects = new Map();
      parsedData.questions.slice(11).forEach((question: Question, index: number) => {
        if (!question) return;
        
        const actualIndex = index + 11;
        const subject = question.section;
        const isCorrect = parsedData.answers[actualIndex] === question.correct;
        const confidence = parsedData.confidenceLevels[actualIndex];
        const confidenceValue = confidence ? confidenceValueMap[confidence] : 0;
        
        if (!subjects.has(subject)) {
          subjects.set(subject, {
            subject,
            score: 0,
            timeSpent: 0,
            accuracy: 0,
            confidenceAccuracy: 0
          });
        }

        const current = subjects.get(subject);
        current.score += isCorrect ? 1 : 0;
        current.accuracy = (current.score / parsedData.questions.filter((q: Question) => q && q.section === subject).length) * 100;
        current.confidenceAccuracy = isCorrect ? confidenceValue * 100 : (1 - confidenceValue) * 100;
      });

      setSubjectPerformance(Array.from(subjects.values()));

      // Calculate advanced analytics
      const timeUsed = parsedData.timeUsed || 1800;
      const timeData = analyzeTimeManagement(parsedData.questions, parsedData.answers, timeUsed);
      const mistakePatterns = analyzeMistakePatterns(
        parsedData.questions,
        parsedData.answers,
        parsedData.confidenceLevels
      );
      
      const consistency = calculateConfidenceAlignment(
        parsedData.answers,
        parsedData.confidenceLevels,
        parsedData.questions
      );
      
      const perfMetrics = calculatePerformanceMetrics(calculatedScore, timeData, consistency);
      setPerformanceMetrics(perfMetrics);
      
      const strengthsWeaknesses = generateStrengthsWeaknessesAnalysis(
        { skillScores },
        Array.from(subjects.values()),
        mistakePatterns
      );
      
      const comparative = generateComparativeAnalysis(calculatedScore);
      
      setAnalyticsData({
        mistakePatterns,
        timeAnalysis: timeData,
        strengthsWeaknesses,
        comparativeAnalysis: comparative
      });
    } catch (error) {
      console.error('Error processing test data:', error);
      navigate('/test');
    }
  }, [navigate, addXP, addCoins]);

  if (showLessonPlanLoading) {
    return <LessonPlanGenerationTransition onComplete={() => navigate('/dashboard')} />;
  }

  if (showLoading) {
    return <ResultsLoadingTransition onComplete={handleLoadingComplete} />;
  }

  if (!testData || !pascoMetrics) return null;

  // Advanced radar chart data for PASCO
  const pascoRadarData = {
    labels: [
      'Logical\nReasoning',
      'Analytical\nAbility',
      'Memory',
      'Spatial\nAbility',
      'Decision\nMaking',
      'Pattern\nRecognition',
      'Critical\nThinking'
    ],
    datasets: [
      {
        label: 'Your Score',
        data: Object.values(pascoMetrics.skillScores),
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        borderColor: 'rgb(9, 77, 136)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(9, 77, 136)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Ideal Score',
        data: [85, 85, 85, 85, 85, 85, 85],
        backgroundColor: 'rgba(16, 172, 139, 0.05)',
        borderColor: 'rgba(16, 172, 139, 0.3)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const performanceRing = {
    datasets: [{
      data: [animatedScore, 100 - animatedScore],
      backgroundColor: [
        animatedScore >= 80 ? '#10B981' : animatedScore >= 60 ? '#F59E0B' : '#EF4444',
        '#E5E7EB'
      ],
      borderWidth: 0
    }]
  };

  const getPerformanceMessage = () => {
    if (score >= 90) return { title: "Exceptional Performance!", icon: Trophy, color: "text-emerald-600" };
    if (score >= 80) return { title: "Excellent Work!", icon: Star, color: "text-blue-600" };
    if (score >= 70) return { title: "Good Progress!", icon: TrendingUp, color: "text-indigo-600" };
    if (score >= 60) return { title: "Keep Improving!", icon: Target, color: "text-amber-600" };
    return { title: "Room for Growth", icon: Lightbulb, color: "text-orange-600" };
  };

  const performanceMsg = getPerformanceMessage();

  // Generate personalized AI voice message based on performance
  const getPersonalizedVoiceMessage = (score: number, pascoScore: number) => {
    if (score >= 90) {
      return `Congratulations! You've achieved an exceptional score of ${Math.round(score)} percent on your PASCO assessment. This is truly outstanding performance! Your results show very strong cognitive abilities and excellent learning potential. You demonstrated remarkable skills in logical reasoning, analytical ability, and critical thinking. With scores like these, you're well-positioned to excel in your exam preparation journey. We at EdgeUp AI are excited to work with you. We'll continue to challenge you with advanced materials and help you refine your already strong skills. Your personalized study plan will focus on maintaining this excellence while pushing you to even greater heights. Keep up this fantastic work!`;
    } else if (score >= 80) {
      return `Excellent work! You scored ${Math.round(score)} percent on your PASCO assessment, which is a very strong performance. Your cognitive skills are well-developed, and you've shown great potential across multiple areas. Your results indicate that you have solid foundations in analytical thinking, problem-solving, and reasoning. This is a great starting point for your exam preparation. At EdgeUp AI, we're committed to helping you build on these strengths. We'll provide you with targeted learning materials and personalized guidance to help you reach the next level. Together, we'll work on fine-tuning your skills and addressing any areas that need attention. You're on the right track, and with consistent effort, you'll achieve your goals!`;
    } else if (score >= 70) {
      return `Good job on completing your PASCO assessment! You scored ${Math.round(score)} percent, which shows solid progress and good understanding. Your results reveal several areas where you're already performing well, and we've identified specific opportunities for growth. Don't worry about the areas that need work - that's exactly what we're here for! At EdgeUp AI, we specialize in personalized learning that adapts to your unique needs. We'll create a customized study plan that builds on your strengths while systematically improving your weaker areas. Our AI-powered platform will monitor your progress constantly and adjust your learning path to ensure you're always moving forward. With dedication and our guidance, you'll see significant improvement in your skills. Let's work together to unlock your full potential!`;
    } else if (score >= 60) {
      return `Thank you for completing your PASCO assessment. You scored ${Math.round(score)} percent. I want you to know that this score doesn't define your potential - it simply shows us where you are right now, and more importantly, it helps us understand exactly how to help you improve. Everyone learns at their own pace, and what matters most is your commitment to growth. Your results give us valuable insights into your learning style and cognitive patterns. At EdgeUp AI, we're here to support you every step of the way. We'll create a comprehensive, personalized study plan tailored specifically to your needs. Our platform will break down complex concepts into manageable pieces, provide regular practice, and track your progress closely. We'll focus on building your confidence along with your skills. Remember, improvement is a journey, and we're committed to guiding you through it. With consistent effort and our support, you'll see meaningful progress. We believe in you!`;
    } else {
      return `Thank you for taking the time to complete your PASCO assessment. You scored ${Math.round(score)} percent, and I want to be completely honest with you - we have some work to do together, but please don't be discouraged. This assessment simply helps us understand your current baseline so we can create the most effective learning plan for you. Every successful student starts somewhere, and the fact that you're here and taking this seriously already shows your commitment to improvement. At EdgeUp AI, we don't believe in giving up on any student. Your score tells us that you'll benefit greatly from our structured, step-by-step approach. We're going to be with you throughout this entire journey - monitoring your progress, providing constant feedback, and adjusting your learning path as you grow. We'll start with foundational concepts and gradually build your skills systematically. Our AI will identify exactly what you need to work on and provide targeted practice. Most importantly, we'll help you build the confidence that comes with mastery. This is just the beginning, and we're fully committed to your success. Let's transform these results together!`;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 60, 0],
              x: [0, -40, 0],
              rotate: [0, -20, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -right-20 w-[700px] h-[700px] bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 35, 0],
              rotate: [0, 25, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-sm rounded-full shadow-lg mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-sm font-semibold text-white">Assessment Complete</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Your Learning Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-600"
            >
              Discover your unique learning style and cognitive strengths
            </motion.p>
          </motion.div>

          {/* Score Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-br from-white/90 via-indigo-50/80 to-purple-50/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 mb-8 overflow-hidden relative border-2 border-indigo-200/50 hover:shadow-indigo-300/50 hover:shadow-3xl transition-all duration-500 group"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-300/40 to-purple-400/40 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.15, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-indigo-400/30 rounded-full blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div ref={scoreRef}>
                <div className="flex items-center gap-3 mb-4">
                  <performanceMsg.icon className={`w-8 h-8 ${performanceMsg.color}`} />
                  <h2 className={`text-2xl font-bold ${performanceMsg.color}`}>{performanceMsg.title}</h2>
                </div>
                
                <div className="relative w-64 h-64 mx-auto">
                  <Doughnut 
                    data={performanceRing}
                    options={{
                      cutout: '75%',
                      plugins: { legend: { display: false }, tooltip: { enabled: false } },
                      animation: { animateRotate: true, duration: 2000 }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900">{Math.round(animatedScore)}%</div>
                    <div className="text-sm text-gray-600 mt-1">Overall Score</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{Math.round(pascoMetrics.overallScore)}%</div>
                    <div className="text-sm text-gray-600">Cognitive Score</div>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{Math.round(pascoMetrics.confidenceAlignment)}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                {showInsights && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg animate-fadeInUp">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Strong Analytical Skills</div>
                        <div className="text-sm text-gray-600">Your logical reasoning is above average</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg animate-fadeInUp animation-delay-200">
                      <Brain className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Balanced Learning Style</div>
                        <div className="text-sm text-gray-600">You can adapt to multiple learning methods</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg animate-fadeInUp animation-delay-400">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Focus Area: {Object.entries(pascoMetrics.skillScores).reduce((a, b) => a[1] < b[1] ? a : b)[0].replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-sm text-gray-600">This skill has the most room for improvement</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-2"
          >
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Deep Analytics', icon: BrainCircuit },
              { id: 'vark', label: 'Learning Style', icon: Fingerprint },
              { id: 'cognitive', label: 'Cognitive Profile', icon: Brain },
              { id: 'subjects', label: 'Subject Analysis', icon: BookOpen },
              { id: 'mistakes', label: 'Mistake Analysis', icon: AlertTriangle },
              { id: 'comparative', label: 'Comparative', icon: Users }
            ].map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all whitespace-nowrap relative overflow-hidden ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/50'
                      : 'bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:shadow-lg border-2 border-transparent hover:border-indigo-200'
                  }`}
                >
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{section.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Quick Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-white via-indigo-50/30 to-white backdrop-blur-2xl rounded-3xl shadow-xl p-6 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-indigo-200/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg"
                    >
                      <Percent className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      score >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                      score >= 60 ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{Math.round(score)}%</div>
                      <div className="text-sm text-gray-600 mt-1">Overall Score</div>
                      <div className="mt-3 text-xs text-gray-500">
                        {analyticsData?.comparativeAnalysis && (
                          <>Better than {analyticsData.comparativeAnalysis.percentile}% of students</>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-white via-emerald-50/30 to-white backdrop-blur-2xl rounded-3xl shadow-xl p-6 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-200/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-teal-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg"
                    >
                      <Timer className="w-6 h-6 text-white" />
                    </motion.div>
                    {analyticsData?.timeAnalysis.rushingIndicator && (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {testData && Math.floor((testData as any).timeUsed / 60)}m
                  </div>
                      <div className="text-sm text-gray-600 mt-1">Time Taken</div>
                      <div className="mt-3 text-xs text-gray-500">
                        {analyticsData?.timeAnalysis.rushingIndicator ? 'Completed too quickly' : 'Good pace'}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-white via-purple-50/30 to-white backdrop-blur-2xl rounded-3xl shadow-xl p-6 border-2 border-purple-100 hover:border-purple-300 hover:shadow-purple-200/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-pink-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg"
                    >
                      <Target className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {testData && Math.round(
                      ((testData as any).answers.filter((a: any, i: number) => 
                        a === (testData as any).questions[i]?.correct
                      ).length / (testData as any).questions.length) * 100
                    )}%
                  </div>
                      <div className="text-sm text-gray-600 mt-1">Accuracy</div>
                      <div className="mt-3 text-xs text-gray-500">
                        {testData && (testData as any).answers.filter((a: any, i: number) =>
                          a === (testData as any).questions[i]?.correct
                        ).length} correct out of {testData && (testData as any).questions.length}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-white via-amber-50/30 to-white backdrop-blur-2xl rounded-3xl shadow-xl p-6 border-2 border-amber-100 hover:border-amber-300 hover:shadow-amber-200/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-orange-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg"
                    >
                      <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {pascoMetrics && Math.round(pascoMetrics.confidenceAlignment)}%
                  </div>
                      <div className="text-sm text-gray-600 mt-1">Confidence Accuracy</div>
                      <div className="mt-3 text-xs text-gray-500">
                        How well your confidence matches performance
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Achievement Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-indigo-500/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <Trophy className="w-8 h-8 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {score >= 90 ? 'Outstanding!' : score >= 80 ? 'Top Performer' : score >= 70 ? 'Strong Performance' : 'Keep Going!'}
                  </h3>
                      <p className="text-sm opacity-90">
                        {analyticsData?.comparativeAnalysis && (
                          <>You're in the top {100 - analyticsData.comparativeAnalysis.percentile}% of test takers!</>
                        )}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-emerald-500/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <BrainCircuit className="w-8 h-8 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {pascoMetrics && Object.values(pascoMetrics.skillScores).filter((s: any) => s >= 80).length} Strong Skills
                  </h3>
                      <p className="text-sm opacity-90">
                        Excelling in {pascoMetrics && Object.entries(pascoMetrics.skillScores)
                          .filter(([,v]: any) => v >= 80)
                          .map(([k]) => k.replace(/([A-Z])/g, ' $1').trim())
                          .slice(0, 2)
                          .join(' and ')
                        }
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                    className="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-purple-500/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                  <Repeat className="w-8 h-8 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {performanceMetrics && Math.round(performanceMetrics.consistency)}% Consistent
                  </h3>
                      <p className="text-sm opacity-90">
                        {performanceMetrics && performanceMetrics.consistency >= 80
                          ? 'Very stable performance across sections'
                          : 'Some variation in performance detected'
                        }
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Key Insights Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-gradient-to-br from-white/95 via-blue-50/50 to-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border-2 border-blue-100 hover:border-blue-200 hover:shadow-blue-200/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                  <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Summary</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Strengths</h3>
                    <div className="space-y-3">
                      {analyticsData?.strengthsWeaknesses.strengths.slice(0, 3).map((strength, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <span className="text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Focus Areas</h3>
                    <div className="space-y-3">
                      {analyticsData?.strengthsWeaknesses.weaknesses.slice(0, 3).map((weakness, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <span className="text-gray-700">{weakness}</span>
                        </div>
                      ))}
                      </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeSection === 'vark' && (
              <motion.div
                key="vark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your VARK Learning Profile</h2>
              
              {/* Interactive VARK Visualization */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {Object.entries(varkProfile).map(([style, percentage]) => {
                  const Icon = varkIcons[style as keyof typeof varkIcons];
                  const colors = varkColors[style as keyof typeof varkColors];
                  const isSelected = selectedVarkStyle === style;
                  
                  return (
                    <motion.button
                      key={style}
                      onClick={() => setSelectedVarkStyle(isSelected ? null : style)}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-2xl transition-all ${
                        isSelected ? 'shadow-2xl' : 'shadow-lg'
                      } bg-white/80 backdrop-blur-sm border border-white/50`}
                    >
                      <div className={`absolute inset-0 ${colors.bg} rounded-2xl opacity-10`} />
                      <div className="relative z-10">
                        <div className={`w-16 h-16 ${colors.light} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 capitalize mb-2">{style}</h3>
                        <div className="relative h-24 w-24 mx-auto mb-3">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#E5E7EB"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                              className={`${colors.text} transition-all duration-1000`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {style === 'visual' && 'Learns through images & diagrams'}
                          {style === 'auditory' && 'Learns through listening & discussion'}
                          {style === 'reading' && 'Learns through text & notes'}
                          {style === 'kinesthetic' && 'Learns through practice & experience'}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedVarkStyle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-100"
                >
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Optimized Learning Strategies for {selectedVarkStyle.charAt(0).toUpperCase() + selectedVarkStyle.slice(1)} Learners
                  </h4>
                  <ul className="space-y-2">
                    {selectedVarkStyle === 'visual' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span className="text-sm text-gray-600">Use mind maps and flowcharts for complex topics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span className="text-sm text-gray-600">Watch video lectures and visual demonstrations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span className="text-sm text-gray-600">Color-code your notes and use highlighters</span>
                        </li>
                      </>
                    )}
                    {selectedVarkStyle === 'auditory' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          <span className="text-sm text-gray-600">Record lectures and listen to them repeatedly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          <span className="text-sm text-gray-600">Join study groups for discussions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          <span className="text-sm text-gray-600">Use mnemonics and verbal repetition</span>
                        </li>
                      </>
                    )}
                    {selectedVarkStyle === 'reading' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          <span className="text-sm text-gray-600">Create detailed written summaries</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          <span className="text-sm text-gray-600">Use lists and organized note-taking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          <span className="text-sm text-gray-600">Read multiple sources on the same topic</span>
                        </li>
                      </>
                    )}
                    {selectedVarkStyle === 'kinesthetic' && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          <span className="text-sm text-gray-600">Use hands-on experiments and simulations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          <span className="text-sm text-gray-600">Take frequent breaks and move while studying</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          <span className="text-sm text-gray-600">Apply concepts to real-world scenarios</span>
                        </li>
                      </>
                    )}
                  </ul>
                </motion.div>
              )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeSection === 'cognitive' && (
              <motion.div
                key="cognitive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cognitive Abilities Profile</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="h-96">
                  <Radar
                    data={pascoRadarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: { size: 12 }
                          }
                        }
                      },
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            stepSize: 20,
                            display: false
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          pointLabels: {
                            font: { size: 11 },
                            padding: 15
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Skill Breakdown</h3>
                  {Object.entries(pascoMetrics.skillScores).map(([skill, score]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {skill.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{Math.round(score)}%</span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`absolute inset-y-0 left-0 rounded-full relative ${
                            score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                            score >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            score >= 40 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                        >
                          <motion.div
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-indigo-50 rounded-xl">
                <h4 className="font-semibold text-indigo-900 mb-2">Cognitive Strengths</h4>
                <p className="text-sm text-indigo-700">
                  Your strongest cognitive abilities are {
                    Object.entries(pascoMetrics.skillScores)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 2)
                      .map(([skill]) => skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase())
                      .join(' and ')
                  }. These skills will be your greatest assets in competitive exams.
                </p>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeSection === 'subjects' && (
              <motion.div
                key="subjects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Subject Performance Analysis</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectPerformance.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:border-indigo-300 transition-all hover:shadow-xl group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900">{subject.subject}</h3>
                      <span className={`text-2xl font-bold ${
                        subject.accuracy >= 80 ? 'text-emerald-600' :
                        subject.accuracy >= 60 ? 'text-blue-600' :
                        subject.accuracy >= 40 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(subject.accuracy)}%
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Accuracy</span>
                          <span className="font-medium">{Math.round(subject.accuracy)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.accuracy}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full relative"
                          >
                            <motion.div
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Confidence</span>
                          <span className="font-medium">{Math.round(subject.confidenceAccuracy)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.confidenceAccuracy}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full relative"
                          >
                            <motion.div
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        {subject.accuracy >= 80 ? (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Excellent!</span>
                          </>
                        ) : subject.accuracy >= 60 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">Good Progress</span>
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 text-amber-600" />
                            <span className="text-amber-600 font-medium">Needs Focus</span>
                          </>
                        )}
                      </div>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deep Analytics Section */}
          <AnimatePresence mode="wait">
            {activeSection === 'analytics' && analyticsData && performanceMetrics && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
              {/* Performance Metrics Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  Performance Metrics
                </h2>
                
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {Object.entries(performanceMetrics).map(([metric, value]) => (
                    <div key={metric} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">
                        {Math.round(value)}%
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Analysis Chart */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Management Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Timer className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">Average Time per Question</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {Math.round(analyticsData.timeAnalysis.averageTimePerQuestion)}s
                        </span>
                      </div>
                      
                      {analyticsData.timeAnalysis.rushingIndicator && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Rushing Detected</div>
                            <div className="text-sm text-gray-600">
                              You completed questions significantly faster than recommended
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Time Efficiency</span>
                          <span className="font-medium">{Math.round(analyticsData.timeAnalysis.timeEfficiency)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analyticsData.timeAnalysis.timeEfficiency}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full relative"
                          >
                            <motion.div
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar</h3>
                    <div className="h-64">
                      <Radar
                        data={{
                          labels: ['Score', 'Speed', 'Accuracy', 'Time Mgmt', 'Consistency', 'Potential'],
                          datasets: [{
                            label: 'Your Performance',
                            data: [
                              performanceMetrics.overallScore,
                              performanceMetrics.speed,
                              performanceMetrics.accuracy,
                              performanceMetrics.timeManagement,
                              performanceMetrics.consistency,
                              performanceMetrics.improvement + 50
                            ],
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgb(99, 102, 241)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgb(99, 102, 241)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100,
                              ticks: { display: false },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Strengths & Weaknesses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Strengths & Areas for Improvement</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Your Strengths
                    </h3>
                    {analyticsData.strengthsWeaknesses.strengths.map((strength, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                        {strength}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Areas to Improve
                    </h3>
                    {analyticsData.strengthsWeaknesses.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                        {weakness}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                      Recommendations
                    </h3>
                    {analyticsData.strengthsWeaknesses.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mistake Analysis Section */}
          <AnimatePresence mode="wait">
            {activeSection === 'mistakes' && analyticsData && (
              <motion.div
                key="mistakes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Detailed Mistake Analysis
              </h2>

              {/* Mistake Patterns Overview */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistake Patterns</h3>
                  {analyticsData.mistakePatterns.commonMistakes.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.mistakePatterns.commonMistakes.map((pattern, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-700 capitalize">{pattern.type} Questions</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-red-600">
                              {pattern.frequency} mistakes
                            </div>
                            <div className="text-xs text-gray-600">
                              {pattern.percentage.toFixed(1)}% of questions
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No consistent mistake patterns detected</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mistakes by Topic</h3>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.mistakePatterns.byTopic)
                      .sort(([,a]: any, [,b]: any) => b.count - a.count)
                      .slice(0, 5)
                      .map(([topic, data]: any) => (
                        <button
                          key={topic}
                          onClick={() => setExpandedAnalysis(expandedAnalysis === topic ? null : topic)}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{topic}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{data.count} mistakes</span>
                              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                                expandedAnalysis === topic ? 'rotate-90' : ''
                              }`} />
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Confidence Misalignment */}
              {analyticsData.mistakePatterns.confidenceMisalignment.length > 0 && (
                <div className="mt-8 p-6 bg-amber-50 rounded-xl">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Confidence Calibration Issue
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    You were highly confident on {analyticsData.mistakePatterns.confidenceMisalignment.length} questions 
                    that you answered incorrectly. This suggests a need to better calibrate your confidence levels.
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {analyticsData.mistakePatterns.confidenceMisalignment.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="text-xs p-2 bg-amber-100 rounded">
                        <span className="font-medium">{item.topic}</span> - 
                        <span className="text-amber-600"> {item.confidence} confident</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comparative Analysis Section */}
          <AnimatePresence mode="wait">
            {activeSection === 'comparative' && analyticsData && (
              <motion.div
                key="comparative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                Comparative Performance Analysis
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {analyticsData.comparativeAnalysis.percentile}th
                  </div>
                  <div className="text-sm text-gray-600">Percentile</div>
                  <div className="text-xs text-gray-500 mt-1">Better than {analyticsData.comparativeAnalysis.percentile}% of test takers</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    #{analyticsData.comparativeAnalysis.yourRank}
                  </div>
                  <div className="text-sm text-gray-600">Your Rank</div>
                  <div className="text-xs text-gray-500 mt-1">Out of {analyticsData.comparativeAnalysis.totalParticipants.toLocaleString()}</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {Math.round(analyticsData.comparativeAnalysis.averageScore)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                  <div className="text-xs text-gray-500 mt-1">Across all participants</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {score > analyticsData.comparativeAnalysis.averageScore ? '+' : ''}{Math.round(score - analyticsData.comparativeAnalysis.averageScore)}%
                  </div>
                  <div className="text-sm text-gray-600">vs Average</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {score > analyticsData.comparativeAnalysis.averageScore ? 'Above' : 'Below'} average
                  </div>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
                      datasets: [{
                        label: 'Number of Students',
                        data: [150, 450, 2800, 4200, 2400],
                        backgroundColor: [
                          '#EF4444',
                          '#F59E0B', 
                          '#3B82F6',
                          '#10B981',
                          '#8B5CF6'
                        ],
                        borderWidth: 0,
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
                            label: (context) => `${context.parsed.y} students`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => value.toLocaleString()
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Your score: <span className="font-semibold text-indigo-600">{Math.round(score)}%</span></span>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="mt-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl hover:shadow-indigo-500/50 hover:shadow-3xl transition-all duration-500"
          >
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-48 -translate-x-48"
              animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Accelerate Your Learning?</h2>
              <p className="text-indigo-100 mb-6">Get your personalized AI-powered study plan based on your unique profile</p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={handleLessonPlanClick}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <Sparkles className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Generate AI Study Plan</span>
                  <ChevronRight className="w-6 h-6 relative z-10" />
                </motion.button>

                <motion.button
                  onClick={() => window.print()}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl border-2 border-white/30"
                >
                  <Download className="w-6 h-6" />
                  Download Report
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/30 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl border-2 border-white/30"
                >
                  <Share2 className="w-6 h-6" />
                  Share Results
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reward Popup - Temporarily disabled */}
      {/* {showReward && (
        <RewardPopup
          reward={showReward}
          onClose={() => setShowReward(null)}
        />
      )} */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}