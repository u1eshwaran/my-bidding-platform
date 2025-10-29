
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Mock data for demonstration (would come from backend in real app)
const MOCK_USERS = [
  { id: 's1', name: 'John Seller', email: 'seller@example.com', password: 'password', phoneNumber: '+1234567890', role: 'seller', createdAt: new Date().toISOString() },
  { id: 'b1', name: 'Alice Buyer', email: 'buyer@example.com', password: 'password', phoneNumber: '+1987654321', role: 'buyer', createdAt: new Date().toISOString() },
  { id: 't1', name: 'Tech Expert', email: 'tech@example.com', password: 'password', phoneNumber: '+1555123456', role: 'technician', createdAt: new Date().toISOString() },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for saved auth token/user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(u => u.email === email && u.password === password && u.role === role);
      
      if (!user) {
        throw new Error('Invalid credentials or user role');
      }

      const { password: _, ...userWithoutPassword } = user;
      
      // Save user to localStorage (would use JWT in real app)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword as User,
        isAuthenticated: true,
        loading: false,
      });
      
      toast.success('Login successful!');
    } catch (error) {
      toast.error((error as Error).message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phoneNumber: string, role: UserRole) => {
    // Mock registration (would call API in real app)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `${role[0]}${MOCK_USERS.length + 1}`,
        name,
        email,
        phoneNumber,
        role,
        createdAt: new Date().toISOString()
      };
      
      // In a real app, we'd save this to a database
      MOCK_USERS.push({ ...newUser, password });
      
      // Save to localStorage (would use JWT in real app)
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        loading: false,
      });
      
      toast.success('Registration successful!');
    } catch (error) {
      toast.error((error as Error).message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
