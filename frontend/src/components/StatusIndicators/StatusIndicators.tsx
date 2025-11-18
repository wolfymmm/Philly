import React from 'react';

interface StatusIndicatorsProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ 
  isSpeaking, 
  isListening 
}) => {
  return (
    <div className="status-indicators">
      {isSpeaking && <span>🔊 Speaking</span>}
      {isListening && <span>🎤 Listening</span>}
    </div>
  );
};