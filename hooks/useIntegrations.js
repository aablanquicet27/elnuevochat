// hooks/useIntegrations.js
import { useState } from 'react';
import { integrationAPI } from '../lib/api';

export const useIntegrations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las integraciones de un chatbot
  const getIntegrations = async (chatbotId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await integrationAPI.getIntegrations(chatbotId);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener integraciones';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Obtener una integración específica
  const getIntegration = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await integrationAPI.getIntegration(id);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al obtener la integración';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva integración
  const createIntegration = async (integrationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await integrationAPI.createIntegration(integrationData);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al crear la integración';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una integración existente
  const updateIntegration = async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await integrationAPI.updateIntegration(id, updates);
      
      if (error) {
        setError(error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMsg = 'Error al actualizar la integración';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una integración
  const deleteIntegration = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await integrationAPI.deleteIntegration(id);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      const errorMsg = 'Error al eliminar la integración';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getIntegrations,
    getIntegration,
    createIntegration,
    updateIntegration,
    deleteIntegration
  };
};
