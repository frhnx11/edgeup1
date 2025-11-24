import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  currentGPA: number;
  classRank: number;
  totalStudents: number;
  overallAttendance: number;
}

interface SubjectStatus {
  subject: string;
  currentMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  classAverage: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastUpdated: string;
  recentScores: number[]; // For sparkline
  attendance: number;
  status: 'excellent' | 'good' | 'average' | 'needs-attention';
}

interface Assessment {
  id: string;
  type: 'test' | 'exam' | 'quiz';
  subject: string;
  title: string;
  date: string;
  syllabusTopics: string[];
  marksObtained?: number;
  totalMarks?: number;
  grade?: string;
  rank?: number;
  status: 'upcoming' | 'completed';
  daysUntil?: number;
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  marksObtained?: number;
  totalMarks?: number;
  daysRemaining?: number;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'holiday';
}

interface ActivityFeedItem {
  id: string;
  type: 'test' | 'assignment' | 'attendance' | 'homework' | 'comment' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface PerformanceTrend {
  month: string;
  gpa: number;
}

interface SmartInsight {
  type: 'strength' | 'attention' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  icon: string;
  color: string;
}

const PerformanceDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'term'>('month');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  // Animated stats
  const [animatedGPA, setAnimatedGPA] = useState(0);
  const [animatedRank, setAnimatedRank] = useState(0);
  const [animatedAttendance, setAnimatedAttendance] = useState(0);
  const [animatedAssignments, setAnimatedAssignments] = useState(0);

  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPTMModal, setShowPTMModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showSubjectDetailModal, setShowSubjectDetailModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectStatus | null>(null);

  // Action states
  const [isDownloading, setIsDownloading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: 'Aarav Sharma',
      class: '10',
      section: 'A',
      rollNumber: '15',
      currentGPA: 8.7,
      classRank: 5,
      totalStudents: 45,
      overallAttendance: 94
    },
    {
      id: '2',
      name: 'Diya Sharma',
      class: '7',
      section: 'B',
      rollNumber: '22',
      currentGPA: 9.2,
      classRank: 2,
      totalStudents: 42,
      overallAttendance: 96
    }
  ];

  const subjectStatuses: { [key: string]: SubjectStatus[] } = {
    '1': [
      { subject: 'Mathematics', currentMarks: 87, totalMarks: 100, percentage: 87, grade: 'A', classAverage: 76, rank: 3, trend: 'up', trendPercentage: 5, lastUpdated: '2 days ago', recentScores: [78, 82, 85, 87], attendance: 95, status: 'excellent' },
      { subject: 'English', currentMarks: 90, totalMarks: 100, percentage: 90, grade: 'A+', classAverage: 78, rank: 1, trend: 'up', trendPercentage: 3, lastUpdated: '1 day ago', recentScores: [85, 87, 89, 90], attendance: 96, status: 'excellent' },
      { subject: 'Science', currentMarks: 88, totalMarks: 100, percentage: 88, grade: 'A', classAverage: 74, rank: 2, trend: 'stable', trendPercentage: 0, lastUpdated: '3 days ago', recentScores: [86, 88, 87, 88], attendance: 94, status: 'excellent' },
      { subject: 'Social Studies', currentMarks: 88, totalMarks: 100, percentage: 88, grade: 'A', classAverage: 77, rank: 2, trend: 'up', trendPercentage: 2, lastUpdated: '1 day ago', recentScores: [84, 86, 87, 88], attendance: 93, status: 'excellent' },
      { subject: 'Hindi', currentMarks: 84, totalMarks: 100, percentage: 84, grade: 'A-', classAverage: 79, rank: 8, trend: 'up', trendPercentage: 4, lastUpdated: '2 days ago', recentScores: [79, 81, 83, 84], attendance: 96, status: 'good' },
      { subject: 'Computer Science', currentMarks: 95, totalMarks: 100, percentage: 95, grade: 'A+', classAverage: 81, rank: 1, trend: 'up', trendPercentage: 2, lastUpdated: 'Today', recentScores: [91, 93, 94, 95], attendance: 97, status: 'excellent' },
      { subject: 'Physical Education', currentMarks: 94, totalMarks: 100, percentage: 94, grade: 'A+', classAverage: 85, rank: 1, trend: 'stable', trendPercentage: 0, lastUpdated: '1 week ago', recentScores: [93, 94, 94, 94], attendance: 98, status: 'excellent' },
      { subject: 'Art & Craft', currentMarks: 90, totalMarks: 100, percentage: 90, grade: 'A+', classAverage: 83, rank: 1, trend: 'up', trendPercentage: 3, lastUpdated: '4 days ago', recentScores: [86, 88, 89, 90], attendance: 94, status: 'excellent' }
    ],
    '2': [
      { subject: 'Mathematics', currentMarks: 94, totalMarks: 100, percentage: 94, grade: 'A+', classAverage: 78, rank: 2, trend: 'up', trendPercentage: 3, lastUpdated: 'Today', recentScores: [90, 92, 93, 94], attendance: 97, status: 'excellent' },
      { subject: 'English', currentMarks: 93, totalMarks: 100, percentage: 93, grade: 'A+', classAverage: 80, rank: 1, trend: 'stable', trendPercentage: 0, lastUpdated: '1 day ago', recentScores: [92, 93, 93, 93], attendance: 96, status: 'excellent' },
      { subject: 'Science', currentMarks: 92, totalMarks: 100, percentage: 92, grade: 'A+', classAverage: 76, rank: 2, trend: 'up', trendPercentage: 2, lastUpdated: '2 days ago', recentScores: [89, 90, 91, 92], attendance: 95, status: 'excellent' },
      { subject: 'Social Studies', currentMarks: 91, totalMarks: 100, percentage: 91, grade: 'A+', classAverage: 77, rank: 2, trend: 'up', trendPercentage: 3, lastUpdated: '1 day ago', recentScores: [87, 89, 90, 91], attendance: 96, status: 'excellent' },
      { subject: 'Hindi', currentMarks: 90, totalMarks: 100, percentage: 90, grade: 'A+', classAverage: 81, rank: 3, trend: 'stable', trendPercentage: 0, lastUpdated: '3 days ago', recentScores: [89, 90, 90, 90], attendance: 97, status: 'excellent' },
      { subject: 'Computer Science', currentMarks: 96, totalMarks: 100, percentage: 96, grade: 'A+', classAverage: 82, rank: 1, trend: 'up', trendPercentage: 2, lastUpdated: 'Today', recentScores: [93, 94, 95, 96], attendance: 98, status: 'excellent' }
    ]
  };

  const assessments: { [key: string]: Assessment[] } = {
    '1': [
      { id: 'a1', type: 'test', subject: 'Mathematics', title: 'Unit Test - Geometry', date: '2025-10-24', syllabusTopics: ['Triangles', 'Circles', 'Theorems'], status: 'upcoming', daysUntil: 2 },
      { id: 'a2', type: 'exam', subject: 'English', title: 'Mid-Term Exam', date: '2025-10-26', syllabusTopics: ['Literature', 'Grammar', 'Composition'], status: 'upcoming', daysUntil: 4 },
      { id: 'a3', type: 'quiz', subject: 'Science', title: 'Quick Quiz - Chemistry', date: '2025-10-23', syllabusTopics: ['Chemical Reactions', 'Acids & Bases'], status: 'upcoming', daysUntil: 1 },
      { id: 'a4', type: 'test', subject: 'Computer Science', title: 'Programming Test', date: '2025-10-20', marksObtained: 95, totalMarks: 100, grade: 'A+', rank: 1, status: 'completed' },
      { id: 'a5', type: 'test', subject: 'Mathematics', title: 'Algebra Test', date: '2025-10-18', marksObtained: 87, totalMarks: 100, grade: 'A', rank: 3, status: 'completed' }
    ],
    '2': [
      { id: 'a6', type: 'test', subject: 'Mathematics', title: 'Unit Test - Algebra', date: '2025-10-25', syllabusTopics: ['Linear Equations', 'Polynomials'], status: 'upcoming', daysUntil: 3 },
      { id: 'a7', type: 'test', subject: 'Science', title: 'Biology Test', date: '2025-10-23', syllabusTopics: ['Cell Structure', 'Photosynthesis'], status: 'upcoming', daysUntil: 1 },
      { id: 'a8', type: 'test', subject: 'Computer Science', title: 'Coding Challenge', date: '2025-10-21', marksObtained: 96, totalMarks: 100, grade: 'A+', rank: 1, status: 'completed' }
    ]
  };

  const assignments: { [key: string]: Assignment[] } = {
    '1': [
      { id: 'as1', subject: 'Mathematics', title: 'Geometry Problems - Set 3', assignedDate: '2025-10-15', dueDate: '2025-10-20', status: 'overdue', priority: 'high', daysRemaining: -2 },
      { id: 'as2', subject: 'English', title: 'Essay: My Role Model', assignedDate: '2025-10-18', dueDate: '2025-10-24', status: 'in-progress', priority: 'high', daysRemaining: 2 },
      { id: 'as3', subject: 'Science', title: 'Lab Report: Chemical Reactions', assignedDate: '2025-10-16', dueDate: '2025-10-23', status: 'not-started', priority: 'high', daysRemaining: 1 },
      { id: 'as4', subject: 'Social Studies', title: 'Project: Indian Freedom Movement', assignedDate: '2025-10-10', dueDate: '2025-10-28', status: 'in-progress', priority: 'medium', daysRemaining: 6 },
      { id: 'as5', subject: 'Hindi', title: 'Creative Writing Assignment', assignedDate: '2025-10-17', dueDate: '2025-10-25', status: 'not-started', priority: 'medium', daysRemaining: 3 },
      { id: 'as6', subject: 'Computer Science', title: 'Python Programming Project', assignedDate: '2025-10-12', dueDate: '2025-10-19', status: 'submitted', priority: 'high', marksObtained: 95, totalMarks: 100 },
      { id: 'as7', subject: 'Science', title: 'Physics Worksheet', assignedDate: '2025-10-14', dueDate: '2025-10-21', status: 'submitted', priority: 'medium' }
    ],
    '2': [
      { id: 'as8', subject: 'Mathematics', title: 'Algebra Practice Problems', assignedDate: '2025-10-19', dueDate: '2025-10-25', status: 'in-progress', priority: 'high', daysRemaining: 3 },
      { id: 'as9', subject: 'English', title: 'Story Writing', assignedDate: '2025-10-18', dueDate: '2025-10-24', status: 'not-started', priority: 'medium', daysRemaining: 2 },
      { id: 'as10', subject: 'Science', title: 'Science Model Preparation', assignedDate: '2025-10-15', dueDate: '2025-10-30', status: 'in-progress', priority: 'high', daysRemaining: 8 }
    ]
  };

  // Activity feed data
  const activityFeed: { [key: string]: ActivityFeedItem[] } = {
    '1': [
      { id: 'af1', type: 'test', title: 'Test Completed', description: 'Computer Science Programming Test - 95/100', timestamp: '2 hours ago', icon: 'fa-file-alt', color: '#10ac8b' },
      { id: 'af2', type: 'assignment', title: 'Assignment Submitted', description: 'Python Programming Project submitted', timestamp: '5 hours ago', icon: 'fa-check-circle', color: '#3b82f6' },
      { id: 'af3', type: 'attendance', title: 'Attendance Marked', description: 'Present - All periods attended', timestamp: '1 day ago', icon: 'fa-user-check', color: '#10ac8b' },
      { id: 'af4', type: 'test', title: 'Test Completed', description: 'Mathematics Algebra Test - 87/100', timestamp: '2 days ago', icon: 'fa-file-alt', color: '#10ac8b' },
      { id: 'af5', type: 'comment', title: 'Teacher Comment', description: 'Excellent work on the coding project!', timestamp: '2 days ago', icon: 'fa-comment', color: '#8b5cf6' },
      { id: 'af6', type: 'achievement', title: 'Achievement Unlocked', description: 'Top performer in Computer Science', timestamp: '3 days ago', icon: 'fa-trophy', color: '#f59e0b' },
      { id: 'af7', type: 'homework', title: 'New Homework Assigned', description: 'English Essay - Due in 2 days', timestamp: '4 days ago', icon: 'fa-book', color: '#094d88' },
      { id: 'af8', type: 'assignment', title: 'Assignment Graded', description: 'Science Lab Report - 88/100', timestamp: '5 days ago', icon: 'fa-star', color: '#10ac8b' }
    ],
    '2': [
      { id: 'af9', type: 'test', title: 'Test Completed', description: 'Computer Science Coding Challenge - 96/100', timestamp: '1 day ago', icon: 'fa-file-alt', color: '#10ac8b' },
      { id: 'af10', type: 'attendance', title: 'Attendance Marked', description: 'Present - All periods attended', timestamp: '1 day ago', icon: 'fa-user-check', color: '#10ac8b' },
      { id: 'af11', type: 'achievement', title: 'Top Rank Maintained', description: 'Rank #2 in class maintained', timestamp: '2 days ago', icon: 'fa-medal', color: '#f59e0b' },
      { id: 'af12', type: 'homework', title: 'New Homework Assigned', description: 'Mathematics practice problems', timestamp: '3 days ago', icon: 'fa-book', color: '#094d88' }
    ]
  };

  // Performance trend data (last 6 months)
  const performanceTrends: { [key: string]: PerformanceTrend[] } = {
    '1': [
      { month: 'May', gpa: 8.2 },
      { month: 'Jun', gpa: 8.3 },
      { month: 'Jul', gpa: 8.4 },
      { month: 'Aug', gpa: 8.5 },
      { month: 'Sep', gpa: 8.6 },
      { month: 'Oct', gpa: 8.7 }
    ],
    '2': [
      { month: 'May', gpa: 9.0 },
      { month: 'Jun', gpa: 9.1 },
      { month: 'Jul', gpa: 9.0 },
      { month: 'Aug', gpa: 9.1 },
      { month: 'Sep', gpa: 9.2 },
      { month: 'Oct', gpa: 9.2 }
    ]
  };

  // Smart insights
  const smartInsights: { [key: string]: SmartInsight[] } = {
    '1': [
      { type: 'strength', title: 'Excelling in Computer Science', description: 'Consistent top rank with 95% current score', icon: 'fa-code', color: '#10ac8b' },
      { type: 'attention', title: 'Hindi Needs Focus', description: 'Currently at rank #8. Focus on grammar can improve standing', icon: 'fa-exclamation-triangle', color: '#f59e0b' },
      { type: 'prediction', title: 'Next Term GPA Forecast', description: 'Predicted GPA: 8.9 (↑ 0.2) with current trajectory', icon: 'fa-chart-line', color: '#3b82f6' },
      { type: 'recommendation', title: 'Improve Geometry Skills', description: 'Practice 5 problems daily for better performance', icon: 'fa-lightbulb', color: '#8b5cf6' }
    ],
    '2': [
      { type: 'strength', title: 'Overall Excellence', description: 'Maintaining top 3 rank across all subjects', icon: 'fa-star', color: '#10ac8b' },
      { type: 'prediction', title: 'Next Term GPA Forecast', description: 'Predicted GPA: 9.4 (↑ 0.2) - On track for excellence', icon: 'fa-chart-line', color: '#3b82f6' },
      { type: 'recommendation', title: 'Challenge with Advanced Topics', description: 'Ready for olympiad-level problems', icon: 'fa-rocket', color: '#8b5cf6' }
    ]
  };

  // Generate attendance data for last 30 days
  const generateAttendanceData = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();

      let status: 'present' | 'absent' | 'half-day' | 'holiday';
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'holiday';
      } else {
        const rand = Math.random();
        if (rand > 0.95) status = 'absent';
        else if (rand > 0.93) status = 'half-day';
        else status = 'present';
      }

      records.push({
        date: date.toISOString().split('T')[0],
        status
      });
    }
    return records;
  };

  const attendanceData = generateAttendanceData();

  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];
  const currentSubjects = subjectStatuses[selectedStudent] || [];
  const currentAssessments = assessments[selectedStudent] || [];
  const currentAssignments = assignments[selectedStudent] || [];
  const currentActivity = activityFeed[selectedStudent] || [];
  const currentTrends = performanceTrends[selectedStudent] || [];
  const currentInsights = smartInsights[selectedStudent] || [];

  // Calculate assignment counts
  const pendingAssignments = currentAssignments.filter(a => a.status === 'not-started' || a.status === 'in-progress').length;
  const overdueAssignments = currentAssignments.filter(a => a.status === 'overdue').length;

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handler Functions
  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast(`Performance report for ${currentStudent.name} downloaded successfully!`, 'success');
      console.log('Downloading performance report for:', currentStudent.name);
    }, 1500);
  };

  const handleMessageTeachers = () => {
    setShowMessageModal(true);
  };

  const handleSchedulePTM = () => {
    setShowPTMModal(true);
  };

  const handleSetGoals = () => {
    setShowGoalsModal(true);
  };

  const handleSubjectClick = (subject: SubjectStatus) => {
    setSelectedSubject(subject);
    setShowSubjectDetailModal(true);
  };

  const handleToggleNotificationPanel = () => {
    setShowNotificationPanel(!showNotificationPanel);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message sent successfully to teacher(s)!', 'success');
    setShowMessageModal(false);
  };

  const handleSubmitPTM = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('PTM scheduled successfully! You will receive a confirmation email.', 'success');
    setShowPTMModal(false);
  };

  const handleSubmitGoals = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Goals saved successfully! Track your progress in the dashboard.', 'success');
    setShowGoalsModal(false);
  };

  // Animated stats effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedGPA(prev => prev < currentStudent.currentGPA ? Math.min(prev + 0.1, currentStudent.currentGPA) : currentStudent.currentGPA);
      setAnimatedRank(prev => prev < currentStudent.classRank ? prev + 1 : currentStudent.classRank);
      setAnimatedAttendance(prev => prev < currentStudent.overallAttendance ? prev + 1 : currentStudent.overallAttendance);
      setAnimatedAssignments(prev => prev < pendingAssignments ? prev + 1 : pendingAssignments);
    }, 20);
    return () => clearInterval(interval);
  }, [currentStudent, pendingAssignments]);

  // Auto-refresh simulation
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A+')) return '#10ac8b';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#f59e0b';
    if (grade.startsWith('C')) return '#f97316';
    return '#ef4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10ac8b';
      case 'good': return '#3b82f6';
      case 'average': return '#f59e0b';
      case 'needs-attention': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return { icon: '↑', color: '#10ac8b' };
    if (trend === 'down') return { icon: '↓', color: '#ef4444' };
    return { icon: '→', color: '#6b7280' };
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return '#ef4444';
      case 'submitted': return '#10ac8b';
      case 'graded': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    return timestamp; // Already formatted in data
  };

  return (
    <div className="performance-dashboard-page">
      {/* Notification Bell */}
      {currentActivity.length > 5 && (
        <div className="notification-bell-container">
          <button
            className="notification-bell-btn"
            onClick={handleToggleNotificationPanel}
            title="View recent updates"
          >
            <i className="fas fa-bell"></i>
            <span className="notification-count">{Math.min(currentActivity.length, 9)}</span>
          </button>
        </div>
      )}

      {/* Student Selector & Quick Stats */}
      <div className="dashboard-header">
        <div className="header-top">
          <div className="student-selector-compact">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Class {student.class}{student.section}
                </option>
              ))}
            </select>
          </div>
          <div className="header-actions">
            <div className="last-updated">
              <i className="fas fa-clock"></i>
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <button className="refresh-btn" onClick={handleRefresh} disabled={isRefreshing}>
              <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="quick-stats-grid">
          <div className="stat-card gpa">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <h3>{animatedGPA.toFixed(1)}</h3>
              <p>Current GPA</p>
              <span className="stat-trend positive">↑ 0.1 from last month</span>
            </div>
          </div>

          <div className="stat-card rank">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-content">
              <h3>#{animatedRank}</h3>
              <p>Class Rank</p>
              <span className="stat-detail">out of {currentStudent.totalStudents}</span>
            </div>
          </div>

          <div className="stat-card attendance">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <h3>{animatedAttendance}%</h3>
              <p>Attendance</p>
              <span className="stat-detail">Last 30 days</span>
            </div>
          </div>

          <div className="stat-card assignments">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-content">
              <h3>{animatedAssignments}</h3>
              <p>Pending Tasks</p>
              {overdueAssignments > 0 && (
                <span className="stat-alert">{overdueAssignments} overdue!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Left Column - Performance Metrics */}
        <div className="main-column">
          {/* Live Performance Metrics */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-chart-bar"></i>
                Live Performance Metrics
              </h2>
              <div className="section-actions">
                <button className="filter-btn active">All Subjects</button>
              </div>
            </div>

            <div className="subjects-performance-grid">
              {currentSubjects.map((subject, index) => {
                const trend = getTrendIcon(subject.trend);
                return (
                  <div
                    key={index}
                    className={`subject-performance-card ${subject.status}`}
                    onClick={() => handleSubjectClick(subject)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="subject-header">
                      <div className="subject-info">
                        <h4>{subject.subject}</h4>
                        <span className="last-updated">{subject.lastUpdated}</span>
                      </div>
                      <span className="subject-grade" style={{ background: getGradeColor(subject.grade) }}>
                        {subject.grade}
                      </span>
                    </div>

                    <div className="subject-score">
                      <div className="score-main">
                        <span className="current-marks">{subject.currentMarks}</span>
                        <span className="total-marks">/{subject.totalMarks}</span>
                      </div>
                      <div className="score-percentage">{subject.percentage}%</div>
                    </div>

                    <div className="subject-comparison">
                      <div className="comparison-bar">
                        <div className="bar-track">
                          <div
                            className="bar-fill student"
                            style={{ width: `${subject.percentage}%`, background: getGradeColor(subject.grade) }}
                          ></div>
                        </div>
                        <span className="bar-label">You: {subject.percentage}%</span>
                      </div>
                      <div className="comparison-bar">
                        <div className="bar-track">
                          <div
                            className="bar-fill average"
                            style={{ width: `${(subject.classAverage / subject.totalMarks) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">Class Avg: {subject.classAverage}</span>
                      </div>
                    </div>

                    <div className="subject-stats">
                      <div className="stat-item">
                        <i className="fas fa-medal"></i>
                        <span>Rank #{subject.rank}</span>
                      </div>
                      <div className="stat-item">
                        <i className="fas fa-user-check"></i>
                        <span>{subject.attendance}% attend</span>
                      </div>
                      <div className={`stat-item trend ${subject.trend}`}>
                        <span style={{ color: trend.color }}>{trend.icon} {Math.abs(subject.trendPercentage)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Assessments & Assignments */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-clipboard-list"></i>
                Assessments & Assignments
              </h2>
            </div>

            <div className="assessments-assignments-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {/* Upcoming Tests */}
              <div className="subsection">
                <h3>Upcoming Tests & Exams</h3>
                <div className="upcoming-tests-list">
                  {currentAssessments.filter(a => a.status === 'upcoming').map(assessment => (
                    <div key={assessment.id} className="assessment-item upcoming">
                      <div className="assessment-icon">
                        <i className={`fas fa-${assessment.type === 'exam' ? 'file-alt' : assessment.type === 'quiz' ? 'clipboard-question' : 'file-alt'}`}></i>
                      </div>
                      <div className="assessment-info">
                        <h4>{assessment.title}</h4>
                        <p className="assessment-subject">{assessment.subject}</p>
                        <p className="assessment-topics">Topics: {assessment.syllabusTopics.join(', ')}</p>
                      </div>
                      <div className="assessment-timing">
                        <div className="days-until">
                          <span className="days-number">{assessment.daysUntil}</span>
                          <span className="days-label">day{assessment.daysUntil !== 1 ? 's' : ''}</span>
                        </div>
                        <span className="assessment-date">{new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Results */}
              <div className="subsection">
                <h3>Recent Test Results</h3>
                <div className="recent-tests-list">
                  {currentAssessments.filter(a => a.status === 'completed').slice(0, 3).map(assessment => (
                    <div key={assessment.id} className="assessment-item completed">
                      <div className="assessment-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="assessment-info">
                        <h4>{assessment.title}</h4>
                        <p className="assessment-subject">{assessment.subject}</p>
                      </div>
                      <div className="assessment-result">
                        <span className="result-marks">{assessment.marksObtained}/{assessment.totalMarks}</span>
                        <span className="result-grade" style={{ background: getGradeColor(assessment.grade!) }}>
                          {assessment.grade}
                        </span>
                        <span className="result-rank">Rank #{assessment.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments */}
              <div className="subsection" style={{ gridColumn: '1 / -1' }}>
                <h3>Assignments Status</h3>
                <div className="assignments-list">
                  {currentAssignments.slice(0, 5).map(assignment => (
                    <div key={assignment.id} className={`assignment-item ${assignment.status}`}>
                      <div className="assignment-icon" style={{ background: getAssignmentStatusColor(assignment.status) }}>
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="assignment-info">
                        <h4>{assignment.title}</h4>
                        <p className="assignment-subject">{assignment.subject}</p>
                        <p className="assignment-dates">
                          Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="assignment-status-info">
                        <span className={`status-badge ${assignment.status}`}>
                          {assignment.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {assignment.daysRemaining !== undefined && assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                          <span className={`days-remaining ${assignment.daysRemaining < 0 ? 'overdue' : assignment.daysRemaining <= 1 ? 'urgent' : ''}`}>
                            {assignment.daysRemaining < 0 ? `${Math.abs(assignment.daysRemaining)} days overdue` : assignment.daysRemaining === 0 ? 'Due today' : `${assignment.daysRemaining} days left`}
                          </span>
                        )}
                        {assignment.marksObtained && (
                          <span className="assignment-marks">{assignment.marksObtained}/{assignment.totalMarks}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Activity */}
        <div className="side-column">
          {/* Smart Insights */}
          <div className="dashboard-section insights-panel">
            <div className="section-header">
              <h2>
                <i className="fas fa-brain"></i>
                Smart Insights
              </h2>
            </div>
            <div className="insights-list">
              {currentInsights.map((insight, index) => (
                <div key={index} className={`insight-card ${insight.type}`}>
                  <div className="insight-icon" style={{ color: insight.color }}>
                    <i className={`fas ${insight.icon}`}></i>
                  </div>
                  <div className="insight-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="dashboard-section activity-feed">
            <div className="section-header">
              <h2>
                <i className="fas fa-history"></i>
                Recent Activity
              </h2>
            </div>
            <div className="activity-timeline">
              {currentActivity.slice(0, 8).map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon" style={{ background: activity.color }}>
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Monitor */}
          <div className="dashboard-section attendance-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-calendar-check"></i>
                Attendance Monitor
              </h2>
            </div>
            <div className="attendance-summary">
              <div className="attendance-stat">
                <span className="stat-label">This Month</span>
                <span className="stat-value">{currentStudent.overallAttendance}%</span>
              </div>
              <div className="attendance-status present">
                <i className="fas fa-check-circle"></i>
                <span>Present Today</span>
              </div>
            </div>
            <div className="attendance-calendar">
              {attendanceData.slice(-14).map((record, index) => {
                const date = new Date(record.date);
                return (
                  <div key={index} className={`attendance-day ${record.status}`} title={`${date.toLocaleDateString()}: ${record.status}`}>
                    <span className="day-number">{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
            <div className="attendance-legend">
              <div className="legend-item">
                <span className="legend-color present"></span>
                <span>Present</span>
              </div>
              <div className="legend-item">
                <span className="legend-color absent"></span>
                <span>Absent</span>
              </div>
              <div className="legend-item">
                <span className="legend-color half-day"></span>
                <span>Half Day</span>
              </div>
              <div className="legend-item">
                <span className="legend-color holiday"></span>
                <span>Holiday</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn" onClick={handleDownloadReport} disabled={isDownloading}>
                <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'file-download'}`}></i>
                <span>{isDownloading ? 'Downloading...' : 'Download Report'}</span>
              </button>
              <button className="action-btn" onClick={handleMessageTeachers}>
                <i className="fas fa-envelope"></i>
                <span>Message Teachers</span>
              </button>
              <button className="action-btn" onClick={handleSchedulePTM}>
                <i className="fas fa-calendar-alt"></i>
                <span>Schedule PTM</span>
              </button>
              <button className="action-btn" onClick={handleSetGoals}>
                <i className="fas fa-bullseye"></i>
                <span>Set Goals</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Teachers Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-envelope" style={{ marginRight: '12px' }}></i> Message Teachers</h2>
              <button className="modal-close-btn" onClick={() => setShowMessageModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitMessage} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label>Select Teacher(s)</label>
                <select>
                  <option value="">Choose a teacher...</option>
                  {currentSubjects.map((subject, idx) => (
                    <option key={idx} value={subject.subject}>{subject.subject} Teacher</option>
                  ))}
                  <option value="all">All Teachers</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="Enter subject (optional)" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={6}
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn primary">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule PTM Modal */}
      {showPTMModal && (
        <div className="modal-overlay" onClick={() => setShowPTMModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-calendar-alt" style={{ marginRight: '12px' }}></i> Schedule Parent-Teacher Meeting</h2>
              <button className="modal-close-btn" onClick={() => setShowPTMModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitPTM} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label>Preferred Date</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select required>
                  <option value="">Select time slot</option>
                  <option value="9:00 AM">9:00 AM - 10:00 AM</option>
                  <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                  <option value="2:00 PM">2:00 PM - 3:00 PM</option>
                  <option value="3:00 PM">3:00 PM - 4:00 PM</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Teacher(s)</label>
                <select>
                  <option value="">Choose a teacher...</option>
                  {currentSubjects.map((subject, idx) => (
                    <option key={idx} value={subject.subject}>{subject.subject} Teacher</option>
                  ))}
                  <option value="class-teacher">Class Teacher</option>
                </select>
              </div>
              <div className="form-group">
                <label>Purpose/Topic</label>
                <textarea
                  rows={4}
                  placeholder="What would you like to discuss?"
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={() => setShowPTMModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn primary">
                  <i className="fas fa-check"></i> Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Goals Modal */}
      {showGoalsModal && (
        <div className="modal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-bullseye" style={{ marginRight: '12px' }}></i> Set Academic Goals</h2>
              <button className="modal-close-btn" onClick={() => setShowGoalsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitGoals} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label>Target GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder={`Current: ${currentStudent.currentGPA}`}
                  required
                />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <select required>
                  <option value="">Select timeline</option>
                  <option value="this-term">End of This Term</option>
                  <option value="next-term">End of Next Term</option>
                  <option value="this-year">End of This Year</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject-wise Goals (Optional)</label>
                {currentSubjects.slice(0, 5).map((subject, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', color: '#6b7280' }}>{subject.subject}</label>
                    <input
                      type="number"
                      placeholder={`Current: ${subject.percentage}%`}
                      min="0"
                      max="100"
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any specific areas of focus or improvement goals..."
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={() => setShowGoalsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn primary">
                  <i className="fas fa-save"></i> Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {showSubjectDetailModal && selectedSubject && (
        <div className="modal-overlay" onClick={() => setShowSubjectDetailModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-book" style={{ marginRight: '12px' }}></i> {selectedSubject.subject} - Detailed Performance</h2>
              <button className="modal-close-btn" onClick={() => setShowSubjectDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="subject-detail-grid" style={{ padding: '16px 20px' }}>
              <div className="detail-section">
                <h3>Current Performance</h3>
                <div className="performance-stats">
                  <div className="stat-box">
                    <span className="stat-label">Current Marks</span>
                    <span className="stat-value">{selectedSubject.currentMarks}/{selectedSubject.totalMarks}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Percentage</span>
                    <span className="stat-value">{selectedSubject.percentage}%</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Grade</span>
                    <span className="stat-value" style={{ color: getGradeColor(selectedSubject.grade) }}>
                      {selectedSubject.grade}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Class Rank</span>
                    <span className="stat-value">#{selectedSubject.rank}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Comparison with Class</h3>
                <div className="comparison-detail">
                  <div className="comparison-row">
                    <span>Your Score:</span>
                    <strong>{selectedSubject.percentage}%</strong>
                  </div>
                  <div className="comparison-row">
                    <span>Class Average:</span>
                    <strong>{selectedSubject.classAverage}%</strong>
                  </div>
                  <div className="comparison-row">
                    <span>Difference:</span>
                    <strong style={{ color: selectedSubject.percentage > selectedSubject.classAverage ? '#10ac8b' : '#ef4444' }}>
                      {selectedSubject.percentage > selectedSubject.classAverage ? '+' : ''}{(selectedSubject.percentage - selectedSubject.classAverage).toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Recent Scores Trend</h3>
                <div className="scores-trend">
                  {selectedSubject.recentScores.map((score, idx) => (
                    <div key={idx} className="score-bar">
                      <span className="score-label">Test {idx + 1}</span>
                      <div className="score-bar-track">
                        <div
                          className="score-bar-fill"
                          style={{ width: `${score}%`, background: getGradeColor(score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B') }}
                        ></div>
                      </div>
                      <span className="score-value">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Attendance & Trend</h3>
                <div className="attendance-trend-detail">
                  <div className="attendance-stat-large">
                    <i className="fas fa-user-check"></i>
                    <span>{selectedSubject.attendance}% Attendance</span>
                  </div>
                  <div className="trend-stat-large">
                    <i className={`fas fa-arrow-${selectedSubject.trend === 'up' ? 'up' : selectedSubject.trend === 'down' ? 'down' : 'right'}`}
                       style={{ color: getTrendIcon(selectedSubject.trend).color }}></i>
                    <span>{selectedSubject.trend === 'up' ? 'Improving' : selectedSubject.trend === 'down' ? 'Declining' : 'Stable'}</span>
                    <span className="trend-percent">{Math.abs(selectedSubject.trendPercentage)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowSubjectDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {showNotificationPanel && currentActivity.length > 0 && (
        <div className="ai-alerts-banner">
          <div className="alerts-banner-header">
            <h3>
              <i className="fas fa-bell"></i>
              Notifications ({currentActivity.length})
            </h3>
            <button className="close-alerts-btn" onClick={() => setShowNotificationPanel(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          {currentActivity.map(activity => (
            <div key={activity.id} className={`ai-alert ${activity.type === 'achievement' ? 'success' : activity.type === 'test' ? 'info' : 'info'} medium`}>
              <div className="alert-icon">
                <i className={`fas ${activity.icon}`}></i>
              </div>
              <div className="alert-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <span className="activity-time" style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', display: 'block' }}>
                  {activity.timestamp}
                </span>
              </div>
              <button className="alert-dismiss" onClick={(e) => {
                e.stopPropagation();
                showToast('Notification dismissed', 'info');
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
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

export default PerformanceDashboard;
