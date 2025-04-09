// hooks/useMessages.js
import { useState } from 'react';
import { messageAPI } from '../lib/api';

export const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los mensajes de una conversación
  const getMessages = async (conversationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await messageAPI.getMessages(conversationId);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener mensajes';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo mensaje
  const createMessage = async (messageData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await messageAPI.createMessage(messageData);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al crear el mensaje';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMessages,
    createMessage
  };
};
