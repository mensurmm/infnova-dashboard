// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';

export interface User {
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Default fallback admin profile
  const defaultUser: User = {
    name: 'Administrator',
    email: 'admin@infnova.tech',
    role: 'System Admin',
  };

  useEffect(() => {
    const token = localStorage.getItem('infnova_token');
    const storedUser = localStorage.getItem('infnova_user');

    if (token) {
      setIsAuthenticated(true);
      setUser(storedUser ? JSON.parse(storedUser) : defaultUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const token = response.data.accessToken || response.data.token;
      
      if (token) {
        // Construct user profile from response or login credentials
        const userData: User = response.data.user || {
          name: email.split('@')[0] || 'Administrator',
          email: email,
          role: 'System Admin',
        };

        localStorage.setItem('infnova_token', token);
        localStorage.setItem('infnova_user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        router.push('/');
        return { success: true };
      }
      return { success: false, error: 'Authorization token missing from server response.' };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Invalid email or password.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('infnova_token');
    localStorage.removeItem('infnova_user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return { isAuthenticated, user, loading, login, logout };
}