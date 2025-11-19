import React from 'react';
import type { AssistantResponse } from '../../types/types';

interface QuickQuestionsProps {
  assistantResponses: AssistantResponse[];
  onQuestionClick: (question: string) => void;
}

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ 
  assistantResponses, 
  onQuestionClick 
}) => {
  const getQuickQuestions = () => {
    return assistantResponses
      .filter(response => response.isActive)
      .slice(0, 3)
      .map(response => response.trigger);
  };

  return (
    <div className="quick-questions">
      {getQuickQuestions().map((question, index) => (
        <button key={index} onClick={() => onQuestionClick(question)}>
          {question}
        </button>
      ))}
    </div>
  );
};