import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import './Header.css';

function Header() {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          <Link to="/">
            <img src="/PhillyLogo.svg" alt="Logo" className="logo" />
          </Link>

          <nav>
            <ul className="nav-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/shedule">Schedule</Link></li>
              <li><Link to="/tasks">Tasks</Link></li>
            </ul>
          </nav>

          <div className="button-group-header">
            {user ? (
              <Link to="/profile">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="header-avatar"
                />
              </Link>
            ) : (
              <Link to="/login">
                <button className="login-button">Login</button>
              </Link>
            )}

            <Link to="/chat">
              <button className="try-button">Try</button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;