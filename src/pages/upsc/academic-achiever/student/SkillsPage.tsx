import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Target,
  Clock,
  Book,
  Lightbulb,
  PenTool,
  MessageSquare,
  ChevronRight,
  Trophy,
  BarChart2,
  Star,
  Zap,
  Play,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: any;
  level: number;
  progress: number;
  exercises: Exercise[];
  benefits: string[];
  prerequisites?: string[];
  relatedSkills: string[];
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  completed: boolean;
  xpReward: number;
  objectives: string[];
  requirements?: string[];
}

export function SkillsPage() {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const skills: Skill[] = [
    {
      id: 'logical-reasoning',
      name: 'Logical Reasoning',
      description: 'Enhance your ability to analyze and solve complex problems through logical thinking',
      icon: Target,
      level: 3,
      progress: 65,
      benefits: [
        'Improved problem-solving abilities',
        'Better decision-making skills',
        'Enhanced analytical thinking',
        'Stronger deductive reasoning'
      ],
      relatedSkills: ['Analytical Ability', 'Critical Thinking'],
      exercises: [
        {
          id: 'syl-1',
          title: 'Syllogistic Reasoning',
          description: 'Practice deductive reasoning through syllogisms and logical arguments',
          duration: '20 min',
          difficulty: 'intermediate',
          type: 'logical',
          completed: false,
          xpReward: 100,
          objectives: [
            'Understand syllogistic structure',
            'Identify valid conclusions',
            'Recognize logical fallacies'
          ]
        },
        {
          id: 'pat-1',
          title: 'Pattern Recognition',
          description: 'Identify and complete complex patterns in sequences',
          duration: '15 min',
          difficulty: 'intermediate',
          type: 'logical',
          completed: false,
          xpReward: 75,
          objectives: [
            'Recognize numerical patterns',
            'Complete sequence patterns',
            'Identify pattern rules'
          ]
        }
      ]
    },
    {
      id: 'memory-enhancement',
      name: 'Memory Enhancement',
      description: 'Develop powerful memory techniques and mental exercises to improve recall and retention',
      icon: Brain,
      level: 2,
      progress: 40,
      benefits: [
        'Enhanced information retention',
        'Improved recall speed',
        'Better focus and concentration',
        'Stronger mental agility'
      ],
      relatedSkills: ['Analytical Ability', 'Critical Thinking'],
      exercises: [
        {
          id: 'num-seq-1',
          title: 'Number Sequence Memorization',
          description: 'Practice memorizing and recalling sequences of numbers using visualization techniques',
          duration: '15 min',
          difficulty: 'intermediate',
          type: 'memory',
          completed: false,
          xpReward: 100,
          objectives: [
            'Memorize sequences of 10+ digits',
            'Use visualization techniques',
            'Practice rapid recall'
          ]
        },
        {
          id: 'word-seq-1',
          title: 'Word Sequence Memory',
          description: 'Learn and practice memorizing sequences of related words',
          duration: '20 min',
          difficulty: 'intermediate',
          type: 'memory',
          completed: false,
          xpReward: 150,
          objectives: [
            'Memorize word sequences',
            'Create word associations',
            'Practice sequential recall'
          ]
        }
      ]
    },
    {
      id: 'mindfulness-meditation',
      name: 'Mindfulness & Meditation',
      description: 'Develop mental clarity, focus, and emotional balance through guided meditation practices',
      icon: Lightbulb,
      level: 1,
      progress: 30,
      benefits: [
        'Improved concentration',
        'Reduced stress and anxiety',
        'Enhanced mental clarity',
        'Better emotional regulation'
      ],
      relatedSkills: ['Memory Enhancement', 'Critical Thinking'],
      exercises: [
        {
          id: 'focus-1',
          title: 'Focused Breathing',
          description: 'Practice mindful breathing techniques to improve concentration and mental clarity',
          duration: '10 min',
          difficulty: 'beginner',
          type: 'meditation',
          completed: false,
          xpReward: 75,
          objectives: [
            'Master breath awareness',
            'Develop focused attention',
            'Practice mental stillness'
          ]
        },
        {
          id: 'mindful-1',
          title: 'Study Session Meditation',
          description: 'Guided meditation specifically designed to enhance learning and retention',
          duration: '15 min',
          difficulty: 'beginner',
          type: 'meditation',
          completed: false,
          xpReward: 100,
          objectives: [
            'Prepare mind for learning',
            'Enhance focus and retention',
            'Reduce study anxiety'
          ]
        }
      ]
    },
    {
      id: 'analytical-ability',
      name: 'Analytical Ability',
      description: 'Develop skills to break down complex information and draw meaningful conclusions',
      icon: Target,
      level: 2,
      progress: 45,
      benefits: [
        'Enhanced data interpretation',
        'Better problem decomposition',
        'Improved decision analysis',
        'Stronger research skills'
      ],
      prerequisites: ['Basic Mathematics', 'Logical Reasoning Basics'],
      relatedSkills: ['Logical Reasoning', 'Critical Thinking'],
      exercises: [
        {
          id: 'aa-1',
          title: 'Data Interpretation',
          description: 'Analyze graphs, charts, and tables to extract insights',
          duration: '25 min',
          difficulty: 'advanced',
          type: 'simulation',
          completed: false,
          xpReward: 150,
          objectives: [
            'Read and interpret graphs',
            'Analyze statistical data',
            'Draw conclusions from data'
          ],
          requirements: [
            'Basic understanding of statistics',
            'Knowledge of graph types'
          ]
        },
        {
          id: 'aa-2',
          title: 'Case Study Analysis',
          description: 'Practice analyzing real-world scenarios and making decisions',
          duration: '30 min',
          difficulty: 'intermediate',
          type: 'challenge',
          completed: false,
          xpReward: 200,
          objectives: [
            'Identify key issues',
            'Analyze multiple factors',
            'Propose solutions'
          ]
        }
      ]
    },
    {
      id: 'critical-thinking',
      name: 'Critical Thinking',
      description: 'Learn to evaluate information objectively and make reasoned judgments',
      icon: Lightbulb,
      level: 4,
      progress: 75,
      benefits: [
        'Better argument evaluation',
        'Improved decision making',
        'Enhanced problem analysis',
        'Stronger reasoning skills'
      ],
      relatedSkills: ['Logical Reasoning', 'Analytical Ability'],
      exercises: [
        {
          id: 'ct-1',
          title: 'Argument Analysis',
          description: 'Identify and evaluate arguments and logical fallacies',
          duration: '20 min',
          difficulty: 'intermediate',
          type: 'practice',
          completed: true,
          xpReward: 100,
          objectives: [
            'Identify argument components',
            'Recognize logical fallacies',
            'Evaluate argument strength'
          ]
        },
        {
          id: 'ct-2',
          title: 'Problem Solving',
          description: 'Solve complex problems using critical thinking frameworks',
          duration: '25 min',
          difficulty: 'advanced',
          type: 'simulation',
          completed: false,
          xpReward: 150,
          objectives: [
            'Apply problem-solving frameworks',
            'Analyze complex situations',
            'Develop solutions'
          ]
        }
      ]
    },
    {
      id: 'writing-skills',
      name: 'Writing Skills',
      description: 'Improve your ability to express ideas clearly and effectively in writing',
      icon: PenTool,
      level: 3,
      progress: 55,
      benefits: [
        'Better communication skills',
        'Improved essay writing',
        'Enhanced answer presentation',
        'Stronger argumentation'
      ],
      relatedSkills: ['Critical Thinking', 'Analytical Ability'],
      exercises: [
        {
          id: 'ws-1',
          title: 'Essay Structure',
          description: 'Practice organizing ideas and writing well-structured essays',
          duration: '30 min',
          difficulty: 'intermediate',
          type: 'practice',
          completed: false,
          xpReward: 125,
          objectives: [
            'Create effective introductions',
            'Develop coherent paragraphs',
            'Write strong conclusions'
          ]
        },
        {
          id: 'ws-2',
          title: 'Answer Writing',
          description: 'Learn techniques for writing effective exam answers',
          duration: '25 min',
          difficulty: 'advanced',
          type: 'challenge',
          completed: true,
          xpReward: 175,
          objectives: [
            'Structure answers effectively',
            'Present arguments clearly',
            'Manage time efficiently'
          ]
        }
      ]
    }
  ];

  const handleStartExercise = (exercise: Exercise) => {
    navigate(`/skills/exercise/${exercise.id}`);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (difficultyFilter === 'all') return matchesSearch;
    
    return matchesSearch && skill.exercises.some(ex => ex.difficulty === difficultyFilter);
  });

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">Skills Development</h1>
            <p className="text-lg opacity-90">Build and enhance your core competencies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span>Skills Mastered</span>
              </div>
              <div className="text-2xl font-bold">4/12</div>
              <div className="text-sm opacity-80">+2 this month</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5" />
                <span>Memory Score</span>
              </div>
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm opacity-80">+15% improvement</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span>Practice Hours</span>
              </div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm opacity-80">This week</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                <span>Achievements</span>
              </div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-80">3 new unlocked</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text -1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              />
            </div>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map(skill => (
            <div key={skill.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 relative overflow-hidden">
                <div 
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"
                />
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    skill.type === 'test' 
                      ? 'bg-[#094d88]/10 text-[#094d88]' 
                      : 'bg-[#10ac8b]/10 text-[#10ac8b]'
                  }`}>
                    {skill.type === 'test' ? <Target className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Level {skill.level}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{skill.description}</p>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {skill.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div key={`dot-${index}`} className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites if any */}
                {skill.prerequisites && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.prerequisites.map((prereq, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{skill.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {skill.exercises.map(exercise => (
                    <button
                      onClick={() => handleStartExercise(exercise)}
                      className={`w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          exercise.completed 
                            ? 'bg-[#10ac8b]/10 text-[#10ac8b]' 
                            : 'bg-[#094d88]/10 text-[#094d88]'
                        } transition-colors`}>
                          {exercise.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{exercise.title}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {exercise.duration}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Zap className="w-4 h-4" />
                          {exercise.xpReward} XP
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#094d88] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Related Skills */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Related Skills</h4>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {skill.relatedSkills.map((relatedSkill, index) => (
                      <span
                        key={`related-${index}`}
                        className="px-3 py-1 bg-[#094d88]/10 text-[#094d88] rounded-full text-sm hover:bg-[#094d88]/20 transition-colors cursor-pointer"
                      >
                        {relatedSkill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}