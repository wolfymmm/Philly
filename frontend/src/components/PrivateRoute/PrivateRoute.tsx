import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import AuthScreen from '../AuthScreen/AuthScreen';

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/register') {
    return token ? <Navigate to="/" /> : children;
  }
  
  if (!token) {
    return <AuthScreen />;
  }
  
  return children;
}