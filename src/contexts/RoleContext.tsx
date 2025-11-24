import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'student' | 'admin';

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    const isAdmin = localStorage.getItem('isAdmin');
    // Check both userRole and isAdmin flags
    if (isAdmin === 'true') return 'admin';
    return (savedRole as UserRole) || 'student';
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userRole', currentRole);
    // Set isAdmin flag for ProtectedRoute
    if (currentRole === 'admin') {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }
  }, [currentRole]);

  const setRole = (role: UserRole) => {
    console.log('RoleContext: Setting role to', role);
    console.log('RoleContext: Before - isAdmin:', localStorage.getItem('isAdmin'), 'isLoggedIn:', localStorage.getItem('isLoggedIn'));

    setCurrentRole(role);
    // Set localStorage immediately before navigation to avoid race condition
    localStorage.setItem('userRole', role);
    // Ensure isLoggedIn persists
    localStorage.setItem('isLoggedIn', 'true');

    if (role === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      console.log('RoleContext: After - isAdmin:', localStorage.getItem('isAdmin'), 'isLoggedIn:', localStorage.getItem('isLoggedIn'));
      console.log('RoleContext: Navigating to /admin/dashboard');
      navigate('/admin/dashboard');
    } else {
      localStorage.removeItem('isAdmin');
      console.log('RoleContext: After - isAdmin removed, isLoggedIn:', localStorage.getItem('isLoggedIn'));
      console.log('RoleContext: Navigating to /dashboard');
      navigate('/dashboard');
    }
  };

  const toggleRole = () => {
    const newRole = currentRole === 'student' ? 'admin' : 'student';
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
