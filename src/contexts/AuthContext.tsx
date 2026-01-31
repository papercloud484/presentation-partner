import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'interview_coach_auth';
const USERS_KEY = 'interview_coach_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const getUsers = (): Record<string, { user: User; password: string }> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveUsers = (users: Record<string, { user: User; password: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];
    
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userRecord.user }));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = getUsers();
    const emailLower = email.toLowerCase();
    
    if (users[emailLower]) {
      return false; // User already exists
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailLower,
      name,
      createdAt: new Date().toISOString(),
    };

    users[emailLower] = { user: newUser, password };
    saveUsers(users);
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser }));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
