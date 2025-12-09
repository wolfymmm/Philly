// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>; // Додано сюди
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: () => {},
  user: null,
  setUser: () => {}, // І тут
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Завантаження токена з localStorage при старті
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios
        .get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);

    // Отримуємо дані користувача
    const profile = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
