import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';

function About() {
  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <h1>About Philly</h1>
        <p className="about-subtitle">
          Your intelligent assistant for learning and productivity
        </p>
      </div>

      {/* Mission Statement */}
      <div className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Philly helps students and professionals organize their work, stay on schedule, 
          and achieve their goals with smart AI-powered assistance.
        </p>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Smart Organization</h3>
          <p>
            Keep tasks and deadlines organized in one place with intelligent prioritization.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Smart Reminders</h3>
          <p>
            Timely reminders for assignments and meetings that adapt to your schedule.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Assistance</h3>
          <p>
            Personalized recommendations and productivity tips powered by AI technology.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Sign Up</h4>
            <p>Create your account and set up your profile.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Add Tasks</h4>
            <p>Input your assignments, projects, and schedule.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Get Assisted</h4>
            <p>Receive reminders and insights as you work.</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <h4>Achieve More</h4>
            <p>Stay organized and productive with Philly's help.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>
          Join students and professionals who are achieving more with Philly.
        </p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary">
            Start Free
          </Link>
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;