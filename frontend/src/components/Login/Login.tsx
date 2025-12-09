import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 👇 Затримка тільки для появи форми
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 2000); // 2 секунди тільки перед рендером форми

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      // ❗ Ніяких затримок тут — викликається одразу!
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-container">

      {/* Перший екран ДО появи форми */}
      {!showForm && (
        <div className="login-wait-screen">
          <h2>Будь ласка, авторизуйтеся, щоб продовжити…</h2>
          <p>Завантаження форми...</p>
        </div>
      )}

      {/* Форма зʼявляється без затримки при login */}
      {showForm && (
        <>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleEnterKey}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleEnterKey}
          />

          <button onClick={handleLogin}>Login</button>

          {error && <p className="login-error">{error}</p>}
        </>
      )}
    </div>
  );
}
