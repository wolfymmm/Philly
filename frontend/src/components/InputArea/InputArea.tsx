import React from 'react';

interface InputAreaProps {
  input: string;
  isListening: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  input,
  isListening,
  onInputChange,
  onSendMessage,
  onStartListening,
  onStopListening,
  onKeyPress
}) => {
  return (
    <div className="input-container">
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask about your schedule or tasks..."
        rows={2}
      />
      <div className="button-group">
        <button 
          onClick={isListening ? onStopListening : onStartListening}
          className={`voice-button ${isListening ? 'listening' : ''}`}
        >
          {isListening ? '🛑 Stop' : '🎤 Voice'}
        </button>
        <button onClick={onSendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};