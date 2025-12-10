import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  FileText,
  Code,
  Calculator,
  BookOpen,
  Brain,
  Lightbulb,
  Zap,
  Flag,
  Star,
  Timer,
  BarChart3,
  RefreshCw,
  Archive,
  Tag,
  Users,
  MessageSquare,
  Paperclip,
  Image as ImageIcon,
  Video,
  Link,
  CheckSquare,
  Square,
  List,
  Grid,
  Kanban,
  SortAsc,
  SortDesc,
  MoreVertical,
  Bell,
  BellOff,
  Repeat,
  ArrowRight,
  ArrowUp,
  Sparkles,
  XCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'assignment' | 'revision' | 'project' | 'quiz';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: Date;
  estimatedTime: number; // in minutes
  actualTime?: number;
  points: number;
  completedAt?: Date;
  attachments?: Attachment[];
  subtasks?: Subtask[];
  tags: string[];
  isRecurring?: boolean;
  recurringPattern?: string;
  reminder?: Date;
  notes?: string;
  resources?: Resource[];
  dependencies?: string[]; // IDs of tasks that must be completed first
  progress?: number; // 0-100
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'link';
  url: string;
  size?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'website' | 'tool';
  url: string;
  icon: any;
}

interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: any;
  count: number;
}

interface DailyProgress {
  date: Date;
  completed: number;
  total: number;
  points: number;
}

export function TasksPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'difficulty'>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample tasks data
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Complete Mauryan Empire Timeline',
      description: 'Create a comprehensive timeline of the Mauryan Empire including major rulers, battles, and administrative changes.',
      type: 'assignment',
      subject: 'History',
      topic: 'Ancient Indian History',
      difficulty: 'medium',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedTime: 45,
      points: 20,
      subtasks: [
        { id: '1-1', title: 'Research Chandragupta Maurya\'s reign', completed: true, completedAt: new Date() },
        { id: '1-2', title: 'Document Ashoka\'s major edicts', completed: true, completedAt: new Date() },
        { id: '1-3', title: 'Map territorial expansions', completed: false },
        { id: '1-4', title: 'Create visual timeline', completed: false }
      ],
      tags: ['history', 'mauryan-empire', 'timeline'],
      progress: 50,
      resources: [
        { id: 'r1', title: 'NCERT History Chapter', type: 'document', url: '#', icon: FileText },
        { id: 'r2', title: 'Mauryan Empire Video', type: 'video', url: '#', icon: Video }
      ]
    },
    {
      id: '2',
      title: 'Practice Integration Problems',
      description: 'Solve 10 integration problems from the exercise set, focusing on substitution and partial fractions.',
      type: 'practice',
      subject: 'Mathematics',
      topic: 'Calculus - Integration',
      difficulty: 'hard',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedTime: 60,
      points: 15,
      tags: ['math', 'calculus', 'integration'],
      resources: [
        { id: 'r3', title: 'Integration Formulas', type: 'document', url: '#', icon: Calculator },
        { id: 'r4', title: 'Problem Solving Guide', type: 'website', url: '#', icon: Link }
      ]
    },
    {
      id: '3',
      title: 'Daily Revision: Physics Concepts',
      description: 'Review Newton\'s Laws of Motion and solve 5 application problems.',
      type: 'revision',
      subject: 'Physics',
      topic: 'Mechanics',
      difficulty: 'easy',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(),
      estimatedTime: 30,
      actualTime: 25,
      points: 10,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['physics', 'revision', 'newton-laws'],
      isRecurring: true,
      recurringPattern: 'daily'
    },
    {
      id: '4',
      title: 'Group Project: Economic Analysis',
      description: 'Analyze the economic impact of demonetization in India with your team.',
      type: 'project',
      subject: 'Economics',
      topic: 'Indian Economy',
      difficulty: 'hard',
      priority: 'urgent',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedTime: 180,
      points: 50,
      subtasks: [
        { id: '4-1', title: 'Data collection', completed: true, completedAt: new Date() },
        { id: '4-2', title: 'Statistical analysis', completed: false },
        { id: '4-3', title: 'Report writing', completed: false },
        { id: '4-4', title: 'Presentation preparation', completed: false }
      ],
      tags: ['economics', 'project', 'team-work'],
      progress: 25,
      attachments: [
        { id: 'a1', name: 'Research_Data.xlsx', type: 'document', url: '#', size: '2.4 MB' }
      ]
    },
    {
      id: '5',
      title: 'Chemistry Lab Report',
      description: 'Write a detailed lab report on the titration experiment conducted in class.',
      type: 'assignment',
      subject: 'Chemistry',
      topic: 'Analytical Chemistry',
      difficulty: 'medium',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedTime: 90,
      points: 25,
      tags: ['chemistry', 'lab-report', 'titration'],
      dependencies: ['3']
    }
  ];

  useEffect(() => {
    setTasks(sampleTasks);
  }, []);

  const taskCategories: TaskCategory[] = [
    { id: 'practice', name: 'Practice', color: 'bg-blue-500', icon: Brain, count: tasks.filter(t => t.type === 'practice').length },
    { id: 'assignment', name: 'Assignments', color: 'bg-green-500', icon: FileText, count: tasks.filter(t => t.type === 'assignment').length },
    { id: 'revision', name: 'Revision', color: 'bg-purple-500', icon: RefreshCw, count: tasks.filter(t => t.type === 'revision').length },
    { id: 'project', name: 'Projects', color: 'bg-orange-500', icon: Users, count: tasks.filter(t => t.type === 'project').length },
    { id: 'quiz', name: 'Quizzes', color: 'bg-pink-500', icon: Target, count: tasks.filter(t => t.type === 'quiz').length }
  ];

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-700', icon: '○' },
    medium: { color: 'bg-yellow-100 text-yellow-700', icon: '◐' },
    high: { color: 'bg-orange-100 text-orange-700', icon: '●' },
    urgent: { color: 'bg-red-100 text-red-700', icon: '🔥' }
  };

  const difficultyConfig = {
    easy: { color: 'text-green-600', stars: 1 },
    medium: { color: 'text-yellow-600', stars: 2 },
    hard: { color: 'text-red-600', stars: 3 }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'completed' ? undefined : new Date(),
            actualTime: task.status === 'completed' ? undefined : task.estimatedTime
          }
        : task
    ));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed, completedAt: !subtask.completed ? new Date() : undefined }
            : subtask
        );
        const progress = Math.round((updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100);
        return { ...task, subtasks: updatedSubtasks, progress };
      }
      return task;
    }));
  };

  const handleCreateTask = (taskData: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      tags: taskData.tags.split(',').map((t: string) => t.trim()),
      subtasks: [],
      progress: 0
    };
    setTasks([newTask, ...tasks]);
    setShowNewTaskModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || task.type === filterBy;
    const matchesCategory = selectedCategory === 'all' || task.type === selectedCategory;
    const matchesCompleted = showCompleted || task.status !== 'completed';
    
    return matchesSearch && matchesFilter && matchesCategory && matchesCompleted;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'difficulty':
        const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const getTaskStats = () => {
    const today = new Date();
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.status === 'overdue' || (t.dueDate < today && t.status !== 'completed')).length;
    const totalPoints = tasks.reduce((sum, t) => sum + (t.status === 'completed' ? t.points : 0), 0);
    
    return { completed, pending, overdue, totalPoints };
  };

  const stats = getTaskStats();

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diff < 0) return 'Overdue';
    if (days === 0) return `${hours}h remaining`;
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const getWeeklyProgress = (): DailyProgress[] => {
    const progress: DailyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(t => {
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
      progress.push({
        date,
        completed: dayTasks.filter(t => t.status === 'completed').length,
        total: dayTasks.length,
        points: dayTasks.reduce((sum, t) => sum + (t.status === 'completed' ? t.points : 0), 0)
      });
    }
    return progress;
  };

  return (
      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tasks & Assignments</h1>
              <p className="text-gray-600 mt-2">Day {dayNumber} - Manage your learning tasks</p>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completed}</p>
                  <p className="text-xs text-green-600 mt-1">+3 today</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">Due this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.overdue}</p>
                  <p className="text-xs text-red-600 mt-1">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPoints}</p>
                  <p className="text-xs text-purple-600 mt-1">Keep it up!</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Weekly Progress</h3>
            <div className="flex items-end gap-2 h-32">
              {getWeeklyProgress().map((day, index) => {
                const height = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-lg transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {day.date.toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                    <p className="text-xs font-medium text-gray-800">
                      {day.completed}/{day.total}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters and View Options */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="all">All Types</option>
                  <option value="practice">Practice</option>
                  <option value="assignment">Assignments</option>
                  <option value="revision">Revision</option>
                  <option value="project">Projects</option>
                  <option value="quiz">Quizzes</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="difficulty">Difficulty</option>
                </select>

                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showCompleted
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CheckSquare className="w-5 h-5" />
                </button>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 ${viewMode === 'kanban' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Kanban className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Task Categories */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {taskCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    selectedCategory === category.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-white border border-gray-200 hover:border-brand-primary'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                  }`} />
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs opacity-80 mt-1">{category.count} tasks</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {sortedTasks.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No tasks found</h3>
                <p className="text-gray-600">Create your first task to get started</p>
              </div>
            ) : (
              sortedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl p-6 border ${
                    task.status === 'completed' ? 'border-gray-200 opacity-75' : 'border-gray-200'
                  } hover:border-brand-primary/30 transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-1 ${
                        task.status === 'completed' ? 'text-green-600' : 'text-gray-400 hover:text-brand-primary'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold text-gray-800 ${
                            task.status === 'completed' ? 'line-through' : ''
                          }`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Subtasks */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">Progress</p>
                            <p className="text-sm text-gray-600">{task.progress}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <div className="space-y-2">
                            {task.subtasks.map(subtask => (
                              <label
                                key={subtask.id}
                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                  onChange={() => handleToggleSubtask(task.id, subtask.id)}
                                  className="w-4 h-4 text-brand-primary rounded"
                                />
                                <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                                  {subtask.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority].color}`}>
                          {priorityConfig[task.priority].icon} {task.priority}
                        </span>
                        
                        <span className="flex items-center gap-1 text-gray-600">
                          {[...Array(difficultyConfig[task.difficulty].stars)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 fill-current ${difficultyConfig[task.difficulty].color}`} />
                          ))}
                        </span>

                        <span className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {task.estimatedTime}m
                        </span>

                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDueDate(task.dueDate)}
                        </span>

                        <span className="flex items-center gap-1 text-gray-600">
                          <Award className="w-4 h-4" />
                          {task.points} pts
                        </span>

                        {task.isRecurring && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Repeat className="w-4 h-4" />
                            {task.recurringPattern}
                          </span>
                        )}

                        <div className="flex-1" />
                        
                        <div className="flex gap-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      {task.resources && task.resources.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {task.resources.map(resource => {
                            const Icon = resource.icon;
                            return (
                              <a
                                key={resource.id}
                                href={resource.url}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {resource.title}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-xl p-6 border ${
                  task.status === 'completed' ? 'border-gray-200 opacity-75' : 'border-gray-200'
                } hover:border-brand-primary/30 transition-all cursor-pointer`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(task.id);
                    }}
                    className={`${
                      task.status === 'completed' ? 'text-green-600' : 'text-gray-400 hover:text-brand-primary'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority].color}`}>
                    {task.priority}
                  </span>
                </div>

                <h3 className={`font-semibold text-gray-800 mb-2 ${
                  task.status === 'completed' ? 'line-through' : ''
                }`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                {task.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600">Progress</p>
                      <p className="text-xs font-medium text-gray-700">{task.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-1.5 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {formatDueDate(task.dueDate)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Award className="w-4 h-4" />
                    {task.points} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['pending', 'in-progress', 'completed', 'overdue'].map(status => (
              <div key={status} className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4 capitalize flex items-center justify-between">
                  {status.replace('-', ' ')}
                  <span className="text-sm font-normal text-gray-600">
                    {sortedTasks.filter(t => t.status === status).length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {sortedTasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setSelectedTask(task)}
                      >
                        <h4 className="font-medium text-gray-800 mb-2 text-sm">{task.title}</h4>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full ${priorityConfig[task.priority].color}`}>
                            {task.priority}
                          </span>
                          <span className="text-gray-600">
                            {task.points} pts
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Task Modal */}
        <AnimatePresence>
          {showNewTaskModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewTaskModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
                  <p className="text-gray-600 mt-1">Add a new task to your learning schedule</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCreateTask({
                      title: formData.get('title'),
                      description: formData.get('description'),
                      type: formData.get('type'),
                      subject: formData.get('subject'),
                      topic: formData.get('topic'),
                      difficulty: formData.get('difficulty'),
                      priority: formData.get('priority'),
                      dueDate: new Date(formData.get('dueDate') as string),
                      estimatedTime: parseInt(formData.get('estimatedTime') as string),
                      points: parseInt(formData.get('points') as string),
                      tags: formData.get('tags') as string
                    });
                  }}
                  className="p-6 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="Task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="Task details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        name="type"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        <option value="practice">Practice</option>
                        <option value="assignment">Assignment</option>
                        <option value="revision">Revision</option>
                        <option value="project">Project</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="e.g. Mathematics"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        name="priority"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="datetime-local"
                        name="dueDate"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      <input
                        type="text"
                        name="topic"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="e.g. Calculus"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Est. Time (min)</label>
                      <input
                        type="number"
                        name="estimatedTime"
                        required
                        min="5"
                        step="5"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                      <input
                        type="number"
                        name="points"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="e.g. math, homework, chapter-5"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors"
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTaskModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedTask(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedTask.title}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[selectedTask.priority].color}`}>
                          {selectedTask.priority}
                        </span>
                        <span className="text-sm text-gray-600">{selectedTask.subject} • {selectedTask.topic}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Due Date</p>
                      <p className="font-medium text-gray-800">
                        {selectedTask.dueDate.toLocaleDateString()} at {selectedTask.dueDate.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Time Required</p>
                      <p className="font-medium text-gray-800">{selectedTask.estimatedTime} minutes</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                      <div className="flex items-center gap-1">
                        {[...Array(difficultyConfig[selectedTask.difficulty].stars)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 fill-current ${difficultyConfig[selectedTask.difficulty].color}`} />
                        ))}
                        <span className="ml-2 font-medium text-gray-800 capitalize">{selectedTask.difficulty}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Points</p>
                      <p className="font-medium text-gray-800">{selectedTask.points} points</p>
                    </div>
                  </div>

                  {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Subtasks</h3>
                      <div className="space-y-2">
                        {selectedTask.subtasks.map(subtask => (
                          <label
                            key={subtask.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => handleToggleSubtask(selectedTask.id, subtask.id)}
                              className="w-5 h-5 text-brand-primary rounded"
                            />
                            <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {subtask.title}
                            </span>
                            {subtask.completedAt && (
                              <span className="text-xs text-gray-500">
                                Completed {subtask.completedAt.toLocaleDateString()}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTask.resources && selectedTask.resources.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedTask.resources.map(resource => {
                          const Icon = resource.icon;
                          return (
                            <a
                              key={resource.id}
                              href={resource.url}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Icon className="w-5 h-5 text-gray-600" />
                              <span className="text-gray-800">{resource.title}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-6">
                    {selectedTask.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleToggleTask(selectedTask.id);
                        setSelectedTask(null);
                      }}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                        selectedTask.status === 'completed'
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          : 'bg-brand-primary text-white hover:bg-brand-secondary'
                      }`}
                    >
                      {selectedTask.status === 'completed' ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                    <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}