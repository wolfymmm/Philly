import React, { useEffect } from 'react';
import './ListeningOverlay.scss';

interface ListeningOverlayProps {
  onClose: () => void;
}

export const ListeningOverlay: React.FC<ListeningOverlayProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="listening-overlay" onClick={onClose}>
      <div className="listening-content" onClick={(e) => e.stopPropagation()}>
        <div className="listening-animation">
          <div className="pulse-circle"></div>
          <div className="pulse-circle delay-1"></div>
          <div className="pulse-circle delay-2"></div>
          <div className="mic-icon">🎤</div>
        </div>
        
        <div className="listening-text">
          <h3>Listening...</h3>
          <p>Speak now. Click anywhere or press ESC to cancel.</p>
        </div>

        <button className="stop-listening-btn" onClick={onClose}>
          Stop Listening
        </button>
      </div>
    </div>
  );
};