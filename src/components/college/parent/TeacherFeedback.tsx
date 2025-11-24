import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
}

interface TeacherFeedback {
  id: string;
  teacherName: string;
  teacherPhoto?: string;
  subject: string;
  date: string;
  timestamp: string;
  type: 'positive' | 'constructive' | 'neutral' | 'important';
  category: 'academic' | 'behavioral' | 'attendance' | 'homework' | 'participation' | 'general';
  comment: string;
  context?: string;
  isRead: boolean;
  isArchived: boolean;
  priority: 'high' | 'medium' | 'low';
  sentiment: number; // 1-5
  parentReply?: string;
  parentRepliedAt?: string;
}

interface SubjectSummary {
  subject: string;
  icon: string;
  feedbackCount: number;
  latestComment: string;
  lastUpdated: string;
  sentiment: 'positive' | 'neutral' | 'needs-attention';
  color: string;
}

const TeacherFeedback = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all, read, unread
  const [sortBy, setSortBy] = useState<string>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<string[]>([]);
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  // Modal states
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<TeacherFeedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Action states
  const [isDownloading, setIsDownloading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const students: Student[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A', rollNumber: '15' },
    { id: '2', name: 'Diya Sharma', class: '7', section: 'B', rollNumber: '22' }
  ];

  // Convert feedbackData to state for dynamic updates
  const [feedbackData, setFeedbackData] = useState<{ [key: string]: TeacherFeedback[] }>({
    '1': [
      {
        id: 'f1',
        teacherName: 'Mrs. Priya Mehta',
        subject: 'Mathematics',
        date: '2025-10-20',
        timestamp: '2 days ago',
        type: 'positive',
        category: 'academic',
        comment: 'Aarav has shown excellent improvement in solving complex algebraic equations. His problem-solving approach is methodical and accurate. Keep up the great work!',
        context: 'Regarding Unit Test - Algebra',
        isRead: false,
        isArchived: false,
        priority: 'medium',
        sentiment: 5
      },
      {
        id: 'f2',
        teacherName: 'Mr. Rajesh Kumar',
        subject: 'English',
        date: '2025-10-19',
        timestamp: '3 days ago',
        type: 'constructive',
        category: 'homework',
        comment: 'Aarav needs to submit his homework on time. The essay assignment was submitted 2 days late. Please ensure timely completion of assignments to stay on track with the curriculum.',
        context: 'Essay Assignment Submission',
        isRead: true,
        isArchived: false,
        priority: 'high',
        sentiment: 3
      },
      {
        id: 'f3',
        teacherName: 'Dr. Sunita Verma',
        subject: 'Science',
        date: '2025-10-18',
        timestamp: '4 days ago',
        type: 'positive',
        category: 'participation',
        comment: 'Excellent participation in the chemistry lab experiment today! Aarav demonstrated a clear understanding of chemical reactions and followed all safety protocols perfectly.',
        isRead: true,
        isArchived: false,
        priority: 'low',
        sentiment: 5
      },
      {
        id: 'f4',
        teacherName: 'Mr. Amit Patel',
        subject: 'Social Studies',
        date: '2025-10-17',
        timestamp: '5 days ago',
        type: 'neutral',
        category: 'academic',
        comment: 'Aarav\'s performance in the history test was satisfactory. He scored 75%, which is around the class average. With more focus on dates and events, he can improve further.',
        context: 'History Unit Test',
        isRead: true,
        isArchived: false,
        priority: 'medium',
        sentiment: 3
      },
      {
        id: 'f5',
        teacherName: 'Ms. Kavita Sharma',
        subject: 'Hindi',
        date: '2025-10-16',
        timestamp: '6 days ago',
        type: 'constructive',
        category: 'academic',
        comment: 'Aarav needs to work on his Hindi grammar, particularly in the areas of संज्ञा and सर्वनाम. I recommend 30 minutes of daily practice. I am available for doubt clearing during lunch break.',
        isRead: true,
        isArchived: false,
        priority: 'high',
        sentiment: 2
      },
      {
        id: 'f6',
        teacherName: 'Mr. Deepak Singh',
        subject: 'Computer Science',
        date: '2025-10-15',
        timestamp: '1 week ago',
        type: 'important',
        category: 'academic',
        comment: 'Outstanding work on the Python programming project! Aarav scored 95/100, the highest in class. His code was clean, well-commented, and demonstrated advanced concepts. Highly impressed!',
        context: 'Python Programming Project',
        isRead: true,
        isArchived: false,
        priority: 'high',
        sentiment: 5
      },
      {
        id: 'f7',
        teacherName: 'Mrs. Anjali Desai',
        subject: 'Physical Education',
        date: '2025-10-14',
        timestamp: '1 week ago',
        type: 'positive',
        category: 'participation',
        comment: 'Great teamwork displayed during basketball practice. Aarav is showing leadership qualities and encouraging his teammates. Excellent sportsmanship!',
        isRead: false,
        isArchived: false,
        priority: 'low',
        sentiment: 4
      },
      {
        id: 'f8',
        teacherName: 'Mr. Rajesh Kumar',
        subject: 'English',
        date: '2025-10-12',
        timestamp: '1 week ago',
        type: 'positive',
        category: 'academic',
        comment: 'Aarav\'s creative writing skills are improving significantly. His recent story on "The Future of Technology" was very well-written and showed great imagination. Scored 89/100.',
        context: 'Creative Writing Assignment',
        isRead: true,
        isArchived: false,
        priority: 'medium',
        sentiment: 5
      },
      {
        id: 'f9',
        teacherName: 'Mrs. Priya Mehta',
        subject: 'Mathematics',
        date: '2025-10-10',
        timestamp: '2 weeks ago',
        type: 'constructive',
        category: 'homework',
        comment: 'Please review geometry theorems with Aarav. He made several errors in the homework related to circle theorems. Additional practice is recommended.',
        isRead: true,
        isArchived: false,
        priority: 'medium',
        sentiment: 3
      },
      {
        id: 'f10',
        teacherName: 'Dr. Sunita Verma',
        subject: 'Science',
        date: '2025-10-08',
        timestamp: '2 weeks ago',
        type: 'neutral',
        category: 'behavioral',
        comment: 'Aarav was talking during the lecture today. While I appreciate his enthusiasm, I request him to raise his hand before speaking to maintain classroom decorum.',
        isRead: true,
        isArchived: false,
        priority: 'low',
        sentiment: 3
      }
    ],
    '2': [
      {
        id: 'f11',
        teacherName: 'Mrs. Neha Gupta',
        subject: 'Mathematics',
        date: '2025-10-21',
        timestamp: '1 day ago',
        type: 'positive',
        category: 'academic',
        comment: 'Diya solved all the algebra problems correctly in today\'s class test! She has a strong grasp of mathematical concepts. Excellent work!',
        context: 'Class Test - Algebra',
        isRead: false,
        isArchived: false,
        priority: 'medium',
        sentiment: 5
      },
      {
        id: 'f12',
        teacherName: 'Mr. Arjun Nair',
        subject: 'English',
        date: '2025-10-20',
        timestamp: '2 days ago',
        type: 'important',
        category: 'academic',
        comment: 'Diya\'s essay on "My Inspiration" was exceptional! She scored 98/100, the highest in the class. Her vocabulary and sentence structure are remarkable for her age. Very proud!',
        context: 'Essay Competition - School Level',
        isRead: false,
        isArchived: false,
        priority: 'high',
        sentiment: 5
      },
      {
        id: 'f13',
        teacherName: 'Ms. Pooja Reddy',
        subject: 'Science',
        date: '2025-10-19',
        timestamp: '3 days ago',
        type: 'positive',
        category: 'participation',
        comment: 'Diya actively participated in the science quiz today and answered 8 out of 10 questions correctly. Great enthusiasm for learning!',
        isRead: true,
        isArchived: false,
        priority: 'low',
        sentiment: 5
      },
      {
        id: 'f14',
        teacherName: 'Mrs. Lakshmi Iyer',
        subject: 'Social Studies',
        date: '2025-10-18',
        timestamp: '4 days ago',
        type: 'neutral',
        category: 'homework',
        comment: 'Diya\'s project on "Indian Culture" was good, but I would like to see more visual elements like charts and pictures. Content was well-researched.',
        context: 'Project Submission',
        isRead: true,
        isArchived: false,
        priority: 'medium',
        sentiment: 4
      },
      {
        id: 'f15',
        teacherName: 'Mr. Vikram Joshi',
        subject: 'Hindi',
        date: '2025-10-17',
        timestamp: '5 days ago',
        type: 'positive',
        category: 'academic',
        comment: 'बहुत अच्छा काम! Diya\'s Hindi reading skills have improved tremendously. She read the poem with excellent pronunciation and expression.',
        isRead: true,
        isArchived: false,
        priority: 'medium',
        sentiment: 5
      },
      {
        id: 'f16',
        teacherName: 'Ms. Ritu Shah',
        subject: 'Computer Science',
        date: '2025-10-16',
        timestamp: '6 days ago',
        type: 'constructive',
        category: 'homework',
        comment: 'Diya missed submitting her Scratch programming assignment. Please ensure she completes it by this Friday. I can provide extra time during computer lab if needed.',
        isRead: false,
        isArchived: false,
        priority: 'high',
        sentiment: 3
      },
      {
        id: 'f17',
        teacherName: 'Mrs. Priya Chopra',
        subject: 'Art & Craft',
        date: '2025-10-15',
        timestamp: '1 week ago',
        type: 'positive',
        category: 'participation',
        comment: 'Diya\'s painting in today\'s art class was beautiful! She has a natural talent for colors and creativity. Her landscape painting will be displayed in the school art exhibition.',
        isRead: true,
        isArchived: false,
        priority: 'low',
        sentiment: 5
      },
      {
        id: 'f18',
        teacherName: 'Mr. Arjun Nair',
        subject: 'English',
        date: '2025-10-14',
        timestamp: '1 week ago',
        type: 'positive',
        category: 'behavioral',
        comment: 'Diya is always polite and respectful in class. She helps her classmates and sets a great example for others. Wonderful behavior!',
        isRead: true,
        isArchived: false,
        priority: 'low',
        sentiment: 5
      }
    ]
  });

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];
  const currentFeedback = feedbackData[selectedStudent] || [];

  // Subject summaries
  const subjectSummaries: { [key: string]: SubjectSummary[] } = {
    '1': [
      { subject: 'Mathematics', icon: 'fa-calculator', feedbackCount: 2, latestComment: 'Excellent improvement in algebra', lastUpdated: '2 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'English', icon: 'fa-book', feedbackCount: 2, latestComment: 'Creative writing skills improving', lastUpdated: '3 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'Science', icon: 'fa-flask', feedbackCount: 2, latestComment: 'Great participation in lab', lastUpdated: '4 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'Social Studies', icon: 'fa-globe', feedbackCount: 1, latestComment: 'Satisfactory performance in test', lastUpdated: '5 days ago', sentiment: 'neutral', color: '#6b7280' },
      { subject: 'Hindi', icon: 'fa-language', feedbackCount: 1, latestComment: 'Needs work on grammar', lastUpdated: '6 days ago', sentiment: 'needs-attention', color: '#f59e0b' },
      { subject: 'Computer Science', icon: 'fa-laptop-code', feedbackCount: 1, latestComment: 'Outstanding Python project!', lastUpdated: '1 week ago', sentiment: 'positive', color: '#10ac8b' }
    ],
    '2': [
      { subject: 'Mathematics', icon: 'fa-calculator', feedbackCount: 1, latestComment: 'Strong grasp of concepts', lastUpdated: '1 day ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'English', icon: 'fa-book', feedbackCount: 2, latestComment: 'Exceptional essay writing!', lastUpdated: '2 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'Science', icon: 'fa-flask', feedbackCount: 1, latestComment: 'Active participation in quiz', lastUpdated: '3 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'Hindi', icon: 'fa-language', feedbackCount: 1, latestComment: 'Improved reading skills', lastUpdated: '5 days ago', sentiment: 'positive', color: '#10ac8b' },
      { subject: 'Computer Science', icon: 'fa-laptop-code', feedbackCount: 1, latestComment: 'Missing assignment', lastUpdated: '6 days ago', sentiment: 'needs-attention', color: '#f59e0b' }
    ]
  };

  const currentSubjectSummaries = subjectSummaries[selectedStudent] || [];

  // Calculate stats
  const totalFeedback = currentFeedback.length;
  const unreadFeedback = currentFeedback.filter(f => !f.isRead).length;
  const positiveFeedback = currentFeedback.filter(f => f.type === 'positive' || f.type === 'important').length;
  const needsAttention = currentFeedback.filter(f => f.type === 'constructive').length;
  const lastFeedbackDate = currentFeedback.length > 0 ? currentFeedback[0].timestamp : 'N/A';

  // Get unique teachers and subjects
  const uniqueTeachers = Array.from(new Set(currentFeedback.map(f => f.teacherName)));
  const uniqueSubjects = Array.from(new Set(currentFeedback.map(f => f.subject)));

  // Filter feedback
  const filteredFeedback = currentFeedback.filter(feedback => {
    if (filterSubject !== 'all' && feedback.subject !== filterSubject) return false;
    if (filterTeacher !== 'all' && feedback.teacherName !== filterTeacher) return false;
    if (filterType !== 'all' && feedback.type !== filterType) return false;
    if (filterCategory !== 'all' && feedback.category !== filterCategory) return false;
    if (filterStatus === 'read' && !feedback.isRead) return false;
    if (filterStatus === 'unread' && feedback.isRead) return false;
    if (feedback.isArchived) return false;
    return true;
  });

  // Sort feedback
  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject);
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handler functions
  const handleMarkAsRead = (feedbackId: string) => {
    setFeedbackData(prev => ({
      ...prev,
      [selectedStudent]: prev[selectedStudent].map(f =>
        f.id === feedbackId ? { ...f, isRead: true } : f
      )
    }));
    showToast('Feedback marked as read', 'success');
  };

  const handleArchive = (feedbackId: string) => {
    setFeedbackData(prev => ({
      ...prev,
      [selectedStudent]: prev[selectedStudent].map(f =>
        f.id === feedbackId ? { ...f, isArchived: true } : f
      )
    }));
    showToast('Feedback archived successfully', 'info');
  };

  const handleReply = (feedback: TeacherFeedback) => {
    setSelectedFeedback(feedback);
    setShowReplyModal(true);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const replyText = formData.get('reply') as string;

    if (selectedFeedback && replyText) {
      const now = new Date();
      const replyDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      setFeedbackData(prev => ({
        ...prev,
        [selectedStudent]: prev[selectedStudent].map(f =>
          f.id === selectedFeedback.id
            ? {
                ...f,
                parentReply: replyText,
                parentRepliedAt: replyDate
              }
            : f
        )
      }));
      showToast('Reply sent to teacher successfully!', 'success');
      setShowReplyModal(false);
      setSelectedFeedback(null);
    }
  };

  const handleDownloadAll = () => {
    setIsDownloading(true);

    // Generate CSV content
    const headers = ['Date', 'Teacher', 'Subject', 'Type', 'Category', 'Priority', 'Comment', 'Context', 'Status'];
    const rows = currentFeedback.map(f => [
      f.date,
      f.teacherName,
      f.subject,
      f.type,
      f.category,
      f.priority,
      `"${f.comment.replace(/"/g, '""')}"`, // Escape quotes in CSV
      f.context || '',
      f.isRead ? 'Read' : 'Unread'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentStudent.name.replace(/\s+/g, '_')}_Feedback_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    setTimeout(() => {
      setIsDownloading(false);
      showToast('All feedback downloaded successfully!', 'success');
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const handlePrintFeedback = (feedback: TeacherFeedback) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback - ${feedback.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #094d88; border-bottom: 3px solid #10ac8b; padding-bottom: 10px; }
            .header { margin-bottom: 30px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #1f2937; }
            .comment { background: #f9fafb; padding: 20px; border-left: 4px solid #094d88; margin: 20px 0; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 6px; margin-right: 10px; }
            .type-${feedback.type} { background: ${getTypeColor(feedback.type)}; color: white; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Teacher Feedback</h1>
            <div class="info-row">
              <div><span class="label">Student:</span> <span class="value">${currentStudent.name}</span></div>
              <div><span class="label">Date:</span> <span class="value">${new Date(feedback.date).toLocaleDateString()}</span></div>
            </div>
            <div class="info-row">
              <div><span class="label">Teacher:</span> <span class="value">${feedback.teacherName}</span></div>
              <div><span class="label">Subject:</span> <span class="value">${feedback.subject}</span></div>
            </div>
            ${feedback.context ? `<div class="info-row"><div><span class="label">Context:</span> <span class="value">${feedback.context}</span></div></div>` : ''}
          </div>

          <div>
            <span class="badge type-${feedback.type}">${feedback.type.toUpperCase()}</span>
            <span class="badge">${feedback.category.toUpperCase()}</span>
            ${feedback.priority === 'high' ? '<span class="badge" style="background: #ef4444; color: white;">HIGH PRIORITY</span>' : ''}
          </div>

          <div class="comment">
            <p>${feedback.comment}</p>
          </div>

          ${feedback.parentReply ? `
            <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #10ac8b; margin: 20px 0;">
              <strong>Your Reply (${feedback.parentRepliedAt}):</strong>
              <p>${feedback.parentReply}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>EdgeUp School Management System - Teacher Feedback Report</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const toggleExpandFeedback = (feedbackId: string) => {
    if (expandedFeedback.includes(feedbackId)) {
      setExpandedFeedback(expandedFeedback.filter(id => id !== feedbackId));
    } else {
      setExpandedFeedback([...expandedFeedback, feedbackId]);
    }
  };

  const resetFilters = () => {
    setFilterSubject('all');
    setFilterTeacher('all');
    setFilterType('all');
    setFilterCategory('all');
    setFilterStatus('all');
    showToast('Filters reset', 'info');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return '#10ac8b';
      case 'constructive': return '#f59e0b';
      case 'important': return '#ef4444';
      case 'neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return 'fa-book-open';
      case 'behavioral': return 'fa-user-check';
      case 'attendance': return 'fa-calendar-check';
      case 'homework': return 'fa-tasks';
      case 'participation': return 'fa-hand-paper';
      default: return 'fa-comment';
    }
  };

  return (
    <div className="teacher-feedback-page">
      {/* Header Section */}
      <div className="feedback-header">
        <div className="header-top-row">
          <div className="student-selector-feedback">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Class {student.class}{student.section}
                </option>
              ))}
            </select>
          </div>

          <div className="header-actions-feedback">
            <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <i className="fas fa-filter"></i>
              Filters {(filterSubject !== 'all' || filterTeacher !== 'all' || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all') && <span className="filter-active-dot"></span>}
            </button>
            <button className="download-all-btn" onClick={handleDownloadAll} disabled={isDownloading}>
              <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'download'}`}></i>
              {isDownloading ? 'Downloading...' : 'Download All'}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="feedback-quick-stats">
          <div className="feedback-stat-card total">
            <div className="stat-icon">
              <i className="fas fa-comments"></i>
            </div>
            <div className="stat-info">
              <h3>{totalFeedback}</h3>
              <p>Total Feedback</p>
            </div>
          </div>

          <div className="feedback-stat-card unread">
            <div className="stat-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="stat-info">
              <h3>{unreadFeedback}</h3>
              <p>Unread</p>
            </div>
          </div>

          <div className="feedback-stat-card positive">
            <div className="stat-icon">
              <i className="fas fa-thumbs-up"></i>
            </div>
            <div className="stat-info">
              <h3>{positiveFeedback}</h3>
              <p>Positive Comments</p>
            </div>
          </div>

          <div className="feedback-stat-card attention">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>{needsAttention}</h3>
              <p>Needs Attention</p>
            </div>
          </div>

          <div className="feedback-stat-card recent">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>{lastFeedbackDate}</h3>
              <p>Last Feedback</p>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Subject</label>
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                  <option value="all">All Subjects</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Teacher</label>
                <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
                  <option value="all">All Teachers</option>
                  {uniqueTeachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="positive">Positive</option>
                  <option value="constructive">Constructive</option>
                  <option value="neutral">Neutral</option>
                  <option value="important">Important</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="homework">Homework</option>
                  <option value="participation">Participation</option>
                  <option value="attendance">Attendance</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="subject">By Subject</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
            </div>
            <button className="reset-filters-btn" onClick={resetFilters}>
              <i className="fas fa-redo"></i>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="feedback-content-grid">
        {/* Main Column - Feedback Feed */}
        <div className="feedback-main-column">
          {/* Subject Summary Cards */}
          <div className="subject-summary-section">
            <h2>
              <i className="fas fa-chart-bar"></i>
              Subject-Wise Feedback Summary
            </h2>
            <div className="subject-summary-grid">
              {currentSubjectSummaries.map((summary, index) => (
                <div key={index} className={`subject-summary-card ${summary.sentiment}`}>
                  <div className="summary-header">
                    <div className="summary-icon" style={{ background: summary.color }}>
                      <i className={`fas ${summary.icon}`}></i>
                    </div>
                    <div className="summary-info">
                      <h4>{summary.subject}</h4>
                      <span className="feedback-count">{summary.feedbackCount} feedback{summary.feedbackCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <p className="latest-comment">{summary.latestComment}</p>
                  <div className="summary-footer">
                    <span className="last-updated">
                      <i className="fas fa-clock"></i>
                      {summary.lastUpdated}
                    </span>
                    <button className="view-all-btn" onClick={() => setFilterSubject(summary.subject)}>
                      View All <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Feed */}
          <div className="feedback-feed-section">
            <div className="feed-header">
              <h2>
                <i className="fas fa-comments"></i>
                All Feedback ({sortedFeedback.length})
              </h2>
            </div>

            {sortedFeedback.length === 0 ? (
              <div className="no-feedback-message">
                <i className="fas fa-inbox"></i>
                <h3>No Feedback Found</h3>
                <p>There are no feedback entries matching your current filters.</p>
                <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="feedback-cards-list">
                  {(showAllFeedback ? sortedFeedback : sortedFeedback.slice(0, 3)).map(feedback => {
                  const isExpanded = expandedFeedback.includes(feedback.id);
                  const commentLength = feedback.comment.length;
                  const shouldTruncate = commentLength > 200;
                  const displayComment = !isExpanded && shouldTruncate
                    ? feedback.comment.substring(0, 200) + '...'
                    : feedback.comment;

                  return (
                    <div
                      key={feedback.id}
                      className={`feedback-card ${feedback.type} ${!feedback.isRead ? 'unread' : ''}`}
                      style={{ borderLeftColor: getTypeColor(feedback.type) }}
                    >
                      {!feedback.isRead && <span className="unread-badge">New</span>}

                      <div className="feedback-card-header">
                        <div className="teacher-info">
                          <div className="teacher-avatar">
                            <i className="fas fa-user-tie"></i>
                          </div>
                          <div className="teacher-details">
                            <h4>{feedback.teacherName}</h4>
                            <p className="subject-name">
                              <i className="fas fa-book"></i>
                              {feedback.subject}
                            </p>
                          </div>
                        </div>
                        <div className="feedback-meta">
                          <span className="feedback-date">
                            <i className="fas fa-calendar-alt"></i>
                            {feedback.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="feedback-badges">
                        <span className="feedback-type-badge" style={{ background: getTypeColor(feedback.type) }}>
                          {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                        </span>
                        <span className="feedback-category-badge">
                          <i className={`fas ${getCategoryIcon(feedback.category)}`}></i>
                          {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                        </span>
                        {feedback.priority === 'high' && (
                          <span className="priority-badge high">
                            <i className="fas fa-exclamation-circle"></i>
                            High Priority
                          </span>
                        )}
                      </div>

                      {feedback.context && (
                        <div className="feedback-context">
                          <i className="fas fa-info-circle"></i>
                          {feedback.context}
                        </div>
                      )}

                      <div className="feedback-comment">
                        <p>{displayComment}</p>
                        {shouldTruncate && (
                          <button
                            className="read-more-btn"
                            onClick={() => toggleExpandFeedback(feedback.id)}
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </div>

                      {feedback.parentReply && (
                        <div className="parent-reply-section">
                          <div className="reply-header">
                            <i className="fas fa-reply"></i>
                            <span>Your Reply ({feedback.parentRepliedAt})</span>
                          </div>
                          <p>{feedback.parentReply}</p>
                        </div>
                      )}

                      <div className="feedback-card-actions">
                        {!feedback.isRead && (
                          <button className="action-btn mark-read" onClick={() => handleMarkAsRead(feedback.id)}>
                            <i className="fas fa-check"></i>
                            Mark as Read
                          </button>
                        )}
                        <button className="action-btn reply" onClick={() => handleReply(feedback)}>
                          <i className="fas fa-reply"></i>
                          Reply
                        </button>
                        <button className="action-btn archive" onClick={() => handleArchive(feedback.id)}>
                          <i className="fas fa-archive"></i>
                          Archive
                        </button>
                        <button className="action-btn print" onClick={() => handlePrintFeedback(feedback)}>
                          <i className="fas fa-print"></i>
                          Print
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All / Show Less Button */}
              {sortedFeedback.length > 3 && (
                <div className="view-all-feedback-container">
                  <button
                    className="view-all-feedback-btn"
                    onClick={() => setShowAllFeedback(!showAllFeedback)}
                  >
                    {showAllFeedback ? (
                      <>
                        <i className="fas fa-chevron-up"></i>
                        Show Less
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down"></i>
                        View All Feedback ({sortedFeedback.length - 3} more)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="feedback-sidebar">
          {/* Recent Highlights */}
          <div className="sidebar-panel recent-highlights">
            <h3>
              <i className="fas fa-star"></i>
              Recent Highlights
            </h3>
            <div className="highlights-list">
              {sortedFeedback.slice(0, 4).map(feedback => (
                <div key={feedback.id} className="highlight-item" onClick={() => handleReply(feedback)}>
                  <div className="highlight-dot" style={{ background: getTypeColor(feedback.type) }}></div>
                  <div className="highlight-content">
                    <p className="highlight-subject">{feedback.subject}</p>
                    <p className="highlight-preview">{feedback.comment.substring(0, 60)}...</p>
                    <span className="highlight-time">{feedback.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teachers Panel */}
          <div className="sidebar-panel teachers-panel">
            <h3>
              <i className="fas fa-chalkboard-teacher"></i>
              Teachers
            </h3>
            <div className="teachers-list">
              {uniqueTeachers.map(teacher => {
                const teacherFeedbackCount = currentFeedback.filter(f => f.teacherName === teacher).length;
                return (
                  <div
                    key={teacher}
                    className="teacher-item"
                    onClick={() => setFilterTeacher(teacher)}
                  >
                    <div className="teacher-avatar-small">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="teacher-item-info">
                      <p className="teacher-name">{teacher}</p>
                      <span className="teacher-feedback-count">{teacherFeedbackCount} feedback{teacherFeedbackCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="sidebar-panel category-breakdown">
            <h3>
              <i className="fas fa-chart-pie"></i>
              Category Breakdown
            </h3>
            <div className="category-bars">
              {['academic', 'behavioral', 'homework', 'participation'].map(category => {
                const count = currentFeedback.filter(f => f.category === category).length;
                const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
                return (
                  <div key={category} className="category-bar-item">
                    <div className="category-bar-header">
                      <span className="category-label">
                        <i className={`fas ${getCategoryIcon(category)}`}></i>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="category-count">{count}</span>
                    </div>
                    <div className="category-progress-bar">
                      <div
                        className="category-progress-fill"
                        style={{ width: `${percentage}%`, background: '#094d88' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedFeedback && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-reply"></i>
                Reply to {selectedFeedback.teacherName}
              </h2>
              <button className="modal-close-btn" onClick={() => setShowReplyModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitReply} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label>To</label>
                <input type="text" value={selectedFeedback.teacherName} disabled />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  defaultValue={`Re: ${selectedFeedback.subject} - ${selectedFeedback.context || 'Feedback'}`}
                  required
                />
              </div>
              <div className="form-group">
                <label>Original Feedback</label>
                <div className="original-feedback-box">
                  <p>{selectedFeedback.comment}</p>
                </div>
              </div>
              <div className="form-group">
                <label>Your Reply</label>
                <textarea
                  name="reply"
                  rows={6}
                  placeholder="Type your response to the teacher here..."
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn primary">
                  <i className="fas fa-paper-plane"></i>
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherFeedback;
