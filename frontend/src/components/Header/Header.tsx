import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <Link to="/">
            <img src="./public/PhillyLogo.svg" alt="Logo" className="logo" />
            </Link>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/shedule">Schedule</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                </ul>
                <div className="button-group-header">
                 <Link to="/login">
                 <button className="login-button">Log In</button>
                 </Link>
                 <Link to="/chat">
                 <button className="try-button">Try</button>
                 </Link>
                </div>
            </nav>
        </header>
    );
}
export default Header;


