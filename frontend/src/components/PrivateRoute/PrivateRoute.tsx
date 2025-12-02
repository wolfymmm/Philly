// src/components/PrivateRoute.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}
