import React from 'react';
import type { Message } from '../../types/types';
import type { RefObject } from 'react';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          <div className="message-content">
            <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};