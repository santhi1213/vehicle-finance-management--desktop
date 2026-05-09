// lib/auth-context.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {  Role } from './types';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://finance-vfm-backend.onrender.com/api';

// API Response Interface
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    isActive: boolean;
    lastLogin: string;
    agentDetails?: {
      employeeId: string;
      department: string;
      joinDate: string;
      commission: string;
      supervisor: string;
    };
    customerDetails?: {
      dateOfBirth: string;
      occupation: string;
      annualIncome: string;
      panCard: string;
      aadharCard: string;
    };
    token: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;  // Add this line to include the phone property
  // ...existing code...
  address: {};
  isActive: boolean;
  lastLogin: string;
  token: string;
  agentDetails?: {
    employeeId: string;
    department: string;
    joinDate: string;
    commission: string;
    supervisor: string;
  };
  customerDetails?: {
    dateOfBirth: string;
    occupation: string;
    annualIncome: string;
    panCard: string;
    aadharCard: string;
  };
}

// Transform API user to app user
const transformApiUser = (apiData: LoginResponse['data']): User => ({
  id: apiData._id,
  name: apiData.name,
  email: apiData.email,
  role: apiData.role as Role,
  phone: apiData.phone,
  address: apiData.address ? {
    street: apiData.address.street,
    city: apiData.address.city,
    state: apiData.address.state,
    pincode: apiData.address.pincode,
    country: apiData.address.country
  } : undefined,
  isActive: apiData.isActive,
  lastLogin: apiData.lastLogin,
  agentDetails: apiData.agentDetails,
  customerDetails: apiData.customerDetails,
  token: apiData.token
});

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (token && storedUser) {
        try {
          // Verify token by fetching user profile or just restore from storage
          // You might want to add a verify token endpoint here
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Optionally verify token with backend
          // await verifyToken(token);
        } catch (error) {
          console.error('Failed to restore authentication:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success && response.data.data) {
        const transformedUser = transformApiUser(response.data.data);
        
        // Store token and user data
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('auth_user', JSON.stringify(transformedUser));
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        
        setUser(transformedUser);
        
        toast.success(`Welcome back, ${transformedUser.name}!`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to login. Please check your credentials.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await axios.post(`${API_BASE_URL}/auth/logout`);
      
      // Clear stored data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Remove axios default header
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local data even if API fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      
      toast.error('Logged out, but there was an issue with the server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}