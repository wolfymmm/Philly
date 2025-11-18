import React, { useState, useRef, useEffect } from "react";
import type { Message } from '../../types/types';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useAssistantResponses } from '../../hooks/useAssistantResponses';
import { responseService } from '../../services/responseService';
import { MessageList } from '../../components/MessageList/MessageList';
import { QuickQuestions } from '../../components/QuickQuestions/QuickQuestions';
import { InputArea } from '../../components/InputArea/InputArea';
import { StatusIndicators } from '../../components/StatusIndicators/StatusIndicators';
import { ListeningOverlay } from '../../components/ListeningOverlay/ListeningOverlay'; // Додаємо новий компонент
import { API_BASE_URL } from '../../types/types';
import './Chat.scss';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! Ask me about your class schedule, tasks, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [showListeningOverlay, setShowListeningOverlay] = useState(false); // Новий state для оверлея
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isSpeaking, speak } = useSpeechSynthesis();
  const { isListening, startListening, stopListening } = useSpeechRecognition(handleVoiceInput);
  const { assistantResponses } = useAssistantResponses();

  // Оновлюємо оверлей при зміні стану прослуховування
  useEffect(() => {
    setShowListeningOverlay(isListening);
  }, [isListening]);

  // Test connection function
  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/responses`);
      if (response.ok) {
        const data = await response.json();
        console.log('Connection successful, responses:', data);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    testConnection();
  }, []);

  // Оновлені функції для керування прослуховуванням
  const handleStartListening = () => {
    setShowListeningOverlay(true);
    startListening();
  };

  const handleStopListening = () => {
    setShowListeningOverlay(false);
    stopListening();
  };

  // Main function to find response
  const findAssistantResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase().trim();

    // Search in database responses
    const dbResponse = await findInDatabaseResponses(input);
    if (dbResponse) return dbResponse;

    return "I'm not sure how to help with that. Try asking about your schedule or tasks!";
  };

  // Search in Responses collection
  const findInDatabaseResponses = async (userInput: string): Promise<string | null> => {
    if (!assistantResponses.length) return null;

    const input = userInput.toLowerCase().trim();

    // Exact match
    const exactMatch = assistantResponses.find(response => 
      response.isActive && response.trigger.toLowerCase() === input
    );
    if (exactMatch) {
      return await responseService.processDynamicResponse(exactMatch.response, exactMatch.trigger);
    }

    // Partial match
    const partialMatch = assistantResponses.find(response => 
      response.isActive && input.includes(response.trigger.toLowerCase())
    );
    if (partialMatch) {
      return await responseService.processDynamicResponse(partialMatch.response, partialMatch.trigger);
    }

    return null;
  };

  // Voice input handler
  async function handleVoiceInput(transcript: string) {
    if (!transcript.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: transcript }]);

    setTimeout(async () => {
      const replyText = await findAssistantResponse(transcript);
      setMessages(prev => [...prev, { sender: "ai", text: replyText }]);
      speak(replyText);
    }, 500);
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");

    setTimeout(async () => {
      const replyText = await findAssistantResponse(input);
      setMessages(prev => [...prev, { sender: "ai", text: replyText }]);
      speak(replyText);
    }, 500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Оверлей для прослуховування */}
      {showListeningOverlay && (
        <ListeningOverlay onClose={handleStopListening} />
      )}
      
      <div className="chat-container">
        <div className="chat-header">
          <h2>Hi! Can I help you today?</h2>
        </div>

        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        <InputArea
          input={input}
          isListening={isListening}
          onInputChange={setInput}
          onSendMessage={sendMessage}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onKeyPress={handleKeyPress}
        />

         <QuickQuestions 
          assistantResponses={assistantResponses} 
          onQuestionClick={handleQuickQuestion} 
        />

        <StatusIndicators isSpeaking={isSpeaking} isListening={isListening} />
      </div>
    </>
  );
};

export default Chat;