import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// UPSC Common Pages
import { LoginPage } from './pages/upsc/common/LoginPage';
import { QuizPage } from './pages/upsc/common/QuizPage';
import { ComingSoonPage } from './pages/upsc/common/ComingSoonPage';
import PersonalityReviewPage from './pages/upsc/common/PersonalityReviewPage';
import PASCOFeaturesPage from './pages/upsc/common/PASCOFeaturesPage';

// UPSC Unified Dashboard
import { SafeDashboard } from './pages/upsc/SafeDashboard';

// UPSC Unified Pages (using social-learner as base - they're all the same)
import StudyPage from './pages/upsc/social-learner/student/StudyPage';
import DevelopmentPage from './pages/upsc/social-learner/student/DevelopmentPage';
import PersonalPage from './pages/upsc/social-learner/student/PersonalPage';

// UPSC Teacher Dashboard
import TeacherDashboardPage from './pages/upsc/teacher/TeacherDashboardPage';


// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { RoleProvider } from './contexts/RoleContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RoleProvider>
          <Routes>
          {/* Root - Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Quiz - After Login */}
          <Route path="/quiz" element={<QuizPage />} />

          {/* Personality Review - After Quiz */}
          <Route path="/upsc/personality-review" element={<PersonalityReviewPage />} />

          {/* UPSC Teacher Dashboard */}
          <Route path="/upsc/teacher/dashboard" element={<TeacherDashboardPage />} />

          {/* Coming Soon - for unsupported features */}
          <Route path="/upsc/coming-soon" element={<ComingSoonPage />} />

          {/* UPSC Unified Student Routes */}
          <Route path="/upsc/student/dashboard" element={<SafeDashboard />} />
          <Route path="/upsc/student/pasco-features" element={<PASCOFeaturesPage />} />
          <Route path="/upsc/student/study" element={<StudyPage />} />
          <Route path="/upsc/student/development" element={<DevelopmentPage />} />
          <Route path="/upsc/student/personal" element={<PersonalPage />} />
          <Route path="/upsc/student/*" element={<SafeDashboard />} />

          {/* Redirects from old student type routes to unified routes */}
          <Route path="/upsc/social-learner/student/*" element={<Navigate to="/upsc/student/dashboard" replace />} />
          <Route path="/upsc/academic-achiever/student/*" element={<Navigate to="/upsc/student/dashboard" replace />} />
          <Route path="/upsc/creative-explorer/student/*" element={<Navigate to="/upsc/student/dashboard" replace />} />

          {/* UPSC catch-all */}
          <Route path="/upsc/*" element={<SafeDashboard />} />

          {/* Fallback - redirect to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
        </RoleProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
