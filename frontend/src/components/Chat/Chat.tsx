import React, { useState, useRef, useEffect } from "react";
import type { Message } from '../../types/types';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useAssistantResponses } from '../../hooks/useAssistantResponses';
import responseService from '../../services/responseService';
import { MessageList } from '../../components/MessageList/MessageList';
import { QuickQuestions } from '../../components/QuickQuestions/QuickQuestions';
import { InputArea } from '../../components/InputArea/InputArea';
import { StatusIndicators } from '../../components/StatusIndicators/StatusIndicators';
import { ListeningOverlay } from '../../components/ListeningOverlay/ListeningOverlay';
import { API_BASE_URL } from '../../types/types';
import './Chat.scss';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! Ask me about your class schedule, tasks, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [showListeningOverlay, setShowListeningOverlay] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isSpeaking, speak } = useSpeechSynthesis();
  
  const handleVoiceResult = (transcript: string) => {
    setInput(transcript);
    setTimeout(() => sendMessage(transcript), 100);
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleVoiceResult);
  const { assistantResponses } = useAssistantResponses();

  // Додайте цей useEffect для відладки
  useEffect(() => {
    console.log('🔄 Assistant responses updated:', assistantResponses?.length || 0, 'items');
    if (assistantResponses && assistantResponses.length > 0) {
      console.log('📋 First 3 triggers:', assistantResponses.slice(0, 3).map(r => r.trigger));
      
      // Перевірка чи є наш тригер
      const mondayTriggers = assistantResponses.filter(r => 
        r.trigger.toLowerCase().includes('monday')
      );
      console.log('🔍 Monday triggers found:', mondayTriggers.length);
      mondayTriggers.forEach(t => {
        console.log(`  - "${t.trigger}" -> "${t.response}"`);
      });
    }
  }, [assistantResponses]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setShowListeningOverlay(isListening);
  }, [isListening]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/responses`)
      .then(res => {
        if(res.ok) console.log("✅ Backend connected");
        else console.warn("⚠️ Backend response not OK");
      })
      .catch(err => console.error("❌ Backend connection error:", err));
  }, []);

  const handleStartListening = () => {
    setShowListeningOverlay(true);
    startListening();
  };

  const handleStopListening = () => {
    setShowListeningOverlay(false);
    stopListening();
  };

  const findInDatabaseResponses = async (userInput: string): Promise<string | null> => {
    if (!assistantResponses || assistantResponses.length === 0) {
      console.log('❌ No assistant responses loaded');
      return null;
    }

    const lowerInput = userInput.toLowerCase().trim();
    console.log('🔍 Searching for response for input:', lowerInput);
    console.log(`📊 Have ${assistantResponses.length} responses to search`);

    // 1. Точне співпадіння (повністю однакові)
    const exactMatch = assistantResponses.find(r => 
      r.isActive && r.trigger.toLowerCase() === lowerInput
    );
    if (exactMatch) {
      console.log('✅ Found EXACT match:', exactMatch.trigger);
      console.log('📝 Template:', exactMatch.response);
      return await responseService.processDynamicResponse(exactMatch.response, exactMatch.trigger);
    }

    console.log('🔍 No exact match, checking partial matches...');

    // 2. Введення користувача МІСТИТЬ тригер
    const partialMatches = assistantResponses.filter(r => 
      r.isActive && lowerInput.includes(r.trigger.toLowerCase())
    );

    if (partialMatches.length > 0) {
      // Сортуємо за довжиною тригера (довші тригери - точніші)
      partialMatches.sort((a, b) => b.trigger.length - a.trigger.length);
      const bestMatch = partialMatches[0];
      console.log('✅ Found PARTIAL match (user input contains trigger):', bestMatch.trigger);
      console.log('📝 Template:', bestMatch.response);
      return await responseService.processDynamicResponse(bestMatch.response, bestMatch.trigger);
    }

    console.log('🔍 No partial matches, checking if trigger is in user input...');

    // 3. Тригер МІСТИТЬСЯ у введенні користувача
    const reverseMatches = assistantResponses.filter(r => 
      r.isActive && r.trigger.toLowerCase().includes(lowerInput)
    );

    if (reverseMatches.length > 0) {
      const bestMatch = reverseMatches[0];
      console.log('✅ Found REVERSE match (trigger contains user input):', bestMatch.trigger);
      console.log('📝 Template:', bestMatch.response);
      return await responseService.processDynamicResponse(bestMatch.response, bestMatch.trigger);
    }

    // 4. Спеціальний пошук для "how many classes do i have on monday"
    // Шукаємо тригери, які містять ключові слова
    const keywords = lowerInput.split(' ').filter(word => word.length > 3);
    console.log('🔍 Keywords from input:', keywords);
    
    for (const response of assistantResponses) {
      if (!response.isActive) continue;
      
      const triggerLower = response.trigger.toLowerCase();
      const keywordMatchCount = keywords.filter(keyword => 
        triggerLower.includes(keyword)
      ).length;
      
      if (keywordMatchCount >= 2) { // Якщо знайдено 2+ ключових слова
        console.log(`✅ Found by KEYWORDS (${keywordMatchCount} matches):`, response.trigger);
        console.log('📝 Template:', response.response);
        return await responseService.processDynamicResponse(response.response, response.trigger);
      }
    }

    console.log('❌ No matches found at all');
    return null;
  };

  const findAssistantResponse = async (userInput: string): Promise<string> => {
    console.log('\n🎯 ===== FINDING RESPONSE =====');
    console.log('📝 Original input:', userInput);
    
    // 1. Спершу шукаємо в базі даних
    const dbResponse = await findInDatabaseResponses(userInput);
    if (dbResponse) {
      console.log('✅ Returning database response');
      return dbResponse;
    }

    console.log('🔄 Database search failed, using direct handling');
    
    // 2. Безпосередня обробка "how many classes do i have on monday"
    const lowerInput = userInput.toLowerCase().trim();
    
    if (lowerInput.includes('how many classes') && lowerInput.includes('on')) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of days) {
        if (lowerInput.includes(day)) {
          try {
            console.log(`📅 Directly fetching schedule for ${day}`);
            const scheduleData = await responseService.fetchScheduleForDay(day);
            const classCount = scheduleData.classes?.length || 0;
            return `You have ${classCount} class${classCount === 1 ? '' : 'es'} on ${day}.`;
          } catch (error) {
            console.error('❌ Error in direct handling:', error);
            return "I'm having trouble accessing the schedule right now.";
          }
        }
      }
    }

    // 3. Загальна обробка
    if (lowerInput.includes('classes') || lowerInput.includes('schedule')) {
      if (lowerInput.includes('today')) {
        return await responseService.processDynamicResponse('{schedule_today}', 'today');
      } else if (lowerInput.includes('tomorrow')) {
        return await responseService.processDynamicResponse('{schedule_tomorrow}', 'tomorrow');
      }
    }

    // 4. Fallback
    return "I'm not sure how to answer that. Try asking 'What classes do I have today?' or 'How many tasks do I have?'";
  };

  const sendMessage = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");

    setTimeout(async () => {
      console.log('\n💬 ===== SENDING MESSAGE =====');
      const responseText = await findAssistantResponse(textToSend);
      
      setMessages(prev => [...prev, { sender: "ai", text: responseText }]);
      speak(responseText);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(question), 100);
  };

  return (
    <>
      {showListeningOverlay && (
        <ListeningOverlay onClose={handleStopListening} />
      )}
      
      <div className="chat-container">
        <div className="chat-header">
          <h2>Hi! Can I help you today?</h2>
        </div>

        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        <div className="mouse-gif">
          <img src="/mouse.gif" alt="Assistant" className="mouse-image" />
        </div>

        <InputArea
          input={input}
          isListening={isListening}
          onInputChange={setInput}
          onSendMessage={() => sendMessage()}
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