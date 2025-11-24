import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';

// Shared Components
import Overview from './shared/Overview';

// Teacher Components
import TeacherClasses from './teacher/Classes';
import Assignments from './teacher/Assignments';
import Students from './teacher/Students';
import SmartPlanner from './teacher/SmartPlanner';
import QuestionPaperGenerator from './teacher/QuestionPaperGenerator';
import Flashcards from './teacher/Flashcards';
import OCRCorrection from './teacher/OCRCorrection';
import CareerHeatmap from './teacher/CareerHeatmap';
import ContentLibrary from './teacher/ContentLibrary';
import TeacherDocuPortal from './teacher/DocuPortal';
import BoardExamPredictor from './teacher/BoardExamPredictor';
import ClassroomManagement from './teacher/classroom-management/ClassroomManagement';
import SmartAssessmentSuite from './teacher/assessment/SmartAssessmentSuite';
import DigitalContentCurriculum from './teacher/content-curriculum/DigitalContentCurriculum';
import StudentMentoringDashboard from './teacher/mentoring/StudentMentoringDashboard';
import ProfessionalDevelopmentHub from './teacher/professional-development/ProfessionalDevelopmentHub';

// Student Components
import StudentCalendar from './student/Calendar';
import StudentClasses from './student/Classes';
import PerformanceTracker from './student/PerformanceTracker';
import TasksHomeworks from './student/TasksHomeworks';
import StudyResources from './student/StudyResources';
import Syllabus from './student/Syllabus';
import Tests from './student/Tests';
import Results from './student/Results';
import Skills from './student/Skills';
import PASCO from './student/PASCO';
import Eustad from './student/Eustad';
import AIStudyPlan from './student/AIStudyPlan';
import DocuPortal from './student/DocuPortal';
import CareerReadiness from './student/CareerReadiness';
import CompanyMatcher from './student/CompanyMatcher';
import InterviewCoach from './student/InterviewCoach';
import CareerPathExplorer from './student/CareerPathExplorer';
import ResearchAssistant from './student/ResearchAssistant';
import PersonalizedAcademicCoPilot from './student/PersonalizedAcademicCoPilot';
import InteractiveLearningHub from './student/InteractiveLearningHub';
import SelfServicePortal from './student/SelfServicePortal';
import MentalHealthWellness from './student/MentalHealthWellness';

// Parent Components
import ProgressReports from './parent/ProgressReports';
import PerformanceDashboard from './parent/PerformanceDashboard';
import TeacherFeedback from './parent/TeacherFeedback';
import AttendanceTracker from './parent/AttendanceTracker';
import TransportTracking from './parent/TransportTracking';
import MessageTeachers from './parent/MessageTeachers';
import Announcements from './parent/Announcements';
import PTMScheduler from './parent/PTMScheduler';
import EventCalendar from './parent/EventCalendar';
import FeePayment from './parent/FeePayment';
import Grievance from './parent/Grievance';

// Management Components
import AITimetable from './management/AITimetable';
import CollegeAITimetable from './management/CollegeAITimetable';
import SOPBuilder from './management/SOPBuilder';
import Compliance from './management/Compliance';
import AccreditationDashboard from './management/AccreditationDashboard';
import AcademicCalendarPredictor from './management/AcademicCalendarPredictor';
import DemandPrediction from './management/DemandPrediction';
import ResultsPredictor from './management/ResultsPredictor';
import FeeManagement from './management/FeeManagement';
import StaffManagement from './management/StaffManagement';
import StudentManagement from './management/StudentManagement';
import AdmissionManagement from './management/AdmissionManagement';
import FacultyPerformanceAnalytics from './management/FacultyPerformanceAnalytics';
import StudentRetentionPredictor from './management/StudentRetentionPredictor';
import InstitutionalHealthDashboard from './management/InstitutionalHealthDashboard';

// Admin Components
import ReportGenerator from './admin/ReportGenerator';
import RFIDTracking from './admin/RFIDTracking';
import CCTVMonitoring from './admin/CCTVMonitoring';
import BiometricTracker from './admin/BiometricTracker';
import StationeryWastage from './admin/StationeryWastage';
import Inventory from './admin/Inventory';

type UserRole = 'student' | 'teacher' | 'parent' | 'management' | 'admin';

interface DashboardProps {
  userEmail: string;
  userRole: UserRole;
  onLogout: () => void;
}

interface RoleOption {
  value: UserRole;
  icon: string;
  title: string;
}

const roleOptions: RoleOption[] = [
  { value: 'student', icon: 'fa-graduation-cap', title: 'Student' },
  { value: 'teacher', icon: 'fa-chalkboard-teacher', title: 'Teacher' },
  { value: 'parent', icon: 'fa-users', title: 'Parent' },
  { value: 'management', icon: 'fa-briefcase', title: 'Management' },
  { value: 'admin', icon: 'fa-user-shield', title: 'Admin' }
];

const Dashboard = ({ userEmail, userRole, onLogout }: DashboardProps) => {
  const [activeMenu, setActiveMenu] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>(userRole);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const [hoveredFlyout, setHoveredFlyout] = useState<string | null>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const flyoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleFlyoutEnter = (itemId: string, e: React.MouseEvent<HTMLLIElement>) => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
    setHoveredFlyout(itemId);

    const rect = e.currentTarget.getBoundingClientRect();
    const flyout = e.currentTarget.querySelector('.flyout-menu') as HTMLElement;
    if (flyout) {
      flyout.style.top = `${rect.top}px`;
      flyout.style.left = `${rect.right - 5}px`; // Overlap by 5px to eliminate gap
    }
  };

  const handleFlyoutLeave = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
    flyoutTimeoutRef.current = setTimeout(() => {
      setHoveredFlyout(null);
    }, 500); // Keep visible for 500ms after leaving
  };

  const handleFlyoutMenuEnter = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
  };

  const handleFlyoutMenuLeave = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
    flyoutTimeoutRef.current = setTimeout(() => {
      setHoveredFlyout(null);
    }, 200); // Quick hide when leaving the menu itself
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (flyoutTimeoutRef.current) {
        clearTimeout(flyoutTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentRoleOption = () => {
    return roleOptions.find(r => r.value === currentRole) || roleOptions[0];
  };

  // Role-specific content
  const getRoleContent = () => {
    const roleContent = {
      student: {
        userName: 'Aravind Kumar',
        userTitle: 'B.Tech Computer Science - Year 3',
        userSubtitle: 'MIT College of Engineering',
        greeting: 'Welcome back, Demo User!',
        subtitle: 'Continue your learning journey with personalized resources',
        navigation: [
          {
            section: 'DASHBOARD',
            items: [
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' }
            ]
          },
          {
            section: 'ACADEMICS',
            items: [
              {
                id: 'academic-assistant',
                icon: 'fa-graduation-cap',
                label: 'Academic Assistant',
                subItems: [
                  { id: 'academic-copilot', icon: 'fa-robot', label: 'Personalized Academic Co-Pilot' },
                  { id: 'learning-hub', icon: 'fa-book-open', label: 'Interactive Learning Hub' },
                  { id: 'self-service-portal', icon: 'fa-tachometer-alt', label: 'Self-Service Portal' },
                  { id: 'calendar', icon: 'fa-calendar-alt', label: 'Calendar' },
                  { id: 'classes', icon: 'fa-book-open', label: 'Classes' },
                  { id: 'tasks-homeworks', icon: 'fa-tasks', label: 'Tasks & Homeworks' },
                  { id: 'tests', icon: 'fa-clipboard-check', label: 'Tests' },
                  { id: 'results', icon: 'fa-trophy', label: 'Results' },
                  { id: 'study-resources', icon: 'fa-book-reader', label: 'Study Resources' },
                  { id: 'syllabus', icon: 'fa-file-alt', label: 'Syllabus' },
                  { id: 'docu-portal', icon: 'fa-file-invoice', label: 'DocuPortal' }
                ]
              },
              { id: 'performance-tracker', icon: 'fa-chart-line', label: 'Performance Tracker' }
            ]
          },
          {
            section: 'AI ASSISTANT',
            items: [
              {
                id: 'ai-assistant',
                icon: 'fa-robot',
                label: 'AI Assistant',
                subItems: [
                  { id: 'eustad', icon: 'fa-comments', label: 'eUSTAD' },
                  { id: 'ai-study-plan', icon: 'fa-brain', label: 'AI Study Plan' },
                  { id: 'ai-digital-twin', icon: 'fa-robot', label: 'PASCO' }
                ]
              }
            ]
          },
          {
            section: 'CAREER & PLACEMENTS',
            items: [
              {
                id: 'career-placements',
                icon: 'fa-briefcase',
                label: 'Career & Placements',
                subItems: [
                  { id: 'skills', icon: 'fa-user-graduate', label: 'Skills' },
                  { id: 'career-readiness', icon: 'fa-chart-line', label: 'Career Readiness Score' },
                  { id: 'company-matcher', icon: 'fa-building', label: 'Company Matcher' },
                  { id: 'interview-coach', icon: 'fa-user-graduate', label: 'Interview Coach' },
                  { id: 'career-path-explorer', icon: 'fa-route', label: 'Career Path Explorer' }
                ]
              }
            ]
          },
          {
            section: 'RESEARCH & INNOVATION',
            items: [
              { id: 'research-assistant', icon: 'fa-file-alt', label: 'Research Assistant' }
            ]
          },
          {
            section: 'MENTAL HEALTH & WELLNESS',
            items: [
              { id: 'mental-health-wellness', icon: 'fa-heart', label: 'Mental Health & Wellness' }
            ]
          }
        ],
        stats: [
          { icon: 'fa-bullseye', title: 'Daily Goal', value: '3', total: '/ 4 hours', progress: 75 },
          { icon: 'fa-book', title: 'Tests Today', value: '2', total: '/ 3 tests', progress: 66 },
          { icon: 'fa-trophy', title: 'XP Earned', value: '450', total: '/ 500 XP', progress: 90 }
        ],
        actions: [
          { icon: 'fa-brain', title: 'AI Study Plan', id: 'ai-study-plan' },
          { icon: 'fa-video', title: 'Live Classes', id: 'classes' },
          { icon: 'fa-clipboard-check', title: 'Practice Tests', id: 'tests' },
          { icon: 'fa-robot', title: 'AI Assistant', id: 'eustad' }
        ],
        metrics: [
          { icon: 'fa-book-open', value: '12', label: 'Courses Enrolled', change: '+2' },
          { icon: 'fa-check-circle', value: '8', label: 'Completed', change: '+1' },
          { icon: 'fa-clock', value: '256', label: 'Hours Studied', change: '+12' },
          { icon: 'fa-star', value: '87%', label: 'Avg Score', change: '+5%' }
        ]
      },
      teacher: {
        userName: 'Prof. Sarah Martinez',
        userTitle: 'Mathematics Department',
        userSubtitle: 'Associate Professor - 12 years exp.',
        greeting: 'Good day, Professor!',
        subtitle: 'Manage your courses and track student progress',
        navigation: [
          {
            section: 'DASHBOARD',
            items: [
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' }
            ]
          },
          {
            section: 'CLASSROOM MANAGEMENT',
            items: [
              { id: 'classroom-management', icon: 'fa-chalkboard-teacher', label: 'Classroom Management' }
            ]
          },
          {
            section: 'ASSESSMENT & EVALUATION',
            items: [
              { id: 'assessment-suite', icon: 'fa-clipboard-check', label: 'Smart Assessment Suite' }
            ]
          },
          {
            section: 'CONTENT & CURRICULUM',
            items: [
              { id: 'content-curriculum', icon: 'fa-book-open', label: 'Digital Content & Curriculum' }
            ]
          },
          {
            section: 'STUDENT MENTORING',
            items: [
              { id: 'student-mentoring', icon: 'fa-user-friends', label: 'Mentoring Dashboard' }
            ]
          },
          {
            section: 'PROFESSIONAL DEVELOPMENT',
            items: [
              { id: 'professional-development', icon: 'fa-chart-line', label: 'Professional Development' }
            ]
          }
        ],
        stats: [
          { icon: 'fa-users', title: 'Active Students', value: '142', total: 'students', progress: 100 },
          { icon: 'fa-clipboard-list', title: 'Pending Grading', value: '18', total: 'assignments', progress: 60 },
          { icon: 'fa-calendar-check', title: 'Classes Today', value: '4', total: 'sessions', progress: 50 }
        ],
        actions: [
          { icon: 'fa-chalkboard-teacher', title: 'Classroom Management', id: 'classroom-management' },
          { icon: 'fa-clipboard-check', title: 'Assessment & Evaluation', id: 'assessment-suite' },
          { icon: 'fa-book-open', title: 'Content & Curriculum', id: 'content-curriculum' },
          { icon: 'fa-user-friends', title: 'Student Mentoring', id: 'student-mentoring' },
          { icon: 'fa-chart-line', title: 'Professional Development', id: 'professional-development' }
        ],
        metrics: [
          { icon: 'fa-users-class', value: '6', label: 'Active Classes', change: '+1' },
          { icon: 'fa-clipboard-check', value: '124', label: 'Graded This Week', change: '+24' },
          { icon: 'fa-star', value: '92%', label: 'Class Avg Score', change: '+3%' },
          { icon: 'fa-comment-dots', value: '15', label: 'Pending Messages', change: '+5' }
        ]
      },
      parent: {
        userName: 'Karthik Raj',
        userTitle: 'Guardian of Aravind Kumar',
        userSubtitle: 'B.Tech Computer Science - Year 3',
        greeting: 'Hello, Guardian!',
        subtitle: 'Monitor student\'s academic progress and activities',
        navigation: [
          {
            section: 'DASHBOARD',
            items: [
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' }
            ]
          },
          {
            section: 'ACADEMICS',
            items: [
              { id: 'progress-reports', icon: 'fa-file-alt', label: 'Progress Reports & Report Cards' },
              { id: 'performance-dashboard', icon: 'fa-chart-line', label: 'Live Performance Dashboard' },
              { id: 'teacher-feedback', icon: 'fa-comment-dots', label: 'Teacher Feedback & Comments' }
            ]
          },
          {
            section: 'ATTENDANCE & SAFETY',
            items: [
              { id: 'attendance-tracker', icon: 'fa-calendar-check', label: 'Attendance Tracker' },
              { id: 'transport-tracking', icon: 'fa-bus', label: 'Transport Tracking' }
            ]
          },
          {
            section: 'COMMUNICATION',
            items: [
              { id: 'message-teachers', icon: 'fa-comments', label: 'Message Faculty' },
              { id: 'announcements', icon: 'fa-bullhorn', label: 'College Announcements' },
              { id: 'ptm-scheduler', icon: 'fa-handshake', label: 'Faculty Meeting Scheduler' },
              { id: 'grievance', icon: 'fa-exclamation-circle', label: 'Grievance Portal' }
            ]
          },
          {
            section: 'CAMPUS LIFE',
            items: [
              { id: 'event-calendar', icon: 'fa-calendar-alt', label: 'Event Calendar' }
            ]
          },
          {
            section: 'FINANCIAL',
            items: [
              { id: 'fee-payment', icon: 'fa-credit-card', label: 'Fee Payment Portal' }
            ]
          }
        ],
        stats: [
          { icon: 'fa-user-graduate', title: 'Student Attendance', value: '95%', total: 'this month', progress: 95 },
          { icon: 'fa-chart-line', title: 'Overall Performance', value: '88%', total: 'avg score', progress: 88 },
          { icon: 'fa-calendar-alt', title: 'Upcoming Events', value: '3', total: 'events', progress: 100 }
        ],
        actions: [
          { icon: 'fa-file-alt', title: 'View Report Card' },
          { icon: 'fa-bell', title: 'College Notifications' },
          { icon: 'fa-comment-alt', title: 'Message Faculty' },
          { icon: 'fa-calendar', title: 'Event Calendar' }
        ],
        metrics: [
          { icon: 'fa-book', value: '7', label: 'Active Subjects', change: '' },
          { icon: 'fa-trophy', value: '12', label: 'Achievements', change: '+3' },
          { icon: 'fa-clipboard-list', value: '5', label: 'Pending Assignments', change: '-2' },
          { icon: 'fa-percentage', value: '88%', label: 'Overall Grade', change: '+2%' }
        ]
      },
      management: {
        userName: 'Dr. Robert Williams',
        userTitle: 'Principal',
        userSubtitle: 'MIT College of Engineering',
        greeting: 'Welcome, Principal!',
        subtitle: 'Oversee college operations and academic excellence',
        navigation: [
          {
            section: 'DASHBOARD',
            items: [
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' }
            ]
          },
          {
            section: 'ACADEMICS',
            items: [
              { id: 'student-management', icon: 'fa-user-graduate', label: 'Student Management' },
              { id: 'admission-management', icon: 'fa-user-plus', label: 'Admission Management' }
            ]
          },
          {
            section: 'HUMAN RESOURCES',
            items: [
              { id: 'staff-management', icon: 'fa-users-cog', label: 'Faculty Management' }
            ]
          },
          {
            section: 'OPERATIONS',
            items: [
              { id: 'ai-timetable', icon: 'fa-calendar-check', label: 'AI Timetable' },
              { id: 'sop-builder', icon: 'fa-file-alt', label: 'SOP Builder & Documentation' }
            ]
          },
          {
            section: 'FINANCE',
            items: [
              { id: 'fee-management', icon: 'fa-money-bill-wave', label: 'Fee Management' }
            ]
          },
          {
            section: 'COMPLIANCE',
            items: [
              { id: 'compliance', icon: 'fa-clipboard-check', label: 'Compliance & Regulation' },
              { id: 'accreditation', icon: 'fa-award', label: 'Accreditation Dashboard' },
              { id: 'calendar-predictor', icon: 'fa-calendar-alt', label: 'Academic Calendar Predictor' }
            ]
          },
          {
            section: 'ANALYTICS',
            items: [
              { id: 'institutional-health', icon: 'fa-heartbeat', label: 'Institutional Health Dashboard' },
              { id: 'demand-prediction', icon: 'fa-chart-area', label: 'Enrollment Prediction' },
              { id: 'result-predictor', icon: 'fa-trophy', label: 'Semester Result Predictor' },
              { id: 'faculty-performance-analytics', icon: 'fa-chart-line', label: 'Faculty Performance Analytics' },
              { id: 'student-retention-predictor', icon: 'fa-user-graduate', label: 'Student Retention Predictor' }
            ]
          }
        ],
        stats: [
          { icon: 'fa-university', title: 'Total Students', value: '3,245', total: 'enrolled', progress: 85 },
          { icon: 'fa-chalkboard-teacher', title: 'Active Faculty', value: '168', total: 'professors', progress: 100 },
          { icon: 'fa-chart-line', title: 'College Performance', value: '89%', total: 'avg score', progress: 89 }
        ],
        actions: [
          { icon: 'fa-users-cog', title: 'Faculty Management' },
          { icon: 'fa-chart-pie', title: 'Analytics Dashboard' },
          { icon: 'fa-file-invoice', title: 'Reports' },
          { icon: 'fa-cog', title: 'Settings' }
        ]
      },
      admin: {
        userName: 'System Administrator',
        userTitle: 'Platform Admin',
        userSubtitle: 'EdgeUp Platform',
        greeting: 'Platform Administrator',
        subtitle: 'Manage platform settings and system health',
        navigation: [
          {
            section: 'DASHBOARD',
            items: [
              { id: 'overview', icon: 'fa-th-large', label: 'Overview' }
            ]
          },
          {
            section: 'ANALYTICS',
            items: [
              { id: 'report-generator', icon: 'fa-chart-bar', label: 'Report Generator' }
            ]
          },
          {
            section: 'SECURITY & MONITORING',
            items: [
              { id: 'rfid-tracking', icon: 'fa-bus', label: 'RFID Transport Tracking' },
              { id: 'cctv-monitoring', icon: 'fa-video', label: 'CCTV AI Monitoring' },
              { id: 'biometric-tracker', icon: 'fa-fingerprint', label: 'Biometric Tracker' }
            ]
          },
          {
            section: 'OPERATIONS',
            items: [
              { id: 'waste-alerts', icon: 'fa-recycle', label: 'Stationery Waste Alerts' },
              { id: 'inventory', icon: 'fa-boxes', label: 'Smart Inventory Management' }
            ]
          }
        ],
        stats: [
          { icon: 'fa-university', title: 'Active Colleges', value: '12', total: 'institutions', progress: 100 },
          { icon: 'fa-users', title: 'Total Users', value: '45.8K', total: 'platform-wide', progress: 90 },
          { icon: 'fa-server', title: 'System Health', value: '99%', total: 'uptime', progress: 99 }
        ],
        actions: [
          { icon: 'fa-database', title: 'User Management' },
          { icon: 'fa-cogs', title: 'Platform Settings' },
          { icon: 'fa-chart-area', title: 'System Analytics' },
          { icon: 'fa-shield-alt', title: 'Security' }
        ],
        metrics: [
          { icon: 'fa-university', value: '12', label: 'Active Colleges', change: '+1' },
          { icon: 'fa-users', value: '45.8K', label: 'Platform Users', change: '+1.2K' },
          { icon: 'fa-database', value: '99.2%', label: 'Data Integrity', change: '' },
          { icon: 'fa-server', value: '99.9%', label: 'System Uptime', change: '' }
        ]
      }
    };
    return roleContent[currentRole];
  };

  const content = getRoleContent();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Sidebar Header (Fixed) */}
        <div className="sidebar-header">
          {/* Logo */}
          <div className="sidebar-logo">
            <img src="/Asset 3.png" alt="EdgeUp Logo" />
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <h3>{content.userName}</h3>
              <p>{content.userTitle}</p>
              <small>{content.userSubtitle}</small>
            </div>
          </div>

          {/* Role Selector */}
          <div className="role-selector-wrapper" ref={roleDropdownRef}>
            <div className="role-selector" onClick={toggleRoleDropdown}>
              <i className={`fas ${getCurrentRoleOption().icon}`}></i>
              <span>{getCurrentRoleOption().title}</span>
              <i className={`fas fa-chevron-down ${isRoleDropdownOpen ? 'open' : ''}`}></i>
            </div>

            {isRoleDropdownOpen && (
              <div className="role-selector-dropdown">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`role-option ${currentRole === option.value ? 'active' : ''}`}
                    onClick={() => handleRoleChange(option.value)}
                  >
                    <i className={`fas ${option.icon}`}></i>
                    <span>{option.title}</span>
                    {currentRole === option.value && (
                      <i className="fas fa-check"></i>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="sidebar-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* Navigation Menu (Scrollable) */}
        <nav className="sidebar-nav">
          {content.navigation.map((navSection, sectionIndex) => (
            <div className="nav-section" key={sectionIndex}>
              <span className="nav-section-title">{navSection.section}</span>
              <ul>
                {navSection.items.map((item: any) => (
                  <li
                    key={item.id}
                    className={`${activeMenu === item.id ? 'active' : ''} ${item.subItems ? 'has-flyout' : ''}`}
                    onClick={() => !item.subItems && setActiveMenu(item.id)}
                    onMouseEnter={(e) => {
                      if (item.subItems) {
                        handleFlyoutEnter(item.id, e);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.subItems) {
                        handleFlyoutLeave();
                      }
                    }}
                  >
                    <div className="menu-item-content">
                      <i className={`fas ${item.icon}`}></i>
                      <span>{item.label}</span>
                    </div>
                    {item.subItems && (
                      <i className="fas fa-chevron-right flyout-arrow"></i>
                    )}
                    {item.subItems && (
                      <div
                        className={`flyout-menu ${hoveredFlyout === item.id ? 'visible' : ''}`}
                        onMouseEnter={handleFlyoutMenuEnter}
                        onMouseLeave={handleFlyoutMenuLeave}
                      >
                        <ul className="flyout-items">
                          {item.subItems.map((subItem: any) => (
                            <li
                              key={subItem.id}
                              className={activeMenu === subItem.id ? 'active' : ''}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(subItem.id);
                                setHoveredFlyout(null);
                              }}
                            >
                              <i className={`fas ${subItem.icon}`}></i>
                              <div className="flyout-item-content">
                                <span className="flyout-item-label">{subItem.label}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer (Fixed) */}
        <div className="sidebar-footer">
          {/* Monthly Progress */}
          <div className="monthly-progress">
            <div className="progress-header">
              <span>Monthly Progress</span>
              <span className="progress-percentage">75%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Logout */}
          <button className="logout-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Component Routing Based on Active Menu */}
        {activeMenu === 'overview' && <Overview content={content} onActionClick={setActiveMenu} />}

        {/* Teacher Components */}
        {activeMenu === 'my-classes' && <TeacherClasses />}
        {activeMenu === 'assignments' && <Assignments />}
        {activeMenu === 'students' && <Students />}
        {activeMenu === 'smart-planner' && <SmartPlanner />}
        {activeMenu === 'question-generator' && <QuestionPaperGenerator />}
        {activeMenu === 'flashcards' && <Flashcards />}
        {activeMenu === 'ocr-correction' && <OCRCorrection />}
        {activeMenu === 'content-library' && <ContentLibrary />}
        {activeMenu === 'career-heatmap' && <CareerHeatmap />}
        {activeMenu === 'board-exam-predictor' && <BoardExamPredictor />}
        {activeMenu === 'classroom-management' && <ClassroomManagement />}
        {activeMenu === 'assessment-suite' && <SmartAssessmentSuite />}
        {activeMenu === 'content-curriculum' && <DigitalContentCurriculum />}
        {activeMenu === 'student-mentoring' && <StudentMentoringDashboard />}
        {activeMenu === 'professional-development' && <ProfessionalDevelopmentHub />}
        {activeMenu === 'teacher-docu-portal' && <TeacherDocuPortal />}

        {/* Student Components */}
        {activeMenu === 'calendar' && <StudentCalendar />}
        {activeMenu === 'classes' && <StudentClasses />}
        {activeMenu === 'performance-tracker' && <PerformanceTracker />}
        {activeMenu === 'tasks-homeworks' && <TasksHomeworks />}
        {activeMenu === 'study-resources' && <StudyResources />}
        {activeMenu === 'syllabus' && <Syllabus />}
        {activeMenu === 'docu-portal' && <DocuPortal />}
        {activeMenu === 'tests' && <Tests />}
        {activeMenu === 'results' && <Results />}
        {activeMenu === 'skills' && <Skills />}
        {activeMenu === 'eustad' && <Eustad />}
        {activeMenu === 'ai-study-plan' && <AIStudyPlan />}
        {activeMenu === 'ai-digital-twin' && <PASCO />}
        {activeMenu === 'career-readiness' && <CareerReadiness />}
        {activeMenu === 'company-matcher' && <CompanyMatcher />}
        {activeMenu === 'interview-coach' && <InterviewCoach />}
        {activeMenu === 'career-path-explorer' && <CareerPathExplorer />}
        {activeMenu === 'academic-copilot' && <PersonalizedAcademicCoPilot onBack={() => setActiveMenu('overview')} />}
        {activeMenu === 'learning-hub' && <InteractiveLearningHub onBack={() => setActiveMenu('overview')} />}
        {activeMenu === 'self-service-portal' && <SelfServicePortal onBack={() => setActiveMenu('overview')} />}
        {activeMenu === 'research-assistant' && <ResearchAssistant />}
        {activeMenu === 'mental-health-wellness' && <MentalHealthWellness />}

        {/* Parent Components */}
        {activeMenu === 'progress-reports' && <ProgressReports />}
        {activeMenu === 'performance-dashboard' && <PerformanceDashboard />}
        {activeMenu === 'teacher-feedback' && <TeacherFeedback />}
        {activeMenu === 'attendance-tracker' && <AttendanceTracker />}
        {activeMenu === 'transport-tracking' && <TransportTracking />}
        {activeMenu === 'message-teachers' && <MessageTeachers />}
        {activeMenu === 'announcements' && <Announcements />}
        {activeMenu === 'ptm-scheduler' && <PTMScheduler />}
        {activeMenu === 'event-calendar' && <EventCalendar />}
        {activeMenu === 'fee-payment' && <FeePayment />}
        {activeMenu === 'grievance' && <Grievance />}

        {/* Management Components */}
        {activeMenu === 'student-management' && <StudentManagement />}
        {activeMenu === 'admission-management' && <AdmissionManagement />}
        {activeMenu === 'staff-management' && <StaffManagement />}
        {activeMenu === 'ai-timetable' && <CollegeAITimetable />}
        {activeMenu === 'sop-builder' && <SOPBuilder />}
        {activeMenu === 'fee-management' && <FeeManagement />}
        {activeMenu === 'compliance' && <Compliance />}
        {activeMenu === 'accreditation' && <AccreditationDashboard />}
        {activeMenu === 'calendar-predictor' && <AcademicCalendarPredictor />}
        {activeMenu === 'institutional-health' && <InstitutionalHealthDashboard />}
        {activeMenu === 'demand-prediction' && <DemandPrediction />}
        {activeMenu === 'result-predictor' && <ResultsPredictor />}
        {activeMenu === 'faculty-performance-analytics' && <FacultyPerformanceAnalytics />}
        {activeMenu === 'student-retention-predictor' && <StudentRetentionPredictor />}

        {/* Admin Components */}
        {activeMenu === 'report-generator' && <ReportGenerator />}
        {activeMenu === 'rfid-tracking' && <RFIDTracking />}
        {activeMenu === 'cctv-monitoring' && <CCTVMonitoring />}
        {activeMenu === 'biometric-tracker' && <BiometricTracker />}
        {activeMenu === 'waste-alerts' && <StationeryWastage />}
        {activeMenu === 'inventory' && <Inventory />}
      </main>
    </div>
  );
};

export default Dashboard;
