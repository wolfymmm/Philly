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
          Your voice assistant for learning and productivity
        </p>
      </div>

      {/* Mission Statement */}
      <div className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to help students unlock their full potential by turning organizational chaos into structured success.
        </p>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Organization</h3>
          <p>
            Centralize your academic life and track deadlines with ease.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏰</div>
          <h3>Reminders</h3>
          <p>
            Easily log your assignment deadlines and never miss a due date.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">☺️</div>
          <h3>Supportive atmosphere</h3>
          <p>
            A supportive study companion that makes your academic routine feel less like a chore.
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
            <p>Keep all your due dates in one simple view.</p>
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
          Join students who are achieving more with Philly.
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