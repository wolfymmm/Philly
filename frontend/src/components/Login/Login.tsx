import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import './Login.scss';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Невірні облікові дані');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <p>Please enter your details.</p>

      <div className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="Enter your e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleEnterKey}
          disabled={isLoading}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleEnterKey}
          disabled={isLoading}
        />

        <button 
          className="login-button-huge" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Loggining in...' : 'Log In'}
        </button>

        {error && <p className="login-error">{error}</p>}

        <div className="login-links">
          <span>Don't have an account? <Link to="/register">Register here</Link></span>
        </div>
      </div>
    </div>
  );
}