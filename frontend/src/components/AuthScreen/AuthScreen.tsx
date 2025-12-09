import './AuthScreen.scss';

export default function AuthScreen() {
  return (
    <div className="auth-screen-overlay">
      <div className="auth-screen-content">
        <h2>Please authenticate to continue...</h2>
        <p>To access this page, you need to be logged in.</p>
        <div className="auth-screen-buttons">
          <button 
            className="auth-button-primary"
            onClick={() => window.location.hash = '/login'}
          >
            Log In
          </button>
          <button 
            className="auth-button-secondary"
            onClick={() => window.location.hash = '/register'}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}