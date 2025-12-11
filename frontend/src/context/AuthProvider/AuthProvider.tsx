import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext/AuthContext';
import type { User, RegisterData } from '../../types/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const res = await axios.get<User>('http://localhost:5000/api/auth/profile');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error("Token expired or invalid", error);
          logout(); 
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]); 

  const login = async (email: string, password: string) => {
    const res = await axios.post<{ token: string; user: User }>('http://localhost:5000/api/auth/login', { email, password });
    
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    setAuthToken(newToken);
  };

  const register = async (data: RegisterData) => {
    const res = await axios.post<{ token: string; user: User }>('http://localhost:5000/api/auth/register', data);
    
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    setAuthToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};