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
  <div className="textarea-wrapper">
    <textarea
      value={input}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder="Ask about your schedule or tasks..."
      rows={2}
    />

    <div className="icon-buttons">

      {/* Відправка */}
      <button 
        onClick={onSendMessage} 
        disabled={!input.trim()}
        className="icon-btn send-btn"
      >
        <img src="/send.svg" alt="send" />
      </button>
      
      {/* Мікрофон */}
      <button 
        onClick={isListening ? onStopListening : onStartListening}
        className={`icon-btn mic-btn ${isListening ? "listening" : ""}`}
      >
        <img src="/micro.svg" alt="mic" />
      </button>
    </div>
  </div>
</div>

  );
};