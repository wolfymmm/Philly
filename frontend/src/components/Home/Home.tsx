import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="home-container">
        <div className="AI-button">AI Assistant</div>
        <h1>Зустрічай Philly</h1>
        <p>Твій розумний  ШІ-помічник, створений, щоб допомагати з організацією <br></br> навчального процесу та досягати цілей з легкістю.</p>
        <div className="button-group-home">
        <Link to="/chat">
        <button className="begin-chat-button"> 
            <img src="../public/icon-chat.svg" alt="chat" className="button-icon" />
            Почати Чат</button></Link>
        <Link to="/about">
        <button className="more-button">Більше</button>
        </Link>
        </div>
        </div>
    );
};
export default Header;