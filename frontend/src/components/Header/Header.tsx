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
                    <li><Link to="/about">Хто я?</Link></li>
                    <li><Link to="/shedule">Розклад</Link></li>
                    <li><Link to="/tasks">Завдання</Link></li>
                </ul>
                <div className="button-group-header">
                 <button className="login-button">Увійти</button>
                 <Link to="/chat">
                 <button className="try-button">Спробувати</button>
                 </Link>
                </div>
            </nav>
        </header>
    );
}
export default Header;


