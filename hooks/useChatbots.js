// hooks/useChatbots.js
import { useState } from 'react';
import { chatbotAPI } from '../lib/api';

export const useChatbots = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los chatbots
  const getChatbots = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await chatbotAPI.getChatbots();
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener chatbots';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Obtener un chatbot específico
  const getChatbot = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await chatbotAPI.getChatbot(id);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener el chatbot';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo chatbot
  const createChatbot = async (chatbotData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await chatbotAPI.createChatbot(chatbotData);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al crear el chatbot';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un chatbot existente
  const updateChatbot = async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await chatbotAPI.updateChatbot(id, updates);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al actualizar el chatbot';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un chatbot
  const deleteChatbot = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await chatbotAPI.deleteChatbot(id);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      const errorMsg = 'Error al eliminar el chatbot';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getChatbots,
    getChatbot,
    createChatbot,
    updateChatbot,
    deleteChatbot
  };
};
