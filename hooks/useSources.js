// hooks/useSources.js
import { useState } from 'react';
import { sourceAPI } from '../lib/api';

export const useSources = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las fuentes de un chatbot
  const getSources = async (chatbotId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await sourceAPI.getSources(chatbotId);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener fuentes';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Obtener una fuente específica
  const getSource = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await sourceAPI.getSource(id);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener la fuente';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva fuente
  const createSource = async (sourceData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await sourceAPI.createSource(sourceData);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al crear la fuente';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una fuente existente
  const updateSource = async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await sourceAPI.updateSource(id, updates);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al actualizar la fuente';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una fuente
  const deleteSource = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await sourceAPI.deleteSource(id);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      const errorMsg = 'Error al eliminar la fuente';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSources,
    getSource,
    createSource,
    updateSource,
    deleteSource
  };
};
