import React, { useMemo } from 'react';
import type { AssistantResponse } from '../../types/chat'; 

interface QuickQuestionsProps {
  assistantResponses: AssistantResponse[];
  onQuestionClick: (question: string) => void;
}

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ 
  assistantResponses, 
  onQuestionClick 
}) => {

  const randomQuestions = useMemo(() => {
    if (!assistantResponses || assistantResponses.length === 0) {
      return ["What classes do I have?", "Show my tasks", "What time is it?"];
    }
    const allTriggers = assistantResponses
      .filter(r => r.isActive && r.trigger.length > 2) 
      .map(r => r.trigger);

    const shuffled = [...allTriggers].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 3);
  }, [assistantResponses]);

  return (
    <div className="quick-questions">
      {randomQuestions.map((question) => (
        <button 
          key={question} 
          onClick={() => onQuestionClick(question)}
          className="quick-question-btn"
        >
          {question}
        </button>
      ))}
    </div>
  );
};