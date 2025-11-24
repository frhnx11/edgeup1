import { useState, useEffect } from 'react';
import { Search, Star, Info, Sparkles, TrendingUp, Zap, BookOpen, Video, MessageSquare, BarChart, Shield, ClipboardList, GraduationCap } from 'lucide-react';
import CustomCertificateForm from './CustomCertificateForm';
import ZoomMeetingForm from './ZoomMeetingForm';
import { AssignmentPage } from './AssignmentPage';
import { ChoicePage } from './ChoicePage';
import { FeedbackPage } from './FeedbackPage';
import { SecureViewerPage } from './SecureViewerPage';
import { QuizPage } from './QuizPage';
import { InteractiveContentPage } from './InteractiveContentPage';
import { ChatPage } from './ChatPage';

// Define the activity resource interface
export interface ActivityResource {
  id: string;
  title: string;
  type: 'activity' | 'resource';
  icon: string;
  recommended?: boolean;
}

// Define the props for the modal component
interface ActivityResourceModalProps {}

export function ActivityResourceModal({}: ActivityResourceModalProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<ActivityResource[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [showCustomCertificate, setShowCustomCertificate] = useState(false);
  const [showZoomMeeting, setShowZoomMeeting] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSecureViewer, setShowSecureViewer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showInteractiveContent, setShowInteractiveContent] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Activity resource data with enhanced metadata - only items with connected pages
  const activityResources: ActivityResource[] = [
    { id: '1', title: 'Assignment', type: 'activity', icon: 'assignment', recommended: true },
    { id: '4', title: 'Chat', type: 'activity', icon: 'chat' },
    { id: '5', title: 'Choice', type: 'activity', icon: 'choice' },
    { id: '6', title: 'Custom certificate', type: 'resource', icon: 'certificate' },
    { id: '7', title: 'Feedback', type: 'activity', icon: 'feedback' },
    { id: '12', title: 'Interactive Content', type: 'resource', icon: 'interactive' },
    { id: '16', title: 'Quiz', type: 'activity', icon: 'quiz', recommended: true },
    { id: '17', title: 'Secure Viewer', type: 'resource', icon: 'secure' },
    { id: '20', title: 'Zoom meeting', type: 'activity', icon: 'zoom', recommended: true }
  ];

  // Icon mapping for each activity/resource
  const iconMap: { [key: string]: any } = {
    assignment: ClipboardList,
    chat: MessageSquare,
    choice: BarChart,
    certificate: GraduationCap,
    feedback: Star,
    interactive: Zap,
    quiz: ClipboardList,
    secure: Shield,
    zoom: Video
  };

  // Color mapping for different types
  const colorMap: { [key: string]: string } = {
    assignment: 'from-blue-400 to-blue-600',
    chat: 'from-pink-400 to-pink-600',
    choice: 'from-orange-400 to-orange-600',
    certificate: 'from-yellow-400 to-yellow-600',
    feedback: 'from-red-400 to-red-600',
    interactive: 'from-emerald-400 to-emerald-600',
    quiz: 'from-rose-400 to-rose-600',
    secure: 'from-lime-400 to-lime-600',
    zoom: 'from-red-500 to-orange-500'
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('activityFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('activityFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter items based on active tab and search query
  useEffect(() => {
    setAnimateCards(false);
    setTimeout(() => {
      let filtered = [...activityResources];
      
      // Filter by tab
      if (activeTab === 'activities') {
        filtered = filtered.filter(item => item.type === 'activity');
      } else if (activeTab === 'resources') {
        filtered = filtered.filter(item => item.type === 'resource');
      } else if (activeTab === 'recommended') {
        filtered = filtered.filter(item => item.recommended);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query)
        );
      }
      
      setFilteredItems(filtered);
      setAnimateCards(true);
    }, 100);
  }, [activeTab, searchQuery]);

  // Toggle favorite status for an item
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  // Show Custom Certificate Form if selected
  if (showCustomCertificate) {
    return <CustomCertificateForm onCancel={() => setShowCustomCertificate(false)} />;
  }

  // Show Zoom Meeting Form if selected
  if (showZoomMeeting) {
    return <ZoomMeetingForm onCancel={() => setShowZoomMeeting(false)} />;
  }

  // Show Assignment Page if selected
  if (showAssignment) {
    return <AssignmentPage onCancel={() => setShowAssignment(false)} />;
  }

  // Show Choice Page if selected
  if (showChoice) {
    return <ChoicePage onCancel={() => setShowChoice(false)} />;
  }

  // Show Feedback Page if selected
  if (showFeedback) {
    return <FeedbackPage onCancel={() => setShowFeedback(false)} />;
  }

  // Show Secure Viewer Page if selected
  if (showSecureViewer) {
    return <SecureViewerPage onCancel={() => setShowSecureViewer(false)} />;
  }

  // Show Quiz Page if selected
  if (showQuiz) {
    return <QuizPage onCancel={() => setShowQuiz(false)} />;
  }

  // Show Interactive Content Page if selected
  if (showInteractiveContent) {
    return <InteractiveContentPage onCancel={() => setShowInteractiveContent(false)} />;
  }

  // Show Chat Page if selected
  if (showChat) {
    return <ChatPage onCancel={() => setShowChat(false)} />;
  }

  // Always render the component when used in ActivityPage
  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Enhanced Page Header with gradient */}
      <div className="px-6 py-8 bg-gradient-to-r from-brand-primary to-brand-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Activity & Resources Hub</h1>
          </div>
          <p className="text-white/90 mt-2 text-lg">Create engaging content and interactive learning experiences for your students</p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredItems.length} items available</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Star className="w-4 h-4 fill-current" />
              <span>{favorites.length} favorites</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Search Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search activities and resources..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search activities and resources"
            role="searchbox"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Enhanced Tabs with Icons */}
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Filter activities and resources">
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'all'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('all')}
            aria-label="Show all items"
            aria-pressed={activeTab === 'all'}
            role="tab"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">All Items</span>
              <span className="sm:hidden">All</span>
            </span>
          </button>
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'activities'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('activities')}
            aria-label="Show activities only"
            aria-pressed={activeTab === 'activities'}
            role="tab"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Zap className="w-4 h-4" />
              Activities
            </span>
          </button>
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'resources'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('resources')}
            aria-label="Show resources only"
            aria-pressed={activeTab === 'resources'}
            role="tab"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <BookOpen className="w-4 h-4" />
              Resources
            </span>
          </button>
          <button
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              activeTab === 'recommended'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('recommended')}
            aria-label="Show recommended items"
            aria-pressed={activeTab === 'recommended'}
            role="tab"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Recommended</span>
              <span className="sm:hidden">Featured</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Enhanced Grid of Cards */}
      <div className="p-6 overflow-y-auto flex-grow">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary ${
                  animateCards ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{
                  animationDelay: animateCards ? `${index * 50}ms` : '0ms'
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  // Announce to screen readers
                  const announcement = `Adding ${item.title} to course`;
                  const ariaLive = document.createElement('div');
                  ariaLive.setAttribute('aria-live', 'polite');
                  ariaLive.setAttribute('aria-atomic', 'true');
                  ariaLive.className = 'sr-only';
                  ariaLive.textContent = announcement;
                  document.body.appendChild(ariaLive);
                  setTimeout(() => document.body.removeChild(ariaLive), 1000);
                if (item.title === 'Feedback') {
                  setShowFeedback(true);
                } else if (item.title === 'Secure Viewer') {
                  setShowSecureViewer(true);
                } else if (item.title === 'Choice') {
                  setShowChoice(true);
                } else if (item.title === 'Assignment') {
                  setShowAssignment(true);
                } else if (item.title === 'Custom certificate') {
                  setShowCustomCertificate(true);
                } else if (item.title === 'Zoom meeting') {
                  setShowZoomMeeting(true);
                } else if (item.title === 'Quiz') {
                  setShowQuiz(true);
                } else if (item.title === 'Interactive Content') {
                  setShowInteractiveContent(true);
                } else if (item.title === 'Chat') {
                  setShowChat(true);
                }
              }}
            >
              {/* Gradient background for icon */}
                <div className={`h-32 bg-gradient-to-br ${colorMap[item.icon]} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -inset-10 bg-white/10 rotate-45 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  </div>
                  
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {getIconComponent(item.icon)}
                  </div>
                  
                  {item.recommended && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full animate-pulse">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                    </div>
                  )}
                  
                  {/* Hover indicator */}
                  {hoveredItem === item.id && (
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 text-center animate-slideUp">
                      Click to add
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-center mb-1 group-hover:text-brand-primary transition-colors text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 text-center capitalize">
                    {item.type}
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                        favorites.includes(item.id)
                          ? 'bg-amber-100 text-amber-600 animate-bounce'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                      }`}
                      title={favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''} transition-transform duration-300`} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add tooltip or modal for more info
                      }}
                      className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 hover:text-gray-600 transition-all transform hover:scale-110"
                      title="More information"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex gap-4 sm:gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="font-semibold">{filteredItems.filter(item => item.type === 'activity').length}</span>
              <span className="hidden sm:inline">Activities</span>
              <span className="sm:hidden">Act.</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">{filteredItems.filter(item => item.type === 'resource').length}</span>
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Res.</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">{filteredItems.filter(item => item.recommended).length}</span>
              <span className="hidden sm:inline">Recommended</span>
              <span className="sm:hidden">Rec.</span>
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
            Click on any item to add it to your course
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations and accessibility styles
const styles = `
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
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-fadeInUp,
    .animate-slideUp {
      animation: none;
      opacity: 1;
      transform: none;
    }
    
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
