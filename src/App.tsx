import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// UPSC Common Pages
import { LoginPage } from './pages/upsc/common/LoginPage';
import { GoalSettingPage } from './pages/upsc/common/GoalSettingPage';

// College Dashboard
import CollegeDashboard from './components/college/Dashboard';

// UPSC Dashboards
import { SafeDashboard as UPSCSocialLearnerDashboard } from './pages/upsc/SafeDashboard';
import { SafeDashboard as UPSCAcademicAchieverDashboard } from './pages/upsc/SafeDashboard';

// UPSC Social Learner Pages
import StudyPage from './pages/upsc/social-learner/student/StudyPage';
import DevelopmentPage from './pages/upsc/social-learner/student/DevelopmentPage';
import PersonalPage from './pages/upsc/social-learner/student/PersonalPage';
import SocialLearnerPage from './pages/upsc/social-learner/student/SocialLearnerPage';

// UPSC Academic Achiever Pages
import AcademicStudyPage from './pages/upsc/academic-achiever/student/StudyPage';
import AcademicDevelopmentPage from './pages/upsc/academic-achiever/student/DevelopmentPage';
import AcademicPersonalPage from './pages/upsc/academic-achiever/student/PersonalPage';
import AcademicAchieverPage from './pages/upsc/academic-achiever/student/AcademicAchieverPage';

// School Pages (Classes as entry point based on GoalSettingPage routing)
import SchoolSocialLearnerClasses from './pages/school/social-learner/student/Classes';
import SchoolAcademicAchieverClasses from './pages/school/academic-achiever/student/Classes';

// Contexts
import { SkillsProvider } from './contexts/SkillsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoleProvider } from './contexts/RoleContext';

type UserRole = 'student' | 'teacher' | 'parent' | 'management' | 'admin';

// College Dashboard Wrapper to handle role-based routing
function CollegeDashboardWrapper() {
  const { learnerType } = useParams<{ learnerType: string }>();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');

  useEffect(() => {
    // Get user info from localStorage or URL params
    const email = localStorage.getItem('userEmail') || 'student@edgeup.com';
    const role = (localStorage.getItem('userRole') || 'student') as UserRole;
    setUserEmail(email);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userStage');
    localStorage.removeItem('userStudentType');
    navigate('/');
  };

  return (
    <SkillsProvider>
      <CollegeDashboard
        userEmail={userEmail}
        userRole={userRole}
        onLogout={handleLogout}
      />
    </SkillsProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RoleProvider>
          <Routes>
          {/* Root - UPSC Login */}
          <Route path="/" element={<LoginPage />} />

          {/* UPSC Goal Setting (Stage & Student Type Selection) */}
          <Route path="/goals" element={<GoalSettingPage />} />

          {/* School Routes */}
          <Route path="/school/social-learner/student/classes" element={<SchoolSocialLearnerClasses />} />
          <Route path="/school/academic-achiever/student/classes" element={<SchoolAcademicAchieverClasses />} />

          {/* College Routes - Using Dashboard Component */}
          <Route path="/college/:learnerType/student/dashboard" element={<CollegeDashboardWrapper />} />
          <Route path="/college/:learnerType/teacher/dashboard" element={<CollegeDashboardWrapper />} />
          <Route path="/college/:learnerType/parent/dashboard" element={<CollegeDashboardWrapper />} />
          <Route path="/college/:learnerType/management/dashboard" element={<CollegeDashboardWrapper />} />
          <Route path="/college/:learnerType/admin/dashboard" element={<CollegeDashboardWrapper />} />

          {/* UPSC Social Learner Routes */}
          <Route path="/upsc/social-learner/student/dashboard" element={<UPSCSocialLearnerDashboard />} />
          <Route path="/upsc/social-learner/student/social-learner" element={<SocialLearnerPage />} />
          <Route path="/upsc/social-learner/student/study" element={<StudyPage />} />
          <Route path="/upsc/social-learner/student/development" element={<DevelopmentPage />} />
          <Route path="/upsc/social-learner/student/personal" element={<PersonalPage />} />

          {/* UPSC Academic Achiever Routes */}
          <Route path="/upsc/academic-achiever/student/dashboard" element={<UPSCAcademicAchieverDashboard />} />
          <Route path="/upsc/academic-achiever/student/academic-achiever" element={<AcademicAchieverPage />} />
          <Route path="/upsc/academic-achiever/student/study" element={<AcademicStudyPage />} />
          <Route path="/upsc/academic-achiever/student/development" element={<AcademicDevelopmentPage />} />
          <Route path="/upsc/academic-achiever/student/personal" element={<AcademicPersonalPage />} />

          {/* UPSC Catch-all routes - other UPSC pages go to dashboard */}
          <Route path="/upsc/social-learner/student/*" element={<UPSCSocialLearnerDashboard />} />
          <Route path="/upsc/academic-achiever/student/*" element={<UPSCAcademicAchieverDashboard />} />
          <Route path="/upsc/*" element={<UPSCSocialLearnerDashboard />} />

          {/* Fallback - redirect to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
        </RoleProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
