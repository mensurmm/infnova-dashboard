// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('infnova_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 💡 FIXED: Changed from '/login' to '/auth/login' to match API docs exactly
      const response = await api.post('/auth/login', { email, password });
      
      const token = response.data.accessToken || response.data.token;
      
      if (token) {
        localStorage.setItem('infnova_token', token);
        setIsAuthenticated(true);
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
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { isAuthenticated, loading, login, logout };
}