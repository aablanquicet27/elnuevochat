import { createClient } from '@supabase/supabase-js';

// Tipos para TypeScript (opcional)
export type ChatbotType = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  instructions?: string;
  welcome_message?: string;
  avatar_url?: string;
  is_public: boolean;
  primary_color: string;
  model_name: string;
  temperature: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
};

export type SourceType = {
  id: string;
  chatbot_id: string;
  name: string;
  type: 'pdf' | 'url' | 'text';
  content?: string;
  file_url?: string;
  web_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error_message?: string;
  created_at: string;
  updated_at: string;
};

export type ConversationType = {
  id: string;
  chatbot_id: string;
  user_id?: string;
  visitor_id?: string;
  title: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type MessageType = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Record<string, any>[];
  created_at: string;
};

export type PlanType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileType = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan_id?: string;
  plan?: PlanType;
  created_at: string;
  updated_at: string;
};

// Crear un cliente de Supabase con las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están definidas');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funciones de utilidad para interactuar con la base de datos

// Autenticación
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Chatbots
export const createChatbot = async (chatbotData) => {
  const { data, error } = await supabase
    .from('chatbots')
    .insert(chatbotData)
    .select()
    .single();
  return { data, error };
};

export const getChatbots = async (userId) => {
  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getChatbot = async (chatbotId) => {
  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', chatbotId)
    .single();
  return { data, error };
};

export const updateChatbot = async (chatbotId, updates) => {
  const { data, error } = await supabase
    .from('chatbots')
    .update(updates)
    .eq('id', chatbotId)
    .select()
    .single();
  return { data, error };
};

export const deleteChatbot = async (chatbotId) => {
  const { error } = await supabase
    .from('chatbots')
    .delete()
    .eq('id', chatbotId);
  return { error };
};

// Fuentes
export const createSource = async (sourceData) => {
  const { data, error } = await supabase
    .from('sources')
    .insert(sourceData)
    .select()
    .single();
  return { data, error };
};

export const getSources = async (chatbotId) => {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateSource = async (sourceId, updates) => {
  const { data, error } = await supabase
    .from('sources')
    .update(updates)
    .eq('id', sourceId)
    .select()
    .single();
  return { data, error };
};

export const deleteSource = async (sourceId) => {
  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('id', sourceId);
  return { error };
};

// Conversaciones
export const createConversation = async (conversationData) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert(conversationData)
    .select()
    .single();
  return { data, error };
};

export const getConversations = async (chatbotId, userId) => {
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('updated_at', { ascending: false });
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getConversation = async (conversationId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();
  return { data, error };
};

export const updateConversation = async (conversationId, updates) => {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .select()
    .single();
  return { data, error };
};

// Mensajes
export const createMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  return { data, error };
};

export const getMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return { data, error };
};

// Planes
export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });
  return { data, error };
};

export const getPlan = async (planId) => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .single();
  return { data, error };
};

// Perfil de usuario
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, plans(*)')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Integraciones
export const createIntegration = async (integrationData) => {
  const { data, error } = await supabase
    .from('integrations')
    .insert(integrationData)
    .select()
    .single();
  return { data, error };
};

export const getIntegrations = async (chatbotId) => {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateIntegration = async (integrationId, updates) => {
  const { data, error } = await supabase
    .from('integrations')
    .update(updates)
    .eq('id', integrationId)
    .select()
    .single();
  return { data, error };
};

export const deleteIntegration = async (integrationId) => {
  const { error } = await supabase
    .from('integrations')
    .delete()
    .eq('id', integrationId);
  return { error };
};

// Estadísticas de uso
export const getUserUsageStats = async (userId) => {
  const { data, error } = await supabase
    .from('usage_stats')
    .select('*')
    .eq('user_id', userId)
    .order('period_start', { ascending: false });
  return { data, error };
};

export const getChatbotUsageStats = async (chatbotId) => {
  const { data, error } = await supabase
    .from('usage_stats')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('period_start', { ascending: false });
  return { data, error };
};

export const updateUsageStats = async (statsId, updates) => {
  const { data, error } = await supabase
    .from('usage_stats')
    .update(updates)
    .eq('id', statsId)
    .select()
    .single();
  return { data, error };
};

// Leads
export const getLeads = async (chatbotId) => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createLead = async (leadData) => {
  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single();
  return { data, error };
};
