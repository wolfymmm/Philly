import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';

// Інтерфейс користувача (має співпадати з бекендом)
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>; // Додав метод реєстрації
  logout: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  user: null,
  setUser: () => {},
  loading: true
});

// Хук для зручного використання контексту
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Функція для налаштування Axios
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 1. Ініціалізація при завантаженні
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          // Перевіряємо, чи токен ще валідний
          const res = await axios.get('http://localhost:5000/api/auth/profile');
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
  }, []);

  // 2. Логін
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
    } catch (err) {
      throw err;
    }
  };

  // 3. Реєстрація
  const register = async (data: any) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', data);
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
    } catch (err) {
      throw err;
    }
  };

  // 4. Логаут
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};