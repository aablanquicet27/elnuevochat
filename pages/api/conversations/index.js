// pages/api/conversations/index.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function handler(req, res) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getConversations(req, res, supabase, user);
    case 'POST':
      return createConversation(req, res, supabase, user);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todas las conversaciones de un chatbot
async function getConversations(req, res, supabase, user) {
  const { chatbot_id } = req.query;

  if (!chatbot_id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    if (chatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este chatbot' });
    }

    // Obtener las conversaciones del chatbot
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .eq('chatbot_id', chatbot_id)
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      return res.status(400).json({ error: conversationsError.message });
    }

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Crear una nueva conversación
async function createConversation(req, res, supabase, user) {
  const {
    chatbot_id,
    title,
    visitor_id,
    metadata,
  } = req.body;

  // Validar datos requeridos
  if (!chatbot_id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  try {
    // Verificar si el chatbot existe y si el usuario tiene acceso
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('user_id, is_public')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    // Si el chatbot no es público, verificar que el usuario sea el propietario
    if (!chatbot.is_public && chatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para usar este chatbot' });
    }

    // Crear la conversación
    const conversationData = {
      chatbot_id,
      user_id: user.id,
      title: title || 'Nueva conversación',
      visitor_id: visitor_id || null,
      is_active: true,
      metadata: metadata || {},
    };

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert(conversationData)
      .select()
      .single();

    if (conversationError) {
      return res.status(400).json({ error: conversationError.message });
    }

    return res.status(201).json(conversation);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
