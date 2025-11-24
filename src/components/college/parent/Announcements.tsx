import { useState, useEffect } from 'react';

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  grade: number;
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
  url: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  shortPreview: string;
  category: 'academic' | 'administrative' | 'events' | 'emergency' | 'general';
  priority: 'high' | 'medium' | 'low';
  postedBy: string;
  postedByRole: string;
  postedDate: string;
  expiryDate?: string;
  targetGrades?: number[];
  targetClasses?: string[];
  isRead: boolean;
  isPinned: boolean;
  requiresAcknowledgment: boolean;
  isAcknowledged: boolean;
  attachments?: Attachment[];
  relatedIds?: string[];
}

interface AIAnnouncementInsight {
  type: 'priority' | 'deadline' | 'action' | 'summary';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  color: string;
  relatedIds?: string[];
}

interface AnnouncementStats {
  totalAnnouncements: number;
  unreadCount: number;
  priorityCount: number;
  expiringSoon: number;
}

type ViewMode = 'list' | 'grid' | 'pinned';
type FilterCategory = 'all' | 'academic' | 'administrative' | 'events' | 'emergency' | 'general';
type SortOption = 'latest' | 'oldest' | 'priority' | 'relevance';

const Announcements = () => {
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock data - Children
  const children: Child[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A', grade: 10 },
    { id: '2', name: 'Diya Sharma', class: '7', section: 'B', grade: 7 }
  ];

  const currentChild = children.find(c => c.id === selectedChild) || children[0];

  // Generate mock announcements
  const generateMockAnnouncements = (): Announcement[] => {
    const today = new Date();
    const getDateStr = (daysOffset: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysOffset);
      return date.toISOString();
    };

    const announcements: Announcement[] = [
      {
        id: '1',
        title: 'Mid-Term Examination Schedule Released',
        content: 'Dear Parents, The mid-term examination schedule for Classes 6-12 has been finalized. Exams will be conducted from November 15-25, 2025. Please ensure your child is well-prepared. Detailed timetable is attached.',
        shortPreview: 'Mid-term examination schedule for Classes 6-12 released. Exams from Nov 15-25.',
        category: 'academic',
        priority: 'high',
        postedBy: 'Dr. Rajesh Kumar',
        postedByRole: 'Academic Director',
        postedDate: getDateStr(1),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        targetGrades: [6, 7, 8, 9, 10, 11, 12],
        isRead: false,
        isPinned: true,
        requiresAcknowledgment: true,
        isAcknowledged: false,
        attachments: [
          { id: 'a1', name: 'Exam_Schedule_2025.pdf', type: 'pdf', size: '245 KB', url: '#' },
          { id: 'a2', name: 'Exam_Guidelines.pdf', type: 'pdf', size: '180 KB', url: '#' }
        ]
      },
      {
        id: '2',
        title: 'School Fees Payment Deadline - November 30th',
        content: 'This is a reminder that the school fees for the second term are due by November 30th, 2025. Please make the payment through the online portal or at the school office. Late payment will incur a penalty of Rs. 500.',
        shortPreview: 'Second term school fees due by November 30th. Pay online or at office.',
        category: 'administrative',
        priority: 'high',
        postedBy: 'Mrs. Priya Mehta',
        postedByRole: 'Finance Administrator',
        postedDate: getDateStr(2),
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        isRead: false,
        isPinned: true,
        requiresAcknowledgment: true,
        isAcknowledged: false,
        attachments: [
          { id: 'a3', name: 'Fee_Structure.pdf', type: 'pdf', size: '120 KB', url: '#' }
        ]
      },
      {
        id: '3',
        title: 'Annual Sports Day - December 10th',
        content: 'We are excited to announce our Annual Sports Day on December 10th, 2025. All students from Classes 1-12 will participate in various track and field events. Parents are cordially invited to attend. Please confirm your attendance by December 5th.',
        shortPreview: 'Annual Sports Day on December 10th. All classes participate. Parents invited.',
        category: 'events',
        priority: 'medium',
        postedBy: 'Mr. Amit Singh',
        postedByRole: 'Sports Coordinator',
        postedDate: getDateStr(3),
        isRead: true,
        isPinned: false,
        requiresAcknowledgment: false,
        isAcknowledged: false,
        attachments: [
          { id: 'a4', name: 'Sports_Day_Schedule.pdf', type: 'pdf', size: '350 KB', url: '#' },
          { id: 'a5', name: 'Event_Map.jpg', type: 'image', size: '1.2 MB', url: '#' }
        ]
      },
      {
        id: '4',
        title: 'Parent-Teacher Meeting - November 20th',
        content: 'Parent-Teacher Meeting is scheduled for November 20th, 2025, from 4:00 PM to 7:00 PM. This is an opportunity to discuss your child\'s academic progress and areas of improvement. Please book your time slot through the parent portal.',
        shortPreview: 'PTM on November 20th, 4-7 PM. Book your slot through parent portal.',
        category: 'academic',
        priority: 'medium',
        postedBy: 'Mrs. Sunita Verma',
        postedByRole: 'Principal',
        postedDate: getDateStr(4),
        targetGrades: [10],
        isRead: true,
        isPinned: false,
        requiresAcknowledgment: false,
        isAcknowledged: false
      },
      {
        id: '5',
        title: 'New COVID-19 Safety Protocols',
        content: 'In light of recent developments, we are implementing updated COVID-19 safety protocols. Masks are now mandatory in all indoor spaces. Temperature checks will be conducted at the school entrance. Students showing any symptoms should stay home.',
        shortPreview: 'Updated COVID-19 protocols: Masks mandatory indoors, temperature checks at entrance.',
        category: 'emergency',
        priority: 'high',
        postedBy: 'Dr. Kavita Sharma',
        postedByRole: 'Health & Safety Officer',
        postedDate: getDateStr(0),
        isRead: false,
        isPinned: true,
        requiresAcknowledgment: true,
        isAcknowledged: false
      },
      {
        id: '6',
        title: 'Science Exhibition - Call for Participants',
        content: 'The Science Department is organizing an inter-school Science Exhibition on December 15th. Students from Classes 8-12 interested in participating should submit their project proposals by November 25th. Top 3 projects will receive prizes and certificates.',
        shortPreview: 'Inter-school Science Exhibition on Dec 15th. Submit proposals by Nov 25th.',
        category: 'academic',
        priority: 'medium',
        postedBy: 'Prof. Vikram Patel',
        postedByRole: 'Science Head',
        postedDate: getDateStr(5),
        targetGrades: [8, 9, 10, 11, 12],
        isRead: true,
        isPinned: false,
        requiresAcknowledgment: false,
        isAcknowledged: false
      },
      {
        id: '7',
        title: 'School Uniform Update',
        content: 'Starting from January 2026, there will be a minor update to the school uniform. The new uniform design has been approved by the school management. Samples are available at the school office. Existing uniforms can be used until the end of this academic year.',
        shortPreview: 'School uniform update from Jan 2026. Samples available at office.',
        category: 'general',
        priority: 'low',
        postedBy: 'Mrs. Anjali Desai',
        postedByRole: 'Administration',
        postedDate: getDateStr(7),
        isRead: true,
        isPinned: false,
        requiresAcknowledgment: false,
        isAcknowledged: false
      },
      {
        id: '8',
        title: 'Winter Break Schedule',
        content: 'The school will be closed for winter break from December 24th, 2025 to January 5th, 2026. School will reopen on January 6th, 2026. We wish all students and parents a wonderful holiday season!',
        shortPreview: 'Winter break: Dec 24 - Jan 5. School reopens Jan 6, 2026.',
        category: 'general',
        priority: 'low',
        postedBy: 'Mrs. Sunita Verma',
        postedByRole: 'Principal',
        postedDate: getDateStr(10),
        isRead: true,
        isPinned: false,
        requiresAcknowledgment: false,
        isAcknowledged: false
      }
    ];

    return announcements.filter(ann =>
      !ann.targetGrades || ann.targetGrades.includes(currentChild.grade)
    );
  };

  const [announcements, setAnnouncements] = useState<Announcement[]>(generateMockAnnouncements());

  // Generate AI insights
  const generateAIInsights = (): AIAnnouncementInsight[] => {
    const insights: AIAnnouncementInsight[] = [];
    const today = new Date();

    // Priority announcements needing attention
    const unreadPriority = announcements.filter(a => !a.isRead && a.priority === 'high');
    if (unreadPriority.length > 0) {
      insights.push({
        type: 'priority',
        title: `${unreadPriority.length} High Priority Item${unreadPriority.length > 1 ? 's' : ''}`,
        description: `You have ${unreadPriority.length} unread high-priority announcement${unreadPriority.length > 1 ? 's' : ''} that need${unreadPriority.length === 1 ? 's' : ''} immediate attention.`,
        severity: 'critical',
        icon: 'fa-exclamation-circle',
        color: '#ef4444',
        relatedIds: unreadPriority.map(a => a.id)
      });
    }

    // Expiring soon announcements
    const expiringSoon = announcements.filter(a => {
      if (!a.expiryDate) return false;
      const daysUntilExpiry = (new Date(a.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
    });

    if (expiringSoon.length > 0) {
      insights.push({
        type: 'deadline',
        title: `${expiringSoon.length} Announcement${expiringSoon.length > 1 ? 's' : ''} Expiring Soon`,
        description: `${expiringSoon.length} announcement${expiringSoon.length > 1 ? 's expire' : ' expires'} within the next 3 days. Please review and take necessary action.`,
        severity: 'warning',
        icon: 'fa-clock',
        color: '#f59e0b',
        relatedIds: expiringSoon.map(a => a.id)
      });
    }

    // Action required (acknowledgment needed)
    const actionRequired = announcements.filter(a => a.requiresAcknowledgment && !a.isAcknowledged);
    if (actionRequired.length > 0) {
      insights.push({
        type: 'action',
        title: `${actionRequired.length} Action${actionRequired.length > 1 ? 's' : ''} Required`,
        description: `${actionRequired.length} announcement${actionRequired.length > 1 ? 's require' : ' requires'} your acknowledgment. Please review and acknowledge.`,
        severity: 'warning',
        icon: 'fa-check-circle',
        color: '#f59e0b',
        relatedIds: actionRequired.map(a => a.id)
      });
    }

    // All caught up
    if (announcements.filter(a => !a.isRead).length === 0) {
      insights.push({
        type: 'summary',
        title: 'All Caught Up!',
        description: 'You\'ve read all announcements. Check back later for new updates.',
        severity: 'info',
        icon: 'fa-check-double',
        color: '#10ac8b'
      });
    }

    return insights;
  };

  const [aiInsights, setAIInsights] = useState<AIAnnouncementInsight[]>(generateAIInsights());

  // Calculate stats
  const calculateStats = (): AnnouncementStats => {
    const today = new Date();
    return {
      totalAnnouncements: announcements.length,
      unreadCount: announcements.filter(a => !a.isRead).length,
      priorityCount: announcements.filter(a => a.priority === 'high' && !a.isRead).length,
      expiringSoon: announcements.filter(a => {
        if (!a.expiryDate) return false;
        const daysUntil = (new Date(a.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntil > 0 && daysUntil <= 3;
      }).length
    };
  };

  const [stats, setStats] = useState<AnnouncementStats>(calculateStats());

  // Update stats and insights when announcements change
  useEffect(() => {
    setStats(calculateStats());
    setAIInsights(generateAIInsights());
  }, [announcements]);

  // Filter and sort announcements
  const getFilteredAnnouncements = (): Announcement[] => {
    let filtered = announcements;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Unread only filter
    if (showUnreadOnly) {
      filtered = filtered.filter(a => !a.isRead);
    }

    // Pinned view
    if (viewMode === 'pinned') {
      filtered = filtered.filter(a => a.isPinned);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'oldest':
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'relevance':
          // Sort by: unread first, then pinned, then priority
          if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          const prioOrder = { high: 3, medium: 2, low: 1 };
          return prioOrder[b.priority] - prioOrder[a.priority];
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  const pinnedAnnouncements = announcements.filter(a => a.isPinned);

  // Helper functions
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      academic: '#094d88',
      administrative: '#f59e0b',
      events: '#8b5cf6',
      emergency: '#ef4444',
      general: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      academic: 'fa-graduation-cap',
      administrative: 'fa-file-alt',
      events: 'fa-calendar-star',
      emergency: 'fa-exclamation-triangle',
      general: 'fa-info-circle'
    };
    return icons[category] || 'fa-bullhorn';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="priority-badge high"><i className="fas fa-exclamation-circle"></i> High Priority</span>;
      case 'medium':
        return <span className="priority-badge medium"><i className="fas fa-circle"></i> Medium</span>;
      case 'low':
        return <span className="priority-badge low"><i className="fas fa-circle"></i> Low</span>;
      default:
        return null;
    }
  };

  const getRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileIcon = (type: string): string => {
    switch (type) {
      case 'pdf':
        return 'fa-file-pdf';
      case 'image':
        return 'fa-file-image';
      case 'doc':
        return 'fa-file-word';
      default:
        return 'fa-file';
    }
  };

  // Action handlers
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = announcements.map(a =>
      a.id === id ? { ...a, isRead: !a.isRead } : a
    );
    setAnnouncements(updated);
    const announcement = announcements.find(a => a.id === id);
    showToastNotification(`Marked as ${announcement?.isRead ? 'unread' : 'read'}`);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = announcements.map(a =>
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    );
    setAnnouncements(updated);
    const announcement = announcements.find(a => a.id === id);
    showToastNotification(`${announcement?.isPinned ? 'Unpinned' : 'Pinned'} announcement`);
  };

  const handleMarkAllRead = () => {
    const updated = announcements.map(a => ({ ...a, isRead: true }));
    setAnnouncements(updated);
    showToastNotification('All announcements marked as read');
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
    if (!announcement.isRead) {
      const updated = announcements.map(a =>
        a.id === announcement.id ? { ...a, isRead: true } : a
      );
      setAnnouncements(updated);
    }
  };

  const handleAcknowledge = () => {
    if (!selectedAnnouncement) return;
    const updated = announcements.map(a =>
      a.id === selectedAnnouncement.id ? { ...a, isAcknowledged: true } : a
    );
    setAnnouncements(updated);
    setSelectedAnnouncement({ ...selectedAnnouncement, isAcknowledged: true });
    showToastNotification('Acknowledgment recorded');
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    showToastNotification(`Downloading ${attachment.name}...`);
    // In real app, trigger actual download
  };

  const handleInsightClick = (insight: AIAnnouncementInsight) => {
    if (insight.relatedIds && insight.relatedIds.length > 0) {
      const firstAnnouncement = announcements.find(a => a.id === insight.relatedIds![0]);
      if (firstAnnouncement) {
        handleAnnouncementClick(firstAnnouncement);
      }
    }
  };

  return (
    <div className="parent-announcements-page">
      {/* Header Section */}
      <div className="announcements-header">
        <div className="header-top-row-announcements">
          <div className="child-selector-announcements">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - Class {child.class}{child.section}
                </option>
              ))}
            </select>
          </div>

          <div className="view-mode-toggle-announcements">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
              List
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'pinned' ? 'active' : ''}`}
              onClick={() => setViewMode('pinned')}
            >
              <i className="fas fa-thumbtack"></i>
              Pinned
            </button>
          </div>

          <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
            <i className="fas fa-check-double"></i>
            Mark All Read
          </button>
        </div>

        <div className="header-bottom-row-announcements">
          <div className="category-filters-announcements">
            {(['all', 'academic', 'administrative', 'events', 'emergency', 'general'] as FilterCategory[]).map(cat => (
              <button
                key={cat}
                className={`filter-chip-announcements ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={selectedCategory === cat ? { borderColor: getCategoryColor(cat), color: getCategoryColor(cat) } : {}}
              >
                <i className={`fas ${cat === 'all' ? 'fa-globe' : getCategoryIcon(cat)}`}></i>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="search-controls-announcements">
            <div className="search-wrapper-announcements">
              <div className="search-box-announcements">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn-announcements" onClick={() => setSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="search-results-count-announcements">
                  {filteredAnnouncements.length} result{filteredAnnouncements.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>

            <div className="filter-controls-announcements">
              <label className="checkbox-label-announcements">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                />
                <span>Unread Only</span>
              </label>

              <select className="sort-select-announcements" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="relevance">By Relevance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="announcements-stats-grid">
        <div className="stat-card-announcements total">
          <div className="stat-icon-announcements">
            <i className="fas fa-bullhorn"></i>
          </div>
          <div className="stat-content-announcements">
            <span className="stat-label-announcements">Total Announcements</span>
            <span className="stat-value-announcements">{stats.totalAnnouncements}</span>
          </div>
        </div>

        <div className="stat-card-announcements unread">
          <div className="stat-icon-announcements">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content-announcements">
            <span className="stat-label-announcements">Unread</span>
            <span className="stat-value-announcements">{stats.unreadCount}</span>
          </div>
        </div>

        <div className="stat-card-announcements priority">
          <div className="stat-icon-announcements">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-content-announcements">
            <span className="stat-label-announcements">High Priority</span>
            <span className="stat-value-announcements">{stats.priorityCount}</span>
          </div>
        </div>

        <div className="stat-card-announcements expiring">
          <div className="stat-icon-announcements">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content-announcements">
            <span className="stat-label-announcements">Expiring Soon</span>
            <span className="stat-value-announcements">{stats.expiringSoon}</span>
          </div>
        </div>
      </div>

      {/* Pinned Announcements Section */}
      {pinnedAnnouncements.length > 0 && viewMode !== 'pinned' && (
        <div className="pinned-announcements-section">
          <h3><i className="fas fa-thumbtack"></i> Pinned Announcements</h3>
          <div className="pinned-announcements-list">
            {pinnedAnnouncements.slice(0, 3).map(announcement => (
              <div
                key={announcement.id}
                className="pinned-announcement-item"
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <div className="pinned-announcement-icon" style={{ background: getCategoryColor(announcement.category) }}>
                  <i className={`fas ${getCategoryIcon(announcement.category)}`}></i>
                </div>
                <div className="pinned-announcement-content">
                  <h4>{announcement.title}</h4>
                  <p>{announcement.shortPreview}</p>
                </div>
                {!announcement.isRead && <span className="unread-dot-pinned"></span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="announcements-content-grid">
        {/* Left: Announcements Feed */}
        <div className="announcements-feed">
          {filteredAnnouncements.length === 0 ? (
            <div className="no-announcements-message">
              <i className="fas fa-inbox"></i>
              <h3>No Announcements Found</h3>
              <p>
                {searchQuery
                  ? `No announcements match "${searchQuery}"`
                  : showUnreadOnly
                  ? 'All caught up! No unread announcements.'
                  : viewMode === 'pinned'
                  ? 'No pinned announcements yet.'
                  : 'No announcements available.'}
              </p>
              {(searchQuery || showUnreadOnly) && (
                <button
                  className="clear-filters-btn-announcements"
                  onClick={() => {
                    setSearchQuery('');
                    setShowUnreadOnly(false);
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className={`announcements-list ${viewMode}`}>
              {filteredAnnouncements.map(announcement => (
                <div
                  key={announcement.id}
                  className={`announcement-card ${announcement.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className="announcement-card-header">
                    <div className="announcement-meta">
                      <span
                        className="category-badge-announcements"
                        style={{ background: getCategoryColor(announcement.category), color: 'white' }}
                      >
                        <i className={`fas ${getCategoryIcon(announcement.category)}`}></i>
                        {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                      </span>
                      {getPriorityBadge(announcement.priority)}
                    </div>
                    <div className="announcement-actions">
                      {announcement.isPinned && (
                        <i className="fas fa-thumbtack pinned-icon" title="Pinned"></i>
                      )}
                      <button
                        className="action-icon-btn"
                        onClick={(e) => handleToggleRead(announcement.id, e)}
                        title={announcement.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        <i className={`fas ${announcement.isRead ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
                      </button>
                      <button
                        className="action-icon-btn"
                        onClick={(e) => handleTogglePin(announcement.id, e)}
                        title={announcement.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <i className={`fas fa-thumbtack ${announcement.isPinned ? 'pinned' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="announcement-body">
                    {!announcement.isRead && <span className="unread-indicator"></span>}
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-preview">{announcement.shortPreview}</p>

                    <div className="announcement-footer">
                      <div className="announcement-author">
                        <i className="fas fa-user-circle"></i>
                        <span>{announcement.postedBy}</span>
                        <span className="role">{announcement.postedByRole}</span>
                      </div>
                      <div className="announcement-timestamp">
                        <i className="fas fa-clock"></i>
                        <span>{getRelativeTime(announcement.postedDate)}</span>
                      </div>
                    </div>

                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="announcement-attachments-preview">
                        <i className="fas fa-paperclip"></i>
                        <span>{announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {announcement.requiresAcknowledgment && !announcement.isAcknowledged && (
                      <div className="acknowledgment-required-badge">
                        <i className="fas fa-signature"></i>
                        Acknowledgment Required
                      </div>
                    )}

                    {announcement.expiryDate && (
                      <div className="expiry-badge">
                        <i className="fas fa-hourglass-half"></i>
                        Expires {getRelativeTime(announcement.expiryDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Smart Assistant */}
        <div className="ai-announcements-assistant">
          <h3>
            <i className="fas fa-brain"></i>
            Smart Assistant
          </h3>
          <div className="ai-insights-list-announcements">
            {aiInsights.length === 0 ? (
              <div className="no-insights-announcements">
                <i className="fas fa-check-circle"></i>
                <p>All good! No urgent items.</p>
              </div>
            ) : (
              aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`ai-insight-item-announcements ${insight.severity} ${insight.relatedIds ? 'clickable' : ''}`}
                  onClick={() => handleInsightClick(insight)}
                  style={{ cursor: insight.relatedIds ? 'pointer' : 'default' }}
                >
                  <div className="insight-icon-announcements" style={{ color: insight.color }}>
                    <i className={`fas ${insight.icon}`}></i>
                  </div>
                  <div className="insight-content-announcements">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                  {insight.relatedIds && (
                    <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: insight.color, opacity: 0.6 }}></i>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {showAnnouncementModal && selectedAnnouncement && (
        <>
          <div className="modal-overlay-announcements" onClick={() => setShowAnnouncementModal(false)}></div>
          <div className="announcement-modal">
            <div className="announcement-modal-header" style={{ borderTopColor: getCategoryColor(selectedAnnouncement.category) }}>
              <div className="modal-title-group-announcements">
                <i className={`fas ${getCategoryIcon(selectedAnnouncement.category)}`}></i>
                <h2>{selectedAnnouncement.title}</h2>
              </div>
              <button className="modal-close-btn-announcements" onClick={() => setShowAnnouncementModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="announcement-modal-body">
              <div className="modal-meta-info">
                <span
                  className="category-badge-modal"
                  style={{ background: getCategoryColor(selectedAnnouncement.category), color: 'white' }}
                >
                  <i className={`fas ${getCategoryIcon(selectedAnnouncement.category)}`}></i>
                  {selectedAnnouncement.category.charAt(0).toUpperCase() + selectedAnnouncement.category.slice(1)}
                </span>
                {getPriorityBadge(selectedAnnouncement.priority)}
              </div>

              <div className="modal-author-info">
                <div className="author-details">
                  <i className="fas fa-user-circle"></i>
                  <div>
                    <span className="author-name">{selectedAnnouncement.postedBy}</span>
                    <span className="author-role">{selectedAnnouncement.postedByRole}</span>
                  </div>
                </div>
                <div className="posted-date">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(selectedAnnouncement.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="modal-content-section">
                <h3>Full Details</h3>
                <p>{selectedAnnouncement.content}</p>
              </div>

              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className="modal-attachments-section">
                  <h3>
                    <i className="fas fa-paperclip"></i>
                    Attachments ({selectedAnnouncement.attachments.length})
                  </h3>
                  <div className="attachments-list">
                    {selectedAnnouncement.attachments.map(attachment => (
                      <div key={attachment.id} className="attachment-item">
                        <div className="attachment-icon" style={{ color: getCategoryColor(selectedAnnouncement.category) }}>
                          <i className={`fas ${getFileIcon(attachment.type)}`}></i>
                        </div>
                        <div className="attachment-info">
                          <span className="attachment-name">{attachment.name}</span>
                          <span className="attachment-size">{attachment.size}</span>
                        </div>
                        <button
                          className="attachment-download-btn"
                          onClick={() => handleDownloadAttachment(attachment)}
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnnouncement.requiresAcknowledgment && (
                <div className="modal-acknowledgment-section">
                  <h3>
                    <i className="fas fa-signature"></i>
                    Acknowledgment Required
                  </h3>
                  {selectedAnnouncement.isAcknowledged ? (
                    <div className="acknowledged-status">
                      <i className="fas fa-check-circle"></i>
                      <span>You have acknowledged this announcement</span>
                    </div>
                  ) : (
                    <div className="acknowledgment-prompt">
                      <p>This announcement requires your acknowledgment. Please confirm that you have read and understood the information.</p>
                      <button className="acknowledge-btn" onClick={handleAcknowledge}>
                        <i className="fas fa-check"></i>
                        Acknowledge
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedAnnouncement.expiryDate && (
                <div className="modal-expiry-info">
                  <i className="fas fa-hourglass-half"></i>
                  <span>Expires on {new Date(selectedAnnouncement.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>

            <div className="announcement-modal-footer">
              <button className="modal-action-btn-announcements secondary" onClick={() => showToastNotification('Shared successfully!')}>
                <i className="fas fa-share-alt"></i>
                Share
              </button>
              <button className="modal-action-btn-announcements secondary" onClick={() => showToastNotification('Printing...')}>
                <i className="fas fa-print"></i>
                Print
              </button>
              <button className="modal-action-btn-announcements primary" onClick={() => setShowAnnouncementModal(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification-announcements">
          <i className="fas fa-check-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Announcements;
