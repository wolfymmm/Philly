import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import AuthScreen from '../AuthScreen/AuthScreen';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  
  // Якщо користувач на сторінці логіну - не показуємо AuthScreen
  if (location.pathname === '/login' || location.pathname === '/register') {
    return token ? <Navigate to="/" /> : children;
  }
  
  // Якщо немає токена - показуємо AuthScreen замість редіректу
  if (!token) {
    return <AuthScreen />;
  }
  
  // Якщо є токен - показуємо контент
  return children;
}