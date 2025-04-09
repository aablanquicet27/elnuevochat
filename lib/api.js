// lib/api.js
import axios from 'axios';

// Configuración base para axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Funciones de autenticación
export const authAPI = {
  signUp: async (email, password, fullName) => {
    try {
      const response = await api.post('/auth/signup', { email, password, fullName });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al registrarse' };
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al iniciar sesión' };
    }
  },

  signOut: async () => {
    try {
      const response = await api.post('/auth/signout');
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.error || 'Error al cerrar sesión' };
    }
  },
};

// Funciones para chatbots
export const chatbotAPI = {
  getChatbots: async () => {
    try {
      const response = await api.get('/chatbots');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener chatbots' };
    }
  },

  getChatbot: async (id) => {
    try {
      const response = await api.get(`/chatbots/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener chatbot' };
    }
  },

  createChatbot: async (chatbotData) => {
    try {
      const response = await api.post('/chatbots', chatbotData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al crear chatbot' };
    }
  },

  updateChatbot: async (id, updates) => {
    try {
      const response = await api.put(`/chatbots/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al actualizar chatbot' };
    }
  },

  deleteChatbot: async (id) => {
    try {
      const response = await api.delete(`/chatbots/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.error || 'Error al eliminar chatbot' };
    }
  },
};

// Funciones para fuentes de datos
export const sourceAPI = {
  getSources: async (chatbotId) => {
    try {
      const response = await api.get(`/sources?chatbot_id=${chatbotId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener fuentes' };
    }
  },

  getSource: async (id) => {
    try {
      const response = await api.get(`/sources/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener fuente' };
    }
  },

  createSource: async (sourceData) => {
    try {
      const response = await api.post('/sources', sourceData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al crear fuente' };
    }
  },

  updateSource: async (id, updates) => {
    try {
      const response = await api.put(`/sources/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al actualizar fuente' };
    }
  },

  deleteSource: async (id) => {
    try {
      const response = await api.delete(`/sources/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.error || 'Error al eliminar fuente' };
    }
  },
};

// Funciones para conversaciones
export const conversationAPI = {
  getConversations: async (chatbotId) => {
    try {
      const response = await api.get(`/conversations?chatbot_id=${chatbotId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener conversaciones' };
    }
  },

  getConversation: async (id) => {
    try {
      const response = await api.get(`/conversations/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener conversación' };
    }
  },

  createConversation: async (conversationData) => {
    try {
      const response = await api.post('/conversations', conversationData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al crear conversación' };
    }
  },

  updateConversation: async (id, updates) => {
    try {
      const response = await api.put(`/conversations/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al actualizar conversación' };
    }
  },

  deleteConversation: async (id) => {
    try {
      const response = await api.delete(`/conversations/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.error || 'Error al eliminar conversación' };
    }
  },
};

// Funciones para mensajes
export const messageAPI = {
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/messages?conversation_id=${conversationId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener mensajes' };
    }
  },

  createMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al crear mensaje' };
    }
  },
};

// Funciones para integraciones
export const integrationAPI = {
  getIntegrations: async (chatbotId) => {
    try {
      const response = await api.get(`/integrations?chatbot_id=${chatbotId}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener integraciones' };
    }
  },

  getIntegration: async (id) => {
    try {
      const response = await api.get(`/integrations/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al obtener integración' };
    }
  },

  createIntegration: async (integrationData) => {
    try {
      const response = await api.post('/integrations', integrationData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al crear integración' };
    }
  },

  updateIntegration: async (id, updates) => {
    try {
      const response = await api.put(`/integrations/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al actualizar integración' };
    }
  },

  deleteIntegration: async (id) => {
    try {
      const response = await api.delete(`/integrations/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data?.error || 'Error al eliminar integración' };
    }
  },
};

// Función para el chat
export const chatAPI = {
  sendMessage: async (chatbotId, message, conversationId = null, visitorId = null) => {
    try {
      const response = await api.post('/chat', {
        chatbotId,
        message,
        conversationId,
        visitorId,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Error al enviar mensaje' };
    }
  },
};
