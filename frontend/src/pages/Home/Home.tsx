import HomeLayout from "../../components/HomeLayout/HomeLayout";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <HomeLayout>
      <div className="home-container">
        <div className="AI-button">Voice Assistant</div>
        <h1>Meet Philly</h1>
        <p>
          Your voice assistant, designed to help you organize your<br />
          learning process and achieve your goals with ease.
        </p>

        <div className="button-group-home">
          <Link to="/chat">
            <button className="begin-chat-button">
              <img src='icon-chat.svg' alt="chat" className="button-icon" />
              Start Chat
            </button>
          </Link>

          <Link to="/about">
            <button className="more-button">More</button>
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}
