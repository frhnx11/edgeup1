import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
}

export function ProtectedRoute({ children, requireTeacher = false }: ProtectedRouteProps) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const isTeacher = localStorage.getItem('isAdmin'); // Using same storage key for now, rename later if needed
  const hasCompletedGoals = localStorage.getItem('goalData');
  const bypassOnboarding = localStorage.getItem('bypassOnboarding');

  console.log('ProtectedRoute check:', {
    requireTeacher,
    isLoggedIn,
    isTeacher,
    hasCompletedGoals,
    bypassOnboarding
  });

  if (requireTeacher && !isTeacher) {
    console.log('ProtectedRoute: Redirecting to login - requireTeacher but no isTeacher');
    return <Navigate to="/login" replace />;
  }

  if (!isLoggedIn && !isTeacher) {
    console.log('ProtectedRoute: Redirecting to login - not logged in and not teacher');
    return <Navigate to="/login" replace />;
  }

  if (!requireTeacher && !hasCompletedGoals && !isTeacher && !bypassOnboarding) {
    console.log('ProtectedRoute: Redirecting to goals - onboarding not complete');
    return <Navigate to="/goals" replace />;
  }

  console.log('ProtectedRoute: Allowing access');
  return <>{children}</>;
}