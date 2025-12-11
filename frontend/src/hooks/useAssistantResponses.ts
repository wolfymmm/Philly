import { useState, useEffect } from 'react';
import type { AssistantResponse } from '../types/chat';
import { API_BASE_URL } from '../types/chat';

export const useAssistantResponses = () => {
  const [assistantResponses, setAssistantResponses] = useState<AssistantResponse[]>([]);

  const loadAssistantResponses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/responses`);
      if (response.ok) {
        const data = await response.json();
        setAssistantResponses(data);
      }
    } catch (error) {
      console.error("Error loading responses:", error);
    }
  };

  useEffect(() => {
    loadAssistantResponses();
  }, []);

  return { assistantResponses, loadAssistantResponses };
};