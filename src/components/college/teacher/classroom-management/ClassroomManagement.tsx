import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import EngagementAnalyticsDashboard from './EngagementAnalyticsDashboard';

// Interfaces
interface Class {
  id: string;
  name: string;
  code: string;
  semester: string;
  students: number;
  schedule: string;
  room: string;
  nextClass: string;
  attendanceRate: number;
  avgEngagement: number;
  currentlyActive?: boolean;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  attendance?: 'present' | 'absent' | 'late' | 'leave';
  engagementScore?: number;
  attentionLevel?: 'high' | 'medium' | 'low';
  questionsAsked?: number;
  participationCount?: number;
  attendanceRate?: number;
  totalClasses?: number;
  attended?: number;
  absent?: number;
  late?: number;
  trend?: 'improving' | 'declining' | 'stable';
  riskLevel?: 'low' | 'medium' | 'high';
}

interface ProxyAlert {
  id: string;
  studentName: string;
  rollNumber: string;
  date: string;
  time: string;
  reason: string;
  confidence: number;
}

type MainTab = 'dashboard' | 'my-classes' | 'live-engagement' | 'analytics';
type AnalyticsTab = 'overview' | 'students' | 'alerts' | 'interventions';
type AttendanceMode = 'roll-call' | 'qr-scan';

const ClassroomManagement = () => {
  // Main navigation state
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<AnalyticsTab>('overview');
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('roll-call');

  // View states
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isLiveEngagement, setIsLiveEngagement] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [qrScanning, setQrScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Data
  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS301',
      semester: 'Fall 2025',
      students: 45,
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 301',
      nextClass: 'Today at 9:00 AM',
      attendanceRate: 93,
      avgEngagement: 88,
      currentlyActive: true
    },
    {
      id: '2',
      name: 'Algorithms',
      code: 'CS401',
      semester: 'Fall 2025',
      students: 38,
      schedule: 'Tue, Thu - 11:00 AM',
      room: 'Room 405',
      nextClass: 'Today at 11:00 AM',
      attendanceRate: 89,
      avgEngagement: 85
    },
    {
      id: '3',
      name: 'Database Systems',
      code: 'CS302',
      semester: 'Fall 2025',
      students: 50,
      schedule: 'Mon, Wed - 2:00 PM',
      room: 'Lab 2A',
      nextClass: 'Today at 2:00 PM',
      attendanceRate: 91,
      avgEngagement: 92
    },
    {
      id: '4',
      name: 'Operating Systems',
      code: 'CS303',
      semester: 'Fall 2025',
      students: 42,
      schedule: 'Tue, Thu, Fri - 3:00 PM',
      room: 'Room 302',
      nextClass: 'Tomorrow at 3:00 PM',
      attendanceRate: 87,
      avgEngagement: 80
    },
    {
      id: '5',
      name: 'Computer Networks',
      code: 'CS304',
      semester: 'Fall 2025',
      students: 46,
      schedule: 'Mon, Wed, Fri - 1:00 PM',
      room: 'Lab 3B',
      nextClass: 'Tomorrow at 1:00 PM',
      attendanceRate: 95,
      avgEngagement: 94
    },
    {
      id: '6',
      name: 'Software Engineering',
      code: 'CS402',
      semester: 'Fall 2025',
      students: 46,
      schedule: 'Tue, Thu - 4:00 PM',
      room: 'Room 406',
      nextClass: 'Tomorrow at 4:00 PM',
      attendanceRate: 90,
      avgEngagement: 87
    }
  ]);

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Aravind Kumar', rollNumber: 'CS301-001', email: 'aravind.k@college.edu', engagementScore: 92, attentionLevel: 'high', questionsAsked: 3, participationCount: 5, attendanceRate: 95, totalClasses: 40, attended: 38, absent: 2, late: 1, trend: 'stable', riskLevel: 'low' },
    { id: '2', name: 'Priya Lakshmi', rollNumber: 'CS301-002', email: 'priya.l@college.edu', engagementScore: 88, attentionLevel: 'high', questionsAsked: 2, participationCount: 4, attendanceRate: 92, totalClasses: 40, attended: 37, absent: 3, late: 0, trend: 'stable', riskLevel: 'low' },
    { id: '3', name: 'Rajesh Kannan', rollNumber: 'CS301-003', email: 'rajesh.k@college.edu', engagementScore: 75, attentionLevel: 'medium', questionsAsked: 1, participationCount: 2, attendanceRate: 88, totalClasses: 40, attended: 35, absent: 4, late: 2, trend: 'improving', riskLevel: 'low' },
    { id: '4', name: 'Karthik Raj', rollNumber: 'CS301-004', email: 'karthik.r@college.edu', engagementScore: 68, attentionLevel: 'medium', questionsAsked: 1, participationCount: 1, attendanceRate: 68, totalClasses: 40, attended: 27, absent: 11, late: 4, trend: 'declining', riskLevel: 'high' },
    { id: '5', name: 'Divya Bharathi', rollNumber: 'CS301-005', email: 'divya.b@college.edu', engagementScore: 95, attentionLevel: 'high', questionsAsked: 4, participationCount: 6, attendanceRate: 98, totalClasses: 40, attended: 39, absent: 1, late: 0, trend: 'stable', riskLevel: 'low' },
    { id: '6', name: 'Vishnu Prasad', rollNumber: 'CS301-006', email: 'vishnu.p@college.edu', engagementScore: 45, attentionLevel: 'low', questionsAsked: 0, participationCount: 0, attendanceRate: 72, totalClasses: 40, attended: 29, absent: 9, late: 3, trend: 'declining', riskLevel: 'medium' },
    { id: '7', name: 'Meenakshi Sundaram', rollNumber: 'CS301-007', email: 'meenakshi.s@college.edu', engagementScore: 82, attentionLevel: 'high', questionsAsked: 2, participationCount: 3, attendanceRate: 85, totalClasses: 40, attended: 34, absent: 5, late: 2, trend: 'stable', riskLevel: 'low' },
    { id: '8', name: 'Lakshmi Devi', rollNumber: 'CS301-008', email: 'lakshmi.d@college.edu', engagementScore: 58, attentionLevel: 'low', questionsAsked: 0, participationCount: 1, attendanceRate: 65, totalClasses: 40, attended: 26, absent: 12, late: 5, trend: 'declining', riskLevel: 'high' },
    { id: '9', name: 'Suresh Babu', rollNumber: 'CS301-009', email: 'suresh.b@college.edu', attendanceRate: 90, totalClasses: 40, attended: 36, absent: 3, late: 1, trend: 'stable', riskLevel: 'low' },
    { id: '10', name: 'Deepa Nair', rollNumber: 'CS301-010', email: 'deepa.n@college.edu', attendanceRate: 87, totalClasses: 40, attended: 35, absent: 4, late: 2, trend: 'improving', riskLevel: 'low' },
  ]);

  const [proxyAlerts] = useState<ProxyAlert[]>([
    { id: '1', studentName: 'Karthik Raj', rollNumber: 'CS301-004', date: '2025-11-18', time: '9:00 AM', reason: 'Different device ID detected', confidence: 85 },
    { id: '2', studentName: 'Vishnu Prasad', rollNumber: 'CS301-006', date: '2025-11-17', time: '11:00 AM', reason: 'Location mismatch', confidence: 72 },
  ]);

  // Auto-detect current class for Live Engagement
  const currentClass = classes.find(c => c.currentlyActive) || classes[0];

  // Live engagement timer
  useEffect(() => {
    if (isLiveEngagement) {
      const timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        setStudents(prevStudents => prevStudents.map(student => ({
          ...student,
          engagementScore: student.engagementScore
            ? Math.max(0, Math.min(100, student.engagementScore + (Math.random() - 0.5) * 5))
            : undefined
        })));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLiveEngagement]);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return '#10ac8b';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return '#10ac8b';
    if (rate >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskColor = (level: string) => {
    if (level === 'low') return '#10ac8b';
    if (level === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return 'fa-arrow-up';
    if (trend === 'declining') return 'fa-arrow-down';
    return 'fa-minus';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return '#10ac8b';
    if (trend === 'declining') return '#ef4444';
    return '#6c757d';
  };

  const handleMarkAttendanceClick = (classData: Class) => {
    setSelectedClass(classData);
    setShowAttendanceView(true);
  };

  const handleBackToClasses = () => {
    setShowAttendanceView(false);
    setSelectedClass(null);
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, attendance: status } : s
    ));
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map(s => ({ ...s, attendance: 'present' })));
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    setTimeout(() => {
      const presentCount = students.filter(s => s.attendance === 'present').length;
      const absentCount = students.filter(s => s.attendance === 'absent').length;
      const lateCount = students.filter(s => s.attendance === 'late').length;
      const leaveCount = students.filter(s => s.attendance === 'leave').length;

      alert(`✅ Attendance saved successfully!\n\nPresent: ${presentCount}\nAbsent: ${absentCount}\nLate: ${lateCount}\nLeave: ${leaveCount}\n\nAlerts sent to absentees and parents.`);
      setIsSaving(false);
      handleBackToClasses();
    }, 1000);
  };

  // Calculate stats
  const avgAttendance = Math.round(classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length);
  const avgEngagement = Math.round(classes.reduce((sum, c) => sum + c.avgEngagement, 0) / classes.length);
  const activeAlerts = 3;
  const atRiskStudents = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
  const presentCount = students.filter(s => s.attendance === 'present').length;
  const absentCount = students.filter(s => s.attendance === 'absent').length;
  const lateCount = students.filter(s => s.attendance === 'late').length;
  const leaveCount = students.filter(s => s.attendance === 'leave').length;
  const unmarkedCount = students.filter(s => !s.attendance).length;
  const totalMarked = presentCount + absentCount + lateCount + leaveCount;
  const progressPercentage = (totalMarked / students.length) * 100;
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const highEngagement = students.filter(s => (s.engagementScore || 0) >= 80).length;
  const mediumEngagement = students.filter(s => (s.engagementScore || 0) >= 60 && (s.engagementScore || 0) < 80).length;
  const lowEngagement = students.filter(s => (s.engagementScore || 0) < 60 && s.engagementScore !== undefined).length;
  const avgEngagementScore = Math.round(students.reduce((sum, s) => sum + (s.engagementScore || 0), 0) / students.filter(s => s.engagementScore !== undefined).length);
  const excellentAttendance = students.filter(s => (s.attendanceRate || 0) >= 90).length;

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>Intelligent Classroom Management</h1>
            <p>Streamline attendance, monitor engagement, and gain actionable insights</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-chalkboard-teacher"></i>
            <div>
              <strong>{classes.length}</strong>
              <span>Active Classes</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h4>Today's Attendance</h4>
              <p className="stat-value">
                {avgAttendance}% <span className="stat-total">avg rate</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${avgAttendance}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Engagement</h4>
              <p className="stat-value">
                {avgEngagement}% <span className="stat-total">this week</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${avgEngagement}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>Active Alerts</h4>
              <p className="stat-value">
                {activeAlerts} <span className="stat-total">require action</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
          { id: 'my-classes', icon: 'fa-chalkboard', label: 'My Classes' },
          { id: 'live-engagement', icon: 'fa-video', label: 'Live Engagement' },
          { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MainTab)}
            style={{
              padding: '16px',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                : '#ffffff',
              border: activeTab === tab.id ? 'none' : '2px solid #e9ecef',
              borderRadius: '12px',
              color: activeTab === tab.id ? '#ffffff' : '#6c757d',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: '20px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div className="dashboard-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(9, 77, 136, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '24px',
                color: '#094d88'
              }}>
                <i className="fas fa-chalkboard"></i>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>{classes.length}</h4>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Active Classes</p>
              <span style={{ fontSize: '12px', color: '#10ac8b', fontWeight: '600' }}>
                <i className="fas fa-arrow-up"></i> +1 this sem
              </span>
            </div>

            <div className="dashboard-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(16, 172, 139, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '24px',
                color: '#10ac8b'
              }}>
                <i className="fas fa-users"></i>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </h4>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Students</p>
              <span style={{ fontSize: '12px', color: '#10ac8b', fontWeight: '600' }}>
                <i className="fas fa-arrow-up"></i> +12 this month
              </span>
            </div>

            <div className="dashboard-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '24px',
                color: '#f59e0b'
              }}>
                <i className="fas fa-calendar-week"></i>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>24</h4>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Classes This Week</p>
              <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>
                18 completed
              </span>
            </div>

            <div className="dashboard-card" style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '24px',
                color: '#ef4444'
              }}>
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                {atRiskStudents.length}
              </h4>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>At-Risk Students</p>
              <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
                <i className="fas fa-arrow-down"></i> -2 this week
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="dashboard-grid">
            {/* Today's Classes */}
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title">
                  <i className="fas fa-calendar-day"></i>
                  <div>
                    <h3>Today's Classes</h3>
                    <p>Wednesday, November 19, 2025</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                {classes.slice(0, 3).map((classItem) => (
                  <div key={classItem.id} className="schedule-item" style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedClass(classItem);
                      setActiveTab('mark-attendance');
                    }}>
                    <div className="schedule-time">
                      <span className="time-value">{classItem.schedule.split(' - ')[1]?.split(':')[0] || '9'}</span>
                      <span className="time-period">AM</span>
                    </div>
                    <div className="schedule-details">
                      <h4>{classItem.name} - {classItem.code}</h4>
                      <div className="schedule-meta">
                        <span>
                          <i className="fas fa-users"></i> {classItem.students} students
                        </span>
                        <span>
                          <i className="fas fa-clock"></i> 1 hour
                        </span>
                        <span>
                          <i className="fas fa-map-marker-alt"></i> {classItem.room}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            backgroundColor: `rgba(${classItem.attendanceRate >= 90 ? '16, 172, 139' : '245, 158, 11'}, 0.1)`,
                            color: classItem.attendanceRate >= 90 ? '#10ac8b' : '#f59e0b',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}
                        >
                          Attendance: {classItem.attendanceRate}%
                        </span>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title">
                  <i className="fas fa-bell"></i>
                  <div>
                    <h3>Alerts & Notifications</h3>
                    <p>Requires your attention</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="deadline-item urgent">
                  <div className="deadline-icon">
                    <i className="fas fa-user-times"></i>
                  </div>
                  <div className="deadline-details">
                    <h4>Low Attendance Alert</h4>
                    <div className="deadline-meta">
                      <span>Karthik Raj - CS301</span>
                      <span className="deadline-tag" style={{ backgroundColor: '#dc3545' }}>Critical</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                      Attendance below 75% threshold (68%)
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#094d88',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    View
                  </button>
                </div>

                <div className="deadline-item urgent">
                  <div className="deadline-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="deadline-details">
                    <h4>Possible Proxy Detection</h4>
                    <div className="deadline-meta">
                      <span>CS401 - Today 11:00 AM</span>
                      <span className="deadline-tag" style={{ backgroundColor: '#f59e0b' }}>Warning</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                      2 students flagged for review
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('analytics');
                      setAnalyticsSubTab('alerts');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#094d88',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Review
                  </button>
                </div>

                <div className="deadline-item">
                  <div className="deadline-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="deadline-details">
                    <h4>Engagement Improvement</h4>
                    <div className="deadline-meta">
                      <span>CS302 - This Week</span>
                      <span className="deadline-tag" style={{ backgroundColor: '#10ac8b' }}>Good</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                      Class engagement up by 15%
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10ac8b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'my-classes' && !showAttendanceView && (
        <>
          {/* Classes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: '20px'
          }}>
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="dashboard-card"
                style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Class Header */}
                <div style={{ marginBottom: '16px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                        {classItem.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                        {classItem.code} • {classItem.semester}
                      </p>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(9, 77, 136, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#094d88'
                    }}>
                      {classItem.students} students
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6c757d' }}>
                      <i className="fas fa-clock" style={{ fontSize: '12px' }}></i>
                      {classItem.schedule}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6c757d' }}>
                      <i className="fas fa-map-marker-alt" style={{ fontSize: '12px' }}></i>
                      {classItem.room}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <i className="fas fa-user-check" style={{ fontSize: '14px', color: getAttendanceColor(classItem.attendanceRate) }}></i>
                      <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Attendance Rate</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: getAttendanceColor(classItem.attendanceRate) }}>
                      {classItem.attendanceRate}%
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <i className="fas fa-chart-line" style={{ fontSize: '14px', color: getEngagementColor(classItem.avgEngagement) }}></i>
                      <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Engagement</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: getEngagementColor(classItem.avgEngagement) }}>
                      {classItem.avgEngagement}%
                    </div>
                  </div>
                </div>

                {/* Next Class Info */}
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(16, 172, 139, 0.05)',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-calendar-alt" style={{ fontSize: '14px', color: '#10ac8b' }}></i>
                    <span style={{ fontSize: '13px', color: '#212529', fontWeight: '600' }}>Next Class:</span>
                    <span style={{ fontSize: '13px', color: '#6c757d' }}>{classItem.nextClass}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleMarkAttendanceClick(classItem)}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-user-check"></i>
                    Mark Attendance
                  </button>

                  <button
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      color: '#094d88',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#094d88';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e9ecef';
                    }}
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'my-classes' && showAttendanceView && selectedClass && (
        <div className="dashboard-card">
          {/* Back Button */}
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <button
              onClick={handleBackToClasses}
              style={{
                background: '#ffffff',
                border: '2px solid #094d88',
                borderRadius: '10px',
                padding: '10px 20px',
                color: '#094d88',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#094d88';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#094d88';
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Classes
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              Mark Attendance - {selectedClass.name} ({selectedClass.code})
            </h3>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>
              {selectedClass.room} • {selectedClass.students} students
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>Progress</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#094d88' }}>
                {totalMarked} / {students.length} marked ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
          </div>

          {/* Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(16, 172, 139, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10ac8b', marginBottom: '4px' }}>{presentCount}</div>
              <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Present</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>{absentCount}</div>
              <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Absent</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>{lateCount}</div>
              <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Late</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>{leaveCount}</div>
              <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Leave</div>
            </div>
          </div>

          {/* Mode Tabs */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setAttendanceMode('roll-call')}
              style={{
                flex: 1,
                padding: '12px',
                background: attendanceMode === 'roll-call' ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#ffffff',
                border: attendanceMode === 'roll-call' ? 'none' : '2px solid #e9ecef',
                borderRadius: '10px',
                color: attendanceMode === 'roll-call' ? '#ffffff' : '#6c757d',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-list-check"></i>
              Roll Call
            </button>
            <button
              onClick={() => setAttendanceMode('qr-scan')}
              style={{
                flex: 1,
                padding: '12px',
                background: attendanceMode === 'qr-scan' ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#ffffff',
                border: attendanceMode === 'qr-scan' ? 'none' : '2px solid #e9ecef',
                borderRadius: '10px',
                color: attendanceMode === 'qr-scan' ? '#ffffff' : '#6c757d',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-qrcode"></i>
              QR Scan
            </button>
          </div>

          {/* Roll Call Mode */}
          {attendanceMode === 'roll-call' && (
            <>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <i className="fas fa-search" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d',
                    fontSize: '14px'
                  }}></i>
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#212529',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={handleMarkAllPresent}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#10ac8b',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-check-double"></i>
                  Mark All Present
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#094d88',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {student.name.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>
                        {student.name}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0' }}>
                        {student.rollNumber} • {student.email}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['present', 'absent', 'late', 'leave'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: student.attendance === status
                              ? (status === 'present' ? '#10ac8b' : status === 'absent' ? '#ef4444' : status === 'late' ? '#f59e0b' : '#6366f1')
                              : '#ffffff',
                            border: `2px solid ${student.attendance === status
                              ? (status === 'present' ? '#10ac8b' : status === 'absent' ? '#ef4444' : status === 'late' ? '#f59e0b' : '#6366f1')
                              : '#e9ecef'}`,
                            borderRadius: '8px',
                            color: student.attendance === status ? '#ffffff' : '#6c757d',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className={`fas fa-${status === 'present' ? 'check' : status === 'absent' ? 'times' : status === 'late' ? 'clock' : 'door-open'}`}></i>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* QR Scan Mode */}
          {attendanceMode === 'qr-scan' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '300px',
                height: '300px',
                margin: '0 auto 24px',
                backgroundColor: '#ffffff',
                border: '4px solid #094d88',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                color: '#094d88'
              }}>
                <i className="fas fa-qrcode"></i>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '8px' }}>
                Scan QR Code to Mark Attendance
              </h3>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '24px' }}>
                Students can scan this QR code with their mobile devices to mark their attendance
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '32px'
              }}>
                <i className="fas fa-key" style={{ color: '#094d88', fontSize: '16px' }}></i>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>Session Code</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#094d88' }}>
                    {selectedClass.code}-{new Date().getTime().toString().slice(-6)}
                  </div>
                </div>
              </div>

              {qrScanning && (
                <div style={{
                  padding: '20px',
                  backgroundColor: 'rgba(16, 172, 139, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#10ac8b', fontSize: '32px', marginBottom: '12px' }}></i>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#10ac8b' }}>
                    Scanning active - Students can now mark attendance
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
                <button
                  onClick={() => setQrScanning(!qrScanning)}
                  style={{
                    padding: '14px 32px',
                    background: qrScanning ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <i className={qrScanning ? 'fas fa-stop' : 'fas fa-play'}></i>
                  {qrScanning ? 'Stop Scanning' : 'Start Scanning'}
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          {attendanceMode === 'roll-call' && (
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleBackToClasses}
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  color: '#6c757d',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={isSaving || unmarkedCount === students.length}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isSaving || unmarkedCount === students.length ? 'not-allowed' : 'pointer',
                  opacity: isSaving || unmarkedCount === students.length ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live Engagement Tab */}
      {activeTab === 'live-engagement' && (
        <EngagementAnalyticsDashboard />
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Analytics Sub-Tabs */}
          <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
              { id: 'students', icon: 'fa-users', label: 'Students' },
              { id: 'alerts', icon: 'fa-bell', label: 'Proxy Alerts' },
              { id: 'interventions', icon: 'fa-hands-helping', label: 'Interventions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnalyticsSubTab(tab.id as AnalyticsTab)}
                style={{
                  padding: '14px',
                  background: analyticsSubTab === tab.id ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#ffffff',
                  border: analyticsSubTab === tab.id ? 'none' : '2px solid #e9ecef',
                  borderRadius: '10px',
                  color: analyticsSubTab === tab.id ? '#ffffff' : '#6c757d',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Sub-Tab */}
          {analyticsSubTab === 'overview' && (
            <>
              {/* Key Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>Average Attendance</p>
                      <h3 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
                        {Math.round(students.reduce((sum, s) => sum + (s.attendanceRate || 0), 0) / students.length)}%
                      </h3>
                    </div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-user-check" style={{ fontSize: '24px' }}></i>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>Total Students</p>
                      <h3 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{students.length}</h3>
                    </div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-users" style={{ fontSize: '24px' }}></i>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>At Risk Students</p>
                      <h3 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
                        {students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium').length}
                      </h3>
                    </div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px' }}></i>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>Active Classes</p>
                      <h3 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>6</h3>
                    </div>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-chalkboard" style={{ fontSize: '24px' }}></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Attendance Trend Over Time */}
                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#094d88' }}></i>
                      Attendance Trend (Last 30 Days)
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { day: 'Week 1', attendance: 88 },
                      { day: 'Week 2', attendance: 90 },
                      { day: 'Week 3', attendance: 87 },
                      { day: 'Week 4', attendance: 92 },
                      { day: 'Week 5', attendance: 89 },
                      { day: 'Week 6', attendance: 91 }
                    ]}>
                      <defs>
                        <linearGradient id="colorAttendanceTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#094d88" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#094d88" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="day" stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                      <Area type="monotone" dataKey="attendance" stroke="#094d88" strokeWidth={3} fill="url(#colorAttendanceTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Attendance Distribution Pie */}
                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                      Distribution
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent (90%+)', value: excellentAttendance, color: '#10ac8b' },
                          { name: 'Good (75-89%)', value: students.filter(s => (s.attendanceRate || 0) >= 75 && (s.attendanceRate || 0) < 90).length, color: '#094d88' },
                          { name: 'Fair (60-74%)', value: students.filter(s => (s.attendanceRate || 0) >= 60 && (s.attendanceRate || 0) < 75).length, color: '#f59e0b' },
                          { name: 'Critical (<60%)', value: students.filter(s => (s.attendanceRate || 0) < 60).length, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Excellent (90%+)', value: excellentAttendance, color: '#10ac8b' },
                          { name: 'Good (75-89%)', value: students.filter(s => (s.attendanceRate || 0) >= 75 && (s.attendanceRate || 0) < 90).length, color: '#094d88' },
                          { name: 'Fair (60-74%)', value: students.filter(s => (s.attendanceRate || 0) >= 60 && (s.attendanceRate || 0) < 75).length, color: '#f59e0b' },
                          { name: 'Critical (<60%)', value: students.filter(s => (s.attendanceRate || 0) < 60).length, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Student Performance Trends */}
                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                      Student Performance Trends
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { category: 'Improving', count: students.filter(s => s.trend === 'improving').length },
                      { category: 'Stable', count: students.filter(s => s.trend === 'stable').length },
                      { category: 'Declining', count: students.filter(s => s.trend === 'declining').length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="category" stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {[
                          { category: 'Improving', count: students.filter(s => s.trend === 'improving').length },
                          { category: 'Stable', count: students.filter(s => s.trend === 'stable').length },
                          { category: 'Declining', count: students.filter(s => s.trend === 'declining').length }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.category === 'Improving' ? '#10ac8b' : entry.category === 'Stable' ? '#6c757d' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Level Distribution */}
                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#ef4444' }}></i>
                      Risk Level Analysis
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { level: 'Low Risk', count: students.filter(s => s.riskLevel === 'low').length, color: '#10ac8b' },
                      { level: 'Medium Risk', count: students.filter(s => s.riskLevel === 'medium').length, color: '#f59e0b' },
                      { level: 'High Risk', count: students.filter(s => s.riskLevel === 'high').length, color: '#ef4444' }
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis type="number" stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <YAxis dataKey="level" type="category" width={100} stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                        {[
                          { level: 'Low Risk', count: students.filter(s => s.riskLevel === 'low').length, color: '#10ac8b' },
                          { level: 'Medium Risk', count: students.filter(s => s.riskLevel === 'medium').length, color: '#f59e0b' },
                          { level: 'High Risk', count: students.filter(s => s.riskLevel === 'high').length, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Engagement & Class Activity Combined Chart */}
              <div className="dashboard-card">
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                    <i className="fas fa-users-cog" style={{ marginRight: '8px', color: '#8b5cf6' }}></i>
                    Weekly Engagement & Participation Metrics
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { week: 'Week 1', engagement: 82, questions: 45, participation: 78 },
                    { week: 'Week 2', engagement: 85, questions: 52, participation: 81 },
                    { week: 'Week 3', engagement: 79, questions: 38, participation: 76 },
                    { week: 'Week 4', engagement: 88, questions: 61, participation: 85 },
                    { week: 'Week 5', engagement: 86, questions: 54, participation: 83 },
                    { week: 'Week 6', engagement: 90, questions: 67, participation: 88 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="week" stroke="#6c757d" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} />
                    <Line type="monotone" dataKey="engagement" stroke="#094d88" strokeWidth={3} name="Engagement %" />
                    <Line type="monotone" dataKey="questions" stroke="#10ac8b" strokeWidth={2} name="Questions Asked" />
                    <Line type="monotone" dataKey="participation" stroke="#8b5cf6" strokeWidth={2} name="Participation %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Students Sub-Tab */}
          {analyticsSubTab === 'students' && (
            <>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>High Performers</h4>
                    <i className="fas fa-trophy" style={{ fontSize: '24px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '8px 0' }}>
                    {students.filter(s => (s.attendanceRate || 0) >= 90).length}
                  </h2>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>Students with 90%+ attendance</p>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Need Attention</h4>
                    <i className="fas fa-user-clock" style={{ fontSize: '24px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '8px 0' }}>
                    {students.filter(s => (s.attendanceRate || 0) < 75).length}
                  </h2>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>Students below 75% attendance</p>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Average Performance</h4>
                    <i className="fas fa-chart-line" style={{ fontSize: '24px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '8px 0' }}>
                    {Math.round(students.reduce((sum, s) => sum + (s.attendanceRate || 0), 0) / students.length)}%
                  </h2>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>Class average attendance rate</p>
                </div>
              </div>

              {/* Student Performance Comparison Chart */}
              <div className="dashboard-card" style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#094d88' }}></i>
                    Student Attendance Comparison
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={students.slice(0, 15).map(s => ({ name: s.name.split(' ')[0], attendance: s.attendanceRate }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="name" stroke="#6c757d" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                    <Bar dataKey="attendance" radius={[8, 8, 0, 0]}>
                      {students.slice(0, 15).map((student, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            (student.attendanceRate || 0) >= 90 ? '#10ac8b' :
                            (student.attendanceRate || 0) >= 75 ? '#094d88' :
                            (student.attendanceRate || 0) >= 60 ? '#f59e0b' : '#ef4444'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Student Records */}
              <div className="dashboard-card">
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '8px' }}>
                    <i className="fas fa-users" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                    Detailed Student Records
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
                    Comprehensive view of all students with attendance metrics and risk indicators
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {students.map((student) => (
                    <div
                      key={student.id}
                      style={{
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        borderLeft: `4px solid ${getRiskColor(student.riskLevel || 'low')}`,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${getRiskColor(student.riskLevel || 'low')} 0%, ${getRiskColor(student.riskLevel || 'low')}cc 100%)`,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: '700',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {student.name.charAt(0)}
                        </div>

                        {/* Student Info */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                            {student.name}
                          </h4>
                          <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '12px' }}>
                            <i className="fas fa-id-card" style={{ marginRight: '6px' }}></i>
                            {student.rollNumber}
                          </p>

                          {/* Progress Bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1, height: '10px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${student.attendanceRate}%`,
                                  height: '100%',
                                  background: `linear-gradient(90deg, ${getRiskColor(student.riskLevel || 'low')} 0%, ${getRiskColor(student.riskLevel || 'low')}dd 100%)`,
                                  borderRadius: '10px',
                                  transition: 'width 0.5s ease'
                                }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: getRiskColor(student.riskLevel || 'low'), minWidth: '50px', textAlign: 'right' }}>
                              {student.attendanceRate}%
                            </span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', paddingLeft: '24px', borderLeft: '2px solid #e9ecef' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color: '#10ac8b',
                              marginBottom: '4px',
                              textShadow: '0 2px 4px rgba(16, 172, 139, 0.2)'
                            }}>
                              {student.attended}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Present
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color: '#ef4444',
                              marginBottom: '4px',
                              textShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                            }}>
                              {student.absent}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Absent
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color: '#f59e0b',
                              marginBottom: '4px',
                              textShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
                            }}>
                              {student.late}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Late
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color: '#094d88',
                              marginBottom: '4px',
                              textShadow: '0 2px 4px rgba(9, 77, 136, 0.2)'
                            }}>
                              {student.attended + student.absent + student.late}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Total
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          <div style={{
                            padding: '8px 16px',
                            backgroundColor: getTrendColor(student.trend || 'stable') + '15',
                            border: `2px solid ${getTrendColor(student.trend || 'stable')}30`,
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: getTrendColor(student.trend || 'stable'),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            minWidth: '110px',
                            justifyContent: 'center'
                          }}>
                            <i className={`fas ${getTrendIcon(student.trend || 'stable')}`}></i>
                            {student.trend || 'stable'}
                          </div>

                          <div style={{
                            padding: '8px 16px',
                            backgroundColor: getRiskColor(student.riskLevel || 'low') + '15',
                            border: `2px solid ${getRiskColor(student.riskLevel || 'low')}30`,
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: getRiskColor(student.riskLevel || 'low'),
                            textTransform: 'capitalize',
                            minWidth: '110px',
                            textAlign: 'center'
                          }}>
                            <i className="fas fa-shield-alt" style={{ marginRight: '6px' }}></i>
                            {student.riskLevel || 'low'} Risk
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Alerts Sub-Tab */}
          {analyticsSubTab === 'alerts' && (
            <div className="dashboard-card">
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                  <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                  Proxy Detection Alerts
                </h3>
                <p style={{ fontSize: '14px', color: '#6c757d' }}>
                  AI-powered detection of potential proxy attendance
                </p>
              </div>

              {proxyAlerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10ac8b', marginBottom: '16px' }}></i>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
                    No Proxy Alerts
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
                    All attendance records appear authentic
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {proxyAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        padding: '20px',
                        backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        borderLeft: '4px solid #f59e0b',
                        borderRadius: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-exclamation-triangle"></i>
                        </div>

                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '6px' }}>
                            {alert.studentName} ({alert.rollNumber})
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                            {alert.reason}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6c757d' }}>
                            <span>
                              <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                              {alert.date}
                            </span>
                            <span>
                              <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                              {alert.time}
                            </span>
                            <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                              <i className="fas fa-percentage" style={{ marginRight: '6px' }}></i>
                              {alert.confidence}% Confidence
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#10ac8b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            Verify
                          </button>
                          <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            color: '#6c757d',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interventions Sub-Tab */}
          {analyticsSubTab === 'interventions' && (
            <>
              {/* Intervention Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', margin: 0, opacity: 0.9, fontWeight: '600' }}>Critical Priority</h4>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: '20px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '8px 0' }}>
                    {atRiskStudents.filter(s => s.riskLevel === 'high').length}
                  </h2>
                  <p style={{ fontSize: '12px', margin: 0, opacity: 0.85 }}>Students need immediate action</p>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', margin: 0, opacity: 0.9, fontWeight: '600' }}>Medium Priority</h4>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '20px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '8px 0' }}>
                    {atRiskStudents.filter(s => s.riskLevel === 'medium').length}
                  </h2>
                  <p style={{ fontSize: '12px', margin: 0, opacity: 0.85 }}>Requires monitoring</p>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', margin: 0, opacity: 0.9, fontWeight: '600' }}>Successful</h4>
                    <i className="fas fa-check-circle" style={{ fontSize: '20px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '8px 0' }}>12</h2>
                  <p style={{ fontSize: '12px', margin: 0, opacity: 0.85 }}>Interventions completed</p>
                </div>

                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', margin: 0, opacity: 0.9, fontWeight: '600' }}>Success Rate</h4>
                    <i className="fas fa-chart-line" style={{ fontSize: '20px', opacity: 0.3 }}></i>
                  </div>
                  <h2 style={{ fontSize: '40px', fontWeight: '700', margin: '8px 0' }}>78%</h2>
                  <p style={{ fontSize: '12px', margin: 0, opacity: 0.85 }}>Improvement achieved</p>
                </div>
              </div>

              {/* Intervention Effectiveness Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                      Intervention Effectiveness Over Time
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', success: 65, pending: 35, failed: 10 },
                      { month: 'Feb', success: 72, pending: 28, failed: 8 },
                      { month: 'Mar', success: 78, pending: 22, failed: 6 },
                      { month: 'Apr', success: 75, pending: 25, failed: 7 },
                      { month: 'May', success: 82, pending: 18, failed: 5 },
                      { month: 'Jun', success: 78, pending: 22, failed: 4 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="month" stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6c757d" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef' }} />
                      <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }} />
                      <Line type="monotone" dataKey="success" stroke="#10ac8b" strokeWidth={3} name="Successful %" />
                      <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending %" />
                      <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="dashboard-card">
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529' }}>
                      <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#094d88' }}></i>
                      Action Types
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Parent Contact', value: 35, color: '#094d88' },
                          { name: 'Student Meeting', value: 28, color: '#10ac8b' },
                          { name: 'Improvement Plan', value: 22, color: '#f59e0b' },
                          { name: 'Counseling', value: 15, color: '#8b5cf6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Parent Contact', value: 35, color: '#094d88' },
                          { name: 'Student Meeting', value: 28, color: '#10ac8b' },
                          { name: 'Improvement Plan', value: 22, color: '#f59e0b' },
                          { name: 'Counseling', value: 15, color: '#8b5cf6' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Interventions */}
              <div className="dashboard-card" style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                    <i className="fas fa-hands-helping" style={{ marginRight: '8px', color: '#094d88' }}></i>
                    Recommended Interventions for At-Risk Students
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6c757d' }}>
                    AI-powered recommendations based on attendance patterns and historical data
                  </p>
                </div>

                {atRiskStudents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(16, 172, 139, 0.05) 0%, rgba(16, 172, 139, 0.02) 100%)', borderRadius: '12px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(16, 172, 139, 0.3)'
                    }}>
                      <i className="fas fa-check-circle" style={{ fontSize: '40px', color: 'white' }}></i>
                    </div>
                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '8px' }}>
                      Excellent Work!
                    </h4>
                    <p style={{ fontSize: '15px', color: '#6c757d', marginBottom: '0', maxWidth: '400px', margin: '0 auto' }}>
                      All students are maintaining satisfactory attendance. No interventions needed at this time.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {atRiskStudents.map((student) => (
                      <div
                        key={student.id}
                        style={{
                          padding: '24px',
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          border: '2px solid #e9ecef',
                          borderLeft: `5px solid ${getRiskColor(student.riskLevel!)}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Student Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #f8f9fa' }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${getRiskColor(student.riskLevel!)} 0%, ${getRiskColor(student.riskLevel!)}dd 100%)`,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            fontWeight: '700',
                            boxShadow: `0 4px 12px ${getRiskColor(student.riskLevel!)}40`
                          }}>
                            {student.name.charAt(0)}
                          </div>

                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#212529', marginBottom: '6px' }}>
                              {student.name}
                            </h4>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{
                                padding: '5px 14px',
                                backgroundColor: getRiskColor(student.riskLevel!) + '15',
                                border: `2px solid ${getRiskColor(student.riskLevel!)}30`,
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: getRiskColor(student.riskLevel!),
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                                {student.riskLevel} Risk
                              </span>
                              <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600' }}>
                                <i className="fas fa-id-card" style={{ marginRight: '6px', color: '#094d88' }}></i>
                                {student.rollNumber}
                              </span>
                              <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: '600' }}>
                                <i className="fas fa-percentage" style={{ marginRight: '6px', color: '#10ac8b' }}></i>
                                {student.attendanceRate}% attendance ({student.attended}/{student.totalClasses} classes)
                              </span>
                            </div>
                          </div>

                          <div style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.05) 0%, rgba(16, 172, 139, 0.05) 100%)',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Priority Score
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: getRiskColor(student.riskLevel!) }}>
                              {student.riskLevel === 'high' ? '95' : '68'}
                            </div>
                          </div>
                        </div>

                        {/* Recommended Actions */}
                        <div>
                          <h5 style={{ fontSize: '15px', fontWeight: '700', color: '#212529', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-tasks" style={{ color: '#094d88' }}></i>
                            Recommended Actions
                          </h5>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '16px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '10px',
                              border: '2px solid #e9ecef',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#094d88';
                              e.currentTarget.style.backgroundColor = 'rgba(9, 77, 136, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e9ecef';
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <i className="fas fa-envelope" style={{ color: 'white', fontSize: '16px' }}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', color: '#212529', fontWeight: '600', marginBottom: '4px' }}>
                                  Parent Contact
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                  Send attendance alert
                                </div>
                              </div>
                              <button style={{
                                padding: '8px 18px',
                                background: 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(9, 77, 136, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(9, 77, 136, 0.2)';
                              }}>
                                Send
                              </button>
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '16px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '10px',
                              border: '2px solid #e9ecef',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#10ac8b';
                              e.currentTarget.style.backgroundColor = 'rgba(16, 172, 139, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e9ecef';
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <i className="fas fa-calendar-check" style={{ color: 'white', fontSize: '16px' }}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', color: '#212529', fontWeight: '600', marginBottom: '4px' }}>
                                  Schedule Meeting
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                  One-on-one discussion
                                </div>
                              </div>
                              <button style={{
                                padding: '8px 18px',
                                background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(16, 172, 139, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 172, 139, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 172, 139, 0.2)';
                              }}>
                                Schedule
                              </button>
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '16px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '10px',
                              border: '2px solid #e9ecef',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#f59e0b';
                              e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e9ecef';
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <i className="fas fa-file-alt" style={{ color: 'white', fontSize: '16px' }}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', color: '#212529', fontWeight: '600', marginBottom: '4px' }}>
                                  Improvement Plan
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                  Generate custom plan
                                </div>
                              </div>
                              <button style={{
                                padding: '8px 18px',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                              }}>
                                Generate
                              </button>
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '16px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '10px',
                              border: '2px solid #e9ecef',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#8b5cf6';
                              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e9ecef';
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <i className="fas fa-user-friends" style={{ color: 'white', fontSize: '16px' }}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', color: '#212529', fontWeight: '600', marginBottom: '4px' }}>
                                  Counseling
                                </div>
                                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                  Refer to counselor
                                </div>
                              </div>
                              <button style={{
                                padding: '8px 18px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.2)';
                              }}>
                                Refer
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div style={{
                          marginTop: '20px',
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)',
                          borderRadius: '10px',
                          border: '2px solid rgba(139, 92, 246, 0.1)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <i className="fas fa-brain" style={{ color: 'white', fontSize: '14px' }}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                              <h6 style={{ fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '6px' }}>
                                AI Insights & Recommendations
                              </h6>
                              <p style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.6', marginBottom: '0' }}>
                                Based on attendance patterns, this student shows {student.riskLevel === 'high' ? 'critical decline over the past 3 weeks' : 'inconsistent attendance patterns'}.
                                Recommended priority: {student.riskLevel === 'high' ? 'Immediate parent contact followed by in-person meeting' : 'Schedule check-in meeting within next week'}.
                                Historical data suggests {student.riskLevel === 'high' ? '85% success rate with early intervention' : '92% improvement with consistent monitoring'}.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ClassroomManagement;
