import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { LessonPlanGenerationTransition } from '../../../../components/upsc/common/LessonPlanGenerationTransition';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Clock, 
  Calendar, 
  Book, 
  ChevronRight, 
  Play, 
  Zap, 
  Star, 
  Trophy, 
  Medal, 
  Rocket, 
  Cpu, 
  Layers, 
  Activity, 
  Settings, 
  RefreshCw, 
  Filter, 
  Search, 
  Bookmark, 
  SkipForward, 
  Clock4, 
  Languages, 
  LineChart, 
  PieChart, 
  BarChart, 
  Sliders, 
  ListOrdered as ListReorder, 
  Gauge, 
  TimerReset, 
  Lightbulb, 
  Dices, 
  Microscope, 
  Atom, 
  Braces, 
  Infinity, 
  Hexagon, 
  Workflow, 
  GraduationCap, 
  FileText, 
  Video, 
  Headphones, 
  CheckCircle, 
  AlertCircle, 
  Globe2, 
  Building2, 
  Scale, 
  Landmark, 
  Users, 
  TreePine, 
  Wallet, 
  Presentation, 
  ScrollText, 
  Newspaper, 
  Radar,
  BookOpen 
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  subject: string;
  icon: any;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completion: number;
  resources: {
    type: 'video' | 'document' | 'quiz' | 'interactive' | 'audio' | 'practice';
    title: string;
    duration: string;
    format?: string;
  }[];
  aiInsights: string[];
  topics: string[];
  learningPath: {
    stage: string;
    activities: string[];
  }[];
  prerequisites?: string[];
  keyTerms?: string[];
}

const upscModules: LearningModule[] = [
  {
    id: 'polity-1',
    title: 'Indian Constitution & Political System',
    subject: 'Indian Polity',
    icon: Scale,
    description: 'Comprehensive study of Indian Constitution, federal structure, and governance',
    duration: '40 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Constitutional Framework Masterclass', duration: '2 hours' },
      { type: 'interactive', title: 'Federal Structure Simulation', duration: '1.5 hours' },
      { type: 'document', title: 'Supreme Court Case Studies', duration: '3 hours' },
      { type: 'quiz', title: 'Constitution MCQ Challenge', duration: '1 hour' },
      { type: 'practice', title: 'Previous Year Questions', duration: '2 hours' }
    ],
    aiInsights: [
      'Strong visual learning potential detected',
      'Recommended focus on case study approach',
      'Optimal revision cycle: Every 4 days',
      'Peak learning time: Early morning'
    ],
    topics: [
      'Preamble & Basic Structure',
      'Fundamental Rights & Duties',
      'Directive Principles',
      'Federal Structure',
      'Union & State Legislature',
      'Executive & Judiciary',
      'Constitutional Bodies'
    ],
    learningPath: [
      {
        stage: 'Foundation',
        activities: [
          'Watch overview lectures',
          'Read NCERT material',
          'Basic concept mapping'
        ]
      },
      {
        stage: 'Deep Dive',
        activities: [
          'Case study analysis',
          'Constitutional amendments study',
          'Current affairs integration'
        ]
      },
      {
        stage: 'Mastery',
        activities: [
          'Mock tests',
          'Answer writing practice',
          'Peer discussions'
        ]
      }
    ]
  },
  {
    id: 'economy-1',
    title: 'Indian Economy & Development',
    subject: 'Economics',
    icon: Wallet,
    description: 'Analysis of Indian economic system, policies, and development',
    duration: '35 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Economic Survey Analysis', duration: '3 hours' },
      { type: 'document', title: 'Policy Framework Study', duration: '2 hours' },
      { type: 'interactive', title: 'Budget Analysis Tool', duration: '1.5 hours' },
      { type: 'practice', title: 'Economic Data Interpretation', duration: '2 hours' },
      { type: 'audio', title: 'Expert Lectures Series', duration: '4 hours' }
    ],
    aiInsights: [
      'High analytical capability detected',
      'Focus on data interpretation needed',
      'Recommended practice with real economic data',
      'Integrate current economic news daily'
    ],
    topics: [
      'Economic Planning & Models',
      'Fiscal & Monetary Policy',
      'Banking System & Financial Markets',
      'Agriculture & Food Security',
      'Industrial Policy & Growth',
      'External Sector',
      'Poverty & Unemployment'
    ],
    learningPath: [
      {
        stage: 'Concepts',
        activities: [
          'Basic economic principles',
          'Indian economic features',
          'Policy framework understanding'
        ]
      },
      {
        stage: 'Application',
        activities: [
          'Case study analysis',
          'Data interpretation practice',
          'Current economic issues'
        ]
      },
      {
        stage: 'Advanced',
        activities: [
          'Economic survey analysis',
          'Budget document study',
          'Policy impact assessment'
        ]
      }
    ]
  },
  {
    id: 'geography-1',
    title: 'Indian & World Geography',
    subject: 'Geography',
    icon: Globe2,
    description: 'Physical, economic, and social geography of India and the World',
    duration: '30 hours',
    difficulty: 'Intermediate',
    completion: 0,
    resources: [
      { type: 'interactive', title: '3D Terrain Mapping', duration: '2 hours' },
      { type: 'video', title: 'Climate Patterns', duration: '2.5 hours' },
      { type: 'document', title: 'Resource Distribution', duration: '2 hours' },
      { type: 'quiz', title: 'Geography Challenge', duration: '1 hour' },
      { type: 'practice', title: 'Map-based Questions', duration: '2 hours' }
    ],
    aiInsights: [
      'Strong spatial intelligence detected',
      'Visual learning approach recommended',
      'Focus on map-based learning',
      'Regular revision with visual aids'
    ],
    topics: [
      'Physical Geography of India',
      'Climate & Natural Resources',
      'Economic Geography',
      'Population & Settlements',
      'Environmental Geography',
      'World Geography',
      'Geopolitics'
    ],
    learningPath: [
      {
        stage: 'Basic Mapping',
        activities: [
          'Physical features identification',
          'Climate pattern study',
          'Resource mapping'
        ]
      },
      {
        stage: 'Advanced Analysis',
        activities: [
          'Geographical phenomenon study',
          'Economic geography integration',
          'Environmental impact analysis'
        ]
      },
      {
        stage: 'Practical Application',
        activities: [
          'Map-based questions practice',
          'Case studies of regions',
          'Current geographical issues'
        ]
      }
    ]
  },
  {
    id: 'history-1',
    title: 'Indian History & Culture',
    subject: 'History',
    icon: Landmark,
    description: 'Comprehensive study of Indian history from ancient to modern times',
    duration: '45 hours',
    difficulty: 'Advanced',
    completion: 0,
    resources: [
      { type: 'video', title: 'Timeline Masterclass', duration: '3 hours' },
      { type: 'interactive', title: 'Historical Events Simulation', duration: '2 hours' },
      { type: 'document', title: 'Art & Culture Guide', duration: '2.5 hours' },
      { type: 'quiz', title: 'History Challenge', duration: '1.5 hours' },
      { type: 'audio', title: 'Historical Narratives', duration: '3 hours' }
    ],
    aiInsights: [
      'Strong chronological learning pattern',
      'Focus on cause-effect relationships',
      'Interactive timeline approach recommended',
      'Regular theme-based revision needed'
    ],
    topics: [
      'Ancient India',
      'Medieval India',
      'Modern India',
      'Indian National Movement',
      'Post-Independence India',
      'Art & Culture',
      'World History'
    ],
    learningPath: [
      {
        stage: 'Chronological Understanding',
        activities: [
          'Timeline creation',
          'Period-wise study',
          'Source analysis'
        ]
      },
      {
        stage: 'Thematic Study',
        activities: [
          'Movement analysis',
          'Cultural evolution study',
          'Historical interpretation'
        ]
      },
      {
        stage: 'Advanced Integration',
        activities: [
          'Cross-cultural analysis',
          'Contemporary relevance',
          'Historical debates'
        ]
      }
    ]
  }
];

export function AILessonPlanPage() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [bookmarkedModules, setBookmarkedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (showLoading) {
    return <LessonPlanGenerationTransition onComplete={handleLoadingComplete} />;
  }

  const handleModuleClick = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const toggleBookmark = (moduleId: string) => {
    setBookmarkedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'quiz': return Target;
      case 'interactive': return Cpu;
      case 'audio': return Headphones;
      case 'practice': return Brain;
      default: return FileText;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with AI Insights */}
        <div className="bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-xl p-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">Personalized UPSC Preparation Plan</h1>
                <p className="text-sm opacity-80">AI-powered learning path tailored to your style and goals</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Learning Style</span>
                </div>
                <div className="text-2xl font-bold">reading</div>
                <div className="text-sm opacity-60">Primary preference</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                  <Target className="w-4 h-4" />
                  <span>Target Exam</span>
                </div>
                <div className="text-2xl font-bold">UPSC</div>
                <div className="text-sm opacity-60">2026</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Study Hours</span>
                </div>
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm opacity-60">hours per day</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                  <Activity className="w-4 h-4" />
                  <span>Focus Areas</span>
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm opacity-60">core subjects</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 text-sm font-medium border-b-2 border-[#094d88] text-[#094d88]"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Daily Schedule
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Learning Resources
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Progress Tracking
          </button>
        </div>

        {/* Search and Controls */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upscModules.map(module => (
            <div key={module.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.subject}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(module.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        bookmarkedModules.includes(module.id)
                          ? 'fill-current text-[#094d88]'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {module.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {module.difficulty}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full transition-all duration-500"
                      style={{ width: `${module.completion}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#094d88]" />
                    <span className="text-sm font-medium text-[#094d88]">AI Insights Available</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                    <selectedModule.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedModule.title}</h2>
                    <p className="text-gray-600">{selectedModule.subject}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Resources */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Learning Resources</h3>
                  <div className="space-y-3">
                    {selectedModule.resources.map((resource, index) => (
                      <button
                        key={index}
                        onClick={() => handleResourceClick(resource)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-brand-light transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          resource.type === 'video' ? 'bg-blue-50 text-blue-600' :
                          resource.type === 'document' ? 'bg-green-50 text-green-600' :
                          resource.type === 'quiz' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {React.createElement(getResourceIcon(resource.type), { className: 'w-5 h-5' })}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-gray-600">{resource.duration}</div>
                        </div>
                        <Play className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">AI Insights</h3>
                  <div className="space-y-3">
                    {selectedModule.aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-brand-light rounded-lg">
                        <Sparkles className="w-5 h-5 text-brand-primary" />
                        <span className="text-sm text-brand-primary">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Topics */}
              <div>
                <h3 className="font-medium mb-4">Topics Covered</h3>
                <div className="space-y-3">
                  {selectedModule.topics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Learning Path */}
              <div>
                <h3 className="font-medium mb-4">Learning Path</h3>
                <div className="space-y-6">
                  {selectedModule.learningPath.map((stage, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-medium">
                          {index + 1}
                        </div>
                        <h4 className="font-medium">{stage.stage}</h4>
                      </div>
                      <div className="space-y-2 pl-11">
                        {stage.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[#094d88] rounded-full" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setShowModuleModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#094d88]/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModuleModal(false);
                  handleStartLearning(selectedModule.subject.toLowerCase(), selectedModule.id);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-lg hover:from-[#10ac8b] hover:to-[#094d88] transition-colors"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}