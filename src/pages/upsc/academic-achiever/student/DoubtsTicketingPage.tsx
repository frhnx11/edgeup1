import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Tag,
  Paperclip,
  Send,
  ChevronRight,
  ChevronDown,
  Star,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  Archive,
  MoreVertical,
  FileText,
  Image,
  Download,
  ExternalLink,
  Lightbulb,
  BookOpen,
  Brain,
  Code,
  Calculator,
  Globe,
  History,
  Zap,
  Flag,
  Reply,
  Forward,
  Bell,
  BellOff
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  assignee?: {
    name: string;
    avatar?: string;
    role: string;
  };
  responses: TicketResponse[];
  attachments?: Attachment[];
  tags: string[];
  upvotes: number;
  views: number;
  isFollowing: boolean;
  estimatedResolutionTime?: string;
}

interface TicketResponse {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: 'student' | 'faculty' | 'ai' | 'admin';
  };
  content: string;
  createdAt: Date;
  attachments?: Attachment[];
  isAccepted?: boolean;
  upvotes: number;
  downvotes: number;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

export function DoubtsTicketingPage() {
  const { courseId, dayNumber } = useParams();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'priority'>('recent');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = [
    { id: 'conceptual', name: 'Conceptual Doubts', icon: Brain, color: 'text-purple-600', count: 24 },
    { id: 'homework', name: 'Homework Help', icon: BookOpen, color: 'text-blue-600', count: 18 },
    { id: 'technical', name: 'Technical Issues', icon: Code, color: 'text-green-600', count: 12 },
    { id: 'exam', name: 'Exam Related', icon: FileText, color: 'text-orange-600', count: 31 },
    { id: 'general', name: 'General Queries', icon: MessageSquare, color: 'text-gray-600', count: 8 },
    { id: 'resources', name: 'Resource Requests', icon: Download, color: 'text-pink-600', count: 5 }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 
    'Geography', 'Economics', 'Political Science', 'Computer Science'
  ];

  // Sample tickets data
  const sampleTickets: Ticket[] = [
    {
      id: '1',
      title: 'Understanding the Mauryan Administrative System',
      description: 'I\'m having trouble understanding how the provincial administration worked in the Mauryan Empire. Can someone explain the hierarchy?',
      category: 'conceptual',
      subject: 'History',
      priority: 'medium',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      author: { name: 'John Doe', role: 'Student' },
      responses: [
        {
          id: '1',
          author: { name: 'AI Assistant', role: 'ai' },
          content: 'The Mauryan administrative system was hierarchical:\n\n1. **Central Level**: Emperor at the apex\n2. **Provincial Level**: Provinces (Pradesh) headed by Kumara or Aryaputra\n3. **District Level**: Districts (Ahara/Vishaya) under Vishayapati\n4. **Local Level**: Villages under Gramani\n\nWould you like me to elaborate on any specific level?',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          upvotes: 5,
          downvotes: 0
        }
      ],
      attachments: [],
      tags: ['mauryan-empire', 'administration', 'ancient-india'],
      upvotes: 12,
      views: 45,
      isFollowing: true,
      estimatedResolutionTime: '2 hours'
    },
    {
      id: '2',
      title: 'Need help with calculus integration problem',
      description: 'How do I solve ∫(x²+2x+1)/(x+1) dx? I\'ve tried substitution but getting stuck.',
      category: 'homework',
      subject: 'Mathematics',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      author: { name: 'Sarah Smith', role: 'Student' },
      assignee: { name: 'Prof. Johnson', role: 'Faculty' },
      responses: [
        {
          id: '2',
          author: { name: 'Prof. Johnson', role: 'faculty' },
          content: 'First, let\'s simplify the expression. Notice that x²+2x+1 = (x+1)². So we have:\n\n∫(x+1)²/(x+1) dx = ∫(x+1) dx\n\nCan you continue from here?',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          upvotes: 8,
          downvotes: 0,
          isAccepted: true
        }
      ],
      attachments: [],
      tags: ['calculus', 'integration', 'algebra'],
      upvotes: 20,
      views: 67,
      isFollowing: false
    }
  ];
  
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-700', icon: '●' },
    medium: { color: 'bg-yellow-100 text-yellow-700', icon: '●●' },
    high: { color: 'bg-orange-100 text-orange-700', icon: '●●●' },
    urgent: { color: 'bg-red-100 text-red-700', icon: '🔥' }
  };

  const statusConfig = {
    open: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
    'in-progress': { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    resolved: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    closed: { color: 'bg-gray-100 text-gray-700', icon: XCircle }
  };

  const handleCreateTicket = (ticketData: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...ticketData,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { name: 'Current User', role: 'Student' },
      responses: [],
      upvotes: 0,
      views: 0,
      isFollowing: true
    };
    
    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
  };

  const handleAddResponse = (ticketId: string, response: string) => {
    const newResponse: TicketResponse = {
      id: Date.now().toString(),
      author: { name: 'Current User', role: 'student' },
      content: response,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0
    };

    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, responses: [...ticket.responses, newResponse], updatedAt: new Date() }
        : ticket
    ));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular':
        return b.views - a.views;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      default:
        return 0;
    }
  });

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Doubts & Support</h1>
              <p className="text-gray-600 mt-2">Get help from faculty, AI, and your peers</p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ask a Question
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-gray-800">24</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-gray-800">12</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-800">2.5h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-800">94%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doubts and questions..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white border border-gray-200 hover:border-brand-primary'
              }`}
            >
              <p className="font-medium">All Categories</p>
              <p className="text-sm opacity-80 mt-1">{tickets.length} tickets</p>
            </button>
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedCategory === category.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-white border border-gray-200 hover:border-brand-primary'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${
                    selectedCategory === category.id ? 'text-white' : category.color
                  }`} />
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs opacity-80 mt-1">{category.count} tickets</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-4">
            {sortedTickets.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No tickets found</h3>
                <p className="text-gray-600">Try adjusting your filters or create a new ticket</p>
              </div>
            ) : (
              sortedTickets.map(ticket => {
                const StatusIcon = statusConfig[ticket.status].icon;
                const categoryInfo = categories.find(c => c.id === ticket.category);
                const CategoryIcon = categoryInfo?.icon || MessageSquare;
                
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-brand-primary/30 transition-all cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CategoryIcon className={`w-5 h-5 ${categoryInfo?.color}`} />
                          <h3 className="font-semibold text-gray-800 flex-1">{ticket.title}</h3>
                          {ticket.isFollowing && (
                            <Bell className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[ticket.priority].color}`}>
                            {ticket.priority}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[ticket.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {ticket.status}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {ticket.author.name}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {ticket.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {ticket.responses.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.views}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {ticket.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-3">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-medium">AI Quick Help</span>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Browse FAQs</span>
                </button>
                <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Join Study Group</span>
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['physics', 'calculus', 'history', 'chemistry', 'programming', 'biology', 'economics', 'literature'].map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: 'Prof. Johnson', role: 'Faculty', responses: 45 },
                  { name: 'Sarah Chen', role: 'TA', responses: 38 },
                  { name: 'Mike Wilson', role: 'Student', responses: 24 }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-medium">
                      {contributor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{contributor.name}</p>
                      <p className="text-xs text-gray-600">{contributor.role} • {contributor.responses} responses</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicketModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewTicketModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Ask a Question</h2>
                  <p className="text-gray-600 mt-1">Get help from faculty, AI, or your peers</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCreateTicket({
                      title: formData.get('title'),
                      description: formData.get('description'),
                      category: formData.get('category'),
                      subject: formData.get('subject'),
                      priority: formData.get('priority'),
                      tags: formData.get('tags')?.toString().split(',').map(t => t.trim()) || []
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
                      placeholder="Brief summary of your question..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="Provide more details about your question..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        name="subject"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        <option value="">Select subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      <option value="low">Low - Can wait a few days</option>
                      <option value="medium">Medium - Need help within 24 hours</option>
                      <option value="high">High - Need help today</option>
                      <option value="urgent">Urgent - Need immediate help</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="e.g. physics, mechanics, newton-laws"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag files here or click to browse</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-sm text-brand-primary hover:text-brand-secondary"
                      >
                        Select Files
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-secondary transition-colors"
                    >
                      Submit Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
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

        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedTicket(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTicket.title}</h2>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[selectedTicket.priority].color}`}>
                          {selectedTicket.priority}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[selectedTicket.status].color}`}>
                          {(() => {
                            const StatusIcon = statusConfig[selectedTicket.status].icon;
                            return <StatusIcon className="w-3 h-3" />;
                          })()}
                          {selectedTicket.status}
                        </span>
                        <span className="text-gray-500">
                          Asked by {selectedTicket.author.name} • {formatTimeAgo(selectedTicket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700">{selectedTicket.description}</p>
                  </div>

                  <div className="flex gap-2 mb-6">
                    {selectedTicket.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Responses */}
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-gray-800">Responses ({selectedTicket.responses.length})</h3>
                    
                    {selectedTicket.responses.map(response => (
                      <div key={response.id} className={`p-4 rounded-xl border ${
                        response.isAccepted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            response.author.role === 'ai' 
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                              : response.author.role === 'faculty'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                              : 'bg-gradient-to-br from-gray-500 to-gray-600'
                          } text-white font-medium`}>
                            {response.author.role === 'ai' ? <Bot className="w-5 h-5" /> : response.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800">{response.author.name}</span>
                                <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                                  {response.author.role}
                                </span>
                                {response.isAccepted && (
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Accepted Answer
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{formatTimeAgo(response.createdAt)}</span>
                            </div>
                            <div className="prose prose-sm max-w-none text-gray-700">
                              {response.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
                                <ThumbsUp className="w-4 h-4" />
                                {response.upvotes}
                              </button>
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600">
                                <ThumbsDown className="w-4 h-4" />
                                {response.downvotes}
                              </button>
                              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                                <Reply className="w-4 h-4" />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Response */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Add Your Response</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const response = formData.get('response')?.toString();
                        if (response) {
                          handleAddResponse(selectedTicket.id, response);
                          e.currentTarget.reset();
                        }
                      }}
                    >
                      <textarea
                        name="response"
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary mb-4"
                        placeholder="Type your response..."
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Post Response
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}