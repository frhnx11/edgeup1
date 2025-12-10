import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

// Teacher Components
import Overview from '../../../components/upsc/teacher/Overview';
import StudentAnalytics from '../../../components/upsc/teacher/StudentAnalytics';
import QuestionGenerator from '../../../components/upsc/teacher/QuestionGenerator';
import AnswerCorrection from '../../../components/upsc/teacher/AnswerCorrection';
import ContentLibrary from '../../../components/upsc/teacher/ContentLibrary';
import LessonPlanGenerator from '../../../components/upsc/teacher/LessonPlanGenerator';
import LessonPlanGeneratorNew from '../../../components/upsc/teacher/LessonPlanGeneratorNew';
import CoursePlanGenerator from '../../../components/upsc/teacher/CoursePlanGenerator';
import PlanManagement from '../../../components/upsc/teacher/PlanManagement';
import CreateAssignment from '../../../components/upsc/teacher/CreateAssignment';
// StudentProfile is accessed from StudentAnalytics, not directly
import Collaboration from '../../../components/upsc/teacher/Collaboration';
import Integrations from '../../../components/upsc/teacher/Integrations';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string>('overview');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userData');
    navigate('/');
  };

  // Teacher content configuration
  const content = {
    userName: 'Amit Sharma',
    userTitle: 'UPSC General Studies Faculty',
    userSubtitle: 'Former IAS Officer • 15 years teaching exp.',
    greeting: 'Good day, Amit Sharma!',
    subtitle: 'Manage your batches and track student progress',
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
          { id: 'student-analytics', icon: 'fa-chart-line', label: 'Student Analytics' }
        ]
      },
      {
        section: 'AI TOOLS',
        items: [
          { id: 'question-generation', icon: 'fa-file-signature', label: 'Question Generation' },
          { id: 'answer-correction', icon: 'fa-spell-check', label: 'Answer Correction' }
        ]
      },
      {
        section: 'LESSON PLANNING',
        items: [
          { id: 'lesson-plan', icon: 'fa-chalkboard', label: 'Lesson Planner' },
          { id: 'lesson-plan-new', icon: 'fa-magic', label: 'AI Lesson Planner' },
          { id: 'course-plan', icon: 'fa-graduation-cap', label: 'Course Planner' },
          { id: 'plan-management', icon: 'fa-folder-open', label: 'Manage Plans' }
        ]
      },
      {
        section: 'ASSIGNMENTS',
        items: [
          { id: 'create-assignment', icon: 'fa-tasks', label: 'Create Assignment' }
        ]
      },
      {
        section: 'RESOURCES',
        items: [
          { id: 'digital-library', icon: 'fa-book-open', label: 'Digital Library' }
        ]
      },
      {
        section: 'COLLABORATION',
        items: [
          { id: 'collaboration', icon: 'fa-users', label: 'Collaboration' },
          { id: 'integrations', icon: 'fa-plug', label: 'Integrations' }
        ]
      }
    ],
    stats: [
      { icon: 'fa-users', title: 'Active Students', value: '142', total: 'students', progress: 100 },
      { icon: 'fa-clipboard-list', title: 'Pending Grading', value: '18', total: 'tests', progress: 60 },
      { icon: 'fa-calendar-check', title: 'Batches Today', value: '4', total: '', progress: 50 }
    ],
    actions: [
      { icon: 'fa-chart-line', title: 'Student Analytics', id: 'student-analytics' },
      { icon: 'fa-file-signature', title: 'Generate Questions', id: 'question-generation' },
      { icon: 'fa-spell-check', title: 'Answer Correction', id: 'answer-correction' },
      { icon: 'fa-book-open', title: 'Digital Library', id: 'digital-library' }
    ],
    metrics: [
      { icon: 'fa-users-class', value: '6', label: 'Active Batches', change: '+1' },
      { icon: 'fa-clipboard-check', value: '124', label: 'Graded This Week', change: '+24' },
      { icon: 'fa-star', value: '92%', label: 'Batch Avg Score', change: '+3%' },
      { icon: 'fa-comment-dots', value: '15', label: 'Pending Messages', change: '+5' }
    ]
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Sidebar Header (Fixed) */}
        <div className="sidebar-header">
          {/* Logo */}
          <div className="sidebar-logo">
            <img src="/Logo.png" alt="EdgeUp Logo" />
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

          {/* Role Display */}
          <div className="role-display">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Teacher</span>
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
                {navSection.items.map((item) => (
                  <li
                    key={item.id}
                    className={activeMenu === item.id ? 'active' : ''}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.label}</span>
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
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Component Routing Based on Active Menu */}
        {activeMenu === 'overview' && <Overview content={content} onActionClick={setActiveMenu} />}
        {activeMenu === 'student-analytics' && <StudentAnalytics />}
        {activeMenu === 'question-generation' && <QuestionGenerator />}
        {activeMenu === 'answer-correction' && <AnswerCorrection />}
        {activeMenu === 'lesson-plan' && <LessonPlanGenerator />}
        {activeMenu === 'lesson-plan-new' && <LessonPlanGeneratorNew />}
        {activeMenu === 'course-plan' && <CoursePlanGenerator />}
        {activeMenu === 'plan-management' && <PlanManagement />}
        {activeMenu === 'create-assignment' && <CreateAssignment />}
        {activeMenu === 'digital-library' && <ContentLibrary />}
        {activeMenu === 'collaboration' && <Collaboration />}
        {activeMenu === 'integrations' && <Integrations />}
      </main>
    </div>
  );
};

export default TeacherDashboardPage;
