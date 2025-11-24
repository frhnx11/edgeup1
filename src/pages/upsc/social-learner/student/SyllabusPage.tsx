import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  Search, Filter, ChevronRight, Book, Target, Clock, Brain, Star, BarChart2,
  TrendingUp, Users, Sparkles, Zap, Shield, Award, Flame, Network, Activity,
  Hexagon, Grid, Layers, Compass, GitBranch, Atom, Rocket, Battery, Lock,
  CheckCircle, XCircle, Eye, Play, Pentagon, Orbit, Globe, Trophy, X,
  SlidersHorizontal, Calendar, BrainCircuit, Lightbulb, BookOpen
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  subtopics: string[];
  timeRequired: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastStudied?: string;
  aiRecommended?: boolean;
  trendingScore?: number;
  unlocked?: boolean;
  prerequisites?: string[];
  estimatedCompletion?: string;
  masteryLevel?: number;
  badges?: string[];
}

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
  overallProgress: number;
  icon?: any;
  color?: string;
  glowColor?: string;
}

interface StudyStats {
  streak: number;
  totalHours: number;
  topicsCompleted: number;
  averageScore: number;
  nextMilestone: string;
  rank: string;
  xp: number;
  level: number;
}

interface AIInsight {
  id: string;
  type: 'strength' | 'weakness' | 'recommendation' | 'prediction';
  message: string;
  icon: any;
  color: string;
}

// Futuristic Card Component
const FuturisticCard = ({ children, className = "", delay = 0, neonGlow = false }) => {
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
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5 }}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(16, 172, 139, 0.15) 0%,
            transparent 60%
          ),
          linear-gradient(135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(10px)',
        boxShadow: neonGlow
          ? '0 0 30px rgba(16, 172, 139, 0.3), 0 8px 32px 0 rgba(9, 77, 136, 0.1)'
          : '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-brand-secondary/20 to-transparent" />
      {children}
    </motion.div>
  );
};

// Holographic Section Header
const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <motion.div
        className="relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl blur-xl opacity-50" />
      </motion.div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
};

export function SyllabusPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'neural' | 'galaxy'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterProgress, setFilterProgress] = useState<string>('all');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [studyStats] = useState<StudyStats>({
    streak: 15,
    totalHours: 342,
    topicsCompleted: 28,
    averageScore: 87,
    nextMilestone: 'Complete 2 more topics',
    rank: 'Scholar Elite',
    xp: 4250,
    level: 12
  });

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'strength',
      message: 'Excellent progress in Ancient History! Your retention rate is 92%',
      icon: Trophy,
      color: 'emerald'
    },
    {
      id: '2',
      type: 'recommendation',
      message: 'Focus on Monetary Policy next - it aligns with your learning pattern',
      icon: Lightbulb,
      color: 'amber'
    },
    {
      id: '3',
      type: 'prediction',
      message: 'At current pace, you\'ll complete Economics in 3 weeks',
      icon: Rocket,
      color: 'indigo'
    }
  ]);

  // Particle animation effect
  useEffect(() => {
    if (viewMode !== 'galaxy' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, 0.6)`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [viewMode]);

  const subjects: Subject[] = [
    {
      id: 'polity',
      name: 'Indian Polity',
      overallProgress: 75,
      icon: Shield,
      color: 'blue',
      glowColor: 'rgba(59, 130, 246, 0.5)',
      topics: [
        {
          id: 'constitution',
          title: 'Constitutional Framework',
          subject: 'Indian Polity',
          description: 'Study of the Indian Constitution, its features, and basic structure.',
          progress: 85,
          subtopics: [
            'Preamble and Basic Structure',
            'Fundamental Rights',
            'Directive Principles',
            'Fundamental Duties'
          ],
          timeRequired: '20 hours',
          difficulty: 'medium',
          lastStudied: '2 days ago',
          aiRecommended: true,
          trendingScore: 92,
          unlocked: true,
          masteryLevel: 4,
          badges: ['Fast Learner', 'Constitution Expert'],
          estimatedCompletion: '3 days'
        },
        {
          id: 'parliament',
          title: 'Parliament and Legislature',
          subject: 'Indian Polity',
          description: 'Structure, functions, and powers of Parliament and State Legislatures.',
          progress: 65,
          subtopics: [
            'Composition of Parliament',
            'Legislative Procedures',
            'Parliamentary Committees',
            'State Assemblies'
          ],
          timeRequired: '25 hours',
          difficulty: 'hard',
          unlocked: true
        },
        {
          id: 'executive',
          title: 'Executive',
          subject: 'Indian Polity',
          description: 'Study of President, Prime Minister, Council of Ministers, and State Executive.',
          progress: 70,
          subtopics: [
            'President and Vice President',
            'Prime Minister and Council',
            'State Executive',
            'Powers and Functions'
          ],
          timeRequired: '22 hours',
          difficulty: 'medium',
          unlocked: true
        },
        {
          id: 'judiciary',
          title: 'Judiciary',
          subject: 'Indian Polity',
          description: 'Supreme Court, High Courts, and judicial system in India.',
          progress: 55,
          subtopics: [
            'Supreme Court',
            'High Courts',
            'Judicial Review',
            'Judicial Activism'
          ],
          timeRequired: '28 hours',
          difficulty: 'hard',
          unlocked: true
        }
      ]
    },
    {
      id: 'economics',
      name: 'Economics',
      overallProgress: 60,
      icon: TrendingUp,
      color: 'emerald',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      topics: [
        {
          id: 'macro',
          title: 'Macroeconomics',
          subject: 'Economics',
          description: 'Study of national income, monetary policy, and fiscal policy.',
          progress: 45,
          subtopics: [
            'National Income',
            'Money and Banking',
            'Inflation',
            'Economic Growth'
          ],
          timeRequired: '30 hours',
          difficulty: 'hard',
          unlocked: true
        },
        {
          id: 'micro',
          title: 'Microeconomics',
          subject: 'Economics',
          description: 'Study of individual markets, demand-supply, and market structures.',
          progress: 75,
          subtopics: [
            'Demand and Supply',
            'Market Structures',
            'Factor Pricing',
            'Consumer Behavior'
          ],
          timeRequired: '25 hours',
          difficulty: 'medium',
          unlocked: true
        }
      ]
    },
    {
      id: 'history',
      name: 'History',
      overallProgress: 65,
      icon: Book,
      color: 'amber',
      glowColor: 'rgba(251, 191, 36, 0.5)',
      topics: [
        {
          id: 'ancient-india',
          title: 'Ancient India',
          subject: 'History',
          description: 'Comprehensive study of ancient Indian civilization, culture, and society.',
          progress: 85,
          subtopics: [
            'Indus Valley Civilization',
            'Vedic Period',
            'Mauryan Empire',
            'Gupta Dynasty'
          ],
          timeRequired: '30 hours',
          difficulty: 'medium',
          lastStudied: '3 days ago',
          unlocked: true
        },
        {
          id: 'medieval-india',
          title: 'Medieval India',
          subject: 'History',
          description: 'Study of medieval Indian kingdoms, sultanates, and empires.',
          progress: 70,
          subtopics: [
            'Delhi Sultanate',
            'Vijayanagara Empire',
            'Mughal Empire',
            'Maratha Empire'
          ],
          timeRequired: '25 hours',
          difficulty: 'hard',
          unlocked: true
        }
      ]
    },
    {
      id: 'geography',
      name: 'Geography',
      overallProgress: 70,
      icon: Globe,
      color: 'purple',
      glowColor: 'rgba(168, 85, 247, 0.5)',
      topics: [
        {
          id: 'physical-geography',
          title: 'Physical Geography',
          subject: 'Geography',
          description: 'Study of India\'s physical features, landforms, and natural regions.',
          progress: 75,
          subtopics: [
            'Physiography',
            'Drainage System',
            'Climate',
            'Natural Vegetation'
          ],
          timeRequired: '30 hours',
          difficulty: 'hard',
          unlocked: true
        },
        {
          id: 'climate',
          title: 'Climate and Weather',
          subject: 'Geography',
          description: 'Analysis of Indian climate, monsoons, and weather patterns.',
          progress: 80,
          subtopics: [
            'Monsoon System',
            'Climatic Regions',
            'Weather Patterns',
            'Climate Change'
          ],
          timeRequired: '25 hours',
          difficulty: 'medium',
          unlocked: true
        }
      ]
    }
  ];

  const handleStartLearning = (moduleId: string, topicId: string) => {
    navigate(`/module/${moduleId}/topic/${topicId}`);
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Battery className="w-4 h-4 text-green-500" />;
      case 'medium': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'hard': return <Flame className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const filteredTopics = subjects.flatMap(subject =>
    subject.topics.filter(topic => {
      const matchesSearch = searchQuery === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = filterDifficulty === 'all' || topic.difficulty === filterDifficulty;

      const matchesProgress = filterProgress === 'all' ||
        (filterProgress === 'not-started' && topic.progress === 0) ||
        (filterProgress === 'in-progress' && topic.progress > 0 && topic.progress < 100) ||
        (filterProgress === 'completed' && topic.progress === 100);

      const matchesSubject = selectedSubject === 'all' || subject.id === selectedSubject;

      return matchesSearch && matchesDifficulty && matchesProgress && matchesSubject;
    })
  );

  const metrics = [
    {
      title: 'Overall Progress',
      value: '68%',
      trend: '+5% this week',
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      title: 'Topics Covered',
      value: '45/60',
      trend: '75% complete',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Study Hours',
      value: '128',
      trend: '12 hrs this week',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Test Score Avg.',
      value: '85%',
      trend: '+3% improvement',
      icon: BarChart2,
      color: 'purple'
    }
  ];

  return (
      <>
      <div className="max-w-[1600px] mx-auto space-y-8">
        <WelcomeTooltip message="Review your complete curriculum and track topic coverage." />

        {/* Enhanced Header with Gradient */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl p-6 md:p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-32 translate-y-32" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  Neural Syllabus Matrix
                </h1>
                <p className="text-white/90">AI-Enhanced Learning Pathways for UPSC Success</p>
              </div>

              {/* Study Stats Bar */}
              <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-300" />
                  <div>
                    <p className="text-xs opacity-90">Streak</p>
                    <p className="text-lg font-bold">{studyStats.streak} days</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <div>
                    <p className="text-xs opacity-90">Rank</p>
                    <p className="text-lg font-bold">{studyStats.rank}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-300" />
                  <div>
                    <p className="text-xs opacity-90">Level {studyStats.level}</p>
                    <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${(studyStats.xp % 500) / 5}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <FuturisticCard key={idx} delay={idx * 0.1}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  <span className="text-xs text-green-600 font-medium">{metric.trend}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </FuturisticCard>
          ))}
        </div>

        {/* Control Panel */}
        <FuturisticCard delay={0.4}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics across all subjects..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* View Mode Selector */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                {[
                  { id: 'grid', icon: Grid, label: 'Grid' },
                  { id: 'neural', icon: Network, label: 'Neural' },
                  { id: 'galaxy', icon: Orbit, label: 'Galaxy' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      viewMode === mode.id
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 border ${
                  showFilters
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {(filterDifficulty !== 'all' || filterProgress !== 'all') && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
                    {[filterDifficulty !== 'all', filterProgress !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block font-medium">Difficulty</label>
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      >
                        <option value="all">All Levels</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block font-medium">Progress</label>
                      <select
                        value={filterProgress}
                        onChange={(e) => setFilterProgress(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      >
                        <option value="all">All Progress</option>
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block font-medium">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      >
                        <option value="all">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FuturisticCard>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <FuturisticCard delay={0.5} neonGlow={true}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader
                  icon={BrainCircuit}
                  title="AI Learning Insights"
                  subtitle="Personalized recommendations based on your progress"
                />
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.color === 'emerald' ? 'bg-emerald-100' :
                        insight.color === 'amber' ? 'bg-amber-100' :
                        'bg-indigo-100'
                      }`}>
                        <insight.icon className={`w-5 h-5 ${
                          insight.color === 'emerald' ? 'text-emerald-600' :
                          insight.color === 'amber' ? 'text-amber-600' :
                          'text-indigo-600'
                        }`} />
                      </div>
                      <p className="text-sm text-gray-700">{insight.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FuturisticCard>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {viewMode === 'grid' && subjects.map((subject, subIdx) => (
            <FuturisticCard key={subject.id} delay={0.6 + subIdx * 0.1}>
              <div className="p-6">
                {/* Subject Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      subject.color === 'blue' ? 'from-blue-400 to-blue-600' :
                      subject.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                      subject.color === 'amber' ? 'from-amber-400 to-amber-600' :
                      'from-purple-400 to-purple-600'
                    }`}>
                      <subject.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{subject.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${subject.overallProgress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${
                                subject.color === 'blue' ? 'from-blue-500 to-blue-600' :
                                subject.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                                subject.color === 'amber' ? 'from-amber-500 to-amber-600' :
                                'from-purple-500 to-purple-600'
                              }`}
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{subject.overallProgress}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {subject.topics.filter(t => t.progress === 100).length}/{subject.topics.length} completed
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all flex items-center gap-2">
                      <BarChart2 className="w-4 h-4" />
                      Analytics
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Continue
                    </button>
                  </div>
                </div>

                {/* Topic Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subject.topics.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative h-64 cursor-pointer group"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setShowTopicModal(true);
                      }}
                    >
                      <div className={`absolute inset-0 rounded-xl overflow-hidden shadow-lg border-2 transition-all ${
                        topic.progress === 0 ? 'bg-gray-50 border-gray-200' :
                        topic.progress < 30 ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' :
                        topic.progress < 70 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
                        'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                      } group-hover:shadow-xl`}>
                        {/* Progress Fill Animation */}
                        {topic.progress > 0 && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 opacity-20"
                            initial={{ height: 0 }}
                            animate={{ height: `${topic.progress}%` }}
                            style={{
                              background: topic.progress < 30 ? 'rgba(239, 68, 68, 0.3)' :
                                         topic.progress < 70 ? 'rgba(245, 158, 11, 0.3)' :
                                         'rgba(16, 185, 129, 0.3)'
                            }}
                          />
                        )}

                        {/* Content */}
                        <div className="relative h-full p-4 flex flex-col justify-between">
                          {/* Header */}
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{topic.title}</h3>
                              {topic.aiRecommended && (
                                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                              <Clock className="w-3 h-3" />
                              <span>{topic.timeRequired}</span>
                              {getDifficultyIcon(topic.difficulty)}
                            </div>

                            {topic.aiRecommended && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full text-xs text-purple-700">
                                <Sparkles className="w-3 h-3" />
                                AI Pick
                              </span>
                            )}
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-3">
                            {/* Progress Ring */}
                            <div className="flex items-center justify-between">
                              <div className="relative w-16 h-16">
                                <svg className="absolute inset-0 -rotate-90">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(0,0,0,0.1)"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke={topic.progress < 30 ? '#ef4444' : topic.progress < 70 ? '#f59e0b' : '#10b981'}
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - topic.progress / 100)}`}
                                    className="transition-all duration-1000"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold text-gray-900">{topic.progress}%</span>
                                </div>
                              </div>

                              {/* Mastery Level */}
                              {topic.masteryLevel && (
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1.5 h-6 rounded-full transition-all ${
                                        i < topic.masteryLevel
                                          ? 'bg-gradient-to-t from-brand-primary to-brand-secondary'
                                          : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartLearning(subject.id, topic.id);
                              }}
                              className="w-full px-3 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <Rocket className="w-4 h-4" />
                              {topic.progress === 0 ? 'Start' : topic.progress === 100 ? 'Review' : 'Continue'}
                            </button>
                          </div>
                        </div>

                        {/* Lock Overlay */}
                        {topic.unlocked === false && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                            <Lock className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FuturisticCard>
          ))}

          {/* Neural View */}
          {viewMode === 'neural' && (
            <FuturisticCard delay={0.3}>
              <div className="relative h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg mb-4 inline-block">
                    <Network className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Neural Learning Map</h3>
                  <p className="text-gray-600">Interactive knowledge graph coming soon</p>
                </div>
              </div>
            </FuturisticCard>
          )}

          {/* Galaxy View */}
          {viewMode === 'galaxy' && (
            <FuturisticCard delay={0.3}>
              <div className="relative h-[600px] flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />
                <div className="text-center z-10">
                  <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4 inline-block">
                    <Orbit className="w-16 h-16 text-white animate-spin-slow" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Galaxy Learning View</h3>
                  <p className="text-gray-600">Explore your knowledge universe</p>
                </div>
              </div>
            </FuturisticCard>
          )}
        </div>
      </div>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {showTopicModal && selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTopicModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-4xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary">
                    <Hexagon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      {selectedTopic.title}
                      {selectedTopic.aiRecommended && (
                        <span className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          AI Recommended
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{selectedTopic.subject}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getDifficultyIcon(selectedTopic.difficulty)}
                        {selectedTopic.difficulty.charAt(0).toUpperCase() + selectedTopic.difficulty.slice(1)}
                      </span>
                      {selectedTopic.lastStudied && (
                        <>
                          <span>•</span>
                          <span>Last studied {selectedTopic.lastStudied}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed">{selectedTopic.description}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Time Required</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{selectedTopic.timeRequired}</div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold text-gray-900">{selectedTopic.progress}%</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Mastery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedTopic.masteryLevel && (
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < selectedTopic.masteryLevel
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-gray-600">Est. Completion</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedTopic.estimatedCompletion || 'Not set'}
                    </div>
                  </motion.div>
                </div>

                {/* Subtopics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-brand-primary" />
                    Learning Pathways
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTopic.subtopics.map((subtopic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-brand-primary hover:bg-blue-50 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
                          <ChevronRight className="w-4 h-4 text-brand-primary" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{subtopic}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                {selectedTopic.badges && selectedTopic.badges.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Achievements Unlocked
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedTopic.badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-300 flex items-center gap-2"
                        >
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">{badge}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all border border-gray-200 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowTopicModal(false);
                    const subject = subjects.find(s => s.topics.some(t => t.id === selectedTopic.id));
                    if (subject) {
                      handleStartLearning(subject.id, selectedTopic.id);
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  {selectedTopic.progress === 0 ? 'Begin Journey' : selectedTopic.progress === 100 ? 'Review Module' : 'Continue Learning'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
  );
}
