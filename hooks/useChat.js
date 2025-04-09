// hooks/useChat.js
import { useState } from 'react';
import { chatAPI } from '../lib/api';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enviar un mensaje al chatbot
  const sendMessage = async (chatbotId, message, conversationId = null, visitorId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await chatAPI.sendMessage(chatbotId, message, conversationId, visitorId);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al enviar el mensaje';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMessage
  };
};
