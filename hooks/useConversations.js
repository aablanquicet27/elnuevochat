// hooks/useConversations.js
import { useState } from 'react';
import { conversationAPI } from '../lib/api';

export const useConversations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las conversaciones de un chatbot
  const getConversations = async (chatbotId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await conversationAPI.getConversations(chatbotId);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener conversaciones';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Obtener una conversación específica
  const getConversation = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await conversationAPI.getConversation(id);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener la conversación';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva conversación
  const createConversation = async (conversationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await conversationAPI.createConversation(conversationData);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al crear la conversación';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una conversación existente
  const updateConversation = async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await conversationAPI.updateConversation(id, updates);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al actualizar la conversación';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una conversación
  const deleteConversation = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await conversationAPI.deleteConversation(id);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      const errorMsg = 'Error al eliminar la conversación';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getConversations,
    getConversation,
    createConversation,
    updateConversation,
    deleteConversation
  };
};
