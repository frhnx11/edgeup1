import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<void>;
  updateProfileCompletion: (userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getProfile(session.user.id).then(profile => {
          setUser({ ...session.user, profile });
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        setUser({ ...session.user, profile });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Special email bypass
      const specialEmail = 'admin@edgeup.ai';
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      if (!data?.user) {
        throw new Error('No user data returned');
      }
      
      // Get user profile after successful login
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to fetch user profile');
      }

      setUser({ ...data.user, profile });
      
      // Store bypass info in localStorage for navigation logic
      if (email === specialEmail) {
        localStorage.setItem('bypassOnboarding', 'true');
      }
      
      return profile; // Return profile for navigation logic
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'admin') => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user data returned');
      }

      // Get user profile after successful signup
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      setUser({ ...data.user, profile });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign up');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to logout');
      throw error;
    }
  };

  const updateProfileCompletion = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_completed: true })
        .eq('id', userId);

      if (error) throw error;

      // Update local user state
      if (user) {
        setUser({
          ...user,
          profile: { ...user.profile, profile_completed: true }
        });
      }
    } catch (error) {
      console.error('Error updating profile completion:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfileCompletion, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}